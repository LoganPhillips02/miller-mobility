import React, { useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, RefreshControl, ActivityIndicator, Dimensions,
} from 'react-native';
import { useFeaturedProducts, useCategories, useActiveDeals } from '../hooks/useApi';
import { normalizeProduct, normalizeCategory, normalizeDeal, getProductImageUrl } from '../models/product';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - SPACING.lg * 3) / 2;

export default function HomeScreen({ navigation }) {
  const { products: rawProducts, loading: pLoading, refetch: refetchProducts } = useFeaturedProducts();
  const { categories: rawCats,   loading: cLoading, refetch: refetchCats }     = useCategories();
  const { deals: rawDeals,       loading: dLoading, refetch: refetchDeals }     = useActiveDeals();

  const loading = pLoading && cLoading && dLoading;

  const products   = rawProducts.map(normalizeProduct);
  const categories = rawCats.map(normalizeCategory);
  const deals      = rawDeals.map(normalizeDeal);

  const onRefresh = useCallback(() => {
    refetchProducts(); refetchCats(); refetchDeals();
  }, [refetchProducts, refetchCats, refetchDeals]);

  const heroDeal = deals.find(d => d.isFeatured) ?? deals[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* ── Hero banner ── */}
      {heroDeal && (
        <TouchableOpacity
          style={styles.heroBanner}
          onPress={() => navigation.navigate('Deals')}
          activeOpacity={0.92}
        >
          {heroDeal.imageUrl ? (
            <Image source={{ uri: heroDeal.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroFallback}>
              <Text style={styles.heroFallbackBadge}>{heroDeal.badgeLabel || 'Special Offer'}</Text>
              <Text style={styles.heroFallbackTitle}>{heroDeal.title}</Text>
              <Text style={styles.heroFallbackSub}>{heroDeal.shortDescription}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* ── Categories ── */}
      <SectionHeader title="Shop by Category" onPress={() => navigation.navigate('Products')} />
      {cLoading ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {categories.map(cat => (
            <CategoryChip
              key={cat.id}
              category={cat}
              onPress={() => navigation.navigate('Products', { categorySlug: cat.slug, categoryName: cat.name })}
            />
          ))}
        </ScrollView>
      )}

      {/* ── Featured products ── */}
      <SectionHeader
        title="Featured Products"
        onPress={() => navigation.navigate('Products', { featured: true })}
      />
      {pLoading ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} />
      ) : products.length === 0 ? (
        <EmptyState message="No featured products right now. Check back soon!" />
      ) : (
        <View style={styles.productGrid}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id, productName: product.name })}
            />
          ))}
        </View>
      )}

      {/* ── Active deals strip ── */}
      {deals.length > 0 && (
        <>
          <SectionHeader title="Current Deals" onPress={() => navigation.navigate('Deals')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealsRow}>
            {deals.map(deal => (
              <DealChip
                key={deal.id}
                deal={deal}
                onPress={() => navigation.navigate('Deals')}
              />
            ))}
          </ScrollView>
        </>
      )}

      {/* ── Contact CTA ── */}
      <TouchableOpacity
        style={styles.ctaBanner}
        onPress={() => navigation.navigate('Contact')}
        activeOpacity={0.88}
      >
        <Text style={styles.ctaTitle}>Have questions?</Text>
        <Text style={styles.ctaBody}>Our product experts are ready to help you find the right solution.</Text>
        <View style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Contact Us →</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, onPress }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.sectionLink}>See all →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function CategoryChip({ category, onPress }) {
  return (
    <TouchableOpacity style={styles.catChip} onPress={onPress} activeOpacity={0.8}>
      {category.imageUrl ? (
        <Image source={{ uri: category.imageUrl }} style={styles.catChipImage} />
      ) : (
        <View style={styles.catChipImagePlaceholder} />
      )}
      <Text style={styles.catChipLabel} numberOfLines={2}>{category.name}</Text>
    </TouchableOpacity>
  );
}

