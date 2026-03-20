import React from 'react';
import {
  View,
  Text,
  Animated,
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
import SiteFooter from '../components/SiteFooter';
import { SectionHeader, LoadingSpinner } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';

const CATEGORY_ICONS = {
  'stairlifts': '🪜',
  'mobility-scooters': '🛵',
  'power-wheelchairs': '⚡',
  'lift-chairs-power-recliners': '🪑',
  'wheelchairs-transport-chairs': '♿',
  'walkers-rollators': '🦯',
  'vehicle-lifts': '🚗',
  'patient-lifts': '🏥',
  'ramps': '📐',
  'beds': '🛏️',
  'vertical-platform-lifts-home-elevators': '🏠',
  'security-poles': '🔒',
  'tables-trays': '🍽️',
  // legacy slugs kept for backward compat
  'wheelchair-accessible-vehicles': '🚐',
  'power-wheelchairs': '⚡',
  'scooters': '🛵',
  'lifts': '🔧',
  'accessories': '🎒',
};

const HomeScreen = () => {
  const { switchTab, scrollY } = useTabNavigation();
  const { products: featured, loading: featuredLoading } = useFeaturedProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { deals, loading: dealsLoading } = useDeals();
  const featuredDeals = deals.filter((d) => d.isFeatured).slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>Miller Mobility</Text>
          <Text style={styles.heroTitle}>Find Your Perfect{'\n'}Mobility Solution</Text>
          <Text style={styles.heroSub}>
            Stairlifts, scooters, lift chairs, power wheelchairs, ramps & more — family owned since 2004.
          </Text>
          <TouchableOpacity style={styles.heroButton} onPress={() => switchTab('Inventory')}>
            <Text style={styles.heroButtonText}>Browse Products →</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <SectionHeader title="Shop by Category" onSeeAll={() => switchTab('Inventory')} />
          {categoriesLoading ? <LoadingSpinner size="small" /> : (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id?.toString() ?? item.slug}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryChip}
                  onPress={() => switchTab('Inventory', { category: item.slug, categoryName: item.name })}
                >
                  <Text style={styles.categoryIcon}>{CATEGORY_ICONS[item.slug] ?? '📦'}</Text>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  {item.productCount > 0 && <Text style={styles.categoryCount}>{item.productCount}</Text>}
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Featured Deals */}
        {(featuredDeals.length > 0 || dealsLoading) && (
          <View style={styles.section}>
            <SectionHeader title="Current Deals" onSeeAll={() => switchTab('Deals')} />
            {dealsLoading ? <LoadingSpinner size="small" /> : (
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
                    onPress={() => switchTab('Deals')}
                  />
                )}
              />
            )}
          </View>
        )}

        {/* Featured Inventory */}
        <View style={styles.section}>
          <SectionHeader title="Featured Products" onSeeAll={() => switchTab('Inventory', { featured: true })} />
          {featuredLoading ? <LoadingSpinner size="small" /> : (
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
                  onPress={() => switchTab('Inventory')}
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
              { icon: '🏆', text: 'Family owned & operated since 2004' },
              { icon: '🔧', text: 'Factory-trained installation & service experts' },
              { icon: '💳', text: 'Flexible financing — ask about 0% APR options' },
              { icon: '🤝', text: 'Preferred provider for ADRC, IRIS & CLTS programs' },
              { icon: '🐕', text: 'A warm, welcoming showroom in Oconomowoc, WI' },
            ].map(({ icon, text }) => (
              <View key={text} style={styles.whyRow}>
                <Text style={styles.whyIcon}>{icon}</Text>
                <Text style={styles.whyText}>{text}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.contactButton} onPress={() => switchTab('Contact')}>
              <Text style={styles.contactButtonText}>Contact Us →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rentals promo strip */}
        <View style={styles.section}>
          <View style={styles.rentalsStrip}>
            <Text style={styles.rentalsTitle}>🔑 Need Equipment Temporarily?</Text>
            <Text style={styles.rentalsText}>
              Miller Mobility rents wheelchairs, scooters, stairlifts, lift chairs, patient lifts, and ramps by the day, week, or month. Pickup in store or we'll deliver.
            </Text>
            <TouchableOpacity style={styles.rentalsButton} onPress={() => switchTab('Rentals')}>
              <Text style={styles.rentalsButtonText}>View Rentals →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <SiteFooter onTabPress={switchTab} />

      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  hero: { backgroundColor: Colors.primary, padding: Spacing.xl, paddingTop: Spacing['2xl'] },
  heroTag: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: Spacing.sm },
  heroTitle: { fontSize: Typography.sizes['3xl'], fontWeight: Typography.weights.heavy, color: Colors.white, lineHeight: Typography.sizes['3xl'] * 1.2, marginBottom: Spacing.sm },
  heroSub: { fontSize: Typography.sizes.base, color: 'rgba(255,255,255,0.75)', marginBottom: Spacing.lg, lineHeight: Typography.sizes.base * 1.5 },
  heroButton: { backgroundColor: Colors.white, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, alignSelf: 'flex-start' },
  heroButtonText: { color: Colors.primary, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },
  section: { marginTop: Spacing.xl, paddingHorizontal: Spacing.base },
  horizontalList: { paddingRight: Spacing.base },
  categoryChip: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginRight: Spacing.sm, alignItems: 'center', minWidth: 80, ...Shadows.sm },
  categoryIcon: { fontSize: 28, marginBottom: Spacing.xs },
  categoryName: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.semibold, color: Colors.black, textAlign: 'center' },
  categoryCount: { fontSize: Typography.sizes.xs, color: Colors.gray400, marginTop: 2 },
  productCard: { width: 200, marginRight: Spacing.md },
  dealCard: { width: 260, marginRight: Spacing.md },
  whyCard: { backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.lg },
  whyTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.md },
  whyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.md },
  whyIcon: { fontSize: 20 },
  whyText: { fontSize: Typography.sizes.base, color: 'rgba(255,255,255,0.85)', flex: 1 },
  contactButton: { marginTop: Spacing.md, backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.full, alignSelf: 'flex-start' },
  contactButtonText: { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm },
  rentalsStrip: { backgroundColor: Colors.gray50, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.border, marginBottom: Spacing.lg },
  rentalsTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.sm },
  rentalsText: { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.6, marginBottom: Spacing.md },
  rentalsButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.full, alignSelf: 'flex-start' },
  rentalsButtonText: { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm },
});

export default HomeScreen;