from gigachat import GigaChatAsyncClient, Messages, MessagesRole

from src.config.log.logging import logger
from src.depends.llm_client import create_llm_client
from src.models.llm_completion import LLMGenerationConfig
from src.providers.generate_llm_completion import generate_llm_completion
from src.utils.xml_parser import load_raw_xml_prompt


class LLMService:
    def __init__(self):
        self._client: GigaChatAsyncClient = create_llm_client()
        self._conversation_llm_system_prompt = load_raw_xml_prompt("src/prompts/conversation_llm_prompt.xml")

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

    async def close(self) -> None:
        await self._client.aclose()
