import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

export interface AIAnalysisResult {
  response: string;
  detectedThreat?: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  strategicSteps?: string[];
  actionLinks?: { label: string; url: string; type: 'link' | 'action' | 'helpline' }[];
  empathyNote?: string;
  isBuiltInEngine?: boolean;
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
 * Main AI Chat function using @google/genai SDK when API key is available,
 * with intelligent built-in fallback engine so the assistant is ALWAYS operational.
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
    console.info('Gemini API key not set. Using CyberVigil Built-in Guardian Engine.');
    return getBuiltInGuardianResponse(userPrompt, 'Note: Configure your VITE_GEMINI_API_KEY or click API Settings to connect live Gemini AI cloud models.');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Check if dynamic multi-turn chat session exists
    let chatSession = sessionsMap.get(activeSessionId);
    if (!chatSession) {
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
    console.error('Error connecting to Gemini API (falling back to built-in guardian engine):', error);
    sessionsMap.delete(activeSessionId);
    return getBuiltInGuardianResponse(userPrompt, `API Notice: Live Gemini cloud connection failed (${error?.message || 'Check API key'}). Using CyberVigil built-in engine.`);
  }
}

/**
 * Intelligent built-in conversational guardian engine.
 * Ensures CyberVigil ALWAYS responds naturally to greetings, questions, and threats.
 */
function getBuiltInGuardianResponse(userPrompt: string, note?: string): AIAnalysisResult {
  const lower = userPrompt.toLowerCase().trim();

  // 1. Greetings & Casual Chat
  if (/^(hi|hello|hey|greetings|good morning|good evening|who are you|what is your name|tell me about yourself|help)/i.test(lower) || lower === 'test') {
    return {
      response: "Hello! I am CyberVigil, your 24/7 digital guardian and companion. I am here to chat casually, answer questions about online privacy, guide you on legal protections, or step in to help if you ever face cyberbullying or threats online. How can I support you today?",
      detectedThreat: 'Conversational',
      urgencyLevel: 'low',
      empathyNote: note || 'You are safe here. Ask me anything about digital safety or talk through what is on your mind.'
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

  // 5. Default Response
  return {
    response: `Thank you for reaching out to CyberVigil! I am here to help you navigate digital safety, report cyber crimes, protect your privacy, or talk things through. What specific situation or question can I assist you with right now?`,
    detectedThreat: 'Conversational',
    urgencyLevel: 'low',
    empathyNote: note || 'CyberVigil digital protection active.'
  };
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
