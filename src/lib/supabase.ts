import { createClient } from '@supabase/supabase-js';
import { IncidentReport, BraveStory, StoryReply } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-cybervigil-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-cybervigil-client';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('mock-cybervigil')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE_TIME = Date.now();

// Initial Seed Data for Instant Local Persistence
const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-1042',
    caseNumber: '#CV-1042',
    category: 'Extortion',
    platform: 'Instagram',
    incidentDetails: 'Victim reported receiving unsolicited threat messages across Instagram DM. Anonymous threat actor demanded digital currency, alleging possession of altered synthetic media depicting the minor (Age: 14, Region: Bengaluru Urban). Harasser threatened distribution across student group chat unless gift cards were sent within 12 hours.',
    immediateDanger: false,
    severityLevel: 'High',
    threatScore: 78,
    evidenceSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'Under Review',
    piiScrubbed: true,
    createdAt: '18 mins ago',
    createdTimestamp: BASE_TIME - 18 * 60 * 1000,
    assignedOfficer: 'Inspector Sharma',
    distressLevel: 88,
    evidenceFiles: [
      { name: 'threat_screenshot_chat_01.png', size: '1.4 MB', status: 'SHA-256 Scrubbed' }
    ]
  },
  {
    id: 'inc-1043',
    caseNumber: '#BG-1043',
    category: 'Cyberbullying',
    platform: 'Discord',
    incidentDetails: 'Repeated coordinated raid in a gaming study group. Target victim was harassed with derogatory insults, server bot mentions, and manipulated voice recordings across two gaming channels.',
    immediateDanger: false,
    severityLevel: 'Moderate',
    threatScore: 45,
    evidenceSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    status: 'Platform Notice Drafted',
    piiScrubbed: true,
    createdAt: '45 mins ago',
    createdTimestamp: BASE_TIME - 45 * 60 * 1000,
    assignedOfficer: 'Child Welfare Desk',
    distressLevel: 55,
    evidenceFiles: [
      { name: 'discord_raid_logs.pdf', size: '820 KB', status: 'Metadata Cleared' }
    ]
  },
  {
    id: 'inc-1044',
    caseNumber: '#BG-1044',
    category: 'Impersonation',
    platform: 'Snapchat',
    incidentDetails: 'Fraudulent account mimicking a high-school student reached out to classmates soliciting personal contact details and private mobile numbers under false pretenses.',
    immediateDanger: false,
    severityLevel: 'High',
    threatScore: 82,
    evidenceSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    status: 'Escalated 1098',
    piiScrubbed: true,
    createdAt: '2 hours ago',
    createdTimestamp: BASE_TIME - 2 * 3600 * 1000,
    assignedOfficer: 'Childline Nodal Desk',
    distressLevel: 75,
    evidenceFiles: [
      { name: 'snapchat_fake_profile.png', size: '2.1 MB', status: 'SHA-256 Scrubbed' }
    ]
  },
  {
    id: 'inc-1045',
    caseNumber: '#BG-1045',
    category: 'Doxxing',
    platform: 'WhatsApp',
    incidentDetails: 'Victim school address and parents contact numbers were leaked on a public WhatsApp group. Unsolicited spam calls and threats received within 3 hours.',
    immediateDanger: true,
    severityLevel: 'Critical',
    threatScore: 92,
    evidenceSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    status: 'Under Review',
    piiScrubbed: true,
    createdAt: '3 hours ago',
    createdTimestamp: BASE_TIME - 3 * 3600 * 1000,
    assignedOfficer: 'Inspector Rao',
    distressLevel: 94,
    evidenceFiles: [
      { name: 'whatsapp_leak_screenshot.jpg', size: '3.4 MB', status: 'Metadata Scrubbed' }
    ]
  }
];

