export const ECONOMY = {
  weeklyIncome: 1400,
  mealCost: 50,
  minNeed: 700,
  hungerPerHour: 4,
  sleepPerHour: 40,
  tutorialStartLevel: 90,
  dailySeconds: 20 * 60,
  questReward: 100,
  xpPerQuest: 1,
  stages: [0, 1, 3],
  parentBonus: 200,
} as const;

export type Jar = "need" | "want" | "dream";
export type Theme = "planning" | "saving" | "spending";
