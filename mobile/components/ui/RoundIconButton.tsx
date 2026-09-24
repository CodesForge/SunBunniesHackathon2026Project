import { Image, Pressable, StyleSheet, View, type PressableProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, HIT } from "../../theme";

const CIRCLE_SIZE = 58;
const ICON_SIZE = 24;
const TAP_AREA_SIZE = Math.max(HIT, CIRCLE_SIZE);
const TAP_PADDING = (TAP_AREA_SIZE - CIRCLE_SIZE) / 2;

const CIRCLE_BG = require("../../assets/icons/circle-small.png");

type Props = PressableProps & {
  icon: LucideIcon;
};

export default function RoundIconButton({
  icon: Icon,
  ...pressableProps
}: Props) {
  return (
    <Pressable style={styles.tapArea} {...pressableProps}>
      <View style={styles.circle}>
        <Image source={CIRCLE_BG} style={styles.circleBg} resizeMode="contain" />
        <View style={styles.iconWrap}>
          <Icon size={ICON_SIZE} color={colors.iconBorder} strokeWidth={3} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tapArea: {
    width: TAP_AREA_SIZE,
    height: TAP_AREA_SIZE,
    padding: TAP_PADDING,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  circleBg: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    zIndex: 0,
  },
  iconWrap: {
    zIndex: 1,
    elevation: 1,
  },
});
