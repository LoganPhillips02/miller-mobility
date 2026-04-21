import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Linking,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  Dimensions,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { Divider } from '../components/ui';
import SiteFooter from '../components/SiteFooter';
import { useTabNavigation } from '../navigation/TabNavigationContext';
import { WEB_LAYOUT_BREAKPOINT } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_WEB_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH >= WEB_LAYOUT_BREAKPOINT;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── FAQ data from millermobility.com/faqs ────────────────────────────────────
const FAQS = [
  {
    q: 'Will Medicare cover my purchase?',
    a: 'We are an out-of-pocket dealer, which means we do not bill Medicare, Medicaid, or private insurance. All purchases are paid directly by the customer.\n\nMany families still choose this route because it allows them to get the exact equipment they want without waiting for approvals or dealing with coverage limitations. If you\'d like guidance on what to look for or how to choose the right mobility product, we\'re always happy to help.',
  },
  {
    q: 'How do I select the right equipment for me?',
    a: 'Choosing the right mobility equipment starts with understanding your daily needs and the spaces you move through. Think about where you\'ll use the product most, what tasks you want it to make easier, and any comfort or safety features that matter to you. From there, our team can walk you through options, explain the differences, and help you compare models so you feel confident in your choice.\n\nBecause we\'re an out-of-pocket dealer, you\'re free to pick the equipment that truly fits your lifestyle — without waiting on approvals or being limited by insurance requirements. We\'re here to make the process simple, supportive, and stress-free.',
  },
  {
    q: 'What\'s the difference between a power wheelchair and a scooter?',
    a: 'Power wheelchairs and mobility scooters both provide independence, but they\'re designed for different needs. A power wheelchair is built for all-day use, offering excellent stability, tight turning, and customizable seating for people who need more continuous support. A scooter is great for individuals who can sit upright comfortably and want something easy to use for errands, shopping, or getting around larger spaces. Scooters typically have a wider turning radius but are simple to operate and often more portable.\n\nIf you\'re unsure which fits your lifestyle best, our team can walk you through the pros and cons of each so you feel confident in your choice.',
  },
  {
    q: 'How much do stairlifts cost?',
    a: 'A straight stairlift starts at $3,800 including installation. Call us to schedule a free in-home estimate. Stairlifts are an inexpensive alternative to moving out of your home.',
  },
  {
    q: 'Can I try out a mobility device before I buy?',
    a: 'Yes! Come visit our showroom stocked with devices ready for demonstration. Our salespeople are professionally trained and certified to help you select the perfect device to fit your needs.',
  },
  {
    q: 'What\'s the best way to take care of the battery?',
    a: 'To get the longest life and best performance from your mobility battery, charge it regularly and avoid letting it run all the way down. Most batteries do best when they\'re topped off after each use, even if you only went a short distance. Store your equipment in a dry place at a moderate temperature, and if you won\'t be using it for a while, give the battery a full charge every couple of weeks to keep it healthy.',
  },
  {
    q: 'How long will it take to get my equipment?',
    a: 'All in-stock items may be taken home or delivered the next day.',
  },
  {
    q: 'How do I get service after I purchased from Miller Mobility Products?',
    a: 'Your satisfaction is our number 1 priority. Just call us and we\'ll schedule an appointment for you to bring in your equipment or we\'ll come to you.',
  },
  {
    q: 'What forms of payment do you accept?',
    a: 'Visa, Master Card, Discover, check, cash, and we also offer rentals and rent-to-own options.',
  },
  {
    q: 'What kind of warranty do you offer?',
    a: 'All products have a manufacturers\' parts and product warranty. Terms vary depending on the manufacturer. All new installed equipment carries a one-year labor warranty included in the price, provided all work is done by Miller Mobility Products. Used and refurbished equipment is sold AS IS with no warranty.',
  },
  {
    q: 'Do you offer delivery or in-home setup?',
    a: 'Yes — we offer delivery and professional in-home setup for most mobility products. Our team makes sure your equipment is assembled correctly, adjusted for comfort, and ready to use before we leave. This service gives you peace of mind and helps you get comfortable with your new equipment right away.',
  },
];

// ─── Contact items ────────────────────────────────────────────────────────────
const CONTACT_ITEMS = [
  { icon: '📞', label: 'Call Us',   value: '262-549-4900',           action: () => Linking.openURL('tel:+12625494900') },
  { icon: '✉️', label: 'Email',    value: 'info@millermobility.com', action: () => Linking.openURL('mailto:info@millermobility.com') },
  { icon: '📍', label: 'Location', value: 'View on Maps',            action: () => Linking.openURL('https://maps.google.com/?q=36336+N+Summit+Village+Way+Oconomowoc+WI+53066') },
  { icon: '🕐', label: 'Hours',    value: 'M–F 9am–5pm · Sat 10am–2pm', action: null },
];

