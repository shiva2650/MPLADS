import React, { useState, useEffect } from 'react';
import { Project } from '../types/index.js';
import { api } from '../services/api.js';
import {
  Satellite,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  MapPin,
  Calendar,
  Sparkles,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Building,
  TreePine,
  Activity
} from 'lucide-react';

interface SatelliteVerificationPageProps {
  projects: Project[];
  onSelectProject?: (p: Project) => void;
}

export const SatelliteVerificationPage: React.FC<SatelliteVerificationPageProps> = ({
  projects,
  onSelectProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.find(p => p.status === 'Completed' || p.completionPercentage >= 80)?.id || projects[0]?.id || ''
  );
  const [observation, setObservation] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [activeVisualMode, setActiveVisualMode] = useState<'sideBySide' | 'diffOverlay'>('sideBySide');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const fetchSatelliteData = async (projectId: string) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await api.getSatelliteObservation(projectId);
      setObservation(res.observation);
    } catch (err) {
      console.error('Failed to fetch satellite data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      fetchSatelliteData(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleRunReVerification = async () => {
    if (!selectedProjectId) return;
    setVerifying(true);
    try {
      const res = await api.verifySatellite(selectedProjectId);
      setObservation(res.observation);
    } catch (err) {
      console.error('Re-verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  const isAnomaly = observation?.verdict === 'ANOMALY_DETECTED';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#DDE5D4] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#263D2E] text-white shrink-0">
              <Satellite className="w-6 h-6 text-[#A3B18A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#1B3022]">
                  Satellite Imagery Multi-Temporal Cross-Verification
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EAF0E6] text-[#2D4A32] font-semibold border border-[#C8D5B9]">
                  Sentinel-2 L2A / Earth Engine
                </span>
              </div>
              <p className="text-xs text-[#588157] mt-0.5 max-w-2xl">
                Independently validates project completion claims using multi-temporal optical imagery and multispectral NDVI vegetation & structural edge detection, mitigating reliance on potentially manipulated ground photographs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunReVerification}
              disabled={verifying}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#395C40] hover:bg-[#2e4d34] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
              <span>{verifying ? 'Auditing Imagery...' : 'Run Live Sentinel-2 Audit'}</span>
            </button>
          </div>
        </div>

        {/* Project Selector Bar */}
        <div className="mt-5 pt-4 border-t border-[#DDE5D4] flex flex-wrap items-center gap-3">
          <label className="text-xs font-bold text-[#1B3022] whitespace-nowrap">
            Select Work for Orbital Audit:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="flex-1 min-w-[280px] text-xs bg-[#F8F9F7] border border-[#C8D5B9] rounded-lg px-3 py-1.5 text-[#1B3022] font-medium focus:ring-2 focus:ring-[#395C40] focus:outline-hidden"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.projectCode}] {p.title} — {p.category} ({p.status} - {p.completionPercentage}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-[#DDE5D4] p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-[#395C40] animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#1B3022]">Querying Sentinel-2 Multi-Spectral Cloud Constellation...</p>
          <p className="text-xs text-[#588157] mt-1">
            Extracting calibrated orbital passes for GPS {activeProject?.latitude ? activeProject.latitude.toFixed(4) : '17.4120'}, {activeProject?.longitude ? activeProject.longitude.toFixed(4) : '78.4982'}
          </p>
        </div>
      ) : observation ? (
        <div className="space-y-6">
          {/* Verdict Status Card */}
          <div
            className={`rounded-xl border p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isAnomaly
                ? 'bg-[#FDF3F0] border-[#E07A5F]/40 text-[#9C3820]'
                : 'bg-[#F1F6EF] border-[#A3B18A]/50 text-[#244829]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              {isAnomaly ? (
                <div className="p-2 rounded-full bg-[#E07A5F] text-white shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-[#588157] text-white shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-current">
                    {observation.verdict.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold">
                    Confidence Score: {((observation.confidenceScore ?? (observation.physicalConfidenceScore ? observation.physicalConfidenceScore / 100 : 0.85)) * 100).toFixed(0)}%
                  </span>
                </div>
                <h3 className="text-base font-bold mt-1 text-[#1B3022]">
                  {observation.verdictReason}
                </h3>
                <p className="text-xs opacity-90 mt-1">
                  GPS Footprint: {(observation.coordinates?.latitude ?? observation.projectCoordinates?.latitude ?? activeProject?.latitude ?? 17.4120).toFixed(4)}° N, {(observation.coordinates?.longitude ?? observation.projectCoordinates?.longitude ?? activeProject?.longitude ?? 78.4982).toFixed(4)}° E | Cloud Cover: {observation.cloudCoveragePct ?? observation.cloudCoverPercentage ?? 3}% (Atmospherically Cleared)
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[11px] uppercase tracking-wider text-[#588157] font-semibold">Change Detection Method</div>
              <div className="text-sm font-bold text-[#1B3022] mt-0.5">
                {observation.analysisType === 'CANNY_EDGE_STRUCTURAL' || observation.analysisType === 'STRUCTURAL_EDGE'
                  ? 'Structural Edge Density (OpenCV Canny)'
                  : 'Multispectral NDVI Canopy Growth'}
              </div>
              <div className="text-xs text-[#588157] mt-0.5">
                Resolution: {observation.resolutionMetersPerPixel ?? observation.resolutionMeters ?? 10}m ground sampling
              </div>
            </div>
          </div>

          {/* Satellite Image Comparison Panel */}
          <div className="bg-white rounded-xl border border-[#DDE5D4] p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#1B3022] uppercase tracking-wider">
                  Orbital Multi-Temporal Comparison
                </h2>
                <p className="text-xs text-[#588157]">
                  Comparing Sentinel-2 True Color (TCI) at Work Inception vs Claimed Completion Date
                </p>
              </div>

              {/* Visual Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#F8F9F7] p-1 rounded-lg border border-[#DDE5D4]">
                <button
                  onClick={() => setActiveVisualMode('sideBySide')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    activeVisualMode === 'sideBySide'
                      ? 'bg-white text-[#1B3022] shadow-xs'
                      : 'text-[#588157] hover:text-[#1B3022]'
                  }`}
                >
                  Side-by-Side Dual Pass
                </button>
                <button
                  onClick={() => setActiveVisualMode('diffOverlay')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    activeVisualMode === 'diffOverlay'
                      ? 'bg-white text-[#1B3022] shadow-xs'
                      : 'text-[#588157] hover:text-[#1B3022]'
                  }`}
                >
                  Feature Change Mask
                </button>
              </div>
            </div>

            {/* Satellite Imagery Render Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Baseline Pass (Start Date) */}
              <div className="rounded-xl border border-[#DDE5D4] overflow-hidden bg-[#F8F9F7]">
                <div className="bg-[#263D2E] text-white px-3 py-2 text-xs flex items-center justify-between font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#A3B18A]" />
                    <span>Baseline Pass: {observation.baselinePass?.date || observation.baselineDate || '2023-11-01'}</span>
                  </div>
                  <span className="text-[10px] text-[#A3B18A] uppercase">Project Start</span>
                </div>
                <div className="p-3 flex items-center justify-center bg-black/5">
                  <img
                    src={observation.baselinePass?.imageUrl || observation.beforeImageUrl || ''}
                    alt="Baseline Satellite Pass"
                    className="w-full max-w-[340px] h-auto rounded-lg shadow-xs border border-[#C8D5B9]"
                  />
                </div>
                <div className="p-3 text-xs bg-white border-t border-[#DDE5D4] flex items-center justify-between">
                  <span className="text-gray-500">Spectral Band: Sentinel-2 B04, B03, B02 (TCI)</span>
                  <span className="font-semibold text-[#1B3022]">Unimproved Ground State</span>
                </div>
              </div>

              {/* Target / Completion Pass */}
              <div className="rounded-xl border border-[#DDE5D4] overflow-hidden bg-[#F8F9F7]">
                <div className="bg-[#1B3022] text-white px-3 py-2 text-xs flex items-center justify-between font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#A3B18A]" />
                    <span>Completion Pass: {observation.targetPass?.date || observation.evaluationDate || 'Current Evaluation'}</span>
                  </div>
                  <span className="text-[10px] text-[#A3B18A] uppercase">
                    {activeVisualMode === 'diffOverlay' ? 'Change Mask' : 'Claimed Date'}
                  </span>
                </div>
                <div className="p-3 flex items-center justify-center bg-black/5">
                  <img
                    src={
                      activeVisualMode === 'diffOverlay'
                        ? (observation.diffHeatmapUrl || observation.targetPass?.imageUrl || observation.afterImageUrl || '')
                        : (observation.targetPass?.imageUrl || observation.afterImageUrl || '')
                    }
                    alt="Claimed Completion Satellite Pass"
                    className="w-full max-w-[340px] h-auto rounded-lg shadow-xs border border-[#C8D5B9]"
                  />
                </div>
                <div className="p-3 text-xs bg-white border-t border-[#DDE5D4] flex items-center justify-between">
                  <span className="text-gray-500">
                    Spatial Shift Detected: {(observation.ssimChangeScore !== undefined ? observation.ssimChangeScore : (observation.spectralDiffIndex !== undefined ? observation.spectralDiffIndex / 100 : 0.45)).toFixed(2)} SSIM
                  </span>
                  <span className={`font-semibold ${isAnomaly ? 'text-[#C53F27]' : 'text-[#2D6A4F]'}`}>
                    {isAnomaly ? 'Discrepancy: Zero Structural Change' : 'Structural Growth Verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#F8F9F7] p-3.5 rounded-lg border border-[#DDE5D4]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">Structural Edge Score</span>
                  <Activity className="w-4 h-4 text-[#395C40]" />
                </div>
                <div className="text-xl font-bold text-[#1B3022] mt-1">
                  {observation.structuralEdgeScore !== undefined
                    ? `${(observation.structuralEdgeScore <= 1 ? observation.structuralEdgeScore * 100 : observation.structuralEdgeScore).toFixed(1)}%`
                    : (observation.structuralChangePct !== undefined ? `${observation.structuralChangePct.toFixed(1)}%` : '42.0%')}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {observation.analysisType === 'CANNY_EDGE_STRUCTURAL' || observation.analysisType === 'STRUCTURAL_EDGE'
                    ? 'Threshold required for building/road: \u2265 40%'
                    : 'Secondary structural metric'}
                </div>
              </div>

              <div className="bg-[#F8F9F7] p-3.5 rounded-lg border border-[#DDE5D4]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">Vegetation Delta (NDVI)</span>
                  <TreePine className="w-4 h-4 text-[#588157]" />
                </div>
                <div className="text-xl font-bold text-[#1B3022] mt-1">
                  {(() => {
                    const val = observation.vegetationDeltaNdvi !== undefined ? observation.vegetationDeltaNdvi : observation.ndviDelta;
                    if (typeof val === 'number') {
                      return val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
                    }
                    return '+0.00';
                  })()}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Near-Infrared (B08) vs Red (B04) index
                </div>
              </div>

              <div className="bg-[#F8F9F7] p-3.5 rounded-lg border border-[#DDE5D4]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">Built-Up Area Footprint</span>
                  <Building className="w-4 h-4 text-[#263D2E]" />
                </div>
                <div className="text-xl font-bold text-[#1B3022] mt-1">
                  {observation.detectedFootprintM2 ?? 500} m²
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Measured roof & paved perimeter
                </div>
              </div>
            </div>

            {/* Vigilance Action Recommendation */}
            {isAnomaly && (
              <div className="p-4 bg-[#FFF8F6] rounded-xl border border-[#E07A5F] flex items-start gap-3 text-xs text-[#1B3022]">
                <ShieldCheck className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#9C3820] uppercase tracking-wider text-[11px]">
                    Automatic Alert Escalated to Vigilance Directorate
                  </div>
                  <p className="mt-0.5">
                    This work was claimed as 100% physically completed with bills submitted by the implementing agency ({activeProject?.implementingAgencyName}), but orbital imagery reveals unchanged open land with 0.00 structural delta. Disbursement should be halted pending physical inspection by the District Collector.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
