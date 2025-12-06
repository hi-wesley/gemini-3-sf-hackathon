import React, { useState } from "react";

const QuizBlock = ({ quiz = [] }) => {
  const [selections, setSelections] = useState({});

  if (!quiz.length) return null;

  const handleSelect = (qIdx, optIdx) => {
    setSelections((prev) => {
      const current = prev[qIdx];
      if (current === optIdx) {
        // Unselect if clicking the same option
        const next = { ...prev };
        delete next[qIdx];
        return next;
      }
      // Select new option
      return { ...prev, [qIdx]: optIdx };
    });
  };

  return (
    <div className="section">
      <div className="eyebrow">Check your understanding</div>
      <div className="quiz-list">
        {quiz.map((item, idx) => {
          const selectedIdx = selections[idx];
          const hasSelected = selectedIdx !== undefined;
          const isCorrect = hasSelected && selectedIdx === item.answer_index;

          return (
            <div key={idx} className="quiz-card">
              <div className="quiz-question">
                Q{idx + 1}. {item.question}
              </div>
              <ul className="quiz-options interactive">
                {item.options?.map((opt, optIdx) => {
                  const isSelected = selectedIdx === optIdx;
                  const isThisCorrect = optIdx === item.answer_index;

                  let statusClass = "";
                  if (isSelected) {
                    statusClass = isThisCorrect ? "correct" : "incorrect";
                  }

                  return (
                    <li
                      key={optIdx}
                      className={statusClass}
                      onClick={() => handleSelect(idx, optIdx)}
                    >
                      {statusClass === "correct" && "✓ "}
                      {statusClass === "incorrect" && "✗ "}
                      {opt}
                    </li>
                  );
                })}
              </ul>
              {hasSelected && (
                <p className={`quiz-note ${isCorrect ? "success" : "failure"}`}>
                  {isCorrect ? "Correct! " : "Not quite. "}
                  {item.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizBlock;
