import React from "react";
import QuizBlock from "./QuizBlock";

const TeachingPanel = ({ teaching }) => {
  if (!teaching) return null;

  const { overview, lines = [], vocab = [], quiz = [] } = teaching;

  return (
    <div className="card">
      <div className="card-head">
        <div className="eyebrow">Gemini 3 Pro</div>
        <h3>Lesson for today&apos;s manga</h3>
      </div>
      {overview?.summary_en && <p className="muted">{overview.summary_en}</p>}
      <div className="section">
        <div className="eyebrow">Dialogue with notes</div>
        <div className="line-list">
          {lines.map((line) => (
            <div key={line.panel} className="line-item">
              <div className="badge">Panel {line.panel}</div>
              <div className="line-body">
                <div className="jp">
                  {line.jp}
                  <button
                    className="audio-btn"
                    onClick={() => {
                      const audio = new Audio(`/api/tts?text=${encodeURIComponent(line.jp)}`);
                      audio.play().catch(e => console.error("Audio playback failed", e));
                    }}
                    title="Play audio (GCP Neural)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  </button>
                </div>
                <div className="romaji">{line.romaji}</div>
                <div className="en">{line.en}</div>
                {line.note && <div className="note">✧ {line.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!!vocab.length && (
        <div className="section">
          <div className="eyebrow">Key words</div>
          <div className="vocab-grid">
            {vocab.map((item, idx) => (
              <div key={idx} className="vocab-card">
                <div className="jp">{item.word}</div>
                <div className="reading" style={{ fontSize: "12px", color: "var(--muted)" }}>
                  {item.reading}
                </div>
                <div className="romaji">{item.romaji}</div>
                <div className="en">{item.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <QuizBlock quiz={quiz} />
    </div>
  );
};

export default TeachingPanel;
