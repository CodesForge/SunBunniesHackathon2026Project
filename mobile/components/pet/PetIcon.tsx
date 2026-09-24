import { Image, StyleSheet, View, type ImageSourcePropType } from "react-native";
import { colors } from "../../theme";

type PetIconProps = {
  icon: ImageSourcePropType;
  size: number;
  active?: boolean;
};

export function PetIcon({ icon, size, active = false }: PetIconProps) {
  const haloSize = active ? size + 14 : size;

  return (
    <View
      style={[
        styles.halo,
        active && styles.haloActive,
        { width: haloSize, height: haloSize, borderRadius: haloSize / 2 },
      ]}
    >
      <View style={[styles.bubble, { width: size, height: size, borderRadius: size / 2 }]}>
        <Image source={icon} style={{ width: size, height: size }} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  halo: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  haloActive: {
    backgroundColor: colors.surface,
  },
  bubble: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
});

