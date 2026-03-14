import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { useFeaturedProducts, useCategories } from '../hooks/useProducts';
import { useDeals } from '../hooks/useDeals';
import ProductCard from '../components/ProductCard';
import DealCard from '../components/DealCard';
import { SectionHeader, LoadingSpinner, Badge } from '../components/ui';
import SiteFooter from '../components/SiteFooter';

const CATEGORY_ICONS = {
  'wheelchair-accessible-vehicles': '🚐',
  'power-wheelchairs': '♿',
  'scooters': '🛵',
  'lifts': '🔧',
  'ramps': '📐',
  'accessories': '🎒',
};

const HomeScreen = ({ navigation }) => {
  const { products: featured, loading: featuredLoading } = useFeaturedProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { deals, loading: dealsLoading } = useDeals();

  const featuredDeals = deals.filter((d) => d.isFeatured).slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>Miller Mobility</Text>
          <Text style={styles.heroTitle}>Find Your Perfect{'\n'}Mobility Solution</Text>
          <Text style={styles.heroSub}>
            New & pre-owned WAVs, power chairs, scooters, and more.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => navigation.navigate('Inventory')}
          >
            <Text style={styles.heroButtonText}>Browse Inventory →</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Category Grid */}
        <View style={styles.section}>
          <SectionHeader
            title="Shop by Category"
            onSeeAll={() => navigation.navigate('Inventory')}
          />
          {categoriesLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id?.toString() ?? item.slug}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryChip}
                  onPress={() =>
                    navigation.navigate('Inventory', { category: item.slug, categoryName: item.name })
                  }
                >
                  <Text style={styles.categoryIcon}>
                    {CATEGORY_ICONS[item.slug] ?? '📦'}
                  </Text>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  {item.productCount > 0 && (
                    <Text style={styles.categoryCount}>{item.productCount}</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Featured Deals */}
        {(featuredDeals.length > 0 || dealsLoading) && (
          <View style={styles.section}>
            <SectionHeader
              title="Current Deals"
              onSeeAll={() => navigation.navigate('Deals')}
            />
            {dealsLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <FlatList
                data={featuredDeals}
                keyExtractor={(item) => item.id?.toString() ?? item.slug}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                renderItem={({ item }) => (
                  <DealCard
                    deal={item}
                    style={styles.dealCard}
                    onPress={(d) => navigation.navigate('Deals', { screen: 'DealDetail', params: { slug: d.slug } })}
                  />
                )}
              />
            )}
          </View>
        )}

        {/* Featured Inventory */}
        <View style={styles.section}>
          <SectionHeader
            title="Featured Inventory"
            onSeeAll={() => navigation.navigate('Inventory', { featured: true })}
          />
          {featuredLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <FlatList
              data={featured.slice(0, 6)}
              keyExtractor={(item) => item.id?.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  style={styles.productCard}
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
        </View>

        {/* Why Miller Mobility */}
        <View style={styles.section}>
          <View style={styles.whyCard}>
            <Text style={styles.whyTitle}>Why Miller Mobility?</Text>
            {[
              { icon: '🏆', text: 'Decades of mobility expertise' },
              { icon: '🔧', text: 'Full-service installation & repairs' },
              { icon: '💳', text: 'Flexible financing options' },
              { icon: '🤝', text: 'Personalized guidance & demos' },
            ].map(({ icon, text }) => (
              <View key={text} style={styles.whyRow}>
                <Text style={styles.whyIcon}>{icon}</Text>
                <Text style={styles.whyText}>{text}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => navigation.navigate('Contact')}
            >
              <Text style={styles.contactButtonText}>Contact Us Today</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: Spacing['2xl'] }} />
        <SiteFooter navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  scroll: { flex: 1, backgroundColor: Colors.background },
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  heroTag: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.heavy,
    color: Colors.white,
    lineHeight: Typography.sizes['3xl'] * 1.2,
    marginBottom: Spacing.sm,
  },
  heroSub: {
    fontSize: Typography.sizes.base,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: Spacing.lg,
  },
  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  heroButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  section: {
    marginTop: Spacing.xl,
  },
  categoryList: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  categoryChip: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    minWidth: 90,
    ...Shadows.sm,
  },
  categoryIcon: { fontSize: 28, marginBottom: Spacing.xs },
  categoryName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.gray400,
    marginTop: 2,
  },
  horizontalList: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  dealCard: { width: 260 },
  productCard: { width: 220 },
  whyCard: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  whyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: Spacing.base,
  },
  whyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  whyIcon: { fontSize: 22 },
  whyText: {
    fontSize: Typography.sizes.base,
    color: 'rgba(255,255,255,0.9)',
  },
  contactButton: {
    marginTop: Spacing.base,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  contactButtonText: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.base,
  },
});

export default HomeScreen;