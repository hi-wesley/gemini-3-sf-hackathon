import React, { useState } from "react";
import { generateAll } from "./api";
import MangaPanel from "./components/MangaPanel";
import TeachingPanel from "./components/TeachingPanel";

import LoadingIndicator from "./components/LoadingIndicator";

const RANDOM_ENTRIES = [
  "Today I went to visit the aquarium with a friend. Afterwards we went to get milk tea. At night we went to see a new action movie together.",
  "Today I went camping in the mountains with my family. Afterwards we hiked to a hidden waterfall. At night we made takoyaki and told stories by the fire.",
  "Today I tried a new ramen shop for lunch. Afterwards I went to the supermarket to buy sweets. At night I relaxed at home watching a cooking show.",
  "Today I lost my wallet on the train during my commute. Afterwards a kind stranger found it and contacted me. At night I met them to say thank you and buy them dinner.",
  "Today I went to the city to browse a video game store. Afterwards I met some friends for yakitori. At night we went to a karaoke to sing together.",
  "Today I went to a cozy cafe to read a mystery novel. Afterwards I took a walk in the park while listening to music. At night I wrote in my journal about the book.",
];

const App = () => {
  const [entry, setEntry] = useState(
    "Today I went to visit the aquarium with a friend. Afterwards we went to get milk tea. At night we went to see a new action movie together."
  );
  const [level, setLevel] = useState("beginner");
  const [loadingStatus, setLoadingStatus] = useState(""); // "" | "reflecting" | "drawing"
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!entry.trim()) return;

    setError("");
    setLoadingStatus("reflecting");
    setResult(null); // Hide previous results while loading

    try {
      // Step 1: Get the reflection (text content)
      const reflectResp = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry, level }),
      });

      if (!reflectResp.ok) {
        const err = await reflectResp.json();
        throw new Error(err.message || err.error || "Reflection failed");
      }

      const reflectionData = await reflectResp.json();

      // Step 2: Get the manga (image content) - NO RESULT YET
      setLoadingStatus("drawing");

      const mangaResp = await fetch("/api/manga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manga_prompt: reflectionData.manga_prompt,
          panels: reflectionData.script.panels,
        }),
      });

      if (!mangaResp.ok) {
        const err = await mangaResp.json();
        throw new Error(err.message || err.error || "Manga generation failed");
      }

      const mangaData = await mangaResp.json();

      // Update UI with EVERYTHING at once
      setResult({
        teaching: reflectionData.teaching,
        script: reflectionData.script,
        manga: mangaData,
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingStatus("");
    }
  };

  const isLoading = Boolean(loadingStatus);

  const handleRandom = () => {
    const randomEntry = RANDOM_ENTRIES[Math.floor(Math.random() * RANDOM_ENTRIES.length)];
    setEntry(randomEntry);
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Nichijou (Your everyday life)</p>
          <h1>Turn your day into a manga and learn the Japanese on it</h1>
          <p className="muted">
            Gemini 3 Pro shapes the dialogue for your level, Nano Banana Pro draws the manga page,
            and we teach you the lines with romaji, English, and quick checks.
          </p>
        </div>

      </header>

      <main>
        <form className="card form-card" onSubmit={handleSubmit}>
          <label className="field">
            <span>Tell us about your day</span>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Describe your day..."
              rows={4}
              required
            />
          </label>
          <div className="form-row">
            <label className="field inline">
              <span>Level</span>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <button type="submit" className="primary" disabled={isLoading || !entry.trim()}>
              {loadingStatus === "reflecting"
                ? "Writing dialogue..."
                : loadingStatus === "drawing"
                  ? "Drawing manga..."
                  : "Generate manga + lesson"}
            </button>
            <button type="button" className="secondary" onClick={handleRandom} disabled={isLoading}>
              Demo prompt
            </button>
          </div>
          <p className="hint">
            We first craft Japanese lines to teach them, then feed that script into Nano Banana Pro so the image text
            matches the lesson.
          </p>
        </form>

        {error && <div className="card error-card">Error: {error}</div>}

        {isLoading && (
          <LoadingIndicator
            status={loadingStatus === "reflecting" ? "Writing dialogue..." : "Drawing manga..."}
          />
        )}

        {result && !isLoading && (
          <div className="grid">
            <MangaPanel manga={result.manga} />
            <TeachingPanel teaching={result.teaching} script={result.script} />
          </div>
        )}

        {!result && !isLoading && !error && (
          <div className="card placeholder-card">
            <p className="muted">
              Ready to start? Type your journal entry above or click "Demo prompt" to see an example, then click "Generate manga + lesson" to begin.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
