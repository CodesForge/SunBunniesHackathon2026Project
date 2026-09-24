import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type PressableProps,
} from "react-native";

import { colors, radius, HIT } from "../../theme";

const CIRCLE_SIZE = 88;
const BORDER_WIDTH = 6;
const ICON_SIZE = 58;

export const ROUND_IMAGE_BUTTON_SIZE = Math.max(HIT, CIRCLE_SIZE);
const TAP_PADDING = (ROUND_IMAGE_BUTTON_SIZE - CIRCLE_SIZE) / 2;

type Props = PressableProps & {
  image: ImageSourcePropType;
};

export default function RoundImageButton({ image, ...pressableProps }: Props) {
  return (
    <Pressable style={styles.tapArea} {...pressableProps}>
      <View style={styles.circle}>
        <Image source={image} style={styles.icon} resizeMode="contain" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tapArea: {
    width: ROUND_IMAGE_BUTTON_SIZE,
    height: ROUND_IMAGE_BUTTON_SIZE,
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
  icon: { width: ICON_SIZE, height: ICON_SIZE },
});
