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
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section - Spacious, Calm, Nurturing */}
      <section className="relative overflow-hidden rounded-2xl bg-surface border border-sand-300 p-8 sm:p-12 lg:p-16 shadow-warm-card">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
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
      </section>

      {/* 2. Five Prominent Safety Gateways (Spaced Bento Grid) */}
      <section className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gateway 1: Learn & Protect */}
          <article className="bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
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
            <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
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
          <article className="bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
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
            <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
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
          <article className="bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
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
            <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
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
          <article className="bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 md:col-span-2 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-red-100/70 text-errorRed flex items-center justify-center font-bold group-hover:bg-errorRed group-hover:text-surface transition-colors">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-errorContainer text-xs font-bold text-errorRed uppercase tracking-wider">
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
                <p className="text-sm text-textMuted leading-relaxed mt-1.5 max-w-2xl">
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

            <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
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
          <article className="bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
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
            <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
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
      <section className="bg-sand-200/80 rounded-2xl p-8 sm:p-12 border border-sand-300 relative overflow-hidden space-y-8">
        <div className="max-w-4xl mx-auto space-y-6">
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
            <span className="px-3 py-1 rounded-full bg-surface text-xs font-semibold text-textMuted border border-sand-300">
              Scenario 01 of 05 • Online Extortion
            </span>
          </div>

          {/* Scenario Problem Box */}
          <div className="bg-surface p-6 sm:p-8 rounded-xl border border-sand-300 shadow-warm-sm space-y-2">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-primary">Critical Digital Encounter</h3>
                <p className="text-base sm:text-lg font-medium text-textDark mt-1 leading-relaxed">
                  "Someone you met online in a gaming chat or social feed asks you for a private photo or threatens to share your pictures if you don't respond."
                </p>
              </div>
            </div>
          </div>

          {/* Choices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarioChoices.map((choice) => {
              const isSelected = selectedChoice === choice.id;
              return (
                <button
                  key={choice.id}
                  onClick={() => setSelectedChoice(choice.id as any)}
                  className={`text-left p-5 rounded-xl border transition-all flex items-start gap-4 ${
                    isSelected
                      ? choice.isSafe
                        ? 'bg-safeGreenContainer border-safeGreen ring-2 ring-safeGreen shadow-warm-sm'
                        : 'bg-errorContainer border-errorRed ring-2 ring-errorRed shadow-warm-sm'
                      : 'bg-surface border-sand-300 hover:border-sand-400 hover:bg-sand-50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isSelected && choice.isSafe
                      ? 'bg-safeGreen text-white'
                      : isSelected && !choice.isSafe
                      ? 'bg-errorRed text-white'
                      : 'bg-sand-200 text-primary'
                  }`}>
                    {choice.id}
                  </span>
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-primary leading-tight">{choice.title}</p>
                    <p className="text-xs text-textMuted leading-relaxed">{choice.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Feedback Box */}
          {selectedChoice && (
            <div className={`p-6 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              scenarioChoices.find(c => c.id === selectedChoice)?.isSafe
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
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
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Golden Rule Card */}
        <div className="lg:col-span-5 bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
          <div className="space-y-4">
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

            <blockquote className="text-base sm:text-lg font-bold text-primary leading-snug border-l-4 border-secondary pl-4 py-1.5 bg-sand-50/70 rounded-r-xl">
              "Never share your OTP, passwords, school location, or private images with anyone online — even someone claiming to be a close gaming partner."
            </blockquote>

            <div className="p-4 rounded-xl bg-sand-100 border border-sand-200 text-xs text-textDark leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 text-secondary-dark font-bold">
                <ShieldCheck className="w-4 h-4 text-secondary-dark" />
                <span>Why this rule matters</span>
              </div>
              <p className="text-textMuted">
                Predators frequently spend weeks building trust and rapport before demanding credentials or compromising media. Keeping absolute digital boundaries shields your safety.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
            <span className="text-xs text-textMuted font-medium">CyberVigil Standard</span>
            <button
              onClick={handleCopyRule}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-xs font-bold text-primary transition-all active:scale-95 border border-sand-300 shadow-xs"
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
        <div className="lg:col-span-7 bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between group">
          <div className="space-y-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-sand-100 border border-sand-200 space-y-2 hover:border-sand-300 hover:bg-sand-50 transition-all">
                <div className="w-8 h-8 rounded-lg bg-primary text-secondary flex items-center justify-center font-bold text-sm shadow-xs">
                  1
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-primary">Digital Guardrails</h4>
                <p className="text-[11px] text-textMuted leading-relaxed">
                  Zero-retention chat safety, automated scam screening, and proactive privacy alerts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sand-100 border border-sand-200 space-y-2 hover:border-sand-300 hover:bg-sand-50 transition-all">
                <div className="w-8 h-8 rounded-lg bg-primary text-secondary flex items-center justify-center font-bold text-sm shadow-xs">
                  2
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-primary">Support Circles</h4>
                <p className="text-[11px] text-textMuted leading-relaxed">
                  Accredited child psychologists, verified peer mentors, and school counseling integration.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sand-100 border border-sand-200 space-y-2 hover:border-sand-300 hover:bg-sand-50 transition-all">
                <div className="w-8 h-8 rounded-lg bg-primary text-secondary flex items-center justify-center font-bold text-sm shadow-xs">
                  3
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-primary">Direct Escalation</h4>
                <p className="text-[11px] text-textMuted leading-relaxed">
                  One-tap dispatch to Childline 1098, cyber forensics nodal desks, and rapid response units.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between text-xs">
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
