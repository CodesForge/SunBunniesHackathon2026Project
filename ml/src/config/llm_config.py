from cachetools import TTLCache, cached
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class LLMSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

    auth_key: SecretStr = Field(min_length=1)
    scope: str = Field(min_length=1)

@cached(cache=TTLCache(maxsize=1, ttl=300))
def get_llm_settings() -> LLMSettings:
    return LLMSettings()