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
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

interface AlertManagementPageProps {
  alerts: RiskAlert[];
  projects: Project[];
  onOpenAlertAction: (alert: RiskAlert) => void;
  onSelectProject: (project: Project) => void;
  onBackToDashboard?: () => void;
}

export const AlertManagementPage: React.FC<AlertManagementPageProps> = ({
  alerts,
  projects,
  onOpenAlertAction,
  onSelectProject,
  onBackToDashboard
}) => {
  const { language, t, translateAlertType, translateAlertStatus } = useLanguage();
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredAlerts = alerts.filter(a => {
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchType = typeFilter === 'All' || a.alertType === typeFilter;
    return matchStatus && matchType;
  });

  const types = ['All', 'Cost Anomaly', 'Possible Duplicate', 'Photo Anomaly', 'Location Mismatch', 'Delay Risk'];
  const statuses = ['All', 'New', 'Under Review', 'Escalated', 'Resolved', 'False Positive'];

  const pendingCount = alerts.filter(a => a.status === 'New' || a.status === 'Under Review').length;

  return (
    <div className="space-y-4">
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
            {t.home} &gt; {t.alerts}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-body tracking-tight">
            {t.alertsPageTitle}
          </h1>
          <p className="text-xs text-slate-muted">
            {t.alertsPageSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 bg-panel-bg text-status-review rounded-full border border-status-review/30">
            {pendingCount} {t.pendingAdjudicationText}
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-slate-border shadow-xs flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-muted uppercase tracking-wider text-[11px]">{t.filterByType}:</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-panel-bg border border-slate-border rounded-lg text-slate-body text-xs"
          >
            {types.map(item => (
              <option key={item} value={item}>
                {item === 'All' ? t.allTypes : translateAlertType(item)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-muted uppercase tracking-wider text-[11px]">{t.filterByStatus}:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-panel-bg border border-slate-border rounded-lg text-slate-body text-xs"
          >
            {statuses.map(item => (
              <option key={item} value={item}>
                {item === 'All' ? t.allStatuses : translateAlertStatus(item)}
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-muted text-[11px] ml-auto">
          {t('registeredAlertsCount', { filtered: filteredAlerts.length, total: alerts.length })}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-2xl border border-slate-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-panel-bg text-slate-muted font-bold uppercase text-[10px] border-b border-slate-border tracking-wider">
              <tr>
                <th className="p-3">{t.alertRefHeader}</th>
                <th className="p-3">{t.anomalyTypeHeader}</th>
                <th className="p-3">{t.associatedProjectHeader}</th>
                <th className="p-3">{t.districtAgencyHeader}</th>
                <th className="p-3">{t.detectionObservationHeader}</th>
                <th className="p-3">{t.reviewStatusHeader}</th>
                <th className="p-3 text-right">{t.administrativeActionHeader}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-border">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-muted">
                    {t.noAlertsMatchCriteria}
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => {
                  const project = projects.find(p => p.id === alert.projectId);
                  return (
                    <tr key={alert.id} className="hover:bg-panel-bg transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-muted whitespace-nowrap">
                        {alert.id}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-body">{translateAlertType(alert.alertType)}</span>
                        <div className="mt-0.5">
                          <RiskBadge level={alert.riskLevel} />
                        </div>
                      </td>

                      <td className="p-3 max-w-xs">
                        <div
                          onClick={() => project && onSelectProject(project)}
                          className="font-bold text-slate-body hover:text-govt-navy hover:underline cursor-pointer line-clamp-1"
                        >
                          {alert.projectTitle}
                        </div>
                        <div className="text-[10px] text-slate-muted font-mono">{alert.projectCode}</div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="text-slate-body">{alert.district}</div>
                        <div className="text-[10px] text-slate-muted">{alert.agencyName}</div>
                      </td>

                      <td className="p-3 max-w-sm">
                        <p className="text-slate-body line-clamp-2">{alert.reason}</p>
                        {alert.reviewNotes && (
                          <div className="text-[10px] text-govt-navy font-medium italic mt-1 bg-panel-bg p-1.5 rounded-lg border border-slate-border">
                            {language === 'hi' ? 'कार्रवाई टिप्पणी:' : 'Action Note:'} {alert.reviewNotes}
                          </div>
                        )}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <AlertBadge status={alert.status} />
                      </td>

                      <td className="p-3 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => onOpenAlertAction(alert)}
                          className="px-3 py-1.5 bg-govt-navy hover:bg-govt-navy-light text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                        >
                          {t.investigateAndResolve}
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
