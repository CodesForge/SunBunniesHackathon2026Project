import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePet } from "../store/pet";
import { fullness } from "../lib/time";
import { PetIdle } from "../components/pet/PetIdle";
import type { MouthKey } from "../components/pet/petAssets";
import TopHud from "../components/ui/TopHud";
import BottomNav from "../components/ui/BottomNav";
import { colors } from "../theme";

const PET_LIFT = 28;

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();

  const lastFedAt = usePet((s) => s.lastFedAt);
  const motion = usePet((s) => s.settings.motion);

  const full = fullness(lastFedAt);
  const mouth: MouthKey = full >= 60 ? "happy" : full >= 25 ? "neutral" : "sad";

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/bg/bg-main.jpg")}
        style={[styles.bg, { width, height }]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.content} edges={["top"]}>
        <TopHud />

        <View style={styles.petSlot} pointerEvents="none">
          <PetIdle
            species="cat"
            widthPercent={65}
            mouth={mouth}
            animated={motion}
          />
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.navSlot} edges={["bottom"]}>
        <BottomNav />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  bg: { position: "absolute", top: 0, left: 0 },
  content: { flex: 1 },
  petSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: PET_LIFT,
  },
  navSlot: { backgroundColor: colors.navActive },
});
