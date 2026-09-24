import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "../../components/ui/BottomNav";
import TopHud from "../../components/ui/TopHud";
import { colors } from "../../theme";

const BACKGROUND = require("../../assets/shops/background.png");
const FOOD_BUTTON = require("../../assets/shops/dining-button.png");
const WARDROBE_BUTTON = require("../../assets/shops/wardrobe-button.png");
const BUSHES = require("../../assets/shops/bushes.png");

// Пока просто картинки без нажатий — кнопки для переходов в магазины
// добавим отдельной веткой.
export default function ShopsScreen() {
  const { width, height } = useWindowDimensions();
  const size = { width, height };

  return (
    <View style={styles.root}>
      <View pointerEvents="none">
        <Image source={BACKGROUND} style={[styles.layer, size]} resizeMode="cover" />
        <Image source={FOOD_BUTTON} style={[styles.layer, size]} resizeMode="cover" />
        <Image source={WARDROBE_BUTTON} style={[styles.layer, size]} resizeMode="cover" />
        <Image source={BUSHES} style={[styles.layer, size]} resizeMode="cover" />
      </View>

      <SafeAreaView style={styles.content} edges={["top"]}>
        <TopHud showChatBubble={false} />
      </SafeAreaView>

      <SafeAreaView style={styles.navSlot} edges={["bottom"]}>
        <BottomNav />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#BEE7FA" },
  layer: { position: "absolute", top: 0, left: 0 },
  content: { flex: 1 },
  navSlot: { backgroundColor: colors.navActive },
});
