import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, MarketId, LanguageId, TrackId } from '../types';
import { getPipStage } from '../constants/pip';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  pendingTrack: TrackId;
  pendingMarket: MarketId;
  pendingLanguage: LanguageId;
  completedLessons: string[];

  setUser: (user: User) => void;
  clearUser: () => void;
  setTrack: (track: TrackId) => void;
  setMarket: (market: MarketId) => void;
  setLanguage: (language: LanguageId) => void;
  addXP: (amount: number) => void;
  useHeart: () => void;
  refillHearts: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  markLessonComplete: (lessonId: string) => void;
  setCompletedLessons: (ids: string[]) => void;
  syncFromServer: (xp: number, level: number, streakDays: number) => void;
  loadProgress: (userId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  pendingTrack: 'tradr',
  pendingMarket: 'india',
  pendingLanguage: 'python',
  completedLessons: [],

  setUser: (user) => set({ user, isAuthenticated: true }),

  clearUser: () => set({ user: null, isAuthenticated: false, completedLessons: [] }),

  setTrack: (track) =>
    set((state) => ({
      pendingTrack: track,
      user: state.user ? { ...state.user, track } : null,
    })),

  setMarket: (market) =>
    set((state) => ({
      pendingMarket: market,
      user: state.user ? { ...state.user, market } : null,
    })),

  setLanguage: (language) =>
    set((state) => ({
      pendingLanguage: language,
      user: state.user ? { ...state.user, language } : null,
    })),

  addXP: (amount) =>
    set((state) => {
      if (!state.user) return state;
      const newXP    = state.user.xp + amount;
      const newLevel = Math.min(Math.floor(newXP / 100) + 1, 50);
      return {
        user: {
          ...state.user,
          xp:       newXP,
          level:    newLevel,
          pipStage: getPipStage(newLevel),
        },
      };
    }),

  useHeart: () =>
    set((state) => ({
      user: state.user
        ? { ...state.user, hearts: Math.max(0, state.user.hearts - 1) }
        : null,
    })),

  refillHearts: () =>
    set((state) => ({
      user: state.user
        ? { ...state.user, hearts: 5, heartsRefillAt: null }
        : null,
    })),

  incrementStreak: () =>
    set((state) => {
      if (!state.user) return state;
      const today = new Date().toISOString().split('T')[0];
      if (state.user.lastActive === today) return state;
      return {
        user: {
          ...state.user,
          streakDays: state.user.streakDays + 1,
          lastActive: today,
        },
      };
    }),

  resetStreak: () =>
    set((state) => ({
      user: state.user ? { ...state.user, streakDays: 0 } : null,
    })),

  markLessonComplete: (lessonId) =>
    set((state) => ({
      completedLessons: state.completedLessons.includes(lessonId)
        ? state.completedLessons
        : [...state.completedLessons, lessonId],
    })),

  setCompletedLessons: (ids) => set({ completedLessons: ids }),

  syncFromServer: (xp, level, streakDays) =>
    set((state) => {
      if (!state.user) return state;
      const clamped = Math.min(level, 50);
      return {
        user: {
          ...state.user,
          xp,
          level:      clamped,
          pipStage:   getPipStage(clamped),
          streakDays,
        },
      };
    }),

  loadProgress: async (userId) => {
    try {
      const { data } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('completed', true);
      if (data) {
        set({ completedLessons: (data as { lesson_id: string }[]).map((r) => r.lesson_id) });
      }
    } catch {
      // Non-fatal — path map stays at empty state, user can still learn
    }
  },
}));
