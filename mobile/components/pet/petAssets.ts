import type { ImageSourcePropType } from "react-native";
import { ECONOMY } from "../../data/economy";

export type PetSpecies = "cat" | "dog";
export type PetAgeStage = "mini" | "teen" | "adult";
export type MouthKey = "happy" | "neutral" | "sad";

export type PetAssetSet = {
  body: ImageSourcePropType;
  head?: ImageSourcePropType;
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
  armsUnderBody?: boolean;
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

const CAT_TEEN: PetAssetSet = {
  body: require("../../assets/pets/cat/teen/body.png"),
  head: require("../../assets/pets/cat/teen/head.png"),
  tail: require("../../assets/pets/cat/teen/tail.png"),
  armLeft: require("../../assets/pets/cat/teen/arm-left.png"),
  armRight: require("../../assets/pets/cat/teen/arm-right.png"),
  belly: require("../../assets/pets/cat/teen/belly.png"),
  eyesOpen: require("../../assets/pets/cat/teen/eyes-open.png"),
  eyesClosed: require("../../assets/pets/cat/teen/eyes-closed.png"),
  mouth: {
    happy: require("../../assets/pets/cat/teen/mouth-happy.png"),
    neutral: require("../../assets/pets/cat/teen/mouth-neutural.png"),
    sad: require("../../assets/pets/cat/teen/mouth-sad.png"),
  },
  aspect: 2309 / 1707,
  coreLeft: 152 / 1707,
  coreWidth: 1065 / 1707,
  armLeftOrigin: "42% 49%",
  armRightOrigin: "38% 49%",
  tailOrigin: "53% 87%",
  bodyWearLeft: 0.32,
  bodyWearTop: 0.70,
  bodyWearWidth: 0.36,
  bodyWearHeight: 0.16,
};

const CAT_ADULT: PetAssetSet = {
  body: require("../../assets/pets/cat/adult/body.png"),
  head: require("../../assets/pets/cat/adult/head.png"),
  tail: require("../../assets/pets/cat/adult/tail.png"),
  armLeft: require("../../assets/pets/cat/adult/arm-left.png"),
  armRight: require("../../assets/pets/cat/adult/arm-right.png"),
  belly: require("../../assets/pets/cat/adult/belly.png"),
  eyesOpen: require("../../assets/pets/cat/adult/eyes-open.png"),
  eyesClosed: require("../../assets/pets/cat/adult/eyes-closed.png"),
  mouth: {
    happy: require("../../assets/pets/cat/adult/mouth-happy.png"),
    neutral: require("../../assets/pets/cat/adult/mouth-neutural.png"),
    sad: require("../../assets/pets/cat/adult/mouth-sad.png"),
  },
  aspect: 2309 / 1707,
  coreLeft: 153 / 1707,
  coreWidth: 1067 / 1707,
  armLeftOrigin: "37% 48%",
  armRightOrigin: "43% 48%",
  tailOrigin: "53% 87%",
  armsUnderBody: true,
  bodyWearLeft: 0.32,
  bodyWearTop: 0.70,
  bodyWearWidth: 0.36,
  bodyWearHeight: 0.16,
};

const DOG_TEEN: PetAssetSet = {
  body: require("../../assets/pets/dog/teen/body.png"),
  head: require("../../assets/pets/dog/teen/head.png"),
  tail: require("../../assets/pets/dog/teen/tail.png"),
  armLeft: require("../../assets/pets/dog/teen/arm-left.png"),
  armRight: require("../../assets/pets/dog/teen/arm-right.png"),
  belly: require("../../assets/pets/dog/teen/belly.png"),
  eyesOpen: require("../../assets/pets/dog/teen/eyes-open.png"),
  eyesClosed: require("../../assets/pets/dog/teen/eyes-closed.png"),
  mouth: {
    happy: require("../../assets/pets/dog/teen/mouth-happy.png"),
    neutral: require("../../assets/pets/dog/teen/mouth-neutural.png"),
    sad: require("../../assets/pets/dog/teen/mouth-sad.png"),
  },
  aspect: 2309 / 1707,
  coreLeft: 41 / 1707,
  coreWidth: 1307 / 1707,
  armLeftOrigin: "42% 49%",
  armRightOrigin: "38% 49%",
  tailOrigin: "53% 87%",
  bodyWearLeft: 0.32,
  bodyWearTop: 0.70,
  bodyWearWidth: 0.36,
  bodyWearHeight: 0.16,
};

const DOG_ADULT: PetAssetSet = {
  body: require("../../assets/pets/dog/adult/body.png"),
  head: require("../../assets/pets/dog/adult/head.png"),
  tail: require("../../assets/pets/dog/adult/tail.png"),
  armLeft: require("../../assets/pets/dog/adult/arm-left.png"),
  armRight: require("../../assets/pets/dog/adult/arm-right.png"),
  belly: require("../../assets/pets/dog/adult/belly.png"),
  eyesOpen: require("../../assets/pets/dog/adult/eyes-open.png"),
  eyesClosed: require("../../assets/pets/dog/adult/eyes-closed.png"),
  mouth: {
    happy: require("../../assets/pets/dog/adult/mouth-happy.png"),
    neutral: require("../../assets/pets/dog/adult/mouth-neutural.png"),
    sad: require("../../assets/pets/dog/adult/mouth-sad.png"),
  },
  aspect: 2309 / 1707,
  coreLeft: 27 / 1707,
  coreWidth: 1321 / 1707,
  armLeftOrigin: "37% 48%",
  armRightOrigin: "43% 48%",
  tailOrigin: "53% 87%",
  armsUnderBody: true,
  bodyWearLeft: 0.32,
  bodyWearTop: 0.70,
  bodyWearWidth: 0.36,
  bodyWearHeight: 0.16,
};

export const PET_ASSETS: Record<PetSpecies, Partial<Record<PetAgeStage, PetAssetSet>>> = {
  cat: {
    mini: CAT_MINI,
    teen: CAT_TEEN,
    adult: CAT_ADULT,
  },
  dog: {
    teen: DOG_TEEN,
    adult: DOG_ADULT,
  },
};

export function getPetStage(xp: number): PetAgeStage {
  if (xp >= ECONOMY.adultLevel) return "adult";
  if (xp >= ECONOMY.teenLevel) return "teen";
  return "mini";
}
