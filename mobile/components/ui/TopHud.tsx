import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import {
  Apple,
  MessageCircle,
  MoonStar,
  PiggyBank,
  Settings,
  Shirt,
  Utensils,
  Wallet,
} from "lucide-react-native";

import { usePet } from "../../store/pet";
import { fullness, sleepiness } from "../../lib/time";
import { ECONOMY } from "../../data/economy";
import { colors, radius } from "../../theme";
import CoinValue from "./CoinValue";
import StatBar from "./StatBar";
import RoundIconButton from "./RoundIconButton";

const LOW = 20;
const BUBBLE_SIZE = 130;

export default function TopHud() {
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
          <Link href={"/pet-level" as any} asChild>
            <Pressable
              style={styles.levelCircle}
              accessibilityRole="button"
              accessibilityLabel={`Уровень ${level}`}
            >
              <Text style={styles.levelValue}>{level}</Text>
              <Text style={styles.levelCaption}>Ур.</Text>
            </Pressable>
          </Link>

          <Link href={"/plan" as any} asChild>
            <RoundIconButton
              icon={Wallet}
              accessibilityRole="button"
              accessibilityLabel="Бюджет"
            />
          </Link>

          <RoundIconButton
            icon={MessageCircle}
            accessibilityRole="button"
            accessibilityLabel="Сообщения"
          />
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.topRightRow}>
            <View style={styles.moneyPill}>
              <CoinValue
                icon={Apple}
                color={colors.coinNeed}
                background={colors.coinNeedBg}
                value={jars.need}
              />
              <CoinValue
                icon={Shirt}
                color={colors.coinWant}
                background={colors.iconBorder}
                value={jars.want}
              />
              <CoinValue
                icon={PiggyBank}
                color={colors.coinDream}
                background={colors.coinDreamBg}
                value={jars.dream}
              />
            </View>

            <Link href={"/settings" as any} asChild>
              <RoundIconButton
                icon={Settings}
                accessibilityRole="button"
                accessibilityLabel="Настройки"
              />
            </Link>
          </View>

          <View style={styles.scalesFrame}>
            <View
              style={styles.scale}
              accessibilityRole="progressbar"
              accessibilityLabel={`Сон: ${Math.round(sleep)} из 100${sleep <= LOW ? ", мало" : ""}`}
            >
              <StatBar value={sleep} icon={MoonStar} />
              {sleep <= LOW && <Text style={styles.lowMark}>!</Text>}
            </View>

            <View
              style={styles.scale}
              accessibilityRole="progressbar"
              accessibilityLabel={`Сытость: ${Math.round(hunger)} из 100${hunger <= LOW ? ", мало" : ""}`}
            >
              <StatBar value={hunger} icon={Utensils} />
              {hunger <= LOW && <Text style={styles.lowMark}>!</Text>}
            </View>
          </View>

          <View style={styles.bubbleRow} pointerEvents="none">
            <MessageCircle
              size={BUBBLE_SIZE}
              color={colors.iconBorder}
              fill={colors.surface}
              strokeWidth={0.5}
            />
          </View>
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
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.iconBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  levelValue: {
    color: colors.coinWant,
    fontSize: 30,
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
    height: 38,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.iconBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
  },

  scalesFrame: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    marginTop: 8,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.iconBorder,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    gap: 10,
  },
  scale: { flex: 1, flexDirection: "row", alignItems: "center", gap: 4 },
  lowMark: { fontSize: 16, fontWeight: "800", color: colors.statLow },

  bubbleRow: { alignItems: "flex-end", marginTop: 4 },
});
