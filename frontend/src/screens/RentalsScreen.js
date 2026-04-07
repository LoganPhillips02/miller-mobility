import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Linking, LayoutAnimation, Platform, UIManager, Animated, Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import SiteFooter from '../components/SiteFooter';
import { useTabNavigation } from '../navigation/TabNavigationContext';
import { WEB_LAYOUT_BREAKPOINT } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_WEB_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH >= WEB_LAYOUT_BREAKPOINT;

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RENTAL_ITEMS = [
  {
    icon: '🪑',
    title: 'Power Lift Recliners',
    desc: 'Push-button assist that gently raises you to a standing position or lowers you back down. Great for post-surgery recovery or short-term medical needs — and a risk-free way to try one before you buy.',
    bullets: [
      'Supports stress-free seating transfers',
      'Ideal for post-operative or short-term medical recovery',
      'Test features & comfort before purchasing',
    ],
  },
  {
    icon: '🏥',
    title: 'Patient Lifts',
    desc: 'Portable lifts for safe, dignified transfers between the bed, wheelchair, bath, or any room. Available in manual or powered-steering models with accessories for a wide range of patient sizes and positions.',
    bullets: [
      'Safe transfers room-to-room, bedside, or bath-side',
      'Manual or powered steering options',
      'Wide range of compatible slings & accessories',
    ],
  },
  {
    icon: '⚡',
    title: 'Power Chairs',
    desc: 'Compact, maneuverable power chairs for indoor and outdoor travel around Waukesha County. Available in multiple sizes with a full charge covering several miles — perfect for visiting guests or short-term needs.',
    bullets: [
      'Indoor & outdoor capable',
      'Multiple sizes available',
      'Multi-mile range on a single charge',
    ],
  },
  {
    icon: '🛵',
    title: 'Mobility Scooters',
    desc: 'Electric scooters for local errands, outings, or travel around southeastern Wisconsin. Our best range model reaches up to 18 miles per charge. Multiple sizes and feature levels available.',
    bullets: [
      'Indoor & outdoor use',
      'Best range model: up to 18 miles per charge',
      'Multiple sizes to match your activities',
    ],
  },
  {
    icon: '🪜',
    title: 'Stairlifts',
    desc: 'Straight stairlift rentals delivered and installed by our factory-trained technicians — ideal when you need safe stair access during recovery and plan to regain independence afterward. Trusted brands only.',
    bullets: [
      'Professional delivery & installation included',
      'Multiple styles & colors to match your home',
      'Backed by our standard rental service agreement',
    ],
  },
  {
    icon: '📐',
    title: 'Wheelchair Ramps',
    desc: 'Portable and modular ramps professionally installed at your home or business. Custom-fit to nearly any incline with minimal modifications to the surrounding area. Great for recovering patients or hosting guests with mobility needs.',
    bullets: [
      'Custom fit to nearly any incline or entry',
      'Professional installation by certified technicians',
      'Backed by our standard rental service agreement',
    ],
  },
];

const RentalCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={toggle} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={expanded ? undefined : 2}>
            {item.desc}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {expanded && (
        <View style={styles.bulletList}>
          {item.bullets.map((b) => (
            <View key={b} style={styles.bulletRow}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const RentalsScreen = () => {
  const { switchTab, scrollY } = useTabNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>FLEXIBLE OPTIONS</Text>
          <Text style={styles.heroTitle}>Medical Equipment Rentals</Text>
          <Text style={styles.heroSub}>
            Recovering from surgery? Hosting a visitor? Traveling to Wisconsin? Whether you need equipment for a day, a week, or a month — pick up in our Oconomowoc showroom or we'll deliver straight to you.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => Linking.openURL('tel:+12625494900')}
          >
            <Text style={styles.heroButtonText}>📞 Call 262-549-4900</Text>
          </TouchableOpacity>
        </View>

        {/* Rental period badges */}
        <View style={styles.periodRow}>
          {['Daily', 'Weekly', 'Monthly'].map((p) => (
            <View key={p} style={styles.periodBadge}>
              <Text style={styles.periodText}>{p}</Text>
            </View>
          ))}
        </View>

        <WebContentGutter>
        {/* Rental items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rentals</Text>
          <Text style={styles.sectionSub}>Tap any item to learn more</Text>
          {RENTAL_ITEMS.map((item) => (
            <RentalCard key={item.title} item={item} />
          ))}
        </View>

        {/* Installation callout */}
        <View style={styles.installBlock}>
          <Text style={styles.installTitle}>🔧 Professional Installation Included</Text>
          <Text style={styles.installText}>
            Our factory-trained, certified technicians handle delivery, installation, and pickup for stairlifts and ramps. We've installed hundreds of units across Milwaukee, Oconomowoc, and all of southeastern Wisconsin — so you can count on a smooth, safe setup every time.
          </Text>
        </View>

        {/* Programs callout */}
        <View style={styles.programsBlock}>
          <Text style={styles.programsTitle}>State-Funded Programs Available</Text>
          <Text style={styles.programsText}>
            Miller Mobility is a preferred provider for ADRC, IRIS, CLTS, and ILSP programs through the Wisconsin Department of Health Services. Your case manager may be able to help cover equipment costs if affordability is a concern.
          </Text>
          <TouchableOpacity
            style={styles.programsButton}
            onPress={() => Linking.openURL('https://www.millermobility.com/www.millermobility.com/adrc-vehicle-modification-program')}
          >
            <Text style={styles.programsButtonText}>Learn About ADRC Program →</Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <View style={styles.ctaBlock}>
          <Text style={styles.ctaTitle}>Not sure what you need?</Text>
          <Text style={styles.ctaText}>
            Our experts will help you find the right rental solution. Stop by our showroom or give us a call — we're happy to walk you through every option.
          </Text>
          <View style={styles.ctaRow}>
            <TouchableOpacity style={styles.ctaButton} onPress={() => switchTab('Contact')}>
              <Text style={styles.ctaButtonText}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ctaButton, styles.ctaButtonOutline]}
              onPress={() => Linking.openURL('tel:+12625494900')}
            >
              <Text style={[styles.ctaButtonText, styles.ctaButtonOutlineText]}>📞 Call Us</Text>
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
  safe:               { flex: 1, backgroundColor: Colors.background },

  // ─── Hero ───
  hero:               { backgroundColor: Colors.primary, padding: Spacing.xl, paddingTop: Spacing['2xl'] },
  heroTag:            { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: Spacing.sm },
  heroTitle:          { fontSize: Typography.sizes['3xl'], fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.sm },
  heroSub:            { fontSize: Typography.sizes.base, color: 'rgba(255,255,255,0.75)', marginBottom: Spacing.lg, lineHeight: Typography.sizes.base * 1.5 },
  heroButton:         { backgroundColor: Colors.white, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, alignSelf: 'flex-start' },
  heroButtonText:     { color: Colors.primary, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },

  // ─── Rental period row ───
  periodRow:          { flexDirection: 'row', justifyContent: 'center', gap: Spacing.md, paddingVertical: Spacing.lg, backgroundColor: Colors.primaryLight },
  periodBadge:        { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.full, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  periodText:         { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm, letterSpacing: 0.5 },

  // ─── Section ───
  section:            { paddingBottom: Spacing.base, paddingTop: Spacing.xl, paddingHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.base },
  sectionTitle:       { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.xs },
  sectionSub:         { fontSize: Typography.sizes.sm, color: Colors.gray400, marginBottom: Spacing.lg },

  // ─── Card ───
  card:               { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.md, ...Shadows.sm, borderWidth: 1, borderColor: Colors.border },
  cardHeader:         { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  cardIcon:           { fontSize: 32, marginTop: 2 },
  cardHeaderText:     { flex: 1 },
  cardTitle:          { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.xs },
  cardDesc:           { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.55 },
  chevron:            { fontSize: 12, color: Colors.gray400, marginTop: 6 },

  // ─── Bullet list (expanded) ───
  bulletList:         { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
  bulletRow:          { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  bullet:             { color: Colors.success, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm, width: 18 },
  bulletText:         { flex: 1, fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.5 },

  // ─── Installation callout ───
  installBlock:       { marginVertical: Spacing.base, marginHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.base, backgroundColor: Colors.gray50, borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
  installTitle:       { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.sm },
  installText:        { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.6 },

  // ─── Programs callout ───
  programsBlock:      { marginHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.base, backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.base },
  programsTitle:      { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.white, marginBottom: Spacing.sm },
  programsText:       { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.8)', lineHeight: Typography.sizes.sm * 1.6, marginBottom: Spacing.md },
  programsButton:     { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.full, alignSelf: 'flex-start' },
  programsButtonText: { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm },

  // ─── CTA ───
  ctaBlock:           { marginTop: 0, marginBottom: Spacing.base, marginHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.base },
  ctaTitle:           { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.sm },
  ctaText:            { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.6, marginBottom: Spacing.md },
  ctaRow:             { flexDirection: 'row', gap: Spacing.md },
  ctaButton:          { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.full },
  ctaButtonText:      { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },
  ctaButtonOutline:   { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.primary },
  ctaButtonOutlineText: { color: Colors.primary },
});

export default RentalsScreen;