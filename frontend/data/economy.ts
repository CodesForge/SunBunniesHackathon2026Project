export const ECONOMY = {
  weeklyIncome: 1400,
  mealCost: 100,
  minNeed: 700,
  hungerPerHour: 8,
  dailySeconds: 20 * 60,
  questReward: 60,
  xpPerQuest: 1,
  stages: [0, 7, 18],
  parentBonus: 100,
} as const;

export type Jar = "need" | "want" | "dream";
export type Theme = "planning" | "saving" | "spending";
