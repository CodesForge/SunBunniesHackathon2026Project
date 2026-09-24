import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "../../components/ui/BottomNav";
import RoundImageButton, { ROUND_IMAGE_BUTTON_SIZE } from "../../components/ui/RoundImageButton";
import TopHud from "../../components/ui/TopHud";
import { colors } from "../../theme";

const BACKGROUND = require("../../assets/shops/background.png");
const FOOD_BUTTON = require("../../assets/shops/dining-button.png");
const WARDROBE_BUTTON = require("../../assets/shops/wardrobe-button.png");
const BUSHES = require("../../assets/shops/bushes.png");
const FOOD_ICON = require("../../assets/shops/food-icon.png");
const WARDROBE_ICON = require("../../assets/shops/wardrobe-icon.png");

const SIDE_MARGIN = 12;
const VERTICAL_PERCENT = 0.48;
const HALF_BUTTON = ROUND_IMAGE_BUTTON_SIZE / 2;

export default function ShopsScreen() {
  const { width, height } = useWindowDimensions();
  const size = { width, height };
  const top = height * VERTICAL_PERCENT - HALF_BUTTON;

  return (
    <View style={styles.root}>
      <View pointerEvents="none">
        <Image source={BACKGROUND} style={[styles.layer, size]} resizeMode="cover" />
        <Image source={FOOD_BUTTON} style={[styles.layer, size]} resizeMode="cover" />
        <Image source={WARDROBE_BUTTON} style={[styles.layer, size]} resizeMode="cover" />
        <Image source={BUSHES} style={[styles.layer, size]} resizeMode="cover" />
      </View>

      <ShopLink href="/shops/food" label="Магазин еды" image={FOOD_ICON} side="left" top={top} />
      <ShopLink href="/shops/wardrobe" label="Магазин одежды" image={WARDROBE_ICON} side="right" top={top} />

      <SafeAreaView style={styles.content} edges={["top"]} pointerEvents="box-none">
        <TopHud showChatBubble={false} />
      </SafeAreaView>

      <SafeAreaView style={styles.navSlot} edges={["bottom"]}>
        <BottomNav />
      </SafeAreaView>
    </View>
  );
}

type ShopLinkProps = {
  href: string;
  label: string;
  image: number;
  side: "left" | "right";
  top: number;
};

function ShopLink( { href, label, image, side, top }: ShopLinkProps) {
  const sideStyle = side === "left" ? { left: SIDE_MARGIN } : { right: SIDE_MARGIN };

  return (
    <View style={[styles.pin, sideStyle, { top }]} pointerEvents="box-none">
      <Link href={href as any} asChild>
        <RoundImageButton image={image} accessibilityRole="button" accessibilityLabel={label} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#BEE7FA" },
  layer: { position: "absolute", top: 0, left: 0 },
  content: { flex: 1 },
  navSlot: { backgroundColor: colors.navActive },
  pin: { position: "absolute" },
});
