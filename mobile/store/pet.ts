import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ECONOMY, type Jar, type Theme } from "../data/economy";
import { HOUR, todayKey } from "../lib/time";

type Jars = { need: number; want: number; dream: number };

export type Item = {
  id: string;
  kind: "food" | "wear";
  jar: Jar;
  title: string;
  price: number;
  slot?: "body" | "head" | "face";
  art: string;
};

type State = {
  species: "dog" | "cat" | null;
  name: string;

  jars: Jars;
  plan: Jars;
  unallocated: number;

  lastIncomeAt: number;
  lastFedAt: number;
  lastSleptAt: number;
  periodIndex: number;

  xp: number;
  doneQuests: string[];

  owned: string[];
  foodOwned: Record<string, number>;
  worn: { body?: string; head?: string; face?: string };

  goalId: string | null;

  dayKey: string;
  secondsToday: number;

  history: { n: number; plan: Jars; spent: Jars; saved: number }[];

  themeStats: Record<Theme, { right: number; wrong: number }>;
  behavior: {
    planUnderMinNeed: number;
    wentHungry: number;
    withdrewFromDream: number;
    impulseBuys: number;
  };

  settings: { sound: boolean; motion: boolean };
  demoMode: boolean;
  username: string | null;
  dirty: boolean;
  lastSyncAt: number;
};

const EMPTY: Jars = { need: 0, want: 0, dream: 0 };

const initial: State = {
  species: null,
  name: "",
  jars: { ...EMPTY },
  plan: { ...EMPTY },
  unallocated: 0,
  lastIncomeAt: 0,
  lastFedAt: 0,
  lastSleptAt: 0,
  periodIndex: 1,
  xp: 0,
  doneQuests: [],
  owned: [],
  foodOwned: {},
  worn: {},
  goalId: null,
  dayKey: todayKey(),
  secondsToday: 0,
  history: [],
  themeStats: {
    planning: { right: 0, wrong: 0 },
    saving: { right: 0, wrong: 0 },
    spending: { right: 0, wrong: 0 },
  },
  behavior: {
    planUnderMinNeed: 0,
    wentHungry: 0,
    withdrewFromDream: 0,
    impulseBuys: 0,
  },
  settings: { sound: true, motion: true },
  demoMode: false,
  username: null,
  dirty: false,
  lastSyncAt: 0,
};

type Actions = {
  hatch: (species: "dog" | "cat", name: string, goalId: string) => void;
  setPlan: (p: Jars) => void;
  rebalance: (next: Jars) => void;
  feed: (foodId: string) => boolean;
  putToSleep: () => void;
  buy: (item: Item) => boolean;
  buyFood: (item: Item) => boolean;
  wear: (slot: "body" | "head" | "face", id: string) => void;
  putToDream: (amount: number) => boolean;
  withdrawFromDream: (amount: number) => boolean;
  completeQuest: (
    id: string,
    theme: Theme,
    reward: number,
    right: boolean,
  ) => void;
  nextPeriod: () => void;
  addSeconds: (s: number) => void;
  parentBonus: () => void;
  grantJars: (amount: Partial<Jars>) => void;
  addXp: (amount: number) => void;
  setSetting: (k: "sound" | "motion", v: boolean) => void;
  toggleDemo: () => void;
  reset: () => void;
};

