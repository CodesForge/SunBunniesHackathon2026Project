import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="parent" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="technical" options={{ animation: "slide_from_right" }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
