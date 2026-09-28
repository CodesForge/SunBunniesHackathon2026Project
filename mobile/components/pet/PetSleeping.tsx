import { useEffect, useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { PetSpecies, SLEEP_ASSETS } from "./petAssets";

type PetSleepingProps = {
  species?: PetSpecies;
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

export function PetSleeping({ species = "cat", widthPercent = 70, animated = true, asleep = true }: PetSleepingProps) {
  const assets = SLEEP_ASSETS[species];
  const { width } = useWindowDimensions();
  const w = (width * widthPercent) / 100;
  const h = w * assets.aspect;

  const snoring = useSnore(animated && asleep);
  const blinking = useBlink(animated && !asleep);

  const eyesOpen = !asleep && !blinking;
  const mouthOpen = asleep && snoring;
  const eyesRect = eyesOpen ? assets.eyesOpenRect : assets.eyesClosedRect;
  const mouthRect = mouthOpen ? assets.mouthOpenRect : assets.mouthClosedRect;

  return (
    <View style={{ width: w, height: h }}>
      <View style={styles.stack}>
        <Image source={assets.body} style={styles.layer} resizeMode="contain" />
        <Image
          source={eyesOpen ? assets.eyesOpen : assets.eyesClosed}
          style={{
            position: "absolute",
            left: w * eyesRect.left,
            top: h * eyesRect.top,
            width: w * eyesRect.width,
            height: h * eyesRect.height,
          }}
          resizeMode="contain"
        />
        <Image
          source={mouthOpen ? assets.mouthOpen : assets.mouthClosed}
          style={{
            position: "absolute",
            left: w * mouthRect.left,
            top: h * mouthRect.top,
            width: w * mouthRect.width,
            height: h * mouthRect.height,
          }}
          resizeMode="contain"
        />
      </View>
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
