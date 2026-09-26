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
  1: { header: "#CAFFBF", body: "#ECFFE8", title: "#23C82E" },
  2: { header: "#D5D9FF", body: "#E8EAFF", title: "#653EF0" },
  3: { header: "#FFE1B0", body: "#FFF6E8", title: "#C97A00" },
  4: { header: "#FFD2CB", body: "#FFF0ED", title: "#E14F39" },
};
