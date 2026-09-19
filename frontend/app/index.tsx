import { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { usePet } from "../store/pet";
import { BigOval, Clouds, Leaves, ONB, SkyBackground } from "../components/onboarding/scene";
import { PillButton } from "../components/onboarding/buttons";

const ANIMALS_WIDTH = 0.92;
const ANIMALS_OVERLAP = 0.04;

export default function StartScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const species = usePet((s) => s.species);
  const petName = usePet((s) => s.name);
  const hasPet = !!species && !!petName;

  const [leaving, setLeaving] = useState(false);
  const fly = useSharedValue(0);

  const animalsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fly.value }],
  }));

  const animalsW = width * ANIMALS_WIDTH;
  const animalsH = (animalsW * 1630) / 1956;
  const animalsTop = height * ONB.ovalLow - animalsH + height * ANIMALS_OVERLAP;

  const start = () => {
    if (leaving) return;
    setLeaving(true);
    fly.value = withTiming(height, {
      duration: ONB.fast,
      easing: Easing.inOut(Easing.quad),
    });
    setTimeout(() => {
      router.replace(hasPet ? "/home" : ("/onboarding/name" as any));
    }, ONB.fast);
  };

  return (
    <View style={styles.root}>
      <SkyBackground />
      <Clouds />
      <BigOval top={ONB.ovalLow} />

      <Animated.Image
        source={require("../assets/items/first-enter/animals.png")}
        style={[
          styles.animals,
          { top: animalsTop, left: (width - animalsW) / 2, width: animalsW, height: animalsH },
          animalsStyle,
        ]}
        resizeMode="contain"
      />

      <Leaves
        source={require("../assets/items/first-enter/coins-and-leaves-start.png")}
        mode={leaving ? "out" : "static"}
      />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View style={styles.buttonSlot}>
          <PillButton label="Старт" onPress={start} disabled={leaving} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ONB.bg },
  animals: { position: "absolute" },
  safe: { flex: 1 },
  buttonSlot: {
    position: "absolute",
    bottom: "22%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
