// File: app/page.js

import QuizAndSubmit from '../components/QuizAndSubmit'; // 1. Add this import at the top

export default function Home() { // Or whatever your function is named
  // 2. Replace the existing return statement with this one
  return (
    <main>
      <h1>Reclaim Diagnostic</h1>
      <p>Please fill out your information and answer the questions below.</p>
      
      {/* This is where your new, combined component will render */}
      <QuizAndSubmit />
      
    </main>
  );
}

'use client'; // This enables interactivity

import { useState, useEffect } from 'react';
import { fetchTriageQuestions } from '../lib/contentful';
import WelcomeScreen from '../components/WelcomeScreen';
import Question from '../components/Question';
import ThankYouScreen from '../components/ThankYouScreen';

// --- Constants for Question Logic ---
// These strings MUST EXACTLY MATCH the 'Question Name' field in your Contentful entries.
// NOTE: All hyphens have been changed to en dashes (–) based on observed Contentful data.
// VERIFY THESE EXACT STRINGS AGAINST YOUR CONTENTFUL ENTRIES.

const QUESTION_NAME_TRIAGE_Q1_SCOPE = 'Triage Q1 - Scope';
const ANSWER_Q1_A_JUST_FOR_ME = 'A) Just for me.'; // This must match the exact answer option string for Q1

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
  const [gameState, setGameState] = useState('loading'); // loading, welcome, playing, finished, error
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    async function loadQuestions() {
      console.log('[useEffect] Attempting to load questions from Contentful...');
      try {
        const fetchedQuestions = await fetchTriageQuestions();
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          console.log('[useEffect] Successfully fetched questions (names/IDs):', fetchedQuestions.map(q => q.fields?.questionName || q.sys.id));
          setGameState('welcome');
        } else {
          console.warn('[useEffect] No questions fetched from Contentful or fetch returned empty/invalid.');
          setErrorState('Failed to load assessment questions. Please try again later.');
          setGameState('error');
        }
      } catch (error) {
        console.error('[useEffect] Error loading questions:', error);
        setErrorState('An error occurred while loading questions.');
        setGameState('error');
      }
    }
    loadQuestions();
  }, []);

  const handleStart = () => {
    console.log('[handleStart] Assessment started. Questions available:', questions.length);
    if (questions.length === 0) {
      console.error("[handleStart] Cannot start: No questions loaded.");
      setErrorState("Questions are not available to start the assessment.");
      setGameState('error');
      return;
    }
    const firstQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q1_SCOPE);
    if (firstQuestion) {
      console.log('[handleStart] Setting first question:', firstQuestion.fields.questionName);
      setCurrentQuestion(firstQuestion);
      setGameState('playing');
    } else {
      console.error(`[handleStart] Could not find the first question by name: '${QUESTION_NAME_TRIAGE_Q1_SCOPE}'. Ensure it exists in Contentful and is fetched.`);
      setErrorState('Could not start the assessment. Initial question configuration error.');
      setGameState('error');
    }
  };

  const handleAnswerSelect = (questionNameFromComponent, answerFromComponent) => {
    console.log(`%c[handleAnswerSelect] Fired. Current Question: ${currentQuestion?.fields?.questionName || 'N/A'}, Order: ${currentQuestion?.fields?.displayOrder || 'N/A'}`, 'color: blue; font-weight: bold;');
    console.log("[handleAnswerSelect] Received questionName from component:", questionNameFromComponent);
    console.log("[handleAnswerSelect] Received answer from component:", answerFromComponent);

    if (!currentQuestion || !currentQuestion.fields) {
      console.error("[handleAnswerSelect] Critical error: currentQuestion or currentQuestion.fields is not available. Aborting.");
      setErrorState("An unexpected error occurred. Current question data is missing.");
      setGameState('error');
      return;
    }

    const updatedAnswers = { ...userAnswers, [questionNameFromComponent]: answerFromComponent };
    setUserAnswers(updatedAnswers);
    console.log("[handleAnswerSelect] User answers updated:", updatedAnswers);

    let nextQuestion = null;

    // --- Conditional Branching Logic for A/B Tracks ---
    if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q1_SCOPE) {
      if (answerFromComponent === ANSWER_Q1_A_JUST_FOR_ME) {
        console.log(`[handleAnswerSelect] Q1 Answer is '${ANSWER_Q1_A_JUST_FOR_ME}'. Path A. Looking for: '${QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL}'`);
        nextQuestion = questions.find(q => {
          const currentIterationQuestionName = q.fields?.questionName;
          const isMatch = currentIterationQuestionName === QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL;
          // Log details if the current iteration is the one we're targeting or contains 'Q2a'
          if (currentIterationQuestionName === QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL || (currentIterationQuestionName && currentIterationQuestionName.includes('Q2a'))) {
            console.log(`[find Q2a path] Iterating. currentIterationQuestionName: "${currentIterationQuestionName}" (type: ${typeof currentIterationQuestionName}, length: ${currentIterationQuestionName?.length})`);
            console.log(`[find Q2a path] Comparing with target: "${QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL}" (type: ${typeof QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL}, length: ${QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL?.length})`);
            console.log(`[find Q2a path] Is exact match?: ${isMatch}`);
          }
          return isMatch;
        });
      } else {
        console.log(`[handleAnswerSelect] Q1 Answer is NOT '${ANSWER_Q1_A_JUST_FOR_ME}'. Path B. Looking for: '${QUESTION_NAME_TRIAGE_Q2B_TEAM_GOAL}'`);
        // For Path B, if it also fails, similar detailed logging would be added here for QUESTION_NAME_TRIAGE_Q2B_TEAM_GOAL
        nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q2B_TEAM_GOAL);
      }
    }
    // --- Path A Logic (Continues from Q2A) ---
    else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL) {
      console.log(`[handleAnswerSelect] Path A from '${QUESTION_NAME_TRIAGE_Q2A_INDIVIDUAL_GOAL}'. Looking for: '${QUESTION_NAME_TRIAGE_Q3A_AI_EXPERIENCE_INDIVIDUAL}'`);
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q3A_AI_EXPERIENCE_INDIVIDUAL);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q3A_AI_EXPERIENCE_INDIVIDUAL) {
      console.log(`[handleAnswerSelect] Path A from '${QUESTION_NAME_TRIAGE_Q3A_AI_EXPERIENCE_INDIVIDUAL}'. Looking for: '${QUESTION_NAME_TRIAGE_Q4A_PSYCHOLOGICAL_READINESS_INDIVIDUAL}'`);
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q4A_PSYCHOLOGICAL_READINESS_INDIVIDUAL);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q4A_PSYCHOLOGICAL_READINESS_INDIVIDUAL) {
      console.log(`[handleAnswerSelect] Path A from '${QUESTION_NAME_TRIAGE_Q4A_PSYCHOLOGICAL_READINESS_INDIVIDUAL}'. Looking for: '${QUESTION_NAME_TRIAGE_Q5A_LEARNING_ORIENTATION_INDIVIDUAL}'`);
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q5A_LEARNING_ORIENTATION_INDIVIDUAL);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q5A_LEARNING_ORIENTATION_INDIVIDUAL) {
      console.log(`[handleAnswerSelect] Path A from '${QUESTION_NAME_TRIAGE_Q5A_LEARNING_ORIENTATION_INDIVIDUAL}'. Looking for: '${QUESTION_NAME_QUALITATIVE_Q1A_SOUL_QUESTION_INDIVIDUAL}'`);
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_QUALITATIVE_Q1A_SOUL_QUESTION_INDIVIDUAL);
    } else if (questionNameFromComponent === QUESTION_NAME_QUALITATIVE_Q1A_SOUL_QUESTION_INDIVIDUAL) {
      console.log(`[handleAnswerSelect] Path A from '${QUESTION_NAME_QUALITATIVE_Q1A_SOUL_QUESTION_INDIVIDUAL}'. End of Path A.`);
      nextQuestion = null;
    }
    // --- Path B Logic (Continues from Q2B) ---
    else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q2B_TEAM_GOAL) {
      console.log(`[handleAnswerSelect] Path B from '${QUESTION_NAME_TRIAGE_Q2B_TEAM_GOAL}'. Looking for: '${QUESTION_NAME_TRIAGE_Q3B_AI_EXPERIENCE_TEAM}'`);
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q3B_AI_EXPERIENCE_TEAM);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q3B_AI_EXPERIENCE_TEAM) {
      console.log(`[handleAnswerSelect] Path B from '${QUESTION_NAME_TRIAGE_Q3B_AI_EXPERIENCE_TEAM}'. Looking for: '${QUESTION_NAME_TRIAGE_Q4B_PSYCHOLOGICAL_READINESS_TEAM}'`);
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q4B_PSYCHOLOGICAL_READINESS_TEAM);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q4B_PSYCHOLOGICAL_READINESS_TEAM) {
      console.log(`[handleAnswerSelect] Path B from '${QUESTION_NAME_TRIAGE_Q4B_PSYCHOLOGICAL_READINESS_TEAM}'. Looking for: '${QUESTION_NAME_TRIAGE_Q5B_LEARNING_ORIENTATION_TEAM}'`);
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_TRIAGE_Q5B_LEARNING_ORIENTATION_TEAM);
    } else if (questionNameFromComponent === QUESTION_NAME_TRIAGE_Q5B_LEARNING_ORIENTATION_TEAM) {
      console.log(`[handleAnswerSelect] Path B from '${QUESTION_NAME_TRIAGE_Q5B_LEARNING_ORIENTATION_TEAM}'. Looking for: '${QUESTION_NAME_QUALITATIVE_Q1B_SOUL_QUESTION_TEAM}'`);
      nextQuestion = questions.find(q => q.fields?.questionName === QUESTION_NAME_QUALITATIVE_Q1B_SOUL_QUESTION_TEAM);
    } else if (questionNameFromComponent === QUESTION_NAME_QUALITATIVE_Q1B_SOUL_QUESTION_TEAM) {
      console.log(`[handleAnswerSelect] Path B from '${QUESTION_NAME_QUALITATIVE_Q1B_SOUL_QUESTION_TEAM}'. End of Path B.`);
      nextQuestion = null;
    }
    // --- Fallback for unhandled question paths ---
    else {
      console.warn(`[handleAnswerSelect] Fallback: Unhandled question path for '${questionNameFromComponent}'. Ending assessment.`);
      nextQuestion = null;
    }

    // --- State Transition based on nextQuestion ---
    if (nextQuestion) {
      console.log(`[handleAnswerSelect] Setting next question to: ${nextQuestion.fields.questionName} (Order: ${nextQuestion.fields.displayOrder})`);
      setCurrentQuestion(nextQuestion);
    } else {
      console.log(`[handleAnswerSelect] No valid next question found for '${questionNameFromComponent}'. Transitioning to 'finished'.`);
      setGameState('finished');
      console.log("[handleAnswerSelect] Final user answers submitted:", updatedAnswers);
    }
  };

  const renderGameState = () => {
    console.log(`[renderGameState] Current gameState: ${gameState}`);
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'playing':
        if (!currentQuestion) {
            console.error("[renderGameState] In 'playing' state but currentQuestion is null/undefined. This indicates a logic error in question progression.");
            return <p className="text-red-500 font-semibold">Error: Question data is currently unavailable. Please try refreshing.</p>;
        }
        return <Question questionData={currentQuestion} onAnswerSelect={handleAnswerSelect} />;
      case 'finished':
        return <ThankYouScreen />;
      case 'error':
        return <p className="text-red-500 font-semibold">Error: {errorState || "An unknown error occurred. Please try again later."}</p>;
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
