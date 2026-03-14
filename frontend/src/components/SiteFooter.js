/**
 * SiteFooter.js
 * Place at: src/components/SiteFooter.js
 *
 * Props:
 *   onTabPress(tabKey)  — from useTabNavigation().switchTab, passed in by each screen
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

const SOCIAL_LINKS = [
  { logo: require('../../assets/Facebook-Logo.png'), url: 'https://www.facebook.com/millermobility/', },
  { logo: require('../../assets/Instagram-Logo.webp'), url: 'https://www.instagram.com/millermobilitywi', },
  { logo: require('../../assets/Youtube-Logo.png'), url: 'https://www.youtube.com/@MillerMobility', },
  { logo: require('../../assets/Google-Logo.webp'), url: 'https://www.google.com/maps/place/Miller+Mobility+Products,+Inc/@43.0615539,-88.4685821,17z/data=!4m6!3m5!1s0x8805af487b7a9977:0xa87616f7fcb38223!8m2!3d43.0615539!4d-88.4685821!16s%2Fg%2F1tdp10v5?entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D', },
  { logo: require('../../assets/HA-Logo.png'), url: 'https://www.homeadvisor.com/rated.MillerMobilityProducts.62162732.html', },
  { logo: require('../../assets/BBB-Logo.png'), url: 'https://www.bbb.org/us/wi/oconomowoc/profile/wheelchair-ramps/miller-mobility-products-inc-0694-17001935#bbbonlineclick', },
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

      {/* ── Right: social & reviews ── */}
      <View style={styles.linksColumn}>
        <Text style={styles.linksHeading}>CONNECT WITH US</Text>
        <View style={styles.linksGrid}>
          {SOCIAL_LINKS.map((link) => (
            <TouchableOpacity
              key={link.logo}
              style={styles.linkGridItem}
              onPress={() => Linking.openURL(link.url)}
              activeOpacity={0.7}
            >
              <Image source={link.logo} style={styles.linkLogo} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>
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
  linksGrid:    { flexDirection: 'row', flexWrap: 'wrap' },
  linkGridItem: { width: '50%', flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs + 2, gap: Spacing.xl, paddingRight: Spacing.xl },
  linkLogo:     { width: 40, height: 40 },
  linkText:     { fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.75)', fontWeight: Typography.weights.medium, flexShrink: 1 },
  linkRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs + 2, gap: Spacing.sm },
  bottomBar:    { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.15)', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  copyright:    { fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
});

export default SiteFooter;