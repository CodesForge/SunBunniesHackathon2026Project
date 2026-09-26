import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import RoundIconButton from "./RoundIconButton";
import { space } from "../../theme";

type BackHeaderProps = {
  backHref: string;
};

export default function BackHeader({ backHref }: BackHeaderProps) {
  return (
    <View style={styles.root}>
      <Link href={backHref as any} asChild>
        <RoundIconButton
          icon={ArrowLeft}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: space.lg, paddingTop: space.sm },
});
