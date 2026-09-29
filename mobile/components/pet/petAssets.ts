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
  diaper?: ImageSourcePropType;
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
  armsUnderBody: true,
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
  armsUnderBody: true,
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

const DOG_MINI: PetAssetSet = {
  body: require("../../assets/pets/dog/mini/body.png"),
  tail: require("../../assets/pets/dog/mini/tail.png"),
  armLeft: require("../../assets/pets/dog/mini/arm-left.png"),
  armRight: require("../../assets/pets/dog/mini/arm-right.png"),
  belly: require("../../assets/pets/dog/mini/belly.png"),
  diaper: require("../../assets/pets/dog/mini/diaper.png"),
  eyesOpen: require("../../assets/pets/dog/mini/eyes-open.png"),
  eyesClosed: require("../../assets/pets/dog/mini/eyes-closed.png"),
  mouth: {
    happy: require("../../assets/pets/dog/mini/mouth-happy.png"),
    neutral: require("../../assets/pets/dog/mini/mouth-neutural.png"),
    sad: require("../../assets/pets/dog/mini/mouth-sad.png"),
  },
  aspect: 2309 / 1707,
  coreLeft: 100 / 1707,
  coreWidth: 1523 / 1707,
  armLeftOrigin: "47% 60%",
  armRightOrigin: "54% 61%",
  tailOrigin: "51% 79%",
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
    mini: DOG_MINI,
    teen: DOG_TEEN,
    adult: DOG_ADULT,
  },
};

export function getPetStage(xp: number): PetAgeStage {
  if (xp >= ECONOMY.adultLevel) return "adult";
  if (xp >= ECONOMY.teenLevel) return "teen";
  return "mini";
}

export type SleepAssetSet = {
  body: ImageSourcePropType;
  eyesOpen: ImageSourcePropType;
  eyesClosed: ImageSourcePropType;
  mouthOpen: ImageSourcePropType;
  mouthClosed: ImageSourcePropType;
  aspect: number;
  eyesOpenRect: { left: number; top: number; width: number; height: number };
  eyesClosedRect: { left: number; top: number; width: number; height: number };
  mouthClosedRect: { left: number; top: number; width: number; height: number };
  mouthOpenRect: { left: number; top: number; width: number; height: number };
};

const CAT_SLEEP: SleepAssetSet = {
  body: require("../../assets/sleep/body.png"),
  eyesOpen: require("../../assets/sleep/eyes-open.png"),
  eyesClosed: require("../../assets/sleep/eyes-closed.png"),
  mouthOpen: require("../../assets/sleep/mouth-open.png"),
  mouthClosed: require("../../assets/sleep/mouth-closed.png"),
  aspect: 1025 / 1772,
  eyesOpenRect: { left: 0.3832, top: 0.4712, width: 0.2297, height: 0.0829 },
  eyesClosedRect: { left: 0.3832, top: 0.4712, width: 0.2297, height: 0.0829 },
  mouthClosedRect: { left: 0.4024, top: 0.4976, width: 0.1868, height: 0.1698 },
  mouthOpenRect: { left: 0.4024, top: 0.4976, width: 0.1868, height: 0.2351 },
};

const DOG_SLEEP: SleepAssetSet = {
  body: require("../../assets/sleep/dog/body.png"),
  eyesOpen: require("../../assets/sleep/dog/eyes-open.png"),
  eyesClosed: require("../../assets/sleep/dog/eyes-closed.png"),
  mouthOpen: require("../../assets/sleep/dog/mouth-open.png"),
  mouthClosed: require("../../assets/sleep/dog/mouth-closed.png"),
  aspect: 1161 / 1772,
  eyesOpenRect: { left: 0.3900, top: 0.4936, width: 0.2206, height: 0.0594 },
  eyesClosedRect: { left: 0.3877, top: 0.5194, width: 0.2218, height: 0.0345 },
  mouthClosedRect: { left: 0.4261, top: 0.5116, width: 0.1445, height: 0.1275 },
  mouthOpenRect: { left: 0.4244, top: 0.5150, width: 0.1507, height: 0.1981 },
};

export const SLEEP_ASSETS: Record<PetSpecies, SleepAssetSet> = {
  cat: CAT_SLEEP,
  dog: DOG_SLEEP,
};
