import { supabase } from './supabase';

const BASE_URL = (process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://localhost:8000').replace(/\/$/, '');

async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
  };
}

export interface CompleteResponse {
  xp_earned:      number;
  new_xp:         number;
  new_level:      number;
  streak_days:    number;
  streak_updated: boolean;
  perfect:        boolean;
}

export async function completeLesson(
  lessonId: string,
  body: {
    xp_earned: number;
    correct:   number;
    total:     number;
    perfect:   boolean;
    is_quiz:   boolean;
    track:     string;
  },
): Promise<CompleteResponse> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`complete_lesson ${res.status}`);
  return res.json() as Promise<CompleteResponse>;
}

export async function getWrongAnswerExplanation(
  lessonId: string,
  body: {
    question:          string;
    user_answer:       string;
    correct_answer:    string;
    short_explanation: string;
    track:             string;
    question_type?:    string;
  },
): Promise<string> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/lessons/${lessonId}/answer`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`answer_explanation ${res.status}`);
  const data = (await res.json()) as { claude_explanation: string };
  return data.claude_explanation;
}

export async function checkStreak(): Promise<{ streak_days: number; streak_updated: boolean }> {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/user/streak/check`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) throw new Error(`streak_check ${res.status}`);
  return res.json() as Promise<{ streak_days: number; streak_updated: boolean }>;
}
