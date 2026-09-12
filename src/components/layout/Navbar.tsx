import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Menu, 
  X, 
  User, 
  LogOut, 
  EyeOff, 
  Settings,
  Lock,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ROLE_DEFINITIONS } from '../../utils/rbac';

interface NavbarProps {
  onTriggerCamouflage?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onTriggerCamouflage }) => {
  const { user, logout, isOfficer, loginWithCredentials, loginAsAnonymous } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const currentRole = user?.role || 'anonymous_user';
  const currentRoleInfo = ROLE_DEFINITIONS[currentRole];

  // Filter navLinks: Hide Portal unless user is welfare officer or admin
  const isOfficerOrAdmin = user?.role === 'welfare_officer' || user?.role === 'admin';
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Learn', path: '/learn' },
    { name: 'Stories', path: '/stories' },
    { name: 'Assistant', path: '/assistant' },
    { name: 'Report', path: '/report' },
    { name: 'SafeConnect', path: '/safeconnect' },
    ...(isOfficerOrAdmin ? [{ name: 'Portal', path: '/portal' }] : []),
  ];

  // Dark Mode Toggle State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('cybervigil_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cybervigil_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cybervigil_theme', 'light');
    }
  }, [darkMode]);

  const handleRoleSwitch = (role: UserRole) => {
    if (role === 'anonymous_user') {
      loginAsAnonymous();
    } else if (role === 'registered_youth') {
      loginWithCredentials('🎓 Arjun_Defender', 'registered_youth', 'Shield Level 1 (Institutional Verified)', 'DPS-2026-X88', {
        isVerified: true,
        verificationId: 'DPS-2026-X88',
        verificationType: 'student_institutional_id',
        institutionOrJurisdiction: 'Delhi Public School, R.K. Puram'
      });
    } else if (role === 'parent_guardian') {
      loginWithCredentials('🛡️ Guardian (Sunita M.)', 'parent_guardian', 'Family Safe Mode (Verified)', 'Ward: CV-1042', {
        isVerified: true,
        verificationId: 'CV-1042',
        verificationType: 'guardian_ward_link',
        institutionOrJurisdiction: 'Ward Link #CV-1042'
      });
    } else if (role === 'welfare_officer') {
      loginWithCredentials('⚖️ Inspector Sharma', 'welfare_officer', 'Level 3 Clearance (POCSO Statutory Verified)', '#CPU-4', {
        isVerified: true,
        verificationId: '#CPU-4',
        verificationType: 'inspector_pocso_nodal',
        institutionOrJurisdiction: 'POCSO Nodal Unit DL-04, Cyber Crime Cell'
      });
    } else if (role === 'admin') {
      loginWithCredentials('⚡ Admin Lead', 'admin', 'Master Clearance', '#ADMIN-01', {
        isVerified: true,
        verificationId: '#ADMIN-01',
        institutionOrJurisdiction: 'CyberVigil Cyber Forensic Core'
      });
    }
    setProfileDropdownOpen(false);
  };

  const handleSignOut = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          
          {/* Brand Identity - CyberVigil Emblem & Typography */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <img 
              src="/cybervigil-shield.png" 
              alt="CyberVigil Shield" 
              className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-sm" 
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                Cyber<span className="text-secondary">Vigil</span>
              </span>
              <span className="text-[9px] tracking-wider uppercase font-bold text-slate-400 dark:text-slate-400 mt-0.5">
                Secure Reporting Partner
              </span>
            </div>
          </Link>

          {/* Center Navigation Links - Only displayed once logged into the website */}
          {user && (
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9 bg-transparent">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm tracking-normal transition-all py-1 border-b-2 bg-transparent ${
                      isActive
                        ? 'text-amber-600 dark:text-amber-500 border-amber-600 dark:border-amber-500 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent font-medium'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Right Actions - Sleek Circular Icon Buttons like INFIPRE */}
          <div className="flex items-center gap-2.5">
            
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 shadow-xs"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
            </button>

            {/* Quick Camouflage Toggle (Circular Button) */}
            {user && onTriggerCamouflage && (
              <button
                onClick={onTriggerCamouflage}
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 shadow-xs"
                title="Quick Exit to study notes (ESC)"
                aria-label="Quick Exit Camouflage Mode"
              >
                <EyeOff className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
            )}

            {/* Profile / Account Trigger or Sign In Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary text-xs font-bold transition-all active:scale-95 shadow-xs"
                  title={`Logged in as: ${user?.alias}`}
                  aria-label="Account Settings & Role Switcher"
                >
                  <span className="text-base">{user?.alias ? user.alias.slice(0, 2) : '👤'}</span>
                </button>

                {/* Minimal Profile Dropdown with RBAC Controls */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-3 z-50 text-xs font-medium space-y-2 animate-in fade-in"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="p-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{user?.alias}</p>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                          ✓ {currentRoleInfo.clearance}
                        </span>
                      </div>
                      {user?.organization && (
                        <p className="text-slate-400 text-[10px] font-medium truncate">
                          {user.organization}
                        </p>
                      )}
                    </div>

                    {/* RBAC Quick Role Switcher (Visible ONLY to Admin) */}
                    {user?.role === 'admin' && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                          Verified Role Clearance (RBAC)
                        </span>
                        <div className="grid grid-cols-1 gap-1">
                          <button
                            onClick={() => handleRoleSwitch('registered_youth')}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                              currentRole === 'registered_youth' ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">🎓 <span>Student Defender</span></span>
                            {currentRole === 'registered_youth' && <span className="text-[10px] text-blue-600 font-bold">Shield 1</span>}
                          </button>

                          <button
                            onClick={() => handleRoleSwitch('parent_guardian')}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                              currentRole === 'parent_guardian' ? 'bg-purple-50 text-purple-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">🛡️ <span>Parent / Guardian</span></span>
                            {currentRole === 'parent_guardian' && <span className="text-[10px] text-purple-600 font-bold">Family</span>}
                          </button>

                          <button
                            onClick={() => handleRoleSwitch('welfare_officer')}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                              currentRole === 'welfare_officer' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">⚖️ <span>Police Inspector</span></span>
                            {currentRole === 'welfare_officer' && <span className="text-[10px] text-amber-700 font-bold">Level 3</span>}
                          </button>

                          <button
                            onClick={() => handleRoleSwitch('anonymous_user')}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                              currentRole === 'anonymous_user' ? 'bg-sand-100 text-primary font-bold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">🔒 <span>Anonymous Minor</span></span>
                            {currentRole === 'anonymous_user' && <span className="text-[10px] text-primary font-bold">Anon</span>}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-2 space-y-1">
                      <Link
                        to="/security"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Security & Privacy</span>
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-bold transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out (Direct to Login)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold px-3.5 py-2 rounded-xl bg-primary dark:bg-secondary hover:bg-primary-hover dark:hover:bg-secondary-dark text-surface dark:text-primary flex items-center gap-1.5 transition-all shadow-warm-sm active:scale-95"
                >
                  <User className="w-3.5 h-3.5 text-secondary dark:text-primary" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold px-3.5 py-2 rounded-xl border border-sand-300 dark:border-sand-700 hover:bg-sand-100 dark:hover:bg-sand-800 text-primary dark:text-sand-100 flex items-center gap-1 transition-all shadow-xs active:scale-95"
                >
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger (Only if authenticated) */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-sky-600 font-bold bg-sky-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <div className="space-y-2">
              <div className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs">
                <p className="font-bold text-slate-800">{user.alias}</p>
                <p className="text-[10px] text-slate-500">{currentRoleInfo.clearance}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-center py-2 rounded-lg border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                Sign Out (Direct to Login)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
