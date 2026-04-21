import React, { useState } from 'react';
import {
  View,
  Text,
  Animated,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { useFeaturedProducts, useCategories } from '../hooks/useProducts';
import { useDeals } from '../hooks/useDeals';
import { createDeal } from '../models';
import ProductCard from '../components/ProductCard';
import DealCard from '../components/DealCard';
import SiteFooter from '../components/SiteFooter';
import { SectionHeader, LoadingSpinner } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';
import { WEB_LAYOUT_BREAKPOINT } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;
const IS_WEB_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH >= WEB_LAYOUT_BREAKPOINT;
const HOME_CAT_IMG_SIZE = IS_MOBILE ? 120 : 160;
const CARD_HEIGHT = HOME_CAT_IMG_SIZE + 50;

const CATEGORY_IMAGES = {
  'stairlifts': require('../../assets/products/stairLifts/s-lift-sre3050.jpg'),
  'mobility-scooters': require('../../assets/products/scooters/m-scooter-sc15.webp'),
  'power-wheelchairs': require('../../assets/products/powerChairs/pw-chair-j27x.jpg'),
  'lift-chairs-power-recliners': require('../../assets/products/recliners/rec-pr764.webp'),
  'wheelchairs-transport-chairs': require('../../assets/products/wheelchairs/w-chair-ak2.webp'),
  'walkers-rollators': require('../../assets/products/walkers/walker-rrd.png'),
  'vehicle-lifts': require('../../assets/products/vehicleLifts/car-lift-asl275.jpg'),
  'patient-lifts': require('../../assets/products/patientLifts/p-lift-sa400.png'),
  'ramps': require('../../assets/products/ramps/ramp.png'),
  'beds':require('../../assets/products/beds/beds.jpg'),
  'vertical-platform-lifts':require('../../assets/products/platformLifts/platform-lift.png'),
  'security-poles':require('../../assets/products/poles/pole-bsb.png'),
  'tables-trays':require('../../assets/products/tables/tables.png'),
};

const resolveCategoryImageSource = (src) => {
  if (src == null) return null;
  if (typeof src === 'number') return src;
  if (typeof src === 'string') return { uri: src };
  if (typeof src === 'object' && typeof src.uri === 'string') return src;
  return null;
};

// ─── Category card ────────────────────────────────────────────────────────────
const CategoryCard = ({ category, onPress }) => {
  const imageSource = CATEGORY_IMAGES[category.slug];
  const [imgError, setImgError] = useState(false);
  const imageResolvedSource = resolveCategoryImageSource(imageSource);
  const showImage = imageResolvedSource != null && !imgError;

  return (
    <Pressable
      style={({ pressed, hovered }) => [
        styles.categoryCard,
        { opacity: pressed ? 0.7 : hovered ? 0.8 : 1 }
      ]}
      onPress={() => onPress(category)}
    >
      <View style={styles.categoryImageFrame}>
        {showImage ? (
          <Image
            source={imageResolvedSource}
            style={styles.categoryImage}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.categoryPlaceholder} />
        )}
      </View>

      {/* Text wrapper – fills remaining space and centers content */}
      <View style={styles.categoryTextWrapper}>
        <Text style={styles.categoryCardName} numberOfLines={2}>
          {category.name}
        </Text>
      </View>
    </Pressable>
  );
};

const PROMOS = [
  {
    image: require('../../assets/home/Deal-of-the-month.webp'),
    tab: 'Inventory',
  },
  {
    image: require('../../assets/home/mothers-day-sale.webp'),
    tab: 'Inventory',
  },
];

