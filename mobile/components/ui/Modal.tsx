import { Modal as RNModal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, font, radius, space, HIT } from "../../theme";

type ModalProps = {
  visible: boolean;
  title: string;
  text?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel: () => void;
};

export default function Modal({
  visible,
  title,
  text,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          {!!text && <Text style={styles.text}>{text}</Text>}

          <View style={styles.buttons}>
            {!!cancelLabel && (
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.buttonGhost,
                  pressed && styles.pressed,
                ]}
                onPress={onCancel}
                accessibilityRole="button"
              >
                <Text style={styles.buttonGhostText}>{cancelLabel}</Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.buttonMain,
                pressed && styles.pressed,
              ]}
              onPress={onConfirm ?? onCancel}
              accessibilityRole="button"
            >
              <Text style={styles.buttonMainText}>
                {confirmLabel ?? "Понятно"}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
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
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.iconBorder,
    padding: space.xl,
    gap: space.md,
  },
  title: { ...font.h2, color: colors.ink, textAlign: "center" },
  text: { ...font.body, color: colors.muted, textAlign: "center" },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: space.md,
    marginTop: space.sm,
  },
  button: {
    minHeight: HIT,
    flex: 1,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonMain: { backgroundColor: colors.navActive },
  buttonMainText: { fontSize: 16, fontWeight: "800", color: colors.surface },
  buttonGhost: {
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.iconBorder,
  },
  buttonGhostText: { fontSize: 16, fontWeight: "800", color: colors.navActive },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
