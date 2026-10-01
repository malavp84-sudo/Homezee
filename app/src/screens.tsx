import React, { useMemo, useState } from 'react';
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, shadow, space } from './theme';
import { categories, helperQuick, listings, specialities } from './data';
import { metaOf } from './filters';
import { CallButton, Chip, Empty, ListingCard, PrimaryButton, SearchBar, SectionHeader } from './components';
import { useStore } from './store';

const Screen = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
    {children}
  </SafeAreaView>
);

const match = (l: { name: string; subtitle: string; area: string }, q: string) =>
  (l.name + ' ' + l.subtitle + ' ' + l.area).toLowerCase().includes(q.trim().toLowerCase());

export function HomeScreen({ navigation }: any) {
  const { city, active, user } = useStore();
  const [q, setQ] = useState('');
  const results = useMemo(() => (q.trim() ? listings.filter((l) => match(l, q)) : []), [q]);
  const open = (id: string) => navigation.navigate('Detail', { id });
  const popular = [...listings].sort((a, b) => b.reviews - a.reviews).slice(0, 6);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
          <SafeAreaView edges={['top']}>
            <View style={s.heroTop}>
              <Pressable
                style={s.locPill}
                onPress={() => navigation.navigate('Location')}
                accessibilityLabel="Change location"
              >
                <Text style={{ fontSize: 15 }}>📍</Text>
                <Text style={s.locText} numberOfLines={1}>{active ? `${active.area}, ${active.city}` : 'Set your location'}</Text>
                <Ionicons name="chevron-down" size={14} color="#fff" />
              </Pressable>
              <View style={s.avatarSm}><Text style={{ fontSize: 18 }}>{user ? '😊' : '👤'}</Text></View>
            </View>
            <Text style={s.hello}>Namaste 👋</Text>
            <Text style={s.heroTitle}>What do you need{'\n'}today?</Text>
          </SafeAreaView>
        </LinearGradient>

        <View style={{ paddingHorizontal: space.lg, marginTop: -28 }}>
          <SearchBar value={q} onChangeText={setQ} />
        </View>

        <View style={{ paddingHorizontal: space.lg }}>
          {q.trim() ? (
            <View style={{ marginTop: space.xl }}>
              {results.length ? results.map((l) => <ListingCard key={l.id} item={l} onPress={() => open(l.id)} />) : <Empty text={`No results for "${q}"`} />}
            </View>
          ) : (
            <>
              <View style={s.grid}>
                {categories.map((c) => (
                  <Pressable key={c.id} style={s.tileWrap} onPress={() => navigation.navigate('Category', { category: c.id })} accessibilityLabel={c.label}>
                    <View style={[s.tile, { backgroundColor: c.tint }]}>
                      <Text style={{ fontSize: 34 }}>{c.emoji}</Text>
                    </View>
                    <Text style={s.tileLabel}>{c.label}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable onPress={() => navigation.navigate('Category', { category: 'rental', filters: { zero: true } })} style={{ marginTop: space.xl }}>
                <LinearGradient colors={gradients.sunset} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.banner}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.bannerKicker}>ZERO BROKERAGE</Text>
                    <Text style={s.bannerTitle}>Skip the broker.{'\n'}Save ₹10,000+</Text>
                    <View style={s.bannerBtn}><Text style={s.bannerBtnText}>See flats  →</Text></View>
                  </View>
                  <Text style={{ fontSize: 76 }}>🏠</Text>
                </LinearGradient>
              </Pressable>

              <SectionHeader title="Daily helpers" action="See all" onAction={() => navigation.navigate('Category', { category: 'helper' })} />
              <View style={s.helperRow}>
                {helperQuick.map((h) => (
                  <Pressable key={h.key} style={s.helperItem} onPress={() => navigation.navigate('Category', { category: 'helper', filters: { htype: [h.key] } })}>
                    <View style={[s.helperCircle, { backgroundColor: h.tint }]}>
                      <Text style={{ fontSize: 30 }}>{h.emoji}</Text>
                    </View>
                    <Text style={s.helperLabel}>{h.label}</Text>
                  </Pressable>
                ))}
              </View>

              <SectionHeader title="Popular near you" action="Explore" onAction={() => navigation.navigate('Explore')} />
            </>
          )}
        </View>

        {!q.trim() && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: 6 }}>
              {popular.map((l) => {
                const cat = categories.find((c) => c.id === l.category)!;
                return (
                  <Pressable key={l.id} style={s.popCard} onPress={() => open(l.id)}>
                    <View style={[s.popTop, { backgroundColor: cat.tint }]}>
                      <Text style={{ fontSize: 46 }}>{l.emoji}</Text>
                    </View>
                    <View style={{ padding: 12 }}>
                      <Text style={s.popName} numberOfLines={1}>{l.name}</Text>
                      <Text style={s.popSub} numberOfLines={1}>📍 {l.area}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={s.popRate}>⭐ {l.rating}</Text>
                        <CallButton phone={l.phone} size={34} />
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={{ paddingHorizontal: space.lg }}>
              <SectionHeader title={`Only in ${city}`} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.lg }}>
              {specialities.map((sp) => (
                <LinearGradient key={sp.id} colors={sp.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.spCard}>
                  <Text style={{ fontSize: 40 }}>{sp.emoji}</Text>
                  <View>
                    <Text style={s.spTitle}>{sp.title}</Text>
                    <Text style={s.spPlace}>{sp.place}</Text>
                  </View>
                </LinearGradient>
              ))}
            </ScrollView>

            <View style={s.trust}>
              <Text style={{ fontSize: 26 }}>🤝</Text>
              <Text style={s.trustText}>Verified locals, direct contact, no middleman. Feel at home in any city.</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

export function ExploreScreen({ navigation }: any) {
  const [q, setQ] = useState('');
  const data = listings.filter((l) => match(l, q)).sort((a, b) => b.rating - a.rating);

  return (
    <Screen>
      <View style={{ padding: space.lg, paddingBottom: 0 }}>
        <Text style={s.title}>Explore</Text>
        <SearchBar value={q} onChangeText={setQ} placeholder="Search anything nearby" />
        <Text style={[s.sub, { marginTop: space.md }]}>Open a service for its own filters and sorting</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: space.md }}>
          {categories.map((c) => (
            <Chip key={c.id} emoji={c.emoji} label={c.label} onPress={() => navigation.navigate('Category', { category: c.id })} />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: space.lg, paddingTop: 4, paddingBottom: 110 }}
        renderItem={({ item }) => <ListingCard item={item} onPress={() => navigation.navigate('Detail', { id: item.id })} />}
        ListEmptyComponent={<Empty text="Nothing found. Try another search." />}
      />
    </Screen>
  );
}
export function SavedScreen({ navigation }: any) {
  const { saved } = useStore();
  const data = listings.filter((l) => saved.includes(l.id));
  return (
    <Screen>
      <View style={{ padding: space.lg, paddingBottom: 0 }}>
        <Text style={s.title}>Saved</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: space.lg, paddingBottom: 110 }}
        renderItem={({ item }) => <ListingCard item={item} onPress={() => navigation.navigate('Detail', { id: item.id })} />}
        ListEmptyComponent={<Empty text="Tap the heart on any listing to save it here." />}
      />
    </Screen>
  );
}

