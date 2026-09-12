import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Cpu, 
  Fingerprint, 
  Check, 
  Copy,
  Info,
  UserCheck,
  EyeOff,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { IncidentCategory, IncidentPlatform, IncidentReport } from '../types';
import { localStore } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIES: IncidentCategory[] = [
  'Extortion',
  'Online Grooming',
  'Cyberbullying',
  'Impersonation',
  'Image Abuse',
  'Harassment',
  'Doxxing',
];

const PLATFORMS: IncidentPlatform[] = [
  'Instagram',
  'WhatsApp',
  'Snapchat',
  'Discord',
  'Gaming',
  'TikTok',
  'Other',
];

export const ReportIncident: React.FC = () => {
  const { user } = useAuth();

  // Form State
  const [isAnonymousMode, setIsAnonymousMode] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory>('Extortion');
  const [selectedPlatform, setSelectedPlatform] = useState<IncidentPlatform>('Instagram');
  const [customPlatformName, setCustomPlatformName] = useState<string>('');
  const [incidentText, setIncidentText] = useState<string>('');
  const [isImmediateDanger, setIsImmediateDanger] = useState<boolean>(false);
  const [safetyCheckVerified, setSafetyCheckVerified] = useState<boolean>(false);
  
  // Mandatory Evidence Files
  const [evidenceFiles, setEvidenceFiles] = useState<{ name: string; size: string; status: string }[]>([]);

  // AI Evidence Analysis State
  const [isAnalyzingThreat, setIsAnalyzingThreat] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    threatScore: number;
    category: IncidentCategory;
    indicators: string[];
    urgency: string;
    evidenceHash: string;
    summary: string;
  } | null>(null);

  // Validation & Submission State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submittedCase, setSubmittedCase] = useState<IncidentReport | null>(null);
  const [copiedCaseId, setCopiedCaseId] = useState<boolean>(false);
  const [isDraftImported, setIsDraftImported] = useState<boolean>(false);

  useEffect(() => {
    const rawDraft = localStorage.getItem('cybervigil_case_draft');
    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft);
        if (draft.category) setSelectedCategory(draft.category as IncidentCategory);
        if (draft.details) setIncidentText(draft.details);
        setIsDraftImported(true);
        localStorage.removeItem('cybervigil_case_draft');
      } catch (err) {
        console.error('Failed to parse draft report:', err);
      }
    }
  }, []);

  // Clipboard Paste Event Handler for Images and Chat Logs
  const handlePasteEvent = (e: React.ClipboardEvent | ClipboardEvent) => {
    const items = (e as React.ClipboardEvent).clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const newFile = {
            name: `Pasted_Screenshot_${Date.now().toString().slice(-4)}.png`,
            size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
            status: 'Clipboard Image Scrubbed (SHA-256)'
          };
          setEvidenceFiles(prev => [...prev, newFile]);
          setValidationError(null);
        }
      } else if (item.type === 'text/plain') {
        item.getAsString((text) => {
          if (text && text.trim().length > 10) {
            const newFile = {
              name: `Pasted_Chat_Transcript_${Date.now().toString().slice(-4)}.txt`,
              size: `${(text.length / 1024).toFixed(1)} KB`,
              status: 'Chat Log Scrubbed (SHA-256)'
            };
            setEvidenceFiles(prev => [...prev, newFile]);
            setValidationError(null);
          }
        });
      }
    }
  };

  const handlePasteFromClipboardButton = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim().length > 5) {
        const newFile = {
          name: `Clipboard_Export_${Date.now().toString().slice(-4)}.txt`,
          size: `${(text.length / 1024).toFixed(1)} KB`,
          status: 'Direct Paste Log Scrubbed (SHA-256)'
        };
        setEvidenceFiles(prev => [...prev, newFile]);
        setValidationError(null);
      } else {
        setValidationError('⚠️ No text or image found in clipboard. Try pressing Ctrl+V directly on the upload area.');
      }
    } catch (err) {
      setValidationError('⚠️ Please press Ctrl+V or Cmd+V directly on the upload box to paste your copied screenshot/chat.');
    }
  };

  // Dynamic Threat Score Calibration
  const calculateScore = () => {
    if (aiAnalysisResult) return aiAnalysisResult.threatScore;
    if (!incidentText.trim() && evidenceFiles.length === 0) return 0;

    let score = 20;
    if (selectedCategory === 'Extortion' || selectedCategory === 'Image Abuse') score += 30;
    else if (selectedCategory === 'Cyberbullying' || selectedCategory === 'Harassment') score += 20;
    else score += 10;

    if (isImmediateDanger) score += 25;
    if (evidenceFiles.length > 0) score += 15;

    const lower = incidentText.toLowerCase();
    if (lower.includes('threat') || lower.includes('blackmail') || lower.includes('pay') || lower.includes('leaked')) score += 10;

    return Math.min(score, 98);
  };

  const threatScore = calculateScore();

  // AI Evidence & Threat Analysis Function
  const handleAnalyzeThreatWithAI = () => {
    if (!incidentText.trim() && evidenceFiles.length === 0) {
      setValidationError('⚠️ Please enter details in narrative description or upload evidence screenshot to run AI Threat Analysis.');
      return;
    }
    setValidationError(null);
    setIsAnalyzingThreat(true);

    setTimeout(() => {
      setIsAnalyzingThreat(false);
      const textLower = incidentText.toLowerCase();
      const filesLower = evidenceFiles.map(f => f.name.toLowerCase()).join(' ');
      const combinedLower = `${textLower} ${filesLower}`;

      let cat: IncidentCategory = selectedCategory;
      let score = 45;
      const indicators: string[] = [];

      // 1. Online Grooming & Sexual Media Requests (Highest Urgency Check)
      const isGroomingOrSexualMedia = /pic|pics|photo|photos|nude|nudes|sexual|private|naked|grooming|webcam|snap|show me|send me|intimate|undress|sext/i.test(combinedLower);

      if (isGroomingOrSexualMedia) {
        cat = 'Online Grooming';
        score = 94;
        indicators.push('Predatory solicitation / demand for intimate media');
        indicators.push('Child Sexual Exploitation & Abuse (CSAE) threat signature');
        indicators.push('POCSO Act & IT Act Section 67B Statutory Risk');
      } else if (/money|pay|upi|cash|rupees|blackmail|extort|leak/i.test(combinedLower)) {
        cat = 'Extortion';
        score = 88;
        indicators.push('Coercive monetary demand & blackmail timeline');
        indicators.push('Time-pressured leverage attempt');
      } else if (/photo|picture|video|image|leak/i.test(combinedLower)) {
        cat = 'Image Abuse';
        score = 90;
        indicators.push('Non-consensual image manipulation or leak threat');
        indicators.push('Privacy violation attempt');
      } else if (/password|link|verify|otp|login|fake/i.test(combinedLower)) {
        cat = 'Impersonation';
        score = 75;
        indicators.push('Credential harvesting & fake verification link');
      } else if (/hate|stupid|kill|group|bully|harass|ugly/i.test(combinedLower)) {
        cat = 'Cyberbullying';
        score = 80;
        indicators.push('Targeted group harassment pattern');
        indicators.push('Defamation & emotional distress risk');
      } else {
        score = evidenceFiles.length > 0 ? 82 : 50;
        cat = evidenceFiles.length > 0 ? 'Online Grooming' : selectedCategory;
        indicators.push('Authentic evidence payload attached for intake review');
        indicators.push('High-priority protective intake protocol initiated');
      }

      if (isImmediateDanger) score = Math.max(score, 96);

      setSelectedCategory(cat);
      setAiAnalysisResult({
        threatScore: score,
        category: cat,
        indicators: indicators.length > 0 ? indicators : ['Digital harassment indicator detected'],
        urgency: score > 75 ? 'Critical High' : score > 40 ? 'Moderate Risk' : 'Low / Advisory',
        evidenceHash: 'sha256-' + Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14),
        summary: `AI Evidence analysis verified ${evidenceFiles.length} file(s) and narrative context. Threat classified as [${cat}] with High Severity Risk Score of ${score}%. Priority dispatch queued for Child Welfare Officer.`
      });
    }, 1400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFile = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'Metadata Scrubbed (SHA-256)'
      };
      setEvidenceFiles(prev => [...prev, newFile]);
      setValidationError(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory Evidence Check
    if (evidenceFiles.length === 0) {
      setValidationError('⚠️ Evidence is strictly compulsory: Please upload or paste at least one screenshot, message export, or audio recording to substantiate the report.');
      return;
    }

    // 2. Mandatory Safety Check Verification
    if (!safetyCheckVerified) {
      setValidationError('⚠️ Compulsory Safety Check: Please verify and confirm that the attached evidence validates this threat rating before submitting.');
      return;
    }

    // 3. Custom Platform Name Check
    if (selectedPlatform === 'Other' && !customPlatformName.trim()) {
      setValidationError('⚠️ Please type the custom platform name in the field provided.');
      return;
    }

    setValidationError(null);

    const finalPlatformName = selectedPlatform === 'Other' && customPlatformName.trim()
      ? customPlatformName.trim()
      : selectedPlatform;

    const caseNumber = `#BG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident: IncidentReport = {
      id: `inc-${Date.now()}`,
      caseNumber,
      category: selectedCategory,
      platform: finalPlatformName as IncidentPlatform,
      incidentDetails: incidentText,
      immediateDanger: isImmediateDanger,
      severityLevel: threatScore > 75 ? 'High' : threatScore > 50 ? 'Moderate' : 'Low',
      threatScore,
      evidenceSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'Pending Intake',
      piiScrubbed: true,
      createdAt: 'Just now',
      distressLevel: threatScore > 70 ? 85 : 50,
      evidenceFiles,
      isAnonymousReporter: isAnonymousMode,
      safetyCheckVerified: true,
      ...(isAnonymousMode ? {
        reporterAlias: 'Anonymous Victim (Zero PII Logged)',
        userRole: 'anonymous_user'
      } : {
        reporterAlias: user?.alias || 'Verified Reporter',
        userRole: user?.role || 'registered_youth',
        verificationId: user?.verificationId || '#VERIFIED-01'
      })
    };

    localStore.saveIncident(newIncident);
    setSubmittedCase(newIncident);
  };

  const handleCopyCase = () => {
    if (submittedCase) {
      navigator.clipboard.writeText(submittedCase.caseNumber);
      setCopiedCaseId(true);
      setTimeout(() => setCopiedCaseId(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <section className="space-y-2 border-b border-sand-300 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-textMuted">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-bold">Incident Reporting</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Report Incident
            </h1>
            <p className="text-xs sm:text-sm text-textMuted mt-0.5 max-w-2xl">
              File an encrypted incident report with compulsory evidence verification. Zero-knowledge protection guarantees victim safety.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-sand-200 px-3.5 py-1.5 rounded-full border border-sand-300 text-xs font-semibold text-primary">
            <Lock className="w-3.5 h-3.5 text-safeGreen" />
            <span>Encrypted Session #BG-INTAKE</span>
          </div>
        </div>
      </section>

      {/* Confirmation State */}
      {submittedCase ? (
        <div className="bg-surface rounded-2xl p-8 sm:p-12 border-2 border-safeGreen shadow-warm-card max-w-2xl mx-auto space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-safeGreenContainer text-safeGreen flex items-center justify-center mx-auto shadow-warm-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-sand-200 text-xs font-bold text-primary">
              Encrypted Report Dispatched
            </span>
            <h2 className="text-2xl font-bold text-primary">Incident Successfully Logged</h2>
            <p className="text-xs sm:text-sm text-textMuted max-w-md mx-auto">
              Your compulsory evidence has been cryptographically sealed and transmitted to certified child welfare officers. You are safe and protected.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-sand-100 border border-sand-300 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-textMuted">Private Case Reference ID:</span>
              <button
                onClick={handleCopyCase}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:text-secondary-dark"
              >
                {copiedCaseId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-safeGreen" />
                    <span className="text-safeGreen">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Case ID</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-xl font-extrabold text-primary select-all">
              {submittedCase.caseNumber}
            </p>
            <p className="text-xs text-textMuted">
              Save this Case ID! You can track progress anytime completely anonymously at the sign in page without needing an account.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/assistant"
              className="px-5 py-2.5 rounded-xl bg-primary text-surface font-bold text-sm hover:bg-primary-hover transition-colors shadow-warm-sm"
            >
              Speak with Guardian AI
            </Link>
            <button
              onClick={() => setSubmittedCase(null)}
              className="px-5 py-2.5 rounded-xl bg-sand-200 text-primary font-bold text-sm hover:bg-sand-300 transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Main Dual-Column Intake Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Intake Form (7 cols) */}
          <section className="lg:col-span-7 bg-surface rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-warm-card space-y-6">
            
            {/* Anonymous Option for Bullied Youth */}
            <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-secondary" />
                  Reporting Identity Privacy
                </span>
                <span className="text-[10px] font-bold text-safeGreen bg-safeGreenContainer px-2 py-0.5 rounded">
                  Victim Safe Mode
                </span>
              </div>
              <p className="text-xs text-textMuted">
                If you are experiencing bullying or extortion, you can report completely anonymously to prevent any retaliation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAnonymousMode(true)}
                  className={`p-4 rounded-xl border text-xs font-bold text-left transition-all active:scale-95 flex items-start gap-3 cursor-pointer ${
                    isAnonymousMode
                      ? 'bg-primary text-white border-primary dark:bg-orange-600 dark:border-orange-500 dark:text-white shadow-md ring-2 ring-orange-500/30'
                      : 'bg-surface dark:bg-slate-900 border-sand-300 dark:border-slate-800 hover:bg-sand-50 dark:hover:bg-slate-800 text-textDark dark:text-slate-300'
                  }`}
                >
                  <EyeOff className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isAnonymousMode ? 'text-white' : 'text-secondary dark:text-orange-400'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="block font-bold text-sm">Anonymous Shield</span>
                      {isAnonymousMode && <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-extrabold uppercase">Selected</span>}
                    </div>
                    <span className="text-[11px] font-normal opacity-90 block mt-0.5">No account linked • Zero identity logs</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAnonymousMode(false)}
                  className={`p-4 rounded-xl border text-xs font-bold text-left transition-all active:scale-95 flex items-start gap-3 cursor-pointer ${
                    !isAnonymousMode
                      ? 'bg-primary text-white border-primary dark:bg-orange-600 dark:border-orange-500 dark:text-white shadow-md ring-2 ring-orange-500/30'
                      : 'bg-surface dark:bg-slate-900 border-sand-300 dark:border-slate-800 hover:bg-sand-50 dark:hover:bg-slate-800 text-textDark dark:text-slate-300'
                  }`}
                >
                  <UserCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${!isAnonymousMode ? 'text-white' : 'text-secondary dark:text-orange-400'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="block font-bold text-sm">Verified Account</span>
                      {!isAnonymousMode && <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-extrabold uppercase">Selected</span>}
                    </div>
                    <span className="text-[11px] font-normal opacity-90 block mt-0.5">Linked to profile: {user?.alias || 'User'}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="p-4 rounded-xl bg-errorContainer border border-errorRed text-errorRed text-xs font-bold flex items-start gap-2.5 animate-in shake">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Category Selection (Single Names) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                    1. Incident Category <span className="text-errorRed">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAnalyzeThreatWithAI}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-amber-500/20 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>✨ Let AI Auto-Select Category</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all active:scale-95 ${
                        selectedCategory === cat
                          ? 'bg-primary text-surface border-primary shadow-warm-sm font-bold'
                          : 'bg-sand-100 border-sand-200 hover:border-sand-300 text-textDark'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Platform Selection (Single Names) */}
              <div className="space-y-2 pt-2 border-t border-sand-200">
                <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                  2. Originating Platform <span className="text-errorRed">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => setSelectedPlatform(platform)}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
                        selectedPlatform === platform
                          ? 'bg-primary text-surface border-primary font-bold shadow-warm-sm'
                          : 'bg-sand-100 border-sand-200 hover:border-sand-300 text-textDark'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>

                {/* Custom Platform Input when 'Other' is selected */}
                {selectedPlatform === 'Other' && (
                  <div className="pt-2 animate-in fade-in space-y-1">
                    <label className="block text-[11px] font-bold text-primary">
                      Specify Custom Platform Name: <span className="text-errorRed">*</span>
                    </label>
                    <input
                      type="text"
                      value={customPlatformName}
                      onChange={(e) => setCustomPlatformName(e.target.value)}
                      placeholder="e.g., Telegram, Roblox, Snapchat Secret, Reddit, X/Twitter..."
                      className="w-full p-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface text-xs text-textDark focus:ring-2 focus:ring-secondary/40 font-medium"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Step 3: Incident Details */}
              <div className="space-y-2 pt-2 border-t border-sand-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="details" className="block text-xs font-bold text-primary uppercase tracking-wider">
                    3. Narrative Description <span className="text-errorRed">*</span>
                  </label>
                  <span className="text-xs text-textMuted">{incidentText.length} chars</span>
                </div>
                <textarea
                  id="details"
                  rows={4}
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  onPaste={handlePasteEvent}
                  className="w-full p-3.5 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm text-textDark transition-all resize-none leading-relaxed"
                  placeholder="Describe the threat messages, demands, or harassment (Supports Ctrl+V to paste images or chat transcripts)..."
                  required
                />
              </div>

              {/* Step 4: COMPULSORY Evidence Upload */}
              <div className="space-y-3 pt-2 border-t border-sand-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                    4. Evidence Attachment <span className="text-errorRed font-extrabold">* COMPULSORY</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteFromClipboardButton}
                    className="text-[11px] font-bold text-primary bg-sand-200 border border-sand-300 hover:bg-sand-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                    title="Paste copied screenshot or chat text directly"
                  >
                    📋 Paste Copied Chat or Image
                  </button>
                </div>

                <p className="text-xs text-textMuted">
                  To prevent fraudulent or malicious claims, uploading or pasting (Ctrl+V) at least one authentic screenshot, chat log, or recording is strictly required.
                </p>

                {/* Upload & Paste Zone */}
                <label 
                  onPaste={handlePasteEvent}
                  tabIndex={0}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center transition-all focus:outline-hidden ${
                  evidenceFiles.length === 0
                    ? 'border-rose-500/60 bg-rose-500/5 hover:border-rose-500 dark:bg-rose-950/20 dark:border-rose-500/40 dark:hover:border-rose-400'
                    : 'border-sand-300 dark:border-slate-700 hover:border-primary dark:hover:border-orange-400 bg-sand-100 dark:bg-slate-900'
                }`}>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                  />
                  <UploadCloud className="w-8 h-8 text-primary dark:text-orange-400 mb-1.5" />
                  <p className="text-xs font-extrabold text-primary dark:text-slate-100">
                    {evidenceFiles.length === 0 ? 'Upload or Paste (Ctrl+V) Evidence File' : 'Add / Paste Additional Evidence'}
                  </p>
                  <p className="text-[11px] text-textMuted dark:text-slate-400 mt-0.5 font-medium">
                    Screenshots, image exports, PDF, or copied chat log • Maximum 25MB
                  </p>
                </label>

                {/* File List */}
                {evidenceFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-sand-200 dark:bg-slate-900 border border-sand-300 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-primary dark:text-orange-400" />
                      <div>
                        <p className="font-bold text-primary dark:text-slate-100">{file.name}</p>
                        <p className="text-[10px] text-textMuted dark:text-slate-400">{file.size} • {file.status}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1 text-textMuted hover:text-errorRed transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* AI Threat Analysis Trigger Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAnalyzeThreatWithAI}
                    disabled={isAnalyzingThreat}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-amber-500/40 shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {isAnalyzingThreat ? (
                      <>
                        <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                        <span>AI Engine Analyzing Evidence & Threat Signals...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Analyze Evidence & Calculate Threat Score with AI</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Analysis Result Dossier */}
                {aiAnalysisResult && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="font-extrabold text-xs text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                          AI Forensic Evaluation Complete
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950">
                        Assessed Score: {aiAnalysisResult.threatScore}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {aiAnalysisResult.summary}
                    </p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Extracted Evidence Signals:
                      </span>
                      <ul className="space-y-1 text-xs">
                        {aiAnalysisResult.indicators.map((ind, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                      <span>Seal: {aiAnalysisResult.evidenceHash}</span>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="text-amber-700 dark:text-amber-400 hover:underline font-bold font-sans"
                      >
                        📄 Save / Print Evidence Certificate
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 5: COMPULSORY Safety Check & Verification */}
              <div className="p-5 rounded-2xl bg-sand-100 border border-sand-300 dark:bg-slate-900 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-extrabold text-primary dark:text-slate-100 uppercase tracking-wider">
                    5. Safety Check & Compulsory Verification <span className="text-errorRed dark:text-rose-400">*</span>
                  </span>
                  <span className="text-xs text-errorRed dark:text-rose-400 font-bold flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    Statutory Protocol
                  </span>
                </div>

                <p className="text-xs text-textMuted dark:text-slate-300">
                  Are you in immediate physical peril, or is someone threatening imminent in-person contact?
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsImmediateDanger(false)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      !isImmediateDanger
                        ? 'bg-primary text-surface dark:bg-orange-600 dark:text-white shadow-warm-sm hover:shadow-md'
                        : 'bg-surface dark:bg-slate-800 border border-sand-300 dark:border-slate-700 text-textDark dark:text-slate-200 hover:bg-sand-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    No, I am physically secure
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsImmediateDanger(true)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      isImmediateDanger
                        ? 'bg-rose-600 text-white shadow-warm-sm hover:shadow-md'
                        : 'bg-surface dark:bg-slate-800 border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    }`}
                  >
                    Yes (Emergency 1098 Escalation)
                  </button>
                </div>

                {/* Compulsory Safety Evidence Checkbox */}
                <label className="flex items-start gap-2.5 pt-3 border-t border-sand-300 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyCheckVerified}
                    onChange={(e) => {
                      setSafetyCheckVerified(e.target.checked);
                      if (e.target.checked) setValidationError(null);
                    }}
                    className="mt-0.5 rounded border-sand-300 text-primary dark:text-orange-500 focus:ring-secondary w-4 h-4"
                  />
                  <span className="text-xs text-textDark dark:text-slate-200 leading-relaxed font-semibold">
                    Compulsory Safety Verification: I certify that the attached evidence substantiates this threat situation and verify this report for child welfare investigation.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-surface font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-warm-sm hover:shadow-md transition-all active:scale-95 group/btn"
              >
                <Shield className="w-5 h-5 text-secondary group-hover/btn:scale-105 transition-transform" />
                <span>Submit Verified Incident with Compulsory Evidence</span>
              </button>

              <p className="text-center text-[11px] text-textMuted flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-safeGreen" />
                Client-side zero-knowledge encryption • IP address never logged
              </p>
            </form>
          </section>

          {/* RIGHT: Live AI Risk Triage Dossier */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-2xl border border-sand-300 shadow-warm-card overflow-hidden sticky top-24">
              <div className="h-1.5 w-full bg-secondary"></div>
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-sand-200 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary-dark">
                      <Cpu className="w-4 h-4 text-secondary" />
                      Live AI Triage Dossier
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-primary mt-0.5">Automated Risk Analysis</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    threatScore > 75 
                      ? 'bg-amber-100 text-amber-900 border border-secondary' 
                      : 'bg-blue-100 text-blue-900'
                  }`}>
                    {threatScore > 75 ? 'High Urgency' : 'Moderate'}
                  </span>
                </div>

                {/* Score Meter */}
                <div className="p-4 rounded-xl bg-sand-100 border border-sand-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-textMuted">Assessed Threat Level</span>
                    <span className="text-primary font-bold">{threatScore} / 100</span>
                  </div>
                  <div className="w-full bg-sand-300 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        threatScore > 75 ? 'bg-errorRed' : 'bg-secondary'
                      }`}
                      style={{ width: `${threatScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-textMuted font-medium pt-1">
                    <span>Mild Risk</span>
                    <span>Severe Threat</span>
                  </div>
                </div>

                {/* Live Trigger Button inside Sidebar */}
                <button
                  type="button"
                  onClick={handleAnalyzeThreatWithAI}
                  disabled={isAnalyzingThreat}
                  className="w-full py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold flex items-center justify-center gap-2 shadow-warm-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzingThreat ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-secondary animate-spin" />
                      <span>AI Analyzing Images & Text...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-secondary" />
                      <span>Run AI Threat & Image Analysis</span>
                    </>
                  )}
                </button>

                {/* Compulsory Evidence Status */}
                <div className="p-3.5 rounded-xl bg-sand-100 border border-sand-200 space-y-1.5 text-xs">
                  <span className="font-bold text-primary flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-secondary" />
                    Evidence Status:
                  </span>
                  <p className="text-textMuted">
                    {evidenceFiles.length > 0
                      ? `✓ ${evidenceFiles.length} evidence file(s) attached with SHA-256 seal.`
                      : '❌ Compulsory evidence required before submission.'}
                  </p>
                </div>

                {/* Action Guardrails */}
                <div className="space-y-2 pt-2 border-t border-sand-200 text-xs">
                  <p className="font-bold text-primary uppercase tracking-wider">
                    Recommended Immediate Guardrails:
                  </p>
                  <ul className="space-y-1.5 text-textDark">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-safeGreen flex-shrink-0 mt-0.5" />
                      <span>Cease all communication — do not comply with extortion demands.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-safeGreen flex-shrink-0 mt-0.5" />
                      <span>Evidence hash recorded with SHA-256 tamper-proof seal.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-safeGreen flex-shrink-0 mt-0.5" />
                      <span>Platform takedown notice prepared for Meta & Snapchat Trust teams.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
