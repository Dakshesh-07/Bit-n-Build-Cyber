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
      response: aiText || "I'm Cyber Vigil, here to listen and help! How are you doing today?",
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
 * Intelligent Local Fallback for offline mode or when API key is not configured.
 */
function simulateLocalFallback(userPrompt: string): AIAnalysisResult {
  const lower = userPrompt.toLowerCase().trim();

  // 1. Greetings & Casual Chat
  if (/^(hi|hello|hey|greetings|good morning|good evening|who are you|what is your name)/i.test(lower) || lower === 'test') {
    return {
      response: "Hello! I'm Cyber Vigil, your 24/7 digital guardian and companion. I'm here to chat casually, answer questions about online privacy, or help protect you if you ever face cyberbullying or threats online. How can I help you today?",
      detectedThreat: 'Conversational',
      urgencyLevel: 'low'
    };
  }

  // 2. Cyberbullying & Harassment
  if (lower.includes('bully') || lower.includes('harass') || lower.includes('insult') || lower.includes('mean messages') || lower.includes('troll')) {
    return {
      response: "I am really sorry you are dealing with online harassment. Nobody has the right to intimidate or abuse you online. Remember: this is not your fault, and you do not have to handle it alone.",
      detectedThreat: 'Cyberbullying & Online Harassment',
      urgencyLevel: 'medium',
      empathyNote: 'Take a moment to pause. We are here to support and protect you.',
      strategicSteps: [
        'Do Not Respond: Engaging with bullies often escalates the harassment.',
        'Document Evidence: Take clear screenshots of all messages, comments, and profile handles before blocking.',
        'Privacy Lockdown: Set your social profiles to private and restrict comment permissions.',
        'Report & Escalate: Submit an incident report on CyberVigil or notify your school counselor.'
      ],
      actionLinks: [
        { label: 'File Anonymous Incident Report', url: '/report', type: 'action' },
        { label: 'Childline Emergency (1098)', url: 'tel:1098', type: 'helpline' }
      ]
    };
  }

  // 3. Sextortion, Leaks, Nudes & Blackmail
  if (lower.includes('photo') || lower.includes('nude') || lower.includes('leak') || lower.includes('extort') || lower.includes('blackmail') || lower.includes('threat')) {
    return {
      response: "Please stay calm. Digital extortion and illegal sharing of intimate photos are serious criminal offenses under IT Act Section 66E / 67A and IPC Section 384. Extortionists rely on panic, but you have full legal protection and statutory takedown avenues.",
      detectedThreat: 'Sextortion / Digital Blackmail',
      urgencyLevel: 'high',
      empathyNote: 'Do not transfer money or comply with threats. You are protected under strict victim privacy laws.',
      strategicSteps: [
        'Stop All Communication: Immediately cut contact with the extortionist.',
        'Preserve Chat History: Save uncropped screenshots containing full phone numbers or social handles.',
        'Report to Cyber Cell: Submit your case on www.cybercrime.gov.in under Women & Children Protection.',
        'File CyberVigil Docket: Generate a certified legal evidence docket to present to law enforcement.'
      ],
      actionLinks: [
        { label: 'Generate Cyber Evidence Docket', url: '/report', type: 'action' },
        { label: 'National Cyber Crime Helpline (1930)', url: 'tel:1930', type: 'helpline' }
      ]
    };
  }

  // 4. Scams, Hacking & Financial Fraud
  if (lower.includes('scam') || lower.includes('hacked') || lower.includes('money') || lower.includes('fraud') || lower.includes('phishing') || lower.includes('otp')) {
    return {
      response: "If your account has been compromised or you suspect financial fraud, immediate action is critical to safeguard your funds and identity.",
      detectedThreat: 'Cyber Crime / Financial Fraud',
      urgencyLevel: 'high',
      empathyNote: 'Act fast to block unauthorized access and freeze pending transactions.',
      strategicSteps: [
        'Freeze Accounts: Contact your bank or payment app immediately to freeze compromised cards.',
        'Call 1930 Immediately: Dial National Cyber Financial Helpline 1930 within the golden hour to freeze fraudulent transfers.',
        'Reset Passwords: Turn on 2-Factor Authentication (2FA) across your main email and social accounts.',
        'Report Phishing: Lodge a complaint on the official portal at cybercrime.gov.in.'
      ],
      actionLinks: [
        { label: 'Call Financial Cyber Helpline 1930', url: 'tel:1930', type: 'helpline' },
        { label: 'National Cyber Crime Portal', url: 'https://cybercrime.gov.in', type: 'link' }
      ]
    };
  }

  // 5. Default General Response
  return {
    response: `Thank you for reaching out to Cyber Vigil! I am configured to help you navigate digital safety, report cyber crimes, protect your privacy, or simply talk things through. What specific situation or question would you like advice on?`,
    detectedThreat: 'Conversational',
    urgencyLevel: 'low'
  };
}
