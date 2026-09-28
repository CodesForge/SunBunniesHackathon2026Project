import { usePet } from "../store/pet";

/**
 * Включены ли анимации. Возвращает false, когда в настройках стоит
 * «Отключить анимации» — требование доступности ТЗ 3.6.
 */
export function useMotion() {
  return usePet((s) => s.settings.motion);
}
