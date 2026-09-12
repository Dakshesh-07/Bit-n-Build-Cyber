import React from 'react';
import { Shield, Lock, Scale, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-sand-200 border-t border-sand-300 mt-auto text-xs text-textMuted">
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
              <span className="font-extrabold text-xl text-primary tracking-tight">
                Cyber<span className="text-secondary">Vigil</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sand-300 text-[10px] font-bold text-primary">
                Secure Reporting Partner
              </span>
            </div>
            <p className="text-textDark/80 text-sm leading-relaxed max-w-md">
              CyberVigil is an accredited child cyber-defense ecosystem combining trauma-informed digital guardrails, anonymous reporting, and direct institutional links to Childline 1098 & National Cyber Helpline 1930.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-primary pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-safeGreen" />
                Zero-Log Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-secondary-dark" />
                POCSO & DPDP Aligned
              </span>
            </div>
          </div>

          {/* Quick Hubs */}
          <div className="space-y-2.5">
            <p className="font-bold text-sm text-primary uppercase tracking-wider">Safety Hubs</p>
            <ul className="space-y-1.5 font-medium">
              <li><Link to="/report" className="hover:text-primary transition-colors">Confidential Incident Reporting</Link></li>
              <li><Link to="/assistant" className="hover:text-primary transition-colors">Guardian AI Safe Chat</Link></li>
              <li><Link to="/learn" className="hover:text-primary transition-colors">Digital Resilience Guide</Link></li>
              <li><Link to="/stories" className="hover:text-primary transition-colors">Brave Stories Community</Link></li>
              <li><Link to="/safeconnect" className="hover:text-primary transition-colors">SafeConnect Counselor Circles</Link></li>
            </ul>
          </div>

          {/* Legal & Emergency Support */}
          <div className="space-y-2.5">
            <p className="font-bold text-sm text-primary uppercase tracking-wider">Emergency Protocol</p>
            <ul className="space-y-1.5 font-medium">
              <li><a href="tel:1098" className="text-errorRed font-bold hover:underline">National Childline (1098)</a></li>
              <li><a href="tel:1930" className="text-secondary-dark font-bold hover:underline">Cyber Crime Portal (1930)</a></li>
              <li><Link to="/security" className="hover:text-primary transition-colors">Trauma-Informed Privacy</Link></li>
              <li><Link to="/portal" className="hover:text-primary transition-colors">Officer Intake Clearance</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-sand-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-textMuted text-xs">
            © 2025 CyberVigil Protective Ecosystem. Immediate emergency override: Dial 1098 or 1930.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-textDark/80">
            <Link to="/security" className="hover:underline">Privacy Charter</Link>
            <span>•</span>
            <Link to="/security" className="hover:underline">Mandatory Reporting Rules</Link>
            <span>•</span>
            <Link to="/security" className="hover:underline">Evidence Integrity (SHA-256)</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
