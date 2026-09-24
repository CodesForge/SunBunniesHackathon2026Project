import { Image, StyleSheet, View, type ImageSourcePropType } from "react-native";
import { colors, radius } from "../../theme";

const BAR_HEIGHT = 16;
const BORDER_WIDTH = 2;
const ICON_SIZE = 16;
const ICON_GAP = 6;

const LOW_THRESHOLD = 20;
const LOW_COLOR = colors.statLow;
const NORMAL_COLOR = colors.statNormal;

type Props = {
  value: number;
  icon: ImageSourcePropType;
};

export default function StatBar({ value, icon }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  const fillColor = pct <= LOW_THRESHOLD ? LOW_COLOR : NORMAL_COLOR;

  return (
    <View style={styles.wrap}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${pct}%`, backgroundColor: fillColor }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: ICON_GAP,
  },
  icon: { width: ICON_SIZE, height: ICON_SIZE },
  track: {
    flex: 1,
    minWidth: 60,
    height: BAR_HEIGHT,
    borderRadius: radius.pill,
    borderWidth: BORDER_WIDTH,
    borderColor: colors.iconBorder,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
  },
});
