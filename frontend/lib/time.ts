import { ECONOMY } from "../data/economy";

export const TIME_SCALE = 1;

const HOUR = 3_600_000;
const WEEK = 7 * 24 * HOUR;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function fullness(lastFedAt: number, now = Date.now()) {
  if (!lastFedAt) return 100;
  const hours = ((now - lastFedAt) / HOUR) * TIME_SCALE;
  return clamp(100 - hours * ECONOMY.hungerPerHour, 0, 100);
}

export function pendingIncomes(lastIncomeAt: number, now = Date.now()) {
  if (!lastIncomeAt) return 0;
  const passed = Math.floor(((now - lastIncomeAt) * TIME_SCALE) / WEEK);
  return clamp(passed, 0, 1);
}

export function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function energyLeft(dayKey: string, secondsToday: number) {
  if (dayKey !== todayKey()) return ECONOMY.dailySeconds;
  return clamp(ECONOMY.dailySeconds - secondsToday, 0, ECONOMY.dailySeconds);
}

console.log(fullness(Date.now() - 5 * 3600000));
console.log(fullness(Date.now() - 30 * 3600000));
