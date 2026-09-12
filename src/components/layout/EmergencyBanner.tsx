import React from 'react';
import { Phone, AlertTriangle, ShieldCheck } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <aside 
      aria-label="National Crisis Helplines" 
      className="bg-secondary-container/85 text-primary border-b border-sand-300 px-4 sm:px-8 py-2 text-xs sm:text-sm font-medium transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-errorRed opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-errorRed"></span>
          </span>
          <span className="font-bold flex items-center gap-1.5 text-primary">
            <AlertTriangle className="w-4 h-4 text-secondary-dark" />
            National 24/7 Crisis Response:
          </span>
          <span className="hidden md:inline text-textDark/80">
            Immediate trauma support & child protection overrides available anytime nationwide.
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <a 
            href="tel:1098" 
            className="inline-flex items-center gap-1.5 bg-surface px-3 py-1 rounded-full text-primary font-bold shadow-warm-sm hover:bg-sand-200 transition-colors border border-sand-300"
          >
            <Phone className="w-3.5 h-3.5 text-errorRed" />
            <span>Childline 1098</span>
          </a>

          <a 
            href="tel:1930" 
            className="inline-flex items-center gap-1.5 bg-surface px-3 py-1 rounded-full text-primary font-bold shadow-warm-sm hover:bg-sand-200 transition-colors border border-sand-300"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-secondary-dark" />
            <span>Cyber Crime 1930</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
