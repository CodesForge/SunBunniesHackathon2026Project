import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackHeader from "../components/ui/BackHeader";
import QuestionsTask from "../components/lessons/QuestionsTask";
import {
  LESSON_BODY_TEXT,
  LESSON_DONE_TITLE,
  LESSON_ORANGE,
  LESSON_TITLE,
} from "../components/lessons/lessonColors";
import { ECONOMY } from "../data/economy";
import type { QuestionsStepData } from "../data/lessons";
import { getDailyQuestion } from "../lib/dailyLesson";
import { todayKey } from "../lib/time";
import { usePet } from "../store/pet";
import { colors, font, radius, space, HIT } from "../theme";

type Phase = "loading" | "intro" | "question" | "done";

export default function DailyLessonScreen() {
  const doneQuests = usePet((s) => s.doneQuests);
  const completeQuest = usePet((s) => s.completeQuest);

  const dailyId = `daily-${todayKey()}`;
  const alreadyDone = doneQuests.includes(dailyId);

  const [phase, setPhase] = useState<Phase>(alreadyDone ? "done" : "loading");
  const [step, setStep] = useState<QuestionsStepData | null>(null);

  useEffect(() => {
    if (alreadyDone) return;
    getDailyQuestion().then((q) => {
      setStep({
        kind: "questions",
        questions: [
          {
            id: dailyId,
            difficulty: "recognition",
            prompt: q.question,
            options: q.options,
            correctIndex: q.options.indexOf(q.correctOption),
            explanation: q.explanation,
          },
        ],
      });
      setPhase("intro");
    });
  }, [alreadyDone, dailyId]);

  const finish = (mistakes: number) => {
    completeQuest(dailyId, "planning", ECONOMY.questReward, mistakes === 0);
    setPhase("done");
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
        <BackHeader backHref="/glossary" />

        <View style={styles.body}>
          {phase === "loading" && <Text style={styles.title}>Готовим вопрос дня...</Text>}

          {phase === "intro" && (
            <>
              <Text style={styles.eyebrow}>Урок дня</Text>
              <Text style={styles.title}>Один вопрос на сегодня</Text>
              <Pressable
                style={styles.primaryButton}
                onPress={() => setPhase("question")}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Начать</Text>
              </Pressable>
            </>
          )}

          {phase === "question" && step && (
            <QuestionsTask data={step} onDone={finish} />
          )}

          {phase === "done" && (
            <View style={styles.doneCard}>
              <Text style={styles.doneTitle}>
                {alreadyDone ? "Урок дня уже пройден" : "Урок дня пройден!"}
              </Text>
              {!alreadyDone && <Text style={styles.doneReward}>+{ECONOMY.questReward} монет</Text>}
              {alreadyDone && (
                <Text style={styles.paragraph}>Новый вопрос появится завтра.</Text>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sceneOvalLight },
  content: { flex: 1 },
  body: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    padding: 20,
    gap: 20,
  },

  eyebrow: { ...font.small, fontWeight: "700", color: colors.muted },
  title: { ...font.h1, fontWeight: "700", color: LESSON_TITLE },
  paragraph: { ...font.body, color: LESSON_BODY_TEXT },

  primaryButton: {
    minHeight: HIT,
    borderRadius: radius.pill,
    backgroundColor: colors.sceneOval,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  primaryButtonText: { ...font.body, fontWeight: "600", color: colors.surface },

  doneCard: {
    marginTop: 50,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.sceneOval,
    borderRadius: radius.lg,
    padding: 20,
    alignItems: "center",
    gap: space.md,
  },
  doneTitle: { fontSize: 20, fontWeight: "700", color: LESSON_DONE_TITLE },
  doneReward: { fontSize: 30, fontWeight: "700", color: LESSON_ORANGE },
});
