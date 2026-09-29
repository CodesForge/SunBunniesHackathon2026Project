const REPLIES = [
  "Хороший вопрос! Дай мне подумать над этим.",
  "Понимаю, о чём ты, давай разберёмся вместе!",
  "Интересно! Расскажи об этом подробнее.",
  "Хм, попробуй спросить чуть иначе, пожалуйста.",
];

export async function getAssistantReply(message: string): Promise<string> {
  const index = message.length % REPLIES.length;
  return REPLIES[index];
}