export function ProfileScreen() {
  const [hindi, setHindi] = useState(false);
  const { user, logout } = useStore();
  const rows: [string, string][] = [
    ['➕', 'List your service (coming soon)'],
    ['🔔', 'Notifications'],
    ['💬', 'Help & support'],
    ['ℹ️', 'About Homezee'],
  ];
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 110 }}>
        <Text style={s.title}>Profile</Text>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.profileCard}>
          <View style={s.avatar}><Text style={{ fontSize: 32 }}>{user ? '😊' : '👤'}</Text></View>
          <View>
            <Text style={{ fontSize: 19, fontWeight: '800', color: '#fff' }}>{user ? `+91 ${user.phone}` : 'Guest'}</Text>
            <Text style={{ color: '#CCFBF1' }}>{user ? 'Signed in' : 'Sign in to keep your data'}</Text>
          </View>
        </LinearGradient>
        <Pressable style={s.row} onPress={() => setHindi((h) => !h)}>
          <Text style={{ fontSize: 22 }}>🌐</Text>
          <Text style={s.rowText}>Language</Text>
          <Text style={{ color: colors.primary, fontWeight: '800' }}>{hindi ? 'हिंदी' : 'English'}</Text>
        </Pressable>
        {rows.map(([emoji, label]) => (
          <View key={label} style={s.row}>
            <Text style={{ fontSize: 22 }}>{emoji}</Text>
            <Text style={s.rowText}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </View>
        ))}
        <Pressable style={[s.row, { marginTop: space.lg }]} onPress={logout} accessibilityRole="button">
          <Text style={{ fontSize: 22 }}>{user ? '🚪' : '🔑'}</Text>
          <Text style={[s.rowText, { color: user ? colors.danger : colors.primary }]}>{user ? 'Log out' : 'Sign in'}</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

