import { useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors, font, radius, space } from "../../theme";

export type FoodPlateItem = {
  id: string;
  food: ImageSourcePropType;
  quantity: number;
};

type FoodPlateCarouselProps = {
  items: FoodPlateItem[];
  plateSize?: number;
  onSelect?: (item: FoodPlateItem) => void;
};

const PLATE = require("../../assets/dining/plate.png");
const ARROW_LEFT = require("../../assets/icons/arrow-left.png");
const ARROW_RIGHT = require("../../assets/icons/arrow-right.png");

const SIDE_SCALE = 0.68;
const FOOD_SCALE = 0.55;
const SHIFT_RATIO = 0.9;
const MOVE_DURATION = 260;
const ARROW_SIZE = 34;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function FoodPlateCarousel({
  items,
  plateSize = 110,
  onSelect,
}: FoodPlateCarouselProps) {
  const [index, setIndex] = useState(0);
  const shift = useSharedValue(0);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shift.value }],
  }));

  if (items.length === 0) return null;

  const offsets =
    items.length >= 3 ? [-1, 0, 1] : items.length === 2 ? [0, 1] : [0];

  const move = (delta: number) => {
    if (delta === 0 || items.length < 2) return;
    shift.value = delta * plateSize * SHIFT_RATIO;
    shift.value = withTiming(0, {
      duration: MOVE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    setIndex((i) => i + delta);
  };

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.row, rowStyle]}>
        {offsets.map((offset) => {
          const item = items[mod(index + offset, items.length)];
          const isCenter = offset === 0;
          const size = isCenter ? plateSize : plateSize * SIDE_SCALE;
          const foodSize = size * FOOD_SCALE;

          return (
            <Pressable
              key={`slot-${offset}`}
              style={[styles.plateWrap, { width: size, height: size }]}
              onPress={() => (isCenter ? onSelect?.(item) : move(offset))}
              accessibilityRole="button"
              accessibilityLabel={
                isCenter
                  ? `Покормить, порций ${item.quantity}`
                  : offset < 0
                    ? "Предыдущая еда"
                    : "Следующая еда"
              }
            >
              <Image source={PLATE} style={styles.plate} resizeMode="contain" />
              <Image
                source={item.food}
                style={[styles.food, { width: foodSize, height: foodSize }]}
                resizeMode="contain"
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>x{item.quantity}</Text>
              </View>
            </Pressable>
          );
        })}
      </Animated.View>

      {items.length > 1 && (
        <View style={styles.arrows}>
          <Pressable
            onPress={() => move(-1)}
            hitSlop={12}
            style={styles.arrowHit}
            accessibilityRole="button"
            accessibilityLabel="Предыдущая еда"
          >
            <Image
              source={ARROW_LEFT}
              style={{ width: ARROW_SIZE, height: ARROW_SIZE }}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable
            onPress={() => move(1)}
            hitSlop={12}
            style={styles.arrowHit}
            accessibilityRole="button"
            accessibilityLabel="Следующая еда"
          >
            <Image
              source={ARROW_RIGHT}
              style={{ width: ARROW_SIZE, height: ARROW_SIZE }}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: "center" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.lg,
  },
  plateWrap: { alignItems: "center", justifyContent: "center" },
  plate: { position: "absolute", width: "100%", height: "100%" },
  food: { position: "absolute" },
  badge: {
    position: "absolute",
    bottom: -6,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: colors.iconBorder,
  },
  badgeText: {
    ...font.small,
    fontWeight: "800",
    color: colors.ink,
  },
  arrows: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xxl,
    marginTop: space.md,
  },
  arrowHit: { padding: 6 },
});
