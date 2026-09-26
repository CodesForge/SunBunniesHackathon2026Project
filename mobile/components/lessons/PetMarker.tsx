import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Star } from "lucide-react-native";

const SIZE = 32;
const FLOAT_DISTANCE = 6;
const FLOAT_DURATION = 900;

export default function PetMarker() {
  const opacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: FLOAT_DURATION,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: FLOAT_DURATION,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [opacity, float]);

  const translateY = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -FLOAT_DISTANCE],
  });

  return (
    <Animated.View pointerEvents="none" style={{ opacity, transform: [{ translateY }] }}>
      <Star size={SIZE} color="#FFFFFF" fill="#FFD84D" strokeWidth={2.5} />
    </Animated.View>
  );
}
