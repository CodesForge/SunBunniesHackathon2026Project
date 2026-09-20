from typing import Literal

from gigachat import Messages
from pydantic import BaseModel, Field


class LLMGenerationConfig(BaseModel):
    messages: list[Messages] = Field(
        min_length=1
    )
    reasoning_effort: Literal['low', 'medium', 'high'] | None = Field(
        default=None,
        description="Model reasoning depth level"
    )
    temperature: float | None = Field(
        default=None,
        ge=0.0,
        le=2.0,
        description="The higher, the more random the answer."
    )
    