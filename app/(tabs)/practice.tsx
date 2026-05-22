import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../../constants/theme';
import { useUserStore } from '../../store/userStore';
import { BACKEND } from '../../lib/backend';

type AnswerState = 'idle' | 'selected' | 'correct' | 'wrong';

interface Scenario {
  id: string;
  market: string;
  context: string;
  question: string;
  options: string[];
  correct: number;
  explanation_short: string;
  media_literacy_note?: string;
  difficulty: number;
  tags: string[];
}

// ─── Difficulty Pip ───────────────────────────────────────────────────────────

function DifficultyPips({ level }: { level: number }) {
  return (
    <View style={styles.pips}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={[styles.pip, i <= level ? styles.pipFilled : styles.pipEmpty]}
        />
      ))}
    </View>
  );
}

// ─── Option Button ────────────────────────────────────────────────────────────

function OptionButton({
  text,
  index,
  selectedIndex,
  correctIndex,
  answerState,
  onPress,
}: {
  text: string;
  index: number;
  selectedIndex: number | null;
  correctIndex: number;
  answerState: AnswerState;
  onPress: (i: number) => void;
}) {
  const isSelected = selectedIndex === index;
  const isCorrect = index === correctIndex;

  let bgColor: string = '#fff';
  let borderColor: string = colors.border;
  let textColor: string = colors.textPrimary;

  if (answerState === 'selected' && isSelected) {
    bgColor = '#DDF4FF';
    borderColor = colors.navy;
    textColor = colors.navy;
  } else if (answerState === 'correct' || answerState === 'wrong') {
    if (isCorrect) {
      bgColor = '#D7FFB8';
      borderColor = colors.primary;
      textColor = '#2D6A00';
    } else if (isSelected && !isCorrect) {
      bgColor = '#FFDFE0';
      borderColor = colors.danger;
      textColor = '#7A0000';
    }
  }

  const disabled = answerState === 'correct' || answerState === 'wrong';

  return (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: bgColor, borderColor }]}
      onPress={() => onPress(index)}
      disabled={disabled}
      activeOpacity={0.75}
      accessibilityLabel={`Option ${index + 1}: ${text}`}
    >
      <Text style={[styles.optionText, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
}

// ─── Codr Practice ───────────────────────────────────────────────────────────

interface CodrScenario {
  id: string;
  track: string;
  pattern: string;
  context: string;
  question: string;
  options: string[];
  correct: number;
  explanation_short: string;
  difficulty: number;
  tags: string[];
}

function CodrPracticeScreen() {
  const user = useUserStore((s) => s.user);
  const addXP = useUserStore((s) => s.addXP);

  const [scenario, setScenario] = useState<CodrScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    correct: boolean;
    explanation_short: string;
    claude_explanation: string | null;
  } | null>(null);
  const [xpEarned, setXpEarned] = useState(0);

  const footerAnim = useRef(new Animated.Value(120)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;

  async function loadChallenge() {
    setLoading(true);
    setSelectedIndex(null);
    setAnswerState('idle');
    setResult(null);
    setXpEarned(0);
    try {
      const res = await fetch(`${BACKEND}/scenarios/daily?track=codr`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setScenario(data.scenario ?? null);
    } catch {
      setScenario(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadChallenge(); }, []);

  function selectOption(index: number) {
    if (answerState !== 'idle') return;
    setSelectedIndex(index);
    setAnswerState('selected');
  }

  async function checkAnswer() {
    if (selectedIndex === null || !scenario || checking) return;
    setChecking(true);
    try {
      const res = await fetch(`${BACKEND}/scenarios/${scenario.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_index: selectedIndex, user_level: user?.level ?? 1, market: 'us' }),
      });
      const data = await res.json();
      const isCorrect: boolean = data.correct;
      setResult({
        correct: isCorrect,
        explanation_short: data.explanation_short,
        claude_explanation: data.claude_explanation ?? null,
      });
      setAnswerState(isCorrect ? 'correct' : 'wrong');
      Animated.spring(footerAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
      if (isCorrect) {
        const xp = 30;
        setXpEarned(xp);
        addXP(xp);
        Animated.sequence([
          Animated.timing(xpAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.delay(1200),
          Animated.timing(xpAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      }
    } catch {
      setAnswerState('idle');
    } finally {
      setChecking(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingFull}>
          <ActivityIndicator size="large" color={colors.navy} />
          <Text style={styles.loadingText}>Loading today's challenge…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!scenario) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Practice</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>💻</Text>
            <Text style={styles.emptyTitle}>No challenge today</Text>
            <Text style={styles.emptySubtext}>Make sure the backend is running.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const isAnswered = answerState === 'correct' || answerState === 'wrong';

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[styles.xpBurst, { opacity: xpAnim, transform: [{ translateY: xpAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }) }] }]}
      >
        <Text style={styles.xpBurstText}>+{xpEarned} XP ⚡</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Practice</Text>
          <View style={[styles.dailyChip, { borderColor: colors.navy, backgroundColor: '#EEF6FF' }]}>
            <Text style={[styles.dailyChipText, { color: colors.navy }]}>💻 Daily Challenge</Text>
          </View>
        </View>

        <View style={[styles.scenarioCard, { borderColor: colors.navy, backgroundColor: '#F0F8FF' }]}>
          <View style={styles.scenarioMeta}>
            <Text style={[styles.liveTag, { color: colors.navy }]}>📐 {scenario.pattern?.toUpperCase() ?? 'ALGORITHM'}</Text>
            <DifficultyPips level={scenario.difficulty} />
          </View>
          <Text style={styles.contextText}>{scenario.context}</Text>
        </View>

        <Text style={styles.question}>{scenario.question}</Text>

        <View style={styles.optionsContainer}>
          {scenario.options.map((opt, i) => (
            <OptionButton
              key={i}
              text={opt}
              index={i}
              selectedIndex={selectedIndex}
              correctIndex={scenario.correct}
              answerState={answerState}
              onPress={selectOption}
            />
          ))}
        </View>

        <View style={{ height: isAnswered ? 220 : 100 }} />
      </ScrollView>

      {!isAnswered && (
        <View style={styles.checkContainer}>
          <TouchableOpacity
            style={[styles.checkBtn, selectedIndex === null && styles.checkBtnDisabled, { backgroundColor: selectedIndex !== null ? colors.navy : colors.disabled }]}
            onPress={checkAnswer}
            disabled={selectedIndex === null || checking}
            accessibilityLabel="Check answer"
          >
            {checking ? <ActivityIndicator color="#fff" /> : <Text style={styles.checkBtnText}>CHECK</Text>}
          </TouchableOpacity>
        </View>
      )}

      {isAnswered && result && (
        <Animated.View
          style={[styles.resultFooter, result.correct ? styles.footerCorrect : styles.footerWrong, { transform: [{ translateY: footerAnim }] }]}
        >
          <Text style={[styles.footerLabel, result.correct ? styles.footerLabelCorrect : styles.footerLabelWrong]}>
            {result.correct ? '✅  Great job!' : '❌  Not quite'}
          </Text>
          <Text style={styles.footerExplanation}>
            {result.claude_explanation ?? result.explanation_short}
          </Text>
          <TouchableOpacity
            style={[styles.continueBtn, result.correct ? styles.continueBtnCorrect : styles.continueBtnWrong]}
            onPress={loadChallenge}
            accessibilityLabel="Next challenge"
          >
            <Text style={styles.continueBtnText}>NEXT CHALLENGE</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PracticeScreen() {
  const user = useUserStore((s) => s.user);
  const addXP = useUserStore((s) => s.addXP);
  const track = user?.track ?? 'tradr';

  if (track === 'codr') return <CodrPracticeScreen />;

  const market = (user?.market ?? 'india') as string;

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    correct: boolean;
    explanation_short: string;
    claude_explanation: string | null;
    media_literacy_note: string | null;
  } | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [showMediaNote, setShowMediaNote] = useState(false);

  const footerAnim = useRef(new Animated.Value(120)).current;
  const xpAnim = useRef(new Animated.Value(0)).current;

  async function loadScenario() {
    setLoading(true);
    setSelectedIndex(null);
    setAnswerState('idle');
    setResult(null);
    setXpEarned(0);
    setShowMediaNote(false);
    try {
      const res = await fetch(`${BACKEND}/scenarios/daily?market=${market}`);
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setScenario(data.scenario ?? null);
    } catch {
      setScenario(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadScenario(); }, []);

  function selectOption(index: number) {
    if (answerState !== 'idle') return;
    setSelectedIndex(index);
    setAnswerState('selected');
  }

  async function checkAnswer() {
    if (selectedIndex === null || !scenario || checking) return;
    setChecking(true);
    try {
      const res = await fetch(`${BACKEND}/scenarios/${scenario.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_index: selectedIndex,
          user_level: user?.level ?? 1,
          market,
        }),
      });
      const data = await res.json();
      const isCorrect: boolean = data.correct;

      setResult({
        correct: isCorrect,
        explanation_short: data.explanation_short,
        claude_explanation: data.claude_explanation ?? null,
        media_literacy_note: data.media_literacy_note ?? null,
      });
      setAnswerState(isCorrect ? 'correct' : 'wrong');

      // Show footer
      Animated.spring(footerAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();

      if (isCorrect) {
        const xp = 30;
        setXpEarned(xp);
        addXP(xp);
        Animated.sequence([
          Animated.timing(xpAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.delay(1200),
          Animated.timing(xpAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      }
    } catch {
      setAnswerState('idle');
    } finally {
      setChecking(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingFull}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading today's challenge…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!scenario) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Practice</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>⚡</Text>
            <Text style={styles.emptyTitle}>No challenge today</Text>
            <Text style={styles.emptySubtext}>
              Make sure the backend is running:{'\n'}uvicorn main:app --reload
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const marketFlag: Record<string, string> = { india: '🇮🇳', eu: '🇪🇺', us: '🇺🇸' };
  const isAnswered = answerState === 'correct' || answerState === 'wrong';

  return (
    <SafeAreaView style={styles.container}>
      {/* XP burst */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.xpBurst,
          {
            opacity: xpAnim,
            transform: [{ translateY: xpAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }) }],
          },
        ]}
      >
        <Text style={styles.xpBurstText}>+{xpEarned} XP ⚡</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Practice</Text>
          <View style={styles.dailyChip}>
            <Text style={styles.dailyChipText}>⚡ Daily Challenge</Text>
          </View>
        </View>

        {/* Scenario card */}
        <View style={styles.scenarioCard}>
          <View style={styles.scenarioMeta}>
            <Text style={styles.liveTag}>
              {marketFlag[scenario.market] ?? '🌍'} LIVE SCENARIO
            </Text>
            <DifficultyPips level={scenario.difficulty} />
          </View>
          <Text style={styles.contextText}>{scenario.context}</Text>
        </View>

        {/* Question */}
        <Text style={styles.question}>{scenario.question}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {scenario.options.map((opt, i) => (
            <OptionButton
              key={i}
              text={opt}
              index={i}
              selectedIndex={selectedIndex}
              correctIndex={scenario.correct}
              answerState={answerState}
              onPress={selectOption}
            />
          ))}
        </View>

        {/* Bottom padding for footer */}
        <View style={{ height: isAnswered ? (showMediaNote ? 400 : 220) : 100 }} />
      </ScrollView>

      {/* CHECK button (before answer) */}
      {!isAnswered && (
        <View style={styles.checkContainer}>
          <TouchableOpacity
            style={[
              styles.checkBtn,
              selectedIndex === null && styles.checkBtnDisabled,
            ]}
            onPress={checkAnswer}
            disabled={selectedIndex === null || checking}
            accessibilityLabel="Check answer"
          >
            {checking ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.checkBtnText}>CHECK</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Result footer */}
      {isAnswered && result && (
        <Animated.View
          style={[
            styles.resultFooter,
            result.correct ? styles.footerCorrect : styles.footerWrong,
            { transform: [{ translateY: footerAnim }] },
          ]}
        >
          <Text style={[styles.footerLabel, result.correct ? styles.footerLabelCorrect : styles.footerLabelWrong]}>
            {result.correct ? '✅  Great job!' : '❌  Not quite'}
          </Text>
          <Text style={styles.footerExplanation}>
            {result.claude_explanation ?? result.explanation_short}
          </Text>
          {result.media_literacy_note && !showMediaNote && (
            <TouchableOpacity
              style={styles.mediaBtn}
              onPress={() => setShowMediaNote(true)}
              accessibilityLabel="Show media literacy note"
            >
              <Text style={styles.mediaBtnText}>🧐 Show Media Literacy Note</Text>
            </TouchableOpacity>
          )}
          {result.media_literacy_note && showMediaNote && (
            <View style={styles.mediaNote}>
              <Text style={styles.mediaNoteTitle}>🧐 Media Literacy Note</Text>
              <Text style={styles.mediaNoteText}>{result.media_literacy_note}</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.continueBtn, result.correct ? styles.continueBtnCorrect : styles.continueBtnWrong]}
            onPress={loadScenario}
            accessibilityLabel="Next challenge"
          >
            <Text style={styles.continueBtnText}>NEXT CHALLENGE</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  loadingFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: { color: colors.textSecondary, fontSize: typography.sm },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: { fontSize: typography.xxl, fontWeight: '900', color: colors.textPrimary },
  dailyChip: {
    backgroundColor: '#FFF8E0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  dailyChipText: { fontSize: typography.xs, fontWeight: '800', color: '#A07000' },

  // Scenario card
  scenarioCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.navy,
    gap: spacing.sm,
  },
  scenarioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveTag: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: colors.navy,
    letterSpacing: 0.5,
  },
  pips: { flexDirection: 'row', gap: 4 },
  pip: { width: 8, height: 8, borderRadius: 4 },
  pipFilled: { backgroundColor: colors.navy },
  pipEmpty: { backgroundColor: colors.border },
  contextText: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    lineHeight: 22,
  },

  // Question
  question: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: spacing.md,
  },

  // Options
  optionsContainer: { gap: spacing.sm },
  option: {
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },

  // Media literacy note
  mediaNote: {
    backgroundColor: '#FFF8E0',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.gold,
    gap: spacing.xs,
  },
  mediaNoteTitle: {
    fontSize: typography.sm,
    fontWeight: '800',
    color: '#7A5000',
  },
  mediaNoteText: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },

  // Check button
  checkContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: 32,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checkBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  checkBtnDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  checkBtnText: { fontSize: typography.base, fontWeight: '900', color: '#fff' },

  // Result footer
  resultFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: 36,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: spacing.sm,
  },
  footerCorrect: { backgroundColor: '#D7FFB8' },
  footerWrong: { backgroundColor: '#FFDFE0' },
  footerLabel: { fontSize: typography.lg, fontWeight: '900' },
  footerLabelCorrect: { color: '#2D6A00' },
  footerLabelWrong: { color: '#7A0000' },
  footerExplanation: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  mediaBtn: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  mediaBtnText: { fontSize: typography.xs, fontWeight: '700', color: '#7A5000' },
  continueBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  continueBtnCorrect: { backgroundColor: colors.primary },
  continueBtnWrong: { backgroundColor: colors.danger },
  continueBtnText: { fontSize: typography.base, fontWeight: '900', color: '#fff' },

  // XP burst overlay
  xpBurst: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    zIndex: 100,
    pointerEvents: 'none',
  } as any,
  xpBurstText: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.gold,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  // Empty state
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: typography.lg, fontWeight: '800', color: colors.textPrimary },
  emptySubtext: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
