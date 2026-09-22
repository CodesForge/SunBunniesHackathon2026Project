from gigachat import Chat, GigaChatAsyncClient
from gigachat.exceptions import GigaChatException
from gigachat.models import JsonSchemaResponseFormat

from src.config.log.logging import logger
from src.models.llm_completion import LLMGenerationConfig


class LLMCompletionError(Exception):
    pass

async def generate_llm_completion(
    client: GigaChatAsyncClient,
    config: LLMGenerationConfig,
    response_format: JsonSchemaResponseFormat | None = None
) -> str:
    payload = Chat(
        messages=config.messages,
        temperature=config.temperature,
        reasoning_effort=config.reasoning_effort,
        response_format=response_format
    )

    try:
        response = await client.achat(payload=payload)
    except GigaChatException as exc:
        logger.error("GigaChat API error: %s", exc, exc_info=True)
        raise LLMCompletionError(f"GigaChat API call failed: {exc}") from exc
    except Exception as exc:
        logger.error("Unexpected error during LLM generation: %s", exc, exc_info=True)
        raise LLMCompletionError(f"Unexpected LLM error: {exc}") from exc

    if not response.choices or not response.choices[0].message.content:
        logger.error("LLM return empty response or choices. Response: %s", response)
        raise LLMCompletionError("LLM returned empty response or response was blocked")

    return response.choices[0].message.content
