import { useEffect, useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, font } from "../../theme";

const CHEST_CLOSED_IMAGE = require("../../assets/lessons/chest-closed.png");
const CHEST_OPEN_IMAGE = require("../../assets/lessons/chest-open.png");
const CLOSED_ASPECT = 415 / 635;
const OPEN_ASPECT = 412 / 650;

export const CHEST_SIZE = 108;

export type ChestState = "locked" | "ready" | "opened";

type Props = {
  state: ChestState;
  onPress?: () => void;
  size?: number;
};

export default function ChestNode({ state, onPress, size = CHEST_SIZE }: Props) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state !== "ready") return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state, bounce]);

  const scale = bounce.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const image = state === "opened" ? CHEST_OPEN_IMAGE : CHEST_CLOSED_IMAGE;
  const aspect = state === "opened" ? OPEN_ASPECT : CLOSED_ASPECT;

  return (
    <Pressable
      onPress={onPress}
      disabled={state !== "ready"}
      accessibilityRole="button"
      accessibilityLabel={
        state === "ready" ? "Открыть сундук" : state === "opened" ? "Сундук открыт" : "Сундук ещё закрыт"
      }
      style={[styles.wrap, { width: size, height: size * aspect }]}
      hitSlop={8}
    >
      <Animated.Image
        source={image}
        style={[
          { width: size, height: size * aspect, transform: [{ scale: state === "ready" ? scale : 1 }] },
          state === "locked" && styles.imageLocked,
        ]}
        resizeMode="contain"
      />
      {state === "ready" && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>!</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  imageLocked: { opacity: 0.4 },
  badge: {
    position: "absolute",
    top: -4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.navBadge,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { ...font.small, color: colors.surface, fontWeight: "800", lineHeight: 16 },
});
