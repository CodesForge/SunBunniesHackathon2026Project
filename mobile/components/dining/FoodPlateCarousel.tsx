import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Image, type ImageSourcePropType, Pressable, StyleSheet, Text, View } from "react-native";

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

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function FoodPlateCarousel({ items, plateSize = 120, onSelect }: FoodPlateCarouselProps) {
  const [index, setIndex] = useState(0);
  const hasItems = items.length > 0;
  const item = hasItems ? items[mod(index, items.length)] : null;

  const move = (delta: number) => setIndex((i) => i + delta);

  return (
    <View style={styles.row}>
      <Pressable onPress={() => move(-1)} hitSlop={12} disabled={!hasItems} style={styles.arrowHit}>
        <ChevronLeft size={32} color={colors.surface} strokeWidth={3} />
      </Pressable>

      <Pressable
        style={[styles.plateWrap, { width: plateSize, height: plateSize }]}
        onPress={() => item && onSelect?.(item)}
        disabled={!item}
      >
        <Image source={PLATE} style={styles.plate} resizeMode="contain" />
        {item && (
          <Image
            source={item.food}
            style={[styles.food, { width: plateSize * 0.55, height: plateSize * 0.55 }]}
            resizeMode="contain"
          />
        )}
        {item && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>x{item.quantity}</Text>
          </View>
        )}
      </Pressable>

      <Pressable onPress={() => move(1)} hitSlop={12} disabled={!hasItems} style={styles.arrowHit}>
        <ChevronRight size={32} color={colors.surface} strokeWidth={3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.md,
  },
  arrowHit: { padding: 6 },
  plateWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  plate: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  food: {
    position: "absolute",
  },
  badge: {
    position: "absolute",
    bottom: -6,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  badgeText: {
    ...font.small,
    fontWeight: "800",
    color: colors.ink,
  },
});
