import {
  Project,
  RiskAlert,
  CitizenFeedback,
  AuditLogEntry,
  User,
  DashboardSummary
} from '../types/index.js';
import { AuthService, authStorage } from './authService.js';
import { clientMockDb } from './clientMockDb.js';

export { AuthService, authStorage };

const isStaticDeployment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname.endsWith('github.io') ||
    window.location.hostname.includes('githubpreview.dev') ||
    window.location.protocol === 'file:' ||
    (window as any).__FORCE_STATIC_MOCK__ === true
  );
};

async function handleFallbackRoute(url: string, options: RequestInit = {}): Promise<any> {
  const method = (options.method || 'GET').toUpperCase();
  const parsedBody = options.body ? JSON.parse(options.body as string) : {};

  const [path, queryString] = url.split('?');
  const searchParams = new URLSearchParams(queryString || '');

  if (path === '/api/dashboard/summary') {
    return clientMockDb.getDashboardSummary();
  }

  if (path === '/api/projects') {
    return clientMockDb.getProjects({
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
      district: searchParams.get('district') || undefined,
      riskLevel: searchParams.get('riskLevel') || undefined,
      search: searchParams.get('search') || undefined
    });
  }

  if (path === '/api/projects/recommend') {
    return clientMockDb.recommendProject(parsedBody);
  }

  const statusMatch = path.match(/^\/api\/projects\/([^/]+)\/status$/);
  if (statusMatch) {
    return clientMockDb.updateProjectStatus(statusMatch[1], parsedBody);
  }

  const assignMatch = path.match(/^\/api\/projects\/([^/]+)\/assign-agency$/);
  if (assignMatch) {
    return clientMockDb.assignAgency(assignMatch[1], parsedBody);
  }

  const progressMatch = path.match(/^\/api\/projects\/([^/]+)\/progress$/);
  if (progressMatch) {
    return clientMockDb.updateProgress(progressMatch[1], parsedBody);
  }

  const paymentsMatch = path.match(/^\/api\/projects\/([^/]+)\/payments$/);
  if (paymentsMatch) {
    return clientMockDb.addPayment(paymentsMatch[1], parsedBody);
  }

  const projectDetailMatch = path.match(/^\/api\/projects\/([^/]+)$/);
  if (projectDetailMatch) {
    const prj = await clientMockDb.getProjectById(projectDetailMatch[1]);
    return { project: prj, duplicateCandidates: [] };
  }

  if (path === '/api/alerts') {
    return clientMockDb.getAlerts({
      status: searchParams.get('status') || undefined,
      riskLevel: searchParams.get('riskLevel') || undefined
    });
  }

  const alertActionMatch = path.match(/^\/api\/alerts\/([^/]+)\/action$/);
  if (alertActionMatch) {
    return clientMockDb.actionAlert(alertActionMatch[1], parsedBody);
  }

  if (path === '/api/citizen-feedback') {
    if (method === 'POST') {
      return clientMockDb.submitCitizenFeedback(parsedBody);
    }
    return clientMockDb.getCitizenFeedback();
  }

  const feedbackStatusMatch = path.match(/^\/api\/citizen-feedback\/([^/]+)\/status$/);
  if (feedbackStatusMatch) {
    return clientMockDb.updateFeedbackStatus(feedbackStatusMatch[1], parsedBody.status, parsedBody.adminNotes);
  }

  if (path === '/api/audit-logs') {
    const logsData = await clientMockDb.getAuditLogs();
    return { auditLogs: logsData.logs, count: logsData.count };
  }

  const aiReportMatch = path.match(/^\/api\/ai\/audit-report\/([^/]+)$/);
  if (aiReportMatch) {
    return clientMockDb.generateAiAuditReport(aiReportMatch[1]);
  }

  if (path === '/api/public/summary') {
    return clientMockDb.getPublicSummary();
  }

  if (path === '/api/public/projects') {
    return clientMockDb.getPublicProjects();
  }

  if (path === '/api/analytics/vendors') {
    return {
      vendors: [
        { name: 'Surya Infra Projects Ltd', panMasked: 'AABC****9F', activeWorks: 3, riskIndex: 'LOW' },
        { name: 'Deccan Civil Works', panMasked: 'ABCP****1K', activeWorks: 4, riskIndex: 'MEDIUM' },
        { name: 'Kakatiya Engineering Solutions', panMasked: 'BLRP****4Z', activeWorks: 2, riskIndex: 'HIGH' }
      ]
    };
  }

  throw new Error(`Endpoint ${url} not found`);
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // If explicitly hosted on GitHub Pages or static host, handle via client fallback directly
  if (isStaticDeployment()) {
    return handleFallbackRoute(url, options);
  }

  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  // Do not send old token when attempting to log in
  if (token && !url.includes('/api/auth/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      if (response.status === 404 || response.status === 502 || response.status === 503) {
        // Fall back to client mock store
        return await handleFallbackRoute(url, options);
      }
      if (response.status === 401 && !url.includes('/api/auth/login')) {
        authStorage.removeToken();
      }
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    return response.json();
  } catch (err: any) {
    // If network error (backend unreachable), attempt client mock fallback
    try {
      return await handleFallbackRoute(url, options);
    } catch {
      throw err;
    }
  }
}

