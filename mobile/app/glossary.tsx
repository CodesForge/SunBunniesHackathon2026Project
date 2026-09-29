import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChestNode from "../components/lessons/ChestNode";
import ChestRewardModal from "../components/lessons/ChestRewardModal";
import { SECTION_PALETTE } from "../components/lessons/lessonColors";
import LessonCoin from "../components/lessons/LessonCoin";
import PetGrewModal from "../components/lessons/PetGrewModal";
import PetMarker from "../components/lessons/PetMarker";
import BottomNav from "../components/ui/BottomNav";
import Modal from "../components/ui/Modal";
import TopHud from "../components/ui/TopHud";
import {
  LESSON_SECTIONS,
  LESSONS,
  sectionForLesson,
  waveForLesson,
  type LessonSection,
} from "../data/lessons";
import { ECONOMY } from "../data/economy";
import { energyNow, minutesToFull } from "../lib/time";
import { isLessonUnlocked, useLessons } from "../store/lessonsStore";
import { usePet } from "../store/pet";
import { colors, font, radius, space } from "../theme";

const ENERGY_TICK_MS = 15000;

const COL_CYCLE = [1, 0, 1, 2];
const ALIGN_FOR_COL = ["flex-start", "center", "flex-end"] as const;
const CONTENT_MAX_WIDTH = 480;

type Row =
  | { kind: "lesson"; number: number; align: (typeof ALIGN_FOR_COL)[number] }
  | { kind: "chest"; wave: number };

type Block =
  | { kind: "band"; section: LessonSection; rows: Row[] }
  | { kind: "chest"; wave: number };

function buildBlocks(): Block[] {
  const sectionRows = new Map<LessonSection, Row[]>();
  let colCycleIndex = 0;
  let activeSection: LessonSection | null = null;

  LESSONS.forEach((lesson) => {
    const section = sectionForLesson(lesson.number);
    if (section !== activeSection) {
      activeSection = section;
      colCycleIndex = 0;
    }
    const align = ALIGN_FOR_COL[COL_CYCLE[colCycleIndex % COL_CYCLE.length]];
    colCycleIndex += 1;

    const rows = sectionRows.get(section) ?? [];
    rows.push({ kind: "lesson", number: lesson.number, align });

    const isSectionEnd = lesson.number === LESSON_SECTIONS[section].range[1];
    if (isSectionEnd) {
      rows.push({ kind: "chest", wave: waveForLesson(lesson.number) });
    }
    sectionRows.set(section, rows);
  });

  const sectionKeys = (Object.keys(LESSON_SECTIONS).map(Number) as LessonSection[]).sort(
    (a, b) => a - b,
  );

  const blocks: Block[] = [];
  sectionKeys.forEach((section) => {
    const rows = sectionRows.get(section) ?? [];
    const last = rows[rows.length - 1];
    const bandRows = last?.kind === "chest" ? rows.slice(0, -1) : rows;
    blocks.push({ kind: "band", section, rows: bandRows });
    if (last?.kind === "chest") {
      blocks.push({ kind: "chest", wave: last.wave });
    }
  });

  return blocks;
}

const BLOCKS = buildBlocks();

