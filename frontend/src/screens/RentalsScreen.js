import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Linking,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import SiteFooter from '../components/SiteFooter';
import { useTabNavigation } from '../navigation/TabNavigationContext';

const RENTAL_ITEMS = [
  { icon: '🪑', title: 'Power Lift Recliners',  desc: 'Try before you buy, or cover a short-term medical need. Push-button assist to stand up and sit down safely.' },
  { icon: '🏥', title: 'Patient Lifts',          desc: 'Portable lifts for safe transfers between rooms, bedside, or bath-side — manual or powered steering.' },
  { icon: '⚡', title: 'Power Chairs',           desc: 'Indoor/outdoor power chairs in a variety of sizes. Travel multiple miles on a single charge.' },
  { icon: '🛴', title: 'Scooters',               desc: 'Electric scooters for local travel around Waukesha County — perfect for visitors or short-term needs.' },
  { icon: '🪜', title: 'Stairlifts',             desc: 'Short-term stairlift rentals delivered and installed. Ideal for post-surgery recovery.' },
  { icon: '♿', title: 'Wheelchair Ramps',        desc: 'Portable and modular ramp rentals for home or vehicle access while you recover or host guests.' },
];

const RentalsScreen = () => {
  const { switchTab } = useTabNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>FLEXIBLE OPTIONS</Text>
          <Text style={styles.heroTitle}>Medical Supply Rentals</Text>
          <Text style={styles.heroSub}>
            Recovering from surgery? Hosting a visitor? Need equipment for a day, a week, or a month?
            We've got you covered — pick up in store or we'll deliver.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => Linking.openURL('tel:+12625494900')}
          >
            <Text style={styles.heroButtonText}>📞 Call 262-549-4900</Text>
          </TouchableOpacity>
        </View>

        {/* Rental items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rentals</Text>
          {RENTAL_ITEMS.map((item) => (
            <View key={item.title} style={styles.card}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaBlock}>
          <Text style={styles.ctaTitle}>Not sure what you need?</Text>
          <Text style={styles.ctaText}>
            Our experts will help you find the right rental solution. Stop by our showroom or give us a call.
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => switchTab('Contact')}>
            <Text style={styles.ctaButtonText}>Contact Us →</Text>
          </TouchableOpacity>
        </View>

        <SiteFooter onTabPress={switchTab} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: Colors.background },
  hero:            { backgroundColor: Colors.primary, padding: Spacing.xl, paddingTop: Spacing['2xl'] },
  heroTag:         { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: Spacing.sm },
  heroTitle:       { fontSize: Typography.sizes['3xl'], fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.sm },
  heroSub:         { fontSize: Typography.sizes.base, color: 'rgba(255,255,255,0.75)', marginBottom: Spacing.lg, lineHeight: Typography.sizes.base * 1.5 },
  heroButton:      { backgroundColor: Colors.white, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, alignSelf: 'flex-start' },
  heroButtonText:  { color: Colors.primary, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },
  section:         { padding: Spacing.base, paddingTop: Spacing.xl },
  sectionTitle:    { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.md },
  card:            { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.md, flexDirection: 'row', gap: Spacing.md, ...Shadows.sm },
  cardIcon:        { fontSize: 36, marginTop: 2 },
  cardBody:        { flex: 1 },
  cardTitle:       { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.xs },
  cardDesc:        { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.5 },
  ctaBlock:        { margin: Spacing.base, backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg },
  ctaTitle:        { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.xs },
  ctaText:         { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.75)', marginBottom: Spacing.md, lineHeight: Typography.sizes.sm * 1.5 },
  ctaButton:       { backgroundColor: Colors.white, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: Radius.full, alignSelf: 'flex-start' },
  ctaButtonText:   { color: Colors.primary, fontWeight: Typography.weights.bold },
});

export default RentalsScreen;