import React from 'react';
import { Project, RiskAlert, DashboardSummary, UserRole } from '../types/index.js';
import { RiskBadge, StatusBadge } from '../components/Badges.js';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  IndianRupee,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FilePlus2,
  HardHat,
  ChevronRight,
  MapPin,
  Camera,
  Coins
} from 'lucide-react';

interface DashboardPageProps {
  summary: DashboardSummary | null;
  projects: Project[];
  alerts: RiskAlert[];
  userRole: UserRole | 'PUBLIC';
  onSelectProject: (project: Project) => void;
  onNavigateToAnomalies: () => void;
  onNavigateToRecommend: () => void;
  onNavigateToMap: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  summary,
  projects,
  alerts,
  userRole,
  onSelectProject,
  onNavigateToAnomalies,
  onNavigateToRecommend,
  onNavigateToMap
}) => {
  const highRiskProjects = projects
    .filter(p => p.riskAnalysis.overallScore > 50)
    .sort((a, b) => b.riskAnalysis.overallScore - a.riskAnalysis.overallScore)
    .slice(0, 5);

  const pendingAlerts = alerts
    .filter(a => a.status === 'New' || a.status === 'Under Review')
    .slice(0, 5);

  const sanctionedCr = summary ? (summary.totalFundsSanctioned / 10000000).toFixed(2) : '0.00';
  const utilizedCr = summary ? (summary.totalFundsUtilized / 10000000).toFixed(2) : '0.00';
  const utilizationRate = summary && summary.totalFundsSanctioned > 0
    ? Math.round((summary.totalFundsUtilized / summary.totalFundsSanctioned) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Role Notice & Quick Action Banner in Natural Tones Deep Forest Green */}
      <div className="bg-[#1B3022] text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#395C40] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#395C40] text-white font-semibold border border-[#A3B18A]/40">
              {userRole === 'PUBLIC' ? 'Citizen Transparency' : `${userRole} Console`}
            </span>
            <span className="text-xs text-[#C8D5B9]">MoSPI MPLADS Real-Time Integrity Stream</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1.5 text-white">
            {userRole === 'MP' && 'Constituency Development & Integrity Dashboard'}
            {userRole === 'ADMIN' && 'District Authority Executive Vigilance Dashboard'}
            {userRole === 'AGENCY' && 'Implementing Agency Workdesk & Field Monitoring'}
            {userRole === 'PUBLIC' && 'Public Project Monitoring & Grievance Portal'}
          </h1>
          <p className="text-xs text-[#DDE5D4] mt-1 max-w-2xl leading-relaxed">
            AI-assisted monitoring of civil works, fund utilization, and spatial duplicate detection across local infrastructure projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {(userRole === 'MP' || userRole === 'ADMIN') && (
            <button
              onClick={onNavigateToRecommend}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#A3B18A] hover:bg-[#b5c29d] text-[#1B3022] rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Recommend New Work</span>
            </button>
          )}

          <button
            onClick={onNavigateToMap}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#395C40] hover:bg-[#4a7251] text-white rounded-xl text-xs font-semibold border border-[#C8D5B9]/40 shadow-xs transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>GIS Map View</span>
          </button>
        </div>
      </div>

      {/* Top Essential Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Projects */}
        <div className="bg-white rounded-xl p-4 border border-[#DDE5D4] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#588157] uppercase tracking-wider">Total Works</span>
            <div className="p-2 rounded-lg bg-[#EAF0E6] text-[#263D2E]">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1B3022] mt-2">{summary?.totalProjects ?? 0}</div>
          <div className="text-[11px] text-[#588157] mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-[#395C40]">{summary?.completedProjects ?? 0} Completed</span>
            <span>•</span>
            <span className="font-semibold text-[#1B3022]">{summary?.activeProjects ?? 0} Active</span>
          </div>
        </div>

        {/* Card 2: Sanctioned Allocation */}
        <div className="bg-white rounded-xl p-4 border border-[#DDE5D4] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#588157] uppercase tracking-wider">Sanctioned Amount</span>
            <div className="p-2 rounded-lg bg-[#FAF3E0] text-[#935D26]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1B3022] mt-2">₹{sanctionedCr} <span className="text-xs font-normal text-[#588157]">Cr</span></div>
          <div className="text-[11px] text-[#588157] mt-1">
            Across {summary?.totalProjects ?? 0} developmental works
          </div>
        </div>

        {/* Card 3: Funds Utilized */}
        <div className="bg-white rounded-xl p-4 border border-[#DDE5D4] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#588157] uppercase tracking-wider">Funds Utilized</span>
            <div className="p-2 rounded-lg bg-[#EAF0E6] text-[#395C40]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#395C40] mt-2">₹{utilizedCr} <span className="text-xs font-normal text-[#588157]">Cr</span></div>
          <div className="text-[11px] text-[#588157] mt-1 flex items-center gap-2">
            <span>Utilization Rate: <strong>{utilizationRate}%</strong></span>
            <div className="w-12 bg-[#DDE5D4] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#395C40] h-full" style={{ width: `${utilizationRate}%` }} />
            </div>
          </div>
        </div>

        {/* Card 4: High Risk / Delayed */}
        <div className="bg-white rounded-xl p-4 border border-[#FAD2D2] bg-red-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#B85338] uppercase tracking-wider">AI Vigilance Flags</span>
            <div className="p-2 rounded-lg bg-[#FDF0EC] text-[#B85338]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#B85338] mt-2">
            {summary?.highRiskProjectsCount ?? 0}
            <span className="text-xs font-normal text-[#588157] ml-1">High Risk</span>
          </div>
          <div className="text-[11px] text-[#588157] mt-1 flex items-center gap-1.5">
            <span className="text-[#B85338] font-semibold">{summary?.delayedProjects ?? 0} Delayed</span>
            <span>•</span>
            <span className="text-[#935D26] font-semibold">{summary?.totalPendingReviews ?? 0} Alerts</span>
          </div>
        </div>
      </div>

      {/* AI Anomaly Breakdown Cards */}
      <div className="bg-[#2D3A3A] text-white rounded-2xl p-5 shadow-sm border border-[#395C40]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#395C40] gap-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-[#3A5A40] rounded text-white flex items-center justify-center text-[10px] font-bold">
              AI
            </span>
            <h2 className="text-xs font-bold tracking-tight text-[#DDE5D4] uppercase">
              AI Integrity Engine Anomaly Breakdown
            </h2>
          </div>
          <button
            onClick={onNavigateToAnomalies}
            className="text-xs text-[#A3B18A] hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>Open Detailed Anomaly Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          <div className="p-3 bg-[#1B3022]/60 rounded-xl border border-[#395C40]/60">
            <div className="text-[#A3B18A] text-[11px]">Cost Anomalies</div>
            <div className="text-xl font-bold text-[#E8DAB2] mt-1">{summary?.costAnomaliesCount ?? 0}</div>
            <div className="text-[10px] text-[#DDE5D4]/70 mt-0.5">Above benchmark limits</div>
          </div>

          <div className="p-3 bg-[#1B3022]/60 rounded-xl border border-[#395C40]/60">
            <div className="text-[#A3B18A] text-[11px]">Duplicate Candidates</div>
            <div className="text-xl font-bold text-[#A3B18A] mt-1">{summary?.possibleDuplicatesCount ?? 0}</div>
            <div className="text-[10px] text-[#DDE5D4]/70 mt-0.5">Spatial & semantic matches</div>
          </div>

          <div className="p-3 bg-[#1B3022]/60 rounded-xl border border-[#395C40]/60">
            <div className="text-[#A3B18A] text-[11px]">Photo & Location Mismatches</div>
            <div className="text-xl font-bold text-[#E07A5F] mt-1">
              {(summary?.photoAnomaliesCount ?? 0) + (summary?.locationMismatchesCount ?? 0)}
            </div>
            <div className="text-[10px] text-[#DDE5D4]/70 mt-0.5">GPS distance &gt; 250m / reuse</div>
          </div>

          <div className="p-3 bg-[#1B3022]/60 rounded-xl border border-[#395C40]/60">
            <div className="text-[#A3B18A] text-[11px]">Delay Prediction Alerts</div>
            <div className="text-xl font-bold text-[#DDE5D4] mt-1">{summary?.delayRisksCount ?? 0}</div>
            <div className="text-[10px] text-[#DDE5D4]/70 mt-0.5">Trailing planned execution</div>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: High Risk Works and Pending Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Risk Projects Priority Review */}
        <div className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-[#FDFDFB] border-b border-[#DDE5D4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B85338]" />
              <h2 className="text-xs font-bold text-[#1B3022] uppercase tracking-wider">
                Works Requiring Technical Audit (Risk &gt; 50)
              </h2>
            </div>
            <span className="text-[11px] text-[#588157] font-mono">Top {highRiskProjects.length}</span>
          </div>

          <div className="divide-y divide-[#F0F2ED] flex-1">
            {highRiskProjects.map(project => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="p-4 hover:bg-[#F8F9F7] cursor-pointer transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-[#588157] text-[11px]">{project.projectCode}</span>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="font-bold text-[#1B3022] truncate">{project.title}</div>
                  <div className="text-[11px] text-[#588157]">
                    District: {project.district} | Cost: ₹{(project.sanctionedAmount / 100000).toFixed(1)}L | Progress: {project.completionPercentage}%
                  </div>
                  <div className="text-[11px] text-[#B85338] italic line-clamp-1">
                    {project.riskAnalysis.reasons[0]}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <RiskBadge level={project.riskAnalysis.riskLevel} score={project.riskAnalysis.overallScore} />
                  <div className="text-[10px] text-[#395C40] font-bold mt-2 flex items-center justify-end gap-0.5">
                    <span>Audit Work</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Alerts Queue */}
        <div className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-[#FDFDFB] border-b border-[#DDE5D4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#935D26]" />
              <h2 className="text-xs font-bold text-[#1B3022] uppercase tracking-wider">
                Active AI Vigilance Alerts
              </h2>
            </div>
            <button
              onClick={onNavigateToAnomalies}
              className="text-[11px] font-semibold text-[#395C40] hover:underline cursor-pointer"
            >
              View All ({alerts.length})
            </button>
          </div>

          <div className="divide-y divide-[#F0F2ED] flex-1">
            {pendingAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#588157]">
                No active alerts in queue. All systems operating within baseline parameters.
              </div>
            ) : (
              pendingAlerts.map(alert => {
                const matchedProject = projects.find(p => p.id === alert.projectId);
                return (
                  <div
                    key={alert.id}
                    onClick={() => matchedProject && onSelectProject(matchedProject)}
                    className="p-4 hover:bg-[#F8F9F7] cursor-pointer transition-colors text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1B3022]">{alert.projectTitle}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${alert.status === 'New' ? 'bg-[#FDF0EC] text-[#B85338] border-[#E07A5F]' : 'bg-[#FAF3E0] text-[#935D26] border-[#E8DAB2]'}`}>
                        {alert.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#588157] font-mono">
                      <span className="text-[#935D26] font-semibold">{alert.alertType}</span>
                      <span>•</span>
                      <span>{alert.district}</span>
                      <span>•</span>
                      <span>{alert.agencyName}</span>
                    </div>

                    <div className="text-[11px] text-[#1B3022] bg-[#F8F9F7] p-2.5 rounded-lg border border-[#DDE5D4]">
                      {alert.reason}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
