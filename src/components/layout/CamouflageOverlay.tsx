import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Bookmark, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  User,
  GraduationCap,
  School,
  Play,
  Pause,
  Volume2,
  ThumbsUp,
  Share2,
  Code,
  Terminal,
  FileText,
  Settings,
  Tv,
  HelpCircle,
  Award,
  Star,
  Bell,
  MessageSquare,
  MoreVertical,
  Layers,
  ChevronDown
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export type CamouflagePersona = 'primary' | 'secondary' | 'college' | 'youtube';

interface CamouflageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const PERSONA_STORAGE_KEY = 'cybervigil_camouflage_persona';

export const CamouflageOverlay: React.FC<CamouflageOverlayProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Persona configuration (Persisted in localStorage)
  const [persona, setPersona] = useState<CamouflagePersona>('secondary');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Primary School State (Class 4)
  const [primarySubject, setPrimarySubject] = useState<'evs' | 'math' | 'english'>('evs');
  const [primaryQuizAnswer, setPrimaryQuizAnswer] = useState<number | null>(null);
  const [kidStars, setKidStars] = useState<number>(3);

  // 2. High School State (Class 10)
  const [secondarySubject, setSecondarySubject] = useState<'biology' | 'physics' | 'math'>('biology');
  const [secondaryTopic, setSecondaryTopic] = useState<string>('6.2 Respiration');
  const [conceptCheckRevealed, setConceptCheckRevealed] = useState<boolean>(false);

  // 3. College State (CampusLMS)
  const [collegeTab, setCollegeTab] = useState<'notes' | 'code' | 'assignments'>('notes');
  const [codeRunning, setCodeRunning] = useState<boolean>(false);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);

  // 4. YouTube Mode State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoLikes, setVideoLikes] = useState<number>(142850);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>('dsa');
  const [userComment, setUserComment] = useState<string>('');
  const [commentsList, setCommentsList] = useState<string[]>([
    "This explained Dijkstra's algorithm and recursion better than my entire 3rd semester professor!",
    "Timestamp 18:42 is literally on tomorrow's mid-term examination syllabus. Thank you!",
    "Best roadmap video for 2026 placements. Subscribed!"
  ]);

  // Load saved persona or default based on user account education level
  useEffect(() => {
    const saved = localStorage.getItem(PERSONA_STORAGE_KEY) as CamouflagePersona | null;
    if (saved && ['primary', 'secondary', 'college', 'youtube'].includes(saved)) {
      setPersona(saved);
    } else if (user?.educationLevel) {
      if (user.educationLevel.toLowerCase().includes('class 4') || user.educationLevel.toLowerCase().includes('class 5')) {
        setPersona('primary');
      } else if (user.educationLevel.toLowerCase().includes('college') || user.educationLevel.toLowerCase().includes('university')) {
        setPersona('college');
      } else {
        setPersona('secondary');
      }
    }
  }, [user]);

  const handleSelectPersona = (p: CamouflagePersona) => {
    setPersona(p);
    localStorage.setItem(PERSONA_STORAGE_KEY, p);
    setProfileDropdownOpen(false);
  };

  const handleLikeVideo = () => {
    if (hasLiked) {
      setVideoLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setVideoLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setCommentsList(prev => [userComment, ...prev]);
    setUserComment('');
  };

  const handleRunCode = () => {
    setCodeRunning(true);
    setCodeOutput(null);
    setTimeout(() => {
      setCodeRunning(false);
      setCodeOutput('>>> Compiling dijkstra_graph.py\n✓ [Test 1] Graph initialization: Passed (4ms)\n✓ [Test 2] PriorityQueue min-heap extraction: Passed (6ms)\n✓ [Test 3] Shortest path DAG with 10,000 vertices: Passed (14ms)\n=======================================================\nAll 15/15 unit tests passed. Memory usage: 16.4 MB (0 errors)');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#f8fafc] text-slate-800 z-[9999] overflow-y-auto font-sans animate-in fade-in duration-100 flex flex-col select-text [color-scheme:light] light">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER - STYLED EXACTLY PER PERSONA (NO VISIBLE RESUME BUTTON)     */}
      {/* ========================================================================= */}
      
      {persona === 'youtube' ? (
        /* YouTube Styled Header */
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between sticky top-0 z-50 shadow-xs">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <div className="w-8 h-6 rounded-md bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
              <div className="flex items-center">
                <span className="font-extrabold text-lg tracking-tighter text-slate-900">YouTube</span>
                <span className="text-[10px] text-slate-400 font-bold ml-1">IN</span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="hidden sm:flex items-center w-full max-w-lg mx-4">
            <div className="flex items-center w-full bg-slate-100 border border-slate-300 rounded-l-full px-4 py-1.5 focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lectures, tutorials, exam revision..."
                className="w-full bg-transparent text-xs sm:text-sm focus:outline-hidden text-slate-800"
              />
            </div>
            <button className="bg-slate-100 hover:bg-slate-200 border border-l-0 border-slate-300 px-5 py-2 rounded-r-full text-slate-600 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Account & Profile Menu (Houses disguised Return to Session) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs hover:ring-2 hover:ring-indigo-300 transition-all"
                title="Account Settings"
              >
                A
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && renderProfileDropdown()}
            </div>
          </div>
        </header>
      ) : persona === 'primary' ? (
        /* Primary School (Class 4) Header */
        <header className="bg-white border-b-2 border-amber-200 px-4 sm:px-8 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-extrabold text-sm shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-amber-950">
                  NCERT Vidyalaya
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Class 4 (Looking Around)
                </span>
              </div>
            </div>
          </div>

          {/* Subject Tabs */}
          <div className="hidden md:flex items-center gap-1.5 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs">
            <button
              onClick={() => setPrimarySubject('evs')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                primarySubject === 'evs' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-amber-800 hover:bg-amber-100'
              }`}
            >
              🌱 EVS (Looking Around)
            </button>
            <button
              onClick={() => setPrimarySubject('math')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                primarySubject === 'math' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-amber-800 hover:bg-amber-100'
              }`}
            >
              📐 Math-Magic
            </button>
            <button
              onClick={() => setPrimarySubject('english')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                primarySubject === 'english' ? 'bg-amber-400 text-amber-950 shadow-xs' : 'text-amber-800 hover:bg-amber-100'
              }`}
            >
              📖 English Marigold
            </button>
          </div>

          {/* Profile Trigger */}
          <div className="relative flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{kidStars} Stars</span>
            </div>

            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-8 h-8 rounded-full bg-amber-200 text-amber-950 font-extrabold text-xs flex items-center justify-center border border-amber-300 shadow-xs hover:ring-2 hover:ring-amber-400"
              title="Student Profile"
            >
              AS
            </button>

            {profileDropdownOpen && renderProfileDropdown()}
          </div>
        </header>
      ) : persona === 'college' ? (
        /* College / University LMS Header */
        <header className="bg-[#1e293b] text-slate-100 border-b border-slate-700 px-4 sm:px-8 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">CampusLMS</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    B.Tech CSE • Semester VI
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 pl-4 border-l border-slate-700">
              <span>Courses</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span>Computer Science</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-200">CS301: Design & Analysis of Algorithms</span>
            </div>
          </div>

          {/* College Sub-Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setCollegeTab('notes')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                collegeTab === 'notes' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lecture Notes
            </button>
            <button
              onClick={() => setCollegeTab('code')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                collegeTab === 'code' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Lab Code Runner
            </button>
            <button
              onClick={() => setCollegeTab('assignments')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                collegeTab === 'assignments' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Assignments (2)
            </button>
          </div>

          {/* Profile Trigger */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-8 h-8 rounded-full bg-slate-700 text-sky-400 border border-slate-600 flex items-center justify-center font-bold text-xs shadow-xs hover:border-sky-400 transition-colors"
              title="Student Portal"
            >
              HV
            </button>

            {profileDropdownOpen && renderProfileDropdown()}
          </div>
        </header>
      ) : (
        /* Secondary (Class 10 CBSE) Default Header */
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                NCERT e-Pathshala
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                CBSE Class 10
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 pl-4 border-l border-slate-200">
              <span>Science</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span>Unit II: World of Living</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-800">Chapter 6: Life Processes</span>
            </div>
          </div>

          {/* Center Search */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 w-72">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search textbook topics, formulas..."
              className="bg-transparent text-xs text-slate-700 focus:outline-hidden w-full"
            />
          </div>

          {/* Right Subject Switcher & Profile Trigger */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setSecondarySubject('biology')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  secondarySubject === 'biology' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Biology
              </button>
              <button
                onClick={() => setSecondarySubject('physics')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  secondarySubject === 'physics' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Physics
              </button>
              <button
                onClick={() => setSecondarySubject('math')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  secondarySubject === 'math' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mathematics
              </button>
            </div>

            {/* Profile Trigger */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center shadow-xs hover:ring-2 hover:ring-emerald-300"
                title="Student Dashboard"
              >
                PP
              </button>

              {profileDropdownOpen && renderProfileDropdown()}
            </div>
          </div>
        </header>
      )}

      {/* ========================================================================= */}
      {/* 2. BODY CONTENT CONTAINER                                                 */}
      {/* ========================================================================= */}

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {persona === 'youtube' ? (
          renderYouTubeView()
        ) : persona === 'primary' ? (
          renderPrimarySchoolView()
        ) : persona === 'college' ? (
          renderCollegeLmsView()
        ) : (
          renderSecondarySchoolView()
        )}
      </div>
    </div>
  );

  /* ------------------------------------------------------------------------- */
  /* ACCOUNT PROFILE DROPDOWN (HOUSES PERSONA SELECTOR & HIDDEN RETURN BUTTON) */
  /* ------------------------------------------------------------------------- */
  function renderProfileDropdown() {
    return (
      <div 
        className="fixed top-14 right-4 sm:right-8 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 z-[100] text-xs font-medium space-y-3 animate-in fade-in max-h-[85vh] overflow-y-auto"
      >
        {/* User Persona Details */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900 text-sm">
              {user?.alias || (persona === 'primary' ? 'Aarav Sharma' : persona === 'college' ? 'Himanshu Verma' : persona === 'youtube' ? 'StudyDesk Official' : 'Priya Patel')}
            </p>
            <p className="text-[11px] text-slate-500 font-semibold">
              {persona === 'primary' ? 'Class 4-A • NCERT Primary' : persona === 'college' ? 'Reg #2023CSB1042 • Campus LMS' : persona === 'youtube' ? 'Personal Learning Stream' : 'CBSE Class 10-C • Secondary Science'}
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Disguise Session Active"></span>
        </div>

        {/* Camouflage Persona / Grade Selector */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Camouflage Disguise Persona
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleSelectPersona('primary')}
              className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                persona === 'primary' ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-sm">🧸</span>
              <div>
                <span className="block text-[11px]">Class 4</span>
                <span className="text-[9px] text-slate-400">Primary EVS</span>
              </div>
            </button>

            <button
              onClick={() => handleSelectPersona('secondary')}
              className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                persona === 'secondary' ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-sm">🔬</span>
              <div>
                <span className="block text-[11px]">Class 10</span>
                <span className="text-[9px] text-slate-400">CBSE Science</span>
              </div>
            </button>

            <button
              onClick={() => handleSelectPersona('college')}
              className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                persona === 'college' ? 'bg-sky-50 border-sky-300 text-sky-950 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-sm">🎓</span>
              <div>
                <span className="block text-[11px]">College</span>
                <span className="text-[9px] text-slate-400">Campus LMS</span>
              </div>
            </button>

            <button
              onClick={() => handleSelectPersona('youtube')}
              className={`p-2 rounded-lg border text-left flex items-center gap-1.5 transition-colors ${
                persona === 'youtube' ? 'bg-red-50 border-red-300 text-red-950 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="text-sm">📺</span>
              <div>
                <span className="block text-[11px]">YouTube</span>
                <span className="text-[9px] text-slate-400">Video Player</span>
              </div>
            </button>
          </div>
        </div>

        {/* Academic Settings Links */}
        <div className="space-y-0.5 border-t border-slate-100 pt-2 text-slate-600">
          <button className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs">
            <span>Saved Course Notes</span>
            <span className="text-[10px] text-slate-400">12 Files</span>
          </button>
          <button className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs">
            <span>Cloud Sync Status</span>
            <span className="text-[10px] text-emerald-600">Up to date</span>
          </button>
        </div>

        {/* DISCREET RETURN TO SESSION (Not visible on main page, maintains shortcut ESC) */}
        <div className="border-t border-slate-100 pt-2">
          <button
            onClick={onClose}
            className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-between transition-colors"
            title="Resume CyberVigil Session (ESC)"
          >
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Return to Active Session</span>
            </span>
            <span className="font-mono text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
              ESC
            </span>
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------- */
  /* 1. PRIMARY SCHOOL VIEW (CLASS 4 - EVS & MATH)                             */
  /* ------------------------------------------------------------------------- */
  function renderPrimarySchoolView() {
    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 font-extrabold text-xs">
              🌟 Unit 1: Nature & Friends Around Us
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight">
              Chapter 1: Going to School Every Day!
            </h1>
            <p className="text-xs sm:text-sm text-amber-900/80 max-w-xl">
              Let us travel across India and see how children reach school across rivers, snow, deserts, and jungles!
            </p>
          </div>
          <div className="w-24 h-24 rounded-2xl bg-amber-200 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
            🎒
          </div>
        </div>

        {/* 3 Travel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-xs space-y-3 hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-2xl flex items-center justify-center">
              🎋
            </div>
            <h2 className="font-bold text-base text-slate-900">1. Bamboo Bridge (Assam)</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              It rains so much where we live! Sometimes water is knee-deep. We hold our books in one hand and bamboo with the other to cross safely.
            </p>
            <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Heavy Rainfall Region
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-xs space-y-3 hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-2xl flex items-center justify-center">
              🚣
            </div>
            <h2 className="font-bold text-base text-slate-900">2. The Vallam Boat (Kerala)</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              In parts of Kerala, we use a small wooden boat called a <strong>Vallam</strong> to cross rivers and canals to reach our school on time.
            </p>
            <span className="inline-block text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
              Backwaters of India
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-xs space-y-3 hover:border-amber-300 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-2xl flex items-center justify-center">
              🐪
            </div>
            <h2 className="font-bold text-base text-slate-900">3. Camel-Cart (Rajasthan)</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We live in the desert. There is yellow sand all around! It gets very hot during the day. We ride in a camel-cart to reach our classes.
            </p>
            <span className="inline-block text-[11px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full">
              Thar Desert Habitat
            </span>
          </div>
        </div>

        {/* Interactive Kid Mini-Quiz */}
        <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Interactive Quick Question: Animal Friends</span>
            </h3>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Earn 1 Star
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Which of these animals lay eggs and have holes instead of big visible ears on their head?
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
            {[
              { id: 0, label: 'Cow & Buffalo', correct: false },
              { id: 1, label: 'Birds & Frogs', correct: true },
              { id: 2, label: 'Elephant', correct: false },
              { id: 3, label: 'Tiger & Deer', correct: false },
            ].map((choice) => (
              <button
                key={choice.id}
                onClick={() => {
                  setPrimaryQuizAnswer(choice.id);
                  if (choice.correct) setKidStars(prev => prev + 1);
                }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  primaryQuizAnswer === choice.id
                    ? choice.correct
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 scale-102'
                      : 'bg-rose-100 border-rose-300 text-rose-950'
                    : 'bg-slate-50 border-slate-200 hover:bg-amber-50 text-slate-800'
                }`}
              >
                {choice.label}
              </button>
            ))}
          </div>

          {primaryQuizAnswer !== null && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              primaryQuizAnswer === 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {primaryQuizAnswer === 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>⭐ Correct! Birds have tiny ear holes covered with feathers and lay eggs!</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-rose-500" />
                  <span>Try again! Think about animals with feathers!</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------- */
  /* 2. SECONDARY SCHOOL VIEW (CBSE CLASS 10 - SCIENCE & MATH)                 */
  /* ------------------------------------------------------------------------- */
  function renderSecondarySchoolView() {
    const topicsMap = {
      biology: [
        { id: '6.1 Autotrophic Nutrition', title: '6.1 Autotrophic Nutrition (Photosynthesis)', readTime: '12 min' },
        { id: '6.2 Respiration', title: '6.2 Respiration: Aerobic & Anaerobic Pathways', readTime: '18 min' },
        { id: '6.3 Transportation in Humans', title: '6.3 Transportation: Human Heart & Lymph', readTime: '15 min' },
        { id: '6.4 Excretion in Humans', title: '6.4 Excretion: Structure of Nephron', readTime: '14 min' },
      ],
      physics: [
        { id: '12.1 Ohms Law', title: "12.1 Ohm's Law & Factors Affecting Resistance", readTime: '15 min' },
        { id: '12.2 Series and Parallel', title: '12.2 Resistors in Series & Parallel Combination', readTime: '20 min' },
        { id: '12.3 Joules Heating', title: "12.3 Joule's Heating Effect & Heating Appliances", readTime: '14 min' },
        { id: '13.1 Magnetic Fields', title: '13.1 Magnetic Field Lines & Right-Hand Thumb Rule', readTime: '16 min' },
      ],
      math: [
        { id: '4.1 Quadratic Equations', title: '4.1 Quadratic Equations & Discriminant Method', readTime: '18 min' },
        { id: '4.2 Arithmetic Progressions', title: '4.2 Arithmetic Progressions (AP) nth Term & Sum', readTime: '22 min' },
        { id: '8.1 Trigonometric Ratios', title: '8.1 Trigonometric Identities & Ratios', readTime: '25 min' },
        { id: '9.1 Heights and Distances', title: '9.1 Applications of Trigonometry: Heights & Distances', readTime: '15 min' },
      ]
    };

    const currentTopics = topicsMap[secondarySubject] || topicsMap.biology;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
        {/* Left Syllabus Index */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {secondarySubject.toUpperCase()} Syllabus
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">CBSE 2026</span>
            </div>

            <nav className="space-y-1 text-xs">
              {currentTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSecondaryTopic(topic.id)}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start justify-between cursor-pointer ${
                    secondaryTopic === topic.id || secondaryTopic.includes(topic.id.slice(0, 3))
                      ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="leading-snug pr-2">{topic.title}</span>
                  <span className="text-[10px] text-slate-500 font-medium flex-shrink-0 mt-0.5">{topic.readTime}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <p className="font-bold flex items-center gap-1 text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Board Exam Tip (CBSE 2026):
            </p>
            <p className="text-amber-800 leading-relaxed">
              {secondarySubject === 'physics'
                ? "3-mark numericals on calculating equivalent resistance in parallel circuit and heat energy H=I²Rt are guaranteed."
                : secondarySubject === 'math'
                ? "Questions proving trigonometric identities sin²θ+cos²θ=1 and AP sum formula S_n carry 5 full marks in Section D."
                : "Questions comparing glucose breakdown pathways in yeast vs muscle cells carry 3 to 5 marks every year."}
            </p>
          </div>
        </aside>

        {/* Main Article Canvas */}
        <main className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 text-slate-900">
          {secondarySubject === 'biology' && (
            <article className="space-y-6">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  NCERT Class 10 Science • Biology Section
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {secondaryTopic.includes('6.1') 
                    ? '6.1 Autotrophic Nutrition — Photosynthesis & Chloroplasts' 
                    : secondaryTopic.includes('6.3') 
                    ? '6.3 Transportation — Human Circulatory System & Heart' 
                    : secondaryTopic.includes('6.4') 
                    ? '6.4 Excretion — Structure & Function of Nephron' 
                    : '6.2 Respiration — Aerobic & Anaerobic Pathways'}
                </h1>
                <p className="text-xs text-slate-500">
                  Prescribed curriculum under NCERT Directorate • Updated for 2025–26 Academic Year
                </p>
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
                {secondaryTopic.includes('6.1') ? (
                  <>
                    <p>
                      Autotrophic nutrition is a process where organisms prepare their own food from simple inorganic materials like carbon dioxide and water in the presence of sunlight and chlorophyll. Green plants and autotrophic bacteria carry out this process.
                    </p>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 font-mono text-xs sm:text-sm space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-sans font-bold text-emerald-800 uppercase border-b border-emerald-200 pb-1">
                        <span>Photosynthesis Biochemical Equation</span>
                        <span className="text-emerald-700">Light Reaction Yield</span>
                      </div>
                      <p className="text-emerald-950 font-bold leading-relaxed pt-1">
                        6 CO₂ + 12 H₂O ──[Chlorophyll + Sunlight]──&gt; C₆H₁₂O₆ + 6 O₂ + 6 H₂O
                      </p>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 pt-1">
                      Three Main Steps of Photosynthesis:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">1. Light Absorption</span>
                        <p className="text-slate-600">Absorption of light energy by chlorophyll pigment inside chloroplasts.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">2. Water Splitting</span>
                        <p className="text-slate-600">Conversion of light energy to chemical energy and splitting of H₂O into H₂ and O₂.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                        <span className="font-bold text-emerald-950 block border-b border-emerald-200 pb-1">3. CO₂ Reduction</span>
                        <p className="text-emerald-900">Reduction of carbon dioxide to carbohydrates (Glucose).</p>
                      </div>
                    </div>
                  </>
                ) : secondaryTopic.includes('6.3') ? (
                  <>
                    <p>
                      In human beings, the circulatory system consists of the heart, blood vessels (arteries, veins, capillaries), and blood. The human heart is a muscular organ with four distinct chambers preventing oxygen-rich blood from mixing with carbon dioxide-rich blood.
                    </p>
                    <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-2 text-xs">
                      <span className="font-bold text-sky-900 text-sm block border-b border-sky-200 pb-1">Double Circulation Mechanics</span>
                      <p className="text-sky-950 leading-relaxed">
                        Blood goes through the heart twice during each cycle in the body. Pulmonary circulation carries deoxygenated blood to lungs, while Systemic circulation pumps oxygenated blood to body tissues.
                      </p>
                    </div>
                  </>
                ) : secondaryTopic.includes('6.4') ? (
                  <>
                    <p>
                      The excretory system of human beings includes a pair of kidneys, a pair of ureters, a urinary bladder, and a urethra. Each kidney contains basic filtration units called <strong>Nephrons</strong>.
                    </p>
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-2 text-xs">
                      <span className="font-bold text-purple-900 text-sm block border-b border-purple-200 pb-1">Selective Reabsorption in Bowman's Capsule</span>
                      <p className="text-purple-950 leading-relaxed">
                        As the initial filtrate moves through the nephron tubule, useful substances like glucose, amino acids, salts, and major water are selectively reabsorbed back into capillaries.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      We have discussed nutrition in organisms in the previous section. The food material taken in during the process of nutrition is used in cells to provide energy for various life processes. Diverse organisms do this in different ways — some use oxygen to break-down glucose completely into carbon dioxide and water, some use other pathways that do not involve oxygen.
                    </p>

                    {/* Biochemical Equation */}
                    <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 font-mono text-xs sm:text-sm space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-sans font-bold text-slate-700 uppercase border-b border-slate-200 pb-1">
                        <span>Summary Biochemical Equation</span>
                        <span className="text-emerald-700">Net ATP Yield: ~38 ATP</span>
                      </div>
                      <p className="text-slate-900 font-bold leading-relaxed pt-1">
                        C₆H₁₂O₆ (Glucose) + 6 O₂ ⟶ 6 CO₂ + 6 H₂O + Energy (Stored as ATP)
                      </p>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 pt-1">
                      Breakdown of Glucose by Various Pathways:
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                          1. Absence of Oxygen (In Yeast)
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          Ethanol + Carbon dioxide + Energy (2 ATP). Known as <strong>fermentation</strong> under anaerobic conditions.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                          2. Lack of Oxygen (In Muscle Cells)
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          Lactic acid + Energy. Build-up during sudden athletics causes muscle cramps.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                        <span className="font-bold text-emerald-950 block border-b border-emerald-200 pb-1">
                          3. Presence of Oxygen (Mitochondria)
                        </span>
                        <p className="text-emerald-900 leading-relaxed">
                          CO₂ + H₂O + Energy (~38 ATP). Provides baseline energy for human cellular mechanics.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Concept Check Accordion */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
                  <div 
                    onClick={() => setConceptCheckRevealed(!conceptCheckRevealed)}
                    className="flex items-center justify-between cursor-pointer font-bold text-blue-900"
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Concept Check: Why is ATP termed the energy currency of the cell?
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${conceptCheckRevealed ? 'rotate-180' : ''}`} />
                  </div>
                  {conceptCheckRevealed && (
                    <p className="leading-relaxed text-slate-700 pt-2 border-t border-blue-200 animate-in fade-in">
                      ATP is broken down into ADP and inorganic phosphate, releasing approximately 30.5 kJ/mol of energy to drive endothermic metabolic reactions.
                    </p>
                  )}
                </div>
              </div>
            </article>
          )}

          {secondarySubject === 'physics' && (
            <article className="space-y-6">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  NCERT Class 10 Science • Physics Section
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Chapter 12: Electricity & Joule's Heating Effect
                </h1>
                <p className="text-xs text-slate-500">
                  Unit III: Effects of Current • Prescribed NCERT Curriculum
                </p>
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
                <p>
                  Electric current is expressed by the amount of charge flowing through a particular area in unit time. It is the rate of flow of electric charges. In circuits using metallic wires, electrons constitute the flow of charges.
                </p>

                {/* Fundamental Formulas Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 font-mono space-y-1.5">
                    <span className="text-xs font-sans font-bold text-blue-900 block border-b border-blue-200 pb-1 uppercase">
                      Ohm's Law Equation
                    </span>
                    <p className="text-xl font-bold text-blue-950 pt-1">V = I × R</p>
                    <p className="text-xs font-sans text-slate-600">
                      V: Potential Difference (Volts), I: Current (Amperes), R: Resistance (Ohms Ω).
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 font-mono space-y-1.5">
                    <span className="text-xs font-sans font-bold text-purple-900 block border-b border-purple-200 pb-1 uppercase">
                      Joule's Law of Heating
                    </span>
                    <p className="text-xl font-bold text-purple-950 pt-1">H = I² × R × t</p>
                    <p className="text-xs font-sans text-slate-600">
                      H: Heat generated (Joules), t: Time duration (seconds).
                    </p>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 pt-2">
                  Combination of Resistors: Series vs Parallel
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">
                      Series Combination (R_s = R₁ + R₂ + R₃)
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Current remains identical through each resistor. Overall circuit resistance increases. If one component fails, circuit breaks.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <span className="font-bold text-emerald-950 block border-b border-emerald-200 pb-1">
                      Parallel Combination (1/R_p = 1/R₁ + 1/R₂ + 1/R₃)
                    </span>
                    <p className="text-emerald-900 leading-relaxed">
                      Potential difference remains identical across all branches. Overall circuit resistance decreases. Household wiring is always parallel!
                    </p>
                  </div>
                </div>

                {/* Solved Board Exam Numerical */}
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-amber-400 font-sans font-bold border-b border-slate-800 pb-1 text-xs">
                    <span>NCERT Solved Board Numerical (3 Marks)</span>
                    <span>CBSE 2024 Exam Problem</span>
                  </div>
                  <p className="text-slate-300 font-sans font-medium">
                    <strong>Q:</strong> An electric iron of resistance 20 Ω takes a current of 5 A. Calculate the heat developed in 30 seconds.
                  </p>
                  <div className="pt-2 text-emerald-400 space-y-1">
                    <p>Given: R = 20 Ω, I = 5 A, t = 30 s</p>
                    <p>Formula: H = I² × R × t</p>
                    <p>Calculation: H = (5)² × 20 × 30 = 25 × 20 × 30 = 15,000 Joules (15 kJ)</p>
                    <p className="text-amber-300 font-bold">Answer: Heat generated = 1.5 × 10⁴ J</p>
                  </div>
                </div>

                {/* Concept Check Accordion */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
                  <div 
                    onClick={() => setConceptCheckRevealed(!conceptCheckRevealed)}
                    className="flex items-center justify-between cursor-pointer font-bold text-blue-900"
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Concept Check: Why is tungsten used almost exclusively for filaments of electric lamps?
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${conceptCheckRevealed ? 'rotate-180' : ''}`} />
                  </div>
                  {conceptCheckRevealed && (
                    <p className="leading-relaxed text-slate-700 pt-2 border-t border-blue-200/60 animate-in fade-in">
                      Tungsten has an extremely high melting point (3,380 °C) and high resistivity, allowing it to become white-hot and emit intense light without melting.
                    </p>
                  )}
                </div>
              </div>
            </article>
          )}

          {secondarySubject === 'math' && (
            <article className="space-y-6">
              <div className="space-y-1 border-b border-slate-200 pb-4">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                  NCERT Class 10 Mathematics • Algebra & Trigonometry
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Chapter 4 & 8: Quadratic Equations & Trigonometry
                </h1>
                <p className="text-xs text-slate-500">
                  Prescribed Curriculum under CBSE Board • Solved Formula Sheets
                </p>
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
                <p>
                  A quadratic equation in the variable x is an equation of the form ax² + bx + c = 0, where a, b, c are real numbers and a ≠ 0. The roots of the quadratic equation are given by the Sridharacharya Quadratic Formula.
                </p>

                {/* Quadratic Formula Card */}
                <div className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200 font-mono text-center space-y-2">
                  <span className="text-xs font-sans font-bold text-purple-900 uppercase tracking-wider block">
                    Quadratic Formula & Discriminant
                  </span>
                  <p className="text-2xl font-extrabold text-purple-950">
                    x = [ -b ± √(b² - 4ac) ] / 2a
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs font-sans font-bold text-slate-700 pt-2 border-t border-purple-200">
                    <span className="p-2 bg-white rounded-lg border">D &gt; 0: 2 Real & Distinct Roots</span>
                    <span className="p-2 bg-white rounded-lg border">D = 0: 2 Equal Real Roots</span>
                    <span className="p-2 bg-white rounded-lg border">D &lt; 0: No Real Roots</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 pt-2">
                  Chapter 8: Fundamental Trigonometric Identities
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-center">
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-bold">
                    sin²θ + cos²θ = 1
                  </div>
                  <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-950 font-bold">
                    1 + tan²θ = sec²θ
                  </div>
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-bold">
                    1 + cot²θ = cosec²θ
                  </div>
                </div>

                {/* Solved CBSE Board Math Question */}
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-purple-300 font-sans font-bold border-b border-slate-800 pb-1 text-xs">
                    <span>CBSE Board Exam Solved Proof (5 Marks)</span>
                    <span>Class 10 Standard Math</span>
                  </div>
                  <p className="text-slate-300 font-sans font-medium">
                    <strong>Prove:</strong> (sin A + cosec A)² + (cos A + sec A)² = 7 + tan² A + cot² A
                  </p>
                  <div className="pt-2 text-purple-300 space-y-1 text-[11px]">
                    <p>LHS = sin²A + cosec²A + 2(sin A)(1/sin A) + cos²A + sec²A + 2(cos A)(1/cos A)</p>
                    <p>= (sin²A + cos²A) + 2 + 2 + cosec²A + sec²A</p>
                    <p>= 1 + 4 + (1 + cot²A) + (1 + tan²A)</p>
                    <p className="text-emerald-400 font-bold">= 7 + tan²A + cot²A = RHS. Hence Proved!</p>
                  </div>
                </div>

                {/* Concept Check Accordion */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
                  <div 
                    onClick={() => setConceptCheckRevealed(!conceptCheckRevealed)}
                    className="flex items-center justify-between cursor-pointer font-bold text-blue-900"
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      Concept Check: What is the angle of elevation if a 10m pole casts a 10√3 m shadow?
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${conceptCheckRevealed ? 'rotate-180' : ''}`} />
                  </div>
                  {conceptCheckRevealed && (
                    <p className="leading-relaxed text-slate-700 pt-2 border-t border-blue-200/60 animate-in fade-in">
                      tan θ = Height / Shadow = 10 / (10√3) = 1/√3. Therefore, angle θ = 30°.
                    </p>
                  )}
                </div>
              </div>
            </article>
          )}
        </main>
      </div>
    );
  }

  /* ------------------------------------------------------------------------- */
  /* 3. COLLEGE / UNIVERSITY LMS VIEW (CAMPUS LMS - CS301 ALGORITHMS)          */
  /* ------------------------------------------------------------------------- */
  function renderCollegeLmsView() {
    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Course Header */}
        <div className="bg-[#0f172a] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded bg-sky-900/60 text-sky-400 border border-sky-800 font-mono">
              CS301 • 4.0 Credits
            </span>
            <span className="text-slate-400">Instructor: Prof. K. Ramanujan • Hall B-204</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Advanced Data Structures & Graph Algorithms
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Module IV: Shortest Path in Weighted Graphs (Dijkstra's Algorithm, Bellman-Ford & Fibonacci Heaps)
          </p>
        </div>

        {/* Content depending on selected college tab */}
        {collegeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900">Dijkstra's Algorithm Implementation Notes</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Given a weighted graph G = (V, E) with non-negative edge weights w(u, v) ≥ 0, Dijkstra's algorithm finds the shortest path from a source vertex s to all other vertices.
              </p>

              {/* Code Snippet */}
              <div className="bg-[#1e1e1e] text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 space-y-1">
                <p className="text-slate-500"># Dijkstra's Algorithm with Min-Heap Priority Queue</p>
                <p><span className="text-purple-400">import</span> heapq</p>
                <br />
                <p><span className="text-blue-400">def</span> <span className="text-yellow-300">dijkstra</span>(graph, source):</p>
                <p className="pl-4">distances = &#123;vertex: float(<span className="text-emerald-400">'inf'</span>) <span className="text-purple-400">for</span> vertex <span className="text-purple-400">in</span> graph&#125;</p>
                <p className="pl-4">distances[source] = <span className="text-orange-400">0</span></p>
                <p className="pl-4">pq = [(<span className="text-orange-400">0</span>, source)]</p>
                <br />
                <p className="pl-4"><span className="text-purple-400">while</span> pq:</p>
                <p className="pl-8">current_dist, u = heapq.heappop(pq)</p>
                <p className="pl-8"><span className="text-purple-400">if</span> current_dist &gt; distances[u]:</p>
                <p className="pl-12"><span className="text-purple-400">continue</span></p>
                <p className="pl-8"><span className="text-purple-400">for</span> v, weight <span className="text-purple-400">in</span> graph[u].items():</p>
                <p className="pl-12">distance = current_dist + weight</p>
                <p className="pl-12"><span className="text-purple-400">if</span> distance &lt; distances[v]:</p>
                <p className="pl-16">distances[v] = distance</p>
                <p className="pl-16">heapq.heappush(pq, (distance, v))</p>
                <p className="pl-4"><span className="text-purple-400">return</span> distances</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border text-xs space-y-1">
                <span className="font-bold text-slate-800">Time Complexity Analysis:</span>
                <p className="text-slate-600 font-mono">With Binary Min-Heap: O((V + E) log V)</p>
                <p className="text-slate-600 font-mono">With Fibonacci Heap: O(E + V log V)</p>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Academic Progress</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cumulative GPA:</span>
                    <span className="font-bold text-slate-800">8.94 / 10.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lab Attendance:</span>
                    <span className="font-bold text-emerald-700">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mid-Term Grade:</span>
                    <span className="font-bold text-slate-800">47 / 50 (94%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {collegeTab === 'code' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-600" />
                <span>CS301 Lab Terminal Simulator</span>
              </h2>
              <button
                onClick={handleRunCode}
                disabled={codeRunning}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{codeRunning ? 'Compiling...' : 'Run Test Cases'}</span>
              </button>
            </div>

            <div className="bg-[#0f172a] text-emerald-400 p-4 rounded-xl font-mono text-xs min-h-[160px] border border-slate-800">
              {codeRunning ? (
                <p className="animate-pulse text-slate-400">&gt; Compiling test_dijkstra.py in sandbox container...</p>
              ) : codeOutput ? (
                <pre className="whitespace-pre-wrap">{codeOutput}</pre>
              ) : (
                <p className="text-slate-500">&gt; Ready to execute test harness. Click "Run Test Cases" above.</p>
              )}
            </div>
          </div>
        )}

        {collegeTab === 'assignments' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">Active Course Submissions</h2>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Assignment 4: AVL Trees & Red-Black Invariant</h3>
                  <p className="text-slate-500">Submitted 2 days ago • Git Commit #7fa10c</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">Graded: 98/100</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Term Project: Distributed Consensus with Raft</h3>
                  <p className="text-slate-500">Due Friday, 23:59 IST • Partner: Arjun M.</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-800 font-bold">In Progress</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------------------------- */
  /* 4. YOUTUBE / VIDEO PORTAL VIEW (YOUTUBE STUDY STREAM)                     */
  /* ------------------------------------------------------------------------- */
  function renderYouTubeView() {
    const recommendedVideos = [
      {
        id: 'dsa',
        title: 'Full Course: Complete Data Structures & Algorithms in 8 Hours | Placement 2026',
        channel: 'CS Academy',
        views: '1.4M views',
        timeAgo: '3 weeks ago',
        duration: '48:15'
      },
      {
        id: 'cbse',
        title: 'CBSE Class 10 Science: Complete Biology in 1 Shot | Board Exam Preparation',
        channel: 'EdTech Revision',
        views: '620K views',
        timeAgo: '1 month ago',
        duration: '1:12:40'
      },
      {
        id: 'lofi',
        title: 'Lofi Hip Hop Radio - Beats to relax/study to [24/7 Live Stream]',
        channel: 'Lofi Girl',
        views: '42K watching',
        timeAgo: 'LIVE',
        duration: 'LIVE'
      },
      {
        id: 'mit',
        title: 'MIT 6.006: Introduction to Algorithms - Lecture 1 (Asymptotic Complexity)',
        channel: 'MIT OpenCourseWare',
        views: '2.1M views',
        timeAgo: '1 year ago',
        duration: '52:10'
      }
    ];

    const currentVideo = recommendedVideos.find(v => v.id === currentVideoId) || recommendedVideos[0];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
        {/* Main Video & Comments (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Simulated Video Player Screen */}
          <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-md flex flex-col justify-between p-4 group">
            {/* Top Bar on Player */}
            <div className="flex items-center justify-between text-white text-xs z-10 opacity-90">
              <span className="font-semibold drop-shadow">{currentVideo.title}</span>
              <span className="bg-red-600 px-2 py-0.5 rounded font-bold text-[10px]">HD 1080p</span>
            </div>

            {/* Simulated Animated Study Canvas */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pointer-events-none">
              <div className="text-center space-y-2 opacity-80">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto text-white">
                  {isPlaying ? <Play className="w-8 h-8 fill-white ml-1" /> : <Pause className="w-8 h-8 fill-white" />}
                </div>
                <p className="text-xs font-mono text-slate-300">
                  {isPlaying ? '▶ Playing: Chapter 4 • Minimum Spanning Trees & Dijkstra' : '⏸ Paused'}
                </p>
              </div>
            </div>

            {/* Bottom Player Controls */}
            <div className="relative z-10 space-y-2 pt-4 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-xl">
              {/* Timeline Progress Bar */}
              <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer">
                <div className="bg-red-600 h-full w-[42%]"></div>
              </div>

              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-red-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <Volume2 className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-mono text-slate-300">18:45 / {currentVideo.duration}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="hover:underline cursor-pointer">Subtitles (CC)</span>
                  <Settings className="w-3.5 h-3.5 text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Video Metadata */}
          <div className="space-y-3 pt-1">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentVideo.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                  CS
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 leading-tight">{currentVideo.channel}</h2>
                  <p className="text-xs text-slate-500">1.45M subscribers</p>
                </div>
                <button
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`ml-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSubscribed ? 'bg-slate-200 text-slate-800' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handleLikeVideo}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
                    hasLiked ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-blue-700' : ''}`} />
                  <span>{videoLikes.toLocaleString()}</span>
                </button>

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real Comments Section */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span>{commentsList.length} Comments</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                A
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Add a comment or ask a question on this topic..."
                  className="w-full text-xs sm:text-sm border-b border-slate-300 focus:border-blue-600 focus:outline-hidden py-1 text-slate-800"
                />
                {userComment.trim() && (
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setUserComment('')}
                      className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-lg"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comment Items */}
            <div className="space-y-3 pt-2">
              {commentsList.map((c, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                    {String.fromCharCode(65 + (idx % 26))}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">@Student_Learner_{idx + 1}</span>
                      <span className="text-[10px] text-slate-400">2 hours ago</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{c}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Videos Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Up Next</span>
          <div className="space-y-2.5">
            {recommendedVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setCurrentVideoId(vid.id)}
                className={`p-2 rounded-xl border flex gap-3 cursor-pointer transition-all ${
                  currentVideoId === vid.id
                    ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-28 h-18 bg-slate-900 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center text-white">
                  <Play className="w-5 h-5 fill-white opacity-80" />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 rounded font-mono">
                    {vid.duration}
                  </span>
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                    {vid.title}
                  </h4>
                  <p className="text-[10px] text-slate-500">{vid.channel}</p>
                  <p className="text-[10px] text-slate-400">{vid.views} • {vid.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    );
  }
};
