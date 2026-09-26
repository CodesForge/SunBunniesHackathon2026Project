import { Image, StyleSheet, View } from "react-native";

import { PET_ASSETS, type MouthKey, type PetSpecies } from "./petAssets";

type Props = {
  species?: PetSpecies;
  size?: number;
  mouth?: MouthKey;
};

export default function PetCoinRider({ species = "cat", size = 72, mouth = "happy" }: Props) {
  const assets = PET_ASSETS[species].mini;
  const w = size / assets.coreWidth;
  const h = w * assets.aspect;

  return (
    <View style={{ width: size, height: h, overflow: "visible" }} pointerEvents="none">
      <View style={{ position: "absolute", left: -w * assets.coreLeft, top: 0, width: w, height: h }}>
        <Image source={assets.tail} style={styles.layer} resizeMode="contain" />
        <Image source={assets.body} style={styles.layer} resizeMode="contain" />
        <Image source={assets.belly} style={styles.layer} resizeMode="contain" />
        <Image source={assets.armLeft} style={styles.layer} resizeMode="contain" />
        <Image source={assets.armRight} style={styles.layer} resizeMode="contain" />
        <Image source={assets.eyesOpen} style={styles.layer} resizeMode="contain" />
        <Image source={assets.mouth[mouth]} style={styles.layer} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});
