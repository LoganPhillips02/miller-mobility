import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

// ─── Footer links (right column) ─────────────────────────────────────────────
const FOOTER_LINKS = [
  { label: 'Home',                  onPress: null /* handled via navigation prop */ },
  { label: 'Wheelchair Accessible Vehicles', url: null },
  { label: 'Power Wheelchairs',     url: null },
  { label: 'Mobility Scooters',     url: null },
  { label: 'Vehicle Lifts & Ramps', url: null },
  { label: 'Deals & Financing',     url: null },
  { label: 'Contact Us',            url: null },
  { label: 'Privacy Policy',        url: 'https://www.millermobility.com/privacy' },
];

/**
 * SiteFooter
 *
 * Props:
 *   navigation  – React Navigation prop (optional). If supplied, tapping nav
 *                 links will navigate; otherwise they are rendered as plain text.
 */
const SiteFooter = ({ navigation }) => {
  const handleLinkPress = (link) => {
    if (link.url) {
      Linking.openURL(link.url);
      return;
    }
    if (!navigation) return;
    // Map label → screen name
    const screenMap = {
      'Home': 'Home',
      'Deals & Financing': 'Deals',
      'Contact Us': 'Contact',
    };
    const categoryMap = {
      'Wheelchair Accessible Vehicles': 'wheelchair-accessible-vehicles',
      'Power Wheelchairs': 'power-wheelchairs',
      'Mobility Scooters': 'scooters',
      'Vehicle Lifts & Ramps': 'lifts',
    };
    if (screenMap[link.label]) {
      navigation.navigate(screenMap[link.label]);
    } else if (categoryMap[link.label]) {
      navigation.navigate('Inventory', {
        category: categoryMap[link.label],
        categoryName: link.label,
      });
    }
  };

  return (
    <View style={styles.footer}>
      {/* Top accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.inner}>
        {/* ── Left column: contact info ─────────────────────────────────── */}
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
            <Text style={styles.hoursLine}>M–F:&nbsp; 9 a.m. – 5 p.m.</Text>
            <Text style={styles.hoursLine}>Sat:&nbsp; 10 a.m. – 2 p.m.</Text>
          </View>
        </View>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <View style={styles.divider} />

        {/* ── Right column: nav links ───────────────────────────────────── */}
        <View style={styles.linksColumn}>
          <Text style={styles.linksHeading}>QUICK LINKS</Text>
          {FOOTER_LINKS.map((link) => (
            <TouchableOpacity
              key={link.label}
              style={styles.linkRow}
              onPress={() => handleLinkPress(link)}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Miller Mobility Products. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.primaryDark ?? '#001F3F',
    marginTop: Spacing['2xl'],
  },

  accentBar: {
    height: 4,
    backgroundColor: Colors.accent ?? '#E63946',
  },

  inner: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },

  // ── Contact column ──
  contactColumn: {
    flex: 1,
  },

  expertHeading: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.heavy,
    color: Colors.accent ?? '#E63946',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },

  phone: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.heavy,
    color: Colors.white,
    marginBottom: Spacing.md,
  },

  companyName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: 2,
  },

  address: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: Typography.sizes.sm * 1.6,
  },

  hoursBlock: {
    marginTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: Spacing.md,
  },

  hoursLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.heavy,
    color: Colors.accent ?? '#E63946',
    letterSpacing: 1.2,
    marginBottom: Spacing.xs,
  },

  hoursLine: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: Typography.sizes.sm * 1.7,
  },

  // ── Vertical divider ──
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'stretch',
  },

  // ── Links column ──
  linksColumn: {
    flex: 1,
    paddingLeft: Spacing.sm,
  },

  linksHeading: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.heavy,
    color: Colors.accent ?? '#E63946',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },

  linkRow: {
    paddingVertical: Spacing.xs + 2,
  },

  linkText: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: Typography.weights.medium,
  },

  // ── Bottom copyright bar ──
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },

  copyright: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
});

export default SiteFooter;