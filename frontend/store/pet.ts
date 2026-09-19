import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ECONOMY, type Jar, type Theme } from "../data/economy";
import { todayKey } from "../lib/time";

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
  periodIndex: number;

  xp: number;
  doneQuests: string[];

  owned: string[];
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
  periodIndex: 1,
  xp: 0,
  doneQuests: [],
  owned: [],
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
  feed: () => boolean;
  buy: (item: Item) => boolean;
  wear: (slot: "body" | "head" | "face", id: string) => void;
  putToDream: (amount: number) => void;
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
  setSetting: (k: "sound" | "motion", v: boolean) => void;
  toggleDemo: () => void;
  reset: () => void;
};

export const usePet = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,

      hatch: (species, name, goalId) =>
        set({
          species,
          name,
          goalId,
          unallocated: ECONOMY.weeklyIncome,
          lastIncomeAt: Date.now(),
          lastFedAt: Date.now(),
          dirty: true,
        }),

      setPlan: (p) =>
        set((s) => {
          const jars = {
            need: s.jars.need + p.need,
            want: s.jars.want + p.want,
            dream: s.jars.dream + p.dream,
          };
          return {
            jars,
            plan: p,
            unallocated: 0,
            behavior:
              p.need < ECONOMY.minNeed
                ? {
                    ...s.behavior,
                    planUnderMinNeed: s.behavior.planUnderMinNeed + 1,
                  }
                : s.behavior,
            dirty: true,
          };
        }),

      feed: () => {
        const s = get();
        if (s.jars.need < ECONOMY.mealCost) return false;
        set({
          jars: { ...s.jars, need: s.jars.need - ECONOMY.mealCost },
          lastFedAt: Date.now(),
          dirty: true,
        });
        return true;
      },

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

      wear: (slot, id) =>
        set((s) => ({ worn: { ...s.worn, [slot]: id }, dirty: true })),

      putToDream: (amount) =>
        set((s) => ({
          jars: {
            ...s.jars,
            want: s.jars.want - amount,
            dream: s.jars.dream + amount,
          },
          dirty: true,
        })),

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
            unallocated: s.unallocated + reward,
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
              saved: s.jars.dream,
            },
          ].slice(-8),
          periodIndex: s.periodIndex + 1,
          plan: { ...EMPTY },
          unallocated: ECONOMY.weeklyIncome,
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
          unallocated: s.unallocated + ECONOMY.parentBonus,
          dirty: true,
        })),

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
