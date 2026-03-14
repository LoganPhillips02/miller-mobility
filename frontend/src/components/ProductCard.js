import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { ConditionBadge } from './ui';
import { useFavorites } from '../hooks/useFavorites';

const ProductCard = ({ product, onPress, style }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress?.(product)}
      activeOpacity={0.85}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {product.primaryImage ? (
          <Image source={{ uri: product.primaryImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>🚐</Text>
          </View>
        )}

        {product.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
          </View>
        )}

        {product.status === 'sold' && (
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        )}

        {/* Favorite button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(product.id)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text style={styles.heartIcon}>{favorited ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>{product.categoryName}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

        {product.conversionDetails && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {product.conversionDetails.entryTypeDisplay} ·{' '}
            {product.conversionDetails.conversionBrand || product.brandName}
          </Text>
        )}

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{product.displayPrice}</Text>
            {product.savings != null && (
              <Text style={styles.savings}>Save ${Number(product.savings).toLocaleString()}</Text>
            )}
          </View>
          <ConditionBadge condition={product.condition} conditionDisplay={product.conditionDisplay} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  imageContainer: {
    height: 180,
    backgroundColor: Colors.gray50,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: { fontSize: 48 },
  featuredBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  featuredText: {
    color: Colors.white,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldText: {
    color: Colors.white,
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.heavy,
    letterSpacing: 4,
  },
  heartButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: Radius.full,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: { fontSize: 16 },
  content: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  category: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    lineHeight: Typography.sizes.base * 1.3,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray600,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  price: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  savings: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.success,
  },
});

export default ProductCard;