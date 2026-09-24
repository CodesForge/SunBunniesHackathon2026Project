import { StyleSheet, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
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
  icon: LucideIcon;
};

export default function StatBar({ value, icon: Icon }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  const fillColor = pct <= LOW_THRESHOLD ? LOW_COLOR : NORMAL_COLOR;

  return (
    <View style={styles.wrap}>
      <Icon size={ICON_SIZE} color={colors.iconBorder} strokeWidth={3} />
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
