import React from 'react';
import { Shield, Lock, Scale, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-sand-200 dark:bg-slate-950 border-t border-sand-300 dark:border-slate-800 mt-auto text-xs text-textMuted dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mandate */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src="/cybervigil-shield.png" 
                alt="CyberVigil" 
                className="w-9 h-9 object-contain filter drop-shadow-sm" 
              />
              <span className="font-extrabold text-xl text-primary dark:text-slate-100 tracking-tight">
                Cyber<span className="text-secondary dark:text-orange-400">Vigil</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sand-300 dark:bg-slate-800 text-[10px] font-bold text-primary dark:text-slate-200">
                Secure Reporting Partner
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed max-w-md">
              CyberVigil is an accredited child cyber-defense ecosystem combining trauma-informed digital guardrails, anonymous reporting, and direct institutional links to Childline 1098 & National Cyber Helpline 1930.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-primary dark:text-slate-200 pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-safeGreen" />
                Zero-Log Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-secondary-dark dark:text-orange-400" />
                POCSO & DPDP Aligned
              </span>
            </div>
          </div>

          {/* Quick Hubs */}
          <div className="space-y-2.5">
            <p className="font-bold text-sm text-primary dark:text-slate-100 uppercase tracking-wider">Safety Hubs</p>
            <ul className="space-y-1.5 font-medium text-slate-700 dark:text-slate-300">
              <li><Link to="/report" className="hover:text-primary dark:hover:text-orange-400 transition-colors">Confidential Incident Reporting</Link></li>
              <li><Link to="/assistant" className="hover:text-primary dark:hover:text-orange-400 transition-colors">Guardian AI Safe Chat</Link></li>
              <li><Link to="/learn" className="hover:text-primary dark:hover:text-orange-400 transition-colors">Digital Resilience Guide</Link></li>
              <li><Link to="/stories" className="hover:text-primary dark:hover:text-orange-400 transition-colors">Brave Stories Community</Link></li>
              <li><Link to="/safeconnect" className="hover:text-primary dark:hover:text-orange-400 transition-colors">SafeConnect Counselor Circles</Link></li>
            </ul>
          </div>

          {/* Legal & Emergency Support */}
          <div className="space-y-2.5">
            <p className="font-bold text-sm text-primary dark:text-slate-100 uppercase tracking-wider">Emergency Protocol</p>
            <ul className="space-y-1.5 font-medium text-slate-700 dark:text-slate-300">
              <li><a href="tel:1098" className="text-rose-600 dark:text-rose-500 font-bold hover:underline">National Childline (1098)</a></li>
              <li><a href="tel:1930" className="text-amber-600 dark:text-orange-400 font-bold hover:underline">Cyber Crime Portal (1930)</a></li>
              <li><Link to="/security" className="hover:text-primary dark:hover:text-orange-400 transition-colors">Trauma-Informed Privacy</Link></li>
              <li><Link to="/portal" className="hover:text-primary dark:hover:text-orange-400 transition-colors">Officer Intake Clearance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-sand-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            © 2025 CyberVigil Protective Ecosystem. Immediate emergency override: Dial 1098 or 1930.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Link to="/security" className="hover:underline hover:text-primary dark:hover:text-orange-400">Privacy Charter</Link>
            <span>•</span>
            <Link to="/security" className="hover:underline hover:text-primary dark:hover:text-orange-400">Mandatory Reporting Rules</Link>
            <span>•</span>
            <Link to="/security" className="hover:underline hover:text-primary dark:hover:text-orange-400">Evidence Integrity (SHA-256)</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
