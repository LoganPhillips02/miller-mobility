import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import SiteFooter from '../components/SiteFooter';
import { LoadingSpinner, ErrorView } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';
import { WEB_LAYOUT_BREAKPOINT } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_WEB_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH >= WEB_LAYOUT_BREAKPOINT;

// ─── Static deals sourced directly from millermobility.com ────────────────────
const DEALS = [
  {
    id: 'april-deal',
    badge: '10% OFF',
    badgeColor: '#E63946',
    dealType: 'DEAL OF THE MONTH',
    title: 'April Deal of the Month — 10% Off Rollators',
    shortDescription:
      'Save 10% on all rollators this month — 3-wheel, 4-wheel, bariatric, and upright models included.',
    description:
      'Spring is here and so is our April Deal of the Month! Take 10% off all rollators for a limited time. Rollators—also called rolling walkers—are one of the most effective mobility aids for staying active, steady, and independent. They combine stability, comfort, and ease of movement in a way traditional walkers simply can\'t. Whether you\'re shopping for yourself or a loved one, we\'re here to help you find the right fit.',
    bullets: [
      '3-wheel, 4-wheel, bariatric & upright models',
      'Padded seats, loop brakes, and storage bags',
      'Lightweight, foldable frames for easy transport',
    ],
    cta: 'Shop Rollators',
    ctaTab: 'Inventory',
    ctaParams: { category: 'walkers-rollators', categoryName: 'Walkers & Rollators' },
    isFeatured: true,
  },
  {
    id: 'veterans',
    badge: '10% OFF',
    badgeColor: '#003366',
    dealType: 'VETERANS APPRECIATION',
    title: 'Veterans Appreciation Savings',
    shortDescription:
      'Veterans receive 10% off their first purchase and 5% off every future purchase — year-round.',
    description:
      'Miller Mobility is proud to honor those who\'ve served. Veterans receive 10% off their first purchase and 5% off every future purchase — our way of saying thank you for your service.\n\nPlus, you\'ll automatically earn Miller Money with every purchase — our exclusive rewards program that lets you save even more on mobility products and accessories.\n\nStop by our showroom today to find the perfect fit and start earning Miller Money!',
    bullets: [
      '10% off your first purchase',
      '5% off every future purchase',
      'Earn Miller Money rewards automatically',
      'Available year-round — active military & veterans',
    ],
    cta: 'Learn More',
    ctaAction: () => Linking.openURL('https://www.millermobility.com/veterans-promos'),
    isFeatured: true,
  },
  {
    id: 'adrc',
    badge: 'FUNDING AVAILABLE',
    badgeColor: '#16A34A',
    dealType: 'ADRC PROGRAM',
    title: 'ADRC Vehicle Modification Program — Funding Is Back',
    shortDescription:
      'Waukesha County residents may qualify for ADRC funding toward vehicle lifts and modifications.',
    description:
      'ADRC vehicle lift funding is back for Waukesha County residents! Miller Mobility is a preferred provider for the ADRC Vehicle Modification Program. Qualified Waukesha County residents may receive funding to help cover the cost of vehicle lifts, hand controls, and other adaptive equipment.\n\nOur team handles the estimate and paperwork — you pay only 10% of the final modification cost. Funding is limited, so don\'t wait.',
    bullets: [
      'Waukesha County residents age 18+ may qualify',
      'Covers vehicle lifts, hand controls & adaptive equipment',
      'Miller Mobility submits the estimate for you',
      'You pay only 10% of the final quote',
    ],
    cta: 'Apply Now',
    ctaTab: 'ADRC',
    isFeatured: true,
  },
  {
    id: 'rentals',
    badge: 'DAILY · WEEKLY · MONTHLY',
    badgeColor: '#475569',
    dealType: 'RENTALS',
    title: 'Medical Equipment Rentals — Flexible Terms',
    shortDescription:
      'Rent wheelchairs, scooters, stairlifts, lift chairs, patient lifts & ramps by the day, week, or month.',
    description:
      'Did you know Miller Mobility offers rentals of wheelchairs, scooters, stairlifts, lift chairs, patient lifts, ramps, medical supplies and walkers? We serve Oconomowoc, Milwaukee and all of Southeast Wisconsin.\n\nRentals are available for a week, day, or month! Perfect for post-surgery recovery, visiting guests, or trying equipment before you buy.',
    bullets: [
      'Wheelchairs, scooters, stairlifts & lift chairs',
      'Patient lifts, ramps, walkers & medical supplies',
      'Daily, weekly, or monthly terms',
      'Pickup in-store or we deliver to you',
    ],
    cta: 'View Rentals',
    ctaTab: 'Rentals',
    isFeatured: false,
  },
];

