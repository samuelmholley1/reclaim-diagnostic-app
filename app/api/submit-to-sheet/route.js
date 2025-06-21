// File: app/api/submit-to-sheet/route.js
// This is BACKEND code. It runs on the server and talks to Google.
// It CANNOT use React hooks like useState.

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

/**
 * This function handles POST requests to send data to a Google Sheet.
 */
export async function POST(request) {
  // --- 1. VALIDATE ENVIRONMENT VARIABLES ---
  const {
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_SHEET_ID,
  } = process.env;

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    console.error("ERROR: Missing Google service account credentials or Sheet ID in .env");
    return NextResponse.json(
      { message: "Server configuration error. Required environment variables are missing." },
      { status: 500 }
    );
  }

  try {
    // --- 2. PARSE INCOMING REQUEST BODY ---
    const requestBody = await request.json();
    const { userAnswersObject } = requestBody;

    if (!userAnswersObject || typeof userAnswersObject !== 'object') {
      return NextResponse.json(
        { message: "Bad Request: 'userAnswersObject' is missing or not a valid object." },
        { status: 400 }
      );
    }

    // --- 3. AUTHENTICATE WITH GOOGLE SHEETS API ---
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // --- 4. PREPARE DATA FOR THE SPREADSHEET ---
    // Dynamically get the headers from the incoming object keys
    // This makes it more flexible than a fixed array.
    const headers = Object.keys(userAnswersObject);
    const newRow = headers.map(header => userAnswersObject[header] || ""); // Map values in order

    // Create a server-side timestamp and add it to the front.
    const timestamp = new Date().toISOString();
    const rowWithTimestamp = [timestamp, ...newRow];


    // --- 5. APPEND DATA TO THE GOOGLE SHEET ---
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Sheet1!A1', // Appends after the last row in Sheet1
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowWithTimestamp],
      },
    });

    // --- 6. RETURN SUCCESS RESPONSE ---
    return NextResponse.json(
      { message: "Data successfully submitted." },
      { status: 200 }
    );

  } catch (error) {
    // --- 7. HANDLE ERRORS GRACEFULLY ---
    console.error("[API_ERROR]", error.message);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Bad Request: Invalid JSON." }, { status: 400 });
    }
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
