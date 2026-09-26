import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { colors, font, radius, space, HIT } from "../../theme";

type Props = {
  onDone: () => void;
};

export default function PlanTask({ onDone }: Props) {
  const router = useRouter();
  const left = useRef(false);
  const done = useRef(false);

  useFocusEffect(() => {
    if (left.current && !done.current) {
      done.current = true;
      onDone();
    }
    return () => {
      left.current = true;
    };
  });

  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        Открой экран плана бюджета и разложи монеты на «Надо», «Хочу» и «Мечту» — как в самом
        начале недели.
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => router.push("/plan" as any)}
        accessibilityRole="button"
        accessibilityLabel="Открыть план бюджета"
      >
        <Text style={styles.buttonText}>Открыть план бюджета</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    padding: space.lg,
    gap: space.lg,
  },
  text: { ...font.body, color: colors.coinWant },
  button: {
    minHeight: HIT,
    borderRadius: radius.pill,
    backgroundColor: colors.sceneOval,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { ...font.body, fontWeight: "700", color: colors.surface },
});
