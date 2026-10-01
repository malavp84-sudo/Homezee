import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, radius, shadow, space } from './theme';
import { Chip, PrimaryButton } from './components';
import { Address, useStore } from './store';
import { PlaceFields, lookupPincode, reverseGeocode, searchPlaces } from './geo';
import LocationMap from './LocationMap';

const INDORE = { lat: 22.7196, lng: 75.8577 };
const empty = { flat: '', street: '', landmark: '', area: '', city: '', state: '', pincode: '' };

function Field({ label, value, onChangeText, placeholder, keyboardType, maxLength, error, required }: {
  label: string; value: string; onChangeText: (t: string) => void; placeholder?: string; keyboardType?: any; maxLength?: number; error?: string; required?: boolean;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}{required ? <Text style={{ color: colors.danger }}> *</Text> : null}</Text>
      <TextInput
        style={[s.input, !!error && { borderColor: colors.danger }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        maxLength={maxLength}
        accessibilityLabel={label}
      />
      {!!error && <Text style={s.err}>{error}</Text>}
    </View>
  );
}

export function LocationScreen({ navigation }: any) {
  const { addresses, active, addAddress, selectAddress, removeAddress } = useStore();
  const [f, setF] = useState({ ...empty });
  const [tag, setTag] = useState<Address['tag']>('Home');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(
    active?.lat ? { lat: active.lat, lng: active.lng! } : INDORE,
  );
  const [q, setQ] = useState('');
  const [results, setResults] = useState<PlaceFields[]>([]);
  const [busy, setBusy] = useState<'' | 'gps' | 'search' | 'pin'>('');
  const [msg, setMsg] = useState('');
  const [areaHints, setAreaHints] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const timer = useRef<any>(null);

  const set = (k: keyof typeof empty) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  const fill = (p: PlaceFields) => {
    setF((cur) => ({
      ...cur,
      area: p.area || cur.area,
      city: p.city || cur.city,
      state: p.state || cur.state,
      pincode: p.pincode || cur.pincode,
      street: p.street || cur.street,
    }));
    if (p.lat !== undefined && p.lng !== undefined) setCoords({ lat: p.lat, lng: p.lng });
  };

  const useCurrent = async () => {
    setMsg('');
    setBusy('gps');
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') throw new Error('Location permission denied. You can type your address instead.');
      const pos = await Location.getCurrentPositionAsync({});
      fill(await reverseGeocode(pos.coords.latitude, pos.coords.longitude));
    } catch (e: any) {
      setMsg(e.message || 'Could not get your location.');
    } finally {
      setBusy('');
    }
  };

  const onMapChange = async (lat: number, lng: number) => {
    setCoords({ lat, lng });
    try {
      fill(await reverseGeocode(lat, lng));
    } catch {}
  };

  // Debounced place search
  useEffect(() => {
    clearTimeout(timer.current);
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    timer.current = setTimeout(async () => {
      setBusy('search');
      try {
        setResults(await searchPlaces(q.trim()));
      } catch (e: any) {
        setMsg(e.message);
      } finally {
        setBusy('');
      }
    }, 500);
    return () => clearTimeout(timer.current);
  }, [q]);

  // Typing a 6-digit pincode fills city, state and area suggestions
  useEffect(() => {
    if (!/^\d{6}$/.test(f.pincode)) {
      setAreaHints([]);
      return;
    }
    let live = true;
    setBusy('pin');
    lookupPincode(f.pincode).then((r) => {
      if (!live) return;
      setBusy('');
      if (!r) return setErrors((e) => ({ ...e, pincode: 'Pincode not found' }));
      setErrors((e) => ({ ...e, pincode: '' }));
      setAreaHints(r.areas.slice(0, 8));
      setF((cur) => ({ ...cur, city: cur.city || r.city, state: cur.state || r.state }));
    });
    return () => {
      live = false;
    };
  }, [f.pincode]);

  const save = () => {
    const e: Record<string, string> = {};
    if (!f.area.trim()) e.area = 'Enter your area / locality';
    if (!f.city.trim()) e.city = 'Enter your city';
    if (!f.state.trim()) e.state = 'Enter your state';
    if (!/^\d{6}$/.test(f.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    setErrors(e);
    if (Object.keys(e).length) return;
    addAddress({ ...f, tag, lat: coords.lat, lng: coords.lng });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} style={s.back} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={s.title}>Set your location</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: 0, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          {addresses.length > 0 && (
            <>
              <Text style={s.section}>Saved addresses</Text>
              {addresses.map((a) => (
                <Pressable key={a.id} style={[s.saved, active?.id === a.id && s.savedOn]} onPress={() => { selectAddress(a.id); navigation.goBack(); }}>
                  <Text style={{ fontSize: 24 }}>{a.tag === 'Home' ? '🏠' : a.tag === 'Work' ? '💼' : '📍'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.savedTitle}>{a.tag}{active?.id === a.id ? '  · Selected' : ''}</Text>
                    <Text style={s.savedSub} numberOfLines={2}>
                      {[a.flat, a.street, a.landmark, a.area, a.city, a.state, a.pincode].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                  <Pressable onPress={() => removeAddress(a.id)} hitSlop={10} accessibilityLabel="Delete address">
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </Pressable>
                </Pressable>
              ))}
              <Text style={[s.section, { marginTop: 20 }]}>Add a new address</Text>
            </>
          )}

          <Pressable onPress={useCurrent} style={s.gps} accessibilityRole="button">
            {busy === 'gps' ? <ActivityIndicator color={colors.primary} /> : <Ionicons name="locate" size={22} color={colors.primary} />}
            <Text style={s.gpsText}>Use my current location</Text>
          </Pressable>
          {!!msg && <Text style={[s.err, { marginTop: 8 }]}>{msg}</Text>}

          <View style={s.search}>
            <Text style={{ fontSize: 16 }}>🔍</Text>
            <TextInput
              style={s.searchInput}
              value={q}
              onChangeText={setQ}
              placeholder="Search area, landmark, city or pincode"
              placeholderTextColor={colors.muted}
              accessibilityLabel="Search location"
            />
            {busy === 'search' && <ActivityIndicator size="small" color={colors.primary} />}
          </View>
          {results.map((r, i) => (
            <Pressable key={i} style={s.result} onPress={() => { fill(r); setQ(''); setResults([]); }}>
              <Ionicons name="location-outline" size={18} color={colors.muted} />
              <Text style={s.resultText} numberOfLines={2}>{r.label}</Text>
            </Pressable>
          ))}

          <View style={{ marginTop: 14 }}>
            <LocationMap lat={coords.lat} lng={coords.lng} onChange={onMapChange} />
            <Text style={s.hint}>{Platform.OS === 'web' ? 'Search or use current location to move the map.' : 'Tap the map or drag the pin to your exact spot.'}</Text>
          </View>

          <Text style={[s.section, { marginTop: 18 }]}>Address details</Text>
          <Field label="House / Flat / Floor no." value={f.flat} onChangeText={set('flat')} placeholder="e.g. Flat 204, 2nd floor" />
          <Field label="Building / Street" value={f.street} onChangeText={set('street')} placeholder="e.g. Sunrise Apartments, AB Road" />
          <Field label="Landmark" value={f.landmark} onChangeText={set('landmark')} placeholder="e.g. Near City Mall" />
          <Field label="Pincode" value={f.pincode} onChangeText={(t) => set('pincode')(t.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit pincode" keyboardType="number-pad" maxLength={6} error={errors.pincode} required />
          <Field label="Area / Locality" value={f.area} onChangeText={set('area')} placeholder="e.g. Vijay Nagar" error={errors.area} required />
          {areaHints.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: -6, marginBottom: 12 }}>
              {areaHints.map((a) => <Chip key={a} label={a} active={f.area === a} onPress={() => set('area')(a)} />)}
            </ScrollView>
          )}
          <Field label="City" value={f.city} onChangeText={set('city')} placeholder="e.g. Indore" error={errors.city} required />
          <Field label="State" value={f.state} onChangeText={set('state')} placeholder="e.g. Madhya Pradesh" error={errors.state} required />

          <Text style={s.label}>Save address as</Text>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            {(['Home', 'Work', 'Other'] as const).map((t) => (
              <Chip key={t} emoji={t === 'Home' ? '🏠' : t === 'Work' ? '💼' : '📍'} label={t} active={tag === t} onPress={() => setTag(t)} />
            ))}
          </View>

          <View style={{ flexDirection: 'row' }}>
            <PrimaryButton label="Save & use this location" icon="checkmark-circle" onPress={save} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: space.lg },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadow },
  title: { fontSize: 22, fontWeight: '900', color: colors.text },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 },
  gps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 54, borderRadius: radius.pill, backgroundColor: colors.primaryLight, borderWidth: 1.5, borderColor: colors.primary },
  gpsText: { color: colors.primary, fontWeight: '800', fontSize: 15 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: radius.pill, paddingHorizontal: 18, height: 52, marginTop: 14, ...shadow },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, outlineStyle: 'none' } as any,
  result: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: radius.md, marginTop: 8 },
  resultText: { flex: 1, fontSize: 13, color: colors.text },
  hint: { fontSize: 12, color: colors.muted, marginTop: 6, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '800', color: colors.text, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, height: 50, fontSize: 15, color: colors.text, outlineStyle: 'none' } as any,
  err: { color: colors.danger, fontSize: 12, marginTop: 4 },
  saved: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 14, borderRadius: radius.lg, marginBottom: 10, borderWidth: 1.5, borderColor: 'transparent', ...shadow },
  savedOn: { borderColor: colors.primary },
  savedTitle: { fontWeight: '800', color: colors.text, fontSize: 15 },
  savedSub: { color: colors.muted, fontSize: 13, marginTop: 2 },
});
