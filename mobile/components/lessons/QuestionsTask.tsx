import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check, X as XIcon } from "lucide-react-native";

import type { LessonQuestion, QuestionsStepData } from "../../data/lessons";
import { LESSON_GREEN, LESSON_RED, LESSON_RED_BG, LESSON_TITLE } from "./lessonColors";
import { ECONOMY } from "../../data/economy";
import { usePet } from "../../store/pet";
import { colors, font, radius, HIT } from "../../theme";

type Props = {
  data: QuestionsStepData;
  onDone: () => void;
};

function resolveDynamicOptionIndex(
  question: LessonQuestion,
  history: { spent: { need: number; want: number; dream: number } }[],
): number {
  const last = history[history.length - 1];
  if (!last) return 1;
  const { need, want, dream } = last.spent;
  const max = Math.max(need, want, dream);
  if (dream === max) return 2;
  if (want === max) return 1;
  return 0;
}

export default function QuestionsTask({ data, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const history = usePet((s) => s.history);
  const grantJars = usePet((s) => s.grantJars);

  const question = data.questions[index];
  const total = data.questions.length;

  const dynamicCorrectIndex = useMemo(() => {
    if (question.dynamic === "topCategory") return resolveDynamicOptionIndex(question, history);
    return null;
  }, [question, history]);

  const isCorrect = (optionIndex: number) => {
    if (question.anyCorrect) return true;
    if (question.correctIndexes) return question.correctIndexes.includes(optionIndex);
    if (dynamicCorrectIndex !== null) return optionIndex === dynamicCorrectIndex;
    return optionIndex === (question.correctIndex ?? 0);
  };

  const selectOption = (optionIndex: number) => {
    if (answeredIndex !== null) return;
    setAnsweredIndex(optionIndex);
    const delta = question.optionsCoinsDelta?.[optionIndex];
    if (delta) {
      grantJars({ want: delta });
    } else if (!isCorrect(optionIndex)) {
      grantJars({ want: -ECONOMY.mistakePenalty });
    }
  };

  const next = () => {
    setAnsweredIndex(null);
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      onDone();
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.counter}>
        Вопрос {index + 1} из {total}
      </Text>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <View style={styles.options}>
        {question.options.map((option, i) => {
          const answered = answeredIndex !== null;
          const selected = answeredIndex === i;
          const showState = answered && (selected || isCorrect(i));
          return (
            <Pressable
              key={i}
              onPress={() => selectOption(i)}
              disabled={answered}
              style={[
                styles.option,
                selected && (isCorrect(i) ? styles.optionCorrect : styles.optionWrong),
                answered && !selected && isCorrect(i) && styles.optionCorrectHint,
              ]}
              accessibilityRole="button"
              accessibilityLabel={option}
            >
              <Text style={styles.optionText}>{option}</Text>
              {showState &&
                (isCorrect(i) ? (
                  <Check size={18} color={LESSON_GREEN} strokeWidth={3} />
                ) : (
                  <XIcon size={18} color={LESSON_RED} strokeWidth={3} />
                ))}
            </Pressable>
          );
        })}
      </View>

      {answeredIndex !== null && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>{question.explanation}</Text>
          <Pressable style={styles.primaryButton} onPress={next} accessibilityRole="button">
            <Text style={styles.primaryButtonText}>
              {index + 1 < total ? "Далее" : "Завершить"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 20, padding: 10 },
  counter: { ...font.small, fontWeight: "700", color: colors.muted },
  prompt: { fontSize: 20, fontWeight: "700", color: LESSON_TITLE },

  options: { gap: 15 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  optionCorrect: { backgroundColor: colors.surface, borderColor: LESSON_GREEN },
  optionCorrectHint: { borderColor: LESSON_GREEN },
  optionWrong: { backgroundColor: LESSON_RED_BG, borderColor: LESSON_RED },
  optionText: { ...font.body, color: LESSON_TITLE, fontWeight: "700", flexShrink: 1 },

  primaryButton: {
    minHeight: HIT,
    borderRadius: radius.pill,
    backgroundColor: colors.sceneOval,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { ...font.body, fontWeight: "700", color: colors.surface },

  explanationCard: {
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.sceneOval,
    borderRadius: radius.lg,
    padding: 20,
    gap: 16,
  },
  explanationText: { ...font.body, color: LESSON_TITLE },
});
