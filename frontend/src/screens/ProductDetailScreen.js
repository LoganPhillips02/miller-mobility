import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  StyleSheet, Dimensions, Linking, ActivityIndicator,
} from 'react-native';
import { useProduct } from '../hooks/useApi';
import { normalizeProduct, getProductImageUrl, CONDITION_COLORS, STATUS_COLORS } from '../models/product';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHONE_NUMBER = 'tel:+12625494900';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const { product: raw, loading, error } = useProduct(productId);
  const [imageIndex, setImageIndex] = useState(0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !raw) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Product not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const product = normalizeProduct(raw);

  // Build image list: primary first, then extras
  const allImages = [
    ...(product.primaryImageUrl ? [{ imageUrl: product.primaryImageUrl, altText: product.name }] : []),
    ...product.images.filter(img => img.imageUrl && img.imageUrl !== product.primaryImageUrl),
  ];

  const conditionStyle = CONDITION_COLORS[product.condition] ?? CONDITION_COLORS.new;
  const statusStyle    = STATUS_COLORS[product.status]       ?? STATUS_COLORS.available;

  const specs = Object.entries(product.specifications ?? {});

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── Image gallery ── */}
      {allImages.length > 0 ? (
        <View style={styles.gallery}>
          <Image
            source={{ uri: allImages[imageIndex]?.imageUrl }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          {allImages.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
              {allImages.map((img, i) => (
                <TouchableOpacity key={i} onPress={() => setImageIndex(i)} activeOpacity={0.8}>
                  <Image
                    source={{ uri: img.imageUrl }}
                    style={[styles.thumb, i === imageIndex && styles.thumbActive]}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No image available</Text>
        </View>
      )}

      {/* ── Details ── */}
      <View style={styles.details}>
        {/* Category + badges */}
        <View style={styles.badgeRow}>
          <Text style={styles.categoryLabel}>{product.categoryName}</Text>
          <View style={[styles.badge, { backgroundColor: conditionStyle.bg }]}>
            <Text style={[styles.badgeText, { color: conditionStyle.text }]}>{product.conditionDisplay}</Text>
          </View>
          {product.status !== 'available' && (
            <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.badgeText, { color: statusStyle.text }]}>{product.statusDisplay}</Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>{product.name}</Text>
        {product.brandName ? <Text style={styles.brand}>{product.brandName}</Text> : null}
        {product.sku       ? <Text style={styles.sku}>SKU: {product.sku}</Text>    : null}

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{product.displayPrice}</Text>
          {product.savings ? (
            <Text style={styles.savings}>Save ${product.savings.toLocaleString()}</Text>
          ) : null}
        </View>

        {/* CTA buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.primaryCta}
            onPress={() => Linking.openURL(PHONE_NUMBER)}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryCtaText}>📞 Call for Price / Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryCta}
            onPress={() => navigation.navigate('Contact', { productName: product.name })}
            activeOpacity={0.88}
          >
            <Text style={styles.secondaryCtaText}>Send Inquiry</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        {product.description || product.shortDescription ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Product</Text>
            <Text style={styles.description}>{product.description || product.shortDescription}</Text>
          </View>
        ) : null}

        {/* Specifications */}
        {specs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specsTable}>
              {specs.map(([key, value], i) => (
                <View key={key} style={[styles.specRow, i % 2 === 0 && styles.specRowAlt]}>
                  <Text style={styles.specKey}>{formatSpecKey(key)}</Text>
                  <Text style={styles.specValue}>{formatSpecValue(value)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Related category */}
        <TouchableOpacity
          style={styles.relatedCat}
          onPress={() => navigation.navigate('Products', { categorySlug: product.categorySlug, categoryName: product.categoryName })}
          activeOpacity={0.8}
        >
          <Text style={styles.relatedCatText}>Browse all {product.categoryName} →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSpecKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatSpecValue(value) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined) return '—';
  return String(value);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },

  gallery:   { backgroundColor: COLORS.surface },
  mainImage: { width: SCREEN_WIDTH, height: 280, backgroundColor: COLORS.surfaceAlt },
  thumbRow:  { padding: SPACING.sm, gap: SPACING.xs },
  thumb:     { width: 64, height: 64, borderRadius: RADIUS.sm, borderWidth: 2, borderColor: 'transparent', backgroundColor: COLORS.surfaceAlt },
  thumbActive: { borderColor: COLORS.primary },
  noImage:   { width: SCREEN_WIDTH, height: 240, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  noImageText: { fontFamily: FONTS.regular, color: COLORS.textMuted },

  details: { padding: SPACING.lg },

  badgeRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, alignItems: 'center', marginBottom: SPACING.sm },
  categoryLabel: { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginRight: 4 },
  badge:         { borderRadius: RADIUS.sm, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:     { fontFamily: FONTS.semiBold, fontSize: 11 },

  name:  { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.text, marginBottom: 4 },
  brand: { fontFamily: FONTS.medium, fontSize: 15, color: COLORS.textSecondary, marginBottom: 2 },
  sku:   { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm, marginBottom: SPACING.md },
  price:    { fontFamily: FONTS.bold, fontSize: 24, color: COLORS.primary },
  savings:  { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.success },

  ctaRow:         { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  primaryCta:     { flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  primaryCtaText: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.white },
  secondaryCta:   { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.primary },
  secondaryCtaText: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.primary },

  section:      { marginBottom: SPACING.lg },
  sectionTitle: { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.text, marginBottom: SPACING.sm },
  description:  { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },

  specsTable: { borderRadius: RADIUS.md, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  specRow:    { flexDirection: 'row', padding: SPACING.sm, paddingHorizontal: SPACING.md },
  specRowAlt: { backgroundColor: COLORS.surfaceAlt },
  specKey:    { flex: 1, fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  specValue:  { flex: 1, fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, textAlign: 'right' },

  relatedCat:     { marginTop: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, alignItems: 'center' },
  relatedCatText: { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.primary },

  errorTitle: { fontFamily: FONTS.bold, fontSize: 20, color: COLORS.text, marginBottom: SPACING.md },
  backBtn:    { padding: SPACING.md },
  backBtnText:{ fontFamily: FONTS.medium, fontSize: 16, color: COLORS.primary },
});