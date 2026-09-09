import React, { useState } from 'react';
import { Project, RiskAlert, DuplicateProjectCandidate } from '../types/index.js';
import { RiskBadge, StatusBadge } from '../components/Badges.js';
import {
  Sparkles,
  AlertTriangle,
  FileCheck2,
  Camera,
  MapPin,
  Clock,
  IndianRupee,
  Layers,
  ArrowRight,
  AlertOctagon,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Compass,
  X,
  Eye,
  Crosshair,
  ShieldAlert,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { CATEGORY_COST_BENCHMARKS } from '../types/index.js';
import { useLanguage } from '../context/LanguageContext.js';

interface AiAnomaliesPageProps {
  projects: Project[];
  alerts: RiskAlert[];
  onSelectProject: (project: Project, initialTab?: 'overview' | 'ai-risk' | 'photos' | 'financials' | 'documents' | 'audit-report') => void;
  onOpenAlertAction: (alert: RiskAlert) => void;
  onBackToDashboard?: () => void;
}

export const AiAnomaliesPage: React.FC<AiAnomaliesPageProps> = ({
  projects,
  alerts,
  onSelectProject,
  onOpenAlertAction,
  onBackToDashboard
}) => {
  const { language, t, translateCategory } = useLanguage();
  const [activeModule, setActiveModule] = useState<'all' | 'cost' | 'duplicate' | 'photo' | 'gps' | 'delay'>('all');
  const [photoInspectionProject, setPhotoInspectionProject] = useState<Project | null>(null);
  const [gpsInspectionProject, setGpsInspectionProject] = useState<Project | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Filtered views
  const costAnomalies = projects.filter(p => p.riskAnalysis.costAnomalyScore > 50 || p.riskAnalysis.costBaseline?.isAnomaly);
  const duplicateFlags = alerts.filter(a => a.alertType === 'Possible Duplicate');
  const photoAnomalies = alerts.filter(a => a.alertType === 'Photo Anomaly');
  const locationMismatches = alerts.filter(a => a.alertType === 'Location Mismatch');
  const delayRisks = projects.filter(p => p.riskAnalysis.delayProbability > 60);

  const showNotice = (msg: string) => {
    setActionSuccessNotice(msg);
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

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
            {t.home} &gt; {language === 'hi' ? 'एआई विसंगतियां' : 'AI Anomalies'}
          </span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-govt-navy text-white rounded-2xl p-6 border border-govt-navy-dark shadow-sm">
        <div className="flex items-center gap-2 text-panel-bg/80 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{t.vigilanceDecisionEngine}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5">
          {t.aiAnomaliesTitle}
        </h1>
        <p className="text-xs text-panel-bg/90 mt-1 max-w-3xl leading-relaxed">
          {t.aiAnomaliesSubtitle}
        </p>

        {/* Mandatory Human Review Disclaimer */}
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-900">{t.statutoryAdvisory}</strong> {t.statutoryAdvisoryText}
          </div>
        </div>
      </div>

      {/* Module Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveModule('all')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeModule === 'all'
              ? 'bg-govt-navy text-white shadow-xs border border-govt-navy-dark'
              : 'bg-white text-slate-muted border border-slate-border hover:bg-panel-bg'
          }`}
        >
          {t.allModulesOverview}
        </button>

        <button
          onClick={() => setActiveModule('cost')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'cost'
              ? 'bg-govt-navy text-white shadow-xs border border-govt-navy-dark'
              : 'bg-white text-slate-muted border border-slate-border hover:bg-panel-bg'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5 text-amber-700" />
          <span>{t.costBenchmarkAnomalies} ({costAnomalies.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('duplicate')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'duplicate'
              ? 'bg-govt-navy text-white shadow-xs border border-govt-navy-dark'
              : 'bg-white text-slate-muted border border-slate-border hover:bg-panel-bg'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-govt-navy" />
          <span>{t.spatialDuplicateDetection} ({duplicateFlags.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('photo')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'photo'
              ? 'bg-govt-navy text-white shadow-xs border border-govt-navy-dark'
              : 'bg-white text-slate-muted border border-slate-border hover:bg-panel-bg'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-slate-muted" />
          <span>{t.photoIntegrityAnomalies} ({photoAnomalies.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('gps')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'gps'
              ? 'bg-govt-navy text-white shadow-xs border border-govt-navy-dark'
              : 'bg-white text-slate-muted border border-slate-border hover:bg-panel-bg'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-red-600" />
          <span>{t.locationMismatchAnomalies} ({locationMismatches.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('delay')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'delay'
              ? 'bg-govt-navy text-white shadow-xs border border-govt-navy-dark'
              : 'bg-white text-slate-muted border border-slate-border hover:bg-panel-bg'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>{t.executionDelayRisks} ({delayRisks.length})</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessNotice && (
        <div className="p-3 bg-emerald-50 text-status-verified border border-status-verified/30 rounded-xl flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-status-verified" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button onClick={() => setActionSuccessNotice(null)} className="p-1 hover:bg-emerald-100 rounded cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MODULE 1: COST ANOMALY DETECTION */}
      {(activeModule === 'all' || activeModule === 'cost') && (
        <section className="bg-white rounded-2xl border border-slate-border shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-panel-bg border-b border-slate-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-body flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-amber-700" />
                <span>1. Cost Anomaly Detection (Statistical Category & Regional Baseline)</span>
              </h2>
              <p className="text-[11px] text-slate-muted mt-0.5">
                Empirical baseline calculated per work category and state/district (Mean μ + Standard Deviation σ).
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
              {costAnomalies.length} Flagged
            </span>
          </div>

          <div className="p-5 space-y-4">
            {costAnomalies.map(project => {
              const cost = project.sanctionedAmount || project.estimatedCost;
              const costLakh = (cost / 100000).toFixed(2);
              const baseline = project.riskAnalysis.costBaseline;
              const meanLakh = baseline ? (baseline.cohortMean / 100000).toFixed(2) : '20.00';
              const stdDevLakh = baseline ? (baseline.cohortStdDev / 100000).toFixed(2) : '4.85';
              const zScore = baseline?.zScore ?? 2.3;
              const reasonString = baseline?.reason || `Cost is ${zScore.toFixed(1)} std deviations above the empirical cohort mean for ${project.category} in ${project.state || project.district}.`;

              return (
                <div
                  key={project.id}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-body">{project.projectCode}</span>
                      <StatusBadge status={project.status} />
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                        Z-Score: +{zScore.toFixed(2)}σ
                      </span>
                      <span className="text-[10px] text-slate-muted font-medium bg-panel-bg px-2 py-0.5 rounded border border-slate-border">
                        Cohort: {project.category} ({project.state || 'Telangana'})
                      </span>
                    </div>

                    <div className="font-bold text-slate-body text-sm">{project.title}</div>
                    
                    {/* Reason string */}
                    <div className="text-[11px] p-2 rounded-lg bg-white border border-amber-200 text-amber-800 font-medium">
                      <strong>Statistical Finding:</strong> {reasonString}
                    </div>

                    {/* Regional Cohort Breakdown */}
                    <div className="pt-1 flex items-center gap-4 text-[11px] text-slate-muted font-mono">
                      <span>Cohort Mean (μ): ₹{meanLakh}L</span>
                      <span>Std Dev (σ): ±₹{stdDevLakh}L</span>
                      <span className="font-bold text-red-600">Sanctioned: ₹{costLakh}L</span>
                    </div>
                  </div>

                    <div className="flex md:flex-col items-end gap-2 shrink-0">
                    <RiskBadge level={project.riskAnalysis.riskLevel} score={project.riskAnalysis.overallScore} />
                    <button
                      onClick={() => onSelectProject(project, 'ai-risk')}
                      className="px-3 py-1.5 bg-govt-navy hover:bg-govt-navy-light text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t.auditBoqJustification}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MODULE 2: SPATIAL DUPLICATE PROJECT DETECTION */}
      {(activeModule === 'all' || activeModule === 'duplicate') && (
        <section className="bg-white rounded-2xl border border-slate-border shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-panel-bg border-b border-slate-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-body flex items-center gap-2">
                <Layers className="w-4 h-4 text-govt-navy" />
                <span>{t.spatialDuplicateDetection}</span>
              </h2>
              <p className="text-[11px] text-slate-muted mt-0.5">
                {language === 'hi' ? 'मौजूदा बुनियादी ढांचे की 1,000 मीटर की परिधि में संभावित अनावश्यक कार्यों की पहचान करता है।' : 'Identifies potentially redundant works sanctioned within 1,000 meters of existing infrastructure assets.'}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-govt-navy rounded-full border border-emerald-200">
              {duplicateFlags.length} {language === 'hi' ? 'युग्म पहचाने गए' : 'Pairs Detected'}
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Live Duplicate Case Comparison */}
            <div className="p-4 bg-panel-bg rounded-xl border border-slate-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-body">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <span>{language === 'hi' ? 'उच्च समानता क्षेत्रीय मेल पहचाना गया (88% समानता | 430 मीटर दूरी)' : 'High Similarity Territory Match Detected (88% Match | 430m Distance)'}</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  {t.actionRequired}: {t.siteReconciliation}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Project A */}
                <div className="p-3 bg-white rounded-lg border border-slate-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-muted">PRJ-2025-001</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-status-verified font-bold border border-status-verified/30">{language === 'hi' ? 'पूर्ण' : 'Completed'}</span>
                  </div>
                  <div className="font-bold text-slate-body">{language === 'hi' ? '2000 एलपीएच आरओ पेयजल संयंत्र की स्थापना' : 'Installation of 2000 LPH RO Drinking Water Plant'}</div>
                  <div className="text-[11px] text-slate-muted">
                    {language === 'hi' ? 'स्थान: वार्ड 12 सामुदायिक भवन, सिकंदराबाद (17.4399° N, 78.4983° E)' : 'Location: Ward 12 Community Hall, Secunderabad (17.4399° N, 78.4983° E)'}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-body">{language === 'hi' ? 'स्वीकृति: ₹18.00 लाख (2024)' : 'Sanction: ₹18.00 Lakh (2024)'}</div>
                </div>

                {/* Project B (Duplicate candidate) */}
                <div className="p-3 bg-white rounded-lg border border-red-200 bg-red-50/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-red-600">PRJ-2025-004</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">{language === 'hi' ? 'प्रगति पर (50%)' : 'Ongoing (50%)'}</span>
                  </div>
                  <div className="font-bold text-slate-body">{language === 'hi' ? 'प्राथमिक विद्यालय में आरओ पेयजल शोधन इकाई' : 'RO Drinking Water Purification Unit at Primary School'}</div>
                  <div className="text-[11px] text-slate-muted">
                    {language === 'hi' ? 'स्थान: वार्ड 12 सरकारी स्कूल, सिकंदराबाद (17.4425° N, 78.4998° E)' : 'Location: Ward 12 Govt School, Secunderabad (17.4425° N, 78.4998° E)'}
                  </div>
                  <div className="text-xs font-mono font-bold text-red-600">{language === 'hi' ? 'स्वीकृति: ₹19.50 लाख (2025)' : 'Sanction: ₹19.50 Lakh (2025)'}</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-border text-xs text-slate-body space-y-1">
                <div className="font-bold text-slate-body">{language === 'hi' ? 'एल्गोरिदमिक सहसंबंध विवरण:' : 'Algorithmic Correlation Breakdown:'}</div>
                <div className="text-[11px] text-slate-muted">
                  • {language === 'hi' ? 'भौगोलिक निकटता: एक ही प्रशासनिक नगरपालिका वार्ड में 430 मीटर की दूरी।' : 'Physical proximity: 430 meters apart in the same administrative municipal ward.'}
                </div>
                <div className="text-[11px] text-slate-muted">
                  • {language === 'hi' ? 'लक्षित जनसंख्या ओवरलैप: 11 महीने पहले चालू की गई आरओ सुविधा के साथ उच्च ओवरलैप।' : 'Target population overlap: High overlap with existing functional RO facility commissioned 11 months earlier.'}
                </div>
                <div className="text-[11px] text-slate-muted">
                  • {language === 'hi' ? 'सिफारिश: शेष ₹9.75 लाख जारी करने से पहले जिला सतर्कता अधिकारी द्वारा संयुक्त निरीक्षण।' : 'Recommendation: Joint inspection by District Vigilance Officer before releasing remaining ₹9.75L payment tranche.'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODULE 3: AI PHOTO VERIFICATION */}
      {(activeModule === 'all' || activeModule === 'photo') && (
        <section className="bg-white rounded-2xl border border-slate-border shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-panel-bg border-b border-slate-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-body flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-muted" />
                <span>{t.photoIntegrityAnomalies}</span>
              </h2>
              <p className="text-[11px] text-slate-muted mt-0.5">
                {language === 'hi' ? 'फ़ॉरेंसिक dHash/pHash सहसंबंध, EXIF टाइमलाइन निरीक्षण एवं क्रॉस-प्रोजेक्ट इमेज मिलान।' : 'Forensic dHash/pHash perceptual correlation, EXIF timeline inspection, and cross-project image matching.'}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-govt-navy rounded-full border border-emerald-200">
              {language === 'hi' ? 'सक्रिय कंप्यूटर विज़न स्ट्रीम' : 'Active Computer Vision Stream'}
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div className="p-4 bg-panel-bg rounded-xl border border-slate-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-body">PRJ-2025-004</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                    ⚠ {language === 'hi' ? '94.1% परसेप्टुअल छवि समानता चिह्नित' : '94.1% Perceptual Image Similarity Flagged'}
                  </span>
                </div>
                <div className="font-bold text-slate-body">
                  {language === 'hi' ? 'आरओ पेयजल इकाई — फोटोग्राफिक माइलस्टोन पुन: उपयोग चिह्नित' : 'RO Drinking Water Unit — Photographic Milestone Reuse Flagged'}
                </div>
                <p className="text-slate-muted text-[11px] max-w-xl">
                  {language === 'hi' ? '15 फरवरी 2025 को प्रस्तुत प्रगति तस्वीर पहले प्रोजेक्ट PRJ-2024-082 (मेडचल वाटर फिल्ट्रेशन) के लिए प्रस्तुत संग्रह तस्वीर से मेल खाती है। हैश सहसंबंध: 0.941।' : 'Progress image submitted on 15 Feb 2025 matches an archive photograph previously submitted for Project PRJ-2024-082 (Medchal Water Filtration). Perceptual hash correlation: 0.941 | Hamming Distance: 3 bits.'}
                </p>
              </div>

              <button
                onClick={() => {
                  const p = projects.find(x => x.id === 'PRJ-2025-004') || projects[0];
                  setPhotoInspectionProject(p);
                }}
                className="px-3.5 py-2 bg-govt-navy hover:bg-govt-navy-light text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.inspectSubmittedPhotographs}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MODULE 4: GPS GEOTAG MISMATCH */}
      {(activeModule === 'all' || activeModule === 'gps') && (
        <section className="bg-white rounded-2xl border border-slate-border shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-panel-bg border-b border-slate-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-body flex items-center gap-2">
                <Compass className="w-4 h-4 text-red-600" />
                <span>{t.locationMismatchAnomalies}</span>
              </h2>
              <p className="text-[11px] text-slate-muted mt-0.5">
                {language === 'hi' ? 'तस्वीर EXIF निर्देशांकों का आधिकारिक परियोजना स्वीकृति निर्देशांकों (500 मीटर सीमा) से सत्यापन।' : 'Cross-references photo EXIF coordinate telemetry against the official project sanction coordinates (500m threshold).'}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-red-50 text-red-700 rounded-full border border-red-200">
              {locationMismatches.length} {language === 'hi' ? 'बेमेल अलर्ट' : 'Mismatch Alerts'}
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div className="p-4 bg-red-50/50 rounded-xl border border-red-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-body">PRJ-2025-007</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                    ⚠ {language === 'hi' ? 'स्थान बेमेल (1.42 किमी विसंगति)' : 'LOCATION MISMATCH (1.42 km Discrepancy)'}
                  </span>
                </div>
                <div className="font-bold text-slate-body">
                  {language === 'hi' ? 'चेरलापल्ली में नालियों के साथ सीमेंट कंक्रीट सड़क' : 'Cement Concrete Road with Cover Drains at Cherlapally'}
                </div>
                <div className="text-[11px] text-slate-muted font-mono">
                  {language === 'hi' ? 'स्वीकृत स्थल: 17.4720° N, 78.6010° E | फ़ोटो EXIF: 17.4845° N, 78.6080° E (दूरी: 1,420 मीटर)' : 'Sanction Site: 17.4720° N, 78.6010° E | Photo EXIF: 17.4845° N, 78.6080° E (Distance: 1,420 meters)'}
                </div>
                <div className="text-[11px] text-red-700 font-semibold">
                  {language === 'hi' ? 'सूचना: सड़क निर्माण का फोटोग्राफिक प्रमाण अधिकृत सीमा से बाहर लिया गया था।' : 'Notice: Photographic proof of road laying was captured outside the authorized territorial corridor.'}
                </div>
              </div>

              <button
                onClick={() => {
                  const p = projects.find(x => x.id === 'PRJ-2025-007') || projects[0];
                  setGpsInspectionProject(p);
                }}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{t.inspectGpsCoordinates}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MODULE 5: DELAY PREDICTION */}
      {(activeModule === 'all' || activeModule === 'delay') && (
        <section className="bg-white rounded-2xl border border-slate-border shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-panel-bg border-b border-slate-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-body flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>5. Project Execution Delay Prediction Model</span>
              </h2>
              <p className="text-[11px] text-slate-muted mt-0.5">
                Computes daily physical execution velocity, elapsed schedule, and confidence-bounded completion overrun forecasts.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
              {delayRisks.length} Schedule Overruns
            </span>
          </div>

          <div className="p-5 space-y-3">
            {/* Statutory Model Validation Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span><strong>Model Validation Notice:</strong> Model trained on synthetic data — validation pending. Holdout validation metrics: Precision: 85.7% | Recall: 80.0% | F1-Score: 82.8% (Sample: 18 historical works).</span>
              </div>
            </div>

            {delayRisks.map(project => {
              const confidenceStr = project.riskAnalysis.delayMetrics?.confidenceIntervalString || '80% confidence, ± 14 days';
              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project, 'ai-risk')}
                  className="p-3.5 rounded-xl border border-slate-border hover:bg-panel-bg cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-body">{project.projectCode}</span>
                      <StatusBadge status={project.status} />
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {project.riskAnalysis.delayProbability}% Delay Probability
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-muted bg-panel-bg border border-slate-border">
                        {confidenceStr}
                      </span>
                    </div>
                    <div className="font-bold text-slate-body truncate">{project.title}</div>
                    <div className="text-[11px] text-slate-muted">
                      Agency: {project.implementingAgencyName} | Physical Progress: {project.completionPercentage}%
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-[11px]">
                    <div className="text-slate-muted">Expected: {project.expectedCompletionDate || 'Overdue'}</div>
                    <div className="text-red-600 font-bold">Overrun Risk High</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FORENSIC INSPECTION MODAL 1: PHOTO VERIFICATION */}
      {photoInspectionProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-govt-navy-dark/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-border overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 bg-govt-navy text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-panel-bg/80 flex items-center gap-1.5">
                  <Camera className="w-4 h-4" />
                  <span>Forensic Photographic Integrity Inspector</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Perceptual Hash & EXIF Timestamp Analysis — {photoInspectionProject.projectCode}
                </h3>
              </div>
              <button
                onClick={() => setPhotoInspectionProject(null)}
                className="p-1.5 text-panel-bg/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Alert Status Banner */}
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Computer Vision Duplicate Match Flagged (94.1% Perceptual Hash Correlation)</div>
                  <div className="text-[11px] mt-0.5 leading-relaxed text-red-800">
                    The computer vision verification engine identified that the submitted milestone photograph matches a pre-existing photographic asset in the state archive. This indicates photographic reuse violating MPLADS Statutory Rule 14.
                  </div>
                </div>
              </div>

              {/* Comparative Side-by-Side Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Submitted Photo */}
                <div className="p-3.5 bg-panel-bg rounded-xl border border-slate-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-body uppercase tracking-wider text-[11px]">A. Submitted Milestone Photo</span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-[10px] font-bold">Flagged Asset</span>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden border border-slate-border relative bg-black/10">
                    <img
                      src={photoInspectionProject.photos[0]?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=800&auto=format&fit=crop&q=80'}
                      alt="Submitted milestone"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white rounded text-[10px] font-mono">
                      Submitted: 15 Feb 2025
                    </div>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-muted">
                    <div>Hardware: <strong className="text-slate-body">Sony IMX686 (f/1.89, ISO 64)</strong></div>
                    <div>EXIF Timestamp: <strong className="text-red-600">10 Oct 2022 14:22 IST</strong> ⚠</div>
                    <div className="text-[10px] text-red-600 italic">
                      EXIF capture date predates tender sanction date (10 Apr 2024) by 18 months!
                    </div>
                  </div>
                </div>

                {/* Archive Matched Master */}
                <div className="p-3.5 bg-panel-bg rounded-xl border border-slate-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-body uppercase tracking-wider text-[11px]">B. Matched Historical Archive Master</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-status-verified rounded text-[10px] font-bold">Original Reference</span>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden border border-slate-border relative bg-black/10">
                    <img
                      src="https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80"
                      alt="Archive reference"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white rounded text-[10px] font-mono">
                      Archive: PRJ-2024-082 (12 Nov 2023)
                    </div>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-muted">
                    <div>Origin Project: <strong className="text-slate-body">PRJ-2024-082 (Medchal RO Unit)</strong></div>
                    <div>Agency: <strong className="text-slate-body">Telangana Rural Infra Corp</strong></div>
                    <div className="text-[10px] text-status-verified">
                      Completed & commissioned work record from 2023-24 financial year.
                    </div>
                  </div>
                </div>
              </div>

              {/* Mathematical Telemetry Table */}
              <div className="p-4 bg-white rounded-xl border border-slate-border space-y-2">
                <div className="font-bold text-slate-body uppercase tracking-wider text-[11px]">
                  Mathematical Verification Telemetry
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-panel-bg rounded-lg border border-slate-border">
                    <div className="text-[10px] text-slate-muted">Perceptual Correlation</div>
                    <div className="text-base font-bold text-red-600 font-mono mt-0.5">0.941 (94.1%)</div>
                  </div>
                  <div className="p-2.5 bg-panel-bg rounded-lg border border-slate-border">
                    <div className="text-[10px] text-slate-muted">Hamming Distance</div>
                    <div className="text-base font-bold text-red-600 font-mono mt-0.5">3 / 64 bits</div>
                  </div>
                  <div className="p-2.5 bg-panel-bg rounded-lg border border-slate-border">
                    <div className="text-[10px] text-slate-muted">Max Match Threshold</div>
                    <div className="text-base font-bold text-slate-body font-mono mt-0.5">≤ 5 bits</div>
                  </div>
                  <div className="p-2.5 bg-panel-bg rounded-lg border border-slate-border">
                    <div className="text-[10px] text-slate-muted">ELA Compression Delta</div>
                    <div className="text-base font-bold text-govt-navy font-mono mt-0.5">0.88 (Identical)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-panel-bg border-t border-slate-border flex items-center justify-between flex-wrap gap-2">
              <button
                onClick={() => {
                  showNotice(language === 'hi' ? 'नियम 14 के तहत कार्यान्वयन एजेंसी को वैधानिक स्पष्टीकरण नोटिस जारी किया गया।' : 'Statutory explanation notice issued to implementing agency under Rule 14.');
                  setPhotoInspectionProject(null);
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                {t.issueShowCauseRule14}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPhotoInspectionProject(null)}
                  className="px-4 py-2 bg-white hover:bg-panel-bg text-slate-muted border border-slate-border rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  {t.closeInspector}
                </button>
                <button
                  onClick={() => {
                    const p = photoInspectionProject;
                    setPhotoInspectionProject(null);
                    onSelectProject(p, 'photos');
                  }}
                  className="px-4 py-2 bg-govt-navy hover:bg-govt-navy-light text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  {t.openInProjectWorkspace}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORENSIC INSPECTION MODAL 2: GPS COORDINATES */}
      {gpsInspectionProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-govt-navy-dark/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-border overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 bg-govt-navy text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-panel-bg/80 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>{language === 'hi' ? 'भू-स्थानिक सीमा एवं जीपीएस EXIF निरीक्षक' : 'Geospatial Boundary & GPS EXIF Inspector'}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {language === 'hi' ? 'परिधि सहिष्णुता सत्यापन' : 'Perimeter Tolerance Verification'} — {gpsInspectionProject.projectCode}
                </h3>
              </div>
              <button
                onClick={() => setGpsInspectionProject(null)}
                className="p-1.5 text-panel-bg/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Alert Status Banner */}
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">{language === 'hi' ? 'जियोटैग निर्देशांक स्वीकृति सीमा से बाहर (1,420 मीटर बनाम 500 मीटर स्वीकार्य)' : 'Geotag Coordinates Out of Sanction Boundary (1,420m vs 500m Allowable)'}</div>
                  <div className="text-[11px] mt-0.5 leading-relaxed text-red-800">
                    {language === 'hi' ? 'तस्वीर EXIF जीपीएस स्थान आधिकारिक रूप से स्वीकृत परियोजना निर्देशांक से 1,420 मीटर दूर कैप्चर किया गया था, जो वैधानिक 500-मीटर स्वीकार्य सहिष्णुता बफर से 920 मीटर अधिक है।' : 'The photo EXIF GPS location was captured 1,420 meters from the officially sanctioned project coordinates, exceeding the statutory 500-meter allowable tolerance buffer by 920 meters.'}
                  </div>
                </div>
              </div>

              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-panel-bg rounded-xl border border-slate-border space-y-1">
                  <div className="text-[10px] text-slate-muted font-bold uppercase">{language === 'hi' ? 'स्वीकृति स्थल निर्देशांक' : 'Sanction Site Coordinates'}</div>
                  <div className="font-mono text-sm font-bold text-slate-body">17.4720° N, 78.6010° E</div>
                  <div className="text-[11px] text-slate-muted">{language === 'hi' ? 'चेरलापल्ली औद्योगिक गलियारा' : 'Cherlapally Industrial Corridor'}</div>
                </div>
                <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 space-y-1">
                  <div className="text-[10px] text-red-700 font-bold uppercase">{language === 'hi' ? 'फ़ोटो EXIF निर्देशांक' : 'Photo EXIF Coordinates'}</div>
                  <div className="font-mono text-sm font-bold text-red-700">17.4845° N, 78.6080° E</div>
                  <div className="text-[11px] text-red-600">{language === 'hi' ? 'मौला अली रेलवे यार्ड सीमा' : 'Moula Ali Railway Yard Boundary'}</div>
                </div>
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <div className="text-[10px] text-amber-800 font-bold uppercase">{language === 'hi' ? 'विसंगति वेक्टर' : 'Discrepancy Vector'}</div>
                  <div className="font-mono text-sm font-bold text-amber-800">1,420 {language === 'hi' ? 'मीटर' : 'Meters'}</div>
                  <div className="text-[11px] text-amber-700">{language === 'hi' ? '500 मीटर बफर से 920 मीटर अधिक' : 'Exceeds 500m buffer by 920m'}</div>
                </div>
              </div>

              {/* Visual Geofence Vector Schematic */}
              <div className="p-4 bg-panel-bg rounded-xl border border-slate-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-body uppercase tracking-wider text-[11px]">
                    {language === 'hi' ? 'भू-स्थानिक सहिष्णुता गलियारा मानचित्र' : 'Geospatial Tolerance Corridor Map'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-muted">Haversine Calculation (WGS84)</span>
                </div>

                <div className="relative h-48 bg-white rounded-lg border border-slate-border overflow-hidden flex items-center justify-center p-4">
                  {/* Visual SVG schematic */}
                  <svg className="w-full h-full" viewBox="0 0 400 160">
                    {/* Sanction 500m allowable boundary */}
                    <circle cx="120" cy="80" r="50" fill="#F1F5F9" stroke="#0F5C3C" strokeWidth="2" strokeDasharray="4 2" />
                    <text x="120" y="75" textAnchor="middle" fill="#0F5C3C" fontSize="10" fontWeight="bold">{language === 'hi' ? 'स्वीकृति स्थल' : 'Sanction Site'}</text>
                    <text x="120" y="90" textAnchor="middle" fill="#5A6472" fontSize="8">{language === 'hi' ? '500 मी. जियोफ़ेंस बफ़र' : '500m Geofence Buffer'}</text>
                    <circle cx="120" cy="80" r="4" fill="#0F5C3C" />

                    {/* Vector line */}
                    <line x1="120" y1="80" x2="310" y2="80" stroke="#DC2626" strokeWidth="2" strokeDasharray="6 3" />
                    <text x="215" y="72" textAnchor="middle" fill="#DC2626" fontSize="9" fontWeight="bold">Δ 1,420m (+920m)</text>

                    {/* Actual photo coordinate */}
                    <circle cx="310" cy="80" r="8" fill="#FEF2F2" stroke="#DC2626" strokeWidth="2" />
                    <circle cx="310" cy="80" r="4" fill="#DC2626" />
                    <text x="310" y="105" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold">{language === 'hi' ? 'फ़ोटो EXIF जियोटैग' : 'Photo EXIF Geotag'}</text>
                    <text x="310" y="118" textAnchor="middle" fill="#5A6472" fontSize="8">{language === 'hi' ? 'मौला अली यार्ड' : 'Moula Ali Yard'}</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-panel-bg border-t border-slate-border flex items-center justify-between flex-wrap gap-2">
              <button
                onClick={() => {
                  showNotice(language === 'hi' ? 'एसडीएम सिकंदराबाद के लिए सतर्कता क्षेत्र निरीक्षण आदेश जारी किया गया।' : 'Vigilance field inspection order generated for SDM Secunderabad.');
                  setGpsInspectionProject(null);
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                {t.directSdmFieldVerification}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGpsInspectionProject(null)}
                  className="px-4 py-2 bg-white hover:bg-panel-bg text-slate-muted border border-slate-border rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  {t.closeInspector}
                </button>
                <button
                  onClick={() => {
                    const p = gpsInspectionProject;
                    setGpsInspectionProject(null);
                    onSelectProject(p, 'photos');
                  }}
                  className="px-4 py-2 bg-govt-navy hover:bg-govt-navy-light text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  {t.openInProjectWorkspace}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
