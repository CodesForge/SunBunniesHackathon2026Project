import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackHeader from "../components/ui/BackHeader";
import { usePet } from "../store/pet";
import { colors, font, radius, space } from "../theme";

const GRANT_AMOUNT = 50;

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "sunbunnies2026";

export default function TechnicalScreen() {
  const jars = usePet((s) => s.jars);
  const unallocated = usePet((s) => s.unallocated);
  const grantJars = usePet((s) => s.grantJars);
  const nextPeriod = usePet((s) => s.nextPeriod);

  const [grantDone, setGrantDone] = useState(false);
  const [payoutDone, setPayoutDone] = useState(false);

  const [unlocked, setUnlocked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showWrong, setShowWrong] = useState(false);

  const checkLogin = () => {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      setUnlocked(true);
      return;
    }
    setShowWrong(true);
    setPassword("");
  };

  const handleGrant = () => {
    grantJars({ need: GRANT_AMOUNT, want: GRANT_AMOUNT, dream: GRANT_AMOUNT });
    setGrantDone(true);
    setTimeout(() => setGrantDone(false), 2000);
  };

  const handlePayout = () => {
    nextPeriod();
    setPayoutDone(true);
    setTimeout(() => setPayoutDone(false), 2000);
  };

  if (!unlocked) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
          <BackHeader backHref="/settings" />

          <View style={styles.gateBody}>
            <Text style={styles.title}>Техническая</Text>
            <View style={styles.gateCard}>
              <Text style={styles.gateHint}>Войдите, чтобы продолжить</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                style={styles.gateInput}
                placeholder="Логин"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.gateInput}
                placeholder="Пароль"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={checkLogin}
              />
              {showWrong && <Text style={styles.gateError}>Неверный логин или пароль</Text>}
              <Pressable style={styles.gateButton} onPress={checkLogin} accessibilityRole="button">
                <Text style={styles.gateButtonText}>Войти</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
        <BackHeader backHref="/settings" />

        <View style={styles.body}>
          <Text style={styles.title}>Техническая</Text>

          <View style={styles.stateCard}>
            <Text style={styles.stateLine}>Надо: {jars.need}</Text>
            <Text style={styles.stateLine}>Хочу: {jars.want}</Text>
            <Text style={styles.stateLine}>Мечта: {jars.dream}</Text>
            <Text style={styles.stateLine}>Не распределено: {unallocated}</Text>
          </View>

          <Pressable
            style={styles.actionButton}
            onPress={handleGrant}
            accessibilityRole="button"
            accessibilityLabel="Выдать монеты во все категории"
          >
            <Text style={styles.actionButtonText}>
              {grantDone ? "Выдано!" : `+${GRANT_AMOUNT} в каждую категорию`}
            </Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={handlePayout}
            accessibilityRole="button"
            accessibilityLabel="Выдать недельную выплату"
          >
            <Text style={styles.actionButtonText}>
              {payoutDone ? "Выплачено!" : "Выдать недельную выплату"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  content: { flex: 1 },
  body: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
  },
  title: { ...font.h1, fontWeight: "700", color: colors.coinWant, marginBottom: space.lg },

  gateBody: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    justifyContent: "center",
  },
  gateCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    borderRadius: radius.lg,
    padding: space.xl,
    alignItems: "center",
  },
  gateHint: { ...font.body, color: colors.coinWant, fontWeight: "700", marginBottom: space.lg, textAlign: "center" },
  gateInput: {
    width: "100%",
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    paddingHorizontal: space.lg,
    fontSize: 16,
    fontWeight: "700",
    color: colors.coinWant,
    marginBottom: space.md,
  },
  gateError: { ...font.small, color: colors.bad, fontWeight: "700", marginBottom: space.sm, textAlign: "center" },
  gateButton: {
    width: "100%",
    backgroundColor: colors.sceneOval,
    borderRadius: radius.pill,
    paddingVertical: space.md,
    alignItems: "center",
  },
  gateButtonText: { ...font.body, color: colors.surface, fontWeight: "700" },

  stateCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    padding: space.lg,
    marginBottom: space.xl,
    gap: space.xs,
  },
  stateLine: { ...font.body, color: colors.ink },

  actionButton: {
    backgroundColor: colors.coinWant,
    borderRadius: radius.pill,
    paddingVertical: space.md,
    alignItems: "center",
    marginBottom: space.md,
  },
  actionButtonText: { ...font.body, color: colors.surface, fontWeight: "700" },
});
