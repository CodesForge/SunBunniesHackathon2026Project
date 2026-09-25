import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import TopHud from "../../components/ui/TopHud";
import { FOOD_ITEMS, type FoodItem } from "../../data/food";
import { usePet } from "../../store/pet";
import { font, space } from "../../theme";

const BACKGROUND = require("../../assets/food/shop-background.png");
const CART = require("../../assets/food/cart.png");
const COIN_NEED = require("../../assets/icons/coin-need.png");

// Доли высоты картинки фона, на которых начинаются деревянные полки —
// вымерено по самому фону, чтобы еда легла ровно на полку.
const SHELF_TOP_FRACTIONS = [0.2578, 0.432, 0.6063];
const FLOOR_TOP_FRACTION = 0.7383;

// Насколько низ картинки еды заходит "под" полку (в пикселях). Чем
// БОЛЬШЕ число — тем НИЖЕ и плотнее еда сидит на полке (может слегка
// перекрыть саму доску). Чем МЕНЬШЕ (или отрицательное) — тем выше и
// "воздушнее" еда висит над полкой. Крути и смотри, что нравится.
const SHELF_SINK_PX = 10;

const ITEM_SIZE_PERCENT = 0.16;
const CART_WIDTH_PERCENT = 0.7;
const CART_ASPECT = 1681 / 2111; // высота / ширина картинки тележки
const FLIGHT_DURATION = 480;

// Купленная еда складывается кучкой ВНУТРИ корзины тележки (за
// сеточкой, а не поверх неё — это создаёт эффект "лежит в корзине"), в
// произвольных местах и с небольшим поворотом, а не ровной сеткой. Область
// вымерена по самой картинке тележки (где у неё открытая "корзинка").
// Чтобы куча не разрослась до бесконечности, показываем максимум
// MAX_PILE_ITEMS штук — все покупки сверх этого числа всё равно летят
// анимацией, просто больше не добавляются в саму кучу.
const MAX_PILE_ITEMS = 15;
const PILE_ICON_RATIO = 0.5; // размер иконки в кучке относительно размера еды на полке
const BASKET_LEFT_RATIO = 0.2;
const BASKET_TOP_RATIO = 0.08;
const BASKET_WIDTH_RATIO = 0.6;
const BASKET_HEIGHT_RATIO = 0.58;

// Стабильный "случайный" разброс позиций/поворотов — считается один раз,
// а не при каждом рендере, чтобы куча не дёргалась туда-сюда.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9973) * 43758.5453;
  return x - Math.floor(x);
}
const PILE_SLOTS = Array.from({ length: MAX_PILE_ITEMS }, (_, i) => ({
  leftRatio: seededRandom(i * 2 + 1),
  topRatio: seededRandom(i * 2 + 2),
  rotateDeg: (seededRandom(i * 2 + 3) - 0.5) * 50,
}));

type Flight = {
  id: string;
  image: FoodItem["image"];
  from: { x: number; y: number };
  to: { x: number; y: number };
};

