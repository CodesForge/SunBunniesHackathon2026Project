const API_BASE_URL = "https://codesforge.ru";

type CreateUserResponse = {
  success: boolean;
  user: { id: string; username: string };
};

type CreateBalanceResponse = {
  success: boolean;
  balance: Record<string, unknown>;
};

type CreatePetResponse = {
  success: boolean;
  pet: Record<string, unknown>;
};

type CreateLessonResponse = {
  success: boolean;
  lesson: Record<string, unknown>;
};

type GenerateQuestionResponse = {
  answer: string;
};

async function postJson<T>(
  path: string,
  body: unknown,
  userId?: string,
): Promise<T | null> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (userId) headers["X-User-ID"] = userId;
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function createUser(username: string): Promise<string | null> {
  const data = await postJson<CreateUserResponse>("/user/create", { username });
  return data?.success ? data.user.id : null;
}

export async function createBalance(
  userId: string,
  mandatoryExpenses: number,
  discretionaryExpenses: number,
  dreamSavings: number,
): Promise<boolean> {
  const data = await postJson<CreateBalanceResponse>(
    "/balance/create",
    {
      mandatory_expenses: mandatoryExpenses,
      discretionary_expenses: discretionaryExpenses,
      dream_savings: dreamSavings,
    },
    userId,
  );
  return data?.success ?? false;
}

export async function createPet(userId: string, name: string): Promise<boolean> {
  const data = await postJson<CreatePetResponse>("/pet/create", { name }, userId);
  return data?.success ?? false;
}

export async function createLessonRecord(
  userId: string,
  completedLessonsCount: number,
): Promise<boolean> {
  const data = await postJson<CreateLessonResponse>(
    "/lesson/create",
    { completed_lessons_count: completedLessonsCount },
    userId,
  );
  return data?.success ?? false;
}

export async function generateQuizQuestion(message: string): Promise<string | null> {
  const data = await postJson<GenerateQuestionResponse>("/quiz/generate", { message });
  return data?.answer ?? null;
}