export default function GlossaryScreen() {
  const router = useRouter();

  const completedLessons = useLessons((s) => s.completedLessons);
  const chestsOpened = useLessons((s) => s.chestsOpened);
  const pendingChest = useLessons((s) => s.pendingChest);
  const pendingPetGrowth = useLessons((s) => s.pendingPetGrowth);
  const openChest = useLessons((s) => s.openChest);
  const dismissPetGrowth = useLessons((s) => s.dismissPetGrowth);

  const [rewardWave, setRewardWave] = useState<number | null>(null);
  const [tiredAsked, setTiredAsked] = useState(false);
  const [, setTick] = useState(0);

  const petName = usePet((s) => s.name);
  const energyBase = usePet((s) => s.energyBase);
  const energyAt = usePet((s) => s.energyAt);
  const asleep = usePet((s) => s.asleep);

  useEffect(() => {
    if (!asleep) return;
    const id = setInterval(() => setTick((n) => n + 1), ENERGY_TICK_MS);
    return () => clearInterval(id);
  }, [asleep]);

  const energy = energyNow(energyBase, energyAt, asleep);
  const minutesLeft = minutesToFull(energyBase, energyAt, asleep);
  const tooTired = energy < ECONOMY.lessonEnergyMin;

  const lessonState = (number: number): "locked" | "current" | "done" => {
    const id = `l${number}`;
    if (completedLessons.includes(id)) return "done";
    if (isLessonUnlocked(number, completedLessons)) return "current";
    return "locked";
  };

  const chestState = (wave: number): "locked" | "ready" | "opened" => {
    if (chestsOpened.includes(wave)) return "opened";
    if (pendingChest === wave) return "ready";
    return "locked";
  };

  const openLesson = (number: number) => {
    if (lessonState(number) === "locked") return;
    if (asleep || tooTired) {
      setTiredAsked(true);
      return;
    }
    router.push(`/lesson/l${number}` as any);
  };

  const tapChest = (wave: number) => {
    if (chestState(wave) !== "ready") return;
    openChest(wave);
    setRewardWave(wave);
  };

  const renderChestRow = (wave: number) => (
    <View key={`chest${wave}`} style={styles.chestRow}>
      <ChestNode state={chestState(wave)} onPress={() => tapChest(wave)} />
    </View>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.content} edges={["top"]}>
        <TopHud showStats={false} showChat={false} showWallet={false} />

        <Pressable
          style={[styles.banner, { backgroundColor: colors.coinWant }]}
          onPress={() => router.push("/daily-lesson" as any)}
          accessibilityRole="button"
          accessibilityLabel="Урок дня"
        >
          <View style={[styles.bannerInner, { backgroundColor: colors.pillBorder }]}>
            <Text style={styles.bannerTitle}>Урок дня</Text>
            <View style={styles.bannerDivider} />
            <ChevronRight size={24} color={colors.surface} strokeWidth={3} />
          </View>
        </Pressable>

        <Pressable
          style={[styles.banner, styles.termsBanner, { backgroundColor: colors.coinDream }]}
          onPress={() => router.push("/terms" as any)}
          accessibilityRole="button"
          accessibilityLabel="Словарь"
        >
          <View style={[styles.bannerInner, { backgroundColor: colors.coinDreamBg }]}>
            <Text style={styles.bannerTitle}>Словарь</Text>
            <View style={styles.bannerDivider} />
            <BookOpen size={24} color={colors.surface} strokeWidth={3} />
          </View>
        </Pressable>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.pathOuter}>
            {BLOCKS.map((block) => {
              if (block.kind === "chest") return renderChestRow(block.wave);

              const palette = SECTION_PALETTE[block.section];
              return (
                <View key={`band${block.section}`} style={styles.bandOuter}>
                  <View style={[styles.bandHeader, { backgroundColor: palette.header }]}>
                    <Text style={[styles.bandTitle, { color: palette.title }]}>
                      {LESSON_SECTIONS[block.section].title}
                    </Text>
                  </View>
                  <View style={[styles.bandBody, { backgroundColor: palette.body }]}>
                    {block.rows.map((row) =>
                      row.kind === "chest" ? (
                        renderChestRow(row.wave)
                      ) : (
                        <View
                          key={`l${row.number}`}
                          style={[styles.coinRow, { justifyContent: row.align }]}
                        >
                          <View style={styles.coinCell}>
                            {lessonState(row.number) === "current" && (
                              <View style={styles.petWrap} pointerEvents="none">
                                <PetMarker />
                              </View>
                            )}
                            <LessonCoin
                              state={lessonState(row.number)}
                              label={`Урок ${row.number}`}
                              onPress={() => openLesson(row.number)}
                            />
                          </View>
                        </View>
                      ),
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      <SafeAreaView style={styles.navSlot} edges={["bottom"]}>
        <BottomNav />
      </SafeAreaView>

      <Modal
        visible={tiredAsked}
        title={
          asleep
            ? `${petName || "Питомец"} спит`
            : `${petName || "Питомец"} совсем сонный`
        }
        text={
          asleep
            ? minutesLeft > 0
              ? `Пусть отдохнёт ещё ${minutesLeft} мин. — и снова возьмётесь за уроки вместе.`
              : "Он уже выспался, можно будить и продолжать."
            : "Он старался вместе с тобой и устал. Уложи его спать — и вернётесь к урокам отдохнувшими."
        }
        confirmLabel={asleep ? "Посмотреть" : "Уложить спать"}
        cancelLabel="Позже"
        onConfirm={() => {
          setTiredAsked(false);
          router.push("/sleep" as any);
        }}
        onCancel={() => setTiredAsked(false)}
      />

      <ChestRewardModal visible={rewardWave !== null} onClose={() => setRewardWave(null)} />
      <PetGrewModal
        visible={pendingPetGrowth && rewardWave === null}
        onClose={dismissPetGrowth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1 },
  navSlot: { backgroundColor: colors.navActive },

  banner: {
    width: "90%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    borderRadius: radius.lg,
    marginVertical: 10,
  },
  bannerInner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    marginBottom: 6,
  },
  bannerTitle: { ...font.body, flex: 1, color: colors.surface, fontWeight: "800" },
  bannerDivider: {
    width: 2,
    height: 28,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: space.md,
  },
  termsBanner: { marginTop: 0 },

  scrollContent: { paddingTop: 5, paddingBottom: 60 },
  pathOuter: {
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: space.lg,
  },

  bandOuter: {
    marginTop: 20,
    flexDirection: "column",
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  bandHeader: {
    justifyContent: "center",
    padding: 20,
  },
  bandBody: {},
  bandTitle: { fontSize: 20, fontWeight: "600" },

  coinRow: {
    flexDirection: "row",
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
  },
  coinCell: { alignItems: "center" },
  petWrap: { marginBottom: 4, alignItems: "center" },

  chestRow: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
});
