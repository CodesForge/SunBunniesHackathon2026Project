import { Info, Minus, Plus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, space, HIT } from "../../theme";

type JarCardProps = {
  title: string;
  color: string;
  background: string;
  value: number;
  coinStep: number;
  canAdd: boolean;
  canRemove: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onInfo: () => void;
};

const JAR_HEIGHT = 96;
const LID_HEIGHT = 14;
const NECK_HEIGHT = 8;
const COIN_SIZE = 14;
const MAX_COINS = 12;
const BORDER = 4;

export default function JarCard({
  title,
  color,
  background,
  value,
  coinStep,
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
          <View style={styles.coins}>
            {Array.from({ length: coins }, (_, i) => (
              <View key={i} style={styles.coin} />
            ))}
          </View>
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
  coins: {
    flexDirection: "row",
    flexWrap: "wrap-reverse",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 3,
    padding: 5,
  },
  coin: {
    width: COIN_SIZE,
    height: COIN_SIZE,
    borderRadius: COIN_SIZE / 2,
    backgroundColor: colors.coinDreamBg,
    borderWidth: 2,
    borderColor: colors.coinDream,
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
