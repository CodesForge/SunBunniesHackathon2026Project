import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check, X as XIcon } from "lucide-react-native";

import type { SortStepData } from "../../data/lessons";
import { LESSON_GREEN, LESSON_ORANGE, LESSON_RED, LESSON_TITLE } from "./lessonColors";
import { ECONOMY } from "../../data/economy";
import { usePet } from "../../store/pet";
import { colors, font, radius, HIT } from "../../theme";

type Props = {
  data: SortStepData;
  onDone: () => void;
};

export default function SortTask({ data, onDone }: Props) {
  const [placed, setPlaced] = useState<Record<string, "a" | "b">>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const grantJars = usePet((s) => s.grantJars);

  const remaining = useMemo(
    () => data.cards.filter((c) => !placed[c.id]),
    [data.cards, placed],
  );
  const allPlaced = remaining.length === 0;

  const place = (basket: "a" | "b") => {
    if (!selectedId) return;
    setPlaced((p) => ({ ...p, [selectedId]: basket }));
    setSelectedId(null);
  };

  const cardsInBasket = (basket: "a" | "b") =>
    data.cards.filter((c) => placed[c.id] === basket);

  const check = () => {
    const mistakes = data.cards.filter((c) => placed[c.id] !== c.basket).length;
    if (mistakes > 0) grantJars({ want: -ECONOMY.mistakePenalty * mistakes });
    setChecked(true);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Расставь пункты в правильные колонки</Text>

      <View style={styles.pool}>
        {remaining.length === 0 ? (
          <Text style={styles.poolHint}>Все карточки разложены</Text>
        ) : (
          remaining.map((card) => (
            <Pressable
              key={card.id}
              onPress={() => setSelectedId((id) => (id === card.id ? null : card.id))}
              style={[styles.chip, selectedId === card.id && styles.chipSelected]}
              accessibilityRole="button"
              accessibilityLabel={card.text}
            >
              <Text
                style={[styles.chipText, selectedId === card.id && styles.chipTextSelected]}
              >
                {card.text}
              </Text>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.baskets}>
        {(["a", "b"] as const).map((basket) => {
          const accent = basket === "a" ? colors.sceneOval : LESSON_ORANGE;
          return (
            <Pressable
              key={basket}
              onPress={() => place(basket)}
              disabled={!selectedId}
              style={[styles.basket, { borderColor: accent }, !selectedId && styles.basketDisabled]}
              accessibilityRole="button"
              accessibilityLabel={basket === "a" ? data.basketA : data.basketB}
            >
              <Text style={[styles.basketTitle, { color: accent }]}>
                {basket === "a" ? data.basketA : data.basketB}
              </Text>
              <View style={styles.basketItems}>
                {cardsInBasket(basket).map((c) => (
                  <View key={c.id} style={styles.placedChip}>
                    <Text style={styles.placedChipText}>{c.text}</Text>
                    {checked &&
                      (c.basket === basket ? (
                        <Check size={16} color={LESSON_GREEN} strokeWidth={3} />
                      ) : (
                        <XIcon size={16} color={LESSON_RED} strokeWidth={3} />
                      ))}
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>

      {allPlaced && !checked && (
        <Pressable style={styles.primaryButton} onPress={check} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Проверить</Text>
        </Pressable>
      )}

      {checked && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>{data.explanation}</Text>
          <Pressable style={styles.primaryButton} onPress={onDone} accessibilityRole="button">
            <Text style={styles.primaryButtonText}>Далее</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const CARD_SHADOW = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 4,
} as const;

const styles = StyleSheet.create({
  root: { gap: 20, padding: 10 },
  heading: { ...font.body, fontWeight: "700", color: LESSON_TITLE, fontSize: 20},
  pool: { flexDirection: "row", flexWrap: "wrap", gap: 20 },
  poolHint: { ...font.small, color: colors.muted },
  chip: {
    padding: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...CARD_SHADOW,
  },
  chipSelected: { backgroundColor: colors.sceneOval },
  chipText: { ...font.small, fontWeight: "700", color: LESSON_TITLE },
  chipTextSelected: { color: colors.surface },

  baskets: { flexDirection: "row", gap: 5 },
  basket: {
    flex: 1,
    minHeight: 140,
    borderRadius: radius.md,
    borderWidth: 3,
    backgroundColor: colors.surface,
    padding: 20,
    gap: 30,
  },
  basketDisabled: { opacity: 0.9 },
  basketTitle: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  basketItems: { gap: 20 },
  placedChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 10,
    ...CARD_SHADOW,
  },
  placedChipText: { ...font.small, color: colors.ink, flexShrink: 1 },

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
    borderRadius: radius.md,
    padding: 20,
    gap: 20,
  },
  explanationText: { ...font.body, color: LESSON_TITLE },
});
