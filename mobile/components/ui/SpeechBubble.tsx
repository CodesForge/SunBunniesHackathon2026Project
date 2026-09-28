import { StyleSheet, Text, View } from "react-native";

import { colors, font, space } from "../../theme";

type SpeechBubbleProps = {
  text: string;
  radius?: number;
  stroke?: number;
};

const MIN_HEIGHT = 72;

export default function SpeechBubble({
  text,
  radius = 26,
  stroke = 4,
}: SpeechBubbleProps) {
  return (
    <View style={[styles.root, { borderRadius: radius, borderWidth: stroke }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: MIN_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    backgroundColor: colors.surface,
    borderColor: colors.iconBorder,
  },
  text: { ...font.body, fontWeight: "700", color: colors.ink },
});
