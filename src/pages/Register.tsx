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
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';

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
  const [errorMessage, setErrorMessage] = useState('');

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

  // Avatar switch on role change
  const handleRoleChange = (role: UserRole) => {
    setAccountType(role);
    setErrorMessage('');
    if (role === 'registered_youth') setSelectedAvatar('🎓');
    else if (role === 'parent_guardian') setSelectedAvatar('🛡️');
    else if (role === 'welfare_officer') setSelectedAvatar('⚖️');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password.trim()) {
      setErrorMessage('Please create a secure password.');
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
      navigate('/');
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
      navigate('/');
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
      navigate('/portal');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 pb-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-primary text-secondary flex items-center justify-center mx-auto shadow-warm-sm border border-sand-300">
          <Shield className="w-7 h-7 fill-secondary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Create Verified CyberVigil Profile
        </h1>
        <p className="text-xs sm:text-sm text-textMuted max-w-md mx-auto">
          Select your platform role and complete identity verification to unlock authenticated defense clearance.
        </p>
      </div>

      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-warm-card space-y-6">
        
        {/* Step 1: Role Selection Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-primary uppercase tracking-wider">
            1. Select Your Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Student Card */}
            <button
              type="button"
              onClick={() => handleRoleChange('registered_youth')}
              className={`p-3.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                accountType === 'registered_youth'
                  ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-warm-sm'
                  : 'bg-sand-50 border-sand-300 hover:border-sand-400 text-textDark'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">🎓</span>
                {accountType === 'registered_youth' && <BadgeCheck className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">Student Defender</span>
                <span className="text-[10px] text-textMuted block leading-tight mt-0.5">School / College youth defense & peer circles</span>
              </div>
              <div className="mt-2 pt-2 border-t border-sand-200/80">
                <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider bg-blue-100/80 px-1.5 py-0.5 rounded">
                  Shield Level 1
                </span>
              </div>
            </button>

            {/* Guardian Card */}
            <button
              type="button"
              onClick={() => handleRoleChange('parent_guardian')}
              className={`p-3.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between ${
                accountType === 'parent_guardian'
                  ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-500/20 shadow-warm-sm'
                  : 'bg-sand-50 border-sand-300 hover:border-sand-400 text-textDark'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">🛡️</span>
                {accountType === 'parent_guardian' && <BadgeCheck className="w-4 h-4 text-purple-600" />}
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">Parent / Guardian</span>
                <span className="text-[10px] text-textMuted block leading-tight mt-0.5">Family safety oversight & statutory advisory</span>
              </div>
              <div className="mt-2 pt-2 border-t border-sand-200/80">
                <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider bg-purple-100/80 px-1.5 py-0.5 rounded">
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
                  ? 'bg-amber-50/90 border-secondary ring-2 ring-secondary/30 shadow-warm-sm'
                  : 'bg-sand-50 border-sand-300 hover:border-sand-400 text-textDark'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">⚖️</span>
                {accountType === 'welfare_officer' && <BadgeCheck className="w-4 h-4 text-amber-700" />}
              </div>
              <div>
                <span className="text-xs font-bold text-primary block">Police Inspector</span>
                <span className="text-[10px] text-textMuted block leading-tight mt-0.5">POCSO nodal officer & cyber forensic intake</span>
              </div>
              <div className="mt-2 pt-2 border-t border-sand-200/80">
                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-1.5 py-0.5 rounded">
                  Level 3 Clearance
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
          <div className="p-4 sm:p-5 rounded-2xl bg-sand-100 border border-sand-300 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  2. Identity Verification & Clearance Check
                </span>
              </div>
              <span className="text-[10px] font-semibold text-textMuted bg-surface px-2 py-0.5 rounded-full border border-sand-300">
                Statutory Clearance Gate
              </span>
            </div>

            {/* A. STUDENT VERIFICATION */}
            {accountType === 'registered_youth' && (
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 sm:col-span-1">
                    <label className="block font-bold text-primary">Class / Academic Level</label>
                    <select
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 bg-surface text-xs text-primary font-bold focus:ring-2 focus:ring-secondary/40"
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
                    <label className="block font-bold text-primary">School / College Institution</label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-textMuted absolute left-3 top-3" />
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Kendriya Vidyalaya / Delhi Public School"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-sand-300 bg-surface text-xs text-primary font-medium focus:ring-2 focus:ring-secondary/40"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-1">
                    <label className="block font-bold text-primary">Student Roll / ID</label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 text-textMuted absolute left-3 top-3" />
                      <input
                        type="text"
                        value={studentRollId}
                        onChange={(e) => setStudentRollId(e.target.value)}
                        placeholder="e.g. DPS-2026-X88"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-sand-300 bg-surface text-xs font-mono text-primary font-bold focus:ring-2 focus:ring-secondary/40"
                        required
                      />
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-sand-200 cursor-pointer hover:bg-sand-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={studentPledge}
                    onChange={(e) => setStudentPledge(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-secondary"
                  />
                  <span className="text-[11px] text-textMuted leading-relaxed">
                    <strong className="text-primary block font-bold">Youth Defender Digital Safety Pledge</strong>
                    I verify my institutional enrollment and pledge to defend peers from cyberbullying, respect victim confidentiality, and uphold ethical digital conduct.
                  </span>
                </label>

                {/* Clearance Tag */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
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
                    <label className="block font-bold text-primary">Ward Case Reference PIN or Alias</label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 text-textMuted absolute left-3 top-3" />
                      <input
                        type="text"
                        value={wardPin}
                        onChange={(e) => setWardPin(e.target.value)}
                        placeholder="e.g. CV-1042 or Student-Arjun"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-sand-300 bg-surface text-xs font-mono text-primary font-bold focus:ring-2 focus:ring-secondary/40"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-primary">Relationship to Child</label>
                    <select
                      value={guardianRelation}
                      onChange={(e) => setGuardianRelation(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 bg-surface text-xs text-primary font-medium focus:ring-2 focus:ring-secondary/40"
                    >
                      <option value="Legal Guardian">Legal Guardian</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Caregiver">Authorized School Caregiver</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-sand-200 cursor-pointer hover:bg-sand-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={guardianDeclaration}
                    onChange={(e) => setGuardianDeclaration(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-secondary"
                  />
                  <span className="text-[11px] text-textMuted leading-relaxed">
                    <strong className="text-primary block font-bold">Statutory Guardian Declaration</strong>
                    I certify under statutory parental responsibility that I am the legal guardian for the specified ward, authorized to review child protection advisories.
                  </span>
                </label>

                {/* Clearance Tag */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px]">
                  <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
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
                    <label className="block font-bold text-primary">Departmental Gov Email</label>
                    <input
                      type="email"
                      value={govEmail}
                      onChange={(e) => setGovEmail(e.target.value)}
                      placeholder="officer@police.gov.in"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 bg-surface text-xs text-primary font-mono focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-primary">Police Badge / Nodal Service ID</label>
                    <input
                      type="text"
                      value={officerBadge}
                      onChange={(e) => setOfficerBadge(e.target.value)}
                      placeholder="CPU-4 or POL-8812"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 bg-surface text-xs text-primary font-mono font-bold focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-primary">Police Station / Nodal Unit Jurisdiction</label>
                    <input
                      type="text"
                      value={policeJurisdiction}
                      onChange={(e) => setPoliceJurisdiction(e.target.value)}
                      placeholder="POCSO Nodal Unit DL-04, Cyber Crime Cell"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 bg-surface text-xs text-primary font-medium focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-primary">2FA Verification Passkey / Token</label>
                    <input
                      type="text"
                      value={securityToken}
                      onChange={(e) => setSecurityToken(e.target.value)}
                      placeholder="POCSO-7749-SEC"
                      className="w-full px-3 py-2 rounded-xl border border-sand-300 bg-surface text-xs text-primary font-mono font-bold focus:ring-2 focus:ring-secondary/40"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-sand-200 cursor-pointer hover:bg-sand-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={statutoryOath}
                    onChange={(e) => setStatutoryOath(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-secondary"
                  />
                  <span className="text-[11px] text-textMuted leading-relaxed">
                    <strong className="text-primary block font-bold">POCSO / IT Act Statutory Officer Certification</strong>
                    I certify sworn authority under the POCSO Act 2012 and IT Act Section 67B to access sealed case evidence and issue emergency takedown notices.
                  </span>
                </label>

                {/* Clearance Tag */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-secondary text-amber-950 text-[11px]">
                  <CheckCircle className="w-4 h-4 text-secondary-dark flex-shrink-0" />
                  <span>
                    Verification unlocks: <strong>Level 3 Clearance (POCSO Statutory)</strong> with full access to the Officer Case Portal, Forensic Exports, and Platform Takedown Dispatches.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Account Credentials & Emblem */}
          <div className="space-y-4">
            <span className="block text-xs font-bold text-primary uppercase tracking-wider">
              3. Profile Identity & Access Key
            </span>

            {/* Avatar Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-primary">Choose Profile Emblem:</label>
              <div className="flex flex-wrap gap-2.5">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all active:scale-95 ${
                      selectedAvatar === av
                        ? 'bg-sand-200 border-secondary ring-2 ring-secondary scale-105 shadow-warm-sm'
                        : 'bg-sand-100 border-sand-200 hover:bg-sand-200 shadow-xs'
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
                <label htmlFor="alias" className="block text-xs font-bold text-primary">
                  {accountType === 'welfare_officer' ? 'Official Inspector Name / Designation' : 'Choose Your Secret Alias'}
                </label>
                <span className="text-[11px] text-textMuted">
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
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-secondary/40 text-sm font-bold text-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="reg-pass" className="block text-xs font-bold text-primary">
                Private Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
                <input
                  id="reg-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-sand-300 bg-sand-50 focus:bg-surface focus:ring-2 focus:ring-secondary/40 text-sm text-primary font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-surface font-bold text-sm shadow-warm-sm hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 group/btn"
          >
            <span>Verify Identity & Activate Clearance</span>
            <ArrowRight className="w-4 h-4 text-secondary group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/login" className="text-xs font-bold text-secondary-dark hover:underline">
            Already verified? Sign In to your dashboard here
          </Link>
        </div>
      </div>
    </div>
  );
};
