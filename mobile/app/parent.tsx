import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackHeader from "../components/ui/BackHeader";
import { getPetStage, type PetAgeStage } from "../components/pet/petAssets";
import { LESSONS, getLesson } from "../data/lessons";
import { ECONOMY } from "../data/economy";
import { useLessons } from "../store/lessonsStore";
import { usePet } from "../store/pet";
import { colors, font, radius, space } from "../theme";

type QuestionInfo = { prompt: string; correct: string | null; explanation: string };

const QUESTION_INFO = new Map<string, QuestionInfo>();
LESSONS.forEach((lesson) => {
  lesson.steps.forEach((step) => {
    if (step.kind !== "questions") return;
    step.questions.forEach((q) => {
      let correct: string | null = null;
      if (q.correctIndexes && q.correctIndexes.length > 0) {
        correct = q.correctIndexes.map((i) => q.options[i]).join(" · ");
      } else if (!q.anyCorrect && q.correctIndex !== undefined) {
        correct = q.options[q.correctIndex] ?? null;
      }
      QUESTION_INFO.set(q.id, { prompt: q.prompt, correct, explanation: q.explanation });
    });
  });
});

const STEP_LABEL: Record<string, string> = {
  sort: "Сортировка",
  questions: "Вопросы",
  basket: "Корзина покупок",
  plan: "План бюджета",
};

const STAGE_LABEL: Record<PetAgeStage, string> = {
  mini: "Малыш",
  teen: "Подросток",
  adult: "Взрослый",
};

function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

function generateProblem() {
  const a = Math.floor(Math.random() * 41) + 20;
  const b = Math.floor(Math.random() * 9) + 12;
  const c = Math.floor(Math.random() * 15) + 5;
  return { text: `${a} × ${b} + ${c}`, answer: a * b + c };
}

