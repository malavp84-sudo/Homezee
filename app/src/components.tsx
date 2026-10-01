import React from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, shadow, space } from './theme';
import { Listing, categories } from './data';
import { useStore } from './store';
import { metaOf } from './filters';

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={s.sectionAction}>{action} ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SearchBar({ value, onChangeText, placeholder }: { value: string; onChangeText: (t: string) => void; placeholder?: string }) {
  return (
    <View style={s.search}>
      <Text style={{ fontSize: 18 }}>🔍</Text>
      <TextInput
        style={s.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? 'Search bai, doodh, flat, doctor...'}
        placeholderTextColor={colors.muted}
        accessibilityLabel="Search"
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={20} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function Chip({ label, active, onPress, emoji }: { label: string; active?: boolean; onPress: () => void; emoji?: string }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]} accessibilityRole="button">
      <Text style={[s.chipText, active && s.chipTextActive]}>{emoji ? `${emoji} ` : ''}{label}</Text>
    </Pressable>
  );
}

export function CallButton({ phone, size = 44 }: { phone: string; size?: number }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(`tel:${phone}`)}
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}
      accessibilityLabel="Call"
      hitSlop={6}
    >
      <Ionicons name="call" size={size * 0.46} color="#fff" />
    </Pressable>
  );
}

export function ListingCard({ item, onPress }: { item: Listing; onPress: () => void }) {
  const { saved, toggleSaved } = useStore();
  const isSaved = saved.includes(item.id);
  const cat = categories.find((c) => c.id === item.category)!;
  return (
    <Pressable onPress={onPress} style={s.card} accessibilityRole="button" accessibilityLabel={item.name}>
      <View style={[s.cardEmoji, { backgroundColor: cat.tint }]}>
        <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={s.rowCenter}>
          <Text style={s.cardTitle} numberOfLines={1}>{item.name}</Text>
          {item.verified && <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginLeft: 4 }} />}
        </View>
        <Text style={s.cardSub} numberOfLines={1}>📍 {item.area} · {item.distance} km away</Text>
        <Text style={s.cardMeta} numberOfLines={2}>{metaOf(item).filter(Boolean).join('  •  ')}</Text>
        <View style={[s.rowCenter, { marginTop: 8, flexWrap: 'wrap', gap: 6 }]}>
          <View style={s.pillGold}><Text style={s.pillGoldText}>⭐ {item.rating}</Text></View>
          <Text style={s.price}>{item.price}</Text>
        </View>
        {item.zeroBrokerage && (
          <View style={s.badge}>
            <Text style={s.badgeText}>🎉 ZERO BROKERAGE</Text>
          </View>
        )}
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch' }}>
        <Pressable onPress={() => toggleSaved(item.id)} hitSlop={12} accessibilityLabel={isSaved ? 'Remove from saved' : 'Save'}>
          <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={24} color={isSaved ? colors.danger : colors.muted} />
        </Pressable>
        <CallButton phone={item.phone} />
      </View>
    </Pressable>
  );
}

export function PrimaryButton({ label, icon, onPress, colorsPair }: { label: string; icon?: keyof typeof Ionicons.glyphMap; onPress: () => void; colorsPair?: readonly [string, string, ...string[]] }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }} accessibilityRole="button">
      <LinearGradient colors={colorsPair ?? gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.btn}>
        {icon && <Ionicons name={icon} size={20} color="#fff" />}
        <Text style={s.btnText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <View style={{ alignItems: 'center', padding: space.xl * 2 }}>
      <Text style={{ fontSize: 48 }}>🧐</Text>
      <Text style={{ color: colors.muted, marginTop: space.sm, textAlign: 'center', fontSize: 15 }}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: space.md },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  sectionAction: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 18, height: 54, gap: 10, ...shadow },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, outlineStyle: 'none' } as any,
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: space.sm },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '700', fontSize: 14 },
  chipTextActive: { color: '#fff' },
  card: { flexDirection: 'row', gap: space.md, backgroundColor: colors.surface, padding: 14, borderRadius: radius.lg, marginBottom: 14, alignItems: 'flex-start', ...shadow },
  cardEmoji: { width: 64, height: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, flexShrink: 1 },
  cardSub: { fontSize: 13, color: colors.muted, marginTop: 3 },
  cardMeta: { fontSize: 12, color: colors.text, opacity: 0.75, marginTop: 4, fontWeight: '600' },
  pillGold: { backgroundColor: '#FFF3D6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  pillGoldText: { fontSize: 12, fontWeight: '800', color: '#9A6700' },
  price: { fontSize: 14, fontWeight: '800', color: colors.primary },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.accentLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, marginTop: 8 },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#C2410C', letterSpacing: 0.4 },
  btn: { height: 56, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
