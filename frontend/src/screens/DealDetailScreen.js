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
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useDeal } from '../hooks/useDeals';
import { dealBadgeText } from '../models';
import SiteFooter from '../components/SiteFooter';
import { LoadingSpinner, ErrorView, Divider, PrimaryButton } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const DealDetailScreen = ({ route, navigation }) => {
  const { switchTab } = useTabNavigation();
  const { slug } = route.params;
  const { deal, loading, error } = useDeal(slug);

  if (loading) return <LoadingSpinner full />;
  if (error)   return <ErrorView message={error} onRetry={() => {}} />;
  if (!deal)   return null;

  const badgeText = dealBadgeText(deal);
  const handleCall = () => Linking.openURL('tel:+12625494900');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
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
          <Text style={styles.dealType}>{deal.dealTypeDisplay}</Text>
          <Text style={styles.title}>{deal.title}</Text>

          {deal.daysRemaining != null && deal.daysRemaining <= 14 && (
            <View style={styles.expiryBanner}>
              <Text style={styles.expiryText}>
                {deal.daysRemaining === 0
                  ? '⚠️ This deal expires today!'
                  : `⏰ Only ${deal.daysRemaining} day${deal.daysRemaining === 1 ? '' : 's'} left`}
              </Text>
            </View>
          )}

          <Text style={styles.description}>{deal.description}</Text>
          <Divider />

          {/* Deal specifics */}
          {deal.discountAmount && <InfoRow label="Savings"        value={`$${deal.discountAmount.toLocaleString()}`} />}
          {deal.financingApr != null && <InfoRow label="APR"      value={`${deal.financingApr}%`} />}
          {deal.financingMonths    && <InfoRow label="Term"        value={`${deal.financingMonths} months`} />}
          {deal.promoCode          && (
            <View style={styles.promoCard}>
              <Text style={styles.promoCardLabel}>Promo Code</Text>
              <Text style={styles.promoCardCode}>{deal.promoCode}</Text>
              <Text style={styles.promoCardNote}>Mention this code when you contact us</Text>
            </View>
          )}

          <TouchableOpacity style={styles.viewProductsButton} onPress={() => switchTab('Inventory')}>
            <Text style={styles.viewProductsText}>Browse Qualifying Inventory →</Text>
          </TouchableOpacity>
        </View>

        {/* Footer — inside ScrollView so it scrolls with content */}
        <SiteFooter onTabPress={switchTab} />

      </ScrollView>

      {/* Sticky CTA bar */}
      <View style={styles.ctaBar}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => switchTab('Contact')}>
          <Text style={styles.secondaryButtonText}>✉️ Inquire</Text>
        </TouchableOpacity>
        <PrimaryButton title="📞 Call Us" onPress={handleCall} style={styles.claimButton} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  hero: { height: 220, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroIcon: { fontSize: 64 },
  badge: { position: 'absolute', bottom: Spacing.md, left: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  badgeText: { color: Colors.white, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold },
  body: { padding: Spacing.base },
  dealType: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: Colors.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.xs },
  title: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.sm },
  expiryBanner: { backgroundColor: '#FFF3CD', borderRadius: Radius.md, padding: Spacing.sm, marginBottom: Spacing.md },
  expiryText: { fontSize: Typography.sizes.sm, color: '#856404', fontWeight: Typography.weights.semibold },
  description: { fontSize: Typography.sizes.base, color: Colors.gray600, lineHeight: Typography.sizes.base * 1.7, marginBottom: Spacing.base },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border },
  infoLabel: { fontSize: Typography.sizes.base, color: Colors.gray600 },
  infoValue: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.black },
  promoCard: { backgroundColor: Colors.primary, borderRadius: Radius.lg, padding: Spacing.lg, alignItems: 'center', marginVertical: Spacing.base },
  promoCardLabel: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.sm },
  promoCardCode: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.white, letterSpacing: 3, marginBottom: Spacing.xs },
  promoCardNote: { fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.7)' },
  viewProductsButton: { padding: Spacing.base, alignItems: 'center' },
  viewProductsText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.primary },
  ctaBar: { flexDirection: 'row', padding: Spacing.base, paddingBottom: Spacing.lg, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.md },
  secondaryButton: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primary },
  secondaryButtonText: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.bold, color: Colors.primary },
  claimButton: { flex: 1 },
});

export default DealDetailScreen;