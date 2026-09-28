import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Link } from "expo-router";
import { ArrowLeft, MessageCircle, Settings, Wallet } from "lucide-react-native";

import { usePet } from "../../store/pet";
import { energyNow, fullness } from "../../lib/time";
import { colors, radius } from "../../theme";
import CoinValue from "./CoinValue";
import StatBar from "./StatBar";
import RoundIconButton from "./RoundIconButton";

const LOW = 20;

const TABLET_BREAKPOINT = 768;
const SMALL_PHONE_BREAKPOINT = 440;
const TINY_PHONE_BREAKPOINT = 360;

const ROOT_PADDING_H = 16;
const ROOT_PADDING_H_TABLET = 28;
const ROOT_PADDING_TOP = 8;
const ROOT_PADDING_TOP_TABLET = 14;

const LEFT_COLUMN_WIDTH = 80;
const LEFT_COLUMN_WIDTH_TABLET = 108;
const LEFT_COLUMN_GAP = 8;
const LEFT_COLUMN_GAP_TABLET = 14;

const LEVEL_VALUE_FONT = 20;
const LEVEL_VALUE_FONT_TABLET = 26;
const LEVEL_VALUE_LINE_HEIGHT = 34;
const LEVEL_VALUE_LINE_HEIGHT_TABLET = 40;

const ROUND_BUTTON_CIRCLE_TABLET = 78;
const ROUND_BUTTON_ICON_TABLET = 32;

const RIGHT_COLUMN_MARGIN_LEFT = 10;
const TOP_RIGHT_ROW_GAP = 10;

const PILL_BORDER_WIDTH = 5;

const MONEY_PILL_HEIGHT = 36;
const MONEY_PILL_HEIGHT_TINY = 56;
const MONEY_PILL_HEIGHT_TABLET = 52;
const MONEY_PILL_PADDING_H_TABLET = 26;
const MONEY_PILL_WIDTH_TABLET = 340;

const TABLET_COIN_BADGE_SIZE = 38;
const TABLET_COIN_FONT_SIZE = 18;
const SMALL_PHONE_COIN_FONT_SIZE = 16;

const SCALES_FRAME_HEIGHT = 46;
const SCALES_FRAME_HEIGHT_TABLET = 64;
const SCALES_FRAME_MARGIN_TOP = 8;
const SCALES_FRAME_MARGIN_TOP_TABLET = 12;
const SCALES_FRAME_PADDING_H = 16;
const SCALES_FRAME_PADDING_H_TABLET = 26;
const SCALES_FRAME_GAP = 10;
const SCALES_FRAME_GAP_TABLET = 24;
const SCALES_FRAME_WIDTH_TABLET = 460;

const TABLET_STAT_BAR_HEIGHT = 24;
const TABLET_STAT_ICON_SIZE = 32;

const LOW_MARK_FONT = 16;
const LOW_MARK_FONT_TABLET = 20;

const ALERT_SIZE = 20;
const ALERT_SIZE_TABLET = 26;
const ALERT_FONT = 16;
const ALERT_FONT_TABLET = 16;

const COIN_NEED = require("../../assets/icons/coin-need.png");
const COIN_WANT = require("../../assets/icons/coin-want.png");
const COIN_DREAM = require("../../assets/icons/coin-dream.png");
const CIRCLE_LARGE = require("../../assets/icons/circle-large.png");
const ICON_MOON_PURPLE = require("../../assets/icons/icon-moon-purple.png");
const ICON_FOOD_PURPLE = require("../../assets/icons/icon-food-purple.png");

type TopHudProps = {
  showStats?: boolean;
  showChat?: boolean;
  showWallet?: boolean;
  backHref?: string;
};