const INITIAL_STORIES: BraveStory[] = [
  // ==============================================================================
  // SECTION 1: BRAVE STORIES (Survivor Triumphs & Overcoming Cyber Threats)
  // ==============================================================================
  {
    id: 'story-1',
    entryType: 'story',
    title: 'How I Stopped a Sextortionist without Paying a Single Rupee',
    category: 'Extortion & Blackmail',
    authorAlias: 'GamerShield_15',
    storyText: 'When someone I played with for months said they had photoshopped synthetic pictures of me and demanded $50 or they would leak it to my classmates, my world stopped. My hands were shaking. I found CyberVigil and Childline. Following the golden advice to NEVER pay and taking screenshots before blocking saved me. Within 2 days, their account was suspended across platforms.',
    timeAgo: '2 days ago',
    createdAt: BASE_TIME - 50 * 3600 * 1000,
    supportCount: 42,
    userSupported: false,
    votesCount: 38,
    userVoted: false,
    tags: ['Extortion Defense', 'Section 65B Proof', 'Never Comply'],
    imageUrl: '/stories/magic-arc.jpg',
    cardVariant: 'wand',
    pillBadge: "Brave Story • Extortion",
    captionEmoji: 'Overcame Extortion 🛡️',
    isSaved: false,
    replies: [
      {
        id: 'rep-s1-1',
        storyId: 'story-1',
        authorAlias: 'Aarav_Defender',
        authorRole: 'peer',
        text: 'Thank you for sharing this! People don\'t realize how fast extortionists back off when you refuse to engage.',
        timeAgo: '1 day ago',
        votesCount: 14,
        userVoted: false
      },
      {
        id: 'rep-s1-2',
        storyId: 'story-1',
        authorAlias: 'CyberYouth_Counselor',
        authorRole: 'counselor',
        text: 'Crucial advice: saving uncropped evidence before blocking is the number one thing that empowers law enforcement.',
        timeAgo: '18 hours ago',
        votesCount: 21,
        userVoted: true,
        isVerified: true
      }
    ]
  },
  {
    id: 'story-2',
    entryType: 'story',
    title: 'The Fake Instagram Account that Impersonated and Defamed Me',
    category: 'Online Frauds & Scams',
    authorAlias: 'Ananya_Defends',
    storyText: 'A cyber harasser created a clone profile with my name, bio, and stolen photos to send obscene DMs to my school friends and run gift card scams. I thought I had to confront them directly. Instead, our counselor helped me preserve cryptographic hashes and file an emergency takedown through Indian IT Act protocols. It was dismantled in under 4 hours.',
    timeAgo: '4 days ago',
    createdAt: BASE_TIME - 96 * 3600 * 1000,
    supportCount: 89,
    userSupported: true,
    votesCount: 65,
    userVoted: true,
    tags: ['Impersonation', 'Identity Fraud', 'Expedited Takedown'],
    imageUrl: '/stories/sunflower-glasses.jpg',
    cardVariant: 'glasses',
    pillBadge: "Brave Story • Fraud",
    captionEmoji: 'Identity Reclaimed 🌻',
    isSaved: true,
    replies: [
      {
        id: 'rep-s2-1',
        storyId: 'story-2',
        authorAlias: 'Pooja_Psychologist',
        authorRole: 'counselor',
        text: 'Confronting impersonators directly often gives them the reaction they crave. Using verified statutory takedowns is always the strongest path.',
        timeAgo: '3 days ago',
        votesCount: 18,
        isVerified: true
      }
    ]
  },
  {
    id: 'story-3',
    entryType: 'story',
    title: 'Saying HALT to Blackmail: How We Outsmarted an Online Predator',
    category: 'Extortion & Blackmail',
    authorAlias: 'SilentKnight',
    storyText: 'An anonymous stranger threatened that if I did not follow their commands or if I told my parents, they would ruin my life. I felt cornered and isolated until an advocate explained that predators manufacture fake urgency. We gathered chat logs, pressed block, and dialed 1098 together. Saying that single word "HALT" broke their power.',
    timeAgo: '1 week ago',
    createdAt: BASE_TIME - 168 * 3600 * 1000,
    supportCount: 114,
    userSupported: false,
    votesCount: 92,
    userVoted: false,
    tags: ['Predator Defense', 'Zero Fear', 'Childline 1098'],
    imageUrl: '/stories/defender-halt.jpg',
    cardVariant: 'circle',
    pillBadge: "Brave Story • Blackmail",
    captionEmoji: 'Saying HALT to Blackmail 🛑',
    isSaved: false,
    replies: [
      {
        id: 'rep-s3-1',
        storyId: 'story-3',
        authorAlias: 'Inspector Sharma',
        authorRole: 'officer',
        text: 'Predators rely entirely on isolation. Breaking that isolation and looping in one trusted guardian collapses their extortion strategy.',
        timeAgo: '5 days ago',
        votesCount: 41,
        isVerified: true
      }
    ]
  },
  {
    id: 'story-4',
    entryType: 'story',
    title: 'My Journal Journey: Healing and Standing Up to School Cyberbullying',
    category: 'Cyberbullying',
    authorAlias: 'SketchArt_Maya',
    storyText: 'When a toxic grade chat started circulating cruel memes and excluding me, drawing was my refuge. I quietly archived every abusive message with timestamps, reported the instigators with parental support, and founded an anti-cyberbullying art circle. Bullies lose all authority the moment you stop suffering in silence.',
    timeAgo: '3 days ago',
    createdAt: BASE_TIME - 75 * 3600 * 1000,
    supportCount: 67,
    userSupported: false,
    votesCount: 45,
    userVoted: false,
    tags: ['Cyberbullying', 'Mental Peace', 'School Support'],
    imageUrl: '/stories/sketch-profile.jpg',
    cardVariant: 'sketch',
    pillBadge: "Brave Story • Bullying",
    captionEmoji: 'Quiet Resilience ✍️',
    isSaved: false,
    replies: [
      {
        id: 'rep-s4-1',
        storyId: 'story-4',
        authorAlias: 'Maya_Ally',
        authorRole: 'peer',
        text: 'Your courage inspired our school to set up an anonymous cyber-reporting dropbox!',
        timeAgo: '2 days ago',
        votesCount: 22
      }
    ]
  },
  {
    id: 'story-5',
    entryType: 'story',
    title: 'Festival Night: How Our Student Group Evaded Live Location Doxxing',
    category: 'Online Frauds & Scams',
    authorAlias: 'Rohan_Suraksha',
    storyText: 'During a crowded festival night, an unknown account attempted social engineering to extract our live location via Snap Map links and fake event passes. We immediately disabled location sharing and ran all group photos through CyberVigil’s EXIF scrubber. Enjoy social celebrations, but protect your physical GPS coordinates!',
    timeAgo: '5 days ago',
    createdAt: BASE_TIME - 120 * 3600 * 1000,
    supportCount: 95,
    userSupported: true,
    votesCount: 78,
    userVoted: true,
    tags: ['Doxxing Shield', 'Phishing Defense', 'EXIF Scrubbing'],
    imageUrl: '/stories/festival-night.jpg',
    cardVariant: 'festival',
    pillBadge: "Brave Story • Doxxing",
    captionEmoji: 'Festival Night Safety 🪔🕊️',
    isSaved: false,
    replies: [
      {
        id: 'rep-s5-1',
        storyId: 'story-5',
        authorAlias: 'Vikramaditya Rao',
        authorRole: 'officer',
        text: 'Location metadata (EXIF) embedded in JPEG photos is one of the top vectors for physical stalking. Scrubbing coordinates before posting is essential.',
        timeAgo: '4 days ago',
        votesCount: 30,
        isVerified: true
      }
    ]
  },
  {
    id: 'story-6',
    entryType: 'story',
    title: 'Digital Wings: Building a Peer Shield Against Online Grooming',
    category: 'Safe Communities',
    authorAlias: 'CyberAngel_Kavya',
    storyText: 'Facing an online predator in a gaming lobby taught me the early red flags: excessive secret gifts, emotional manipulation, and attempts to isolate you from family. Today, our community mentors youth on setting firm digital boundaries and reporting grooming before harm occurs.',
    timeAgo: '6 days ago',
    createdAt: BASE_TIME - 144 * 3600 * 1000,
    supportCount: 132,
    userSupported: true,
    votesCount: 104,
    userVoted: true,
    tags: ['Peer Mentorship', 'Anti-Grooming', 'POCSO Shield'],
    imageUrl: '/stories/cyber-wings.jpg',
    cardVariant: 'wings',
    pillBadge: "Brave Story • Community",
    captionEmoji: 'Guardian Wings 💫',
    isSaved: true,
    replies: [
      {
        id: 'rep-s6-1',
        storyId: 'story-6',
        authorAlias: 'Dr. Ramesh Iyer',
        authorRole: 'officer',
        text: 'Early boundary-setting is the single most effective deterrent against predatory behavior.',
        timeAgo: '5 days ago',
        votesCount: 46,
        isVerified: true
      }
    ]
  },

  // ==============================================================================
  // SECTION 2: GRIEVANCES & DOUBTS (Community Questions, Fears & Verified Advice)
  // ==============================================================================
  {
    id: 'grievance-1',
    entryType: 'grievance',
    title: 'Doubt: Extortionist sent an AI morphed photo & demands 5,000 INR. If I block, will they leak it?',
    category: 'Extortion & Blackmail',
    authorAlias: 'Scared_Student_16',
    storyText: 'Someone on Instagram DM sent me an AI-generated photo with my face pasted on an explicit body, demanding 5,000 INR on UPI within 6 hours or they threaten to message it to all my school followers. I haven\'t replied. If I block them right now without paying, will they actually send it to everyone? Please help me understand!',
    timeAgo: '4 hours ago',
    createdAt: BASE_TIME - 4 * 3600 * 1000,
    supportCount: 58,
    userSupported: true,
    votesCount: 84,
    userVoted: true,
    tags: ['Extortion Doubt', 'AI Morphing', 'Emergency Triage'],
    imageUrl: '/stories/student-doubts.jpg',
    pillBadge: 'Grievance • Extortion',
    captionEmoji: 'Urgent Extortion Query ❓',
    isSaved: true,
    urgency: 'Critical',
    answersCount: 3,
    verifiedAdvice: 'CRITICAL OFFICER ADVICE: Never pay. Extortionists rely entirely on your compliance and fear. 97% of victims who pay are re-extorted for higher amounts within 24 hours. Take complete, uncropped screenshots of the chat, UPI ID, and username immediately. Then block the account. Dispatch an automated hash takedown (StopNCII / TakeItDown via CyberVigil) so platforms block that image hash automatically. You have full statutory immunity under the POCSO Act.',
    adviceOfficer: 'Inspector Sharma (Welfare Officer & POCSO Nodal Desk)',
    replies: [
      {
        id: 'rep-g1-1',
        storyId: 'grievance-1',
        authorAlias: 'Inspector Sharma',
        authorRole: 'officer',
        text: 'Under no circumstance should you pay. They rely on fear. Once paid, demands multiply immediately. Take uncropped screenshots with their UPI ID and username, block them, and hash the file with TakeItDown.',
        timeAgo: '3 hours ago',
        votesCount: 42,
        userVoted: true,
        isVerified: true
      },
      {
        id: 'rep-g1-2',
        storyId: 'grievance-1',
        authorAlias: 'StudentSurvivor_Delhi',
        authorRole: 'peer',
        text: 'The exact same thing happened to me 2 months ago. I blocked them without paying, and nothing ever leaked. Blackmailers want quick cash—once you cut communication, they flee.',
        timeAgo: '2 hours ago',
        votesCount: 29,
        userVoted: false
      },
      {
        id: 'rep-g1-3',
        storyId: 'grievance-1',
        authorAlias: 'Pooja Nair',
        authorRole: 'counselor',
        text: 'Please take a deep breath. You did nothing wrong. Synthetic AI morphing makes you 100% the victim under law. Talk to a trusted family member or call 1098.',
        timeAgo: '1 hour ago',
        votesCount: 19,
        userVoted: false,
        isVerified: true
      }
    ]
  },
  {
    id: 'grievance-2',
    entryType: 'grievance',
    title: 'Grievance: Classmates made an anonymous gossip page posting private chats and cruel memes.',
    category: 'Cyberbullying',
    authorAlias: 'Anonymous_Class9',
    storyText: 'An anonymous confession account run by students in my school is leaking private messages and posting humiliating memes about me. School principal says because it happened on Instagram outside school hours, they cannot intervene. What are my legal rights and what can I do?',
    timeAgo: '1 day ago',
    createdAt: BASE_TIME - 24 * 3600 * 1000,
    supportCount: 76,
    userSupported: false,
    votesCount: 61,
    userVoted: false,
    tags: ['School Bullying', 'Legal Rights', 'Defamation'],
    imageUrl: '/stories/sketch-profile.jpg',
    cardVariant: 'sketch',
    pillBadge: 'Grievance • Bullying',
    captionEmoji: 'Bullying Grievance 💬',
    isSaved: false,
    urgency: 'Needs Guidance',
    answersCount: 2,
    verifiedAdvice: 'LEGAL & COUNSELOR ADVICE: The school\'s response is incorrect under CBSE Anti-Bullying Directives, which mandate school intervention for off-campus cyberbullying affecting students. 1) Do not plead or comment on the page. 2) Document every post URL and timestamp. 3) File an institutional cyber report through CyberVigil. 4) Dial Childline 1098; an officer will reach out directly to the school administration with statutory compliance notices.',
    adviceOfficer: 'Pooja Nair (Senior Adolescent Psychologist)',
    replies: [
      {
        id: 'rep-g2-1',
        storyId: 'grievance-2',
        authorAlias: 'Pooja Nair',
        authorRole: 'counselor',
        text: 'The principal is legally misinformed. CBSE Circular No. Acad-17/2015 explicitly mandates schools protect students from cyber harassment affecting their education. Request a formal Anti-Bullying Committee inquiry.',
        timeAgo: '1 day ago',
        votesCount: 35,
        isVerified: true
      },
      {
        id: 'rep-g2-2',
        storyId: 'grievance-2',
        authorAlias: 'Arjun_LegalAid',
        authorRole: 'peer',
        text: 'Save the complete webpage URLs and take timestamped screen recordings. If school refuses to act, Childline 1098 will issue an inquiry letter on your behalf.',
        timeAgo: '16 hours ago',
        votesCount: 23
      }
    ]
  },
  {
    id: 'grievance-3',
    entryType: 'grievance',
    title: 'Doubt: Clicked a fake Instagram "Copyright Notice" link, entered password & lost 2FA. Am I hacked?',
    category: 'Online Frauds & Scams',
    authorAlias: 'Creator_Dev',
    storyText: 'I got an official-looking DM claiming copyright violation with a countdown link to avoid account suspension. I panicked and entered my credentials. Immediately, the attacker changed my recovery email and activated an authenticator app. Now they are asking my followers for emergency money transfers. Can I recover it?',
    timeAgo: '2 days ago',
    createdAt: BASE_TIME - 48 * 3600 * 1000,
    supportCount: 39,
    userSupported: false,
    votesCount: 47,
    userVoted: false,
    tags: ['Phishing Attack', 'Account Hijack', 'Credential Theft'],
    imageUrl: '/stories/phishing-lock.jpg',
    pillBadge: 'Grievance • Fraud',
    captionEmoji: 'Phishing Fraud Alert ⚠️',
    isSaved: true,
    urgency: 'Critical',
    answersCount: 2,
    verifiedAdvice: 'CYBER FORENSICS ACTION: You encountered an advanced credential-harvesting phishing scam. Take these immediate steps: 1) Visit instagram.com/hacked on your phone and select "My account was hacked" to trigger facial video selfie verification against your past photos. 2) Change passwords on all email accounts sharing that password. 3) Warn your friends through other platforms not to send money. 4) Report the fraudulent UPI ID to helpline 1930.',
    adviceOfficer: 'Vikramaditya Rao (Cyber Forensics Lead)',
    replies: [
      {
        id: 'rep-g3-1',
        storyId: 'grievance-3',
        authorAlias: 'Vikramaditya Rao',
        authorRole: 'officer',
        text: 'Use the official Instagram mobile app to go to instagram.com/hacked. Select "My account was hacked" and complete video selfie verification. Meta compares the selfie with your past photos to bypass attacker\'s 2FA.',
        timeAgo: '1 day ago',
        votesCount: 28,
        isVerified: true
      },
      {
        id: 'rep-g3-2',
        storyId: 'grievance-3',
        authorAlias: 'TechSecurity_Advocate',
        authorRole: 'community',
        text: 'Post an immediate alert on WhatsApp, Snapchat, and X warning your friends that your Instagram is compromised and asking for money fraudulently.',
        timeAgo: '14 hours ago',
        votesCount: 16
      }
    ]
  },
  {
    id: 'grievance-4',
    entryType: 'grievance',
    title: 'Doubt: Discord gamer gifted me 5,000 Robux and wants private webcam call with door closed.',
    category: 'Extortion & Blackmail',
    authorAlias: 'GamerKid_12',
    storyText: 'Someone I met in an online game has been giving me skins and game currency for 2 months. Now they asked for a private video call late at night and said "keep it secret from your parents, it\'s our private gamer code". If I refuse or block them, can they ban my game account or charge my parents?',
    timeAgo: '3 days ago',
    createdAt: BASE_TIME - 72 * 3600 * 1000,
    supportCount: 104,
    userSupported: true,
    votesCount: 96,
    userVoted: true,
    tags: ['Grooming Red Flag', 'Gaming Safety', 'Zero Guilt'],
    imageUrl: '/stories/defender-halt.jpg',
    pillBadge: 'Grievance • Grooming',
    captionEmoji: 'Predator Red Flag 🚩',
    isSaved: false,
    urgency: 'Critical',
    answersCount: 2,
    verifiedAdvice: 'TRAUMA SAFETY TRIAGE: Your instinct is 100% correct. This is the classic grooming reciprocity trap (giving gifts to manufacture artificial obligation and demand isolation). 1) They CANNOT ban your game account or charge your parents. 2) Never turn on your webcam under any circumstances. 3) You owe them nothing. 4) Block them across Discord and in-game immediately. 5) Tell a parent or call 1098; you are protected and in no trouble.',
    adviceOfficer: 'Dr. Ramesh Iyer (Child Protection Specialist)',
    replies: [
      {
        id: 'rep-g4-1',
        storyId: 'grievance-4',
        authorAlias: 'Dr. Ramesh Iyer',
        authorRole: 'officer',
        text: 'Listen to your intuition: it is 100% right. In-game gifts create zero debt or obligation. They have NO power to ban you or charge your parents. Block them on Discord and in Roblox immediately.',
        timeAgo: '2 days ago',
        votesCount: 52,
        isVerified: true
      },
      {
        id: 'rep-g4-2',
        storyId: 'grievance-4',
        authorAlias: 'Parent_Defender',
        authorRole: 'community',
        text: 'As a parent: you will NEVER get in trouble for telling your mom or dad about this. We are proud of you for spotting the danger and asking here.',
        timeAgo: '1 day ago',
        votesCount: 44
      }
    ]
  }
];

