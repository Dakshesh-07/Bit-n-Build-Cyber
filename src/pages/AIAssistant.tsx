import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Trash2, 
  Mic, 
  MicOff,
  PhoneCall, 
  ArrowRight, 
  Lock, 
  ShieldAlert, 
  Key, 
  X, 
  Check, 
  Globe,
  FileText,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ChatMessage } from '../types';
import { askGuardianAI, getGeminiApiKey, setGeminiApiKey } from '../lib/gemini';
import { useAuth } from '../context/AuthContext';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: "Hello! Welcome to CyberVigil Guardian AI. You are in a completely safe, private, zero-knowledge space. Take a deep breath — you are not alone, nothing here is judged or tracked, and you remain in total control.\n\nHow can I support you today? You can describe what happened in your own words, ask for safety steps, or explore key threat definitions below.",
    timestamp: 'Just now',
    empathyNote: "Zero-Knowledge Trauma Support Active",
    detectedThreat: 'Conversational',
    threatSeverity: 'Advisory',
    steps: [
      "🛡️ Doxxing: The unauthorized posting of your private personal information (like address, school, phone number, or real identity) online to harass or intimidate you.",
      "🚨 Online Extortion / Sextortion: When someone threatens to share private photos, chats, or secrets unless you send money, more photos, or meet demands.",
      "👁️ Online Grooming: When a predator builds fake trust or friendship online over time to manipulate or ask for inappropriate private photos/favors.",
      "🎣 Phishing & Account Hijacking: Fake verification links or login pages sent to trick you into giving away your passwords or OTPs."
    ],
    actionLink: {
      text: "Feel free to type your message or select a topic below...",
      url: "#"
    }
  }
];

const SUGGESTED_PROMPTS = [
  {
    category: 'Cyberbullying',
    label: 'Cyberbullying: Harassment in group chat',
    prompt: 'A group of classmates created a hate chat sharing edited photos and making fun of me.'
  },
  {
    category: 'Online Grooming',
    label: 'Online Grooming: Stranger asking for private webcam',
    prompt: 'An older player on my gaming server offered me free currency and asked me to turn on my camera in private.'
  },
  {
    category: 'Harmful Acts',
    label: 'Harmful Acts: Blackmail & extortion threats',
    prompt: 'Someone has an embarrassing picture of me and says they will leak it unless I pay 5,000 rupees.'
  },
  {
    category: 'Phishing',
    label: 'Phishing: Fake login link & OTP request',
    prompt: 'I received a link from a supposed Discord admin claiming my account will be deleted unless I verify my password and OTP.'
  }
];

const REGIONAL_LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Hindi', label: 'हिंदी (Hindi)' },
  { code: 'Bengali', label: 'বাংলা (Bengali)' },
  { code: 'Tamil', label: 'தமிழ் (Tamil)' },
  { code: 'Telugu', label: 'తెలుగు (Telugu)' },
  { code: 'Marathi', label: 'मराठी (Marathi)' },
  { code: 'Gujarati', label: 'ગુજરાતી (Gujarati)' },
  { code: 'Kannada', label: 'ಕನ್ನಡ (Kannada)' }
];

