import { useEffect, useRef } from "react";
import { Animated, Modal as RNModal, Pressable, StyleSheet, Text, View } from "react-native";
import { PackageOpen, X } from "lucide-react-native";

import { ECONOMY } from "../../data/economy";
import { colors, font, radius, space } from "../../theme";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ChestRewardModal({ visible, onClose }: Props) {
  const chestScale = useRef(new Animated.Value(0)).current;
  const coin1 = useRef(new Animated.Value(0)).current;
  const coin2 = useRef(new Animated.Value(0)).current;
  const coin3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    chestScale.setValue(0);
    coin1.setValue(0);
    coin2.setValue(0);
    coin3.setValue(0);

    Animated.sequence([
      Animated.spring(chestScale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.stagger(120, [
        Animated.timing(coin1, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(coin2, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(coin3, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]),
    ]).start();
  }, [visible, chestScale, coin1, coin2, coin3]);

  const coinStyle = (v: Animated.Value) => ({
    opacity: v,
    transform: [
      { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
      { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
    ],
  });

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable style={styles.closeBtn} onPress={onClose} accessibilityRole="button" accessibilityLabel="Закрыть">
            <X size={22} color={colors.coinWant} strokeWidth={3} />
          </Pressable>

          <Animated.View style={[styles.chestWrap, { transform: [{ scale: chestScale }] }]}>
            <PackageOpen size={72} color={colors.coinDream} strokeWidth={2} />
          </Animated.View>

          <Text style={styles.title}>Сундук открыт!</Text>

          <View style={styles.coinsRow}>
            <Animated.Text style={[styles.coin, coinStyle(coin1)]}>🪙</Animated.Text>
            <Animated.Text style={[styles.coin, coinStyle(coin2)]}>🪙</Animated.Text>
            <Animated.Text style={[styles.coin, coinStyle(coin3)]}>🪙</Animated.Text>
          </View>

          <Text style={styles.reward}>+{ECONOMY.chestReward} монет</Text>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(42, 37, 32, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: space.xl,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.sceneOval,
    paddingVertical: space.xxl,
    paddingHorizontal: space.xl,
    alignItems: "center",
    gap: space.sm,
  },
  closeBtn: {
    position: "absolute",
    top: space.md,
    right: space.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sceneOvalLight,
  },
  chestWrap: { marginBottom: space.sm },
  title: { ...font.h2, color: colors.coinWant, textAlign: "center" },
  coinsRow: { flexDirection: "row", gap: space.md, marginTop: space.sm },
  coin: { fontSize: 32 },
  reward: { ...font.h1, color: colors.coinDream, marginTop: space.sm },
});
