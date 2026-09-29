import { generateQuizQuestion } from "./api";

export type DailyQuestion = {
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
};

const FALLBACK_QUESTION: DailyQuestion = {
  question: "Зачем откладывать часть карманных денег в копилку?",
  options: [
    "Чтобы накопить на мечту",
    "Чтобы монеты не потерялись",
    "Просто так, без причины",
  ],
  correctOption: "Чтобы накопить на мечту",
  explanation: "Если понемногу откладывать каждый раз, накопленное быстрее превращается в то, о чём ты мечтаешь.",
};

const QUIZ_PROMPT =
  'Придумай один вопрос дня про финансовую грамотность для ребёнка. Ответь строго в формате JSON без лишнего текста: {"question": "...", "options": ["...", "...", "..."], "correctOption": "...", "explanation": "..."}. correctOption должен точно совпадать с одним из options.';

function parseDailyQuestion(raw: string): DailyQuestion | null {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (
      typeof parsed.question === "string" &&
      Array.isArray(parsed.options) &&
      parsed.options.length >= 2 &&
      parsed.options.every((o: unknown) => typeof o === "string") &&
      typeof parsed.correctOption === "string" &&
      parsed.options.includes(parsed.correctOption) &&
      typeof parsed.explanation === "string"
    ) {
      return parsed as DailyQuestion;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getDailyQuestion(): Promise<DailyQuestion> {
  const answer = await generateQuizQuestion(QUIZ_PROMPT);
  if (!answer) return FALLBACK_QUESTION;
  return parseDailyQuestion(answer) ?? FALLBACK_QUESTION;
}
