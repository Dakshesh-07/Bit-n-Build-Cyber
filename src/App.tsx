import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CamouflageOverlay } from './components/layout/CamouflageOverlay';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ArrowUp, ShieldCheck, Sparkles, EyeOff, PhoneCall, X } from 'lucide-react';

// Pages
import { Home } from './pages/Home';
import { LandingPage } from './pages/LandingPage';
import { ReportIncident } from './pages/ReportIncident';
import { AIAssistant } from './pages/AIAssistant';
import { OrgPortal } from './pages/OrgPortal';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Learn } from './pages/Learn';
import { BraveStories } from './pages/BraveStories';
import { SafeConnect } from './pages/SafeConnect';
import { SecurityHub } from './pages/SecurityHub';

// Automatic Scroll to Top on Route Navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

const AppContent: React.FC = () => {
  const [isCamouflageOpen, setIsCamouflageOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Scroll listener for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check first-time onboarding demo modal
  useEffect(() => {
    if (user && !localStorage.getItem('cybervigil_onboarding_seen')) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleDismissOnboarding = () => {
    localStorage.setItem('cybervigil_onboarding_seen', 'true');
    setShowOnboarding(false);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global ESC and shortcut listener for camouflage mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCamouflageOpen(prev => !prev);
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
        setIsCamouflageOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-textDark selection:bg-secondary-container selection:text-textDark font-sans">
      <ScrollToTop />

      {/* Top Crisis Lifeline Banner */}
      <EmergencyBanner />

      {/* Global Navigation Header with single Quick Exit & RBAC Switcher */}
      <Navbar onTriggerCamouflage={() => setIsCamouflageOpen(true)} />

      {/* Main Spaced Content Canvas */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Routes>
          {/* Public Auth Routes: When logged in, automatically forward into website */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to={user?.role === 'welfare_officer' ? '/portal' : '/'} replace />
              ) : (
                <Login />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? (
                <Navigate to={user?.role === 'welfare_officer' ? '/portal' : '/'} replace />
              ) : (
                <Register />
              )
            } 
          />

          {/* Root Route: Shows Landing Page if unauthenticated, Home Dashboard if logged in */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Home /> : <LandingPage />
            } 
          />
          <Route 
            path="/report" 
            element={
              <ProtectedRoute>
                <ReportIncident />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assistant" 
            element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/learn" 
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stories" 
            element={
              <ProtectedRoute>
                <BraveStories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/safeconnect" 
            element={
              <ProtectedRoute>
                <SafeConnect />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/security" 
            element={
              <ProtectedRoute>
                <SecurityHub />
              </ProtectedRoute>
            } 
          />

          {/* RBAC Protected Route: Requires access_officer_portal permission */}
          <Route 
            path="/portal" 
            element={
              <ProtectedRoute requiredPermission="access_officer_portal">
                <OrgPortal />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
          />
        </Routes>
      </main>

      {/* Floating Back-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-primary text-surface shadow-warm-elevated hover:bg-primary-hover transition-all duration-200 active:scale-95 border border-sand-400 group"
          title="Scroll back to top"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5 text-secondary group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* First-Time User Interactive Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-sand-300 shadow-warm-elevated space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div className="flex items-center gap-2.5">
                <img src="/cybervigil-shield.png" alt="CyberVigil" className="w-8 h-8 object-contain" />
                <h2 className="text-lg font-bold text-primary">Welcome to CyberVigil 🛡️</h2>
              </div>
              <button onClick={handleDismissOnboarding} className="p-1 rounded-lg text-textMuted hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-textMuted leading-relaxed">
              CyberVigil is India's premier trauma-informed child & youth online safety platform. Here is how we keep you completely safe:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-sand-100 border border-sand-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-safeGreen flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-primary">100% Zero-Trace Reporting</h4>
                  <p className="text-[11px] text-textMuted">EXIF metadata is automatically stripped from evidence screenshots before storage.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sand-100 border border-sand-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-primary">Guardian AI Triage Assistant</h4>
                  <p className="text-[11px] text-textMuted">Chat in English or regional languages (Hindi, Bengali, Tamil, etc.) without false threat alarms.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sand-100 border border-sand-200 flex items-start gap-3">
                <EyeOff className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-primary">Instant Camouflage Exit (ESC)</h4>
                  <p className="text-[11px] text-textMuted">Press <kbd className="px-1.5 py-0.5 rounded bg-sand-200 font-mono text-[10px]">ESC</kbd> anytime to disguise the website into harmless study notes.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sand-100 border border-sand-200 flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-errorRed flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-primary">Helpline Hotline Integration</h4>
                  <p className="text-[11px] text-textMuted">Direct access to Childline 1098 & National Cyber Crime Helpline 1930.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDismissOnboarding}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>I Understand, Explore Platform</span>
              <ShieldCheck className="w-4 h-4 text-secondary" />
            </button>
          </div>
        </div>
      )}

      {/* Trauma-Informed Footer */}
      <Footer />

      {/* Instant Camouflage Stealth Screen (ESC) */}
      <CamouflageOverlay
        isOpen={isCamouflageOpen}
        onClose={() => setIsCamouflageOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
