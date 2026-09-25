import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { ArrowLeft, MessageCircle, Settings, Wallet } from "lucide-react-native";

import { usePet } from "../../store/pet";
import { fullness, sleepiness } from "../../lib/time";
import { ECONOMY } from "../../data/economy";
import { colors, radius } from "../../theme";
import CoinValue from "./CoinValue";
import StatBar from "./StatBar";
import RoundIconButton from "./RoundIconButton";

const LOW = 20;
const BUBBLE_SIZE = 130;

const COIN_NEED = require("../../assets/icons/coin-need.png");
const COIN_WANT = require("../../assets/icons/coin-want.png");
const COIN_DREAM = require("../../assets/icons/coin-dream.png");
const CIRCLE_LARGE = require("../../assets/icons/circle-large.png");
const PILL_BG = require("../../assets/icons/pill-long.png");
const ICON_MOON_PURPLE = require("../../assets/icons/icon-moon-purple.png");
const ICON_FOOD_PURPLE = require("../../assets/icons/icon-food-purple.png");

// Image в RN не умеет само растягиваться на 100%/absoluteFill внутри
// текучего flex-контейнера — ему нужен точный пиксельный размер. Меряем
// реальный размер полоски через onLayout и уже потом рисуем картинку.
function PillBackground() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize((prev) =>
          prev.width === width && prev.height === height ? prev : { width, height }
        );
      }}
    >
      {size.width > 0 && size.height > 0 && (
        <Image
          source={PILL_BG}
          style={{ width: size.width, height: size.height }}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

type TopHudProps = {
  showChatBubble?: boolean;
  // Показывать ли полоски сна/сытости — на экранах вроде магазина они
  // не нужны.
  showStats?: boolean;
  // Показывать ли кнопку чата (сообщения) в левой колонке.
  showChat?: boolean;
  // Если задано — вместо кружка с уровнем показываем кнопку "назад",
  // ведущую по этому адресу (используется на подэкранах вроде магазина).
  backHref?: string;
};

export default function TopHud({
  showChatBubble = true,
  showStats = true,
  showChat = true,
  backHref,
}: TopHudProps) {
  const jars = usePet((s) => s.jars);
  const xp = usePet((s) => s.xp);
  const lastFedAt = usePet((s) => s.lastFedAt);
  const lastSleptAt = usePet((s) => s.lastSleptAt);

  const level = xp >= ECONOMY.stages[2] ? 3 : xp >= ECONOMY.stages[1] ? 2 : 1;
  const hunger = fullness(lastFedAt);
  const sleep = sleepiness(lastSleptAt);

  return (
    <View style={styles.root} pointerEvents="box-none">
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          {backHref ? (
            <Link href={backHref as any} asChild>
              <RoundIconButton
                icon={ArrowLeft}
                accessibilityRole="button"
                accessibilityLabel="Назад"
              />
            </Link>
          ) : (
            <Link href={"/pet-level" as any} asChild>
              <Pressable
                style={styles.levelCircle}
                accessibilityRole="button"
                accessibilityLabel={`Уровень ${level}`}
              >
                <Image source={CIRCLE_LARGE} style={styles.levelCircleBg} resizeMode="contain" />
                <Text style={styles.levelValue}>{level} Ур.</Text>
              </Pressable>
            </Link>
          )}

          <Link href={"/plan" as any} asChild>
            <RoundIconButton
              icon={Wallet}
              accessibilityRole="button"
              accessibilityLabel="Бюджет"
            />
          </Link>

          {showChat && (
            <RoundIconButton
              icon={MessageCircle}
              accessibilityRole="button"
              accessibilityLabel="Сообщения"
            />
          )}
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.topRightRow}>
            <View style={styles.moneyPill}>
              <PillBackground />
              <CoinValue image={COIN_NEED} value={jars.need} />
              <CoinValue image={COIN_WANT} value={jars.want} />
              <CoinValue image={COIN_DREAM} value={jars.dream} />
            </View>

            <Link href={"/settings" as any} asChild>
              <RoundIconButton
                icon={Settings}
                accessibilityRole="button"
                accessibilityLabel="Настройки"
              />
            </Link>
          </View>

          {showStats && (
            <View style={styles.scalesFrame}>
              <PillBackground />

              <View
                style={styles.scale}
                accessibilityRole="progressbar"
                accessibilityLabel={`Сон: ${Math.round(sleep)} из 100${sleep <= LOW ? ", мало" : ""}`}
              >
                <StatBar value={sleep} icon={ICON_MOON_PURPLE} />
                {sleep <= LOW && <Text style={styles.lowMark}>!</Text>}
              </View>

              <View
                style={styles.scale}
                accessibilityRole="progressbar"
                accessibilityLabel={`Сытость: ${Math.round(hunger)} из 100${hunger <= LOW ? ", мало" : ""}`}
              >
                <StatBar value={hunger} icon={ICON_FOOD_PURPLE} />
                {hunger <= LOW && <Text style={styles.lowMark}>!</Text>}
              </View>
            </View>
          )}

          {showChatBubble && (
            <View style={styles.bubbleRow} pointerEvents="none">
              <MessageCircle
                size={BUBBLE_SIZE}
                color={colors.iconBorder}
                fill={colors.surface}
                strokeWidth={0.5}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 16, paddingTop: 8 },
  row: { flexDirection: "row" },

  leftColumn: { width: 80, alignItems: "center", gap: 8 },
  levelCircle: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  levelCircleBg: {
    position: "absolute",
    width: 80,
    height: 80,
  },
  levelValue: {
    color: colors.coinWant,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 34,
  },
  levelCaption: {
    color: colors.coinWant,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
  },

  rightColumn: { flex: 1, marginLeft: 10 },
  topRightRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  moneyPill: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 36,
    borderRadius: radius.pill,
    overflow: "hidden",
    paddingHorizontal: 16,
  },

  scalesFrame: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    marginTop: 8,
    borderRadius: radius.pill,
    overflow: "hidden",
    paddingHorizontal: 16,
    gap: 10,
  },
  scale: { flex: 1, flexDirection: "row", alignItems: "center", gap: 4 },
  lowMark: { fontSize: 16, fontWeight: "800", color: colors.statLow },

  bubbleRow: { alignItems: "flex-end", marginTop: 4 },
});
