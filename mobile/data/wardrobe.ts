import type { ImageSourcePropType } from "react-native";
import type { Item } from "../store/pet";

export type WardrobeItem = Item & { image: ImageSourcePropType };

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