export const usePet = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,

      hatch: (species, name, goalId) => {
        const now = Date.now();
        const fedBackdate =
          ((100 - ECONOMY.tutorialStartLevel) / ECONOMY.hungerPerHour) * HOUR;
        const sleepBackdate =
          ((100 - ECONOMY.tutorialStartLevel) / ECONOMY.sleepPerHour) * HOUR;
        set({
          species,
          name,
          goalId,
          unallocated: ECONOMY.weeklyIncome,
          lastIncomeAt: now,
          lastFedAt: now - fedBackdate,
          lastSleptAt: now - sleepBackdate,
          dirty: true,
        });
      },

      setPlan: (p) =>
        set((s) => ({
          jars: { ...p },
          plan: { ...p },
          unallocated: 0,
          behavior:
            p.need < ECONOMY.minNeed
              ? {
                  ...s.behavior,
                  planUnderMinNeed: s.behavior.planUnderMinNeed + 1,
                }
              : s.behavior,
          dirty: true,
        })),

      rebalance: (next) =>
        set((s) => ({
          jars: { ...next },
          behavior:
            next.dream < s.jars.dream
              ? {
                  ...s.behavior,
                  withdrewFromDream: s.behavior.withdrewFromDream + 1,
                }
              : s.behavior,
          dirty: true,
        })),

      // Без foodId — старое поведение (плоский расход из "надо").
      // С foodId — списывает конкретный купленный продукт со стола.
      feed: (foodId) => {
        const s = get();
        const qty = s.foodOwned[foodId] ?? 0;
        if (qty <= 0) return false;
        set({
          foodOwned: { ...s.foodOwned, [foodId]: qty - 1 },
          lastFedAt: Date.now(),
          dirty: true,
        });
        return true;
      },

      putToSleep: () => set({ lastSleptAt: Date.now(), dirty: true }),

      buy: (item) => {
        const s = get();
        if (s.jars[item.jar] < item.price) return false;
        set({
          jars: { ...s.jars, [item.jar]: s.jars[item.jar] - item.price },
          owned: s.owned.includes(item.id) ? s.owned : [...s.owned, item.id],
          dirty: true,
        });
        return true;
      },

      // Покупка продукта в магазине еды: списывает цену из копилки товара
      // и добавляет +1 к количеству на столе (foodOwned), в отличие от
      // buy() — тут можно купить один и тот же продукт много раз.
      buyFood: (item) => {
        const s = get();
        if (s.jars[item.jar] < item.price) return false;
        set({
          jars: { ...s.jars, [item.jar]: s.jars[item.jar] - item.price },
          foodOwned: {
            ...s.foodOwned,
            [item.id]: (s.foodOwned[item.id] ?? 0) + 1,
          },
          dirty: true,
        });
        return true;
      },

      wear: (slot, id) =>
        set((s) => ({ worn: { ...s.worn, [slot]: id }, dirty: true })),

      putToDream: (amount) => {
        const s = get();
        if (s.jars.want < amount) return false;
        set({
          jars: {
            ...s.jars,
            want: s.jars.want - amount,
            dream: s.jars.dream + amount,
          },
          dirty: true,
        });
        return true;
      },

      withdrawFromDream: (amount) => {
        const s = get();
        if (s.jars.dream < amount) return false;
        set({
          jars: {
            ...s.jars,
            dream: s.jars.dream - amount,
            want: s.jars.want + amount,
          },
          behavior: {
            ...s.behavior,
            withdrewFromDream: s.behavior.withdrewFromDream + 1,
          },
          dirty: true,
        });
        return true;
      },

      completeQuest: (id, theme, reward, right) =>
        set((s) => {
          const st = s.themeStats[theme];
          const themeStats = {
            ...s.themeStats,
            [theme]: right
              ? { ...st, right: st.right + 1 }
              : { ...st, wrong: st.wrong + 1 },
          };
          if (s.doneQuests.includes(id)) return { themeStats, dirty: true };
          return {
            doneQuests: [...s.doneQuests, id],
            jars: { ...s.jars, want: s.jars.want + reward },
            xp: s.xp + ECONOMY.xpPerQuest,
            themeStats,
            dirty: true,
          };
        }),

      nextPeriod: () =>
        set((s) => ({
          history: [
            ...s.history,
            {
              n: s.periodIndex,
              plan: s.plan,
              spent: {
                need: s.plan.need - s.jars.need,
                want: s.plan.want - s.jars.want,
                dream: 0,
              },
              saved: Math.max(0, s.jars.dream - s.plan.dream),
            },
          ].slice(-8),
          periodIndex: s.periodIndex + 1,
          plan: { ...EMPTY },
          jars: { ...s.jars, want: s.jars.want + ECONOMY.weeklyIncome },
          lastIncomeAt: Date.now(),
          dirty: true,
        })),

      addSeconds: (sec) =>
        set((s) => {
          const k = todayKey();
          return k !== s.dayKey
            ? { dayKey: k, secondsToday: sec }
            : { secondsToday: s.secondsToday + sec };
        }),

      parentBonus: () =>
        set((s) => ({
          jars: { ...s.jars, want: s.jars.want + ECONOMY.parentBonus },
          dirty: true,
        })),

      grantJars: (amount) =>
        set((s) => ({
          jars: {
            need: s.jars.need + (amount.need ?? 0),
            want: s.jars.want + (amount.want ?? 0),
            dream: s.jars.dream + (amount.dream ?? 0),
          },
          dirty: true,
        })),

      addXp: (amount) => set((s) => ({ xp: s.xp + amount, dirty: true })),

      setSetting: (k, v) =>
        set((s) => ({ settings: { ...s.settings, [k]: v } })),
      toggleDemo: () => set((s) => ({ demoMode: !s.demoMode })),
      reset: () => set({ ...initial, dayKey: todayKey() }),
    }),
    {
      name: "monetka-v1",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
