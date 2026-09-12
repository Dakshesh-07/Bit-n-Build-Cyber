export type UserRole = 
  | 'anonymous_user'
  | 'registered_youth'
  | 'parent_guardian'
  | 'welfare_officer'
  | 'admin';

export interface UserProfile {
  id: string;
  alias: string;
  email?: string;
  role: UserRole;
  avatarSeed?: string;
  clearanceLevel?: string;
  badgeNumber?: string;
  organization?: string;
  isAnonymous: boolean;
  isVerified?: boolean;
  verificationId?: string;
  verificationType?: 'student_institutional_id' | 'guardian_ward_link' | 'inspector_pocso_nodal';
  institutionOrJurisdiction?: string;
  educationLevel?: string;
  verifiedAt?: string;
}

export type IncidentCategory = 
  | 'Extortion'
  | 'Online Grooming'
  | 'Cyberbullying'
  | 'Impersonation'
  | 'Image Abuse'
  | 'Harassment'
  | 'Doxxing';

export type IncidentPlatform = 
  | 'Instagram'
  | 'WhatsApp'
  | 'Snapchat'
  | 'Discord'
  | 'Gaming'
  | 'TikTok'
  | 'Other';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type IncidentStatus = 
  | 'Pending Intake'
  | 'Under Review'
  | 'Platform Notice Drafted'
  | 'Escalated 1098'
  | 'Resolved';

export interface IncidentReport {
  id: string;
  caseNumber: string;
  category: IncidentCategory;
  platform: IncidentPlatform;
  incidentDetails: string;
  immediateDanger: boolean;
  severityLevel: SeverityLevel;
  threatScore: number;
  evidenceSha256?: string;
  status: IncidentStatus;
  piiScrubbed: boolean;
  createdAt: string;
  assignedOfficer?: string;
  distressLevel?: number;
  evidenceFiles: { name: string; size: string; status: string }[];
  isAnonymousReporter?: boolean;
  reporterAlias?: string;
  safetyCheckVerified?: boolean;
}

export type CommunityEntryType = 'story' | 'grievance';

export interface StoryReply {
  id: string;
  storyId: string;
  authorAlias: string;
  authorRole?: 'peer' | 'counselor' | 'officer' | 'community';
  text: string;
  timeAgo: string;
  votesCount: number;
  userVoted?: boolean;
  isVerified?: boolean;
}

export interface BraveStory {
  id: string;
  title: string;
  category: string;
  entryType?: CommunityEntryType;
  authorAlias: string;
  storyText: string;
  timeAgo: string;
  supportCount: number;
  userSupported?: boolean;
  votesCount?: number;
  userVoted?: boolean;
  replies?: StoryReply[];
  tags: string[];
  isAnonymous?: boolean;
  imageUrl?: string;
  cardVariant?: 'wand' | 'glasses' | 'circle' | 'sketch' | 'festival' | 'wings';
  duration?: string;
  pillBadge?: string;
  captionEmoji?: string;
  isSaved?: boolean;
  verifiedAdvice?: string;
  adviceOfficer?: string;
  answersCount?: number;
  urgency?: 'Critical' | 'Needs Guidance' | 'Resolved';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  steps?: string[];
  actionLink?: { text: string; url: string };
  empathyNote?: string;
  detectedThreat?: string;
  threatSeverity?: 'High Urgency' | 'Moderate' | 'Advisory';
  safetyHelplineNote?: string;
}

export interface LearnModule {
  id: string;
  title: string;
  tagline: string;
  category: string;
  duration: string;
  badgeEarned: string;
  lessonsCount: number;
  completed: boolean;
  description: string;
  keyRule: string;
  tips: string[];
}
