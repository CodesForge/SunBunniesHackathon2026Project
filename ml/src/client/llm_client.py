from gigachat import Chat, GigaChatAsyncClient
from gigachat.exceptions import AuthenticationError, ModelNotSpecifiedError, NotFoundError

from src.config.llm_config import get_llm_settings as s
from src.models.llm_completion import LLMGenerationConfig


async def generate_llm_completion(
    config: LLMGenerationConfig
) :
    try :
        async with GigaChatAsyncClient(
            credentials=s.auth_key,
            scope=s.scope,
            verify_ssl_certs=False,
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
                temperature=config.temperature
            )

            response = await client.achat(payload=payload)
            return response.choices[0].message.content
        
    except AuthenticationError as exc:
        return {
            "error": "Ошибка авторизации",
            "status_code": {exc.status_code},
            "content": {exc.content}
        }
    except ModelNotSpecifiedError as exc:
        return {
            "error": "Модель не указана в параметрах",
            "status_code": {exc.status_code},
            "content": {exc.content}
        }
    except NotFoundError as exc:
        return {
            "error": "Модель не найдена",
            "status_code": {exc.status_code},
            "content": {exc.content}
        }
    