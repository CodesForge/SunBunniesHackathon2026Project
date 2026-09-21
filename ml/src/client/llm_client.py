from gigachat import Chat, GigaChatAsyncClient
from gigachat.exceptions import GigaChatException
from gigachat.models import JsonSchemaResponseFormat

from src.config.llm_config import get_llm_settings as s
from src.models.llm_completion import LLMGenerationConfig


async def generate_llm_completion(
    config: LLMGenerationConfig,
    response_format: JsonSchemaResponseFormat | None = None
) -> str:
    try:
        async with GigaChatAsyncClient(
            credentials=s.auth_key,
            scope=s.scope,
            verify_ssl_certs=True,
            model="GigaChat-3-Lightning",
            timeout=16,
            max_retries=3,
            retry_on_status_codes=(
                429, 500, 502, 503, 504
            )
        ) as client:
            payload = Chat(
                messages=config.messages,
                reasoning_effort=config.reasoning_effort,
                temperature=config.temperature,
                response_format=response_format
            )

            response = await client.achat(payload=payload)
    except GigaChatException as exc:
        return f"Failed to get a response: {exc}"

    return response.choices[0].message.content
