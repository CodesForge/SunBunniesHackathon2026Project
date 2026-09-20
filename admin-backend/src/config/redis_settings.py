from functools import lru_cache

from pydantic import Field, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class RedisSettings(BaseSettings):
    """Redis connection and pool settings loaded from environment."""
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    url: RedisDsn = Field(default="redis://localhost:6379/0", alias="REDIS_URL")

    max_connections: int = Field(
        default=50, ge=1, le=1000, alias="REDIS_MAX_CONNECTIONS"
    )
    socket_connect_timeout: float = Field(
        default=5.0, ge=0.1, le=60.0, alias="REDIS_SOCKET_CONNECT_TIMEOUT"
    )
    socket_timeout: float = Field(
        default=5.0, ge=0.1, le=60.0, alias="REDIS_SOCKET_TIMEOUT"
    )
    health_check_interval: int = Field(
        default=30, ge=0, le=600, alias="REDIS_HEALTH_CHECK_INTERVAL"
    )
    retry_on_timeout: bool = Field(default=True, alias="REDIS_RETRY_ON_TIMEOUT")
    decode_responses: bool = Field(default=True, alias="REDIS_DECODE_RESPONSES")


@lru_cache(maxsize=1)
def get_redis_settings() -> RedisSettings:
    return RedisSettings()
