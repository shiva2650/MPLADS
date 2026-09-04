import React, { useState, useMemo } from 'react';
import { Project, UserRole } from '../types/index.js';
import { RiskBadge, StatusBadge } from '../components/Badges.js';
import {
  Search,
  Filter,
  Download,
  FilePlus2,
  ChevronRight,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

interface ProjectsPageProps {
  projects: Project[];
  userRole: UserRole | 'PUBLIC';
  onSelectProject: (project: Project) => void;
  onNavigateToRecommend?: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  userRole,
  onSelectProject,
  onNavigateToRecommend
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortField, setSortField] = useState<'code' | 'cost' | 'progress' | 'risk'>('risk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Unique lists for filter dropdowns
  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.category)))], [projects]);
  const districts = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.district)))], [projects]);
  const statuses = ['All', 'Ongoing', 'Completed', 'Delayed', 'Assigned', 'Sanctioned', 'Recommended'];
  const risks = ['All', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  // Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch =
        searchTerm.trim() === '' ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.locationAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchDistrict = districtFilter === 'All' || p.district === districtFilter;
      const matchRisk = riskFilter === 'All' || p.riskAnalysis.riskLevel === riskFilter;

      return matchSearch && matchCategory && matchStatus && matchDistrict && matchRisk;
    }).sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;
      if (sortField === 'code') {
        valA = a.projectCode;
        valB = b.projectCode;
      } else if (sortField === 'cost') {
        valA = a.sanctionedAmount || a.estimatedCost;
        valB = b.sanctionedAmount || b.estimatedCost;
      } else if (sortField === 'progress') {
        valA = a.completionPercentage;
        valB = b.completionPercentage;
      } else if (sortField === 'risk') {
        valA = a.riskAnalysis.overallScore;
        valB = b.riskAnalysis.overallScore;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [projects, searchTerm, categoryFilter, statusFilter, districtFilter, riskFilter, sortField, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['Project Code', 'Title', 'Category', 'District', 'MP', 'Cost (INR)', 'Utilized (INR)', 'Status', 'Progress %', 'Risk Score', 'Risk Level'];
    const rows = filteredProjects.map(p => [
      p.projectCode,
      `"${p.title.replace(/"/g, '""')}"`,
      p.category,
      p.district,
      `"${p.mpName}"`,
      p.sanctionedAmount || p.estimatedCost,
      p.fundsUtilized,
      p.status,
      p.completionPercentage,
      p.riskAnalysis.overallScore,
      p.riskAnalysis.riskLevel
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPLADS_Projects_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1B3022] tracking-tight">MPLADS Works Directory</h1>
          <p className="text-xs text-[#588157]">
            Official repository of sanctioned, ongoing, and completed developmental works
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE5D4] rounded-lg text-xs font-semibold text-[#1B3022] hover:bg-[#F8F9F7] shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#588157]" />
            <span>Export CSV</span>
          </button>

          {(userRole === 'MP' || userRole === 'ADMIN') && onNavigateToRecommend && (
            <button
              onClick={onNavigateToRecommend}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#395C40] hover:bg-[#4a7251] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Recommend Work</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#DDE5D4] shadow-xs space-y-3">
        {/* Search row */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3B18A]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by project code, title, contractor, village, or address..."
            className="w-full pl-9 pr-3 py-2 border border-[#DDE5D4] rounded-xl text-xs text-[#1B3022] bg-[#F8F9F7] focus:bg-white focus:ring-2 focus:ring-[#395C40] focus:outline-hidden"
          />
        </div>

        {/* Filter chips row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#588157] mb-1 uppercase tracking-wider">Category</label>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs text-[#1B3022]"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#588157] mb-1 uppercase tracking-wider">Execution Status</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs text-[#1B3022]"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#588157] mb-1 uppercase tracking-wider">District</label>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs text-[#1B3022]"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#588157] mb-1 uppercase tracking-wider">AI Risk Level</label>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs text-[#1B3022]"
            >
              {risks.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Stats Summary */}
      <div className="flex items-center justify-between text-xs text-[#588157] px-1">
        <div>
          Showing <strong>{filteredProjects.length}</strong> of {projects.length} developmental works
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#588157]">Sort by:</span>
          <button
            onClick={() => {
              setSortField('risk');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            }}
            className={`font-semibold underline cursor-pointer ${sortField === 'risk' ? 'text-[#1B3022]' : 'text-[#588157]'}`}
          >
            Risk Score ({sortOrder})
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F7] text-[#588157] font-bold uppercase text-[10px] border-b border-[#DDE5D4] tracking-wider">
              <tr>
                <th className="p-3">Project Ref</th>
                <th className="p-3">Work Title & Category</th>
                <th className="p-3">Location & District</th>
                <th className="p-3 text-right">Cost (Lakh)</th>
                <th className="p-3">Physical Progress</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">AI Risk</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2ED]">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#588157] text-xs">
                    No matching projects found for selected filters. Try broadening search criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map(project => (
                  <tr
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="hover:bg-[#F8F9F7] cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-mono font-semibold text-[#588157] whitespace-nowrap">
                      {project.projectCode}
                    </td>

                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-[#1B3022] line-clamp-1">{project.title}</div>
                      <div className="text-[11px] text-[#588157] mt-0.5">{project.category}</div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <div className="text-[#1B3022] font-medium">{project.district}</div>
                      <div className="text-[10px] text-[#588157]">{project.constituency}</div>
                    </td>

                    <td className="p-3 text-right whitespace-nowrap font-mono font-semibold text-[#1B3022]">
                      ₹{((project.sanctionedAmount || project.estimatedCost) / 100000).toFixed(2)}L
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#DDE5D4] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              project.status === 'Completed'
                                ? 'bg-[#395C40]'
                                : project.status === 'Delayed'
                                ? 'bg-[#B85338]'
                                : 'bg-[#588157]'
                            }`}
                            style={{ width: `${project.completionPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-[#1B3022] font-medium">
                          {project.completionPercentage}%
                        </span>
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <StatusBadge status={project.status} />
                    </td>

                    <td className="p-3 text-center whitespace-nowrap">
                      <RiskBadge level={project.riskAnalysis.riskLevel} score={project.riskAnalysis.overallScore} />
                    </td>

                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSelectProject(project);
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-[#395C40] bg-[#EAF0E6] border border-[#C8D5B9] rounded-lg hover:bg-[#DDE5D4] transition-colors cursor-pointer"
                      >
                        Audit Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
