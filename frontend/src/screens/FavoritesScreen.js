import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';
import { useFavorites } from '../hooks/useFavorites';
import { productsService } from '../services/api';
import ProductCard from '../components/ProductCard';
import SiteFooter from '../components/SiteFooter';
import { LoadingSpinner, EmptyState } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';

const FavoritesScreen = () => {
  const { switchTab } = useTabNavigation();
  const { favoriteIds, favoriteCount, clearFavorites } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (favoriteIds.size === 0) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    Promise.all([...favoriteIds].map((id) => productsService.detail(id)))
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [favoriteIds]);

  const renderBody = () => {
    if (loading) return <LoadingSpinner full />;
    if (products.length === 0) return (
      <EmptyState
        icon="🚐"
        title="No saved vehicles"
        message="Tap the heart icon on any product to save it here for later."
        action="Browse Inventory"
        onAction={() => switchTab('Inventory')}
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
          <ProductCard product={item} style={styles.card} onPress={() => switchTab('Inventory')} />
        )}
        scrollEnabled={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Vehicles</Text>
        {favoriteCount > 0 && (
          <TouchableOpacity onPress={clearFavorites} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Outer ScrollView ensures footer is always reachable */}
      <ScrollView>
        {renderBody()}
        <SiteFooter onTabPress={switchTab} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.background },
  header:     { backgroundColor: Colors.primary, paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle:{ fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.white },
  clearText:  { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.7)', fontWeight: Typography.weights.medium },
  grid:       { padding: Spacing.base },
  row:        { justifyContent: 'space-between', marginBottom: Spacing.md },
  card:       { width: '48.5%' },
});

export default FavoritesScreen;