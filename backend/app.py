import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from model_clients import (
    ModelCallError,
    ModelUnavailable,
    gemini_reflect,
    nano_banana_generate,
)

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False  # Keep Japanese characters readable
CORS(app)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/reflect")
def reflect():
    payload = request.get_json(silent=True) or {}
    entry = (payload.get("entry") or "").strip()
    level = payload.get("level", "beginner")

    if not entry:
        return jsonify({"error": "entry is required"}), 400

    try:
        reflection = gemini_reflect(entry, level=level)
    except ModelUnavailable as exc:
        return jsonify({"error": str(exc)}), 503
    except ModelCallError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:  # pragma: no cover - defensive
        return jsonify({"error": "Gemini reflection failed", "detail": str(exc)}), 500

    return jsonify(reflection)


@app.post("/api/manga")
def manga():
    payload = request.get_json(silent=True) or {}
    manga_prompt = payload.get("manga_prompt")
    panels = payload.get("panels")

    if not manga_prompt or not panels:
        return jsonify({"error": "manga_prompt and panels are required"}), 400

    try:
        manga_result = nano_banana_generate(manga_prompt, panels)
    except ModelUnavailable as exc:
        return jsonify({"error": str(exc)}), 503
    except ModelCallError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:  # pragma: no cover - defensive
        return jsonify({"error": "Manga generation failed", "detail": str(exc)}), 500

    return jsonify(manga_result)


@app.post("/api/generate")
def generate_all():
    payload = request.get_json(silent=True) or {}
    entry = (payload.get("entry") or "").strip()
    level = payload.get("level", "beginner")

    if not entry:
        return jsonify({"error": "entry is required"}), 400

    try:
        reflection = gemini_reflect(entry, level=level)
        manga_result = nano_banana_generate(reflection["manga_prompt"], reflection["script"]["panels"])
    except ModelUnavailable as exc:
        return jsonify({"error": str(exc)}), 503
    except ModelCallError as exc:
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:  # pragma: no cover - defensive
        return jsonify({"error": "Generation failed", "detail": str(exc)}), 500

    return jsonify(
        {
            "teaching": reflection["teaching"],
            "script": reflection["script"],
            "manga": manga_result,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
