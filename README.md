# Nichijou (Your everyday life)

React + Flask prototype that lets a user describe their day, then:
- **Gemini 3 Pro** shapes simple Japanese dialogue (with romaji/English) and teaching notes.
- **Gemini 3 Pro Image Preview** draws a manga page using that exact dialogue.
- The UI shows the manga plus a quick lesson (vocab + quiz) so users learn the lines they see.

## Why this exists

### 1. Pictures are glue for memory
Pictures provide context and emotion, helping you associate new words directly with their visual meaning. This creates a stronger memory anchor than text alone.

### 2. Personal relevance beats generic drills
Apps like Duolingo often start with generic phrases like "This is my little brother" or "This apple is red"—text you rarely use in real adult conversation. One of the best ways to learn is to talk about *your* actual day. The brain prioritizes information it deems relevant to your social functioning.

### 3. Immediately useful
With **Gemini 3 Pro**, for the first time, you have an app that personalizes learning to your current life.
- If you went to a boba shop today, you learn the Japanese for that *today*.
- You get vivid, relevant pictures of *your* specific activities.
- You can immediately use what you learned when a friend asks, "How was your day?"

This cycle of relevance and immediate repetition makes fluency attainable faster than endless references to "schools and libraries."


## Quickstart

1) Backend
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Create .env with your API key
echo "GEMINI_API_KEY=your_key_here" > .env
# Edit .env to add your actual key

python app.py
```

2) Frontend (in a second terminal)
```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api/*` to `localhost:5000` (see `frontend/vite.config.js`).

## Configuration

This project uses **Google's GenAI SDK**.

- **`GEMINI_API_KEY`**: Required. Used for both text generation (Gemini 3 Pro) and image generation (Gemini 3 Pro Image Preview).
- **`USE_MODEL_STUBS`**: Set to `true` in `.env` if you want to use offline stubs (no API usage). Default is `false`.

## API shape

- `GET /health` → `{status:"ok"}`
- `POST /api/reflect` → body `{entry, level}` → Gemini output `{teaching, script, manga_prompt}`
- `POST /api/manga` → body `{manga_prompt, panels}` → Gemini output `{image_data_url, panels, notes}`
- `POST /api/generate` → body `{entry, level}` → combined `{teaching, script, manga}`

## Project layout

- `backend/app.py` — Flask app + routes
- `backend/model_clients.py` — Integration with `google-genai` SDK.
- `frontend/src/App.jsx` — Main UI flow
- `frontend/src/components/*` — Manga preview, teaching panel, quiz block
