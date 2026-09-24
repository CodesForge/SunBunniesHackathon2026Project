import { useEffect, useRef } from "react";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { usePathname, useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { colors } from "../../theme";

type Tab = {
  key: string;
  icon: ImageSourcePropType;
  route: string;
  label: string;
  badge?: number;
};

const ICON_CART = require("../../assets/icons/icon-cart.png");
const ICON_MOON = require("../../assets/icons/icon-moon.png");
const ICON_HOME = require("../../assets/icons/icon-home.png");
const ICON_FOOD = require("../../assets/icons/icon-food.png");
const ICON_BOOK = require("../../assets/icons/icon-book.png");

const TABS: Tab[] = [
  {
    key: "shop",
    icon: ICON_CART,
    route: "/shops",
    label: "Гардероб",
    badge: 1,
  },
  { key: "moon", icon: ICON_MOON, route: "/sleep", label: "Спальня" },
  { key: "home", icon: ICON_HOME, route: "/home", label: "Комната" },
  { key: "food", icon: ICON_FOOD, route: "/dining", label: "Кухня" },
  {
    key: "book",
    icon: ICON_BOOK,
    route: "/glossary",
    label: "Уроки",
    badge: 7,
  },
];

const BAR_HEIGHT = 80;
const HOME_INDEX = 2;
const ACTIVE_SCALE = 1.25;
const ACTIVE_LIFT = -10;
const ICON_SIZE = 38;

const PILL_SPRING = { damping: 22, stiffness: 130, mass: 1 };
const ICON_SPRING = { damping: 14, stiffness: 170, mass: 1 };

let lastActiveIndex = -1;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const found = TABS.findIndex((t) => t.route === pathname);
  const activeIndex = found === -1 ? HOME_INDEX : found;
  const tabWidth = width / TABS.length;

  const fromIndex = lastActiveIndex === -1 ? activeIndex : lastActiveIndex;
  const fromRef = useRef(fromIndex);

  const pos = useSharedValue(fromIndex);

  useEffect(() => {
    pos.value = withSpring(activeIndex, PILL_SPRING);
    lastActiveIndex = activeIndex;
  }, [activeIndex]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pos.value * tabWidth }],
  }));

  return (
    <View style={styles.bar}>
      {TABS.map((tab, i) => (
        <TabButton
          key={tab.key}
          tab={tab}
          active={i === activeIndex}
          startedActive={i === fromRef.current}
          width={tabWidth}
          onPress={() => {
            if (tab.route !== pathname) router.replace(tab.route as any);
          }}
        />
      ))}

      <Animated.View
        pointerEvents="none"
        style={[styles.pillSlot, { width: tabWidth }, pillStyle]}
      >
        <View style={styles.pill} />
      </Animated.View>
    </View>
  );
}

function TabButton({
  tab,
  active,
  startedActive,
  width,
  onPress,
}: {
  tab: Tab;
  active: boolean;
  startedActive: boolean;
  width: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(startedActive ? ACTIVE_SCALE : 1);
  const lift = useSharedValue(startedActive ? ACTIVE_LIFT : 0);

  useEffect(() => {
    scale.value = withSpring(active ? ACTIVE_SCALE : 1, ICON_SPRING);
    lift.value = withSpring(active ? ACTIVE_LIFT : 0, ICON_SPRING);
  }, [active]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: lift.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: withTiming(active ? 1 : 0.85, { duration: 150 }),
  }));

  return (
    <Pressable
      style={[styles.tab, { width }]}
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={
        typeof tab.badge === "number"
          ? `${tab.label}, новых: ${tab.badge}`
          : tab.label
      }
    >
      <Animated.View style={iconStyle}>
        <Image source={tab.icon} style={styles.tabIcon} resizeMode="contain" />
      </Animated.View>

      {typeof tab.badge === "number" && (
        <Animated.View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText}>{tab.badge}</Text>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    height: BAR_HEIGHT,
    backgroundColor: colors.navActive,
  },
  tab: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  tabIcon: { width: ICON_SIZE, height: ICON_SIZE },
  pillSlot: {
    position: "absolute",
    top: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    position: "absolute",
    top: -22,
    width: BAR_HEIGHT,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: colors.navActive,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 18,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.navBadge,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: colors.surface, fontSize: 11, fontWeight: "700" },
});
