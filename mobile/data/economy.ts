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
  teenLevel: 6,
  adultLevel: 13,
  // Сколько недель, прожитых по плану, нужно вдобавок к очкам роста.
  // Уроками их заменить нельзя — иначе питомец взрослеет мимо бюджета.
  teenPeriods: 1,
  adultPeriods: 2,
  parentBonus: 200,
  chestReward: 150,
  lessonTiredness: 30,
  lessonEnergyMin: 45,
  sleepFullMinutes: 40,
  lessonPenalties: [0, 10, 15, 20],
  lessonRewardFloor: 20,
  mistakePenalty: 5,
} as const;

export type Jar = "need" | "want" | "dream";
export type Theme = "planning" | "saving" | "spending";

export function rewardForMistakes(base: number, mistakes: number) {
  const steps = ECONOMY.lessonPenalties;
  const penalty = steps[Math.min(Math.max(mistakes, 0), steps.length - 1)];
  return Math.max(ECONOMY.lessonRewardFloor, base - penalty);
}
