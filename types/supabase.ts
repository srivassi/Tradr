export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          track: string;
          market: string;
          language: string;
          xp: number;
          level: number;
          pip_stage: string;
          streak_days: number;
          last_active: string | null;
          hearts: number;
          hearts_refill_at: string | null;
          league: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          track?: string;
          market?: string;
          language?: string;
          xp?: number;
          level?: number;
          pip_stage?: string;
          streak_days?: number;
          last_active?: string | null;
          hearts?: number;
          hearts_refill_at?: string | null;
          league?: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          username?: string;
          track?: string;
          market?: string;
          language?: string;
          xp?: number;
          level?: number;
          pip_stage?: string;
          streak_days?: number;
          last_active?: string | null;
          hearts?: number;
          hearts_refill_at?: string | null;
          league?: string;
        };
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          track: string;
          market: string;
          completed: boolean;
          score: number | null;
          xp_earned: number | null;
          perfect: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          track?: string;
          market: string;
          completed?: boolean;
          score?: number | null;
          xp_earned?: number | null;
          perfect?: boolean;
          completed_at?: string | null;
        };
        Update: {
          completed?: boolean;
          score?: number | null;
          xp_earned?: number | null;
          perfect?: boolean;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      question_reviews: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          track: string;
          repetitions: number;
          easiness: number;
          interval_days: number;
          next_review: string | null;
          last_quality: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          track?: string;
          repetitions?: number;
          easiness?: number;
          interval_days?: number;
          next_review?: string | null;
          last_quality?: number | null;
        };
        Update: {
          repetitions?: number;
          easiness?: number;
          interval_days?: number;
          next_review?: string | null;
          last_quality?: number | null;
        };
        Relationships: [];
      };
      scenarios: {
        Row: {
          id: string;
          track: string;
          market: string | null;
          context: string;
          question: string;
          options: unknown;
          correct: number;
          explanation_short: string | null;
          media_literacy_note: string | null;
          tags: string[] | null;
          difficulty: number | null;
          chart_ticker: string | null;
          active: boolean;
          generated_at: string;
        };
        Insert: {
          id: string;
          track?: string;
          market?: string | null;
          context: string;
          question: string;
          options: unknown;
          correct: number;
          explanation_short?: string | null;
          media_literacy_note?: string | null;
          tags?: string[] | null;
          difficulty?: number | null;
          chart_ticker?: string | null;
          active?: boolean;
          generated_at?: string;
        };
        Update: {
          active?: boolean;
          difficulty?: number | null;
        };
        Relationships: [];
      };
      user_badges: {
        Row: {
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: {
          user_id: string;
          badge_id: string;
          earned_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      weekly_xp: {
        Row: {
          user_id: string;
          week_start: string;
          xp: number;
        };
        Insert: {
          user_id: string;
          week_start: string;
          xp?: number;
        };
        Update: {
          xp?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type UserRow           = Database['public']['Tables']['users']['Row'];
export type LessonProgressRow = Database['public']['Tables']['lesson_progress']['Row'];
export type QuestionReviewRow = Database['public']['Tables']['question_reviews']['Row'];
export type ScenarioRow       = Database['public']['Tables']['scenarios']['Row'];
export type UserBadgeRow      = Database['public']['Tables']['user_badges']['Row'];
export type WeeklyXpRow       = Database['public']['Tables']['weekly_xp']['Row'];
