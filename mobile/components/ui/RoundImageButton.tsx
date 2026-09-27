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
const CIRCLE_SIZE_TABLET = 120;
const ICON_SIZE_TABLET = 78;

const CIRCLE_LARGE = require("../../assets/icons/circle-large.png");

export const ROUND_IMAGE_BUTTON_SIZE = Math.max(HIT, CIRCLE_SIZE);
export const ROUND_IMAGE_BUTTON_SIZE_TABLET = Math.max(HIT, CIRCLE_SIZE_TABLET);
export const ROUND_IMAGE_BUTTON_CIRCLE_TABLET = CIRCLE_SIZE_TABLET;
export const ROUND_IMAGE_BUTTON_ICON_TABLET = ICON_SIZE_TABLET;

type Props = PressableProps & {
  image: ImageSourcePropType;
  iconSize?: number;
  circleSize?: number;
};

export default function RoundImageButton({
  image,
  iconSize,
  circleSize,
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
          source={CIRCLE_LARGE}
          style={[
            styles.circleBg,
            { width: resolvedCircleSize, height: resolvedCircleSize },
          ]}
          resizeMode="contain"
        />
        <View style={styles.iconWrap}>
          <Image
            source={image}
            style={{ width: resolvedIconSize, height: resolvedIconSize }}
            resizeMode="contain"
          />
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
