import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

type AnswerState = 'idle' | 'correct' | 'wrong';

interface Props {
  answerState: AnswerState;
  explanation: string;
  disabled: boolean;
  onCheck: () => void;
  onContinue: () => void;
}

export default function AnswerFooter({ answerState, explanation, disabled, onCheck, onContinue }: Props) {
  const slideAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    if (answerState !== 'idle') {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
    } else {
      slideAnim.setValue(200);
    }
  }, [answerState]);

  if (answerState === 'idle') {
    return (
      <View style={styles.idleFooter}>
        <TouchableOpacity
          style={[styles.checkBtn, disabled && styles.checkBtnDisabled]}
          onPress={onCheck}
          disabled={disabled}
          activeOpacity={0.8}
          accessibilityLabel="Check answer"
        >
          <Text style={[styles.checkBtnText, disabled && styles.checkBtnTextDisabled]}>
            CHECK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCorrect = answerState === 'correct';

  return (
    <Animated.View
      style={[
        styles.resultPanel,
        isCorrect ? styles.resultPanelCorrect : styles.resultPanelWrong,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.resultHeader}>
        <Text style={[styles.resultIcon, isCorrect ? styles.textCorrect : styles.textWrong]}>
          {isCorrect ? '✓' : '✗'}
        </Text>
        <Text style={[styles.resultTitle, isCorrect ? styles.textCorrect : styles.textWrong]}>
          {isCorrect ? 'Great job!' : 'Not quite'}
        </Text>
      </View>

      <Text style={styles.explanation}>{explanation}</Text>

      <TouchableOpacity
        style={[styles.continueBtn, isCorrect ? styles.continueBtnCorrect : styles.continueBtnWrong]}
        onPress={onContinue}
        activeOpacity={0.8}
        accessibilityLabel="Continue"
      >
        <Text style={styles.continueBtnText}>CONTINUE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  idleFooter: {
    padding: spacing.lg,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  checkBtn: {
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
  checkBtnDisabled: {
    backgroundColor: colors.surface,
    shadowOpacity: 0,
    elevation: 0,
  },
  checkBtnText: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  checkBtnTextDisabled: {
    color: colors.textSecondary,
  },
  resultPanel: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  resultPanelCorrect: { backgroundColor: '#D7FFB8' },
  resultPanelWrong:   { backgroundColor: '#FFDFE0' },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resultIcon: {
    fontSize: 22,
    fontWeight: '900',
  },
  resultTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
  },
  textCorrect: { color: '#3A7D00' },
  textWrong:   { color: '#C00000' },
  explanation: {
    fontSize: typography.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  continueBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  continueBtnCorrect: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  continueBtnWrong: {
    backgroundColor: colors.danger,
    shadowColor: '#CC0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  continueBtnText: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
});
