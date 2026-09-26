import { useEffect } from "react";
import { AppState } from "react-native";

import { usePet } from "../store/pet";
import { pendingIncomes } from "./time";

export function usePeriodIncome() {
  useEffect(() => {
    const check = () => {
      const state = usePet.getState();
      if (!state.species) return;
      if (pendingIncomes(state.lastIncomeAt) > 0) state.nextPeriod();
    };

    if (usePet.persist.hasHydrated()) check();
    const unsubscribe = usePet.persist.onFinishHydration(check);

    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "active") check();
    });

    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, []);
}
