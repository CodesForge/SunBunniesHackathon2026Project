import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type PressableProps,
} from "react-native";

import { HIT } from "../../theme";

const CIRCLE_SIZE = 88;
const ICON_SIZE = 58;

const CIRCLE_LARGE = require("../../assets/icons/circle-large.png");

export const ROUND_IMAGE_BUTTON_SIZE = Math.max(HIT, CIRCLE_SIZE);
const TAP_PADDING = (ROUND_IMAGE_BUTTON_SIZE - CIRCLE_SIZE) / 2;

type Props = PressableProps & {
  image: ImageSourcePropType;
};

export default function RoundImageButton({ image, ...pressableProps }: Props) {
  return (
    <Pressable style={styles.tapArea} {...pressableProps}>
      <View style={styles.circle}>
        <Image source={CIRCLE_LARGE} style={styles.circleBg} resizeMode="contain" />
        <View style={styles.iconWrap}>
          <Image source={image} style={styles.icon} resizeMode="contain" />
        </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  circleBg: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    zIndex: 0,
  },
  iconWrap: { zIndex: 1, elevation: 1 },
  icon: { width: ICON_SIZE, height: ICON_SIZE },
});
