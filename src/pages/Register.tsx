import React, { useState } from 'react';
import { 
  Shield, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertTriangle,
  GraduationCap,
  HeartHandshake,
  Building,
  CheckCircle2,
  Sparkles,
  Check,
  Hash
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

  // UI / Error / OTP Modal state
  const [errorMessage, setErrorMessage] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleRoleChange = (role: 'student' | 'defender' | 'guardian' | 'officer') => {
    setSelectedRole(role);
    setErrorMessage('');
    
    // Auto fill sensible alias defaults if empty
    if (!alias) {
      if (role === 'student') setAlias('Student_Defender_99');
      else if (role === 'defender') setAlias('Youth_Defender_Alpha');
      else if (role === 'guardian') setAlias('Guardian_Parent_User');
      else if (role === 'officer') setAlias('Inspector_Nodal');
    }
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

    // Trigger Email OTP Verification Modal
    setShowOTPModal(true);
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
      institutionOrJurisdiction: institution
    });

    if (selectedRole === 'officer') {
      navigate('/officer-portal');
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
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-200 dark:bg-sand-800 text-primary dark:text-sand-100 text-xs font-bold shadow-warm-sm">
          <Shield className="w-4 h-4 text-secondary" />
          <span>Statutory 2FA Email Verified Clearance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary dark:text-sand-100">
          Create CyberVigil Clearance Account
        </h1>
        <p className="text-xs sm:text-sm text-textMuted dark:text-sand-300 max-w-lg mx-auto">
          Choose your account category below to receive an email OTP code and activate your digital protection profile.
        </p>
      </div>

      {/* Main Registration Box */}
      <div className="bg-surface dark:bg-sand-900 rounded-3xl p-6 sm:p-8 border border-sand-300 dark:border-sand-800 shadow-warm-card space-y-6">
        
        {/* Role Cards: Student, Defender, Parent, Inspector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-primary dark:text-sand-100 uppercase tracking-wider">
            1. Select Account Category
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Student */}
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                selectedRole === 'student'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-blue-100 shadow-sm'
                  : 'bg-sand-50 dark:bg-sand-800 border-sand-300 dark:border-sand-700 text-textDark dark:text-sand-200 hover:border-sand-400'
              }`}
            >
              {selectedRole === 'student' && (
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute top-3 right-3" />
              )}
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/80 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-base mb-2">
                🎓
              </div>
              <div>
                <h3 className="font-extrabold text-xs">Student Category</h3>
                <p className="text-[10px] text-textMuted dark:text-sand-400 mt-0.5">School / College student</p>
              </div>
            </button>

            {/* Defender */}
            <button
              type="button"
              onClick={() => handleRoleChange('defender')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                selectedRole === 'defender'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-100 shadow-sm'
                  : 'bg-sand-50 dark:bg-sand-800 border-sand-300 dark:border-sand-700 text-textDark dark:text-sand-200 hover:border-sand-400'
              }`}
            >
              {selectedRole === 'defender' && (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute top-3 right-3" />
              )}
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-base mb-2">
                🛡️
              </div>
              <div>
                <h3 className="font-extrabold text-xs">Youth Defender</h3>
                <p className="text-[10px] text-textMuted dark:text-sand-400 mt-0.5">Peer safety defender</p>
              </div>
            </button>

            {/* Parent */}
            <button
              type="button"
              onClick={() => handleRoleChange('guardian')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                selectedRole === 'guardian'
                  ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 text-purple-900 dark:text-purple-100 shadow-sm'
                  : 'bg-sand-50 dark:bg-sand-800 border-sand-300 dark:border-sand-700 text-textDark dark:text-sand-200 hover:border-sand-400'
              }`}
            >
              {selectedRole === 'guardian' && (
                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 absolute top-3 right-3" />
              )}
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/80 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-base mb-2">
                👪
              </div>
              <div>
                <h3 className="font-extrabold text-xs">Parent / Guardian</h3>
                <p className="text-[10px] text-textMuted dark:text-sand-400 mt-0.5">Ward safety link</p>
              </div>
            </button>

            {/* Inspector */}
            <button
              type="button"
              onClick={() => handleRoleChange('officer')}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                selectedRole === 'officer'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-600 text-amber-900 dark:text-amber-100 shadow-sm'
                  : 'bg-sand-50 dark:bg-sand-800 border-sand-300 dark:border-sand-700 text-textDark dark:text-sand-200 hover:border-sand-400'
              }`}
            >
              {selectedRole === 'officer' && (
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 absolute top-3 right-3" />
              )}
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/80 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-base mb-2">
                ⚖️
              </div>
              <div>
                <h3 className="font-extrabold text-xs">Police Inspector</h3>
                <p className="text-[10px] text-textMuted dark:text-sand-400 mt-0.5">POCSO Nodal Unit</p>
              </div>
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

        {/* Registration Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-5">
          
          <div className="space-y-4">
            <label className="block text-xs font-bold text-primary dark:text-sand-100 uppercase tracking-wider">
              2. Account Credentials
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Public Alias / Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="e.g. Arjun_Student"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Email Address (2FA OTP destination)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="space-y-1">
                <label className="block text-xs font-bold text-primary dark:text-sand-200">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-textMuted dark:text-sand-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100 font-medium focus:ring-2 focus:ring-secondary/40"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Specific Fields */}
          <div className="space-y-4 pt-2 border-t border-sand-200 dark:border-sand-800">
            <label className="block text-xs font-bold text-primary dark:text-sand-100 uppercase tracking-wider">
              3. Category Identity Verification ({getRoleTitle()})
            </label>

            {selectedRole === 'student' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-blue-900 dark:text-blue-200">Student Roll / ID Number</label>
                  <input
                    type="text"
                    value={studentRoll}
                    onChange={(e) => setStudentRoll(e.target.value)}
                    placeholder="e.g. DPS-2026-X88"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono font-bold text-primary dark:text-sand-100"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-blue-900 dark:text-blue-200">School / Educational Institute</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Delhi Public School"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'defender' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200">Defender Accreditation Code</label>
                  <input
                    type="text"
                    value={defenderCode}
                    onChange={(e) => setDefenderCode(e.target.value)}
                    placeholder="e.g. DEF-VOL-902"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono font-bold text-primary dark:text-sand-100"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-emerald-900 dark:text-emerald-200">Youth Defense Club / Org</label>
                  <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="e.g. KV Cyber Defense Club"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'guardian' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/50 dark:bg-purple-950/30 p-4 rounded-2xl border border-purple-200 dark:border-purple-800">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-purple-900 dark:text-purple-200">Ward Reference PIN</label>
                  <input
                    type="text"
                    value={wardPin}
                    onChange={(e) => setWardPin(e.target.value)}
                    placeholder="e.g. CV-1042"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono font-bold text-primary dark:text-sand-100"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-purple-900 dark:text-purple-200">Ward's School / Institution</label>
                  <input
                    type="text"
                    value={childSchool}
                    onChange={(e) => setChildSchool(e.target.value)}
                    placeholder="e.g. Modern School Barakhamba"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100"
                  />
                </div>
              </div>
            )}

            {selectedRole === 'officer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-300 dark:border-amber-800">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-amber-900 dark:text-amber-200">Police Badge / Nodal ID</label>
                  <input
                    type="text"
                    value={officerBadge}
                    onChange={(e) => setOfficerBadge(e.target.value)}
                    placeholder="e.g. CPU-4"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs font-mono font-bold text-primary dark:text-sand-100"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-amber-900 dark:text-amber-200">Department / Cyber Unit</label>
                  <input
                    type="text"
                    value={departmentUnit}
                    onChange={(e) => setDepartmentUnit(e.target.value)}
                    placeholder="e.g. POCSO Nodal Unit DL-04"
                    className="w-full px-3 py-2 rounded-xl border border-sand-300 dark:border-sand-700 bg-surface dark:bg-sand-800 text-xs text-primary dark:text-sand-100"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover dark:bg-orange-600 dark:hover:bg-orange-500 text-surface dark:text-white font-bold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:shadow-lg transition-all active:scale-[0.99]"
          >
            <span>Proceed to Email OTP Verification</span>
            <ArrowRight className="w-4 h-4 text-secondary dark:text-white" />
          </button>
        </form>

        {/* Footer Navigation Link */}
        <div className="pt-4 border-t border-sand-200 dark:border-sand-800 flex items-center justify-between text-xs text-textMuted dark:text-sand-400">
          <span>Already have a clearance account?</span>
          <Link to="/login" className="text-secondary dark:text-orange-400 font-bold hover:underline">
            Sign In Instead →
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
