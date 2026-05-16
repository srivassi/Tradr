import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

type AnswerState = 'idle' | 'correct' | 'wrong';

interface Props {
  options: string[];
  selected: number | null;
  answerState: AnswerState;
  correctIndex: number;
  onSelect: (index: number) => void;
}

function getOptionStyle(
  index: number,
  selected: number | null,
  answerState: AnswerState,
  correctIndex: number,
) {
  if (answerState === 'correct' && index === selected) return 'correct';
  if (answerState === 'wrong') {
    if (index === selected)   return 'wrong';
    if (index === correctIndex) return 'highlight';
  }
  if (answerState === 'idle' && index === selected) return 'selected';
  return 'unselected';
}

export default function MultipleChoice({ options, selected, answerState, correctIndex, onSelect }: Props) {
  const disabled = answerState !== 'idle';

  return (
    <View style={styles.container}>
      {options.map((text, i) => {
        const variant = getOptionStyle(i, selected, answerState, correctIndex);
        return (
          <TouchableOpacity
            key={i}
            style={[styles.option, optionVariants[variant]]}
            onPress={() => !disabled && onSelect(i)}
            activeOpacity={disabled ? 1 : 0.7}
            accessibilityLabel={text}
            accessibilityState={{ selected: i === selected }}
          >
            <Text style={[styles.optionText, textVariants[variant]]}>{text}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const optionVariants = StyleSheet.create({
  unselected: { borderColor: colors.border,   backgroundColor: colors.background },
  selected:   { borderColor: '#1CB0F6',       backgroundColor: '#DDF4FF' },
  correct:    { borderColor: colors.primary,  backgroundColor: '#D7FFB8' },
  wrong:      { borderColor: colors.danger,   backgroundColor: '#FFDFE0' },
  highlight:  { borderColor: colors.primary,  backgroundColor: '#D7FFB8' },
});

const textVariants = StyleSheet.create({
  unselected: { color: colors.textPrimary },
  selected:   { color: '#0096CC' },
  correct:    { color: '#3A7D00' },
  wrong:      { color: '#C00000' },
  highlight:  { color: '#3A7D00' },
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  option: {
    borderWidth: 2,
    borderRadius: 16,
    padding: spacing.md,
    minHeight: 56,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: typography.base,
    fontWeight: '600',
    lineHeight: 22,
  },
});
