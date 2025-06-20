// /components/Question.js (Revised Version)

// This component now accepts both the main question and the optional subtext.
// It will intelligently display the subtext only if you've provided it in Contentful.

export default function Question({ questionData, onAnswerSelect }) {
  // Graceful exit if no data is passed, preventing errors.
  if (!questionData || !questionData.fields) return null;

  // Destructure for cleaner access to the fields from Contentful.
  const { questionText, questionSubtext, answerOptions, questionName } = questionData.fields;

  return (
    <div className="w-full animate-fade-in">
      {/* Renders the main question text */}
      <h2 className="text-3xl font-bold mb-3 text-brand-dark">{questionText}</h2>

      {/* 
        THIS IS THE NEW LOGIC: 
        It checks if the 'questionSubtext' field exists and has content. 
        If it does, it renders it inside a paragraph with specific styling. 
        If it's empty in Contentful, nothing will be rendered here.
      */}
      {questionSubtext && (
        <p className="text-lg text-brand-text-secondary mb-8">
          {questionSubtext}
        </p>
      )}

      {/* The logic for answer options remains the same */}
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
      </div>
    </div>
  );
}