import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

export interface AIAnalysisResult {
  response: string;
  detectedThreat?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  strategicSteps?: string[];
  actionLinks?: { label: string; url: string; type: 'link' | 'action' | 'helpline' }[];
  empathyNote?: string;
}

const SYSTEM_INSTRUCTION = `You are Cyber Vigil, a supportive digital guardian.
- Normal Mode: If the user is just saying hello, asking general questions, or chatting casually, respond naturally, warmly, and normally like a friendly AI companion. Do not force cyber safety advice or jargon into casual talk.
- Detection & Consolidation Mode: Actively listen for underlying issues. If the user mentions or hints at cyberbullying, online harassment, stalkers, digital scams, or threats, seamlessly transition into your guardian role.
- Strategic Advice: When a problem is detected, consolidate their situation and clearly outline actionable next steps (such as how to safely document evidence, privacy settings to lock down, platform reporting links, or when to contact local authorities).

Formatting Instructions:
If the situation is normal casual chat:
Respond warmly, concisely, and conversationally. Do not include panic warnings or heavy safety checklists unless asked.

If a threat or crisis IS detected (bullying, harassment, extortion, stalking, scam, leak threat, etc.):
1. Acknowledge and support the user warmly with empathy.
2. Outline clear, bulleted strategic next steps.
3. Keep tone reassuring, practical, and action-oriented.`;

// In-memory chat sessions map for multi-turn chat memory
const sessionsMap = new Map<string, any>();

export function getGeminiApiKey(): string | null {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() && envKey !== 'YOUR_GEMINI_API_KEY') return envKey.trim();
  const localKey = localStorage.getItem('cybervigil_gemini_api_key');
  if (localKey && localKey.trim()) return localKey.trim();
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
 * Main AI Chat Interface with multi-turn memory and dynamic persona switching.
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
    return simulateLocalFallback(userPrompt);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Check if dynamic chat session exists
    let chatSession = sessionsMap.get(activeSessionId);
    if (!chatSession) {
      // Build SDK history from previous messages if available
      const sdkHistory = history.map(msg => ({
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
      ? `[User preferred language: ${language}. Please reply in ${language} while retaining supportive persona.]\n${userPrompt}`
      : userPrompt;

    const response = await chatSession.sendMessage({ message: languagePrompt });
    const rawText = response.text || '';

    return parseAIResponse(userPrompt, rawText);
  } catch (error) {
    console.warn('Google GenAI SDK call error, trying REST API fallback:', error);
    return fetchRestApiFallback(apiKey, userPrompt, history, language);
  }
}

/**
 * Fallback to direct Gemini REST API call if SDK experiences unexpected issues.
 */
async function fetchRestApiFallback(
  apiKey: string,
  userPrompt: string,
  history: ChatMessage[],
  language: string
): Promise<AIAnalysisResult> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const contents = [
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: `[Language: ${language}]\n${userPrompt}` }]
      }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents,
        generationConfig: { temperature: 0.7 }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return parseAIResponse(userPrompt, text);
  } catch (err) {
    console.error('Gemini REST API Fallback failed:', err);
    return simulateLocalFallback(userPrompt);
  }
}

/**
 * Intelligently analyzes response to determine if it is casual conversation or threat detection.
 */
function parseAIResponse(userPrompt: string, aiText: string): AIAnalysisResult {
  const lowerPrompt = userPrompt.toLowerCase();
  
  // Threat detection pattern matching
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

  // Determine threat category
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

  // Extract steps if present in AI response
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

/**
 * Local Fallback when no API Key is provided or network is offline.
 */
function simulateLocalFallback(userPrompt: string): AIAnalysisResult {
  const lower = userPrompt.toLowerCase();
  
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('who are you')) {
    return {
      response: "Hello! I'm Cyber Vigil, your supportive digital guardian. I'm here to chat, answer questions, or help keep you safe online. How can I assist you today?",
      detectedThreat: 'Conversational',
      urgencyLevel: 'low'
    };
  }

  if (lower.includes('bully') || lower.includes('threat') || lower.includes('scam') || lower.includes('photo') || lower.includes('leak')) {
    return {
      response: "I hear you, and I am here to help protect you. Cyberbullying and digital harassment are serious, but you have full legal rights and safe options.",
      detectedThreat: 'Cyberbullying & Cyber Safety Threat',
      urgencyLevel: 'high',
      empathyNote: 'Please stay calm. You are not alone and we will resolve this securely.',
      strategicSteps: [
        'Preserve evidence: Take screenshots including date, time, and full handle.',
        'Lock account privacy: Switch profiles to private mode and restrict direct messages.',
        'File an incident report on CyberVigil to alert certified child welfare officers.',
        'Call national emergency helpline 1930 for immediate cyber cell intervention.'
      ],
      actionLinks: [
        { label: 'File Anonymous Incident Report', url: '/report', type: 'action' },
        { label: 'Call Cyber Helpline 1930', url: 'tel:1930', type: 'helpline' }
      ]
    };
  }

  return {
    response: "Thank you for reaching out to Cyber Vigil. Whether you want advice on staying safe online or just want to chat, I'm here to support you.",
    detectedThreat: 'Conversational',
    urgencyLevel: 'low'
  };
}
