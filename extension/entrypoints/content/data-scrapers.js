export const logPostOrComment = (platform, kind, text) => {
  console.log(`[privAI][${platform}] New ${kind} text:`, text.trim());
  // TODO: Later send `text` to backend API (and optionally audio) for analysis.
};

export const getActiveComposerText = () => {
  const active = document.activeElement;
  if (
    active &&
    active.getAttribute &&
    active.getAttribute("role") === "textbox"
  ) {
    return active.innerText || active.textContent || "";
  }

  const boxes = Array.from(document.querySelectorAll("div[role='textbox']"));
  // Prefer the last visible textbox (often the one the user just interacted with)
  for (let i = boxes.length - 1; i >= 0; i -= 1) {
    const el = boxes[i];
    if (el && el.offsetParent !== null) {
      return el.innerText || el.textContent || "";
    }
  }

  return "";
};

export const logVideoIfPresent = async (platform) => {
  const videos = Array.from(document.querySelectorAll("video"));
  if (!videos.length) return;

  const video = videos[0];
  const src = video.currentSrc || video.src || null;
  const duration = Number.isFinite(video.duration) ? video.duration : null;

  console.log(`[privAI][${platform}] Detected video for transcription`, {
    src,
    duration,
    muted: video.muted,
    hasAudioTrack: !video.muted, // heuristic only
  });

  if (!src) {
    console.warn("[privAI] No video src available to transcribe");
    return;
  }

  try {
    const videoResponse = await fetch(src);
    if (!videoResponse.ok) {
      console.warn(
        "[privAI] Failed to fetch video for transcription",
        videoResponse.status,
        videoResponse.statusText
      );
      return;
    }

    const blob = await videoResponse.blob();
    const formData = new FormData();
    // Best-effort filename and type; FastAPI only cares it's a file.
    const fileName = `post-video-${Date.now()}.mp4`;
    const file = new File([blob], fileName, { type: blob.type || "video/mp4" });
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/transcribe-video", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.warn(
        "[privAI] /transcribe-video request failed",
        response.status,
        response.statusText
      );
      return;
    }

    const data = await response.json().catch(() => null);
    console.log("[privAI] Transcription result:", data);
  } catch (error) {
    console.warn(
      "[privAI] Error while sending video to /transcribe-video",
      error
    );
  }
};