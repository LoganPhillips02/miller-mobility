import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { dealsService } from '../services/api';
import { createTradeInRequest, tradeInToPayload } from '../models';
import { PrimaryButton, Divider } from '../components/ui';
import SiteFooter from '../components/SiteFooter';

const CONTACT_ITEMS = [
  { icon: '📞', label: 'Call Us', value: '(XXX) XXX-XXXX', action: () => Linking.openURL('tel:+1XXXXXXXXXX') },
  { icon: '✉️', label: 'Email', value: 'info@millermobility.com', action: () => Linking.openURL('mailto:info@millermobility.com') },
  { icon: '📍', label: 'Location', value: 'View on Maps', action: () => Linking.openURL('https://maps.google.com') },
  { icon: '🕐', label: 'Hours', value: 'Mon–Fri 8am–5pm', action: null },
];

const Field = ({ label, required, children }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}{required && <Text style={{ color: Colors.accent }}> *</Text>}</Text>
    {children}
  </View>
);

const Input = ({ style, ...props }) => (
  <TextInput
    style={[styles.input, style]}
    placeholderTextColor={Colors.gray400}
    {...props}
  />
);

const ContactScreen = () => {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' | 'tradein'
  const [form, setForm] = useState(createTradeInRequest());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.year || !form.make || !form.model) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await dealsService.submitTradeIn(tradeInToPayload(form));
      setSubmitted(true);
    } catch (err) {
      Alert.alert('Submission Failed', err.message || 'Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Tab Bar */}
      <View style={styles.tabs}>
        {['contact', 'tradein'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'contact' ? '📞 Contact' : '🔄 Trade-In'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {activeTab === 'contact' ? (
            <View>
              <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>Get in Touch</Text>
                <Text style={styles.heroSub}>
                  Our team is ready to help you find the right mobility solution.
                </Text>
              </View>

              {CONTACT_ITEMS.map(({ icon, label, value, action }) => (
                <TouchableOpacity
                  key={label}
                  style={styles.contactCard}
                  onPress={action}
                  disabled={!action}
                  activeOpacity={action ? 0.7 : 1}
                >
                  <Text style={styles.contactIcon}>{icon}</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>{label}</Text>
                    <Text style={[styles.contactValue, action && styles.contactValueLink]}>
                      {value}
                    </Text>
                  </View>
                  {action && <Text style={styles.contactArrow}>›</Text>}
                </TouchableOpacity>
              ))}

              <Divider style={{ marginTop: Spacing.xl }} />

              <View style={styles.tradeInPromo}>
                <Text style={styles.tradeInPromoTitle}>Have a Vehicle to Trade?</Text>
                <Text style={styles.tradeInPromoText}>
                  Get a free trade-in estimate. Tap Trade-In above to get started.
                </Text>
                <TouchableOpacity onPress={() => setActiveTab('tradein')} style={styles.tradeInPromoButton}>
                  <Text style={styles.tradeInPromoButtonText}>Start Trade-In Estimate →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : submitted ? (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>🎉</Text>
              <Text style={styles.successTitle}>Request Submitted!</Text>
              <Text style={styles.successText}>
                We'll review your trade-in information and reach out within 1 business day.
              </Text>
              <PrimaryButton
                title="Submit Another"
                onPress={() => {
                  setForm(createTradeInRequest());
                  setSubmitted(false);
                }}
                style={{ marginTop: Spacing.xl }}
              />
            </View>
          ) : (
            <View>
              <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>Trade-In Estimate</Text>
                <Text style={styles.heroSub}>
                  Tell us about your current vehicle and we'll provide a free estimate.
                </Text>
              </View>

              {/* Vehicle Info */}
              <Text style={styles.sectionTitle}>Your Vehicle</Text>

              <View style={styles.row3}>
                <Field label="Year" required>
                  <Input
                    placeholder="2019"
                    value={form.year}
                    onChangeText={update('year')}
                    keyboardType="numeric"
                    maxLength={4}
                    style={styles.inputSmall}
                  />
                </Field>
                <Field label="Make" required style={{ flex: 2 }}>
                  <Input placeholder="Toyota" value={form.make} onChangeText={update('make')} />
                </Field>
              </View>

              <Field label="Model" required>
                <Input placeholder="Sienna" value={form.model} onChangeText={update('model')} />
              </Field>

              <Field label="Mileage">
                <Input
                  placeholder="45,000"
                  value={form.mileage}
                  onChangeText={update('mileage')}
                  keyboardType="numeric"
                />
              </Field>

              <Field label="Condition Notes">
                <Input
                  placeholder="Describe any issues, modifications, or conversion features…"
                  value={form.conditionNotes}
                  onChangeText={update('conditionNotes')}
                  multiline
                  numberOfLines={3}
                  style={styles.textarea}
                />
              </Field>

              <Divider />

              {/* Contact Info */}
              <Text style={styles.sectionTitle}>Your Contact Info</Text>

              <View style={styles.row2}>
                <Field label="First Name" required style={{ flex: 1 }}>
                  <Input placeholder="Jane" value={form.firstName} onChangeText={update('firstName')} />
                </Field>
                <Field label="Last Name" required style={{ flex: 1 }}>
                  <Input placeholder="Smith" value={form.lastName} onChangeText={update('lastName')} />
                </Field>
              </View>

              <Field label="Email" required>
                <Input
                  placeholder="jane@example.com"
                  value={form.email}
                  onChangeText={update('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Field>

              <Field label="Phone" required>
                <Input
                  placeholder="(555) 555-5555"
                  value={form.phone}
                  onChangeText={update('phone')}
                  keyboardType="phone-pad"
                />
              </Field>

              <Field label="ZIP Code">
                <Input
                  placeholder="53201"
                  value={form.zipCode}
                  onChangeText={update('zipCode')}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </Field>

              <Field label="Additional Notes">
                <Input
                  placeholder="What vehicle are you interested in getting?"
                  value={form.notes}
                  onChangeText={update('notes')}
                  multiline
                  numberOfLines={3}
                  style={styles.textarea}
                />
              </Field>

              <PrimaryButton
                title="Submit Trade-In Request"
                onPress={handleSubmit}
                loading={submitting}
                style={{ marginTop: Spacing.lg, marginBottom: Spacing['3xl'] }}
              />
            </View>
          )}
        <SiteFooter navigation={navigation} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: Typography.sizes.base, color: Colors.gray600, fontWeight: Typography.weights.medium },
  tabTextActive: { color: Colors.primary, fontWeight: Typography.weights.bold },
  scroll: { padding: Spacing.base },
  heroSection: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  heroTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.heavy, color: Colors.white },
  heroSub: { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.75)', marginTop: Spacing.xs },
  contactCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.sm,
  },
  contactIcon: { fontSize: 28 },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: Typography.sizes.sm, color: Colors.gray600 },
  contactValue: { fontSize: Typography.sizes.base, fontWeight: Typography.weights.semibold, color: Colors.black },
  contactValueLink: { color: Colors.primary },
  contactArrow: { fontSize: 22, color: Colors.gray400 },
  tradeInPromo: {
    backgroundColor: Colors.gray50,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tradeInPromoTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black },
  tradeInPromoText: { fontSize: Typography.sizes.sm, color: Colors.gray600, marginTop: Spacing.xs },
  tradeInPromoButton: { marginTop: Spacing.md },
  tradeInPromoButtonText: { color: Colors.primary, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base },
  sectionTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
    marginTop: Spacing.base,
  },
  field: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.gray800, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    fontSize: Typography.sizes.base,
    color: Colors.black,
  },
  inputSmall: { width: 80 },
  textarea: { height: 90, textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: Spacing.md },
  row3: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-end' },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['5xl'],
    gap: Spacing.md,
  },
  successIcon: { fontSize: 64 },
  successTitle: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.black },
  successText: { fontSize: Typography.sizes.base, color: Colors.gray600, textAlign: 'center', lineHeight: Typography.sizes.base * 1.6 },
});

export default ContactScreen;