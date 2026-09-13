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
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#111c2e] border border-sand-300 dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-warm-card transition-colors">
        {/* Subtle ambient backdrop effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-slate-500/5 dark:bg-slate-700/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Header Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-950 dark:text-amber-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>India's Trauma-Informed Cyber Defense Ecosystem</span>
            <span className="bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              GDG Bit N Build
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 dark:text-slate-50 tracking-tight leading-[1.12]">
            Protecting Indian Youth from <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 dark:from-amber-400 dark:via-amber-300 dark:to-orange-400">
              Cyber Threats & Online Harassment
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-[17px] text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Zero-trace incident reporting, legally valid SHA-256 evidence hashing, instant Panic Camouflage (<kbd className="px-1.5 py-0.5 rounded bg-sand-200 dark:bg-slate-800 border border-sand-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">ESC</kbd>), and trauma-informed AI support for Students, Guardians, and Police Officers.
          </p>

          {/* Landing CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-sm hover:shadow transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Get Started / Register Account</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xs"
            >
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Log In to Dashboard</span>
            </Link>

            <Link
              to="/report"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Shield className="w-4 h-4 text-amber-500" />
              <span>Report Anonymously</span>
            </Link>
          </div>

          {/* Key Assurance Indicators */}
          <div className="pt-6 mt-4 border-t border-sand-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Trace Privacy</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>POCSO & IT Act Ready</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>24/7 Helpline Linkage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Registration Role Categories Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tailored Access Clearance for Everyone
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Choose your clearance category during registration to unlock specialized defense features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Student Category */}
          <div className="bg-white dark:bg-[#111c2e] rounded-2xl p-6 sm:p-7 border border-sand-300 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 shadow-warm-card transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Lock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>100% Anonymous</span>
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Student Registration Category
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  For school and college students facing cyberbullying, extortion, or online stress. Identity is kept strictly anonymous with secret aliases and custom study-notes disguise overlays (<kbd className="px-1.5 py-0.5 rounded bg-sand-200 dark:bg-slate-800 text-[10px] font-mono font-bold">ESC</kbd>).
                </p>
              </div>
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Shield Level 1 Clearance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Custom Class 4 – College Camouflage Disguises</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Peer Peer Support & Doubt Circles</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md active:scale-95"
            >
              <span>Register as Student</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>

          {/* Card 2: Parent / Guardian Category */}
          <div className="bg-white dark:bg-[#111c2e] rounded-2xl p-6 sm:p-7 border border-sand-300 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 shadow-warm-card transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Users className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                  <span>Family Safe Mode</span>
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Parent & Guardian Category
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Enables parents and caregivers to securely monitor ward case updates, request direct psychological counseling, and access statutory child protection advisories.
                </p>
              </div>
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Ward Case PIN Linking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Direct Adolescent Psychologist Dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Statutory Guardian Safety Alerts</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md active:scale-95"
            >
              <span>Register as Guardian</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>

          {/* Card 3: Police Inspector Category */}
          <div className="bg-white dark:bg-[#111c2e] rounded-2xl p-6 sm:p-7 border border-sand-300 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 shadow-warm-card transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Scale className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                  <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Level 3 POCSO Clearance</span>
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Police Inspector & Nodal Unit
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Restricted portal for certified Child Welfare Police Officers and POCSO Nodal Units to triage sealed evidence, generate legal dockets, and issue emergency platform takedowns.
                </p>
              </div>
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Sealed Forensic Case Evidence Intake</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Printable Cyber Evidence Docket</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Station Jurisdiction Dispatch</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all text-center flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md active:scale-95"
            >
              <span>Register Official Credentials</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Core Features Showcase */}
      <section className="bg-white dark:bg-[#111c2e] rounded-3xl p-8 sm:p-12 border border-sand-300 dark:border-slate-800 shadow-warm-card space-y-8 transition-colors">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-900 dark:text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>State-of-the-Art Protection Stack</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Why CyberVigil Wins on Safety
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 sm:p-6 rounded-2xl bg-sand-50 dark:bg-slate-900/70 border border-sand-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">Official Evidence Docket</h4>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Generates legal-grade printable dockets with SHA-256 evidence seals mapped to IT Act, IPC & POCSO codes.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-sand-50 dark:bg-slate-900/70 border border-sand-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <EyeOff className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">Instant Panic Switch (ESC)</h4>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Press ESC anytime to immediately overlay realistic harmless school or college notes disguise.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-sand-50 dark:bg-slate-900/70 border border-sand-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">Multi-lingual AI Guardian</h4>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Understands Hinglish, Hindi & regional phrases without aggressive false threat score jumps.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-sand-50 dark:bg-slate-900/70 border border-sand-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">24/7 Crisis Hotline</h4>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct emergency dispatch linkage to Childline 1098 & National Cyber Crime Helpline 1930.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Ready to Get Started CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-amber-50 via-sand-100 to-amber-100/70 dark:bg-gradient-to-br dark:from-[#0b1120] dark:via-[#111c2e] dark:to-[#0b1120] text-slate-900 dark:text-white p-8 sm:p-12 text-center space-y-6 shadow-warm-card border border-amber-200/80 dark:border-slate-800 transition-colors">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Join the CyberVigil Youth Safety Network Today
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed font-normal">
          Whether you are a student seeking safe peer guidance, a parent protecting your child, or a police officer managing cases—we've got you covered.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Register Now (Free & Confidential)</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 font-bold text-sm transition-all text-center shadow-xs active:scale-95"
          >
            Already Have an Account? Log In
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
