import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, font } from "../../theme";

export default function FoodShopScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.center}>
        <Text style={styles.text}>продукты</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { ...font.h2, color: colors.ink },
});
