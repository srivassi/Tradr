import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../store/userStore';
import { colors, typography, spacing } from '../../constants/theme';
import { getPipStage } from '../../constants/pip';
import type { User, MarketId, LanguageId, TrackId, League } from '../../types';
import type { UserRow } from '../../types/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useUserStore((s) => s.setUser);

  async function handleLogin() {
    setError(null);
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (!data.user) throw new Error('Login failed — please try again.');

      const { data: rawProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // PGRST116 = no rows — first login after email confirmation, create profile now
      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      let p: UserRow;
      if (!rawProfile) {
        const meta = data.user.user_metadata as {
          username?: string;
          track?: string;
          market?: string;
          language?: string;
        };
        if (!meta?.username) {
          throw new Error('Account setup incomplete. Please sign up again.');
        }
        const row = {
          id:               data.user.id,
          email:            data.user.email ?? email,
          username:         meta.username,
          track:            meta.track    ?? 'tradr',
          market:           meta.market   ?? 'india',
          language:         meta.language ?? 'python',
          xp:               0,
          level:            1,
          pip_stage:        'bear',
          streak_days:      0,
          last_active:      new Date().toISOString().split('T')[0],
          hearts:           5,
          hearts_refill_at: null as string | null,
          league:           'Bronze',
          created_at:       new Date().toISOString(),
        };
        const { error: insertError } = await supabase.from('users').insert(row);
        if (insertError) throw insertError;
        p = row as UserRow;

        setUser({
          id:             p.id,
          email:          p.email,
          username:       p.username,
          track:          (meta.track ?? 'tradr') as TrackId,
          market:         (meta.market ?? 'india') as MarketId,
          language:       (meta.language ?? 'python') as LanguageId,
          xp:             p.xp,
          level:          p.level,
          pipStage:       getPipStage(p.level),
          streakDays:     p.streak_days,
          lastActive:     p.last_active ?? new Date().toISOString(),
          hearts:         p.hearts,
          heartsRefillAt: p.hearts_refill_at,
          league:         p.league as League,
        } satisfies User);
      } else {
        p = rawProfile as UserRow;

        setUser({
          id:             p.id,
          email:          p.email,
          username:       p.username,
          track:          (p.track    ?? 'tradr')  as TrackId,
          market:         (p.market   ?? 'india')  as MarketId,
          language:       (p.language ?? 'python') as LanguageId,
          xp:             p.xp,
          level:          p.level,
          pipStage:       getPipStage(p.level),
          streakDays:     p.streak_days,
          lastActive:     p.last_active ?? new Date().toISOString(),
          hearts:         p.hearts,
          heartsRefillAt: p.hearts_refill_at,
          league:         p.league as League,
        } satisfies User);
      }

      router.replace('/(tabs)');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message :
        (err && typeof err === 'object' && 'message' in err)
          ? String((err as { message: unknown }).message)
          : 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Pick up where you left off.</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoCorrect={false}
            />
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.signupLink} activeOpacity={0.8}>
          <Text style={styles.signupLinkText}>
            Don't have an account?{' '}
            <Text style={{ color: colors.primary }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityLabel="Log in"
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Log in</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: colors.background },
  scroll:        { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.md },
  title: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sm,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  form:           { gap: spacing.md, marginBottom: spacing.lg },
  fieldContainer: { gap: spacing.xs },
  fieldLabel: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.base,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  btnPrimary: {
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
  btnPressed:  { transform: [{ translateY: 2 }], shadowOffset: { width: 0, height: 2 } },
  btnDisabled: { backgroundColor: '#E5E5E5', shadowOpacity: 0, elevation: 0 },
  btnText: {
    color: '#fff',
    fontSize: typography.lg,
    fontWeight: '800',
  },
  signupLink:     { alignItems: 'center', paddingVertical: spacing.sm },
  signupLinkText: { fontSize: typography.sm, color: colors.textSecondary },
});
