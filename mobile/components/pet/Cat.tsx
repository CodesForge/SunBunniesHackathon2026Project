import { useEffect, useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const TAIL = require("../../assets/pets/cat/tail.png");
const LEGS = require("../../assets/pets/cat/legs-together.png");
const BODY = require("../../assets/pets/cat/body.png");
const EAR_LEFT = require("../../assets/pets/cat/ear-left.png");
const EAR_RIGHT = require("../../assets/pets/cat/ear-right.png");
const HEAD = require("../../assets/pets/cat/head.png");
const ARM_LEFT = require("../../assets/pets/cat/arm-left.png");
const ARM_RIGHT = require("../../assets/pets/cat/arm-right.png");
const BELLY = require("../../assets/pets/cat/belly.png");
const EYES_OPEN = require("../../assets/pets/cat/eyes-open.png");
const EYES_CLOSED = require("../../assets/pets/cat/eyes-closed.png");
const MOUTH_HAPPY = require("../../assets/pets/cat/mouth-happy.png");
const MOUTH_NEUTRAL = require("../../assets/pets/cat/mouth-neutural.png");
const MOUTH_SAD = require("../../assets/pets/cat/mouth-sad.png");

export const CAT_ASPECT = 1217 / 900;

const MOUTHS = {
  happy: MOUTH_HAPPY,
  neutral: MOUTH_NEUTRAL,
  sad: MOUTH_SAD,
} as const;

type CatProps = {
  widthPercent?: number;
  mouth?: keyof typeof MOUTHS;
  eyesOpen?: boolean;
  animated?: boolean;
};

function useBlink(enabled: boolean) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let closeTimer: ReturnType<typeof setTimeout>;
    let openTimer: ReturnType<typeof setTimeout>;

    const loop = () => {
      const delay = 2200 + Math.random() * 2600;
      closeTimer = setTimeout(() => {
        if (cancelled) return;
        setBlinking(true);
        openTimer = setTimeout(() => {
          if (cancelled) return;
          setBlinking(false);
          loop();
        }, 140);
      }, delay);
    };

    loop();
    return () => {
      cancelled = true;
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
    };
  }, [enabled]);

  return blinking;
}

function idleLoop(mid: number, out: number) {
  return withRepeat(
    withSequence(
      withTiming(1, { duration: mid, easing: Easing.inOut(Easing.sin) }),
      withTiming(-1, { duration: out, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: mid, easing: Easing.inOut(Easing.sin) }),
    ),
    -1,
  );
}

export function Cat({ widthPercent = 58, mouth = "happy", eyesOpen = true, animated = true }: CatProps) {
  const { width } = useWindowDimensions();
  const w = (width * widthPercent) / 100;
  const h = w * CAT_ASPECT;

  const blinking = useBlink(animated);

  const ear = useSharedValue(0);
  const arm = useSharedValue(0);
  const tail = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    ear.value = idleLoop(900, 1800);
    arm.value = idleLoop(1400, 2800);
    tail.value = idleLoop(500, 1000);
  }, [animated]);

  const earLeftStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ear.value * 5}deg` }],
  }));
  const earRightStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-ear.value * 5}deg` }],
  }));
  const armLeftStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arm.value * 4}deg` }],
  }));
  const armRightStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-arm.value * 4}deg` }],
  }));
  const tailStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tail.value * 9}deg` }],
  }));

  const showOpenEyes = eyesOpen && !blinking;

  return (
    <View style={{ width: w, height: h }}>
      <Animated.Image source={TAIL} style={[styles.layer, styles.tailOrigin, tailStyle]} resizeMode="contain" />
      <Image source={LEGS} style={styles.layer} resizeMode="contain" />
      <Image source={BODY} style={styles.layer} resizeMode="contain" />
      <Animated.Image source={EAR_LEFT} style={[styles.layer, styles.earLeftOrigin, earLeftStyle]} resizeMode="contain" />
      <Animated.Image source={EAR_RIGHT} style={[styles.layer, styles.earRightOrigin, earRightStyle]} resizeMode="contain" />
      <Image source={HEAD} style={styles.layer} resizeMode="contain" />
      <Animated.Image source={ARM_LEFT} style={[styles.layer, styles.armLeftOrigin, armLeftStyle]} resizeMode="contain" />
      <Animated.Image source={ARM_RIGHT} style={[styles.layer, styles.armRightOrigin, armRightStyle]} resizeMode="contain" />
      <Image source={BELLY} style={styles.layer} resizeMode="contain" />
      <Image source={showOpenEyes ? EYES_OPEN : EYES_CLOSED} style={styles.layer} resizeMode="contain" />
      <Image source={MOUTHS[mouth]} style={styles.layer} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  earLeftOrigin: { transformOrigin: "26% 36%" },
  earRightOrigin: { transformOrigin: "52% 36%" },
  armLeftOrigin: { transformOrigin: "40% 47%" },
  armRightOrigin: { transformOrigin: "40% 47%" },
  tailOrigin: { transformOrigin: "42% 78%" },
});

