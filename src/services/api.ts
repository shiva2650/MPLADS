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

  if (path === '/api/audit-logs/verify') {
    return {
      isValid: true,
      verifiedCount: 12,
      algorithm: 'SHA-256 Hash Chain',
      genesisHash: 'GENESIS_MPLADS_AUDIT_BLOCK_000000',
      verifiedAt: new Date().toISOString()
    };
  }

  if (path === '/api/audit-logs') {
    const logsData = await clientMockDb.getAuditLogs();
    return { auditLogs: logsData.logs, count: logsData.count };
  }

  if (path === '/api/evidence/verify') {
    return {
      success: true,
      verification: {
        integrityScore: 92,
        isApproved: true,
        requiresManualReview: false,
        flags: [],
        exifData: {
          hasExif: true,
          latitude: 17.4125,
          longitude: 78.4912,
          timestamp: new Date().toISOString(),
          cameraMake: 'Samsung',
          cameraModel: 'SM-G998B',
          isStrippedOrMissing: false
        },
        perceptualHash: {
          aHash: 'f0e1d2c3b4a59687',
          dHash: '1a2b3c4d5e6f7a8b'
        },
        tamperAnalysis: {
          isTampered: false,
          elaVariance: 1.8,
          noiseInconsistencyScore: 4.2
        },
        gpsVerification: {
          distanceFromSiteMeters: 42,
          isWithinThreshold: true,
          isSpoofedPattern: false,
          isWithinConstituency: true
        },
        contentVerification: {
          categoryMatches: true,
          detectedInfrastructureType: 'Civil Construction',
          isAiGenerated: false,
          aiConfidence: 94,
          analysisNotes: 'Authentic site progression photo matching reported stage.'
        }
      }
    };
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

  const satMatch = path.match(/^\/api\/satellite\/([^/]+)$/);
  if (satMatch) {
    const prj = await clientMockDb.getProjectById(satMatch[1]);
    const lat = prj?.latitude ?? 17.4120;
    const lon = prj?.longitude ?? 78.4982;
    const isAnomaly = prj?.riskAnalysis?.overallScore ? prj.riskAnalysis.overallScore > 65 : false;
    return {
      observation: {
        observationId: `SAT-FALLBACK-${Date.now().toString().slice(-4)}`,
        projectId: satMatch[1],
        coordinates: { latitude: lat, longitude: lon },
        projectCoordinates: { latitude: lat, longitude: lon },
        baselineDate: prj?.sanctionDate || '2023-11-01',
        evaluationDate: prj?.actualCompletionDate || '2024-11-15',
        cloudCoveragePct: 3.2,
        cloudCoverPercentage: 3.2,
        cloudFreeDateUsed: '2024-11-15',
        resolutionMetersPerPixel: 10.0,
        resolutionMeters: 10.0,
        isResolutionSufficient: true,
        resolutionNotes: 'Resolution viable for Sentinel-2 optical analysis.',
        category: prj?.category || 'Community Infrastructure',
        analysisType: 'STRUCTURAL_EDGE',
        structuralChangePct: isAnomaly ? 5.2 : 68.4,
        structuralEdgeScore: isAnomaly ? 0.052 : 0.684,
        spectralDiffIndex: isAnomaly ? 7.1 : 71.0,
        ssimChangeScore: isAnomaly ? 0.06 : 0.60,
        physicalConfidenceScore: isAnomaly ? 14 : 92,
        confidenceScore: isAnomaly ? 0.14 : 0.92,
        detectedFootprintM2: 850,
        verdict: isAnomaly ? 'ANOMALY_DETECTED' : 'VERIFIED',
        verdictReason: isAnomaly
          ? 'Zero Physical Development Detected: Sentinel-2 multi-temporal diff registers only 5.2% structural edge variance.'
          : 'Physical Construction Confirmed: Sentinel-2 temporal diff confirms 68.4% geometric edge alignment with sanctioned plan.',
        thresholdExplanations: {
          resolutionThreshold: 'Sentinel-2 MSI 10m/pixel spatial resolution.',
          changeThreshold: 'Structural edge delta > 25% confirms physical construction.',
          cloudMaskRule: 'Reflectance scenes with > 20% cloud cover masked.'
        },
        beforeImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="340" height="240" viewBox="0 0 340 240"><rect width="340" height="240" fill="%232c3e2e"/><circle cx="170" cy="120" r="40" fill="%23455a47"/><text x="170" y="125" font-size="12" fill="white" text-anchor="middle">Baseline Pass (T0)</text></svg>',
        afterImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="340" height="240" viewBox="0 0 340 240"><rect width="340" height="240" fill="%231e2b20"/><rect x="130" y="80" width="80" height="80" fill="%23a3b18a"/><text x="170" y="125" font-size="12" fill="%231b3022" font-weight="bold" text-anchor="middle">Completion Pass (T1)</text></svg>',
        diffHeatmapUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="340" height="240" viewBox="0 0 340 240"><rect width="340" height="240" fill="%23111812"/><circle cx="170" cy="120" r="60" fill="%23e07a5f" opacity="0.6"/><text x="170" y="125" font-size="12" fill="white" text-anchor="middle">Feature Change Mask</text></svg>',
        baselinePass: {
          date: prj?.sanctionDate || '2023-11-01',
          imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="340" height="240" viewBox="0 0 340 240"><rect width="340" height="240" fill="%232c3e2e"/><circle cx="170" cy="120" r="40" fill="%23455a47"/><text x="170" y="125" font-size="12" fill="white" text-anchor="middle">Baseline Pass (T0)</text></svg>'
        },
        targetPass: {
          date: prj?.actualCompletionDate || '2024-11-15',
          imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="340" height="240" viewBox="0 0 340 240"><rect width="340" height="240" fill="%231e2b20"/><rect x="130" y="80" width="80" height="80" fill="%23a3b18a"/><text x="170" y="125" font-size="12" fill="%231b3022" font-weight="bold" text-anchor="middle">Completion Pass (T1)</text></svg>'
        },
        evaluatedAt: new Date().toISOString()
      }
    };
  }

  const satVerifyMatch = path.match(/^\/api\/satellite\/verify\/([^/]+)$/);
  if (satVerifyMatch) {
    const res = await handleFallbackRoute(`/api/satellite/${satVerifyMatch[1]}`);
    return { success: true, ...res };
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

  verifyAuditLogsIntegrity: async (): Promise<{
    isValid: boolean;
    verifiedCount: number;
    brokenAtId?: string;
    algorithm: string;
    genesisHash: string;
    verifiedAt: string;
  }> => {
    return fetchWithAuth('/api/audit-logs/verify');
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
    return fetchWithAuth('/api/evidence/verify', {
      method: 'POST',
      body: JSON.stringify(data)
    });
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
  },

  // Satellite Imagery Cross-Verification
  getSatelliteObservation: async (projectId: string): Promise<{ observation: any }> => {
    return fetchWithAuth(`/api/satellite/${projectId}`);
  },

  verifySatellite: async (projectId: string, options?: { targetDate?: string; overrideFootprintM2?: number }): Promise<{ success: boolean; observation: any }> => {
    return fetchWithAuth(`/api/satellite/verify/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(options || {})
    });
  },

  // Contractor Network Fraud Analysis
  getContractorNetwork: async (): Promise<any> => {
    return fetchWithAuth('/api/network/contractors');
  },

  // Multilingual RAG Citizen Chatbot
  queryChatbot: async (query: string): Promise<any> => {
    return fetchWithAuth('/api/chat/query', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  },

  // NLP Feedback Intelligence
  analyzeGrievanceFeedback: async (data: { feedbackId?: string; subject: string; description: string; projectId?: string }): Promise<any> => {
    return fetchWithAuth('/api/nlp/analyze-feedback', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Hackathon Live Security Demo
  simulateTamper: async (): Promise<any> => {
    return fetchWithAuth('/api/audit-logs/simulate-tamper', { method: 'POST' });
  },

  restoreAuditLogs: async (): Promise<any> => {
    return fetchWithAuth('/api/audit-logs/restore', { method: 'POST' });
  },

  // Data Ingestion & Impact Calculator
  getImpactSummary: async (): Promise<any> => {
    return fetchWithAuth('/api/impact/summary');
  },

  ingestData: async (csvContent: string, sourceLabel?: string): Promise<any> => {
    return fetchWithAuth('/api/data/ingest', {
      method: 'POST',
      body: JSON.stringify({ csvContent, sourceLabel: sourceLabel || 'eSAKSHI Public Data Export' })
    });
  }
};
