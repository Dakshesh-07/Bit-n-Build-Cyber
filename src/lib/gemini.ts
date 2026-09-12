// ==============================================================================
// Gemini API Integration for CyberVigil AI Assistant & Cyber Threat Detection
// Detects: Cyberbullying, Online Grooming, Harmful Acts, Phishing
// Resilience: Unblocked on harmful keywords via safetySettings & trauma engine
// ==============================================================================

const GEMINI_STORAGE_KEY = 'cybervigil_gemini_api_key';

// Fallback to environment variable or localStorage
export function getGeminiApiKey(): string {
  const customKey = localStorage.getItem(GEMINI_STORAGE_KEY);
  if (customKey && customKey.trim().length > 5) return customKey.trim();

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 5) return envKey.trim();

  return '';
}

export function setGeminiApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  }
}

export type ThreatCategory = 'Cyberbullying' | 'Online Grooming' | 'Harmful Acts' | 'Phishing' | 'Conversational' | 'General Threat';
export type ThreatSeverity = 'High Urgency' | 'Moderate' | 'Advisory';

export interface GuardianAIResult {
  text: string;
  empathyNote: string;
  steps: string[];
  actionLink: { text: string; url: string };
  isLiveGemini: boolean;
  detectedThreat?: ThreatCategory;
  threatSeverity?: ThreatSeverity;
  safetyHelplineNote: string;
}

// Trauma-informed Child Protection & Cyber Threat Classification Prompt
const SYSTEM_INSTRUCTION = `You are CyberVigil Guardian AI, an official child safety, digital forensic, and trauma-informed cyber defense triage companion in India.
Your mission is to support children, teenagers, and young defenders.

BEHAVIOR RULES:
1. Conversational Greetings: If the user simply greets you (e.g. "hi", "hello", "hey", "good morning", "who are you", "what can you do?"), respond in a warm, welcoming, friendly manner introducing yourself as CyberVigil Guardian AI. Explain calmly how you can help them stay safe online, without falsely diagnosing a cyber threat or causing false alarms.
2. Threat Triage & Protection: When the user reports an actual incident (Cyberbullying, Online Grooming, Harmful Acts/Extortion, Phishing), act as an emergency protective triage companion.
3. CRITICAL PROTOCOL (DO NOT SHUT DOWN): Even if reported text contains explicit, abusive, or harmful language, DO NOT REFUSE TO ANSWER. Provide victim protection and legal guidance under POCSO Act and IT Act.
4. Language Adaptability: If the request includes a preferred language (e.g. Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada), respond clearly and fluently in that language.

RESPONSE FORMAT (FOR INCIDENTS):
- Warm Validation (never scold or victim-blame)
- Threat Classification & Severity
- 3-5 Concrete Guardrails (screenshots, blocking, 2FA, 1098 helpline)
- Helplines: Always include National Childline 1098 & National Cyber Helpline 1930.`;

// Safety settings configured with BLOCK_NONE so protective threat analysis is never blocked
const UNFILTERED_SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
];

