import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../store/userStore';
import { computePath, getCurriculum, getCodrCurriculum } from '../../lib/curriculum';
import { MARKETS } from '../../constants/markets';
import { LANGUAGES } from '../../constants/languages';
import { colors, spacing, typography } from '../../constants/theme';
import type { TrackId } from '../../types';
import UnitHeader from '../../components/path/UnitHeader';
import PathNode from '../../components/path/PathNode';
import PathTooltip from '../../components/path/PathTooltip';
import type { PathNode as PathNodeType } from '../../lib/curriculum';
import type { MarketId, LanguageId } from '../../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const NODE_SIZE    = 72;
const SIDE_PAD     = spacing.lg;

// Two alternating x positions (left edge of node)
const X_RIGHT = SCREEN_WIDTH * 0.55 - NODE_SIZE / 2;
const X_LEFT  = SCREEN_WIDTH * 0.22 - NODE_SIZE / 2;

const nodeX = (index: number) => (index % 2 === 0 ? X_RIGHT : X_LEFT);

const DOT_COUNT   = 5;
const DOT_SIZE    = 10;
const CONNECTOR_H = 56;

function PathConnector({ fromIndex, complete }: { fromIndex: number; complete: boolean }) {
  const fromCX = nodeX(fromIndex)     + NODE_SIZE / 2;
  const toCX   = nodeX(fromIndex + 1) + NODE_SIZE / 2;

  return (
    <View style={{ height: CONNECTOR_H, width: SCREEN_WIDTH }}>
      {Array.from({ length: DOT_COUNT }).map((_, i) => {
        const t = (i + 1) / (DOT_COUNT + 1);
        const x = fromCX + (toCX - fromCX) * t - DOT_SIZE / 2;
        const y = CONNECTOR_H * t - DOT_SIZE / 2;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              { left: x, top: y },
              complete && styles.dotComplete,
            ]}
          />
        );
      })}
    </View>
  );
}

