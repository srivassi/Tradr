import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../store/userStore';

export default function ProfileScreen() {
  const user      = useUserStore((s) => s.user);
  const clearUser = useUserStore((s) => s.clearUser);

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {user && (
          <View style={styles.card}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.meta}>{user.email}</Text>
            <Text style={styles.meta}>
              {user.track === 'codr' ? '💻 Codr' : '📈 Tradr'} ·{' '}
              {user.track === 'codr' ? user.language : user.market}
            </Text>
          </View>
        )}

        <Text style={styles.placeholder}>Pip + stats coming soon</Text>

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
  content:   { padding: spacing.lg, gap: spacing.md },
  title: {
    fontSize: typography.xxl,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 4,
  },
  username: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  placeholder: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  signOutBtn: {
    marginTop: spacing.lg,
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
