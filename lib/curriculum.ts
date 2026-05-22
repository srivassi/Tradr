import type { MarketId, LanguageId } from '../types';

export const QUIZ_PASS_THRESHOLD = 0.7;

export interface CurriculumLesson {
  id: string;
  name: string;
  xpReward: number;
  questionCount: number;
  isQuiz?: boolean;
}

export interface CurriculumUnit {
  id: string;
  title: string;
  lessons: CurriculumLesson[];
}

export type NodeState = 'complete' | 'active' | 'locked';

export interface PathNode {
  lessonId: string;
  name: string;
  xpReward: number;
  questionCount: number;
  state: NodeState;
  isQuiz: boolean;
}

export interface PathUnit {
  unit: CurriculumUnit;
  nodes: PathNode[];
  unitLocked: boolean;
}

const SHARED_UNITS: CurriculumUnit[] = [
  {
    id: 'unit1',
    title: 'Stock Market Basics',
    lessons: [
      { id: 'unit1-lesson1', name: 'What is a Stock?',     xpReward: 25, questionCount: 5 },
      { id: 'unit1-lesson2', name: 'How Exchanges Work',   xpReward: 25, questionCount: 3 },
      { id: 'unit1-lesson3', name: 'Bull vs Bear Markets', xpReward: 25, questionCount: 4 },
      { id: 'unit1-quiz',    name: 'Unit 1 Quiz',          xpReward: 50, questionCount: 5, isQuiz: true },
    ],
  },
  {
    id: 'unit2',
    title: 'Reading a Stock',
    lessons: [
      { id: 'unit2-lesson1', name: 'Price, Volume & Cap',  xpReward: 25, questionCount: 5 },
      { id: 'unit2-lesson2', name: 'P/E Ratio & EPS',      xpReward: 25, questionCount: 4 },
      { id: 'unit2-lesson3', name: 'Candlestick Charts',   xpReward: 30, questionCount: 5 },
      { id: 'unit2-lesson4', name: 'Support & Resistance', xpReward: 30, questionCount: 4 },
      { id: 'unit2-quiz',    name: 'Unit 2 Quiz',          xpReward: 50, questionCount: 6, isQuiz: true },
    ],
  },
  {
    id: 'unit3',
    title: 'Macro & Market Literacy',
    lessons: [
      { id: 'unit3-lesson1', name: 'What Central Banks Do',         xpReward: 25, questionCount: 4 },
      { id: 'unit3-lesson2', name: 'Inflation & Your Portfolio',    xpReward: 25, questionCount: 4 },
      { id: 'unit3-lesson3', name: 'Earnings Season',               xpReward: 25, questionCount: 4 },
      { id: 'unit3-lesson4', name: 'Reading Headlines Critically',  xpReward: 30, questionCount: 5 },
      { id: 'unit3-quiz',    name: 'Unit 3 Quiz',                   xpReward: 50, questionCount: 6, isQuiz: true },
    ],
  },
  {
    id: 'unit4-shared',
    title: 'Mutual Funds & ETFs',
    lessons: [
      { id: 'unit4s-lesson1', name: 'Active vs Passive Investing',  xpReward: 25, questionCount: 4 },
      { id: 'unit4s-lesson2', name: 'How Index Funds Work',         xpReward: 25, questionCount: 4 },
      { id: 'unit4s-lesson3', name: 'Expense Ratios & Hidden Costs', xpReward: 25, questionCount: 4 },
      { id: 'unit4s-lesson4', name: 'ETFs vs Mutual Funds',         xpReward: 25, questionCount: 4 },
      { id: 'unit4s-lesson5', name: 'Building a Simple Portfolio',  xpReward: 30, questionCount: 5 },
      { id: 'unit4s-quiz',    name: 'Unit 4 Quiz',                  xpReward: 50, questionCount: 5, isQuiz: true },
    ],
  },
  {
    id: 'unit5-shared',
    title: 'Market Psychology',
    lessons: [
      { id: 'unit5s-lesson1', name: 'Why Smart People Panic Sell',  xpReward: 25, questionCount: 4 },
      { id: 'unit5s-lesson2', name: 'FOMO & Herd Mentality',        xpReward: 25, questionCount: 4 },
      { id: 'unit5s-lesson3', name: 'Loss Aversion & Anchoring',    xpReward: 25, questionCount: 4 },
      { id: 'unit5s-lesson4', name: 'The Long Game',                xpReward: 30, questionCount: 4 },
      { id: 'unit5s-quiz',    name: 'Unit 5 Quiz',                  xpReward: 50, questionCount: 5, isQuiz: true },
    ],
  },
];