export default function LearnScreen() {
  const user             = useUserStore((s) => s.user);
  const completedLessons = useUserStore((s) => s.completedLessons);
  const pendingTrack     = useUserStore((s) => s.pendingTrack);
  const pendingMarket    = useUserStore((s) => s.pendingMarket);
  const pendingLanguage  = useUserStore((s) => s.pendingLanguage);
  const setMarket        = useUserStore((s) => s.setMarket);
  const setLanguage      = useUserStore((s) => s.setLanguage);
  const setTrack         = useUserStore((s) => s.setTrack);
  const [selectedNode, setSelectedNode] = useState<PathNodeType | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleTrackPress(pressed: TrackId) {
    if (track === pressed) {
      setDropdownOpen((o) => !o);
    } else {
      setTrack(pressed);
      if (user?.id) {
        await supabase.from('users').update({ track: pressed }).eq('id', user.id);
      }
      setDropdownOpen(true);
    }
  }

  const track    = user?.track    ?? pendingTrack;
  const market   = (user?.market  ?? pendingMarket) as MarketId;
  const language = (user?.language ?? pendingLanguage) as LanguageId;

  const curriculum = useMemo(
    () => track === 'codr' ? getCodrCurriculum(language) : getCurriculum(market),
    [track, market, language],
  );
  const path = useMemo(
    () => computePath(completedLessons, curriculum),
    [completedLessons, curriculum],
  );

  const streak = user?.streakDays ?? 0;
  const hearts = user?.hearts     ?? 5;
  const xp     = user?.xp         ?? 0;

  function handleStart(lessonId: string) {
    setSelectedNode(null);
    router.push(`/lesson/${lessonId}`);
  }


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Single header row */}
      <View style={styles.header}>
        <View style={styles.trackToggle}>
          <TouchableOpacity
            style={[styles.trackBtn, track === 'tradr' && styles.trackBtnActive]}
            onPress={() => handleTrackPress('tradr')}
            activeOpacity={0.8}
            accessibilityLabel="Tradr — tap to choose market"
          >
            <Text style={[styles.trackBtnText, track === 'tradr' && styles.trackBtnTextActive]}>
              📈 Tradr
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.trackBtn, track === 'codr' && styles.trackBtnActive]}
            onPress={() => handleTrackPress('codr')}
            activeOpacity={0.8}
            accessibilityLabel="Codr — tap to choose language"
          >
            <Text style={[styles.trackBtnText, track === 'codr' && styles.trackBtnTextActive]}>
              💻 Codr
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
          </View>
          <View style={styles.stat} accessibilityLabel={`${hearts} hearts remaining`}>
            <Text style={[styles.statIcon, { color: colors.danger }]}>♥</Text>
            <Text style={[styles.statValue, { color: colors.danger }]}>{hearts}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statValue}>{xp}</Text>
          </View>
        </View>
      </View>

      {/* Inline dropdown — market (Tradr) or language (Codr) */}
      {dropdownOpen && (
        <View style={styles.dropdown}>
          {track === 'tradr'
            ? (Object.values(MARKETS) as typeof MARKETS[MarketId][]).map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.dropdownOption, market === m.id && styles.dropdownOptionActive]}
                  onPress={() => { setMarket(m.id as MarketId); setDropdownOpen(false); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownFlag}>{m.flag}</Text>
                  <Text style={[styles.dropdownLabel, market === m.id && styles.dropdownLabelActive]}>
                    {m.label}
                  </Text>
                  {market === m.id && <Text style={styles.tick}>✓</Text>}
                </TouchableOpacity>
              ))
            : (Object.values(LANGUAGES) as typeof LANGUAGES[LanguageId][]).map((l) => (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.dropdownOption, language === l.id && styles.dropdownOptionActive]}
                  onPress={() => { setLanguage(l.id as LanguageId); setDropdownOpen(false); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownFlag}>{l.icon}</Text>
                  <Text style={[styles.dropdownLabel, language === l.id && styles.dropdownLabelActive]}>
                    {l.label}
                  </Text>
                  {language === l.id && <Text style={styles.tick}>✓</Text>}
                </TouchableOpacity>
              ))
          }
        </View>
      )}

      <View style={styles.divider} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {path.map(({ unit, nodes, unitLocked }) => (
          <View key={unit.id}>
            <UnitHeader title={unit.title} locked={unitLocked} />

            {nodes.map((node, i) => (
              <View key={node.lessonId}>
                {/* Node */}
                <View style={[styles.nodeRow, { paddingLeft: nodeX(i) }]}>
                  <PathNode
                    state={node.state}
                    isQuiz={node.isQuiz}
                    onPress={() => setSelectedNode(node)}
                  />
                </View>

                {/* Connector dots to next node (within unit) */}
                {i < nodes.length - 1 && (
                  <PathConnector
                    fromIndex={i}
                    complete={node.state === 'complete' && nodes[i + 1].state !== 'locked'}
                  />
                )}
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <PathTooltip
        node={selectedNode}
        onDismiss={() => setSelectedNode(null)}
        onStart={handleStart}
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
    paddingVertical: spacing.sm,
  },
  trackToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  trackBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  trackBtnActive:     { backgroundColor: colors.primary },
  trackBtnText:       { fontSize: typography.sm, fontWeight: '700', color: colors.textSecondary },
  trackBtnTextActive: { fontSize: typography.sm, fontWeight: '700', color: '#fff' },

  statsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stat:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statIcon:  { fontSize: 16 },
  statValue: { fontSize: typography.sm, fontWeight: '800', color: colors.textPrimary },

  dropdown: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  dropdownOptionActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0FBE4',
  },
  dropdownFlag:  { fontSize: 22 },
  dropdownLabel: { flex: 1, fontSize: typography.sm, fontWeight: '700', color: colors.textPrimary },
  dropdownLabelActive: { color: colors.primary },

  divider: { height: 1, backgroundColor: colors.border },

  tick: { fontSize: 18, color: colors.primary, fontWeight: '800' },

  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: spacing.lg },

  nodeRow: { paddingVertical: spacing.xs },

  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.border,
  },
  dotComplete: { backgroundColor: colors.primary },
});
