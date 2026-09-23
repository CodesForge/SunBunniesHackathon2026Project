import { Image, StyleSheet, View, useWindowDimensions } from "react-native";

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

const BASE_LAYERS = [TAIL, LEGS, BODY, EAR_LEFT, EAR_RIGHT, HEAD, ARM_LEFT, ARM_RIGHT, BELLY];

const MOUTHS = {
  happy: MOUTH_HAPPY,
  neutral: MOUTH_NEUTRAL,
  sad: MOUTH_SAD,
} as const;

type CatProps = {
  widthPercent?: number;
  mouth?: keyof typeof MOUTHS;
  eyesOpen?: boolean;
};

export function Cat({ widthPercent = 58, mouth = "happy", eyesOpen = true }: CatProps) {
  const { width } = useWindowDimensions();
  const w = (width * widthPercent) / 100;
  const h = w * CAT_ASPECT;

  const layers = [...BASE_LAYERS, eyesOpen ? EYES_OPEN : EYES_CLOSED, MOUTHS[mouth]];

  return (
    <View style={{ width: w, height: h }}>
      {layers.map((source, i) => (
        <Image key={i} source={source} style={styles.layer} resizeMode="contain" />
      ))}
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

