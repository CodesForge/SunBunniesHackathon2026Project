import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SECTION_PALETTE } from "../components/lessons/lessonColors";
import BackHeader from "../components/ui/BackHeader";
import GLOSSARY from "../data/glossary.json";
import type { LessonSection } from "../data/lessons";
import { colors, font, radius, space } from "../theme";

const CONTENT_MAX_WIDTH = 480;

export default function TermsScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
        <BackHeader backHref="/glossary" />
        <Text style={styles.screenTitle}>Словарь</Text>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {GLOSSARY.map((group) => {
            const palette = SECTION_PALETTE[group.section as LessonSection];

            return (
              <View key={group.section} style={styles.group}>
                <View style={[styles.groupHeader, { backgroundColor: palette.header }]}>
                  <Text style={[styles.groupTitle, { color: palette.title }]}>{group.title}</Text>
                </View>

                {group.terms.map((item) => (
                  <View key={item.term} style={styles.card}>
                    <View style={styles.cardHead}>
                      <Text style={styles.term}>{item.term}</Text>
                      <Text style={styles.lessonRef}>Урок {item.lesson}</Text>
                    </View>
                    <Text style={styles.definition}>{item.text}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  content: { flex: 1 },

  screenTitle: {
    ...font.h1,
    fontWeight: "700",
    color: colors.coinWant,
    textAlign: "center",
    marginTop: space.sm,
  },

  body: {
    width: "100%",
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.xxl,
    gap: space.lg,
  },

  group: { gap: space.sm },
  groupHeader: {
    borderRadius: radius.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  groupTitle: { ...font.body, fontWeight: "800" },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    padding: space.md,
    gap: 4,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
  },
  term: { ...font.body, fontWeight: "700", color: colors.coinWant, flexShrink: 1 },
  lessonRef: { ...font.small, color: colors.muted },
  definition: { ...font.small, color: colors.muted },
});
