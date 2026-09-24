import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FoodPlateCarousel, type FoodPlateItem } from "../components/dining/FoodPlateCarousel";
import { PetMini } from "../components/pet/PetMini";

const PET_WIDTH_PERCENT = 46;
const PET_TOP_PERCENT = 0.2;
const PLATE_WIDTH_PERCENT = 0.22;

// TODO: заменить на реальные Продукты из магазина еды, когда появятся ассеты
const FOOD_ITEMS: FoodPlateItem[] = [];

export default function DiningScreen() {
  const { width, height } = useWindowDimensions();

  const petW = (width * PET_WIDTH_PERCENT) / 100;
  const petTop = height * PET_TOP_PERCENT;
  const plateSize = width * PLATE_WIDTH_PERCENT;

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/dining/background.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <View style={[styles.petSlot, { top: petTop, left: (width - petW) / 2 }]} pointerEvents="none">
        {/* пока реализован только кот, остальные виды подключим когда будут готовы ассеты */}
        <PetMini species="cat" widthPercent={PET_WIDTH_PERCENT} mouth="happy" eyesOpen />
      </View>

      <Image
        source={require("../assets/dining/table.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safe} edges={["bottom"]} pointerEvents="box-none">
        <View style={styles.carouselSlot}>
          <FoodPlateCarousel items={FOOD_ITEMS} plateSize={plateSize} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#BEE7FA" },
  petSlot: { position: "absolute" },
  safe: { flex: 1 },
  carouselSlot: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "6%",
    alignItems: "center",
  },
});
