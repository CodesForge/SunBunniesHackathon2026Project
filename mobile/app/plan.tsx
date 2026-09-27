import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight, Star } from "lucide-react-native";

import JarCard from "../components/plan/JarCard";
import Modal from "../components/ui/Modal";
import SpeechBubble from "../components/ui/SpeechBubble";
import { daysUntilIncome } from "../lib/time";
import { usePet } from "../store/pet";
import { ECONOMY } from "../data/economy";
import goals from "../data/goals.json";
import { colors, font, radius, space, HIT } from "../theme";

const STEP = 100;
const MEALS_PER_DAY = 2;
const PERIOD_DAYS = ECONOMY.minNeed / (ECONOMY.mealCost * MEALS_PER_DAY);
const MAX_COINS = 12;
const BORDER = 4;

const JAR_INFO = {
  need: {
    title: "Надо",
    text: `Отсюда покупают еду. Питомец кушает ${MEALS_PER_DAY} раза в день, одна порция стоит около ${ECONOMY.mealCost} монет. На все ${PERIOD_DAYS} дней нужно примерно ${ECONOMY.minNeed}.`,
  },
  want: {
    title: "Хочу",
    text: "Отсюда покупают вкусняшки и наряды. Сюда же приходят монетки за пройденные задания. Можно ничего не покупать и оставить на потом — это не ошибка.",
  },
  dream: {
    title: "Мечта",
    text: "Здесь копятся деньги на большую цель. Банка наполняется по мере того, как ты приближаешься к ней.",
  },
} as const;

type JarKey = "need" | "want" | "dream";

export default function PlanScreen() {
  const router = useRouter();

  const jars = usePet((s) => s.jars);
  const unallocated = usePet((s) => s.unallocated);
  const goalId = usePet((s) => s.goalId);
  const lastIncomeAt = usePet((s) => s.lastIncomeAt);
  const setPlan = usePet((s) => s.setPlan);
  const rebalance = usePet((s) => s.rebalance);

  const [draft, setDraft] = useState({ ...jars });
  const [info, setInfo] = useState<JarKey | null>(null);
  const [confirming, setConfirming] = useState(false);

  const planning = unallocated > 0;
  const budget = jars.need + jars.want + jars.dream + unallocated;
  const placed = draft.need + draft.want + draft.dream;
  const left = budget - placed;

  const changed =
    draft.need !== jars.need ||
    draft.want !== jars.want ||
    draft.dream !== jars.dream;
  const ready = left === 0 && changed;

  const goal = goals.find((g) => g.id === goalId) ?? null;
  const dreamStep = goal ? Math.max(1, Math.round(goal.price / MAX_COINS)) : STEP;

  const change = (key: JarKey, delta: number) =>
    setDraft((d) => {
      if (delta > 0 && left < delta) return d;
      if (delta < 0 && d[key] < -delta) return d;
      return { ...d, [key]: d[key] + delta };
    });

  const days = Math.floor(draft.need / (ECONOMY.mealCost * MEALS_PER_DAY));
  const enoughFood = draft.need >= ECONOMY.minNeed;
  const daysLeft = daysUntilIncome(lastIncomeAt);
  const takenFromDream = Math.max(0, jars.dream - draft.dream);

  const hint =
    left > 0
      ? planning
        ? `Осталось разложить ${left} монет`
        : `В руках ${left} монет — разложи их по банкам`
      : !changed
        ? daysLeft > 0
          ? `Монеты разложены. Новые придут через ${daysLeft} ${dayWord(daysLeft)}. Переложить можно в любой момент.`
          : "Монеты разложены. Новые придут совсем скоро."
        : enoughFood
          ? planning
            ? "Всё разложено! Можно подтверждать."
            : "Готово, можно перекладывать."
          : `На еду отложено ${draft.need}. Этого хватит на ${days} ${dayWord(days)} из ${PERIOD_DAYS}.`;

  const confirm = () => {
    if (planning) setPlan({ ...draft });
    else rebalance({ ...draft });
    setConfirming(false);
    router.back();
  };

  const confirmText = () => {
    if (takenFromDream > 0) {
      const restLine = goal
        ? ` До цели «${goal.title}» останется ${Math.max(0, goal.price - draft.dream)} монет.`
        : "";
      return `Ты забираешь из Мечты ${takenFromDream} монет.${restLine} Цель станет дальше, но копить можно снова.`;
    }
    if (!enoughFood) {
      return `На еду отложено ${draft.need} — хватит на ${days} ${dayWord(days)} из ${PERIOD_DAYS}. Можно оставить так, а можно переложить.`;
    }
    return `Надо ${draft.need}, Хочу ${draft.want}, Мечта ${draft.dream}.`;
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerRow}>
            <Pressable
              style={styles.back}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Назад"
            >
              <ChevronLeft size={28} color={colors.navActive} strokeWidth={3.5} />
            </Pressable>

            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>План бюджета</Text>
              <Text style={styles.headerSubtitle}>
                Распределяй деньги на свои цели!
              </Text>
            </View>
          </View>
        </SafeAreaView>

        <Image
          source={require("../assets/plan/boy-peek.png")}
          style={styles.boyPeek}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.budgetRow}>
          <View style={styles.starCircle}>
            <Star
              size={24}
              color={colors.coinDreamBg}
              fill={colors.coinDreamBg}
              strokeWidth={2}
            />
          </View>

          <View style={styles.budgetText}>
            <Text style={styles.budgetLabel}>
              {left > 0 ? "В руках" : "Всего монет"}
            </Text>
            <Text style={styles.budgetValue}>{left > 0 ? left : budget}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.wishes, pressed && styles.pressed]}
            onPress={() => router.push("/goal" as any)}
            accessibilityRole="button"
            accessibilityLabel="Доска желаний"
          >
            <Text style={styles.wishesText}>Доска{"\n"}Желаний</Text>
            <ChevronRight size={22} color={colors.navActive} strokeWidth={3.5} />
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.jars}>
          <JarCard
            title="Надо"
            color={colors.coinNeed}
            background={colors.jarNeedBg}
            value={draft.need}
            coinStep={STEP}
            canAdd={left >= STEP}
            canRemove={draft.need >= STEP}
            onAdd={() => change("need", STEP)}
            onRemove={() => change("need", -STEP)}
            onInfo={() => setInfo("need")}
          />
          <JarCard
            title="Хочу"
            color={colors.coinWant}
            background={colors.jarWantBg}
            value={draft.want}
            coinStep={STEP}
            canAdd={left >= STEP}
            canRemove={draft.want >= STEP}
            onAdd={() => change("want", STEP)}
            onRemove={() => change("want", -STEP)}
            onInfo={() => setInfo("want")}
          />
          <JarCard
            title="Мечта"
            color={colors.coinDream}
            background={colors.jarDreamBg}
            value={draft.dream}
            coinStep={dreamStep}
            canAdd={left >= STEP}
            canRemove={draft.dream >= STEP}
            onAdd={() => change("dream", STEP)}
            onRemove={() => change("dream", -STEP)}
            onInfo={() => setInfo("dream")}
          />
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <View style={styles.bubbleRow}>
          <Image
            source={require("../assets/plan/boy-wave.png")}
            style={styles.boyWave}
            resizeMode="contain"
          />
          <SpeechBubble text={hint} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.confirm,
            !ready && styles.confirmOff,
            pressed && styles.pressed,
          ]}
          onPress={() => setConfirming(true)}
          disabled={!ready}
          accessibilityRole="button"
          accessibilityLabel={
            planning ? "Подтвердить распределение" : "Переложить монеты"
          }
        >
          <Text style={styles.confirmText}>
            {planning ? "Подтвердить" : "Переложить"}
          </Text>
        </Pressable>
      </SafeAreaView>

      <Modal
        visible={info !== null}
        title={info ? JAR_INFO[info].title : ""}
        text={info ? JAR_INFO[info].text : ""}
        onCancel={() => setInfo(null)}
      />

      <Modal
        visible={confirming}
        title={takenFromDream > 0 ? "Точно забрать из Мечты?" : "Разложить так?"}
        text={confirmText()}
        confirmLabel={takenFromDream > 0 ? "Да, забрать" : "Да, разложить"}
        cancelLabel="Ещё подумаю"
        onConfirm={confirm}
        onCancel={() => setConfirming(false)}
      />
    </View>
  );
}

