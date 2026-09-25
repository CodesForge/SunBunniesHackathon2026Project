import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Baby } from "lucide-react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import TopHud from "../../components/ui/TopHud";
import RoundIconButton from "../../components/ui/RoundIconButton";
import { PetMini } from "../../components/pet/PetMini";
import { WARDROBE_ITEMS } from "../../data/wardrobe";
import { usePet } from "../../store/pet";
import { ECONOMY } from "../../data/economy";
import { colors, font, radius, space } from "../../theme";

const BACKGROUND = require("../../assets/wardrobe/background.png");
const ARROW_LEFT = require("../../assets/icons/arrow-left.png");
const ARROW_RIGHT = require("../../assets/icons/arrow-right.png");
const COIN_WANT = require("../../assets/icons/coin-want.png");

// Питомец на гардеробном экране центрируется по горизонтали,
// снизу — отступ в долях высоты экрана.
const PET_WIDTH_PERCENT = 70;
const PET_BOTTOM_FRACTION = 0.3;

const DRAWER_HEIGHT = 220;
const DRAWER_ANIM_DURATION = 220;
const ARROW_SIZE = 44;
const CATEGORY_BUTTON_HALF = 28;
const CAROUSEL_SLIDE_DISTANCE = 56;
const CAROUSEL_ANIM_DURATION = 220;

export default function WardrobeShopScreen() {
  const { width, height } = useWindowDimensions();
  const xp = usePet((s) => s.xp);
  const jars = usePet((s) => s.jars);
  const buy = usePet((s) => s.buy);
  const wear = usePet((s) => s.wear);

  // Тот же расчёт уровня, что и в TopHud: 1-й уровень — "малыш", только
  // для него сейчас показываем гардероб (подгузники).
  const level = xp >= ECONOMY.stages[2] ? 3 : xp >= ECONOMY.stages[1] ? 2 : 1;
  const isBaby = level === 1;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const drawerProgress = useSharedValue(0);

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

  const item = WARDROBE_ITEMS[index];
  const canAfford = !!item && jars[item.jar] >= item.price;

  const carouselOffset = useSharedValue(0);
  const carouselOpacity = useSharedValue(1);

  const move = (delta: number) => {
    const dir = delta > 0 ? 1 : -1;
    // Мгновенно "уводим" текущую картинку+цену в сторону и прячем, затем
    // плавно возвращаем на место уже с новым товаром — получается красивый
    // въезд следующей вещи с той стороны, откуда листаем.
    carouselOffset.value = dir * CAROUSEL_SLIDE_DISTANCE;
    carouselOpacity.value = 0;
    setIndex((i) => (i + delta + WARDROBE_ITEMS.length) % WARDROBE_ITEMS.length);
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

  const handleBuy = () => {
    if (!item || !canAfford) return;
    const bought = buy(item);
    if (bought && item.slot) wear(item.slot, item.id);
  };

  return (
    <View style={styles.root}>
      <Image source={BACKGROUND} style={backgroundStyle} resizeMode="cover" />

      <View style={[styles.petWrap, { bottom: height * PET_BOTTOM_FRACTION }]} pointerEvents="none">
        <PetMini species="cat" widthPercent={PET_WIDTH_PERCENT} animated={false} bodyWear={drawerOpen ? item?.image : undefined} />
      </View>

      {isBaby && (
        <View style={styles.categoryButton}>
          <RoundIconButton
            icon={Baby}
            onPress={() => setDrawerOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Вещи для малыша"
          />
        </View>
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

              <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
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
            style={[styles.buyButton, !canAfford && styles.buyButtonDisabled]}
            onPress={handleBuy}
            disabled={!canAfford}
            accessibilityRole="button"
            accessibilityLabel={`Купить ${item.title} за ${item.price}`}
          >
            <Text style={styles.buyText}>Купить</Text>
          </Pressable>
        </Animated.View>
      )}

      <SafeAreaView style={styles.hudSlot} edges={["top"]} pointerEvents="box-none">
        <TopHud backHref="/shops" showStats={false} showChatBubble={false} showChat={false} />
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
  categoryButton: {
    position: "absolute",
    left: space.lg,
    top: "50%",
    marginTop: -CATEGORY_BUTTON_HALF,
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
    backgroundColor: colors.accent,
    paddingHorizontal: space.xl,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
  },
  buyButtonDisabled: { backgroundColor: colors.statNormal },
  buyText: { ...font.h2, color: colors.surface },
});
