import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/userStore';
import { MARKETS } from '../../constants/markets';
import { LANGUAGES } from '../../constants/languages';
import { getTradrSkipLessons, getCodrSkipLessons } from '../../lib/curriculum';
import type { MarketId, LanguageId, TrackId } from '../../types';

interface PlacementQ {
  question: string;
  options: string[];
  correct: number;
}

const TRADR_PLACEMENT: PlacementQ[] = [
  {
    question: 'What does owning a share of stock give you?',
    options: [
      'A loan to the company that earns interest',
      'A small ownership stake in the company',
      'A guaranteed annual dividend payment',
      'The right to manage the company',
    ],
    correct: 1,
  },
  {
    question: "A stock's P/E ratio is 25. What does this mean?",
    options: [
      'The stock has risen 25% this year',
      'The company earns 25% profit on revenue',
      'Investors pay £25 for every £1 of annual earnings',
      'The company has £25 in assets per share',
    ],
    correct: 2,
  },
  {
    question: 'On a candlestick chart, what does a red candle indicate?',
    options: [
      'Trading volume was unusually high',
      'The closing price was lower than the opening price',
      'The stock hit a 52-week low',
      'The stock paid a dividend that day',
    ],
    correct: 1,
  },
  {
    question: 'Interest rates rise. What typically happens to existing bond prices?',
    options: [
      'They rise — higher rates mean more demand',
      'Nothing — bonds are independent of rates',
      'They fall — new bonds pay more, making old ones less attractive',
      'They double to compensate investors',
    ],
    correct: 2,
  },
  {
    question: 'CPI rises to 6%. What does a central bank typically do?',
    options: [
      'Cut interest rates to stimulate spending',
      'Print more money to boost the economy',
      'Weaken the currency to help exports',
      'Raise interest rates to cool inflation',
    ],
    correct: 3,
  },
  {
    question: '"Markets crash as Fed raises rates by 0.25%." What\'s misleading about this?',
    options: [
      'Nothing — a rate rise always crashes markets',
      '0.25% is a large move that justifies "crash"',
      '"Crash" overstates a small, widely-expected move — markets often price in known decisions',
      'The Fed never announces rate decisions publicly',
    ],
    correct: 2,
  },
];

const CODR_PLACEMENT: PlacementQ[] = [
  {
    question: 'What is the average time complexity of a hash map lookup?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correct: 2,
  },
  {
    question: 'What does the Two Pointers pattern typically require about the input?',
    options: [
      'The input must be a linked list',
      'The array must contain only positive integers',
      'The array is usually sorted or the pointers converge toward each other',
      'The array must have an even number of elements',
    ],
    correct: 2,
  },
  {
    question: 'What problem does a sliding window solve efficiently?',
    options: [
      'Finding shortest paths in a graph',
      'Sorting elements in O(n) time',
      'Subarray/substring problems over a contiguous range of elements',
      'Detecting cycles in a linked list',
    ],
    correct: 2,
  },
  {
    question: 'Which traversal guarantees the shortest path in an unweighted graph?',
    options: ['DFS', 'BFS', 'Binary search', 'Dijkstra'],
    correct: 1,
  },
  {
    question: 'A recursive function calls itself n times before the base case. Space complexity?',
    options: ['O(1)', 'O(log n)', 'O(n) — call stack frames', 'O(n²)'],
    correct: 2,
  },
  {
    question: 'Binary search requires the input to be ___.',
    options: [
      'Unsorted — it searches randomly',
      'An array of integers only',
      'Divisible by 2 in length',
      'Sorted — it eliminates half the search space each step',
    ],
    correct: 3,
  },
];

const MARKET_DESCRIPTIONS: Record<MarketId, string> = {
  india: 'Nifty 50, SENSEX, SEBI & RBI',
  eu:    'DAX, CAC 40, ECB & Euronext',
  us:    'S&P 500, NASDAQ, Fed & SEC',
};

const TRACKS: { id: TrackId; icon: string; label: string; sub: string }[] = [
  { id: 'tradr', icon: '📈', label: 'Tradr', sub: 'Master the markets — India 🇮🇳 · EU 🇪🇺 · US 🇺🇸' },
  { id: 'codr',  icon: '💻', label: 'Codr',  sub: 'Ace your interviews — Python 🐍 · Java ☕' },
];