const HomeScreen = () => {
  const { switchTab, scrollY } = useTabNavigation();
  const { products: featured, loading: featuredLoading } = useFeaturedProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { deals: rawDeals, loading: dealsLoading } = useDeals();
  const deals = rawDeals.map(createDeal);
  const previewDeals = deals.slice(0, 4);
  const [promoIndex, setPromoIndex] = useState(0);

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

        <WebContentGutter>
          {/* Promo banner with background image */}
          <View style={styles.promoContainer}>
            <Image
              source={require('../../assets/home/home-bg.webp')}
              style={styles.promoBackgroundImage}
              resizeMode="cover"
            />
            <View style={styles.promoOverlay}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.promoItem}
                onPress={() => switchTab(PROMOS[promoIndex].tab)}
              >
                <View style={styles.promoImageWrapper}>
                  <Image
                    source={PROMOS[promoIndex].image}
                    style={styles.promoItemImage}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Left arrow */}
            <TouchableOpacity
              style={[styles.promoArrow, styles.promoArrowLeft]}
              onPress={() => setPromoIndex(i => (i - 1 + PROMOS.length) % PROMOS.length)}
            >
              <Text style={styles.promoArrowText}>‹</Text>
            </TouchableOpacity>

            {/* Right arrow */}
            <TouchableOpacity
              style={[styles.promoArrow, styles.promoArrowRight]}
              onPress={() => setPromoIndex(i => (i + 1) % PROMOS.length)}
            >
              <Text style={styles.promoArrowText}>›</Text>
            </TouchableOpacity>

            {/* Dots */}
            <View style={styles.promoDots}>
              {PROMOS.map((_, i) => (
                <TouchableOpacity key={i} onPress={() => setPromoIndex(i)}>
                  <View style={[styles.promoDot, i === promoIndex && styles.promoDotActive]} />
                </TouchableOpacity>
              ))}
            </View>
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
                  <CategoryCard category={item} onPress={(cat) => switchTab('Inventory', { category: cat.slug, categoryName: cat.name })} />
                )}
              />
            )}
          </View>

          {/* Current Deals */}
          {(previewDeals.length > 0 || dealsLoading) && (
            <View style={styles.section}>
              <SectionHeader title="Current Deals" onSeeAll={() => switchTab('Deals')} />
              {dealsLoading ? <LoadingSpinner size="small" /> : (
                <FlatList
                  data={previewDeals}
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
                Miller Mobility rents wheelchairs, scooters, stairlifts, lift chairs, patient lifts, and ramps by the
                day, week, or month. Pickup in store or we'll deliver.
              </Text>
              <TouchableOpacity style={styles.rentalsButton} onPress={() => switchTab('Rentals')}>
                <Text style={styles.rentalsButtonText}>View Rentals →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </WebContentGutter>

        <SiteFooter onTabPress={switchTab} />

      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },

  // Promo carousel
  promoContainer: {
    position: 'relative',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
    marginHorizontal: Spacing.sm,
    height: IS_MOBILE ? 320 : 660,
    ...Shadows.md,
  },
  promoBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  promoOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    zIndex: 1,
  },
  promoItem: {
    width: '100%',
    maxWidth: IS_MOBILE ? 300 : 720,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
    height: IS_MOBILE ? 230 : 560,
  },
  promoImageWrapper: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoItemImage: {
    width: '100%',
    height: '100%',
  },
  promoArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -26,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  promoArrowLeft:  { left: Spacing.md },
  promoArrowRight: { right: Spacing.md },
  promoArrowText:  { fontSize: 30, fontWeight: '300', color: Colors.black, lineHeight: 34 },
  promoDots: {
    position: 'absolute',
    bottom: Spacing.md,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    zIndex: 10,
  },
  promoDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  promoDotActive: { backgroundColor: Colors.white },

  // Sections
  section: { marginTop: Spacing.xl, paddingHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.md },
  horizontalList: { paddingRight: Spacing.base },

  // Category chips
  categoryCard: { width: HOME_CAT_IMG_SIZE, height: HOME_CAT_IMG_SIZE + (IS_MOBILE ? 50 : 60), backgroundColor: Colors.primary, borderRadius: Radius.lg, overflow: 'hidden', marginRight: Spacing.sm, alignItems: 'center', ...Shadows.sm },
  categoryImageFrame: { width: '100%', height: HOME_CAT_IMG_SIZE, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  categoryImage: { width: '100%', height: '100%' },
  categoryPlaceholder: { width: '100%', height: '100%', backgroundColor: Colors.gray50 },
  categoryTextWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xs },
  categoryCardName: { fontSize: IS_MOBILE ? 16 : 20, fontWeight: Typography.weights.semibold, color: Colors.white, textAlign: 'center' },

  // Cards
  productCard: { width: 200, marginRight: Spacing.md },
  dealCard: { width: 260, marginRight: Spacing.md },

  // Why card
  whyCard: { backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.lg },
  whyTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.md },
  whyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.md },
  whyIcon: { fontSize: 20 },
  whyText: { fontSize: Typography.sizes.base, color: 'rgba(255,255,255,0.85)', flex: 1 },
  contactButton: { marginTop: Spacing.md, backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.full, alignSelf: 'flex-start' },
  contactButtonText: { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm },

  // Rentals strip
  rentalsStrip: { backgroundColor: Colors.gray50, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1.5, borderColor: Colors.border, marginBottom: Spacing.lg },
  rentalsTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.sm },
  rentalsText: { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.6, marginBottom: Spacing.md },
  rentalsButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.full, alignSelf: 'flex-start' },
  rentalsButtonText: { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm },
});

export default HomeScreen;