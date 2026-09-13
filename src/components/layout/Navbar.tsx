import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

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
        <div className="flex justify-between items-center h-20 sm:h-22">
          
          {/* Brand Identity - CyberVigil Emblem & Typography */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img 
              src="/cybervigil-shield.png" 
              alt="CyberVigil Shield" 
              className="w-11 h-11 sm:w-12 sm:h-12 object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-sm" 
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl sm:text-[26px] tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                Cyber<span className="text-secondary">Vigil</span>
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-wider uppercase font-bold text-slate-400 dark:text-slate-400 mt-1">
                Secure Reporting Partner
              </span>
            </div>
          </Link>

          {/* Center Navigation Links - Pure inline links, seamless with header background */}
          {user && (
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[15px] sm:text-base tracking-normal transition-all py-1.5 px-1 border-b-2 ${
                      isActive
                        ? 'text-amber-600 dark:text-amber-500 border-amber-600 dark:border-amber-500 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-transparent font-semibold'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Right Actions - Sleek Circular Icon Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 shadow-xs"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
            </button>

            {/* Quick Camouflage Toggle (Circular Button) */}
            {user && onTriggerCamouflage && (
              <button
                onClick={onTriggerCamouflage}
                className="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all active:scale-95 shadow-xs"
                title="Quick Exit to study notes (ESC)"
                aria-label="Quick Exit Camouflage Mode"
              >
                <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            )}

            {/* Profile / Account Trigger or Log In Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary text-sm font-bold transition-all active:scale-95 shadow-xs"
                  title={`Logged in as: ${user?.alias}`}
                  aria-label="Account Settings & Role Switcher"
                >
                  <span className="text-lg">{user?.alias ? user.alias.slice(0, 2) : '👤'}</span>
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
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className={`text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                      location.pathname === '/register'
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                        : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <User className={`w-4 h-4 ${location.pathname === '/register' ? 'text-slate-950' : 'text-amber-500'}`} />
                    <span>Log In</span>
                  </Link>
                )}

                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="text-sm font-extrabold px-4 py-2 rounded-xl flex items-center gap-1 transition-all bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm active:scale-95"
                  >
                    <span>Register</span>
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Hamburger (Only if authenticated) */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1120] px-4 pt-3 pb-6 space-y-2 shadow-sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-base font-semibold transition-colors ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="space-y-2">
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-100">{user.alias}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{currentRoleInfo.clearance}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-center py-2.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
