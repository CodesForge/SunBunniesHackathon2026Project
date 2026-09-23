from gigachat import GigaChatAsyncClient

from src.config.llm_config import get_llm_settings


def create_llm_client() -> GigaChatAsyncClient:
    settings = get_llm_settings()

    return GigaChatAsyncClient(
        credentials=settings.auth_key.get_secret_value(),
        scope=settings.scope,
        ca_bundle_file=settings.certificate,
        verify_ssl_certs=settings.verify_ssl_certs,
        model=settings.model,
        timeout=settings.timeout,
        max_retries=settings.max_retries,
        retry_on_status_codes=(429, 500, 502, 503, 504),
    )
