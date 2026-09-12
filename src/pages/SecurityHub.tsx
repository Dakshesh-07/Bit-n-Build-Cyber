import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Trash2, 
  Fingerprint, 
  CheckCircle2, 
  EyeOff, 
  Scale, 
  Key, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SecurityHub: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [testHashInput, setTestHashInput] = useState('');
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [purgedSuccess, setPurgedSuccess] = useState(false);

  const handleComputeHash = async () => {
    if (!testHashInput.trim()) return;
    const encoder = new TextEncoder();
    const data = encoder.encode(testHashInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setComputedHash(hashHex);
  };

  const handlePurgeSession = () => {
    if (window.confirm('Are you sure you want to purge all local cached tickets, evidence, and session history from this browser?')) {
      localStorage.clear();
      logout();
      setPurgedSuccess(true);
      navigate('/login');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <section className="bg-surface rounded-2xl p-8 sm:p-12 border border-sand-300 shadow-warm-card space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 text-xs font-bold text-primary">
          <Shield className="w-3.5 h-3.5 text-safeGreen" />
          <span>Security & Trauma-Informed Privacy Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Protective Privacy Protocols
        </h1>
        <p className="text-sm text-textMuted leading-relaxed max-w-2xl">
          CyberVigil is engineered with client-side zero-knowledge architecture. Your IP address is never stored in permanent logs, and evidence files are cryptographic-hashed before transmission.
        </p>
      </section>

      {/* Notification */}
      {purgedSuccess && (
        <div className="p-4 rounded-xl bg-safeGreenContainer border border-safeGreen text-safeGreen text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>All local browser session data, cached reports, and tickets have been completely purged!</span>
        </div>
      )}

      {/* Security Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 space-y-4 group">
          <div className="w-11 h-11 rounded-xl bg-sand-200 flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform">
            <Lock className="w-5 h-5 text-safeGreen" />
          </div>
          <h3 className="font-bold text-base text-primary">Client-Side Scrubbing</h3>
          <p className="text-xs text-textMuted leading-relaxed">
            EXIF metadata, GPS latitude/longitude, and camera device serial numbers are permanently stripped in your local browser before evidence leaves your device.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 space-y-4 group">
          <div className="w-11 h-11 rounded-xl bg-sand-200 flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform">
            <Fingerprint className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="font-bold text-base text-primary">Cryptographic Proof</h3>
          <p className="text-xs text-textMuted leading-relaxed">
            All submitted screenshots generate a SHA-256 checksum that proves evidence was not altered or manipulated, ensuring court admissibility under Section 65B.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 space-y-4 group">
          <div className="w-11 h-11 rounded-xl bg-sand-200 flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform">
            <EyeOff className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-bold text-base text-primary">Instant Camouflage</h3>
          <p className="text-xs text-textMuted leading-relaxed">
            Pressing <kbd className="px-1.5 py-0.5 rounded bg-sand-200 font-mono text-[10px] text-primary">ESC</kbd> anywhere on CyberVigil replaces the screen with study notes or YouTube streams instantly.
          </p>
        </div>
      </div>

      {/* Interactive Tool: Cryptographic Hash Validator */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-warm-card space-y-4">
        <div>
          <h3 className="font-bold text-lg text-primary">Interactive Client-Side SHA-256 Validator</h3>
          <p className="text-xs text-textMuted mt-0.5">
            Test how browser-native cryptography turns text or evidence signatures into irreversible forensic hashes without contacting any external server.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testHashInput}
            onChange={(e) => setTestHashInput(e.target.value)}
            placeholder="Type any message, URL, or identifier to hash..."
            className="flex-1 px-4 py-3 rounded-xl border border-sand-300 text-sm focus:ring-2 focus:ring-secondary/40"
          />
          <button
            onClick={handleComputeHash}
            className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95 flex-shrink-0"
          >
            Compute SHA-256
          </button>
        </div>

        {computedHash && (
          <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 font-mono text-xs space-y-1 animate-in fade-in">
            <span className="text-[10px] font-bold text-safeGreen uppercase block font-sans">
              Computed Local Hash (Web Crypto API):
            </span>
            <p className="break-all font-bold text-primary select-all">{computedHash}</p>
          </div>
        )}
      </div>

      {/* Session Purge / Safe Exit Controls */}
      <div className="bg-sand-100 rounded-2xl p-6 sm:p-8 border border-sand-300 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-errorRed flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Emergency Cache & Session Purge
          </h3>
          <p className="text-xs text-textMuted mt-0.5">
            If you are on a shared, school, or monitored family computer and need to remove all traces of tickets, messages, and reports from this device.
          </p>
        </div>

        <button
          onClick={handlePurgeSession}
          className="px-5 py-3 rounded-xl bg-errorRed hover:bg-red-700 text-surface text-xs font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95"
        >
          Purge All Local Traces & Reset Session
        </button>
      </div>
    </div>
  );
};
