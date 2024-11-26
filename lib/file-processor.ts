import { encode } from 'base64-arraybuffer';

interface JSONContent {
  [key: string]: any;
}

export async function processFile(file: File): Promise<string> {
  try {
    if (file.type === 'application/json') {
      const jsonText = await file.text();
      const jsonContent = JSON.parse(jsonText);
      return JSON.stringify(jsonContent, null, 2);
    } else if (file.type === 'text/plain') {
      return await file.text();
    } else if (file.type === 'application/msword' || 
               file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = encode(arrayBuffer);
      const text = await extractTextFromDoc(file);
      return text;
    }
    throw new Error('Unsupported file type');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error processing file');
  }
}

async function extractTextFromDoc(file: File): Promise<string> {
  try {
    const text = await file.text();
    return text.replace(/[^\x20-\x7E\n]/g, ' ').trim();
  } catch (error) {
    throw new Error('Error extracting text from document');
  }
}

function findMatchingValues(jsonContent: JSONContent, query: string): string[] {
  const normalizedQuery = query.toLowerCase();
  const matches: string[] = [];

  function searchObject(obj: JSONContent): void {
    for (const [key, value] of Object.entries(obj)) {
      const keyMatch = key.toLowerCase().includes(normalizedQuery);
      const valueMatch = typeof value === 'string' && value.toLowerCase().includes(normalizedQuery);
      
      if (keyMatch || valueMatch) {
        matches.push(formatValue(value));
      }
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        searchObject(value);
      }
    }
  }

  searchObject(jsonContent);
  return matches;
}

const conversationalPhrases = [
  "Let me help you with that.",
  "I found some relevant information.",
  "Here's what I know about that.",
  "Based on the document,",
  "From what I can see,",
  "I'd be happy to tell you about that.",
  "According to the information I have,",
  "Let me share what I found.",
];

const followUpPhrases = [
  "Would you like to know more?",
  "I can provide more details if you're interested.",
  "Let me know if you'd like additional information.",
  "Feel free to ask for more specific details.",
  "Is there anything specific you'd like to know?",
];

const noInfoPhrases = [
  "I apologize, but I couldn't find any information about that in the document.",
  "I've looked through the document, but I don't see anything specifically about that.",
  "I don't have any information about that in the current document.",
  "Sorry, I couldn't find anything matching your query.",
];

function getRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

function formatValue(value: any): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object' && value !== null) {
    return Object.values(value)
      .map(v => formatValue(v))
      .join(', ');
  }
  return String(value);
}

export function generateResponse(content: string, query: string, temperature: number): string {
  try {
    const jsonContent = JSON.parse(content);
    const matches = findMatchingValues(jsonContent, query);
    
    if (matches.length === 0) {
      return getRandomPhrase(noInfoPhrases);
    }

    if (temperature < 0.3) {
      return `${getRandomPhrase(conversationalPhrases)} ${matches[0]}`;
    } else if (temperature < 0.7) {
      return `${getRandomPhrase(conversationalPhrases)} ${matches[0]}${
        matches.length > 1 ? `\n\n${getRandomPhrase(followUpPhrases)}` : ''
      }`;
    } else {
      const intro = getRandomPhrase(conversationalPhrases);
      const details = matches.map((value, index) => 
        `${index + 1}. ${value}`
      ).join('\n\n');
      
      return `${intro}\n\n${details}\n\n${getRandomPhrase(followUpPhrases)}`;
    }
  } catch (e) {
    // Handle text content
    const contentParagraphs = content.split('\n').filter(p => p.trim());
    const keywords = query.toLowerCase().split(' ');
    const relevantParagraphs = contentParagraphs.filter(paragraph => 
      keywords.some(keyword => paragraph.toLowerCase().includes(keyword))
    );

    if (relevantParagraphs.length === 0) {
      return getRandomPhrase(noInfoPhrases);
    }

    if (temperature < 0.3) {
      return `${getRandomPhrase(conversationalPhrases)} "${relevantParagraphs[0]}"`;
    } else if (temperature < 0.7) {
      return `${getRandomPhrase(conversationalPhrases)} "${relevantParagraphs[0]}"${
        relevantParagraphs.length > 1 ? `\n\n${getRandomPhrase(followUpPhrases)}` : ''
      }`;
    } else {
      const intro = getRandomPhrase(conversationalPhrases);
      const details = relevantParagraphs.map((p, i) => `${i + 1}. "${p}"`).join('\n\n');
      return `${intro}\n\n${details}\n\n${getRandomPhrase(followUpPhrases)}`;
    }
  }
}