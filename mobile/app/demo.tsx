import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AdultGate from "../components/ui/AdultGate";
import { getPetStage, type PetAgeStage } from "../components/pet/petAssets";
import BackHeader from "../components/ui/BackHeader";
import Modal from "../components/ui/Modal";
import PurpleSwitch from "../components/ui/PurpleSwitch";
import { ECONOMY } from "../data/economy";
import { useLessons } from "../store/lessonsStore";
import { usePet } from "../store/pet";
import { colors, font, radius, space, HIT } from "../theme";

const STAGE_LABEL: Record<PetAgeStage, string> = {
  mini: "Малыш",
  teen: "Подросток",
  adult: "Взрослый",
};

export default function DemoScreen() {
  const demoMode = usePet((s) => s.demoMode);
  const toggleDemo = usePet((s) => s.toggleDemo);
  const periodIndex = usePet((s) => s.periodIndex);
  const xp = usePet((s) => s.xp);
  const keptPeriods = usePet((s) => s.keptPeriods);
  const nextPeriod = usePet((s) => s.nextPeriod);
  const grantJars = usePet((s) => s.grantJars);
  const growPet = usePet((s) => s.growPet);
  const resetPet = usePet((s) => s.reset);
  const resetLessons = useLessons((s) => s.reset);

  const [confirmingReset, setConfirmingReset] = useState(false);
  const stage = getPetStage(xp, keptPeriods);

  const handleReset = () => {
    resetPet();
    resetLessons();
    setConfirmingReset(false);
  };

  return (
    <AdultGate backHref="/settings" title="Демо-режим">
      <View style={styles.root}>
        <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
          <BackHeader backHref="/settings" />

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Демо-режим</Text>

            <View style={styles.card}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Демо-режим</Text>
                <PurpleSwitch
                  value={demoMode}
                  onValueChange={toggleDemo}
                  accessibilityLabel="Демо-режим"
                />
              </View>
              <Text style={styles.cardHint}>
                Открывает сразу все уроки, мгновенно восстанавливает энергию во сне и позволяет
                перематывать игровые периоды.
              </Text>
              <Text style={styles.periodLine}>
                Период {periodIndex} из {ECONOMY.demoPeriods}
              </Text>
              <Text style={styles.periodLine}>Питомец: {STAGE_LABEL[stage]}</Text>
            </View>

            {demoMode && (
              <View style={styles.actions}>
                <Pressable
                  style={styles.actionButton}
                  onPress={nextPeriod}
                  accessibilityRole="button"
                  accessibilityLabel="Следующий период"
                >
                  <Text style={styles.actionButtonText}>Следующий период</Text>
                </Pressable>

                <Pressable
                  style={styles.actionButton}
                  onPress={() => grantJars({ want: ECONOMY.demoCoinGrant })}
                  accessibilityRole="button"
                  accessibilityLabel={`Начислить ${ECONOMY.demoCoinGrant} монет`}
                >
                  <Text style={styles.actionButtonText}>
                    Начислить {ECONOMY.demoCoinGrant} монет
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.actionButton}
                  onPress={growPet}
                  accessibilityRole="button"
                  accessibilityLabel="Вырастить питомца"
                >
                  <Text style={styles.actionButtonText}>Вырастить питомца</Text>
                </Pressable>

                <Pressable
                  style={styles.dangerButton}
                  onPress={() => setConfirmingReset(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Сбросить профиль"
                >
                  <Text style={styles.dangerButtonText}>Сбросить профиль</Text>
                </Pressable>
              </View>
            )}

            {demoMode && <Text style={styles.statusLine}>Все уроки открыты</Text>}
          </ScrollView>
        </SafeAreaView>
      </View>

      <Modal
        visible={confirmingReset}
        title="Сбросить профиль?"
        text="Весь прогресс, монеты и пройденные уроки будут удалены без возможности отменить это."
        confirmLabel="Сбросить"
        cancelLabel="Отмена"
        onConfirm={handleReset}
        onCancel={() => setConfirmingReset(false)}
      />
    </AdultGate>
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
    gap: space.lg,
  },
  title: { ...font.h1, fontWeight: "700", color: colors.coinWant, marginBottom: space.sm },

  card: {
    backgroundColor: colors.sceneOvalLight,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    padding: space.lg,
    gap: space.sm,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: { ...font.body, fontWeight: "700", color: colors.coinWant },
  cardHint: { ...font.small, color: colors.coinWant },
  periodLine: { ...font.small, fontWeight: "700", color: colors.coinWant },

  actions: { gap: space.md },
  actionButton: {
    minHeight: HIT,
    backgroundColor: colors.sceneOval,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  actionButtonText: { ...font.body, fontWeight: "700", color: colors.surface },
  dangerButton: {
    minHeight: HIT,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.bad,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  dangerButtonText: { ...font.body, fontWeight: "700", color: colors.bad },

  statusLine: { ...font.small, fontWeight: "700", color: colors.good, textAlign: "center" },
});
