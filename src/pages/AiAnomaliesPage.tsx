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
  Compass
} from 'lucide-react';
import { CATEGORY_COST_BENCHMARKS } from '../../server/aiService.js';

interface AiAnomaliesPageProps {
  projects: Project[];
  alerts: RiskAlert[];
  onSelectProject: (project: Project) => void;
  onOpenAlertAction: (alert: RiskAlert) => void;
}

export const AiAnomaliesPage: React.FC<AiAnomaliesPageProps> = ({
  projects,
  alerts,
  onSelectProject,
  onOpenAlertAction
}) => {
  const [activeModule, setActiveModule] = useState<'all' | 'cost' | 'duplicate' | 'photo' | 'gps' | 'delay'>('all');

  // Filtered views
  const costAnomalies = projects.filter(p => p.riskAnalysis.costAnomalyScore > 50);
  const duplicateFlags = alerts.filter(a => a.alertType === 'Possible Duplicate');
  const photoAnomalies = alerts.filter(a => a.alertType === 'Photo Anomaly');
  const locationMismatches = alerts.filter(a => a.alertType === 'Location Mismatch');
  const delayRisks = projects.filter(p => p.riskAnalysis.delayProbability > 60);

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

      {/* MODULE 1: COST ANOMALY DETECTION */}
      {(activeModule === 'all' || activeModule === 'cost') && (
        <section className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-[#FDFDFB] border-b border-[#DDE5D4] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1B3022] flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-[#935D26]" />
                <span>1. Cost Anomaly Detection (Category Benchmark Model)</span>
              </h2>
              <p className="text-[11px] text-[#588157] mt-0.5">
                Compares proposed or sanctioned project cost against historical public infrastructure benchmarks.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#FAF3E0] text-[#935D26] rounded-full border border-[#E8DAB2]">
              {costAnomalies.length} Flagged
            </span>
          </div>

          <div className="p-5 space-y-4">
            {costAnomalies.map(project => {
              const cost = project.sanctionedAmount || project.estimatedCost;
              const costLakh = (cost / 100000).toFixed(1);
              const benchmark = CATEGORY_COST_BENCHMARKS[project.category] || { min: 1500000, max: 2500000, typical: 2000000, unitDescription: 'Standard public works' };
              const typicalLakh = (benchmark.typical / 100000).toFixed(1);
              const maxLakh = (benchmark.max / 100000).toFixed(1);
              const minLakh = (benchmark.min / 100000).toFixed(1);
              const pctDiff = Math.round(((cost - benchmark.typical) / benchmark.typical) * 100);

              return (
                <div
                  key={project.id}
                  className="p-4 rounded-xl border border-[#E8DAB2] bg-[#FAF3E0]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1B3022]">{project.projectCode}</span>
                      <StatusBadge status={project.status} />
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF0EC] text-[#B85338] border border-[#E07A5F]">
                        +{pctDiff}% Above Benchmark
                      </span>
                    </div>

                    <div className="font-bold text-[#1B3022] text-sm">{project.title}</div>
                    <div className="text-[#588157] text-[11px]">
                      District: <strong className="text-[#1B3022]">{project.district}</strong> | Category: <strong className="text-[#1B3022]">{project.category}</strong> ({benchmark.unitDescription})
                    </div>

                    {/* Visual Comparison Bar */}
                    <div className="pt-2 space-y-1 max-w-md">
                      <div className="flex justify-between text-[10px] text-[#588157] font-mono">
                        <span>Min: ₹{minLakh}L</span>
                        <span>Typical: ₹{typicalLakh}L</span>
                        <span>Max Benchmark: ₹{maxLakh}L</span>
                      </div>
                      <div className="relative w-full h-3 bg-[#DDE5D4] rounded-full overflow-hidden">
                        {/* Normal band */}
                        <div className="absolute left-[20%] right-[30%] h-full bg-[#A3B18A]" />
                        {/* Project value indicator */}
                        <div
                          className="absolute h-full bg-[#B85338] rounded-full"
                          style={{ width: `${Math.min(100, Math.max(30, (cost / (benchmark.max * 1.5)) * 100))}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-bold text-[#B85338] text-right">
                        Sanctioned: ₹{costLakh} Lakh (Elevated)
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-end gap-2 shrink-0">
                    <RiskBadge level={project.riskAnalysis.riskLevel} score={project.riskAnalysis.overallScore} />
                    <button
                      onClick={() => onSelectProject(project)}
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
                Detects photograph reuse, stock imagery, or conflicting progress images across statewide projects.
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
                    ⚠ 94% Perceptual Image Similarity Flagged
                  </span>
                </div>
                <div className="font-bold text-[#1B3022]">
                  RO Drinking Water Unit — Photographic Milestone Reuse
                </div>
                <p className="text-[#588157] text-[11px] max-w-xl">
                  Progress image submitted on 15 Feb 2025 matches an archive photograph previously submitted for Project <em>PRJ-2024-082 (Medchal Water Filtration)</em>. Perceptual hash correlation: 0.941.
                </p>
              </div>

              <button
                onClick={() => {
                  const p = projects.find(x => x.id === 'PRJ-2025-004');
                  if (p) onSelectProject(p);
                }}
                className="px-3.5 py-1.5 bg-[#395C40] hover:bg-[#4a7251] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Inspect Submitted Photographs
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
                Cross-references photo EXIF coordinate telemetry against the official project sanction coordinates.
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
                    ⚠ LOCATION MISMATCH (1.4 km Discrepancy)
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
                  const p = projects.find(x => x.id === 'PRJ-2025-007');
                  if (p) onSelectProject(p);
                }}
                className="px-3.5 py-1.5 bg-[#B85338] hover:bg-[#9c452e] text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Inspect GPS Coordinates
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
                Computes daily physical execution velocity, elapsed schedule, and delay overrun forecast.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-[#FAF3E0] text-[#935D26] rounded-full border border-[#E8DAB2]">
              {delayRisks.length} Schedule Overruns
            </span>
          </div>

          <div className="p-5 space-y-3">
            {delayRisks.map(project => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="p-3.5 rounded-xl border border-[#DDE5D4] hover:bg-[#F8F9F7] cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1B3022]">{project.projectCode}</span>
                    <StatusBadge status={project.status} />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF3E0] text-[#935D26] border border-[#E8DAB2]">
                      {project.riskAnalysis.delayProbability}% Delay Probability
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
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
