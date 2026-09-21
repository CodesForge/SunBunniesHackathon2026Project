from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class AdminSettings(BaseSettings):
    """Bootstrap superadmin credentials loaded from environment."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    superadmin_username: str = Field(
        min_length=3, max_length=25, alias="SUPERADMIN_USERNAME"
    )
    superadmin_password: SecretStr = Field(
        min_length=8, max_length=200, alias="SUPERADMIN_PASSWORD"
    )


@lru_cache(maxsize=1)
def get_admin_settings() -> AdminSettings:
    return AdminSettings()
