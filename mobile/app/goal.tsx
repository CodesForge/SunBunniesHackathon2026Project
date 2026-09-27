import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bike, Check, ChevronLeft, ChevronRight, CircleDot, Footprints } from "lucide-react-native";

import CoinValue from "../components/ui/CoinValue";
import { usePet } from "../store/pet";
import goals from "../data/goals.json";
import { colors, font, radius, space, HIT } from "../theme";

const COIN_DREAM = require("../assets/icons/coin-dream.png");

const GOAL_ICONS: Record<string, typeof Bike> = {
  ball: CircleDot,
  skate: Footprints,
  bike: Bike,
};

export default function GoalScreen() {
  const router = useRouter();
  const goalId = usePet((s) => s.goalId);
  const dream = usePet((s) => s.jars.dream);
  const setGoal = usePet((s) => s.setGoal);

  const [index, setIndex] = useState(() => {
    const i = goals.findIndex((g) => g.id === goalId);
    return i >= 0 ? i : 0;
  });

  const goal = goals[index];
  const isSelected = goal.id === goalId;
  const Icon = GOAL_ICONS[goal.art] ?? CircleDot;
  const pct = Math.max(0, Math.min(100, Math.round((dream / goal.price) * 100)));

  const move = (delta: number) =>
    setIndex((i) => (i + delta + goals.length) % goals.length);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.back}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Назад"
            >
              <ChevronLeft size={28} color={colors.navActive} strokeWidth={3.5} />
            </Pressable>

            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Доска желаний</Text>
              <Text style={styles.headerSubtitle}>Выбери мечту, к которой копишь!</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.body}>
        <View style={styles.carouselRow}>
          <Pressable
            onPress={() => move(-1)}
            hitSlop={12}
            style={styles.arrowHit}
            accessibilityRole="button"
            accessibilityLabel="Предыдущая мечта"
          >
            <ChevronLeft size={32} color={colors.navActive} strokeWidth={3} />
          </Pressable>

          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Icon size={56} color={colors.coinDream} strokeWidth={2} />
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <Check size={16} color={colors.surface} strokeWidth={3.5} />
                </View>
              )}
            </View>

            <Text style={styles.title}>{goal.title}</Text>
            <CoinValue image={COIN_DREAM} value={goal.price} />

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {isSelected
                ? `Накоплено ${Math.min(dream, goal.price)} из ${goal.price}`
                : "Пока не выбрана"}
            </Text>
          </View>

          <Pressable
            onPress={() => move(1)}
            hitSlop={12}
            style={styles.arrowHit}
            accessibilityRole="button"
            accessibilityLabel="Следующая мечта"
          >
            <ChevronRight size={32} color={colors.navActive} strokeWidth={3} />
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.selectButton,
            isSelected && styles.selectButtonOff,
            pressed && !isSelected && styles.pressed,
          ]}
          onPress={() => setGoal(goal.id)}
          disabled={isSelected}
          accessibilityRole="button"
          accessibilityLabel={isSelected ? `«${goal.title}» уже выбрана` : `Выбрать «${goal.title}»`}
        >
          <Text style={styles.selectButtonText}>
            {isSelected ? "Мечта выбрана" : "Выбрать эту мечту"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const BORDER = 4;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.accent,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    paddingBottom: space.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    gap: space.md,
  },
  back: {
    width: HIT,
    height: HIT,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: BORDER,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { ...font.h1, color: colors.surface },
  headerSubtitle: {
    ...font.small,
    fontWeight: "700",
    color: colors.surface,
    marginTop: 2,
  },

  body: {
    flex: 1,
    padding: space.lg,
    justifyContent: "center",
    gap: space.xl,
  },

  carouselRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.md,
  },
  arrowHit: { padding: space.sm },

  card: {
    flex: 1,
    maxWidth: 260,
    borderWidth: BORDER,
    borderColor: colors.iconBorder,
    borderRadius: radius.lg,
    backgroundColor: colors.jarDreamBg,
    paddingVertical: space.xl,
    paddingHorizontal: space.lg,
    alignItems: "center",
    gap: space.md,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    borderWidth: BORDER,
    borderColor: colors.coinDream,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBadge: {
    position: "absolute",
    right: -4,
    top: -4,
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.good,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { ...font.h2, color: colors.ink, textAlign: "center" },

  progressTrack: {
    width: "100%",
    height: 16,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.iconBorder,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.coinDreamBg,
  },
  progressText: { ...font.small, fontWeight: "700", color: colors.muted },

  selectButton: {
    minHeight: HIT + 6,
    borderRadius: radius.pill,
    backgroundColor: colors.navActive,
    alignItems: "center",
    justifyContent: "center",
  },
  selectButtonOff: { backgroundColor: colors.good },
  selectButtonText: { fontSize: 20, fontWeight: "800", color: colors.surface },

  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
