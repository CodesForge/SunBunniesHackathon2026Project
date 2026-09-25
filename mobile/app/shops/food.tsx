import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "../../components/ui/BottomNav";
import TopHud from "../../components/ui/TopHud";
import { FOOD_ITEMS, type FoodItem } from "../../data/food";
import { usePet } from "../../store/pet";
import { colors, font, radius, space } from "../../theme";

const BACKGROUND = require("../../assets/shops/background.png");
const ICON_CART = require("../../assets/icons/icon-cart.png");
const CARD_ICON_SIZE = 64;
const CART_ICON_SIZE = 22;
const NUM_COLUMNS = 3;

export default function FoodShopScreen() {
  const jarsNeed = usePet((s) => s.jars.need);
  const foodOwned = usePet((s) => s.foodOwned);
  const buyFood = usePet((s) => s.buyFood);

  return (
    <View style={styles.root}>
      <Image source={BACKGROUND} style={StyleSheet.absoluteFill} resizeMode="cover" />

      <SafeAreaView style={styles.content} edges={["top"]}>
        <TopHud showChatBubble={false} />

        <FlatList
          data={FOOD_ITEMS}
          key={NUM_COLUMNS}
          numColumns={NUM_COLUMNS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <FoodCard
              item={item}
              owned={foodOwned[item.id] ?? 0}
              canAfford={jarsNeed >= item.price}
              onBuy={() => buyFood(item)}
            />
          )}
        />
      </SafeAreaView>

      <SafeAreaView style={styles.navSlot} edges={["bottom"]}>
        <BottomNav />
      </SafeAreaView>
    </View>
  );
}

type FoodCardProps = {
  item: FoodItem;
  owned: number;
  canAfford: boolean;
  onBuy: () => boolean;
};

function FoodCard({ item, owned, canAfford, onBuy }: FoodCardProps) {
  const [justBought, setJustBought] = useState(false);

  const handlePress = () => {
    const bought = onBuy();
    if (!bought) return;
    setJustBought(true);
    setTimeout(() => setJustBought(false), 500);
  };

  return (
    <View style={styles.card}>
      {owned > 0 && (
        <View style={styles.ownedBadge}>
          <Text style={styles.ownedBadgeText}>x{owned}</Text>
        </View>
      )}

      <Image source={item.image} style={styles.cardIcon} resizeMode="contain" />
      <Text style={styles.cardTitle}>{item.title}</Text>

      <Pressable
        onPress={handlePress}
        disabled={!canAfford}
        style={({ pressed }) => [
          styles.buyButton,
          !canAfford && styles.buyButtonDisabled,
          pressed && canAfford && styles.buyButtonPressed,
          justBought && styles.buyButtonBought,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Купить ${item.title} за ${item.price}`}
      >
        <Image source={ICON_CART} style={styles.cartIcon} resizeMode="contain" />
        <Text style={styles.buyButtonText}>{item.price}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#BEE7FA" },
  content: { flex: 1 },
  grid: { padding: space.md, paddingBottom: space.xl },
  row: { justifyContent: "space-between", marginBottom: space.md },

  card: {
    width: "31%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: "center",
    paddingVertical: space.md,
    paddingHorizontal: space.xs,
  },
  cardIcon: { width: CARD_ICON_SIZE, height: CARD_ICON_SIZE, marginBottom: space.xs },
  cardTitle: {
    ...font.small,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: space.sm,
    textAlign: "center",
  },

  ownedBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.iconBorder,
    paddingHorizontal: space.sm,
    paddingVertical: 1,
    zIndex: 1,
  },
  ownedBadgeText: { ...font.small, fontWeight: "800", color: colors.ink },

  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    backgroundColor: colors.coinNeedBg,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  buyButtonDisabled: { backgroundColor: colors.disabled },
  buyButtonPressed: { opacity: 0.8 },
  buyButtonBought: { backgroundColor: colors.good },
  cartIcon: { width: CART_ICON_SIZE, height: CART_ICON_SIZE },
  buyButtonText: { ...font.small, fontWeight: "800", color: colors.ink },

  navSlot: { backgroundColor: colors.navActive },
});
