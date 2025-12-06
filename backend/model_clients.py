import base64
import os
from typing import Any, Dict, List

from google import genai
from google.genai import types
from pydantic import BaseModel


class ModelUnavailable(Exception):
    """Raised when the required model credentials are missing."""


class ModelCallError(Exception):
    """Raised when a model call fails or is not yet implemented."""


# Pydantic models for structured output
class Panel(BaseModel):
    panel: int
    speaker: str
    jp: str
    romaji: str
    en: str
    note: str


class PanelVisual(BaseModel):
    panel: int
    visual: str
    dialogue: str


class Character(BaseModel):
    name: str
    description: str


class MangaPrompt(BaseModel):
    style: str
    characters: list[Character]
    panel_descriptions: list[PanelVisual]
    dialogue: list[str]


class Vocab(BaseModel):
    word: str
    reading: str
    romaji: str
    meaning: str


class Quiz(BaseModel):
    question: str
    options: list[str]
    answer_index: int
    explanation: str


class Overview(BaseModel):
    summary_en: str
    level: str
    based_on_entry: str


class Teaching(BaseModel):
    overview: Overview
    lines: list[Panel]
    vocab: list[Vocab]
    quiz: list[Quiz]


class Script(BaseModel):
    panels: list[Panel]


class ReflectionResponse(BaseModel):
    script: Script
    teaching: Teaching
    manga_prompt: MangaPrompt


def gemini_reflect(entry: str, level: str = "beginner") -> Dict[str, Any]:
    """
    Build structured Japanese teaching content from a user diary entry.
    """
    use_stub = os.getenv("USE_MODEL_STUBS", "true").lower() == "true"
    if use_stub:
        return _stub_gemini(entry, level)

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ModelUnavailable("GEMINI_API_KEY is not set.")

    client = genai.Client(api_key=api_key)

    prompt = f"""
    You are a Japanese Manga Tutor.
    Analyze the user's journal entry: "{entry}"
    Level: {level}

    Create a short 4-panel manga script and lesson based on this.
    - Script: 4 panels of dialogue in Japanese, Romaji, and English.
    - Teaching: Overview, Vocab list, and a Quiz.
    - Manga Prompt: Detailed visual descriptions for an image generator.
    """

    try:
        response = client.models.generate_content(
            model="gemini-3-pro-preview",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=ReflectionResponse,
            ),
        )
        # return the parsed object as a dict
        return response.parsed.model_dump()
    except Exception as e:
        raise ModelCallError(f"Gemini reflect failed: {e}")


