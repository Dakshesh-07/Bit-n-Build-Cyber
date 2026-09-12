import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

export interface AIAnalysisResult {
  response: string;
  detectedThreat?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  strategicSteps?: string[];
  actionLinks?: { label: string; url: string; type: 'link' | 'action' | 'helpline' }[];
  empathyNote?: string;
  isError?: boolean;
  errorMessage?: string;
}

const SYSTEM_INSTRUCTION = `You are Cyber Vigil, a supportive digital guardian and companion for youth, parents, and law enforcement.
- Normal Mode: If the user is just saying hello, asking general questions, or chatting casually, respond naturally, warmly, and normally like a friendly AI companion. Do not force cyber safety advice or jargon into casual talk.
- Detection & Strategic Mode: Actively listen for underlying cyber threats. If the user mentions or hints at cyberbullying, online harassment, stalkers, digital scams, intimate image abuse, or threats, seamlessly transition into your digital guardian role.
- Strategic Advice: When a threat is detected, consolidate their situation and clearly outline actionable next steps (how to document evidence, privacy settings, reporting links, or emergency helplines).

Formatting:
If casual chat: Respond warmly, concisely, and conversationally.
If threat detected:
1. Provide a warm, reassuring empathy acknowledgment.
2. List 3 to 4 clear, actionable next steps.`;

// In-memory chat sessions map for multi-turn chat memory
const sessionsMap = new Map<string, any>();

/**
 * Retrieves the Gemini API key from import.meta.env.VITE_GEMINI_API_KEY
 * with fallback to user-configured localStorage key.
 */
export function getGeminiApiKey(): string | null {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() && envKey !== 'YOUR_GEMINI_API_KEY') {
    return envKey.trim();
  }
  const localKey = localStorage.getItem('cybervigil_gemini_api_key');
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return null;
}

export function setGeminiApiKey(key: string): void {
  if (key && key.trim()) {
    localStorage.setItem('cybervigil_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('cybervigil_gemini_api_key');
  }
}

/**
 * Main AI Chat function using @google/genai SDK directly.
 * Throws errors or returns error states when API key is missing or call fails,
 * enabling real error messages in the chat UI.
 */
export async function askGuardianAI(
  userPrompt: string,
  history: ChatMessage[] = [],
  language: string = 'English',
  sessionId?: string
): Promise<AIAnalysisResult> {
  const apiKey = getGeminiApiKey();
  const activeSessionId = sessionId || 'default_session';

  if (!apiKey) {
    const errorMsg = 'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file or configure it in API Settings.';
    console.error('askGuardianAI Error:', errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Check if dynamic multi-turn chat session exists
    let chatSession = sessionsMap.get(activeSessionId);
    if (!chatSession) {
      // Convert UI history to @google/genai SDK format
      const sdkHistory = history
        .filter(msg => msg.sender === 'user' || msg.sender === 'assistant')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
        history: sdkHistory
      });
      sessionsMap.set(activeSessionId, chatSession);
    }

    const languagePrompt = language && language !== 'English' 
      ? `[User preferred language: ${language}. Please reply in ${language} while retaining supportive guardian persona.]\n${userPrompt}`
      : userPrompt;

    const response = await chatSession.sendMessage({ message: languagePrompt });
    const rawText = response.text || '';

    if (!rawText.trim()) {
      throw new Error('Received empty response from Gemini API.');
    }

    return parseAIResponse(userPrompt, rawText);
  } catch (error: any) {
    console.error('Error connecting to Gemini API:', error);
    // Remove failed session so future retries recreate chat session clean
    sessionsMap.delete(activeSessionId);
    throw error;
  }
}

/**
 * Parses real Gemini response text to extract threat signals and strategic steps.
 */
function parseAIResponse(userPrompt: string, aiText: string): AIAnalysisResult {
  const lowerPrompt = userPrompt.toLowerCase();
  
  const threatKeywords = [
    'threat', 'blackmail', 'extort', 'bully', 'harass', 'stalk', 'nude', 'photo',
    'leak', 'scam', 'hacked', 'abused', 'scared', 'suicide', 'kill', 'doxx', 'fake account'
  ];

  const containsThreat = threatKeywords.some(kw => lowerPrompt.includes(kw));

  if (!containsThreat) {
    return {
      response: aiText,
      detectedThreat: 'Conversational',
      urgencyLevel: 'low'
    };
  }

  let detectedThreat = 'Digital Safety Concern';
  let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium';

  if (lowerPrompt.includes('suicide') || lowerPrompt.includes('kill') || lowerPrompt.includes('harm')) {
    detectedThreat = 'Crisis & Emergency Support';
    urgencyLevel = 'critical';
  } else if (lowerPrompt.includes('nude') || lowerPrompt.includes('photo') || lowerPrompt.includes('leak') || lowerPrompt.includes('extort')) {
    detectedThreat = 'Sextortion / Digital Blackmail';
    urgencyLevel = 'high';
  } else if (lowerPrompt.includes('bully') || lowerPrompt.includes('harass')) {
    detectedThreat = 'Cyberbullying & Online Harassment';
    urgencyLevel = 'medium';
  } else if (lowerPrompt.includes('scam') || lowerPrompt.includes('hacked')) {
    detectedThreat = 'Cyber Crime / Financial Fraud';
    urgencyLevel = 'medium';
  }

  const lines = aiText.split('\n');
  const strategicSteps: string[] = [];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (/^[\d\*\-\•]\s*/.test(trimmed) && trimmed.length > 5) {
      strategicSteps.push(trimmed.replace(/^[\d\*\-\•]\s*/, ''));
    }
  });

  return {
    response: aiText,
    detectedThreat,
    urgencyLevel,
    empathyNote: 'You are safe here. Take a deep breath — we will guide you through this step by step.',
    strategicSteps: strategicSteps.length > 0 ? strategicSteps : [
      'Document evidence: Take unedited screenshots showing timestamps, usernames, and messages.',
      'Block & Do Not Delete: Block the offender immediately, but preserve the evidence chat history.',
      'File Anonymous Report: Submit a report on CyberVigil to generate an incident reference PIN.',
      'Contact Authorities: Call 1930 (Cyber Crime Helpline) or notify school nodal welfare officers.'
    ],
    actionLinks: [
      { label: 'File Anonymous Report', url: '/report', type: 'action' },
      { label: 'Cyber Crime Helpline (1930)', url: 'tel:1930', type: 'helpline' },
      { label: 'National Cyber Crime Portal', url: 'https://cybercrime.gov.in', type: 'link' }
    ]
  };
}
