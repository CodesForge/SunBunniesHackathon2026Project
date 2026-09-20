export const ECONOMY = {
  weeklyIncome: 100,
  mealCost: 5,
  minNeed: 50,
  hungerPerHour: 4,
  sleepPerHour: 40,
  tutorialStartLevel: 90,
  dailySeconds: 20 * 60,
  questReward: 10,
  xpPerQuest: 1,
  stages: [0, 7, 18],
  parentBonus: 20,
} as const;

export type Jar = "need" | "want" | "dream";
export type Theme = "planning" | "saving" | "spending";
