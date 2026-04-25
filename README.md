# privAI

Saving you from sharing private info online.

## Problem statement

People often expose private or sensitive information on social media without realizing how easily it can be weaponized (OSINT-based profiling, doxxing, identity theft, targeted harassment, account takeover, etc.). The goal of this project is to reduce that risk by detecting potentially sensitive disclosures _before_ a post/comment is published.

## What this project is trying to do

`privAI` is a browser-extension-based system that monitors what a user is about to post on supported social platforms and runs client-side checks (and optional local ML assistance) to highlight content that may expose the user.

The core idea is:

- Observe the content the user is about to publish (text today; video/voice via transcription; images later).
- Identify “risky” snippets (PII, credentials, personal identifiers, location hints, etc.).
- Warn the user (and later: optionally block or require confirmation) before the platform receives the content.

## How it works (current architecture)

High-level flow:

1. **Browser extension content script** watches for user actions like “Post / Share / Tweet / Reply / Send”.
2. It extracts the active composer text (`div[role='textbox']`).
3. If a video element is present, it can fetch the video blob and send it to a **local** ML service for transcription.
4. A (planned) risk-scoring step classifies the text/transcript into a risk level (none/low/medium/high) and surfaces that in the extension UI.

Current ML endpoints in the repo:

- `POST /transcribe-video` — accepts an uploaded `.mp4`, uses `ffmpeg` to extract audio, transcribes with Faster-Whisper.
- `POST /analyze-risk` — stubbed endpoint intended to call a fine-tuned risk model and optionally notify an external service for medium/high risk.

## What’s implemented vs. what’s left

### Implemented (prototype/in-progress)

- Platform monitoring hooks for common “post/comment” button clicks.
- Text extraction from active composer.
- Basic platform state storage (connected/monitor toggles).
- Video detection + best-effort video fetch + local transcription request (`/transcribe-video`).
- ML backend skeleton using FastAPI + Faster-Whisper.

### Features left to implement

- **Image + video content understanding (true “analysis”)**
  - Transcription is only one step; actual _privacy-risk inference_ on multimedia still needs to be built.
  - Image analysis (OCR + sensitive visual entity detection) is currently out of scope / hard.
- **Real risk model integration**
  - Replace the `get_risk_level_from_model` stub with an actual model call.
  - Define what “bunch of data” means (windowing, summarization, entity extraction) before sending to the model.
- **User-facing UX for prevention**
  - Show warnings in-context (near composer) and/or in popup.
  - Optional “block publish until reviewed” mode.
- **Platform-by-platform hardening**
  - Each social platform has different composer DOM and upload flows; scrapers/monitors need iteration.

## Future enhancements (ideas)

Beyond privacy/PII protection, the longer-term vision is to detect and prevent harmful or policy-violating posts at the time of creation, such as:

- Harassment / threats / targeted abuse
- Incitement, protest/riot violence signals (context-sensitive)
- Defamation / “bad-mouthing” and other reputational harm patterns

This would require careful policy design, transparency, and false-positive management.

## Repository structure

- `extension/` — the browser extension (WXT + React + Tailwind)
  - `entrypoints/` contains background/content/popup entrypoints
  - `components/content/` contains DOM monitoring + scrapers
  - `components/background/` contains platform connect flows (e.g., LinkedIn)
  - `components/ui/` contains extension UI components
- `frontend/` — a separate React (Vite) web UI (auth pages + dashboard shell)
- `ml-backend/` — FastAPI service for ML-assisted features (e.g., transcription, risk scoring)
- `backend/` — placeholder (currently empty)

## Local development

### 1) Extension

From `extension/`:

- Install deps: `npm install`
- Dev (Chrome): `npm run dev`
- Dev (Firefox): `npm run dev:firefox`

WXT will output a dev extension build you can load into your browser (Chrome/Firefox extension dev workflow).

### 2) Frontend

From `frontend/`:

- Install deps: `npm install`
- Run dev server: `npm run dev`

### 3) ML backend

From `ml-backend/`:

- Create/activate a Python environment
- Install deps: `pip install -r requirements.txt`
- Run API (example): `uvicorn main_copy:app --reload --port 8000`

Notes:

- `ffmpeg` must be installed and available on `PATH` for `/transcribe-video`.
- Faster-Whisper is currently configured for CUDA (`device="cuda"`). If you don’t have a compatible GPU setup, you’ll need to adjust the configuration.
- CORS in the ML backend is currently restricted to `http://127.0.0.1:3000` and may need to be updated depending on where your UI runs.

## Current limitations

- Risk scoring is not wired to a real model yet (the API returns a placeholder).
- Multimedia “analysis” is not implemented beyond basic transcription.
- Platform-specific DOM differences may cause unreliable capture on some sites.

## Contributing

This repo is early-stage and evolving. If you’re contributing, keep changes minimal and focus on one capability at a time (monitoring → extraction → analysis → UX prevention).
