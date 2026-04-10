import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Linking,
} from 'react-native';
import { useActiveDeals } from '../hooks/useApi';
import { normalizeDeal } from '../models/product';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

const PHONE_NUMBER = 'tel:+12625494900';

export default function DealsScreen({ navigation }) {
  const { deals: rawDeals, loading, error, refetch } = useActiveDeals();
  const deals = rawDeals.map(normalizeDeal);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading current deals…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Couldn't load deals</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={deals}
      keyExtractor={d => String(d.id)}
      renderItem={({ item }) => <DealCard deal={item} navigation={navigation} />}
      ListHeaderComponent={<ListHeader />}
      ListEmptyComponent={<EmptyState />}
      showsVerticalScrollIndicator={false}
    />
  );
}

function ListHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Current Deals & Promotions</Text>
      <Text style={styles.headerSub}>
        Family-owned since 2004 — Miller Mobility always has something special for our customers.
      </Text>
    </View>
  );
}

function DealCard({ deal, navigation }) {
  const handleCta = () => {
    if (deal.dealType === 'program') {
      navigation.navigate('Contact', { subject: deal.title });
    } else {
      navigation.navigate('Products');
    }
  };

  return (
    <View style={[styles.card, { borderTopColor: deal.badgeColor }]}>
      {deal.imageUrl ? (
        <Image source={{ uri: deal.imageUrl }} style={styles.cardImage} resizeMode="cover" />
      ) : null}

      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          {deal.badgeLabel ? (
            <View style={[styles.badge, { backgroundColor: deal.badgeColor }]}>
              <Text style={styles.badgeText}>{deal.badgeLabel}</Text>
            </View>
          ) : null}
          {deal.daysRemaining !== null && (
            <Text style={styles.expiry}>
              {deal.daysRemaining === 0 ? 'Ends today!' : `Ends in ${deal.daysRemaining} day${deal.daysRemaining !== 1 ? 's' : ''}`}
            </Text>
          )}
        </View>

        <Text style={styles.cardTitle}>{deal.title}</Text>
        <Text style={styles.cardDesc}>{deal.description}</Text>

        {deal.promoCode ? (
          <View style={styles.promoRow}>
            <Text style={styles.promoLabel}>Promo code:</Text>
            <View style={styles.promoCode}>
              <Text style={styles.promoCodeText}>{deal.promoCode}</Text>
            </View>
          </View>
        ) : null}

        {deal.financingMonths && deal.financingApr !== null && (
          <View style={styles.financingRow}>
            <Text style={styles.financingText}>
              {deal.financingApr === 0
                ? `0% APR for ${deal.financingMonths} months`
                : `${deal.financingApr}% APR — ${deal.financingMonths} months`}
            </Text>
          </View>
        )}

        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaBtn} onPress={handleCta} activeOpacity={0.88}>
            <Text style={styles.ctaBtnText}>
              {deal.dealType === 'program' ? 'Learn More' : 'Shop Now'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(PHONE_NUMBER)} activeOpacity={0.88}>
            <Text style={styles.callBtnText}>📞 Call Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No active deals right now</Text>
      <Text style={styles.emptyBody}>Check back soon or call us — we always have something for you!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content:   { paddingBottom: SPACING.xl * 2 },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },

  header:      { padding: SPACING.lg },
  headerTitle: { fontFamily: FONTS.bold, fontSize: 22, color: COLORS.text, marginBottom: 6 },
  headerSub:   { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },

  card:      { backgroundColor: COLORS.surface, marginHorizontal: SPACING.md, marginBottom: SPACING.md, borderRadius: RADIUS.lg, overflow: 'hidden', borderTopWidth: 4, ...SHADOW.md },
  cardImage: { width: '100%', height: 180 },
  cardBody:  { padding: SPACING.lg },

  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  badge:      { borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText:  { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 12 },
  expiry:     { fontFamily: FONTS.medium, fontSize: 12, color: COLORS.danger },

  cardTitle:  { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text, marginBottom: 8 },
  cardDesc:   { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SPACING.md },

  promoRow:      { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  promoLabel:    { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  promoCode:     { backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.sm, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.border },
  promoCodeText: { fontFamily: FONTS.bold, fontSize: 13, color: COLORS.text, letterSpacing: 1.5 },

  financingRow:  { backgroundColor: '#EFF6FF', borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.md },
  financingText: { fontFamily: FONTS.semiBold, fontSize: 13, color: '#1D4ED8', textAlign: 'center' },

  ctaRow:      { flexDirection: 'row', gap: SPACING.sm },
  ctaBtn:      { flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.sm + 2, alignItems: 'center' },
  ctaBtnText:  { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.white },
  callBtn:     { flex: 1, backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, padding: SPACING.sm + 2, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  callBtnText: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.text },

  loadingText: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.md },
  errorTitle:  { fontFamily: FONTS.bold, fontSize: 18, color: COLORS.text, marginBottom: SPACING.md },
  retryBtn:    { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  retryText:   { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.white },

  emptyState: { padding: SPACING.xl * 2, alignItems: 'center' },
  emptyTitle: { fontFamily: FONTS.semiBold, fontSize: 16, color: COLORS.text, marginBottom: 8 },
  emptyBody:  { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
});