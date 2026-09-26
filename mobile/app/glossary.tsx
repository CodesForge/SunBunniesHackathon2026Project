import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChestNode from "../components/lessons/ChestNode";
import ChestRewardModal from "../components/lessons/ChestRewardModal";
import { LESSON_BG, LESSON_TITLE, SECTION_PALETTE } from "../components/lessons/lessonColors";
import LessonCoin from "../components/lessons/LessonCoin";
import PetGrewModal from "../components/lessons/PetGrewModal";
import PetMarker from "../components/lessons/PetMarker";
import BottomNav from "../components/ui/BottomNav";
import TopHud from "../components/ui/TopHud";
import {
  LESSON_SECTIONS,
  LESSONS,
  sectionForLesson,
  waveForLesson,
  type LessonSection,
} from "../data/lessons";
import { isLessonUnlocked, useLessons } from "../store/lessonsStore";
import { colors, radius, space } from "../theme";

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
        <TopHud showChatBubble={false} showStats={false} showChat={false} showWallet={false} />

        <View style={styles.dailyBanner}>
          <Text style={styles.dailyTitle}>Урок дня</Text>
          <Pressable
            style={styles.dailyButton}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Урок дня"
          >
            <ChevronRight size={20} color={colors.sceneOval} strokeWidth={3} />
          </Pressable>
        </View>

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

      <ChestRewardModal visible={rewardWave !== null} onClose={() => setRewardWave(null)} />
      <PetGrewModal
        visible={pendingPetGrowth && rewardWave === null}
        onClose={dismissPetGrowth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface, padding: 10},
  content: { flex: 1 },
  navSlot: { backgroundColor: colors.navActive },

  dailyBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    backgroundColor: LESSON_BG,
    borderRadius: radius.lg,
    borderWidth: 5,
    borderColor: colors.sceneOval,
    marginVertical: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  dailyTitle: { fontSize: 20, fontWeight: "600", color: LESSON_TITLE, marginLeft: 5 },
  dailyButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: { paddingTop: 5, paddingBottom: 60 },
  pathOuter: {
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 5,
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