export default function TopHud({
  showStats = true,
  showChat = true,
  showWallet = true,
  backHref,
}: TopHudProps) {
  const jars = usePet((s) => s.jars);
  const unallocated = usePet((s) => s.unallocated);
  const xp = usePet((s) => s.xp);
  const lastFedAt = usePet((s) => s.lastFedAt);
  const energyBase = usePet((s) => s.energyBase);
  const energyAt = usePet((s) => s.energyAt);
  const asleep = usePet((s) => s.asleep);
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const isSmallPhone = width < SMALL_PHONE_BREAKPOINT;
  const isTinyPhone = width <= TINY_PHONE_BREAKPOINT;

  const needsPlan = unallocated > 0;

  const level = xp;
  const hunger = fullness(lastFedAt);
  const sleep = energyNow(energyBase, energyAt, asleep);

  const roundButtonProps = isTablet
    ? { circleSize: ROUND_BUTTON_CIRCLE_TABLET, iconSize: ROUND_BUTTON_ICON_TABLET }
    : {};

  const coinFontSize = isTablet
    ? TABLET_COIN_FONT_SIZE
    : isSmallPhone
      ? SMALL_PHONE_COIN_FONT_SIZE
      : undefined;

  const settingsButton = (
    <Link href={"/settings" as any} asChild>
      <RoundIconButton
        icon={Settings}
        accessibilityRole="button"
        accessibilityLabel="Настройки"
        {...roundButtonProps}
      />
    </Link>
  );

  return (
    <View style={[styles.root, isTablet && styles.rootTablet]}>
      <View style={styles.row}>
        <View
          style={[
            styles.leftColumn,
            isTablet && styles.leftColumnTablet,
          ]}
        >
          {backHref ? (
            <Link href={backHref as any} asChild>
              <RoundIconButton
                icon={ArrowLeft}
                accessibilityRole="button"
                accessibilityLabel="Назад"
                {...roundButtonProps}
              />
            </Link>
          ) : (
            <View
              style={[styles.levelCircle, isTablet && styles.levelCircleTablet]}
              accessibilityRole="text"
              accessibilityLabel={`Уровень ${level}`}
            >
              <Image
                source={CIRCLE_LARGE}
                style={[styles.levelCircleBg, isTablet && styles.levelCircleBgTablet]}
                resizeMode="contain"
              />
              <Text style={[styles.levelValue, isTablet && styles.levelValueTablet]}>
                {level} Ур.
              </Text>
            </View>
          )}

          {showWallet && (
            <View>
              <Link href={"/plan" as any} asChild>
                <RoundIconButton
                  icon={Wallet}
                  accessibilityRole="button"
                  accessibilityLabel={
                    needsPlan ? "Бюджет, деньги ещё не разложены" : "Бюджет"
                  }
                  {...roundButtonProps}
                />
              </Link>
              {needsPlan && (
                <View style={[styles.alert, isTablet && styles.alertTablet]} pointerEvents="none">
                  <Text style={[styles.alertText, isTablet && styles.alertTextTablet]}>!</Text>
                </View>
              )}
            </View>
          )}

          {showChat && (
            <RoundIconButton
              icon={MessageCircle}
              accessibilityRole="button"
              accessibilityLabel="Сообщения"
              {...roundButtonProps}
            />
          )}
        </View>

        <View style={[styles.rightColumn, isTablet && styles.rightColumnTablet]}>
          <View style={[styles.topRightRow, isTablet && styles.topRightRowTablet]}>
            <View
              style={[
                styles.moneyPill,
                isTinyPhone && styles.moneyPillTiny,
                isTablet && styles.moneyPillTablet,
              ]}
            >
              <CoinValue
                image={COIN_NEED}
                value={jars.need}
                badgeSize={isTablet ? TABLET_COIN_BADGE_SIZE : undefined}
                fontSize={coinFontSize}
                stacked={isTinyPhone}
              />
              <CoinValue
                image={COIN_WANT}
                value={jars.want}
                badgeSize={isTablet ? TABLET_COIN_BADGE_SIZE : undefined}
                fontSize={coinFontSize}
                stacked={isTinyPhone}
              />
              <CoinValue
                image={COIN_DREAM}
                value={jars.dream}
                badgeSize={isTablet ? TABLET_COIN_BADGE_SIZE : undefined}
                fontSize={coinFontSize}
                stacked={isTinyPhone}
              />
            </View>

            {!isTablet && settingsButton}
          </View>

          {showStats && (
            <View style={[styles.scalesFrame, isTablet && styles.scalesFrameTablet]}>
              <View
                style={styles.scale}
                accessibilityRole="progressbar"
                accessibilityLabel={`Сон: ${Math.round(sleep)} из 100${sleep <= LOW ? ", мало" : ""}`}
              >
                <StatBar
                  value={sleep}
                  icon={ICON_MOON_PURPLE}
                  barHeight={isTablet ? TABLET_STAT_BAR_HEIGHT : undefined}
                  iconSize={isTablet ? TABLET_STAT_ICON_SIZE : undefined}
                />
                {sleep <= LOW && (
                  <Text style={[styles.lowMark, isTablet && styles.lowMarkTablet]}>!</Text>
                )}
              </View>

              <View
                style={styles.scale}
                accessibilityRole="progressbar"
                accessibilityLabel={`Сытость: ${Math.round(hunger)} из 100${hunger <= LOW ? ", мало" : ""}`}
              >
                <StatBar
                  value={hunger}
                  icon={ICON_FOOD_PURPLE}
                  barHeight={isTablet ? TABLET_STAT_BAR_HEIGHT : undefined}
                  iconSize={isTablet ? TABLET_STAT_ICON_SIZE : undefined}
                />
                {hunger <= LOW && (
                  <Text style={[styles.lowMark, isTablet && styles.lowMarkTablet]}>!</Text>
                )}
              </View>
            </View>
          )}
        </View>

        {isTablet && <View style={styles.topRightCorner}>{settingsButton}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: ROOT_PADDING_H, paddingTop: ROOT_PADDING_TOP },
  rootTablet: { paddingHorizontal: ROOT_PADDING_H_TABLET, paddingTop: ROOT_PADDING_TOP_TABLET },
  row: { flexDirection: "row", position: "relative" },

  leftColumn: { width: LEFT_COLUMN_WIDTH, alignItems: "center", gap: LEFT_COLUMN_GAP },
  leftColumnTablet: {
    position: "absolute",
    top: 0,
    left: 0,
    width: LEFT_COLUMN_WIDTH_TABLET,
    gap: LEFT_COLUMN_GAP_TABLET,
    zIndex: 1,
  },
  levelCircle: {
    width: LEFT_COLUMN_WIDTH,
    height: LEFT_COLUMN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  levelCircleTablet: {
    width: LEFT_COLUMN_WIDTH_TABLET,
    height: LEFT_COLUMN_WIDTH_TABLET,
  },
  levelCircleBg: {
    position: "absolute",
    width: LEFT_COLUMN_WIDTH,
    height: LEFT_COLUMN_WIDTH,
  },
  levelCircleBgTablet: {
    width: LEFT_COLUMN_WIDTH_TABLET,
    height: LEFT_COLUMN_WIDTH_TABLET,
  },
  levelValue: {
    color: colors.coinWant,
    fontSize: LEVEL_VALUE_FONT,
    fontWeight: "800",
    lineHeight: LEVEL_VALUE_LINE_HEIGHT,
  },
  levelValueTablet: {
    fontSize: LEVEL_VALUE_FONT_TABLET,
    lineHeight: LEVEL_VALUE_LINE_HEIGHT_TABLET,
  },

  rightColumn: { flex: 1, marginLeft: RIGHT_COLUMN_MARGIN_LEFT },
  rightColumnTablet: { marginLeft: 0 },
  topRightRow: { flexDirection: "row", alignItems: "center", gap: TOP_RIGHT_ROW_GAP },
  topRightRowTablet: { justifyContent: "center" },
  topRightCorner: { position: "absolute", top: 0, right: 0, zIndex: 1 },
  moneyPill: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: MONEY_PILL_HEIGHT,
    borderRadius: radius.pill,
    borderWidth: PILL_BORDER_WIDTH,
    borderColor: colors.pillBorder,
    backgroundColor: colors.surface,
  },
  moneyPillTiny: {
    height: MONEY_PILL_HEIGHT_TINY,
    paddingHorizontal: 10,
  },
  moneyPillTablet: {
    maxWidth: MONEY_PILL_WIDTH_TABLET,
    height: MONEY_PILL_HEIGHT_TABLET,
    paddingHorizontal: MONEY_PILL_PADDING_H_TABLET,
  },

  scalesFrame: {
    flexDirection: "row",
    alignItems: "center",
    height: SCALES_FRAME_HEIGHT,
    marginTop: SCALES_FRAME_MARGIN_TOP,
    borderRadius: radius.pill,
    borderWidth: PILL_BORDER_WIDTH,
    borderColor: colors.pillBorder,
    backgroundColor: colors.surface,
    paddingHorizontal: SCALES_FRAME_PADDING_H,
    gap: SCALES_FRAME_GAP,
  },
  scalesFrameTablet: {
    alignSelf: "center",
    width: SCALES_FRAME_WIDTH_TABLET,
    height: SCALES_FRAME_HEIGHT_TABLET,
    marginTop: SCALES_FRAME_MARGIN_TOP_TABLET,
    paddingHorizontal: SCALES_FRAME_PADDING_H_TABLET,
    gap: SCALES_FRAME_GAP_TABLET,
  },
  scale: { flex: 1, flexDirection: "row", alignItems: "center", gap: 4 },
  lowMark: { fontSize: LOW_MARK_FONT, fontWeight: "800", color: colors.statLow },
  lowMarkTablet: { fontSize: LOW_MARK_FONT_TABLET },

  alert: {
    position: "absolute",
    top: 0,
    right: 0,
    width: ALERT_SIZE,
    height: ALERT_SIZE,
    borderRadius: ALERT_SIZE / 2,
    backgroundColor: colors.navBadge,
    alignItems: "center",
    justifyContent: "center",
  },
  alertTablet: {
    width: ALERT_SIZE_TABLET,
    height: ALERT_SIZE_TABLET,
    borderRadius: ALERT_SIZE_TABLET / 2,
  },
  alertText: { color: colors.surface, fontSize: ALERT_FONT, fontWeight: "800" },
  alertTextTablet: { fontSize: ALERT_FONT_TABLET },
});
