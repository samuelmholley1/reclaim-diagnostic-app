// lib/contentful.js
const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

// For robust debugging, let's add these console logs:
console.log('[contentful.js] Attempting to init Contentful client.');
console.log('[contentful.js] Space ID from env:', space ? 'Loaded' : 'MISSING');
console.log('[contentful.js] Access Token from env:', accessToken ? 'Loaded' : 'MISSING');

if (!space || !accessToken) {
  console.error("[contentful.js] CRITICAL: Contentful Space ID or Access Token is missing from environment variables. Ensure NEXT_PUBLIC_ prefixed variables are set in Vercel and used in code.");
}

const client = require('contentful').createClient({
  space: space,
  accessToken: accessToken,
});

export async function fetchTriageQuestions() {
  if (!client || !space || !accessToken) {
     console.error("[contentful.js] Contentful client not properly initialized. Aborting fetch.");
     return [];
  }
  try {
    const entries = await client.getEntries({
      content_type: 'diagnosticQuestion',
      'fields.questionModule': 'Triage',
      order: 'fields.displayOrder',
    });
    if (entries.items) return entries.items;
    console.log(`[contentful.js] Error getting entries for Triage: No items found or issue with response.`);
    return [];
  } catch (error) {
    console.error("[contentful.js] Error fetching triage questions from Contentful:", error);
    return [];
  }
}
