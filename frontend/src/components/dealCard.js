import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { dealBadgeText } from '../models';

const DealCard = ({ deal, onPress, style }) => {
  const badgeText = dealBadgeText(deal);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress?.(deal)}
      activeOpacity={0.85}
    >
      {/* Image / color header */}
      <View style={[styles.header, !deal.imageUrl && { backgroundColor: Colors.primaryLight }]}>
        {deal.imageUrl ? (
          <Image source={{ uri: deal.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>🏷️</Text>
          </View>
        )}
        {/* Badge overlay */}
        <View style={[styles.badge, { backgroundColor: deal.badgeColor }]}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.dealType}>{deal.dealTypeDisplay}</Text>
        <Text style={styles.title} numberOfLines={2}>{deal.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{deal.shortDescription || deal.description}</Text>

        <View style={styles.footer}>
          {deal.promoCode ? (
            <View style={styles.promoCode}>
              <Text style={styles.promoLabel}>Code: </Text>
              <Text style={styles.promoValue}>{deal.promoCode}</Text>
            </View>
          ) : null}

          {deal.daysRemaining != null && deal.daysRemaining <= 30 && (
            <Text style={styles.expiry}>
              {deal.daysRemaining === 0
                ? 'Expires today!'
                : `${deal.daysRemaining}d left`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  header: {
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 40,
  },
  badge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  badgeText: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  dealType: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray600,
    lineHeight: Typography.sizes.sm * 1.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  promoCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  promoLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.gray600,
  },
  promoValue: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  expiry: {
    fontSize: Typography.sizes.xs,
    color: Colors.accent,
    fontWeight: Typography.weights.semibold,
  },
});

export default DealCard;