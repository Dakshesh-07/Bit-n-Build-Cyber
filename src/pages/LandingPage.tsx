import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  HeartHandshake, 
  Scale, 
  EyeOff, 
  PhoneCall, 
  ShieldCheck, 
  FileText, 
  CheckCircle,
  Zap,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-surface dark:bg-sand-900 border border-sand-300 dark:border-sand-800 p-8 sm:p-12 lg:p-16 shadow-warm-card">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-secondary/10 dark:bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Header Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-100 dark:bg-sand-800 border border-sand-300 dark:border-sand-700 text-xs font-extrabold text-primary dark:text-sand-100 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-safeGreen" />
            <span>India's Trauma-Informed Cyber Defense Ecosystem</span>
            <span className="bg-secondary/20 text-secondary-dark dark:text-secondary px-2 py-0.5 rounded-full text-[10px] font-bold">
              GDG Bit N Build
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-primary dark:text-sand-50 tracking-tight leading-tight">
            Protecting Indian Youth from <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-dark via-amber-600 to-blue-600 dark:from-secondary dark:via-amber-400 dark:to-blue-400">
              Cyber Threats & Online Harassment
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-textMuted dark:text-sand-300 max-w-2xl mx-auto leading-relaxed">
            Zero-trace incident reporting, legally valid SHA-256 evidence hashing, instant Panic Camouflage (<kbd className="px-1.5 py-0.5 rounded bg-sand-200 dark:bg-sand-800 text-xs font-mono">ESC</kbd>), and trauma-informed AI support for Students, Guardians, and Police Officers.
          </p>

          {/* Landing CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary dark:bg-secondary hover:bg-primary-hover dark:hover:bg-secondary-dark text-surface dark:text-primary font-extrabold text-sm shadow-warm-elevated hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2.5 group"
            >
              <span>Get Started / Register Account</span>
              <ArrowRight className="w-4 h-4 text-secondary dark:text-primary group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface dark:bg-sand-800 border-2 border-sand-300 dark:border-sand-700 hover:border-sand-400 dark:hover:border-sand-600 text-primary dark:text-sand-100 font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs"
            >
              <Lock className="w-4 h-4 text-secondary" />
              <span>Sign In to Dashboard</span>
            </Link>

            <Link
              to="/report"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200 font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Report Anonymously</span>
              <Shield className="w-4 h-4 text-blue-600" />
            </Link>
          </div>

          {/* Key Assurance Indicators */}
          <div className="pt-8 border-t border-sand-200 dark:border-sand-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-textMuted dark:text-sand-400">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-safeGreen" />
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-safeGreen" />
              <span>Zero-Trace Privacy</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-safeGreen" />
              <span>POCSO & IT Act Ready</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-safeGreen" />
              <span>24/7 Helpline Linkage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Registration Role Categories Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-sand-50">
            Tailored Access Clearance for Everyone
          </h2>
          <p className="text-xs sm:text-sm text-textMuted dark:text-sand-400 max-w-xl mx-auto">
            Choose your category during registration to unlock specialized defense features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Student Category */}
          <div className="bg-surface dark:bg-sand-900 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-900/60 shadow-warm-card hover:shadow-warm-elevated transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center text-2xl font-bold">
                  🎓
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                  🔒 100% ANONYMOUS
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary dark:text-sand-100 group-hover:text-blue-600 transition-colors">
                  Student Registration Category
                </h3>
                <p className="text-xs text-textMuted dark:text-sand-400 mt-1 leading-relaxed">
                  For school and college students facing cyberbullying, extortion, or online stress. Identity is kept strictly anonymous with secret aliases and custom study-notes disguise overlays (<kbd className="px-1 py-0.5 rounded bg-sand-200 dark:bg-sand-800 text-[10px]">ESC</kbd>).
                </p>
              </div>
              <ul className="space-y-1.5 text-xs text-textDark dark:text-sand-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Shield Level 1 Clearance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Custom Class 4 – College Camouflage Disguises</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Peer Peer Support & Doubt Circles</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-surface text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Register as Student</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Parent / Guardian Category */}
          <div className="bg-surface dark:bg-sand-900 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-900/60 shadow-warm-card hover:shadow-warm-elevated transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center text-2xl font-bold">
                  🛡️
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-900/80 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700">
                  FAMILY SAFE MODE
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary dark:text-sand-100 group-hover:text-purple-600 transition-colors">
                  Parent & Guardian Category
                </h3>
                <p className="text-xs text-textMuted dark:text-sand-400 mt-1 leading-relaxed">
                  Enables parents and caregivers to securely monitor ward case updates, request direct psychological counseling, and access statutory child protection advisories.
                </p>
              </div>
              <ul className="space-y-1.5 text-xs text-textDark dark:text-sand-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>Ward Case PIN Linking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>Direct Adolescent Psychologist Dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span>Statutory Guardian Safety Alerts</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-surface text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Register as Guardian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Police Inspector Category */}
          <div className="bg-surface dark:bg-sand-900 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-900/60 shadow-warm-card hover:shadow-warm-elevated transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center text-2xl font-bold">
                  ⚖️
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                  LEVEL 3 POCSO CLEARANCE
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary dark:text-sand-100 group-hover:text-amber-600 transition-colors">
                  Police Inspector & Nodal Unit
                </h3>
                <p className="text-xs text-textMuted dark:text-sand-400 mt-1 leading-relaxed">
                  Restricted portal for certified Child Welfare Police Officers and POCSO Nodal Units to triage sealed evidence, generate legal dockets, and issue emergency platform takedowns.
                </p>
              </div>
              <ul className="space-y-1.5 text-xs text-textDark dark:text-sand-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Sealed Forensic Case Evidence Intake</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Printable Cyber Evidence Docket</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Station Jurisdiction Dispatch</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-primary dark:bg-secondary hover:bg-primary-hover dark:hover:bg-secondary-dark text-surface dark:text-primary text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Register Official Credentials</span>
              <ArrowRight className="w-3.5 h-3.5 text-secondary dark:text-primary" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Core Features Showcase */}
      <section className="bg-surface dark:bg-sand-900 rounded-3xl p-8 sm:p-12 border border-sand-300 dark:border-sand-800 shadow-warm-card space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 dark:bg-sand-800 text-xs font-bold text-secondary-dark dark:text-secondary">
            <Zap className="w-3.5 h-3.5" />
            <span>State-of-the-Art Protection Stack</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-sand-50">
            Why CyberVigil Wins on Safety
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-sand-50 dark:bg-sand-800/60 border border-sand-200 dark:border-sand-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary dark:bg-secondary text-secondary dark:text-primary flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-primary dark:text-sand-100">Official Evidence Docket</h4>
            <p className="text-xs text-textMuted dark:text-sand-400 leading-relaxed">
              Generates legal-grade printable dockets with SHA-256 evidence seals mapped to IT Act, IPC & POCSO codes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sand-50 dark:bg-sand-800/60 border border-sand-200 dark:border-sand-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-surface flex items-center justify-center font-bold">
              <EyeOff className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-primary dark:text-sand-100">Instant Panic Switch (ESC)</h4>
            <p className="text-xs text-textMuted dark:text-sand-400 leading-relaxed">
              Press ESC anytime to immediately overlay realistic harmless school or college notes disguise.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sand-50 dark:bg-sand-800/60 border border-sand-200 dark:border-sand-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-surface flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-primary dark:text-sand-100">Multi-lingual AI Guardian</h4>
            <p className="text-xs text-textMuted dark:text-sand-400 leading-relaxed">
              Understands Hinglish, Hindi & regional phrases without aggressive false threat score jumps.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sand-50 dark:bg-sand-800/60 border border-sand-200 dark:border-sand-700/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-surface flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-primary dark:text-sand-100">24/7 Crisis Hotline</h4>
            <p className="text-xs text-textMuted dark:text-sand-400 leading-relaxed">
              Direct emergency dispatch linkage to Childline 1098 & National Cyber Crime Helpline 1930.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Ready to Get Started CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-primary via-sand-900 to-primary text-surface p-8 sm:p-12 text-center space-y-6 shadow-warm-elevated border border-sand-800">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Join the CyberVigil Youth Safety Network Today
        </h2>
        <p className="text-xs sm:text-sm text-sand-300 max-w-lg mx-auto">
          Whether you are a student seeking safe peer guidance, a parent protecting your child, or a police officer managing cases—we've got you covered.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-secondary hover:bg-secondary-dark text-primary font-extrabold text-sm shadow-warm-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Register Now (Free & Confidential)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface/10 hover:bg-surface/20 text-surface border border-surface/30 font-bold text-sm transition-all text-center"
          >
            Already Have an Account? Sign In
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
