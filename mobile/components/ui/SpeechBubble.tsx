import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors, font, space } from "../../theme";

type SpeechBubbleProps = {
  text: string;
  radius?: number;
  tailSize?: number;
  stroke?: number;
};

const MIN_HEIGHT = 72;

export default function SpeechBubble({
  text,
  radius = 26,
  tailSize = 20,
  stroke = 4,
}: SpeechBubbleProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const w = size.width;
  const h = Math.max(size.height, MIN_HEIGHT);
  const r = Math.min(radius, h / 2 - stroke);

  const tailBase = Math.min(w * 0.3, 78);
  const tailNarrow = Math.max(tailBase - 28, r + 6);
  const tailTipX = Math.max(tailNarrow - 14, stroke);

  const d =
    w > 0
      ? [
          `M ${r} ${stroke / 2}`,
          `H ${w - r - stroke / 2}`,
          `A ${r} ${r} 0 0 1 ${w - stroke / 2} ${r}`,
          `V ${h - r - stroke / 2}`,
          `A ${r} ${r} 0 0 1 ${w - r - stroke / 2} ${h - stroke / 2}`,
          `H ${tailBase}`,
          `L ${tailTipX} ${h + tailSize - stroke / 2}`,
          `L ${tailNarrow} ${h - stroke / 2}`,
          `H ${r}`,
          `A ${r} ${r} 0 0 1 ${stroke / 2} ${h - r - stroke / 2}`,
          `V ${r}`,
          `A ${r} ${r} 0 0 1 ${r} ${stroke / 2}`,
          "Z",
        ].join(" ")
      : "";

  return (
    <View style={styles.root}>
      {w > 0 && (
        <Svg
          width={w}
          height={h + tailSize}
          style={styles.svg}
          pointerEvents="none"
        >
          <Path
            d={d}
            fill={colors.surface}
            stroke={colors.iconBorder}
            strokeWidth={stroke}
            strokeLinejoin="round"
          />
        </Svg>
      )}

      <View
        style={styles.textWrap}
        onLayout={(e) =>
          setSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          })
        }
      >
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center" },
  svg: { position: "absolute", top: 0, left: 0 },
  textWrap: {
    minHeight: MIN_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  text: { ...font.body, fontWeight: "700", color: colors.ink },
});
