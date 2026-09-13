import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  School, 
  BookOpen, 
  Bot, 
  AlertTriangle, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Copy, 
  Check, 
  Lock, 
  PhoneCall,
  HelpCircle,
  BrainCircuit,
  Award,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const Home: React.FC = () => {
  // Scenario Simulator State
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [copiedRule, setCopiedRule] = useState(false);

  const scenarioChoices = [
    {
      id: 'A',
      title: 'Send the photo to calm them down',
      subtitle: 'Hoping they will delete it and leave you alone',
      isSafe: false,
      feedback: 'Dangerous: Complying with extortion demands never stops an extortionist; it hands them more leverage to continue threats. Stop, never send anything, and tell an adult or call 1098 immediately.',
    },
    {
      id: 'B',
      title: 'Simply delete the app and ignore it',
      subtitle: 'Without capturing evidence or blocking their handles',
      isSafe: false,
      feedback: 'Partially Effective, but Leaves Vulnerability: Deleting without saving proof allows predators to target your friends or recreate accounts. Always save screenshots first, block securely, and flag the account.',
    },
    {
      id: 'C',
      title: 'Block, preserve screenshots & report safely',
      subtitle: 'Never comply. Tell a trusted protector or report on CyberVigil.',
      isSafe: true,
      recommended: true,
      feedback: 'Safe Choice! You did the exact right thing. Taking screenshots preserves digital evidence. Blocking halts harassment, and reporting to 1098 or CyberVigil mobilizes certified child advocates without alerting the perpetrator.',
    },
    {
      id: 'D',
      title: 'Offer to meet them in person to resolve it',
      subtitle: 'To negotiate deleting the materials in real life',
      isSafe: false,
      feedback: 'Severe Danger: Never arrange physical meetings with people who threaten or coerce you online. This poses imminent physical peril. Immediately alert parents, guardians, or police helpline 1098 / 112.',
    }
  ];

  const handleCopyRule = () => {
    navigator.clipboard.writeText(
      "Never share your OTP, passwords, school location, or private images with anyone online — even someone claiming to be a friend or gaming partner."
    );
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 2500);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* 1. Hero Section - Balanced, Trustworthy, Cohesive */}
      <section className="relative overflow-hidden rounded-2xl bg-surface border border-sand-300 p-6 sm:p-8 lg:p-10 shadow-warm-card">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Reassurance, Headline & Actions */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200 border border-sand-300 text-xs font-semibold text-textDark">
              <img src="/cybervigil-shield.png" alt="CyberVigil" className="w-4 h-4 object-contain" />
              <span>CyberVigil Zero-Knowledge Safe Space: No Personal Tracking</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              Hey! You are in a safe space.
            </h1>

            <p className="text-base sm:text-lg text-textMuted leading-relaxed">
              How can CyberVigil protect you today? Learn digital self-defense, speak with trauma-informed AI, share peer journeys, submit confidential reports, or reach verified advocates in minutes.
            </p>

            {/* Quick Immediate Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-errorRed hover:bg-red-700 text-white font-bold text-sm shadow-warm-sm hover:shadow-md transition-all active:scale-95"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Report an Online Threat</span>
              </Link>

              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface font-bold text-sm shadow-warm-sm hover:shadow-md transition-all active:scale-95"
              >
                <Bot className="w-4 h-4 text-secondary" />
                <span>Chat with Guardian AI</span>
              </Link>

              <Link
                to="/learn"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sand-200 hover:bg-sand-300 border border-sand-300 text-primary font-bold text-sm shadow-warm-sm hover:shadow-md transition-all active:scale-95"
              >
                <School className="w-4 h-4 text-primary" />
                <span>Explore Safety Guide</span>
              </Link>
            </div>
          </div>

          {/* Right: Protection Telemetry & Reassuring Trust Highlights */}
          <div className="lg:col-span-5 xl:col-span-4 bg-sand-100 dark:bg-slate-900/90 border border-sand-300 dark:border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-warm-sm">
            <div className="flex items-center justify-between border-b border-sand-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-primary dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-safeGreen" />
                Protective Guardrails
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-safeGreen bg-safeGreenContainer px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-safeGreen animate-pulse"></span>
                Active 24/7
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface dark:bg-slate-800/80 border border-sand-200 dark:border-slate-700/80">
                <Lock className="w-4 h-4 text-secondary-dark flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-primary dark:text-slate-200">Zero-Retention Privacy</p>
                  <p className="text-[11px] text-textMuted dark:text-slate-400">Client-side cryptographic hashing with zero personal data logging.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface dark:bg-slate-800/80 border border-sand-200 dark:border-slate-700/80">
                <PhoneCall className="w-4 h-4 text-errorRed flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-primary dark:text-slate-200">National Crisis Link</p>
                  <p className="text-[11px] text-textMuted dark:text-slate-400">Direct dispatch to Childline 1098 & Cyber Crime Cell 1930.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface dark:bg-slate-800/80 border border-sand-200 dark:border-slate-700/80">
                <CheckCircle2 className="w-4 h-4 text-safeGreen flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-primary dark:text-slate-200">Statutory Framework</p>
                  <p className="text-[11px] text-textMuted dark:text-slate-400">Compliant with POCSO Act & IT Act 2000 protective mandates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Five Prominent Safety Gateways (Spaced Bento Grid) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary-dark">
              Integrated Safety Gateways
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight mt-1">
              Choose your protective path
            </h2>
          </div>
          <p className="text-sm text-textMuted">Confidential, encrypted & always free</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Gateway 1: Learn & Protect */}
          <article className="bg-surface rounded-2xl p-6 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-sand-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
                <School className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider">Digital Resilience</span>
                <h3 className="text-xl font-bold text-primary mt-1 group-hover:text-secondary-dark transition-colors">
                  Learn
                </h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed">
                Recognize cyberbullying, grooming, fake accounts, and online scams with interactive micro-lessons and real-world armor rules.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-textMuted font-medium">12 Interactive modules</span>
              <Link 
                to="/learn"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95 group/btn"
              >
                <span>Explore Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </article>

          {/* Gateway 2: Brave Stories */}
          <article className="bg-surface rounded-2xl p-6 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-sand-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider">Community Courage</span>
                <h3 className="text-xl font-bold text-primary mt-1 group-hover:text-secondary-dark transition-colors">
                  Brave Stories
                </h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed">
                Read how other young defenders navigated online adversity, share your journey anonymously, and help someone feel less alone.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-textMuted font-medium">100% Moderated & Safe</span>
              <Link 
                to="/stories"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95 group/btn"
              >
                <span>Read Stories</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </article>

          {/* Gateway 3: Guardian AI Assistant */}
          <article className="bg-surface rounded-2xl p-6 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-sand-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-primary font-bold text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-safeGreen animate-pulse"></span>
                  Active 24/7
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider">Instant Companion</span>
                <h3 className="text-xl font-bold text-primary mt-1 group-hover:text-secondary-dark transition-colors">
                  Guardian AI
                </h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed">
                Trauma-informed guidance for online threats, blackmail, non-consensual media, or harassment in calm, step-by-step actions.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-textMuted font-medium">No account required</span>
              <Link 
                to="/assistant"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95 group/btn"
              >
                <span>Start Safe Chat</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </article>

          {/* Gateway 4: Report Incident (Spans 2 columns on desktop) */}
          <article className="bg-surface rounded-2xl p-6 sm:p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 md:col-span-2 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-secondary text-primary flex items-center justify-center font-bold shadow-md">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container dark:bg-amber-950/50 text-xs font-bold text-secondary-dark dark:text-amber-400 border border-secondary/40 dark:border-amber-500/40 uppercase tracking-wider">
                  Confidential Legal & Protective Escalation
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider">
                  Emergency Intake
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-primary mt-1 group-hover:text-secondary-dark transition-colors">
                  Report Incident
                </h3>
                <p className="text-sm text-textMuted leading-relaxed mt-1.5">
                  Submit an encrypted, zero-knowledge incident report. Our AI risk engine categorizes emergency threats and routes them to certified child welfare officers and the National Cyber Crime Portal while preserving client-side privacy.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-sand-100 border border-sand-200 text-textDark font-medium">
                  End-to-End Hashed
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-sand-100 border border-sand-200 text-textDark font-medium">
                  EXIF Scrubbed
                </span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-sand-100 border border-sand-200 text-textDark font-medium">
                  POCSO / IT Act Aligned
                </span>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-textMuted font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-safeGreen" />
                <span>Option to remain 100% anonymous</span>
              </span>
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95 group/btn"
              >
                <span>File Incident Report</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </article>

          {/* Gateway 5: SafeConnect Verified Circles */}
          <article className="bg-surface rounded-2xl p-6 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-xl bg-sand-200 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider">Safe Circles</span>
                <h3 className="text-xl font-bold text-primary mt-1 group-hover:text-secondary-dark transition-colors">
                  SafeConnect
                </h3>
              </div>
              <p className="text-sm text-textMuted leading-relaxed">
                Connect safely with verified school counselors, accredited child psychologists, and peer mentors in moderated spaces.
              </p>
            </div>
            <div className="pt-4 mt-5 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-textMuted font-medium">Vetted professionals</span>
              <Link 
                to="/safeconnect"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95 group/btn"
              >
                <span>Join Circle</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* 3. Interactive "What Would You Do?" Scenario Simulator */}
      <section className="bg-sand-200/80 dark:bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-sand-300 dark:border-slate-800 relative overflow-hidden space-y-6">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-secondary flex items-center justify-center shadow-warm-sm">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary-dark">
                  Interactive Simulator
                </span>
                <h2 className="text-2xl font-bold text-primary">What Would You Do?</h2>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-surface text-xs font-semibold text-textMuted border border-sand-300 dark:border-slate-700">
              Scenario 01 of 05 • Online Extortion
            </span>
          </div>

          {/* Scenario Problem Box */}
          <div className="bg-surface dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-sand-300 dark:border-slate-800 shadow-warm-sm space-y-2">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-primary dark:text-slate-100">Critical Digital Encounter</h3>
                <p className="text-base sm:text-lg font-medium text-textDark dark:text-slate-200 mt-1 leading-relaxed">
                  "Someone you met online in a gaming chat or social feed asks you for a private photo or threatens to share your pictures if you don't respond."
                </p>
              </div>
            </div>
          </div>

          {/* Choices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {scenarioChoices.map((choice) => {
              const isSelected = selectedChoice === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => setSelectedChoice(choice.id as any)}
                  className={`text-left p-4 sm:p-4.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? choice.isSafe
                        ? 'bg-safeGreenContainer border-safeGreen ring-2 ring-safeGreen shadow-warm-sm'
                        : 'bg-errorContainer border-errorRed ring-2 ring-errorRed shadow-warm-sm'
                      : 'bg-surface dark:bg-slate-900 border-sand-300 dark:border-slate-800 hover:border-sand-400 hover:bg-sand-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isSelected && choice.isSafe
                      ? 'bg-safeGreen text-white'
                      : isSelected && !choice.isSafe
                      ? 'bg-errorRed text-white'
                      : 'bg-sand-200 dark:bg-slate-800 text-primary dark:text-slate-200'
                  }`}>
                    {choice.id}
                  </span>
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm text-primary dark:text-slate-100 leading-tight">{choice.title}</p>
                    <p className="text-xs text-textMuted dark:text-slate-400 leading-relaxed">{choice.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Feedback Box */}
          {selectedChoice && (
            <div className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              scenarioChoices.find(c => c.id === selectedChoice)?.isSafe
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100'
            }`}>
              <div className="flex items-start gap-3">
                {scenarioChoices.find(c => c.id === selectedChoice)?.isSafe ? (
                  <CheckCircle2 className="w-6 h-6 text-safeGreen flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-errorRed flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold text-sm">
                    {scenarioChoices.find(c => c.id === selectedChoice)?.isSafe ? 'Safe Choice!' : 'Dangerous Path'}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed max-w-2xl">
                    {scenarioChoices.find(c => c.id === selectedChoice)?.feedback}
                  </p>
                </div>
              </div>

              <Link
                to="/learn"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-surface text-xs font-bold flex-shrink-0 transition-colors"
              >
                <span>Learn Digital Armor</span>
                <ArrowRight className="w-3.5 h-3.5 text-secondary" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Daily Golden Rule & The 3 Bal Suraksha Pillars */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Golden Rule Card */}
        <div className="lg:col-span-5 bg-surface rounded-2xl p-6 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-primary font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary-dark" />
                Daily Golden Rule
              </span>
              <span className="text-xs text-textMuted font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Updated Daily
              </span>
            </div>

            <blockquote className="text-base sm:text-lg font-bold text-primary leading-snug border-l-4 border-secondary pl-4 py-1.5 bg-sand-50/70 dark:bg-slate-800/60 rounded-r-xl">
              "Never share your OTP, passwords, school location, or private images with anyone online — even someone claiming to be a close gaming partner."
            </blockquote>

            <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-slate-900 border border-sand-200 dark:border-slate-800 text-xs text-textDark dark:text-slate-200 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 text-secondary-dark font-bold">
                <ShieldCheck className="w-4 h-4 text-secondary-dark" />
                <span>Why this rule matters</span>
              </div>
              <p className="text-textMuted dark:text-slate-400">
                Predators frequently spend weeks building trust and rapport before demanding credentials or compromising media. Keeping absolute digital boundaries shields your safety.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-5 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-textMuted font-medium">CyberVigil Standard</span>
            <button
              onClick={handleCopyRule}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sand-100 hover:bg-sand-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-primary dark:text-slate-200 transition-all active:scale-95 border border-sand-300 dark:border-slate-700 shadow-xs"
            >
              {copiedRule ? (
                <>
                  <Check className="w-3.5 h-3.5 text-safeGreen" />
                  <span className="text-safeGreen">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-secondary-dark" />
                  <span>Copy Rule</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="lg:col-span-7 bg-surface rounded-2xl p-6 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
          <div className="space-y-3.5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-dark">
                Protective Architecture
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-primary tracking-tight mt-1">
                The Three Cyber Defense Pillars
              </h3>
              <p className="text-xs sm:text-sm text-textMuted mt-1 leading-relaxed">
                CyberVigil integrates digital awareness with trauma-informed community and immediate institutional escalations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-slate-900 border border-sand-200 dark:border-slate-800 space-y-1.5 hover:border-sand-300 hover:bg-sand-50 transition-all">
                <div className="w-7 h-7 rounded-lg bg-primary text-secondary flex items-center justify-center font-bold text-xs shadow-xs">
                  1
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-primary dark:text-slate-100">Digital Guardrails</h4>
                <p className="text-[11px] text-textMuted dark:text-slate-400 leading-relaxed">
                  Zero-retention chat safety, automated scam screening, and proactive privacy alerts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-slate-900 border border-sand-200 dark:border-slate-800 space-y-1.5 hover:border-sand-300 hover:bg-sand-50 transition-all">
                <div className="w-7 h-7 rounded-lg bg-primary text-secondary flex items-center justify-center font-bold text-xs shadow-xs">
                  2
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-primary dark:text-slate-100">Support Circles</h4>
                <p className="text-[11px] text-textMuted dark:text-slate-400 leading-relaxed">
                  Accredited child psychologists, verified peer mentors, and school counseling integration.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-slate-900 border border-sand-200 dark:border-slate-800 space-y-1.5 hover:border-sand-300 hover:bg-sand-50 transition-all">
                <div className="w-7 h-7 rounded-lg bg-primary text-secondary flex items-center justify-center font-bold text-xs shadow-xs">
                  3
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-primary dark:text-slate-100">Direct Escalation</h4>
                <p className="text-[11px] text-textMuted dark:text-slate-400 leading-relaxed">
                  One-tap dispatch to Childline 1098, cyber forensics nodal desks, and rapid response units.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-5 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-textMuted font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-safeGreen" />
              <span>POCSO Act & IT Act 2000 Statutory Compliance</span>
            </span>
            <Link
              to="/security"
              className="inline-flex items-center gap-1 font-bold text-primary hover:text-secondary-dark transition-colors"
            >
              <span>Read Legal Framework</span>
              <ArrowRight className="w-3.5 h-3.5 text-secondary" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
