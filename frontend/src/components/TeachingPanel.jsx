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
                <div className="jp">{line.jp}</div>
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
                <div className="romaji">{item.reading || item.romaji}</div>
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
