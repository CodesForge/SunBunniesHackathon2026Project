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
import type { ImageSourcePropType } from "react-native";
import { getPetStage, MouthKey, PET_ASSETS, PetAssetSet, PetSpecies } from "./petAssets";
import { usePet } from "../../store/pet";

type OutfitLayers = {
  base: ImageSourcePropType;
  sleeveLeft: ImageSourcePropType;
  sleeveRight: ImageSourcePropType;
};

type PetMiniProps = {
  species: PetSpecies;
  widthPercent?: number;
  mouth?: MouthKey;
  eyesOpen?: boolean;
  animated?: boolean;
  // Надетая на тело вещь из гардероба (подгузник и т.п.), если есть.
  bodyWear?: ImageSourcePropType;
  outfit?: OutfitLayers;
  headWear?: ImageSourcePropType;
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

export function PetMini({
  species,
  widthPercent = 58,
  mouth = "happy",
  eyesOpen = true,
  animated = true,
  bodyWear,
  outfit,
  headWear,
}: PetMiniProps) {
  const xp = usePet((s) => s.xp);
  const stage = getPetStage(xp);
  const speciesAssets = PET_ASSETS[species];
  const assets = (speciesAssets[stage] ??
    speciesAssets.adult ??
    speciesAssets.teen ??
    speciesAssets.mini) as PetAssetSet;
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
        {assets.armsUnderBody && (
          <>
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
            {outfit && (
              <>
                <Animated.Image
                  source={outfit.sleeveLeft}
                  style={[styles.layer, { transformOrigin: assets.armLeftOrigin }, armLeftStyle]}
                  resizeMode="contain"
                />
                <Animated.Image
                  source={outfit.sleeveRight}
                  style={[styles.layer, { transformOrigin: assets.armRightOrigin }, armRightStyle]}
                  resizeMode="contain"
                />
              </>
            )}
          </>
        )}
        <Image source={assets.body} style={styles.layer} resizeMode="contain" />
        <Animated.Image source={assets.belly} style={[styles.layer, bellyStyle]} resizeMode="contain" />
        {assets.diaper && <Image source={assets.diaper} style={styles.layer} resizeMode="contain" />}
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
        {outfit && assets.armsUnderBody && (
          <Image source={outfit.base} style={styles.layer} resizeMode="contain" />
        )}
        {!assets.armsUnderBody && (
          <>
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
          </>
        )}
        {outfit && !assets.armsUnderBody && (
          <>
            <Animated.Image
              source={outfit.sleeveLeft}
              style={[styles.layer, { transformOrigin: assets.armLeftOrigin }, armLeftStyle]}
              resizeMode="contain"
            />
            <Animated.Image
              source={outfit.sleeveRight}
              style={[styles.layer, { transformOrigin: assets.armRightOrigin }, armRightStyle]}
              resizeMode="contain"
            />
            <Image source={outfit.base} style={styles.layer} resizeMode="contain" />
          </>
        )}
        {assets.head && <Image source={assets.head} style={styles.layer} resizeMode="contain" />}
        <Image source={showOpenEyes ? assets.eyesOpen : assets.eyesClosed} style={styles.layer} resizeMode="contain" />
        <Image source={assets.mouth[mouth]} style={styles.layer} resizeMode="contain" />
        {headWear && <Image source={headWear} style={styles.layer} resizeMode="contain" />}
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
