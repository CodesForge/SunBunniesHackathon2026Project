import { Image, Pressable, StyleSheet, View, type PressableProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, HIT } from "../../theme";

const CIRCLE_SIZE = 58;
const ICON_SIZE = 24;

const CIRCLE_BG = require("../../assets/icons/circle-small.png");

type Props = PressableProps & {
  icon: LucideIcon;
  circleSize?: number;
  iconSize?: number;
};

export default function RoundIconButton({
  icon: Icon,
  circleSize,
  iconSize,
  ...pressableProps
}: Props) {
  const resolvedCircleSize = circleSize ?? CIRCLE_SIZE;
  const resolvedIconSize = iconSize ?? ICON_SIZE;
  const tapAreaSize = Math.max(HIT, resolvedCircleSize);
  const tapPadding = (tapAreaSize - resolvedCircleSize) / 2;

  return (
    <Pressable
      style={[
        styles.tapArea,
        { width: tapAreaSize, height: tapAreaSize, padding: tapPadding },
      ]}
      {...pressableProps}
    >
      <View style={[styles.circle, { width: resolvedCircleSize, height: resolvedCircleSize }]}>
        <Image
          source={CIRCLE_BG}
          style={[
            styles.circleBg,
            { width: resolvedCircleSize, height: resolvedCircleSize },
          ]}
          resizeMode="contain"
        />
        <View style={styles.iconWrap}>
          <Icon size={resolvedIconSize} color={colors.iconBorder} strokeWidth={3} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tapArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleBg: {
    position: "absolute",
    zIndex: 0,
  },
  iconWrap: {
    zIndex: 1,
    elevation: 1,
  },
});
