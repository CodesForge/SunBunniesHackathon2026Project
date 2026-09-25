import { useEffect, useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import type { ImageSourcePropType } from "react-native";
import { MouthKey, PET_ASSETS, PetSpecies } from "./petAssets";

type PetMiniProps = {
  species: PetSpecies;
  widthPercent?: number;
  mouth?: MouthKey;
  eyesOpen?: boolean;
  animated?: boolean;
  // Надетая на тело вещь из гардероба (подгузник и т.п.), если есть.
  bodyWear?: ImageSourcePropType;
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

function useTailFlick(enabled: boolean, tail: SharedValue<number>) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const loop = () => {
      const delay = 1600 + Math.random() * 2200;
      timer = setTimeout(() => {
        if (cancelled) return;
        tail.value = withSequence(
          withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) }),
          withTiming(-0.4, { duration: 130, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 160, easing: Easing.out(Easing.quad) }),
        );
        loop();
      }, delay);
    };

    loop();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled]);
}

export function PetMini({ species, widthPercent = 58, mouth = "happy", eyesOpen = true, animated = true, bodyWear }: PetMiniProps) {
  const assets = PET_ASSETS[species].mini;
  const { width } = useWindowDimensions();
  const w = (width * widthPercent) / 100;
  const h = w * assets.aspect;
  const coreW = w * assets.coreWidth;

  const blinking = useBlink(animated);

  const tail = useSharedValue(0);
  useTailFlick(animated, tail);

  const tailStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tail.value * 6}deg` }],
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
        <Image source={assets.body} style={styles.layer} resizeMode="contain" />
        <Image source={assets.belly} style={styles.layer} resizeMode="contain" />
        {bodyWear && (
          <Image
            source={bodyWear}
            style={{
              position: "absolute",
              left: w * assets.bodyWearLeft,
              top: h * assets.bodyWearTop,
              width: w * assets.bodyWearWidth,
              height: h * assets.bodyWearHeight,
            }}
            resizeMode="contain"
          />
        )}
        <Image source={assets.armLeft} style={styles.layer} resizeMode="contain" />
        <Image source={assets.armRight} style={styles.layer} resizeMode="contain" />
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

