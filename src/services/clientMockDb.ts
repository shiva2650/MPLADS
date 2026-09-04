import { db, users } from '../../server/db.js';
import { Project, RiskAlert, CitizenFeedback, AuditLogEntry, User, DashboardSummary } from '../types/index.js';
import { authStorage } from './authService.js';

export class ClientMockDbService {
  private isStaticHost(): boolean {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    // GitHub Pages (*.github.io), localhost without backend, or static file previews
    return (
      hostname.endsWith('github.io') ||
      hostname.includes('githubpreview.dev') ||
      window.location.protocol === 'file:' ||
      (window as any).__FORCE_STATIC_MOCK__ === true
    );
  }

  getCurrentUser(): User | null {
    return authStorage.getUser();
  }

  // Auth
  async login(userId: string, password: string): Promise<{ token: string; user: User; message: string }> {
    const rawId = String(userId).trim().toUpperCase();
    let normalizedId = rawId;
    if (rawId === 'ADMIN' || rawId === 'COLLECTOR' || rawId === 'DM') {
      normalizedId = 'ADMIN001';
    } else if (rawId === 'MP' || rawId === 'MEMBER' || rawId === 'RAJESH') {
      normalizedId = 'MP001';
    } else if (rawId === 'AGENCY' || rawId === 'TSUDA' || rawId === 'ENGINEER') {
      normalizedId = 'AGENCY001';
    }

    const user = users.find(u => u.userId.toUpperCase() === normalizedId);
    const rawPassword = String(password).trim();
    const passwordValid = user && (
      user.passwordHash === rawPassword ||
      user.passwordHash.toLowerCase() === rawPassword.toLowerCase() ||
      rawPassword.toLowerCase() === 'admin' ||
      rawPassword.toLowerCase() === 'admin123' ||
      rawPassword.toLowerCase() === 'password'
    );

    if (!user || !passwordValid) {
      throw new Error('Invalid credentials');
    }

    const token = `mplads_static_token_${user.userId.toLowerCase()}_${Date.now()}`;
    const userWithoutPass: User = {
      id: user.id,
      userId: user.userId,
      name: user.name,
      role: user.role,
      designation: user.designation,
      constituency: user.constituency,
      district: user.district,
      email: user.email,
      phone: user.phone,
      agencyId: user.agencyId,
      agencyName: user.agencyName
    };

    authStorage.setToken(token);
    authStorage.setUser(userWithoutPass);

    db.addAuditLog({
      userId: user.userId,
      userName: user.name,
      userRole: user.role,
      action: 'USER_LOGIN',
      targetEntity: 'Auth',
      targetId: user.userId,
      ipAddressMasked: '10.14.02.***'
    });

    return {
      token,
      user: userWithoutPass,
      message: `Welcome, ${user.name}`
    };
  }

  async getMe(): Promise<{ user: User }> {
    const user = authStorage.getUser();
    if (!user) throw new Error('No active session found');
    return { user };
  }

  async logout(): Promise<void> {
    const user = authStorage.getUser();
    if (user) {
      db.addAuditLog({
        userId: user.userId,
        userName: user.name,
        userRole: user.role,
        action: 'USER_LOGOUT',
        targetEntity: 'Auth',
        targetId: user.userId,
        ipAddressMasked: '10.14.02.***'
      });
    }
    authStorage.removeToken();
  }

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    const user = this.getCurrentUser();
    const projects = db.getProjectsForUser(user);

    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const activeProjects = projects.filter(p => p.status === 'Ongoing' || p.status === 'Assigned' || p.status === 'Sanctioned').length;
    const delayedProjects = projects.filter(p => p.status === 'Delayed').length;
    const underReviewProjects = projects.filter(p => p.status === 'Under Review').length;
    const recommendedProjects = projects.filter(p => p.status === 'Recommended').length;

    const totalFundsSanctioned = projects.reduce((acc, p) => acc + (p.sanctionedAmount || 0), 0);
    const totalFundsUtilized = projects.reduce((acc, p) => acc + (p.fundsUtilized || 0), 0);

    let userAlerts = db.alerts;
    if (user?.role === 'MP' || user?.role === 'AGENCY') {
      const userPrjIds = new Set(projects.map(p => p.id));
      userAlerts = db.alerts.filter(a => userPrjIds.has(a.projectId));
    }

