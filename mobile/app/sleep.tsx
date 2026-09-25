import { useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PetSleeping } from "../components/pet/PetSleeping";
import BottomNav from "../components/ui/BottomNav";
import RoundImageButton from "../components/ui/RoundImageButton";
import TopHud from "../components/ui/TopHud";
import { usePet } from "../store/pet";
import { colors, space } from "../theme";

const BACKGROUND = require("../assets/sleep/background.png");
const BLANKET_OVERLAY = require("../assets/sleep/blanket-overlay.png");
const SUN = require("../assets/sleep/sun.png");
const MOON = require("../assets/sleep/moon.png");

const PET_WIDTH_PERCENT = 76;
const PET_TOP_PERCENT = 0.353;

const ROUND_BUTTON_SIZE = 88;
const NIGHT_TINT_COLOR = "rgba(24, 34, 92, 0.38)";

export default function SleepScreen() {
  const { width, height } = useWindowDimensions();
  const motion = usePet((s) => s.settings.motion);

  const [asleep, setAsleep] = useState(false);

  const petTop = height * PET_TOP_PERCENT;
  const petWidth = (width * PET_WIDTH_PERCENT) / 100;

  const handleToggle = () => {
    setAsleep((prev) => !prev);
  };

  return (
    <View style={styles.root}>
      <Image
        source={BACKGROUND}
        style={[styles.layer, { width, height }]}
        resizeMode="cover"
      />

      <View
        style={[styles.petSlot, { top: petTop, left: (width - petWidth) / 2 }]}
        pointerEvents="none"
      >
        <PetSleeping widthPercent={PET_WIDTH_PERCENT} animated={motion} asleep={asleep} />
      </View>

      <Image
        source={BLANKET_OVERLAY}
        style={[styles.layer, { width, height }]}
        resizeMode="cover"
      />

      {asleep && (
        <View style={[styles.nightTint, { width, height }]} pointerEvents="none" />
      )}

      <View style={styles.sunButton}>
        <RoundImageButton
          image={asleep ? SUN : MOON}
          iconSize={46}
          onPress={handleToggle}
          accessibilityRole="button"
          accessibilityLabel={asleep ? "Проснуться" : "Уснуть"}
        />
      </View>

      <SafeAreaView style={styles.content} edges={["top"]} pointerEvents="box-none">
        <TopHud />
      </SafeAreaView>

      <SafeAreaView style={styles.navSlot} edges={["bottom"]}>
        <BottomNav />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  layer: { position: "absolute", top: 0, left: 0 },
  petSlot: { position: "absolute" },
  nightTint: { position: "absolute", top: 0, left: 0, backgroundColor: NIGHT_TINT_COLOR },
  content: { flex: 1 },
  sunButton: {
    position: "absolute",
    left: space.lg,
    top: "70%",
    marginTop: -ROUND_BUTTON_SIZE / 2,
  },
  navSlot: { backgroundColor: colors.navActive },
});
