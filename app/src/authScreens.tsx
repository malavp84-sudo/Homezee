import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, space } from './theme';
import { PrimaryButton } from './components';
import { useStore } from './store';
import { MOCK_OTP } from './authService';

export function LoginScreen({ navigation }: any) {
  const { sendOtp, continueAsGuest } = useStore();
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setErr('');
    setBusy(true);
    try {
      await sendOtp(phone);
      navigation.navigate('Otp', { phone });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.top}>
          <View style={s.logo}><Text style={{ fontSize: 44 }}>🏠</Text></View>
          <Text style={s.brand}>Homezee</Text>
          <Text style={s.tag}>Feel local from day one.</Text>
          <View style={s.emojiRow}>
            {['🥛', '🥦', '🧹', '🍱', '🩺'].map((e) => (
              <View key={e} style={s.emojiBubble}><Text style={{ fontSize: 22 }}>{e}</Text></View>
            ))}
          </View>
        </LinearGradient>
        <View style={s.form}>
          <Text style={s.label}>Enter your mobile number</Text>
          <View style={[s.inputRow, !!err && { borderColor: colors.danger }]}>
            <Text style={s.prefix}>+91</Text>
            <TextInput
              style={s.input}
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
              keyboardType="number-pad"
              placeholder="10-digit number"
              placeholderTextColor={colors.muted}
              maxLength={10}
              accessibilityLabel="Mobile number"
            />
          </View>
          {!!err && <Text style={s.err}>{err}</Text>}
          <View style={{ flexDirection: 'row', marginTop: space.lg, opacity: phone.length === 10 && !busy ? 1 : 0.5 }}>
            <PrimaryButton label={busy ? 'Sending...' : 'Get OTP'} onPress={() => phone.length === 10 && !busy && submit()} />
          </View>
          <Pressable onPress={continueAsGuest} style={s.guest} hitSlop={10}>
            <Text style={s.guestText}>Skip for now, continue as guest</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function OtpScreen({ route, navigation }: any) {
  const { phone } = route.params;
  const { verifyOtp } = useStore();
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    setErr('');
    setBusy(true);
    try {
      await verifyOtp(phone, code);
    } catch (e: any) {
      setErr(e.message);
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={s.root}>
      <KeyboardAvoidingView style={{ flex: 1, padding: space.lg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={[s.brand, { color: colors.text, marginTop: space.xl }]}>Verify your number</Text>
        <Text style={[s.tag, { color: colors.muted }]}>Code sent to +91 {phone}</Text>
        <TextInput
          style={s.otp}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="------"
          placeholderTextColor={colors.border}
          autoFocus
          accessibilityLabel="OTP code"
        />
        {!!err && <Text style={[s.err, { textAlign: 'center' }]}>{err}</Text>}
        <View style={{ flexDirection: 'row', marginTop: space.lg, opacity: code.length === 6 && !busy ? 1 : 0.5 }}>
          <PrimaryButton label={busy ? 'Verifying...' : 'Verify & Continue'} onPress={() => code.length === 6 && !busy && submit()} />
        </View>
        <Text style={s.hint}>Demo mode: use code {MOCK_OTP}</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  top: { alignItems: 'center', paddingVertical: 48, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  logo: { width: 84, height: 84, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  emojiRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  emojiBubble: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 30, fontWeight: '800', color: '#fff', marginTop: space.md },
  tag: { fontSize: 15, color: '#CCFBF1', marginTop: 4 },
  form: { padding: space.lg, marginTop: space.lg },
  label: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: space.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: space.lg, height: 56 },
  prefix: { fontSize: 17, fontWeight: '700', color: colors.text, marginRight: space.md },
  input: { flex: 1, fontSize: 18, color: colors.text, letterSpacing: 1 },
  err: { color: colors.danger, marginTop: space.sm, fontSize: 13 },
  guest: { alignSelf: 'center', marginTop: space.xl, minHeight: 44, justifyContent: 'center' },
  guestText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  otp: { fontSize: 34, fontWeight: '800', letterSpacing: 12, textAlign: 'center', color: colors.text, backgroundColor: colors.surface, borderRadius: radius.lg, height: 72, marginTop: space.xl, borderWidth: 1.5, borderColor: colors.border },
  hint: { textAlign: 'center', color: colors.muted, marginTop: space.lg, fontSize: 13 },
});
