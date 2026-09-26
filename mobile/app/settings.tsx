import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PurpleSwitch from "../components/ui/PurpleSwitch";
import RoundIconButton from "../components/ui/RoundIconButton";
import { usePet } from "../store/pet";
import { colors, font, radius, space } from "../theme";

export default function SettingsScreen() {
  const router = useRouter();
  const motion = usePet((s) => s.settings.motion);
  const setSetting = usePet((s) => s.setSetting);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <View style={styles.backSlot}>
            <Link href={"/home" as any} asChild>
              <RoundIconButton icon={ArrowLeft} accessibilityRole="button" accessibilityLabel="Назад" />
            </Link>
          </View>
          <Text style={styles.title}>Настройки</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Отключить анимации</Text>
              <Text style={styles.rowSubtitle}>Питомец будет двигаться в статичном режиме</Text>
            </View>
            <PurpleSwitch
              value={!motion}
              onValueChange={(v) => setSetting("motion", !v)}
              accessibilityLabel="Отключить анимации"
            />
          </View>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/parent" as any)}
            accessibilityRole="button"
            accessibilityLabel="Вход для родителей"
          >
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Вход для родителей</Text>
              <Text style={styles.rowSubtitle}>Управление аккаунтом, детскими настройками и прогрессом</Text>
            </View>
            <ChevronRight size={22} color={colors.coinWant} strokeWidth={2.5} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  content: { flex: 1 },

  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: space.sm,
    paddingBottom: space.md,
  },
  backSlot: {
    position: "absolute",
    left: space.lg,
    top: space.sm,
    zIndex: 1,
  },
  title: { ...font.h1, fontWeight: "700", color: colors.coinWant, textAlign: "center" },

  body: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: space.xl,
    paddingTop: space.xxl + space.lg,
    gap: space.md,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.sceneOval,
    borderRadius: radius.md,
    padding: space.lg,
    gap: space.md,
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { ...font.body, color: colors.coinWant, fontWeight: "700" },
  rowSubtitle: { ...font.small, color: colors.muted },
});
