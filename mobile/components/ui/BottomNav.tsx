import { useEffect, useRef } from "react";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { usePathname, useRouter } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors } from "../../theme";

type Tab = {
  key: string;
  icon: ImageSourcePropType;
  route: string;
  label: string;
};

const ICON_CART = require("../../assets/icons/icon-cart.png");
const ICON_MOON = require("../../assets/icons/icon-moon.png");
const ICON_HOME = require("../../assets/icons/icon-home.png");
const ICON_FOOD = require("../../assets/icons/icon-food.png");
const ICON_BOOK = require("../../assets/icons/icon-book.png");

const TABS: Tab[] = [
  { key: "shop", icon: ICON_CART, route: "/shops", label: "Гардероб" },
  { key: "moon", icon: ICON_MOON, route: "/sleep", label: "Спальня" },
  { key: "home", icon: ICON_HOME, route: "/home", label: "Комната" },
  { key: "food", icon: ICON_FOOD, route: "/dining", label: "Кухня" },
  { key: "book", icon: ICON_BOOK, route: "/glossary", label: "Уроки" },
];

const TABLET_BREAKPOINT = 768;
const TABLET_BAR_MAX_WIDTH = 480;

const BAR_HEIGHT = 80;
const BAR_HEIGHT_TABLET = 104;
const HOME_INDEX = 2;
const ACTIVE_SCALE = 1.25;
const ACTIVE_LIFT = -10;
const ACTIVE_LIFT_TABLET = -14;
const ICON_SIZE = 38;
const ICON_SIZE_TABLET = 52;

const PILL_TOP = -22;
const PILL_TOP_TABLET = -29;

const PILL_SPRING = { damping: 22, stiffness: 130, mass: 1 };
const ICON_SPRING = { damping: 14, stiffness: 170, mass: 1 };

let lastActiveIndex = -1;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;

  const barHeight = isTablet ? BAR_HEIGHT_TABLET : BAR_HEIGHT;
  const barWidth = isTablet ? Math.min(width, TABLET_BAR_MAX_WIDTH) : width;

  const found = TABS.findIndex((t) => t.route === pathname);
  const activeIndex = found === -1 ? HOME_INDEX : found;
  const tabWidth = barWidth / TABS.length;
  const pillSize = Math.min(barHeight, tabWidth);

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
    <View style={[styles.bar, { height: barHeight }]}>
      <View style={[styles.barInner, { width: barWidth, height: barHeight }]}>
        {TABS.map((tab, i) => (
          <TabButton
            key={tab.key}
            tab={tab}
            active={i === activeIndex}
            startedActive={i === fromRef.current}
            isTablet={isTablet}
            onPress={() => {
              if (tab.route !== pathname) router.replace(tab.route as any);
            }}
          />
        ))}

        <Animated.View
          pointerEvents="none"
          style={[styles.pillSlot, { width: tabWidth }, pillStyle]}
        >
          <View
            style={[
              styles.pill,
              { top: isTablet ? PILL_TOP_TABLET : PILL_TOP, width: pillSize, height: pillSize, borderRadius: pillSize / 2 },
            ]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

function TabButton({
  tab,
  active,
  startedActive,
  isTablet,
  onPress,
}: {
  tab: Tab;
  active: boolean;
  startedActive: boolean;
  isTablet: boolean;
  onPress: () => void;
}) {
  const activeLift = isTablet ? ACTIVE_LIFT_TABLET : ACTIVE_LIFT;
  const scale = useSharedValue(startedActive ? ACTIVE_SCALE : 1);
  const lift = useSharedValue(startedActive ? activeLift : 0);

  useEffect(() => {
    scale.value = withSpring(active ? ACTIVE_SCALE : 1, ICON_SPRING);
    lift.value = withSpring(active ? activeLift : 0, ICON_SPRING);
  }, [active, activeLift]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: lift.value }],
  }));

  return (
    <Pressable
      style={styles.tab}
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
    >
      <Animated.View style={iconStyle}>
        <Image
          source={tab.icon}
          style={[styles.tabIcon, isTablet && styles.tabIconTablet]}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: "center",
    backgroundColor: colors.navActive,
  },
  barInner: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  tabIcon: { width: ICON_SIZE, height: ICON_SIZE },
  tabIconTablet: { width: ICON_SIZE_TABLET, height: ICON_SIZE_TABLET },
  pillSlot: {
    position: "absolute",
    top: 0,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    position: "absolute",
    backgroundColor: colors.navActive,
  },
});
