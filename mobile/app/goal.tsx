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
import { usePet } from "../store/pet";
import goals from "../data/goals.json";
import { colors, font, radius, space } from "../theme";

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
const PRICE_TOP_FRAC = 0.53;

const CARD_BORDER = 3;

export default function GoalScreen() {
  const { width, height } = useWindowDimensions();
  const goalId = usePet((s) => s.goalId);
  const setGoal = usePet((s) => s.setGoal);

  const goal = goals.find((g) => g.id === goalId) ?? null;

  if (!goal) {
    return (
      <View style={styles.pickRoot}>
        <SafeAreaView style={styles.pickSafe} edges={["top", "bottom"]}>
          <Text style={styles.pickTitle}>Выбери мечту!</Text>

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

      <View style={[styles.priceRow, { top: height * PRICE_TOP_FRAC }]}>
        <CoinValue image={COIN_DREAM} value={goal.price} />
      </View>

      <SafeAreaView style={styles.backSlot} edges={["top"]} pointerEvents="box-none">
        <BackHeader backHref="/plan" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  pickRoot: { flex: 1, backgroundColor: colors.accent },
  pickSafe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xl,
  },
  pickTitle: { ...font.h1, color: colors.surface },
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
  priceRow: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  backSlot: { position: "absolute", top: 0, left: 0 },
});