function ProductCard({ product, onPress }) {
  const imageUrl = getProductImageUrl(product);
  return (
    <TouchableOpacity style={[styles.productCard, { width: CARD_WIDTH }]} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.productImageWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="contain" />
        ) : (
          <View style={styles.productImagePlaceholder}>
            <Text style={styles.productImagePlaceholderText}>No Image</Text>
          </View>
        )}
        {product.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>Featured</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory} numberOfLines={1}>{product.categoryName}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productPrice}>{product.displayPrice}</Text>
      </View>
    </TouchableOpacity>
  );
}

function DealChip({ deal, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.dealChip, { borderLeftColor: deal.badgeColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {deal.badgeLabel && (
        <View style={[styles.dealBadge, { backgroundColor: deal.badgeColor }]}>
          <Text style={styles.dealBadgeText}>{deal.badgeLabel}</Text>
        </View>
      )}
      <Text style={styles.dealTitle} numberOfLines={2}>{deal.title}</Text>
      {deal.shortDescription && (
        <Text style={styles.dealDesc} numberOfLines={2}>{deal.shortDescription}</Text>
      )}
      {deal.daysRemaining !== null && (
        <Text style={styles.dealExpiry}>Ends in {deal.daysRemaining} day{deal.daysRemaining !== 1 ? 's' : ''}</Text>
      )}
    </TouchableOpacity>
  );
}

function EmptyState({ message }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content:   { paddingBottom: SPACING.xl * 2 },

  // Hero
  heroBanner:          { margin: SPACING.md, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.md },
  heroImage:           { width: '100%', height: 180 },
  heroFallback:        { backgroundColor: COLORS.primary, padding: SPACING.lg, minHeight: 160, justifyContent: 'center' },
  heroFallbackBadge:   { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 13, letterSpacing: 1.2, marginBottom: 6, opacity: 0.85 },
  heroFallbackTitle:   { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 20, marginBottom: 6 },
  heroFallbackSub:     { color: COLORS.white, fontFamily: FONTS.regular, fontSize: 13, opacity: 0.9 },

  // Section header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: SPACING.md, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  sectionTitle:  { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.text },
  sectionLink:   { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.primary },

  // Categories
  catRow:          { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  catChip:         { alignItems: 'center', width: 80 },
  catChipImage:    { width: 70, height: 70, borderRadius: RADIUS.md, marginBottom: 6, backgroundColor: COLORS.surfaceAlt },
  catChipImagePlaceholder: { width: 70, height: 70, borderRadius: RADIUS.md, marginBottom: 6, backgroundColor: COLORS.surfaceAlt },
  catChipLabel:    { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },

  // Product grid
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, paddingHorizontal: SPACING.lg, marginTop: SPACING.xs },
  productCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  productImageWrap: { width: '100%', height: 140, backgroundColor: COLORS.surfaceAlt, position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  productImagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  productImagePlaceholderText: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted },
  featuredBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.primary, borderRadius: RADIUS.sm, paddingHorizontal: 7, paddingVertical: 3 },
  featuredBadgeText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 10 },
  productInfo: { padding: SPACING.sm },
  productCategory: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.textSecondary, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
  productName: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginBottom: 5 },
  productPrice: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.primary },

  // Deals
  dealsRow:     { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  dealChip:     { width: 240, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, borderLeftWidth: 4, ...SHADOW.sm },
  dealBadge:    { alignSelf: 'flex-start', borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3, marginBottom: SPACING.xs },
  dealBadgeText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 11 },
  dealTitle:    { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.text, marginBottom: 4 },
  dealDesc:     { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  dealExpiry:   { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.danger },

  // CTA
  ctaBanner: { margin: SPACING.md, marginTop: SPACING.lg, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.lg },
  ctaTitle:  { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.white, marginBottom: 6 },
  ctaBody:   { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.white, opacity: 0.9, marginBottom: SPACING.md },
  ctaButton: { alignSelf: 'flex-start', backgroundColor: COLORS.white, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  ctaButtonText: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.primary },

  // Loader / empty
  loader:     { marginVertical: SPACING.xl },
  emptyState: { padding: SPACING.xl, alignItems: 'center' },
  emptyText:  { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});