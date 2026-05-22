import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { spacing, typography } from '../../constants/theme';

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: Props) {
  return (
    <View style={styles.container}>
      {language && <Text style={styles.lang}>{language}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.code}>{code}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  lang: {
    fontFamily: MONO,
    fontSize: typography.xs,
    color: '#888',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  code: {
    fontFamily: MONO,
    fontSize: 13,
    color: '#CDD6F4',
    lineHeight: 20,
  },
});
