from collections.abc import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from src.config.database_settings import get_db_settings
from src.infrastructure.log.logger import logger


class DataBaseConfig:
    def __init__(self):
        s = get_db_settings()
        self._url = s.url
        self._echo = s.echo
        self._pool_size = s.pool_size
        self._max_overflow = s.max_overflow
        self._timeout = s.timeout
        self._recycle = s.recycle
        self._pre_ping = s.pool_pre_ping
        self._engine: AsyncEngine | None = None
        self._sessions: async_sessionmaker[AsyncSession] | None = None

    def _create_engine(self) -> AsyncEngine:
        return create_async_engine(
            self._url,
            echo=self._echo,
            pool_size=self._pool_size,
            max_overflow=self._max_overflow,
            pool_timeout=self._timeout,
            pool_recycle=self._recycle,
            pool_pre_ping=self._pre_ping,
            pool_use_lifo=True,
            connect_args={"timeout": 10},
        )

    async def connect(self) -> None:
        if self._engine is not None:
            return
        self._engine = self._create_engine()
        try:
            async with self._engine.connect() as c:
                await c.execute(text("SELECT 1"))
        except Exception:
            logger.exception("Database connect failed")
            await self._engine.dispose()
            self._engine = None
            raise
        self._sessions = async_sessionmaker(
            bind=self._engine, class_=AsyncSession,
            expire_on_commit=False, autoflush=False,
        )
        logger.info("Database connected")

    async def disconnect(self) -> None:
        if self._engine is None:
            return
        await self._engine.dispose()
        self._engine = None
        self._sessions = None
        logger.info("Database disconnected")

    @property
    def engine(self) -> AsyncEngine:
        if self._engine is None:
            raise RuntimeError("Call await connect() first")
        return self._engine

    async def session(self) -> AsyncGenerator[AsyncSession, None]:
        if self._sessions is None:
            raise RuntimeError("Call await connect() first")
        async with self._sessions() as s:
            try:
                yield s
            except Exception:
                await s.rollback()
                raise
