// File: app/page.js
'use client'; // This enables interactivity

import { useState, useEffect } from 'react';
import { fetchTriageQuestions } from '../lib/contentful';
import WelcomeScreen from '../components/WelcomeScreen';
import Question from '../components/Question';
import ThankYouScreen from '../components/ThankYouScreen';

// --- Constants for Question Logic ---
// NOTE: These strings MUST EXACTLY MATCH your Contentful 'Question Name' fields.
const QUESTION_NAME_TRIAGE_Q1_SCOPE = 'Triage Q1 - Scope';
const ANSWER_Q1_A_JUST_FOR_ME = 'A) Just for me.';
const QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL = 'Triage Q2a - Individual Goal';
const QUESTION_NAME_TRIAGE_Q2B_TEAM_GOAL = 'Triage Q2b - Team Goal';
const QUESTION_NAME_TRIAGE_Q3A_AI_EXPERIENCE_INDIVIDUAL = 'Triage Q3a - AI Experience (Individual)';
const QUESTION_NAME_TRIAGE_Q3B_AI_EXPERIENCE_TEAM = 'Triage Q3b - AI Experience (Team)';
const QUESTION_NAME_TRIAGE_Q4A_PSYCHOLOGICAL_READINESS_INDIVIDUAL = 'Triage Q4a - Psychological Readiness (Individual)';
const QUESTION_NAME_TRIAGE_Q4B_PSYCHOLOGICAL_READINESS_TEAM = 'Triage Q4b - Psychological Readiness (Team)';
const QUESTION_NAME_TRIAGE_Q5A_LEARNING_ORIENTATION_INDIVIDUAL = 'Triage Q5a - Learning Orientation (Individual)';
const QUESTION_NAME_TRIAGE_Q5B_LEARNING_ORIENTATION_TEAM = 'Triage Q5b - Learning Orientation (Team)';
const QUESTION_NAME_QUALITATIVE_Q1A_SOUL_QUESTION_INDIVIDUAL = 'Qualitative Q1a - The Soul Question (Individual)';
const QUESTION_NAME_QUALITATIVE_Q1B_SOUL_QUESTION_TEAM = 'Qualitative Q1b - The Soul Question (Team)';
// --- End Constants ---

