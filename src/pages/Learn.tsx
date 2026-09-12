import React, { useState } from 'react';
import { 
  School, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  Award, 
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { LearnModule } from '../types';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ExtendedLearnModule extends LearnModule {
  quiz: QuizQuestion;
}

const LEARN_MODULES: ExtendedLearnModule[] = [
  {
    id: 'mod-1',
    title: 'Digital Extortion & Blackmail Armor',
    tagline: 'Recognize financial & image coercion before it escalates.',
    category: 'High Threat',
    duration: '6 min read',
    badgeEarned: 'Extortion Shield',
    lessonsCount: 4,
    completed: true,
    description: 'Learn why complying with blackmail demands never stops extortionists, how to securely preserve chat logs as digital evidence, and the immediate steps to take.',
    keyRule: 'Rule #1: Never send money or more photos. Cutting off financial incentive breaks their leverage.',
    tips: [
      'Take uncropped screenshots showing date, full usernames, and profile handles.',
      'Mute the offender immediately without arguing or pleading.',
      'Report the incident through CyberVigil or dial 1098 to initiate an encrypted takedown.'
    ],
    quiz: {
      question: 'Someone threatens to leak an embarrassing photo unless you send 2,000 rupees in 2 hours. What should you do first?',
      options: [
        'Pay the 2,000 rupees immediately to prevent the leak.',
        'Do not pay; take screenshots of the chat, mute the user, and report to CyberVigil or 1098.',
        'Delete your social media account and destroy your phone.'
      ],
      correctIndex: 1,
      explanation: 'Extortionists rarely stop after the first payment. Preserving evidence and getting legal/confidential support breaks their leverage.'
    }
  },
  {
    id: 'mod-2',
    title: 'Spotting Online Grooming & Fake Friends',
    tagline: 'Detect manipulative bonding patterns in games and social feeds.',
    category: 'Predator Defense',
    duration: '8 min read',
    badgeEarned: 'Vigilance Badge',
    lessonsCount: 5,
    completed: false,
    description: 'Predators rarely attack immediately; they spend weeks giving gaming gifts, offering secrets, and isolating you from parents or school friends.',
    keyRule: 'Rule #2: If an online acquaintance asks you to keep secrets from your parents, it is an immediate red flag.',
    tips: [
      'Be wary of strangers offering free Discord Nitro, gaming skins, or robux in exchange for private chats.',
      'Never move from public game servers to unmoderated private direct messaging apps.',
      'Check in with a parent or counselor whenever someone makes you feel uncomfortable or obligated.'
    ],
    quiz: {
      question: 'An older player on a gaming server offers you free skins if you move to a private webcam chat and keep it secret. How should you react?',
      options: [
        'Accept the skins and join the webcam chat.',
        'Decline, block the player, and inform a trusted adult or CyberVigil.',
        'Ask your friend to join the webcam chat with you.'
      ],
      correctIndex: 1,
      explanation: 'Secrecy and gift-giving are classic grooming tactics. Blocking the contact protects you from escalation.'
    }
  },
  {
    id: 'mod-3',
    title: 'Anti-Cyberbullying & Hate Group Defense',
    tagline: 'Defend against targeted group harassment and toxic hate threads.',
    category: 'Cyberbullying Defense',
    duration: '5 min read',
    badgeEarned: 'Group Shield',
    lessonsCount: 4,
    completed: false,
    description: 'Understand how group chat harassment works, how to document persistent bullying without engaging, and how school welfare officers step in.',
    keyRule: 'Rule #3: Do not feed the bullies. Mute notifications, screenshot the thread, and report to POCSO nodal officer.',
    tips: [
      'Export or screenshot the full group chat history before leaving the group.',
      'Do not reply with insults — hostile replies are used against victims.',
      'Use CyberVigil SafeConnect to connect with institutional counselors anonymously.'
    ],
    quiz: {
      question: 'A group chat is sharing edited photos of you and making fun of you. What is the safest response?',
      options: [
        'Argue with everyone in the group chat until they stop.',
        'Screenshot the messages, mute/leave the group, and report it to school welfare officer.',
        'Share edited photos of the bullies in return.'
      ],
      correctIndex: 1,
      explanation: 'Responding with anger fuels the bullying. Documenting and reporting allows institutional authority to intervene.'
    }
  },
  {
    id: 'mod-4',
    title: 'Phishing Shield & Fake Verification Links',
    tagline: 'Identify fake login pages, OTP traps, and account hijackers.',
    category: 'Account Defense',
    duration: '7 min read',
    badgeEarned: 'Phishing Sentinel',
    lessonsCount: 4,
    completed: false,
    description: 'Learn how scammers send fake Instagram copyright warnings or Discord verification links to steal account passwords and OTPs.',
    keyRule: 'Rule #4: Official platforms will NEVER ask for your password or SMS OTP via direct message.',
    tips: [
      'Check the website URL domain carefully before typing any login details.',
      'Enable Two-Factor Authentication (2FA) using an authenticator app.',
      'If you suspect a link is fake, close the browser immediately and change your password.'
    ],
    quiz: {
      question: 'You receive a DM claiming your Instagram account will be deleted in 24 hours unless you verify your password at instagram-security-support.xyz. What should you do?',
      options: [
        'Click the link and quickly verify your password.',
        'Ignore and report the message as phishing — official alerts never come via DM from unofficial domains.',
        'Reply to the message asking for proof.'
      ],
      correctIndex: 1,
      explanation: 'Domain names like instagram-security-support.xyz are fake phishing domains designed to harvest credentials.'
    }
  }
];

export const Learn: React.FC = () => {
  const [modules, setModules] = useState<ExtendedLearnModule[]>(LEARN_MODULES);
  const [activeModule, setActiveModule] = useState<ExtendedLearnModule>(LEARN_MODULES[0]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  const handleToggleComplete = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
    if (activeModule.id === id) {
      setActiveModule(prev => ({ ...prev, completed: !prev.completed }));
    }
  };

  const handleSelectModule = (mod: ExtendedLearnModule) => {
    setActiveModule(mod);
    setSelectedAnswer(null);
    setShowQuizResult(false);
  };

  const handleAnswerSubmit = (index: number) => {
    setSelectedAnswer(index);
    setShowQuizResult(true);
    if (index === activeModule.quiz.correctIndex) {
      handleToggleComplete(activeModule.id);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <section className="bg-surface rounded-2xl p-8 sm:p-12 border border-sand-300 shadow-warm-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 text-xs font-bold text-primary">
            <School className="w-3.5 h-3.5 text-secondary-dark" />
            <span>Digital Resilience Academy</span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            Learn & Protect: Digital Self-Defense
          </h1>
          <p className="text-sm text-textMuted leading-relaxed">
            Equip yourself with practical, real-world defense tactics against cyberbullying, blackmail, impersonation, and predators.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-sand-100 border border-sand-300 flex items-center gap-4 flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-primary text-secondary flex items-center justify-center font-bold text-xl shadow-warm-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-sm text-primary">Your Armor Level</p>
            <p className="text-xs text-textMuted">
              {modules.filter(m => m.completed).length} of {modules.length} Modules Mastered
            </p>
          </div>
        </div>
      </section>

      {/* Main Module Exploration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Module Selector List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-textMuted px-1">
            Interactive Defense Modules
          </h2>
          {modules.map((mod) => {
            const isSelected = activeModule.id === mod.id;
            return (
              <div
                key={mod.id}
                onClick={() => handleSelectModule(mod)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 active:scale-[0.99] group ${
                  isSelected
                    ? 'bg-surface border-secondary ring-2 ring-secondary/30 shadow-warm-card'
                    : 'bg-surface border-sand-300 hover:border-sand-400 hover:bg-sand-50/70 hover:shadow-warm-sm'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-dark">
                      {mod.category}
                    </span>
                    <span className="text-[10px] text-textMuted">• {mod.duration}</span>
                  </div>
                  <h3 className="font-bold text-sm text-primary leading-snug">{mod.title}</h3>
                  <p className="text-xs text-textMuted line-clamp-2">{mod.tagline}</p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {mod.completed ? (
                    <span className="p-1 rounded-full bg-safeGreenContainer text-safeGreen" title="Completed">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-sand-300 group-hover:border-sand-400 transition-colors"></span>
                  )}
                  <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isSelected ? 'text-secondary-dark' : 'text-textMuted'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Module Detail Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-surface rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-warm-card space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-dark">
                {activeModule.category} • {activeModule.duration}
              </span>
              <h2 className="text-2xl font-bold text-primary mt-1">{activeModule.title}</h2>
            </div>
            <button
              onClick={() => handleToggleComplete(activeModule.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-warm-sm hover:shadow-md active:scale-95 ${
                activeModule.completed
                  ? 'bg-safeGreenContainer text-safeGreen border border-safeGreen'
                  : 'bg-primary text-surface hover:bg-primary-hover'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{activeModule.completed ? 'Mastered ✓' : 'Mark as Completed'}</span>
            </button>
          </div>

          <p className="text-sm text-textDark leading-relaxed">{activeModule.description}</p>

          {/* Golden Rule Highlight */}
          <div className="p-5 rounded-xl bg-secondary-container/40 border border-secondary/50 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Protective Rule:</span>
            <p className="text-sm sm:text-base font-bold text-primary leading-snug">
              {activeModule.keyRule}
            </p>
          </div>

          {/* Step-by-Step Action Tips */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-textMuted">Actionable Guardrails:</h3>
            <div className="space-y-2.5">
              {activeModule.tips.map((tip, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-sand-100 border border-sand-200 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-primary text-secondary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-textDark leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Knowledge Challenge */}
          <div className="p-5 rounded-2xl bg-sand-100/80 border border-sand-300 space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-secondary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Interactive Knowledge Test
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-primary">
              {activeModule.quiz.question}
            </p>

            <div className="space-y-2">
              {activeModule.quiz.options.map((opt, oIdx) => {
                const isSelected = selectedAnswer === oIdx;
                const isCorrect = activeModule.quiz.correctIndex === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleAnswerSubmit(oIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all duration-150 flex items-center justify-between gap-3 ${
                      showQuizResult
                        ? isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                          : isSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-900'
                          : 'bg-surface border-sand-200 text-textMuted opacity-60'
                        : isSelected
                        ? 'bg-primary text-surface border-primary'
                        : 'bg-surface border-sand-300 hover:border-sand-400 text-textDark'
                    }`}
                  >
                    <span>{opt}</span>
                    {showQuizResult && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {showQuizResult && (
              <div className={`p-3.5 rounded-xl text-xs space-y-1 font-medium ${
                selectedAnswer === activeModule.quiz.correctIndex
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}>
                <p className="font-bold">
                  {selectedAnswer === activeModule.quiz.correctIndex ? '✓ Correct Response! Badge Unlocked 🎉' : '⚠️ Defense Tip:'}
                </p>
                <p>{activeModule.quiz.explanation}</p>
              </div>
            )}
          </div>

          {/* Emergency Lifeline Footer */}
          <div className="p-4 rounded-xl bg-sand-100 border border-sand-200 flex items-center justify-between text-xs text-textMuted">
            <span>Facing this right now?</span>
            <a href="tel:1098" className="font-bold text-errorRed hover:underline">
              Call Childline 1098 for confidential guidance
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
