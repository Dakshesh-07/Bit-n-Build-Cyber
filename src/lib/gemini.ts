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

const CANDIDATE_MODELS = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-pro-latest',
  'gemini-3.6-flash',
  'gemini-3.5-flash'
];

const SYSTEM_INSTRUCTION = `You are CyberVigil, an empathetic, highly intelligent 24/7 digital safety guardian and youth companion.
- Tone: Warm, expert, friendly, conversational, and supportive.
- You can answer ANY question the user asks (general knowledge, science, digital safety, privacy, life advice, coding, or casual chat).
- If the user reports threats, harassment, grooming, or physical safety risks, provide supportive advice and 3 to 4 clear action steps.`;

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
 * Main CyberVigil AI Function - Live Google Gemini API Integration
 */
export async function askGuardianAI(
  userPrompt: string,
  history: ChatMessage[] = [],
  language: string = 'English',
  sessionId?: string
): Promise<AIAnalysisResult> {
  console.log("🔥 CYBERVIGIL LIVE GEMINI AI EXECUTED -> Prompt:", userPrompt);

  const apiKey = getGeminiApiKey();

  // 1. Try Google Gemini API if an API key is present
  if (apiKey) {
    const contents = [
      ...history
        .filter(m => m.sender === 'user' || m.sender === 'assistant')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
      {
        role: 'user',
        parts: [
          {
            text: language && language !== 'English'
              ? `${SYSTEM_INSTRUCTION}\n\n[Please respond in ${language}]\n\nUser: ${userPrompt}`
              : `${SYSTEM_INSTRUCTION}\n\nUser: ${userPrompt}`
          }
        ]
      }
    ];

    // Try candidate active models sequentially
    for (const model of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0];
          const parts = candidate?.content?.parts || [];
          const text = parts.map((p: any) => p.text).join('\n').trim();

          if (text) {
            console.log(`✅ Success via Gemini Cloud API model: ${model}`);
            return {
              ...parseAIResponse(userPrompt, text),
              isBuiltInEngine: false
            };
          }
        } else {
          const errText = await res.text();
          console.warn(`Gemini Model ${model} returned ${res.status}:`, errText);
        }
      } catch (err) {
        console.warn(`Gemini Model ${model} fetch exception:`, err);
      }
    }
  }

  // 2. Fallback to Guardian Engine
  console.info("Using CyberVigil Offline Safety Engine.");
  return getOfflineSafetyResponse(userPrompt);
}

/**
 * Offline Safety Engine (Only used if network drops or key is absent)
 */
function getOfflineSafetyResponse(userPrompt: string): AIAnalysisResult {
  const lower = userPrompt.toLowerCase().trim();

  if (
    lower.includes('kill me') ||
    lower.includes('threaten to kill') ||
    lower.includes('threatening to kill') ||
    lower.includes('death threat') ||
    lower.includes('harm me')
  ) {
    return {
      response: "🚨 **URGENT SAFETY ALERT**: Please treat death threats with immediate seriousness. Your physical safety is the absolute top priority.\n\n**Immediate Protective Actions:**\n1. **Contact Emergency Services**: Call Police (112) or Cyber Crime Helpline (1930) immediately.\n2. **Do Not Delete Messages**: Take clear, unedited screenshots of the threats showing sender details.\n3. **Inform Trusted Adults / Authorities**: Notify family or school officers right away.",
      detectedThreat: 'Severe Physical Threat & Extortion',
      urgencyLevel: 'critical',
      empathyNote: 'Take a deep breath — you are not alone. Reach out to emergency services immediately.',
      isBuiltInEngine: true,
      strategicSteps: [
        'Call Police / Emergency: Dial 112 or Cyber Helpline 1930 immediately.',
        'Preserve Screenshot Evidence: Save uncropped screenshots of all threatening messages.',
        'Notify Family / Adults: Inform trusted adults or school welfare officers.'
      ],
      actionLinks: [
        { label: 'Call Emergency Police (112)', url: 'tel:112', type: 'helpline' },
        { label: 'Call Cyber Crime Helpline (1930)', url: 'tel:1930', type: 'helpline' }
      ]
    };
  }

  if (
    lower.includes('send me photos') ||
    lower.includes('send me pics') ||
    lower.includes('asking for photos') ||
    lower.includes('send photos')
  ) {
    return {
      response: "⚠️ **Important Safety Warning**: Please **DO NOT** send any private, intimate, or personal photos to anyone online — regardless of who they claim to be.\n\n**What you should do right now:**\n1. Say **NO** firmly and refuse the request.\n2. **Block them immediately** if they pressure you.\n3. Save screenshots as evidence.",
      detectedThreat: 'Online Grooming & Image Safety',
      urgencyLevel: 'high',
      empathyNote: 'Stand your ground — your privacy and safety come first.',
      isBuiltInEngine: true,
      strategicSteps: [
        'Do Not Send Anything: Never send private pictures online.',
        'Block the Person: Stop replying and block their account.',
        'Save Evidence: Screenshot the chat history.'
      ],
      actionLinks: [
        { label: 'File Protection Report', url: '/report', type: 'action' },
        { label: 'Childline Emergency (1098)', url: 'tel:1098', type: 'helpline' }
      ]
    };
  }

  return {
    response: "Hello! As CyberVigil, I am here to answer your questions, assist with digital safety, or help you protect your online privacy. How can I assist you right now?",
    detectedThreat: 'Conversational',
    urgencyLevel: 'low',
    empathyNote: 'CyberVigil Safety Active',
    isBuiltInEngine: true
  };
}

