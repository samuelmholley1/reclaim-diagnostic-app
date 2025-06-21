// app/api/submit-to-sheet/route.js
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Authenticate with Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Vercel's environment variables handle newlines correctly,
        // but if issues arise, replace \n in the private key value on Vercel with actual newlines.
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 2. Extract the data from the request body
    // For App Router, you get the body by awaiting req.json()
    const requestBody = await req.json();
    const {
      // These are the fields your app will eventually send.
      // For now, let's assume it's the 'userAnswers' object.
      // You'll need to decide the exact structure later.
      // Example: If userAnswers is { "Question 1": "Answer A", "Question 2": "Answer B" }
      // We'll need to format this into columns.
      userAnswersObject, // We'll expect an object named this from the frontend
      // Add any other fixed data you want to send, e.g., a timestamp from the client if preferred
    } = requestBody;

    // 3. Prepare the data for Google Sheets
    //    This needs to be an array of arrays, where each inner array is a row.
