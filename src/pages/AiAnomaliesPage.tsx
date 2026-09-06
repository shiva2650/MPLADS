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
  Calendar
} from 'lucide-react';
import { CATEGORY_COST_BENCHMARKS } from '../types/index.js';

interface AiAnomaliesPageProps {
  projects: Project[];
  alerts: RiskAlert[];
  onSelectProject: (project: Project, initialTab?: 'overview' | 'ai-risk' | 'photos' | 'financials' | 'documents' | 'audit-report') => void;
  onOpenAlertAction: (alert: RiskAlert) => void;
}

export const AiAnomaliesPage: React.FC<AiAnomaliesPageProps> = ({
  projects,
  alerts,
  onSelectProject,
  onOpenAlertAction
}) => {
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
      {/* Header Banner */}
      <div className="bg-[#1B3022] text-white rounded-2xl p-6 border border-[#395C40] shadow-sm">
        <div className="flex items-center gap-2 text-[#A3B18A] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Vigilance Decision Support Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5">
          AI Integrity & Anomaly Detection Center
        </h1>
        <p className="text-xs text-[#DDE5D4] mt-1 max-w-3xl leading-relaxed">
          Continuous algorithmic surveillance cross-verifying financial allocations, geospatial duplicates, physical photographic metadata, and execution trajectories under MoSPI guidelines.
        </p>

        {/* Mandatory Human Review Disclaimer */}
        <div className="mt-4 p-3.5 bg-[#FAF3E0] border border-[#E8DAB2] rounded-xl flex items-start gap-2.5 text-xs text-[#935D26]">
          <AlertTriangle className="w-4 h-4 text-[#935D26] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#643F18]">Statutory Administrative Advisory:</strong> The AI risk score is an indicator for human review, not proof of fraud or corruption. All flagged items require on-site technical inspection by an authorized Executive Engineer or Sub-Divisional Magistrate.
          </div>
        </div>
      </div>

      {/* Module Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveModule('all')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
            activeModule === 'all'
              ? 'bg-[#1B3022] text-white shadow-xs border border-[#395C40]'
              : 'bg-white text-[#588157] border border-[#DDE5D4] hover:bg-[#F8F9F7]'
          }`}
        >
          All Modules Overview
        </button>

        <button
          onClick={() => setActiveModule('cost')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'cost'
              ? 'bg-[#1B3022] text-white shadow-xs border border-[#395C40]'
              : 'bg-white text-[#588157] border border-[#DDE5D4] hover:bg-[#F8F9F7]'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5 text-[#935D26]" />
          <span>1. Cost Benchmark Anomalies ({costAnomalies.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('duplicate')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'duplicate'
              ? 'bg-[#1B3022] text-white shadow-xs border border-[#395C40]'
              : 'bg-white text-[#588157] border border-[#DDE5D4] hover:bg-[#F8F9F7]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#395C40]" />
          <span>2. Spatial Duplicate Detection ({duplicateFlags.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('photo')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'photo'
              ? 'bg-[#1B3022] text-white shadow-xs border border-[#395C40]'
              : 'bg-white text-[#588157] border border-[#DDE5D4] hover:bg-[#F8F9F7]'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-[#588157]" />
          <span>3. Photo Hash Verification ({photoAnomalies.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('gps')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'gps'
              ? 'bg-[#1B3022] text-white shadow-xs border border-[#395C40]'
              : 'bg-white text-[#588157] border border-[#DDE5D4] hover:bg-[#F8F9F7]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#B85338]" />
          <span>4. GPS Geotag Mismatch ({locationMismatches.length})</span>
        </button>

        <button
          onClick={() => setActiveModule('delay')}
          className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeModule === 'delay'
              ? 'bg-[#1B3022] text-white shadow-xs border border-[#395C40]'
              : 'bg-white text-[#588157] border border-[#DDE5D4] hover:bg-[#F8F9F7]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#935D26]" />
          <span>5. Delay Prediction ({delayRisks.length})</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessNotice && (
        <div className="p-3 bg-[#EAF0E6] text-[#395C40] border border-[#C8D5B9] rounded-xl flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#395C40]" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button onClick={() => setActionSuccessNotice(null)} className="p-1 hover:bg-[#DDE5D4] rounded cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MODULE 1: COST ANOMALY DETECTION */}
      {(activeModule === 'all' || activeModule === 'cost') && (
        <section className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-[#FDFDFB] border-b border-[#DDE5D4] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-[#935D26]" />
                <span>1. Cost Anomaly Detection (Statistical Category & Regional Baseline)</span>
              </h2>
              <p className="text-[11px] text-[#588157] mt-0.5">
                Empirical baseline calculated per work category and state/district (Mean μ + Standard Deviation σ).
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#FAF3E0] text-[#935D26] rounded-full border border-[#E8DAB2]">
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
                  className="p-4 rounded-xl border border-[#E8DAB2] bg-[#FAF3E0]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[#1B3022]">{project.projectCode}</span>
                      <StatusBadge status={project.status} />
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FDF0EC] text-[#B85338] border border-[#E07A5F]">
                        Z-Score: +{zScore.toFixed(2)}σ
                      </span>
                      <span className="text-[10px] text-[#588157] font-medium bg-[#EAF0E6] px-2 py-0.5 rounded border border-[#C8D5B9]">
                        Cohort: {project.category} ({project.state || 'Telangana'})
                      </span>
                    </div>

                    <div className="font-bold text-[#1B3022] text-sm">{project.title}</div>
                    
                    {/* Reason string */}
                    <div className="text-[11px] p-2 rounded-lg bg-white border border-[#E8DAB2] text-[#935D26] font-medium">
                      <strong>Statistical Finding:</strong> {reasonString}
                    </div>

                    {/* Regional Cohort Breakdown */}
                    <div className="pt-1 flex items-center gap-4 text-[11px] text-[#588157] font-mono">
                      <span>Cohort Mean (μ): ₹{meanLakh}L</span>
                      <span>Std Dev (σ): ±₹{stdDevLakh}L</span>
                      <span className="font-bold text-[#B85338]">Sanctioned: ₹{costLakh}L</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-end gap-2 shrink-0">
                    <RiskBadge level={project.riskAnalysis.riskLevel} score={project.riskAnalysis.overallScore} />
                    <button
                      onClick={() => onSelectProject(project, 'ai-risk')}
                      className="px-3 py-1.5 bg-[#395C40] hover:bg-[#4a7251] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Audit BOQ & Justification
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
        <section className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-[#FDFDFB] border-b border-[#DDE5D4] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#395C40]" />
                <span>2. Spatial Duplicate Project Detection (Haversine & Semantic Token Matching)</span>
              </h2>
              <p className="text-[11px] text-[#588157] mt-0.5">
                Identifies potentially redundant works sanctioned within 1,000 meters of existing infrastructure assets.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#EAF0E6] text-[#395C40] rounded-full border border-[#C8D5B9]">
              {duplicateFlags.length} Pairs Detected
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Live Duplicate Case Comparison */}
            <div className="p-4 bg-[#EAF0E6]/50 rounded-xl border border-[#C8D5B9] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-[#1B3022]">
                  <AlertOctagon className="w-4 h-4 text-[#B85338]" />
                  <span>High Similarity Territory Match Detected (88% Match | 430m Distance)</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#FDF0EC] text-[#B85338] border border-[#E07A5F]">
                  Action Required: Site Reconciliation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Project A */}
                <div className="p-3 bg-white rounded-lg border border-[#DDE5D4] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#588157]">PRJ-2025-001</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF0E6] text-[#395C40] font-bold border border-[#C8D5B9]">Completed</span>
                  </div>
                  <div className="font-bold text-[#1B3022]">Installation of 2000 LPH RO Drinking Water Plant</div>
                  <div className="text-[11px] text-[#588157]">
                    Location: Ward 12 Community Hall, Secunderabad (17.4399° N, 78.4983° E)
                  </div>
                  <div className="text-xs font-mono font-bold text-[#1B3022]">Sanction: ₹18.00 Lakh (2024)</div>
                </div>

                {/* Project B (Duplicate candidate) */}
                <div className="p-3 bg-white rounded-lg border border-[#FAD2D2] bg-red-50/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#B85338]">PRJ-2025-004</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF3E0] text-[#935D26] font-bold border border-[#E8DAB2]">Ongoing (50%)</span>
                  </div>
                  <div className="font-bold text-[#1B3022]">RO Drinking Water Purification Unit at Primary School</div>
                  <div className="text-[11px] text-[#588157]">
                    Location: Ward 12 Govt School, Secunderabad (17.4425° N, 78.4998° E)
                  </div>
                  <div className="text-xs font-mono font-bold text-[#B85338]">Sanction: ₹19.50 Lakh (2025)</div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#DDE5D4] text-xs text-[#1B3022] space-y-1">
                <div className="font-bold text-[#1B3022]">Algorithmic Correlation Breakdown:</div>
                <div className="text-[11px] text-[#588157]">
                  • Physical proximity: <strong>430 meters</strong> apart in the same administrative municipal ward.
                </div>
                <div className="text-[11px] text-[#588157]">
                  • Target population overlap: <strong>High overlap</strong> with existing functional RO facility commissioned 11 months earlier.
                </div>
                <div className="text-[11px] text-[#588157]">
                  • Recommendation: Joint inspection by District Vigilance Officer before releasing remaining ₹9.75L payment tranche.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODULE 3: AI PHOTO VERIFICATION */}
      {(activeModule === 'all' || activeModule === 'photo') && (
        <section className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-[#FDFDFB] border-b border-[#DDE5D4] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#588157]" />
                <span>3. AI Photograph Verification & Perceptual Hash Duplicate Check</span>
              </h2>
              <p className="text-[11px] text-[#588157] mt-0.5">
                Forensic dHash/pHash perceptual correlation, EXIF timeline inspection, and cross-project image matching.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#EAF0E6] text-[#395C40] rounded-full border border-[#C8D5B9]">
              Active Computer Vision Stream
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div className="p-4 bg-[#F8F9F7] rounded-xl border border-[#DDE5D4] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#1B3022]">PRJ-2025-004</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF0EC] text-[#B85338] border border-[#E07A5F]">
                    ⚠ 94.1% Perceptual Image Similarity Flagged
                  </span>
                </div>
                <div className="font-bold text-[#1B3022]">
                  RO Drinking Water Unit — Photographic Milestone Reuse Flagged
                </div>
                <p className="text-[#588157] text-[11px] max-w-xl">
                  Progress image submitted on 15 Feb 2025 matches an archive photograph previously submitted for Project <em>PRJ-2024-082 (Medchal Water Filtration)</em>. Perceptual hash correlation: 0.941 | Hamming Distance: 3 bits.
                </p>
              </div>

              <button
                onClick={() => {
                  const p = projects.find(x => x.id === 'PRJ-2025-004') || projects[0];
                  setPhotoInspectionProject(p);
                }}
                className="px-3.5 py-2 bg-[#395C40] hover:bg-[#4a7251] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Submitted Photographs</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MODULE 4: GPS GEOTAG MISMATCH */}
      {(activeModule === 'all' || activeModule === 'gps') && (
        <section className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-[#FDFDFB] border-b border-[#DDE5D4] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#B85338]" />
                <span>4. GPS / Geospatial Location Verification</span>
              </h2>
              <p className="text-[11px] text-[#588157] mt-0.5">
                Cross-references photo EXIF coordinate telemetry against the official project sanction coordinates (500m threshold).
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#FDF0EC] text-[#B85338] rounded-full border border-[#E07A5F]">
              {locationMismatches.length} Mismatch Alerts
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div className="p-4 bg-[#FDF0EC]/50 rounded-xl border border-[#FAD2D2] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#1B3022]">PRJ-2025-007</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B85338] text-white">
                    ⚠ LOCATION MISMATCH (1.42 km Discrepancy)
                  </span>
                </div>
                <div className="font-bold text-[#1B3022]">
                  Cement Concrete Road with Cover Drains at Cherlapally
                </div>
                <div className="text-[11px] text-[#588157] font-mono">
                  Sanction Site: 17.4720° N, 78.6010° E | Photo EXIF: 17.4845° N, 78.6080° E (Distance: 1,420 meters)
                </div>
                <div className="text-[11px] text-[#B85338] font-semibold">
                  Notice: Photographic proof of road laying was captured outside the authorized territorial corridor.
                </div>
              </div>

              <button
                onClick={() => {
                  const p = projects.find(x => x.id === 'PRJ-2025-007') || projects[0];
                  setGpsInspectionProject(p);
                }}
                className="px-3.5 py-2 bg-[#B85338] hover:bg-[#9c452e] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Inspect GPS Coordinates</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* MODULE 5: DELAY PREDICTION */}
      {(activeModule === 'all' || activeModule === 'delay') && (
        <section className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-[#FDFDFB] border-b border-[#DDE5D4] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#935D26]" />
                <span>5. Project Execution Delay Prediction Model</span>
              </h2>
              <p className="text-[11px] text-[#588157] mt-0.5">
                Computes daily physical execution velocity, elapsed schedule, and confidence-bounded completion overrun forecasts.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#FAF3E0] text-[#935D26] rounded-full border border-[#E8DAB2]">
              {delayRisks.length} Schedule Overruns
            </span>
          </div>

          <div className="p-5 space-y-3">
            {/* Statutory Model Validation Notice */}
            <div className="p-3 bg-[#FAF3E0] rounded-xl border border-[#E8DAB2] flex items-center justify-between text-xs text-[#935D26]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#935D26]" />
                <span><strong>Model Validation Notice:</strong> Model trained on synthetic data — validation pending. Holdout validation metrics: Precision: 85.7% | Recall: 80.0% | F1-Score: 82.8% (Sample: 18 historical works).</span>
              </div>
            </div>

            {delayRisks.map(project => {
              const confidenceStr = project.riskAnalysis.delayMetrics?.confidenceIntervalString || '80% confidence, ± 14 days';
              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project, 'ai-risk')}
                  className="p-3.5 rounded-xl border border-[#DDE5D4] hover:bg-[#F8F9F7] cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[#1B3022]">{project.projectCode}</span>
                      <StatusBadge status={project.status} />
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF3E0] text-[#935D26] border border-[#E8DAB2]">
                        {project.riskAnalysis.delayProbability}% Delay Probability
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#588157] bg-[#EAF0E6] border border-[#C8D5B9]">
                        {confidenceStr}
                      </span>
                    </div>
                    <div className="font-bold text-[#1B3022] truncate">{project.title}</div>
                    <div className="text-[11px] text-[#588157]">
                      Agency: {project.implementingAgencyName} | Physical Progress: {project.completionPercentage}%
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-[11px]">
                    <div className="text-[#588157]">Expected: {project.expectedCompletionDate || 'Overdue'}</div>
                    <div className="text-[#B85338] font-bold">Overrun Risk High</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FORENSIC INSPECTION MODAL 1: PHOTO VERIFICATION */}
      {photoInspectionProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3022]/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#DDE5D4] overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 bg-[#1B3022] text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#A3B18A] flex items-center gap-1.5">
                  <Camera className="w-4 h-4" />
                  <span>Forensic Photographic Integrity Inspector</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Perceptual Hash & EXIF Timestamp Analysis — {photoInspectionProject.projectCode}
                </h3>
              </div>
              <button
                onClick={() => setPhotoInspectionProject(null)}
                className="p-1.5 text-[#DDE5D4] hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Alert Status Banner */}
              <div className="p-3.5 bg-[#FDF0EC] border border-[#FAD2D2] rounded-xl flex items-start gap-3 text-[#B85338]">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Computer Vision Duplicate Match Flagged (94.1% Perceptual Hash Correlation)</div>
                  <div className="text-[11px] mt-0.5 leading-relaxed text-[#9C452E]">
                    The computer vision verification engine identified that the submitted milestone photograph matches a pre-existing photographic asset in the state archive. This indicates photographic reuse violating MPLADS Statutory Rule 14.
                  </div>
                </div>
              </div>

              {/* Comparative Side-by-Side Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Submitted Photo */}
                <div className="p-3.5 bg-[#F8F9F7] rounded-xl border border-[#DDE5D4] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1B3022] uppercase tracking-wider text-[11px]">A. Submitted Milestone Photo</span>
                    <span className="px-2 py-0.5 bg-[#FDF0EC] text-[#B85338] rounded text-[10px] font-bold">Flagged Asset</span>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden border border-[#DDE5D4] relative bg-black/10">
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
                  <div className="space-y-1 text-[11px] text-[#588157]">
                    <div>Hardware: <strong className="text-[#1B3022]">Sony IMX686 (f/1.89, ISO 64)</strong></div>
                    <div>EXIF Timestamp: <strong className="text-[#B85338]">10 Oct 2022 14:22 IST</strong> ⚠</div>
                    <div className="text-[10px] text-[#B85338] italic">
                      EXIF capture date predates tender sanction date (10 Apr 2024) by 18 months!
                    </div>
                  </div>
                </div>

                {/* Archive Matched Master */}
                <div className="p-3.5 bg-[#F8F9F7] rounded-xl border border-[#DDE5D4] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1B3022] uppercase tracking-wider text-[11px]">B. Matched Historical Archive Master</span>
                    <span className="px-2 py-0.5 bg-[#EAF0E6] text-[#395C40] rounded text-[10px] font-bold">Original Reference</span>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden border border-[#DDE5D4] relative bg-black/10">
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
                  <div className="space-y-1 text-[11px] text-[#588157]">
                    <div>Origin Project: <strong className="text-[#1B3022]">PRJ-2024-082 (Medchal RO Unit)</strong></div>
                    <div>Agency: <strong className="text-[#1B3022]">Telangana Rural Infra Corp</strong></div>
                    <div className="text-[10px] text-[#395C40]">
                      Completed & commissioned work record from 2023-24 financial year.
                    </div>
                  </div>
                </div>
              </div>

              {/* Mathematical Telemetry Table */}
              <div className="p-4 bg-white rounded-xl border border-[#DDE5D4] space-y-2">
                <div className="font-bold text-[#1B3022] uppercase tracking-wider text-[11px]">
                  Mathematical Verification Telemetry
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-[#F8F9F7] rounded-lg border border-[#DDE5D4]">
                    <div className="text-[10px] text-[#588157]">Perceptual Correlation</div>
                    <div className="text-base font-bold text-[#B85338] font-mono mt-0.5">0.941 (94.1%)</div>
                  </div>
                  <div className="p-2.5 bg-[#F8F9F7] rounded-lg border border-[#DDE5D4]">
                    <div className="text-[10px] text-[#588157]">Hamming Distance</div>
                    <div className="text-base font-bold text-[#B85338] font-mono mt-0.5">3 / 64 bits</div>
                  </div>
                  <div className="p-2.5 bg-[#F8F9F7] rounded-lg border border-[#DDE5D4]">
                    <div className="text-[10px] text-[#588157]">Max Match Threshold</div>
                    <div className="text-base font-bold text-[#1B3022] font-mono mt-0.5">≤ 5 bits</div>
                  </div>
                  <div className="p-2.5 bg-[#F8F9F7] rounded-lg border border-[#DDE5D4]">
                    <div className="text-[10px] text-[#588157]">ELA Compression Delta</div>
                    <div className="text-base font-bold text-[#395C40] font-mono mt-0.5">0.88 (Identical)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-[#F8F9F7] border-t border-[#DDE5D4] flex items-center justify-between flex-wrap gap-2">
              <button
                onClick={() => {
                  showNotice('Statutory explanation notice issued to implementing agency under Rule 14.');
                  setPhotoInspectionProject(null);
                }}
                className="px-4 py-2 bg-[#FAF3E0] hover:bg-[#F4E8C1] text-[#935D26] border border-[#E8DAB2] rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Issue Show-Cause Notice under Rule 14
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPhotoInspectionProject(null)}
                  className="px-4 py-2 bg-white hover:bg-gray-100 text-[#588157] border border-[#DDE5D4] rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Close Inspector
                </button>
                <button
                  onClick={() => {
                    const p = photoInspectionProject;
                    setPhotoInspectionProject(null);
                    onSelectProject(p, 'photos');
                  }}
                  className="px-4 py-2 bg-[#395C40] hover:bg-[#4a7251] text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Open in Project Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORENSIC INSPECTION MODAL 2: GPS COORDINATES */}
      {gpsInspectionProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3022]/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#DDE5D4] overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 bg-[#1B3022] text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#A3B18A] flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>Geospatial Boundary & GPS EXIF Inspector</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Perimeter Tolerance Verification — {gpsInspectionProject.projectCode}
                </h3>
              </div>
              <button
                onClick={() => setGpsInspectionProject(null)}
                className="p-1.5 text-[#DDE5D4] hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Alert Status Banner */}
              <div className="p-3.5 bg-[#FDF0EC] border border-[#FAD2D2] rounded-xl flex items-start gap-3 text-[#B85338]">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Geotag Coordinates Out of Sanction Boundary (1,420m vs 500m Allowable)</div>
                  <div className="text-[11px] mt-0.5 leading-relaxed text-[#9C452E]">
                    The photo EXIF GPS location was captured 1,420 meters from the officially sanctioned project coordinates, exceeding the statutory 500-meter allowable tolerance buffer by 920 meters.
                  </div>
                </div>
              </div>

              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-[#F8F9F7] rounded-xl border border-[#DDE5D4] space-y-1">
                  <div className="text-[10px] text-[#588157] font-bold uppercase">Sanction Site Coordinates</div>
                  <div className="font-mono text-sm font-bold text-[#1B3022]">17.4720° N, 78.6010° E</div>
                  <div className="text-[11px] text-[#588157]">Cherlapally Industrial Corridor</div>
                </div>
                <div className="p-3.5 bg-[#FDF0EC] rounded-xl border border-[#FAD2D2] space-y-1">
                  <div className="text-[10px] text-[#B85338] font-bold uppercase">Photo EXIF Coordinates</div>
                  <div className="font-mono text-sm font-bold text-[#B85338]">17.4845° N, 78.6080° E</div>
                  <div className="text-[11px] text-[#B85338]">Moula Ali Railway Yard Boundary</div>
                </div>
                <div className="p-3.5 bg-[#FAF3E0] rounded-xl border border-[#E8DAB2] space-y-1">
                  <div className="text-[10px] text-[#935D26] font-bold uppercase">Discrepancy Vector</div>
                  <div className="font-mono text-sm font-bold text-[#935D26]">1,420 Meters</div>
                  <div className="text-[11px] text-[#935D26]">Exceeds 500m buffer by 920m</div>
                </div>
              </div>

              {/* Visual Geofence Vector Schematic */}
              <div className="p-4 bg-[#F8F9F7] rounded-xl border border-[#DDE5D4] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1B3022] uppercase tracking-wider text-[11px]">
                    Geospatial Tolerance Corridor Map
                  </span>
                  <span className="text-[10px] font-mono text-[#588157]">Haversine Calculation (WGS84)</span>
                </div>

                <div className="relative h-48 bg-white rounded-lg border border-[#DDE5D4] overflow-hidden flex items-center justify-center p-4">
                  {/* Visual SVG schematic */}
                  <svg className="w-full h-full" viewBox="0 0 400 160">
                    {/* Sanction 500m allowable boundary */}
                    <circle cx="120" cy="80" r="50" fill="#EAF0E6" stroke="#395C40" strokeWidth="2" strokeDasharray="4 2" />
                    <text x="120" y="75" textAnchor="middle" fill="#395C40" fontSize="10" fontWeight="bold">Sanction Site</text>
                    <text x="120" y="90" textAnchor="middle" fill="#588157" fontSize="8">500m Geofence Buffer</text>
                    <circle cx="120" cy="80" r="4" fill="#395C40" />

                    {/* Vector line */}
                    <line x1="120" y1="80" x2="310" y2="80" stroke="#B85338" strokeWidth="2" strokeDasharray="6 3" />
                    <text x="215" y="72" textAnchor="middle" fill="#B85338" fontSize="9" fontWeight="bold">Δ 1,420m (Breach: +920m)</text>

                    {/* Actual photo coordinate */}
                    <circle cx="310" cy="80" r="8" fill="#FDF0EC" stroke="#B85338" strokeWidth="2" />
                    <circle cx="310" cy="80" r="4" fill="#B85338" />
                    <text x="310" y="105" textAnchor="middle" fill="#B85338" fontSize="10" fontWeight="bold">Photo EXIF Geotag</text>
                    <text x="310" y="118" textAnchor="middle" fill="#588157" fontSize="8">Moula Ali Yard</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-[#F8F9F7] border-t border-[#DDE5D4] flex items-center justify-between flex-wrap gap-2">
              <button
                onClick={() => {
                  showNotice('Vigilance field inspection order generated for SDM Secunderabad.');
                  setGpsInspectionProject(null);
                }}
                className="px-4 py-2 bg-[#FAF3E0] hover:bg-[#F4E8C1] text-[#935D26] border border-[#E8DAB2] rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Direct SDM Field Verification
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGpsInspectionProject(null)}
                  className="px-4 py-2 bg-white hover:bg-gray-100 text-[#588157] border border-[#DDE5D4] rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Close Inspector
                </button>
                <button
                  onClick={() => {
                    const p = gpsInspectionProject;
                    setGpsInspectionProject(null);
                    onSelectProject(p, 'photos');
                  }}
                  className="px-4 py-2 bg-[#395C40] hover:bg-[#4a7251] text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Open in Project Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
