import React, { useState, useMemo } from 'react';
import { Project } from '../types/index.js';
import { VerificationBadge } from '../components/Badges.js';
import { RadarVisualizer } from '../components/RadarVisualizer.js';
import { PlainTooltip } from '../components/PlainTooltip.js';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

interface VerificationStatusPageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onBackToDashboard?: () => void;
}

export const VerificationStatusPage: React.FC<VerificationStatusPageProps> = ({
  projects,
  onSelectProject,
  onBackToDashboard
}) => {
  const { language, t, translateCategory, translateVerificationStatus } = useLanguage();
  const [filterState, setFilterState] = useState<'ALL' | 'Verified' | 'Under Review' | 'Flagged'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Classify projects into plain verification statuses
  const classifiedProjects = useMemo(() => {
    return projects.map(p => {
      let vStatus: 'Verified' | 'Under Review' | 'Flagged' = 'Verified';
      if (p.riskAnalysis.overallScore > 65 || p.status === 'Delayed') {
        vStatus = 'Flagged';
      } else if (p.riskAnalysis.overallScore > 35 || p.status === 'Under Review') {
        vStatus = 'Under Review';
      } else {
        vStatus = 'Verified';
      }
      return {
        ...p,
        vStatus
      };
    });
  }, [projects]);

  const counts = useMemo(() => {
    return {
      verified: classifiedProjects.filter(p => p.vStatus === 'Verified').length,
      underReview: classifiedProjects.filter(p => p.vStatus === 'Under Review').length,
      flagged: classifiedProjects.filter(p => p.vStatus === 'Flagged').length,
      total: classifiedProjects.length
    };
  }, [classifiedProjects]);

  const filteredProjects = useMemo(() => {
    return classifiedProjects.filter(p => {
      if (filterState !== 'ALL' && p.vStatus !== filterState) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.constituency.toLowerCase().includes(q) ||
          (p.projectCode && p.projectCode.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [classifiedProjects, filterState, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Persistent Back Button */}
      {onBackToDashboard && (
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-govt-navy bg-white border border-slate-border hover:bg-panel-bg rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← {t.backToOverview}</span>
          </button>
          <span className="text-xs text-slate-muted">
            {t.home} &gt; {language === 'hi' ? 'सत्यापन स्थिति' : 'Verification Status'}
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-border p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-govt-navy uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-status-verified" />
                {language === 'hi' ? 'सार्वजनिक पारदर्शिता सत्यापन' : 'Public Transparency Verification'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-govt-navy font-semibold border border-emerald-200">
                {language === 'hi' ? 'आधिकारिक सांख्यिकी मंत्रालय (MoSPI) फ़ीड' : 'Official MoSPI Feed'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-body mt-1">
              {language === 'hi' ? 'परियोजना सत्यापन स्थिति' : 'Project Verification Status'}
            </h1>
            <p className="text-xs text-slate-muted mt-1 max-w-2xl leading-relaxed">
              {language === 'hi'
                ? 'प्रत्येक सांसद निधि परियोजना जमीनी मील के पत्थर की जांच, फोटो मिलान और वित्तीय ऑडिट से गुजरती है। नीचे विवरण देखें।'
                : 'Every MPLADS project undergoes field milestone checks, photographic matching, and financial auditing. Inspect verification records below in simple language.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <PlainTooltip
              term={language === 'hi' ? 'सत्यापन प्रक्रिया' : 'Verification Process'}
              explanation={
                language === 'hi'
                  ? "कार्यों को 'सत्यापित' तब चिह्नित किया जाता है जब तस्वीरें जीपीएस स्थान से मेल खाती हैं और खर्च आधिकारिक अनुमानों के अनुरूप होते हैं।"
                  : "Works are labeled 'Verified' when photographs match GPS locations and expenditures align with official estimates. 'Under Review' works are awaiting documentation, and 'Flagged' works require field inspection."
              }
            />
          </div>
        </div>

        {/* Top 3 Summary Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-border">
          <button
            onClick={() => setFilterState('Verified')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              filterState === 'Verified'
                ? 'bg-emerald-50/80 border-status-verified'
                : 'bg-panel-bg border-slate-border hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-status-verified flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {language === 'hi' ? 'सत्यापित कार्य' : 'Verified Works'}
              </span>
              <span className="text-lg font-bold text-status-verified">{counts.verified}</span>
            </div>
            <p className="text-[11px] text-slate-muted mt-1">
              {language === 'hi' ? 'पुष्ट जमीनी प्रगति और सत्यापित मील के पत्थर रिकॉर्ड।' : 'Confirmed on-ground progress and verified milestone records.'}
            </p>
          </button>

          <button
            onClick={() => setFilterState('Under Review')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              filterState === 'Under Review'
                ? 'bg-amber-50/80 border-status-review'
                : 'bg-panel-bg border-slate-border hover:bg-amber-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-status-review flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {language === 'hi' ? 'समीक्षाधीन' : 'Under Review'}
              </span>
              <span className="text-lg font-bold text-status-review">{counts.underReview}</span>
            </div>
            <p className="text-[11px] text-slate-muted mt-1">
              {language === 'hi' ? 'फील्ड रिपोर्ट या नियमित दस्तावेज़ वर्तमान में समीक्षाधीन हैं।' : 'Field reports or routine documentation currently pending review.'}
            </p>
          </button>

          <button
            onClick={() => setFilterState('Flagged')}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              filterState === 'Flagged'
                ? 'bg-red-50/80 border-status-flagged'
                : 'bg-panel-bg border-slate-border hover:bg-red-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-status-flagged flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {language === 'hi' ? 'निरीक्षण हेतु चिह्नित' : 'Flagged for Inspection'}
              </span>
              <span className="text-lg font-bold text-status-flagged">{counts.flagged}</span>
            </div>
            <p className="text-[11px] text-slate-muted mt-1">
              {language === 'hi' ? 'असामान्य समय-सीमा या फ़ोटो विसंगति जिसके लिए ज़िला सत्यापन आवश्यक है।' : 'Unusual timeline or photographic disparity requiring district verification.'}
            </p>
          </button>
        </div>
      </div>

      {/* Multi-Metric Radar Chart for holistic overview */}
      <RadarVisualizer projects={projects} defaultMode="CONSTITUENCY" />

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-border p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'शीर्षक, निर्वाचन क्षेत्र या आईडी से खोजें...' : 'Search by title, constituency, or ID...'}
            className="w-full pl-9 pr-3 py-2 bg-panel-bg hover:bg-white focus:bg-white text-xs text-slate-body border border-slate-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-govt-navy"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs">
          <span className="text-slate-muted font-medium mr-1">{language === 'hi' ? 'स्थिति:' : 'Status:'}</span>
          {(['ALL', 'Verified', 'Under Review', 'Flagged'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterState(s)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterState === s
                  ? 'bg-govt-navy text-white font-semibold'
                  : 'bg-panel-bg text-slate-body hover:bg-slate-border'
              }`}
            >
              {s === 'ALL' ? (language === 'hi' ? 'सभी' : 'ALL') : translateVerificationStatus(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="bg-white rounded-xl border border-slate-border p-4 shadow-sm hover:border-govt-navy hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono text-slate-muted font-semibold">
                  {project.projectCode || project.id}
                </span>
                <VerificationBadge status={project.vStatus} />
              </div>

              <h3 className="text-sm font-bold text-slate-body leading-snug line-clamp-2">
                {project.title}
              </h3>

              <div className="mt-2.5 text-xs text-slate-muted space-y-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-govt-navy shrink-0" />
                  <span className="truncate">{project.constituency} &bull; {translateCategory(project.category)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-muted shrink-0" />
                  <span>{language === 'hi' ? 'स्वीकृत:' : 'Sanctioned:'} ₹{((project.sanctionedAmount || project.estimatedCost) / 100000).toFixed(1)} {language === 'hi' ? 'लाख' : 'Lakh'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-border flex items-center justify-between text-xs">
              <span className="text-slate-muted">
                {project.vStatus === 'Verified' && (language === 'hi' ? 'सभी जांच सफल' : 'All checks passed')}
                {project.vStatus === 'Under Review' && (language === 'hi' ? 'साइट रिपोर्ट प्रतीक्षित' : 'Awaiting site report')}
                {project.vStatus === 'Flagged' && (language === 'hi' ? 'समीक्षा आवश्यक' : 'Requires review')}
              </span>
              <span className="text-govt-navy font-semibold hover:underline flex items-center gap-1">
                {language === 'hi' ? 'विवरण' : 'Details'} &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-border p-8 text-center text-xs text-slate-muted">
          {language === 'hi' ? 'चयनित सत्यापन मानदंडों से कोई परियोजना मेल नहीं खाती।' : 'No projects match the selected verification criteria.'}
        </div>
      )}
    </div>
  );
};
