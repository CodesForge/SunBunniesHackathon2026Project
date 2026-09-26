from gigachat import GigaChatAsyncClient, Messages, MessagesRole
from gigachat.models import JsonSchemaResponseFormat

from src.depends.llm_client import create_llm_client
from src.models.llm_completion import LLMGenerationConfig
from src.models.response_model import ResponseModel
from src.providers.generate_llm_completion import generate_llm_completion
from src.utils.xml_parser import load_raw_xml_prompt

CONVERSATION_PROMPT_PATH = "src/prompts/conversation_llm_prompt.xml"
QUIZ_PROMPT_PATH = "src/prompts/quiz_llm_prompt.xml"

class LLMService:
    def __init__(self):
        self._client: GigaChatAsyncClient = create_llm_client()

        self._conversation_llm_system_prompt = load_raw_xml_prompt(CONVERSATION_PROMPT_PATH)
        self._quiz_llm_system_prompt = load_raw_xml_prompt(QUIZ_PROMPT_PATH)

    async def conversation_llm(self, prompt: str) -> str:

        return await generate_llm_completion(
            client=self._client,
            config=LLMGenerationConfig(
                messages=[
                    Messages(
                        role=MessagesRole.SYSTEM,
                        content=self._conversation_llm_system_prompt
                    ),
                    Messages(
                        role=MessagesRole.USER,
                        content=prompt
                    )
                ],
                temperature=0.6,
                reasoning_effort='low'
            )
        )

    async def quiz_llm(self) -> str:
        return await generate_llm_completion(
            client=self._client,
            config=LLMGenerationConfig(
                messages=[
                    Messages(
                        role=MessagesRole.SYSTEM,
                        content=self._quiz_llm_system_prompt
                    )
                ],
                temperature=1.0,
                reasoning_effort='medium'
            ),
            response_format=JsonSchemaResponseFormat(
                schema=ResponseModel,
                strict=True
            )
        )

    async def close(self) -> None:
        await self._client.aclose()
