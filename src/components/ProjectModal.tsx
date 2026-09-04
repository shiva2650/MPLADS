import React, { useState } from 'react';
import { Project, DuplicateProjectCandidate, UserRole } from '../types/index.js';
import { RiskBadge, StatusBadge } from './Badges.js';
import {
  X,
  Calendar,
  IndianRupee,
  MapPin,
  Building,
  User,
  FileText,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Download,
  AlertOctagon,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { api } from '../services/api.js';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onRefresh?: () => void;
  userRole: UserRole | 'PUBLIC';
  duplicateCandidates?: DuplicateProjectCandidate[];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onRefresh,
  userRole,
  duplicateCandidates = []
}) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'ai-risk' | 'photos' | 'financials' | 'documents' | 'audit-report'>('overview');
  const [isGeneratingAiReport, setIsGeneratingAiReport] = useState(false);
  const [aiReportContent, setAiReportContent] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsGeneratingAiReport(true);
    setActiveTab('audit-report');
    try {
      const res = await api.generateAiAuditReport(project.id);
      setAiReportContent(res.report);
    } catch (err) {
      console.error(err);
      setAiReportContent('Failed to generate automated AI audit report. Please try again.');
    } finally {
      setIsGeneratingAiReport(false);
    }
  };

  const isPublic = userRole === 'PUBLIC';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3022]/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#F8F9F7] rounded-2xl shadow-2xl border border-[#DDE5D4] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1B3022] text-white flex items-center justify-between border-b border-[#2C4A34]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#395C40]/50 text-[#DDE5D4] border border-[#395C40]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#A3B18A] font-bold">{project.projectCode}</span>
                <StatusBadge status={project.status} />
                <RiskBadge level={project.riskAnalysis.riskLevel} score={project.riskAnalysis.overallScore} />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5 line-clamp-1">{project.title}</h2>
            </div>
          </div>

          <button
            id="close-project-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A3B18A] hover:text-white hover:bg-[#395C40] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#DDE5D4] bg-[#F8F9F7] px-6 overflow-x-auto gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#395C40] text-[#1B3022] bg-white rounded-t-lg'
                : 'border-transparent text-[#588157] hover:text-[#1B3022]'
            }`}
          >
            Project Overview & Timeline
          </button>

          <button
            onClick={() => setActiveTab('ai-risk')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai-risk'
                ? 'border-[#395C40] text-[#1B3022] bg-white rounded-t-lg'
                : 'border-transparent text-[#588157] hover:text-[#1B3022]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
            AI Risk & Anomaly Assessment
            {project.riskAnalysis.overallScore > 60 && (
              <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'photos'
                ? 'border-[#395C40] text-[#1B3022] bg-white rounded-t-lg'
                : 'border-transparent text-[#588157] hover:text-[#1B3022]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#588157]" />
            Site Photos ({project.photos.length})
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'financials'
                ? 'border-[#395C40] text-[#1B3022] bg-white rounded-t-lg'
                : 'border-transparent text-[#588157] hover:text-[#1B3022]'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5 text-[#588157]" />
            Funds & Payments
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'documents'
                ? 'border-[#395C40] text-[#1B3022] bg-white rounded-t-lg'
                : 'border-transparent text-[#588157] hover:text-[#1B3022]'
            }`}
          >
            Official Documents ({project.documents.length})
          </button>

          {!isPublic && (
            <button
              onClick={() => {
                setActiveTab('audit-report');
                if (!aiReportContent) handleGenerateReport();
              }}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'audit-report'
                  ? 'border-[#395C40] text-[#1B3022] bg-white rounded-t-lg'
                  : 'border-transparent text-[#395C40] hover:text-[#1B3022]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#395C40]" />
              AI Technical Audit Brief
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Essential Parameters Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3.5 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-[11px] font-bold text-[#588157] uppercase tracking-wider">Sanctioned Cost</div>
                  <div className="text-lg font-bold text-[#1B3022] mt-1">
                    ₹{(project.sanctionedAmount / 100000).toFixed(2)} Lakh
                  </div>
                  <div className="text-xs text-[#588157]">Estimated: ₹{(project.estimatedCost / 100000).toFixed(2)}L</div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-[11px] font-bold text-[#588157] uppercase tracking-wider">Funds Utilized</div>
                  <div className="text-lg font-bold text-[#395C40] mt-1">
                    ₹{(project.fundsUtilized / 100000).toFixed(2)} Lakh
                  </div>
                  <div className="text-xs text-[#588157]">
                    {project.sanctionedAmount > 0
                      ? `${Math.round((project.fundsUtilized / project.sanctionedAmount) * 100)}% of sanction`
                      : 'Pending sanction'}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-[11px] font-bold text-[#588157] uppercase tracking-wider">Physical Progress</div>
                  <div className="text-lg font-bold text-[#1B3022] mt-1 flex items-center gap-2">
                    <span>{project.completionPercentage}%</span>
                    <div className="flex-1 bg-[#DDE5D4] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#395C40] rounded-full"
                        style={{ width: `${project.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-[#588157]">{project.status}</div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-[11px] font-bold text-[#588157] uppercase tracking-wider">AI Integrity Index</div>
                  <div className="mt-1">
                    <RiskBadge level={project.riskAnalysis.riskLevel} score={project.riskAnalysis.overallScore} />
                  </div>
                  <div className="text-[11px] text-[#588157] mt-1 font-medium">
                    {project.riskAnalysis.reasons.length} active flag(s)
                  </div>
                </div>
              </div>

              {/* Administrative Details Table */}
              <div className="bg-white rounded-xl border border-[#DDE5D4] shadow-xs overflow-hidden">
                <div className="px-4 py-2.5 bg-[#F8F9F7] text-xs font-bold text-[#1B3022] uppercase tracking-wider border-b border-[#DDE5D4]">
                  Project Stakeholders & Territorial Jurisdiction
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#DDE5D4] text-xs">
                  <div className="p-4 space-y-2.5">
                    <div>
                      <span className="text-[#588157]">Member of Parliament:</span>
                      <div className="font-bold text-[#1B3022]">{project.mpName}</div>
                    </div>
                    <div>
                      <span className="text-[#588157]">Constituency:</span>
                      <div className="font-bold text-[#1B3022]">{project.constituency}</div>
                    </div>
                    <div>
                      <span className="text-[#588157]">District & State:</span>
                      <div className="font-bold text-[#1B3022]">{project.district}, {project.state}</div>
                    </div>
                    <div>
                      <span className="text-[#588157]">Category of Work:</span>
                      <div className="font-bold text-[#1B3022]">{project.category}</div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div>
                      <span className="text-[#588157]">Implementing Agency:</span>
                      <div className="font-bold text-[#1B3022]">{project.implementingAgencyName}</div>
                    </div>
                    <div>
                      <span className="text-[#588157]">Executing Vendor / Contractor:</span>
                      <div className="font-bold text-[#1B3022]">{project.vendorName}</div>
                      {!isPublic && (
                        <span className="font-mono text-[10px] text-[#588157]">PAN: {project.vendorPanMasked}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[#588157]">Sanctioned Site Coordinates:</span>
                      <div className="font-mono font-bold text-[#1B3022]">
                        {project.latitude.toFixed(4)}° N, {project.longitude.toFixed(4)}° E
                      </div>
                    </div>
                    <div>
                      <span className="text-[#588157]">Physical Location Address:</span>
                      <div className="font-medium text-[#1B3022]">{project.locationAddress}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                <div className="text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-1">Scope of Developmental Work</div>
                <p className="text-xs text-[#1B3022] leading-relaxed">{project.description}</p>
              </div>

              {/* Lifecycle Milestones Timeline */}
              <div className="bg-white rounded-xl border border-[#DDE5D4] p-4 shadow-xs">
                <div className="text-xs font-bold text-[#1B3022] uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>MPLADS Lifecycle Progress Tracker</span>
                  <span className="text-[11px] font-normal text-[#588157]">Stages mandated under MoSPI Guidelines</span>
                </div>

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {project.timeline.map((step, idx) => (
                    <div key={idx} className="flex md:flex-col items-center gap-3 md:gap-1.5 flex-1 text-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          step.completed
                            ? 'bg-[#395C40] text-white'
                            : 'bg-[#F8F9F7] text-[#588157] border border-[#DDE5D4]'
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div className="text-left md:text-center">
                        <div className="text-xs font-bold text-[#1B3022]">{step.stage}</div>
                        {step.date && <div className="text-[10px] text-[#588157] font-mono">{step.date}</div>}
                        {step.remarks && (
                          <div className="text-[10px] text-[#588157] italic max-w-[140px] truncate" title={step.remarks}>
                            {step.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI RISK & ANOMALIES */}
          {activeTab === 'ai-risk' && (
            <div className="space-y-6">
              {/* Advisory Disclaimer */}
              <div className="p-3 bg-[#FAF3E0] border border-[#E8DAB2] rounded-xl text-xs text-[#935D26] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#935D26] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Human Review Advisory Mandate:</div>
                  <div>{project.riskAnalysis.disclaimer}</div>
                </div>
              </div>

              {/* Risk Score Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-xs font-bold text-[#588157] uppercase tracking-wider">Cost Anomaly Index</div>
                  <div className="text-2xl font-bold text-[#1B3022] mt-1">
                    {project.riskAnalysis.costAnomalyScore}
                    <span className="text-xs text-[#588157] font-normal"> / 100</span>
                  </div>
                  <div className="mt-2 text-xs text-[#588157]">
                    Category benchmark: ₹18 - 25 Lakh.
                    {project.sanctionedAmount > 2500000 && (
                      <span className="text-[#E07A5F] font-bold block mt-1">
                        Proposed cost exceeds standard benchmark by +
                        {Math.round(((project.sanctionedAmount - 2000000) / 2000000) * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-xs font-bold text-[#588157] uppercase tracking-wider">Duplicate Probability</div>
                  <div className="text-2xl font-bold text-[#1B3022] mt-1">
                    {project.riskAnalysis.duplicateProbability}%
                  </div>
                  <div className="mt-2 text-xs text-[#588157]">
                    {duplicateCandidates.length > 0
                      ? `${duplicateCandidates.length} spatially proximate project(s) identified within 1 km.`
                      : 'No spatial or semantic duplicate detected in database.'}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-xs font-bold text-[#588157] uppercase tracking-wider">Delay Forecast Probability</div>
                  <div className="text-2xl font-bold text-[#1B3022] mt-1">
                    {project.riskAnalysis.delayProbability}%
                  </div>
                  <div className="mt-2 text-xs text-[#588157]">
                    {project.riskAnalysis.delayProbability > 60 ? (
                      <span className="text-[#E07A5F] font-bold">High risk of schedule overrun</span>
                    ) : (
                      <span className="text-[#395C40] font-bold">Trajectory conforms to scheduled target</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Observed AI Findings & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FAF3E0] rounded-xl border border-[#E8DAB2] p-4">
                  <div className="text-xs font-bold text-[#935D26] uppercase mb-2 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-[#E07A5F]" />
                    Observed Anomaly Indicators
                  </div>
                  <ul className="space-y-2 text-xs text-[#935D26] list-disc list-inside">
                    {project.riskAnalysis.reasons.map((r, i) => (
                      <li key={i} className="leading-relaxed">{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#EAF0E6] rounded-xl border border-[#C8D5B9] p-4">
                  <div className="text-xs font-bold text-[#395C40] uppercase mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#395C40]" />
                    Recommended Administrative Protocol
                  </div>
                  <ul className="space-y-2 text-xs text-[#395C40] list-disc list-inside">
                    {project.riskAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="leading-relaxed">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Duplicate Project Candidates Comparison */}
              {duplicateCandidates.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E8DAB2] p-4 shadow-xs">
                  <div className="text-xs font-bold text-[#935D26] uppercase mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#935D26]" />
                      Potential Duplicate Projects Identified for Investigation
                    </span>
                    <span className="text-[11px] text-[#935D26] font-normal">
                      Based on GPS Distance & Semantic Overlap
                    </span>
                  </div>

                  <div className="space-y-3">
                    {duplicateCandidates.map((dup, idx) => (
                      <div key={idx} className="p-3 bg-[#FAF3E0]/70 rounded-lg border border-[#E8DAB2] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#1B3022]">{dup.candidateProject.projectCode}</span>
                            <StatusBadge status={dup.candidateProject.status} />
                            <span className="px-2 py-0.5 rounded-full bg-[#E8DAB2] text-[#935D26] font-bold text-[11px]">
                              {dup.similarityScore}% Similarity Match
                            </span>
                          </div>
                          <div className="text-xs font-bold text-[#1B3022]">{dup.candidateProject.title}</div>
                          <div className="text-[11px] text-[#588157]">
                            Distance: <strong className="font-mono text-[#1B3022]">{dup.distanceMeters} meters away</strong> | Category: {dup.candidateProject.category}
                          </div>
                          <div className="text-[11px] text-[#935D26] italic">
                            Factors: {dup.matchingFactors.join(', ')}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-[#1B3022]">₹{(dup.candidateProject.sanctionedAmount / 100000).toFixed(1)}L</div>
                          <div className="text-[10px] text-[#588157]">Sanction Date: {dup.candidateProject.sanctionDate || 'Pending'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SITE PHOTOS & GEOTAG VERIFICATION */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#1B3022] uppercase tracking-wider">Geotagged Progress Photographs</h3>
                  <p className="text-[11px] text-[#588157]">
                    Mandated Before, During, and After photographic verification under MPLADS framework
                  </p>
                </div>
                {userRole !== 'PUBLIC' && (
                  <span className="text-xs text-[#395C40] font-bold bg-[#EAF0E6] px-2.5 py-1 rounded-full border border-[#C8D5B9]">
                    Automated AI EXIF & Coordinate Matching Active
                  </span>
                )}
              </div>

              {project.photos.length === 0 ? (
                <div className="text-center py-12 bg-[#F8F9F7] rounded-xl border border-dashed border-[#DDE5D4]">
                  <Camera className="w-8 h-8 text-[#A3B18A] mx-auto mb-2" />
                  <div className="text-xs font-bold text-[#1B3022]">No Photographs Uploaded Yet</div>
                  <div className="text-[11px] text-[#588157] mt-1">
                    The implementing agency must submit geotagged photos at each milestone stage.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-white rounded-xl border border-[#DDE5D4] overflow-hidden shadow-xs flex flex-col"
                    >
                      <div className="relative aspect-video bg-[#F8F9F7] overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#1B3022]/85 text-white backdrop-blur-xs">
                          {photo.stage} Stage
                        </div>

                        {photo.similarityAlert && (
                          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded text-[10px] font-bold bg-[#E07A5F] text-white flex items-center gap-1 shadow-md">
                            <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                            <span>Potential Image Reuse Flagged</span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="text-xs font-bold text-[#1B3022] line-clamp-1">{photo.caption}</div>
                          <div className="text-[10px] text-[#588157] mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Uploaded {photo.uploadedAt}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#F0F2ED] text-[11px] space-y-1">
                          {photo.latitude && photo.longitude ? (
                            <div className="flex items-center gap-1 font-mono text-[#588157]">
                              <Compass className="w-3 h-3 text-[#395C40]" />
                              <span>{photo.latitude.toFixed(4)}°, {photo.longitude.toFixed(4)}°</span>
                            </div>
                          ) : (
                            <div className="text-[#A3B18A] italic">No GPS coordinates in EXIF</div>
                          )}

                          {photo.aiVerificationNotes && (
                            <div className={`text-[10px] p-1.5 rounded-lg ${photo.isAiVerified ? 'bg-[#EAF0E6] text-[#395C40]' : 'bg-[#FAF3E0] text-[#935D26]'}`}>
                              {photo.aiVerificationNotes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FINANCIALS & PAYMENTS */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-[11px] font-bold text-[#588157] uppercase tracking-wider">Sanctioned Allocation</div>
                  <div className="text-xl font-bold text-[#1B3022] mt-1">₹{(project.sanctionedAmount / 100000).toFixed(2)} Lakh</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-[11px] font-bold text-[#588157] uppercase tracking-wider">Released / Disbursed</div>
                  <div className="text-xl font-bold text-[#395C40] mt-1">₹{(project.fundsUtilized / 100000).toFixed(2)} Lakh</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#DDE5D4] shadow-xs">
                  <div className="text-[11px] font-bold text-[#588157] uppercase tracking-wider">Balance in Treasury</div>
                  <div className="text-xl font-bold text-[#1B3022] mt-1">
                    ₹{((project.sanctionedAmount - project.fundsUtilized) / 100000).toFixed(2)} Lakh
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#DDE5D4] overflow-hidden shadow-xs">
                <div className="px-4 py-2.5 bg-[#F8F9F7] text-xs font-bold text-[#1B3022] uppercase tracking-wider border-b border-[#DDE5D4]">
                  Payment Vouchers & Tranche Disbursals
                </div>
                {project.payments.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#588157]">No payment tranches released yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F9F7] text-[#588157] font-bold border-b border-[#DDE5D4]">
                        <tr>
                          <th className="p-3">Inst. #</th>
                          <th className="p-3">Sanction Order</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Beneficiary</th>
                          <th className="p-3">Disbursed Date</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0F2ED]">
                        {project.payments.map((pay) => (
                          <tr key={pay.id} className="hover:bg-[#F8F9F7] transition-colors">
                            <td className="p-3 font-bold text-[#1B3022]">Installment #{pay.installmentNo}</td>
                            <td className="p-3 font-mono text-[#588157]">{pay.sanctionOrderNo}</td>
                            <td className="p-3 font-bold text-[#1B3022]">₹{(pay.amount / 100000).toFixed(2)} Lakh</td>
                            <td className="p-3 text-[#1B3022]">{pay.beneficiaryAgency}</td>
                            <td className="p-3 font-mono text-[#588157]">{pay.paidAt}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF0E6] text-[#395C40]">
                                {pay.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#1B3022] uppercase tracking-wider">Verified Administrative Repository</div>
              <div className="space-y-2">
                {project.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-white rounded-xl border border-[#DDE5D4] flex items-center justify-between hover:bg-[#F8F9F7] transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#EAF0E6] text-[#395C40]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1B3022]">{doc.name}</div>
                        <div className="text-[10px] text-[#588157]">
                          {doc.type} | {doc.fileSize} | Uploaded {doc.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#1B3022] bg-[#F8F9F7] border border-[#DDE5D4] hover:bg-[#EAF0E6] transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AI TECHNICAL AUDIT BRIEF (GEMINI) */}
          {activeTab === 'audit-report' && !isPublic && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE5D4]">
                <div>
                  <div className="text-xs font-bold text-[#1B3022] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#395C40]" />
                    Automated Administrative Audit Brief (Gemini Technical Audit)
                  </div>
                  <div className="text-[11px] text-[#588157]">
                    Comprehensive anomaly synthesis, fiscal reasonableness audit, and administrative directives.
                  </div>
                </div>

                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingAiReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#395C40] hover:bg-[#2C4A34] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAiReport ? 'Analyzing Project...' : 'Re-Generate Brief'}</span>
                </button>
              </div>

              {isGeneratingAiReport ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-[#395C40] border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="text-xs font-bold text-[#1B3022]">
                    Generating Technical Audit Evaluation...
                  </div>
                  <div className="text-[11px] text-[#588157]">
                    Evaluating BOQ benchmarks, spatial duplicates, and photographic metadata against MoSPI guidelines.
                  </div>
                </div>
              ) : aiReportContent ? (
                <div className="p-6 bg-white border border-[#DDE5D4] rounded-xl font-mono text-xs leading-relaxed text-[#1B3022] whitespace-pre-wrap shadow-xs">
                  {aiReportContent}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F8F9F7] border-t border-[#DDE5D4] flex items-center justify-between text-xs text-[#588157]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1B3022]">Project UID:</span>
            <span className="font-mono text-[#588157]">{project.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white border border-[#DDE5D4] text-[#1B3022] font-bold hover:bg-[#EAF0E6] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
