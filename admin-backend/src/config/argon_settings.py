from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class ArgonSettings(BaseSettings):
    """Argon2id password hashing settings loaded from environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    time_cost: int = Field(
        default=3, ge=1, le=10, alias="ARGON_TIME_COST"
    )
    memory_cost: int = Field(
        default=65536, ge=8192, le=1048576, alias="ARGON_MEMORY_COST"
    )
    parallelism: int = Field(
        default=4, ge=1, le=16, alias="ARGON_PARALLELISM"
    )
    hash_length: int = Field(
        default=32, ge=16, le=64, alias="ARGON_HASH_LENGTH"
    )
    salt_length: int = Field(
        default=16, ge=8, le=32, alias="ARGON_SALT_LENGTH"
    )


@lru_cache(maxsize=1)
def get_argon_settings() -> ArgonSettings:
    return ArgonSettings()
