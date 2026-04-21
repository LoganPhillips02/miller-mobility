import React from 'react';
import {
  View,
  Text,
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
import DealCard from '../components/DealCard';
import { LoadingSpinner, ErrorView, EmptyState } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';
import { WEB_LAYOUT_BREAKPOINT } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';
import { useDeals } from '../hooks/useDeals';
import { createDeal } from '../models';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_WEB_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH >= WEB_LAYOUT_BREAKPOINT;

// ─── Main screen ──────────────────────────────────────────────────────────────
const DealsScreen = ({ navigation }) => {
  const { switchTab, scrollY } = useTabNavigation();
  const { deals: rawDeals, loading, error, refetch } = useDeals();

  const deals = rawDeals.map(createDeal);

  const handleDealPress = (deal) => {
    if (navigation && deal.slug) {
      navigation.navigate('DealDetail', { slug: deal.slug });
    }
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner full />;
    if (error) return <ErrorView message={error?.message ?? 'Failed to load deals'} onRetry={refetch} />;
    if (deals.length === 0) {
      return (
        <EmptyState
          icon="🏷️"
          title="No deals right now"
          message="Check back soon for special offers and promotions."
        />
      );
    }

    return (
      <WebContentGutter>
        <View style={styles.list}>
          {deals.map((deal) => (
            <DealCard
              key={deal.id ?? deal.slug}
              deal={deal}
              onPress={handleDealPress}
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
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Current Deals</Text>
        <Text style={styles.headerSub}>Special offers, financing &amp; promotions</Text>
      </View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {renderContent()}
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
  list: { paddingVertical: Spacing.base, paddingHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.md, gap: Spacing.lg },

  callStrip: { backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg, marginTop: Spacing.sm },
  callStripTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.xs },
  callStripText: { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.8)', lineHeight: Typography.sizes.sm * 1.6, marginBottom: Spacing.md },
  callButton: { backgroundColor: Colors.white, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, alignSelf: 'flex-start' },
  callButtonText: { color: Colors.primary, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },
});

export default DealsScreen;