def nano_banana_generate(manga_prompt: Dict[str, Any], panels: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate a manga image using Gemini 3 Pro Image Preview (previously Nano Banana stub).
    """
    use_stub = os.getenv("USE_MODEL_STUBS", "true").lower() == "true"
    if use_stub:
        return _stub_manga(panels)

    api_key = os.getenv("GEMINI_API_KEY")
    # Fallback to NANO_BANANA_API_KEY if specific one exists, assuming user might still use it
    if not api_key:
         api_key = os.getenv("NANO_BANANA_API_KEY")
    
    if not api_key:
        raise ModelUnavailable("GEMINI_API_KEY is not set.")

    client = genai.Client(api_key=api_key)

    # Construct a rich prompt for the image generator
    style = manga_prompt.get("style", "manga style")
    chars = ", ".join([f"{c['name']} ({c['description']})" for c in manga_prompt.get("characters", [])])
    
    panel_text = ""
    for p in manga_prompt.get("panel_descriptions", []):
        panel_text += f"Panel {p['panel']}: {p['visual']} (Dialogue: {p['dialogue']})\n"

    image_prompt = f"""
    Draw a single manga page with {len(panels)} panels.
    Style: {style}
    Characters: {chars}
    
    Layout:
    {panel_text}
    
    Ensure the text bubbles are placed but can be empty or have simulated text.
    High quality, clean line art.
    """

    try:
        # gemini-3-pro-image-preview supports generateContent, not generateImages
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=image_prompt,
            config=types.GenerateContentConfig(
                # response_mime_type="image/png", # causes 400 INVALID_ARGUMENT
            )
        )
        
        # Check for image in the response parts
        # The SDK might return it as inline_data or we might need to look at parts
        if not response.candidates or not response.candidates[0].content.parts:
             raise ModelCallError("No content generated")
             
        part = response.candidates[0].content.parts[0]
        
        # If the model returns raw bytes (inline_data)
        if part.inline_data:
            b64_data = base64.b64encode(part.inline_data.data).decode("utf-8")
            mime_type = part.inline_data.mime_type or "image/png"
            data_url = f"data:{mime_type};base64,{b64_data}"
        else:
            # Fallback if it returns text saying "I can't do that" or similar
            raise ModelCallError(f"Model returned text instead of image: {part.text[:100]}...")

        return {
            "image_data_url": data_url,
            "panels": panels,
            "notes": "Generated by Gemini 3 Pro Image Preview",
        }

    except Exception as e:
        raise ModelCallError(f"Image generation failed: {e}")


# --- Stubs ---

def _stub_gemini(entry: str, level: str) -> Dict[str, Any]:
    # (Keeping existing stub code exactly as is for fallback)
    panels = [
        {
            "panel": 1,
            "speaker": "You",
            "jp": "今日は公園でジョギングしました。",
            "romaji": "Kyou wa kouen de jogingu shimashita.",
            "en": "I went jogging in the park today.",
            "note": "～しました (past tense).",
        },
        {
            "panel": 2,
            "speaker": "Friend",
            "jp": "すごい！毎日運動しているの？",
            "romaji": "Sugoi! Mainichi undou shite iru no?",
            "en": "Nice! Do you exercise every day?",
            "note": "～しているの？ for gently asking about habits.",
        },
        {
            "panel": 3,
            "speaker": "You",
            "jp": "いいえ、まだ週に二回だけです。",
            "romaji": "Iie, mada shuu ni nikai dake desu.",
            "en": "No, only twice a week for now.",
            "note": "だけ limits the amount (only).",
        },
        {
            "panel": 4,
            "speaker": "Friend",
            "jp": "でも続けたらきっと上手くなるよ。",
            "romaji": "Demo tsuzuketara kitto umaku naru yo.",
            "en": "Keep at it and you’ll get better.",
            "note": "～たら for if/when conditionals.",
        },
    ]

    panel_descriptions = [
        {
            "panel": 1,
            "visual": "Morning jog in a city park, trees and path, character breathing lightly.",
            "dialogue": panels[0]["jp"],
        },
        {
            "panel": 2,
            "visual": "Friend joins, encouraging expression, both stretching together.",
            "dialogue": panels[1]["jp"],
        },
        {
            "panel": 3,
            "visual": "Close-up, character smiling shyly and shaking head.",
            "dialogue": panels[2]["jp"],
        },
        {
            "panel": 4,
            "visual": "Both jogging side by side with a bright atmosphere.",
            "dialogue": panels[3]["jp"],
        },
    ]

    vocab = [
        {"word": "運動", "reading": "うんどう", "romaji": "undou", "meaning": "exercise / movement"},
        {"word": "続ける", "reading": "つづける", "romaji": "tsuzukeru", "meaning": "to continue"},
        {"word": "週に二回", "reading": "しゅう に にかい", "romaji": "shuu ni nikai", "meaning": "twice a week"},
    ]

    quiz = [
        {
            "question": "「続けたら」はどんな意味ですか？",
            "options": [
                "If you continue",
                "If you stop",
                "When you start",
                "Unless you try",
            ],
            "answer_index": 0,
            "explanation": "たら can mean if/when; here it is encouragement for the future if you keep going.",
        },
        {
            "question": "「だけ」のニュアンスは？",
            "options": [
                "Emphasizing a large amount",
                "Limiting to only that amount",
                "Expressing surprise",
                "Asking a question",
            ],
            "answer_index": 1,
            "explanation": "だけ limits the amount: only twice a week.",
        },
    ]

    overview = {
        "summary_en": "A short conversation about jogging regularly and encouraging consistency.",
        "level": level,
        "based_on_entry": entry.strip()[:200],
    }

    manga_prompt = {
        "style": "black and white manga, soft screentones, clean line art",
        "characters": [
            {"name": "You", "description": "Learner, casual sportswear, optimistic"},
            {"name": "Friend", "description": "Supportive friend, athletic, cheerful"},
        ],
        "panel_descriptions": panel_descriptions,
        "dialogue": [p["jp"] for p in panels],
    }

    return {
        "script": {"panels": panels},
        "teaching": {
            "overview": overview,
            "lines": panels,
            "vocab": vocab,
            "quiz": quiz,
        },
        "manga_prompt": manga_prompt,
    }


def _stub_manga(panels: List[Dict[str, Any]]) -> Dict[str, Any]:
    image_data_url = _placeholder_svg(panels)
    return {
        "image_data_url": image_data_url,
        "panels": panels,
        "notes": "Stub image generated locally. Wire Nano Banana Pro to replace this.",
    }


def _placeholder_svg(panels: List[Dict[str, Any]]) -> str:
    from textwrap import dedent
    lines = []
    base_y = 200
    gap = 200
    for idx, panel in enumerate(panels):
        jp_text = panel.get("jp", "")
        y = base_y + idx * gap
        lines.append(f"<text x='70' y='{y}' font-size='18' fill='#111'>{idx + 1}: {jp_text}</text>")

    svg = dedent(
        f"""
        <svg xmlns="http://www.w3.org/2000/svg" width="720" height="1100">
          <style>
            text {{ font-family: 'Noto Sans JP', 'Fira Sans', sans-serif; }}
          </style>
          <rect width="100%" height="100%" fill="#f4f2ec" />
          <text x="50%" y="60" text-anchor="middle" font-size="28" fill="#111">Manga preview (stub)</text>
          <rect x="40" y="90" width="640" height="960" fill="none" stroke="#111" stroke-width="6" />
          <line x1="40" y1="370" x2="680" y2="370" stroke="#111" stroke-width="4" />
          <line x1="40" y1="650" x2="680" y2="650" stroke="#111" stroke-width="4" />
          {''.join(lines)}
        </svg>
        """
    ).strip()

    encoded = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"

