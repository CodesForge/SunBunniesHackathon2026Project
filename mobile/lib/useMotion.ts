import { usePet } from "../store/pet";

export function useMotion() {
  return usePet((s) => s.settings.motion);
}
