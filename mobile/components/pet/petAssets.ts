import type { ImageSourcePropType } from "react-native";

export type PetSpecies = "cat";
export type PetStage = "mini" | "idle";
export type MouthKey = "happy" | "neutral" | "sad";

export type PetAssetSet = {
  body: ImageSourcePropType;
  tail: ImageSourcePropType;
  armLeft: ImageSourcePropType;
  armRight: ImageSourcePropType;
  belly: ImageSourcePropType;
  eyesOpen: ImageSourcePropType;
  eyesClosed: ImageSourcePropType;
  mouth: Record<MouthKey, ImageSourcePropType>;
  aspect: number;
  coreLeft: number;
  coreWidth: number;
  armLeftOrigin: string;
  armRightOrigin: string;
  tailOrigin: string;
  // Область под надетую на тело вещь из гардероба (подгузник и т.п.) —
  // рисуется поверх пузика, но под ручками. Доли от ширины/высоты общего
  // холста питомца (того же "w"/"h", что и у остальных слоёв), картинка
  // вписывается через resizeMode="contain", так что реальные пропорции
  // самой вещи не важны — main её не растянет.
  bodyWearLeft: number;
  bodyWearTop: number;
  bodyWearWidth: number;
  bodyWearHeight: number;
};

const CAT_MINI: PetAssetSet = {
  body: require("../../assets/pets/cat/mini/body.png"),
  tail: require("../../assets/pets/cat/mini/tail.png"),
  armLeft: require("../../assets/pets/cat/mini/arm-left.png"),
  armRight: require("../../assets/pets/cat/mini/arm-right.png"),
  belly: require("../../assets/pets/cat/mini/belly.png"),
  eyesOpen: require("../../assets/pets/cat/mini/eyes-open.png"),
  eyesClosed: require("../../assets/pets/cat/mini/eyes-closed.png"),
  mouth: {
    happy: require("../../assets/pets/cat/mini/mouth-happy.png"),
    neutral: require("../../assets/pets/cat/mini/mouth-neutural.png"),
    sad: require("../../assets/pets/cat/mini/mouth-sad.png"),
  },
  aspect: 1217 / 900,
  coreLeft: 55 / 900,
  coreWidth: 780 / 900,
  armLeftOrigin: "46% 61%",
  armRightOrigin: "55% 62%",
  tailOrigin: "53% 87%",
  bodyWearLeft: 0.32,
  bodyWearTop: 0.70,
  bodyWearWidth: 0.36,
  bodyWearHeight: 0.16,
};

const CAT_IDLE: PetAssetSet = {
  body: require("../../assets/pets/cat/idle/body.png"),
  tail: require("../../assets/pets/cat/idle/tail.png"),
  armLeft: require("../../assets/pets/cat/idle/arm-left.png"),
  armRight: require("../../assets/pets/cat/idle/arm-right.png"),
  belly: require("../../assets/pets/cat/idle/belly.png"),
  eyesOpen: require("../../assets/pets/cat/idle/eyes-open.png"),
  eyesClosed: require("../../assets/pets/cat/idle/eyes-closed.png"),
  mouth: {
    happy: require("../../assets/pets/cat/idle/mouth-happy.png"),
    neutral: require("../../assets/pets/cat/idle/mouth-neutural.png"),
    sad: require("../../assets/pets/cat/idle/mouth-sad.png"),
  },
  aspect: 1217 / 900,
  coreLeft: 55 / 900,
  coreWidth: 780 / 900,
  armLeftOrigin: "46% 61%",
  armRightOrigin: "55% 62%",
  tailOrigin: "53% 87%",
  bodyWearLeft: 0.32,
  bodyWearTop: 0.70,
  bodyWearWidth: 0.36,
  bodyWearHeight: 0.16,
};

export const PET_ASSETS: Record<PetSpecies, Record<PetStage, PetAssetSet>> = {
  cat: {
    mini: CAT_MINI,
    idle: CAT_IDLE,
  },
};

