import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUserStore } from '../../store/userStore';
import { computePath, getCurriculum, getCodrCurriculum } from '../../lib/curriculum';
import { MARKETS } from '../../constants/markets';
import { LANGUAGES } from '../../constants/languages';
import { colors, spacing, typography } from '../../constants/theme';
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
  const [selectedNode, setSelectedNode]         = useState<PathNodeType | null>(null);
  const [pickerOpen, setPickerOpen]             = useState(false);

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

  const pickerLabel = track === 'codr'
    ? `${LANGUAGES[language].icon}  ${LANGUAGES[language].label}  ▾`
    : `${MARKETS[market].flag}  ${MARKETS[market].label}  ▾`;

  const pickerTitle = track === 'codr' ? 'Choose your language' : 'Choose your market';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Single header bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.marketBtn}
          onPress={() => setPickerOpen(true)}
          activeOpacity={0.7}
          accessibilityLabel={pickerTitle}
        >
          <Text style={styles.marketBtnText}>{pickerLabel}</Text>
        </TouchableOpacity>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{streak}</Text>
          </View>
          <View style={styles.hearts}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Text key={i} style={i < hearts ? styles.heart : styles.heartEmpty}>♥</Text>
            ))}
          </View>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statValue}>{xp}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Market / Language picker modal */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setPickerOpen(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{pickerTitle}</Text>

            {track === 'tradr'
              ? (Object.values(MARKETS) as typeof MARKETS[MarketId][]).map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.marketOption, market === m.id && styles.marketOptionActive]}
                    onPress={() => { setMarket(m.id as MarketId); setPickerOpen(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.marketOptionFlag}>{m.flag}</Text>
                    <Text style={[styles.marketOptionLabel, market === m.id && styles.marketOptionLabelActive]}>
                      {m.label}
                    </Text>
                    {market === m.id && <Text style={styles.tick}>✓</Text>}
                  </TouchableOpacity>
                ))
              : (Object.values(LANGUAGES) as typeof LANGUAGES[LanguageId][]).map((l) => (
                  <TouchableOpacity
                    key={l.id}
                    style={[styles.marketOption, language === l.id && styles.marketOptionActive]}
                    onPress={() => { setLanguage(l.id as LanguageId); setPickerOpen(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.marketOptionFlag}>{l.icon}</Text>
                    <Text style={[styles.marketOptionLabel, language === l.id && styles.marketOptionLabelActive]}>
                      {l.label}
                    </Text>
                    {language === l.id && <Text style={styles.tick}>✓</Text>}
                  </TouchableOpacity>
                ))
            }
          </View>
        </TouchableOpacity>
      </Modal>

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
    paddingVertical: spacing.md,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statIcon:   { fontSize: 20 },
  statValue:  { fontSize: typography.base, fontWeight: '800', color: colors.textPrimary },
  hearts:     { flexDirection: 'row', gap: 2 },
  heart:      { fontSize: 16, color: colors.danger },
  heartEmpty: { fontSize: 16, color: colors.border },

  divider: { height: 1, backgroundColor: colors.border },

  marketBtn: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  marketBtnText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stats: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  modalHandle: {
    width: 40, height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  marketOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  marketOptionActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0FBE4',
  },
  marketOptionFlag:  { fontSize: 28 },
  marketOptionLabel: { flex: 1, fontSize: typography.base, fontWeight: '700', color: colors.textPrimary },
  marketOptionLabelActive: { color: colors.primary },
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
