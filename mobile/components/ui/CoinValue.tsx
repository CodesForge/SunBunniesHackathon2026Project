import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { colors } from "../../theme";

const BADGE_SIZE = 28;

type Props = {
  image: ImageSourcePropType;
  value: number;
  badgeSize?: number;
  fontSize?: number;
  stacked?: boolean;
};

export default function CoinValue({ image, value, badgeSize, fontSize, stacked }: Props) {
  return (
    <View style={[styles.wrap, stacked && styles.wrapStacked]}>
      <Image
        source={image}
        style={[styles.badge, badgeSize != null && { width: badgeSize, height: badgeSize }]}
        resizeMode="contain"
      />
      <Text style={[styles.value, fontSize != null && { fontSize }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  wrapStacked: { flexDirection: "column", gap: 2 },
  badge: { width: BADGE_SIZE, height: BADGE_SIZE },
  value: { fontSize: 14, fontWeight: "800", color: colors.ink },
});
