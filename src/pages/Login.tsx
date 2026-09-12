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
  Hash,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { EmailOTPModal } from '../components/auth/EmailOTPModal';

// Pre-seeded Credentials for Instant Verification
const PRESET_CREDENTIALS = [
  {
    roleLabel: 'Student Category',
    role: 'registered_youth' as const,
    alias: '🎓 Arjun_Student',
    email: 'student@cybervigil.org',
    password: 'student123',
    rollId: 'DPS-2026-X88',
    institution: 'Delhi Public School, R.K. Puram',
    clearance: 'Shield Level 1 (Institutional Verified)',
    tag: 'Student Clearance'
  },
  {
    roleLabel: 'Youth Defender',
    role: 'registered_youth' as const,
    alias: '🛡️ Priya_Defender',
    email: 'defender@cybervigil.org',
    password: 'defender123',
    rollId: 'KV-2026-DEF',
    institution: 'Kendriya Vidyalaya, Youth Defense League',
    clearance: 'Shield Level 1 (Peer Defender Verified)',
    tag: 'Defender Clearance'
  },
  {
    roleLabel: 'Parent Guardian',
    role: 'parent_guardian' as const,
    alias: '👪 Sunita (Guardian)',
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
  }
];

export const Login: React.FC = () => {
  const { loginAsAnonymous, loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  // Active Login Role Tab: Student, Youth Defender, Guardian, Inspector, Anonymous Case PIN
  const [activeTab, setActiveTab] = useState<'student' | 'defender' | 'guardian' | 'officer' | 'anonymous'>('student');
  
  // Form State
  const [email, setEmail] = useState('student@cybervigil.org');
  const [password, setPassword] = useState('student123');
  const [studentRoll, setStudentRoll] = useState('DPS-2026-X88');
  const [wardPin, setWardPin] = useState('CV-1042');
  const [officerBadge, setOfficerBadge] = useState('CPU-4');
  const [ticketPin, setTicketPin] = useState('CV-1042');
  const [errorMessage, setErrorMessage] = useState('');

  // Email OTP Modal Verification State for Sign-In
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingLoginAction, setPendingLoginAction] = useState<(() => void) | null>(null);

  const handleApplyPreset = (preset: typeof PRESET_CREDENTIALS[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setErrorMessage('');

    if (preset.roleLabel === 'Student Category') {
      setActiveTab('student');
      if (preset.rollId) setStudentRoll(preset.rollId);
    } else if (preset.roleLabel === 'Youth Defender') {
      setActiveTab('defender');
      if (preset.rollId) setStudentRoll(preset.rollId);
    } else if (preset.role === 'parent_guardian') {
      setActiveTab('guardian');
      if (preset.wardPin) setWardPin(preset.wardPin);
    } else if (preset.role === 'welfare_officer') {
      setActiveTab('officer');
      if (preset.badge) setOfficerBadge(preset.badge.replace('#', ''));
    }
  };

  const triggerLoginWithOTP = (loginFn: () => void) => {
    setPendingLoginAction(() => loginFn);
    setShowOTPModal(true);
  };

  const handleOTPVerified = () => {
    setShowOTPModal(false);
    if (pendingLoginAction) {
      pendingLoginAction();
      setPendingLoginAction(null);
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your student email and password.');
      return;
    }

    triggerLoginWithOTP(() => {
      const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
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
    });
  };

  const handleDefenderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your defender email and password.');
      return;
    }

    triggerLoginWithOTP(() => {
      const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
      loginWithCredentials(
        matched ? matched.alias : `🛡️ ${email.split('@')[0]}`, 
        'registered_youth',
        'Shield Level 1 (Peer Defender Verified)',
        studentRoll || 'DEF-VERIFIED',
        {
          isVerified: true,
          verificationId: studentRoll || 'DEF-VERIFIED',
          verificationType: 'student_institutional_id',
          institutionOrJurisdiction: matched?.institution || 'Youth Defense Network'
        }
      );
      navigate('/');
    });
  };

  const handleGuardianSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your guardian email and password.');
      return;
    }

    triggerLoginWithOTP(() => {
      const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
      loginWithCredentials(
        matched ? matched.alias : `👪 Guardian (${email.split('@')[0]})`, 
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
    });
  };

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your departmental police email and password.');
      return;
    }

    triggerLoginWithOTP(() => {
      const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
      loginWithCredentials(
        matched ? matched.alias : `⚖️ Inspector (${email.split('@')[0]})`, 
        'welfare_officer',
        'Level 3 Clearance (POCSO Statutory Verified)',
        `Badge #${officerBadge || 'CPU-4'}`,
        {
          isVerified: true,
          verificationId: officerBadge || 'CPU-4',
          verificationType: 'inspector_pocso_nodal',
          institutionOrJurisdiction: matched?.institution || 'POCSO Nodal Unit'
        }
      );
      navigate('/officer-portal');
    });
  };

  const handleAnonymousSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketPin.trim()) {
      setErrorMessage('Please enter your 6-character Case Reference PIN.');
      return;
    }

    loginAsAnonymous();
    localStorage.setItem('cybervigil_last_ticket', ticketPin.trim());
    navigate('/report');
  };

  const getRoleUserLabel = () => {
    if (activeTab === 'student') return 'Student Defender';
    if (activeTab === 'defender') return 'Youth Defender';
    if (activeTab === 'guardian') return 'Parent / Guardian';
    if (activeTab === 'officer') return 'Police Inspector';
    return 'User';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-200 dark:bg-sand-800 text-primary dark:text-sand-100 text-xs font-bold shadow-warm-sm">
          <Shield className="w-4 h-4 text-secondary" />
          <span>Statutory Multi-Role Authentication System</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-sand-100">
          Sign In to CyberVigil Platform
        </h1>
        <p className="text-xs sm:text-sm text-textMuted dark:text-sand-300 max-w-lg mx-auto">
          Select your statutory category below to enter your secure clearance portal with 2FA email verification.
        </p>
      </div>

      {/* Main Sign-In Card Container */}
      <div className="bg-surface dark:bg-sand-900 rounded-3xl p-6 sm:p-8 border border-sand-300 dark:border-sand-800 shadow-warm-card space-y-6">
        
        {/* 4 Role Tabs + Anonymous Case PIN */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-primary dark:text-sand-100 uppercase tracking-wider">
            1. Select Sign-In Role / Category
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('student'); setErrorMessage(''); }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-sand-50 dark:bg-sand-800 border-sand-300 dark:border-sand-700 text-textDark dark:text-sand-200 hover:border-sand-400'
              }`}
            >
              <span className="text-lg">🎓</span>
              <span className="text-[11px] leading-tight">Student</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('defender'); setErrorMessage(''); }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === 'defender'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-sand-50 dark:bg-sand-800 border-sand-300 dark:border-sand-700 text-textDark dark:text-sand-200 hover:border-sand-400'
              }`}
            >
              <span className="text-lg">🛡️</span>
              <span className="text-[11px] leading-tight">Defender</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('guardian'); setErrorMessage(''); }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === 'guardian'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-sand-50 dark:bg-sand-800 border-sand-300 dark:border-sand-700 text-textDark dark:text-sand-200 hover:border-sand-400'
              }`}
            >
              <span className="text-lg">👪</span>
              <span className="text-[11px] leading-tight">Parent</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('officer'); setErrorMessage(''); }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === 'officer'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-sand-50 dark:bg-sand-800 border-sand-300 dark:border-sand-700 text-textDark dark:text-sand-200 hover:border-sand-400'
              }`}
            >
              <span className="text-lg">⚖️</span>
              <span className="text-[11px] leading-tight">Inspector</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('anonymous'); setErrorMessage(''); }}
              className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1 ${
                activeTab === 'anonymous'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                  : 'bg-sand-50 dark:bg-sand-800 border-sand-300 dark:border-sand-700 text-textDark dark:text-sand-200 hover:border-sand-400'
              }`}
            >
              <span className="text-lg">🔒</span>
              <span className="text-[11px] leading-tight">Case PIN</span>
            </button>
          </div>
        </div>

        {/* Demo Preset Bar for Testing */}
        <div className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Quick Fill Verified Demo Accounts:
            </span>
            <span className="text-[10px] text-amber-800 dark:text-amber-300 font-mono">Instant Fill</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_CREDENTIALS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="p-2 rounded-xl bg-surface dark:bg-sand-800 hover:bg-amber-100 dark:hover:bg-sand-700 border border-amber-200 dark:border-sand-700 text-left transition-all text-[11px]"
              >
                <div className="font-extrabold text-primary dark:text-sand-100 truncate">{preset.alias}</div>
                <div className="text-[10px] text-textMuted dark:text-sand-400 font-mono truncate">{preset.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-errorContainer text-errorRed text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ============================================================================== */}
        {/* A. STUDENT SIGN-IN FORM */}
        {/* ============================================================================== */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200 text-xs">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Student Category Sign-In</span>
              </div>
              <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                Sign in to access your confidential student dashboard, doubt upvoting, and anonymous story sharing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Student Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@cybervigil.org"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary dark:text-sand-200">Student Roll / ID Number</label>
              <div className="relative">
                <Hash className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  placeholder="e.g. DPS-2026-X88"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono font-bold text-primary dark:text-sand-100 focus:ring-2 focus:ring-secondary/40"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Verify Email OTP & Sign In as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ============================================================================== */}
        {/* B. YOUTH DEFENDER SIGN-IN FORM */}
        {/* ============================================================================== */}
        {activeTab === 'defender' && (
          <form onSubmit={handleDefenderSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Youth Defender Category Sign-In</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Sign in as a certified Youth Defender to support peers, moderate community grievances, and share brave survivor stories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Defender Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="defender@cybervigil.org"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Verify Email OTP & Sign In as Defender</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ============================================================================== */}
        {/* C. PARENT / GUARDIAN SIGN-IN FORM */}
        {/* ============================================================================== */}
        {activeTab === 'guardian' && (
          <form onSubmit={handleGuardianSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200 text-xs">
                <HeartHandshake className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Parent / Guardian Category Sign-In</span>
              </div>
              <p className="text-[11px] text-purple-800 dark:text-purple-300 leading-relaxed">
                Sign in to manage child safety alerts, direct counselor dispatches, and linked ward incident advisories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Guardian Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@cybervigil.org"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary dark:text-sand-200">Linked Ward Reference PIN</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={wardPin}
                  onChange={(e) => setWardPin(e.target.value)}
                  placeholder="e.g. CV-1042"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono font-bold text-primary dark:text-sand-100 focus:ring-2 focus:ring-secondary/40"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Verify Email OTP & Sign In as Guardian</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ============================================================================== */}
        {/* D. POLICE INSPECTOR SIGN-IN FORM */}
        {/* ============================================================================== */}
        {activeTab === 'officer' && (
          <form onSubmit={handleOfficerSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-950 dark:text-amber-200 text-xs">
                <Building className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Police Inspector & Welfare Nodal Officer Sign-In</span>
              </div>
              <p className="text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
                Sworn officer access for POCSO Nodal Desk, incident triage, and automated takedown notice dispatches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Departmental Gov Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@cybervigil.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono text-primary dark:text-sand-100 focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary dark:text-sand-200">Police Badge / Nodal ID</label>
              <input
                type="text"
                value={officerBadge}
                onChange={(e) => setOfficerBadge(e.target.value)}
                placeholder="CPU-4"
                className="w-full px-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono font-bold text-primary dark:text-sand-100 focus:ring-2 focus:ring-secondary/40"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Verify Email OTP & Enter Police Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ============================================================================== */}
        {/* E. ANONYMOUS CASE PIN TRACKING TAB */}
        {/* ============================================================================== */}
        {activeTab === 'anonymous' && (
          <form onSubmit={handleAnonymousSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-sand-100 dark:bg-sand-800 border border-sand-300 dark:border-sand-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-primary dark:text-sand-100 text-xs">
                <KeyRound className="w-4 h-4 text-secondary" />
                <span>Track Incident Report via Case Reference PIN</span>
              </div>
              <p className="text-[11px] text-textMuted dark:text-sand-300 leading-relaxed">
                If you submitted an anonymous report earlier, enter your 6-character reference PIN (e.g. <code>CV-1042</code>) to view statutory updates zero-trace.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary dark:text-sand-200">Incident Reference PIN</label>
              <input
                type="text"
                value={ticketPin}
                onChange={(e) => setTicketPin(e.target.value.toUpperCase())}
                placeholder="CV-1042"
                className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-sm font-mono font-bold text-primary dark:text-sand-100 focus:ring-2 focus:ring-secondary/40"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-warm-md transition-all active:scale-[0.99]"
            >
              <span>Access Case PIN Portal</span>
              <ArrowRight className="w-4 h-4 text-secondary" />
            </button>
          </form>
        )}

        {/* Footer Navigation Link */}
        <div className="pt-4 border-t border-sand-200 dark:border-sand-800 flex items-center justify-between text-xs text-textMuted dark:text-sand-400">
          <span>Need to create a new clearance account?</span>
          <Link to="/register" className="text-secondary dark:text-orange-400 font-bold hover:underline">
            Register New Account →
          </Link>
        </div>

      </div>

      {/* EMAIL OTP MODAL VERIFICATION FOR SIGN-IN */}
      <EmailOTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerifySuccess={handleOTPVerified}
        email={email}
        userRole={getRoleUserLabel()}
      />
    </div>
  );
};
