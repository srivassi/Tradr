import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import type { NodeState, PathNode } from '../../lib/curriculum';

interface Props {
  node: PathNode | null;
  onDismiss: () => void;
  onStart: (lessonId: string) => void;
}

export default function PathTooltip({ node, onDismiss, onStart }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (node) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,   duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [node]);

  if (!node) return null;

  const canStart = node.state !== 'locked';

  return (
    <TouchableWithoutFeedback onPress={onDismiss}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.handle} />

            <Text style={styles.lessonName}>{node.name}</Text>
            <Text style={styles.meta}>
              {node.questionCount} questions · +{node.xpReward} XP
            </Text>

            {canStart ? (
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => onStart(node.lessonId)}
                activeOpacity={0.8}
                accessibilityLabel={node.state === 'complete' ? 'Revisit lesson' : 'Start lesson'}
              >
                <Text style={styles.startBtnText}>
                  {node.state === 'complete' ? 'REVISIT ↺' : 'START ▶'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.lockedBtn}>
                <Text style={styles.lockedBtnText}>🔒 Complete previous lessons first</Text>
              </View>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  lessonName: {
    fontSize: typography.xl,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  meta: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  startBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  startBtnText: {
    color: '#fff',
    fontSize: typography.lg,
    fontWeight: '800',
    letterSpacing: 1,
  },
  lockedBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  lockedBtnText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: '700',
  },
});
