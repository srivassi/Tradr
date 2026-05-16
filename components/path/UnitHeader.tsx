import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

interface Props {
  title: string;
  locked: boolean;
}

export default function UnitHeader({ title, locked }: Props) {
  return (
    <View style={[styles.banner, locked && styles.bannerLocked]}>
      <Text style={[styles.label, locked && styles.labelLocked]}>
        {locked ? '🔒 ' : ''}{title.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  bannerLocked: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
  },
  labelLocked: {
    color: colors.textSecondary,
  },
});
