from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class DatabaseSettings(BaseSettings):
    """Database settings for the application"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    user: str = Field(alias="POSTGRES_USER", min_length=1)
    password: SecretStr = Field(alias="POSTGRES_PASSWORD", min_length=1)
    host: str = Field(default="localhost", alias="POSTGRES_HOST")
    port: int = Field(default=5432, ge=1, le=65535, alias="POSTGRES_PORT")
    db: str = Field(alias="POSTGRES_DB", min_length=1)

    echo: bool = Field(default=False, alias="DB_ECHO")

    pool_size: int = Field(default=5, ge=1, le=100, alias="DB_POOL_SIZE")
    max_overflow: int = Field(default=10, ge=0, le=100, alias="DB_MAX_OVERFLOW")
    timeout: int = Field(default=30, ge=1, le=300, alias="DB_TIMEOUT")
    recycle: int = Field(default=1800, ge=1, le=3600, alias="DB_RECYCLE")
    pool_pre_ping: bool = Field(default=True, alias="DB_POOL_PRE_PING")

    @property
    def url(self) -> str:
        return URL.create(
            drivername="postgresql+asyncpg",
            username=self.user,
            password=self.password.get_secret_value(),
            host=self.host,
            port=self.port,
            database=self.db,
        ).render_as_string(hide_password=False)


@lru_cache(maxsize=1)
def get_db_settings() -> DatabaseSettings:
    return DatabaseSettings()
