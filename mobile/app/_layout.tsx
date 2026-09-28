import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ReduceMotion, ReducedMotionConfig } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useMotion } from "../lib/useMotion";
import { usePeriodIncome } from "../lib/usePeriodIncome";

export default function RootLayout() {
  usePeriodIncome();
  const motion = useMotion();

  // Когда анимации выключены, reanimated сразу ставит конечное значение
  // вместо проигрывания, а экраны перестают выезжать.
  const screenAnimation = motion ? "slide_from_right" : "none";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReducedMotionConfig mode={motion ? ReduceMotion.System : ReduceMotion.Always} />
      <SafeAreaProvider>
        <Stack
          screenOptions={{ headerShown: false, animation: motion ? "default" : "none" }}
          initialRouteName="index"
        >
          <Stack.Screen name="settings" options={{ animation: screenAnimation }} />
          <Stack.Screen name="parent" options={{ animation: screenAnimation }} />
          <Stack.Screen name="lesson/[id]" options={{ animation: screenAnimation }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
