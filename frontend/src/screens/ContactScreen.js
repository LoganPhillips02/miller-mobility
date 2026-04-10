import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Linking,
} from 'react-native';
import { contactApi } from '../services/api';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../constants/theme';

const INQUIRY_TYPES = [
  { value: 'general',       label: 'General Question' },
  { value: 'product',       label: 'Product Inquiry' },
  { value: 'financing',     label: 'Financing' },
  { value: 'service',       label: 'Service / Repair' },
  { value: 'accessibility', label: 'Accessibility Consult' },
];

const INITIAL_FORM = {
  inquiry_type:       'general',
  first_name:         '',
  last_name:          '',
  email:              '',
  phone:              '',
  subject:            '',
  message:            '',
  product_of_interest:'',
  preferred_contact:  'either',
  best_time_to_call:  '',
};

export default function ContactScreen({ route }) {
  const prefill = route?.params ?? {};
  const [form, setForm]       = useState({ ...INITIAL_FORM, ...prefill });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const update = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    if (!form.first_name.trim()) return 'First name is required.';
    if (!form.last_name.trim())  return 'Last name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'A valid email is required.';
    if (!form.message.trim() || form.message.trim().length < 10) return 'Please provide at least 10 characters in your message.';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert('Missing info', validationError);
      return;
    }
    setSubmitting(true);
    try {
      await contactApi.submit(form);
      setSubmitted(true);
    } catch (err) {
      Alert.alert('Submission failed', err.message || 'Please try again or call us at 262-549-4900.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessView onReset={() => { setForm(INITIAL_FORM); setSubmitted(false); }} />;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Get in Touch</Text>
        <Text style={styles.subtitle}>
          Our product experts are here to help. Fill out the form below and we'll get back to you within 1 business day.
        </Text>

        {/* Quick-call strip */}
        <TouchableOpacity style={styles.callStrip} onPress={() => Linking.openURL('tel:+12625494900')} activeOpacity={0.85}>
          <Text style={styles.callStripText}>📞  Prefer to call? 262-549-4900</Text>
          <Text style={styles.callStripHours}>Mon–Fri 9am–5pm · Sat 10am–2pm</Text>
        </TouchableOpacity>

        {/* Inquiry type */}
        <Label text="Type of Inquiry" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
          {INQUIRY_TYPES.map(t => (
            <TouchableOpacity
              key={t.value}
              style={[styles.typeChip, form.inquiry_type === t.value && styles.typeChipActive]}
              onPress={() => update('inquiry_type')(t.value)}
              activeOpacity={0.8}
            >
              <Text style={[styles.typeChipText, form.inquiry_type === t.value && styles.typeChipTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Name */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Label text="First Name *" />
            <Input value={form.first_name} onChange={update('first_name')} placeholder="Jane" />
          </View>
          <View style={styles.half}>
            <Label text="Last Name *" />
            <Input value={form.last_name} onChange={update('last_name')} placeholder="Smith" />
          </View>
        </View>

        <Label text="Email *" />
        <Input value={form.email} onChange={update('email')} placeholder="jane@example.com" keyboardType="email-address" autoCapitalize="none" />

        <Label text="Phone" />
        <Input value={form.phone} onChange={update('phone')} placeholder="(262) 555-0100" keyboardType="phone-pad" />

        {form.inquiry_type === 'product' && (
          <>
            <Label text="Product of Interest" />
            <Input value={form.product_of_interest} onChange={update('product_of_interest')} placeholder="e.g. Bruno Elan Stairlift" />
          </>
        )}

        <Label text="Subject" />
        <Input value={form.subject} onChange={update('subject')} placeholder="How can we help?" />

        <Label text="Message *" />
        <Input
          value={form.message}
          onChange={update('message')}
          placeholder="Describe what you're looking for or any questions you have…"
          multiline
          numberOfLines={5}
          style={styles.textarea}
        />

        {/* Preferred contact */}
        <Label text="Best way to reach you" />
        <View style={styles.typeRow2}>
          {[['email', 'Email'], ['phone', 'Phone'], ['either', 'Either']].map(([v, l]) => (
            <TouchableOpacity
              key={v}
              style={[styles.typeChip, form.preferred_contact === v && styles.typeChipActive]}
              onPress={() => update('preferred_contact')(v)}
              activeOpacity={0.8}
            >
              <Text style={[styles.typeChipText, form.preferred_contact === v && styles.typeChipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {(form.preferred_contact === 'phone' || form.preferred_contact === 'either') && (
          <>
            <Label text="Best time to call" />
            <Input value={form.best_time_to_call} onChange={update('best_time_to_call')} placeholder="e.g. Weekday mornings" />
          </>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.88}
        >
          {submitting
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.submitBtnText}>Send Message →</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SuccessView({ onReset }) {
  return (
    <View style={styles.successWrap}>
      <Text style={styles.successIcon}>✓</Text>
      <Text style={styles.successTitle}>Message Sent!</Text>
      <Text style={styles.successBody}>
        Thanks for reaching out. We'll get back to you within 1 business day.
      </Text>
      <TouchableOpacity style={styles.successBtn} onPress={onReset} activeOpacity={0.85}>
        <Text style={styles.successBtnText}>Send Another Message</Text>
      </TouchableOpacity>
    </View>
  );
}

function Label({ text }) {
  return <Text style={styles.label}>{text}</Text>;
}

function Input({ value, onChange, style, ...props }) {
  return (
    <TextInput
      style={[styles.input, style]}
      value={value}
      onChangeText={onChange}
      placeholderTextColor={COLORS.textMuted}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content:   { padding: SPACING.lg, paddingBottom: SPACING.xl * 3 },

  title:    { fontFamily: FONTS.bold, fontSize: 24, color: COLORS.text, marginBottom: 6 },
  subtitle: { fontFamily: FONTS.regular, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.lg },

  callStrip:      { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, alignItems: 'center' },
  callStripText:  { fontFamily: FONTS.bold, fontSize: 16, color: COLORS.white },
  callStripHours: { fontFamily: FONTS.regular, fontSize: 12, color: COLORS.white, opacity: 0.85, marginTop: 3 },

  label: { fontFamily: FONTS.semiBold, fontSize: 13, color: COLORS.text, marginBottom: SPACING.xs, marginTop: SPACING.md },

  typeRow:  { gap: SPACING.xs, marginBottom: SPACING.xs },
  typeRow2: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap', marginBottom: SPACING.xs },
  typeChip:       { paddingHorizontal: SPACING.sm + 4, paddingVertical: SPACING.xs + 2, borderRadius: 20, backgroundColor: COLORS.surfaceAlt, marginRight: 4, marginBottom: 4 },
  typeChipActive: { backgroundColor: COLORS.primary },
  typeChipText:       { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.textSecondary },
  typeChipTextActive: { color: COLORS.white },

  row:  { flexDirection: 'row', gap: SPACING.sm },
  half: { flex: 1 },

  input: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2,
    fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text,
  },
  textarea: { minHeight: 120, textAlignVertical: 'top', paddingTop: SPACING.sm },

  submitBtn:         { marginTop: SPACING.xl, backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.md + 2, alignItems: 'center', ...SHADOW.md },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText:     { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.white },

  successWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  successIcon:  { fontSize: 48, color: COLORS.success, marginBottom: SPACING.md },
  successTitle: { fontFamily: FONTS.bold, fontSize: 24, color: COLORS.text, marginBottom: 8 },
  successBody:  { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl },
  successBtn:   { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  successBtnText: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.white },
});