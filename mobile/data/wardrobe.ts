import type { ImageSourcePropType } from "react-native";
import type { Item } from "../store/pet";

export type WardrobeItem = Item & { image: ImageSourcePropType; preview?: ImageSourcePropType };

export type WardrobeOutfitItem = Item & {
  base: ImageSourcePropType;
  sleeveLeft: ImageSourcePropType;
  sleeveRight: ImageSourcePropType;
  preview?: ImageSourcePropType;
};

// Подгузники — вещи на "малышовом" (1-м) уровне питомца, разных цветов.
// Все подгузники стоят одинаково и покупаются из копилки "хочу".
export const WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: "diaper",
    kind: "wear",
    jar: "want",
    slot: "body",
    title: "Подгузник бежевый",
    price: 10,
    art: "diaper",
    image: require("../assets/wardrobe/diaper.png"),
  },
  {
    id: "diaper-coral",
    kind: "wear",
    jar: "want",
    slot: "body",
    title: "Подгузник коралловый",
    price: 10,
    art: "diaper-coral",
    image: require("../assets/wardrobe/diaper-coral.png"),
  },
  {
    id: "diaper-purple",
    kind: "wear",
    jar: "want",
    slot: "body",
    title: "Подгузник фиолетовый",
    price: 10,
    art: "diaper-purple",
    image: require("../assets/wardrobe/diaper-purple.png"),
  },
  {
    id: "diaper-blue",
    kind: "wear",
    jar: "want",
    slot: "body",
    title: "Подгузник голубой",
    price: 10,
    art: "diaper-blue",
    image: require("../assets/wardrobe/diaper-blue.png"),
  },
  {
    id: "diaper-pink",
    kind: "wear",
    jar: "want",
    slot: "body",
    title: "Подгузник розовый",
    price: 10,
    art: "diaper-pink",
    image: require("../assets/wardrobe/diaper-pink.png"),
  },
  {
    id: "diaper-green",
    kind: "wear",
    jar: "want",
    slot: "body",
    title: "Подгузник зелёный",
    price: 10,
    art: "diaper-green",
    image: require("../assets/wardrobe/diaper-green.png"),
  },
];

export const TEEN_ACCESSORY_ITEMS: WardrobeItem[] = [
  {
    id: "teen-bow",
    kind: "wear",
    jar: "want",
    slot: "head",
    title: "Бантик",
    price: 15,
    art: "teen-bow",
    image: require("../assets/wardrobe/teen/accessories/bow.png"),
    preview: require("../assets/wardrobe/teen/accessories/bow-preview.png"),
  },
  {
    id: "teen-beanie",
    kind: "wear",
    jar: "want",
    slot: "head",
    title: "Шапка",
    price: 15,
    art: "teen-beanie",
    image: require("../assets/wardrobe/teen/accessories/beanie.png"),
    preview: require("../assets/wardrobe/teen/accessories/beanie-preview.png"),
  },
  {
    id: "teen-beanie-propeller",
    kind: "wear",
    jar: "want",
    slot: "head",
    title: "Шапка с пропеллером",
    price: 20,
    art: "teen-beanie-propeller",
    image: require("../assets/wardrobe/teen/accessories/beanie-propeller.png"),
    preview: require("../assets/wardrobe/teen/accessories/beanie-propeller-preview.png"),
  },
];

export const TEEN_CLOTHING_ITEMS: WardrobeOutfitItem[] = [
  {
    id: "teen-girltshirt",
    kind: "wear",
    jar: "want",
    slot: "body",
    title: "Футболка",
    price: 25,
    art: "teen-girltshirt",
    base: require("../assets/wardrobe/teen/girltshirt/base.png"),
    sleeveLeft: require("../assets/wardrobe/teen/girltshirt/sleeve-left.png"),
    sleeveRight: require("../assets/wardrobe/teen/girltshirt/sleeve-right.png"),
    preview: require("../assets/wardrobe/teen/girltshirt/preview.png"),
  },
  {
    id: "teen-sweater",
    kind: "wear",
    jar: "want",
    slot: "body",
    title: "Свитер",
    price: 25,
    art: "teen-sweater",
    base: require("../assets/wardrobe/teen/sweater/base.png"),
    sleeveLeft: require("../assets/wardrobe/teen/sweater/sleeve-left.png"),
    sleeveRight: require("../assets/wardrobe/teen/sweater/sleeve-right.png"),
    preview: require("../assets/wardrobe/teen/sweater/preview.png"),
  },
  {
    id: "teen-tshirt",
    kind: "wear",
    jar: "want",
    slot: "body",
    title: "Майка",
    price: 25,
    art: "teen-tshirt",
    base: require("../assets/wardrobe/teen/tshirt/base.png"),
    sleeveLeft: require("../assets/wardrobe/teen/tshirt/sleeve-left.png"),
    sleeveRight: require("../assets/wardrobe/teen/tshirt/sleeve-right.png"),
    preview: require("../assets/wardrobe/teen/tshirt/preview.png"),
  },
];

export type WornOutfit = { base: ImageSourcePropType; sleeveLeft: ImageSourcePropType; sleeveRight: ImageSourcePropType };

export type WornVisuals = {
  bodyWear?: ImageSourcePropType;
  outfit?: WornOutfit;
  headWear?: ImageSourcePropType;
};

export function resolveWornVisuals(worn: { body?: string; head?: string }, isTeen: boolean): WornVisuals {
  const visuals: WornVisuals = {};

  if (worn.body) {
    if (isTeen) {
      const outfitItem = TEEN_CLOTHING_ITEMS.find((i) => i.id === worn.body);
      if (outfitItem) {
        visuals.outfit = { base: outfitItem.base, sleeveLeft: outfitItem.sleeveLeft, sleeveRight: outfitItem.sleeveRight };
      }
    } else {
      const bodyItem = WARDROBE_ITEMS.find((i) => i.id === worn.body);
      if (bodyItem) visuals.bodyWear = bodyItem.image;
    }
  }

  if (worn.head && isTeen) {
    const headItem = TEEN_ACCESSORY_ITEMS.find((i) => i.id === worn.head);
    if (headItem) visuals.headWear = headItem.image;
  }

  return visuals;
}