// ─── FAQ accordion item ───────────────────────────────────────────────────────
const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(v => !v);
  };
  return (
    <TouchableOpacity style={styles.faqItem} onPress={toggle} activeOpacity={0.85}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{q}</Text>
        <Text style={styles.faqChevron}>{open ? '▲' : '▼'}</Text>
      </View>
      {open && <Text style={styles.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
};

// ─── Contact tab content ──────────────────────────────────────────────────────
const ContactTab = ({ switchTab }) => (
  <View style={IS_WEB_DESKTOP ? styles.scrollWebDesktop : styles.scroll}>
    <View style={styles.heroSection}>
      <Text style={styles.heroTitle}>Get in Touch</Text>
      <Text style={styles.heroSub}>Our team is ready to help you find the right mobility solution.</Text>
    </View>

    {CONTACT_ITEMS.map(({ icon, label, value, action }) => (
      <TouchableOpacity
        key={label}
        style={styles.contactCard}
        onPress={action}
        disabled={!action}
        activeOpacity={action ? 0.7 : 1}
      >
        <Text style={styles.contactIcon}>{icon}</Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>{label}</Text>
          <Text style={[styles.contactValue, action && styles.contactValueLink]}>{value}</Text>
        </View>
        {action && <Text style={styles.contactArrow}>›</Text>}
      </TouchableOpacity>
    ))}

    <Divider style={{ marginTop: Spacing.xl }} />

    <View style={styles.promoBlock}>
      <Text style={styles.promoTitle}>🔑 Need Equipment Temporarily?</Text>
      <Text style={styles.promoText}>We rent wheelchairs, scooters, stairlifts, lift chairs, patient lifts, and ramps by the day, week, or month.</Text>
      <TouchableOpacity onPress={() => switchTab('Rentals')} style={styles.promoLink}>
        <Text style={styles.promoLinkText}>View Rentals →</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.promoBlock}>
      <Text style={styles.promoTitle}>🚐 ADRC Vehicle Modification Program</Text>
      <Text style={styles.promoText}>Waukesha County residents may qualify for funding to help cover the cost of vehicle lifts and modifications. You pay only 10%.</Text>
      <TouchableOpacity onPress={() => switchTab('ADRC')} style={styles.promoLink}>
        <Text style={styles.promoLinkText}>Apply Now →</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── FAQs tab content ─────────────────────────────────────────────────────────
const FaqsTab = () => (
  <View style={IS_WEB_DESKTOP ? styles.scrollWebDesktop : styles.scroll}>
    <View style={styles.heroSection}>
      <Text style={styles.heroTitle}>Frequently Asked Questions</Text>
      <Text style={styles.heroSub}>
        We're here to guide you through making the right decision to fit your needs.{' '}
        Call <Text style={styles.heroPhone} onPress={() => Linking.openURL('tel:+12625494900')}>262-549-4900</Text> today to speak to a product expert!
      </Text>
    </View>

    {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}

    <View style={styles.faqCta}>
      <Text style={styles.faqCtaText}>Still have questions? Give us a call — we're always happy to help.</Text>
      <TouchableOpacity style={styles.faqCtaBtn} onPress={() => Linking.openURL('tel:+12625494900')}>
        <Text style={styles.faqCtaBtnText}>📞 Call 262-549-4900</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ContactScreen = () => {
  const { switchTab, scrollY } = useTabNavigation();
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Tab toggle */}
      <View style={styles.tabs}>
        {[
          { key: 'contact', label: '📞 Contact' },
          { key: 'faqs',    label: '❓ FAQs' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >
          <WebContentGutter>
            {activeTab === 'contact'
              ? <ContactTab switchTab={switchTab} />
              : <FaqsTab />
            }
          </WebContentGutter>
          <SiteFooter onTabPress={switchTab} />
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: Colors.background },
  tabs:             { flexDirection: 'row', backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab:              { flex: 1, paddingVertical: Spacing.md, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive:        { borderBottomColor: Colors.primary },
  tabText:          { fontSize: Typography.sizes.base, color: Colors.gray600, fontWeight: Typography.weights.medium },
  tabTextActive:    { color: Colors.primary, fontWeight: Typography.weights.bold },

  scroll:           { paddingHorizontal: Spacing.md, paddingVertical: Spacing.base },
  scrollWebDesktop: { paddingVertical: Spacing.base },

  heroSection:      { backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.lg },
  heroTitle:        { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.white },
  heroSub:          { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs, lineHeight: Typography.sizes.sm * 1.6 },
  heroPhone:        { fontWeight: Typography.weights.bold, color: Colors.white, textDecorationLine: 'underline' },

  contactCard:      { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, ...Shadows.sm },
  contactIcon:      { fontSize: 28 },
  contactInfo:      { flex: 1 },
  contactLabel:     { fontSize: Typography.sizes.sm, color: Colors.gray600 },
  contactValue:     { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.black },
  contactValueLink: { color: Colors.primary },
  contactArrow:     { fontSize: 22, color: Colors.gray400 },

  promoBlock:       { backgroundColor: Colors.gray50, borderRadius: Radius.xl, padding: Spacing.lg, marginTop: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  promoTitle:       { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black },
  promoText:        { fontSize: Typography.sizes.sm, color: Colors.gray600, marginTop: Spacing.xs, lineHeight: Typography.sizes.sm * 1.55 },
  promoLink:        { marginTop: Spacing.md },
  promoLinkText:    { color: Colors.primary, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },

  // ─── FAQs ───
  faqItem:          { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border, ...Shadows.sm },
  faqHeader:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.md },
  faqQ:             { flex: 1, fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.black, lineHeight: Typography.sizes.base * 1.4 },
  faqChevron:       { fontSize: 12, color: Colors.gray400, marginTop: 3 },
  faqA:             { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.65, marginTop: Spacing.md },

  faqCta:           { backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg, marginTop: Spacing.base, marginBottom: Spacing.base, alignItems: 'center' },
  faqCtaText:       { fontSize: Typography.sizes.base, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: Spacing.md },
  faqCtaBtn:        { backgroundColor: Colors.white, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full },
  faqCtaBtnText:    { color: Colors.primary, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },
});

export default ContactScreen;