import { Stack } from 'expo-router';

export default function LessonLayout() {
  return (
    <Stack screenOptions={{ animation: 'slide_from_right' }}>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="complete" options={{ headerShown: false }} />
    </Stack>
  );
}
