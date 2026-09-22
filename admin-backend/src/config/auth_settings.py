from functools import lru_cache
from typing import Literal

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    jwt_access_secret_key: SecretStr = Field(
        alias="JWT_ACCESS_SECRET_KEY",
    )
    jwt_refresh_secret_key: SecretStr = Field(
        alias="JWT_REFRESH_SECRET_KEY",
    )
    jwt_algorithm: str = Field(
        default="HS256",
        alias="JWT_ALGORITHM",
    )

    jwt_access_token_expires_minutes: int = Field(
        default=15,
        alias="JWT_ACCESS_TOKEN_EXPIRES_MINUTES",
    )
    jwt_refresh_token_expires_days: int = Field(
        default=30,
        alias="JWT_REFRESH_TOKEN_EXPIRES_DAYS",
    )

    cookie_secure: bool = Field(
        default=True,
        alias="COOKIE_SECURE",
    )
    cookie_samesite: Literal["strict", "none", "lax"] = Field(
        default="lax",
        alias="COOKIE_SAMESITE",
    )
    cookie_domain: str | None = Field(
        default=None,
        alias="COOKIE_DOMAIN",
    )


@lru_cache(maxsize=1)
def get_settings() -> AuthSettings:
    return AuthSettings()
