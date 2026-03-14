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
import SiteFooter from '../components/SiteFooter';
import { LoadingSpinner, ErrorView, ConditionBadge, StatusBadge, Divider, PrimaryButton } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SpecRow = ({ label, value }) => (
  <View style={styles.specRow}>
    <Text style={styles.specLabel}>{label}</Text>
    <Text style={styles.specValue}>{value}</Text>
  </View>
);

const ProductDetailScreen = ({ route, navigation }) => {
  const { switchTab } = useTabNavigation();
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

  const handleCallPress  = () => Linking.openURL('tel:+12625494900');
  const handleEmailPress = () => Linking.openURL(`mailto:info@millermobility.com?subject=Interest in: ${product.name}`);
  const conv = product.conversionDetails;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Image Gallery */}
        {images.length > 0 ? (
          <View>
            <FlatList
              data={images}
              keyExtractor={(item) => item.id?.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
              }}
              renderItem={({ item }) => (
                <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
              )}
            />
            {images.length > 1 && (
              <View style={styles.imageDots}>
                {images.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activeImageIndex && styles.dotActive]} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ fontSize: 64 }}>🚐</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.body}>
          <View style={styles.badgeRow}>
            <ConditionBadge condition={product.condition} />
            <StatusBadge status={product.status} />
          </View>

          <Text style={styles.name}>{product.name}</Text>

          {product.price && (
            <Text style={styles.price}>${product.price.toLocaleString()}</Text>
          )}

          {product.shortDescription ? (
            <Text style={styles.shortDesc}>{product.shortDescription}</Text>
          ) : null}

          <Divider />

          {/* Conversion details */}
          {conv && (
            <>
              <Text style={styles.sectionTitle}>Conversion Details</Text>
              <View style={styles.specsCard}>
                {conv.rampType      && <SpecRow label="Ramp Type"       value={conv.rampType} />}
                {conv.floorType     && <SpecRow label="Floor Type"       value={conv.floorType} />}
                {conv.doorWidth     && <SpecRow label="Door Width"       value={`${conv.doorWidth}"`} />}
                {conv.interiorHeight && <SpecRow label="Interior Height" value={`${conv.interiorHeight}"`} />}
                {conv.capacity      && <SpecRow label="Capacity"         value={`${conv.capacity} lbs`} />}
              </View>
              <Divider />
            </>
          )}

          {/* Specs */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Specifications</Text>
              <View style={styles.specsCard}>
                {Object.entries(product.specifications).map(([k, v]) => (
                  <SpecRow key={k} label={k.replace(/_/g, ' ')} value={String(v)} />
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

          {(product.modelNumber || product.sku) && (
            <View style={styles.metaRow}>
              {product.modelNumber && <Text style={styles.meta}>Model: {product.modelNumber}</Text>}
              {product.sku         && <Text style={styles.meta}>SKU: {product.sku}</Text>}
            </View>
          )}
        </View>

        {/* Footer — inside ScrollView so it scrolls with the content */}
        <SiteFooter onTabPress={switchTab} />

      </ScrollView>

      {/* Sticky CTA bar */}
      <View style={styles.ctaBar}>
        <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
          <Text style={styles.emailButtonText}>✉️ Email</Text>
        </TouchableOpacity>
        <PrimaryButton title="📞 Call Us" onPress={handleCallPress} style={styles.callButton} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  image: { width: SCREEN_WIDTH, height: 280 },
  imagePlaceholder: { height: 280, backgroundColor: Colors.gray50, alignItems: 'center', justifyContent: 'center' },
  imageDots: { position: 'absolute', bottom: Spacing.sm, width: '100%', flexDirection: 'row', justifyContent: 'center', gap: Spacing.xs },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: Colors.white },
  body: { padding: Spacing.base },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  name: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.xs },
  price: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.primary, marginBottom: Spacing.sm },
  shortDesc: { fontSize: Typography.sizes.base, color: Colors.gray600, lineHeight: Typography.sizes.base * 1.6, marginBottom: Spacing.md },
  sectionTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.sm },
  specsCard: { borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.base },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm + 2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  specLabel: { fontSize: Typography.sizes.sm, color: Colors.gray600, flex: 1 },
  specValue: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.black, textAlign: 'right', flex: 1 },
  description: { fontSize: Typography.sizes.base, color: Colors.gray600, lineHeight: Typography.sizes.base * 1.7, marginBottom: Spacing.base },
  metaRow: { flexDirection: 'row', gap: Spacing.lg },
  meta: { fontSize: Typography.sizes.sm, color: Colors.gray400 },
  ctaBar: { flexDirection: 'row', padding: Spacing.base, paddingBottom: Spacing.lg, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.md },
  emailButton: { flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primary },
  emailButtonText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.primary },
  callButton: { flex: 2 },
});

export default ProductDetailScreen;