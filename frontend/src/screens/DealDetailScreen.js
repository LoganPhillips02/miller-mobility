import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { useDeal } from '../hooks/useDeals';
import { dealBadgeText } from '../models';
import { LoadingSpinner, ErrorView, Divider, PrimaryButton } from '../components/ui';

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const DealDetailScreen = ({ route, navigation }) => {
  const { slug } = route.params;
  const { deal, loading, error } = useDeal(slug);

  if (loading) return <LoadingSpinner full />;
  if (error) return <ErrorView message={error} onRetry={() => {}} />;
  if (!deal) return null;

  const badgeText = dealBadgeText(deal);

  const handleContact = () => {
    navigation.navigate('Contact');
  };

  const handleCall = () => Linking.openURL('tel:+1XXXXXXXXXX');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header image or colour block */}
        <View style={[styles.hero, !deal.imageUrl && { backgroundColor: Colors.primary }]}>
          {deal.imageUrl ? (
            <Image source={{ uri: deal.imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroIcon}>🏷️</Text>
            </View>
          )}
          <View style={[styles.badge, { backgroundColor: deal.badgeColor }]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Type + title */}
          <Text style={styles.dealType}>{deal.dealTypeDisplay}</Text>
          <Text style={styles.title}>{deal.title}</Text>

          {/* Expiry warning */}
          {deal.daysRemaining != null && deal.daysRemaining <= 14 && (
            <View style={styles.expiryBanner}>
              <Text style={styles.expiryText}>
                {deal.daysRemaining === 0
                  ? '⚠️ This deal expires today!'
                  : `⏰ Only ${deal.daysRemaining} day${deal.daysRemaining === 1 ? '' : 's'} left`}
              </Text>
            </View>
          )}

          <Divider />

          {/* Description */}
          <Text style={styles.description}>{deal.description}</Text>

          <Divider />

          {/* Deal details card */}
          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Deal Details</Text>

            {deal.discountPercent != null && (
              <InfoRow label="Discount" value={`${deal.discountPercent}% off`} />
            )}
            {deal.discountAmount != null && (
              <InfoRow label="Savings" value={`$${Number(deal.discountAmount).toLocaleString()}`} />
            )}
            {deal.financingApr != null && (
              <InfoRow label="APR" value={`${deal.financingApr}%`} />
            )}
            {deal.financingMonths != null && (
              <InfoRow label="Term" value={`${deal.financingMonths} months`} />
            )}
            {deal.startDate && (
              <InfoRow
                label="Valid from"
                value={deal.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              />
            )}
            {deal.endDate && (
              <InfoRow
                label="Expires"
                value={deal.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              />
            )}
          </View>

          {/* Promo code */}
          {deal.promoCode ? (
            <View style={styles.promoCard}>
              <Text style={styles.promoCardLabel}>Promo Code</Text>
              <Text style={styles.promoCardCode}>{deal.promoCode}</Text>
              <Text style={styles.promoCardNote}>Mention this code when you contact us</Text>
            </View>
          ) : null}

          {/* Products count */}
          {deal.productCount > 0 && (
            <TouchableOpacity
              style={styles.viewProductsButton}
              onPress={() => navigation.navigate('Inventory', { deal: deal.slug })}
            >
              <Text style={styles.viewProductsText}>
                View {deal.productCount} eligible product{deal.productCount !== 1 ? 's' : ''} →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleCall}>
          <Text style={styles.secondaryButtonText}>📞 Call</Text>
        </TouchableOpacity>
        <PrimaryButton
          title="Claim This Deal"
          onPress={handleContact}
          style={styles.claimButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  hero: {
    height: 220,
    position: 'relative',
  },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: { fontSize: 64 },
  badge: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  badgeText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  body: { padding: Spacing.base },
  dealType: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.heavy,
    color: Colors.black,
    lineHeight: Typography.sizes['2xl'] * 1.2,
    marginBottom: Spacing.md,
  },
  expiryBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    marginBottom: Spacing.md,
  },
  expiryText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.gray800,
  },
  description: {
    fontSize: Typography.sizes.base,
    color: Colors.gray600,
    lineHeight: Typography.sizes.base * 1.7,
    marginVertical: Spacing.base,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.base,
  },
  cardTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.gray50,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: Typography.sizes.sm, color: Colors.gray600 },
  infoValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.black,
  },
  promoCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  promoCardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  promoCardCode: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.heavy,
    color: Colors.white,
    letterSpacing: 3,
    marginBottom: Spacing.xs,
  },
  promoCardNote: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  viewProductsButton: {
    padding: Spacing.base,
    alignItems: 'center',
  },
  viewProductsText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
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
  claimButton: { flex: 1 },
});

export default DealDetailScreen;