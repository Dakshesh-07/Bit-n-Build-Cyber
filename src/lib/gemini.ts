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

const CANDIDATE_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash-exp'
];

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
 * Main AI Chat function using REST API fetch fallback + @google/genai SDK.
 */
export async function askGuardianAI(
  userPrompt: string,
  history: ChatMessage[] = [],
  language: string = 'English',
  sessionId?: string
): Promise<AIAnalysisResult> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      // 1. Try SDK call first
      const ai = new GoogleGenAI({ apiKey });
      const sdkHistory = history
        .filter(msg => msg.sender === 'user' || msg.sender === 'assistant')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      const languagePrompt = language && language !== 'English' 
        ? `[User preferred language: ${language}. Reply in ${language} while retaining guardian persona.]\n${userPrompt}`
        : userPrompt;

      const contents = [
        ...sdkHistory,
        { role: 'user', parts: [{ text: languagePrompt }] }
      ];

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
            }
          });

          const rawText = response.text || '';
          if (rawText.trim()) {
            const parsed = parseAIResponse(userPrompt, rawText);
            return {
              ...parsed,
              isBuiltInEngine: false
            };
          }
        } catch (mErr) {
          console.warn(`Model ${modelName} SDK attempt failed:`, mErr);
        }
      }

      // 2. Direct REST fetch attempt if SDK wrapper hits environment issues
      const restResult = await callDirectGeminiRest(apiKey, userPrompt, history, language);
      if (restResult) {
        const parsed = parseAIResponse(userPrompt, restResult);
        return {
          ...parsed,
          isBuiltInEngine: false
        };
      }
    } catch (err) {
      console.error('Gemini Cloud API call failed:', err);
    }
  }

  // Fallback to intelligent built-in guardian engine
  return getBuiltInGuardianResponse(
    userPrompt,
    apiKey ? undefined : 'Note: Configure VITE_GEMINI_API_KEY or click API Settings to connect live Gemini cloud AI.'
  );
}

/**
 * Direct REST fetch to Google Gemini endpoint for maximum reliability in browser environments.
 */
async function callDirectGeminiRest(
  apiKey: string,
  prompt: string,
  history: ChatMessage[],
  language?: string
): Promise<string | null> {
  const formattedContents = history
    .filter(m => m.sender === 'user' || m.sender === 'assistant')
    .map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

  const userText = language && language !== 'English' 
    ? `[Respond in ${language}]: ${prompt}`
    : prompt;

  formattedContents.push({
    role: 'user',
    parts: [{ text: userText }]
  });

  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    contents: formattedContents,
    generationConfig: {
      temperature: 0.7
    }
  };

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text.trim();
        }
      }
    } catch (e) {
      console.warn(`Direct fetch to ${model} failed:`, e);
    }
  }
  return null;
}

/**
 * Intelligent, comprehensive built-in guardian engine.
 * Dynamically answers any question, link query, threat, or casual prompt.
 */
