import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Baby, Ribbon, Shirt } from "lucide-react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import type { ImageSourcePropType } from "react-native";

import TopHud from "../../components/ui/TopHud";
import RoundIconButton from "../../components/ui/RoundIconButton";
import { PetMini } from "../../components/pet/PetMini";
import {
  ADULT_ACCESSORY_ITEMS,
  ADULT_CLOTHING_ITEMS,
  TEEN_ACCESSORY_ITEMS,
  TEEN_CLOTHING_ITEMS,
  WARDROBE_ITEMS,
  resolveWornVisuals,
  type WardrobeItem,
  type WardrobeOutfitItem,
} from "../../data/wardrobe";
import { usePet } from "../../store/pet";
import { getPetStage } from "../../components/pet/petAssets";
import { colors, font, radius, space } from "../../theme";

const BACKGROUND = require("../../assets/wardrobe/background.png");
const ARROW_LEFT = require("../../assets/icons/arrow-left.png");
const ARROW_RIGHT = require("../../assets/icons/arrow-right.png");
const COIN_WANT = require("../../assets/icons/coin-want.png");

const PET_WIDTH_PERCENT = 70;
const PET_BOTTOM_FRACTION = 0.22;

const TABLET_BREAKPOINT = 768;

const DRAWER_HEIGHT = 220;
const DRAWER_ANIM_DURATION = 220;
const ARROW_SIZE = 44;
const CATEGORY_BUTTON_HALF = 28;
const CATEGORY_BUTTON_HALF_TABLET = 39;
const CATEGORY_BUTTON_CIRCLE_TABLET = 78;
const CATEGORY_BUTTON_ICON_TABLET = 32;
const CAROUSEL_SLIDE_DISTANCE = 56;
const CAROUSEL_ANIM_DURATION = 800;

type Category = "baby" | "accessory" | "clothing";
type WardrobeEntry = WardrobeItem | WardrobeOutfitItem;

function isOutfitItem(item: WardrobeEntry): item is WardrobeOutfitItem {
  return "base" in item;
}

function previewImage(item: WardrobeEntry): ImageSourcePropType {
  if (item.preview) return item.preview;
  return isOutfitItem(item) ? item.base : item.image;
}

