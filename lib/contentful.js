// This is the bridge between your app and your Contentful "brain".

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

git add lib/contentful.js
git commit -m "feat: Use NEXT_PUBLIC_ prefixed env vars for Contentful"

const client = require('contentful').createClient({
  space: space,
  accessToken: accessToken,
});

export async function fetchTriageQuestions() {
  const entries = await client.getEntries({
    content_type: 'diagnosticQuestion',
    'fields.questionModule': 'Triage', // Fetch only the Triage questions
    order: 'fields.displayOrder',      // Order them correctly
  });

  if (entries.items) return entries.items;
  console.log(`Error getting entries for Triage.`);
  return [];
}