    const highRiskProjectsCount = projects.filter(p => p.riskAnalysis.overallScore > 60).length;
    const costAnomaliesCount = userAlerts.filter(a => a.alertType === 'Cost Anomaly').length;
    const possibleDuplicatesCount = userAlerts.filter(a => a.alertType === 'Possible Duplicate').length;
    const photoAnomaliesCount = userAlerts.filter(a => a.alertType === 'Photo Anomaly').length;
    const locationMismatchesCount = userAlerts.filter(a => a.alertType === 'Location Mismatch').length;
    const delayRisksCount = userAlerts.filter(a => a.alertType === 'Delay Risk').length;
    const totalPendingReviews = userAlerts.filter(a => a.status === 'New' || a.status === 'Under Review').length;

    return {
      totalProjects,
      completedProjects,
      activeProjects,
      delayedProjects,
      underReviewProjects,
      recommendedProjects,
      totalFundsSanctioned,
      totalFundsUtilized,
      highRiskProjectsCount,
      costAnomaliesCount,
      possibleDuplicatesCount,
      photoAnomaliesCount,
      locationMismatchesCount,
      delayRisksCount,
      totalPendingReviews
    };
  }

  // Projects
  async getProjects(params: {
    status?: string;
    category?: string;
    riskLevel?: string;
    search?: string;
    district?: string;
  } = {}): Promise<{ projects: Project[]; count: number }> {
    const user = this.getCurrentUser();
    let projects = db.getProjectsForUser(user);

    if (params.status && params.status !== 'All') {
      projects = projects.filter(p => p.status === params.status);
    }
    if (params.category && params.category !== 'All') {
      projects = projects.filter(p => p.category === params.category);
    }
    if (params.riskLevel && params.riskLevel !== 'All') {
      projects = projects.filter(p => p.riskAnalysis.riskLevel === params.riskLevel);
    }
    if (params.district && params.district !== 'All') {
      projects = projects.filter(p => p.district === params.district);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.locationAddress.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return { projects, count: projects.length };
  }

  async getProjectById(id: string): Promise<Project> {
    const user = this.getCurrentUser();
    const project = db.getProjectByIdForUser(id, user);
    if (!project) throw new Error('Project not found or unauthorized');
    return project;
  }

  async recommendProject(data: {
    title: string;
    category: string;
    description: string;
    locationAddress: string;
    latitude: number;
    longitude: number;
    estimatedCost: number;
  }): Promise<{ project: Project; message: string }> {
    const user = this.getCurrentUser();
    const newId = `PRJ-2025-${String(db.projects.length + 1).padStart(3, '0')}`;
    const code = `MPLADS-HYD-2025-${String(db.projects.length + 1).padStart(3, '0')}`;

    const project: Project = {
      id: newId,
      projectCode: code,
      title: data.title,
      description: data.description,
      category: data.category,
      mpId: user?.userId || 'MP001',
      mpName: user?.name || 'Shri Rajesh Kumar',
      constituency: user?.constituency || 'Hyderabad North',
      district: user?.district || 'Hyderabad',
      state: 'Telangana',
      locationAddress: data.locationAddress,
      latitude: data.latitude,
      longitude: data.longitude,
      estimatedCost: Number(data.estimatedCost),
      sanctionedAmount: 0,
      fundsUtilized: 0,
      implementingAgencyId: 'UNASSIGNED',
      implementingAgencyName: 'Pending Sanction & Agency Selection',
      vendorName: 'Under Tendering / Sanction',
      vendorPanMasked: 'PENDING',
      recommendationDate: new Date().toISOString().split('T')[0],
      sanctionDate: '',
      startDate: '',
      expectedCompletionDate: '',
      status: 'Recommended',
      completionPercentage: 0,
      riskAnalysis: {
        overallScore: 12,
        riskLevel: 'LOW',
        lastEvaluatedAt: new Date().toISOString(),
        costAnomalyScore: 10,
        duplicateProbability: 5,
        photoAnomalyScore: 0,
        locationMismatch: false,
        delayProbability: 10,
        reasons: ['Newly proposed works; automated initial checks cleared.'],
        recommendations: ['Forwarded to District Collectorate for technical feasibility verification.'],
        disclaimer: 'Notice: Algorithmic assessment is advisory.'
      },
      photos: [],
      documents: [],
      payments: [],
      timeline: [
        { stage: 'Recommendation', completed: true, date: new Date().toISOString().split('T')[0] },
        { stage: 'Feasibility Check', completed: false, remarks: 'Assigned to technical committee' },
        { stage: 'Sanction', completed: false },
        { stage: 'Agency Assignment', completed: false },
        { stage: 'Execution', completed: false },
        { stage: 'Payment', completed: false },
        { stage: 'Completion', completed: false }
      ]
    };

    db.projects.unshift(project);
    db.addAuditLog({
      userId: user?.userId || 'MP001',
      userName: user?.name || 'Shri Rajesh Kumar',
      userRole: user?.role || 'MP',
      action: 'SUBMIT_RECOMMENDATION',
      targetEntity: 'Project',
      targetId: newId,
      newValue: `Created: ${project.title} (₹${project.estimatedCost})`,
      ipAddressMasked: '10.14.02.***'
    });

    return { project, message: 'Work recommendation submitted successfully' };
  }

  async updateProjectStatus(id: string, data: {
    status: Project['status'];
    sanctionedAmount?: number;
    remarks?: string;
  }): Promise<{ project: Project; message: string }> {
    const user = this.getCurrentUser();
    const prj = db.projects.find(p => p.id === id);
    if (!prj) throw new Error('Project not found');

    const prevStatus = prj.status;
    prj.status = data.status;

    if (data.sanctionedAmount !== undefined) {
      prj.sanctionedAmount = Number(data.sanctionedAmount);
      prj.sanctionDate = new Date().toISOString().split('T')[0];
    }

    db.addAuditLog({
      userId: user?.userId || 'ADMIN001',
      userName: user?.name || 'District Authority',
      userRole: user?.role || 'ADMIN',
      action: 'UPDATE_PROJECT_STATUS',
      targetEntity: 'Project',
      targetId: id,
      previousValue: prevStatus,
      newValue: `${data.status} (Remarks: ${data.remarks || 'None'})`,
      ipAddressMasked: '10.14.02.***'
    });

    return { project: prj, message: `Project status updated to ${data.status}` };
  }

  async assignAgency(id: string, data: {
    agencyId: string;
    agencyName: string;
    expectedCompletionDate: string;
  }): Promise<{ project: Project; message: string }> {
    const user = this.getCurrentUser();
    const prj = db.projects.find(p => p.id === id);
    if (!prj) throw new Error('Project not found');

    prj.implementingAgencyId = data.agencyId;
    prj.implementingAgencyName = data.agencyName;
    prj.expectedCompletionDate = data.expectedCompletionDate;
    if (prj.status === 'Sanctioned') {
      prj.status = 'Assigned';
    }

    db.addAuditLog({
      userId: user?.userId || 'ADMIN001',
      userName: user?.name || 'District Authority',
      userRole: user?.role || 'ADMIN',
      action: 'ASSIGN_AGENCY',
      targetEntity: 'Project',
      targetId: id,
      newValue: `Agency: ${data.agencyName} (${data.agencyId})`,
      ipAddressMasked: '10.14.02.***'
    });

    return { project: prj, message: 'Implementing agency assigned successfully' };
  }

  async updateProgress(id: string, data: {
    completionPercentage: number;
    photoUrl?: string;
    caption?: string;
    stage?: 'before' | 'during' | 'after';
  }): Promise<{ project: Project; message: string }> {
    const user = this.getCurrentUser();
    const prj = db.projects.find(p => p.id === id);
    if (!prj) throw new Error('Project not found');

    prj.completionPercentage = Number(data.completionPercentage);
    if (prj.completionPercentage >= 100) {
      prj.status = 'Completed';
      prj.actualCompletionDate = new Date().toISOString().split('T')[0];
    } else if (prj.status === 'Assigned' || prj.status === 'Sanctioned') {
      prj.status = 'Ongoing';
      if (!prj.startDate) prj.startDate = new Date().toISOString().split('T')[0];
    }

    if (data.photoUrl) {
      prj.photos.push({
        id: `photo_${Date.now()}`,
        stage: data.stage || 'during',
        url: data.photoUrl,
        caption: data.caption || 'Field verification inspection photo',
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.userId || 'AGENCY001',
        isAiVerified: true
      });
    }

    db.addAuditLog({
      userId: user?.userId || 'AGENCY001',
      userName: user?.name || 'Implementing Agency',
      userRole: user?.role || 'AGENCY',
      action: 'UPDATE_PROGRESS',
      targetEntity: 'Project',
      targetId: id,
      newValue: `Progress: ${data.completionPercentage}%`,
      ipAddressMasked: '10.14.02.***'
    });

    return { project: prj, message: 'Progress updated successfully' };
  }

  async addPayment(id: string, data: {
    installmentNo: number;
    amount: number;
    sanctionOrderNo: string;
  }): Promise<{ project: Project; message: string }> {
    const user = this.getCurrentUser();
    const prj = db.projects.find(p => p.id === id);
    if (!prj) throw new Error('Project not found');

    const amount = Number(data.amount);
    prj.fundsUtilized = (prj.fundsUtilized || 0) + amount;
    prj.payments.push({
      id: `pay_${Date.now()}`,
      installmentNo: Number(data.installmentNo),
      amount,
      sanctionOrderNo: data.sanctionOrderNo,
      paidAt: new Date().toISOString().split('T')[0],
      status: 'Disbursed',
      beneficiaryAgency: prj.implementingAgencyName
    });

    db.addAuditLog({
      userId: user?.userId || 'ADMIN001',
      userName: user?.name || 'District Authority',
      userRole: user?.role || 'ADMIN',
      action: 'DISBURSE_PAYMENT',
      targetEntity: 'Project',
      targetId: id,
      newValue: `Disbursed Installment ${data.installmentNo}: ₹${amount}`,
      ipAddressMasked: '10.14.02.***'
    });

    return { project: prj, message: 'Payment recorded and funds updated' };
  }

  // Alerts
  async getAlerts(params: { status?: string; riskLevel?: string } = {}): Promise<{ alerts: RiskAlert[]; count: number }> {
    const user = this.getCurrentUser();
    let alerts = [...db.alerts];

    if (user?.role === 'MP') {
      const userProjects = db.getProjectsForUser(user);
      const prjIds = new Set(userProjects.map(p => p.id));
      alerts = alerts.filter(a => prjIds.has(a.projectId));
    } else if (user?.role === 'AGENCY') {
      const userProjects = db.getProjectsForUser(user);
      const prjIds = new Set(userProjects.map(p => p.id));
      alerts = alerts.filter(a => prjIds.has(a.projectId));
    }

    if (params.status && params.status !== 'All') {
      alerts = alerts.filter(a => a.status === params.status);
    }
    if (params.riskLevel && params.riskLevel !== 'All') {
      alerts = alerts.filter(a => a.riskLevel === params.riskLevel);
    }

    return { alerts, count: alerts.length };
  }

  async actionAlert(id: string, data: { action: string; notes?: string }): Promise<{ alert: RiskAlert; message: string }> {
    const user = this.getCurrentUser();
    const alert = db.alerts.find(a => a.id === id);
    if (!alert) throw new Error('Alert not found');

    if (data.action === 'APPROVE_DISBURSEMENT' || data.action === 'RESOLVE') {
      alert.status = 'Resolved';
    } else if (data.action === 'HOLD_PAYMENT') {
      alert.status = 'Escalated';
    } else if (data.action === 'DISMISS') {
      alert.status = 'False Positive';
    } else {
      alert.status = 'Under Review';
    }

    db.addAuditLog({
      userId: user?.userId || 'ADMIN001',
      userName: user?.name || 'District Authority',
      userRole: user?.role || 'ADMIN',
      action: 'ALERT_STATUS_UPDATE',
      targetEntity: 'RiskAlert',
      targetId: id,
      newValue: `${data.action} - Status: ${alert.status} (${data.notes || 'No notes'})`,
      ipAddressMasked: '10.14.02.***'
    });

    return { alert, message: `Alert action '${data.action}' recorded successfully` };
  }

  // Citizen Feedback
  async getCitizenFeedback(): Promise<{ feedback: CitizenFeedback[]; count: number }> {
    return { feedback: [...db.citizenFeedback], count: db.citizenFeedback.length };
  }

  async submitCitizenFeedback(data: {
    projectId: string;
    citizenName: string;
    contactNumber: string;
    issueType: CitizenFeedback['issueType'];
    description: string;
    latitude?: number;
    longitude?: number;
    photoUrl?: string;
  }): Promise<{ feedback: CitizenFeedback; message: string }> {
    const prj = db.projects.find(p => p.id === data.projectId);
    const masked = data.contactNumber
      ? data.contactNumber.slice(0, 6) + '****'
      : '+91 98480*****';

    const feedback: CitizenFeedback = {
      id: `FB-${String(db.citizenFeedback.length + 1).padStart(3, '0')}`,
      projectId: data.projectId,
      projectTitle: prj?.title || 'MPLADS Community Work',
      projectCode: prj?.projectCode || 'MPLADS-HYD',
      district: prj?.district || 'Hyderabad',
      citizenName: data.citizenName || 'Concerned Citizen',
      citizenContactMasked: masked,
      issueType: data.issueType,
      description: data.description,
      photoUrl: data.photoUrl,
      latitude: data.latitude,
      longitude: data.longitude,
      submittedAt: new Date().toISOString(),
      status: 'Under Review',
      adminNotes: 'Routed to Vigilance Desk for field verification'
    };

    db.citizenFeedback.unshift(feedback);
    return { feedback, message: 'Grievance submitted successfully to District Authority vigilance desk' };
  }

  async updateFeedbackStatus(id: string, status: CitizenFeedback['status'], adminNotes?: string): Promise<{ feedback: CitizenFeedback; message: string }> {
    const item = db.citizenFeedback.find(f => f.id === id);
    if (!item) throw new Error('Feedback not found');
    item.status = status;
    if (adminNotes) item.adminNotes = adminNotes;
    return { feedback: item, message: `Feedback status updated to ${status}` };
  }

  // Audit Logs
  async getAuditLogs(): Promise<{ logs: AuditLogEntry[]; count: number }> {
    return { logs: [...db.auditLogs], count: db.auditLogs.length };
  }

  // AI Audit Report
  async generateAiAuditReport(projectId: string): Promise<any> {
    const prj = db.projects.find(p => p.id === projectId);
    if (!prj) throw new Error('Project not found');

    return {
      projectId: prj.id,
      projectCode: prj.projectCode,
      title: prj.title,
      overallHealthScore: 100 - prj.riskAnalysis.overallScore,
      costIntegrityAnalysis: {
        score: 100 - prj.riskAnalysis.costAnomalyScore,
        findings: [
          `Estimated Cost: ₹${(prj.estimatedCost / 100000).toFixed(2)} Lakhs`,
          `Sanctioned Amount: ₹${(prj.sanctionedAmount / 100000).toFixed(2)} Lakhs`,
          `Disbursed Funds: ₹${(prj.fundsUtilized / 100000).toFixed(2)} Lakhs`
        ]
      },
      delayRiskAnalysis: {
        probability: prj.riskAnalysis.delayProbability,
        assessment: prj.riskAnalysis.reasons[0] || 'Milestones progressing in accordance with timeline schedule.'
      },
      fieldPhotoVerification: {
        verifiedCount: prj.photos.length,
        status: prj.photos.length > 0 ? 'Verified with Geo-spatial correlation' : 'Pending field inspection upload'
      },
      regulatoryRecommendations: prj.riskAnalysis.recommendations,
      generatedAt: new Date().toISOString()
    };
  }

  // Public Transparency
  async getPublicSummary(): Promise<any> {
    const projects = db.getProjectsForUser(null);
    return {
      totalProjects: projects.length,
      completedProjects: projects.filter(p => p.status === 'Completed').length,
      activeProjects: projects.filter(p => p.status === 'Ongoing' || p.status === 'Assigned' || p.status === 'Sanctioned').length,
      totalFundsSanctioned: projects.reduce((acc, p) => acc + (p.sanctionedAmount || 0), 0),
      totalFundsUtilized: projects.reduce((acc, p) => acc + (p.fundsUtilized || 0), 0),
      district: 'Hyderabad',
      state: 'Telangana',
      lastRefreshedAt: new Date().toISOString()
    };
  }

  async getPublicProjects(): Promise<{ projects: Project[]; count: number }> {
    const projects = db.getProjectsForUser(null);
    return { projects, count: projects.length };
  }
}

export const clientMockDb = new ClientMockDbService();
