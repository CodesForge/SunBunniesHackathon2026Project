import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { usePet } from "../../store/pet";
import { BigOval, Clouds, Leaves, ONB, SkyBackground } from "../../components/onboarding/scene";
import { RoundButton } from "../../components/onboarding/buttons";
import { colors } from "../../theme";

const MIN = 3;
const MAX = 25;

export default function ChooseNameScreen() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const trimmed = value.trim();
  const valid = trimmed.length >= MIN && trimmed.length <= MAX;

  const next = () => {
    if (!valid) return;
    usePet.setState({ username: trimmed, dirty: true });
    router.push("/onboarding/species" as any);
  };

  return (
    <View style={styles.root}>
      <SkyBackground />
      <Clouds />
      <BigOval top={ONB.ovalHigh} from={ONB.ovalLow} />
      <Leaves
        source={require("../../assets/items/first-enter/coins-and-leaves-choose.png")}
        mode="in"
      />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.safe}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.column}>
            <Text style={styles.title}>Придумай своё{"\n"}уникальное имя!</Text>

            <TextInput
              value={value}
              onChangeText={setValue}
              style={styles.input}
              maxLength={MAX}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={next}
            />

            {!valid && (
              <Text style={styles.hint}>
                От {MIN} до {MAX} символов
              </Text>
            )}

            <View style={styles.buttonSlot}>
              <RoundButton onPress={next} disabled={!valid} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ONB.bg },
  safe: { flex: 1 },
  column: {
    position: "absolute",
    top: "38%",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.surface,
    textAlign: "center",
    lineHeight: 32,
    textShadowColor: "rgba(80, 90, 190, 0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  input: {
    marginTop: 22,
    width: "100%",
    height: 54,
    borderRadius: 999,
    backgroundColor: colors.surface,
    paddingHorizontal: 22,
    fontSize: 18,
    fontWeight: "700",
    color: colors.sceneOval,
    textAlign: "center",
    outlineWidth: 0,
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: colors.surface,
    opacity: 0.9,
  },
  buttonSlot: { marginTop: 26 },
});