export default function FoodShopScreen() {
  const { width, height } = useWindowDimensions();
  const jarsNeed = usePet((s) => s.jars.need);
  const foodOwned = usePet((s) => s.foodOwned);
  const buyFood = usePet((s) => s.buyFood);

  const backgroundStyle = { position: "absolute" as const, top: 0, left: 0, width, height };

  const [flights, setFlights] = useState<Flight[]>([]);
  const cartRef = useRef<View>(null);
  const itemRefs = useRef<Record<string, View | null>>({});

  const itemSize = width * ITEM_SIZE_PERCENT;
  const cartWidth = width * CART_WIDTH_PERCENT;
  const cartHeight = cartWidth * CART_ASPECT;

  const rows = [FOOD_ITEMS.slice(0, 3), FOOD_ITEMS.slice(3, 6), FOOD_ITEMS.slice(6, 9)];
  const pileIconSize = itemSize * PILE_ICON_RATIO;
  const basketWidth = cartWidth * BASKET_WIDTH_RATIO;
  const basketHeight = cartHeight * BASKET_HEIGHT_RATIO;

  // Плоский список отдельных купленных штук (не по одной иконке на вид
  // еды, а именно по штуке на каждую покупку) — обрезанный по MAX_PILE_ITEMS.
  const pile: { key: string; image: FoodItem["image"] }[] = [];
  for (const item of FOOD_ITEMS) {
    const qty = foodOwned[item.id] ?? 0;
    for (let i = 0; i < qty && pile.length < MAX_PILE_ITEMS; i++) {
      pile.push({ key: `${item.id}-${i}`, image: item.image });
    }
  }

  const removeFlight = useCallback((id: string) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleBuy = (item: FoodItem) => {
    if (jarsNeed < item.price) return;

    const node = itemRefs.current[item.id];
    if (!node || !cartRef.current) {
      buyFood(item);
      return;
    }

    node.measureInWindow((fx, fy, fw, fh) => {
      cartRef.current?.measureInWindow((cx, cy, cw, ch) => {
        const bought = buyFood(item);
        if (!bought) return;
        setFlights((prev) => [
          ...prev,
          {
            id: `${item.id}-${Date.now()}`,
            image: item.image,
            from: { x: fx + fw / 2, y: fy + fh / 2 },
            to: { x: cx + cw / 2, y: cy + ch * 0.35 },
          },
        ]);
      });
    });
  };

  return (
    <View style={styles.root}>
      <Image source={BACKGROUND} style={backgroundStyle} resizeMode="cover" />

      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.shelfRow,
            { top: height * SHELF_TOP_FRACTIONS[rowIndex] - itemSize + SHELF_SINK_PX },
          ]}
        >
          {row.map((item) => {
            const canAfford = jarsNeed >= item.price;
            return (
              <Pressable
                key={item.id}
                ref={(node) => {
                  itemRefs.current[item.id] = node as unknown as View | null;
                }}
                onPress={() => handleBuy(item)}
                style={[styles.foodSlot, { width: itemSize }, !canAfford && styles.foodSlotDisabled]}
                accessibilityRole="button"
                accessibilityLabel={`Купить ${item.title} за ${item.price}`}
              >
                <Image
                  source={item.image}
                  style={{ width: itemSize, height: itemSize }}
                  resizeMode="contain"
                />
                <View style={styles.priceRow}>
                  <Image source={COIN_NEED} style={styles.coinIcon} resizeMode="contain" />
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      <View
        ref={cartRef}
        style={[
          styles.cartSlot,
          {
            top:
              height * FLOOR_TOP_FRACTION +
              (height * (1 - FLOOR_TOP_FRACTION) - cartHeight) / 2,
            left: (width - cartWidth) / 2,
            width: cartWidth,
            height: cartHeight,
          },
        ]}
        pointerEvents="none"
      >
        {/* Еда лежит ЗА картинкой тележки (внутри её "сеточки"), поэтому
            рисуем кучу раньше самой картинки тележки — та ляжет поверх. */}
        <View
          style={{
            position: "absolute",
            left: cartWidth * BASKET_LEFT_RATIO,
            top: cartHeight * BASKET_TOP_RATIO,
            width: basketWidth,
            height: basketHeight,
          }}
        >
          {pile.map((p, index) => {
            const slot = PILE_SLOTS[index];
            return (
              <Image
                key={p.key}
                source={p.image}
                style={{
                  position: "absolute",
                  left: slot.leftRatio * (basketWidth - pileIconSize),
                  top: slot.topRatio * (basketHeight - pileIconSize),
                  width: pileIconSize,
                  height: pileIconSize,
                  transform: [{ rotate: `${slot.rotateDeg}deg` }],
                }}
                resizeMode="contain"
              />
            );
          })}
        </View>

        <Image source={CART} style={{ width: cartWidth, height: cartHeight }} resizeMode="contain" />
      </View>

      {flights.map((f) => (
        <FlyingFood key={f.id} flight={f} size={itemSize} onDone={() => removeFlight(f.id)} />
      ))}

      <SafeAreaView style={styles.hudSlot} edges={["top"]} pointerEvents="box-none">
        <TopHud backHref="/shops" showStats={false} showChatBubble={false} showChat={false} />
      </SafeAreaView>
    </View>
  );
}

type FlyingFoodProps = {
  flight: Flight;
  size: number;
  onDone: () => void;
};

function FlyingFood({ flight, size, onDone }: FlyingFoodProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(
      1,
      { duration: FLIGHT_DURATION, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(onDone)();
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const x = flight.from.x + (flight.to.x - flight.from.x) * progress.value;
    const y = flight.from.y + (flight.to.y - flight.from.y) * progress.value;
    const scale = 1 - progress.value * 0.65;
    return {
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      opacity: 1 - progress.value * 0.2,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={animatedStyle} pointerEvents="none">
      <Image source={flight.image} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#7ACBF7" },
  hudSlot: { flex: 1 },

  shelfRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    paddingHorizontal: space.md,
  },
  foodSlot: { alignItems: "center" },
  foodSlotDisabled: { opacity: 0.4 },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  coinIcon: { width: 18, height: 18 },
  priceText: { ...font.small, fontWeight: "800", color: "#3A2E22" },

  cartSlot: { position: "absolute" },
});
