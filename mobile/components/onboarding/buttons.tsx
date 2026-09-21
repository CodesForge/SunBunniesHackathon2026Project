import { Pressable, StyleSheet, Text, View } from "react-native";
import { Play } from "lucide-react-native";
import { ONB } from "./scene";

type PillProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PillButton({ label, onPress, disabled }: PillProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.pill,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={styles.pillText}>{label}</Text>
      <Play size={24} color={ONB.oval} fill={ONB.oval} strokeWidth={0} />
    </Pressable>
  );
}

type RoundProps = {
  onPress: () => void;
  disabled?: boolean;
  size?: number;
};

export function RoundButton({ onPress, disabled, size = 56 }: RoundProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.round,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={{ marginLeft: size * 0.06 }}>
        <Play
          size={size * 0.42}
          color={ONB.oval}
          fill={ONB.oval}
          strokeWidth={0}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 34,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  pillText: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1,
    color: ONB.oval,
  },
  round: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.45 },
});
