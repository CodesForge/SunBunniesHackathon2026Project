import { StyleSheet, Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors, radius } from "../../theme";

const BADGE_SIZE = 28;
const BORDER_WIDTH = 2;
const ICON_SIZE = 16;

type Props = {
  icon: LucideIcon;
  color: string;
  background: string;
  value: number;
};

export default function CoinValue({ icon: Icon, color, background, value }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.badge, { borderColor: color, backgroundColor: background }]}>
        <Icon size={ICON_SIZE} color={color} strokeWidth={2} />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: radius.pill,
    borderWidth: BORDER_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  value: { fontSize: 14, fontWeight: "800", color: colors.ink },
});

