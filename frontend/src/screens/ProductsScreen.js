import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, Image,
  StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import { usePaginatedProducts, useCategories } from '../hooks/useApi';
import { normalizeProduct, normalizeCategory, getProductImageUrl } from '../models/product';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

export default function ProductsScreen({ navigation, route }) {
  const initialCategory = route?.params?.categorySlug ?? '';
  const initialName     = route?.params?.categoryName ?? '';

  const [search,      setSearch]      = useState('');
  const [activeSlug,  setActiveSlug]  = useState(initialCategory);
  const [activeName,  setActiveName]  = useState(initialName);
  const [searchDebounced, setSearchDebounced] = useState('');

  // Debounce search
  const debounceRef = React.useRef(null);
  const handleSearchChange = useCallback((text) => {
    setSearch(text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchDebounced(text), 400);
  }, []);

  const params = useMemo(() => ({
    ...(activeSlug && { category: activeSlug }),
    ...(searchDebounced && { search: searchDebounced }),
  }), [activeSlug, searchDebounced]);

  const { products: rawProducts, loading, error, hasMore, loadMore, total } = usePaginatedProducts(params);
  const { categories: rawCats } = useCategories();

  const products   = rawProducts.map(normalizeProduct);
  const categories = rawCats.map(normalizeCategory);

  const selectCategory = useCallback((slug, name) => {
    setActiveSlug(slug);
    setActiveName(name);
    setSearch('');
    setSearchDebounced('');
  }, []);

  const renderProduct = useCallback(({ item: product }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id, productName: product.name })}
      activeOpacity={0.85}
    >
      <ProductRowImage product={product} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowCategory} numberOfLines={1}>{product.categoryName}</Text>
        <Text style={styles.rowName} numberOfLines={2}>{product.name}</Text>
        {product.brandName ? <Text style={styles.rowBrand} numberOfLines={1}>{product.brandName}</Text> : null}
        <Text style={styles.rowPrice}>{product.displayPrice}</Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  const ListHeader = useMemo(() => (
    <View>
      {/* Search bar */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {/* Category pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
        <CategoryPill label="All" active={!activeSlug} onPress={() => selectCategory('', '')} />
        {categories.map(cat => (
          <CategoryPill
            key={cat.slug}
            label={cat.name}
            count={cat.productCount}
            active={activeSlug === cat.slug}
            onPress={() => selectCategory(cat.slug, cat.name)}
          />
        ))}
      </ScrollView>

      {/* Result count */}
      <View style={styles.resultsMeta}>
        <Text style={styles.resultsText}>
          {loading && products.length === 0
            ? 'Loading…'
            : `${total} product${total !== 1 ? 's' : ''}${activeName ? ` in ${activeName}` : ''}`}
        </Text>
      </View>
    </View>
  ), [search, handleSearchChange, categories, activeSlug, activeName, selectCategory, loading, products.length, total]);

  const ListFooter = useCallback(() => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }, [loading]);

  if (error && products.length === 0) {
    return (
      <View style={styles.errorState}>
        <Text style={styles.errorTitle}>Couldn't load products</Text>
        <Text style={styles.errorBody}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={p => String(p.id)}
        renderItem={renderProduct}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading
            ? <EmptyState search={searchDebounced} category={activeName} />
            : null
        }
      />
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProductRowImage({ product }) {
  const imageUrl = getProductImageUrl(product);
  return (
    <View style={styles.rowImageWrap}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.rowImage} resizeMode="contain" />
      ) : (
        <View style={styles.rowImagePlaceholder} />
      )}
    </View>
  );
}

function CategoryPill({ label, count, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}{count ? ` (${count})` : ''}
      </Text>
    </TouchableOpacity>
  );
}

function EmptyState({ search, category }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No products found</Text>
      <Text style={styles.emptyBody}>
        {search
          ? `No results for "${search}"${category ? ` in ${category}` : ''}.`
          : `No products available${category ? ` in ${category}` : ''} right now.`}
      </Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list:      { paddingBottom: SPACING.xl * 2 },

  searchWrap:  { margin: SPACING.md, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, ...SHADOW.sm },
  searchInput: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2 },

  catRow: { paddingHorizontal: SPACING.md, gap: SPACING.xs, marginBottom: SPACING.xs },
  pill:       { paddingHorizontal: SPACING.sm + 4, paddingVertical: SPACING.xs + 2, borderRadius: 20, backgroundColor: COLORS.surfaceAlt, marginRight: 4 },
  pillActive: { backgroundColor: COLORS.primary },
  pillText:       { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  pillTextActive: { color: COLORS.white },

  resultsMeta:  { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, marginBottom: SPACING.xs },
  resultsText:  { fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textSecondary },

  row:          { flexDirection: 'row', backgroundColor: COLORS.surface, marginHorizontal: SPACING.md, marginBottom: SPACING.sm, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  rowImageWrap: { width: 110, height: 110, backgroundColor: COLORS.surfaceAlt },
  rowImage:     { width: '100%', height: '100%' },
  rowImagePlaceholder: { flex: 1, backgroundColor: COLORS.surfaceAlt },
  rowInfo:      { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  rowCategory:  { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  rowName:      { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, marginBottom: 3 },
  rowBrand:     { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginBottom: 5 },
  rowPrice:     { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.primary },

  footerLoader: { padding: SPACING.lg, alignItems: 'center' },

  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  errorTitle: { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text, marginBottom: 8 },
  errorBody:  { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },

  emptyState: { padding: SPACING.xl * 2, alignItems: 'center' },
  emptyTitle: { fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.text, marginBottom: 8 },
  emptyBody:  { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});