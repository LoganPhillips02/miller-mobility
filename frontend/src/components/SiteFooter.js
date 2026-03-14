/**
 * SiteFooter.js
 * Place at: src/components/SiteFooter.js
 *
 * Props:
 *   onTabPress(tabKey)  — from useTabNavigation().switchTab, passed in by each screen
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

const FOOTER_LINKS = [
  { label: 'Home',                           tab: 'Home' },
  { label: 'Wheelchair Accessible Vehicles', tab: 'Inventory' },
  { label: 'Power Wheelchairs',              tab: 'Inventory' },
  { label: 'Mobility Scooters',              tab: 'Inventory' },
  { label: 'Vehicle Lifts & Ramps',          tab: 'Inventory' },
  { label: 'Deals & Financing',              tab: 'Deals' },
  { label: 'Contact Us',                     tab: 'Contact' },
  { label: 'Privacy Policy',                 url: 'https://www.millermobility.com/privacy' },
];

const SiteFooter = ({ onTabPress }) => (
  <View style={styles.footer}>
    <View style={styles.accentBar} />

    <View style={styles.inner}>
      {/* ── Left: contact info ── */}
      <View style={styles.contactColumn}>
        <Text style={styles.expertHeading}>ASK OUR EXPERTS</Text>

        <TouchableOpacity onPress={() => Linking.openURL('tel:+12625494900')}>
          <Text style={styles.phone}>262-549-4900</Text>
        </TouchableOpacity>

        <Text style={styles.companyName}>Miller Mobility Products</Text>
        <Text style={styles.address}>36336 N. Summit Village Way</Text>
        <Text style={styles.address}>Oconomowoc, WI 53066</Text>

        <View style={styles.hoursBlock}>
          <Text style={styles.hoursLabel}>HOURS:</Text>
          <Text style={styles.hoursLine}>M–F:{'  '}9 a.m. – 5 p.m.</Text>
          <Text style={styles.hoursLine}>Sat:{'  '}10 a.m. – 2 p.m.</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ── Right: nav links ── */}
      <View style={styles.linksColumn}>
        <Text style={styles.linksHeading}>QUICK LINKS</Text>
        {FOOTER_LINKS.map((link) => (
          <TouchableOpacity
            key={link.label}
            style={styles.linkRow}
            onPress={() => link.url ? Linking.openURL(link.url) : onTabPress?.(link.tab)}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    <View style={styles.bottomBar}>
      <Text style={styles.copyright}>
        © {new Date().getFullYear()} Miller Mobility Products. All rights reserved.
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  footer:       { backgroundColor: '#001F3F', marginTop: Spacing['2xl'] },
  accentBar:    { height: 4, backgroundColor: Colors.accent ?? '#E63946' },
  inner:        { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.lg, gap: Spacing.lg },
  contactColumn:{ flex: 1 },
  expertHeading:{ fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, color: Colors.accent ?? '#E63946', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.sm },
  phone:        { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.md },
  companyName:  { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.white, marginBottom: 2 },
  address:      { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.65)', lineHeight: Typography.sizes.sm * 1.6 },
  hoursBlock:   { marginTop: Spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: Spacing.md },
  hoursLabel:   { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, color: Colors.accent ?? '#E63946', letterSpacing: 1.2, marginBottom: Spacing.xs },
  hoursLine:    { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.75)', lineHeight: Typography.sizes.sm * 1.7 },
  divider:      { width: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'stretch' },
  linksColumn:  { flex: 1, paddingLeft: Spacing.sm },
  linksHeading: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, color: Colors.accent ?? '#E63946', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.md },
  linkRow:      { paddingVertical: Spacing.xs + 2 },
  linkText:     { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.75)', fontWeight: Typography.weights.medium },
  bottomBar:    { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.15)', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  copyright:    { fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
});

export default SiteFooter;