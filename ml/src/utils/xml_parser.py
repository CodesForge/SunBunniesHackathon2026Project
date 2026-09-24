from src.config.log.logging import logger


def load_raw_xml_prompt(file_path: str) -> str:
    try:
        with open(file_path, encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError as exc:
        logger.error("file not found: %s", exc)
        raise
