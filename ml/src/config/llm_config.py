from cachetools import TTLCache, cached
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class LLMSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    auth_key: SecretStr = Field(min_length=1)
    scope: str = Field(min_length=1)
    verify_ssl_certs: bool = Field(default=False)
    model: str = Field(min_length=1)
    timeout: float = Field(gt=0)
    max_retries: int = Field(ge=0)

@cached(cache=TTLCache(maxsize=1, ttl=300))
def get_llm_settings() -> LLMSettings:
    return LLMSettings()