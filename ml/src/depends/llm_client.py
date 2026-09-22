from gigachat import GigaChatAsyncClient

from src.config.llm_config import get_llm_settings

settings = get_llm_settings()

async def create_llm_client() -> GigaChatAsyncClient:
    return GigaChatAsyncClient(
        credentials=settings.auth_key,
        scope=settings.scope,
        verify_ssl_certs=settings.verify_ssl_certs,
        model=settings.model,
        timeout=settings.timeout,
        max_retries=settings.max_retries,
        retry_on_status_codes=(429, 500, 502, 503, 504),
    )
