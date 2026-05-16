import type { Lesson } from '../types';

const LESSONS: Record<string, Lesson> = {
  'unit1-lesson1': {
    id: 'unit1-lesson1',
    name: 'What is a Stock?',
    unit: 1,
    market: 'shared',
    xpReward: 25,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What does it mean to own a stock?',
        options: [
          'You lend money to a company and earn interest',
          'You own a small piece of the company',
          'You get a fixed salary from the company',
          'You have the right to run the company',
        ],
        correct: 1,
        explanationShort: 'A stock represents ownership. Buy one share and you literally own a tiny fraction of the business — including a claim on its profits.',
        tags: ['stocks', 'basics'],
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'A company\'s stock price goes up. What does this usually mean?',
        options: [
          'The company printed more shares',
          'Investors expect the company to be worth more in the future',
          'The company paid off all its debt',
          'The government approved the company',
        ],
        correct: 1,
        explanationShort: 'Stock prices reflect expectations. When investors believe a company will earn more profit in the future, they\'re willing to pay more for a piece of it today.',
        tags: ['stocks', 'price'],
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        question: 'What is a stock exchange?',
        options: [
          'A place where companies swap employees',
          'A government department that prints money',
          'A marketplace where buyers and sellers trade shares',
          'A bank that lends to businesses',
        ],
        correct: 2,
        explanationShort: 'An exchange like the NSE or NYSE is just a marketplace — like a bazaar, but for company shares. It matches buyers with sellers and sets the price.',
        tags: ['exchange', 'basics'],
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        question: 'You own 100 shares out of a company\'s 1,000,000 total shares. What percentage do you own?',
        options: [
          '1%',
          '0.1%',
          '0.01%',
          '10%',
        ],
        correct: 2,
        explanationShort: '100 ÷ 1,000,000 = 0.01%. Even tiny fractions of huge companies can be valuable — that\'s the magic of fractional ownership.',
        tags: ['stocks', 'maths'],
      },
      {
        id: 'q5',
        type: 'multiple_choice',
        question: 'Why do companies sell shares to the public?',
        options: [
          'To avoid paying taxes',
          'To raise money to grow the business',
          'Because the government forces them to',
          'To reduce the number of employees',
        ],
        correct: 1,
        explanationShort: 'An IPO lets a company raise cash without taking a loan. Instead of borrowing, they sell ownership stakes — giving investors a share of future profits in return.',
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
        id: 'q1',
        type: 'multiple_choice',
        question: 'What determines a stock\'s price at any moment?',
        options: [
          'The company\'s CEO decides it each morning',
          'The government sets a fair price',
          'The highest price a buyer will pay and the lowest a seller will accept',
          'The price it was at when the company first listed',
        ],
        correct: 2,
        explanationShort: 'Price is the meeting point of supply and demand. The moment a buyer and seller agree, that becomes the market price — thousands of times per second.',
        tags: ['exchange', 'price'],
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'Markets are open Monday to Friday. What happens to your shares on Saturday?',
        options: [
          'They are sold automatically',
          'Their value is frozen until Monday',
          'You still own them — you just can\'t trade them until markets reopen',
          'The exchange holds them for safekeeping',
        ],
        correct: 2,
        explanationShort: 'You always own your shares — the exchange is just closed for trading. Think of it like a shop being shut on a Sunday: your goods are still yours.',
        tags: ['exchange', 'basics'],
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        question: 'What is a "bull market"?',
        options: [
          'A market where only agricultural stocks trade',
          'A period of rising prices and investor optimism',
          'A market controlled by a single large investor',
          'A crash where prices fall sharply',
        ],
        correct: 1,
        explanationShort: 'Bull markets are periods of sustained price growth. The term comes from how a bull attacks — thrusting upward. The opposite, a bear, swipes downward.',
        tags: ['market-cycles', 'basics'],
      },
    ],
  },
};

export function getLesson(id: string): Lesson | null {
  return LESSONS[id] ?? null;
}
