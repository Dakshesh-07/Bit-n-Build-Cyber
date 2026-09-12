import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Inbox, 
  AlertTriangle, 
  Send, 
  PhoneCall, 
  FileCheck, 
  Fingerprint, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  UserCheck,
  Scale,
  X,
  User,
  Sparkles
} from 'lucide-react';
import { IncidentReport } from '../types';
import { localStore } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { CyberEvidenceDocket } from '../components/CyberEvidenceDocket';

const COUNSELOR_PRESETS = [
  'Dr. Ananya Sharma (Nodal Child Psychologist - Childline 1098)',
  'Counselor Rajesh Verma (Senior Trauma Interventionist)',
  'Priya Nair (Cyber Victim Welfare Officer)',
  'Inspector V. Singh (Nodal POCSO Support Officer)'
];

export const OrgPortal: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [selectedCase, setSelectedCase] = useState<IncidentReport | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'HIGH'>('ALL');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  // Interventions & Export Modal State
  const [showDocketModal, setShowDocketModal] = useState<boolean>(false);
  const [showCounselorModal, setShowCounselorModal] = useState<boolean>(false);
  const [customCounselorName, setCustomCounselorName] = useState<string>('');

  // Per-Case Intervention Dynamic State Persistence
  const [assignedCounselorsMap, setAssignedCounselorsMap] = useState<Record<string, string>>({});
  const [takedownDispatchedMap, setTakedownDispatchedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const list = localStore.getIncidents();
    setIncidents(list);
    if (list.length > 0 && !selectedCase) {
      setSelectedCase(list[0]);
    }

    // Load saved counselor & takedown mappings from localStorage
    try {
      const savedCounselors = localStorage.getItem('cybervigil_assigned_counselors');
      if (savedCounselors) setAssignedCounselorsMap(JSON.parse(savedCounselors));
      const savedTakedowns = localStorage.getItem('cybervigil_takedowns_dispatched');
      if (savedTakedowns) setTakedownDispatchedMap(JSON.parse(savedTakedowns));
    } catch (e) {
      console.error('Error loading saved intervention state:', e);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterSeverity]);

  const handleSelectCase = (item: IncidentReport) => {
    setSelectedCase(item);
    setActionSuccessMessage(null);
  };

  const handleUpdateStatus = (newStatus: IncidentReport['status'], actionText: string) => {
    if (!selectedCase) return;
    const updated = localStore.updateIncident(selectedCase.id, { status: newStatus });
    if (updated) {
      setSelectedCase(updated);
      setIncidents(localStore.getIncidents());
      setActionSuccessMessage(actionText);
      setTimeout(() => setActionSuccessMessage(null), 3000);
    }
  };

  const handleDispatchTakedown = () => {
    if (!selectedCase) return;
    const updatedTakedowns = { ...takedownDispatchedMap, [selectedCase.id]: true };
    setTakedownDispatchedMap(updatedTakedowns);
    localStorage.setItem('cybervigil_takedowns_dispatched', JSON.stringify(updatedTakedowns));

    handleUpdateStatus('Platform Notice Drafted', 'Automated Takedown Notice dispatched to Meta & Snapchat Trust/Safety desks!');
  };

  const handleAssignCounselor = (counselorName: string) => {
    if (!selectedCase || !counselorName.trim()) return;
    const nameToAssign = counselorName.trim();
    const updatedCounselors = { ...assignedCounselorsMap, [selectedCase.id]: nameToAssign };
    setAssignedCounselorsMap(updatedCounselors);
    localStorage.setItem('cybervigil_assigned_counselors', JSON.stringify(updatedCounselors));

    setShowCounselorModal(false);
    setCustomCounselorName('');
    handleUpdateStatus('Escalated 1098', `Assigned Trauma Counselor (${nameToAssign}) to Case #${selectedCase.caseNumber}!`);
  };

  const filteredIncidents = incidents.filter(item => {
    if (filterSeverity === 'HIGH') return item.severityLevel === 'High' || item.severityLevel === 'Critical';
    return true;
  });

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage) || 1;
  const paginatedIncidents = filteredIncidents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentCaseAssignedCounselor = selectedCase ? assignedCounselorsMap[selectedCase.id] : null;
  const isTakedownDispatched = selectedCase ? takedownDispatchedMap[selectedCase.id] || selectedCase.status === 'Platform Notice Drafted' : false;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Sub-Header: Mission Banner & Telemetry Bar */}
      <section className="bg-primary text-surface rounded-2xl p-6 sm:p-8 shadow-warm-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-primary uppercase tracking-wider">
              Restricted Portal
            </span>
            <span className="text-xs text-sand-300 font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3 text-safeGreen" />
              256-Bit Encrypted Officer Session
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-surface">
            CyberVigil Child Protection Portal
          </h1>
          <p className="text-xs sm:text-sm text-sand-300 max-w-xl">
            Strictly governed under POCSO Act compliance. Evidentiary hashes are court-admissible.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs bg-primary-container p-3 rounded-xl border border-sand-300/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold">
              CPU
            </div>
            <div>
              <p className="font-bold text-surface">{user?.alias || 'Inspector Sharma'}</p>
              <p className="text-[10px] text-sand-400">Clearance Level 3</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Operational Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-surface border border-sand-300 hover:border-sand-400 rounded-2xl p-6 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 space-y-3 group">
          <div className="flex items-center justify-between text-textMuted">
            <span className="text-xs font-bold uppercase tracking-wider">New Triage Reports</span>
            <Inbox className="w-5 h-5 text-primary group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-primary">{incidents.length}</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-secondary">
              +4 in last hour
            </span>
          </div>
          <p className="text-xs text-textMuted">Awaiting cryptographic scrub & review</p>
        </div>

        <div className="bg-surface border border-sand-300 hover:border-sand-400 rounded-2xl p-6 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 space-y-3 group">
          <div className="flex items-center justify-between text-secondary-dark font-semibold">
            <span className="text-xs font-bold uppercase tracking-wider">Immediate Takedowns</span>
            <AlertTriangle className="w-5 h-5 text-secondary group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-secondary-dark">3</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-secondary text-primary">
              High Priority
            </span>
          </div>
          <p className="text-xs text-secondary-dark font-medium">POCSO Flagged • &lt;2hr target SLA</p>
        </div>

        <div className="bg-surface border border-sand-300 hover:border-sand-400 rounded-2xl p-6 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 space-y-3 group">
          <div className="flex items-center justify-between text-textMuted">
            <span className="text-xs font-bold uppercase tracking-wider">Multi-Agency Sync</span>
            <UserCheck className="w-5 h-5 text-slateMarine group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-primary">5</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sand-200 text-textDark">
              Cross-Jurisdiction
            </span>
          </div>
          <p className="text-xs text-textMuted">Childline & Cyber Cell nodal synchronized</p>
        </div>

        <div className="bg-surface border border-sand-300 hover:border-sand-400 rounded-2xl p-6 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 space-y-3 group">
          <div className="flex items-center justify-between text-textMuted">
            <span className="text-xs font-bold uppercase tracking-wider">Dispatched Takedowns</span>
            <CheckCircle2 className="w-5 h-5 text-safeGreen group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-primary">28</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-safeGreenContainer text-safeGreen">
              96.4% Compliance
            </span>
          </div>
          <p className="text-xs text-textMuted">Meta, Discord, Snapchat & X</p>
        </div>
      </section>

      {/* 3. Dual-Zone Layout: Queue Table + Active Case Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Incident Queue Table */}
        <section className="lg:col-span-7 bg-surface border border-sand-300 dark:border-slate-800 rounded-2xl shadow-warm-card overflow-hidden">
          <div className="p-5 border-b border-sand-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-sand-50 dark:bg-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-primary dark:text-slate-100">Live Incident Triage Queue</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary text-surface">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-textMuted dark:text-slate-400 mt-0.5">
                Incoming encrypted reports ingested via Childline 1098 & Web Shield
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterSeverity(prev => prev === 'ALL' ? 'HIGH' : 'ALL')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  filterSeverity === 'HIGH'
                    ? 'bg-secondary text-primary border-secondary font-bold'
                    : 'bg-surface border-sand-300 dark:border-slate-700 text-textDark dark:text-slate-200 hover:bg-sand-100'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{filterSeverity === 'HIGH' ? 'High Severity (Active)' : 'Filter: High Only'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-sand-100 dark:bg-slate-800 text-textDark dark:text-slate-200 font-bold border-b border-sand-300 dark:border-slate-700">
                  <th className="py-3.5 px-4">Case ID</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Urgency</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200 dark:divide-slate-800">
                {paginatedIncidents.map((inc) => {
                  const isSelected = selectedCase?.id === inc.id;
                  return (
                    <tr
                      key={inc.id}
                      onClick={() => handleSelectCase(inc)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sand-200 dark:bg-slate-800 font-semibold border-l-4 border-secondary dark:border-orange-500'
                          : 'hover:bg-sand-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-primary dark:text-slate-100">
                        {inc.caseNumber}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-primary dark:text-slate-100 block">{inc.category}</span>
                        <span className="text-[11px] text-textMuted dark:text-slate-400">{inc.platform} • {inc.createdAt}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          inc.severityLevel === 'High' || inc.severityLevel === 'Critical'
                            ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-secondary dark:border-amber-500'
                            : 'bg-sand-200 dark:bg-slate-800 text-textDark dark:text-slate-300'
                        }`}>
                          {inc.severityLevel}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/70 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`text-xs font-bold inline-flex items-center gap-1 ${
                          isSelected ? 'text-secondary-dark dark:text-orange-400' : 'text-textMuted dark:text-slate-400'
                        }`}>
                          {isSelected ? 'Viewing' : 'Select'}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-sand-50 dark:bg-slate-900 border-t border-sand-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-textMuted dark:text-slate-400">
              Showing <span className="font-bold text-primary dark:text-slate-100">{filteredIncidents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-primary dark:text-slate-100">{Math.min(currentPage * itemsPerPage, filteredIncidents.length)}</span> of <span className="font-bold text-primary dark:text-slate-100">{filteredIncidents.length}</span> active cases
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-primary dark:text-slate-200 font-bold disabled:opacity-40 hover:bg-sand-100 dark:hover:bg-slate-700 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-primary dark:bg-orange-600 text-white shadow-xs'
                        : 'text-textMuted dark:text-slate-400 hover:bg-sand-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-primary dark:text-slate-200 font-bold disabled:opacity-40 hover:bg-sand-100 dark:hover:bg-slate-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT: Active Case Deep-Dive Panel */}
        <aside className="lg:col-span-5 bg-surface border-2 border-primary/20 rounded-2xl shadow-warm-elevated overflow-hidden sticky top-24">
          {selectedCase ? (
            <div>
              <div className="bg-primary p-6 text-surface flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-surface">Case Deep-Dive</h3>
                    <span className="px-2 py-0.5 rounded bg-secondary text-primary font-mono text-xs font-extrabold">
                      {selectedCase.caseNumber}
                    </span>
                  </div>
                  <p className="text-xs text-sand-300 mt-1">
                    Ingested {selectedCase.createdAt} • Child Custody Protocol Active
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-secondary text-primary">
                  {selectedCase.severityLevel}
                </span>
              </div>

              <div className="p-6 space-y-5">
                {actionSuccessMessage && (
                  <div className="p-3.5 rounded-xl bg-safeGreenContainer border border-safeGreen text-safeGreen text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{actionSuccessMessage}</span>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-sand-100 dark:bg-slate-800 border border-sand-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary dark:text-slate-100">Incident Narrative</span>
                    <span className="text-[10px] font-bold text-safeGreen uppercase tracking-wider">
                      PII Redacted for Minor
                    </span>
                  </div>
                  <p className="text-xs text-textDark dark:text-slate-200 leading-relaxed">
                    "{selectedCase.incidentDetails}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-sand-300 dark:border-slate-700 shadow-warm-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-sand-200 dark:border-slate-700 pb-2">
                    <span className="text-xs font-bold text-primary dark:text-slate-100">AI Signal Matrix</span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Threat Score: {selectedCase.threatScore} / 100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-sand-100 dark:bg-slate-800 border border-sand-200 dark:border-slate-700">
                      <span className="text-[10px] text-textMuted dark:text-slate-400 uppercase font-semibold">Category</span>
                      <p className="font-bold text-primary dark:text-slate-100 mt-0.5">{selectedCase.category}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-sand-100 dark:bg-slate-800 border border-sand-200 dark:border-slate-700">
                      <span className="text-[10px] text-textMuted dark:text-slate-400 uppercase font-semibold">Emotional Distress</span>
                      <p className="font-bold text-errorRed mt-0.5">{selectedCase.distressLevel || 85}% Risk Level</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sand-100 dark:bg-slate-800 border border-sand-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary dark:text-slate-100 flex items-center gap-1">
                      <Fingerprint className="w-3.5 h-3.5 text-secondary dark:text-orange-400" />
                      Evidence SHA-256 Hash Seal
                    </span>
                    <span className="text-[10px] font-bold text-safeGreen">Court Admissible</span>
                  </div>
                  <p className="font-mono text-[11px] text-textMuted dark:text-slate-300 break-all select-all bg-surface dark:bg-slate-900 p-2 rounded border border-sand-300 dark:border-slate-700">
                    {selectedCase.evidenceSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                  </p>
                </div>

                {/* Protocol Escalation Actions */}
                <div className="space-y-3 pt-2 border-t border-sand-200 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-textMuted dark:text-slate-400 block">
                    Authorized Protocol Interventions:
                  </span>

                  {/* Button 1: Platform Takedown Notice */}
                  <button
                    onClick={handleDispatchTakedown}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-warm-sm transition-all active:scale-95 cursor-pointer ${
                      isTakedownDispatched
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500'
                        : 'bg-primary hover:bg-primary-hover text-surface'
                    }`}
                  >
                    {isTakedownDispatched ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                        <span className="truncate">✓ Platform Takedown Dispatched (Meta & Snapchat)</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-secondary flex-shrink-0" />
                        <span>Dispatch Automated Platform Takedown Notice</span>
                      </>
                    )}
                  </button>

                  {/* Button 2: Manual Counselor Assignment */}
                  <button
                    onClick={() => setShowCounselorModal(true)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-warm-sm transition-all active:scale-95 cursor-pointer ${
                      currentCaseAssignedCounselor
                        ? 'bg-purple-600 hover:bg-purple-700 text-white border border-purple-500'
                        : 'bg-secondary hover:bg-secondary-dark text-primary'
                    }`}
                  >
                    {currentCaseAssignedCounselor ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                        <span className="truncate">✓ Counselor Assigned ({currentCaseAssignedCounselor.split(' ')[0]} {currentCaseAssignedCounselor.split(' ')[1] || ''})</span>
                      </>
                    ) : (
                      <>
                        <PhoneCall className="w-4 h-4 flex-shrink-0" />
                        <span>Assign Trauma Counselor via Childline 1098</span>
                      </>
                    )}
                  </button>

                  {/* Button 3: Actual Dossier Export Modal View */}
                  <button
                    onClick={() => setShowDocketModal(true)}
                    className="w-full py-3 px-4 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 hover:bg-sand-100 dark:hover:bg-slate-700 text-primary dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-secondary dark:text-orange-400" />
                    <span>Export Admissible Incident Dossier (PDF)</span>
                  </button>
                </div>

                <div className="text-[11px] text-textMuted dark:text-slate-400 text-center pt-1 flex items-center justify-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Immutable audit log generated for High Court judicial scrutiny</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-textMuted space-y-2">
              <Shield className="w-10 h-10 mx-auto text-sand-400" />
              <p className="text-sm font-bold text-primary dark:text-slate-100">Select a ticket from the queue</p>
              <p className="text-xs">Click any incident to open the active forensic deep-dive.</p>
            </div>
          )}
        </aside>
      </div>

      {/* ============================================================================== */}
      {/* MANUAL COUNSELOR ASSIGNMENT MODAL */}
      {/* ============================================================================== */}
      {showCounselorModal && selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-slate-900 border border-sand-300 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-sand-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-secondary" />
                <h3 className="font-extrabold text-base text-primary dark:text-slate-100">
                  Manual Trauma Counselor Assignment
                </h3>
              </div>
              <button
                onClick={() => setShowCounselorModal(false)}
                className="p-1 rounded-lg text-textMuted hover:bg-sand-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-textMuted dark:text-slate-300">
                Assign a certified trauma counselor or Childline 1098 officer to Case <strong>#{selectedCase.caseNumber}</strong>:
              </p>

              {/* Preset Counselors Selection */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-primary dark:text-slate-200">
                  Select Nodal Counselor Preset:
                </label>
                <div className="space-y-1.5">
                  {COUNSELOR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAssignCounselor(preset)}
                      className="w-full text-left p-3 rounded-xl border border-sand-300 dark:border-slate-800 bg-sand-50 dark:bg-slate-800 hover:border-secondary dark:hover:border-orange-500 hover:bg-amber-50 dark:hover:bg-slate-700/80 text-xs font-bold text-primary dark:text-slate-100 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{preset}</span>
                      <UserCheck className="w-4 h-4 text-secondary flex-shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Or Custom Counselor Input */}
              <div className="pt-2 border-t border-sand-200 dark:border-slate-800 space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-primary dark:text-slate-200">
                  Or Type Custom Officer / Counselor Name:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCounselorName}
                    onChange={(e) => setCustomCounselorName(e.target.value)}
                    placeholder="e.g. Dr. Meera Reddy (Childline 1098)"
                    className="flex-1 px-3 py-2 rounded-xl border border-sand-300 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs text-primary dark:text-slate-100 font-medium"
                  />
                  <button
                    disabled={!customCounselorName.trim()}
                    onClick={() => handleAssignCounselor(customCounselorName)}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover dark:bg-orange-600 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* FORMAL CYBER EVIDENCE DOCKET MODAL (ACTUAL PDF EXPORT) */}
      {/* ============================================================================== */}
      {showDocketModal && selectedCase && (
        <CyberEvidenceDocket
          report={selectedCase}
          onClose={() => setShowDocketModal(false)}
        />
      )}
    </div>
  );
};
