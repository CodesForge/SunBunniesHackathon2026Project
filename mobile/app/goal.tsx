import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackHeader from "../components/ui/BackHeader";
import CoinValue from "../components/ui/CoinValue";
import Modal from "../components/ui/Modal";
import { usePet } from "../store/pet";
import goals from "../data/goals.json";
import { colors, font, radius, space, HIT } from "../theme";

const COIN_DREAM = require("../assets/icons/coin-dream.png");
const BOARD_BACKGROUND = require("../assets/goals/board-background.png");

const GOAL_IMAGES: Record<string, ImageSourcePropType> = {
  ball: require("../assets/goals/ball.png"),
  guitar: require("../assets/goals/guitar.png"),
  skate: require("../assets/goals/skate.png"),
  scooter: require("../assets/goals/scooter.png"),
};

const BOARD_IMAGE_WIDTH = 2270;
const BOARD_IMAGE_HEIGHT = 4715;
const PAPER_CENTER_X_FRAC = 1147.76 / BOARD_IMAGE_WIDTH;
const PAPER_CENTER_Y_FRAC = 2096.67 / BOARD_IMAGE_HEIGHT;
const PAPER_SIDE_FRAC = 530 / BOARD_IMAGE_HEIGHT;
const PAPER_ROTATION_DEG = 4.4;
const PAPER_FIT_SHRINK = 0.85;

const TABLET_BREAKPOINT = 768;
const TABLET_PANEL_MAX_WIDTH = 300;

const CARD_BORDER = 3;

export default function GoalScreen() {
  const { width, height } = useWindowDimensions();
  const goalId = usePet((s) => s.goalId);
  const setGoal = usePet((s) => s.setGoal);
  const dream = usePet((s) => s.jars.dream);
  const goalCelebrated = usePet((s) => s.goalCelebrated);
  const markGoalCelebrated = usePet((s) => s.markGoalCelebrated);
  const buyGoal = usePet((s) => s.buyGoal);

  const [showCelebration, setShowCelebration] = useState(false);

  const goal = goals.find((g) => g.id === goalId) ?? null;
  const reached = !!goal && dream >= goal.price;
  const isTablet = width >= TABLET_BREAKPOINT;

  useEffect(() => {
    if (goal && reached && !goalCelebrated) {
      setShowCelebration(true);
      markGoalCelebrated();
    }
  }, [goal, reached, goalCelebrated, markGoalCelebrated]);

  if (!goal) {
    return (
      <View style={styles.pickRoot}>
        <SafeAreaView style={styles.pickSafe} edges={["top", "bottom"]}>
          <View style={styles.titleBlock}>
            <Text style={styles.pickTitle}>Выбери мечту!</Text>
            <Text style={styles.pickWarning}>
              Мечту нельзя будет поменять потом — выбирай внимательно!
            </Text>
          </View>

          <View style={styles.grid}>
            {goals.map((g) => (
              <Pressable
                key={g.id}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() => setGoal(g.id)}
                accessibilityRole="button"
                accessibilityLabel={`Выбрать «${g.title}»`}
              >
                <Image source={GOAL_IMAGES[g.art]} style={styles.cardImage} resizeMode="contain" />
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const boardScale = Math.max(width / BOARD_IMAGE_WIDTH, height / BOARD_IMAGE_HEIGHT);
  const boardWidth = BOARD_IMAGE_WIDTH * boardScale;
  const boardHeight = BOARD_IMAGE_HEIGHT * boardScale;
  const boardOffsetX = (width - boardWidth) / 2;
  const boardOffsetY = (height - boardHeight) / 2;

  const paperCenterX = boardOffsetX + PAPER_CENTER_X_FRAC * boardWidth;
  const paperCenterY = boardOffsetY + PAPER_CENTER_Y_FRAC * boardHeight;
  const paperSide = PAPER_SIDE_FRAC * boardHeight * PAPER_FIT_SHRINK;

  const progressPct = Math.min(100, Math.round((dream / goal.price) * 100));

  return (
    <View style={styles.boardRoot}>
      <Image
        source={BOARD_BACKGROUND}
        style={{
          position: "absolute",
          left: boardOffsetX,
          top: boardOffsetY,
          width: boardWidth,
          height: boardHeight,
        }}
        resizeMode="cover"
      />

      <View
        style={{
          position: "absolute",
          left: paperCenterX - paperSide / 2,
          top: paperCenterY - paperSide / 2,
          width: paperSide,
          height: paperSide,
          transform: [{ rotate: `${PAPER_ROTATION_DEG}deg` }],
        }}
      >
        <Image
          source={GOAL_IMAGES[goal.art]}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      <SafeAreaView
        edges={["bottom"]}
        style={[styles.bottomPanel, isTablet && styles.bottomPanelTablet]}
      >
        <CoinValue image={COIN_DREAM} value={goal.price} />

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {Math.min(dream, goal.price)} / {goal.price}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.buyButton,
            reached ? styles.buyButtonActive : styles.buyButtonDisabled,
            pressed && reached && styles.pressed,
          ]}
          disabled={!reached}
          onPress={() => buyGoal(goal.price)}
          accessibilityRole="button"
          accessibilityLabel="Купить мечту"
          accessibilityState={{ disabled: !reached }}
        >
          <Text
            style={[
              styles.buyButtonText,
              reached ? styles.buyButtonTextActive : styles.buyButtonTextDisabled,
            ]}
          >
            Купить
          </Text>
        </Pressable>
      </SafeAreaView>

      <SafeAreaView style={styles.backSlot} edges={["top"]} pointerEvents="box-none">
        <BackHeader backHref="/plan" />
      </SafeAreaView>

      <Modal
        visible={showCelebration}
        title="Ты молодец!"
        text="Ты накопил(а) всю сумму на мечту! Теперь можно её купить."
        confirmLabel="Ура!"
        onCancel={() => setShowCelebration(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pickRoot: { flex: 1, backgroundColor: "#D5D9FF" },
  pickSafe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xl,
  },
  titleBlock: { alignItems: "center", gap: space.xs, paddingHorizontal: space.xl },
  pickTitle: { ...font.h1, color: colors.surface, textAlign: "center" },
  pickWarning: { ...font.small, color: colors.warn, textAlign: "center" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: space.lg,
    paddingHorizontal: space.lg,
  },
  card: {
    width: 130,
    height: 130,
    borderRadius: radius.lg,
    borderWidth: CARD_BORDER,
    borderColor: colors.sceneOval,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  cardPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  cardImage: { width: "70%", height: "70%" },

  boardRoot: { flex: 1, backgroundColor: colors.sceneOval, overflow: "hidden" },
  bottomPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: colors.sceneOval,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: space.md,
    paddingHorizontal: space.lg,
    paddingBottom: space.md,
    alignItems: "center",
    gap: space.sm,
  },
  bottomPanelTablet: {
    maxWidth: TABLET_PANEL_MAX_WIDTH,
    marginHorizontal: "auto",
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  progressTrack: {
    width: "100%",
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.sceneOvalLight,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.sceneOval,
  },
  progressLabel: { ...font.small, color: colors.muted },
  buyButton: {
    width: "100%",
    minHeight: HIT - 8,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonActive: { backgroundColor: colors.sceneOval },
  buyButtonDisabled: { backgroundColor: colors.disabled },
  buyButtonText: { fontSize: 16, fontWeight: "800" },
  buyButtonTextActive: { color: colors.surface },
  buyButtonTextDisabled: { color: colors.muted },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  backSlot: { position: "absolute", top: 0, left: 0 },
});
