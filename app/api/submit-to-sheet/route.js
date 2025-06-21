// File: components/DiagnosticForm.js (or wherever your main quiz component is)

import { useState } from 'react';

/**
 * This component collects all client and diagnostic data and submits it to the backend API.
 */
export default function DiagnosticForm() {
  // State to hold all the answers. The keys MUST EXACTLY MATCH your Google Sheet headers.
  const [answers, setAnswers] = useState({
    'Client Name': '',
    'Website URL': '',
    'Question 1': '',
    'Question 2a': '',
    'Question 2b': '',
    'Question 3a': '',
    'Question 3b': '',
    'Question 4a': '',
    'Question 4b': '',
    'Question 5a': '',
    'Question 5b': '',
    'Question 6a': '',
    'Question 6b': '',
  });

  // State to manage the submission status for user feedback
  const [status, setStatus] = useState(''); // e.g., 'Submitting...', 'Success!', 'Error'

const columnOrder = [
  'Client Name', 
  'Website URL', 
  'Question 1',
  'Question 2a',
  'Question 2b',
  'Question 3a',
  'Question 3b',
  'Question 4a',
  'Question 4b',
  'Question 5a',
  'Question 5b',
  'Question 6a',
  'Question 6b',
];
  
  /**
   * A single handler to update our state object for any input field.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [name]: value,
    }));
  };
  
  /**
   * This function is called when the user submits the form.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    if (!answers['Client Name'] || !answers['Website URL']) {
      setStatus('Error: Please fill in the client name and website URL.');
      return;
    }

    try {
      const response = await fetch('/api/submit-to-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswersObject: answers
        }),
      });

      if (response.ok) {
        setStatus('Success! Your results have been submitted.');
      } else {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.message}`);
        console.error('Submission failed:', errorData);
      }
    } catch (error) {
      setStatus('Error: A network error occurred. Please try again.');
      console.error('Network error:', error);
    }
  };

  // Helper function to create input fields, reducing repetition
  const createInputField = (name, type = 'text') => (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={name}>{name}:</label>
      <input
        type={type}
        id={name}
        name={name} // This 'name' MUST match a key in the 'answers' state
        value={answers[name]}
        onChange={handleInputChange}
        required={name === 'Client Name' || name === 'Website URL'}
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Client Information</h2>
      {createInputField('Client Name')}
      {createInputField('Website URL', 'url')}

      <h2>Diagnostic Questions</h2>
      {createInputField('Question 1')}
      {createInputField('Question 2a')}
      {createInputField('Question 2b')}
      {createInputField('Question 3a')}
      {createInputField('Question 3b')}
      {createInputField('Question 4a')}
      {createInputField('Question 4b')}
      {createInputField('Question 5a')}
      {createInputField('Question 5b')}
      {createInputField('Question 6a')}
      {createInputField('Question 6b')}
      
      <button type="submit" disabled={status === 'Submitting...'}>
        {status === 'Submitting...' ? 'Submitting...' : 'Submit Results'}
      </button>

      {status && <p>{status}</p>}
    </form>
  );
}
