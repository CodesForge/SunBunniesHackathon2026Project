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

export async function getDailyQuestion(): Promise<DailyQuestion> {
  return FALLBACK_QUESTION;
}
