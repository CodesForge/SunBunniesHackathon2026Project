import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePet } from "../store/pet";
import { energyNow, fullness } from "../lib/time";
import { PetMini } from "../components/pet/PetMini";
import { getPetStage, type MouthKey } from "../components/pet/petAssets";
import TopHud from "../components/ui/TopHud";
import BottomNav from "../components/ui/BottomNav";
import { resolveWornVisuals } from "../data/wardrobe";
import { colors } from "../theme";

const PET_LIFT = 28;

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();

  const lastFedAt = usePet((s) => s.lastFedAt);
  const energyBase = usePet((s) => s.energyBase);
  const energyAt = usePet((s) => s.energyAt);
  const asleep = usePet((s) => s.asleep);
  const motion = usePet((s) => s.settings.motion);
  const xp = usePet((s) => s.xp);
  const worn = usePet((s) => s.worn);

  const worst = Math.min(
    fullness(lastFedAt),
    energyNow(energyBase, energyAt, asleep),
  );
  const mouth: MouthKey = worst >= 60 ? "happy" : worst >= 25 ? "neutral" : "sad";

  const keptPeriods = usePet((s) => s.keptPeriods);
  const stage = getPetStage(xp, keptPeriods);
  const { bodyWear, outfit, headWear } = resolveWornVisuals(worn, stage);

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
          <PetMini
            species="cat"
            widthPercent={78}
            mouth={mouth}
            animated={motion}
            bodyWear={bodyWear}
            outfit={outfit}
            headWear={headWear}
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
