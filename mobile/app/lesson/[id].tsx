import { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BackHeader from "../../components/ui/BackHeader";
import BasketTask from "../../components/lessons/BasketTask";
import PlanTask from "../../components/lessons/PlanTask";
import QuestionsTask from "../../components/lessons/QuestionsTask";
import SortTask from "../../components/lessons/SortTask";
import { getLesson } from "../../data/lessons";
import {
  LESSON_BODY_TEXT,
  LESSON_DONE_TITLE,
  LESSON_ORANGE,
  LESSON_TITLE,
} from "../../components/lessons/lessonColors";
import { useLessons, type LessonResult } from "../../store/lessonsStore";
import { colors, font, radius, space, HIT } from "../../theme";

type Phase = "intro" | number | "done";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const completeLesson = useLessons((s) => s.completeLesson);

  const lesson = getLesson(String(id));
  const [phase, setPhase] = useState<Phase>("intro");
  const [result, setResult] = useState<LessonResult | null>(null);

  const mistakesTotal = useRef(0);
  const wrongQuestionIds = useRef<string[]>([]);
  const stepResults = useRef<{ kind: string; mistakes: number }[]>([]);

  if (!lesson) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
          <BackHeader backHref="/glossary" />
          <View style={styles.body}>
            <Text style={styles.title}>Урок не найден</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const finishLesson = () => {
    const awarded = completeLesson(lesson.id, mistakesTotal.current, {
      wrongQuestionIds: wrongQuestionIds.current,
      steps: stepResults.current,
    });
    setResult(awarded);
    setPhase("done");
  };

  const goNextStep = (mistakes = 0, wrongIds?: string[]) => {
    const current = typeof phase === "number" ? phase : -1;

    if (current >= 0) {
      stepResults.current.push({ kind: lesson.steps[current].kind, mistakes });
      mistakesTotal.current += mistakes;
      if (wrongIds?.length) wrongQuestionIds.current.push(...wrongIds);
    }

    if (current + 1 < lesson.steps.length) {
      setPhase(current + 1);
    } else {
      finishLesson();
    }
  };

  return (
    <View style={[styles.root, phase === "done" && styles.rootDone]}>
      <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
        <BackHeader backHref="/glossary" />

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {phase === "intro" && (
            <>
              <Text style={styles.eyebrow}>{lesson.themeLabel}</Text>
              <Text style={styles.title}>{lesson.title}</Text>
              {lesson.story.map((p, i) => (
                <Text key={i} style={styles.paragraph}>
                  {p}
                </Text>
              ))}
              <Pressable
                style={styles.primaryButton}
                onPress={() => setPhase(0)}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Начать</Text>
              </Pressable>
            </>
          )}

          {typeof phase === "number" &&
            (() => {
              const step = lesson.steps[phase];
              if (step.kind === "sort") return <SortTask data={step} onDone={goNextStep} />;
              if (step.kind === "basket") return <BasketTask data={step} onDone={goNextStep} />;
              if (step.kind === "questions")
                return <QuestionsTask data={step} onDone={goNextStep} />;
              return <PlanTask onDone={goNextStep} />;
            })()}

          {phase === "done" && (
            <View style={styles.doneCard}>
              <Text style={styles.doneTitle}>Урок пройден!</Text>
              <Text style={styles.doneReward}>+{result?.reward ?? lesson.reward} монет</Text>
              {result?.reward === 0 && (
                <Text style={styles.doneNote}>
                  Этот урок уже проходили — монеты за него начисляются один раз.
                </Text>
              )}
              <Pressable
                style={[styles.primaryButton, styles.doneButton]}
                onPress={() => router.back()}
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Вернуться на карту</Text>
              </Pressable>
            </View>
            
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sceneOvalLight },
  rootDone: { backgroundColor: colors.surface },
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
  paragraph: { ...font.body, color: LESSON_BODY_TEXT, marginBottom: space.lg },

  primaryButton: {
    minHeight: HIT,
    borderRadius: radius.pill,
    backgroundColor: colors.sceneOval,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  primaryButtonText: { ...font.body, fontWeight: "600", color: colors.surface },
  doneButton: { paddingHorizontal: 20 },

  doneCard: {
    marginTop: 50,
    backgroundColor: colors.sceneOvalLight,
    borderWidth: 3,
    borderColor: colors.sceneOval,
    borderRadius: radius.lg,
    padding: 20,
    alignItems: "center",
    gap: 20,
  },
  doneTitle: { fontSize: 20, fontWeight: 700, color: LESSON_DONE_TITLE },
  doneReward: { fontSize: 30, fontWeight: 700, color: LESSON_ORANGE },
  doneNote: { ...font.small, color: LESSON_BODY_TEXT, textAlign: "center" },
});
