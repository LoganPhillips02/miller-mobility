import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';
import { useDeals } from '../hooks/useDeals';
import DealCard from '../components/DealCard';
import SiteFooter from '../components/SiteFooter';
import { LoadingSpinner, ErrorView, EmptyState } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';
import { WEB_LAYOUT_BREAKPOINT } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_WEB_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH >= WEB_LAYOUT_BREAKPOINT;

const DealsScreen = ({ navigation }) => {
  const { switchTab, scrollY } = useTabNavigation();
  const { deals, loading, error, refresh } = useDeals();

  if (error) return <ErrorView message={error} onRetry={refresh} />;

  const renderBody = () => {
    if (loading && deals.length === 0) return <LoadingSpinner full />;
    if (deals.length === 0) return (
      <EmptyState
        icon="🏷️"
        title="No active deals right now"
        message="Check back soon for new promotions and financing offers."
      />
    );
    return (
      <FlatList
        data={deals}
        keyExtractor={(item) => item.id?.toString() ?? item.slug}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DealCard
            deal={item}
            onPress={(d) => navigation.navigate('DealDetail', { slug: d.slug })}
          />
        )}
        onRefresh={refresh}
        refreshing={loading && deals.length > 0}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        scrollEnabled={false}
      />
    );
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
        <WebContentGutter>{renderBody()}</WebContentGutter>
        <SiteFooter onTabPress={switchTab} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: Colors.background },
  header:      { backgroundColor: Colors.primary, paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg },
  headerTitle: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.white },
  headerSub:   { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: Spacing.xs },
  list: {
    paddingVertical: Spacing.base,
    paddingHorizontal: IS_WEB_DESKTOP ? 0 : Spacing.base,
  },
});

export default DealsScreen;