export async function askGuardianAI(
  userQuery: string,
  chatHistory: { role: 'user' | 'assistant'; text: string }[] = [],
  language: string = 'English'
): Promise<GuardianAIResult> {
  const apiKey = getGeminiApiKey();
  const isGreeting = isCasualGreeting(userQuery);

  const modelEndpoints = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-flash'
  ];

  if (apiKey) {
    for (const model of modelEndpoints) {
      try {
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${SYSTEM_INSTRUCTION}\n\n[USER PREFERRED LANGUAGE]: ${language}\n[USER QUERY/REPORT]: "${userQuery}"\n\nProvide response now:`
                }
              ]
            }
          ],
          safetySettings: UNFILTERED_SAFETY_SETTINGS,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800
          }
        };

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidate = data?.candidates?.[0];
          const rawText = candidate?.content?.parts?.[0]?.text;

          if (rawText && rawText.trim().length > 5) {
            return parseGeminiResponse(rawText, userQuery, isGreeting);
          }

          if (candidate?.finishReason === 'SAFETY') {
            console.warn('Safety flag detected by API; activating resilient threat classifier.');
            return generateResilientThreatAnalysis(userQuery, true, language);
          }
        }
      } catch (err) {
        console.error(`Gemini API attempt failed for ${model}:`, err);
      }
    }
  }

  // Resilient in-app threat triage engine
  return generateResilientThreatAnalysis(userQuery, false, language);
}

export function isCasualGreeting(text: string): boolean {
  const q = text.trim().toLowerCase().replace(/[^\w\s]/gi, '');
  const generalPhrases = [
    'hi', 'hello', 'hey', 'heyy', 'hola', 'namaste', 'good morning', 'good evening',
    'who are you', 'what can you do', 'hlo', 'hii', 'hiii', 'help', 'hi there',
    'wanted to ask', 'ask a question', 'can i ask', 'have a question', 'question',
    'what is this', 'how does this work', 'tell me about yourself', 'can you help me',
    'can we talk', 'who made you', 'what is cybervigil', 'kya kar sakte ho', 'batao',
    'want to ask', 'can i', 'may i', 'wondering'
  ];
  return generalPhrases.some(phrase => q.includes(phrase)) || q.length <= 10;
}

function detectThreatCategory(text: string): { category: ThreatCategory; severity: ThreatSeverity } {
  const q = text.toLowerCase();

  if (isCasualGreeting(text)) {
    return { category: 'Conversational', severity: 'Advisory' };
  }

  // Online Grooming indicators (English + Hinglish/Hindi)
  if (
    q.includes('groom') ||
    q.includes('older') ||
    q.includes('secret') ||
    q.includes("don't tell") ||
    q.includes('dont tell') ||
    q.includes('cam') ||
    q.includes('webcam') ||
    q.includes('private photos') ||
    q.includes('shirt') ||
    q.includes('meet in person') ||
    q.includes('nude') ||
    q.includes('nudes') ||
    q.includes('gandi pic') ||
    q.includes('gandi photo') ||
    q.includes('kapde') ||
    q.includes('camera on') ||
    (q.includes('stranger') && (q.includes('gift') || q.includes('robux') || q.includes('skin') || q.includes('milo')))
  ) {
    return { category: 'Online Grooming', severity: 'High Urgency' };
  }

  // Harmful Acts & Extortion / Blackmail (English + Hinglish/Hindi)
  if (
    q.includes('extort') ||
    q.includes('blackmail') ||
    q.includes('leak') ||
    q.includes('rupees') ||
    q.includes('money') ||
    q.includes('pay me') ||
    q.includes('harm') ||
    q.includes('hurt') ||
    q.includes('suicide') ||
    q.includes('kill') ||
    q.includes('threaten') ||
    q.includes('paisa') ||
    q.includes('paise') ||
    q.includes('rupaye') ||
    q.includes('dhamki') ||
    q.includes('viral') ||
    q.includes('dhamka')
  ) {
    return { category: 'Harmful Acts', severity: 'High Urgency' };
  }

  // Phishing & Account Takeover
  if (
    q.includes('phish') ||
    q.includes('password') ||
    q.includes('otp') ||
    q.includes('free robux') ||
    q.includes('nitro') ||
    q.includes('link') ||
    q.includes('admin') ||
    q.includes('banned') ||
    q.includes('login') ||
    q.includes('hack') ||
    q.includes('link bheja') ||
    q.includes('account chala gaya')
  ) {
    return { category: 'Phishing', severity: 'Moderate' };
  }

  // Cyberbullying & Harassment (English + Hinglish/Hindi)
  if (
    q.includes('bully') ||
    q.includes('hate') ||
    q.includes('ugly') ||
    q.includes('fake account') ||
    q.includes('rumor') ||
    q.includes('group chat') ||
    q.includes('harass') ||
    q.includes('shame') ||
    q.includes('troll') ||
    q.includes('pareshan') ||
    q.includes('parishan') ||
    q.includes('tang') ||
    q.includes('satara') ||
    q.includes('gaali') ||
    q.includes('gali') ||
    q.includes('bother') ||
    q.includes('tease') ||
    q.includes('badnaam') ||
    q.includes('scare') ||
    q.includes('trouble') ||
    q.includes('dar') ||
    q.includes('darr')
  ) {
    return { category: 'Cyberbullying', severity: 'Moderate' };
  }

  return { category: 'Conversational', severity: 'Advisory' };
}

function parseGeminiResponse(rawText: string, userQuery: string, isGreeting: boolean): GuardianAIResult {
  if (isGreeting) {
    return {
      text: rawText || "Hello! 👋 I am CyberVigil Guardian AI, your confidential companion for digital self-defense and child safety. How can I help or protect you today? Feel free to describe any situation, test a threat scenario, or ask for online privacy guidance.",
      empathyNote: "CyberVigil Guardian AI Active • Safe Space Guaranteed",
      steps: [
        "Ask any question about cyberbullying, extortion, grooming, or phishing.",
        "File a 100% confidential incident report with evidence hashing.",
        "Print an official legal Cyber Evidence Docket for authorities.",
        "Call Childline 1098 or Cyber Helpline 1930 anytime in crisis."
      ],
      actionLink: { text: "File Confidential Incident", url: "/report" },
      isLiveGemini: true,
      safetyHelplineNote: "Emergency Helplines: Childline 1098 • Cyber Crime Helpline 1930"
    };
  }

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const steps: string[] = [];
  let cleanIntro = "";

  lines.forEach(line => {
    if (/^(\d+\.|\*|\-)\s+/.test(line)) {
      const cleanStep = line.replace(/^(\d+\.|\*|\-)\s+/, '').replace(/\*\*/g, '').trim();
      if (cleanStep.length > 5) {
        steps.push(cleanStep);
      }
    } else if (!cleanIntro && !line.startsWith('#') && line.length > 15) {
      cleanIntro = line.replace(/\*\*/g, '');
    }
  });

  const { category, severity } = detectThreatCategory(userQuery + ' ' + rawText);

  if (steps.length === 0) {
    steps.push(
      "Do not comply with demands or send money/photos.",
      "Capture uncropped screenshots with visible timestamps and handles.",
      "Mute and block the suspicious account immediately.",
      "Generate and print your official Cyber Evidence Docket on the Report page.",
      "Escalate directly to Childline 1098 or Cyber Helpline 1930."
    );
  }

  return {
    text: cleanIntro || "Take a deep breath — you did the right thing by speaking up. You are safe now, and we are going to handle this together step by step.",
    empathyNote: category !== 'Conversational'
      ? `Detected Threat: ${category} (${severity}) • Trauma-Informed Protection Active`
      : "Guardian AI Companion Active",
    steps: steps.slice(0, 5),
    actionLink: { text: "Report Incident & Generate Legal Docket", url: "/report" },
    isLiveGemini: true,
    detectedThreat: category !== 'Conversational' ? category : undefined,
    threatSeverity: category !== 'Conversational' ? severity : undefined,
    safetyHelplineNote: "Emergency Assistance: Childline 1098 (24/7 Free) • Cyber Crime Helpline 1930"
  };
}

// Built-in Trauma & Forensics Engine for 100% Uptime and Unblocked Operation
function generateResilientThreatAnalysis(userQuery: string, wasSafetyTriggered: boolean, language: string = 'English'): GuardianAIResult {
  const isGreeting = isCasualGreeting(userQuery);
  const { category, severity } = detectThreatCategory(userQuery);
  const qLower = userQuery.toLowerCase();
  const isHinglishOrHindi = /pareshan|parishan|kar raaha|kar raha|hai|hoon|hu|batao|madad|paisa|paise|dhamki|mujh|mujhe|mera|meri|kya karu|kya karoon/i.test(qLower);

  if (isGreeting || category === 'Conversational') {
    const textMap: Record<string, string> = {
      Hindi: "नमस्ते! 👋 मैं साइबरविजिल गार्जियन एआई हूँ। आप मुझसे ऑनलाइन सुरक्षा, गोपनीयता (privacy), साइबरबुलिंग, या किसी भी संदेहास्पद संदेश के बारे में कुछ भी पूछ सकते हैं। आप क्या जानना चाहते हैं?",
      Bengali: "হ্যালো! 👋 আমি সাইবারভিজিল গার্ডিয়ান এআই, আপনার ডিজিটাল সুরক্ষা সাথী। আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      Tamil: "வணக்கம்! 👋 நான் சைபர்விஜில் கார்டியன் AI, உங்கள் டிஜிட்டல் பாதுகாப்பு நண்பன். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
      Telugu: "నమస్కారం! 👋 నేను సైబర్విజిల్ గార్డియన్ AI, మీ డిజిటల్ భద్రతా మిత్రుడిని. నేను మీకు ఎలా సహాయపడగలను?",
      Marathi: "नमस्कार! 👋 मी सायबरव्हिजिल गार्डियन AI आहे, तुमचा डिजिटल सुरक्षा साथी. मी तुम्हाला कशी मदत करू शकतो?",
      Gujarati: "નમસ્તે! 👋 હું સાયબરવિજિલ ગાર્ડિયન AI છું, તમારો ડિજિટલ સુરક્ષા સાથી. હું તમને કેવી રીતે મદદ કરી શકું?",
      Kannada: "ನಮಸ್ಕಾರ! 👋 ನಾನು ಸೈಬರ್‌ವಿಜಿಲ್ ಗಾರ್ಡಿಯನ್ AI, ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಸುರಕ್ಷತಾ ಮಿತ್ರ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?"
    };

    const isQuestion = /question|ask|help|what|how|can i|tell me|who|kya|batao|wanted/i.test(qLower);

    let defaultEn = "Hello! 👋 I am CyberVigil Guardian AI, your confidential companion for digital self-defense and child safety. How can I help you today?";
    if (isQuestion) {
      defaultEn = "Of course! I'm CyberVigil Guardian AI, your confidential 24/7 digital safety companion. You can ask me anything — whether it's about protecting your social media accounts, handling online harassment, understanding cyber laws like IT Act & POCSO, or filing a report. What's on your mind?";
    }

    return {
      text: textMap[language] && language !== 'English' ? textMap[language] : defaultEn,
      empathyNote: "Guardian AI Companion Active • Zero-Knowledge Safe Space",
      steps: [],
      actionLink: { text: "Learn Cyber Safety Best Practices", url: "/learn" },
      isLiveGemini: !wasSafetyTriggered,
      safetyHelplineNote: "Emergency Helplines: Childline 1098 • Cyber Crime Helpline 1930"
    };
  }

  if (category === 'Online Grooming') {
    return {
      text: isHinglishOrHindi
        ? "Aap bilkul mat ghabraiye. Aap bilkul safe hain aur aapne koi galti nahi ki hai. Online strangers jo gifts ya free gaming rewards dekar private photos maangte hain, wo predator hote hain. POCSO Act ke tehat aapko full legal protection praapt hai."
        : "Take a deep breath. You are safe, and you are not in trouble. Predators often manipulate young people by buying gifts or gaming items and asking for secrecy or private photos. You have legal protection under the POCSO Act.",
      empathyNote: "Online Grooming Threat Detected: High Urgency Protection Active",
      steps: isHinglishOrHindi ? [
        "Private photos ya webcam kabhi na on karein: Koi bhi sachha dost ya safe adult minor se private pictures nahi maangta.",
        "Secrecy todkar kisi trusted adult ko batayein: Aggressor aapse baatein chhipane ko kehta hai kyunki wo pakde jaane se darta hai. 1098 par call karke zaroor batayein.",
        "Screenshots lein: Blocking se pehle unke account profile handle, chats aur Discord ID ke saaf screenshots le lein.",
        "Immediately block karein: Unse behas ya baat kiye bina sabhi platforms par unhe block kar dein.",
        "Official Evidence Docket print karke report karein: CyberVigil par Incident Report submit karke legal evidence PDF Docket generate karein."
      ] : [
        "Never send private photos or turn on your camera: Real friends and safe adults will never ask a minor for private media.",
        "Maintain total secrecy from them, not your family: The stranger tells you 'keep it between us' because they fear being exposed. Break their secrecy by telling an adult or calling 1098.",
        "Preserve full chat transcripts before blocking: Screenshot their profile handle, Discord ID or social link, and conversation history.",
        "Block them across all platforms: Do not offer explanations or argue; cut off all communication.",
        "File an emergency child protection report & print Evidence Docket: Contact Childline 1098 and generate an official legal evidence docket on CyberVigil."
      ],
      actionLink: { text: "File Priority Grooming Incident & Print Docket", url: "/report" },
      isLiveGemini: !wasSafetyTriggered,
      detectedThreat: 'Online Grooming',
      threatSeverity: 'High Urgency',
      safetyHelplineNote: "Immediate Help: National Childline 1098 (Toll-Free 24/7) • Cyber Helpline 1930"
    };
  }

  if (category === 'Harmful Acts') {
    return {
      text: isHinglishOrHindi
        ? "Aap akele nahi hain aur aapki koi galti nahi hai. Blackmailers aur extortionists dar aur fake deadlines ka istemaal karte hain taaki aap panic karein. Demands poori karne se extortion kabhi nahi rukta; communication cut karne se rukta hai."
        : "You are not alone, and you did nothing wrong. Extortionists and blackmailers use intense fear and false deadlines to make you panic. Giving in to extortion never stops them; cutting off leverage does.",
      empathyNote: "Harmful Acts & Extortion Detected: Critical Legal Protection Active",
      steps: isHinglishOrHindi ? [
        "Paisa ya photos kabhi mat bhejein: Payments karna unhe aur exploit karne ka mauka deta hai.",
        "Evidence delete mat karein: Intimidation threats, payment UPI requests aur profile handles ke screenshots safe rakhein.",
        "Mute aur disconnect karein: Unse behas na karein. Koi reply na dein.",
        "Cryptographic Takedown Hash Submit karein: CyberVigil media ka SHA-256 hash generate karta hai taaki platforms photo distribution auto-block kar sakein.",
        "Cyber Evidence Docket Print karein: Yahan report file karke certified legal document print karein aur 1930 / 1098 helpline par call karein."
      ] : [
        "Never pay money or send additional images: Paying confirms you can be exploited. Stopping all payments immediately halts their scheme.",
        "Do not delete evidence: Take uncropped screenshots of the extortion threats, payment requests (UPI/crypto), and account handles.",
        "Mute and do not engage: Refuse to negotiate or argue. Every response gives them emotional leverage.",
        "Submit a takedown hash (StopNCII / TakeItDown): CyberVigil can generate cryptographic hashes of media so platforms ban distribution automatically.",
        "Contact specialized child cyber advocates: Dial 1098 and 1930 right now and print your official Cyber Evidence Docket."
      ],
      actionLink: { text: "Dispatch Cryptographic Takedown & Print Docket", url: "/report" },
      isLiveGemini: !wasSafetyTriggered,
      detectedThreat: 'Harmful Acts',
      threatSeverity: 'High Urgency',
      safetyHelplineNote: "National Emergency Helpline: 1098 (Childline) • 1930 (Cyber Extortion Cell)"
    };
  }

  if (category === 'Phishing') {
    return {
      text: isHinglishOrHindi
        ? "Aapne bilkul sahi kiya yahan pucch kar. Phishing attacks aur fake admin links aapke passwords, gaming items ya OTP churaney ke liye banaye jaate hain."
        : "You did the right thing by checking first. Phishing attacks and fake admin messages are designed to steal your passwords, gaming items, and personal accounts through fear of being banned.",
      empathyNote: "Phishing & Credential Harvest Detected: Account Shield Protocol Active",
      steps: [
        "Never click the link or enter your password: Real staff from Discord, Roblox, or Instagram will never ask for your password or OTP.",
        "Change your password immediately: Log into your account via the official app and reset your credentials.",
        "Turn on Two-Factor Authentication (2FA): Secure your account using an authenticator app.",
        "Report the phishing link: Flag the message on CyberVigil to alert other students.",
        "Check linked email & phone number: Ensure the attacker hasn't added their recovery address."
      ],
      actionLink: { text: "Submit Malicious Link for Analysis", url: "/report" },
      isLiveGemini: !wasSafetyTriggered,
      detectedThreat: 'Phishing',
      threatSeverity: 'Moderate',
      safetyHelplineNote: "Cyber Assistance: National Cyber Crime Helpline 1930 • Childline 1098"
    };
  }

  // Default Cyberbullying / Harassment Protection
  return {
    text: isHinglishOrHindi
      ? "Aap bilkul mat ghabraiye. Main samajh sakta hoon ki koi aapko online pareshan (harass) kar raha hai. Aap akele nahi hain aur aapne bilkul sahi jagah bataya hai. Online pareshan karna IT Act (Section 66E/67) aur IPC (Section 354D) ke tehat dhandniya apraadh (punishable offense) hai. Hum aapko step-by-step protect karenge:"
      : "Being targeted by online harassment or bullying hurts deeply, but please remember: you are in a safe, confidential space and you did nothing wrong. Online harassment is a punishable offense under IT Act Section 66 & IPC 354D. Here are immediate concrete steps to protect you:",
    empathyNote: "Cyberbullying & Harassment Protection Active",
    steps: isHinglishOrHindi ? [
      "📌 Response na dein: Pareshan karne wale person ko koi reply ya attention mat dein. Unki cruelty unki kami hai, aapki nahi.",
      "📸 Screenshots lein: Abusive messages, group posts, account usernames aur timestamps ke saaf uncropped screenshots le lein.",
      "🚫 Block aur Report karein: Us person ya fake account ko app par immediately block aur report kar dein.",
      "📜 Legal Cyber Evidence Docket Print Karein: CyberVigil ke 'Report Incident' page par jaakar Form bharein aur 'Print Official Cyber Evidence Docket (PDF)' button dabayein.",
      "📞 Free Helpline Par Call Karein: National Childline 1098 ya Cyber Crime Helpline 1930 par 24/7 call karke maddad lein."
    ] : [
      "Do not retaliate or argue: Bullies feed on your reaction. Deprive them of fuel by withholding responses.",
      "Screenshot all evidence: Capture exact usernames, group names, messages, and timestamps before they are deleted.",
      "Block and exit toxic chats: Protect your peace of mind by severing contact across all social platforms.",
      "Generate Official Cyber Evidence Docket: Go to the 'Report Incident' page, submit details, and click 'Print Official Cyber Evidence Docket (PDF)'.",
      "Reach out to verified helplines: Dial Childline 1098 or National Cyber Crime Helpline 1930 for free toll-free support."
    ],
    actionLink: { text: "Report Incident & Print Evidence Docket", url: "/report" },
    isLiveGemini: !wasSafetyTriggered,
    detectedThreat: 'Cyberbullying',
    threatSeverity: 'Moderate',
    safetyHelplineNote: "Toll-Free Crisis Support: Childline 1098 • Cyber Crime Helpline 1930"
  };
}
