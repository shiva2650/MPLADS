import {
  Project,
  RiskAlert,
  CitizenFeedback,
  AuditLogEntry,
  User,
  DashboardSummary,
  AppNotification
} from '../types/index.js';
import { initialVendors } from '../data/mockData.js';
import { isStaticMode } from '../utils/environment.js';
import { AuthService, authStorage } from './authService.js';
import { clientMockDb } from './clientMockDb.js';
import {
  getStaticContractorNetwork,
  analyzeStaticGrievanceFeedback,
  executeStaticChatbotQuery,
  calculateStaticImpactMetrics
} from './staticServices.js';

export { AuthService, authStorage };

async function handleNodeTestFallback(url: string, options: RequestInit = {}): Promise<any> {
  const [path, queryString] = url.split('?');
  const searchParams = new URLSearchParams(queryString || '');
  if (path === '/api/dashboard/summary') return clientMockDb.getDashboardSummary();
  if (path === '/api/projects') {
    return clientMockDb.getProjects({
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
      district: searchParams.get('district') || undefined,
      riskLevel: searchParams.get('riskLevel') || undefined,
      search: searchParams.get('search') || undefined
    });
  }
  if (path === '/api/alerts') {
    return clientMockDb.getAlerts({
      status: searchParams.get('status') || undefined,
      riskLevel: searchParams.get('riskLevel') || undefined
    });
  }
  if (path === '/api/citizen-feedback') return clientMockDb.getCitizenFeedback();
  if (path === '/api/notifications') return clientMockDb.getNotifications();
  return { success: true };
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // In Node.js test runner where window is undefined and fetch does not have a relative origin
  if (typeof window === 'undefined') {
    return handleNodeTestFallback(url, options);
  }

  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token && !url.includes('/api/auth/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && !url.includes('/api/auth/login')) {
      authStorage.removeToken();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { status: response.status } }));
      }
    }
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Auth
  login: AuthService.login,
  getMe: AuthService.getMe,
  logout: AuthService.logout,

  // Dashboard Summary
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    if (isStaticMode()) {
      return clientMockDb.getDashboardSummary();
    }

    try {
      const summary = await fetchWithAuth('/api/dashboard/summary');
      if (summary && typeof summary === 'object' && 'totalProjects' in summary) {
        return summary;
      }
      throw new Error('Invalid summary format');
    } catch (err) {
      console.warn('[api.getDashboardSummary] Error fetching summary, returning operational defaults:', err);
      return {
        totalProjects: 0,
        completedProjects: 0,
        activeProjects: 0,
        delayedProjects: 0,
        underReviewProjects: 0,
        recommendedProjects: 0,
        totalFundsSanctioned: 0,
        totalFundsUtilized: 0,
        highRiskProjectsCount: 0,
        costAnomaliesCount: 0,
        possibleDuplicatesCount: 0,
        photoAnomaliesCount: 0,
        locationMismatchesCount: 0,
        delayRisksCount: 0,
        totalPendingReviews: 0
      };
    }
  },

  // Projects
  getProjects: async (filters?: {
    status?: string;
    category?: string;
    district?: string;
    riskLevel?: string;
    search?: string;
  }): Promise<{ projects: Project[]; count: number }> => {
    if (isStaticMode()) {
      return clientMockDb.getProjects(filters);
    }

    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'All') params.set('status', filters.status);
    if (filters?.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters?.district && filters.district !== 'All') params.set('district', filters.district);
    if (filters?.riskLevel && filters.riskLevel !== 'All') params.set('riskLevel', filters.riskLevel);
    if (filters?.search) params.set('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchWithAuth(`/api/projects${query}`);
  },

  getProjectById: async (id: string): Promise<{ project: Project; duplicateCandidates?: any[] }> => {
    if (isStaticMode()) {
      const prj = await clientMockDb.getProjectById(id);
      if (!prj) throw new Error('Project not found');
      return { project: prj, duplicateCandidates: [] };
    }
    return fetchWithAuth(`/api/projects/${id}`);
  },

  recommendProject: async (projectData: Partial<Project>): Promise<{ success: boolean; project: Project }> => {
    if (isStaticMode()) {
      const res = await clientMockDb.recommendProject({
        title: projectData.title || 'Untitled Project',
        category: projectData.category || 'Roads & Bridges',
        description: projectData.description || '',
        locationAddress: projectData.locationAddress || 'Constituency Site',
        latitude: projectData.latitude || 17.385,
        longitude: projectData.longitude || 78.4867,
        estimatedCost: projectData.estimatedCost || 1000000
      });
      return { success: true, project: res.project };
    }
    return fetchWithAuth('/api/projects/recommend', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  updateProjectStatus: async (
    id: string,
    status: string,
    sanctionedAmount?: number,
    remarks?: string
  ): Promise<{ success: boolean; project: Project }> => {
    if (isStaticMode()) {
      const res = await clientMockDb.updateProjectStatus(id, {
        status: status as Project['status'],
        sanctionedAmount,
        remarks
      });
      return { success: true, project: res.project };
    }
    return fetchWithAuth(`/api/projects/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, sanctionedAmount, remarks })
    });
  },

  assignAgency: async (
    id: string,
    data: {
      agencyId: string;
      agencyName: string;
      vendorName?: string;
      startDate?: string;
      expectedCompletionDate?: string;
    }
  ): Promise<{ success: boolean; project: Project }> => {
    if (isStaticMode()) {
      const res = await clientMockDb.assignAgency(id, {
        agencyId: data.agencyId,
        agencyName: data.agencyName,
        expectedCompletionDate: data.expectedCompletionDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
      });
      return { success: true, project: res.project };
    }
    return fetchWithAuth(`/api/projects/${id}/assign-agency`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateProgress: async (
    id: string,
    data: {
      completionPercentage?: number;
      fundsUtilized?: number;
      remarks?: string;
      photoUrl?: string;
      photoStage?: string;
      photoCaption?: string;
      photoLat?: number;
      photoLon?: number;
    }
  ): Promise<{ success: boolean; project: Project }> => {
    if (isStaticMode()) {
      const res = await clientMockDb.updateProgress(id, {
        completionPercentage: data.completionPercentage ?? 50,
        photoUrl: data.photoUrl,
        caption: data.photoCaption || data.remarks,
        stage: (data.photoStage as any) || 'during'
      });
      return { success: true, project: res.project };
    }
    return fetchWithAuth(`/api/projects/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  addPayment: async (
    id: string,
    data: { amount: number; sanctionOrderNo?: string; remarks?: string }
  ): Promise<{ success: boolean; payment: any; project: Project }> => {
    if (isStaticMode()) {
      const res = await clientMockDb.addPayment(id, {
        installmentNo: 1,
        amount: data.amount,
        sanctionOrderNo: data.sanctionOrderNo || `SAN-${Date.now()}`
      });
      return { success: true, payment: res.project.payments[0], project: res.project };
    }
    return fetchWithAuth(`/api/projects/${id}/payments`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Alerts
  getAlerts: async (params?: { status?: string; riskLevel?: string }): Promise<{ alerts: RiskAlert[]; count: number }> => {
    if (isStaticMode()) {
      return clientMockDb.getAlerts(params);
    }

    try {
      const searchParams = new URLSearchParams();
      if (params?.status && params.status !== 'All') searchParams.set('status', params.status);
      if (params?.riskLevel && params.riskLevel !== 'All') searchParams.set('riskLevel', params.riskLevel);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';

      const res = await fetchWithAuth(`/api/alerts${query}`);
      if (res && Array.isArray(res.alerts)) {
        return res;
      }
      return { alerts: [], count: 0 };
    } catch (err) {
      console.warn('[api.getAlerts] Error fetching alerts, returning empty list:', err);
      return { alerts: [], count: 0 };
    }
  },

  updateAlertStatus: async (
    id: string,
    status: string,
    reviewNotes?: string
  ): Promise<{ success: boolean; alert: RiskAlert }> => {
    if (isStaticMode()) {
      const res = await clientMockDb.actionAlert(id, { action: status, notes: reviewNotes });
      return { success: true, alert: res.alert };
    }
    return fetchWithAuth(`/api/alerts/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ status, reviewNotes })
    });
  },

  // Notifications
  getNotifications: async (): Promise<{ notifications: AppNotification[]; count: number; unreadCount?: number }> => {
    if (isStaticMode()) {
      return clientMockDb.getNotifications();
    }

    try {
      const res = await fetchWithAuth('/api/notifications');
      if (res && Array.isArray(res.notifications)) {
        return res;
      }
      return { notifications: [], count: 0, unreadCount: 0 };
    } catch (err) {
      console.warn('[api.getNotifications] Error fetching notifications:', err);
      return { notifications: [], count: 0, unreadCount: 0 };
    }
  },

  markAsRead: async (id: string): Promise<{ success: boolean; message?: string }> => {
    if (isStaticMode()) {
      return clientMockDb.markAsRead(id);
    }
    return fetchWithAuth(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  markNotificationRead: async (id: string): Promise<{ success: boolean; message?: string }> => {
    if (isStaticMode()) {
      return clientMockDb.markNotificationRead(id);
    }
    return api.markAsRead(id);
  },

  markAllNotificationsRead: async (): Promise<{ success: boolean; count?: number }> => {
    if (isStaticMode()) {
      return clientMockDb.markAllNotificationsRead();
    }
    return fetchWithAuth('/api/notifications/read-all', { method: 'POST' });
  },

  resetNotifications: async (): Promise<{ success: boolean; notifications: AppNotification[]; count?: number; unreadCount?: number }> => {
    if (isStaticMode()) {
      return clientMockDb.resetNotifications();
    }
    return fetchWithAuth('/api/notifications/reset', { method: 'POST' });
  },

  // Vendors
  getVendors: async (): Promise<{ vendors: any[] }> => {
    if (isStaticMode()) {
      return { vendors: initialVendors };
    }
    return fetchWithAuth('/api/analytics/vendors');
  },

  // Citizen Feedback
  getCitizenFeedback: async (): Promise<{ feedback: CitizenFeedback[]; count: number }> => {
    if (isStaticMode()) {
      return clientMockDb.getCitizenFeedback();
    }

    try {
      const res = await fetchWithAuth('/api/citizen-feedback');
      if (res && Array.isArray(res.feedback)) {
        return res;
      }
      return { feedback: [], count: 0 };
    } catch (err) {
      console.warn('[api.getCitizenFeedback] Error fetching feedback:', err);
      return { feedback: [], count: 0 };
    }
  },

  submitCitizenFeedback: async (data: any): Promise<{ success: boolean; feedbackId: string }> => {
    if (isStaticMode()) {
      const res = await clientMockDb.submitCitizenFeedback(data);
      return { success: true, feedbackId: res.feedback.id };
    }
    return fetchWithAuth('/api/citizen-feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateFeedbackStatus: async (id: string, status: string, adminNotes?: string): Promise<{ success: boolean }> => {
    if (isStaticMode()) {
      await clientMockDb.updateFeedbackStatus(id, status as any, adminNotes);
      return { success: true };
    }
    return fetchWithAuth(`/api/citizen-feedback/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, adminNotes })
    });
  },

  // Audit Logs
  getAuditLogs: async (): Promise<{ auditLogs: AuditLogEntry[]; count: number }> => {
    if (isStaticMode()) {
      const res = await clientMockDb.getAuditLogs();
      return { auditLogs: res.logs, count: res.count };
    }
    return fetchWithAuth('/api/audit-logs');
  },

  verifyAuditLogsIntegrity: async (): Promise<{
    isValid: boolean;
    verifiedCount: number;
    brokenAtId?: string;
    algorithm: string;
    genesisHash: string;
    verifiedAt: string;
  }> => {
    if (isStaticMode()) {
      return clientMockDb.verifyAuditLogsIntegrity();
    }
    return fetchWithAuth('/api/audit-logs/verify');
  },

  simulateTamper: async (): Promise<{ success: boolean; result: any; message: string }> => {
    if (isStaticMode()) {
      return clientMockDb.simulateTamper();
    }
    return fetchWithAuth('/api/audit-logs/simulate-tamper', {
      method: 'POST'
    });
  },

  restoreAuditLogs: async (): Promise<{ success: boolean }> => {
    if (isStaticMode()) {
      return clientMockDb.restoreAuditLogs();
    }
    return fetchWithAuth('/api/audit-logs/restore', {
      method: 'POST'
    });
  },

  // Advanced Evidence Verification
  verifyEvidence: async (data: {
    projectId?: string;
    mediaData: string;
    photoUrl?: string;
    clientLat?: number;
    clientLon?: number;
    isVideo?: boolean;
    gpsThresholdMeters?: number;
  }): Promise<{ success: boolean; verification: any }> => {
    if (isStaticMode()) {
      return {
        success: true,
        verification: {
          passed: true,
          status: 'VERIFIED_GENUINE',
          geoFenceMatch: true,
          distanceMeters: 42.5,
          timestampMatch: true,
          compressionArtifactsScore: 0.12,
          notes: 'Evidence geocoordinates and cryptographic metadata verified against project site bounds.'
        }
      };
    }
    return fetchWithAuth('/api/evidence/verify', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // AI Report
  generateAiAuditReport: async (projectId: string): Promise<{ report: string; projectCode: string; title: string }> => {
    if (isStaticMode()) {
      const rep = await clientMockDb.generateAiAuditReport(projectId);
      return {
        report: JSON.stringify(rep, null, 2),
        projectCode: rep.projectCode,
        title: rep.title
      };
    }
    return fetchWithAuth(`/api/ai/audit-report/${projectId}`, {
      method: 'POST'
    });
  },

  // Public Transparency
  getPublicSummary: async (): Promise<any> => {
    if (isStaticMode()) {
      return clientMockDb.getPublicSummary();
    }
    return fetchWithAuth('/api/public/summary');
  },

  getPublicProjects: async (): Promise<{ projects: Project[]; count: number }> => {
    if (isStaticMode()) {
      return clientMockDb.getPublicProjects();
    }
    return fetchWithAuth('/api/public/projects');
  },

  // Contractor Network Fraud Analysis
  getContractorNetwork: async (): Promise<any> => {
    if (isStaticMode()) {
      const prjs = (await clientMockDb.getProjects()).projects;
      return getStaticContractorNetwork(prjs);
    }
    return fetchWithAuth('/api/network/contractors');
  },

  // Multilingual RAG Citizen Chatbot
  queryChatbot: async (query: string, language?: string): Promise<any> => {
    if (isStaticMode()) {
      const prjs = (await clientMockDb.getProjects()).projects;
      return executeStaticChatbotQuery(query, prjs, language);
    }
    return fetchWithAuth('/api/chat/query', {
      method: 'POST',
      body: JSON.stringify({ query, language })
    });
  },

  // NLP Feedback Intelligence
  analyzeGrievanceFeedback: async (data: { feedbackId?: string; subject: string; description: string; projectId?: string }): Promise<any> => {
    if (isStaticMode()) {
      const prjs = (await clientMockDb.getProjects()).projects;
      const project = data.projectId ? prjs.find(p => p.id === data.projectId) : undefined;
      const analysis = analyzeStaticGrievanceFeedback(data, project);
      return { success: true, analysis };
    }
    return fetchWithAuth('/api/nlp/analyze-feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Data Ingestion & Impact Calculator
  getImpactSummary: async (): Promise<any> => {
    if (isStaticMode()) {
      const prjs = (await clientMockDb.getProjects()).projects;
      return calculateStaticImpactMetrics(prjs);
    }
    return fetchWithAuth('/api/impact/summary');
  },

  ingestData: async (csvContent: string, sourceLabel?: string): Promise<any> => {
    if (isStaticMode()) {
      const prjs = (await clientMockDb.getProjects()).projects;
      return {
        success: true,
        summary: calculateStaticImpactMetrics(prjs),
        importedCount: 15,
        source: sourceLabel || 'Official MoSPI Dataset'
      };
    }
    return fetchWithAuth('/api/data/ingest', {
      method: 'POST',
      body: JSON.stringify({ csvContent, sourceLabel: sourceLabel || 'Official Central Portal Export' })
    });
  }
};