function parseAIResponse(userPrompt: string, aiText: string): AIAnalysisResult {
  const lowerPrompt = userPrompt.toLowerCase();
  
  const containsCrisis = lowerPrompt.includes('kill me') || lowerPrompt.includes('threaten to kill') || lowerPrompt.includes('death threat') || lowerPrompt.includes('harm me');
  const containsExtortion = lowerPrompt.includes('nude') || lowerPrompt.includes('blackmail') || lowerPrompt.includes('extort') || lowerPrompt.includes('intimate photo') || lowerPrompt.includes('leak my photo');
  const containsBullying = lowerPrompt.includes('bully') || lowerPrompt.includes('harass') || lowerPrompt.includes('hate chat') || lowerPrompt.includes('stalking me');
  const containsPhishing = lowerPrompt.includes('phishing') || lowerPrompt.includes('fake login') || lowerPrompt.includes('suspicious link');
  const containsGrooming = lowerPrompt.includes('send me photos') || lowerPrompt.includes('send pics') || lowerPrompt.includes('asking for photos');

  if (!containsCrisis && !containsExtortion && !containsBullying && !containsPhishing && !containsGrooming) {
    return {
      response: aiText,
      detectedThreat: 'Conversational',
      urgencyLevel: 'low'
    };
  }

  let detectedThreat = 'Digital Safety Concern';
  let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium';

  if (containsCrisis) {
    detectedThreat = 'Severe Physical Threat & Extortion';
    urgencyLevel = 'critical';
  } else if (containsExtortion) {
    detectedThreat = 'Sextortion / Digital Blackmail';
    urgencyLevel = 'critical';
  } else if (containsGrooming) {
    detectedThreat = 'Online Grooming & Image Safety';
    urgencyLevel = 'high';
  } else if (containsBullying) {
    detectedThreat = 'Cyberbullying & Online Harassment';
    urgencyLevel = 'medium';
  } else if (containsPhishing) {
    detectedThreat = 'Phishing & Malicious Link Detection';
    urgencyLevel = 'medium';
  }

  return {
    response: aiText,
    detectedThreat,
    urgencyLevel,
    empathyNote: 'You are safe here. Take a deep breath — we are here to support you step by step.',
    strategicSteps: [
      'Document evidence: Take unedited screenshots showing timestamps, usernames, and messages.',
      'Block & Do Not Delete: Block the offender immediately, but preserve the evidence chat history.',
      'File Anonymous Report: Submit a report on CyberVigil to generate an incident reference PIN.',
      'Contact Authorities: Call 1930 (Cyber Crime Helpline) or 112 (Emergency Police).'
    ],
    actionLinks: [
      { label: 'File Emergency Docket', url: '/report', type: 'action' },
      { label: 'Cyber Crime Helpline (1930)', url: 'tel:1930', type: 'helpline' },
      { label: 'Emergency Police (112)', url: 'tel:112', type: 'helpline' }
    ]
  };
}
