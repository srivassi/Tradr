import type { MarketId } from '../constants/markets';
import type { LanguageId } from '../constants/languages';
import type { PipMood, PipStage } from '../constants/pip';

export type { MarketId, LanguageId, PipMood, PipStage };

export type TrackId = 'tradr' | 'codr';

export interface User {
  id: string;
  email: string;
  username: string;
  track: TrackId;
  market: MarketId;
  language: LanguageId;
  xp: number;
  level: number;
  pipStage: PipStage;
  streakDays: number;
  lastActive: string;
  hearts: number;
  heartsRefillAt: string | null;
  league: League;
}

export type League = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Obsidian';

export interface LessonProgress {
  lessonId: string;
  market: MarketId;
  completed: boolean;
  score: number | null;
  xpEarned: number | null;
  perfect: boolean;
  completedAt: string | null;
}

// ─── Chart types ──────────────────────────────────────────────────────────────

export interface CandlePoint {
  open: number;
  close: number;
  high: number;
  low: number;
}

export interface LinePoint {
  value: number;
  label?: string;
}

export interface ChartReferenceLine {
  value: number;
  label: string;
  color: string;
}

export interface QuestionChartData {
  type: 'candlestick' | 'line';
  candleData?: CandlePoint[];
  lineData?: LinePoint[];
  referenceLines?: ChartReferenceLine[];
  title?: string;
}

// ─── Lesson / Question types ──────────────────────────────────────────────────

export interface Lesson {
  id: string;
  name: string;
  unit: number;
  market: MarketId | 'shared';
  xpReward: number;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'chart_question' | 'tap_the_word' | 'fill_in_blank' | 'scenario';
  question: string;
  options: string[];
  correct: number;
  explanationShort: string;
  tags: string[];
  chartData?: QuestionChartData;
}

export interface Scenario extends Question {
  context: string;
  chartTicker?: string;
  chartPeriod?: string;
  mediaLiteracyNote?: string;
  difficulty: number;
  market: MarketId;
}

export interface MarketQuote {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  volume: number;
  currency: string;
}

export interface Headline {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  bodySnippet?: string;
}

export interface NodeState {
  lessonId: string;
  name: string;
  state: 'complete' | 'active' | 'locked' | 'unit_crown';
  xpReward: number;
  questionCount: number;
}