export default function OnboardingScreen() {
  const [step, setStep]                   = useState<0 | 1 | 2 | 'result'>(0);
  const [selectedTrack, setSelectedTrack] = useState<TrackId | null>(null);
  const [selectedMarket, setSelectedMarket]     = useState<MarketId | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId | null>(null);

  // Placement quiz state
  const [currentQ, setCurrentQ]     = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed]     = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const flashAnim = useRef(new Animated.Value(0)).current;

  const setTrack               = useUserStore((s) => s.setTrack);
  const setMarket              = useUserStore((s) => s.setMarket);
  const setLanguage            = useUserStore((s) => s.setLanguage);
  const setPendingSkipLessons  = useUserStore((s) => s.setPendingSkipLessons);

  function handleTrackContinue() {
    if (!selectedTrack) return;
    setTrack(selectedTrack);
    setStep(1);
  }

  function handleMarketLanguageContinue() {
    if (selectedTrack === 'tradr' && !selectedMarket) return;
    if (selectedTrack === 'codr'  && !selectedLanguage) return;
    if (selectedMarket)   setMarket(selectedMarket);
    if (selectedLanguage) setLanguage(selectedLanguage);
    setStep(2);
  }

  function handleOptionSelect(idx: number) {
    if (revealed) return;
    const questions = selectedTrack === 'codr' ? CODR_PLACEMENT : TRADR_PLACEMENT;
    const isCorrect = idx === questions[currentQ].correct;
    setSelectedIdx(idx);
    setRevealed(true);
    if (isCorrect) setCorrectCount((c) => c + 1);

    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelectedIdx(null);
        setRevealed(false);
      } else {
        // Quiz complete — compute skip lessons and show result
        const finalScore = isCorrect ? correctCount + 1 : correctCount;
        const skipIds = selectedTrack === 'codr'
          ? getCodrSkipLessons(finalScore, selectedLanguage ?? 'python')
          : getTradrSkipLessons(finalScore);
        setPendingSkipLessons(skipIds);
        setStep('result');
      }
    }, 700);
  }

  function getSkipMessage(track: TrackId, score: number): { headline: string; sub: string } {
    if (track === 'tradr') {
      if (score >= 5) return { headline: `${score}/6 — skipping to Market Mastery`, sub: "You know the foundations. We're taking you straight to the market-specific content." };
      if (score >= 3) return { headline: `${score}/6 — skipping Units 1 & 2`, sub: "Solid grounding. Starting you at Unit 3: Macro & Market Literacy." };
      return { headline: `${score}/6 — starting from the beginning`, sub: "No worries — the foundations are the most important part." };
    }
    if (score >= 4) return { headline: `${score}/6 — skipping language basics`, sub: "You've got the foundations. Starting at Unit 2: The 10 Patterns." };
    return { headline: `${score}/6 — starting from Unit 1`, sub: "We'll build the toolkit first, then move into patterns." };
  }

  if (step === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>What do you want to master?</Text>
          <Text style={styles.subtitle}>
            Pick a track — or do both. You can switch later.
          </Text>

          {TRACKS.map((track) => {
            const isSelected = selectedTrack === track.id;
            return (
              <TouchableOpacity
                key={track.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedTrack(track.id)}
                activeOpacity={0.8}
                accessibilityLabel={`Select ${track.label} track`}
              >
                <Text style={styles.trackIcon}>{track.icon}</Text>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {track.label}
                  </Text>
                  <Text style={styles.cardSub}>{track.sub}</Text>
                </View>
                {isSelected && <Text style={styles.tick}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnGreen, !selectedTrack && styles.btnDisabled]}
            onPress={handleTrackContinue}
            disabled={!selectedTrack}
            activeOpacity={0.8}
            accessibilityLabel="Continue to next step"
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Step 1 — market picker (Tradr) or language picker (Codr)
  if (step === 1 && selectedTrack === 'tradr') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(0)} activeOpacity={0.7}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Pick your market</Text>
          <Text style={styles.subtitle}>
            Every lesson, chart, and scenario will be tailored to it. You can change this later.
          </Text>

          {(Object.keys(MARKETS) as MarketId[]).map((id) => {
            const market = MARKETS[id];
            const isSelected = selectedMarket === id;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedMarket(id)}
                activeOpacity={0.8}
                accessibilityLabel={`Select ${market.label} market`}
              >
                <Text style={styles.flag}>{market.flag}</Text>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {market.label}
                  </Text>
                  <Text style={styles.cardSub}>{MARKET_DESCRIPTIONS[id]}</Text>
                </View>
                {isSelected && <Text style={styles.tick}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnGreen, !selectedMarket && styles.btnDisabled]}
            onPress={handleMarketLanguageContinue}
            disabled={!selectedMarket}
            activeOpacity={0.8}
            accessibilityLabel="Continue to placement quiz"
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Codr — language selection
  if (step === 1 && selectedTrack === 'codr') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => setStep(0)} activeOpacity={0.7}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Pick your language</Text>
          <Text style={styles.subtitle}>
            Questions and patterns will use your language's syntax. You can switch later.
          </Text>

          {(Object.keys(LANGUAGES) as LanguageId[]).map((id) => {
            const lang = LANGUAGES[id];
            const isSelected = selectedLanguage === id;
            return (
              <TouchableOpacity
                key={id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelectedLanguage(id)}
                activeOpacity={0.8}
                accessibilityLabel={`Select ${lang.label}`}
              >
                <Text style={styles.flag}>{lang.icon}</Text>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {lang.label}
                  </Text>
                  <Text style={styles.cardSub}>{lang.description}</Text>
                </View>
                {isSelected && <Text style={styles.tick}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnGreen, !selectedLanguage && styles.btnDisabled]}
            onPress={handleMarketLanguageContinue}
            disabled={!selectedLanguage}
            activeOpacity={0.8}
            accessibilityLabel="Continue to placement quiz"
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Step 2 — Placement quiz
  if (step === 2) {
    const questions = selectedTrack === 'codr' ? CODR_PLACEMENT : TRADR_PLACEMENT;
    const q = questions[currentQ];
    const progress = (currentQ / questions.length) * 100;

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.quizHeader}>
          <TouchableOpacity onPress={() => setStep(1)} activeOpacity={0.7}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{currentQ + 1}/{questions.length}</Text>
        </View>

        <View style={styles.quizMeta}>
          <Text style={styles.quizEyebrow}>PLACEMENT TEST · NO PENALTY FOR WRONG ANSWERS</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.quizContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.quizQuestion}>{q.question}</Text>

          <View style={styles.optionsContainer}>
            {q.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const isCorrect  = idx === q.correct;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.option,
                    revealed && isSelected && (isCorrect ? styles.optionCorrect : styles.optionWrong),
                    revealed && !isSelected && isCorrect && styles.optionCorrect,
                  ]}
                  onPress={() => handleOptionSelect(idx)}
                  activeOpacity={0.8}
                  disabled={revealed}
                  accessibilityLabel={opt}
                >
                  <Text style={[
                    styles.optionText,
                    revealed && (isSelected || isCorrect) && styles.optionTextRevealed,
                  ]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Result screen
  if (step === 'result') {
    const finalScore = correctCount;
    const { headline, sub } = getSkipMessage(selectedTrack ?? 'tradr', finalScore);
    const skipping = finalScore >= (selectedTrack === 'codr' ? 4 : 3);

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{skipping ? '🚀' : '🐻'}</Text>
          <Text style={styles.resultHeadline}>{headline}</Text>
          <Text style={styles.resultSub}>{sub}</Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnGreen}
            onPress={() => router.push('/(auth)/signup')}
            activeOpacity={0.8}
            accessibilityLabel="Create account"
          >
            <Text style={styles.btnText}>Create account →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#FFFFFF' },
  scroll:        { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 12 },

  backBtn:  { marginBottom: 16 },
  backText: { fontSize: 15, color: '#AFAFAF', fontWeight: '600' },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3C3C3C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#AFAFAF',
    lineHeight: 20,
    marginBottom: 24,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#F7F7F7',
    minHeight: 80,
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: '#58CC02',
    backgroundColor: '#F0FBE4',
  },

  trackIcon: { fontSize: 36, marginRight: 16 },
  flag:      { fontSize: 36, marginRight: 16 },
  cardText:  { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3C3C3C',
  },
  cardTitleSelected: { color: '#58CC02' },
  cardSub: {
    fontSize: 12,
    color: '#AFAFAF',
    marginTop: 2,
    lineHeight: 16,
  },
  tick: {
    fontSize: 20,
    color: '#58CC02',
    fontWeight: '700',
  },

  footer: {
    padding: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  btnGreen: {
    backgroundColor: '#58CC02',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#E5E5E5',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  // Placement quiz
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#58CC02',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#AFAFAF',
    minWidth: 28,
    textAlign: 'right',
  },
  quizMeta: {
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  quizEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: '#AFAFAF',
    letterSpacing: 0.5,
  },
  quizContent: {
    padding: 24,
    paddingTop: 12,
    gap: 16,
  },
  quizQuestion: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3C3C3C',
    lineHeight: 30,
  },
  optionsContainer: { gap: 10 },
  option: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    backgroundColor: '#F7F7F7',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3C3C3C',
    lineHeight: 20,
  },
  optionCorrect: {
    borderColor: '#58CC02',
    backgroundColor: '#D7FFB8',
  },
  optionWrong: {
    borderColor: '#FF4B4B',
    backgroundColor: '#FFDFE0',
  },
  optionTextRevealed: { fontWeight: '700' },

  // Result
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  resultEmoji:    { fontSize: 72 },
  resultHeadline: {
    fontSize: 26,
    fontWeight: '900',
    color: '#3C3C3C',
    textAlign: 'center',
    lineHeight: 32,
  },
  resultSub: {
    fontSize: 15,
    color: '#AFAFAF',
    textAlign: 'center',
    lineHeight: 22,
  },
});