export default function ParentScreen() {
  const parentBonus = usePet((s) => s.parentBonus);
  const xp = usePet((s) => s.xp);
  const petName = usePet((s) => s.name);
  const history = usePet((s) => s.history);
  const completedLessons = useLessons((s) => s.completedLessons);
  const results = useLessons((s) => s.results);

  const [justGiven, setJustGiven] = useState(false);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

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

  const handleBonus = () => {
    parentBonus();
    setJustGiven(true);
    setTimeout(() => setJustGiven(false), 2000);
  };

  const passed = completedLessons
    .map((id) => getLesson(id))
    .filter((l): l is NonNullable<ReturnType<typeof getLesson>> => Boolean(l))
    .sort((a, b) => a.number - b.number);

  const totalMistakes = passed.reduce(
    (sum, l) => sum + (results[l.id]?.mistakes ?? 0),
    0,
  );

  const keptPeriods = usePet((s) => s.keptPeriods);
  const stage = getPetStage(xp, keptPeriods);
  const nextLevel =
    stage === "mini" ? ECONOMY.teenLevel : stage === "teen" ? ECONOMY.adultLevel : null;
  const prevLevel = stage === "mini" ? 0 : stage === "teen" ? ECONOMY.teenLevel : ECONOMY.adultLevel;
  const toNext = nextLevel === null ? 0 : Math.max(0, nextLevel - xp);
  const periodsNeeded =
    stage === "mini" ? ECONOMY.teenPeriods : stage === "teen" ? ECONOMY.adultPeriods : 0;
  const periodsLeft = Math.max(0, periodsNeeded - keptPeriods);
  const stagePercent =
    nextLevel === null
      ? 100
      : Math.min(100, Math.round(((xp - prevLevel) / (nextLevel - prevLevel)) * 100));

  const lastPeriod = history.length > 0 ? history[history.length - 1] : null;

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

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Родителям</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Бонус за хорошую работу</Text>
            <Text style={styles.cardHint}>
              Начислит ребёнку {ECONOMY.parentBonus} монет. Он сам разложит их по банкам,
              когда будет составлять план бюджета.
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

          <Text style={styles.sectionTitle}>Пройденные уроки</Text>

          {passed.length === 0 ? (
            <View style={styles.statCard}>
              <Text style={styles.statEmpty}>Ребёнок ещё не прошёл ни одного урока.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionHint}>
                {passed.length} из {LESSONS.length}
                {totalMistakes > 0
                  ? ` · ${totalMistakes} ${plural(totalMistakes, ["ошибка", "ошибки", "ошибок"])}`
                  : " · без ошибок"}
              </Text>

              {passed.map((lesson) => {
                const record = results[lesson.id];
                const isOpen = openLessonId === lesson.id;
                const mistakes = record?.mistakes ?? 0;

                return (
                  <View key={lesson.id} style={styles.statCard}>
                    <Pressable
                      style={styles.lessonHeader}
                      onPress={() => setOpenLessonId(isOpen ? null : lesson.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Урок ${lesson.number}. ${lesson.title}`}
                    >
                      <View style={styles.lessonHeaderText}>
                        <Text style={styles.statLabel}>
                          Урок {lesson.number}. {lesson.title}
                        </Text>
                        <Text
                          style={[
                            styles.lessonBadge,
                            { color: mistakes === 0 ? colors.good : colors.warn },
                          ]}
                        >
                          {mistakes === 0
                            ? "без ошибок"
                            : `${mistakes} ${plural(mistakes, ["ошибка", "ошибки", "ошибок"])}`}
                        </Text>
                      </View>
                      {isOpen ? (
                        <ChevronDown size={22} color={colors.coinWant} strokeWidth={2.5} />
                      ) : (
                        <ChevronRight size={22} color={colors.coinWant} strokeWidth={2.5} />
                      )}
                    </Pressable>

                    {isOpen && (
                      <View style={styles.lessonDetail}>
                        <Text style={styles.detailTheme}>{lesson.themeLabel}</Text>

                        {!record ? (
                          <Text style={styles.statEmpty}>
                            Разбор не сохранён — урок пройден до появления статистики.
                          </Text>
                        ) : (
                          <>
                            {record.steps.map((step, i) => (
                              <Text key={i} style={styles.detailRow}>
                                {STEP_LABEL[step.kind] ?? step.kind} —{" "}
                                {step.mistakes === 0
                                  ? "без ошибок"
                                  : `${step.mistakes} ${plural(step.mistakes, [
                                      "ошибка",
                                      "ошибки",
                                      "ошибок",
                                    ])}`}
                              </Text>
                            ))}

                            {record.wrongQuestionIds.length > 0 && (
                              <>
                                <Text style={styles.detailSubtitle}>Ответил неверно:</Text>
                                {record.wrongQuestionIds.map((qid, i) => {
                                  const info = QUESTION_INFO.get(qid);
                                  if (!info) {
                                    return (
                                      <Text key={`${qid}-${i}`} style={styles.detailQuestion}>
                                        • {qid}
                                      </Text>
                                    );
                                  }
                                  return (
                                    <View key={`${qid}-${i}`} style={styles.wrongBlock}>
                                      <Text style={styles.detailQuestion}>• {info.prompt}</Text>
                                      {info.correct && (
                                        <Text style={styles.detailAnswer}>
                                          Верный ответ: {info.correct}
                                        </Text>
                                      )}
                                      <Text style={styles.detailExplain}>{info.explanation}</Text>
                                    </View>
                                  );
                                })}
                              </>
                            )}
                          </>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}

          <Text style={styles.sectionTitle}>Возраст питомца</Text>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>
                {petName ? `${petName} — ${STAGE_LABEL[stage].toLowerCase()}` : STAGE_LABEL[stage]}
              </Text>
              <Text style={styles.statBadge}>
                {passed.length} {plural(passed.length, ["урок", "урока", "уроков"])}
              </Text>
            </View>

            <View style={styles.barTrack}>
              <View
                style={[styles.barFill, { width: `${stagePercent}%`, backgroundColor: colors.good }]}
              />
            </View>

            {nextLevel === null ? (
              <Text style={styles.statDetail}>Питомец вырос полностью.</Text>
            ) : (
              <>
                <Text style={styles.statDetail}>
                  До стадии «{stage === "mini" ? STAGE_LABEL.teen : STAGE_LABEL.adult}» осталось:
                </Text>
                <Text style={styles.growthRow}>
                  {toNext === 0
                    ? "· уроки пройдены"
                    : `· ${toNext} ${plural(toNext, ["урок", "урока", "уроков"])}`}
                </Text>
                <Text style={styles.growthRow}>
                  {periodsLeft === 0
                    ? "· недели по плану прожиты"
                    : `· ${periodsLeft} ${plural(periodsLeft, [
                        "неделя, прожитая по плану",
                        "недели, прожитые по плану",
                        "недель, прожитых по плану",
                      ])}`}
                </Text>
                <Text style={styles.growthHint}>
                  Питомец растёт от пройденных уроков, но одних уроков мало: недели, прожитые по
                  плану, обязательны. Каждая такая неделя вдобавок засчитывается за урок.
                </Text>
                <Text style={styles.growthHint}>
                  Неделя засчитывается, если на «Надо» запланировано не меньше {ECONOMY.minNeed}{" "}
                  монет, к концу недели в «Мечте» осталось не меньше запланированного и сверх плана
                  что-то отложилось. Прожито недель по плану: {keptPeriods}.
                </Text>
              </>
            )}
          </View>

          <Text style={styles.sectionTitle}>Итоги последнего периода</Text>

          {!lastPeriod ? (
            <View style={styles.statCard}>
              <Text style={styles.statEmpty}>
                Первый период ещё не завершён. Итоги появятся, когда придёт новый доход.
              </Text>
            </View>
          ) : (
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Период {lastPeriod.n}</Text>
                <Text
                  style={[
                    styles.statBadge,
                    { color: lastPeriod.kept ? colors.good : colors.warn },
                  ]}
                >
                  {lastPeriod.kept ? "план выполнен" : "план разошёлся с фактом"}
                </Text>
              </View>

              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Надо</Text>
                <Text style={styles.planValue}>
                  план {lastPeriod.plan.need} · потрачено {Math.max(0, lastPeriod.spent.need)}
                </Text>
              </View>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Хочу</Text>
                <Text style={styles.planValue}>
                  план {lastPeriod.plan.want} · потрачено {Math.max(0, lastPeriod.spent.want)}
                </Text>
              </View>
              <View style={styles.planRow}>
                <Text style={styles.planLabel}>Мечта</Text>
                <Text style={styles.planValue}>
                  план {lastPeriod.plan.dream} · отложено {lastPeriod.saved}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  content: { flex: 1 },
  body: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: space.xxl,
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

  sectionTitle: { ...font.h2, fontWeight: "700", color: colors.coinWant, marginBottom: space.xs },
  sectionHint: { ...font.small, color: colors.muted, marginBottom: space.md },

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
    gap: space.sm,
    marginBottom: space.sm,
  },
  statLabel: { ...font.body, color: colors.coinWant, fontWeight: "700", flexShrink: 1 },
  statBadge: { ...font.small, fontWeight: "700", color: colors.muted },
  statEmpty: { ...font.small, color: colors.muted },
  statDetail: { ...font.small, color: colors.coinWant },

  barTrack: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.statNormal,
    overflow: "hidden",
    marginBottom: space.xs,
  },
  barFill: { height: "100%", borderRadius: radius.pill },

  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    minHeight: 48,
  },
  lessonHeaderText: { flex: 1, gap: 2 },
  lessonBadge: { ...font.small, fontWeight: "700" },
  lessonDetail: {
    marginTop: space.sm,
    paddingTop: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.sceneOval,
    gap: 4,
  },
  detailTheme: { ...font.small, color: colors.muted, marginBottom: space.xs },
  detailRow: { ...font.small, color: colors.coinWant },
  detailSubtitle: { ...font.small, color: colors.coinWant, fontWeight: "700", marginTop: space.xs },
  detailQuestion: { ...font.small, color: colors.coinWant },
  detailAnswer: { ...font.small, color: colors.good, fontWeight: "700", marginLeft: space.md },
  detailExplain: { ...font.small, color: colors.muted, marginLeft: space.md },
  wrongBlock: { gap: 2, marginBottom: space.sm },
  growthRow: { ...font.small, color: colors.coinWant, fontWeight: "700" },
  growthHint: { ...font.small, color: colors.muted, marginTop: space.xs },

  planRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    paddingVertical: 2,
  },
  planLabel: { ...font.small, color: colors.coinWant, fontWeight: "700" },
  planValue: { ...font.small, color: colors.muted, flexShrink: 1, textAlign: "right" },
});
