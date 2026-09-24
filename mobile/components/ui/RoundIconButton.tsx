import { Pressable, StyleSheet, View, type PressableProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, radius, HIT } from "../../theme";

const CIRCLE_SIZE = 46;
const BORDER_WIDTH = 3;
const ICON_SIZE = 24;
const TAP_PADDING = (HIT - CIRCLE_SIZE) / 2;

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
        <Icon size={ICON_SIZE} color={colors.iconBorder} strokeWidth={3} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tapArea: {
    width: HIT,
    height: HIT,
    padding: TAP_PADDING,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: radius.pill,
    borderWidth: BORDER_WIDTH,
    borderColor: colors.iconBorder,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