// Helper to extract or estimate timestamp for chronological sorting
export function getStoryTimestamp(story: BraveStory): number {
  if (typeof story.createdAt === 'number' && !isNaN(story.createdAt) && story.createdAt > 0) {
    return story.createdAt;
  }
  const idMatch = story.id.match(/\b\d{12,14}\b/);
  if (idMatch) {
    const parsed = parseInt(idMatch[0], 10);
    if (!isNaN(parsed) && parsed > 1700000000000) return parsed;
  }
  const text = (story.timeAgo || '').toLowerCase();
  const now = Date.now();
  if (text.includes('just now')) return now;
  const numMatch = text.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : 1;
  if (text.includes('min') || text.includes('m ago')) return now - num * 60 * 1000;
  if (text.includes('hour') || text.includes('h ago')) return now - num * 3600 * 1000;
  if (text.includes('day') || text.includes('d ago')) return now - num * 86400 * 1000;
  if (text.includes('week') || text.includes('w ago')) return now - num * 7 * 86400 * 1000;
  if (text.includes('month')) return now - num * 30 * 86400 * 1000;
  return now - 30 * 86400 * 1000;
}

// Helper to extract or estimate timestamp for incidents
export function getIncidentTimestamp(incident: IncidentReport): number {
  if (typeof incident.createdTimestamp === 'number' && !isNaN(incident.createdTimestamp) && incident.createdTimestamp > 0) {
    return incident.createdTimestamp;
  }
  const idMatch = incident.id.match(/\b\d{12,14}\b/);
  if (idMatch) {
    const parsed = parseInt(idMatch[0], 10);
    if (!isNaN(parsed) && parsed > 1700000000000) return parsed;
  }
  const text = (incident.createdAt || '').toLowerCase();
  const now = Date.now();
  if (text.includes('just now')) return now;
  const numMatch = text.match(/\d+/);
  const num = numMatch ? parseInt(numMatch[0], 10) : 1;
  if (text.includes('min') || text.includes('m ago')) return now - num * 60 * 1000;
  if (text.includes('hour') || text.includes('h ago')) return now - num * 3600 * 1000;
  if (text.includes('day') || text.includes('d ago')) return now - num * 86400 * 1000;
  if (text.includes('week') || text.includes('w ago')) return now - num * 7 * 86400 * 1000;
  return now - 30 * 86400 * 1000;
}

