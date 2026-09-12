import { UserRole } from '../types';

export type Permission = 
  | 'view_public'
  | 'submit_anonymous_report'
  | 'submit_verified_report'
  | 'track_ticket'
  | 'use_ai_assistant'
  | 'share_story'
  | 'request_counselor'
  | 'access_officer_portal'
  | 'dispatch_takedown'
  | 'assign_counselor'
  | 'export_legal_dossier'
  | 'view_evidence_hashes'
  | 'manage_users';

export interface RoleInfo {
  id: UserRole;
  label: string;
  badge: string;
  clearance: string;
  description: string;
  colorClass: string;
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleInfo> = {
  anonymous_user: {
    id: 'anonymous_user',
    label: 'Anonymous Minor',
    badge: 'Anon Guard',
    clearance: 'Public Safe Mode',
    description: 'Zero data retention session for vulnerable minors in distress.',
    colorClass: 'bg-sand-200 text-textDark border-sand-300',
  },
  registered_youth: {
    id: 'registered_youth',
    label: 'Student / Youth Defender',
    badge: 'Student Defender',
    clearance: 'Shield Level 1 (Institutional Verified)',
    description: 'Verified student or youth defender profile with institutional affiliation & peer defense badges.',
    colorClass: 'bg-blue-50 text-blue-900 border-blue-200',
  },
  parent_guardian: {
    id: 'parent_guardian',
    label: 'Parent / Guardian',
    badge: 'Guardian Safe',
    clearance: 'Family Safe Mode (Verified)',
    description: 'Verified parental oversight access with ward linkage and direct family legal guidance.',
    colorClass: 'bg-purple-50 text-purple-900 border-purple-200',
  },
  welfare_officer: {
    id: 'welfare_officer',
    label: 'Police / Welfare Inspector',
    badge: 'Inspector POCSO',
    clearance: 'Level 3 Clearance (POCSO Statutory Verified)',
    description: 'Authorized law enforcement nodal officer, cyber cell inspector & POCSO investigator.',
    colorClass: 'bg-amber-100 text-amber-900 border-secondary',
  },
  admin: {
    id: 'admin',
    label: 'System Administrator',
    badge: 'Admin Lead',
    clearance: 'Master Clearance',
    description: 'Platform integrity, forensic compliance, and multi-agency auditor.',
    colorClass: 'bg-primary text-surface border-primary',
  },
};

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  anonymous_user: [
    'view_public',
    'submit_anonymous_report',
    'track_ticket',
    'use_ai_assistant',
    'share_story',
    'request_counselor',
  ],
  registered_youth: [
    'view_public',
    'submit_anonymous_report',
    'submit_verified_report',
    'track_ticket',
    'use_ai_assistant',
    'share_story',
    'request_counselor',
  ],
  parent_guardian: [
    'view_public',
    'submit_anonymous_report',
    'submit_verified_report',
    'track_ticket',
    'use_ai_assistant',
    'share_story',
    'request_counselor',
  ],
  welfare_officer: [
    'view_public',
    'submit_anonymous_report',
    'submit_verified_report',
    'track_ticket',
    'use_ai_assistant',
    'share_story',
    'request_counselor',
    'access_officer_portal',
    'dispatch_takedown',
    'assign_counselor',
    'export_legal_dossier',
    'view_evidence_hashes',
  ],
  admin: [
    'view_public',
    'submit_anonymous_report',
    'submit_verified_report',
    'track_ticket',
    'use_ai_assistant',
    'share_story',
    'request_counselor',
    'access_officer_portal',
    'dispatch_takedown',
    'assign_counselor',
    'export_legal_dossier',
    'view_evidence_hashes',
    'manage_users',
  ],
};

export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function getRoleClearanceBadge(
  role: UserRole | undefined, 
  isVerified?: boolean, 
  verificationId?: string
): { label: string; clearance: string; color: string; icon: string } {
  if (!role) {
    return {
      label: 'Guest Visitor',
      clearance: 'Unverified Access',
      color: 'bg-sand-200 text-textMuted border-sand-300',
      icon: '🛡️'
    };
  }

  switch (role) {
    case 'welfare_officer':
      return {
        label: isVerified ? 'Verified Police Inspector' : 'Inspector Clearance Pending',
        clearance: isVerified ? `Level 3 POCSO Nodal (${verificationId || '#CPU-4'})` : 'Level 3 Clearance',
        color: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: '⚖️'
      };
    case 'parent_guardian':
      return {
        label: isVerified ? 'Verified Parent Guardian' : 'Guardian Account',
        clearance: isVerified ? `Family Safe Mode (${verificationId || 'Ward Linked'})` : 'Family Safe Mode',
        color: 'bg-purple-100 text-purple-900 border-purple-300',
        icon: '🛡️'
      };
    case 'registered_youth':
      return {
        label: isVerified ? 'Verified Student Defender' : 'Youth Defender',
        clearance: isVerified ? `Shield Level 1 (${verificationId || 'Institutional Verified'})` : 'Shield Level 1',
        color: 'bg-blue-100 text-blue-900 border-blue-300',
        icon: '🎓'
      };
    case 'admin':
      return {
        label: 'System Auditor & Admin',
        clearance: 'Master Security Clearance',
        color: 'bg-primary text-surface border-primary',
        icon: '⚡'
      };
    default:
      return {
        label: 'Anonymous Minor Session',
        clearance: 'Public Safe Mode (Zero PII)',
        color: 'bg-sand-200 text-primary border-sand-300',
        icon: '🔒'
      };
  }
}

