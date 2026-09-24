import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FoodPlateCarousel, type FoodPlateItem } from "../components/dining/FoodPlateCarousel";
import { PetMini } from "../components/pet/PetMini";

const PET_WIDTH_PERCENT = 90;
const PET_TOP_PERCENT = 0.24;
const PLATE_WIDTH_PERCENT = 0.22;
const TABLET_BREAKPOINT = 768;

// TODO: заменить на реальные продукты из магазина еды, когда появятся ассеты
const FOOD_ITEMS: FoodPlateItem[] = [];

export default function DiningScreen() {
  const { width, height } = useWindowDimensions();

  const petW = (width * PET_WIDTH_PERCENT) / 100;
  const petTop = height * PET_TOP_PERCENT;
  const plateSize = width * PLATE_WIDTH_PERCENT;
  const isTablet = width >= TABLET_BREAKPOINT;
  const visibleCount = isTablet ? 3 : 2;

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/dining/background.png")}
        style={[styles.layer, { width, height }]}
        resizeMode="cover"
      />

      <View style={[styles.petSlot, { top: petTop, left: (width - petW) / 2 }]} pointerEvents="none">
        {/* пока реализован только кот, остальные виды подключим когда будут готовы ассеты */}
        <PetMini species="cat" widthPercent={PET_WIDTH_PERCENT} mouth="happy" eyesOpen />
      </View>

      <Image
        source={require("../assets/dining/table.png")}
        style={[styles.layer, { width, height }]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safe} edges={["bottom"]} pointerEvents="box-none">
        <View style={styles.carouselSlot}>
          <FoodPlateCarousel items={FOOD_ITEMS} plateSize={plateSize} visibleCount={visibleCount} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#BEE7FA" },
  layer: { position: "absolute", top: 0, left: 0 },
  petSlot: { position: "absolute" },
  safe: { flex: 1 },
  carouselSlot: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "25%",
    alignItems: "center",
  },
});
