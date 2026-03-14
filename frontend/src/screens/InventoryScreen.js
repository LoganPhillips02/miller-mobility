import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useProducts, useCategories } from '../hooks/useProducts';
import { useSearch } from '../hooks/useSearch';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner, ErrorView, EmptyState, Chip } from '../components/ui';
import SiteFooter from '../components/SiteFooter';

const CONDITIONS = [
  { label: 'All', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Used', value: 'used' },
  { label: 'Certified', value: 'certified' },
];

const InventoryScreen = ({ navigation, route }) => {
  const initialCategory = route.params?.category ?? '';
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { recentSearches, saveSearch, removeSearch, clearSearches } = useSearch();

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      if (search.trim()) saveSearch(search.trim());
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  // Sync category from route params
  useEffect(() => {
    if (route.params?.category !== undefined) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

  const filters = {
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedCondition && { condition: selectedCondition }),
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const { products, loading, error, hasMore, loadMore, refresh } = useProducts(filters);
  const { categories } = useCategories();

  const allCategories = [{ id: '__all', slug: '', name: 'All' }, ...categories];

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { id: product.id, name: product.name });
  };

  const applyRecentSearch = (term) => {
    setSearch(term);
    setSearchFocused(false);
  };

  const showSuggestions = searchFocused && search.length === 0 && recentSearches.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search vehicles, chairs, lifts…"
            placeholderTextColor={Colors.gray400}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            returnKeyType="search"
            onSubmitEditing={() => search.trim() && saveSearch(search.trim())}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); setDebouncedSearch(''); }}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent searches dropdown */}
        {showSuggestions && (
          <View style={styles.suggestions}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearSearches}>
                <Text style={styles.clearRecentText}>Clear</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.suggestionRow}
                onPress={() => applyRecentSearch(term)}
              >
                <Text style={styles.suggestionIcon}>🕐</Text>
                <Text style={styles.suggestionText}>{term}</Text>
                <TouchableOpacity
                  onPress={() => removeSearch(term)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.suggestionRemove}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Category Filter */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {allCategories.map((cat) => (
            <Chip
              key={cat.slug}
              label={cat.name}
              selected={selectedCategory === cat.slug}
              onPress={() => setSelectedCategory(cat.slug)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Condition + count */}
      <View style={styles.conditionRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          {CONDITIONS.map((c) => (
            <Chip
              key={c.value}
              label={c.label}
              selected={selectedCondition === c.value}
              onPress={() => setSelectedCondition(c.value)}
              style={{ borderRadius: Radius.sm }}
            />
          ))}
        </ScrollView>
        <Text style={styles.resultCount}>
          {loading ? '…' : `${products.length} results`}
        </Text>
      </View>

      {/* Results */}
      {error ? (
        <ErrorView message={error} onRetry={refresh} />
      ) : loading && products.length === 0 ? (
        <LoadingSpinner full />
      ) : products.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No products found"
          message="Try adjusting your filters or search term."
          action="Clear Filters"
          onAction={() => {
            setSearch('');
            setDebouncedSearch('');
            setSelectedCategory('');
            setSelectedCondition('');
          }}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id?.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              style={styles.card}
              onPress={handleProductPress}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          onRefresh={refresh}
          refreshing={loading && products.length > 0}
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={<SiteFooter navigation={navigation} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchBarFocused: {
    borderColor: Colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: { flex: 1, fontSize: Typography.sizes.base, color: Colors.black },
  clearIcon: { fontSize: 14, color: Colors.gray400, paddingHorizontal: Spacing.xs },
  suggestions: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.primary,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
    overflow: 'hidden',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  suggestionsTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearRecentText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  suggestionIcon: { fontSize: 14 },
  suggestionText: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.black,
  },
  suggestionRemove: { fontSize: 12, color: Colors.gray400 },
  filterRow: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  conditionRow: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterList: { paddingHorizontal: Spacing.base, flexGrow: 0 },
  resultCount: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray400,
    paddingRight: Spacing.base,
    minWidth: 70,
    textAlign: 'right',
  },
  grid: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  row: { justifyContent: 'space-between', marginBottom: Spacing.md },
  card: { width: '48.5%' },
});

export default InventoryScreen;