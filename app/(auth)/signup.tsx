import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../store/userStore';
import { colors, typography, spacing } from '../../constants/theme';

export default function SignupScreen() {
  const [email, setEmail]       = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [sent, setSent]         = useState(false);

  const pendingTrack    = useUserStore((s) => s.pendingTrack);
  const pendingMarket   = useUserStore((s) => s.pendingMarket);
  const pendingLanguage = useUserStore((s) => s.pendingLanguage);

  async function handleSignup() {
    setError(null);
    if (!email || !username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            track:    pendingTrack,
            market:   pendingMarket,
            language: pendingLanguage,
          },
        },
      });
      if (authError) throw authError;
      if (!data.user) throw new Error('Signup failed — please try again.');
      setSent(true);
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

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmEmoji}>📬</Text>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.confirmBody}>
            We sent a confirmation link to {email}.{'\n'}
            Click it to activate your account, then come back and log in.
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.replace('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Go to login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Free forever. No credit card needed.</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.form}>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="traderpro99"
            autoCapitalize="none"
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Min 8 characters"
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginLink}>
          <Text style={styles.loginLinkText}>
            Already have an account?{' '}
            <Text style={{ color: colors.primary }}>Log in</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Mastr is for educational purposes only. Nothing here constitutes financial advice.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityLabel="Create account"
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Create account</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Field({
  label, value, onChangeText, placeholder, keyboardType, autoCapitalize, secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'sentences';
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        secureTextEntry={secureTextEntry}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: colors.background },
  scroll:         { flex: 1 },
  scrollContent:  { padding: spacing.lg, paddingBottom: spacing.md },
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  confirmEmoji: { fontSize: 64, marginBottom: spacing.lg },
  confirmBody: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
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
  btnDisabled: { backgroundColor: '#E5E5E5', shadowOpacity: 0, elevation: 0 },
  btnText: {
    color: '#fff',
    fontSize: typography.lg,
    fontWeight: '800',
  },
  loginLink:     { alignItems: 'center', paddingVertical: spacing.sm },
  loginLinkText: { fontSize: typography.sm, color: colors.textSecondary },
  disclaimer: {
    fontSize: 11,
    color: colors.disabled,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 16,
  },
});