// Exportable sort function ensuring newest incidents are always first
export function sortIncidentsByMostRecent(incidents: IncidentReport[]): IncidentReport[] {
  return [...incidents].sort((a, b) => getIncidentTimestamp(b) - getIncidentTimestamp(a));
}

// Exportable sort function ensuring newest items are always first
export function sortStoriesByMostRecent(stories: BraveStory[]): BraveStory[] {
  return [...stories].sort((a, b) => getStoryTimestamp(b) - getStoryTimestamp(a));
}

// Dynamic user-friendly relative time formatter
export function formatTimeAgo(timestamp?: number, fallbackStr?: string): string {
  if (!timestamp) return fallbackStr || 'Recently';
  const diff = Date.now() - timestamp;
  if (diff < 0) return 'Just now';
  if (diff < 60 * 1000) return 'Just now';
  const mins = Math.floor(diff / (60 * 1000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / (3600 * 1000));
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / (86400 * 1000));
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

// Local Repository for Instant Interactivity & Multi-Role Persistence
class LocalStore {
  private incidentsKey = 'cybervigil_incidents_store';
  private storiesKey = 'cybervigil_stories_store';

  getIncidents(): IncidentReport[] {
    const saved = localStorage.getItem(this.incidentsKey);
    if (!saved) {
      const initialSorted = sortIncidentsByMostRecent(INITIAL_INCIDENTS);
      localStorage.setItem(this.incidentsKey, JSON.stringify(initialSorted));
      return initialSorted;
    }
    try {
      const parsed: IncidentReport[] = JSON.parse(saved);
      const sanitized = parsed.map(inc => ({
        ...inc,
        createdTimestamp: getIncidentTimestamp(inc)
      }));
      return sortIncidentsByMostRecent(sanitized);
    } catch (err) {
      console.error('Error loading incidents from localStore:', err);
      const initialSorted = sortIncidentsByMostRecent(INITIAL_INCIDENTS);
      localStorage.setItem(this.incidentsKey, JSON.stringify(initialSorted));
      return initialSorted;
    }
  }

  saveIncident(incident: IncidentReport): IncidentReport {
    const now = incident.createdTimestamp || Date.now();
    const incidentWithTimestamp: IncidentReport = {
      ...incident,
      createdTimestamp: now,
      createdAt: incident.createdAt || 'Just now',
    };

    const current = this.getIncidents();
    const updated = sortIncidentsByMostRecent([
      incidentWithTimestamp,
      ...current.filter(i => i.id !== incident.id)
    ]);
    localStorage.setItem(this.incidentsKey, JSON.stringify(updated));

    // Multi-tab and in-tab live event broadcast
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('cybervigil_incidents_updated', { detail: incidentWithTimestamp }));
      } catch (e) {}
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('cybervigil_channel');
          bc.postMessage({ type: 'INCIDENTS_UPDATED', incident: incidentWithTimestamp });
          bc.close();
        }
      } catch (e) {}
    }

    // Sync with local server API (for cross-browser / incognito dev synchronization)
    if (typeof fetch !== 'undefined') {
      fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(() => {});
    }

    return incidentWithTimestamp;
  }

  updateIncident(id: string, updates: Partial<IncidentReport>): IncidentReport | null {
    const current = this.getIncidents();
    const index = current.findIndex(item => item.id === id);
    if (index === -1) return null;
    current[index] = { ...current[index], ...updates };
    const updated = sortIncidentsByMostRecent(current);
    localStorage.setItem(this.incidentsKey, JSON.stringify(updated));

    const updatedIncident = current[index];

    // Multi-tab and in-tab live event broadcast
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('cybervigil_incidents_updated', { detail: updatedIncident }));
      } catch (e) {}
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('cybervigil_channel');
          bc.postMessage({ type: 'INCIDENTS_UPDATED', incident: updatedIncident });
          bc.close();
        }
      } catch (e) {}
    }

    // Sync with local server API
    if (typeof fetch !== 'undefined') {
      fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(() => {});
    }

    return updatedIncident;
  }

  async syncIncidentsWithServer(): Promise<IncidentReport[]> {
    if (typeof fetch === 'undefined') return this.getIncidents();
    try {
      const res = await fetch('/api/incidents');
      if (!res.ok) return this.getIncidents();
      const serverIncidents: IncidentReport[] = await res.json();
      if (!Array.isArray(serverIncidents) || serverIncidents.length === 0) {
        const current = this.getIncidents();
        fetch('/api/incidents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(current)
        }).catch(() => {});
        return current;
      }

      const local = this.getIncidents();
      const mergedMap = new Map<string, IncidentReport>();
      for (const item of local) {
        mergedMap.set(item.id, item);
      }
      for (const item of serverIncidents) {
        if (!mergedMap.has(item.id)) {
          mergedMap.set(item.id, item);
        } else {
          const existing = mergedMap.get(item.id)!;
          mergedMap.set(item.id, { ...existing, ...item });
        }
      }
      const sorted = sortIncidentsByMostRecent(Array.from(mergedMap.values()));
      localStorage.setItem(this.incidentsKey, JSON.stringify(sorted));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cybervigil_incidents_updated'));
      }
      return sorted;
    } catch (e) {
      return this.getIncidents();
    }
  }

  getStories(): BraveStory[] {
    const saved = localStorage.getItem(this.storiesKey);
    if (!saved) {
      const initialSorted = sortStoriesByMostRecent(INITIAL_STORIES);
      localStorage.setItem(this.storiesKey, JSON.stringify(initialSorted));
      return initialSorted;
    }
    try {
      const parsed: BraveStory[] = JSON.parse(saved);
      // Ensure all stories have initialized arrays and timestamps
      const sanitized = parsed.map(s => ({
        ...s,
        createdAt: getStoryTimestamp(s),
        replies: s.replies || []
      }));
      // Sort descending by most recent
      const sorted = sortStoriesByMostRecent(sanitized);
      return sorted;
    } catch (err) {
      console.error('Error loading stories from localStore:', err);
      const initialSorted = sortStoriesByMostRecent(INITIAL_STORIES);
      localStorage.setItem(this.storiesKey, JSON.stringify(initialSorted));
      return initialSorted;
    }
  }

  saveStory(story: BraveStory): BraveStory {
    const now = story.createdAt || Date.now();
    const storyWithTimestamp: BraveStory = {
      ...story,
      createdAt: now,
      timeAgo: story.timeAgo || 'Just now',
      replies: story.replies || []
    };

    const current = this.getStories();
    // Filter out existing copy if any (e.g. edit/update) and place new story at the top sorted
    const updated = sortStoriesByMostRecent([
      storyWithTimestamp,
      ...current.filter(s => s.id !== story.id)
    ]);
    localStorage.setItem(this.storiesKey, JSON.stringify(updated));

    // Multi-tab and in-tab live event broadcast
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('cybervigil_stories_updated', { detail: storyWithTimestamp }));
      } catch (e) {}
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('cybervigil_channel');
          bc.postMessage({ type: 'STORIES_UPDATED', story: storyWithTimestamp });
          bc.close();
        }
      } catch (e) {}
    }

    // Sync with local server API (for cross-browser / incognito dev synchronization)
    if (typeof fetch !== 'undefined') {
      fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(() => {});
    }

    return storyWithTimestamp;
  }

  async syncWithServer(): Promise<BraveStory[]> {
    if (typeof fetch === 'undefined') return this.getStories();
    try {
      const res = await fetch('/api/stories');
      if (!res.ok) return this.getStories();
      const serverStories: BraveStory[] = await res.json();
      if (!Array.isArray(serverStories) || serverStories.length === 0) {
        // Push local stories to server if server is empty
        const current = this.getStories();
        fetch('/api/stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(current)
        }).catch(() => {});
        return current;
      }

      // Merge server stories with local stories preserving user submissions
      const local = this.getStories();
      const mergedMap = new Map<string, BraveStory>();
      for (const item of local) {
        mergedMap.set(item.id, item);
      }
      for (const item of serverStories) {
        if (!mergedMap.has(item.id)) {
          mergedMap.set(item.id, item);
        } else {
          const existing = mergedMap.get(item.id)!;
          if ((item.replies?.length || 0) >= (existing.replies?.length || 0)) {
            mergedMap.set(item.id, { ...existing, ...item });
          }
        }
      }
      const sorted = sortStoriesByMostRecent(Array.from(mergedMap.values()));
      localStorage.setItem(this.storiesKey, JSON.stringify(sorted));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cybervigil_stories_updated'));
      }
      return sorted;
    } catch (e) {
      return this.getStories();
    }
  }

  toggleStorySupport(id: string): BraveStory | null {
    const current = this.getStories();
    const story = current.find(s => s.id === id);
    if (!story) return null;
    story.userSupported = !story.userSupported;
    story.supportCount += story.userSupported ? 1 : -1;
    localStorage.setItem(this.storiesKey, JSON.stringify(current));
    this.broadcastUpdate(story);
    return story;
  }

  toggleStoryVote(id: string): BraveStory | null {
    const current = this.getStories();
    const story = current.find(s => s.id === id);
    if (!story) return null;
    story.userVoted = !story.userVoted;
    story.votesCount = (story.votesCount || 0) + (story.userVoted ? 1 : -1);
    localStorage.setItem(this.storiesKey, JSON.stringify(current));
    this.broadcastUpdate(story);
    return story;
  }

  addStoryReply(storyId: string, reply: { authorAlias: string; authorRole?: StoryReply['authorRole']; text: string }): BraveStory | null {
    const current = this.getStories();
    const story = current.find(s => s.id === storyId);
    if (!story) return null;
    const newReply: StoryReply = {
      id: `reply-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      storyId,
      authorAlias: reply.authorAlias || 'Anonymous Defender',
      authorRole: reply.authorRole || 'community',
      text: reply.text,
      timeAgo: 'Just now',
      votesCount: 1,
      userVoted: true,
      isVerified: reply.authorRole === 'officer' || reply.authorRole === 'counselor'
    };
    story.replies = [newReply, ...(story.replies || [])];
    story.answersCount = story.replies.length;
    localStorage.setItem(this.storiesKey, JSON.stringify(current));
    this.broadcastUpdate(story);
    return story;
  }

  toggleReplyVote(storyId: string, replyId: string): BraveStory | null {
    const current = this.getStories();
    const story = current.find(s => s.id === storyId);
    if (!story || !story.replies) return null;
    const reply = story.replies.find(r => r.id === replyId);
    if (!reply) return null;
    reply.userVoted = !reply.userVoted;
    reply.votesCount += reply.userVoted ? 1 : -1;
    localStorage.setItem(this.storiesKey, JSON.stringify(current));
    this.broadcastUpdate(story);
    return story;
  }

  toggleStorySave(id: string): BraveStory | null {
    const current = this.getStories();
    const story = current.find(s => s.id === id);
    if (!story) return null;
    story.isSaved = !story.isSaved;
    localStorage.setItem(this.storiesKey, JSON.stringify(current));
    this.broadcastUpdate(story);
    return story;
  }

  private broadcastUpdate(story: BraveStory) {
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('cybervigil_stories_updated', { detail: story }));
      } catch (e) {}
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel('cybervigil_channel');
          bc.postMessage({ type: 'STORIES_UPDATED', story });
          bc.close();
        }
      } catch (e) {}
    }
    const current = this.getStories();
    if (typeof fetch !== 'undefined') {
      fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current)
      }).catch(() => {});
    }
  }
}

export const localStore = new LocalStore();

