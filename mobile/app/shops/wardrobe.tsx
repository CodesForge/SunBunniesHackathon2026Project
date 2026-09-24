import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, font } from "../../theme";

// TODO: заменить на полноценный экран гардероба, когда придут ассеты аксессуаров
export default function WardrobeShopScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.center}>
        <Text style={styles.text}>Гардероб</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { ...font.h2, color: colors.ink },
});
