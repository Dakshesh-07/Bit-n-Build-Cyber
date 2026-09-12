import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  AlertTriangle,
  BadgeCheck,
  Sparkles,
  GraduationCap,
  HeartHandshake,
  Check,
  Building,
  Hash
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { EmailOTPModal } from '../components/auth/EmailOTPModal';

// Pre-seeded Credentials for Instant Verification
const PRESET_CREDENTIALS = [
  {
    roleLabel: 'Student Defender',
    role: 'registered_youth' as const,
    alias: '🎓 Arjun_Defender',
    email: 'student@cybervigil.org',
    password: 'student123',
    rollId: 'DPS-2026-X88',
    institution: 'Delhi Public School, R.K. Puram',
    clearance: 'Shield Level 1 (Institutional Verified)',
    tag: 'Student Clearance'
  },
  {
    roleLabel: 'Parent Guardian',
    role: 'parent_guardian' as const,
    alias: '🛡️ Guardian (Sunita M.)',
    email: 'parent@cybervigil.org',
    password: 'parent123',
    wardPin: 'CV-1042',
    institution: 'Direct Ward Link (#CV-1042)',
    clearance: 'Family Safe Mode (Verified)',
    tag: 'Guardian Clearance'
  },
  {
    roleLabel: 'Police Inspector',
    role: 'welfare_officer' as const,
    alias: '⚖️ Inspector Sharma',
    email: 'officer@cybervigil.gov.in',
    password: 'officer123',
    badge: '#CPU-4',
    securityToken: 'POCSO-7749-SEC',
    institution: 'POCSO Nodal Unit DL-04, Cyber Crime Cell',
    clearance: 'Level 3 Clearance (POCSO Statutory Verified)',
    tag: 'Officer Clearance'
  },
  {
    roleLabel: 'System Administrator',
    role: 'admin' as const,
    alias: '⚡ Admin Lead',
    email: 'admin@cybervigil.org',
    password: 'admin123',
    badge: '#ADMIN-01',
    institution: 'CyberVigil Cyber Forensic Core',
    clearance: 'Master Security Clearance',
    tag: 'System Admin'
  }
];

