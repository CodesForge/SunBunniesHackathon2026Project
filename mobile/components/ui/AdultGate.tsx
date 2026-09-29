import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackHeader from "./BackHeader";
import { colors, font, radius, space } from "../../theme";

type AdultGateProps = {
  backHref: string;
  title: string;
  children: React.ReactNode;
};

function generateProblem() {
  const a = Math.floor(Math.random() * 41) + 20;
  const b = Math.floor(Math.random() * 9) + 12;
  const c = Math.floor(Math.random() * 15) + 5;
  return { text: `${a} × ${b} + ${c}`, answer: a * b + c };
}

let solvedThisSession = false;

export default function AdultGate({ backHref, title, children }: AdultGateProps) {
  const [unlocked, setUnlocked] = useState(solvedThisSession);
  const [problem, setProblem] = useState(generateProblem);
  const [answer, setAnswer] = useState("");
  const [showWrong, setShowWrong] = useState(false);

  const checkAnswer = () => {
    if (Number(answer) === problem.answer) {
      solvedThisSession = true;
      setUnlocked(true);
      return;
    }
    setShowWrong(true);
    setProblem(generateProblem());
    setAnswer("");
  };

  if (!unlocked) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
          <BackHeader backHref={backHref} />

          <View style={styles.gateBody}>
            <Text style={styles.title}>{title}</Text>
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
              <Pressable
                style={styles.gateButton}
                onPress={checkAnswer}
                accessibilityRole="button"
                accessibilityLabel="Проверить"
              >
                <Text style={styles.gateButtonText}>Проверить</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  content: { flex: 1 },
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
  gateHint: {
    ...font.body,
    color: colors.coinWant,
    fontWeight: "700",
    marginBottom: space.md,
    textAlign: "center",
  },
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
  gateError: {
    ...font.small,
    color: colors.bad,
    fontWeight: "700",
    marginBottom: space.sm,
    textAlign: "center",
  },
  gateButton: {
    width: "100%",
    backgroundColor: colors.sceneOval,
    borderRadius: radius.pill,
    paddingVertical: space.md,
    alignItems: "center",
  },
  gateButtonText: { ...font.body, color: colors.surface, fontWeight: "700" },
});