export const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  
  // API Key Modal (Admin only)
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [savedKeySuccess, setSavedKeySuccess] = useState<boolean>(false);

  // Voice to Text Feature
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const key = getGeminiApiKey();
    setHasApiKey(Boolean(key));
    setApiKeyInput(key || '');
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput);
    setHasApiKey(Boolean(apiKeyInput.trim()));
    setSavedKeySuccess(true);
    setTimeout(() => {
      setSavedKeySuccess(false);
      setApiKeyModalOpen(false);
    }, 1500);
  };

  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Unique session ID tracking per user session
  const sessionIdRef = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    try {
      const result = await askGuardianAI(text, messages, selectedLanguage, sessionIdRef.current);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: result.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        empathyNote: result.empathyNote,
        steps: result.strategicSteps,
        actionLink: result.actionLinks?.[0] ? { text: result.actionLinks[0].label, url: result.actionLinks[0].url } : undefined,
        detectedThreat: result.detectedThreat,
        threatSeverity: result.urgencyLevel === 'high' || result.urgencyLevel === 'critical' ? 'High Urgency' : undefined,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Error connecting to Gemini AI API:', err);
      const errorMsgText = err?.message || 'Error connecting to AI. Please check your Gemini API Key.';
      const errorBotMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: `Error connecting to AI: ${errorMsgText}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedThreat: 'API Connection Failure',
        threatSeverity: 'High Urgency',
      };
      setMessages(prev => [...prev, errorBotMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleGenerateAICaseReport = () => {
    const userTexts = messages.filter(m => m.sender === 'user').map(m => m.text).join(' | ');
    const lastBotMsg = messages.filter(m => m.sender === 'assistant').slice(-1)[0];

    const draftReport = {
      category: lastBotMsg?.detectedThreat === 'Online Grooming' ? 'Impersonation' :
                lastBotMsg?.detectedThreat === 'Harmful Acts' ? 'Extortion' :
                lastBotMsg?.detectedThreat === 'Phishing' ? 'Impersonation' : 'Cyberbullying',
      details: userTexts || 'Incident documented during confidential Guardian AI assistance session.',
      threatScore: lastBotMsg?.threatSeverity === 'High Urgency' ? 88 : 65
    };

    localStorage.setItem('cybervigil_case_draft', JSON.stringify(draftReport));
    navigate('/report');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* 1. Assistant Header & Reassurance Banner */}
      <section className="bg-surface rounded-2xl p-6 sm:p-7 border border-sand-300 dark:border-slate-800 shadow-warm-card space-y-4">
        {/* Top Row: Title & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/cybervigil-shield.png" 
              alt="CyberVigil Guardian" 
              className="w-10 h-10 object-contain filter drop-shadow-sm flex-shrink-0" 
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary dark:text-slate-100 leading-tight">
                CyberVigil Guardian AI
              </h1>
            </div>
          </div>

          {/* Action Controls & Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Regional Language Selector */}
            <div className="flex items-center gap-1.5 bg-sand-100 border border-sand-300 dark:bg-slate-800 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <Globe className="w-3.5 h-3.5 text-secondary dark:text-orange-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent font-bold text-primary dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                {REGIONAL_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-900 dark:text-slate-200">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Gemini API Key Configuration Button */}
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-sand-300 dark:border-slate-700 text-xs font-bold text-textDark dark:text-slate-200 hover:bg-sand-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Configure Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-secondary dark:text-orange-400" />
              <span>API Settings</span>
            </button>

            {/* Slim "You are safe" Pill Badge */}
            <div className="py-1.5 px-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 shadow-xs whitespace-nowrap flex-shrink-0">
              <Heart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                You are safe here • 100% Confidential
              </span>
            </div>
          </div>
        </div>

        {/* Subtitle Row */}
        <p className="text-xs sm:text-sm text-textMuted dark:text-slate-400 border-t border-sand-200 dark:border-slate-800/80 pt-3">
          Configured to detect Cyberbullying, Online Grooming, Harmful Acts & Phishing with dynamic guardian support.
        </p>
      </section>

      {/* 2. Suggested Scenario Chips - 4 Major Cyber Threat Categories */}
      <section className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-textMuted dark:text-orange-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-secondary dark:text-orange-400" />
          Targeted Detection Scenarios (Tap to test):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SUGGESTED_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              className="text-left p-3.5 rounded-xl bg-surface hover:bg-sand-50/80 border border-sand-300 hover:border-sand-400 text-xs font-semibold text-primary dark:bg-slate-900 dark:hover:bg-slate-800/90 dark:border-slate-800 dark:hover:border-slate-700 dark:text-slate-200 transition-all duration-200 shadow-warm-sm hover:shadow-warm-card active:scale-[0.99] group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-secondary-dark dark:text-orange-300 group-hover:dark:text-orange-200">{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-textMuted group-hover:translate-x-0.5 group-hover:text-primary dark:text-slate-400 dark:group-hover:text-orange-400 transition-all" />
              </div>
              <p className="text-[11px] text-textMuted dark:text-slate-400 mt-1 line-clamp-1 font-normal">"{item.prompt}"</p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Chat Thread Container */}
      <section className="bg-[#0b1329] dark:bg-[#0b132b] rounded-2xl p-4 sm:p-6 border border-[#1c2d5c] shadow-2xl space-y-6 min-h-[420px] flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header Bar with Ephemeral Session & AI Case Report Generator */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#1c2d5c] pb-4">
            <span className="px-3.5 py-1.5 rounded-full bg-[#0e162a] text-[11px] font-medium text-slate-300 border border-[#1e294b] shadow-xs">
              Ephemeral Session Started • Zero Permanent Logs
            </span>

            <button
              onClick={handleGenerateAICaseReport}
              className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-950/40 transition-all active:scale-95 cursor-pointer"
              title="Synthesize conversation into official incident report draft"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Generate AI Case Report Draft</span>
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Bot className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-200">Your conversation is completely clear.</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Type what happened or choose a prompt chip above to get calm, step-by-step protective instructions.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                  <span className="font-bold text-orange-400">
                    {msg.sender === 'user' ? 'You' : 'Guardian AI'}
                  </span>
                  <span>• {msg.timestamp}</span>
                </div>

                {msg.sender === 'user' ? (
                  <div className="bg-[#ea580c] text-white p-4 rounded-2xl rounded-tr-none text-sm max-w-lg leading-relaxed shadow-md shadow-orange-950/30">
                    {msg.text}
                  </div>
                ) : (
                  <div className="bg-[#101935] border border-[#1c2d5c] p-5 sm:p-6 rounded-2xl rounded-tl-none max-w-2xl space-y-4 shadow-xl">
                    {/* Threat Classification Badge */}
                    {msg.detectedThreat && msg.detectedThreat !== 'Conversational' && (
                      <div className="flex items-center gap-2 flex-wrap pb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${
                          msg.detectedThreat === 'Online Grooming'
                            ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                            : msg.detectedThreat === 'Harmful Acts'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                            : msg.detectedThreat === 'Phishing'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                            : 'bg-sky-950/80 text-sky-300 border-sky-500/40'
                        }`}>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Threat: {msg.detectedThreat}</span>
                          {msg.threatSeverity && <span className="opacity-80 font-normal">({msg.threatSeverity})</span>}
                        </span>
                        <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 font-semibold">
                          🛡️ Unblocked Guardrails Active
                        </span>
                      </div>
                    )}

                    {msg.empathyNote && (
                      <div className="p-3 rounded-xl bg-[#142147] border border-[#1e2f5f] text-xs text-[#a5f3fc] font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{msg.empathyNote}</span>
                      </div>
                    )}

                    <p className="text-sm text-slate-100 leading-relaxed font-normal">{msg.text}</p>

                    {msg.steps && msg.steps.length > 0 && (
                      <div className="space-y-2.5 pt-2 border-t border-[#1c2d5c]">
                        <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                          IMMEDIATE PROTECTIVE GUARDRAILS:
                        </span>
                        <div className="space-y-2">
                          {msg.steps.map((step, sIdx) => (
                            <div key={sIdx} className="p-3.5 rounded-xl bg-[#132042] border border-[#1c2d5c] flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-[#ea580c] text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                                {sIdx + 1}
                              </span>
                              <span className="text-xs text-slate-200 leading-relaxed font-medium">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Helplines and Action Button */}
                    <div className="pt-2 flex flex-wrap gap-2.5">
                      {msg.actionLink && (
                        <Link
                          to={msg.actionLink.url}
                          className="px-4 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-sm active:scale-95 group/btn"
                        >
                          <span>{msg.actionLink.text}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      )}
                      <a
                        href="tel:1098"
                        className="px-4 py-2.5 rounded-xl bg-[#142147] hover:bg-[#192a59] border border-[#1e2f5f] text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs active:scale-95"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                        <span>Call Childline 1098</span>
                      </a>
                      <a
                        href="tel:1930"
                        className="px-4 py-2.5 rounded-xl bg-[#142147] hover:bg-[#192a59] border border-[#1e2f5f] text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs active:scale-95"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                        <span>Cyber Helpline 1930</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Live Thinking Indicator */}
          {isThinking && (
            <div className="flex items-center gap-3 p-4 bg-[#101935] border border-[#1c2d5c] rounded-2xl max-w-sm animate-pulse">
              <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
              <span className="text-xs font-bold text-slate-200">
                Analyzing threat pattern & preparing child protection guardrails...
              </span>
            </div>
          )}
        </div>

        {/* 4. Safety Handoff Bar */}
        <div className="p-4 rounded-xl bg-[#101935] border border-[#1c2d5c] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-secondary dark:text-orange-400" />
            <span className="text-xs font-semibold text-textDark dark:text-slate-200">
              Need immediate human escalation or platform takedown?
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/report"
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover dark:bg-orange-600 dark:hover:bg-orange-500 text-surface dark:text-white text-xs font-bold transition-colors text-center shadow-warm-sm"
            >
              Report Incident Now
            </Link>
            <a
              href="tel:1098"
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-sand-300 bg-surface hover:bg-sand-100 text-primary dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center shadow-xs hover:shadow-sm active:scale-95"
            >
              Helpline 1098
            </a>
          </div>
        </div>
      </section>

      {/* 5. Input Dock with Voice to Text Mic Button */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
        <div className="bg-surface border border-sand-300 dark:bg-slate-900 dark:border-slate-800 rounded-2xl shadow-warm-card dark:shadow-xl p-3 sm:p-4 space-y-3">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              isListening
                ? "Listening... Speak your situation..."
                : "Type your situation or use voice recording (e.g. someone is threatening me)..."
            }
            className={`w-full bg-transparent text-xs sm:text-sm text-textDark dark:text-slate-100 placeholder:dark:text-slate-400 focus:outline-hidden resize-none leading-relaxed transition-all ${
              isListening ? 'bg-amber-50/50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-300 dark:border-amber-500/50 dark:text-amber-200' : ''
            }`}
          />

          <div className="flex items-center justify-between pt-2 border-t border-sand-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {/* Voice-to-Text Microphone Button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow-md'
                    : 'bg-sand-100 hover:bg-sand-200 text-slate-700 border-sand-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
                }`}
                title={isListening ? "Stop Voice Recording" : "Voice-to-Text Recording"}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-primary dark:text-orange-400" />
                    <span className="hidden sm:inline">Voice Input</span>
                  </>
                )}
              </button>

              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                🔒 Trauma-Informed • Speech & Text Protection • Zero Shutdown
              </span>
            </div>

            <button
              type="submit"
              disabled={isThinking || !inputText.trim()}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover dark:bg-orange-600 dark:hover:bg-orange-500 text-surface dark:text-white text-xs font-bold transition-all shadow-warm-sm dark:shadow-orange-600/30 hover:shadow-md active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 text-secondary dark:text-white" />
            </button>
          </div>
        </div>
      </form>

      {/* 6. Gemini API Key Configuration Modal (Admin only) */}
      {apiKeyModalOpen && user?.role === 'admin' && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 sm:p-8 max-w-md w-full border border-sand-300 shadow-warm-elevated space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-base text-primary">Gemini API Key Setup (Admin Only)</h3>
              </div>
              <button
                onClick={() => setApiKeyModalOpen(false)}
                className="p-1 rounded-lg text-textMuted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {savedKeySuccess ? (
              <div className="p-4 rounded-xl bg-safeGreenContainer text-safeGreen text-xs font-bold text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Gemini API Key Saved Successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSaveApiKey} className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Pre-Configured Key Active
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Your Gemini key is active with <span className="font-bold">BLOCK_NONE</span> safety filters so harmful keywords never shut down the assistant.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="geminiKey" className="block text-xs font-bold text-primary">
                    API Key
                  </label>
                  <input
                    id="geminiKey"
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter or override API key..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 text-xs font-mono focus:ring-2 focus:ring-secondary/40"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-textMuted">
                    Model: <strong className="text-primary">Gemini 2.5 Flash</strong>
                  </span>
                  {hasApiKey && (
                    <button
                      type="button"
                      onClick={() => {
                        setApiKeyInput('');
                        setGeminiApiKey('');
                        setHasApiKey(false);
                      }}
                      className="text-errorRed hover:underline font-medium text-xs"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95"
                >
                  Save Configuration
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
