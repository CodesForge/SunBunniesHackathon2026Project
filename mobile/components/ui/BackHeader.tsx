import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import RoundIconButton from "./RoundIconButton";
import { space } from "../../theme";

type BackHeaderProps = {
  /** Куда уйти, если возвращаться некуда — например при заходе по ссылке. */
  backHref: string;
  onPress?: () => void;
};

export default function BackHeader({ backHref, onPress }: BackHeaderProps) {
  const router = useRouter();

  // Возврат снимает экран со стека, а не кладёт новую копию поверх.
  // Иначе путь настройки → родитель → назад оставлял в стеке вторые
  // настройки, и следующее «назад» уводило обратно к родителю.
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace(backHref as any);
  };

  return (
    <View style={styles.root}>
      <RoundIconButton
        icon={ArrowLeft}
        onPress={onPress ?? goBack}
        accessibilityRole="button"
        accessibilityLabel="Назад"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: space.lg, paddingTop: space.sm },
});
