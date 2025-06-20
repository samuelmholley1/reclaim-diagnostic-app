'use client'; // This enables interactivity

import { useState, useEffect } from 'react';
import { fetchTriageQuestions } from '../lib/contentful';
import WelcomeScreen from '../components/WelcomeScreen';
import Question from '../components/Question';
import ThankYouScreen from '../components/ThankYouScreen';

export default function AssessmentPage() {
  const [gameState, setGameState] = useState('loading'); // loading, welcome, playing, finished
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  // Fetch questions from Contentful when the app loads
  useEffect(() => {
    async function loadQuestions() {
      const fetchedQuestions = await fetchTriageQuestions();
      setQuestions(fetchedQuestions);
      setGameState('welcome');
    }
    loadQuestions();
  }, []);

  const handleStart = () => {
    setCurrentQuestion(questions.find(q => q.fields.displayOrder === 1));
    setGameState('playing');
  };

  const handleAnswerSelect = (questionName, answer) => {
    const updatedAnswers = { ...userAnswers, [questionName]: answer };
    setUserAnswers(updatedAnswers);

    const currentOrder = currentQuestion.fields.displayOrder;
    let nextQuestion = null;

    // --- THIS IS THE CONDITIONAL LOGIC ---
    if (questionName === 'Triage Q1 - Scope') {
      if (answer === 'A) Just for me.') {
        nextQuestion = questions.find(q => q.fields.questionName === 'Triage Q2a - Individual Arena');
      } else { // Team
        nextQuestion = questions.find(q => q.fields.questionName === 'Triage Q2b - Team Intent');
      }
    } else {
      // For all other questions, simply go to the next in order
      nextQuestion = questions.find(q => q.fields.displayOrder === currentOrder + 1);
    }
    // --- END LOGIC ---

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      // No more questions, end of funnel
      setGameState('finished');
      // In v2.0, we will send the `updatedAnswers` object to your Make.com webhook here
    }
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'playing':
        return <Question questionData={currentQuestion} onAnswerSelect={handleAnswerSelect} />;
      case 'finished':
        return <ThankYouScreen />;
      case 'loading':
      default:
        return <p className="text-brand-text-secondary">Loading your assessment...</p>;
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 sm:p-12 md:p-24">
      <div className="relative flex place-items-center w-full max-w-4xl transition-all duration-500 ease-in-out">
        {renderGameState()}
      </div>
    </main>
  );
}