export function DetailScreen({ route, navigation }: any) {
  const item = listings.find((l) => l.id === route.params.id)!;
  const { saved, toggleSaved } = useStore();
  const isSaved = saved.includes(item.id);
  const cat = categories.find((c) => c.id === item.category)!;
  const call = () => Linking.openURL(`tel:${item.phone}`);
  const whatsapp = () => Linking.openURL(`https://wa.me/91${item.phone}`);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[cat.tint, '#FFFFFF']} style={s.detailHero}>
          <SafeAreaView edges={['top']}>
            <View style={s.detailTop}>
              <Pressable onPress={() => navigation.goBack()} style={s.roundBtn} accessibilityLabel="Back">
                <Ionicons name="arrow-back" size={22} color={colors.text} />
              </Pressable>
              <Pressable onPress={() => toggleSaved(item.id)} style={s.roundBtn} accessibilityLabel="Save">
                <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? colors.danger : colors.text} />
              </Pressable>
            </View>
            <View style={{ alignItems: 'center', paddingVertical: 18 }}>
              <Text style={{ fontSize: 96 }}>{item.emoji}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={s.sheet}>
          <Text style={s.detailTitle}>{item.name}</Text>
          <Text style={s.sub}>{item.subtitle}</Text>
          <View style={s.factRow}>
            <Fact emoji="⭐" label={`${item.rating} (${item.reviews})`} />
            <Fact emoji="📍" label={`${item.area} · ${item.distance} km`} />
            {item.verified && <Fact emoji="✅" label="Verified" />}
          </View>
          <View style={[s.factRow, { marginTop: 0 }]}>
            {metaOf(item).filter(Boolean).map((m) => (
              <View key={m} style={s.metaChip}><Text style={s.metaChipText}>{m}</Text></View>
            ))}
            {item.category === 'rental' && <View style={s.metaChip}><Text style={s.metaChipText}>Deposit {item.attrs.deposit}</Text></View>}
          </View>

          {item.zeroBrokerage && (
            <View style={s.zeroBox}>
              <Text style={{ fontSize: 26 }}>🎉</Text>
              <Text style={{ flex: 1, color: '#C2410C', fontWeight: '800', fontSize: 14 }}>Zero brokerage. Deal directly with the owner and save money.</Text>
            </View>
          )}

          <View style={s.infoRow}>
            <View style={s.infoCard}>
              <Text style={s.infoLabel}>Price</Text>
              <Text style={s.infoValue}>{item.price}</Text>
            </View>
            {item.timing && (
              <View style={s.infoCard}>
                <Text style={s.infoLabel}>Timings</Text>
                <Text style={s.infoValue}>{item.timing}</Text>
              </View>
            )}
          </View>

          <Text style={s.aboutTitle}>About</Text>
          <Text style={{ fontSize: 15, color: colors.text, lineHeight: 23, marginTop: 6 }}>{item.about}</Text>
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>
      <View style={s.ctaBar}>
        <PrimaryButton label="Call" icon="call" onPress={call} />
        <PrimaryButton label="WhatsApp" icon="logo-whatsapp" colorsPair={gradients.green} onPress={whatsapp} />
      </View>
    </View>
  );
}

