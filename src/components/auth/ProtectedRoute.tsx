import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Permission, hasPermission, ROLE_DEFINITIONS } from '../../utils/rbac';
import { ShieldAlert, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  requiredPermission?: Permission;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredPermission, children }) => {
  const { user, isAuthenticated, loading, loginWithCredentials } = useAuth();
  const location = useLocation();

  // 1. Initial State: While reading stored session from localStorage
  if (loading) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-in fade-in">
          <img 
            src="/cybervigil-shield.png" 
            alt="CyberVigil" 
            className="w-12 h-12 object-contain animate-pulse filter drop-shadow-sm" 
          />
          <span className="text-xs font-bold text-textMuted tracking-wider uppercase">
            Verifying Identity Clearance...
          </span>
        </div>
      </div>
    );
  }

  // 2. Strict Authentication Gate: Only enter the website on login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. RBAC Permission Gate (e.g. Inspector Portal)
  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    const roleInfo = ROLE_DEFINITIONS[user.role] || ROLE_DEFINITIONS.anonymous_user;

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6 animate-in fade-in">
        <div className="bg-surface rounded-2xl p-8 sm:p-10 border-2 border-secondary/40 shadow-warm-elevated space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary text-secondary flex items-center justify-center mx-auto shadow-warm-sm">
            <ShieldAlert className="w-8 h-8 text-secondary" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-secondary uppercase tracking-wider">
              POCSO Level 3 Clearance Required
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Restricted Officer Gateway
            </h1>
            <p className="text-sm text-textMuted leading-relaxed max-w-lg mx-auto">
              This module contains confidential minor incident reports and cryptographic evidentiary hashes strictly regulated under the POCSO Act 2012 and IT Act.
            </p>
          </div>

          {/* Current Role Pill */}
          <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 text-xs text-left flex items-center justify-between gap-3">
            <div>
              <span className="text-textMuted block font-medium">Your Current Active Clearance:</span>
              <span className="font-bold text-sm text-primary flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${user.role === 'welfare_officer' ? 'bg-secondary' : 'bg-textMuted'}`}></span>
                {roleInfo.label} ({user.clearanceLevel || roleInfo.clearance})
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-sand-200 text-textMuted font-mono text-[11px]">
              Role: {user.role}
            </span>
          </div>

          {/* RBAC Action Prompts */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => loginWithCredentials(
                '⚖️ Inspector Sharma', 
                'welfare_officer', 
                'Level 3 Clearance (POCSO Statutory Verified)', 
                '#CPU-4', 
                {
                  isVerified: true,
                  verificationId: '#CPU-4',
                  verificationType: 'inspector_pocso_nodal',
                  institutionOrJurisdiction: 'POCSO Nodal Unit DL-04, Cyber Crime Cell'
                }
              )}
              className="w-full py-3.5 px-6 rounded-xl bg-secondary hover:bg-secondary-dark text-primary text-sm font-bold shadow-warm-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span>Verify Level 3 POCSO Clearance (Instant Entry)</span>
            </button>

            <Link
              to="/login"
              className="block w-full py-3 rounded-xl border border-sand-300 bg-surface hover:bg-sand-100 text-primary text-xs font-bold transition-colors text-center"
            >
              Sign In with Certified Police Badge
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authenticated & Permitted -> Render Protected Page
  return <>{children}</>;
};
