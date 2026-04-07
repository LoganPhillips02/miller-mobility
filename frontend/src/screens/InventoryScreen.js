import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { getWebBodyContentWidth } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { useProducts, useCategories } from '../hooks/useProducts';
import { useSearch } from '../hooks/useSearch';
import ProductCard from '../components/ProductCard';
import SiteFooter from '../components/SiteFooter';
import { LoadingSpinner, ErrorView, EmptyState } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;

const NUM_COLUMNS = IS_MOBILE ? 2 : 4;
const GRID_PADDING = Spacing.md * 2;
const CARD_GAP = Spacing.sm;
const GRID_OUTER_WIDTH = getWebBodyContentWidth();
const CARD_WIDTH =
  (GRID_OUTER_WIDTH - GRID_PADDING - CARD_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
const CAT_IMG_SIZE = CARD_WIDTH;

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
      {showImage ? (
        <View style={styles.categoryImageFrame}>
          <Image
            source={imageResolvedSource}
            style={styles.categoryImage}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        </View>
      ) : (
        <View style={styles.categoryPlaceholder} />
      )}

      <Text style={styles.categoryCardName} numberOfLines={2}>
        {category.name}
      </Text>
    </Pressable>
  );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const InventoryScreen = ({ navigation, route }) => {
  const { switchTab, scrollY } = useTabNavigation();

  const initialCategory = route.params?.category ?? '';

  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [showCategoryGrid, setShowCategoryGrid] = useState(
    !initialCategory && !route.params?.featured,
  );

  const { recentSearches, saveSearch, removeSearch } = useSearch();
  const transitioning = React.useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      if (search.trim()) saveSearch(search.trim());
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (route.params?.category !== undefined) {
      const slug = route.params.category;
      setSelectedCategory(slug);
      if (slug) setShowCategoryGrid(false);
    }
    if (route.params?.featured) setShowCategoryGrid(false);
  }, [route.params?.category, route.params?.featured]);

  useEffect(() => {
    if (debouncedSearch) setShowCategoryGrid(false);
  }, [debouncedSearch]);

  const filters = {
    ...(selectedCategory && { category: selectedCategory }),
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const { products, loading, error, hasMore, loadMore, refresh } = useProducts(filters);
  const { categories, loading: catsLoading } = useCategories();

  const handleProductPress = (product) =>
    navigation.navigate('ProductDetail', { id: product.id, name: product.name });

  const handleCategoryPress = useCallback((cat) => {
    transitioning.current = true;
    setSelectedCategory(cat.slug);
    setSelectedCategoryName(cat.name);
    setShowCategoryGrid(false);
    scrollY.setValue(0);
  }, [scrollY]);

  const handleBackToCategories = () => {
    setSelectedCategory('');
    setSelectedCategoryName('');
    setSearch('');
    setDebouncedSearch('');
    setShowCategoryGrid(true);
    scrollY.setValue(0);
  };

  const handleClearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
    if (!selectedCategory) setShowCategoryGrid(true);
  };

  const showSuggestions =
    searchFocused && search.length === 0 && recentSearches.length > 0;

  // ── Category grid ──────────────────────────────────────────────────────────
  const renderCategoryGrid = () => {
    if (catsLoading) return <LoadingSpinner full />;
    const COLS = IS_MOBILE ? 2 : 4;
    return (
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <View style={styles.categoryGridHeader}>
          <Text style={styles.categoryGridTitle}>Shop by Category</Text>
          <Text style={styles.categoryGridSub}>
            Select a category to browse our mobility products
          </Text>
        </View>

        <WebContentGutter>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id?.toString() ?? item.slug}
            numColumns={COLS}
            key={`catgrid-${COLS}`}
            contentContainerStyle={styles.categoryGrid}
            columnWrapperStyle={styles.categoryGridRow}
            renderItem={({ item }) => (
              <CategoryCard category={item} onPress={handleCategoryPress} />
            )}
            scrollEnabled={false}
          />
        </WebContentGutter>

        <SiteFooter onTabPress={switchTab} />
      </Animated.ScrollView>
    );
  };

  // ── Product list ───────────────────────────────────────────────────────────
  const renderProductList = () => {
    if (loading) transitioning.current = false;
    if (error) return <ErrorView message={error} onRetry={refresh} />;
    if (loading || transitioning.current) return <LoadingSpinner full />;
    if (products.length === 0) {
      return (
        <EmptyState
          icon="🔍"
          title="No products found"
          message="Try adjusting your search or browse a different category."
          action="Browse Categories"
          onAction={handleBackToCategories}
        />
      );
    }
    return (
      <FlatList
        data={products}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={NUM_COLUMNS}
        key={`prodgrid-${NUM_COLUMNS}`}
        contentContainerStyle={styles.productGrid}
        columnWrapperStyle={styles.productRow}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            style={styles.productCard}
            onPress={handleProductPress}
          />
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
        {!showCategoryGrid && (
          <TouchableOpacity
            style={styles.backChip}
            onPress={handleBackToCategories}
            activeOpacity={0.7}
          >
            <Text style={styles.backChipText}>‹ All</Text>
          </TouchableOpacity>
        )}
        <TextInput
          style={styles.searchInput}
          placeholder={
            selectedCategoryName
              ? `Search in ${selectedCategoryName}…`
              : 'Search inventory…'
          }
          placeholderTextColor={Colors.gray400}
          value={search}
          onChangeText={setSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Recent search suggestions */}
      {showSuggestions && (
        <View style={styles.suggestions}>
          {recentSearches.slice(0, 5).map((term) => (
            <TouchableOpacity
              key={term}
              style={styles.suggestionRow}
              onPress={() => {
                setSearch(term);
                setSearchFocused(false);
                setShowCategoryGrid(false);
              }}
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

      {/* Breadcrumb (product list only) */}
      {!showCategoryGrid && selectedCategoryName ? (
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText} numberOfLines={1}>
            {selectedCategoryName}
          </Text>
          {!loading && (
            <Text style={styles.breadcrumbCount}>
              {products.length}
              {hasMore ? '+' : ''} item{products.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      ) : null}

      {/* Main content */}
      {showCategoryGrid ? (
        renderCategoryGrid()
      ) : (
        <Animated.ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
        >
          <WebContentGutter>{renderProductList()}</WebContentGutter>
          <SiteFooter onTabPress={switchTab} />
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.sm },
  backChip: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 1, borderRadius: Radius.full },
  backChipText: { color: Colors.white, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold },
  searchInput: { flex: 1, fontSize: Typography.sizes.base, color: Colors.black, paddingVertical: Spacing.sm },
  clearBtn: { fontSize: 16, color: Colors.gray400, paddingHorizontal: Spacing.sm },

  suggestions: { backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  suggestionIcon: { fontSize: 14 },
  suggestionText: { flex: 1, fontSize: Typography.sizes.base, color: Colors.black },
  suggestionRemove: { fontSize: 12, color: Colors.gray400 },

  breadcrumb: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.primaryDark ?? Colors.primary, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  breadcrumbText: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.white, flex: 1 },
  breadcrumbCount: { fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.65)', marginLeft: Spacing.sm },

  categoryGridHeader: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.base, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  categoryGridTitle: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.xs },
  categoryGridSub: { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.7)' },
  categoryGrid: { padding: Spacing.md },
  categoryGridRow: { justifyContent: 'flex-start', marginBottom: Spacing.sm, gap: CARD_GAP },

  categoryCard: { width: CARD_WIDTH, backgroundColor: Colors.primary, borderRadius: Radius.lg, overflow: 'hidden', shadowColor: Colors.black, shadowOpacity: 0.8, shadowRadius: Radius.lg, borderWidth: IS_MOBILE ? 2 : 5, borderColor: Colors.border },
  categoryImageFrame: { width: CAT_IMG_SIZE, height: CAT_IMG_SIZE, backgroundColor: Colors.white },
  categoryImage: { width: CAT_IMG_SIZE, height: CAT_IMG_SIZE },
  categoryPlaceholder: { width: CAT_IMG_SIZE, height: CAT_IMG_SIZE, backgroundColor: Colors.gray50 },
  categoryCardName: { fontSize: IS_MOBILE ? Typography.sizes.lg : Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.white, textAlign: 'center', marginTop: Spacing.md, marginBottom: Spacing.md, paddingHorizontal: Spacing.md },

  productGrid: { padding: Spacing.sm, paddingBottom: Spacing.base },
  productRow: { justifyContent: 'flex-start', marginBottom: Spacing.sm, gap: CARD_GAP },
  productCard: { width: CARD_WIDTH },
});

export default InventoryScreen;