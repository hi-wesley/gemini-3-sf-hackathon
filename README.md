# Nichijou (Your everyday life)

**Don't study generic phrases. See, hear, and learn the language of your actual life.**

Nichijou is a React + Flask application that uses **Gemini 3 Pro** and **Nano Banana Pro** to transform your personal journal entries into interactive Japanese manga lessons.

## Hackathon Problem Statements

This project directly addresses two core challenges:

### Statement Three: Gemini as a Teacher
**Nichijou** unleashes Gemini not as a chatbot, but as an active instructor. Instead of static lessons, it creates **dynamic, personalized curricula** on the fly.
- **Bespoke Curriculum:** It analyzes a simple user journal entry and extracts a complete lesson plan—vocabulary, grammar points, and cultural nuances relevant directly to the user's actual day.
- **Active Evaluation:** It generates interactive quizzes to verify understanding immediately, creating a tight feedback loop between content generation and knowledge retention.

### Statement Four: Multi-Modelity
**Nichijou** demonstrates a rich multi-modal experience by orchestrating **Gemini 3 Pro**, **Nano Banana Pro**, and **Google Cloud TTS**.
- **Reasoning Bridge:** Gemini 3 Pro doesn't just pass text; it *reasons* about the emotional context and setting of the journal entry to craft precise visual prompts.
- **Tri-Modal Reinforcement:** The user engages with the same content through three distinct senses: reading the script (Text), seeing the scene (Nano Banana Pro), and hearing the native pronunciation (Cloud Audio). This layering creates a robust "rich multi-modal experience" that accelerates language acquisition far beyond unimodal apps.

---

## Why this exists

### 1. Pictures are glue for memory
Pictures provide context and emotion, helping you associate new words directly with their visual meaning. This creates a stronger memory anchor than text alone.

### 2. Personal relevance beats generic drills
Apps like Duolingo often start with generic phrases like "This is my little brother" text you rarely use as an adult. The brain prioritizes information it deems relevant to your social functioning. By using *your* day as the source material, Nichijou hacks your brain's relevance filters.

### 3. Immediately useful
- If you went to a boba shop today, you learn the Japanese for that *today*.
- You get vivid, relevant pictures of *your* specific activities.
- You can immediately use what you learned when a friend asks, "How was your day?"

---

## Features

- **Custom Manga Generation:** Turns your daily journal entry into a stylized manga panel with Japanese dialogue bubbles.
- **Audio Pronunciation:** High-quality text-to-speech (via Google Cloud TTS) for every line, letting you shadow native pronunciation.
- **Granular Loading:** Watch the creative process happen in real-time ("Writing dialogue...", "Drawing manga...").
- **Memory Lane:** A sticky sidebar that automatically saves your last 2 days of entries/lessons.
- **Shareable Day Card:** Generate a beautiful, branded image of your manga panel + translations to share on social media.
- **Gemini 3 Native:** Built from the ground up to leverage the newest reasoning and multi-modal capabilities.

---

## Quickstart

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Create .env with your credentials
# GEMINI_API_KEY=your_key_here
# GOOGLE_APPLICATION_CREDENTIALS=path/to/gcp_key.json
python app.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173/

Vite proxies `/api/*` to `localhost:5000`.

---

## Configuration

- **`GEMINI_API_KEY`**: Required. Used for text generation (Gemini 3 Pro) and image generation.
- **`GOOGLE_APPLICATION_CREDENTIALS`**: Required for text-to-speech. Point this to your service account key (e.g., `gcp_key.json`).

### Google Cloud Setup (for Audio)
1. Enable the **Cloud Text-to-Speech API** in your Google Cloud Console.
2. Create a **Service Account** and download a JSON key.
3. Rename the key to `gcp_key.json` and place it in the `backend/` folder.

---

## Tech Stack

- **Backend:** Flask, Python 3.11+, google-genai SDK
- **Frontend:** React, Vite, HTML2Canvas
- **AI Models:** Gemini 3 Pro (text/reasoning), Nano Banana Pro (images), Google Cloud TTS (audio)

---

## Gemini 3 Hackathon SF

**Hosted by Cerebral Valley and Google** (@cv @google)

**Saturday Dec 6**
9:00 AM – 10:00 PM PST

365 Toni Stone Xing, San Francisco, CA 94158, USA
