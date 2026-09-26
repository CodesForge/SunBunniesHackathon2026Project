import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

import { colors } from "../../theme";

const TRACK_WIDTH = 46;
const TRACK_HEIGHT = 25;
const THUMB_SIZE = 31;
const THUMB_OVERLAP = (THUMB_SIZE - TRACK_HEIGHT) / 2;

type PurpleSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
};

export default function PurpleSwitch({ value, onValueChange, accessibilityLabel }: PurpleSwitchProps) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const thumbLeft = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-THUMB_OVERLAP, TRACK_WIDTH - THUMB_SIZE + THUMB_OVERLAP],
  });

  const thumbColor = value ? colors.surface : colors.sceneOval;

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      style={styles.track}
    >
      <Animated.View style={[styles.thumb, { left: thumbLeft, backgroundColor: thumbColor }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: colors.statNormal,
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
