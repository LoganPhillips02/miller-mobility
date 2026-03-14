import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useFavorites } from '../hooks/useFavorites';
import { productsService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner, EmptyState } from '../components/ui';

const FavoritesScreen = ({ navigation }) => {
  const { favoriteIds, favoriteCount, clearFavorites } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoriteIds.size === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Fetch each favorited product in parallel
    Promise.all([...favoriteIds].map((id) => productsService.detail(id)))
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [favoriteIds]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Vehicles</Text>
        {favoriteCount > 0 && (
          <TouchableOpacity onPress={clearFavorites} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <LoadingSpinner full />
      ) : products.length === 0 ? (
        <EmptyState
          icon="🚐"
          title="No saved vehicles"
          message="Tap the heart icon on any product to save it here for later."
          action="Browse Inventory"
          onAction={() => navigation.navigate('Inventory')}
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
              onPress={(p) =>
                navigation.navigate('Inventory', {
                  screen: 'ProductDetail',
                  params: { id: p.id, name: p.name },
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.heavy,
    color: Colors.white,
  },
  clearText: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: Typography.weights.medium,
  },
  grid: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  card: { width: '48.5%' },
});

export default FavoritesScreen;