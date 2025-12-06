import React, { useState } from "react";
import { generateAll } from "./api";
import MangaPanel from "./components/MangaPanel";
import TeachingPanel from "./components/TeachingPanel";

const App = () => {
  const [entry, setEntry] = useState(
    "Today I went to visit the aquarium with a friend. Afterwards we went to get milk tea. At night we went to see a new action movie together."
  );
  const [level, setLevel] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!entry.trim()) return;

    setError("");
    setLoading(true);
    try {
      const data = await generateAll({ entry, level });
      setResult(data);
    } catch (err) {
      const message = err.response?.data?.error || err.message || "Request failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">JP learning assistant</p>
          <h1>Turn your day into a manga and learn the Japanese on it.</h1>
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
            <button type="submit" className="primary" disabled={loading || !entry.trim()}>
              {loading ? "Thinking..." : "Generate manga + lesson"}
            </button>
          </div>
          <p className="hint">
            We first craft Japanese lines to teach them, then feed that script into Nano Banana Pro so the image text
            matches the lesson.
          </p>
        </form>

        {error && <div className="card error-card">{error}</div>}

        {result ? (
          <div className="grid">
            <MangaPanel manga={result.manga} />
            <TeachingPanel teaching={result.teaching} />
          </div>
        ) : (
          <div className="card placeholder-card">
            <h3>Ready when you are</h3>
            <p className="muted">
              Describe your day above, then click <strong>Generate manga + lesson</strong> to see your custom Japanese
              manga!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
