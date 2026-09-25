import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  FoodPlateCarousel,
  type FoodPlateItem,
} from "../components/dining/FoodPlateCarousel";
import { PetMini } from "../components/pet/PetMini";
import BottomNav from "../components/ui/BottomNav";
import TopHud from "../components/ui/TopHud";
import { FOOD_ITEMS } from "../data/food";
import { usePet } from "../store/pet";
import { colors, space } from "../theme";

const PET_WIDTH_PERCENT = 62;
const PET_TOP_PERCENT = 0.29;
const PLATE_WIDTH_PERCENT = 0.3;

export default function DiningScreen() {
  const { width, height } = useWindowDimensions();
  const foodOwned = usePet((s) => s.foodOwned);
  const feed = usePet((s) => s.feed);

  const petW = (width * PET_WIDTH_PERCENT) / 100;
  const petTop = height * PET_TOP_PERCENT;
  const plateSize = width * PLATE_WIDTH_PERCENT;

  // На стол попадают только реально купленные продукты (foodOwned > 0).
  const foodItems: FoodPlateItem[] = FOOD_ITEMS.filter(
    (item) => (foodOwned[item.id] ?? 0) > 0,
  ).map((item) => ({
    id: item.id,
    food: item.image,
    quantity: foodOwned[item.id],
  }));

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/dining/background.png")}
        style={[styles.layer, { width, height }]}
        resizeMode="cover"
      />

      <View
        style={[styles.petSlot, { top: petTop, left: (width - petW) / 2 }]}
        pointerEvents="none"
      >
        <PetMini
          species="cat"
          widthPercent={PET_WIDTH_PERCENT}
          mouth="happy"
          eyesOpen
        />
      </View>

      <Image
        source={require("../assets/dining/table.png")}
        style={[styles.layer, { width, height }]}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.content} edges={["top"]} pointerEvents="box-none">
        <TopHud />

        <View style={styles.carouselSlot} pointerEvents="box-none">
          <FoodPlateCarousel
            items={foodItems}
            plateSize={plateSize}
            onSelect={(item) => feed(item.id)}
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
  root: { flex: 1, backgroundColor: "#BEE7FA" },
  layer: { position: "absolute", top: 0, left: 0 },
  petSlot: { position: "absolute" },
  content: { flex: 1 },
  carouselSlot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: space.xxl,
  },
  navSlot: { backgroundColor: colors.navActive },
});
