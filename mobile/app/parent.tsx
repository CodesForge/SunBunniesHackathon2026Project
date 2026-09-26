import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackHeader from "../components/ui/BackHeader";
import { usePet } from "../store/pet";
import { ECONOMY, type Theme } from "../data/economy";
import { colors, font, radius, space } from "../theme";

const THEME_LABEL: Record<Theme, string> = {
  planning: "Планирование",
  saving: "Накопления",
  spending: "Траты",
};

const THEME_ORDER: Theme[] = ["planning", "saving", "spending"];

function generateProblem() {
  const a = Math.floor(Math.random() * 41) + 20;
  const b = Math.floor(Math.random() * 9) + 12;
  const c = Math.floor(Math.random() * 15) + 5;
  return { text: `${a} × ${b} + ${c}`, answer: a * b + c };
}

export default function ParentScreen() {
  const themeStats = usePet((s) => s.themeStats);
  const parentBonus = usePet((s) => s.parentBonus);
  const [justGiven, setJustGiven] = useState(false);

  const [unlocked, setUnlocked] = useState(false);
  const [problem, setProblem] = useState(generateProblem);
  const [answer, setAnswer] = useState("");
  const [showWrong, setShowWrong] = useState(false);

  const checkAnswer = () => {
    if (Number(answer) === problem.answer) {
      setUnlocked(true);
      return;
    }
    setShowWrong(true);
    setProblem(generateProblem());
    setAnswer("");
  };

  const rows = THEME_ORDER.map((theme) => {
    const { right, wrong } = themeStats[theme];
    const total = right + wrong;
    const percent = total > 0 ? Math.round((right / total) * 100) : null;
    return { theme, right, wrong, total, percent };
  });

  const withData = rows.filter((r) => r.percent !== null);
  const best =
    withData.length > 0
      ? withData.reduce((a, b) => (b.percent! > a.percent! ? b : a))
      : null;
  const worst =
    withData.length > 0
      ? withData.reduce((a, b) => (b.percent! < a.percent! ? b : a))
      : null;

  const handleBonus = () => {
    parentBonus();
    setJustGiven(true);
    setTimeout(() => setJustGiven(false), 2000);
  };

  if (!unlocked) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
          <BackHeader backHref="/settings" />

          <View style={styles.gateBody}>
            <Text style={styles.title}>Родителям</Text>
            <View style={styles.gateCard}>
              <Text style={styles.gateHint}>Реши пример, чтобы продолжить</Text>
              <Text style={styles.gateProblem}>{problem.text} = ?</Text>
              <TextInput
                value={answer}
                onChangeText={setAnswer}
                style={styles.gateInput}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={checkAnswer}
              />
              {showWrong && <Text style={styles.gateError}>Не совсем так, попробуй ещё раз</Text>}
              <Pressable style={styles.gateButton} onPress={checkAnswer} accessibilityRole="button">
                <Text style={styles.gateButtonText}>Проверить</Text>
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
          <Text style={styles.title}>Родителям</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Бонус за хорошую работу</Text>
            <Text style={styles.cardHint}>
              Начислит ребёнку {ECONOMY.parentBonus} монет в баночку "Хочу".
            </Text>
            <Pressable
              style={styles.bonusButton}
              onPress={handleBonus}
              accessibilityRole="button"
              accessibilityLabel="Выдать бонус"
            >
              <Text style={styles.bonusButtonText}>
                {justGiven ? "Начислено!" : "Выдать бонус"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Как ребёнок справляется</Text>

          {rows.map((row) => (
            <View key={row.theme} style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>{THEME_LABEL[row.theme]}</Text>
                {row.percent !== null && best?.theme === row.theme && withData.length > 1 && (
                  <Text style={[styles.statBadge, { color: colors.good }]}>лучше всего</Text>
                )}
                {row.percent !== null && worst?.theme === row.theme && withData.length > 1 && best?.theme !== worst?.theme && (
                  <Text style={[styles.statBadge, { color: colors.bad }]}>стоит подтянуть</Text>
                )}
              </View>

              {row.percent === null ? (
                <Text style={styles.statEmpty}>Ещё не выполнял задания в этой теме</Text>
              ) : (
                <>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${row.percent}%`,
                          backgroundColor:
                            row.percent >= 70 ? colors.good : row.percent >= 40 ? colors.warn : colors.bad,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.statDetail}>
                    {row.percent}% правильно · {row.right} верно, {row.wrong} ошибок
                  </Text>
                </>
              )}
            </View>
          ))}
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
  gateHint: { ...font.body, color: colors.coinWant, fontWeight: "700", marginBottom: space.md, textAlign: "center" },
  gateProblem: { ...font.h1, fontWeight: "700", color: colors.coinWant, marginBottom: space.lg },
  gateInput: {
    width: "100%",
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    paddingHorizontal: space.lg,
    fontSize: 20,
    fontWeight: "700",
    color: colors.coinWant,
    textAlign: "center",
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

  card: {
    backgroundColor: colors.sceneOvalLight,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    padding: space.lg,
    marginBottom: space.xl,
  },
  cardTitle: { ...font.h2, fontWeight: "700", color: colors.coinWant, marginBottom: space.xs },
  cardHint: { ...font.small, color: colors.coinWant, marginBottom: space.md },
  bonusButton: {
    backgroundColor: colors.sceneOval,
    borderRadius: radius.pill,
    paddingVertical: space.md,
    alignItems: "center",
  },
  bonusButtonText: { ...font.body, color: colors.surface, fontWeight: "700" },

  sectionTitle: { ...font.h2, fontWeight: "700", color: colors.coinWant, marginBottom: space.md },

  statCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.md,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.sm,
  },
  statLabel: { ...font.body, color: colors.coinWant, fontWeight: "700" },
  statBadge: { ...font.small, fontWeight: "700" },
  statEmpty: { ...font.small, color: colors.coinWant },
  barTrack: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.statNormal,
    overflow: "hidden",
    marginBottom: space.xs,
  },
  barFill: { height: "100%", borderRadius: radius.pill },
  statDetail: { ...font.small, color: colors.coinWant },
});
