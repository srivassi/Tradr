import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../constants/theme';
import { useUserStore } from '../../store/userStore';
import { getLesson } from '../../lib/lessonData';
import ProgressBar from '../../components/lesson/ProgressBar';
import MultipleChoice from '../../components/lesson/MultipleChoice';
import AnswerFooter from '../../components/lesson/AnswerFooter';
import FormattedText from '../../components/lesson/FormattedText';
import CodeBlock from '../../components/lesson/CodeBlock';

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(id ?? '');

  const [index, setIndex]           = useState(0);
  const [selected, setSelected]     = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [hearts, setHearts]         = useState(5);
  const [correctCount, setCorrectCount] = useState(0);

  const addXP    = useUserStore((s) => s.addXP);
  const useHeart = useUserStore((s) => s.useHeart);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  const question = lesson.questions[index];
  const isLast   = index === lesson.questions.length - 1;

  function handleExit() {
    Alert.alert(
      'Leave lesson?',
      'Your progress will be lost.',
      [
        { text: 'Keep going', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() },
      ],
    );
  }

  function handleCheck() {
    if (selected === null) return;
    const correct = selected === question.correct;
    setAnswerState(correct ? 'correct' : 'wrong');
    if (correct) {
      addXP(10);
      setCorrectCount((c) => c + 1);
    } else {
      if (hearts > 0) {
        setHearts((h) => h - 1);
        useHeart();
      }
    }
  }

  function handleContinue() {
    if (!lesson) return;

    if (hearts === 0 && answerState === 'wrong') {
      router.replace('/(tabs)');
      return;
    }

    if (isLast) {
      const xp      = correctCount * 10 + lesson.xpReward;
      const perfect = correctCount === lesson.questions.length;
      if (perfect) addXP(50);
      router.replace({
        pathname: '/lesson/complete',
        params: {
          lessonId: lesson.id,
          isQuiz:   String(lesson.id.endsWith('-quiz')),
          xp:       String(xp),
          correct:  String(correctCount),
          total:    String(lesson.questions.length),
        },
      });
      return;
    }

    setIndex((i) => i + 1);
    setSelected(null);
    setAnswerState('idle');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressBar
        current={index + 1}
        total={lesson.questions.length}
        hearts={hearts}
        onExit={handleExit}
        lessonName={lesson.name}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {question.codeSnippet && (
          <CodeBlock code={question.codeSnippet} language={question.codeLanguage} />
        )}
        <FormattedText text={question.question} style={styles.question} />
      </ScrollView>

      <MultipleChoice
        options={question.options}
        selected={selected}
        answerState={answerState}
        correctIndex={question.correct}
        onSelect={setSelected}
      />

      <AnswerFooter
        answerState={answerState}
        explanation={question.explanationShort}
        disabled={selected === null}
        onCheck={handleCheck}
        onContinue={handleContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.background },
  scroll:       { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  question: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  errorText: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
