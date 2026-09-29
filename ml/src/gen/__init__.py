import importlib
import sys
from pathlib import Path
 

_GEN_DIR = str(Path(__file__).resolve().parent)
if _GEN_DIR not in sys.path:
    sys.path.append(_GEN_DIR)
 

quiz_pb2 = importlib.import_module("quiz_pb2")
quiz_pb2_grpc = importlib.import_module("quiz_pb2_grpc")
 

sys.modules.setdefault(f"{__name__}.quiz_pb2", quiz_pb2)
sys.modules.setdefault(f"{__name__}.quiz_pb2_grpc", quiz_pb2_grpc)