export const Login: React.FC = () => {
  const { loginAsAnonymous, loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  // Active Login Role Tab
  const [activeTab, setActiveTab] = useState<'student' | 'guardian' | 'officer' | 'anonymous'>('student');
  
  // Form State
  const [email, setEmail] = useState('student@cybervigil.org');
  const [password, setPassword] = useState('student123');
  const [studentRoll, setStudentRoll] = useState('DPS-2026-X88');
  const [wardPin, setWardPin] = useState('CV-1042');
  const [officerBadge, setOfficerBadge] = useState('CPU-4');
  const [securityToken, setSecurityToken] = useState('POCSO-7749-SEC');
  const [ticketPin, setTicketPin] = useState('CV-1042');
  const [errorMessage, setErrorMessage] = useState('');

  // Email OTP Modal State
  const [isOTPModalOpen, setIsOTPModalOpen] = useState<boolean>(false);
  const [pendingLoginCallback, setPendingLoginCallback] = useState<(() => void) | null>(null);

  const handleApplyPreset = (preset: typeof PRESET_CREDENTIALS[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setErrorMessage('');

    if (preset.role === 'registered_youth') {
      setActiveTab('student');
      if (preset.rollId) setStudentRoll(preset.rollId);
    } else if (preset.role === 'parent_guardian') {
      setActiveTab('guardian');
      if (preset.wardPin) setWardPin(preset.wardPin);
    } else if (preset.role === 'welfare_officer' || preset.role === 'admin') {
      setActiveTab('officer');
      if (preset.badge) setOfficerBadge(preset.badge.replace('#', ''));
    }
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your student email and password.');
      return;
    }

    const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
    const proceedLogin = () => {
      loginWithCredentials(
        matched ? matched.alias : `🎓 ${email.split('@')[0]}`, 
        'registered_youth',
        'Shield Level 1 (Institutional Verified)',
        studentRoll || 'STU-VERIFIED',
        {
          isVerified: true,
          verificationId: studentRoll || 'STU-VERIFIED',
          verificationType: 'student_institutional_id',
          institutionOrJurisdiction: matched?.institution || 'Verified Educational Institution'
        }
      );
      navigate('/');
    };

    setPendingLoginCallback(() => proceedLogin);
    setIsOTPModalOpen(true);
  };

  const handleGuardianLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your guardian email and password.');
      return;
    }

    const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
    const proceedLogin = () => {
      loginWithCredentials(
        matched ? matched.alias : `🛡️ Guardian (${email.split('@')[0]})`, 
        'parent_guardian',
        'Family Safe Mode (Verified)',
        `Ward: ${wardPin || 'CV-1042'}`,
        {
          isVerified: true,
          verificationId: wardPin || 'CV-1042',
          verificationType: 'guardian_ward_link',
          institutionOrJurisdiction: `Ward Link #${wardPin || 'CV-1042'}`
        }
      );
      navigate('/');
    };

    setPendingLoginCallback(() => proceedLogin);
    setIsOTPModalOpen(true);
  };

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !officerBadge.trim()) {
      setErrorMessage('Please enter officer email, password, and official badge identifier.');
      return;
    }

    const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
    const role: UserRole = matched?.role === 'admin' ? 'admin' : 'welfare_officer';
    const clearance = role === 'admin' 
      ? 'Master Security Clearance' 
      : 'Level 3 Clearance (POCSO Statutory Verified)';

    const proceedLogin = () => {
      loginWithCredentials(
        matched ? matched.alias : `⚖️ Inspector (${officerBadge})`, 
        role, 
        clearance, 
        `#${officerBadge.replace('#', '')}`,
        {
          isVerified: true,
          verificationId: `#${officerBadge.replace('#', '')}`,
          verificationType: 'inspector_pocso_nodal',
          institutionOrJurisdiction: matched?.institution || 'POCSO Nodal Unit DL-04, Cyber Cell'
        }
      );
      navigate('/portal');
    };

    setPendingLoginCallback(() => proceedLogin);
    setIsOTPModalOpen(true);
  };

  const handleOTPVerifySuccess = () => {
    setIsOTPModalOpen(false);
    if (pendingLoginCallback) {
      pendingLoginCallback();
    }
  };

  const handleAnonymousLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketPin.trim()) {
      setErrorMessage('Please enter your Case ID (e.g. CV-1042)');
      return;
    }
    loginAsAnonymous(ticketPin.replace('#', ''));
    navigate('/report');
  };

  return (
    <div className="max-w-xl mx-auto py-10 pb-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <img 
          src="/cybervigil-shield.png" 
          alt="CyberVigil" 
          className="w-16 h-16 object-contain mx-auto filter drop-shadow-md" 
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-sand-50 tracking-tight">
          CyberVigil Authentication
        </h1>
        <p className="text-xs sm:text-sm text-textMuted dark:text-sand-400 max-w-sm mx-auto">
          Sign into verified Student, Guardian, or Inspector clearance, or track anonymous cases.
        </p>
      </div>

      {/* 1-Click Credential Quick-Picker */}
      <div className="bg-sand-100 dark:bg-sand-900/90 rounded-2xl p-4 border border-sand-300 dark:border-sand-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-primary dark:text-sand-100 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            Verified Role Quick-Fill (1-Click)
          </span>
          <span className="text-[10px] text-textMuted dark:text-sand-400 font-semibold">Test accounts</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {PRESET_CREDENTIALS.map((p) => (
            <button
              key={p.roleLabel}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="p-2.5 rounded-xl bg-surface dark:bg-sand-800 border border-sand-300 dark:border-sand-700 hover:border-sand-400 dark:hover:border-sand-600 hover:bg-sand-50/80 dark:hover:bg-sand-700/80 text-left transition-all duration-200 active:scale-95 shadow-xs hover:shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary dark:text-sand-100 block leading-tight group-hover:text-secondary-dark dark:group-hover:text-secondary transition-colors truncate">
                  {p.roleLabel}
                </span>
                <span className="text-[9px] font-semibold text-textMuted dark:text-sand-400 bg-sand-100 dark:bg-sand-700 px-1.5 py-0.5 rounded">
                  {p.tag}
                </span>
              </div>
              <span className="text-[10px] text-textMuted dark:text-sand-400 block truncate font-mono mt-0.5">{p.email}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 rounded-xl bg-sand-200 dark:bg-sand-800/80 p-1 border border-sand-300 dark:border-sand-700 text-xs font-bold gap-1">
        <button
          onClick={() => { setActiveTab('student'); setErrorMessage(''); setEmail('student@cybervigil.org'); setPassword('student123'); }}
          className={`py-2 px-1 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1 ${
            activeTab === 'student'
              ? 'bg-blue-600 text-surface shadow-sm font-extrabold'
              : 'text-textMuted dark:text-sand-400 hover:text-primary dark:hover:text-sand-100'
          }`}
        >
          <span>🎓</span>
          <span>Student</span>
        </button>
        <button
          onClick={() => { setActiveTab('guardian'); setErrorMessage(''); setEmail('parent@cybervigil.org'); setPassword('parent123'); }}
          className={`py-2 px-1 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1 ${
            activeTab === 'guardian'
              ? 'bg-purple-600 text-surface shadow-sm font-extrabold'
              : 'text-textMuted dark:text-sand-400 hover:text-primary dark:hover:text-sand-100'
          }`}
        >
          <span>🛡️</span>
          <span>Guardian</span>
        </button>
        <button
          onClick={() => { setActiveTab('officer'); setErrorMessage(''); setEmail('officer@cybervigil.gov.in'); setPassword('officer123'); }}
          className={`py-2 px-1 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1 ${
            activeTab === 'officer'
              ? 'bg-primary dark:bg-secondary text-secondary dark:text-primary shadow-sm font-extrabold'
              : 'text-textMuted dark:text-sand-400 hover:text-primary dark:hover:text-sand-100'
          }`}
        >
          <span>⚖️</span>
          <span>Inspector</span>
        </button>
        <button
          onClick={() => { setActiveTab('anonymous'); setErrorMessage(''); }}
          className={`py-2 px-1 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1 ${
            activeTab === 'anonymous'
              ? 'bg-surface dark:bg-sand-700 text-primary dark:text-sand-100 shadow-sm font-extrabold'
              : 'text-textMuted dark:text-sand-400 hover:text-primary dark:hover:text-sand-100'
          }`}
        >
          <span>🔒</span>
          <span>Case PIN</span>
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-errorContainer text-errorRed text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Card Container */}
      <div className="bg-surface dark:bg-sand-900 rounded-2xl p-6 sm:p-8 border border-sand-300 dark:border-sand-800 shadow-warm-card space-y-5">
        
        {/* Tab 1: Student / Youth Defender */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentLogin} className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-xs">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                <span className="font-bold text-blue-900 dark:text-blue-200">Student & Youth Defender Portal</span>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                Shield Level 1
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="student-email" className="block text-xs font-bold text-primary dark:text-sand-200">
                Student Email / Institutional Login
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3.5 top-3.5" />
                <input
                  id="student-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@cybervigil.org"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-sand-800 focus:bg-surface dark:focus:bg-sand-800 focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm text-primary dark:text-sand-100 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="student-roll" className="block text-xs font-bold text-primary dark:text-sand-200">
                Student Roll / Institutional ID Code (Verified)
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3.5 top-3.5" />
                <input
                  id="student-roll"
                  type="text"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  placeholder="DPS-2026-X88"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-sand-800 focus:bg-surface dark:focus:bg-sand-800 focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm font-mono font-bold text-primary dark:text-sand-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="student-pass" className="block text-xs font-bold text-primary dark:text-sand-200">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3.5 top-3.5" />
                <input
                  id="student-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-sand-800 focus:bg-surface dark:focus:bg-sand-800 focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm text-primary dark:text-sand-100 font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-surface font-bold text-sm shadow-warm-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 group/btn"
            >
              <span>Verify Student Clearance & Sign In</span>
              <ArrowRight className="w-4 h-4 text-secondary group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <div className="text-center pt-1">
              <Link to="/register" className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline">
                New student? Create verified Defender profile
              </Link>
            </div>
          </form>
        )}

        {/* Tab 2: Parent / Guardian */}
        {activeTab === 'guardian' && (
          <form onSubmit={handleGuardianLogin} className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-purple-700" />
                <span className="font-bold text-purple-900">Parent & Guardian Safety Desk</span>
              </div>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                Family Safe Mode
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="guardian-email" className="block text-xs font-bold text-primary">
                Guardian Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
                <input
                  id="guardian-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@cybervigil.org"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-purple-400 text-xs sm:text-sm text-primary font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ward-pin" className="block text-xs font-bold text-primary">
                Ward Case PIN or Child Link Identifier
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
                <input
                  id="ward-pin"
                  type="text"
                  value={wardPin}
                  onChange={(e) => setWardPin(e.target.value)}
                  placeholder="CV-1042"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-purple-400 text-xs sm:text-sm font-mono font-bold text-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="guardian-pass" className="block text-xs font-bold text-primary">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
                <input
                  id="guardian-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-purple-400 text-xs sm:text-sm text-primary font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-surface font-bold text-sm shadow-warm-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 group/btn"
            >
              <span>Verify Guardian Clearance & Sign In</span>
              <ArrowRight className="w-4 h-4 text-secondary group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <div className="text-center pt-1">
              <Link to="/register" className="text-xs font-bold text-purple-700 hover:underline">
                Need to link your child? Register verified Guardian profile
              </Link>
            </div>
          </form>
        )}

        {/* Tab 3: Police / Welfare Inspector */}
        {activeTab === 'officer' && (
          <form onSubmit={handleOfficerLogin} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-primary text-surface text-xs space-y-1 border border-sand-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-secondary font-bold">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Statutory Law Enforcement & POCSO Gate</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-500/20 text-secondary border border-secondary/40 px-2 py-0.5 rounded-full">
                  Level 3 Clearance
                </span>
              </div>
              <p className="text-sand-300 text-[11px]">
                Restricted to certified Child Welfare Officers, Cyber Crime Cell Inspectors, and POCSO Nodal Investigators.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="officer-email" className="block text-xs font-bold text-primary">
                Departmental Gov Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
                <input
                  id="officer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@cybervigil.gov.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm text-primary font-mono font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="badge" className="block text-xs font-bold text-primary">
                  Police Badge / Service ID
                </label>
                <div className="relative">
                  <BadgeCheck className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
                  <input
                    id="badge"
                    type="text"
                    value={officerBadge}
                    onChange={(e) => setOfficerBadge(e.target.value)}
                    placeholder="CPU-4"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm font-mono font-bold text-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="token" className="block text-xs font-bold text-primary">
                  2FA Verification Passkey
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
                  <input
                    id="token"
                    type="text"
                    value={securityToken}
                    onChange={(e) => setSecurityToken(e.target.value)}
                    placeholder="POCSO-7749-SEC"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm font-mono font-bold text-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="officer-pass" className="block text-xs font-bold text-primary">
                Officer Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
                <input
                  id="officer-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-secondary/40 text-xs sm:text-sm text-primary font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-secondary hover:bg-secondary-dark text-primary font-bold text-sm shadow-warm-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 group/btn"
            >
              <Shield className="w-4 h-4" />
              <span>Verify Level 3 POCSO Clearance & Enter Portal</span>
              <ArrowRight className="w-4 h-4 text-primary group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <div className="text-center pt-1">
              <Link to="/register" className="text-xs font-bold text-secondary-dark hover:underline">
                New officer? Register departmental credentials
              </Link>
            </div>
          </form>
        )}

        {/* Tab 4: Anonymous Case PIN Tracking */}
        {activeTab === 'anonymous' && (
          <form onSubmit={handleAnonymousLogin} className="space-y-4">
            <div className="p-4 rounded-xl bg-sand-100 border border-sand-200 text-xs text-textMuted leading-relaxed space-y-1">
              <strong className="text-primary block font-bold">Anonymous Victim Safe Tracking</strong>
              <p>
                If you were bullied, extorted, or defrauded and reported anonymously, enter your Case PIN (e.g. <span className="font-mono font-bold text-primary">CV-1042</span>) to view real-time investigation and takedown status without revealing your identity.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="ticket" className="block text-xs font-bold text-primary">
                Case Reference PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
                <input
                  id="ticket"
                  type="text"
                  value={ticketPin}
                  onChange={(e) => setTicketPin(e.target.value)}
                  placeholder="e.g. CV-1042"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-secondary/40 text-sm font-mono font-bold text-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-surface font-bold text-sm shadow-warm-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Track Case Anonymously</span>
              <ArrowRight className="w-4 h-4 text-secondary" />
            </button>
          </form>
        )}
      </div>

      <EmailOTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerifySuccess={handleOTPVerifySuccess}
        email={email}
        userRole={activeTab === 'student' ? 'Student Defender' : activeTab === 'guardian' ? 'Parent / Guardian' : 'Police Inspector'}
      />
    </div>
  );
};
