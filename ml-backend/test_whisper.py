from faster_whisper import WhisperModel
import torch

print("CUDA available:", torch.cuda.is_available())
print("GPU:", torch.cuda.get_device_name(0))

model = WhisperModel(
    "small",
    device="cuda",
    compute_type="float16"
)
print("Model instantiated",model)
print("Whisper model loaded successfully on GPU")
