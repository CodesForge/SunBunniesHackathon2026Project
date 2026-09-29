import grpc

from src.gen import quiz_pb2_grpc, quiz_pb2
from src.services.llm_service import LLMService


class QuizHandler(
    quiz_pb2_grpc.QuizServiceServicer
):
    def __init__(self, llm_service: LLMService):
        self._llm_service = llm_service


    async def GenerateQuestion(self, request, context):
        answer = await self._llm_service.conversation_llm(
            request.message
        )

        return quiz_pb2.GenerateQuestionResponse(
            answer=answer
        )