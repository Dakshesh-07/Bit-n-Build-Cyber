import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  User, 
  GraduationCap, 
  HeartHandshake, 
  BadgeCheck, 
  Building, 
  Hash, 
  KeyRound, 
  FileCheck,
  AlertCircle,
  EyeOff,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { sendDiscordNotification } from '../lib/discord';
import { EmailOTPModal } from '../components/auth/EmailOTPModal';

const AVATARS = ['🛡️', '🎓', '⚖️', '🦁', '🦉', '⚡', '🌟', '🐬', '🌲', '🚀'];

export const Register: React.FC = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  // Role Selection
  const [accountType, setAccountType] = useState<UserRole>('registered_youth');
  
  // Common Fields
  const [alias, setAlias] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState('student@cybervigil.org');
  const [errorMessage, setErrorMessage] = useState('');

  // Email OTP Modal state
  const [isOTPModalOpen, setIsOTPModalOpen] = useState<boolean>(false);
  const [pendingRegistrationCallback, setPendingRegistrationCallback] = useState<(() => void) | null>(null);

  // Student Verification Fields
  const [educationLevel, setEducationLevel] = useState('Class 10');
  const [schoolName, setSchoolName] = useState('Delhi Public School, R.K. Puram');
  const [studentRollId, setStudentRollId] = useState('DPS-2026-X88');
  const [studentPledge, setStudentPledge] = useState(true);

  // Guardian Verification Fields
  const [wardPin, setWardPin] = useState('CV-1042');
  const [guardianRelation, setGuardianRelation] = useState<'Mother' | 'Father' | 'Legal Guardian' | 'Caregiver'>('Legal Guardian');
  const [guardianDeclaration, setGuardianDeclaration] = useState(true);

  // Inspector Verification Fields
  const [govEmail, setGovEmail] = useState('officer@cybervigil.gov.in');
  const [officerBadge, setOfficerBadge] = useState('CPU-4');
  const [policeJurisdiction, setPoliceJurisdiction] = useState('POCSO Nodal Unit DL-04, Cyber Crime Cell');
  const [securityToken, setSecurityToken] = useState('POCSO-7749-SEC');
  const [statutoryOath, setStatutoryOath] = useState(true);

  // Admin Verification Fields
  const [adminBadge, setAdminBadge] = useState('ADMIN-01');
  const [adminDept, setAdminDept] = useState('CyberVigil Cyber Forensic Core');
  const [adminOath, setAdminOath] = useState(true);

  // Avatar switch on role change
  const handleRoleChange = (role: UserRole) => {
    setAccountType(role);
    setErrorMessage('');
    if (role === 'registered_youth') {
      setSelectedAvatar('🎓');
      if (userEmail === 'officer@cybervigil.gov.in' || userEmail === 'guardian@cybervigil.org' || userEmail === 'admin@cybervigil.org') {
        setUserEmail('student@cybervigil.org');
      }
    } else if (role === 'parent_guardian') {
      setSelectedAvatar('🛡️');
      if (userEmail === 'student@cybervigil.org' || userEmail === 'officer@cybervigil.gov.in' || userEmail === 'admin@cybervigil.org') {
        setUserEmail('guardian@cybervigil.org');
      }
    } else if (role === 'welfare_officer') {
      setSelectedAvatar('⚖️');
      setUserEmail(govEmail || 'officer@cybervigil.gov.in');
    } else if (role === 'admin') {
      setSelectedAvatar('⚡');
      setUserEmail('admin@cybervigil.org');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password.trim()) {
      setErrorMessage('Please create a secure password.');
      return;
    }

    const emailToVerify = accountType === 'welfare_officer' ? govEmail : userEmail;
    if (!emailToVerify.trim()) {
      setErrorMessage('Please enter a valid email address for security notification.');
      return;
    }

    if (accountType === 'registered_youth') {
      if (!studentRollId.trim() || !schoolName.trim()) {
        setErrorMessage('Please enter your School / College name and Student Roll Code.');
        return;
      }
      if (!studentPledge) {
        setErrorMessage('Please accept the Youth Defender Digital Safety Pledge to obtain clearance.');
        return;
      }
      const finalAlias = alias.trim() ? `${selectedAvatar} ${alias.trim()}` : `${selectedAvatar} StudentDefender_${studentRollId.slice(-4)}`;
      
      const proceedStudentRegistration = () => {
        registerUser(
          finalAlias, 
          'registered_youth', 
          'Shield Level 1 (Institutional Verified)', 
          studentRollId, 
          {
            isVerified: true,
            verificationId: studentRollId,
            verificationType: 'student_institutional_id',
            institutionOrJurisdiction: schoolName,
          }
        );
        
        sendDiscordNotification({
          title: 'New Student Defender Institutional Verification',
          description: `Student account activated for **${schoolName}** (${educationLevel}). Email OTP verified.`,
          color: 0x3B82F6,
          fields: [
            { name: 'Student Roll ID', value: studentRollId, inline: true },
            { name: 'Verified Email', value: emailToVerify, inline: true },
            { name: 'Camouflage Disguise', value: `Configured for ${educationLevel} (Panic Key: ESC)`, inline: false }
          ]
        });

        navigate('/');
      };

      setPendingRegistrationCallback(() => proceedStudentRegistration);
      setIsOTPModalOpen(true);

    } else if (accountType === 'parent_guardian') {
      if (!wardPin.trim()) {
        setErrorMessage('Please provide your Ward / Child Case PIN or Student ID link.');
        return;
      }
      if (!guardianDeclaration) {
        setErrorMessage('Please verify your statutory guardian declaration.');
        return;
      }
      const finalAlias = alias.trim() ? `${selectedAvatar} ${alias.trim()} (${guardianRelation})` : `${selectedAvatar} Guardian (${guardianRelation})`;
      
      const proceedGuardianRegistration = () => {
        registerUser(
          finalAlias, 
          'parent_guardian', 
          'Family Safe Mode (Verified)', 
          `Ward: ${wardPin}`, 
          {
            isVerified: true,
            verificationId: wardPin,
            verificationType: 'guardian_ward_link',
            institutionOrJurisdiction: `Direct Ward Link (#${wardPin})`,
          }
        );

        sendDiscordNotification({
          title: 'New Guardian Safety Clearance Activated',
          description: `Verified Guardian account created for Ward Case PIN **#${wardPin}**. Email OTP verified.`,
          color: 0x8B5CF6,
          fields: [
            { name: 'Relationship', value: guardianRelation, inline: true },
            { name: 'Verified Email', value: emailToVerify, inline: true }
          ]
        });

        navigate('/');
      };

      setPendingRegistrationCallback(() => proceedGuardianRegistration);
      setIsOTPModalOpen(true);

    } else if (accountType === 'welfare_officer') {
      if (!officerBadge.trim() || !govEmail.trim() || !policeJurisdiction.trim()) {
        setErrorMessage('Please enter your official Gov Email, Badge ID, and Station Jurisdiction.');
        return;
      }
      if (!statutoryOath) {
        setErrorMessage('Statutory POCSO / IT Act compliance certification is required for officer clearance.');
        return;
      }
      const finalAlias = alias.trim() ? `${selectedAvatar} ${alias.trim()}` : `${selectedAvatar} Inspector Sharma`;
      
      const proceedOfficerRegistration = () => {
        registerUser(
          finalAlias, 
          'welfare_officer', 
          'Level 3 Clearance (POCSO Statutory Verified)', 
          `#${officerBadge.replace('#', '')}`, 
          {
            isVerified: true,
            verificationId: `#${officerBadge.replace('#', '')}`,
            verificationType: 'inspector_pocso_nodal',
            institutionOrJurisdiction: policeJurisdiction,
          }
        );

        sendDiscordNotification({
          title: 'Police Officer POCSO Level 3 Clearance Activated',
          description: `Verified Officer **#${officerBadge.replace('#', '')}** logged into **${policeJurisdiction}**. Email OTP verified.`,
          color: 0xF59E0B,
          fields: [
            { name: 'Gov Email', value: govEmail, inline: true },
            { name: 'Jurisdiction', value: policeJurisdiction, inline: true }
          ]
        });

        navigate('/portal');
      };

      setPendingRegistrationCallback(() => proceedOfficerRegistration);
      setIsOTPModalOpen(true);

    } else if (accountType === 'admin') {
      if (!adminBadge.trim() || !userEmail.trim()) {
        setErrorMessage('Please enter your Admin Email and Master Admin Badge ID.');
        return;
      }
      if (!adminOath) {
        setErrorMessage('Master system administrator compliance verification is required.');
        return;
      }
      const finalAlias = alias.trim() ? `${selectedAvatar} ${alias.trim()}` : `${selectedAvatar} Admin Lead`;
      
      const proceedAdminRegistration = () => {
        registerUser(
          finalAlias, 
          'admin', 
          'Master Security Clearance', 
          `#${adminBadge.replace('#', '')}`, 
          {
            isVerified: true,
            verificationId: `#${adminBadge.replace('#', '')}`,
            verificationType: 'inspector_pocso_nodal',
            institutionOrJurisdiction: adminDept,
          }
        );

        sendDiscordNotification({
          title: 'System Administrator Master Clearance Activated',
          description: `Verified Administrator **#${adminBadge.replace('#', '')}** initialized. Email OTP verified.`,
          color: 0x10B981,
          fields: [
            { name: 'Admin Email', value: userEmail, inline: true },
            { name: 'Department', value: adminDept, inline: true }
          ]
        });

        navigate('/portal');
      };

      setPendingRegistrationCallback(() => proceedAdminRegistration);
      setIsOTPModalOpen(true);
    }
  };

  const handleOTPVerifySuccess = () => {
    setIsOTPModalOpen(false);
    if (pendingRegistrationCallback) {
      pendingRegistrationCallback();
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 pb-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-primary dark:bg-secondary text-secondary dark:text-primary flex items-center justify-center mx-auto shadow-warm-sm border border-sand-300 dark:border-sand-700">
          <Shield className="w-7 h-7 fill-secondary dark:fill-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-sand-50 tracking-tight">
          Create Verified CyberVigil Profile
        </h1>
        <p className="text-xs sm:text-sm text-textMuted dark:text-sand-400 max-w-md mx-auto">
          Select your platform role and complete identity verification to unlock authenticated defense clearance.
        </p>
      </div>

      <div className="bg-surface dark:bg-sand-900 rounded-2xl p-6 sm:p-8 border border-sand-300 dark:border-sand-800 shadow-warm-card space-y-6">
        
        {/* Step 1: Role Selection Cards - All 4 Roles */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-primary dark:text-sand-100 uppercase tracking-wider">
            1. Select Your Role / Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Student Card */}
            <button
              type="button"
              onClick={() => handleRoleChange('registered_youth')}
              className={`p-3.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                accountType === 'registered_youth'
                  ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-warm-sm'
                  : 'bg-sand-50 dark:bg-sand-800/60 border-sand-300 dark:border-sand-700 hover:border-sand-400 dark:hover:border-sand-600 text-textDark dark:text-sand-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">🎓</span>
                {accountType === 'registered_youth' && <BadgeCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-extrabold text-primary dark:text-sand-100 block">Student Category</span>
                </div>
                <span className="text-[10px] text-textMuted dark:text-sand-400 block leading-tight mt-0.5">School & College Youth Protection</span>
              </div>
              <div className="mt-2 pt-2 border-t border-sand-200/80 dark:border-sand-700/80 flex items-center justify-between gap-1 flex-wrap">
                <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider bg-blue-100/80 dark:bg-blue-900/80 px-1.5 py-0.5 rounded">
                  Shield Level 1
                </span>
                <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  🔒 100% Anonymous
                </span>
              </div>
            </button>

            {/* Guardian Card */}
            <button
              type="button"
              onClick={() => handleRoleChange('parent_guardian')}
              className={`p-3.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                accountType === 'parent_guardian'
                  ? 'bg-purple-50/90 dark:bg-purple-950/60 border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/20 shadow-warm-sm'
                  : 'bg-sand-50 dark:bg-sand-800/60 border-sand-300 dark:border-sand-700 hover:border-sand-400 dark:hover:border-sand-600 text-textDark dark:text-sand-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">🛡️</span>
                {accountType === 'parent_guardian' && <BadgeCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
              </div>
              <div>
                <span className="text-xs font-bold text-primary dark:text-sand-100 block">Parent / Guardian</span>
                <span className="text-[10px] text-textMuted dark:text-sand-400 block leading-tight mt-0.5">Family safety oversight & advisory</span>
              </div>
              <div className="mt-2 pt-2 border-t border-sand-200/80 dark:border-sand-700/80">
                <span className="text-[9px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider bg-purple-100/80 dark:bg-purple-900/80 px-1.5 py-0.5 rounded">
                  Family Safe Mode
                </span>
              </div>
            </button>

            {/* Police / Inspector Card */}
            <button
              type="button"
              onClick={() => handleRoleChange('welfare_officer')}
              className={`p-3.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                accountType === 'welfare_officer'
                  ? 'bg-amber-50/90 dark:bg-amber-950/60 border-secondary dark:border-amber-400 ring-2 ring-secondary/30 shadow-warm-sm'
                  : 'bg-sand-50 dark:bg-sand-800/60 border-sand-300 dark:border-sand-700 hover:border-sand-400 dark:hover:border-sand-600 text-textDark dark:text-sand-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">⚖️</span>
                {accountType === 'welfare_officer' && <BadgeCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />}
              </div>
              <div>
                <span className="text-xs font-bold text-primary dark:text-sand-100 block">Police Inspector</span>
                <span className="text-[10px] text-textMuted dark:text-sand-400 block leading-tight mt-0.5">POCSO nodal officer & cyber intake</span>
              </div>
              <div className="mt-2 pt-2 border-t border-sand-200/80 dark:border-sand-700/80">
                <span className="text-[9px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider bg-amber-100 dark:bg-amber-900/80 px-1.5 py-0.5 rounded">
                  Level 3 Clearance
                </span>
              </div>
            </button>

            {/* Admin Card */}
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`p-3.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                accountType === 'admin'
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20 shadow-warm-sm'
                  : 'bg-sand-50 dark:bg-sand-800/60 border-sand-300 dark:border-sand-700 hover:border-sand-400 dark:hover:border-sand-600 text-textDark dark:text-sand-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">⚡</span>
                {accountType === 'admin' && <BadgeCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div>
                <span className="text-xs font-bold text-primary dark:text-sand-100 block">Administrator</span>
                <span className="text-[10px] text-textMuted dark:text-sand-400 block leading-tight mt-0.5">Core system admin & forensic lead</span>
              </div>
              <div className="mt-2 pt-2 border-t border-sand-200/80 dark:border-sand-700/80">
                <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/80 px-1.5 py-0.5 rounded">
                  Master Clearance
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-errorContainer text-errorRed text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* Step 2: Role-Specific Identity Verification Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sand-100 dark:bg-sand-900/90 border border-sand-300 dark:border-sand-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sand-200 dark:border-sand-800">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold text-primary dark:text-sand-100 uppercase tracking-wider">
                  2. Identity Verification & Clearance Check
                </span>
              </div>
              <span className="text-[10px] font-semibold text-textMuted dark:text-sand-400 bg-surface dark:bg-sand-800 px-2 py-0.5 rounded-full border border-sand-300 dark:border-sand-700">
                Statutory Clearance Gate
              </span>
            </div>

            {/* A. STUDENT VERIFICATION */}
            {accountType === 'registered_youth' && (
              <div className="space-y-3.5 text-xs">
                {/* 100% Anonymous Identity Guarantee Banner */}
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border-2 border-blue-400 dark:border-blue-700 text-blue-950 dark:text-blue-100 text-xs space-y-1 shadow-xs">
                  <div className="flex items-center gap-2 font-extrabold text-blue-900 dark:text-blue-200">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 fill-blue-600 dark:fill-blue-400" />
                    <span>🔒 100% Anonymous Student Identity Protection Guarantee</span>
                  </div>
                  <p className="text-[11px] text-blue-900/90 dark:text-blue-300 leading-relaxed">
                    Your real name, phone number, and personal identity are <strong>NEVER disclosed, published, or stored on public reports</strong>. Your student roll ID is used strictly for institutional clearance. You will navigate CyberVigil under a <strong>secret custom alias</strong> with full zero-trace protection.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 sm:col-span-1">
                    <label className="block font-bold text-primary dark:text-sand-200">Class / Academic Level</label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-bold focus:ring-2 focus:ring-secondary/40"
                    >
                      <option value="Class 4">Class 4</option>
                      <option value="Class 5">Class 5</option>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="College / University">College / University</option>
                      <option value="Post-Graduate">Post-Graduate / Higher Studies</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="block font-bold text-primary dark:text-sand-200">School / College Institution</label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Kendriya Vidyalaya / Delhi Public School"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="block font-bold text-primary dark:text-sand-200">Student Roll / ID</label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={studentRollId}
                        onChange={(e) => setStudentRollId(e.target.value)}
                        placeholder="e.g. DPS-2026-X88"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono text-primary dark:text-sand-100 font-bold focus:ring-2 focus:ring-secondary/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Camouflage Customization Guidance Note */}
                <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 text-xs space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                    <EyeOff className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0" />
                    <span>💡 Panic Camouflage Mode Customization Note</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 dark:text-amber-300 leading-relaxed">
                    Selecting your <strong>Class / Academic Level ({educationLevel})</strong> automatically customizes your <strong>Panic Camouflage Disguise Overlay</strong> (e.g. Class 4 Math, Class 10 Physics, College Lecture Notes). If you are ever in panic or need to hide this site instantly from anyone nearby, press <kbd className="px-1.5 py-0.5 rounded bg-amber-200/90 dark:bg-amber-900 font-mono text-[10px] font-bold text-amber-950 dark:text-amber-100">ESC</kbd> (or tap the Quick Exit Panic Switch) to access your customized harmless study disguise in a single click!
                  </p>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface dark:bg-sand-800 border border-sand-200 dark:border-sand-700 cursor-pointer hover:bg-sand-50 dark:hover:bg-sand-700/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={studentPledge}
                    onChange={(e) => setStudentPledge(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-secondary"
                  />
                  <span className="text-[11px] text-textMuted dark:text-sand-300 leading-relaxed">
                    <strong className="text-primary dark:text-sand-100 block font-bold">Youth Defender Digital Safety Pledge</strong>
                    I verify my institutional enrollment and pledge to defend peers from cyberbullying, respect victim confidentiality, and uphold ethical digital conduct.
                  </span>
                </label>

                {/* Clearance Tag */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-[11px]">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>
                    Verification unlocks: <strong>Shield Level 1 Clearance</strong> (Anonymous Story Sharing, Doubt Upvoting, Verified Defender Badge).
                  </span>
                </div>
              </div>
            )}

            {/* B. GUARDIAN VERIFICATION */}
            {accountType === 'parent_guardian' && (
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-primary dark:text-sand-200">Ward Case Reference PIN or Alias</label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={wardPin}
                        onChange={(e) => setWardPin(e.target.value)}
                        placeholder="e.g. CV-1042 or Student-Arjun"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono text-primary dark:text-sand-100 font-bold focus:ring-2 focus:ring-secondary/40"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-primary dark:text-sand-200">Relationship to Child</label>
                    <select
                      value={guardianRelation}
                      onChange={(e) => setGuardianRelation(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    >
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Caregiver">Authorized School Caregiver</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface dark:bg-sand-800 border border-sand-200 dark:border-sand-700 cursor-pointer hover:bg-sand-50 dark:hover:bg-sand-700/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={guardianDeclaration}
                    onChange={(e) => setGuardianDeclaration(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-secondary"
                  />
                  <span className="text-[11px] text-textMuted dark:text-sand-300 leading-relaxed">
                    <strong className="text-primary dark:text-sand-100 block font-bold">Statutory Guardian Declaration</strong>
                    I certify under statutory parental responsibility that I am the legal guardian for the specified ward, authorized to review child protection advisories.
                  </span>
                </label>

                {/* Clearance Tag */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-[11px]">
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span>
                    Verification unlocks: <strong>Family Safe Mode Clearance</strong> (Direct Counselor Dispatch, Family Incident Alerts).
                  </span>
                </div>
              </div>
            )}

            {/* C. POLICE INSPECTOR VERIFICATION */}
            {accountType === 'welfare_officer' && (
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-primary dark:text-sand-200">Departmental Gov Email</label>
                    <input
                      type="email"
                      value={govEmail}
                      onChange={(e) => setGovEmail(e.target.value)}
                      placeholder="officer@police.gov.in"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-mono focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-primary dark:text-sand-200">Police Badge / Nodal Service ID</label>
                    <input
                      type="text"
                      value={officerBadge}
                      onChange={(e) => setOfficerBadge(e.target.value)}
                      placeholder="CPU-4 or POL-8812"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-mono font-bold focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-primary dark:text-sand-200">Police Station / Nodal Unit Jurisdiction</label>
                    <input
                      type="text"
                      value={policeJurisdiction}
                      onChange={(e) => setPoliceJurisdiction(e.target.value)}
                      placeholder="POCSO Nodal Unit DL-04, Cyber Crime Cell"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-primary dark:text-sand-200">2FA Verification Passkey / Token</label>
                    <input
                      type="text"
                      value={securityToken}
                      onChange={(e) => setSecurityToken(e.target.value)}
                      placeholder="POCSO-7749-SEC"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-mono font-bold focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface dark:bg-sand-800 border border-sand-200 dark:border-sand-700 cursor-pointer hover:bg-sand-50 dark:hover:bg-sand-700/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={statutoryOath}
                    onChange={(e) => setStatutoryOath(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-secondary"
                  />
                  <span className="text-[11px] text-textMuted dark:text-sand-300 leading-relaxed">
                    <strong className="text-primary dark:text-sand-100 block font-bold">POCSO / IT Act Statutory Officer Certification</strong>
                    I certify sworn authority under the POCSO Act 2012 and IT Act Section 67B to access sealed case evidence and issue emergency takedown notices.
                  </span>
                </label>

                {/* Clearance Tag */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 text-[11px]">
                  <CheckCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0" />
                  <span>
                    Verification unlocks: <strong>Level 3 Clearance (POCSO Statutory)</strong> with full access to the Officer Case Portal, Forensic Exports, and Platform Takedown Dispatches.
                  </span>
                </div>
              </div>
            )}

            {/* D. SYSTEM ADMINISTRATOR VERIFICATION */}
            {accountType === 'admin' && (
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-primary dark:text-sand-200">Administrator Departmental Email</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="admin@cybervigil.org"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-mono focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-primary dark:text-sand-200">Master Admin Badge ID</label>
                    <input
                      type="text"
                      value={adminBadge}
                      onChange={(e) => setAdminBadge(e.target.value)}
                      placeholder="ADMIN-01"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-mono font-bold focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-primary dark:text-sand-200">Department / Unit</label>
                  <input
                    type="text"
                    value={adminDept}
                    onChange={(e) => setAdminDept(e.target.value)}
                    placeholder="CyberVigil Cyber Forensic Core"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface dark:bg-sand-800 border border-sand-200 dark:border-sand-700 cursor-pointer hover:bg-sand-50 dark:hover:bg-sand-700/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={adminOath}
                    onChange={(e) => setAdminOath(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-secondary"
                  />
                  <span className="text-[11px] text-textMuted dark:text-sand-300 leading-relaxed">
                    <strong className="text-primary dark:text-sand-100 block font-bold">System Administrator Master Certification</strong>
                    I certify authorized administrative authority for system forensic analysis, API management, and global platform security oversight.
                  </span>
                </label>

                {/* Clearance Tag */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-[11px]">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>
                    Verification unlocks: <strong>Master Security Clearance</strong> with full access to Platform Settings, Gemini API configuration, and global logs.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Account Credentials & Emblem */}
          <div className="space-y-4">
            <span className="block text-xs font-bold text-primary dark:text-sand-100 uppercase tracking-wider">
              3. Profile Identity & Access Key
            </span>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-primary dark:text-sand-200">Choose Profile Emblem:</label>
              <div className="flex flex-wrap gap-2.5">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all active:scale-95 ${
                      selectedAvatar === av
                        ? 'bg-sand-200 dark:bg-sand-700 border-secondary ring-2 ring-secondary scale-105 shadow-warm-sm'
                        : 'bg-sand-100 dark:bg-sand-800 border-sand-200 dark:border-sand-700 hover:bg-sand-200 dark:hover:bg-sand-700 shadow-xs'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Alias */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="alias" className="block text-xs font-bold text-primary dark:text-sand-200">
                  {accountType === 'welfare_officer' ? 'Official Inspector Name / Designation' : 'Choose Your Secret Alias (100% Anonymous)'}
                </label>
                <span className="text-[11px] text-textMuted dark:text-sand-400">
                  {accountType === 'welfare_officer' ? 'Official Name' : 'No real names required'}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-lg">{selectedAvatar}</span>
                <input
                  id="alias"
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder={
                    accountType === 'registered_youth' 
                      ? 'Arjun_Defender, NovaShield...' 
                      : accountType === 'parent_guardian' 
                        ? 'Sunita M., Guardian_Safe...' 
                        : 'Inspector Sharma, Cyber Cell'
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-sand-800 focus:bg-surface dark:focus:bg-sand-800 focus:ring-2 focus:ring-secondary/40 text-sm font-bold text-primary dark:text-sand-100"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-pass" className="block text-xs font-bold text-primary dark:text-sand-200">
                Private Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3.5 top-3.5" />
                <input
                  id="reg-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 dark:border-sand-700 bg-sand-50 dark:bg-sand-800 focus:bg-surface dark:focus:bg-sand-800 focus:ring-2 focus:ring-secondary/40 text-sm text-primary dark:text-sand-100 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary dark:bg-secondary hover:bg-primary-hover dark:hover:bg-secondary-dark text-surface dark:text-primary font-bold text-sm shadow-warm-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 group/btn"
          >
            <span>Verify Identity & Activate Clearance</span>
            <ArrowRight className="w-4 h-4 text-secondary dark:text-primary group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs font-bold text-secondary-dark dark:text-secondary hover:underline">
            Already verified? Sign In to your dashboard here
          </Link>
        </div>
      </div>

      <EmailOTPModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerifySuccess={handleOTPVerifySuccess}
        email={accountType === 'welfare_officer' ? govEmail : userEmail}
        userRole={accountType === 'registered_youth' ? 'Student Category' : accountType === 'parent_guardian' ? 'Parent / Guardian' : 'Police Inspector'}
      />
    </div>
  );
};
