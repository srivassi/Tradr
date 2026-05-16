export const LANGUAGES = {
  python: {
    id:          'python',
    label:       'Python',
    icon:        '🐍',
    description: 'Clean syntax, interview-preferred',
  },
  java: {
    id:          'java',
    label:       'Java',
    icon:        '☕',
    description: 'Widely used, OOP-focused',
  },
} as const;

export type LanguageId = keyof typeof LANGUAGES;
