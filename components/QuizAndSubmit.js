// File: components/QuizAndSubmit.js (a combined-logic component)

import { useState, useEffect } from 'react';

// This is a mock of your question data structure
const MOCK_QUESTIONS = {
  'Triage Q5a': { nextPath: 'Qualitative Q1a' },
  'Qualitative Q1a': { nextPath: null }, // This is the last question
};

export default function QuizAndSubmit() {
  // Main state to hold all answers, including client info
  const [userAnswers, setUserAnswers] = useState({
    'Client Name': '',
    'Website URL': '',
  });

  // State for the current question and game status
  const [currentQuestionName, setCurrentQuestionName] = useState('Triage Q5a');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'submitting', 'finished', 'error'

  /**
   * This is the new, critical function that sends the final data.
   * We will call it when the quiz is over.
   */
  const submitFinalAnswers = async (finalAnswers) => {
    setGameState('submitting');
    console.log('[submitFinalAnswers] Submitting final data to API:', finalAnswers);

    try {
      const response = await fetch('/api/submit-to-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswersObject: finalAnswers
        }),
      });

      if (response.ok) {
        setGameState('finished');
        console.log('[submitFinalAnswers] Success! Data submitted.');
      } else {
        const errorData = await response.json();
        setGameState('error');
        console.error('[submitFinalAnswers] API Error:', errorData.message);
      }
    } catch (error) {
      setGameState('error');
      console.error('[submitFinalAnswers] Network Error:', error);
    }
  };

  /**
   * This function simulates your existing handleAnswerSelect logic.
   */
  const handleAnswerSelect = (questionName, answer) => {
    console.log(`[handleAnswerSelect] Fired for question: ${questionName}`);

    // Update the answers object with the new answer
    const updatedAnswers = { ...userAnswers, [questionName]: answer };
    setUserAnswers(updatedAnswers);
    console.log('[handleAnswerSelect] User answers updated:', updatedAnswers);

    // Find the next question based on your logic
    const nextQuestion = MOCK_QUESTIONS[questionName]?.nextPath;

    if (nextQuestion) {
      console.log(`[handleAnswerSelect] Setting next question to: ${nextQuestion}`);
      setCurrentQuestionName(nextQuestion);
    } else {
      console.log(`[handleAnswerSelect] End of path reached for: ${questionName}.`);
      // THIS IS THE CRUCIAL CHANGE:
      // Instead of just setting state, we call the submission function.
      submitFinalAnswers(updatedAnswers);
    }
  };

  /**
   * A handler specifically for the Client Name and URL inputs.
   */
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUserAnswers(prev => ({ ...prev, [name]: value }));
  };

  // --- UI RENDERING ---
  
  if (gameState === 'submitting') {
    return <div>Submitting your results...</div>;
  }
  
  if (gameState === 'finished') {
    return <div>Thank you! Your results have been submitted successfully.</div>;
  }
  
  if (gameState === 'error') {
    return <div>Sorry, an error occurred. Please try again later.</div>;
  }

  // This is the 'playing' state
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Client Information</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Client Name:</label>
        <input
          name="Client Name"
          onChange={handleInfoChange}
          value={userAnswers['Client Name']}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Website URL:</label>
        <input
          name="Website URL"
          onChange={handleInfoChange}
          value={userAnswers['Website URL']}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      
      <hr style={{ margin: '2rem 0' }} />

      <h2>Diagnostic Question: {currentQuestionName}</h2>
      {/* This is a mock of your question component */}
      <div>
        <p>Please provide your answer for {currentQuestionName}:</p>
        <button onClick={() => handleAnswerSelect(currentQuestionName, 'Answer A')}>Select Answer A</button>
        <button onClick={() => handleAnswerSelect(currentQuestionName, 'Answer B')}>Select Answer B</button>
      </div>
    </div>
  );
}
