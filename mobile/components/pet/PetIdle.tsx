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
import { MouthKey, PET_ASSETS, PetSpecies } from "./petAssets";

type PetIdleProps = {
  species: PetSpecies;
  widthPercent?: number;
  mouth?: MouthKey;
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

function sway(duration: number) {
  return withSequence(
    withTiming(-1, { duration: 0 }),
    withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true),
  );
}

export function PetIdle({ species, widthPercent = 58, mouth = "happy", eyesOpen = true, animated = true }: PetIdleProps) {
  const assets = PET_ASSETS[species].idle;
  const { width } = useWindowDimensions();
  const w = (width * widthPercent) / 100;
  const h = w * assets.aspect;
  const coreW = w * assets.coreWidth;

  const blinking = useBlink(animated);

  const arm = useSharedValue(0);
  const tail = useSharedValue(0);
  const belly = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    arm.value = sway(1400);
    tail.value = sway(1400);
    belly.value = sway(2200);
  }, [animated]);

  const armLeftStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arm.value * 0.7}deg` }],
  }));
  const armRightStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-arm.value * 0.7}deg` }],
  }));
  const tailStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tail.value * 5}deg` }],
  }));
  const bellyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + belly.value * 0.015 }],
  }));

  const showOpenEyes = eyesOpen && !blinking;

  return (
    <View style={{ width: coreW, height: h, overflow: "visible" }}>
      <View style={{ position: "absolute", left: -w * assets.coreLeft, top: 0, width: w, height: h }}>
        <Animated.Image
          source={assets.tail}
          style={[styles.layer, { transformOrigin: assets.tailOrigin }, tailStyle]}
          resizeMode="contain"
        />
        <Animated.Image
          source={assets.armLeft}
          style={[styles.layer, { transformOrigin: assets.armLeftOrigin }, armLeftStyle]}
          resizeMode="contain"
        />
        <Animated.Image
          source={assets.armRight}
          style={[styles.layer, { transformOrigin: assets.armRightOrigin }, armRightStyle]}
          resizeMode="contain"
        />
        <Image source={assets.body} style={styles.layer} resizeMode="contain" />
        <Animated.Image source={assets.belly} style={[styles.layer, bellyStyle]} resizeMode="contain" />
        <Image source={showOpenEyes ? assets.eyesOpen : assets.eyesClosed} style={styles.layer} resizeMode="contain" />
        <Image source={assets.mouth[mouth]} style={styles.layer} resizeMode="contain" />
      </View>
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
});

