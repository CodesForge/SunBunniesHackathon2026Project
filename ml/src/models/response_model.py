from pydantic import BaseModel, Field


class CorrectAnswer(BaseModel):
    content: str = Field(description="Правильный ответ на вопрос")

class AnswerOptions(BaseModel):
    A: str = Field(description="1 вариант ответа")
    B: str = Field(description="2 вариант ответа")
    C: str = Field(description="3 вариант ответа")
    correct_answer: CorrectAnswer

class ResponseModel(BaseModel):
    model_question: str = Field(description="Вопрос на тему 'Финансовая грамотность' ")
    answer_opt: AnswerOptions