// ─── Deal card component ──────────────────────────────────────────────────────
const DealCard = ({ deal, onCtaPress }) => (
  <View style={[styles.card, deal.isFeatured && styles.cardFeatured]}>
    {/* Badge */}
    <View style={[styles.badgeWrap, { backgroundColor: deal.badgeColor }]}>
      <Text style={styles.badgeText}>{deal.badge}</Text>
    </View>

    <Text style={styles.dealType}>{deal.dealType}</Text>
    <Text style={styles.title}>{deal.title}</Text>
    <Text style={styles.shortDesc}>{deal.shortDescription}</Text>

    {/* Bullets */}
    <View style={styles.bulletList}>
      {deal.bullets.map((b) => (
        <View key={b} style={styles.bulletRow}>
          <Text style={styles.bulletCheck}>✓</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>

    {/* Description */}
    <Text style={styles.description}>{deal.description}</Text>

    {/* CTA */}
    <TouchableOpacity
      style={[styles.ctaButton, { backgroundColor: deal.badgeColor }]}
      onPress={onCtaPress}
      activeOpacity={0.85}
    >
      <Text style={styles.ctaButtonText}>{deal.cta} →</Text>
    </TouchableOpacity>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const DealsScreen = () => {
  const { switchTab, scrollY } = useTabNavigation();

  const handleCtaPress = (deal) => {
    if (deal.ctaAction) {
      deal.ctaAction();
    } else if (deal.ctaTab) {
      switchTab(deal.ctaTab, deal.ctaParams ?? undefined);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Current Deals</Text>
        <Text style={styles.headerSub}>Special offers, financing & promotions</Text>
      </View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <WebContentGutter>
          <View style={styles.list}>
            {DEALS.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onCtaPress={() => handleCtaPress(deal)}
              />
            ))}

            {/* Call strip */}
            <View style={styles.callStrip}>
              <Text style={styles.callStripTitle}>Questions about any deal?</Text>
              <Text style={styles.callStripText}>
                Our team is happy to walk you through eligibility, financing terms, or help you find the right product.
              </Text>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => Linking.openURL('tel:+12625494900')}
              >
                <Text style={styles.callButtonText}>📞 Call 262-549-4900</Text>
              </TouchableOpacity>
            </View>
          </View>
        </WebContentGutter>

        <SiteFooter onTabPress={switchTab} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg },
  headerTitle: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.white },
  headerSub: { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.xs },
  list: { paddingVertical: Spacing.base, paddingHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.base, gap: Spacing.lg },

  // ─── Card ───
  card: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, ...Shadows.md },
  cardFeatured: { borderWidth: 2, borderColor: Colors.primary },

  badgeWrap: { alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full, marginBottom: Spacing.sm },
  badgeText: { color: Colors.white, fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, letterSpacing: 0.8, textTransform: 'uppercase' },
  dealType: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: Colors.gray400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing.xs },
  title: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.xs, lineHeight: Typography.sizes.lg * 1.3 },
  shortDesc: { fontSize: Typography.sizes.base, color: Colors.gray600, lineHeight: Typography.sizes.base * 1.55, marginBottom: Spacing.md },

  // ─── Bullets ───
  bulletList: { backgroundColor: Colors.gray50, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, gap: Spacing.xs },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  bulletCheck: { color: Colors.success, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base, width: 18, marginTop: 1 },
  bulletText: { flex: 1, fontSize: Typography.sizes.sm, color: Colors.gray800, lineHeight: Typography.sizes.sm * 1.55 },

  description: { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.65, marginBottom: Spacing.lg },

  ctaButton: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, alignSelf: 'flex-start', alignItems: 'center' },
  ctaButtonText: { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },

  // ─── Call strip ───
  callStrip: { backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg, marginTop: Spacing.sm },
  callStripTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.xs },
  callStripText: { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.8)', lineHeight: Typography.sizes.sm * 1.6, marginBottom: Spacing.md },
  callButton: { backgroundColor: Colors.white, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, alignSelf: 'flex-start' },
  callButtonText: { color: Colors.primary, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },
});

export default DealsScreen;