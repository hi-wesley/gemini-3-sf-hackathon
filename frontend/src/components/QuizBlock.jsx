import React from "react";

const QuizBlock = ({ quiz = [] }) => {
  if (!quiz.length) return null;

  return (
    <div className="section">
      <div className="eyebrow">Check your understanding</div>
      <div className="quiz-list">
        {quiz.map((item, idx) => (
          <div key={idx} className="quiz-card">
            <div className="quiz-question">
              Q{idx + 1}. {item.question}
            </div>
            <ul className="quiz-options">
              {item.options?.map((opt, optIdx) => {
                const isAnswer = optIdx === item.answer_index;
                return (
                  <li key={optIdx} className={isAnswer ? "correct" : ""}>
                    {isAnswer ? "✓ " : ""}
                    {opt}
                  </li>
                );
              })}
            </ul>
            {item.explanation && <p className="quiz-note">{item.explanation}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizBlock;
