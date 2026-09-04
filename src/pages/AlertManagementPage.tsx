import React, { useState } from 'react';
import { RiskAlert, Project } from '../types/index.js';
import { AlertBadge, RiskBadge } from '../components/Badges.js';
import {
  ShieldAlert,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AlertManagementPageProps {
  alerts: RiskAlert[];
  projects: Project[];
  onOpenAlertAction: (alert: RiskAlert) => void;
  onSelectProject: (project: Project) => void;
}

export const AlertManagementPage: React.FC<AlertManagementPageProps> = ({
  alerts,
  projects,
  onOpenAlertAction,
  onSelectProject
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredAlerts = alerts.filter(a => {
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchType = typeFilter === 'All' || a.alertType === typeFilter;
    return matchStatus && matchType;
  });

  const types = ['All', 'Cost Anomaly', 'Possible Duplicate', 'Photo Anomaly', 'Location Mismatch', 'Delay Risk'];
  const statuses = ['All', 'New', 'Under Review', 'Escalated', 'Resolved', 'False Positive'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1B3022] tracking-tight">
            AI Alert Management & Vigilance Review Desk
          </h1>
          <p className="text-xs text-[#588157]">
            District Authority human adjudication queue for AI-detected discrepancies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 bg-[#FAF3E0] text-[#935D26] rounded-full border border-[#E8DAB2]">
            {alerts.filter(a => a.status === 'New' || a.status === 'Under Review').length} Pending Adjudication
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-[#DDE5D4] shadow-xs flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#588157] uppercase tracking-wider text-[11px]">Alert Type:</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-[#1B3022] text-xs"
          >
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-[#588157] uppercase tracking-wider text-[11px]">Review Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-[#1B3022] text-xs"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="text-[#588157] text-[11px] ml-auto">
          Showing <strong>{filteredAlerts.length}</strong> of {alerts.length} registered alerts
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-2xl border border-[#DDE5D4] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F7] text-[#588157] font-bold uppercase text-[10px] border-b border-[#DDE5D4] tracking-wider">
              <tr>
                <th className="p-3">Alert Ref</th>
                <th className="p-3">Anomaly Type</th>
                <th className="p-3">Associated Project</th>
                <th className="p-3">District & Agency</th>
                <th className="p-3">Detection Observation</th>
                <th className="p-3">Review Status</th>
                <th className="p-3 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2ED]">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#588157]">
                    No alerts match selected criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => {
                  const project = projects.find(p => p.id === alert.projectId);
                  return (
                    <tr key={alert.id} className="hover:bg-[#F8F9F7] transition-colors">
                      <td className="p-3 font-mono font-bold text-[#588157] whitespace-nowrap">
                        {alert.id}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="font-semibold text-[#1B3022]">{alert.alertType}</span>
                        <div className="mt-0.5">
                          <RiskBadge level={alert.riskLevel} />
                        </div>
                      </td>

                      <td className="p-3 max-w-xs">
                        <div
                          onClick={() => project && onSelectProject(project)}
                          className="font-bold text-[#1B3022] hover:text-[#395C40] hover:underline cursor-pointer line-clamp-1"
                        >
                          {alert.projectTitle}
                        </div>
                        <div className="text-[10px] text-[#588157] font-mono">{alert.projectCode}</div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="text-[#1B3022]">{alert.district}</div>
                        <div className="text-[10px] text-[#588157]">{alert.agencyName}</div>
                      </td>

                      <td className="p-3 max-w-sm">
                        <p className="text-[#1B3022] line-clamp-2">{alert.reason}</p>
                        {alert.reviewNotes && (
                          <div className="text-[10px] text-[#395C40] font-medium italic mt-1 bg-[#EAF0E6] p-1.5 rounded-lg border border-[#C8D5B9]">
                            Action Note: {alert.reviewNotes}
                          </div>
                        )}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <AlertBadge status={alert.status} />
                      </td>

                      <td className="p-3 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => onOpenAlertAction(alert)}
                          className="px-3 py-1.5 bg-[#395C40] hover:bg-[#4a7251] text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                        >
                          Investigate & Resolve
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
