import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";

import type { BasketStepData } from "../../data/lessons";
import { ECONOMY } from "../../data/economy";
import { usePet } from "../../store/pet";
import { colors, font, radius, space, HIT } from "../../theme";

type Props = {
  data: BasketStepData;
  onDone: () => void;
};

export default function BasketTask({ data, onDone }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const grantJars = usePet((s) => s.grantJars);

  const total = useMemo(
    () =>
      data.items
        .filter((i) => selected.has(i.id))
        .reduce((sum, i) => sum + i.price, 0),
    [data.items, selected],
  );
  const left = data.budget - total;

  const toggle = (id: string, price: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      if (price > left) return prev;
      next.add(id);
      return next;
    });
  };

  const finish = () => {
    const missedRequired = data.items.filter(
      (i) => i.required && !selected.has(i.id),
    ).length;
    if (missedRequired > 0) grantJars({ want: -ECONOMY.mistakePenalty * missedRequired });
    setChecked(true);
  };

  return (
    <View style={styles.root}>
      <View style={styles.budgetRow}>
        <Text style={styles.budgetLabel}>Осталось монет</Text>
        <Text style={[styles.budgetValue, left < 0 && { color: colors.bad }]}>{left}</Text>
      </View>

      <View style={styles.items}>
        {data.items.map((item) => {
          const isSelected = selected.has(item.id);
          const disabled = !isSelected && item.price > left;
          return (
            <Pressable
              key={item.id}
              onPress={() => toggle(item.id, item.price)}
              disabled={checked || (disabled && !isSelected)}
              style={[
                styles.item,
                isSelected && styles.itemSelected,
                disabled && !isSelected && styles.itemDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${item.price} монет`}
            >
              <Text style={[styles.itemTitle, isSelected && styles.itemTitleSelected]}>
                {item.title}
              </Text>
              <View style={styles.itemPrice}>
                <Text style={[styles.itemPriceText, isSelected && styles.itemTitleSelected]}>
                  {item.price}
                </Text>
                {isSelected && <Check size={16} color={colors.surface} strokeWidth={3} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {!checked ? (
        <Pressable style={styles.primaryButton} onPress={finish} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Готово</Text>
        </Pressable>
      ) : (
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

const styles = StyleSheet.create({
  root: { gap: 20, padding: 10 },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.sceneOvalLight,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  budgetLabel: { ...font.body, fontWeight: "700", color: colors.coinWant },
  budgetValue: { ...font.h2, color: colors.coinWant },

  items: { gap: space.sm },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  itemSelected: { backgroundColor: colors.sceneOval },
  itemDisabled: { opacity: 0.4 },
  itemTitle: { ...font.body, fontWeight: "700", color: colors.coinWant },
  itemTitleSelected: { color: colors.surface },
  itemPrice: { flexDirection: "row", alignItems: "center", gap: space.xs },
  itemPriceText: { ...font.body, fontWeight: "700", color: colors.coinWant },

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
    borderWidth: 2,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    padding: space.lg,
    gap: space.md,
  },
  explanationText: { ...font.body, color: colors.coinWant },
});
