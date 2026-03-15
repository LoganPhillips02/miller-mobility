import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

const SOCIAL_LINKS = [
  { label: 'Facebook',   logo: require('../../assets/Facebook-Logo.png'),  url: 'https://www.facebook.com/millermobility/' },
  { label: 'Instagram',  logo: require('../../assets/Instagram-Logo.webp'), url: 'https://www.instagram.com/millermobilitywi' },
  { label: 'YouTube',    logo: require('../../assets/Youtube-Logo.png'),   url: 'https://www.youtube.com/@MillerMobility' },
  { label: 'Google',     logo: require('../../assets/Google-Logo.webp'),   url: 'https://www.google.com/maps/place/Miller+Mobility+Products,+Inc/@43.0615539,-88.4685821,17z' },
  { label: 'Home\nAdvisor',logo: require('../../assets/HA-Logo.png'),        url: 'https://www.homeadvisor.com/rated.MillerMobilityProducts.62162732.html' },
  { label: 'BBB',        logo: require('../../assets/BBB-Logo.png'),       url: 'https://www.bbb.org/us/wi/oconomowoc/profile/wheelchair-ramps/miller-mobility-products-inc-0694-17001935#bbbonlineclick' },
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

      {/* ── Right: 2x3 logo grid ── */}
      <View style={styles.linksColumn}>
        <Text style={styles.linksHeading}>CONNECT WITH US</Text>
        <View style={styles.linksGrid}>
          {SOCIAL_LINKS.map((link) => (
            <TouchableOpacity
              key={link.label}
              style={styles.linkGridItem}
              onPress={() => Linking.openURL(link.url)}
              activeOpacity={0.7}
            >
              <Image source={link.logo} style={styles.linkLogo} resizeMode="contain" />
              <Text style={styles.linkText}>{link.label}</Text>
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
  footer:        { backgroundColor: '#001F3F', marginTop: Spacing['2xl'] },
  accentBar:     { height: 4, backgroundColor: Colors.accent ?? '#E63946' },
  inner:         { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.lg, gap: Spacing.lg, alignItems: 'center' },
  contactColumn: { flex: 1 },
  expertHeading: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, color: Colors.accent ?? '#E63946', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.sm },
  phone:         { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.md },
  companyName:   { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.white, marginBottom: 2 },
  address:       { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.65)', lineHeight: Typography.sizes.sm * 1.6 },
  hoursBlock:    { marginTop: Spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: Spacing.md },
  hoursLabel:    { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, color: Colors.accent ?? '#E63946', letterSpacing: 1.2, marginBottom: Spacing.xs },
  hoursLine:     { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.75)', lineHeight: Typography.sizes.sm * 1.7 },
  divider:       { width: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'stretch' },
  linksColumn:   { flex: 1 },
  linksHeading:  { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, color: Colors.accent ?? '#E63946', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.md, textAlign: 'center' },
  linksGrid:     { flexDirection: 'row', flexWrap: 'wrap' },
  linkGridItem:  { width: '33.33%', alignItems: 'center', paddingVertical: Spacing.sm },
  linkLogo:      { width: 40, height: 40 },
  linkText:      { fontSize: 9, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 4, flexShrink: 1 },
  bottomBar:     { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.15)', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  copyright:     { fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
});

export default SiteFooter;