function getBuiltInGuardianResponse(userPrompt: string, note?: string): AIAnalysisResult {
  const lower = userPrompt.toLowerCase().trim();

  // 1. Suspicious Links / Phishing Queries
  if (lower.includes('link') || lower.includes('url') || lower.includes('click') || lower.includes('website') || lower.includes('http') || lower.includes('domain')) {
    return {
      response: "Be extremely cautious before clicking any unfamiliar links. Scammers and cybercriminals frequently use suspicious links to trick you into downloading malware, giving away passwords, or surrendering financial details.",
      detectedThreat: 'Phishing & Malicious Link Detection',
      urgencyLevel: 'medium',
      empathyNote: 'Your caution is very smart! Never click a link until you have verified its origin.',
      isBuiltInEngine: true,
      strategicSteps: [
        'Inspect the URL: Hover over the link to see the actual destination address. Look out for misspellings like "g00gle.com" or strange subdomains.',
        'Never Enter Credentials: If a link takes you to a login page or asks for an OTP or password, close it immediately.',
        'Scan with Safety Tools: Paste the link into free URL scanners like VirusTotal (virustotal.com) or Google Transparency Report before opening.',
        'Verify via Main Channel: Contact the sender through an official phone number or separate app to confirm if they actually sent it.'
      ],
      actionLinks: [
        { label: 'Check Link on VirusTotal', url: 'https://www.virustotal.com', type: 'link' },
        { label: 'Report Phishing Scam', url: '/report', type: 'action' }
      ]
    };
  }

  // 2. Passwords, Hacking & Account Security
  if (lower.includes('password') || lower.includes('hack') || lower.includes('account') || lower.includes('login') || lower.includes('otp') || lower.includes('stolen')) {
    return {
      response: "If you suspect an account compromise, immediate proactive steps will prevent further unauthorized access to your identity and data.",
      detectedThreat: 'Account Compromise & Credential Safety',
      urgencyLevel: 'high',
      empathyNote: 'Do not panic. Act quickly to lock out unauthorized devices.',
      isBuiltInEngine: true,
      strategicSteps: [
        'Change Passwords Immediately: Update your password using a strong, unique combination of letters, numbers, and symbols.',
        'Enable 2-Factor Authentication (2FA): Turn on 2FA using an authenticator app or SMS code.',
        'Revoke Active Sessions: Go to account security settings and choose "Log out of all other devices".',
        'Never Share OTPs: Remember that bank officials and app support will NEVER ask for your OTP or PIN.'
      ],
      actionLinks: [
        { label: 'Report Compromised Account', url: '/report', type: 'action' },
        { label: 'National Cyber Crime Helpline (1930)', url: 'tel:1930', type: 'helpline' }
      ]
    };
  }

  // 3. Cyberbullying & Online Harassment
  if (lower.includes('bully') || lower.includes('harass') || lower.includes('insult') || lower.includes('mean') || lower.includes('troll') || lower.includes('stalk')) {
    return {
      response: "I am really sorry you are dealing with online harassment. Nobody has the right to intimidate or abuse you online. Remember: this is not your fault, and you do not have to handle it alone.",
      detectedThreat: 'Cyberbullying & Online Harassment',
      urgencyLevel: 'medium',
      empathyNote: 'Take a deep breath. We are here to support and protect you.',
      isBuiltInEngine: true,
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

  // 4. Sextortion, Leaks & Blackmail
  if (lower.includes('photo') || lower.includes('nude') || lower.includes('leak') || lower.includes('extort') || lower.includes('blackmail') || lower.includes('threat')) {
    return {
      response: "Please stay calm. Digital extortion and illegal sharing of intimate photos are serious criminal offenses under IT Act Section 66E / 67A and IPC Section 384. Extortionists rely on panic, but you have full legal protection and statutory takedown avenues.",
      detectedThreat: 'Sextortion / Digital Blackmail',
      urgencyLevel: 'high',
      empathyNote: 'Do not transfer money or comply with threats. You are protected under strict victim privacy laws.',
      isBuiltInEngine: true,
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

  // 5. Financial Scams & Fraud
  if (lower.includes('scam') || lower.includes('money') || lower.includes('fraud') || lower.includes('bank') || lower.includes('upi') || lower.includes('card')) {
    return {
      response: "If your account has been compromised or you suspect financial fraud, immediate action is critical to safeguard your funds and identity.",
      detectedThreat: 'Cyber Crime / Financial Fraud',
      urgencyLevel: 'high',
      empathyNote: 'Act fast to block unauthorized access and freeze pending transactions.',
      isBuiltInEngine: true,
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

  // 6. Greetings & Open Casual Conversation
  if (/^(hi|hello|hey|greetings|good morning|good evening|who are you|what is your name|tell me about yourself|help|how are you)/i.test(lower) || lower === 'test') {
    return {
      response: "Hello! I am CyberVigil, your 24/7 digital guardian and companion. I am doing well, thank you! I am here to chat casually, answer questions about online privacy, guide you on legal protections, or step in to help if you ever face cyberbullying or threats online. How can I support you today?",
      detectedThreat: 'Conversational',
      urgencyLevel: 'low',
      empathyNote: note || 'You are safe here. Ask me anything about digital safety or talk through what is on your mind.',
      isBuiltInEngine: true
    };
  }

  // 7. General Open-Ended Safety & Companion Response
  return {
    response: `Thank you for asking! As CyberVigil, I am equipped to analyze links, evaluate cyber security threats, guide you through account recovery, protect your privacy, and provide legal reporting advice. What specific detail can I clarify for you right now?`,
    detectedThreat: 'General Guidance',
    urgencyLevel: 'low',
    empathyNote: note || 'CyberVigil digital protection active.',
    isBuiltInEngine: true
  };
}

/**
 * Parses real Gemini response text to extract threat signals and strategic steps.
 */
function parseAIResponse(userPrompt: string, aiText: string): AIAnalysisResult {
  const lowerPrompt = userPrompt.toLowerCase();
  
  const threatKeywords = [
    'threat', 'blackmail', 'extort', 'bully', 'harass', 'stalk', 'nude', 'photo',
    'leak', 'scam', 'hacked', 'abused', 'scared', 'suicide', 'kill', 'doxx', 'fake account', 'link'
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
  } else if (lowerPrompt.includes('scam') || lowerPrompt.includes('hacked') || lowerPrompt.includes('link')) {
    detectedThreat = 'Cyber Crime / Phishing Threat';
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
