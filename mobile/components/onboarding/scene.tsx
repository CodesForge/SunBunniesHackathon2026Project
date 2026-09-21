import { useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Ellipse } from "react-native-svg";

export const ONB = {
  bg: "#C2DDFB",
  oval: "#818BFE",
  arrow: "#838DFC",

  ovalWidth: 672 / 340,
  ovalAspect: 672 / 608,

  ovalLow: 0.58,
  ovalHigh: 0.33,

  sheetAspect: 3508 / 1956,

  fast: 600,
  normal: 800,
} as const;

export function SkyBackground() {
  return <View style={styles.fill} />;
}

export function Clouds() {
  const { width } = useWindowDimensions();
  return (
    <Image
      source={require("../../assets/items/first-enter/clouds.png")}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height: width * ONB.sheetAspect,
      }}
      resizeMode="contain"
    />
  );
}

type LeavesProps = {
  source: ImageSourcePropType;
  mode?: "in" | "out" | "static";
};

export function Leaves({ source, mode = "static" }: LeavesProps) {
  const { width, height } = useWindowDimensions();
  const sheetH = width * ONB.sheetAspect;

  const shift = useSharedValue(mode === "in" ? height : 0);

  useEffect(() => {
    if (mode === "in") {
      shift.value = withTiming(0, {
        duration: ONB.normal,
        easing: Easing.inOut(Easing.quad),
      });
    }
    if (mode === "out") {
      shift.value = withTiming(height, {
        duration: ONB.fast,
        easing: Easing.inOut(Easing.quad),
      });
    }
  }, [mode, height]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: shift.value }],
  }));

  return (
    <Animated.Image
      source={source}
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          width,
          height: sheetH,
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
}

type OvalProps = {
  top: number;
  from?: number;
};

export function BigOval({ top, from }: OvalProps) {
  const { width, height } = useWindowDimensions();
  const w = width * ONB.ovalWidth;
  const h = w / ONB.ovalAspect;

  const y = useSharedValue((from ?? top) * height);

  useEffect(() => {
    if (from == null) {
      y.value = top * height;
      return;
    }
    y.value = withTiming(top * height, {
      duration: ONB.normal,
      easing: Easing.inOut(Easing.quad),
    });
  }, [top, from, height]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: "absolute", top: 0, left: (width - w) / 2, width: w, height: h },
        style,
      ]}
    >
      <Svg width={w} height={h}>
        <Ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill={ONB.oval} />
      </Svg>
      <View
        style={{
          position: "absolute",
          top: h - 1,
          left: 0,
          width: w,
          height: height,
          backgroundColor: ONB.oval,
        }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: ONB.bg,
  },
});
