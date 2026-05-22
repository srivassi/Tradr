import type { Lesson } from '../types';
import CODR_LESSONS from './codrLessonData';
import CODR_LESSONS_2 from './codrLessonData2';
import CODR_LESSONS_3 from './codrLessonData3';
import CODR_LESSONS_4 from './codrLessonData4';

const CODR_MAP: Record<string, Lesson> = Object.fromEntries(
  [...CODR_LESSONS, ...CODR_LESSONS_2, ...CODR_LESSONS_3, ...CODR_LESSONS_4].map((l) => [l.id, l]),
);

const LESSONS: Record<string, Lesson> = {

  // ─── UNIT 1 — Stock Market Basics ────────────────────────────────────────────

  'unit1-lesson1': {
    id: 'unit1-lesson1',
    name: 'What is a Stock?',
    unit: 1,
    market: 'shared',
    xpReward: 25,
    questions: [
      {
        id: 'u1l1-q1',
        type: 'multiple_choice',
        question: 'What does it mean to own a stock?',
        options: [
          'You lend money to a company and earn interest',
          'You own a small piece of the company',
          'You get a fixed salary from the company',
          'You have the right to run the company',
        ],
        correct: 1,
        explanationShort:
          'A stock represents ownership. Buy one share and you literally own a tiny fraction of the business — including a claim on its profits.',
        tags: ['stocks', 'basics'],
      },
      {
        id: 'u1l1-q2',
        type: 'multiple_choice',
        question: "A company's stock price goes up. What does this usually mean?",
        options: [
          'The company printed more shares',
          'Investors expect the company to be worth more in the future',
          'The company paid off all its debt',
          'The government approved the company',
        ],
        correct: 1,
        explanationShort:
          "Stock prices reflect expectations. When investors believe a company will earn more profit in the future, they're willing to pay more for a piece of it today.",
        tags: ['stocks', 'price'],
      },
      {
        id: 'u1l1-q3',
        type: 'multiple_choice',
        question: 'What is a stock exchange?',
        options: [
          'A place where companies swap employees',
          'A government department that prints money',
          'A marketplace where buyers and sellers trade shares',
          'A bank that lends to businesses',
        ],
        correct: 2,
        explanationShort:
          'An exchange like the NSE or NYSE is just a marketplace — like a bazaar, but for company shares. It matches buyers with sellers and sets the price.',
        tags: ['exchange', 'basics'],
      },
      {
        id: 'u1l1-q4',
        type: 'multiple_choice',
        question:
          "You own 100 shares out of a company's 1,000,000 total shares. What percentage do you own?",
        options: ['1%', '0.1%', '0.01%', '10%'],
        correct: 2,
        explanationShort:
          "100 ÷ 1,000,000 = 0.01%. Even tiny fractions of huge companies can be valuable — that's the magic of fractional ownership.",
        tags: ['stocks', 'maths'],
      },
      {
        id: 'u1l1-q5',
        type: 'multiple_choice',
        question: 'Why do companies sell shares to the public?',
        options: [
          'To avoid paying taxes',
          'To raise money to grow the business',
          'Because the government forces them to',
          'To reduce the number of employees',
        ],
        correct: 1,
        explanationShort:
          "An IPO lets a company raise cash without taking a loan. Instead of borrowing, they sell ownership stakes — giving investors a share of future profits in return.",
        tags: ['ipo', 'basics'],
      },
    ],
  },

  'unit1-lesson2': {
    id: 'unit1-lesson2',
    name: 'How Exchanges Work',
    unit: 1,
    market: 'shared',
    xpReward: 25,
    questions: [
      {
        id: 'u1l2-q1',
        type: 'multiple_choice',
        question: "What determines a stock's price at any moment?",
        options: [
          "The company's CEO decides it each morning",
          'The government sets a fair price',
          'The highest price a buyer will pay and the lowest a seller will accept',
          'The price it was at when the company first listed',
        ],
        correct: 2,
        explanationShort:
          'Price is the meeting point of supply and demand. The moment a buyer and seller agree, that becomes the market price — thousands of times per second.',
        tags: ['exchange', 'price'],
      },
      {
        id: 'u1l2-q2',
        type: 'multiple_choice',
        question:
          'Markets are open Monday to Friday. What happens to your shares on Saturday?',
        options: [
          'They are sold automatically',
          'Their value is frozen until Monday',
          "You still own them — you just can't trade them until markets reopen",
          'The exchange holds them for safekeeping',
        ],
        correct: 2,
        explanationShort:
          "You always own your shares — the exchange is just closed for trading. Think of it like a shop being shut on a Sunday: your goods are still yours.",
        tags: ['exchange', 'basics'],
      },
      {
        id: 'u1l2-q3',
        type: 'multiple_choice',
        question: 'What is a "bull market"?',
        options: [
          'A market where only agricultural stocks trade',
          'A period of rising prices and investor optimism',
          'A market controlled by a single large investor',
          'A crash where prices fall sharply',
        ],
        correct: 1,
        explanationShort:
          "Bull markets are periods of sustained price growth. The term comes from how a bull attacks — thrusting upward. The opposite, a bear, swipes downward.",
        tags: ['market-cycles', 'basics'],
      },
    ],
  },

  'unit1-lesson3': {
    id: 'unit1-lesson3',
    name: 'Bull vs Bear Markets',
    unit: 1,
    market: 'shared',
    xpReward: 25,
    questions: [
      {
        id: 'u1l3-q1',
        type: 'multiple_choice',
        question:
          'An index has risen 25% over 8 months. Investors are optimistic. What type of market is this?',
        options: [
          'A bear market — prices will fall soon',
          'A bull market — sustained gains and confidence',
          'A sideways market — no clear direction',
          'A bubble — this is always unsustainable',
        ],
        correct: 1,
        explanationShort:
          "A bull market is typically defined as a 20%+ rise from a recent low, sustained over months. Rising prices + optimism = bull. It doesn't mean a bubble — many bull runs last years.",
        tags: ['bull-market', 'market-cycles'],
      },
      {
        id: 'u1l3-q2',
        type: 'multiple_choice',
        question:
          'The Nifty 50 has fallen 22% over 3 months. Job losses are rising. What is this called?',
        options: [
          'A correction',
          'A bull trap',
          'A bear market',
          'A flash crash',
        ],
        correct: 2,
        explanationShort:
          "A bear market = a 20%+ decline over at least 2 months. A 'correction' is a milder 10–20% dip. The 3-month duration and rising unemployment confirm this is a bear market.",
        tags: ['bear-market', 'market-cycles'],
      },
      {
        id: 'u1l3-q3',
        type: 'multiple_choice',
        question:
          'During a bear market, a stock rallies 15% in one week on positive news, then falls back down. What is this short-lived rise called?',
        options: [
          'A bull market',
          'A dead cat bounce or bear market rally',
          'A recovery',
          'An IPO pop',
        ],
        correct: 1,
        explanationShort:
          "Bear markets often have temporary rallies — sometimes called 'dead cat bounces' — that fool investors into thinking the worst is over. These reversals can be sharp but don't signal a true reversal.",
        tags: ['bear-market', 'traps'],
      },
      {
        id: 'u1l3-q4',
        type: 'multiple_choice',
        question:
          'Which statement best describes why bear markets happen?',
        options: [
          'Exchanges close and investors panic',
          'Falling earnings expectations, fear, or economic slowdown cause investors to sell',
          'Too many new companies list on the exchange',
          'Central banks print too much money',
        ],
        correct: 1,
        explanationShort:
          "Bear markets are driven by deteriorating fundamentals or fear. When investors expect future earnings to fall, they'd rather sell today than hold through uncertainty. Sentiment becomes self-fulfilling.",
        tags: ['bear-market', 'fundamentals'],
      },
    ],
  },

  'unit1-quiz': {
    id: 'unit1-quiz',
    name: 'Unit 1 Quiz',
    unit: 1,
    market: 'shared',
    xpReward: 50,
    questions: [
      {
        id: 'u1q-q1',
        type: 'multiple_choice',
        question:
          "Reliance Industries has 6.7 billion shares outstanding. You buy 1,000 shares. What do you own?",
        options: [
          "Nothing meaningful — 1,000 shares is too few to matter",
          "A tiny fraction (0.000015%) of Reliance Industries",
          "1,000 rupees worth of Reliance's cash",
          "A claim on Reliance's debt repayments",
        ],
        correct: 1,
        explanationShort:
          "Even small shareholdings represent real ownership. 1,000 ÷ 6,700,000,000 ≈ 0.000015%. You own a fractional slice of every factory, product, and profit Reliance generates.",
        tags: ['stocks', 'ownership'],
      },
      {
        id: 'u1q-q2',
        type: 'multiple_choice',
        question:
          "A company's quarterly earnings beat expectations by 20%. What would you most likely expect to happen to the stock price?",
        options: [
          'Fall — higher earnings mean higher taxes',
          'Stay flat — earnings already happened',
          'Rise — investors revise future expectations upward',
          'Fall — the company must have taken on debt',
        ],
        correct: 2,
        explanationShort:
          "Beating expectations signals the company is healthier than the market assumed. Investors revise their future estimates upward, bidding the price higher. Markets are forward-looking.",
        tags: ['price', 'earnings'],
      },
      {
        id: 'u1q-q3',
        type: 'multiple_choice',
        question:
          'What role does a stock exchange play in setting prices?',
        options: [
          'It sets a fair price each morning based on company financials',
          'It matches buy and sell orders, letting supply and demand determine the price',
          'It guarantees sellers always get the price they ask',
          'It prevents prices from moving more than 5% per day',
        ],
        correct: 1,
        explanationShort:
          "Exchanges are neutral matchmakers. They don't set prices — they create the infrastructure for millions of buyers and sellers to find each other. Price emerges from the aggregate of all those interactions.",
        tags: ['exchange', 'price-discovery'],
      },
      {
        id: 'u1q-q4',
        type: 'multiple_choice',
        question:
          "The S&P 500 has risen for 14 consecutive months, with tech stocks leading. What market are you in?",
        options: [
          'A bear market',
          'A flash crash recovery',
          'A correction',
          'A bull market',
        ],
        correct: 3,
        explanationShort:
          "14 months of consecutive gains = a clear bull market. Bull markets are driven by strong earnings growth, low interest rates, or optimism about the future.",
        tags: ['bull-market', 'market-cycles'],
      },
      {
        id: 'u1q-q5',
        type: 'multiple_choice',
        question:
          'Why might a company choose NOT to do an IPO and raise money from the stock market?',
        options: [
          'IPOs are illegal in most countries',
          'Public companies face strict regulations, quarterly reporting requirements, and public scrutiny',
          'Only banks are allowed to sell shares',
          'Selling shares always loses money for founders',
        ],
        correct: 1,
        explanationShort:
          "Going public has real costs: SEBI/SEC reporting, shareholder scrutiny, activist investors. Many companies stay private to retain control and avoid short-term quarterly pressure.",
        tags: ['ipo', 'regulation'],
      },
    ],
  },

  // ─── UNIT 2 — Reading a Stock ─────────────────────────────────────────────

  'unit2-lesson1': {
    id: 'unit2-lesson1',
    name: 'Price, Volume & Market Cap',
    unit: 2,
    market: 'shared',
    xpReward: 25,
    questions: [
      {
        id: 'u2l1-q1',
        type: 'multiple_choice',
        question:
          'A stock trades at ₹500. The company has 200 million shares outstanding. What is the market cap?',
        options: ['₹500 crore', '₹1,000 crore', '₹10,000 crore', '₹500 million'],
        correct: 2,
        explanationShort:
          '₹500 × 200,000,000 = ₹100,000,000,000 = ₹10,000 crore. Market cap = price × shares outstanding. It tells you the total market value of the company.',
        tags: ['market-cap', 'valuation'],
      },
      {
        id: 'u2l1-q2',
        type: 'multiple_choice',
        question:
          "Two stocks both gained 5% today. Stock A had 10× more trading volume than Stock B. What does the higher volume on Stock A suggest?",
        options: [
          'Stock A is more expensive',
          'Stock A has stronger conviction behind the move — more buyers participated',
          'Stock B will catch up tomorrow',
          'Stock A is being manipulated',
        ],
        correct: 1,
        explanationShort:
          "Volume confirms price moves. A 5% gain on high volume means many investors agree — it's conviction. A 5% gain on low volume could be thin-market noise that reverses quickly.",
        tags: ['volume', 'price-action'],
      },
      {
        id: 'u2l1-q3',
        type: 'multiple_choice',
        question:
          'What does "52-week high" mean for a stock?',
        options: [
          'The stock traded at this price exactly 52 weeks ago',
          'The highest price the stock has reached in the past year',
          'The price set by the company 52 weeks after its IPO',
          'The average price over the past 52 weeks',
        ],
        correct: 1,
        explanationShort:
          "The 52-week high is a reference point traders watch closely. Stocks breaking above their 52-week high are seen as 'breaking out' — momentum signal. Stocks far below it may be in distress.",
        tags: ['price', '52-week'],
      },
      {
        id: 'u2l1-q4',
        type: 'multiple_choice',
        question:
          'A stock priced at ₹50 has the same market cap as a stock priced at ₹5,000. How is this possible?',
        options: [
          'It is not possible — higher price always means higher market cap',
          'The ₹50 stock has far more shares outstanding',
          'The ₹5,000 stock pays more dividends',
          'Market cap is set by the exchange, not the price',
        ],
        correct: 1,
        explanationShort:
          "Price alone tells you nothing about company size. Market cap = price × shares. A ₹50 stock with 1 billion shares = ₹50B market cap. A ₹5,000 stock with 500K shares = ₹2.5B. The ₹50 stock is 20× larger.",
        tags: ['market-cap', 'share-count'],
      },
      {
        id: 'u2l1-q5',
        type: 'multiple_choice',
        question:
          'Tata Consultancy Services (TCS) has a market cap of ~$170 billion. How would you classify it?',
        options: [
          'Small-cap — below $2 billion',
          'Mid-cap — $2–10 billion',
          'Large-cap — above $10 billion',
          'Mega-cap — above $200 billion',
        ],
        correct: 2,
        explanationShort:
          "At $170B, TCS is firmly large-cap (sometimes called mega-cap). Size classifications: small-cap (<$2B), mid-cap ($2–10B), large-cap (>$10B). Large-caps tend to be more stable but grow slower.",
        tags: ['market-cap', 'large-cap'],
      },
    ],
  },

  'unit2-lesson2': {
    id: 'unit2-lesson2',
    name: 'P/E Ratio & EPS',
    unit: 2,
    market: 'shared',
    xpReward: 25,
    questions: [
      {
        id: 'u2l2-q1',
        type: 'multiple_choice',
        question:
          'A company earns ₹10 per share (EPS) and trades at ₹200. What is its P/E ratio?',
        options: ['2', '10', '20', '200'],
        correct: 2,
        explanationShort:
          "P/E = Price ÷ EPS = ₹200 ÷ ₹10 = 20. This means you're paying 20 rupees for every 1 rupee of annual earnings. Think of it as how many years of current earnings you're buying.",
        tags: ['pe-ratio', 'valuation'],
      },
      {
        id: 'u2l2-q2',
        type: 'multiple_choice',
        question:
          'Stock A has a P/E of 8. Stock B has a P/E of 40. What does this typically suggest?',
        options: [
          'Stock A earns more money than Stock B',
          'Stock B is growing faster — investors pay a premium for expected future growth',
          'Stock A is always the better investment',
          'Stock B is definitely overvalued and will crash',
        ],
        correct: 1,
        explanationShort:
          "High P/E = the market is paying up for growth. A P/E of 40 says investors expect earnings to grow dramatically. A P/E of 8 might mean slow growth or genuine undervaluation. Context matters — compare within the same sector.",
        tags: ['pe-ratio', 'growth'],
      },
      {
        id: 'u2l2-q3',
        type: 'multiple_choice',
        question:
          'What does EPS (Earnings Per Share) measure?',
        options: [
          'The number of employees per share issued',
          'The annual profit of the company divided by shares outstanding',
          "The stock price divided by the company's revenue",
          'The dividend paid per share each year',
        ],
        correct: 1,
        explanationShort:
          "EPS = Net Profit ÷ Shares Outstanding. It's the per-share slice of profit you're entitled to as an owner. Rising EPS = the company is getting more profitable per share.",
        tags: ['eps', 'earnings'],
      },
      {
        id: 'u2l2-q4',
        type: 'multiple_choice',
        question:
          'A tech startup has a P/E of 100. A steel company has a P/E of 7. Which is necessarily the better investment?',
        options: [
          'The steel company — lower P/E means more value',
          'The tech startup — higher P/E means better quality',
          'Neither — P/E must be compared within the same sector and context',
          'The company with the higher dividend yield',
        ],
        correct: 2,
        explanationShort:
          "P/E comparison only makes sense within the same sector. Tech companies trade at high P/Es because growth is priced in. Steel is cyclical with low growth, so low P/E is normal. Comparing the two is like comparing apples to factories.",
        tags: ['pe-ratio', 'sector-comparison'],
      },
    ],
  },

  'unit2-lesson3': {
    id: 'unit2-lesson3',
    name: 'Candlestick Charts',
    unit: 2,
    market: 'shared',
    xpReward: 30,
    questions: [
      {
        id: 'u2l3-q1',
        type: 'chart_question',
        question:
          'Look at these two candles. The second candle has a green body. What happened on that second day?',
        options: [
          'The stock fell during that session',
          'The stock closed higher than it opened',
          'Volume spiked above average',
          'The stock hit a new 52-week high',
        ],
        correct: 1,
        explanationShort:
          "Green candle = closing price > opening price. The bulls won that day. The taller the green body, the more decisive the bullish move. Red candle = close < open — bears won.",
        tags: ['candlestick', 'basics'],
        chartData: {
          type: 'candlestick',
          title: 'TWO CANDLES — WHAT HAPPENED ON DAY 2?',
          candleData: [
            { open: 55, close: 50, high: 57, low: 48 },
            { open: 50, close: 58, high: 60, low: 49 },
          ],
        },
      },
      {
        id: 'u2l3-q2',
        type: 'chart_question',
        question:
          "Look at the last candle in this chart. Tiny body, long wicks top and bottom. What does this pattern signal?",
        options: [
          'Strong directional movement — bulls are clearly in control',
          'Indecision — buyers and sellers fought hard but neither won decisively',
          'The stock was suspended from trading that day',
          'A guaranteed reversal the next session',
        ],
        correct: 1,
        explanationShort:
          "This is a Doji. The long wicks show the stock moved far in both directions, but ended near where it started — tiny body. This signals indecision. Watch for a breakout in either direction on the next candle.",
        tags: ['candlestick', 'doji', 'patterns'],
        chartData: {
          type: 'candlestick',
          title: 'SPOT THE PATTERN — LAST CANDLE',
          candleData: [
            { open: 48, close: 52, high: 54, low: 46 },
            { open: 52, close: 50, high: 55, low: 49 },
            { open: 50, close: 56, high: 58, low: 48 },
            { open: 56, close: 58, high: 61, low: 54 },
            { open: 58, close: 59, high: 70, low: 47 },
          ],
        },
      },
      {
        id: 'u2l3-q3',
        type: 'chart_question',
        question:
          "On this candle, the line extending above the green body represents what?",
        options: [
          "The day's high — furthest price reached before sellers pushed back",
          "The day's opening price",
          "The average price for the day",
          "The closing price from the previous day",
        ],
        correct: 0,
        explanationShort:
          "The upper wick (shadow above the body) shows how high the price went before sellers rejected it. A long upper wick signals that sellers were active at that level — watch for it near resistance.",
        tags: ['candlestick', 'wicks'],
        chartData: {
          type: 'candlestick',
          title: 'IDENTIFY THE UPPER WICK',
          candleData: [
            { open: 50, close: 56, high: 68, low: 48 },
          ],
        },
      },
      {
        id: 'u2l3-q4',
        type: 'chart_question',
        question:
          'Three red candles then one large green that covers them all. What reversal pattern is this?',
        options: [
          'Continuation signal — the stock will keep falling',
          'Bullish engulfing — buyers overwhelmed sellers, potential reversal',
          'A random sequence with no significance',
          'Death cross — a major bearish signal',
        ],
        correct: 1,
        explanationShort:
          "Bullish engulfing: the large green body completely covers the previous red candle. After three down days, buyers stepped in aggressively — the selling momentum may be exhausted. Confirm with volume.",
        tags: ['candlestick', 'reversal', 'patterns'],
        chartData: {
          type: 'candlestick',
          title: 'WHAT PATTERN IS THIS?',
          candleData: [
            { open: 62, close: 58, high: 64, low: 56 },
            { open: 58, close: 54, high: 60, low: 52 },
            { open: 54, close: 49, high: 56, low: 47 },
            { open: 47, close: 63, high: 65, low: 45 },
          ],
        },
      },
      {
        id: 'u2l3-q5',
        type: 'multiple_choice',
        question:
          'What four data points does each candlestick capture?',
        options: [
          'Price, volume, market cap, sector',
          'Open, high, low, close (OHLC)',
          'Yesterday close, today open, today close, next day estimate',
          'Buy price, sell price, spread, commission',
        ],
        correct: 1,
        explanationShort:
          "Every candle encodes OHLC: Open (where price started), High (furthest up), Low (furthest down), Close (where it ended). This single shape packs a full session's story.",
        tags: ['candlestick', 'ohlc'],
      },
    ],
  },

  'unit2-lesson4': {
    id: 'unit2-lesson4',
    name: 'Support & Resistance',
    unit: 2,
    market: 'shared',
    xpReward: 30,
    questions: [
      {
        id: 'u2l4-q1',
        type: 'chart_question',
        question:
          'The dashed green line shows a price level the stock has bounced from three times. What is this level called?',
        options: [
          'A resistance level — sellers are active here',
          'A support level — buyers keep stepping in at this price',
          'The intrinsic value',
          'The 52-week low',
        ],
        correct: 1,
        explanationShort:
          "Support is a price where demand consistently stops the stock from falling further. Each bounce confirms buyers are willing to buy at that level. The more times it holds, the stronger the support.",
        tags: ['support', 'technical-analysis'],
        chartData: {
          type: 'line',
          title: 'WHAT IS THE GREEN DASHED LINE?',
          lineData: [
            { value: 70 }, { value: 67 }, { value: 63 }, { value: 60 },
            { value: 63 }, { value: 67 }, { value: 73 }, { value: 76 },
            { value: 73 }, { value: 68 }, { value: 62 }, { value: 60 },
            { value: 62 }, { value: 66 }, { value: 71 }, { value: 74 },
            { value: 71 }, { value: 67 }, { value: 62 }, { value: 60 },
            { value: 63 }, { value: 68 }, { value: 73 },
          ],
          referenceLines: [
            { value: 60, label: '— Support', color: '#58CC02' },
          ],
        },
      },
      {
        id: 'u2l4-q2',
        type: 'chart_question',
        question:
          'The dashed red line shows a level the stock has failed to break above four times. What is this called?',
        options: [
          'A support level — buyers are active here',
          'A resistance level — sellers cap every rally at this price',
          'The fair value target',
          'The all-time high',
        ],
        correct: 1,
        explanationShort:
          "Resistance is a price where selling pressure consistently caps upward moves. Each rejected rally confirms sellers are active there. A decisive break above on high volume is a significant bullish signal.",
        tags: ['resistance', 'technical-analysis'],
        chartData: {
          type: 'line',
          title: 'WHAT IS THE RED DASHED LINE?',
          lineData: [
            { value: 60 }, { value: 64 }, { value: 68 }, { value: 72 }, { value: 75 },
            { value: 73 }, { value: 69 }, { value: 65 }, { value: 62 },
            { value: 66 }, { value: 70 }, { value: 74 }, { value: 75 },
            { value: 72 }, { value: 68 }, { value: 63 }, { value: 60 },
            { value: 64 }, { value: 69 }, { value: 73 }, { value: 75 },
            { value: 72 }, { value: 68 }, { value: 64 },
          ],
          referenceLines: [
            { value: 75, label: '— Resistance', color: '#FF4B4B' },
          ],
        },
      },
      {
        id: 'u2l4-q3',
        type: 'chart_question',
        question:
          'The stock breaks above the red resistance line on a large green candle. What typically happens to that resistance level after a convincing breakout?',
        options: [
          'The stock immediately falls back below the broken level',
          "The old resistance becomes the new support — 'role reversal'",
          'The company must issue new shares after a breakout',
          'The exchange halts trading when resistance breaks',
        ],
        correct: 1,
        explanationShort:
          "Role reversal: broken resistance flips to support. Traders who missed the breakout now buy dips back to that level, creating demand there. This is one of the most repeatable patterns in technical analysis.",
        tags: ['support', 'resistance', 'breakout'],
        chartData: {
          type: 'line',
          title: 'THE BREAKOUT — WHAT HAPPENS NEXT?',
          lineData: [
            { value: 62 }, { value: 66 }, { value: 70 }, { value: 74 }, { value: 75 },
            { value: 73 }, { value: 70 }, { value: 67 }, { value: 64 },
            { value: 68 }, { value: 72 }, { value: 75 },
            { value: 78 }, { value: 82 }, { value: 88 }, { value: 92 },
          ],
          referenceLines: [
            { value: 75, label: '— Broken resistance', color: '#FF4B4B' },
          ],
        },
      },
      {
        id: 'u2l4-q4',
        type: 'chart_question',
        question:
          'The stock bounces repeatedly between the two dashed lines. What is this price action called?',
        options: [
          'A death cross',
          'A golden cross',
          'A trading range or consolidation',
          'A head and shoulders top',
        ],
        correct: 2,
        explanationShort:
          "A range (consolidation) forms when a stock bounces between clear support and resistance. Traders sell at the top, buy at the bottom. A breakout above or below is the signal for the next big move.",
        tags: ['range', 'consolidation', 'technical-analysis'],
        chartData: {
          type: 'line',
          title: 'WHAT IS THIS PRICE ACTION?',
          lineData: [
            { value: 68 }, { value: 72 }, { value: 76 }, { value: 80 },
            { value: 78 }, { value: 74 }, { value: 70 }, { value: 66 }, { value: 63 }, { value: 60 },
            { value: 62 }, { value: 66 }, { value: 71 }, { value: 76 }, { value: 80 },
            { value: 78 }, { value: 73 }, { value: 68 }, { value: 63 }, { value: 60 },
            { value: 63 }, { value: 68 }, { value: 73 }, { value: 78 }, { value: 80 },
          ],
          referenceLines: [
            { value: 80, label: '— Resistance', color: '#FF4B4B' },
            { value: 60, label: '— Support', color: '#58CC02' },
          ],
        },
      },
    ],
  },

  'unit2-quiz': {
    id: 'unit2-quiz',
    name: 'Unit 2 Quiz',
    unit: 2,
    market: 'shared',
    xpReward: 50,
    questions: [
      {
        id: 'u2q-q1',
        type: 'multiple_choice',
        question:
          'A stock at ₹300 has 500 million shares outstanding. Its competitor at ₹1,200 has 50 million shares. Which is the larger company by market cap?',
        options: [
          'The ₹1,200 stock — it has a higher price',
          'The ₹300 stock — 500M × ₹300 = ₹1,50,000 crore vs 50M × ₹1,200 = ₹60,000 crore',
          'They are the same size',
          'Cannot determine without revenue figures',
        ],
        correct: 1,
        explanationShort:
          "Market cap = price × shares. ₹300 × 500M = ₹150B. ₹1,200 × 50M = ₹60B. The cheaper stock is 2.5× larger. Price per share alone is meaningless for company size.",
        tags: ['market-cap'],
      },
      {
        id: 'u2q-q2',
        type: 'multiple_choice',
        question:
          'Infosys earned ₹60 EPS last year and trades at ₹1,500. The sector average P/E is 20. Is Infosys expensive or cheap relative to peers?',
        options: [
          'Cheap — P/E of 25 is below the sector average',
          'Expensive — P/E of 25 is above the sector average of 20',
          'Fairly valued — the P/E equals the stock price in rupees',
          'Cannot tell without the balance sheet',
        ],
        correct: 1,
        explanationShort:
          "Infosys P/E = ₹1,500 ÷ ₹60 = 25. Sector average is 20. Infosys trades at a premium — the market expects it to grow faster than peers. Whether this is justified requires deeper analysis.",
        tags: ['pe-ratio', 'valuation'],
      },
      {
        id: 'u2q-q3',
        type: 'multiple_choice',
        question:
          "A candlestick has no wicks and a large red body. What does this tell you?",
        options: [
          'The stock opened and closed at the same price',
          'Sellers were in complete control — the stock fell from open to close without recovery',
          'Volume was extremely low',
          'The exchange had a technical error',
        ],
        correct: 1,
        explanationShort:
          "No wicks + large red body = a 'marubozu' candle. Sellers dominated the entire session — the stock opened at the high and closed at the low. Strong bearish signal, especially on high volume.",
        tags: ['candlestick', 'bearish'],
      },
      {
        id: 'u2q-q4',
        type: 'multiple_choice',
        question:
          'After falling to ₹200 support three times, a stock breaks below ₹200 with heavy volume. What should you think?',
        options: [
          'Immediate buy — it will bounce back to ₹200',
          'Support has broken, which is bearish — previous support may now act as resistance',
          'Nothing — support levels are not real',
          'The exchange made an error',
        ],
        correct: 1,
        explanationShort:
          "A high-volume break of support is a serious warning. It means buyers who defended ₹200 three times have given up. Previous support flips to resistance, and the next support level is often much lower.",
        tags: ['support', 'breakdown'],
      },
      {
        id: 'u2q-q5',
        type: 'multiple_choice',
        question:
          "What does rising volume during a stock's price increase suggest?",
        options: [
          'The move is speculative and likely to reverse',
          'The company is buying back its own shares',
          'The move has broad participation — it may be more sustainable',
          'Volume and price are unrelated',
        ],
        correct: 2,
        explanationShort:
          "Volume is the fuel behind price. Rising price + rising volume = conviction. Many buyers are actively pushing the stock up. Falling price + rising volume = panic selling. Always read price and volume together.",
        tags: ['volume', 'price-action'],
      },
      {
        id: 'u2q-q6',
        type: 'multiple_choice',
        question:
          "A stock in the 'growth' tech sector has a P/E of 50. A utility company has a P/E of 12. Which company do investors expect to grow faster?",
        options: [
          'The utility company — lower P/E means faster growth',
          'The tech company — investors pay a premium for higher expected future earnings growth',
          'Both are expected to grow at the same rate',
          'P/E does not relate to growth expectations',
        ],
        correct: 1,
        explanationShort:
          "P/E reflects growth expectations. Investors pay 50× earnings for the tech company because they expect earnings to grow rapidly, making today's high P/E look cheap in 5 years. Utilities are stable but slow — hence a low P/E.",
        tags: ['pe-ratio', 'growth-expectations'],
      },
    ],
  },

  // ─── UNIT 3 — Macro & Market Literacy ────────────────────────────────────

  'unit3-lesson1': {
    id: 'unit3-lesson1',
    name: 'What Central Banks Do',
    unit: 3,
    market: 'shared',
    xpReward: 25,
    questions: [
      {
        id: 'u3l1-q1',
        type: 'multiple_choice',
        question:
          "The RBI raises interest rates from 6.5% to 6.75%. What is the primary goal of this action?",
        options: [
          'To make Indian stocks more attractive to foreign investors',
          'To slow down spending and borrowing, reducing inflation',
          'To weaken the rupee and boost exports',
          'To increase government revenue from interest',
        ],
        correct: 1,
        explanationShort:
          "Rate hikes make borrowing more expensive, so companies and consumers spend less. Less spending = less demand = lower inflation. The RBI's primary mandate is price stability.",
        tags: ['central-bank', 'rbi', 'interest-rates'],
      },
      {
        id: 'u3l1-q2',
        type: 'multiple_choice',
        question:
          "When the Fed cuts interest rates, why do stock markets typically rise?",
        options: [
          'Lower rates make cash and bonds less attractive, pushing investors into stocks',
          'Rate cuts increase company revenues directly',
          'The government gives companies tax breaks when rates fall',
          'Lower rates reduce inflation automatically',
        ],
        correct: 0,
        explanationShort:
          "Lower rates mean bonds and savings accounts yield less. Investors seeking returns shift capital into stocks, bidding prices up. Lower rates also reduce company borrowing costs, boosting future earnings — a double driver.",
        tags: ['fed', 'interest-rates', 'stocks'],
      },
      {
        id: 'u3l1-q3',
        type: 'multiple_choice',
        question:
          "Markets were 'pricing in' a 0.25% ECB rate cut but the ECB held rates unchanged. What likely happened to European stock markets?",
        options: [
          'Markets rose strongly — good news that rates are stable',
          'Markets fell — they expected a cut that did not materialise',
          'Markets were unaffected — ECB decisions only matter for bonds',
          'Markets waited for the next meeting',
        ],
        correct: 1,
        explanationShort:
          "Markets trade on expectations. If a cut was priced in and didn't happen, that's effectively a tightening surprise — markets reprice downward. This is why 'no change' can be bad news if the market expected action.",
        tags: ['ecb', 'pricing-in', 'expectations'],
      },
      {
        id: 'u3l1-q4',
        type: 'multiple_choice',
        question:
          "What does 'quantitative easing' (QE) mean?",
        options: [
          'The central bank raises rates quickly',
          'The central bank buys assets (bonds) to inject money into the economy',
          'The government reduces taxes to stimulate growth',
          'Banks lend money to each other at a lower rate',
        ],
        correct: 1,
        explanationShort:
          "QE = the central bank creates money and uses it to buy bonds from banks. This floods banks with cash, pushing them to lend more and investors to seek riskier assets (stocks). The Fed used QE extensively post-2008 and in 2020.",
        tags: ['qe', 'monetary-policy', 'central-bank'],
      },
    ],
  },

  'unit3-lesson2': {
    id: 'unit3-lesson2',
    name: 'Inflation & Your Portfolio',
    unit: 3,
    market: 'shared',
    xpReward: 25,
    questions: [
      {
        id: 'u3l2-q1',
        type: 'multiple_choice',
        question:
          "India's CPI (Consumer Price Index) reads 7.5%. What does this mean for someone holding cash in a savings account earning 4% interest?",
        options: [
          'Their money is growing in real terms',
          "Their money's real purchasing power is shrinking — inflation outpaces their return",
          'This is normal and no action is needed',
          "CPI doesn't affect savings accounts",
        ],
        correct: 1,
        explanationShort:
          "Real return = nominal return − inflation. 4% − 7.5% = −3.5%. Even though the account balance grows, you can buy less with it each year. This is why holding cash during high inflation is costly.",
        tags: ['inflation', 'cpi', 'real-return'],
      },
      {
        id: 'u3l2-q2',
        type: 'multiple_choice',
        question:
          "Which asset class has historically performed well as an inflation hedge?",
        options: [
          'Long-duration government bonds — they have guaranteed returns',
          'Cash in savings accounts',
          'Equities and real assets like gold and real estate',
          'Short-term fixed deposits',
        ],
        correct: 2,
        explanationShort:
          "Equities represent ownership of real businesses that can raise prices. Real assets (gold, real estate, commodities) hold value as the currency depreciates. Bonds and cash typically lose real value in high-inflation periods.",
        tags: ['inflation', 'hedge', 'equities'],
      },
      {
        id: 'u3l2-q3',
        type: 'multiple_choice',
        question:
          "Why do rising interest rates generally hurt bond prices?",
        options: [
          "Higher rates reduce the government's ability to pay coupons",
          'New bonds offer higher yields, making existing lower-yield bonds less attractive',
          'Rising rates increase inflation, which reduces bond demand',
          'Bonds are directly taxed more when rates rise',
        ],
        correct: 1,
        explanationShort:
          "Bond prices move inversely to yields. If new bonds offer 7% and you hold one paying 5%, yours is worth less — nobody pays full price for a below-market yield. This is the core bond math every investor must understand.",
        tags: ['bonds', 'interest-rates', 'duration'],
      },
      {
        id: 'u3l2-q4',
        type: 'multiple_choice',
        question:
          "CPI data came in 'hotter than expected' at 8.2% vs a forecast of 7.5%. How would this typically impact markets?",
        options: [
          'Markets rally — high inflation means a strong economy',
          'Markets fall — higher-than-expected inflation signals more rate hikes ahead',
          'Markets are unaffected — CPI is a backward-looking number',
          'Only bond markets react to CPI',
        ],
        correct: 1,
        explanationShort:
          "Hot CPI = central bank will likely hike more aggressively than priced in. More hikes = higher borrowing costs for companies = lower earnings = lower stock valuations. Markets sell first and ask questions later.",
        tags: ['cpi', 'inflation', 'market-reaction'],
      },
    ],
  },

  'unit3-lesson3': {
    id: 'unit3-lesson3',
    name: 'Earnings Season',
    unit: 3,
    market: 'shared',
    xpReward: 25,
    questions: [
      {
        id: 'u3l3-q1',
        type: 'multiple_choice',
        question:
          "Infosys reported ₹65 EPS this quarter. Analysts expected ₹60. What is this called?",
        options: [
          'A miss — actual was below the average',
          'An earnings beat — actual exceeded the consensus estimate',
          'Guidance — the company forecast future earnings',
          'A restatement — the company revised past figures',
        ],
        correct: 1,
        explanationShort:
          "An earnings 'beat' = actual results > analyst consensus. Beats typically drive the stock up as investors revise their models upward. The size of the beat matters — a ₹1 beat on ₹60 estimates is 1.7%, a small beat.",
        tags: ['earnings', 'beat', 'analyst-estimates'],
      },
      {
        id: 'u3l3-q2',
        type: 'multiple_choice',
        question:
          "A company beats earnings estimates by 15% but its stock falls 5% on the day. Why could this happen?",
        options: [
          'The exchange made an error',
          'The company issued guidance (forecast) that disappointed — next quarter looks worse',
          'Earnings beats always cause stocks to fall',
          'Insider trading pushed the stock down',
        ],
        correct: 1,
        explanationShort:
          "Markets are forward-looking. A great past quarter doesn't matter if guidance (management's outlook for the next quarter) is weak. Traders sold the 'buy the rumour, sell the news' rally and reacted to soft forward guidance.",
        tags: ['earnings', 'guidance', 'forward-looking'],
      },
      {
        id: 'u3l3-q3',
        type: 'multiple_choice',
        question:
          "What does 'revenue beat but margin miss' mean?",
        options: [
          'The company sold more than expected but spent so much that profit margins shrank',
          'The company earned more profit but sold fewer products',
          'Revenue and margins always move together',
          'The company beat in the US but missed in Europe',
        ],
        correct: 0,
        explanationShort:
          "Revenue beat = sold more than expected. Margin miss = costs grew faster than revenue, squeezing profit per sale. You can grow revenue by cutting prices or overspending — that's not quality growth.",
        tags: ['earnings', 'margins', 'revenue'],
      },
      {
        id: 'u3l3-q4',
        type: 'multiple_choice',
        question:
          "What is 'earnings season' and when does it occur?",
        options: [
          'A time when companies recruit new employees in bulk',
          'Quarterly periods when most listed companies report their financial results',
          'The window when new IPOs are allowed to list',
          'A once-yearly event mandated by SEBI',
        ],
        correct: 1,
        explanationShort:
          "Earnings season happens four times a year, roughly 3–6 weeks after each calendar quarter ends. Markets see intense volatility as hundreds of companies release results that either confirm or shatter investor expectations.",
        tags: ['earnings-season', 'quarterly-results'],
      },
    ],
  },

  'unit3-lesson4': {
    id: 'unit3-lesson4',
    name: 'Reading Headlines Critically',
    unit: 3,
    market: 'shared',
    xpReward: 30,
    questions: [
      {
        id: 'u3l4-q1',
        type: 'multiple_choice',
        question:
          'Headline: "Markets CRASH as Fed raises rates by 0.25%." The index fell 0.8%. Is this headline accurate?',
        options: [
          "Yes — any fall is a crash",
          "No — a 0.8% fall is a minor decline. 'Crash' implies a catastrophic loss (usually 10%+)",
          "Yes — rate hikes always cause crashes",
          "Depends on the day of the week",
        ],
        correct: 1,
        explanationShort:
          "Financial media sensationalises moves to drive clicks. A 0.8% decline is completely normal — markets fluctuate this much on quiet days. A 'crash' typically means 10–20%+ losses over a short period. Language like 'crash', 'soar', 'plunge' is often disproportionate to the actual move.",
        tags: ['media-literacy', 'headlines'],
      },
      {
        id: 'u3l4-q2',
        type: 'multiple_choice',
        question:
          'Headline: "RBI decision DISAPPOINTS markets." What does this framing tell you about what was expected?',
        options: [
          'The RBI made a bad policy decision',
          'The actual decision differed from what markets had priced in — disappointment is relative to expectations',
          'The RBI governor made a speech markets disliked',
          'Indian markets underperformed global markets that day',
        ],
        correct: 1,
        explanationShort:
          "'Disappoints' doesn't mean the decision was wrong — it means it deviated from what was priced in. If markets expected a cut and got a hold, that's 'disappointing' even if a hold is the right economic call. Always ask: relative to what expectation?",
        tags: ['media-literacy', 'expectations', 'pricing-in'],
      },
      {
        id: 'u3l4-q3',
        type: 'multiple_choice',
        question:
          'Headline: "Bitcoin up 300% this year — is now the time to invest?" What should you notice about this framing?',
        options: [
          'The headline is giving objective investment advice',
          'Past returns are being used to imply future returns — a classic recency bias trap',
          'Bitcoin must be the best investment if it rose 300%',
          'The 300% figure confirms Bitcoin is undervalued',
        ],
        correct: 1,
        explanationShort:
          "Headlines love recency. '300% up this year' tells you what already happened — nothing about what comes next. Assets that have risen the most are often the most crowded and vulnerable to reversals. Past returns do not predict future returns.",
        tags: ['media-literacy', 'recency-bias', 'bitcoin'],
      },
      {
        id: 'u3l4-q4',
        type: 'multiple_choice',
        question:
          "Headline: 'Tech stocks SOAR on AI optimism.' The NASDAQ rose 1.2%. What is the media doing here?",
        options: [
          'Accurately describing a significant market event',
          "Using emotionally charged language ('SOAR') to dramatise a routine market move",
          'Reporting a historical fact about AI companies',
          'Warning investors about a bubble',
        ],
        correct: 1,
        explanationShort:
          "'SOAR', 'PLUNGE', 'SURGE', 'CRASH' are designed to trigger emotional responses and clicks. A 1.2% move is normal daily volatility. Skilled readers translate: 'Tech stocks rose 1.2% today on positive AI sentiment.' Much less exciting — which is why you won't see that headline.",
        tags: ['media-literacy', 'language', 'emotional-framing'],
      },
      {
        id: 'u3l4-q5',
        type: 'multiple_choice',
        question:
          "What does it mean when a headline says a market event was 'already priced in'?",
        options: [
          "Investors paid too much and were overcharged",
          "The event was expected, so the market already adjusted before the announcement was made",
          "The company reduced its stock price before the news",
          "Institutional investors manipulated the price beforehand",
        ],
        correct: 1,
        explanationShort:
          "Markets are forward-looking. When an event is widely expected (a rate hike, an earnings beat), the price moves in advance as investors position. When the event actually happens, the price may not move — or may even reverse as traders 'sell the news.'",
        tags: ['media-literacy', 'pricing-in', 'market-efficiency'],
      },
    ],
  },

  'unit3-quiz': {
    id: 'unit3-quiz',
    name: 'Unit 3 Quiz',
    unit: 3,
    market: 'shared',
    xpReward: 50,
    questions: [
      {
        id: 'u3q-q1',
        type: 'multiple_choice',
        question:
          "The RBI unexpectedly cut rates by 0.5% — larger than the 0.25% the market expected. What would you expect to happen to Indian bank stocks?",
        options: [
          'Fall — lower rates hurt bank profits',
          'Rise — a bigger-than-expected cut boosts loan demand and signals policy support',
          'Stay flat — banks are unaffected by RBI decisions',
          'Fall — the surprise indicates economic distress',
        ],
        correct: 1,
        explanationShort:
          "A larger-than-expected cut is a positive surprise. Lower borrowing costs stimulate loan growth, and the positive economic signal outweighs the NIM compression. Bank stocks typically rally on dovish RBI surprises.",
        tags: ['rbi', 'rate-cut', 'banking'],
      },
      {
        id: 'u3q-q2',
        type: 'multiple_choice',
        question:
          "US CPI comes in at 3.2%, below the forecast of 3.5%. What's the likely market reaction?",
        options: [
          'Sell-off — lower CPI means less economic activity',
          'Rally — cooler inflation reduces pressure on the Fed to hike, boosting risk assets',
          'No reaction — CPI only matters if above 5%',
          'Bond prices fall as yields rise',
        ],
        correct: 1,
        explanationShort:
          "Cooler-than-expected inflation = Fed may hold or cut sooner = lower rates = better for stocks. Bond prices also rise (yields fall) because rate expectations ease. This is the 'good CPI' reaction: risk-on across the board.",
        tags: ['cpi', 'fed', 'market-reaction'],
      },
      {
        id: 'u3q-q3',
        type: 'multiple_choice',
        question:
          "Tata Motors beats Q3 earnings by 12%. The CEO gives guidance warning of a slowdown in EV demand. The stock falls 4%. Why?",
        options: [
          'The earnings beat was too small to matter',
          'Investors focused on the weak forward guidance — the past beat is less important than the future outlook',
          'Tata Motors has no EV business so guidance is irrelevant',
          'Stock falls always follow earnings beats — sell the news',
        ],
        correct: 1,
        explanationShort:
          "Markets price future earnings, not past ones. A 12% beat tells you the last quarter was good. The CEO's warning tells you the next quarter could be bad. Investors sold the stock based on what's coming, not what just passed.",
        tags: ['earnings', 'guidance', 'forward-looking'],
      },
      {
        id: 'u3q-q4',
        type: 'multiple_choice',
        question:
          "Headline: 'Nifty TUMBLES 180 points after inflation data.' The Nifty is at 22,000. What is the actual percentage move?",
        options: [
          '8% — a significant crash',
          '0.8% — a modest decline that media is dramatising',
          '1.8% — a moderate decline',
          '18% — a severe correction',
        ],
        correct: 1,
        explanationShort:
          "180 ÷ 22,000 = 0.82%. This is completely normal daily volatility. The headline uses absolute points ('180 points') instead of percentage to sound dramatic. Always convert point moves to percentages — it's the only way to judge significance.",
        tags: ['media-literacy', 'absolute-vs-relative', 'nifty'],
      },
      {
        id: 'u3q-q5',
        type: 'multiple_choice',
        question:
          "In a high-inflation environment, which portfolio adjustment would a savvy investor consider?",
        options: [
          'Move everything to cash — safety first',
          'Shift toward real assets and inflation-linked equities; reduce long-duration bonds',
          'Buy more long-duration government bonds — they are guaranteed',
          "Do nothing — inflation doesn't affect equity portfolios",
        ],
        correct: 1,
        explanationShort:
          "High inflation erodes cash and fixed-income. Real assets (commodities, real estate, inflation-linked equities like energy and consumer staples) hold value. Long-duration bonds are especially hurt — their fixed coupons buy less over time.",
        tags: ['inflation', 'portfolio', 'asset-allocation'],
      },
      {
        id: 'u3q-q6',
        type: 'multiple_choice',
        question:
          "What does it mean when traders say the Fed 'went more hawkish than expected'?",
        options: [
          'The Fed approved stock market regulations',
          'The Fed signalled tighter monetary policy — more rate hikes or higher rates for longer than markets anticipated',
          'The Fed appointed a new chairman',
          'The Fed is concerned about a stock market bubble',
        ],
        correct: 1,
        explanationShort:
          "'Hawkish' = tight monetary policy (higher rates, less stimulus). 'Dovish' = loose policy (lower rates, more stimulus). 'More hawkish than expected' means the Fed will raise rates more aggressively than markets priced in — negative for stocks, positive for the dollar.",
        tags: ['fed', 'hawkish', 'monetary-policy'],
      },
    ],
  },
};

export function getLesson(id: string): Lesson | null {
  return LESSONS[id] ?? CODR_MAP[id] ?? null;
}
