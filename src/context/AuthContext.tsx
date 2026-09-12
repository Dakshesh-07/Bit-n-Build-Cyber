import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

export interface VerificationMetadata {
  isVerified?: boolean;
  verificationId?: string;
  verificationType?: 'student_institutional_id' | 'guardian_ward_link' | 'inspector_pocso_nodal';
  institutionOrJurisdiction?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginAsAnonymous: (ticketPin?: string) => void;
  loginWithCredentials: (
    alias: string, 
    role: UserRole, 
    clearanceLevel?: string, 
    badgeNumber?: string,
    verificationMeta?: VerificationMetadata
  ) => void;
  registerUser: (
    alias: string, 
    role: UserRole,
    clearanceLevel?: string,
    badgeNumber?: string,
    verificationMeta?: VerificationMetadata
  ) => void;
  logout: () => void;
  isOfficer: boolean;
  isYouth: boolean;
  isAnonymous: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cybervigil_active_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it was the previous auto-created anonymous dummy session, clean it up so user is not logged in by default
        if (parsed?.id === 'anon-session-7029') {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setUser(null);
        } else {
          setUser(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
      }
    } else {
      // By default, start unauthenticated (Guest / Not logged in)
      setUser(null);
    }
    setLoading(false);
  }, []);

  const loginAsAnonymous = (ticketPin?: string) => {
    const anonUser: UserProfile = {
      id: ticketPin ? `ticket-${ticketPin}` : `anon-${Date.now().toString().slice(-4)}`,
      alias: ticketPin ? `Case #${ticketPin}` : 'Anonymous Defender',
      role: 'anonymous_user',
      isAnonymous: true,
      clearanceLevel: 'Public Safe Mode (Zero PII)',
      isVerified: false,
    };
    setUser(anonUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(anonUser));
  };

  const loginWithCredentials = (
    alias: string, 
    role: UserRole, 
    clearanceLevel = 'L3 Clearance', 
    badgeNumber = '#CPU-4',
    verificationMeta?: VerificationMetadata
  ) => {
    const authUser: UserProfile = {
      id: `usr-${Date.now()}`,
      alias,
      role,
      clearanceLevel: role === 'welfare_officer' 
        ? clearanceLevel 
        : role === 'registered_youth' 
          ? (clearanceLevel || 'Shield Level 1') 
          : role === 'parent_guardian' 
            ? (clearanceLevel || 'Family Safe Mode') 
            : undefined,
      badgeNumber: role === 'welfare_officer' ? badgeNumber : verificationMeta?.verificationId,
      organization: role === 'welfare_officer' 
        ? (verificationMeta?.institutionOrJurisdiction || 'Child Protection Unit') 
        : verificationMeta?.institutionOrJurisdiction,
      isAnonymous: false,
      isVerified: verificationMeta?.isVerified ?? (role !== 'anonymous_user'),
      verificationId: verificationMeta?.verificationId || (role === 'welfare_officer' ? badgeNumber : undefined),
      verificationType: verificationMeta?.verificationType,
      institutionOrJurisdiction: verificationMeta?.institutionOrJurisdiction,
      verifiedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  };

  const registerUser = (
    alias: string, 
    role: UserRole,
    clearanceLevel?: string,
    badgeNumber?: string,
    verificationMeta?: VerificationMetadata
  ) => {
    loginWithCredentials(alias, role, clearanceLevel, badgeNumber, verificationMeta);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAuthenticated = Boolean(user);
  const isOfficer = user?.role === 'welfare_officer' || user?.role === 'admin';
  const isYouth = user?.role === 'registered_youth';
  const isAnonymous = user?.isAnonymous ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        loginAsAnonymous,
        loginWithCredentials,
        registerUser,
        logout,
        isOfficer,
        isYouth,
        isAnonymous,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
