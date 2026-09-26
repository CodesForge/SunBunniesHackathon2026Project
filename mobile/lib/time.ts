import { ECONOMY } from "../data/economy";

export const TIME_SCALE = 1;

export const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function levelFromLast(lastAt: number, ratePerHour: number, now = Date.now()) {
  if (!lastAt) return 100;
  const hours = ((now - lastAt) / HOUR) * TIME_SCALE;
  return clamp(100 - hours * ratePerHour, 0, 100);
}

export function fullness(lastFedAt: number, now = Date.now()) {
  return levelFromLast(lastFedAt, ECONOMY.hungerPerHour, now);
}

export function sleepiness(lastSleptAt: number, now = Date.now()) {
  return levelFromLast(lastSleptAt, ECONOMY.sleepPerHour, now);
}

export function pendingIncomes(lastIncomeAt: number, now = Date.now()) {
  if (!lastIncomeAt) return 0;
  const passed = Math.floor(((now - lastIncomeAt) * TIME_SCALE) / WEEK);
  return clamp(passed, 0, 1);
}

export function daysUntilIncome(lastIncomeAt: number, now = Date.now()) {
  if (!lastIncomeAt) return 0;
  const passed = (now - lastIncomeAt) * TIME_SCALE;
  return Math.max(0, Math.ceil((WEEK - passed) / DAY));
}

export function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function energyLeft(dayKey: string, secondsToday: number) {
  if (dayKey !== todayKey()) return ECONOMY.dailySeconds;
  return clamp(ECONOMY.dailySeconds - secondsToday, 0, ECONOMY.dailySeconds);
}
