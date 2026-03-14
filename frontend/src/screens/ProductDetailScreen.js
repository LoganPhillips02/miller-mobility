import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Linking,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { useProduct } from '../hooks/useProducts';
import { LoadingSpinner, ErrorView, ConditionBadge, StatusBadge, Divider, PrimaryButton } from '../components/ui';
import SiteFooter from '../components/SiteFooter';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SpecRow = ({ label, value }) => (
  <View style={styles.specRow}>
    <Text style={styles.specLabel}>{label}</Text>
    <Text style={styles.specValue}>{value}</Text>
  </View>
);

const ProductDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { product, loading, error } = useProduct(id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (loading) return <LoadingSpinner full />;
  if (error) return <ErrorView message={error} onRetry={() => {}} />;
  if (!product) return null;

  const images = product.images.length > 0
    ? product.images
    : product.primaryImage
    ? [{ id: 0, imageUrl: product.primaryImage }]
    : [];

  const handleCallPress = () => Linking.openURL('tel:+1-XXX-XXX-XXXX');
  const handleEmailPress = () =>
    Linking.openURL(`mailto:info@millermobility.com?subject=Interest in: ${product.name}`);

  const conv = product.conversionDetails;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        {images.length > 0 ? (
          <View>
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(img) => img.id?.toString()}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setActiveImageIndex(index);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            />
            {images.length > 1 && (
              <View style={styles.imageDots}>
                {images.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i === activeImageIndex && styles.dotActive]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ fontSize: 64 }}>🚐</Text>
          </View>
        )}

        <View style={styles.body}>
          {/* Category + Badges */}
          <View style={styles.badgeRow}>
            <Text style={styles.categoryLabel}>{product.categoryName}</Text>
            <View style={styles.badgesRight}>
              <ConditionBadge condition={product.condition} conditionDisplay={product.conditionDisplay} />
              <StatusBadge status={product.status} statusDisplay={product.statusDisplay} />
            </View>
          </View>

          {/* Name */}
          <Text style={styles.name}>{product.name}</Text>
          {product.brandName && <Text style={styles.brand}>{product.brandName}</Text>}

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>{product.displayPrice}</Text>
            {product.msrp && product.savings && (
              <View>
                <Text style={styles.msrp}>MSRP: ${Number(product.msrp).toLocaleString()}</Text>
                <Text style={styles.savings}>You save: ${Number(product.savings).toLocaleString()}</Text>
              </View>
            )}
          </View>

          <Divider />

          {/* Vehicle Conversion Details */}
          {conv && (
            <>
              <Text style={styles.sectionTitle}>Vehicle Details</Text>
              <View style={styles.specsCard}>
                <SpecRow label="Year / Make / Model" value={`${conv.year} ${conv.make} ${conv.model}${conv.trim ? ' ' + conv.trim : ''}`} />
                {conv.mileage && <SpecRow label="Mileage" value={`${Number(conv.mileage).toLocaleString()} mi`} />}
                {conv.color && <SpecRow label="Color" value={conv.color} />}
                <SpecRow label="Entry Type" value={conv.entryTypeDisplay} />
                <SpecRow label="Body Style" value={conv.bodyStyleDisplay} />
                {conv.conversionBrand && <SpecRow label="Conversion" value={conv.conversionBrand} />}
                {conv.rampLengthInches && <SpecRow label="Ramp Length" value={`${conv.rampLengthInches}″`} />}
                {conv.loweredFloorInches && <SpecRow label="Lowered Floor" value={`${conv.loweredFloorInches}″`} />}
                {conv.doorOpeningHeightInches && <SpecRow label="Door Height" value={`${conv.doorOpeningHeightInches}″`} />}
                {conv.doorOpeningWidthInches && <SpecRow label="Door Width" value={`${conv.doorOpeningWidthInches}″`} />}
                <SpecRow
                  label="Driver in Wheelchair"
                  value={conv.driverCanRemainInWheelchair ? '✅ Yes' : '❌ No'}
                />
              </View>
              <Divider />
            </>
          )}

          {/* General Specifications */}
          {Object.keys(product.specifications).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Specifications</Text>
              <View style={styles.specsCard}>
                {Object.entries(product.specifications).map(([key, val]) => (
                  <SpecRow
                    key={key}
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    value={String(val)}
                  />
                ))}
              </View>
              <Divider />
            </>
          )}

          {/* Description */}
          {product.description ? (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
              <Divider />
            </>
          ) : null}

          {/* SKU / Model Number */}
          {(product.modelNumber || product.sku) && (
            <View style={styles.metaRow}>
              {product.modelNumber && <Text style={styles.meta}>Model: {product.modelNumber}</Text>}
              {product.sku && <Text style={styles.meta}>SKU: {product.sku}</Text>}
            </View>
          )}
        </View>
        <SiteFooter navigation={navigation} />
      </ScrollView>

      {/* Sticky Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleEmailPress}>
          <Text style={styles.secondaryButtonText}>✉️ Email</Text>
        </TouchableOpacity>
        <PrimaryButton
          title="📞 Call Us"
          onPress={handleCallPress}
          style={styles.callButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  image: { width: SCREEN_WIDTH, height: 280 },
  imagePlaceholder: {
    height: 280,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageDots: {
    position: 'absolute',
    bottom: Spacing.sm,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: { backgroundColor: Colors.white },
  body: {
    padding: Spacing.base,
    paddingBottom: Spacing['5xl'],
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  categoryLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badgesRight: { flexDirection: 'row', gap: Spacing.xs },
  name: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.heavy,
    color: Colors.black,
    marginBottom: Spacing.xs,
    lineHeight: Typography.sizes['2xl'] * 1.2,
  },
  brand: {
    fontSize: Typography.sizes.base,
    color: Colors.gray600,
    marginBottom: Spacing.base,
  },
  priceSection: { marginVertical: Spacing.md, gap: Spacing.xs },
  price: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.heavy,
    color: Colors.primary,
  },
  msrp: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray400,
    textDecorationLine: 'line-through',
  },
  savings: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.success,
  },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  specsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.base,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  specLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray600,
    flex: 1,
  },
  specValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
    textAlign: 'right',
    flex: 1,
  },
  description: {
    fontSize: Typography.sizes.base,
    color: Colors.gray600,
    lineHeight: Typography.sizes.base * 1.7,
    marginBottom: Spacing.base,
  },
  metaRow: { flexDirection: 'row', gap: Spacing.lg },
  meta: { fontSize: Typography.sizes.sm, color: Colors.gray400 },
  footer: {
    flexDirection: 'row',
    padding: Spacing.base,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  callButton: { flex: 2 },
});

export default ProductDetailScreen;