export const api = {
  // Auth
  login: AuthService.login,
  getMe: AuthService.getMe,
  logout: AuthService.logout,

  // Dashboard
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    return fetchWithAuth('/api/dashboard/summary');
  },

  // Projects
  getProjects: async (filters?: {
    status?: string;
    category?: string;
    district?: string;
    riskLevel?: string;
    search?: string;
  }): Promise<{ projects: Project[]; count: number }> => {
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
    return fetchWithAuth(`/api/projects/${id}`);
  },

  recommendProject: async (projectData: Partial<Project>): Promise<{ success: boolean; project: Project }> => {
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
    return fetchWithAuth(`/api/projects/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  addPayment: async (
    id: string,
    data: { amount: number; sanctionOrderNo?: string; remarks?: string }
  ): Promise<{ success: boolean; payment: any; project: Project }> => {
    return fetchWithAuth(`/api/projects/${id}/payments`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Alerts
  getAlerts: async (): Promise<{ alerts: RiskAlert[]; count: number }> => {
    return fetchWithAuth('/api/alerts');
  },

  updateAlertStatus: async (
    id: string,
    status: string,
    reviewNotes?: string
  ): Promise<{ success: boolean; alert: RiskAlert }> => {
    return fetchWithAuth(`/api/alerts/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ status, reviewNotes })
    });
  },

  // Vendors
  getVendors: async (): Promise<{ vendors: any[] }> => {
    return fetchWithAuth('/api/analytics/vendors');
  },

  // Citizen Feedback
  getCitizenFeedback: async (): Promise<{ feedback: CitizenFeedback[]; count: number }> => {
    return fetchWithAuth('/api/citizen-feedback');
  },

  submitCitizenFeedback: async (data: any): Promise<{ success: boolean; feedbackId: string }> => {
    return fetchWithAuth('/api/citizen-feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  updateFeedbackStatus: async (id: string, status: string, adminNotes?: string): Promise<{ success: boolean }> => {
    return fetchWithAuth(`/api/citizen-feedback/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, adminNotes })
    });
  },

  // Audit Logs
  getAuditLogs: async (): Promise<{ auditLogs: AuditLogEntry[]; count: number }> => {
    return fetchWithAuth('/api/audit-logs');
  },

  // AI Report (Gemini API / Heuristic)
  generateAiAuditReport: async (projectId: string): Promise<{ report: string; projectCode: string; title: string }> => {
    return fetchWithAuth(`/api/ai/audit-report/${projectId}`, {
      method: 'POST'
    });
  },

  // Public Transparency
  getPublicSummary: async (): Promise<any> => {
    return fetchWithAuth('/api/public/summary');
  },

  getPublicProjects: async (): Promise<{ projects: Project[]; count: number }> => {
    return fetchWithAuth('/api/public/projects');
  }
};
