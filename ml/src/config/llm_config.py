from pydantic_settings import BaseSettings, SettingsConfigDict

from pydantic import SecretStr, Field
from functools import lru_cache

class LLM_settings(BaseSettings):
    auth_key: SecretStr = Field(min_length=1)
    scope: str = Field(min_length=1)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

@lru_cache(maxsize=1)
def get_llm_settings() -> LLM_settings:
    return LLM_settings()


