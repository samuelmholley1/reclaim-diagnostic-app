// File: app/api/submit-to-sheet/route.js

import { google } from 'googleapis';
import { NextResponse } from 'next/server';

/**
 * This function handles POST requests to send data to a Google Sheet.
 * It authenticates with Google, validates incoming data, formats it,
 * and appends it to the specified spreadsheet.
 */
export async function POST(request) {
  // --- 1. VALIDATE ENVIRONMENT VARIABLES ---
  // Ensure all required server-side configurations are present.
  // This prevents the function from even trying to run if it's not configured correctly.
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
    // --- 2. PARSE AND VALIDATE INCOMING REQUEST BODY ---
    const requestBody = await request.json();
    const { userAnswersObject } = requestBody;

    // Check if the essential data object exists.
    if (!userAnswersObject || typeof userAnswersObject !== 'object') {
      return NextResponse.json(
        { message: "Bad Request: 'userAnswersObject' is missing or not a valid object." },
        { status: 400 }
      );
    }

    // --- 3. AUTHENTICATE WITH GOOGLE SHEETS API ---
    // Use the service account credentials from environment variables.
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        // This line handles the formatting of the private key,
        // making it robust for Vercel's environment variable handling.
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // --- 4. FORMAT DATA FOR THE SPREADSHEET ---
    // Define the exact order of your columns in the Google Sheet.
    // This provides a reliable structure.
    const columnOrder = [
      'Client Name', 
      'Website URL', 
      'Question 3', // Example: Add all your question keys here
      'Question 4',
      // ...add all other column headers in the exact order they appear in your sheet
    ];

    // Create a server-side timestamp for reliable record-keeping.
    const timestamp = new Date().toISOString();

    // Map the answers from the userAnswersObject to the defined column order.
    // If a question is not answered, it will appear as an empty cell.
    const newRowData = columnOrder.map(header => userAnswersObject[header] || "");
    
    // Add the timestamp as the first column of the new row.
    const newRow = [timestamp, ...newRowData];

    // --- 5. APPEND DATA TO THE GOOGLE SHEET ---
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      // The range should refer to the sheet name. 'A1' means it will append after the last row.
      range: 'Sheet1!A1', 
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [newRow], // The data must be an array of arrays.
      },
    });

    // --- 6. RETURN SUCCESS RESPONSE ---
    // The request was successful.
    return NextResponse.json(
      { 
        message: "Data successfully submitted to Google Sheet.",
        updatedRange: response.data.updates.updatedRange 
      },
      { status: 200 }
    );

  } catch (error) {
    // --- 7. HANDLE ERRORS GRACEFULLY ---
    console.error("An error occurred in the submit-to-sheet API route:", error.message);
    // Differentiate between JSON parsing errors and other server errors.
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Bad Request: Invalid JSON format." }, { status: 400 });
    }
    
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
