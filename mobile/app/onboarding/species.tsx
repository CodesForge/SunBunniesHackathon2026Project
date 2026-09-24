import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RoundButton } from "../../components/onboarding/buttons";
import { BigOval, Clouds, Leaves, ONB, SkyBackground } from "../../components/onboarding/scene";
import { PetMini } from "../../components/pet/PetMini";
import { PET_ASSETS } from "../../components/pet/petAssets";
import { PetIcon } from "../../components/pet/PetIcon";
import { colors, font, space } from "../../theme";
import { usePet } from "../../store/pet";

const MIN = 3;
const MAX = 25;

const COIN_WIDTH = 0.52;
const COIN_TOP = 0.42;
const COIN_SURFACE = 0.45;
const CAT_WIDTH = 58;
const CAT_FEET = 0.891;

const CAROUSEL_OFFSETS = [-2, -1, 0, 1, 2];
const CAROUSEL_SIZES = [34, 46, 60, 46, 34];
const CAROUSEL_STEP = 54;

type PetOption = {
  key: string;
  title: string;
  species?: "cat" | "dog";
  ready: boolean;
  icon: ImageSourcePropType;
};

const PETS: PetOption[] = [
  { key: "cat", title: "Кот", species: "cat", ready: true, icon: require("../../assets/icons/pet-icons/cat.png") },
  { key: "dog", title: "Собака", species: "dog", ready: false, icon: require("../../assets/icons/pet-icons/dog.png") },
  { key: "hamster", title: "Хомяк", ready: false, icon: require("../../assets/icons/pet-icons/hamster.png") },
  { key: "fox", title: "Лиса", ready: false, icon: require("../../assets/icons/pet-icons/fox.png") },
  { key: "mouse", title: "Мышка", ready: false, icon: require("../../assets/icons/pet-icons/mouse.png") },
  { key: "bunny", title: "Зайка", ready: false, icon: require("../../assets/icons/pet-icons/bunny.png") },
];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function ChooseSpeciesScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const hatch = usePet((s) => s.hatch);

  const [index, setIndex] = useState(PETS.findIndex((p) => p.ready));
  const [petName, setPetName] = useState("");

  const pet = PETS[mod(index, PETS.length)];
  const trimmedName = petName.trim();
  const nameOk = trimmedName.length >= MIN && trimmedName.length <= MAX;
  const canGo = pet.ready && !!pet.species && nameOk;

  const rowShift = useSharedValue(0);

  const move = (delta: number) => {
    rowShift.value = delta * CAROUSEL_STEP;
    rowShift.value = withTiming(0, { duration: 260, easing: Easing.out(Easing.cubic) });
    setIndex((i) => i + delta);
  };

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rowShift.value }],
  }));

  const finish = () => {
    if (!canGo || !pet.species) return;
    hatch(pet.species, trimmedName, "");
    router.replace("/home" as any);
  };

  const coinW = width * COIN_WIDTH;
  const coinH = (coinW * 647) / 1146;
  const coinTop = height * COIN_TOP;

  const catW = (width * CAT_WIDTH) / 100;
  const catH = catW * PET_ASSETS.cat.mini.aspect;
  const catTop = coinTop + coinH * COIN_SURFACE - catH * CAT_FEET;

  const arrowsTop = coinTop - coinH * 0.2;

  return (
    <View style={styles.root}>
      <SkyBackground />
      <Clouds />
      <BigOval top={ONB.ovalHigh} />
      <Leaves source={require("../../assets/items/first-enter/coins-and-leaves-choose.png")} mode="in" />

      <SafeAreaView style={styles.safe} edges={["top"]} pointerEvents="box-none">
        <Animated.View style={[styles.carousel, rowStyle]}>
          {CAROUSEL_OFFSETS.map((offset) => {
            const i = mod(index + offset, PETS.length);
            const slot = PETS[i];
            const size = CAROUSEL_SIZES[offset + 2];
            const isCenter = offset === 0;
            return (
              <Pressable key={`${slot.key}-${offset}`} onPress={() => move(offset)} hitSlop={4}>
                <PetIcon icon={slot.icon} size={size} active={isCenter} />
              </Pressable>
            );
          })}
        </Animated.View>
      </SafeAreaView>

      <View style={[styles.centerRow, { top: coinTop }]} pointerEvents="none">
        <Image
          source={require("../../assets/items/first-enter/coin-under-pet.png")}
          style={{ width: coinW, height: coinH }}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.centerRow, { top: catTop }]} pointerEvents="none">
        <Animated.View key={pet.key} entering={FadeIn.duration(220)} exiting={FadeOut.duration(160)}>
          {pet.ready ? (
            <PetMini species="cat" widthPercent={CAT_WIDTH} mouth="happy" eyesOpen />
          ) : (
            <View style={[styles.stub, { width: catW, height: catH }]}>
              <Image source={pet.icon} style={{ width: catW * 0.5, height: catW * 0.5 }} resizeMode="contain" />
              <Text style={styles.stubTitle}>{pet.title}</Text>
              <Text style={styles.stubText}>скоро появится</Text>
            </View>
          )}
        </Animated.View>
      </View>

      <View style={[styles.arrows, { top: arrowsTop }]}>
        <Pressable onPress={() => move(-1)} hitSlop={12} style={styles.arrowHit}>
          <ChevronLeft size={44} color={colors.surface} strokeWidth={3.5} />
        </Pressable>
        <Pressable onPress={() => move(1)} hitSlop={12} style={styles.arrowHit}>
          <ChevronRight size={44} color={colors.surface} strokeWidth={3.5} />
        </Pressable>
      </View>

      <SafeAreaView style={styles.safe} edges={["bottom"]} pointerEvents="box-none">
        <View style={styles.bottomBlock} pointerEvents="box-none">
          <Text style={styles.nameLabel}>Выбери имя питомца!</Text>

          <TextInput
            value={petName}
            onChangeText={setPetName}
            placeholder="Имя..."
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            maxLength={MAX}
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={finish}
          />
          {!nameOk && (
            <Text style={styles.hint}>
              От {MIN} до {MAX} символов
            </Text>
          )}

          <View style={styles.nextSlot}>
            <RoundButton onPress={finish} disabled={!canGo} />
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ONB.bg },
  safe: { flex: 1 },
  centerRow: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  arrows: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  arrowHit: { padding: 6 },
  stub: {
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
  },
  stubTitle: {
    ...font.h2,
    color: colors.surface,
  },
  stubText: {
    ...font.small,
    fontWeight: "600",
    color: colors.surface,
    opacity: 0.85,
  },
  bottomBlock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "3%",
    alignItems: "center",
  },
  nameLabel: {
    ...font.h2,
    color: colors.surface,
    textAlign: "center",
    textShadowColor: "rgba(80, 90, 190, 0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  input: {
    marginTop: space.sm,
    width: "58%",
    height: 46,
    borderRadius: 999,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    fontSize: 17,
    fontWeight: "700",
    color: colors.sceneOval,
    textAlign: "center",
  },
  hint: {
    marginTop: space.xs,
    ...font.small,
    fontWeight: "600",
    color: colors.surface,
    opacity: 0.9,
  },
  nextSlot: { marginTop: space.md },
  carousel: {
    marginTop: space.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
  },
});

