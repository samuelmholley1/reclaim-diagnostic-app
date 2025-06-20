// /components/Question.js

import { useState } from 'react'; // Need useState for the textarea

export default function Question({ questionData, onAnswerSelect }) {
  if (!questionData || !questionData.fields) return null;

  const { questionText, questionSubtext, answerOptions, questionName, questionType } = questionData.fields;

  // State for the open text answer
  const [openTextAnswer, setOpenTextAnswer] = useState('');

  const handleOpenTextSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission if wrapped in a form
    if (openTextAnswer.trim() === '' && questionType === 'openText') {
      // Optional: Add validation if you want to prevent empty submission for openText
      // alert("Please provide an answer.");
      // return;
    }
    onAnswerSelect(questionName, openTextAnswer);
    setOpenTextAnswer(''); // Reset for next open text question, if any
  };

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-3xl font-bold mb-3 text-brand-dark">{questionText}</h2>
      {questionSubtext && (
        <p className="text-lg text-brand-text-secondary mb-8">
          {questionSubtext}
        </p>
      )}

      {/* Conditional rendering based on questionType */}
      {questionType === 'openText' ? (
        <div className="space-y-4">
          <textarea
            className="w-full p-3 border-2 border-brand-disabled rounded-lg text-lg text-brand-text-secondary focus:border-brand-primary focus:ring-brand-primary focus:outline-none"
            rows="5"
            placeholder="Type your answer here..."
            value={openTextAnswer}
            onChange={(e) => setOpenTextAnswer(e.target.value)}
          />
          <button
            onClick={handleOpenTextSubmit}
            className="bg-brand-accent text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-105 focus:outline-none"
          >
            Submit Answer
          </button>
        </div>
      ) : (
        // Existing logic for multiple choice
        <div className="space-y-4">
          {answerOptions && answerOptions.map((option) => (
            <button
              key={option}
              onClick={() => onAnswerSelect(questionName, option)}
              className="w-full text-left p-5 border-2 border-brand-disabled rounded-lg text-lg text-brand-text-secondary hover:border-brand-primary hover:bg-white focus:outline-none focus:border-brand-primary transition-colors"
            >
              {option}
            </button>
          ))}
          {(!answerOptions || answerOptions.length === 0) && questionType !== 'openText' && (
             <p className="text-sm text-gray-500">No answer options provided for this multiple-choice question.</p>
          )}
        </div>
      )}
    </div>
  );
}// /components/Question.js

import { useState } from 'react'; // Need useState for the textarea

export default function Question({ questionData, onAnswerSelect }) {
  if (!questionData || !questionData.fields) return null;

  const { questionText, questionSubtext, answerOptions, questionName, questionType } = questionData.fields;

  // State for the open text answer
  const [openTextAnswer, setOpenTextAnswer] = useState('');

  const handleOpenTextSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission if wrapped in a form
    if (openTextAnswer.trim() === '' && questionType === 'openText') {
      // Optional: Add validation if you want to prevent empty submission for openText
      // alert("Please provide an answer.");
      // return;
    }
    onAnswerSelect(questionName, openTextAnswer);
    setOpenTextAnswer(''); // Reset for next open text question, if any
  };

  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-3xl font-bold mb-3 text-brand-dark">{questionText}</h2>
      {questionSubtext && (
        <p className="text-lg text-brand-text-secondary mb-8">
          {questionSubtext}
        </p>
      )}

      {/* Conditional rendering based on questionType */}
      {questionType === 'openText' ? (
        <div className="space-y-4">
          <textarea
            className="w-full p-3 border-2 border-brand-disabled rounded-lg text-lg text-brand-text-secondary focus:border-brand-primary focus:ring-brand-primary focus:outline-none"
            rows="5"
            placeholder="Type your answer here..."
            value={openTextAnswer}
            onChange={(e) => setOpenTextAnswer(e.target.value)}
          />
          <button
            onClick={handleOpenTextSubmit}
            className="bg-brand-accent text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-105 focus:outline-none"
          >
            Submit Answer
          </button>
        </div>
      ) : (
        // Existing logic for multiple choice
        <div className="space-y-4">
          {answerOptions && answerOptions.map((option) => (
            <button
              key={option}
              onClick={() => onAnswerSelect(questionName, option)}
              className="w-full text-left p-5 border-2 border-brand-disabled rounded-lg text-lg text-brand-text-secondary hover:border-brand-primary hover:bg-white focus:outline-none focus:border-brand-primary transition-colors"
            >
              {option}
            </button>
          ))}
          {(!answerOptions || answerOptions.length === 0) && questionType !== 'openText' && (
             <p className="text-sm text-gray-500">No answer options provided for this multiple-choice question.</p>
          )}
        </div>
      )}
    </div>
  );
}
