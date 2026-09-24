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
const VISIBLE = 3;

export function FoodPlateCarousel({ items, plateSize = 96, onSelect }: FoodPlateCarouselProps) {
  const maxStart = Math.max(0, items.length - VISIBLE);
  const [start, setStart] = useState(0);

  const canGoLeft = start > 0;
  const canGoRight = start < maxStart;

  const move = (delta: number) => {
    setStart((s) => Math.min(maxStart, Math.max(0, s + delta)));
  };

  const slots = Array.from({ length: VISIBLE }, (_, i) => items[start + i] ?? null);

  return (
    <View style={styles.row}>
      <Pressable onPress={() => move(-1)} hitSlop={12} disabled={!canGoLeft} style={styles.arrowHit}>
        <ChevronLeft size={28} color={canGoLeft ? colors.surface : "rgba(255,255,255,0.4)"} strokeWidth={3} />
      </Pressable>

      <View style={styles.plates}>
        {slots.map((item, i) => (
          <Pressable
            key={item?.id ?? `empty-${i}`}
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
        ))}
      </View>

      <Pressable onPress={() => move(1)} hitSlop={12} disabled={!canGoRight} style={styles.arrowHit}>
        <ChevronRight size={28} color={canGoRight ? colors.surface : "rgba(255,255,255,0.4)"} strokeWidth={3} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
  },
  arrowHit: { padding: 6 },
  plates: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.md,
  },
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
