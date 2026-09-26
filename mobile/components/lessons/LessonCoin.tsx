import { Image, Pressable, StyleSheet, View } from "react-native";
import { Lock } from "lucide-react-native";

import { colors } from "../../theme";

const COIN_IMAGE = require("../../assets/lessons/coin.png");
const COIN_LOCKED_IMAGE = require("../../assets/lessons/coin-locked.png");

export const COIN_SIZE = 88;
const COIN_ASPECT = 291 / 501;

export type LessonCoinState = "locked" | "current" | "done";

type Props = {
  state: LessonCoinState;
  label: string;
  onPress?: () => void;
  size?: number;
};

export default function LessonCoin({ state, label, onPress, size = COIN_SIZE }: Props) {
  const height = size * COIN_ASPECT;

  return (
    <Pressable
      onPress={onPress}
      disabled={state === "locked"}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.wrap, { width: size, height }]}
      hitSlop={10}
    >
      <Image
        source={state === "locked" ? COIN_LOCKED_IMAGE : COIN_IMAGE}
        style={[{ width: size, height }, state === "done" && styles.imageDone]}
        resizeMode="contain"
      />
      {state === "locked" && (
        <View style={styles.lockBadge} pointerEvents="none">
          <Lock size={size * 0.24} color={colors.surface} strokeWidth={3} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  imageDone: { opacity: 0.45 },
  lockBadge: {
    position: "absolute",
    
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
});
