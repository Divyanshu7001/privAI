from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil, uuid, subprocess
from faster_whisper import WhisperModel
import os
import httpx
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

print("Model loaded successfully.")

@app.post("/transcribe-video")
async def transcribe_video(file: UploadFile = File(...)):
    video_path = f"tmp_{uuid.uuid4()}.mp4"
    audio_path = video_path.replace(".mp4", ".wav")

    with open(video_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    subprocess.run([
        "ffmpeg", "-y", "-i", video_path,
        "-vn", "-ac", "1", "-ar", "16000",
        audio_path
    ], check=True)

    segments, _ = model.transcribe(audio_path)
    text = " ".join(seg.text for seg in segments)
    
    os.remove(video_path)
    os.remove(audio_path)
    return {"text": text}

@app.post("/analyze-risk")
async def analyze_risk(request: dict):
    """Analyze risk level for a given piece of text.

    This endpoint sends the text to a fine-tuned model (e.g. PG) to obtain
    a risk level (none/low/medium/high). For medium/high risk, it notifies
    an external service running on port 3001 to send email and update records.
    """

    text = request.get("text", "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Missing 'text' in request body")

    # TODO: Replace this stub with a real call to your PG fine-tuned model.
    risk_level = await get_risk_level_from_model(text)

    normalized_level = risk_level.lower()

    if normalized_level in ("medium", "high"):
        await notify_medium_high_risk(text=text, risk_level=normalized_level)

    return {"risk_level": normalized_level}


async def get_risk_level_from_model(text: str) -> str:
    """Call the fine-tuned model to classify risk.

    Replace this stub implementation with the actual integration to your
    PG fine-tuned model. It must return one of: "none", "low", "medium", "high".
    """

    # Placeholder logic – always returns "low" until wired up.
    # Implement your real model inference here.
    return "low"


async def notify_medium_high_risk(*, text: str, risk_level: str) -> None:
    """Notify external Node service for medium/high risk cases.

    Calls http://localhost:3001/sendmail-and-update-records with the text and
    risk level so the Node server can send email (via nodemailer) and update
    records accordingly.
    """

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:3001/sendmail-and-update-records",
                json={"text": text, "risk_level": risk_level},
                timeout=10.0,
            )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Failed to contact notification service: {exc}",
        ) from exc

    if response.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail=f"Notification service error: {response.status_code}",
        )

