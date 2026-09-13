import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertTriangle,
  Hash,
  Building,
  KeyRound,
  ShieldCheck,
  FileText,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { EmailOTPModal } from '../components/auth/EmailOTPModal';

export const Register: React.FC = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  // Role: student, defender, guardian, officer
  const [selectedRole, setSelectedRole] = useState<'student' | 'defender' | 'guardian' | 'officer'>('student');

  // Form Fields
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Role-Specific Identity Verification Fields
  const [studentRoll, setStudentRoll] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const [defenderCode, setDefenderCode] = useState('');
  const [clubName, setClubName] = useState('');

  const [wardPin, setWardPin] = useState('');
  const [childSchool, setChildSchool] = useState('');

  const [officerBadge, setOfficerBadge] = useState('');
  const [departmentUnit, setDepartmentUnit] = useState('');

  // Official Identity Proof
  const [identityProof, setIdentityProof] = useState('');
  const [identityProofType, setIdentityProofType] = useState('School / College Photo ID Card');
  const [identityProofFileName, setIdentityProofFileName] = useState('');

  // UI / Error / OTP Modal state
  const [errorMessage, setErrorMessage] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleRoleChange = (role: 'student' | 'defender' | 'guardian' | 'officer') => {
    setSelectedRole(role);
    setErrorMessage('');
    setIdentityProof('');
    setIdentityProofFileName('');
    if (role === 'officer') setIdentityProofType('Police Service ID Card');
    else if (role === 'guardian') setIdentityProofType('Aadhaar Card / Govt Photo ID');
    else if (role === 'defender') setIdentityProofType('Student Defender Accreditation ID');
    else setIdentityProofType('School / College Photo ID Card');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!alias.trim()) {
      setErrorMessage('Please enter a display name / alias.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a secure password.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (selectedRole === 'student' && !studentRoll.trim()) {
      setErrorMessage('Please enter your Student Roll Number or Institutional ID.');
      return;
    }
    if (selectedRole === 'defender' && !defenderCode.trim()) {
      setErrorMessage('Please enter your Youth Defender Accreditation Code.');
      return;
    }
    if (selectedRole === 'guardian' && !wardPin.trim()) {
      setErrorMessage('Please enter your Ward Reference PIN.');
      return;
    }
    if (selectedRole === 'officer' && (!officerBadge.trim() || !departmentUnit.trim())) {
      setErrorMessage('Please enter your Police Badge Number and Departmental Unit.');
      return;
    }

    // Strict Identity Proof Validation to prevent random unauthorized registrations
    if (!identityProof.trim()) {
      if (selectedRole === 'officer') {
        setErrorMessage('Official police departmental identity proof is required to prevent unauthorized officer registration.');
      } else if (selectedRole === 'guardian') {
        setErrorMessage('Government identity proof is required to prevent unauthorized parent / guardian registration.');
      } else if (selectedRole === 'defender') {
        setErrorMessage('Student defender identity proof is required to prevent unauthorized defender registration.');
      } else {
        setErrorMessage('Institutional student identity proof is required to prevent unauthorized student registration.');
      }
      return;
    }

    if (identityProof.trim().length < 4) {
      setErrorMessage('Please enter a valid identity proof document number (at least 4 characters).');
      return;
    }

    const isTestId = (identifier: string): boolean => {
      const normalized = (identifier || '').toLowerCase().trim();
      return (
        normalized === 'student@cybervigil.org' ||
        normalized === 'defender@cybervigil.org' ||
        normalized === 'parent@cybervigil.org' ||
        normalized === 'officer@cybervigil.gov.in' ||
        normalized === 'admin@cybervigil.org' ||
        normalized.endsWith('@cybervigil.org') ||
        normalized.endsWith('@cybervigil.gov.in')
      );
    };

    // For test IDs: complete registration directly with zero OTP step
    if (isTestId(email)) {
      handleOTPVerified();
    } else {
      // For real email or mobile number: trigger OTP verification modal
      setShowOTPModal(true);
    }
  };

  const handleOTPVerified = () => {
    setShowOTPModal(false);

    let roleType: UserRole = 'registered_youth';
    let clearance = 'Shield Level 1 (Institutional Verified)';
    let badgeId = studentRoll || 'STU-VERIFIED';
    let institution = schoolName || 'Verified School';

    if (selectedRole === 'student') {
      roleType = 'registered_youth';
      clearance = 'Shield Level 1 (Student Institutional Verified)';
      badgeId = studentRoll || 'STU-VERIFIED';
      institution = schoolName || 'Verified Educational Institution';
    } else if (selectedRole === 'defender') {
      roleType = 'registered_youth';
      clearance = 'Shield Level 1 (Youth Peer Defender Verified)';
      badgeId = defenderCode || 'DEF-VERIFIED';
      institution = clubName || 'Youth Defense League';
    } else if (selectedRole === 'guardian') {
      roleType = 'parent_guardian';
      clearance = 'Family Safe Mode (Verified)';
      badgeId = `Ward PIN: ${wardPin || 'CV-1042'}`;
      institution = childSchool || `Ward Link #${wardPin || 'CV-1042'}`;
    } else if (selectedRole === 'officer') {
      roleType = 'welfare_officer';
      clearance = 'Level 3 Clearance (POCSO Statutory Verified)';
      badgeId = `Badge #${officerBadge}`;
      institution = departmentUnit || 'POCSO Nodal Unit';
    }

    registerUser(alias.trim(), roleType, clearance, badgeId, {
      isVerified: true,
      verificationId: badgeId,
      verificationType: selectedRole === 'officer' ? 'inspector_pocso_nodal' : selectedRole === 'guardian' ? 'guardian_ward_link' : 'student_institutional_id',
      institutionOrJurisdiction: institution,
      identityProofNumber: identityProof.trim(),
      identityProofType
    });

    if (selectedRole === 'officer') {
      navigate('/portal');
    } else {
      navigate('/');
    }
  };

  const getRoleTitle = () => {
    if (selectedRole === 'student') return 'Student Category';
    if (selectedRole === 'defender') return 'Youth Defender';
    if (selectedRole === 'guardian') return 'Parent / Guardian';
    if (selectedRole === 'officer') return 'Police Inspector';
    return 'User';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-2 pt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-slate-100">
          Register for CyberVigil Platform
        </h1>
        <p className="text-xs sm:text-sm text-textMuted dark:text-slate-300 max-w-lg mx-auto">
          Select your statutory category below to create your secure clearance account with 2FA email verification.
        </p>
      </div>

      {/* Main Registration Box */}
      <div className="bg-surface dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-sand-300 dark:border-slate-800 shadow-warm-card space-y-6">
        
        {/* Category Selection Tabs (matching Login.tsx) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-primary dark:text-slate-200 uppercase tracking-wider">
            1. Select Registration Category
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                  : 'bg-sand-50 dark:bg-slate-800 border-sand-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              Student
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('defender')}
              className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'defender'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                  : 'bg-sand-50 dark:bg-slate-800 border-sand-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              Defender
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('guardian')}
              className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'guardian'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                  : 'bg-sand-50 dark:bg-slate-800 border-sand-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              Parent
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('officer')}
              className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                selectedRole === 'officer'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-sm'
                  : 'bg-sand-50 dark:bg-slate-800 border-sand-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500'
              }`}
            >
              Inspector
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

        {/* Category Info Banner (matching Login.tsx) */}
        <div className="p-4 rounded-2xl bg-sand-100 dark:bg-slate-800/80 border border-sand-200 dark:border-slate-700 space-y-1.5">
          <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>
              {selectedRole === 'student' && 'Student Category Registration'}
              {selectedRole === 'defender' && 'Youth Defender Category Registration'}
              {selectedRole === 'guardian' && 'Parent / Guardian Category Registration'}
              {selectedRole === 'officer' && 'Police Inspector & Welfare Officer Registration'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {selectedRole === 'student' && 'Register to access confidential student incident reporting, doubt upvoting, and verified community support.'}
            {selectedRole === 'defender' && 'Register as a certified Youth Defender to support peers, moderate community grievances, and share brave survivor stories.'}
            {selectedRole === 'guardian' && 'Register to link your ward school PIN, monitor safety alerts, and access direct counselor advisories.'}
            {selectedRole === 'officer' && 'Register with your departmental police badge and unit for POCSO statutory desk and case action dispatches.'}
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-5">
          
          <div className="space-y-4">
            <label className="block text-xs font-bold text-primary dark:text-slate-200 uppercase tracking-wider">
              2. Account Credentials
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Public Alias / Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>

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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-slate-200">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Enter your password again"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Specific Fields */}
          <div className="space-y-4 pt-2 border-t border-sand-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-primary dark:text-slate-200 uppercase tracking-wider">
                3. Category Identity Verification & Proof ({getRoleTitle()})
              </label>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-800">
                Official Proof Required
              </span>
            </div>

            {selectedRole === 'student' && (
              <div className="space-y-4 bg-sand-100 dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-sand-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">Student Roll / ID Number</label>
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
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">School / Educational Institute</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Enter your school name"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-sand-200 dark:border-slate-700/80">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Identity Document Type
                    </label>
                    <select
                      value={identityProofType}
                      onChange={(e) => setIdentityProofType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-medium text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                    >
                      <option value="School / College Photo ID Card">School / College Photo ID Card</option>
                      <option value="Institutional Enrollment Card">Institutional Enrollment Card</option>
                      <option value="Student Campus Digital Card">Student Campus Digital Card</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Student Identity Proof Number <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={identityProof}
                        onChange={(e) => setIdentityProof(e.target.value)}
                        placeholder="Enter your student identity proof number"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Proof Attachment & Anti-Impersonation Safeguard */}
                <div className="p-3 rounded-xl bg-sand-50 dark:bg-slate-900/60 border border-sand-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Statutory identity proof verification prevents unauthorized accounts.</span>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-amber-400 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-500" />
                    <span>{identityProofFileName || 'Attach ID Document Copy'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setIdentityProofFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {selectedRole === 'defender' && (
              <div className="space-y-4 bg-sand-100 dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-sand-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">Defender Accreditation Code</label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={defenderCode}
                        onChange={(e) => setDefenderCode(e.target.value)}
                        placeholder="Enter your defender code"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">Youth Defense Club / Org</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        placeholder="Enter your organization name"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-sand-200 dark:border-slate-700/80">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Identity Document Type
                    </label>
                    <select
                      value={identityProofType}
                      onChange={(e) => setIdentityProofType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-medium text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                    >
                      <option value="Student Defender Accreditation ID">Student Defender Accreditation ID</option>
                      <option value="Institutional Peer Defense Card">Institutional Peer Defense Card</option>
                      <option value="Youth Defense League Photo ID">Youth Defense League Photo ID</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Student Defender Identity Proof Number <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={identityProof}
                        onChange={(e) => setIdentityProof(e.target.value)}
                        placeholder="Enter your student defender identity proof number"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Proof Attachment & Anti-Impersonation Safeguard */}
                <div className="p-3 rounded-xl bg-sand-50 dark:bg-slate-900/60 border border-sand-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Mandatory defender identity proof prevents unauthorized peer moderation access.</span>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-amber-400 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-500" />
                    <span>{identityProofFileName || 'Attach Defender ID Copy'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setIdentityProofFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {selectedRole === 'guardian' && (
              <div className="space-y-4 bg-sand-100 dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-sand-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">Ward Reference PIN</label>
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
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">Ward's School / Institution</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={childSchool}
                        onChange={(e) => setChildSchool(e.target.value)}
                        placeholder="Enter your child's school name"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-sand-200 dark:border-slate-700/80">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Identity Document Type
                    </label>
                    <select
                      value={identityProofType}
                      onChange={(e) => setIdentityProofType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-medium text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                    >
                      <option value="Aadhaar Card / Govt Photo ID">Aadhaar Card / Govt Photo ID</option>
                      <option value="Voter Identity Card">Voter Identity Card</option>
                      <option value="Passport ID Document">Passport ID Document</option>
                      <option value="Government Driving License">Government Driving License</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Guardian Identity Proof Number <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={identityProof}
                        onChange={(e) => setIdentityProof(e.target.value)}
                        placeholder="Enter your government identity proof number"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Proof Attachment & Anti-Impersonation Safeguard */}
                <div className="p-3 rounded-xl bg-sand-50 dark:bg-slate-900/60 border border-sand-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Guardian identity verification ensures protected, authorized ward supervision.</span>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-amber-400 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-500" />
                    <span>{identityProofFileName || 'Attach Govt ID Copy'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setIdentityProofFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {selectedRole === 'officer' && (
              <div className="space-y-4 bg-sand-100 dark:bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-sand-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">Police Badge / Nodal ID</label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={officerBadge}
                        onChange={(e) => setOfficerBadge(e.target.value)}
                        placeholder="Enter your police badge number"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">Department / Cyber Unit</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={departmentUnit}
                        onChange={(e) => setDepartmentUnit(e.target.value)}
                        placeholder="Enter your department name"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-sand-200 dark:border-slate-700/80">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Identity Document Type
                    </label>
                    <select
                      value={identityProofType}
                      onChange={(e) => setIdentityProofType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-medium text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                    >
                      <option value="Police Service ID Card">Police Service ID Card</option>
                      <option value="POCSO Statutory Nodal Desk Card">POCSO Statutory Nodal Desk Card</option>
                      <option value="Ministry of Home Affairs / Gov ID">Ministry of Home Affairs / Gov ID</option>
                      <option value="Cyber Crime Department Employee ID">Cyber Crime Department Employee ID</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Official Police Identity Proof Number <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-textMuted dark:text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={identityProof}
                        onChange={(e) => setIdentityProof(e.target.value)}
                        placeholder="Enter your police identity proof number"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-mono font-bold text-primary dark:text-slate-100 focus:ring-2 focus:ring-amber-500/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Proof Attachment & Anti-Impersonation Safeguard */}
                <div className="p-3 rounded-xl bg-sand-50 dark:bg-slate-900/60 border border-sand-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Restricted law enforcement access: Official departmental identity proof is mandatory.</span>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-amber-400 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-amber-500" />
                    <span>{identityProofFileName || 'Attach Official Police ID Copy'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setIdentityProofFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-warm-elevated transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Register Account</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </form>

        {/* Footer Navigation Link */}
        <div className="pt-4 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between text-xs text-textMuted dark:text-slate-400">
          <span>Already have a clearance account?</span>
          <Link to="/login" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
            Log In Instead →
          </Link>
        </div>

      </div>

      {/* EMAIL OTP MODAL VERIFICATION FOR REGISTRATION */}
      <EmailOTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerifySuccess={handleOTPVerified}
        email={email}
        userRole={getRoleTitle()}
      />
    </div>
  );
};
