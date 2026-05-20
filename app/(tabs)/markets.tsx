import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../../constants/theme';
import { useUserStore } from '../../store/userStore';
import type { Headline, MarketQuote } from '../../types';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

type MarketId = 'india' | 'eu' | 'us';

const MARKET_META: Record<MarketId, { label: string; flag: string; currency: string }> = {
  india: { label: 'India', flag: '🇮🇳', currency: '₹' },
  eu:    { label: 'Europe', flag: '🇪🇺', currency: '€' },
  us:    { label: 'United States', flag: '🇺🇸', currency: '$' },
};

// ─── Index Card ──────────────────────────────────────────────────────────────

function IndexCard({ quote, currency }: { quote: MarketQuote; currency: string }) {
  const isUp = quote.changePct >= 0;
  const changeColor = isUp ? colors.bullGreen : colors.bearRed;
  const arrow = isUp ? '▲' : '▼';

  return (
    <View style={styles.indexCard}>
      <View style={styles.indexCardLeft}>
        <Text style={styles.indexName}>{quote.name}</Text>
        <Text style={styles.indexPrice}>
          {currency}{quote.price.toLocaleString()}
        </Text>
      </View>
      <View style={[styles.indexBadge, { backgroundColor: isUp ? '#D7FFB8' : '#FFDFE0' }]}>
        <Text style={[styles.indexChange, { color: changeColor }]}>
          {arrow} {Math.abs(quote.changePct).toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}

// ─── Sector Heatmap ──────────────────────────────────────────────────────────

function SectorTile({ name, changePct }: { name: string; changePct: number }) {
  const isUp = changePct >= 0;
  const intensity = Math.min(Math.abs(changePct) / 3, 1);
  const bg = isUp
    ? `rgba(0, 200, 83, ${0.15 + intensity * 0.45})`
    : `rgba(255, 61, 0, ${0.15 + intensity * 0.45})`;
  const textColor = isUp ? '#005C24' : '#7A0000';

  return (
    <View style={[styles.sectorTile, { backgroundColor: bg }]}>
      <Text style={[styles.sectorName, { color: textColor }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.sectorChange, { color: textColor }]}>
        {changePct >= 0 ? '+' : ''}{changePct.toFixed(1)}%
      </Text>
    </View>
  );
}

// ─── Headline Card ────────────────────────────────────────────────────────────

function HeadlineCard({
  headline,
  onExplain,
}: {
  headline: Headline & { body_snippet?: string };
  onExplain: (h: Headline & { body_snippet?: string }) => void;
}) {
  const timeAgo = useCallback(() => {
    if (!headline.publishedAt) return '';
    const diff = Date.now() - new Date(headline.publishedAt).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }, [headline.publishedAt]);

  return (
    <View style={styles.headlineCard}>
      <Text style={styles.headlineTitle}>{headline.title}</Text>
      <View style={styles.headlineMeta}>
        <Text style={styles.headlineSource}>
          {headline.source} · {timeAgo()}
        </Text>
        <TouchableOpacity
          style={styles.explainBtn}
          onPress={() => onExplain(headline)}
          accessibilityLabel={`Explain headline: ${headline.title}`}
        >
          <Text style={styles.explainBtnText}>🤖 Explain</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── AI Explain Modal ─────────────────────────────────────────────────────────

function ExplainModal({
  visible,
  headline,
  market,
  onClose,
}: {
  visible: boolean;
  headline: (Headline & { body_snippet?: string }) | null;
  market: MarketId;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const user = useUserStore((s) => s.user);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      setExplanation('');
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      fetchExplanation();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  async function fetchExplanation() {
    if (!headline) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/news/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: headline.title,
          body_snippet: headline.body_snippet ?? '',
          market,
          user_level: user?.level ?? 1,
        }),
      });
      if (!res.ok) throw new Error('explain failed');
      const data = await res.json();
      setExplanation(data.explanation ?? '');
    } catch {
      setExplanation('Could not load explanation. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable>
          <Animated.View
            style={[styles.explainSheet, { transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle} numberOfLines={3}>
              {headline?.title}
            </Text>
            <View style={styles.sheetDivider} />
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingText}>Pip is reading the markets…</Text>
              </View>
            ) : (
              <Text style={styles.explanationText}>{explanation}</Text>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close explanation">
              <Text style={styles.closeBtnText}>Got it</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MarketsScreen() {
  const storeMarket = useUserStore((s) => s.user?.market) as MarketId | undefined;
  const [market, setMarket] = useState<MarketId>(storeMarket ?? 'india');
  const [indices, setIndices] = useState<MarketQuote[]>([]);
  const [sectors, setSectors] = useState<{ sector: string; change_pct: number }[]>([]);
  const [headlines, setHeadlines] = useState<(Headline & { body_snippet?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [explainTarget, setExplainTarget] = useState<(Headline & { body_snippet?: string }) | null>(null);
  const [showExplain, setShowExplain] = useState(false);

  const meta = MARKET_META[market];

  async function load(isRefresh = false) {
    if (!isRefresh) setLoading(true);
    try {
      const [indRes, secRes, newsRes] = await Promise.all([
        fetch(`${BACKEND}/markets/${market}/indices`).then((r) => r.json()),
        fetch(`${BACKEND}/markets/${market}/sectors`).then((r) => r.json()),
        fetch(`${BACKEND}/news/${market}`).then((r) => r.json()),
      ]);

      // Map snake_case from backend to camelCase expected by types
      setIndices(
        (indRes as any[]).map((q: any) => ({
          ticker:    q.ticker,
          name:      q.name,
          price:     q.price ?? 0,
          changePct: q.change_pct ?? 0,
          volume:    q.volume ?? 0,
          currency:  q.currency ?? meta.currency,
        }))
      );
      setSectors(secRes as any[]);
      setHeadlines((newsRes.headlines ?? []) as any[]);
    } catch (err) {
      // Non-critical — show empty state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, [market]);

  function handleExplain(h: Headline & { body_snippet?: string }) {
    setExplainTarget(h);
    setShowExplain(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        {/* Market selector tabs */}
        <View style={styles.marketTabs}>
          {(Object.keys(MARKET_META) as MarketId[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMarket(m)}
              style={[styles.marketTab, market === m && styles.marketTabActive]}
              accessibilityLabel={`Switch to ${MARKET_META[m].label} market`}
            >
              <Text style={styles.marketTabFlag}>{MARKET_META[m].flag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingFull}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching live data…</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(true); }}
              tintColor={colors.primary}
            />
          }
        >
          {/* Market label */}
          <Text style={styles.sectionLabel}>
            {meta.flag} {meta.label.toUpperCase()}
          </Text>

          {/* Index cards */}
          {indices.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Market data unavailable · Backend offline?
              </Text>
            </View>
          ) : (
            indices.map((q) => (
              <IndexCard key={q.ticker} quote={q} currency={meta.currency} />
            ))
          )}

          {/* Sector heatmap */}
          {sectors.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
                SECTORS TODAY
              </Text>
              <View style={styles.heatmapGrid}>
                {sectors.map((s) => (
                  <SectorTile key={s.sector} name={s.sector} changePct={s.change_pct} />
                ))}
              </View>
            </>
          )}

          {/* Headlines */}
          <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
            TODAY'S HEADLINES
          </Text>
          {headlines.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No headlines available right now.</Text>
            </View>
          ) : (
            headlines.map((h) => (
              <HeadlineCard
                key={h.id}
                headline={h}
                onExplain={handleExplain}
              />
            ))
          )}

          <View style={{ height: spacing.xxl }} />
        </ScrollView>
      )}

      <ExplainModal
        visible={showExplain}
        headline={explainTarget}
        market={market}
        onClose={() => setShowExplain(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  marketTabs: { flexDirection: 'row', gap: 6 },
  marketTab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  marketTabActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0FFF0',
  },
  marketTabFlag: { fontSize: 20 },

  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  sectionLabel: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },

  // Index card
  indexCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  indexCardLeft: { gap: 2 },
  indexName: { fontSize: typography.sm, fontWeight: '700', color: colors.textSecondary },
  indexPrice: { fontSize: typography.lg, fontWeight: '900', color: colors.textPrimary },
  indexBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  indexChange: { fontSize: typography.sm, fontWeight: '800' },

  // Sector heatmap
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.sm,
  },
  sectorTile: {
    width: '30%',
    borderRadius: 10,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  sectorName: { fontSize: typography.xs, fontWeight: '700' },
  sectorChange: { fontSize: typography.xs, fontWeight: '800' },

  // Headline card
  headlineCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  headlineTitle: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  headlineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headlineSource: { fontSize: typography.xs, color: colors.textSecondary },
  explainBtn: {
    backgroundColor: '#EEF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.navy,
  },
  explainBtnText: { fontSize: typography.xs, fontWeight: '700', color: colors.navy },

  // Explain modal / bottom sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  explainSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.md,
    minHeight: 300,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  sheetTitle: {
    fontSize: typography.base,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  sheetDivider: { height: 1, backgroundColor: colors.border },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  loadingText: { color: colors.textSecondary, fontSize: typography.sm },
  explanationText: {
    fontSize: typography.base,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  closeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  closeBtnText: { fontSize: typography.base, fontWeight: '800', color: '#fff' },

  // Loading / empty states
  loadingFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  emptyText: { color: colors.textSecondary, fontSize: typography.sm },
});
