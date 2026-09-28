import type { LessonSection } from "../../data/lessons";
import { colors } from "../../theme";

export const LESSON_BG = "#E8EAFF";
export const LESSON_TITLE = "#653EF0";
export const LESSON_DONE_TITLE = colors.sceneOval;
export const LESSON_BODY_TEXT = "#6E7AFE";

export const LESSON_ORANGE = "#FFA600";
export const LESSON_GREEN = "#4AC000";
export const LESSON_RED = "#FD6C59";
export const LESSON_RED_BG = "#FEEAE8";

export const SECTION_PALETTE: Record<
  LessonSection,
  { header: string; body: string; title: string }
> = {
  1: { header: "#23C82E", body: "#ECFFE8", title: colors.surface },
  2: { header: colors.pillBorder, body: "#E8EAFF", title: colors.surface },
  3: { header: colors.coinDreamBg, body: "#FFF6E8", title: colors.surface },
  4: { header: "#E14F39", body: "#FFF0ED", title: colors.surface },
};
