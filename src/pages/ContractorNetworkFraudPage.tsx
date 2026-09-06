import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api.js';
import {
  Network,
  AlertTriangle,
  Building,
  Landmark,
  MapPin,
  ShieldAlert,
  Info,
  RefreshCw,
  Search,
  Filter,
  Users,
  CheckCircle,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';

export const ContractorNetworkFraudPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'SUSPICIOUS_ONLY' | 'SHELL_ONLY'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadNetworkData = async () => {
    setLoading(true);
    try {
      const res = await api.getContractorNetwork();
      setData(res);
      if (res?.vendorReports?.length > 0) {
        // Select the most suspicious vendor by default
        const topFlagged = res.vendorReports.find((v: any) => v.requiresHighPriorityAlert) || res.vendorReports[0];
        setSelectedVendor(topFlagged);
      }
    } catch (err) {
      console.error('Failed to load contractor network data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetworkData();
  }, []);

  const filteredVendors = useMemo(() => {
    if (!data?.vendorReports) return [];
    return data.vendorReports.filter((v: any) => {
      if (filterMode === 'SUSPICIOUS_ONLY' && !v.requiresHighPriorityAlert) return false;
      if (filterMode === 'SHELL_ONLY' && !v.signals.shellCompanyIndicators.isFlagged) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          v.vendorName.toLowerCase().includes(q) ||
          v.mpsConnected.some((m: string) => m.toLowerCase().includes(q)) ||
          v.districtsConnected.some((d: string) => d.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [data, filterMode, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Masthead */}
      <div className="bg-white rounded-xl border border-[#DDE5D4] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#1B3022] text-white shrink-0">
              <Network className="w-6 h-6 text-[#A3B18A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#1B3022]">
                  Contractor & Vendor Network Fraud Detection
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EAF0E6] text-[#2D4A32] font-semibold border border-[#C8D5B9]">
                  Graph Analytics & Shell Detection
                </span>
              </div>
              <p className="text-xs text-[#588157] mt-0.5 max-w-3xl">
                Models relationships across Contractors, Members of Parliament, Implementing Districts, and Projects. Employs concentration z-scores, rapid-fire award burst detection, and shared address/director PIN matching to identify shell collusion cartels.
              </p>
            </div>
          </div>

          <button
            onClick={loadNetworkData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#395C40] hover:bg-[#2e4d34] disabled:opacity-50 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Recompute Graph</span>
          </button>
        </div>

        {/* Executive Summary Stats */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#DDE5D4]">
            <div className="bg-[#F8F9F7] p-3 rounded-lg border border-[#DDE5D4]">
              <span className="text-[11px] text-[#588157] font-semibold uppercase">Contractors Audited</span>
              <div className="text-xl font-bold text-[#1B3022] mt-0.5">{data.totalVendorsAnalyzed}</div>
              <span className="text-[10px] text-gray-500">Across active MPLADS ledger</span>
            </div>

            <div className="bg-[#FFF8F6] p-3 rounded-lg border border-[#E07A5F]/40">
              <span className="text-[11px] text-[#9C3820] font-semibold uppercase">Collusion Rings Flagged</span>
              <div className="text-xl font-bold text-[#9C3820] mt-0.5">{data.flaggedClustersCount}</div>
              <span className="text-[10px] text-[#9C3820]/80">&ge; 2 Independent Anomaly Signals</span>
            </div>

            <div className="bg-[#F8F9F7] p-3 rounded-lg border border-[#DDE5D4]">
              <span className="text-[11px] text-[#588157] font-semibold uppercase">Graph Edges Modeled</span>
              <div className="text-xl font-bold text-[#1B3022] mt-0.5">{data.edges?.length || 0}</div>
              <span className="text-[10px] text-gray-500">Awards, Executions & Co-location</span>
            </div>

            <div className="bg-[#F8F9F7] p-3 rounded-lg border border-[#DDE5D4]">
              <span className="text-[11px] text-[#588157] font-semibold uppercase">False-Positive Safeguard</span>
              <div className="text-xs font-bold text-[#2D4A32] mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-[#588157]" />
                <span>Multi-Factor Enforced</span>
              </div>
              <span className="text-[10px] text-gray-500">Single signal does not flag</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Graph & Vendor Directory (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-3 rounded-xl border border-[#DDE5D4] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contractor or MP..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#C8D5B9] bg-[#F8F9F7] text-[#1B3022] focus:outline-hidden focus:ring-1 focus:ring-[#395C40]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'ALL'
                    ? 'bg-[#1B3022] text-white'
                    : 'bg-[#F8F9F7] text-[#588157] hover:bg-[#EAF0E6]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode('SUSPICIOUS_ONLY')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'SUSPICIOUS_ONLY'
                    ? 'bg-[#E07A5F] text-white'
                    : 'bg-[#F8F9F7] text-[#588157] hover:bg-[#EAF0E6]'
                }`}
              >
                High Risk Rings
              </button>
              <button
                onClick={() => setFilterMode('SHELL_ONLY')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMode === 'SHELL_ONLY'
                    ? 'bg-[#E07A5F] text-white'
                    : 'bg-[#F8F9F7] text-[#588157] hover:bg-[#EAF0E6]'
                }`}
              >
                Shell Overlaps
              </button>
            </div>
          </div>

          {/* Interactive Network Topology Visualizer */}
          <div className="bg-white rounded-xl border border-[#DDE5D4] p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B3022]">
                Interactive Collusion Network Topology
              </h3>
              <div className="flex items-center gap-3 text-[11px] text-[#588157]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F]" /> High Risk Vendor
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#395C40]" /> MP Node
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A5568]" /> District
                </span>
              </div>
            </div>

            {/* SVG Network Canvas */}
            <div className="w-full h-80 bg-[#1B3022] rounded-lg relative overflow-hidden border border-[#263D2E] flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 320">
                <defs>
                  <linearGradient id="edgeGradSuspicious" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#C53F27" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Background Grid Accent */}
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#263D2E" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#gridPattern)" />

                {/* Shell Collusion Bridge (Thick Red Pulsing Edge) */}
                <line
                  x1="180"
                  y1="130"
                  x2="280"
                  y2="90"
                  stroke="#E07A5F"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                  className="animate-pulse"
                />
                <text x="215" y="105" fill="#F5C2B4" fontSize="9" fontWeight="bold">
                  Shared Address & Dir
                </text>

                {/* MP to Vendor Edges */}
                <line x1="420" y1="160" x2="180" y2="130" stroke="#A3B18A" strokeWidth="1.5" strokeOpacity="0.7" />
                <line x1="420" y1="160" x2="280" y2="90" stroke="#A3B18A" strokeWidth="1.5" strokeOpacity="0.7" />
                <line x1="420" y1="160" x2="230" y2="230" stroke="#A3B18A" strokeWidth="1" strokeOpacity="0.4" />
                <line x1="420" y1="160" x2="480" y2="240" stroke="#A3B18A" strokeWidth="1" strokeOpacity="0.4" />

                {/* Nodes */}
                {/* MP Node (Central) */}
                <g transform="translate(420, 160)" className="cursor-pointer">
                  <circle r="22" fill="#263D2E" stroke="#A3B18A" strokeWidth="2" />
                  <text textAnchor="middle" dy="4" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                    MP: Rajesh
                  </text>
                </g>

                {/* High Risk Shell Vendor 1 */}
                <g
                  transform="translate(180, 130)"
                  className="cursor-pointer"
                  onClick={() => {
                    const v = data?.vendorReports?.find((x: any) => x.vendorName.includes('Sri Sai Ram'));
                    if (v) setSelectedVendor(v);
                  }}
                >
                  <circle
                    r="20"
                    fill="#E07A5F"
                    stroke="#FFFFFF"
                    strokeWidth={selectedVendor?.vendorName?.includes('Sri Sai Ram') ? 3 : 1}
                  />
                  <text textAnchor="middle" dy="3" fill="#FFFFFF" fontSize="8" fontWeight="bold">
                    Sai Ram Infra
                  </text>
                </g>

                {/* High Risk Shell Vendor 2 (Sibling entity) */}
                <g
                  transform="translate(280, 90)"
                  className="cursor-pointer"
                  onClick={() => {
                    const v = data?.vendorReports?.find((x: any) => x.vendorName.includes('Sai Ram Civil'));
                    if (v) setSelectedVendor(v);
                  }}
                >
                  <circle
                    r="18"
                    fill="#E07A5F"
                    stroke="#FFFFFF"
                    strokeWidth={selectedVendor?.vendorName?.includes('Sai Ram Civil') ? 3 : 1}
                  />
                  <text textAnchor="middle" dy="3" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">
                    Sai Ram Civil
                  </text>
                </g>

                {/* Standard Vendor 3 */}
                <g
                  transform="translate(230, 230)"
                  className="cursor-pointer"
                  onClick={() => {
                    const v = data?.vendorReports?.find((x: any) => x.vendorName.includes('Surya'));
                    if (v) setSelectedVendor(v);
                  }}
                >
                  <circle r="16" fill="#395C40" stroke="#C8D5B9" strokeWidth="1" />
                  <text textAnchor="middle" dy="3" fill="#FFFFFF" fontSize="8">
                    Surya Infra
                  </text>
                </g>

                {/* Standard Vendor 4 */}
                <g
                  transform="translate(480, 240)"
                  className="cursor-pointer"
                  onClick={() => {
                    const v = data?.vendorReports?.find((x: any) => x.vendorName.includes('Deccan'));
                    if (v) setSelectedVendor(v);
                  }}
                >
                  <circle r="16" fill="#395C40" stroke="#C8D5B9" strokeWidth="1" />
                  <text textAnchor="middle" dy="3" fill="#FFFFFF" fontSize="8">
                    Deccan Util
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Vendors Directory Cards */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filteredVendors.map((v: any) => {
              const isSelected = selectedVendor?.vendorName === v.vendorName;
              return (
                <div
                  key={v.vendorName}
                  onClick={() => setSelectedVendor(v)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F8F9F7] border-[#1B3022] shadow-xs ring-1 ring-[#1B3022]'
                      : 'bg-white border-[#DDE5D4] hover:border-[#C8D5B9]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1B3022]">{v.vendorName}</span>
                        {v.requiresHighPriorityAlert && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF0ED] text-[#E07A5F] font-bold border border-[#E07A5F]/40">
                            {v.independentSignalsCount} Collusion Signals
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Tax ID: <span className="font-mono text-gray-700">{v.panMasked || 'PAN-UNAVAILABLE'}</span> | Projects: <span className="font-bold text-[#1B3022]">{v.totalProjects}</span> | Total: <span className="font-bold text-[#1B3022]">₹{v.totalSanctionedCr} Cr</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          v.riskLevel === 'CRITICAL'
                            ? 'bg-[#C53F27] text-white'
                            : v.riskLevel === 'HIGH'
                            ? 'bg-[#E07A5F] text-white'
                            : v.riskLevel === 'MEDIUM'
                            ? 'bg-[#F4A261] text-[#1B3022]'
                            : 'bg-[#EAF0E6] text-[#2D4A32]'
                        }`}
                      >
                        {v.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Vendor Risk Dossier & Independent Signals (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedVendor ? (
            <div className="bg-white rounded-xl border border-[#DDE5D4] p-5 shadow-xs space-y-5">
              {/* Dossier Header */}
              <div className="border-b border-[#DDE5D4] pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#588157] font-bold">
                    Vendor Integrity Dossier
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      selectedVendor.requiresHighPriorityAlert
                        ? 'bg-[#FFF0ED] text-[#9C3820] border border-[#E07A5F]'
                        : 'bg-[#EAF0E6] text-[#2D4A32] border border-[#C8D5B9]'
                    }`}
                  >
                    Score: {selectedVendor.networkRiskScore}/100
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#1B3022] mt-1">
                  {selectedVendor.vendorName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Masked PAN: {selectedVendor.panMasked} | Associated with {selectedVendor.mpsConnected.join(', ')}
                </p>
              </div>

              {/* Multi-Signal Verification Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B3022]">
                    Independent Anomaly Signals
                  </h3>
                  <span className="text-[11px] text-[#588157]">
                    {selectedVendor.independentSignalsCount} of 4 Flags Triggered
                  </span>
                </div>

                {/* Signal 1: Concentration */}
                <div
                  className={`p-3 rounded-lg border text-xs ${
                    selectedVendor.signals.concentration.isFlagged
                      ? 'bg-[#FFF8F6] border-[#E07A5F]/50 text-[#1B3022]'
                      : 'bg-[#F8F9F7] border-[#DDE5D4] text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>1. Contractor Concentration (Z-Score)</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        selectedVendor.signals.concentration.isFlagged
                          ? 'bg-[#E07A5F] text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {selectedVendor.signals.concentration.isFlagged ? 'FLAGGED' : 'NORMAL'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px]">
                    {selectedVendor.signals.concentration.details}
                  </p>
                </div>

                {/* Signal 2: Rapid-Fire Awards */}
                <div
                  className={`p-3 rounded-lg border text-xs ${
                    selectedVendor.signals.rapidFireAwards.isFlagged
                      ? 'bg-[#FFF8F6] border-[#E07A5F]/50 text-[#1B3022]'
                      : 'bg-[#F8F9F7] border-[#DDE5D4] text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>2. Rapid-Fire Award Bursts (&lt;= 30 Days)</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        selectedVendor.signals.rapidFireAwards.isFlagged
                          ? 'bg-[#E07A5F] text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {selectedVendor.signals.rapidFireAwards.isFlagged ? 'BURST DETECTED' : 'STANDARD CADENCE'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px]">
                    {selectedVendor.signals.rapidFireAwards.details}
                  </p>
                </div>

                {/* Signal 3: Shell Company Indicators */}
                <div
                  className={`p-3 rounded-lg border text-xs ${
                    selectedVendor.signals.shellCompanyIndicators.isFlagged
                      ? 'bg-[#FFF8F6] border-[#E07A5F]/50 text-[#1B3022]'
                      : 'bg-[#F8F9F7] border-[#DDE5D4] text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>3. Shell-Company Signals (Shared Address / Dir)</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        selectedVendor.signals.shellCompanyIndicators.isFlagged
                          ? 'bg-[#C53F27] text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {selectedVendor.signals.shellCompanyIndicators.isFlagged ? 'OVERLAPS FOUND' : 'INDEPENDENT'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px]">
                    {selectedVendor.signals.shellCompanyIndicators.details}
                  </p>
                </div>

                {/* Signal 4: Collusion Cluster */}
                <div
                  className={`p-3 rounded-lg border text-xs ${
                    selectedVendor.signals.collusionCluster.isFlagged
                      ? 'bg-[#FFF8F6] border-[#E07A5F]/50 text-[#1B3022]'
                      : 'bg-[#F8F9F7] border-[#DDE5D4] text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>4. Closed Collusion Ring (MP-Contractor Triad)</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        selectedVendor.signals.collusionCluster.isFlagged
                          ? 'bg-[#E07A5F] text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {selectedVendor.signals.collusionCluster.isFlagged ? 'CLOSED CLUSTER' : 'ORGANIC'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px]">
                    {selectedVendor.signals.collusionCluster.details}
                  </p>
                </div>
              </div>

              {/* Recommendation Action */}
              <div className="bg-[#F8F9F7] p-3.5 rounded-lg border border-[#DDE5D4] text-xs">
                <div className="font-bold text-[#1B3022] mb-1">Administrative Audit Action:</div>
                <p className="text-gray-700">{selectedVendor.recommendation}</p>
              </div>

              {/* False-Positive Safeguard Footnote */}
              <div className="text-[11px] text-gray-500 flex items-start gap-2 bg-[#F1F6EF] p-2.5 rounded-lg border border-[#C8D5B9]">
                <Info className="w-4 h-4 text-[#588157] shrink-0 mt-0.5" />
                <span>
                  <strong>False-Positive Protection:</strong> In compliance with fair procurement standards, a single concentration signal does NOT trigger high-priority alerts, preventing penalization of specialized local civil contractors.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#DDE5D4] p-8 text-center text-gray-500 shadow-xs">
              Select a vendor on the left to inspect multi-factor graph collusion metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
