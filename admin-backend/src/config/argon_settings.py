from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class ArgonSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    time_cost: int = Field(
        default=3, ge=1, le=10, alias="ARGON_TIME_COAT",
    )
    memory_cost: int = Field(
        default=65536, ge=8192, le=1048576, alias="ARGON_MEMORY_COST",
    )
    parallelism: int = Field(
        default=4, ge=1, le=16, alias="ARGON_PARRALELISM",
    )
    hash_lenght: int = Field(
        default=32, ge=16, le=64, alias="ARGON_HASH_LENGHT",
    )
    salt_lenght: int = Field(
        default=16, ge=8, le=32, alias="ARGON_SALT_LENGHT",
    )

@lru_cache(maxsize=1)
def get_argon_settings() -> ArgonSettings:
    return ArgonSettings()