const MARKET_UNITS: Record<MarketId, CurriculumUnit[]> = {
  india: [
    {
      id: 'unit6-india',
      title: 'The Indian Market',
      lessons: [
        { id: 'unit6-india-lesson1', name: 'NSE vs BSE',                xpReward: 25, questionCount: 4 },
        { id: 'unit6-india-lesson2', name: 'SEBI & Regulation',         xpReward: 25, questionCount: 4 },
        { id: 'unit6-india-lesson3', name: 'RBI & Monetary Policy',     xpReward: 25, questionCount: 5 },
        { id: 'unit6-india-lesson4', name: 'Nifty 50 Composition',      xpReward: 25, questionCount: 4 },
        { id: 'unit6-india-lesson5', name: 'FII vs DII Flows',          xpReward: 30, questionCount: 4 },
        { id: 'unit6-india-quiz',    name: 'Unit 6 Quiz',               xpReward: 50, questionCount: 6, isQuiz: true },
      ],
    },
    {
      id: 'unit7-india',
      title: 'Indian Company Fundamentals',
      lessons: [
        { id: 'unit7-india-lesson1', name: 'Reading a Balance Sheet',        xpReward: 25, questionCount: 4 },
        { id: 'unit7-india-lesson2', name: 'Promoter Holding',               xpReward: 25, questionCount: 4 },
        { id: 'unit7-india-lesson3', name: 'Quarterly Results (BSE Format)', xpReward: 25, questionCount: 4 },
        { id: 'unit7-india-lesson4', name: 'IT, Banking, FMCG & Pharma',     xpReward: 30, questionCount: 5 },
        { id: 'unit7-india-quiz',    name: 'Unit 7 Quiz',                    xpReward: 50, questionCount: 6, isQuiz: true },
      ],
    },
  ],
  eu: [
    {
      id: 'unit6-eu',
      title: 'European Markets',
      lessons: [
        { id: 'unit6-eu-lesson1', name: 'DAX, CAC 40 & AEX',             xpReward: 25, questionCount: 4 },
        { id: 'unit6-eu-lesson2', name: 'ECB & European Monetary Policy', xpReward: 25, questionCount: 5 },
        { id: 'unit6-eu-lesson3', name: 'Euro Strength & Exports',        xpReward: 25, questionCount: 4 },
        { id: 'unit6-eu-lesson4', name: 'ESMA & MiFID II',                xpReward: 25, questionCount: 4 },
        { id: 'unit6-eu-quiz',    name: 'Unit 6 Quiz',                    xpReward: 50, questionCount: 5, isQuiz: true },
      ],
    },
    {
      id: 'unit7-eu',
      title: 'European Company Fundamentals',
      lessons: [
        { id: 'unit7-eu-lesson1', name: 'Reading IFRS Reports',      xpReward: 25, questionCount: 4 },
        { id: 'unit7-eu-lesson2', name: 'Auto, Luxury & Industrial', xpReward: 25, questionCount: 4 },
        { id: 'unit7-eu-lesson3', name: 'Geopolitical Risk in EU',   xpReward: 30, questionCount: 4 },
        { id: 'unit7-eu-quiz',    name: 'Unit 7 Quiz',               xpReward: 50, questionCount: 5, isQuiz: true },
      ],
    },
  ],
  us: [
    {
      id: 'unit6-us',
      title: 'US Markets',
      lessons: [
        { id: 'unit6-us-lesson1', name: 'NYSE vs NASDAQ',           xpReward: 25, questionCount: 4 },
        { id: 'unit6-us-lesson2', name: 'The Fed & FOMC',           xpReward: 25, questionCount: 5 },
        { id: 'unit6-us-lesson3', name: 'S&P 500 Composition',      xpReward: 25, questionCount: 4 },
        { id: 'unit6-us-lesson4', name: 'SEC Regulation Basics',    xpReward: 25, questionCount: 4 },
        { id: 'unit6-us-quiz',    name: 'Unit 6 Quiz',              xpReward: 50, questionCount: 5, isQuiz: true },
      ],
    },
    {
      id: 'unit7-us',
      title: 'US Company Fundamentals',
      lessons: [
        { id: 'unit7-us-lesson1', name: 'Reading a 10-K',            xpReward: 25, questionCount: 4 },
        { id: 'unit7-us-lesson2', name: 'Earnings Calls & Guidance', xpReward: 25, questionCount: 4 },
        { id: 'unit7-us-lesson3', name: 'Tech, Finance & Healthcare', xpReward: 30, questionCount: 5 },
        { id: 'unit7-us-quiz',    name: 'Unit 7 Quiz',               xpReward: 50, questionCount: 5, isQuiz: true },
      ],
    },
  ],
};

