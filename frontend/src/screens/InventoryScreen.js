import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useProducts, useCategories } from '../hooks/useProducts';
import { useSearch } from '../hooks/useSearch';
import ProductCard from '../components/ProductCard';
import SiteFooter from '../components/SiteFooter';
import { LoadingSpinner, ErrorView, EmptyState, Chip } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;
// Approximate height of both filter rows combined — used for desktop collapse
const FILTER_HEIGHT = 90;
const FILTER_COLLAPSE_SCROLL = 80;

const InventoryScreen = ({ navigation, route }) => {
  const { switchTab, scrollY } = useTabNavigation();

  // On desktop, collapse the filter rows when scrolled down enough
  const filterHeight = (!IS_MOBILE)
    ? scrollY.interpolate({
        inputRange: [0, FILTER_COLLAPSE_SCROLL],
        outputRange: [FILTER_HEIGHT, 0],
        extrapolate: 'clamp',
      })
    : FILTER_HEIGHT;

  const filterOpacity = (!IS_MOBILE)
    ? scrollY.interpolate({
        inputRange: [0, FILTER_COLLAPSE_SCROLL * 0.5],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      })
    : 1;
  const initialCategory = route.params?.category ?? '';
  const [search, setSearch]                     = useState('');
  const [searchFocused, setSearchFocused]       = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [debouncedSearch, setDebouncedSearch]   = useState('');

  const { recentSearches, saveSearch, removeSearch } = useSearch();

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      if (search.trim()) saveSearch(search.trim());
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (route.params?.category !== undefined) setSelectedCategory(route.params.category);
  }, [route.params?.category]);

  const filters = {
    ...(selectedCategory  && { category:  selectedCategory }),
    ...(debouncedSearch   && { search:    debouncedSearch }),
  };

  const { products, loading, error, hasMore, loadMore, refresh } = useProducts(filters);
  const { categories } = useCategories();
  const allCategories = [{ id: '__all', slug: '', name: 'All' }, ...categories];

  const handleProductPress = (product) =>
    navigation.navigate('ProductDetail', { id: product.id, name: product.name });

  const clearFilters = () => {
    setSearch(''); setDebouncedSearch('');
    setSelectedCategory('');
  };

  const showSuggestions = searchFocused && search.length === 0 && recentSearches.length > 0;

  const renderBody = () => {
    if (error) return <ErrorView message={error} onRetry={refresh} />;
    if (loading && products.length === 0) return <LoadingSpinner full />;
    if (products.length === 0) return (
      <EmptyState
        icon="🔍"
        title="No products found"
        message="Try adjusting your filters or search term."
        action="Clear Filters"
        onAction={clearFilters}
      />
    );
    return (
      <FlatList
        data={products}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ProductCard product={item} style={styles.card} onPress={handleProductPress} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={hasMore ? <LoadingSpinner size="small" /> : null}
        scrollEnabled={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search inventory…"
          placeholderTextColor={Colors.gray400}
          value={search}
          onChangeText={setSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && (
        <View style={styles.suggestions}>
          {recentSearches.slice(0, 5).map((term) => (
            <TouchableOpacity
              key={term}
              style={styles.suggestionRow}
              onPress={() => { setSearch(term); setSearchFocused(false); }}
            >
              <Text style={styles.suggestionIcon}>🕐</Text>
              <Text style={styles.suggestionText}>{term}</Text>
              <TouchableOpacity onPress={() => removeSearch(term)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={styles.suggestionRemove}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category filters — collapse on desktop when scrolled */}
      <Animated.View style={{ height: filterHeight, opacity: filterOpacity, overflow: 'hidden' }}>
        {/* Category filter */}
        <View style={styles.filterRow}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
          >
            {allCategories.map((cat) => (
              <Chip
                key={cat.slug}
                label={cat.name}
                selected={selectedCategory === cat.slug}
                onPress={() => setSelectedCategory(cat.slug)}
              />
            ))}
          </Animated.ScrollView>
        </View>
      </Animated.View>

      {/* Main scrollable body — drives the brand strip collapse */}
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {renderBody()}
        <SiteFooter onTabPress={switchTab} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.background },
  searchBar:        { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.sm },
  searchInput:      { flex: 1, fontSize: Typography.sizes.base, color: Colors.black, paddingVertical: Spacing.sm },
  clearBtn:         { fontSize: 16, color: Colors.gray400, paddingHorizontal: Spacing.sm },
  suggestions:      { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  suggestionRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  suggestionIcon:   { fontSize: 14 },
  suggestionText:   { flex: 1, fontSize: Typography.sizes.base, color: Colors.black },
  suggestionRemove: { fontSize: 12, color: Colors.gray400 },
  filterRow:        { backgroundColor: Colors.surface, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  filterList:       { paddingHorizontal: Spacing.base, flexGrow: 0 },
  resultCount:      { fontSize: Typography.sizes.sm, color: Colors.gray400, paddingRight: Spacing.base, minWidth: 70, textAlign: 'right' },
  grid:             { padding: Spacing.base },
  row:              { justifyContent: 'space-between', marginBottom: Spacing.md },
  card:             { width: '48.5%' },
});

export default InventoryScreen;