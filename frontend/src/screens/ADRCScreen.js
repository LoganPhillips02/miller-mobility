import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import SiteFooter from '../components/SiteFooter';
import { PrimaryButton, Divider } from '../components/ui';
import { useTabNavigation } from '../navigation/TabNavigationContext';
import { WEB_LAYOUT_BREAKPOINT } from '../constants/webLayout';
import WebContentGutter from '../components/WebContentGutter';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IS_WEB_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH >= WEB_LAYOUT_BREAKPOINT;

// ─── Small reusable field wrapper ────────────────────────────────────────────
const Field = ({ label, required, hint, children, style }) => (
  <View style={[styles.field, style]}>
    <Text style={styles.fieldLabel}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
    {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
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

// ─── Radio group ──────────────────────────────────────────────────────────────
const RadioGroup = ({ options, value, onChange }) => (
  <View style={styles.radioRow}>
    {options.map((opt) => (
      <TouchableOpacity
        key={opt}
        style={styles.radioOption}
        onPress={() => onChange(opt)}
        activeOpacity={0.7}
      >
        <View style={[styles.radioCircle, value === opt && styles.radioCircleSelected]}>
          {value === opt && <View style={styles.radioDot} />}
        </View>
        <Text style={styles.radioLabel}>{opt}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Checkbox ─────────────────────────────────────────────────────────────────
const Checkbox = ({ label, checked, onToggle }) => (
  <TouchableOpacity style={styles.checkboxRow} onPress={onToggle} activeOpacity={0.7}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

// ─── Step indicator ───────────────────────────────────────────────────────────
const StepBadge = ({ n, label, active, done }) => (
  <View style={styles.stepBadgeWrap}>
    <View style={[styles.stepCircle, active && styles.stepCircleActive, done && styles.stepCircleDone]}>
      <Text style={[styles.stepNum, (active || done) && styles.stepNumActive]}>
        {done ? '✓' : n}
      </Text>
    </View>
    <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
const ADRCScreen = ({ navigation }) => {
  const { switchTab, scrollY } = useTabNavigation();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    age: '',
    gender: '',
    address: '',
    disability18to59: '',
    age60plus: '',
    vaBenefits: '',
    usesElectricWheelchair: false,
    usesScooter: false,
    ownsVehicle: '',
    doesNotOwnExplanation: '',
    vendorName: '',
    signature: '',
    date: '',
  });

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));
  const toggle = (key) => () => setForm((f) => ({ ...f, [key]: !f[key] }));

  const handleSubmit = async () => {
    const required = ['name', 'email', 'phone', 'birthdate', 'address', 'ownsVehicle', 'signature', 'date'];
    const missing = required.filter((k) => !form[k].trim());
    if (missing.length) {
      Alert.alert('Missing Information', 'Please fill in all required fields before submitting.');
      return;
    }
    setSubmitting(true);
    // Simulate submission — replace with real API call when backend endpoint exists
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.successContainer}>
          <WebContentGutter>
          <View style={styles.successIcon}>
            <Text style={{ fontSize: 56 }}>🎉</Text>
          </View>
          <Text style={styles.successTitle}>Application Submitted!</Text>
          <Text style={styles.successBody}>
            Thank you for filling out the ADRC Vehicle Modification application. Our team will review your information
            and reach out to you within 1–2 business days.
          </Text>
          <Text style={styles.successContact}>
            Questions? Call us at{' '}
            <Text style={styles.successPhone} onPress={() => Linking.openURL('tel:+12625494900')}>
              262-549-4900
            </Text>
          </Text>
          <PrimaryButton
            title="Back to Home"
            onPress={() => switchTab('Home')}
            style={{ marginTop: Spacing['2xl'], alignSelf: 'stretch' }}
          />
          </WebContentGutter>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        >

          {/* ── Hero ── */}
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>LIMITED FUNDING AVAILABLE</Text>
            </View>
            <Text style={styles.heroTitle}>ADRC Vehicle Modification{'\n'}Program Application</Text>
            <Text style={styles.heroSub}>
              Don't miss your chance for <Text style={styles.heroEmphasis}>greater mobility</Text> at absolutely no cost.
              With a <Text style={styles.heroEmphasis}>hassle-free process</Text> and limited funding available, now is
              the time to act!
            </Text>
          </View>

          <WebContentGutter>
          {/* ── How it works ── */}
          <View style={styles.howSection}>
            <Text style={styles.howTitle}>Here's How It Works</Text>
            <View style={styles.stepsRow}>
              {[
                { n: '1', label: 'Fill Out\nThis Form' },
                { n: '2', label: 'We Handle\nthe Details' },
                { n: '3', label: 'Hassle-Free\nInstallation' },
                { n: '4', label: 'You Pay\nOnly 10%' },
              ].map((s, i) => (
                <React.Fragment key={s.n}>
                  <StepBadge n={s.n} label={s.label} active />
                  {i < 3 && <View style={styles.stepConnector} />}
                </React.Fragment>
              ))}
            </View>

            {[
              { n: '1', text: 'Fill out this simple form to get started in minutes.' },
              { n: '2', text: 'Our team contacts you, finds the right lift, and submits an estimate (up to $7,000) to ADRC for approval.' },
              { n: '3', text: 'Once approved, we schedule and complete your installation.' },
              { n: '4', text: 'ADRC covers most of the cost — you pay only 10% of the vehicle lift price.' },
            ].map((s) => (
              <View key={s.n} style={styles.stepDetail}>
                <View style={styles.stepDetailNum}>
                  <Text style={styles.stepDetailNumText}>{s.n}</Text>
                </View>
                <Text style={styles.stepDetailText}>{s.text}</Text>
              </View>
            ))}
          </View>

          {/* ── Eligibility ── */}
          <View style={styles.eligibilityCard}>
            <Text style={styles.eligibilityTitle}>📋 Eligibility Requirements</Text>
            {[
              'Waukesha County residents, age 18 or older',
              'Individuals with disabilities that impact their ability to access or use a personal vehicle without modifications',
            ].map((item) => (
              <View key={item} style={styles.eligibilityRow}>
                <Text style={styles.eligibilityCheck}>✓</Text>
                <Text style={styles.eligibilityText}>{item}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.eligibilityLink}
              onPress={() => switchTab('Inventory', { category: 'vehicle-lifts' })}
            >
              <Text style={styles.eligibilityLinkText}>View vehicle lift options in our catalog →</Text>
            </TouchableOpacity>
          </View>

          <Divider style={{ marginHorizontal: Spacing.base }} />

          {/* ── Form ── */}
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Personal Information</Text>

            <Field label="Full Name" required>
              <Input
                placeholder="Jane Smith"
                value={form.name}
                onChangeText={set('name')}
                autoCapitalize="words"
              />
            </Field>

            <Field label="Email Address" required>
              <Input
                placeholder="jane@example.com"
                value={form.email}
                onChangeText={set('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Field>

            <Field label="Phone Number" required>
              <Input
                placeholder="(262) 555-1234"
                value={form.phone}
                onChangeText={set('phone')}
                keyboardType="phone-pad"
              />
            </Field>

            <View style={styles.row2}>
              <Field label="Birthdate" required style={{ flex: 1 }}>
                <Input
                  placeholder="MM/DD/YYYY"
                  value={form.birthdate}
                  onChangeText={set('birthdate')}
                  keyboardType="numbers-and-punctuation"
                />
              </Field>
              <Field label="Age" style={{ width: 80 }}>
                <Input
                  placeholder="—"
                  value={form.age}
                  onChangeText={set('age')}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </Field>
            </View>

            <Field label="Gender">
              <RadioGroup
                options={['Male', 'Female', 'Prefer not to say']}
                value={form.gender}
                onChange={set('gender')}
              />
            </Field>

            <Field label="Permanent Address" required>
              <Input
                placeholder="36336 N. Summit Village Way, Oconomowoc, WI 53066"
                value={form.address}
                onChangeText={set('address')}
                multiline
                numberOfLines={2}
                style={styles.textarea}
              />
            </Field>
          </View>

          <Divider style={{ marginHorizontal: Spacing.base }} />

          {/* ── Eligibility questions ── */}
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Eligibility Questions</Text>

            <Field
              label="Are you between the ages of 18–59 and identify as having a disability?"
              required
            >
              <RadioGroup
                options={['Yes', 'No']}
                value={form.disability18to59}
                onChange={set('disability18to59')}
              />
            </Field>

            <Field label="Are you age 60 or over?" required>
              <RadioGroup
                options={['Yes', 'No']}
                value={form.age60plus}
                onChange={set('age60plus')}
              />
            </Field>

            <Field label="Do you receive VA disability benefits?" required>
              <RadioGroup
                options={['Yes', 'No']}
                value={form.vaBenefits}
                onChange={set('vaBenefits')}
              />
            </Field>

            <Field label="Do you use any of the following? (select all that apply)">
              <View style={styles.checkboxGroup}>
                <Checkbox
                  label="Electric Wheelchair"
                  checked={form.usesElectricWheelchair}
                  onToggle={toggle('usesElectricWheelchair')}
                />
                <Checkbox
                  label="Scooter"
                  checked={form.usesScooter}
                  onToggle={toggle('usesScooter')}
                />
              </View>
            </Field>
          </View>

          <Divider style={{ marginHorizontal: Spacing.base }} />

          {/* ── Vehicle info ── */}
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Vehicle Information</Text>

            <Field label="Do you own the vehicle you are looking to modify?" required>
              <RadioGroup
                options={['Yes', 'No']}
                value={form.ownsVehicle}
                onChange={set('ownsVehicle')}
              />
            </Field>

            {form.ownsVehicle === 'No' && (
              <Field label="If no, please explain">
                <Input
                  placeholder="Explain vehicle ownership situation…"
                  value={form.doesNotOwnExplanation}
                  onChangeText={set('doesNotOwnExplanation')}
                  multiline
                  numberOfLines={3}
                  style={styles.textarea}
                />
              </Field>
            )}

            <Field
              label="Name and phone number of vendor performing the modification"
              hint="Miller Mobility Products — 262-549-4900"
            >
              <Input
                placeholder="Miller Mobility Products, 262-549-4900"
                value={form.vendorName}
                onChangeText={set('vendorName')}
              />
            </Field>
          </View>

          <Divider style={{ marginHorizontal: Spacing.base }} />

          {/* ── Certification & signature ── */}
          <View style={styles.formSection}>
            <Text style={styles.formSectionTitle}>Certification & Signature</Text>

            <View style={styles.certBox}>
              <Text style={styles.certText}>
                The information provided in this application is true and correct. I understand that deliberately
                providing false information is punishable by law and may jeopardize the receipt of services. I hereby
                authorize the Aging and Disability Resource Center to verify the information in this application.
              </Text>
              <Text style={[styles.certText, { marginTop: Spacing.md }]}>
                If approved, the applicant hereby agrees and commits to pay the vendor, selected by the applicant, an
                amount equal to <Text style={styles.certBold}>ten percent (10%)</Text> of the final vehicle
                modification quote issued by that vendor.
              </Text>
            </View>

            <Field label="Signature of Applicant (type full name)" required>
              <Input
                placeholder="Jane Smith"
                value={form.signature}
                onChangeText={set('signature')}
                autoCapitalize="words"
              />
            </Field>

            <Field label="Date" required>
              <Input
                placeholder="MM/DD/YYYY"
                value={form.date}
                onChangeText={set('date')}
                keyboardType="numbers-and-punctuation"
              />
            </Field>

            <PrimaryButton
              title="Submit Application"
              onPress={handleSubmit}
              loading={submitting}
              style={{ marginTop: Spacing.lg }}
            />

            <Text style={styles.privacyNote}>
              Your information is kept confidential and used only for ADRC program processing.
            </Text>
          </View>

          {/* ── Contact callout ── */}
          <View style={styles.contactBlock}>
            <Text style={styles.contactBlockTitle}>Have Questions?</Text>
            <Text style={styles.contactBlockText}>
              Our team is happy to walk you through the process, explain eligibility, or help you choose the right lift.
            </Text>
            <View style={styles.contactBlockButtons}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => Linking.openURL('tel:+12625494900')}
              >
                <Text style={styles.callButtonText}>📞 Call 262-549-4900</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.inventoryButton}
                onPress={() => switchTab('Inventory', { category: 'vehicle-lifts' })}
              >
                <Text style={styles.inventoryButtonText}>View Vehicle Lifts →</Text>
              </TouchableOpacity>
            </View>
          </View>

          </WebContentGutter>

          <SiteFooter onTabPress={switchTab} />
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // ── Hero ──
  hero: { backgroundColor: Colors.primary, padding: Spacing.xl, paddingTop: Spacing['2xl'], paddingBottom: Spacing['2xl'] },
  heroBadge: { backgroundColor: Colors.accent, alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full, marginBottom: Spacing.md },
  heroBadgeText: { color: Colors.white, fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, letterSpacing: 1.2 },
  heroTitle: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.white, lineHeight: Typography.sizes['2xl'] * 1.25, marginBottom: Spacing.md },
  heroSub: { fontSize: Typography.sizes.base, color: 'rgba(255,255,255,0.8)', lineHeight: Typography.sizes.base * 1.6 },
  heroEmphasis: { color: Colors.white, fontWeight: Typography.weights.bold },

  // ── How it works ──
  howSection: { backgroundColor: Colors.surface, padding: Spacing.xl, borderBottomWidth: 1, borderBottomColor: Colors.border },
  howTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.heavy, color: Colors.black, marginBottom: Spacing.xl },
  stepsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xl },
  stepBadgeWrap: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
  stepCircleActive: { backgroundColor: Colors.primary },
  stepCircleDone: { backgroundColor: Colors.success },
  stepNum: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.gray400 },
  stepNumActive: { color: Colors.white },
  stepLabel: { fontSize: 10, color: Colors.gray400, textAlign: 'center', lineHeight: 14 },
  stepLabelActive: { color: Colors.primary, fontWeight: Typography.weights.semibold },
  stepConnector: { height: 2, flex: 0.3, backgroundColor: Colors.primary, marginBottom: Spacing.lg },
  stepDetail: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
  stepDetailNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  stepDetailNumText: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.heavy, color: Colors.white },
  stepDetailText: { flex: 1, fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.6 },

  // ── Eligibility card ──
  eligibilityCard: { margin: Spacing.base, backgroundColor: '#EFF6FF', borderRadius: Radius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: '#BFDBFE' },
  eligibilityTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.primary, marginBottom: Spacing.md },
  eligibilityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  eligibilityCheck: { color: Colors.success, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.base, width: 20, marginTop: 1 },
  eligibilityText: { flex: 1, fontSize: Typography.sizes.sm, color: Colors.gray800, lineHeight: Typography.sizes.sm * 1.6 },
  eligibilityLink: { marginTop: Spacing.md },
  eligibilityLinkText: { fontSize: Typography.sizes.sm, color: Colors.primary, fontWeight: Typography.weights.semibold },

  // ── Form ──
  formSection: { padding: Spacing.base, paddingTop: Spacing.lg, paddingBottom: Spacing.lg },
  formSectionTitle: { fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.black, marginBottom: Spacing.lg, paddingBottom: Spacing.sm, borderBottomWidth: 2, borderBottomColor: Colors.primary },
  field: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, color: Colors.gray800, marginBottom: Spacing.xs },
  fieldHint: { fontSize: Typography.sizes.xs, color: Colors.gray400, marginBottom: Spacing.xs, fontStyle: 'italic' },
  required: { color: Colors.accent },
  input: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md - 2, fontSize: Typography.sizes.base, color: Colors.black },
  textarea: { height: 80, textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },

  // ── Radio ──
  radioRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginTop: Spacing.xs },
  radioOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.gray200, alignItems: 'center', justifyContent: 'center' },
  radioCircleSelected: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  radioLabel: { fontSize: Typography.sizes.base, color: Colors.black },

  // ── Checkbox ──
  checkboxGroup: { gap: Spacing.sm, marginTop: Spacing.xs },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  checkbox: { width: 22, height: 22, borderRadius: Radius.sm, borderWidth: 2, borderColor: Colors.gray200, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: Colors.white, fontSize: 13, fontWeight: Typography.weights.bold },
  checkboxLabel: { fontSize: Typography.sizes.base, color: Colors.black },

  // ── Certification box ──
  certBox: { backgroundColor: Colors.gray50, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg },
  certText: { fontSize: Typography.sizes.sm, color: Colors.gray600, lineHeight: Typography.sizes.sm * 1.65 },
  certBold: { fontWeight: Typography.weights.bold, color: Colors.black },
  privacyNote: { fontSize: Typography.sizes.xs, color: Colors.gray400, textAlign: 'center', marginTop: Spacing.md },

  // ── Contact block ──
  contactBlock: { margin: Spacing.base, backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg },
  contactBlockTitle: { fontSize: Typography.sizes.lg, fontWeight: Typography.weights.heavy, color: Colors.white, marginBottom: Spacing.sm },
  contactBlockText: { fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,0.8)', lineHeight: Typography.sizes.sm * 1.6, marginBottom: Spacing.lg },
  contactBlockButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  callButton: { backgroundColor: Colors.white, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.full },
  callButtonText: { color: Colors.primary, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm },
  inventoryButton: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  inventoryButtonText: { color: Colors.white, fontWeight: Typography.weights.bold, fontSize: Typography.sizes.sm },

  // ── Success ──
  successContainer: { flex: 1, paddingVertical: Spacing['2xl'], paddingHorizontal: IS_WEB_DESKTOP ? 0 : Spacing['2xl'], alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  successIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  successTitle: { fontSize: Typography.sizes['2xl'], fontWeight: Typography.weights.heavy, color: Colors.black, textAlign: 'center' },
  successBody: { fontSize: Typography.sizes.base, color: Colors.gray600, textAlign: 'center', lineHeight: Typography.sizes.base * 1.6 },
  successContact: { fontSize: Typography.sizes.sm, color: Colors.gray600, textAlign: 'center' },
  successPhone: { color: Colors.primary, fontWeight: Typography.weights.bold },
});

export default ADRCScreen;