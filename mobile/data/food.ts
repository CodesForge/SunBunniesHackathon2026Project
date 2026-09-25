import type { ImageSourcePropType } from "react-native";

import type { Item } from "../store/pet";
import { ECONOMY } from "./economy";

export type FoodItem = Item & { image: ImageSourcePropType };

// Все продукты пока стоят одинаково (ECONOMY.mealCost) и покупаются
// из копилки "надо" — цены по отдельности обсудим позже.
export const FOOD_ITEMS: FoodItem[] = [
  {
    id: "soup",
    kind: "food",
    jar: "need",
    title: "Суп",
    price: ECONOMY.mealCost,
    art: "soup",
    image: require("../assets/food/soup.png"),
  },
  {
    id: "milk",
    kind: "food",
    jar: "need",
    title: "Молоко",
    price: ECONOMY.mealCost,
    art: "milk",
    image: require("../assets/food/milk.png"),
  },
  {
    id: "apple",
    kind: "food",
    jar: "need",
    title: "Яблоко",
    price: ECONOMY.mealCost,
    art: "apple",
    image: require("../assets/food/apple.png"),
  },
  {
    id: "salad",
    kind: "food",
    jar: "need",
    title: "Салат",
    price: ECONOMY.mealCost,
    art: "salad",
    image: require("../assets/food/salad.png"),
  },
  {
    id: "burger",
    kind: "food",
    jar: "need",
    title: "Бургер",
    price: ECONOMY.mealCost,
    art: "burger",
    image: require("../assets/food/burger.png"),
  },
  {
    id: "water",
    kind: "food",
    jar: "need",
    title: "Вода",
    price: ECONOMY.mealCost,
    art: "water",
    image: require("../assets/food/water.png"),
  },
  {
    id: "croissant",
    kind: "food",
    jar: "need",
    title: "Круассан",
    price: ECONOMY.mealCost,
    art: "croissant",
    image: require("../assets/food/croissant.png"),
  },
  {
    id: "sandwich",
    kind: "food",
    jar: "need",
    title: "Сэндвич",
    price: ECONOMY.mealCost,
    art: "sandwich",
    image: require("../assets/food/sandwich.png"),
  },
  {
    id: "blueberries",
    kind: "food",
    jar: "need",
    title: "Черника",
    price: ECONOMY.mealCost,
    art: "blueberries",
    image: require("../assets/food/blueberries.png"),
  },
];
