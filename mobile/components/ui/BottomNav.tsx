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

const BADGE_SIZE = 18;
const BADGE_SIZE_TABLET = 24;
const BADGE_TOP = 10;
const BADGE_TOP_TABLET = 14;
const BADGE_RIGHT = 18;
const BADGE_RIGHT_TABLET = 22;
const BADGE_FONT = 11;
const BADGE_FONT_TABLET = 14;

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
            width={tabWidth}
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
          <View style={[styles.pill, isTablet && styles.pillTablet]} />
        </Animated.View>
      </View>
    </View>
  );
}

function TabButton({
  tab,
  active,
  startedActive,
  width,
  isTablet,
  onPress,
}: {
  tab: Tab;
  active: boolean;
  startedActive: boolean;
  width: number;
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
        <Image
          source={tab.icon}
          style={[styles.tabIcon, isTablet && styles.tabIconTablet]}
          resizeMode="contain"
        />
      </Animated.View>

      {typeof tab.badge === "number" && (
        <Animated.View
          style={[styles.badge, isTablet && styles.badgeTablet, badgeStyle]}
        >
          <Text style={[styles.badgeText, isTablet && styles.badgeTextTablet]}>
            {tab.badge}
          </Text>
        </Animated.View>
      )}
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
  },
  tab: {
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
    top: PILL_TOP,
    width: BAR_HEIGHT,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: colors.navActive,
  },
  pillTablet: {
    top: PILL_TOP_TABLET,
    width: BAR_HEIGHT_TABLET,
    height: BAR_HEIGHT_TABLET,
    borderRadius: BAR_HEIGHT_TABLET / 2,
  },
  badge: {
    position: "absolute",
    top: BADGE_TOP,
    right: BADGE_RIGHT,
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    paddingHorizontal: 4,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: colors.navBadge,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTablet: {
    top: BADGE_TOP_TABLET,
    right: BADGE_RIGHT_TABLET,
    minWidth: BADGE_SIZE_TABLET,
    height: BADGE_SIZE_TABLET,
    borderRadius: BADGE_SIZE_TABLET / 2,
  },
  badgeText: { color: colors.surface, fontSize: BADGE_FONT, fontWeight: "700" },
  badgeTextTablet: { fontSize: BADGE_FONT_TABLET },
});
