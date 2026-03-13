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
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner, ErrorView, EmptyState, Chip } from '../components/ui';

const CONDITIONS = [
  { label: 'All', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Used', value: 'used' },
  { label: 'Certified', value: 'certified' },
];

const InventoryScreen = ({ navigation, route }) => {
  const initialCategory = route.params?.category ?? '';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Sync category from route params (e.g. tapping a category on Home)
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

  return (
    <SafeAreaView style={styles.safe}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search vehicles, chairs, lifts…"
            placeholderTextColor={Colors.gray400}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
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

      {/* Condition Filter */}
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
          ListFooterComponent={hasMore ? <LoadingSpinner size="small" /> : null}
          onRefresh={refresh}
          refreshing={loading && products.length > 0}
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
  searchIcon: { fontSize: 16, marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.black,
  },
  clearIcon: {
    fontSize: 14,
    color: Colors.gray400,
    paddingHorizontal: Spacing.xs,
  },
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
  filterList: {
    paddingHorizontal: Spacing.base,
    flexGrow: 0,
  },
  resultCount: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray400,
    paddingRight: Spacing.base,
    minWidth: 70,
    textAlign: 'right',
  },
  grid: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  card: {
    width: '48.5%',
  },
});

export default InventoryScreen;