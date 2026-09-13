import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Plus, 
  Star, 
  X, 
  CheckCircle2, 
  Sparkles, 
  EyeOff, 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  Clock, 
  Check, 
  PhoneCall, 
  Lock, 
  Layers, 
  HelpCircle, 
  MessageSquare, 
  AlertTriangle, 
  Shield, 
  UserCheck,
  Flame,
  ArrowRight,
  ChevronUp,
  ThumbsUp,
  Send
} from 'lucide-react';
import { BraveStory, CommunityEntryType, StoryReply } from '../types';
import { localStore, formatTimeAgo, sortStoriesByMostRecent } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Category Filters
const FILTER_CATEGORIES = [
  'All',
  'Extortion & Blackmail',
  'Cyberbullying',
  'Online Frauds & Scams',
  'Safe Communities'
];

export const BraveStories: React.FC = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<BraveStory[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'stories' | 'grievances' | 'saves'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<BraveStory | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  
  // Submission Form State
  const [entryType, setEntryType] = useState<CommunityEntryType>('story');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Extortion & Blackmail');
  const [storyText, setStoryText] = useState('');
  const [authorAlias, setAuthorAlias] = useState('');
  const [captionEmoji, setCaptionEmoji] = useState('Overcame Extortion 🛡️');
  const [isAnonymousShare, setIsAnonymousShare] = useState(true);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Load & listen for real-time community updates across roles & browser tabs
  useEffect(() => {
    // 1. Initial synchronous load from local store
    setStories(localStore.getStories());

    // 2. Background sync with local API endpoint (merges any stories submitted across different browser profiles/incognito)
    localStore.syncWithServer().then(serverStories => {
      if (serverStories && serverStories.length > 0) {
        setStories(serverStories);
      }
    });

    // 3. Listener for in-app / same-window updates
    const handleStoriesUpdated = () => {
      setStories(localStore.getStories());
    };
    window.addEventListener('cybervigil_stories_updated', handleStoriesUpdated);

    // 4. Listener for cross-tab localStorage updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cybervigil_stories_store' || !e.key) {
        setStories(localStore.getStories());
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 5. BroadcastChannel listener for instant cross-tab live synchronization
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('cybervigil_channel');
        bc.onmessage = (msg) => {
          if (msg.data?.type === 'STORIES_UPDATED') {
            setStories(localStore.getStories());
          }
        };
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('cybervigil_stories_updated', handleStoriesUpdated);
      window.removeEventListener('storage', handleStorageChange);
      if (bc) bc.close();
    };
  }, [user?.id, user?.role]);

  const handleSupport = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    localStore.toggleStorySupport(id);
    const updated = localStore.getStories();
    setStories(updated);
    if (selectedItem && selectedItem.id === id) {
      const refreshed = updated.find(s => s.id === id);
      if (refreshed) setSelectedItem(refreshed);
    }
  };

  // Reply Form State
  const [replyText, setReplyText] = useState('');
  const [replyRole, setReplyRole] = useState<StoryReply['authorRole']>('peer');
  const [replyAlias, setReplyAlias] = useState('');
  const [replyNotification, setReplyNotification] = useState(false);

  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    localStore.toggleStorySave(id);
    const updated = localStore.getStories();
    setStories(updated);
    if (selectedItem && selectedItem.id === id) {
      const refreshed = updated.find(s => s.id === id);
      if (refreshed) setSelectedItem(refreshed);
    }
  };

  const handleVote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    localStore.toggleStoryVote(id);
    const updated = localStore.getStories();
    setStories(updated);
    if (selectedItem && selectedItem.id === id) {
      const refreshed = updated.find(s => s.id === id);
      if (refreshed) setSelectedItem(refreshed);
    }
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !replyText.trim()) return;

    let finalAuthor = replyAlias.trim();
    if (!finalAuthor) {
      if (user && !user.isAnonymous) finalAuthor = user.alias;
      else finalAuthor = `Defender #${Math.floor(100 + Math.random() * 900)}`;
    }

    localStore.addStoryReply(selectedItem.id, {
      authorAlias: finalAuthor,
      authorRole: replyRole,
      text: replyText.trim()
    });

    const updated = localStore.getStories();
    setStories(updated);
    const refreshed = updated.find(s => s.id === selectedItem.id);
    if (refreshed) setSelectedItem(refreshed);

    setReplyText('');
    setReplyAlias('');
    setReplyNotification(true);
    setTimeout(() => setReplyNotification(false), 2500);
  };

  const handleToggleReplyVote = (storyId: string, replyId: string) => {
    localStore.toggleReplyVote(storyId, replyId);
    const updated = localStore.getStories();
    setStories(updated);
    if (selectedItem && selectedItem.id === storyId) {
      const refreshed = updated.find(s => s.id === storyId);
      if (refreshed) setSelectedItem(refreshed);
    }
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !storyText.trim()) return;

    let finalAuthor = 'Anonymous Defender';
    if (!isAnonymousShare) {
      if (authorAlias.trim()) {
        finalAuthor = authorAlias.trim();
      } else if (user && !user.isAnonymous && user.alias) {
        finalAuthor = user.alias;
      } else {
        finalAuthor = 'Community Defender';
      }
    } else {
      finalAuthor = `🛡️ Anonymous Defender #${Math.floor(100 + Math.random() * 900)}`;
    }

    const now = Date.now();
    const newEntry: BraveStory = {
      id: `${entryType}-${now}`,
      entryType,
      title: title.trim(),
      category,
      authorAlias: finalAuthor,
      authorRole: user?.role || 'registered_youth',
      storyText: storyText.trim(),
      timeAgo: 'Just now',
      createdAt: now,
      supportCount: 1,
      userSupported: false,
      votesCount: entryType === 'grievance' ? 1 : 0,
      userVoted: false,
      tags: [category, entryType === 'grievance' ? 'Community Doubt' : 'Brave Survivor'],
      isAnonymous: isAnonymousShare,
      duration: entryType === 'grievance' ? `Doubt #${Math.floor(100 + Math.random() * 400)}` : '0:25',
      pillBadge: entryType === 'grievance' ? `Grievance • ${category.split(' ')[0]}` : `Brave Story • ${category.split(' ')[0]}`,
      captionEmoji: captionEmoji || (entryType === 'grievance' ? 'Community Query ❓' : 'Courage Story 💙'),
      isSaved: false,
      urgency: entryType === 'grievance' ? 'Needs Guidance' : undefined,
      answersCount: entryType === 'grievance' ? 0 : undefined,
      verifiedAdvice: entryType === 'grievance' ? 'Official counselor review is pending. In immediate peril, dial Childline 1098 or 1930.' : undefined,
      replies: []
    };

    localStore.saveStory(newEntry);
    setStories(localStore.getStories());
    setActiveTab(entryType === 'grievance' ? 'grievances' : 'stories');
    setActiveCategory('All');
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsShareModalOpen(false);
      setTitle('');
      setStoryText('');
      setAuthorAlias('');
      setCaptionEmoji('Overcame Extortion 🛡️');
      setIsAnonymousShare(true);
    }, 1200);
  };

  const handleCopyStory = (item: BraveStory) => {
    navigator.clipboard.writeText(`"${item.storyText}" — ${item.authorAlias} on CyberVigil`);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Filter items by active tab
  const filteredItems = stories.filter(item => {
    if (activeTab === 'saves' && !item.isSaved) return false;
    if (activeTab === 'stories' && item.entryType !== 'story') return false;
    if (activeTab === 'grievances' && item.entryType !== 'grievance') return false;
    return true;
  });

  // Chronologically sort all items so the newest submissions are always at the top
  const sortedItems = sortStoriesByMostRecent(filteredItems);

  const storiesCount = stories.filter(s => s.entryType === 'story').length;
  const grievancesCount = stories.filter(s => s.entryType === 'grievance').length;
  const savedCount = stories.filter(s => s.isSaved).length;

  return (
    <div className="space-y-6 pb-20 min-h-screen">
      
      {/* 1. Header & Primary Navigation Tabs */}
      <section className="space-y-4 pt-2">
        
        {/* Main Section Tabs: Explore All | Brave Stories | Grievances & Doubts | All Saves */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-300 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-sm sm:text-base font-bold transition-all relative pb-2 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'text-slate-900 dark:text-white font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <span>Explore All</span>
              {activeTab === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-500 rounded-full animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('stories')}
              className={`text-sm sm:text-base font-bold transition-all relative pb-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'stories'
                  ? 'text-slate-900 dark:text-white font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <span>🛡️ Brave Stories</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sand-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold">
                {storiesCount}
              </span>
              {activeTab === 'stories' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-500 rounded-full animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('grievances')}
              className={`text-sm sm:text-base font-bold transition-all relative pb-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'grievances'
                  ? 'text-slate-900 dark:text-white font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <span>💬 Grievances & Doubts</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sand-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold">
                {grievancesCount}
              </span>
              {activeTab === 'grievances' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-500 rounded-full animate-in fade-in" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('saves')}
              className={`text-sm sm:text-base font-bold transition-all relative pb-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'saves'
                  ? 'text-slate-900 dark:text-white font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <span>⭐ All saves</span>
              {savedCount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono font-bold">
                  {savedCount}
                </span>
              )}
              {activeTab === 'saves' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-500 rounded-full animate-in fade-in" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => {
                setEntryType('story');
                if (user && !user.isAnonymous && user.alias) {
                  setAuthorAlias(user.alias);
                }
                setIsShareModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4 text-secondary dark:text-slate-950" />
              <span>Share / Post</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Organized Stories & Grievances Cards Grid */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-20 bg-surface dark:bg-[#151e2e] rounded-3xl border border-sand-300 dark:border-slate-800 p-8 space-y-3">
          <Bookmark className="w-12 h-12 text-sand-400 mx-auto stroke-[1.5]" />
          <h3 className="text-lg font-bold text-primary dark:text-slate-100">No items found in this section</h3>
          <p className="text-xs text-textMuted dark:text-slate-400 max-w-sm mx-auto">
            Switch tabs or explore all brave stories and community grievances regarding cyber threats.
          </p>
          <button
            onClick={() => setActiveTab('all')}
            className="px-4 py-2 rounded-full bg-primary dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-bold hover:bg-primary-hover dark:hover:bg-amber-600 active:scale-95"
          >
            Show All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {sortedItems.map((item) => {
            const isGrievance = item.entryType === 'grievance';

            return (
              <article
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative w-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between border bg-surface dark:bg-[#151e2e] border-sand-300 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 shadow-warm-card cursor-pointer overflow-hidden h-full min-h-[260px]"
              >
                {/* Top Row: Category Pill, Doubt Voting & Star Button */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    {item.pillBadge && (
                      <span className={`px-2.5 py-1 rounded-lg text-white font-extrabold text-[10px] sm:text-[11px] shadow-xs tracking-wide ${
                        isGrievance ? 'bg-amber-600' : 'bg-sky-600'
                      }`}>
                        {item.pillBadge}
                      </span>
                    )}

                    {isGrievance && (
                      <button
                        onClick={(e) => handleVote(item.id, e)}
                        className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-bold transition-all duration-200 border group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:shadow-md ${
                          item.userVoted
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 shadow-xs'
                            : 'bg-sand-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-sand-300 dark:border-slate-700'
                        }`}
                        title="Upvote / I have this doubt too"
                      >
                        <ChevronUp className={`w-3.5 h-3.5 stroke-[2.5] ${item.userVoted ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span>{item.votesCount || 0} Votes</span>
                      </button>
                    )}

                    {item.urgency === 'Critical' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        Critical Alert
                      </span>
                    )}
                  </div>

                  {/* Star Button in Top-Right with pop effect on hover */}
                  <button
                    onClick={(e) => handleToggleSave(item.id, e)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:shadow-md ${
                      item.isSaved
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-500 hover:bg-amber-200 dark:hover:bg-amber-900/80 shadow-xs'
                        : 'bg-sand-200/80 dark:bg-slate-800 hover:bg-sand-300 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                    title={item.isSaved ? "Saved in All Saves" : "Save Story"}
                    aria-label="Toggle Save"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.isSaved
                          ? 'fill-amber-400 text-amber-400 stroke-amber-400'
                          : 'stroke-[2]'
                      }`}
                    />
                  </button>
                </div>

                {/* Narrative Content Area */}
                <div className="space-y-2.5 my-2 flex-1 flex flex-col justify-start">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed font-normal italic">
                    "{item.storyText}"
                  </p>

                  {/* Tags / Guidance Badge */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 mt-auto">
                    {isGrievance && item.verifiedAdvice && (
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        Verified Guidance
                      </span>
                    )}
                    {item.tags.slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] px-2.5 py-0.5 rounded-md bg-sand-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Author & Action Bar */}
                <div className="pt-3.5 mt-3 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {isGrievance ? (
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                      )}
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate leading-snug">
                        {item.captionEmoji || item.title}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-textMuted dark:text-slate-400 font-medium flex-wrap">
                      <span className="truncate max-w-[120px]">{item.authorAlias}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(item.createdAt, item.timeAgo)}</span>
                    </div>
                  </div>

                  {/* Actions: Replies + Heart Support with Pop out effect on hover */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-sand-100 dark:bg-slate-800 hover:bg-sand-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:shadow-md font-medium"
                      title="View & post replies"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>{item.replies?.length || item.answersCount || 0}</span>
                    </button>

                    <button
                      onClick={(e) => handleSupport(item.id, e)}
                      className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full transition-all duration-200 flex-shrink-0 group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:shadow-md ${
                        item.userSupported
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 font-bold border border-rose-500/30'
                          : 'text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Send Solidarity & Support"
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.userSupported ? 'fill-rose-600 dark:fill-rose-400 text-rose-600 dark:text-rose-400' : ''}`} />
                      <span className="font-semibold">{item.supportCount}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 4. Full Story & Grievance Reader Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-surface rounded-3xl max-w-xl w-full border border-sand-300 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            
            {/* Modal Text Header (No Photos) */}
            <div className={`p-6 sm:p-7 border-b ${
              selectedItem.entryType === 'grievance'
                ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white border-amber-900/40'
                : 'bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border-slate-800'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary text-primary font-bold text-[10px] uppercase tracking-wider inline-block">
                      {selectedItem.entryType === 'grievance' ? '💬 Community Grievance & Doubt' : '🛡️ Brave Survivor Story'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-semibold text-[10px] backdrop-blur-sm">
                      {selectedItem.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {selectedItem.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center flex-shrink-0 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-textMuted border-b border-sand-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-secondary flex items-center justify-center font-bold text-xs">
                    {selectedItem.isAnonymous ? 'A' : selectedItem.authorAlias.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{selectedItem.authorAlias}</p>
                    <p className="text-[10px] text-textMuted">{selectedItem.timeAgo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSave(selectedItem.id)}
                    className="p-2 rounded-full hover:bg-sand-100 text-slate-600 transition-colors"
                    title={selectedItem.isSaved ? "Saved" : "Save"}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        selectedItem.isSaved
                          ? 'fill-amber-400 text-amber-400 stroke-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => handleCopyStory(selectedItem)}
                    className="p-2 rounded-full hover:bg-sand-100 text-slate-600 transition-colors"
                    title="Copy Quote"
                  >
                    {copiedNotification ? (
                      <Check className="w-4 h-4 text-safeGreen" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Story Narrative / Grievance In-Depth */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted">
                    {selectedItem.entryType === 'grievance' ? 'Victim Grievance & Inquiries:' : 'Personal Survivor Account:'}
                  </span>
                  <blockquote className="text-sm sm:text-base text-slate-800 leading-relaxed italic bg-sand-100/60 p-4 rounded-2xl border-l-4 border-secondary">
                    "{selectedItem.storyText}"
                  </blockquote>
                </div>

                {/* Verified Officer / Counselor Advice Box for Grievances */}
                {selectedItem.verifiedAdvice && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span>Verified Guidance & Protection Steps</span>
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed font-medium">
                      {selectedItem.verifiedAdvice}
                    </p>
                    {selectedItem.adviceOfficer && (
                      <p className="text-[10px] text-amber-800 font-semibold pt-1">
                        — Advised by: {selectedItem.adviceOfficer}
                      </p>
                    )}
                  </div>
                )}

                {/* Grievance Doubt Voting Bar */}
                {selectedItem.entryType === 'grievance' && (
                  <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        Facing this situation or need escalated answers?
                      </p>
                      <p className="text-[11px] text-amber-800">
                        <strong>{selectedItem.votesCount || 0} defenders</strong> voted that this doubt requires active community & legal attention.
                      </p>
                    </div>
                    <button
                      onClick={() => handleVote(selectedItem.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs flex-shrink-0 ${
                        selectedItem.userVoted
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                      <span>{selectedItem.userVoted ? '✓ You Voted' : 'Vote for Doubt'} ({selectedItem.votesCount || 0})</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedItem.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-sand-200 text-slate-700 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Support & Hotline Actions */}
              <div className="pt-2 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => handleSupport(selectedItem.id)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    selectedItem.userSupported
                      ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                      : 'bg-sand-100 border-sand-300 text-slate-700 hover:bg-sand-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${selectedItem.userSupported ? 'fill-rose-600' : ''}`} />
                  <span>{selectedItem.supportCount} Defenders Stood in Solidarity</span>
                </button>

                <a
                  href="tel:1098"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-secondary" />
                  <span>Call Childline 1098</span>
                </a>
              </div>

              {/* Community Discussion & Replies Thread */}
              <div className="pt-4 border-t border-sand-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      {selectedItem.entryType === 'grievance' ? 'Community Answers & Advice' : 'Community Discussion & Replies'}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sand-200 text-slate-700 font-bold font-mono">
                      {selectedItem.replies?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Post a Reply Form */}
                <form onSubmit={handleAddReply} className="space-y-3 bg-sand-100/60 p-4 rounded-2xl border border-sand-300/80">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-slate-800">
                      {selectedItem.entryType === 'grievance' ? 'Reply to this Doubt / Provide Guidance:' : 'Leave a Supportive Reply:'}
                    </span>
                    {replyNotification && (
                      <span className="text-[11px] font-bold text-safeGreen flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3.5 h-3.5" /> Reply posted!
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      selectedItem.entryType === 'grievance'
                        ? "Share statutory advice (POCSO / IT Act), practical steps, or peer experience to help resolve this doubt..."
                        : "Share words of support, solidarity, or related advice..."
                    }
                    className="w-full p-3 rounded-xl border border-sand-300 text-xs sm:text-sm focus:ring-2 focus:ring-secondary/40 bg-surface resize-none leading-relaxed"
                    required
                  />

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={replyAlias}
                        onChange={(e) => setReplyAlias(e.target.value)}
                        placeholder={user && !user.isAnonymous ? user.alias : "Display Name (optional)"}
                        className="px-3 py-1.5 rounded-xl border border-sand-300 text-xs bg-surface flex-1 sm:w-44"
                      />

                      <select
                        value={replyRole}
                        onChange={(e) => setReplyRole(e.target.value as StoryReply['authorRole'])}
                        className="px-2.5 py-1.5 rounded-xl border border-sand-300 text-xs bg-surface text-slate-700"
                      >
                        <option value="peer">🛡️ Peer Defender</option>
                        <option value="counselor">🧠 Counselor</option>
                        <option value="officer">⚖️ Legal / Officer</option>
                        <option value="community">🤝 Community</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5 text-secondary" />
                      <span>Post Reply</span>
                    </button>
                  </div>
                </form>

                {/* Replies List */}
                <div className="space-y-3 pt-1">
                  {(!selectedItem.replies || selectedItem.replies.length === 0) ? (
                    <div className="text-center py-6 text-xs text-textMuted bg-sand-50 rounded-xl border border-dashed border-sand-300">
                      No replies posted yet. Be the first to provide supportive advice!
                    </div>
                  ) : (
                    selectedItem.replies.map((reply) => {
                      const isOfficerOrCounselor = reply.authorRole === 'officer' || reply.authorRole === 'counselor' || reply.isVerified;
                      return (
                        <div
                          key={reply.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                            isOfficerOrCounselor
                              ? 'bg-amber-50/60 border-amber-200/90'
                              : 'bg-surface border-sand-200 hover:border-sand-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                isOfficerOrCounselor ? 'bg-amber-600 text-white' : 'bg-primary text-secondary'
                              }`}>
                                {reply.authorAlias.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs text-slate-900">{reply.authorAlias}</span>
                                  {reply.authorRole === 'officer' && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-200 text-amber-900">
                                      ⚖️ Legal Desk
                                    </span>
                                  )}
                                  {reply.authorRole === 'counselor' && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-100 text-sky-900">
                                      🧠 Counselor
                                    </span>
                                  )}
                                  {reply.authorRole === 'peer' && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sand-200 text-slate-700">
                                      🛡️ Peer
                                    </span>
                                  )}
                                  {reply.isVerified && (
                                    <span className="text-[10px] text-amber-700 font-bold flex items-center gap-0.5">
                                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                                      Verified
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-textMuted">{reply.timeAgo}</p>
                              </div>
                            </div>

                            {/* Upvote button on reply */}
                            <button
                              onClick={() => handleToggleReplyVote(selectedItem.id, reply.id)}
                              className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border transition-all active:scale-90 font-medium ${
                                reply.userVoted
                                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                                  : 'bg-sand-100/70 hover:bg-sand-200 border-sand-300 text-slate-600'
                              }`}
                              title="Helpful reply"
                            >
                              <ChevronUp className={`w-3.5 h-3.5 stroke-[2.5] ${reply.userVoted ? 'text-amber-600' : 'text-slate-500'}`} />
                              <span>{reply.votesCount}</span>
                            </button>
                          </div>

                          <p className="mt-2 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal pl-8">
                            {reply.text}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add / Share Modal (Supports Both Brave Stories AND Grievances) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#151e2e] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sand-300 dark:border-slate-800 shadow-2xl space-y-5 my-8 animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
            
            <div className="flex items-center justify-between border-b border-sand-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="font-bold text-lg text-primary dark:text-slate-100">Community Voice</h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-lg text-textMuted dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedMessage ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-safeGreen mx-auto animate-bounce" />
                <h4 className="font-bold text-lg text-primary dark:text-slate-100">
                  {entryType === 'grievance' ? 'Grievance / Doubt Submitted Safely!' : 'Brave Story Published Safely!'}
                </h4>
                <p className="text-xs text-textMuted dark:text-slate-400">
                  {entryType === 'grievance' 
                    ? 'Your inquiry has been pinned anonymously. Advocates and counselors will review guidance shortly.' 
                    : 'Your journey has been pinned to inspire and empower other defenders.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateEntry} className="space-y-4">
                
                {/* Entry Type Selector: Brave Story vs Grievance / Doubt */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-sand-200 dark:bg-slate-800/80 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setEntryType('story');
                      setCaptionEmoji('Overcame Extortion 🛡️');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      entryType === 'story'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-400 shadow-sm font-extrabold'
                        : 'text-textMuted dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>🛡️ Brave Story</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEntryType('grievance');
                      setCaptionEmoji('Urgent Extortion Query ❓');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      entryType === 'grievance'
                        ? 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-400 shadow-sm font-extrabold'
                        : 'text-textMuted dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>💬 Grievance / Doubt</span>
                  </button>
                </div>

                {/* Anonymous Protection Toggle */}
                <div className="p-3.5 rounded-2xl bg-sand-100 dark:bg-slate-800/50 border border-sand-300 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary dark:text-slate-200 flex items-center gap-1.5">
                      <EyeOff className="w-4 h-4 text-secondary" />
                      Victim Anonymous Shield
                    </span>
                    <span className="text-[10px] font-bold text-safeGreen bg-safeGreenContainer dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded">
                      Zero Retaliation Risk
                    </span>
                  </div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymousShare}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsAnonymousShare(checked);
                        if (!checked && !authorAlias && user?.alias) {
                          setAuthorAlias(user.alias);
                        }
                      }}
                      className="mt-0.5 rounded border-sand-300 dark:border-slate-600 text-primary focus:ring-secondary w-4 h-4"
                    />
                    <span className="text-xs text-textDark dark:text-slate-300 leading-relaxed">
                      <strong>Post anonymously</strong> — Hides real identity and assigns a protective alias.
                    </span>
                  </label>
                </div>

                {/* Custom Alias if not posting anonymously */}
                {!isAnonymousShare && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-primary dark:text-slate-200">Display Author Handle</label>
                      {user && !user.isAnonymous && (
                        <button
                          type="button"
                          onClick={() => setAuthorAlias(user.alias)}
                          className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                        >
                          Use my profile ({user.alias})
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={authorAlias}
                      onChange={(e) => setAuthorAlias(e.target.value)}
                      placeholder={user?.alias || "e.g. Arjun_Shield"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500/40"
                    />
                  </div>
                )}

                {/* Title Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-primary dark:text-slate-200">
                    {entryType === 'grievance' ? 'Doubt / Question Headline' : 'Story Title'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      entryType === 'grievance'
                        ? 'e.g. Someone is demanding money on UPI threatening to leak my photos. If I block, will they leak it?'
                        : 'e.g. How I Stopped an Extortionist without Paying a Rupee'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500/40"
                    required
                  />
                </div>

                {/* Category & Caption */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-primary dark:text-slate-200">Threat Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm"
                    >
                      {FILTER_CATEGORIES.filter(c => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-primary dark:text-slate-200">Badge / Caption</label>
                    <input
                      type="text"
                      value={captionEmoji}
                      onChange={(e) => setCaptionEmoji(e.target.value)}
                      placeholder={entryType === 'grievance' ? 'Extortion Query ❓' : 'Overcame Extortion 🛡️'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                {/* Detailed Text Area */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-primary dark:text-slate-200">
                    {entryType === 'grievance' ? 'Explain Your Situation & Questions' : 'Your Experience & Advice for Others'}
                  </label>
                  <textarea
                    rows={4}
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    placeholder={
                      entryType === 'grievance'
                        ? 'Describe what happened: what platform, what demands or threats were made, and what specific questions you need answered...'
                        : 'Tell what cyber threat happened, how you broke their leverage, and what advice you would give to another young person...'
                    }
                    className="w-full p-3.5 rounded-xl border border-sand-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500/40 resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs sm:text-sm font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>{entryType === 'grievance' ? 'Submit Grievance / Doubt Safely' : 'Publish Brave Story Safely'}</span>
                    <ArrowRight className="w-4 h-4 text-secondary dark:text-slate-950" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