export function getCurriculum(market: MarketId): CurriculumUnit[] {
  return [...SHARED_UNITS, ...MARKET_UNITS[market]];
}

// ─── Codr Curriculum ─────────────────────────────────────────────────────────
// Structure matches CLAUDE.md: Unit 1 = language foundations (language-specific,
// comes first), Units 2–5 = shared DSA → complexity → system design → interview skills.

const CODR_SHARED_UNITS: CurriculumUnit[] = [
  {
    id: 'codr-unit2',
    title: 'The 10 Patterns',
    lessons: [
      // Two Pointers
      { id: 'codr2-lesson1', name: 'Two Pointers: Opposite Ends',          xpReward: 25, questionCount: 4 },
      { id: 'codr2-lesson2', name: 'Two Pointers: Fast & Slow',            xpReward: 25, questionCount: 4 },
      // Sliding Window
      { id: 'codr2-lesson3', name: 'Sliding Window: Fixed Size',           xpReward: 25, questionCount: 5 },
      { id: 'codr2-lesson4', name: 'Sliding Window: Variable Size',        xpReward: 30, questionCount: 5 },
      // Binary Search
      { id: 'codr4-lesson1', name: 'Binary Search Fundamentals',           xpReward: 25, questionCount: 4 },
      { id: 'codr4-lesson2', name: 'Binary Search: Rotated Array',         xpReward: 25, questionCount: 4 },
      { id: 'codr4-lesson3', name: 'Binary Search: Finding Boundaries',    xpReward: 30, questionCount: 4 },
      // Trees
      { id: 'codr5-lesson1', name: 'Tree Traversal: Inorder & Preorder',   xpReward: 25, questionCount: 5 },
      { id: 'codr5-lesson2', name: 'Tree DFS: Recursive & Iterative',      xpReward: 25, questionCount: 4 },
      { id: 'codr5-lesson3', name: 'Tree BFS: Level Order',                xpReward: 25, questionCount: 4 },
      { id: 'codr5-lesson4', name: 'Binary Search Tree',                   xpReward: 30, questionCount: 4 },
      // HashMap & Arrays
      { id: 'codr1-lesson1', name: 'HashMap: Keys, Values & Lookup',       xpReward: 25, questionCount: 5 },
      { id: 'codr1-lesson2', name: 'Two Sum & Frequency Counting',         xpReward: 25, questionCount: 4 },
      { id: 'codr1-lesson3', name: 'Prefix Sums',                          xpReward: 25, questionCount: 4 },
      // Stack & Queue
      { id: 'codr3-lesson1', name: 'Stack: LIFO & Use Cases',              xpReward: 25, questionCount: 4 },
      { id: 'codr3-lesson2', name: 'Monotonic Stack',                      xpReward: 25, questionCount: 5 },
      { id: 'codr3-lesson4', name: 'Valid Parentheses & Matching',         xpReward: 25, questionCount: 4 },
      { id: 'codr3-lesson3', name: 'Queue, Deque & Sliding Window BFS',    xpReward: 25, questionCount: 4 },
      // Pattern recognition quiz
      { id: 'codrP-quiz',    name: 'Pattern Recognition Quiz',             xpReward: 50, questionCount: 6, isQuiz: true },
    ],
  },
  {
    id: 'codr-unit3',
    title: 'Complexity & Edge Cases',
    lessons: [
      { id: 'codr3c-lesson1', name: 'Big O: Time Complexity',              xpReward: 25, questionCount: 4 },
      { id: 'codr3c-lesson2', name: 'Space Complexity',                    xpReward: 25, questionCount: 4 },
      { id: 'codr3c-lesson3', name: 'Edge Cases: What Breaks Algorithms',  xpReward: 25, questionCount: 4 },
      { id: 'codr3c-quiz',    name: 'Complexity Quiz',                     xpReward: 50, questionCount: 5, isQuiz: true },
    ],
  },
  {
    id: 'codr-unit4',
    title: 'System Design & REST API',
    lessons: [
      { id: 'codr6sd-lesson1', name: 'Class Design: Data Structures',      xpReward: 25, questionCount: 5 },
      { id: 'codr6sd-lesson2', name: 'OOP: SOLID & Composition',           xpReward: 25, questionCount: 5 },
      { id: 'codr6sd-lesson3', name: 'REST API Fundamentals',              xpReward: 25, questionCount: 5 },
      { id: 'codr6sd-lesson4', name: 'HTTP Status Codes',                  xpReward: 25, questionCount: 5 },
      { id: 'codr6sd-lesson5', name: 'Designing REST Endpoints',           xpReward: 30, questionCount: 5 },
      { id: 'codr6sd-quiz',    name: 'Unit 4 Quiz',                        xpReward: 50, questionCount: 6, isQuiz: true },
    ],
  },
  {
    id: 'codr-unit5',
    title: 'Coding Interview Skills',
    lessons: [
      { id: 'codrIS-lesson1', name: 'The 5-Step Interview Framework',      xpReward: 25, questionCount: 4 },
      { id: 'codrIS-lesson2', name: 'Communicating While You Code',        xpReward: 25, questionCount: 4 },
      { id: 'codrIS-lesson3', name: 'Pattern Recognition: Advanced',       xpReward: 30, questionCount: 4 },
      { id: 'codrIS-quiz',    name: 'Final Exam',                          xpReward: 75, questionCount: 5, isQuiz: true },
    ],
  },
];

