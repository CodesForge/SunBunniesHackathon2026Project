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

const BODY = require("../../assets/sleep/body.png");
const EYES_CLOSED = require("../../assets/sleep/eyes-closed.png");
const EYES_OPEN = require("../../assets/sleep/eyes-open.png");
const MOUTH_CLOSED = require("../../assets/sleep/mouth-closed.png");
const MOUTH_OPEN = require("../../assets/sleep/mouth-open.png");

const ASPECT = 1025 / 1772;
const EYES = { left: 0.3832, top: 0.4712, width: 0.2297, height: 0.0829 };
const MOUTH_CLOSED_RECT = { left: 0.4024, top: 0.4976, width: 0.1868, height: 0.1698 };
const MOUTH_OPEN_RECT = { left: 0.4024, top: 0.4976, width: 0.1868, height: 0.2351 };

type PetSleepingProps = {
  widthPercent?: number;
  animated?: boolean;
  asleep?: boolean;
};

function useSnore(enabled: boolean) {
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setMouthOpen(false);
      return;
    }

    let cancelled = false;
    let open = false;
    let timer: ReturnType<typeof setTimeout>;

    const loop = () => {
      const delay = open ? 900 + Math.random() * 400 : 1800 + Math.random() * 1200;
      timer = setTimeout(() => {
        if (cancelled) return;
        open = !open;
        setMouthOpen(open);
        loop();
      }, delay);
    };

    loop();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled]);

  return mouthOpen;
}

function useBlink(enabled: boolean) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setBlinking(false);
      return;
    }

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

export function PetSleeping({ widthPercent = 70, animated = true, asleep = true }: PetSleepingProps) {
  const { width } = useWindowDimensions();
  const w = (width * widthPercent) / 100;
  const h = w * ASPECT;

  const snoring = useSnore(animated && asleep);
  const blinking = useBlink(animated && !asleep);

  const breath = useSharedValue(0);
  useEffect(() => {
    if (!animated) return;
    breath.value = withSequence(
      withTiming(-1, { duration: 0 }),
      withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [animated]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breath.value * 0.02 }],
  }));

  const eyesOpen = !asleep && !blinking;
  const mouthOpen = asleep && snoring;
  const mouthRect = mouthOpen ? MOUTH_OPEN_RECT : MOUTH_CLOSED_RECT;

  return (
    <View style={{ width: w, height: h }}>
      <Animated.View style={[styles.stack, breathStyle]}>
        <Image source={BODY} style={styles.layer} resizeMode="contain" />
        <Image
          source={eyesOpen ? EYES_OPEN : EYES_CLOSED}
          style={{
            position: "absolute",
            left: w * EYES.left,
            top: h * EYES.top,
            width: w * EYES.width,
            height: h * EYES.height,
          }}
          resizeMode="contain"
        />
        <Image
          source={mouthOpen ? MOUTH_OPEN : MOUTH_CLOSED}
          style={{
            position: "absolute",
            left: w * mouthRect.left,
            top: h * mouthRect.top,
            width: w * mouthRect.width,
            height: h * mouthRect.height,
          }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: "100%",
    height: "100%",
  },
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});
