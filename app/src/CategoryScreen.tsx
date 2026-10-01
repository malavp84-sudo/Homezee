import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, space } from './theme';
import { categories, listings } from './data';
import { FilterDef, FilterState, activeCount, applyFilters, config } from './filters';
import { Chip, Empty, ListingCard, PrimaryButton, SearchBar } from './components';

// One reusable page per service: its own filters, quick chips and sort options.
export function CategoryScreen({ navigation, route }: any) {
  const catId = route.params.category;
  const cat = categories.find((c) => c.id === catId)!;
  const cfg = config[catId as keyof typeof config];
  const base = useMemo(() => listings.filter((l) => l.category === catId), [catId]);

  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<FilterState>(route.params.filters ?? {});
  const [sortKey, setSortKey] = useState(cfg.sorts[0].key);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // When Home sends a preset (e.g. only "Bai"), apply it
  useEffect(() => {
    if (route.params.filters) setFilters(route.params.filters);
  }, [route.params.filters]);

  const sort = cfg.sorts.find((s) => s.key === sortKey)!;
  const results = useMemo(() => {
    const text = q.trim().toLowerCase();
    return applyFilters(base, cfg.filters, filters)
      .filter((l) => !text || (l.name + ' ' + l.subtitle + ' ' + l.area).toLowerCase().includes(text))
      .sort(sort.fn);
  }, [base, cfg, filters, q, sort]);

  const n = activeCount(filters);
  const quick = cfg.filters.filter((f) => 'quick' in f && f.quick);

  const toggleMulti = (d: FilterDef, v: string | number) =>
    setFilters((f) => {
      const cur: any[] = f[d.key] ?? [];
      return { ...f, [d.key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
  const toggleBool = (d: FilterDef) => setFilters((f) => ({ ...f, [d.key]: !f[d.key] }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <View style={s.header}>
        {!route.params.tab && (
          <Pressable onPress={() => navigation.goBack()} style={s.back} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        )}
        <View style={[s.catBadge, { backgroundColor: cat.tint }]}>
          <Text style={{ fontSize: 24 }}>{cat.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{cat.title}</Text>
          <Text style={s.count}>{results.length} found near you</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: space.lg }}>
        <SearchBar value={q} onChangeText={setQ} placeholder={cfg.searchHint} />

        <View style={s.actionRow}>
          <Pressable style={s.actionBtn} onPress={() => setShowSort(true)} accessibilityLabel="Sort">
            <Ionicons name="swap-vertical" size={18} color={colors.primary} />
            <Text style={s.actionText} numberOfLines={1}>{sort.label}</Text>
          </Pressable>
          <Pressable style={[s.actionBtn, n > 0 && { borderColor: colors.primary, backgroundColor: colors.primaryLight }]} onPress={() => setShowFilters(true)} accessibilityLabel="Filters">
            <Ionicons name="options" size={18} color={colors.primary} />
            <Text style={s.actionText}>Filters</Text>
            {n > 0 && <View style={s.dot}><Text style={s.dotText}>{n}</Text></View>}
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: space.md }}>
          {quick.map((d) =>
            d.kind === 'multi'
              ? d.options.map((o) => (
                  <Chip key={d.key + o.value} label={o.label} active={(filters[d.key] ?? []).includes(o.value)} onPress={() => toggleMulti(d, o.value)} />
                ))
              : d.kind === 'toggle' ? (
                  <Chip key={d.key} label={d.label} active={!!filters[d.key]} onPress={() => toggleBool(d)} />
                ) : null,
          )}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: space.lg, paddingBottom: 120 }}
        renderItem={({ item }) => <ListingCard item={item} onPress={() => navigation.navigate('Detail', { id: item.id })} />}
        ListEmptyComponent={
          <View>
            <Empty text="No matches. Try removing a filter." />
            {n > 0 && (
              <View style={{ flexDirection: 'row', paddingHorizontal: 40 }}>
                <PrimaryButton label="Clear all filters" onPress={() => setFilters({})} />
              </View>
            )}
          </View>
        }
      />

      <FilterSheet
        visible={showFilters}
        defs={cfg.filters}
        base={base}
        applied={filters}
        onClose={() => setShowFilters(false)}
        onApply={(f) => {
          setFilters(f);
          setShowFilters(false);
        }}
      />

      <Modal visible={showSort} transparent animationType="fade" onRequestClose={() => setShowSort(false)}>
        <Pressable style={s.backdrop} onPress={() => setShowSort(false)}>
          <View style={s.sheet}>
            <View style={s.grabber} />
            <Text style={s.sheetTitle}>Sort by</Text>
            {cfg.sorts.map((o) => (
              <Pressable key={o.key} style={s.sortRow} onPress={() => { setSortKey(o.key); setShowSort(false); }}>
                <Text style={[s.sortText, o.key === sortKey && { color: colors.primary, fontWeight: '800' }]}>{o.label}</Text>
                <Ionicons name={o.key === sortKey ? 'radio-button-on' : 'radio-button-off'} size={22} color={o.key === sortKey ? colors.primary : colors.muted} />
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function FilterSheet({ visible, defs, base, applied, onClose, onApply }: {
  visible: boolean; defs: FilterDef[]; base: any[]; applied: FilterState; onClose: () => void; onApply: (f: FilterState) => void;
}) {
  const [draft, setDraft] = useState<FilterState>(applied);
  useEffect(() => {
    if (visible) setDraft(applied);
  }, [visible]);

  const count = applyFilters(base, defs, draft).length;
  const setMulti = (d: FilterDef, v: string | number) =>
    setDraft((f) => {
      const cur: any[] = f[d.key] ?? [];
      return { ...f, [d.key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={[s.sheet, { maxHeight: '88%' }]}>
          <View style={s.grabber} />
          <View style={s.sheetHead}>
            <Text style={s.sheetTitle}>Filters</Text>
            <Pressable onPress={() => setDraft({})} hitSlop={10}><Text style={s.clear}>Clear all</Text></Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }}>
            {defs.map((d) => (
              <View key={d.key} style={{ marginBottom: 18 }}>
                {d.kind === 'toggle' ? (
                  <Pressable style={s.switchRow} onPress={() => setDraft((f) => ({ ...f, [d.key]: !f[d.key] }))}>
                    <Text style={s.fLabel}>{d.label}</Text>
                    <View style={[s.switch, draft[d.key] && { backgroundColor: colors.primary }]}>
                      <View style={[s.knob, draft[d.key] && { alignSelf: 'flex-end' }]} />
                    </View>
                  </Pressable>
                ) : (
                  <>
                    <Text style={s.fLabel}>{d.label}</Text>
                    <View style={s.wrap}>
                      {d.options.map((o) => {
                        const on = d.kind === 'multi' ? (draft[d.key] ?? []).includes(o.value) : draft[d.key] === o.value;
                        return (
                          <Chip
                            key={String(o.value)}
                            label={o.label}
                            active={on}
                            onPress={() => (d.kind === 'multi' ? setMulti(d, o.value) : setDraft((f) => ({ ...f, [d.key]: on ? undefined : o.value })))}
                          />
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', marginTop: space.md }}>
            <PrimaryButton label={`Show ${count} result${count === 1 ? '' : 's'}`} onPress={() => onApply(draft)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: space.lg, paddingTop: 8, paddingBottom: 14 },
  back: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...shadow },
  catBadge: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: colors.text },
  count: { fontSize: 13, color: colors.muted, marginTop: 1 },
  actionRow: { flexDirection: 'row', gap: 10, marginVertical: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, borderRadius: radius.pill, backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.border },
  actionText: { fontWeight: '800', color: colors.text, fontSize: 14, flexShrink: 1 },
  dot: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  dotText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  backdrop: { flex: 1, backgroundColor: 'rgba(10,20,30,0.45)', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { width: '100%', maxWidth: 440, backgroundColor: colors.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: space.lg, paddingBottom: 28 },
  grabber: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 12 },
  sheetHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 20, fontWeight: '900', color: colors.text, marginBottom: 6 },
  clear: { color: colors.primary, fontWeight: '800', fontSize: 14 },
  fLabel: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switch: { width: 50, height: 30, borderRadius: 15, backgroundColor: colors.border, padding: 3, justifyContent: 'center' },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignSelf: 'flex-start' },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  sortText: { fontSize: 16, color: colors.text, fontWeight: '600' },
});
