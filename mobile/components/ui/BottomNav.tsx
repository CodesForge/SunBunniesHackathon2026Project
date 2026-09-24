import { useEffect } from "react";
import {
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
import {
  BookOpen,
  Home,
  MoonStar,
  ShoppingCart,
  Utensils,
  type LucideIcon,
} from "lucide-react-native";

import { colors } from "../../theme";

type Tab = {
  key: string;
  Icon: LucideIcon;
  route: string;
  label: string;
  badge?: number;
};

const TABS: Tab[] = [
  {
    key: "shop",
    Icon: ShoppingCart,
    route: "/wardrobe",
    label: "Гардероб",
    badge: 1,
  },
  { key: "moon", Icon: MoonStar, route: "/sleep", label: "Спальня" },
  { key: "home", Icon: Home, route: "/home", label: "Комната" },
  { key: "food", Icon: Utensils, route: "/food", label: "Кухня" },
  {
    key: "book",
    Icon: BookOpen,
    route: "/glossary",
    label: "Уроки",
    badge: 7,
  },
];

const BAR_HEIGHT = 80;
const HOME_INDEX = 2;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const found = TABS.findIndex((t) => t.route === pathname);
  const activeIndex = found === -1 ? HOME_INDEX : found;
  const tabWidth = width / TABS.length;

  const pos = useSharedValue(activeIndex);

  useEffect(() => {
    pos.value = withSpring(activeIndex, {
      damping: 26,
      stiffness: 140,
      mass: 1,
    });
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
  width,
  onPress,
}: {
  tab: Tab;
  active: boolean;
  width: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(active ? 1.25 : 1);
  const lift = useSharedValue(active ? -10 : 0);

  useEffect(() => {
    scale.value = withSpring(active ? 1.25 : 1, {
      damping: 12,
      stiffness: 200,
    });
    lift.value = withSpring(active ? -10 : 0, { damping: 14, stiffness: 200 });
  }, [active]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: lift.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: withTiming(active ? 1 : 0.85, { duration: 150 }),
  }));

  const { Icon } = tab;

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
        <Icon size={38} color={colors.surface} strokeWidth={active ? 2.4 : 2.2} />
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
