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
import { colors, font, radius, space, HIT } from "../theme";

const STEP = 100;
const MEALS_PER_DAY = 2;
const PERIOD_DAYS = ECONOMY.minNeed / (ECONOMY.mealCost * MEALS_PER_DAY);
const BORDER = 4;

const JAR_INFO = {
  need: {
    title: "Надо",
    text: `Отсюда питомец ест. Он кушает ${MEALS_PER_DAY} раза в день, одно кормление — ${ECONOMY.mealCost} монет. На все ${PERIOD_DAYS} дней нужно ${ECONOMY.minNeed}.`,
  },
  want: {
    title: "Хочу",
    text: "Отсюда покупают вкусняшки и наряды. Можно ничего не покупать и оставить на потом — это не ошибка.",
  },
  dream: {
    title: "Мечта",
    text: "Здесь копятся деньги на большую цель. Чем больше откладываешь, тем ближе она становится.",
  },
} as const;

type JarKey = "need" | "want" | "dream";

export default function PlanScreen() {
  const router = useRouter();

  const unallocated = usePet((s) => s.unallocated);
  const jars = usePet((s) => s.jars);
  const setPlan = usePet((s) => s.setPlan);
  const lastIncomeAt = usePet((s) => s.lastIncomeAt);

  const [draft, setDraft] = useState({ need: 0, want: 0, dream: 0 });
  const [info, setInfo] = useState<JarKey | null>(null);
  const [confirming, setConfirming] = useState(false);

  const editable = unallocated > 0;
  const placed = draft.need + draft.want + draft.dream;
  const left = unallocated - placed;
  const ready = editable && left === 0;

  const shown = {
    need: editable ? draft.need : jars.need,
    want: editable ? draft.want : jars.want,
    dream: editable ? draft.dream : jars.dream,
  };

  const change = (key: JarKey, delta: number) =>
    setDraft((d) => {
      const next = d[key] + delta;
      if (next < 0) return d;
      if (delta > 0 && delta > left) return d;
      return { ...d, [key]: next };
    });

  const days = Math.floor(draft.need / (ECONOMY.mealCost * MEALS_PER_DAY));
  const enoughFood = draft.need >= ECONOMY.minNeed;

  const daysLeft = daysUntilIncome(lastIncomeAt);

  const hint = !editable
    ? daysLeft > 0
      ? `Деньги уже разложены. Новые монеты придут через ${daysLeft} ${dayWord(daysLeft)}.`
      : "Деньги уже разложены. Новые монеты придут совсем скоро."
    : left > 0
      ? `Осталось разложить ${left} монет`
      : enoughFood
        ? "Всё разложено! Можно подтверждать."
        : `На еду отложено ${draft.need}. Этого хватит на ${days} ${dayWord(days)} из ${PERIOD_DAYS}.`;

  const confirm = () => {
    setPlan({ ...draft });
    setConfirming(false);
    router.back();
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
            <Text style={styles.budgetLabel}>Бюджет</Text>
            <Text style={styles.budgetValue}>
              {editable ? left : jars.need + jars.want + jars.dream}
            </Text>
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
            value={shown.need}
            coinStep={STEP}
            canAdd={editable && left >= STEP}
            canRemove={editable && draft.need > 0}
            onAdd={() => change("need", STEP)}
            onRemove={() => change("need", -STEP)}
            onInfo={() => setInfo("need")}
          />
          <JarCard
            title="Хочу"
            color={colors.coinWant}
            background={colors.jarWantBg}
            value={shown.want}
            coinStep={STEP}
            canAdd={editable && left >= STEP}
            canRemove={editable && draft.want > 0}
            onAdd={() => change("want", STEP)}
            onRemove={() => change("want", -STEP)}
            onInfo={() => setInfo("want")}
          />
          <JarCard
            title="Мечта"
            color={colors.coinDream}
            background={colors.jarDreamBg}
            value={shown.dream}
            coinStep={STEP}
            canAdd={editable && left >= STEP}
            canRemove={editable && draft.dream > 0}
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

        {editable && (
          <Pressable
            style={({ pressed }) => [
              styles.confirm,
              !ready && styles.confirmOff,
              pressed && styles.pressed,
            ]}
            onPress={() => setConfirming(true)}
            disabled={!ready}
            accessibilityRole="button"
            accessibilityLabel="Подтвердить распределение"
          >
            <Text style={styles.confirmText}>Подтвердить</Text>
          </Pressable>
        )}
      </SafeAreaView>

      <Modal
        visible={info !== null}
        title={info ? JAR_INFO[info].title : ""}
        text={info ? JAR_INFO[info].text : ""}
        onCancel={() => setInfo(null)}
      />

      <Modal
        visible={confirming}
        title="Разложить так?"
        text={
          enoughFood
            ? `Надо ${draft.need}, Хочу ${draft.want}, Мечта ${draft.dream}. Поменять можно будет, когда придут новые монеты.`
            : `На еду отложено ${draft.need} — хватит на ${days} ${dayWord(days)} из ${PERIOD_DAYS}. Можно оставить так, а можно переложить.`
        }
        confirmLabel="Да, разложить"
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