const Fact = ({ emoji, label }: { emoji: string; label: string }) => (
  <View style={s.fact}>
    <Text style={{ fontSize: 14 }}>{emoji}</Text>
    <Text style={{ fontWeight: '700', color: colors.text, marginLeft: 6 }}>{label}</Text>
  </View>
);

const s = StyleSheet.create({
  hero: { paddingHorizontal: space.lg, paddingBottom: 56, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 },
  locPill: { maxWidth: '78%', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, minHeight: 40, borderRadius: radius.pill },
  locText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  avatarSm: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  hello: { color: '#CCFBF1', fontSize: 16, fontWeight: '600', marginTop: space.lg },
  heroTitle: { color: '#fff', fontSize: 32, fontWeight: '900', lineHeight: 38, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: space.xl, rowGap: 18 },
  tileWrap: { width: '33.33%', alignItems: 'center' },
  tile: { width: 84, height: 84, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  tileLabel: { marginTop: 8, fontSize: 14, fontWeight: '800', color: colors.text },
  banner: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.xl, padding: 20, ...shadow },
  bannerKicker: { color: '#fff', fontWeight: '800', letterSpacing: 1.2, fontSize: 12, opacity: 0.9 },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', lineHeight: 30, marginTop: 4 },
  bannerBtn: { alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill, marginTop: 14 },
  bannerBtnText: { color: '#C2410C', fontWeight: '800', fontSize: 14 },
  helperRow: { flexDirection: 'row', justifyContent: 'space-between' },
  helperItem: { alignItems: 'center', flex: 1 },
  helperCircle: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  helperLabel: { marginTop: 8, fontWeight: '700', fontSize: 14, color: colors.text },
  popCard: { width: 168, backgroundColor: colors.surface, borderRadius: radius.lg, marginRight: 14, overflow: 'hidden', ...shadow },
  popTop: { height: 96, alignItems: 'center', justifyContent: 'center' },
  popName: { fontSize: 15, fontWeight: '800', color: colors.text },
  popSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  popRate: { fontSize: 13, fontWeight: '800', color: '#9A6700' },
  spCard: { width: 156, height: 138, borderRadius: radius.lg, padding: 14, marginRight: 12, justifyContent: 'space-between' },
  spTitle: { color: '#fff', fontWeight: '900', fontSize: 16 },
  spPlace: { color: '#fff', opacity: 0.9, fontSize: 12, marginTop: 2 },
  trust: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.primaryLight, marginHorizontal: space.lg, marginTop: 28, padding: 16, borderRadius: radius.lg },
  trustText: { flex: 1, color: colors.primaryDark, fontWeight: '700', fontSize: 14, lineHeight: 20 },
  title: { fontSize: 28, fontWeight: '900', color: colors.text, marginBottom: space.md },
  sub: { color: colors.muted, fontSize: 14 },
  profileCard: { flexDirection: 'row', gap: space.md, alignItems: 'center', padding: space.lg, borderRadius: radius.xl, marginBottom: space.lg },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: colors.surface, padding: space.lg, borderRadius: radius.md, marginBottom: 10, minHeight: 58, ...shadow },
  rowText: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  detailHero: { paddingHorizontal: space.lg, paddingBottom: 24 },
  detailTop: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8 },
  roundBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadow },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -20, padding: space.lg, paddingTop: 24 },
  detailTitle: { fontSize: 26, fontWeight: '900', color: colors.text },
  factRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginVertical: space.lg },
  fact: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border },
  metaChip: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  metaChipText: { color: colors.primaryDark, fontWeight: '700', fontSize: 13 },
  zeroBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.accentLight, padding: 14, borderRadius: radius.md, marginBottom: space.lg },
  infoRow: { flexDirection: 'row', gap: 12 },
  infoCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, ...shadow },
  infoLabel: { fontSize: 12, fontWeight: '800', color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  infoValue: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 4 },
  aboutTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: space.xl },
  ctaBar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: space.md, padding: space.lg, backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, ...shadow },
});

