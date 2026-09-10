import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Project,
  RiskAlert,
  DashboardSummary,
  CitizenFeedback,
  ProjectStatus,
  AlertStatus
} from '../types/index.js';
import { api } from './api.js';
import {
  normalizeProject,
  normalizeProjects,
  normalizeAlert,
  normalizeAlerts,
  normalizeCitizenFeedback,
  normalizeCitizenFeedbackList,
  normalizeDashboardSummary
} from '../utils/normalization.js';

type DataChangeListener = () => void;

/**
 * Dedicated Data Service Layer
 * Interacts with backend database endpoints, handles asynchronous data retrieval,
 * coordinates persistence to disk/storage, and broadcasts updates to UI subscribers.
 */
class DataService {
  private listeners: Set<DataChangeListener> = new Set();
  private cache: {
    projects: Project[];
    alerts: RiskAlert[];
    summary: DashboardSummary | null;
    feedback: CitizenFeedback[];
    lastFetched: number;
  } = {
    projects: [],
    alerts: [],
    summary: null,
    feedback: [],
    lastFetched: 0
  };

  /**
   * Subscribe to backend data change events
   */
  public subscribe(listener: DataChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all subscribers when persistent data is updated
   */
  public notify(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('[DataService] Error in listener callback:', err);
      }
    });

    // Also dispatch a browser event for multi-component awareness
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mplads:data_updated', { detail: { timestamp: Date.now() } }));
    }
  }

  /**
   * Asynchronously fetch all projects from the backend database
   */
  public async fetchProjects(filters?: {
    status?: string;
    category?: string;
    district?: string;
    riskLevel?: string;
    search?: string;
  }): Promise<{ projects: Project[]; count: number }> {
    const res = await api.getProjects(filters);
    const normalizedProjects = normalizeProjects(res?.projects);
    this.cache.projects = normalizedProjects;
    this.cache.lastFetched = Date.now();
    return { projects: normalizedProjects, count: normalizedProjects.length };
  }

  /**
   * Asynchronously fetch single project by ID from backend database
   */
  public async getProjectById(id: string): Promise<Project | null> {
    const res = await api.getProjectById(id);
    return res.project ? normalizeProject(res.project) : null;
  }

  /**
   * Asynchronously fetch all risk anomaly alerts from the backend database
   */
  public async fetchAlerts(filters?: {
    status?: string;
    riskLevel?: string;
  }): Promise<{ alerts: RiskAlert[]; count: number }> {
    const res = await api.getAlerts(filters);
    const normalizedAlerts = normalizeAlerts(res?.alerts);
    this.cache.alerts = normalizedAlerts;
    this.cache.lastFetched = Date.now();
    return { alerts: normalizedAlerts, count: normalizedAlerts.length };
  }

  /**
   * Asynchronously fetch live dashboard summary metrics from the backend database
   */
  public async fetchSummary(): Promise<DashboardSummary> {
    const summary = await api.getDashboardSummary();
    const normalized = normalizeDashboardSummary(summary);
    this.cache.summary = normalized;
    this.cache.lastFetched = Date.now();
    return normalized;
  }

  /**
   * Asynchronously fetch citizen feedback & grievances from the backend database
   */
  public async fetchFeedback(): Promise<{ feedback: CitizenFeedback[]; count: number }> {
    const res = await api.getCitizenFeedback();
    const normalizedFeedback = normalizeCitizenFeedbackList(res?.feedback);
    this.cache.feedback = normalizedFeedback;
    this.cache.lastFetched = Date.now();
    return { feedback: normalizedFeedback, count: normalizedFeedback.length };
  }

  /**
   * Synchronize all core collections in parallel from the backend database
   */
  public async syncAll(): Promise<{
    projects: Project[];
    alerts: RiskAlert[];
    summary: DashboardSummary | null;
    feedback: CitizenFeedback[];
  }> {
    const [projectsRes, alertsRes, summaryRes, feedbackRes] = await Promise.all([
      this.fetchProjects().catch(err => {
        console.warn('[DataService] Projects fetch fallback:', err);
        return { projects: this.cache.projects, count: this.cache.projects.length };
      }),
      this.fetchAlerts().catch(err => {
        console.warn('[DataService] Alerts fetch fallback:', err);
        return { alerts: this.cache.alerts, count: this.cache.alerts.length };
      }),
      this.fetchSummary().catch(err => {
        console.warn('[DataService] Summary fetch fallback:', err);
        return this.cache.summary;
      }),
      this.fetchFeedback().catch(err => {
        console.warn('[DataService] Feedback fetch fallback:', err);
        return { feedback: this.cache.feedback, count: this.cache.feedback.length };
      })
    ]);

    this.cache = {
      projects: normalizeProjects(projectsRes?.projects),
      alerts: normalizeAlerts(alertsRes?.alerts),
      summary: summaryRes ? normalizeDashboardSummary(summaryRes) : null,
      feedback: normalizeCitizenFeedbackList(feedbackRes?.feedback),
      lastFetched: Date.now()
    };

    return this.cache;
  }

  /**
   * Recommend a new project (MP action) -> persists to backend database
   */
  public async recommendProject(data: {
    title: string;
    category: string;
    description: string;
    locationAddress: string;
    district: string;
    estimatedCost: number;
    latitude: number;
    longitude: number;
  }): Promise<{ success: boolean; project: Project }> {
    const res = await api.recommendProject(data);
    const normalized = normalizeProject(res.project);
    this.notify();
    return { ...res, project: normalized };
  }

  /**
   * Sanction / Update project status (District Authority action) -> persists to backend database
   */
  public async updateProjectStatus(
    projectId: string,
    data: {
      status: ProjectStatus | string;
      sanctionedCost?: number;
      sanctionedAmount?: number;
      sanctionOrderNumber?: string;
      notes?: string;
      remarks?: string;
    }
  ): Promise<{ success: boolean; project: Project }> {
    const res = await api.updateProjectStatus(
      projectId,
      data.status,
      data.sanctionedCost ?? data.sanctionedAmount,
      data.remarks ?? data.notes
    );
    const normalized = normalizeProject(res.project);
    this.notify();
    return { ...res, project: normalized };
  }

  /**
   * Assign implementing agency & contractor -> persists to backend database
   */
  public async assignAgency(
    projectId: string,
    data: {
      agencyId?: string;
      agencyName: string;
      vendorName?: string;
      contractorName?: string;
      startDate?: string;
      expectedCompletionDate?: string;
      targetCompletionDate?: string;
    }
  ): Promise<{ success: boolean; project: Project }> {
    const res = await api.assignAgency(projectId, {
      agencyId: data.agencyId || `AG-${Date.now().toString().slice(-4)}`,
      agencyName: data.agencyName,
      vendorName: data.vendorName || data.contractorName,
      startDate: data.startDate,
      expectedCompletionDate: data.expectedCompletionDate || data.targetCompletionDate
    });
    const normalized = normalizeProject(res.project);
    this.notify();
    return { ...res, project: normalized };
  }

  /**
   * Update project progress & milestones -> persists to backend database
   */
  public async updateProgress(
    projectId: string,
    data: {
      completionPercentage?: number;
      percentage?: number;
      fundsUtilized?: number;
      remarks?: string;
      notes?: string;
      description?: string;
      milestoneTitle?: string;
      photoUrl?: string;
      photoStage?: string;
      photoCaption?: string;
      photoLat?: number;
      photoLon?: number;
    }
  ): Promise<{ success: boolean; project: Project }> {
    const res = await api.updateProgress(projectId, {
      completionPercentage: data.completionPercentage ?? data.percentage,
      fundsUtilized: data.fundsUtilized,
      remarks: data.remarks ?? data.notes ?? data.description ?? data.milestoneTitle,
      photoUrl: data.photoUrl,
      photoStage: data.photoStage,
      photoCaption: data.photoCaption,
      photoLat: data.photoLat,
      photoLon: data.photoLon
    });
    const normalized = normalizeProject(res.project);
    this.notify();
    return { ...res, project: normalized };
  }

  /**
   * Disburse milestone payment from treasury -> persists to backend database
   */
  public async addPayment(
    projectId: string,
    data: {
      amount: number;
      sanctionOrderNo?: string;
      remarks?: string;
    }
  ): Promise<{ success: boolean; payment: any; project: Project }> {
    const res = await api.addPayment(projectId, data);
    const normalized = normalizeProject(res.project);
    this.notify();
    return { ...res, project: normalized };
  }

  /**
   * Adjudicate AI anomaly alert (District Authority vigilance action) -> persists to backend database
   */
  public async actionAlert(
    alertId: string,
    statusOrData:
      | string
      | {
          action?: string;
          status?: AlertStatus | string;
          decision?: AlertStatus | string;
          reviewNotes?: string;
        },
    reviewNotes?: string
  ): Promise<{ success: boolean; alert: RiskAlert }> {
    let finalStatus = 'Under Review';
    let finalNotes = reviewNotes || '';

    if (typeof statusOrData === 'string') {
      finalStatus = statusOrData;
    } else if (statusOrData && typeof statusOrData === 'object') {
      finalStatus = (statusOrData.status || statusOrData.decision || 'Under Review') as string;
      finalNotes = statusOrData.reviewNotes || reviewNotes || '';
    }

    const res = await api.updateAlertStatus(alertId, finalStatus, finalNotes);
    const normalized = normalizeAlert(res.alert);
    this.notify();
    return { ...res, alert: normalized };
  }

  /**
   * Submit citizen grievance / feedback -> persists to backend database
   */
  public async submitCitizenFeedback(data: {
    projectId?: string;
    citizenName: string;
    citizenEmail: string;
    feedbackType: 'Grievance' | 'Appreciation' | 'Suggestion' | 'RTI Request';
    content: string;
    locationAddress?: string;
  }): Promise<{ success: boolean; feedbackId?: string; feedback?: CitizenFeedback }> {
    const res = await api.submitCitizenFeedback(data);
    this.notify();
    return res;
  }

  /**
   * Update citizen feedback resolution status -> persists to backend database
   */
  public async updateCitizenFeedbackStatus(
    id: string,
    status: 'Pending' | 'Under Investigation' | 'Resolved' | 'Dismissed' | string,
    adminNotes?: string
  ): Promise<{ success: boolean }> {
    const res = await api.updateFeedbackStatus(id, status, adminNotes);
    this.notify();
    return res;
  }
}

