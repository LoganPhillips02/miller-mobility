import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Linking, Animated, Platform, Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import SiteFooter from '../components/SiteFooter';
import { useTabNavigation } from '../navigation/TabNavigationContext';
import { WEB_LAYOUT_BREAKPOINT } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_WEB_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH >= WEB_LAYOUT_BREAKPOINT;

const VALUES = [
  { icon: '🏆', title: 'Decades of Expertise',     desc: 'Mike Miller began working in mobility equipment in the 1990s with Bruno — one of our key manufacturers.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Family Owned Since 2004', desc: 'Mike and Val opened Miller Mobility in Waukesha in 2004. Their kids have since joined the team, making it a true family business.' },
  { icon: '📍', title: 'Proudly Local',             desc: 'We moved to Oconomowoc in 2021 and serve southeastern Wisconsin — from Milwaukee to Madison and beyond.' },
  { icon: '🐕', title: 'A Welcoming Environment',   desc: 'Our two golden retrievers greet customers and remind us that comfort and warmth matter as much as the products we sell.' },
];

const COUNTIES = 'Waukesha, Milwaukee, Walworth, Kenosha, Racine, Dane, Sheboygan, Rock, Green, Columbia, Dodge, Fond du Lac, Jefferson, Ozaukee';

const AboutScreen = () => {
  const { switchTab, scrollY } = useTabNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>FAMILY OWNED SINCE 2004</Text>
          <Text style={styles.heroTitle}>About Miller Mobility</Text>
          <Text style={styles.heroSub}>
            At Miller Mobility, family isn't just part of our story — it's the foundation of everything we do.
          </Text>
        </View>

        <WebContentGutter>
        {/* Story */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.bodyText}>
            What began as a small, local operation has grown into a trusted resource for families across southeastern Wisconsin. Our roots go back to the 1990s, when Mike Miller worked for Bruno, gaining firsthand experience with mobility equipment and the people who depend on it.
          </Text>
          <Text style={styles.bodyText}>
            That passion led Mike and his wife Val to open their own mobility company in Waukesha in 2004. Over the years it became a true family effort — Val stepped into a central leadership role and their kids eventually joined the team, bringing new energy while keeping the same values at the heart of everything.
          </Text>
          <Text style={styles.bodyText}>
            In 2021, Miller Mobility moved to Oconomowoc, where we continue to serve customers with honesty, care, and decades of hands-on expertise.
          </Text>
        </View>

        {/* Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          {VALUES.map((v) => (
            <View key={v.title} style={styles.card}>
              <Text style={styles.cardIcon}>{v.icon}</Text>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{v.title}</Text>
                <Text style={styles.cardDesc}>{v.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Mission */}
        <View style={styles.missionBlock}>
          <Text style={styles.missionLabel}>OUR MISSION</Text>
          <Text style={styles.missionText}>
            To improve the lives of individuals with mobility challenges by providing top-quality equipment, sales, service, and exceptional personal service — so every customer stays independent, comfortable, and confident.
          </Text>
        </View>

        {/* Service area */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Area</Text>
          <Text style={styles.bodyText}>
            We proudly serve {COUNTIES} counties across Wisconsin, including Milwaukee, Kenosha, Racine, Waukesha, Madison, Green Bay, Sheboygan, Oshkosh, Appleton, and Fond du Lac.
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaBlock}>
          <Text style={styles.ctaTitle}>Ready to get started?</Text>
          <View style={styles.ctaRow}>
            <TouchableOpacity style={styles.ctaButton} onPress={() => switchTab('Contact')}>
              <Text style={styles.ctaButtonText}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctaButton, styles.ctaButtonOutline]} onPress={() => Linking.openURL('tel:+12625494900')}>
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
  hero:               { backgroundColor: Colors.primary, padding: Spacing.xl, paddingTop: Spacing['2xl'] },
  heroTag:            { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: Spacing.sm },
  heroTitle:          { fontSize: Typography.sizes['3xl'], fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.sm },
  heroSub:            { fontSize: Typography.sizes.base, color: 'rgba(255,255,255,0.75)', lineHeight: Typography.sizes.base * 1.5 },
  section:            { paddingBottom: Spacing.base, paddingTop: Spacing.xl, paddingHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.base },
  sectionTitle:       { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.md },
  bodyText:           { fontSize: Typography.sizes.base, color: Colors.gray600, lineHeight: Typography.sizes.base * 1.6, marginBottom: Spacing.md },
  card:               { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.md, flexDirection: 'row', gap: Spacing.md, ...Shadows.sm },
  cardIcon:           { fontSize: 32, marginTop: 2 },
  cardBody:           { flex: 1 },
  cardTitle:          { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.xs },
  cardDesc:           { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.5 },
  missionBlock:       { marginVertical: Spacing.base, marginHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.base, backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg },
  missionLabel:       { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Spacing.sm },
  missionText:        { fontSize: Typography.sizes.base, color: Colors.white, lineHeight: Typography.sizes.base * 1.6 },
  ctaBlock:           { marginTop: 0, marginBottom: Spacing.base, marginHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.base },
  ctaTitle:           { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.md },
  ctaRow:             { flexDirection: 'row', gap: Spacing.md },
  ctaButton:          { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.full },
  ctaButtonText:      { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },
  ctaButtonOutline:   { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.primary },
  ctaButtonOutlineText: { color: Colors.primary },
});

export default AboutScreen;