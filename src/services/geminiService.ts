
import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types';

// IMPORTANT: Use Vite env prefix and import.meta.env for browser builds
// Define the key in .env.local as VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

let ai: GoogleGenAI | null = null;
if (!API_KEY) {
  // In a real application, you might want to handle this more gracefully,
  // for example, by disabling AI features or showing a warning.
  console.error("Gemini API key is not configured.");
} else {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const suggestReply = async (chatHistory: Message[]): Promise<string> => {
  if (!API_KEY || !ai) {
    return "AI features are disabled.";
  }

  if (chatHistory.length === 0) {
    return "Hello!";
  }

  // Format the last few messages into a simple transcript for the prompt.
  const transcript = chatHistory
    .map(msg => `${msg.senderId}: ${msg.text}`)
    .join('\n');

  const prompt = `
    Based on the following short chat conversation, suggest a single, short, and casual reply. 
    The reply should be from the perspective of the last person who received a message. Do not include any prefixes like "Reply:". Just provide the text of the reply.

    Conversation:
    ---
    ${transcript}
    ---

    Suggested Reply:
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Disable thinking for faster, lower-latency responses suitable for chat suggestions.
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.8,
        maxOutputTokens: 50,
      }
    });

    const suggestion = response.text.trim();
    // Remove potential quotes from the AI's response
    return suggestion.replace(/^"|"$/g, '');

  } catch (error) {
    console.error("Error generating suggestion from Gemini:", error);
    throw new Error("Failed to get AI suggestion.");
  }
};