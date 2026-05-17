import { Stack, router } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/userStore';
import { getPipStage } from '../constants/pip';
import type { User, MarketId, LanguageId, TrackId, League } from '../types';
import type { UserRow } from '../types/supabase';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const setUser      = useUserStore((s) => s.setUser);
  const clearUser    = useUserStore((s) => s.clearUser);
  const loadProgress = useUserStore((s) => s.loadProgress);

  useEffect(() => { if (error) throw error; }, [error]);

  useEffect(() => {
    if (!loaded) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/(auth)/welcome');
        SplashScreen.hideAsync();
        return;
      }

      supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(async ({ data: row }) => {
          const data = row as UserRow | null;
          if (!data) {
            router.replace('/(auth)/welcome');
            SplashScreen.hideAsync();
          } else {
            setUser({
              id:             data.id,
              email:          data.email,
              username:       data.username,
              track:          (data.track    ?? 'tradr')  as TrackId,
              market:         (data.market   ?? 'india')  as MarketId,
              language:       (data.language ?? 'python') as LanguageId,
              xp:             data.xp,
              level:          data.level,
              pipStage:       getPipStage(data.level),
              streakDays:     data.streak_days,
              lastActive:     data.last_active ?? new Date().toISOString(),
              hearts:         data.hearts,
              heartsRefillAt: data.hearts_refill_at,
              league:         data.league as League,
            } satisfies User);
            await loadProgress(data.id);
            router.replace('/(tabs)');
            SplashScreen.hideAsync();
          }
        });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        clearUser();
        router.replace('/(auth)/welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="lesson" />
      <Stack.Screen name="scenario" />
    </Stack>
  );
}
