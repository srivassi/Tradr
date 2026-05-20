import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PIP_STAGES } from '../../constants/pip';
import { colors, spacing, typography } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../store/userStore';

const BADGES = [
  { id: 'first_steps',     icon: '🐻', name: 'First Steps',    condition: 'Complete lesson 1' },
  { id: 'market_reader',   icon: '📰', name: 'Market Reader',  condition: 'Explain 5 headlines' },
  { id: 'chart_reader',    icon: '📊', name: 'Chart Reader',   condition: 'Complete Unit 2' },
  { id: 'week_warrior',    icon: '🔥', name: 'Week Warrior',   condition: '7-day streak' },
  { id: 'macro_mind',      icon: '🌍', name: 'Macro Mind',     condition: 'Complete Unit 3' },
  { id: 'headline_sceptic',icon: '🧐', name: 'Sceptic',        condition: 'Read 10 media literacy notes' },
  { id: 'diamond_hands',   icon: '💎', name: 'Diamond Hands',  condition: '30-day streak' },
  { id: 'perfect_run',     icon: '⭐', name: 'Perfect Run',    condition: '5 perfect lessons' },
  { id: 'golden_bull',     icon: '🐂', name: 'Golden Bull',    condition: 'Reach level 41' },
];

function earnedBadges(completedLessons: string[], streakDays: number): Set<string> {
  const earned = new Set<string>();
  if (completedLessons.includes('unit1-lesson1')) earned.add('first_steps');
  if (completedLessons.some((l) => l.startsWith('unit2'))) earned.add('chart_reader');
  if (completedLessons.some((l) => l.startsWith('unit3'))) earned.add('macro_mind');
  if (streakDays >= 7)  earned.add('week_warrior');
  if (streakDays >= 30) earned.add('diamond_hands');
  return earned;
}

// ─── XP Progress Bar ─────────────────────────────────────────────────────────

function XPBar({ xp, level }: { xp: number; level: number }) {
  const xpForCurrentLevel = (level - 1) * 100;
  const xpIntoLevel = xp - xpForCurrentLevel;
  const progress = Math.min(xpIntoLevel / 100, 1);

  return (
    <View style={styles.xpBarContainer}>
      <View style={styles.xpBarTrack}>
        <View style={[styles.xpBarFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.xpBarLabel}>{xpIntoLevel}/100 XP to Level {level + 1}</Text>
    </View>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Badge Item ───────────────────────────────────────────────────────────────

function BadgeItem({
  badge,
  earned,
}: {
  badge: (typeof BADGES)[0];
  earned: boolean;
}) {
  return (
    <View style={[styles.badgeItem, !earned && styles.badgeLocked]}>
      <Text style={[styles.badgeIcon, !earned && { opacity: 0.3 }]}>{badge.icon}</Text>
      <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]} numberOfLines={2}>
        {earned ? badge.name : '???'}
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const user            = useUserStore((s) => s.user);
  const clearUser       = useUserStore((s) => s.clearUser);
  const completedLessons = useUserStore((s) => s.completedLessons);

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          clearUser();
        },
      },
    ]);
  }

  if (!user) return null;

  const stage = PIP_STAGES[user.pipStage];
  const earned = earnedBadges(completedLessons, user.streakDays);
  const trackLabel = user.track === 'codr' ? `💻 Codr · ${user.language}` : `📈 Tradr · ${user.market}`;
  const leagueColor: Record<string, string> = {
    Bronze: '#CD7F32', Silver: '#C0C0C0', Gold: '#FFD700',
    Diamond: '#1CB0F6', Obsidian: '#3C3C3C',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile</Text>

        {/* Pip + Level */}
        <View style={styles.pipCard}>
          <View style={[styles.pipCircle, { borderColor: stage.tint }]}>
            <Text style={styles.pipEmoji}>
              {user.pipStage === 'bear'     ? '🐻' :
               user.pipStage === 'cubBull'  ? '🐻' :
               user.pipStage === 'halfBull' ? '🐂' : '🐂'}
            </Text>
          </View>
          <View style={styles.pipInfo}>
            <Text style={styles.pipUsername}>{user.username}</Text>
            <Text style={[styles.pipStageLabel, { color: stage.tint }]}>
              Level {user.level} · {stage.label}
            </Text>
            <Text style={styles.pipTrack}>{trackLabel}</Text>
          </View>
          <View style={[styles.leagueBadge, { backgroundColor: leagueColor[user.league] ?? colors.surface }]}>
            <Text style={styles.leagueText}>{user.league}</Text>
          </View>
        </View>

        {/* XP bar */}
        <XPBar xp={user.xp} level={user.level} />

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard icon="🔥" value={user.streakDays} label="Day Streak" />
          <StatCard icon="⚡" value={user.xp.toLocaleString()} label="Total XP" />
          <StatCard icon="❤️" value={user.hearts} label="Hearts" />
          <StatCard icon="📚" value={completedLessons.length} label="Lessons" />
        </View>

        {/* Badges */}
        <Text style={styles.sectionHeader}>BADGES</Text>
        <View style={styles.badgesGrid}>
          {BADGES.map((b) => (
            <BadgeItem key={b.id} badge={b} earned={earned.has(b.id)} />
          ))}
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          For educational purposes only. Nothing here constitutes financial advice.
        </Text>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          activeOpacity={0.8}
          accessibilityLabel="Sign out"
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.md },

  title: { fontSize: typography.xxl, fontWeight: '900', color: colors.textPrimary },

  // Pip card
  pipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.md,
  },
  pipCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipEmoji: { fontSize: 32 },
  pipInfo: { flex: 1, gap: 2 },
  pipUsername: { fontSize: typography.lg, fontWeight: '800', color: colors.textPrimary },
  pipStageLabel: { fontSize: typography.sm, fontWeight: '700' },
  pipTrack: { fontSize: typography.xs, color: colors.textSecondary },
  leagueBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  leagueText: { fontSize: typography.xs, fontWeight: '800', color: '#fff' },

  // XP bar
  xpBarContainer: { gap: 4 },
  xpBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  xpBarLabel: { fontSize: typography.xs, color: colors.textSecondary, textAlign: 'right' },

  // Stats
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 2,
  },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: typography.lg, fontWeight: '900', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },

  // Badges
  sectionHeader: {
    fontSize: typography.xs,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginTop: spacing.sm,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badgeItem: {
    width: '30%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 4,
  },
  badgeLocked: { borderColor: colors.border, backgroundColor: '#FAFAFA' },
  badgeIcon: { fontSize: 28 },
  badgeName: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badgeNameLocked: { color: colors.textSecondary },

  disclaimer: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: spacing.sm,
  },
  signOutBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.danger,
  },
  signOutText: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.danger,
  },
});
