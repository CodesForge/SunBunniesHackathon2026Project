import { Info, Minus, Plus } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";

import { colors, radius, space, HIT } from "../../theme";

type JarCardProps = {
  title: string;
  color: string;
  background: string;
  value: number;
  coinStep: number;
  coinIcon: ImageSourcePropType;
  canAdd: boolean;
  canRemove: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onInfo: () => void;
};

const JAR_HEIGHT = 96;
const LID_HEIGHT = 14;
const NECK_HEIGHT = 8;
const COIN_SIZE = 28;
const MAX_COINS = 12;
const BORDER = 4;
const COIN_LEFT_MIN = 10;
const COIN_LEFT_MAX = 78;
const COIN_BOTTOM_MIN = 6;
const COIN_BOTTOM_MAX = 62;
const JAR_WIDTH_ESTIMATE = 120;
const CANDIDATES_PER_SLOT = 25;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9973) * 43758.5453;
  return x - Math.floor(x);
}

function pickCoinSlots(count: number) {
  const slots: { leftPercent: number; bottom: number }[] = [];
  for (let i = 0; i < count; i++) {
    let best = { leftPercent: COIN_LEFT_MIN, bottom: COIN_BOTTOM_MIN };
    let bestMinDist = -1;
    for (let c = 0; c < CANDIDATES_PER_SLOT; c++) {
      const seed = i * CANDIDATES_PER_SLOT + c;
      const leftPercent = COIN_LEFT_MIN + seededRandom(seed * 2 + 1) * (COIN_LEFT_MAX - COIN_LEFT_MIN);
      const bottom = COIN_BOTTOM_MIN + seededRandom(seed * 2 + 2) * (COIN_BOTTOM_MAX - COIN_BOTTOM_MIN);
      let minDist = Infinity;
      for (const slot of slots) {
        const dx = ((leftPercent - slot.leftPercent) / 100) * JAR_WIDTH_ESTIMATE;
        const dy = bottom - slot.bottom;
        minDist = Math.min(minDist, Math.hypot(dx, dy));
      }
      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        best = { leftPercent, bottom };
      }
    }
    slots.push(best);
  }
  return slots;
}
const COIN_SLOTS = pickCoinSlots(MAX_COINS);

export default function JarCard({
  title,
  color,
  background,
  value,
  coinStep,
  coinIcon,
  canAdd,
  canRemove,
  onAdd,
  onRemove,
  onInfo,
}: JarCardProps) {
  const coins = Math.min(MAX_COINS, Math.round(value / coinStep));

  return (
    <View style={[styles.card, { borderColor: color, backgroundColor: background }]}>
      <Pressable
        style={styles.info}
        onPress={onInfo}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Что такое «${title}»`}
      >
        <Info size={20} color={color} strokeWidth={3} />
      </Pressable>

      <Text style={[styles.title, { color }]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.jarWrap} pointerEvents="none">
        <View style={[styles.lid, { backgroundColor: color }]} />
        <View style={[styles.neck, { borderColor: color }]} />
        <View style={[styles.jar, { borderColor: color }]}>
          {Array.from({ length: coins }, (_, i) => (
            <Image
              key={i}
              source={coinIcon}
              resizeMode="contain"
              style={[
                styles.coin,
                { left: `${COIN_SLOTS[i].leftPercent}%`, bottom: COIN_SLOTS[i].bottom },
              ]}
            />
          ))}
        </View>
      </View>

      <Text style={[styles.value, { color }]}>{value}</Text>

      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [
            styles.step,
            { borderColor: color },
            !canRemove && styles.stepOff,
            pressed && styles.pressed,
          ]}
          onPress={onRemove}
          disabled={!canRemove}
          accessibilityRole="button"
          accessibilityLabel={`Убрать из «${title}»`}
        >
          <Minus size={22} color={color} strokeWidth={3.5} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.step,
            { borderColor: color },
            !canAdd && styles.stepOff,
            pressed && styles.pressed,
          ]}
          onPress={onAdd}
          disabled={!canAdd}
          accessibilityRole="button"
          accessibilityLabel={`Добавить в «${title}»`}
        >
          <Plus size={22} color={color} strokeWidth={3.5} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: 160,
    borderWidth: BORDER,
    borderRadius: radius.lg,
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    alignItems: "center",
    gap: space.sm,
  },
  info: { position: "absolute", top: space.sm, right: space.sm, zIndex: 2 },
  title: { fontSize: 20, fontWeight: "800" },

  jarWrap: { width: "100%", alignItems: "center" },
  lid: {
    width: "72%",
    height: LID_HEIGHT,
    borderRadius: radius.sm,
  },
  neck: {
    width: "56%",
    height: NECK_HEIGHT,
    borderLeftWidth: BORDER,
    borderRightWidth: BORDER,
    backgroundColor: colors.surface,
  },
  jar: {
    width: "100%",
    height: JAR_HEIGHT,
    borderWidth: BORDER,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  coin: {
    position: "absolute",
    width: COIN_SIZE,
    height: COIN_SIZE,
  },

  value: { fontSize: 24, fontWeight: "800" },

  buttons: { flexDirection: "row", gap: space.sm },
  step: {
    width: HIT,
    height: HIT,
    borderRadius: radius.pill,
    borderWidth: BORDER,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  stepOff: { opacity: 0.35 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.95 }] },
});
