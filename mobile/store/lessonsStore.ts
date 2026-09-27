import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ECONOMY, rewardForMistakes } from "../data/economy";
import { LESSON_SECTIONS, getLesson, sectionForLesson, waveForLesson } from "../data/lessons";
import { usePet } from "./pet";

export type LessonResult = {
  lessonId: string;
  base: number;
  mistakes: number;
  reward: number;
};

type State = {
  completedLessons: string[];
  chestsOpened: number[];
  pendingChest: number | null;
  pendingPetGrowth: boolean;
  lastResult: LessonResult | null;
};

const initial: State = {
  completedLessons: [],
  chestsOpened: [],
  pendingChest: null,
  pendingPetGrowth: false,
  lastResult: null,
};

type Actions = {
  completeLesson: (id: string, mistakes?: number) => LessonResult | null;
  openChest: (waveIndex: number) => void;
  dismissPetGrowth: () => void;
  reset: () => void;
};

export const useLessons = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,

      completeLesson: (id, mistakes = 0) => {
        const s = get();
        const lesson = getLesson(id);
        if (!lesson) return null;

        const reward = rewardForMistakes(lesson.reward, mistakes);
        const result: LessonResult = {
          lessonId: id,
          base: lesson.reward,
          mistakes,
          reward,
        };

        if (s.completedLessons.includes(id)) {
          const repeat = { ...result, reward: 0 };
          set({ lastResult: repeat });
          return repeat;
        }

        const pet = usePet.getState();
        pet.grantJars({ want: reward });
        pet.addXp(1);

        const completedLessons = [...s.completedLessons, id];
        const section = sectionForLesson(lesson.number);
        const waveIndex = waveForLesson(lesson.number);
        const [sectionStart, sectionEnd] = LESSON_SECTIONS[section].range;

        let waveDone = true;
        for (let n = sectionStart; n <= sectionEnd; n++) {
          if (!completedLessons.includes(`l${n}`)) {
            waveDone = false;
            break;
          }
        }

        set({
          completedLessons,
          pendingChest:
            waveDone && !s.chestsOpened.includes(waveIndex)
              ? waveIndex
              : s.pendingChest,
          pendingPetGrowth: true,
          lastResult: result,
        });

        return result;
      },

      openChest: (waveIndex) => {
        const s = get();
        if (s.chestsOpened.includes(waveIndex)) return;

        usePet.getState().grantJars({ want: ECONOMY.chestReward });

        set({
          chestsOpened: [...s.chestsOpened, waveIndex],
          pendingChest: s.pendingChest === waveIndex ? null : s.pendingChest,
        });
      },

      dismissPetGrowth: () => set({ pendingPetGrowth: false }),

      reset: () => set({ ...initial }),
    }),
    {
      name: "lessons-v1",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function isLessonUnlocked(number: number, completedLessons: string[]) {
  if (number <= 1) return true;
  return completedLessons.includes(`l${number - 1}`);
}