export default function WardrobeShopScreen() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const categoryButtonProps = isTablet
    ? { circleSize: CATEGORY_BUTTON_CIRCLE_TABLET, iconSize: CATEGORY_BUTTON_ICON_TABLET }
    : {};
  const species = usePet((s) => s.species);
  const xp = usePet((s) => s.xp);
  const jars = usePet((s) => s.jars);
  const owned = usePet((s) => s.owned);
  const worn = usePet((s) => s.worn);
  const motion = usePet((s) => s.settings.motion);
  const buy = usePet((s) => s.buy);
  const wear = usePet((s) => s.wear);
  const unwear = usePet((s) => s.unwear);

  const keptPeriods = usePet((s) => s.keptPeriods);
  const stage = getPetStage(xp, keptPeriods);
  const isBaby = stage === "mini";
  const isGrownUp = stage !== "mini";

  const [category, setCategory] = useState<Category | null>(null);
  const [index, setIndex] = useState(0);
  const drawerProgress = useSharedValue(0);

  const drawerOpen = category !== null;

  useEffect(() => {
    drawerProgress.value = withTiming(drawerOpen ? 1 : 0, {
      duration: DRAWER_ANIM_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [drawerOpen]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - drawerProgress.value) * DRAWER_HEIGHT }],
    opacity: drawerProgress.value,
  }));

  const backgroundStyle = { position: "absolute" as const, top: 0, left: 0, width, height };

  const clothingItems = stage === "adult" ? ADULT_CLOTHING_ITEMS : TEEN_CLOTHING_ITEMS;
  const accessoryItems = stage === "adult" ? ADULT_ACCESSORY_ITEMS : TEEN_ACCESSORY_ITEMS;
  const items: WardrobeEntry[] =
    category === "accessory" ? accessoryItems : category === "clothing" ? clothingItems : WARDROBE_ITEMS;

  const item = items[index];
  const isOwned = !!item && owned.includes(item.id);
  const isWorn = !!item && !!item.slot && worn[item.slot] === item.id;
  const canAfford = !!item && !isOwned && jars[item.jar] >= item.price;

  const buttonMode: "buy" | "wear" | "unwear" = !isOwned ? "buy" : isWorn ? "unwear" : "wear";
  const buttonDisabled = buttonMode === "buy" && !canAfford;
  const buttonLabel = buttonMode === "buy" ? "Купить" : buttonMode === "wear" ? "Надеть" : "Снять";

  const toggleCategory = (next: Category) => {
    setIndex(0);
    setCategory((c) => (c === next ? null : next));
  };

  const carouselOffset = useSharedValue(0);
  const carouselOpacity = useSharedValue(1);

  const move = (delta: number) => {
    const dir = delta > 0 ? 1 : -1;
    carouselOffset.value = dir * CAROUSEL_SLIDE_DISTANCE;
    carouselOpacity.value = 0;
    setIndex((i) => (i + delta + items.length) % items.length);
    carouselOffset.value = withTiming(0, {
      duration: CAROUSEL_ANIM_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    carouselOpacity.value = withTiming(1, {
      duration: CAROUSEL_ANIM_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  };

  const carouselStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: carouselOffset.value }],
    opacity: carouselOpacity.value,
  }));

  const handlePress = () => {
    if (!item || !item.slot) return;
    if (buttonMode === "buy") {
      if (!canAfford) return;
      buy(item);
    } else if (buttonMode === "wear") {
      wear(item.slot, item.id);
    } else {
      unwear(item.slot);
    }
  };

  const wornVisuals = resolveWornVisuals(worn, stage);

  const previewOutfit = category === "clothing" && drawerOpen && item && isOutfitItem(item) ? item : undefined;
  const previewHeadWear = category === "accessory" && drawerOpen ? (item as WardrobeItem | undefined)?.image : undefined;
  const previewBodyWear = category === "baby" && drawerOpen ? (item as WardrobeItem | undefined)?.image : undefined;

  const shownBodyWear = previewBodyWear ?? wornVisuals.bodyWear;
  const shownOutfit = previewOutfit
    ? { base: previewOutfit.base, sleeveLeft: previewOutfit.sleeveLeft, sleeveRight: previewOutfit.sleeveRight }
    : wornVisuals.outfit;
  const shownHeadWear = previewHeadWear ?? wornVisuals.headWear;

  return (
    <View style={styles.root}>
      <Image source={BACKGROUND} style={backgroundStyle} resizeMode="cover" />

      <View style={[styles.petWrap, { bottom: height * PET_BOTTOM_FRACTION }]} pointerEvents="none">
        <PetMini
          species={species ?? "cat"}
          widthPercent={PET_WIDTH_PERCENT}
          animated={motion}
          bodyWear={shownBodyWear}
          outfit={shownOutfit}
          headWear={shownHeadWear}
        />
      </View>

      {isBaby && (
        <View style={[styles.categoryButtonLeft, isTablet && styles.categoryButtonLeftTablet]}>
          <RoundIconButton
            icon={Baby}
            onPress={() => toggleCategory("baby")}
            accessibilityRole="button"
            accessibilityLabel="Вещи для малыша"
            {...categoryButtonProps}
          />
        </View>
      )}

      {isGrownUp && (
        <>
          <View style={[styles.categoryButtonLeft, isTablet && styles.categoryButtonLeftTablet]}>
            <RoundIconButton
              icon={Ribbon}
              onPress={() => toggleCategory("accessory")}
              accessibilityRole="button"
              accessibilityLabel="Аксессуары"
              {...categoryButtonProps}
            />
          </View>
          <View style={[styles.categoryButtonRight, isTablet && styles.categoryButtonRightTablet]}>
            <RoundIconButton
              icon={Shirt}
              onPress={() => toggleCategory("clothing")}
              accessibilityRole="button"
              accessibilityLabel="Одежда"
              {...categoryButtonProps}
            />
          </View>
        </>
      )}

      {item && (
        <Animated.View
          style={[styles.drawer, drawerStyle]}
          pointerEvents={drawerOpen ? "auto" : "none"}
        >
          <View style={styles.drawerRow}>
            <Pressable
              onPress={() => move(-1)}
              hitSlop={12}
              style={styles.arrowHit}
              accessibilityRole="button"
              accessibilityLabel="Предыдущая вещь"
            >
              <Image source={ARROW_LEFT} style={styles.arrowImg} resizeMode="contain" />
            </Pressable>

            <Animated.View style={[styles.carouselContent, carouselStyle]}>
              <View style={styles.priceCol}>
                <Image source={COIN_WANT} style={styles.coinIcon} resizeMode="contain" />
                <Text style={styles.priceText}>{item.price}</Text>
              </View>

              <Image source={previewImage(item)} style={styles.itemImage} resizeMode="contain" />
            </Animated.View>

            <Pressable
              onPress={() => move(1)}
              hitSlop={12}
              style={styles.arrowHit}
              accessibilityRole="button"
              accessibilityLabel="Следующая вещь"
            >
              <Image source={ARROW_RIGHT} style={styles.arrowImg} resizeMode="contain" />
            </Pressable>
          </View>

          <Pressable
            style={[styles.buyButton, buttonDisabled && styles.buyButtonDisabled]}
            onPress={handlePress}
            disabled={buttonDisabled}
            accessibilityRole="button"
            accessibilityLabel={
              buttonMode === "buy"
                ? `Купить ${item.title} за ${item.price}`
                : buttonMode === "wear"
                  ? `Надеть ${item.title}`
                  : `Снять ${item.title}`
            }
          >
            <Text style={styles.buyText}>{buttonLabel}</Text>
          </Pressable>
        </Animated.View>
      )}

      <SafeAreaView style={styles.hudSlot} edges={["top"]} pointerEvents="box-none">
        <TopHud backHref="/shops" showStats={false} showChat={false} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hudSlot: { flex: 1 },
  petWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  categoryButtonLeft: {
    position: "absolute",
    left: space.lg,
    top: "50%",
    marginTop: -CATEGORY_BUTTON_HALF,
  },
  categoryButtonLeftTablet: {
    marginTop: -CATEGORY_BUTTON_HALF_TABLET,
  },
  categoryButtonRight: {
    position: "absolute",
    right: space.lg,
    top: "50%",
    marginTop: -CATEGORY_BUTTON_HALF,
  },
  categoryButtonRightTablet: {
    marginTop: -CATEGORY_BUTTON_HALF_TABLET,
  },
  drawer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: DRAWER_HEIGHT,
    backgroundColor: colors.surface,
    borderWidth: 6,
    borderColor: colors.accent,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    alignItems: "center",
    paddingTop: space.lg,
    paddingBottom: space.lg,
    gap: space.md,
  },
  drawerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xl,
  },
  arrowHit: { padding: space.sm },
  arrowImg: { width: ARROW_SIZE, height: ARROW_SIZE },
  carouselContent: { flexDirection: "row", alignItems: "center", gap: space.xl },
  priceCol: { flexDirection: "row", alignItems: "center", gap: 6 },
  coinIcon: { width: 28, height: 28 },
  priceText: { ...font.h2, color: colors.ink },
  itemImage: { width: 96, height: 96 },
  buyButton: {
    backgroundColor: colors.sceneOval,
    paddingHorizontal: 40,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
  },
  buyButtonDisabled: { backgroundColor: colors.statNormal },
  buyText: { fontSize: 24, fontWeight: "700", color: colors.surface },
});
