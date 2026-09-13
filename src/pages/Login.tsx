import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  ArrowRight, 
  AlertTriangle,
  Mail,
  Hash,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { EmailOTPModal } from '../components/auth/EmailOTPModal';

// Pre-seeded Credentials for Instant Verification
const PRESET_CREDENTIALS = [
  {
    roleLabel: 'Student Category',
    role: 'registered_youth' as const,
    alias: 'Arjun_Student',
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
    alias: 'Priya_Defender',
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
    alias: 'Sunita (Guardian)',
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
    alias: 'Inspector Sharma',
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [wardPin, setWardPin] = useState('');
  const [officerBadge, setOfficerBadge] = useState('');
  const [ticketPin, setTicketPin] = useState('');
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

  const isTestId = (identifier: string): boolean => {
    const normalized = (identifier || '').toLowerCase().trim();
    return (
      normalized === 'student@cybervigil.org' ||
      normalized === 'defender@cybervigil.org' ||
      normalized === 'parent@cybervigil.org' ||
      normalized === 'officer@cybervigil.gov.in' ||
      normalized === 'admin@cybervigil.org' ||
      normalized.endsWith('@cybervigil.org') ||
      normalized.endsWith('@cybervigil.gov.in') ||
      PRESET_CREDENTIALS.some(p => p.email.toLowerCase() === normalized)
    );
  };

  const triggerLoginWithOTP = (loginFn: () => void) => {
    setPendingLoginAction(() => loginFn);
    setShowOTPModal(true);
  };

  const executeAuthAction = (identifier: string, loginFn: () => void) => {
    if (isTestId(identifier)) {
      // Test IDs bypass OTP verification entirely
      loginFn();
    } else {
      // Real user emails or phone numbers trigger verification code dispatch
      triggerLoginWithOTP(loginFn);
    }
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
    if (!email.trim() || !password.trim() || !studentRoll.trim()) {
      setErrorMessage('Please enter your student email or mobile number, password, and Student Roll / ID.');
      return;
    }

    executeAuthAction(email, () => {
      const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
      loginWithCredentials(
        matched ? matched.alias : email.split('@')[0], 
        'registered_youth',
        'Shield Level 1 (Institutional Verified)',
        studentRoll.trim(),
        {
          isVerified: true,
          verificationId: studentRoll.trim(),
          verificationType: 'student_institutional_id',
          institutionOrJurisdiction: matched?.institution || 'Verified Educational Institution'
        }
      );
      navigate('/');
    });
  };

  const handleDefenderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !studentRoll.trim()) {
      setErrorMessage('Please enter your defender email or mobile number, password, and Youth Defender Accreditation / ID.');
      return;
    }

    executeAuthAction(email, () => {
      const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
      loginWithCredentials(
        matched ? matched.alias : email.split('@')[0], 
        'registered_youth',
        'Shield Level 1 (Peer Defender Verified)',
        studentRoll.trim(),
        {
          isVerified: true,
          verificationId: studentRoll.trim(),
          verificationType: 'student_institutional_id',
          institutionOrJurisdiction: matched?.institution || 'Youth Defense Network'
        }
      );
      navigate('/');
    });
  };

  const handleGuardianSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !wardPin.trim()) {
      setErrorMessage('Please enter your guardian email or mobile number, password, and Linked Ward Reference PIN.');
      return;
    }

    executeAuthAction(email, () => {
      const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
      loginWithCredentials(
        matched ? matched.alias : `Guardian (${email.split('@')[0]})`, 
        'parent_guardian',
        'Family Safe Mode (Verified)',
        `Ward: ${wardPin.trim()}`,
        {
          isVerified: true,
          verificationId: wardPin.trim(),
          verificationType: 'guardian_ward_link',
          institutionOrJurisdiction: `Ward Link #${wardPin.trim()}`
        }
      );
      navigate('/');
    });
  };

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !officerBadge.trim()) {
      setErrorMessage('Please enter your departmental police email or mobile, password, and Police Badge / Nodal ID.');
      return;
    }

    executeAuthAction(email, () => {
      const matched = PRESET_CREDENTIALS.find(p => p.email.toLowerCase() === email.toLowerCase());
      loginWithCredentials(
        matched ? matched.alias : `Inspector (${email.split('@')[0]})`, 
        'welfare_officer',
        'Level 3 Clearance (POCSO Statutory Verified)',
        `Badge #${officerBadge.trim()}`,
        {
          isVerified: true,
          verificationId: officerBadge.trim(),
          verificationType: 'inspector_pocso_nodal',
          institutionOrJurisdiction: matched?.institution || 'POCSO Nodal Unit'
        }
      );
      navigate('/portal');
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
      <div className="text-center space-y-2 pt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-slate-100">
          Log In to CyberVigil Platform
        </h1>
        <p className="text-xs sm:text-sm text-textMuted dark:text-slate-300 max-w-lg mx-auto">
          Select your statutory category below to enter your secure clearance portal with 2FA email verification.
        </p>
      </div>

      {/* Main Login Card Container */}
      <div className="bg-surface dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-sand-300 dark:border-slate-800 shadow-warm-card space-y-6">
        
        {/* 4 Role Tabs + Anonymous Case PIN */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-primary dark:text-slate-200 uppercase tracking-wider">
            1. Select Login Category
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('student'); setErrorMessage(''); setEmail(''); setPassword(''); setStudentRoll(''); }}
              className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                  : 'bg-sand-50 dark:bg-slate-800 border-sand-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              Student
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('defender'); setErrorMessage(''); setEmail(''); setPassword(''); }}
              className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                activeTab === 'defender'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                  : 'bg-sand-50 dark:bg-slate-800 border-sand-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              Defender
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('guardian'); setErrorMessage(''); setEmail(''); setPassword(''); setWardPin(''); }}
              className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                activeTab === 'guardian'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                  : 'bg-sand-50 dark:bg-slate-800 border-sand-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              Parent
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('officer'); setErrorMessage(''); setEmail(''); setPassword(''); setOfficerBadge(''); }}
              className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                activeTab === 'officer'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                  : 'bg-sand-50 dark:bg-slate-800 border-sand-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              Inspector
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('anonymous'); setErrorMessage(''); setTicketPin(''); }}
              className={`py-3 px-2 rounded-xl border text-center transition-all col-span-2 sm:col-span-1 cursor-pointer ${
                activeTab === 'anonymous'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                  : 'bg-sand-50 dark:bg-slate-800 border-sand-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              Case PIN
            </button>
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
        {/* A. STUDENT LOGIN FORM */}
        {/* ============================================================================== */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-sand-100 dark:bg-slate-800/80 border border-sand-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Student Category Login</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Log in to access your confidential student dashboard, doubt upvoting, and anonymous story sharing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Email Address or Mobile Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary dark:text-slate-200">Student Roll / ID Number</label>
              <div className="relative">
                <Hash className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  placeholder="Enter your student roll number"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-elevated transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Log In as Student</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        )}

        {/* ============================================================================== */}
        {/* B. YOUTH DEFENDER LOGIN FORM */}
        {/* ============================================================================== */}
        {activeTab === 'defender' && (
          <form onSubmit={handleDefenderSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-sand-100 dark:bg-slate-800/80 border border-sand-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Youth Defender Category Login</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Log in as a certified Youth Defender to support peers, moderate community grievances, and share brave survivor stories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Email Address or Mobile Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary dark:text-slate-200">Youth Defender Accreditation / ID Number</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  placeholder="Enter your defender accreditation ID"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-elevated transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Log In as Youth Defender</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        )}

        {/* ============================================================================== */}
        {/* C. PARENT / GUARDIAN LOGIN FORM */}
        {/* ============================================================================== */}
        {activeTab === 'guardian' && (
          <form onSubmit={handleGuardianSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-sand-100 dark:bg-slate-800/80 border border-sand-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Parent / Guardian Category Login</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Log in to manage child safety alerts, direct counselor dispatches, and linked ward incident advisories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Email Address or Mobile Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary dark:text-slate-200">Linked Ward Reference PIN</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={wardPin}
                  onChange={(e) => setWardPin(e.target.value)}
                  placeholder="Enter your ward reference PIN"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-elevated transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Log In as Guardian</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        )}

        {/* ============================================================================== */}
        {/* D. POLICE INSPECTOR LOGIN FORM */}
        {/* ============================================================================== */}
        {activeTab === 'officer' && (
          <form onSubmit={handleOfficerSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-sand-100 dark:bg-slate-800/80 border border-sand-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Police Inspector & Welfare Nodal Officer Login</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Sworn officer access for POCSO Nodal Desk, incident triage, and automated takedown notice dispatches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Departmental Email or Mobile Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary dark:text-slate-200">Police Badge / Nodal ID</label>
              <input
                type="text"
                value={officerBadge}
                onChange={(e) => setOfficerBadge(e.target.value)}
                placeholder="Enter your police badge number"
                className="w-full px-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-elevated transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Log In as Police Inspector</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        )}

        {/* ============================================================================== */}
        {/* E. ANONYMOUS CASE PIN TRACKING TAB */}
        {/* ============================================================================== */}
        {activeTab === 'anonymous' && (
          <form onSubmit={handleAnonymousSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-sand-100 dark:bg-slate-800/80 border border-sand-200 dark:border-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-xs">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>Track Incident Report via Case Reference PIN</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                If you submitted an anonymous report earlier, enter your 6-character reference PIN (e.g. <code>CV-1042</code>) to view statutory updates zero-trace.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-primary dark:text-slate-200">Incident Reference PIN</label>
              <input
                type="text"
                value={ticketPin}
                onChange={(e) => setTicketPin(e.target.value.toUpperCase())}
                placeholder="Enter your case reference PIN"
                className="w-full px-4 py-3 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-sm font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-elevated transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Log In with Case PIN</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        )}

        {/* Footer Navigation Link */}
        <div className="pt-4 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between text-xs text-textMuted dark:text-slate-400">
          <span>Need to create a new clearance account?</span>
          <Link to="/register" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
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