export default function AssessmentPage() {
  // --- STATE MANAGEMENT ---
  const [gameState, setGameState] = useState('loading'); // loading, welcome, playing, submitting, finished, error
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  // **MODIFIED**: userAnswers state now includes client info from the start.
  const [userAnswers, setUserAnswers] = useState({
    'Client Name': '',
    'Website URL': '',
  });
  const [errorState, setErrorState] = useState(null);
  
  // --- DATA FETCHING ---
  useEffect(() => {
    async function loadQuestions() {
      console.log('[useEffect] Attempting to load questions from Contentful...');
      try {
        const fetchedQuestions = await fetchTriageQuestions();
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          console.log('[useEffect] Successfully fetched questions.');
          setGameState('welcome');
        } else {
          throw new Error("No questions returned from Contentful.");
        }
      } catch (error) {
        console.error('[useEffect] Error loading questions:', error);
        setErrorState('An error occurred while loading questions.');
        setGameState('error');
      }
    }
    loadQuestions();
  }, []);

  // --- NEW: API SUBMISSION LOGIC ---
  const submitFinalAnswers = async (finalAnswers) => {
    setGameState('submitting');
    console.log('[submitFinalAnswers] Submitting final data to API:', finalAnswers);
    try {
      const response = await fetch('/api/submit-to-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAnswersObject: finalAnswers }),
      });

      if (response.ok) {
        setGameState('finished');
        console.log('[submitFinalAnswers] Success! Data submitted.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API submission failed.');
      }
    } catch (error) {
      console.error('[submitFinalAnswers] Submission Error:', error);
      setErrorState(`Failed to submit results: ${error.message}`);
      setGameState('error');
    }
  };

  // --- QUIZ AND FORM HANDLERS ---
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setUserAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handleStart = () => {
    // Validation: Ensure client info is filled before starting
    if (!userAnswers['Client Name'] || !userAnswers['Website URL']) {
      setErrorState("Please enter your name and website URL to start.");
      // Temporarily set to error, then back to welcome
      setGameState('error');
      setTimeout(() => setGameState('welcome'), 2000);
      return;
    }

    console.log('[handleStart] Assessment started.');
    const firstQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q1_SCOPE);
    if (firstQuestion) {
      setCurrentQuestion(firstQuestion);
      setGameState('playing');
    } else {
      setErrorState('Could not start the assessment. Initial question configuration error.');
      setGameState('error');
    }
  };

  const handleAnswerSelect = (questionNameFromComponent, answerFromComponent) => {
    console.log(`%c[handleAnswerSelect] Fired for: ${questionNameFromComponent}`, 'color: blue; font-weight: bold;');
    
    const updatedAnswers = { ...userAnswers, [questionNameFromComponent]: answerFromComponent };
    setUserAnswers(updatedAnswers);
    console.log("[handleAnswerSelect] User answers updated:", updatedAnswers);

    let nextQuestion = null;
    // --- All your branching logic remains the same ---
    if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q1_SCOPE) {
      if (answerFromComponent === ANSWER_Q1_A_JUST_FOR_ME) {
        nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL);
      } else {
        nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q2B_TEAM_GOAL);
      }
    }
    else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL) {
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q3A_AI_EXPERIENCE_INDIVIDUAL);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q3A_AI_EXPERIENCE_INDIVIDUAL) {
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q4A_PSYCHOLOGICAL_READINESS_INDIVIDUAL);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q4A_PSYCHOLOGICAL_READINESS_INDIVIDUAL) {
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q5A_LEARNING_ORIENTATION_INDIVIDUAL);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q5A_LEARNING_ORIENTATION_INDIVIDUAL) {
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_QUALITATIVE_Q1A_SOUL_QUESTION_INDIVIDUAL);
    } else if (questionNameFromComponent === QUESTION_NAME_QUALITATIVE_Q1A_SOUL_QUESTION_INDIVIDUAL) {
      nextQuestion = null;
    }
    else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q2B_TEAM_GOAL) {
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q3B_AI_EXPERIENCE_TEAM);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q3B_AI_EXPERIENCE_TEAM) {
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q4B_PSYCHOLOGICAL_READINESS_TEAM);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q4B_PSYCHOLOGICAL_READINESS_TEAM) {
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q5B_LEARNING_ORIENTATION_TEAM);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q5B_LEARNING_ORIENTATION_TEAM) {
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_QUALITATIVE_Q1B_SOUL_QUESTION_TEAM);
    } else if (questionNameFromComponent === QUESTION_NAME_QUALITATIVE_Q1B_SOUL_QUESTION_TEAM) {
      nextQuestion = null;
    }
    else {
      console.warn(`[handleAnswerSelect] Fallback: Unhandled question path for '${questionNameFromComponent}'. Ending assessment.`);
      nextQuestion = null;
    }

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      // --- CRUCIAL CHANGE: Call the submission function ---
      console.log(`[handleAnswerSelect] End of path. Submitting final answers...`);
      submitFinalAnswers(updatedAnswers);
    }
  };

  // --- UI RENDERING LOGIC ---
  const renderGameState = () => {
    console.log(`[renderGameState] Current gameState: ${gameState}`);
    switch (gameState) {
      case 'welcome':
        return (
          <div>
            {/* Pass state and handlers to WelcomeScreen */}
            <WelcomeScreen 
              onStart={handleStart} 
              onInfoChange={handleInfoChange}
              clientName={userAnswers['Client Name']}
              websiteUrl={userAnswers['Website URL']}
            />
          </div>
        );
      case 'playing':
        if (!currentQuestion) return <p>Error: Question data is missing.</p>;
        return <Question questionData={currentQuestion} onAnswerSelect={handleAnswerSelect} />;
      case 'submitting':
        return <p>Submitting your results...</p>;
      case 'finished':
        return <ThankYouScreen />;
      case 'error':
        return <p className="text-red-500 font-semibold">Error: {errorState}</p>;
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