export const dataService = new DataService();

/**
 * Custom React Hook replacing in-memory arrays with asynchronous calls to the dedicated service layer.
 * Ensures data persistence across application restarts by querying and updating the backend database.
 */
export function useDataService() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [feedbackList, setFeedbackList] = useState<CitizenFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef<boolean>(true);

  const loadData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) {
        setRefreshing(true);
      }
      setError(null);

      const data = await dataService.syncAll();

      if (isMounted.current) {
        setProjects(data.projects);
        setAlerts(data.alerts);
        setSummary(data.summary);
        setFeedbackList(data.feedback);
      }
    } catch (err: any) {
      if (isMounted.current) {
        console.error('[useDataService] Failed to load data from backend database:', err);
        setError(err.message || 'Failed to communicate with persistent database');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    loadData(false);

    // Subscribe to service layer notifications
    const unsubscribe = dataService.subscribe(() => {
      loadData(true);
    });

    // Also listen for browser custom event broadcast
    const handleBrowserEvent = () => {
      loadData(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mplads:data_updated', handleBrowserEvent);
    }

    return () => {
      isMounted.current = false;
      unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('mplads:data_updated', handleBrowserEvent);
      }
    };
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData(false);
  }, [loadData]);

  return {
    projects,
    alerts,
    summary,
    feedbackList,
    loading,
    refreshing,
    error,
    refreshData,
    recommendProject: dataService.recommendProject.bind(dataService),
    updateProjectStatus: dataService.updateProjectStatus.bind(dataService),
    assignAgency: dataService.assignAgency.bind(dataService),
    updateProgress: dataService.updateProgress.bind(dataService),
    addPayment: dataService.addPayment.bind(dataService),
    actionAlert: dataService.actionAlert.bind(dataService),
    submitCitizenFeedback: dataService.submitCitizenFeedback.bind(dataService),
    updateCitizenFeedbackStatus: dataService.updateCitizenFeedbackStatus.bind(dataService),
    getProjectById: dataService.getProjectById.bind(dataService)
  };
}
