import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { colors } from "../../theme";

const BADGE_SIZE = 28;

type Props = {
  image: ImageSourcePropType;
  value: number;
};

export default function CoinValue({ image, value }: Props) {
  return (
    <View style={styles.wrap}>
      <Image source={image} style={styles.badge} resizeMode="contain" />
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: { width: BADGE_SIZE, height: BADGE_SIZE },
  value: { fontSize: 14, fontWeight: "800", color: colors.ink },
});