// Unit 1 is language-specific and comes FIRST in the path (per CLAUDE.md)
const LANGUAGE_UNITS: Record<LanguageId, CurriculumUnit[]> = {
  python: [
    {
      id: 'codr-unit1-python',
      title: 'Python for DSA',
      lessons: [
        { id: 'codr6py-lesson1', name: 'Lists, Dicts & Sets',                      xpReward: 25, questionCount: 4 },
        { id: 'codr6py-lesson2', name: 'collections: Counter, defaultdict & deque', xpReward: 25, questionCount: 4 },
        { id: 'codr6py-lesson3', name: 'heapq & Priority Queue',                   xpReward: 25, questionCount: 4 },
        { id: 'codr6py-lesson4', name: 'Pythonic Patterns',                        xpReward: 25, questionCount: 4 },
        { id: 'codr6py-quiz',    name: 'Unit 1 Quiz',                              xpReward: 50, questionCount: 5, isQuiz: true },
      ],
    },
  ],
  java: [
    {
      id: 'codr-unit1-java',
      title: 'Java for DSA',
      lessons: [
        { id: 'codr6ja-lesson1', name: 'ArrayList, HashMap & HashSet',  xpReward: 25, questionCount: 4 },
        { id: 'codr6ja-lesson2', name: 'PriorityQueue & TreeMap',       xpReward: 25, questionCount: 4 },
        { id: 'codr6ja-lesson3', name: 'Interfaces & Generics',         xpReward: 25, questionCount: 4 },
        { id: 'codr6ja-lesson4', name: 'ArrayDeque vs LinkedList',      xpReward: 25, questionCount: 4 },
        { id: 'codr6ja-quiz',    name: 'Unit 1 Quiz',                   xpReward: 50, questionCount: 5, isQuiz: true },
      ],
    },
  ],
};

// Language-specific Unit 1 comes first, then shared Units 2–5
export function getCodrCurriculum(language: LanguageId): CurriculumUnit[] {
  return [...LANGUAGE_UNITS[language], ...CODR_SHARED_UNITS];
}

export function computePath(completedLessons: string[], curriculum: CurriculumUnit[]): PathUnit[] {
  const completed = new Set(completedLessons);
  let activeAssigned = false;
  let prevUnitQuizPassed = true; // unit 1 is always accessible

  return curriculum.map((unit) => {
    // Unit is locked if the previous unit's quiz wasn't passed
    const unitBlocked = !prevUnitQuizPassed;

    const nodes: PathNode[] = unit.lessons.map((lesson) => {
      let state: NodeState;
      if (unitBlocked) {
        state = 'locked';
      } else if (completed.has(lesson.id)) {
        state = 'complete';
      } else if (!activeAssigned) {
        state = 'active';
        activeAssigned = true;
      } else {
        state = 'locked';
      }
      return {
        lessonId:      lesson.id,
        name:          lesson.name,
        xpReward:      lesson.xpReward,
        questionCount: lesson.questionCount,
        state,
        isQuiz:        lesson.isQuiz ?? false,
      };
    });

    // Gate the next unit on this unit's quiz being complete
    const quiz = unit.lessons.find((l) => l.isQuiz);
    prevUnitQuizPassed = quiz ? completed.has(quiz.id) : true;

    const unitLocked = nodes.every((n) => n.state === 'locked');
    return { unit, nodes, unitLocked };
  });
}
