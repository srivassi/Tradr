import { Tabs } from 'expo-router';
import { colors } from '../../constants/theme';
import { useUserStore } from '../../store/userStore';

export default function TabLayout() {
  const track = useUserStore((s) => s.user?.track ?? s.pendingTrack);
  const isCodr = track === 'codr';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Learn', tabBarIcon: ({ color }) => <TabIcon emoji="⭐" color={color} /> }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: isCodr ? 'News' : 'Markets',
          tabBarIcon: ({ color }) => <TabIcon emoji={isCodr ? '📰' : '📈'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color }) => <TabIcon emoji={isCodr ? '💻' : '⚡'} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{ title: 'League', tabBarIcon: ({ color }) => <TabIcon emoji="🏆" color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20, opacity: color === colors.primary ? 1 : 0.5 }}>{emoji}</Text>;
}
