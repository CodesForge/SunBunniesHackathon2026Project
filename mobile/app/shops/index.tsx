import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "../../components/ui/BottomNav";
import RoundImageButton, {
  ROUND_IMAGE_BUTTON_SIZE,
  ROUND_IMAGE_BUTTON_SIZE_TABLET,
  ROUND_IMAGE_BUTTON_CIRCLE_TABLET,
  ROUND_IMAGE_BUTTON_ICON_TABLET,
} from "../../components/ui/RoundImageButton";
import TopHud from "../../components/ui/TopHud";
import { colors } from "../../theme";

const BACKGROUND = require("../../assets/shops/background.png");
const FOOD_ICON = require("../../assets/shops/food-icon.png");
const WARDROBE_ICON = require("../../assets/shops/wardrobe-icon.png");

const TABLET_BREAKPOINT = 768;

const SIDE_MARGIN = 12;
const VERTICAL_PERCENT = 0.48;

export default function ShopsScreen() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const size = { width, height };

  const buttonSize = isTablet ? ROUND_IMAGE_BUTTON_SIZE_TABLET : ROUND_IMAGE_BUTTON_SIZE;
  const halfButton = buttonSize / 2;
  const top = height * VERTICAL_PERCENT - halfButton;

  const imageButtonProps = isTablet
    ? { circleSize: ROUND_IMAGE_BUTTON_CIRCLE_TABLET, iconSize: ROUND_IMAGE_BUTTON_ICON_TABLET }
    : {};

  return (
    <View style={styles.root}>
      <View pointerEvents="none">
        <Image source={BACKGROUND} style={[styles.layer, size]} resizeMode="cover" />
      </View>

      <ShopLink
        href="/shops/food"
        label="Магазин еды"
        image={FOOD_ICON}
        side="left"
        top={top}
        imageButtonProps={imageButtonProps}
      />
      <ShopLink
        href="/shops/wardrobe"
        label="Магазин одежды"
        image={WARDROBE_ICON}
        side="right"
        top={top}
        imageButtonProps={imageButtonProps}
      />

      <SafeAreaView style={styles.content} edges={["top"]} pointerEvents="box-none">
        <TopHud />
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
  imageButtonProps: { circleSize?: number; iconSize?: number };
};

function ShopLink({ href, label, image, side, top, imageButtonProps }: ShopLinkProps) {
  const sideStyle = side === "left" ? { left: SIDE_MARGIN } : { right: SIDE_MARGIN };

  return (
    <View style={[styles.pin, sideStyle, { top }]} pointerEvents="box-none">
      <Link href={href as any} asChild>
        <RoundImageButton
          image={image}
          accessibilityRole="button"
          accessibilityLabel={label}
          {...imageButtonProps}
        />
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
