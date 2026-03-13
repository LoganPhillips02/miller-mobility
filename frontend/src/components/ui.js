import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, color = Colors.accent, textColor = Colors.white, style }) => (
  <View style={[styles.badge, { backgroundColor: color }, style]}>
    <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
  </View>
);

// ─── Condition Badge ──────────────────────────────────────────────────────────
const CONDITION_COLORS = {
  new: Colors.success,
  used: Colors.gray400,
  certified: Colors.info,
};
export const ConditionBadge = ({ condition, conditionDisplay }) => (
  <Badge
    label={conditionDisplay || condition}
    color={CONDITION_COLORS[condition] ?? Colors.gray400}
  />
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  available: Colors.success,
  sold: Colors.error,
  on_hold: Colors.warning,
  coming_soon: Colors.info,
};
export const StatusBadge = ({ status, statusDisplay }) => (
  <Badge
    label={statusDisplay || status}
    color={STATUS_COLORS[status] ?? Colors.gray400}
  />
);

// ─── Price Tag ────────────────────────────────────────────────────────────────
export const PriceTag = ({ displayPrice, msrp, savings, style }) => (
  <View style={[styles.priceContainer, style]}>
    <Text style={styles.price}>{displayPrice}</Text>
    {!!msrp && !!savings && (
      <Text style={styles.msrp}>
        MSRP: ${Number(msrp).toLocaleString()}
      </Text>
    )}
    {!!savings && (
      <Text style={styles.savings}>
        Save ${Number(savings).toLocaleString()}
      </Text>
    )}
  </View>
);

// ─── Section Header ───────────────────────────────────────────────────────────
export const SectionHeader = ({ title, onSeeAll, style }) => (
  <View style={[styles.sectionHeader, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export const LoadingSpinner = ({ size = 'large', color = Colors.primary, full = false }) => (
  <View style={[styles.center, full && styles.fullCenter]}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

// ─── Error View ───────────────────────────────────────────────────────────────
export const ErrorView = ({ message, onRetry }) => (
  <View style={styles.center}>
    <Text style={styles.errorIcon}>⚠️</Text>
    <Text style={styles.errorText}>{message || 'Something went wrong.'}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = '🔍', title, message, action, onAction }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    {title && <Text style={styles.emptyTitle}>{title}</Text>}
    {message && <Text style={styles.emptyMessage}>{message}</Text>}
    {action && onAction && (
      <TouchableOpacity style={styles.emptyAction} onPress={onAction}>
        <Text style={styles.emptyActionText}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Divider ─────────────────────────────────────────────────────────────────
export const Divider = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ─── Chip (filter pill) ───────────────────────────────────────────────────────
export const Chip = ({ label, selected, onPress, style }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected, style]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── Primary Button ───────────────────────────────────────────────────────────
export const PrimaryButton = ({ title, onPress, loading, disabled, style }) => (
  <TouchableOpacity
    style={[styles.primaryButton, (disabled || loading) && styles.primaryButtonDisabled, style]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.8}
  >
    {loading
      ? <ActivityIndicator color={Colors.white} size="small" />
      : <Text style={styles.primaryButtonText}>{title}</Text>}
  </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  priceContainer: {
    gap: 2,
  },
  price: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  msrp: {
    fontSize: Typography.sizes.sm,
    color: Colors.gray400,
    textDecorationLine: 'line-through',
  },
  savings: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.success,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
  },
  seeAll: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
  },
  fullCenter: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  errorIcon: { fontSize: 40, marginBottom: Spacing.md },
  errorText: {
    fontSize: Typography.sizes.base,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
  },
  retryText: {
    color: Colors.white,
    fontWeight: Typography.weights.semibold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.base },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: Typography.sizes.base,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyAction: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
  },
  emptyActionText: {
    color: Colors.white,
    fontWeight: Typography.weights.semibold,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: Spacing.base,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.gray600,
  },
  chipTextSelected: {
    color: Colors.white,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});