function dayWord(n: number) {
  const last = n % 10;
  const two = n % 100;
  if (two >= 11 && two <= 14) return "дней";
  if (last === 1) return "день";
  if (last >= 2 && last <= 4) return "дня";
  return "дней";
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.accent,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    paddingBottom: space.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    gap: space.md,
  },
  back: {
    width: HIT,
    height: HIT,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: BORDER,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { ...font.h1, color: colors.surface },
  headerSubtitle: {
    ...font.small,
    fontWeight: "700",
    color: colors.surface,
    marginTop: 2,
  },
  boyPeek: {
    position: "absolute",
    right: -8,
    bottom: 0,
    width: 150,
    height: 86,
  },

  body: { flex: 1 },
  bodyContent: { padding: space.lg, gap: space.lg },

  budgetRow: { flexDirection: "row", alignItems: "center", gap: space.md },
  starCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    borderWidth: BORDER,
    borderColor: colors.iconBorder,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  budgetText: { flex: 1 },
  budgetLabel: { ...font.small, fontWeight: "700", color: colors.muted },
  budgetValue: { fontSize: 30, fontWeight: "800", color: colors.ink },
  wishes: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    minHeight: HIT,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: BORDER,
    borderColor: colors.iconBorder,
    backgroundColor: colors.surface,
  },
  wishesText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.navActive,
    textAlign: "center",
  },

  divider: { height: 3, backgroundColor: colors.line, borderRadius: 2 },

  jars: { flexDirection: "row", gap: space.sm, alignItems: "stretch" },

  footer: {
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
    gap: space.lg,
  },
  bubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: space.sm },
  boyWave: { width: 118, height: 98 },

  confirm: {
    minHeight: HIT + 6,
    borderRadius: radius.pill,
    backgroundColor: colors.navActive,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmOff: { opacity: 0.4 },
  confirmText: { fontSize: 20, fontWeight: "800", color: colors.surface },

  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
