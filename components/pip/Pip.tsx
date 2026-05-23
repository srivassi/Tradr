import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { getPipStage } from '../../constants/pip';
import type { PipMood } from '../../types';

interface PipProps {
  level: number;
  mood: PipMood;
  size?: number;
}

const STAGE_IMAGES = {
  bear:     require('../../assets/pip/pip_stage1_bear-removebg-preview.png'),
  cubBull:  require('../../assets/pip/pip_stage2_cub-removebg-preview.png'),
  halfBull: require('../../assets/pip/pip_stage3_junior_bull-removebg-preview.png'),
  bull:     require('../../assets/pip/pip_stage4_golden_bull-removebg-preview.png'),
};

const MOOD_IMAGES: Partial<Record<PipMood, ReturnType<typeof require>>> = {
  correct:   require('../../assets/pip/pip_mood_correct-removebg-preview.png'),
  wrong:     require('../../assets/pip/pip_mood_wrong-removebg-preview.png'),
  celebrate: require('../../assets/pip/pip_mood_celebrate-removebg-preview.png'),
  levelup:   require('../../assets/pip/pip_mood_celebrate-removebg-preview.png'),
};

function getImage(level: number, mood: PipMood) {
  return MOOD_IMAGES[mood] ?? STAGE_IMAGES[getPipStage(level)];
}

export default function Pip({ level, mood, size = 120 }: PipProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(translateY);
    cancelAnimation(translateX);
    cancelAnimation(scale);
    cancelAnimation(rotate);
    cancelAnimation(opacity);

    translateX.value = 0;
    rotate.value = 0;
    opacity.value = 1;
    scale.value = 1;
    translateY.value = 0;

    switch (mood) {
      case 'idle':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-6, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
            withTiming(0,  { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false,
        );
        break;

      case 'correct':
        translateY.value = withSequence(
          withTiming(-16, { duration: 140, easing: Easing.out(Easing.quad) }),
          withTiming(0,   { duration: 120, easing: Easing.in(Easing.quad) }),
          withTiming(-8,  { duration: 100, easing: Easing.out(Easing.quad) }),
          withTiming(0,   { duration: 100, easing: Easing.in(Easing.quad) }),
        );
        scale.value = withSequence(
          withTiming(1.12, { duration: 140 }),
          withTiming(1,    { duration: 220 }),
        );
        break;

      case 'wrong':
        translateX.value = withSequence(
          withTiming(-10, { duration: 60 }),
          withTiming(10,  { duration: 60 }),
          withTiming(-8,  { duration: 60 }),
          withTiming(8,   { duration: 60 }),
          withTiming(0,   { duration: 60 }),
        );
        translateY.value = withTiming(8, { duration: 300 });
        break;

      case 'celebrate':
        scale.value = withSequence(
          withSpring(1.2, { damping: 5 }),
          withSpring(1,   { damping: 8 }),
        );
        rotate.value = withSequence(
          withTiming(-15, { duration: 150 }),
          withTiming(15,  { duration: 150 }),
          withTiming(-10, { duration: 120 }),
          withTiming(10,  { duration: 120 }),
          withTiming(0,   { duration: 100 }),
        );
        translateY.value = withRepeat(
          withSequence(
            withTiming(-12, { duration: 300, easing: Easing.out(Easing.quad) }),
            withTiming(0,   { duration: 300, easing: Easing.in(Easing.quad) }),
          ),
          3,
          false,
        );
        break;

      case 'levelup':
        scale.value = withSequence(
          withTiming(0.8, { duration: 200 }),
          withSpring(1.4, { damping: 4, stiffness: 180 }),
          withSpring(1,   { damping: 10 }),
        );
        opacity.value = withSequence(
          withTiming(0,   { duration: 150 }),
          withTiming(1,   { duration: 150 }),
        );
        break;

      case 'thinking':
        scale.value = withRepeat(
          withSequence(
            withTiming(1.04, { duration: 800, easing: Easing.inOut(Easing.sin) }),
            withTiming(1,    { duration: 800, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false,
        );
        break;

      case 'sleeping':
        translateY.value = withRepeat(
          withSequence(
            withTiming(4,  { duration: 2000, easing: Easing.inOut(Easing.sin) }),
            withTiming(0,  { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false,
        );
        opacity.value = withRepeat(
          withSequence(
            withTiming(0.7, { duration: 2000 }),
            withTiming(1,   { duration: 2000 }),
          ),
          -1,
          false,
        );
        break;
    }
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Image
      source={getImage(level, mood)}
      style={[{ width: size, height: size }, animatedStyle]}
      resizeMode="contain"
      accessibilityLabel={`Pip the mascot, ${mood} mood`}
    />
  );
}
