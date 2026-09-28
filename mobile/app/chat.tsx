import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";

import RoundIconButton from "../components/ui/RoundIconButton";
import { getAssistantReply } from "../lib/chatAssistant";
import { colors, font, radius, space } from "../theme";

type ChatMessage = {
  id: string;
  from: "user" | "assistant";
  text: string;
};

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [value, setValue] = useState("");
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setMessages((m) => [...m, { id: `${Date.now()}-u`, from: "user", text: trimmed }]);
    setValue("");

    getAssistantReply(trimmed).then((reply) => {
      setMessages((m) => [...m, { id: `${Date.now()}-a`, from: "assistant", text: reply }]);
    });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.content} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <RoundIconButton
            icon={ArrowLeft}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/home" as any)
            }
            accessibilityRole="button"
            accessibilityLabel="Назад"
          />
        </View>

        <KeyboardAvoidingView
          style={styles.flexOne}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bubble,
                  item.from === "user" ? styles.bubbleUser : styles.bubbleAssistant,
                ]}
              >
                <Text style={styles.bubbleText}>{item.text}</Text>
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput
              value={value}
              onChangeText={setValue}
              style={styles.input}
              placeholder="Написать сообщение..."
              placeholderTextColor={colors.muted}
              returnKeyType="send"
              onSubmitEditing={send}
            />
            <Pressable
              style={[styles.sendButton, !value.trim() && styles.sendButtonDisabled]}
              onPress={send}
              disabled={!value.trim()}
              accessibilityRole="button"
              accessibilityLabel="Отправить"
            >
              <Send size={20} color={colors.surface} strokeWidth={2.5} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1 },
  flexOne: { flex: 1 },
  header: { paddingHorizontal: space.lg, paddingTop: space.sm },
  listContent: { padding: space.lg, gap: space.md, flexGrow: 1 },
  bubble: {
    maxWidth: "80%",
    borderRadius: radius.lg,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: colors.jarWantBg,
  },
  bubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  bubbleText: { ...font.body, color: colors.ink },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    paddingHorizontal: space.lg,
    fontSize: font.body.fontSize,
    lineHeight: font.body.lineHeight,
    color: colors.ink,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.pillBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: { opacity: 0.4 },
});
