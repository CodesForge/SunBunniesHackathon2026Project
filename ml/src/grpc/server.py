import grpc
from src.config.log.logging import logger
from src.gen import quiz_pb2_grpc
from src.gen import quiz_pb2
from src.grpc.quiz_handler import QuizHandler
from src.services.llm_service import LLMService


async def server():
    llm_service = LLMService()

    quiz_service = QuizHandler(
        llm_service=llm_service
    )

    server = grpc.aio.server()

    quiz_pb2_grpc.add_QuizServiceServicer_to_server(
        server=server,
        servicer=quiz_service
    )

    server.add_insecure_port("[::]:50051")

    await server.start()

    logger.info("server is running...")

    try:
        await server.wait_for_termination()
    finally:
        await server.stop(grace=5)
        logger.info("server stopped")


import asyncio
if __name__=="__main__":
    asyncio.run(server())