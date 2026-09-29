import { generateQuizQuestion } from "./api";

const FALLBACK_REPLIES = [
  "Хороший вопрос! Дай мне подумать над этим.",
  "Понимаю, о чём ты, давай разберёмся вместе!",
  "Интересно! Расскажи об этом подробнее.",
  "Хм, попробуй спросить чуть иначе, пожалуйста.",
];

function fallbackReply(message: string): string {
  const index = message.length % FALLBACK_REPLIES.length;
  return FALLBACK_REPLIES[index];
}

export async function getAssistantReply(message: string): Promise<string> {
  const answer = await generateQuizQuestion(message);
  return answer ?? fallbackReply(message);
}
