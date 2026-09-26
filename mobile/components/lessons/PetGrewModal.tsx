import { Modal as RNModal, Pressable, StyleSheet, Text, View } from "react-native";
import { PartyPopper } from "lucide-react-native";

import { colors, font, radius, space, HIT } from "../../theme";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function PetGrewModal({ visible, onClose }: Props) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <PartyPopper size={56} color={colors.sceneOval} strokeWidth={2} />
          <Text style={styles.title}>Питомец вырос!</Text>
          <Text style={styles.text}>
            Он подрастал вместе с тобой, пока ты проходил уроки. Так держать!
          </Text>

          <Pressable style={styles.button} onPress={onClose} accessibilityRole="button">
            <Text style={styles.buttonText}>Ура!</Text>
          </Pressable>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(42, 37, 32, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: space.xl,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.sceneOval,
    padding: space.xl,
    alignItems: "center",
    gap: space.sm,
  },
  title: { ...font.h2, color: colors.coinWant, textAlign: "center" },
  text: { ...font.body, color: colors.muted, textAlign: "center" },
  button: {
    marginTop: space.sm,
    minHeight: HIT,
    width: "100%",
    borderRadius: radius.pill,
    backgroundColor: colors.sceneOval,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { ...font.body, fontWeight: "700", color: colors.surface },
});
