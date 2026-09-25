import { Image, StyleSheet, View, type ImageSourcePropType } from "react-native";
import { colors } from "../../theme";

const CIRCLE_LARGE = require("../../assets/icons/circle-large.png");

// У картинки circle-large.png фиолетовое кольцо занимает край, а внутри
// светлая "дырка" примерно на 76% диаметра — фото питомца вписываем в неё,
// чтобы кольцо было видно рамкой вокруг аватарки.
const INNER_RATIO = 0.76;

type PetIconProps = {
  icon: ImageSourcePropType;
  size: number;
  active?: boolean;
};

export function PetIcon({ icon, size, active = false }: PetIconProps) {
  const outerSize = active ? size + 14 : size;
  const innerSize = outerSize * INNER_RATIO;

  return (
    <View style={[styles.halo, { width: outerSize, height: outerSize }]}>
      <Image
        source={CIRCLE_LARGE}
        style={{ position: "absolute", width: outerSize, height: outerSize }}
        resizeMode="contain"
      />
      <View
        style={[
          styles.bubble,
          { width: innerSize, height: innerSize, borderRadius: innerSize / 2 },
        ]}
      >
        <Image source={icon} style={{ width: innerSize, height: innerSize }} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  halo: {
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
});
