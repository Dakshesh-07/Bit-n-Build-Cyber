import React, { useState } from 'react';
import { 
  Users, 
  PhoneCall, 
  ShieldCheck, 
  Mail
} from 'lucide-react';

interface Counselor {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  specialty: string;
  languages: string[];
  isAvailable: boolean;
  clearanceVerified: boolean;
  phone: string;
  email: string;
}

const COUNSELORS: Counselor[] = [
  {
    id: 'c-1',
    name: 'Dr. Radhika Sen',
    role: 'Licensed Adolescent Psychologist',
    affiliation: 'NIMHANS Child Guidance Clinic',
    specialty: 'Trauma & Cyber Extortion Recovery',
    languages: ['English', 'Hindi', 'Bengali'],
    isAvailable: true,
    clearanceVerified: true,
    phone: '+91 98765 43210',
    email: 'radhika.sen@nimhans.ac.in',
  },
  {
    id: 'c-2',
    name: 'Advocate Kiran Varma',
    role: 'POCSO & Cyber Forensics Legal Nodal',
    affiliation: 'National Child Rights Alliance',
    specialty: 'Legal Takedowns, Evidence Hashing & Police Liaison',
    languages: ['English', 'Hindi', 'Kannada'],
    isAvailable: true,
    clearanceVerified: true,
    phone: '+91 98123 45678',
    email: 'kiran.varma@ncla.org.in',
  },
  {
    id: 'c-3',
    name: 'Sister Mary Joseph',
    role: 'School Counseling Lead',
    affiliation: 'Bal Suraksha Peer Network',
    specialty: 'Bullying Mediation, Peer Stress & School Re-entry',
    languages: ['English', 'Hindi', 'Malayalam'],
    isAvailable: false,
    clearanceVerified: true,
    phone: '+91 94567 89012',
    email: 'mary.joseph@balsuraksha.org',
  }
];

export const SafeConnect: React.FC = () => {
  const [counselors] = useState<Counselor[]>(COUNSELORS);

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <section className="bg-surface rounded-2xl p-8 sm:p-12 border border-sand-300 shadow-warm-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 text-xs font-bold text-primary">
            <Users className="w-3.5 h-3.5 text-secondary-dark" />
            <span>Verified Protective Circles</span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">
            SafeConnect: Verified Mentors & Counselors
          </h1>
          <p className="text-sm text-textMuted leading-relaxed">
            Connect directly with verified adolescent psychologists, legal aid advocates, and school nodal counselors. Direct phone lines and official secure emails are available below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="tel:1098"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-surface text-sm font-bold shadow-warm-sm hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
          >
            <PhoneCall className="w-4 h-4 text-secondary" />
            <span>Call 1098 Directly</span>
          </a>
        </div>
      </section>

      {/* Counselors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {counselors.map((c) => (
          <div
            key={c.id}
            className="bg-surface rounded-2xl p-7 border border-sand-300 hover:border-sand-400 shadow-warm-card hover:shadow-warm-elevated transition-all duration-200 flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-full bg-primary text-secondary flex items-center justify-center font-bold text-lg">
                  {c.name.charAt(0)}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                  c.isAvailable
                    ? 'bg-safeGreenContainer text-safeGreen'
                    : 'bg-sand-200 text-textMuted'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.isAvailable ? 'bg-safeGreen' : 'bg-textMuted'}`}></span>
                  {c.isAvailable ? 'Available Now' : 'In Session'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-primary">{c.name}</h3>
                  <span title="Clearance Verified">
                    <ShieldCheck className="w-4 h-4 text-safeGreen" />
                  </span>
                </div>
                <p className="text-xs text-secondary-dark font-bold mt-0.5">{c.role}</p>
                <p className="text-xs text-textMuted">{c.affiliation}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-sand-200 text-xs">
                <span className="font-semibold text-textMuted block">Specialty Area:</span>
                <p className="font-medium text-textDark bg-sand-100 p-2 rounded-lg border border-sand-200">
                  {c.specialty}
                </p>
              </div>

              <div className="space-y-1 text-xs text-textMuted">
                <span>Languages spoken: </span>
                <span className="font-bold text-primary">{c.languages.join(', ')}</span>
              </div>
            </div>

            {/* Static Contact Details (Phone & Email) */}
            <div className="pt-3 border-t border-sand-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sand-100 border border-sand-200">
                <PhoneCall className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span className="font-bold text-primary select-all">{c.phone}</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sand-100 border border-sand-200">
                <Mail className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span className="font-medium text-textDark text-[11px] truncate select-all">{c.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
