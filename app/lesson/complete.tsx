import { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Pip from '../../components/pip/Pip';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';
import { useUserStore } from '../../store/userStore';
import { QUIZ_PASS_THRESHOLD } from '../../lib/curriculum';
import { completeLesson } from '../../lib/api';
import { SHARED_LESSON_IDS } from '../../lib/curriculum';
import { supabase } from '../../lib/supabase';

interface Message { heading: string; sub: string; pip: string }

function getMessage(accuracy: number, perfect: boolean): Message {
  if (perfect)        return { heading: 'You crushed it!',       sub: 'Perfect score. Pip is impressed.',          pip: '🐻🔥' };
  if (accuracy >= 80) return { heading: 'Smashed it!',           sub: 'Almost perfect — you\'re getting this.',    pip: '🐻💪' };
  if (accuracy >= 60) return { heading: 'Solid effort!',         sub: 'A few slipped by. One more run?',           pip: '🐻👍' };
  if (accuracy >= 40) return { heading: 'Keep going!',           sub: 'The market is patient. So is Pip.',         pip: '🐻📚' };
  return               { heading: 'Every expert started here.',  sub: 'Pip believes in you — try again.',          pip: '🐻🌱' };
}

export default function LessonCompleteScreen() {
  const { lessonId, isQuiz, xp, correct, total } = useLocalSearchParams<{
    lessonId: string; isQuiz: string; xp: string; correct: string; total: string;
  }>();

  const user               = useUserStore((s) => s.user);
  const markLessonComplete = useUserStore((s) => s.markLessonComplete);
  const incrementStreak    = useUserStore((s) => s.incrementStreak);
  const addXP              = useUserStore((s) => s.addXP);
  const syncFromServer     = useUserStore((s) => s.syncFromServer);

  const xpNum      = Number(xp ?? 0);
  const correctNum = Number(correct ?? 0);
  const totalNum   = Number(total ?? 1);
  const accuracy   = Math.round((correctNum / totalNum) * 100);
  const perfect    = correctNum === totalNum;

  const quizPassed = isQuiz !== 'true' || accuracy / 100 >= QUIZ_PASS_THRESHOLD;

  useEffect(() => {
    if (!quizPassed || !lessonId) return;
    markLessonComplete(lessonId);
    void (async () => {
      try {
        const lessonMarket = SHARED_LESSON_IDS.has(lessonId) ? 'shared' : user?.market ?? 'india';
        const result = await completeLesson(lessonId, {
          xp_earned: xpNum,
          correct:   correctNum,
          total:     totalNum,
          perfect,
          is_quiz:   isQuiz === 'true',
          track:     user?.track ?? 'tradr',
          market:    lessonMarket,
        });
        syncFromServer(result.new_xp, result.new_level, result.streak_days);
      } catch {
        // Backend unreachable — update local state and write directly to Supabase
        addXP(xpNum);
        incrementStreak();
        if (user?.id) {
          const newXP    = user.xp + xpNum;
          const newLevel = Math.min(Math.floor(newXP / 100) + 1, 50);
          const today    = new Date().toISOString().split('T')[0];
          const newStreak = user.lastActive === today ? user.streakDays : user.streakDays + 1;

          await Promise.all([
            supabase.from('lesson_progress').upsert({
              user_id:      user.id,
              lesson_id:    lessonId,
              track:        user.track ?? 'tradr',
              market:       user.market ?? 'india',
              completed:    true,
              score:        correctNum,
              xp_earned:    xpNum,
              perfect,
              completed_at: new Date().toISOString(),
            }, { onConflict: 'user_id,lesson_id' }),
            supabase.from('users').update({
              xp:          newXP,
              level:       newLevel,
              streak_days: newStreak,
              last_active: today,
            }).eq('id', user.id),
          ]);
        }
      }
    })();
  }, [lessonId, quizPassed]);

  const msg = isQuiz === 'true' && !quizPassed
    ? { heading: 'Not quite — try again!', sub: `You need ${Math.round(QUIZ_PASS_THRESHOLD * 100)}% to pass the quiz. Give it another go.`, pip: '🐻📖' }
    : getMessage(accuracy, perfect);

  // Animations
  const pipScale      = useRef(new Animated.Value(0)).current;
  const contentSlide  = useRef(new Animated.Value(24)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const xpScale       = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pipScale, {
        toValue: 1, useNativeDriver: true, tension: 55, friction: 5,
      }),
      Animated.sequence([
        Animated.delay(280),
        Animated.parallel([
          Animated.spring(contentSlide,   { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
          Animated.timing(contentOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(xpScale,        { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>

        {/* Pip hero */}
        <Animated.View style={[styles.pipBg, { transform: [{ scale: pipScale }] }]}>
          <Pip level={user?.level ?? 1} mood="celebrate" size={120} />
        </Animated.View>

        {/* Heading + sub */}
        <Animated.View style={[
          styles.textBlock,
          { opacity: contentOpacity, transform: [{ translateY: contentSlide }] },
        ]}>
          <Text style={styles.heading}>{msg.heading}</Text>
          <Text style={styles.sub}>{msg.sub}</Text>
        </Animated.View>

        {/* XP badge */}
        <Animated.View style={[styles.xpBadge, { transform: [{ scale: xpScale }], opacity: contentOpacity }]}>
          <Text style={styles.xpText}>+{xpNum} XP ⚡</Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.stats, { opacity: contentOpacity }]}>
          <Stat label="Accuracy" value={`${accuracy}%`}          color={accuracy >= 80 ? colors.primary : colors.textPrimary} />
          <Stat label="Correct"  value={`${correctNum}/${totalNum}`} color={colors.textPrimary} />
        </Animated.View>

      </View>

      {/* Footer button — outside animated area so it's always tappable */}
      <View style={styles.footer}>
        {!quizPassed ? (
          <TouchableOpacity
            style={[styles.btn, styles.btnRetry]}
            onPress={() => router.replace(`/lesson/${lessonId}`)}
            activeOpacity={0.8}
            accessibilityLabel="Try again"
          >
            <Text style={styles.btnText}>TRY AGAIN ↺</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.8}
            accessibilityLabel="Continue to home"
          >
            <Text style={styles.btnText}>CONTINUE</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },

  pipBg: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E8F9D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pip: { fontSize: 80, textAlign: 'center' },

  textBlock: { alignItems: 'center', gap: spacing.xs },
  heading: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  sub: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  xpBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 100,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  xpText: {
    fontSize: typography.xl,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },

  stats: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: typography.xl,
    fontWeight: '900',
  },

  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btnRetry: { backgroundColor: colors.navy },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  btnText: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
});
