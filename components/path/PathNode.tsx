import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/theme';
import type { NodeState } from '../../lib/curriculum';

const NODE_SIZE = 72;

interface Props {
  state: NodeState;
  isQuiz: boolean;
  onPress: () => void;
}

function nodeIcon(state: NodeState, isQuiz: boolean): string {
  if (state === 'complete') return '⭐';
  if (state === 'locked')   return '🔒';
  if (isQuiz)               return '👑';
  return '🐻';
}

export default function PathNode({ state, isQuiz, onPress }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state !== 'active') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.14, duration: 850, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 850, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} accessibilityLabel={`Lesson node — ${state}`}>
      <Animated.View
        style={[
          styles.node,
          state === 'complete' && styles.nodeComplete,
          state === 'active'   && styles.nodeActive,
          state === 'locked'   && styles.nodeLocked,
          isQuiz               && styles.nodeQuiz,
          state === 'active'   && { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {state === 'active' && <View style={styles.ring} />}
        <Text style={styles.icon}>{nodeIcon(state, isQuiz)}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'transparent',
  },
  nodeComplete: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  nodeActive: {
    backgroundColor: '#fff',
    borderColor: '#1CB0F6',
    shadowColor: '#1CB0F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  nodeLocked: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  nodeQuiz: {
    width: NODE_SIZE + 8,
    height: NODE_SIZE + 8,
    borderRadius: (NODE_SIZE + 8) / 2,
  },
  ring: {
    position: 'absolute',
    width: NODE_SIZE + 16,
    height: NODE_SIZE + 16,
    borderRadius: (NODE_SIZE + 16) / 2,
    borderWidth: 4,
    borderColor: '#1CB0F6',
    opacity: 0.3,
  },
  icon: { fontSize: 28 },
});
