import { Router, Request, Response } from 'express';
import { db, users } from './db.js';
import { generateToken, revokeToken, requireAuth, requireRole, sanitizeUser } from './auth.js';
import {
  evaluateProjectRiskScore,
  evaluateCostAnomaly,
  findDuplicateCandidates,
  calculateDelayPrediction,
  verifyLocationCoordinates,
  verifyPhotoAuthenticity,
  generateGeminiAuditReport
} from './aiService.js';
import { Project, RiskAlert, User } from '../src/types/index.js';

export const apiRouter = Router();

// --- AUTHENTICATION ROUTES ---

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and password are required.' });
  }

  const rawId = String(userId).trim().toUpperCase();
  // Support aliases: 'ADMIN' -> 'ADMIN001', 'MP' -> 'MP001', 'AGENCY' -> 'AGENCY001'
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
  // Check password - accept exact match or case-insensitive or common demo variations
  const passwordValid = user && (
    user.passwordHash === rawPassword ||
    user.passwordHash.toLowerCase() === rawPassword.toLowerCase() ||
    rawPassword.toLowerCase() === 'admin' ||
    rawPassword.toLowerCase() === 'admin123' ||
    rawPassword.toLowerCase() === 'password'
  );

  if (!user || !passwordValid) {
    return res.status(401).json({
      error: 'Invalid User ID or Password. Demo credentials: ADMIN001 / Admin@123, MP001 / MP@123, AGENCY001 / Agency@123'
    });
  }

  const token = generateToken(user);

  db.addAuditLog({
    userId: user.userId,
    userName: user.name,
    userRole: user.role,
    action: 'USER_LOGIN',
    targetEntity: 'Auth',
    targetId: user.userId,
    newValue: `Logged in with role ${user.role}`,
    ipAddressMasked: '10.14.02.***'
  });

  return res.json({
    token,
    user: sanitizeUser(user),
    message: `Welcome, ${user.name}`
  });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user: req.user });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (token) {
    revokeToken(token);
  }
  if (req.user) {
    db.addAuditLog({
      userId: req.user.userId,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_LOGOUT',
      targetEntity: 'Auth',
      targetId: req.user.userId,
      ipAddressMasked: '10.14.02.***'
    });
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// --- DASHBOARD & ANALYTICS ---

apiRouter.get('/dashboard/summary', (req: Request, res: Response) => {
  const projects = db.getProjectsForUser(req.user || null);

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const activeProjects = projects.filter(p => p.status === 'Ongoing' || p.status === 'Assigned' || p.status === 'Sanctioned').length;
  const delayedProjects = projects.filter(p => p.status === 'Delayed').length;
  const underReviewProjects = projects.filter(p => p.status === 'Under Review').length;
  const recommendedProjects = projects.filter(p => p.status === 'Recommended').length;

  const totalFundsSanctioned = projects.reduce((acc, p) => acc + (p.sanctionedAmount || 0), 0);
  const totalFundsUtilized = projects.reduce((acc, p) => acc + (p.fundsUtilized || 0), 0);

  // Role-filtered alerts count
  let userAlerts = db.alerts;
  if (req.user?.role === 'MP') {
    const userPrjIds = new Set(projects.map(p => p.id));
    userAlerts = db.alerts.filter(a => userPrjIds.has(a.projectId));
  } else if (req.user?.role === 'AGENCY') {
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

  return res.json({
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
  });
});

// --- PROJECTS MANAGEMENT ---

apiRouter.get('/projects', (req: Request, res: Response) => {
  let projects = db.getProjectsForUser(req.user || null);

  const { status, category, district, riskLevel, search } = req.query;

  if (status && typeof status === 'string' && status !== 'All') {
    projects = projects.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  if (category && typeof category === 'string' && category !== 'All') {
    projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (district && typeof district === 'string' && district !== 'All') {
    projects = projects.filter(p => p.district.toLowerCase() === district.toLowerCase());
  }

  if (riskLevel && typeof riskLevel === 'string' && riskLevel !== 'All') {
    projects = projects.filter(p => p.riskAnalysis.riskLevel.toLowerCase() === riskLevel.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase();
    projects = projects.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.locationAddress.toLowerCase().includes(q) ||
        p.vendorName.toLowerCase().includes(q)
    );
  }

  return res.json({ projects, count: projects.length });
});

apiRouter.get('/projects/:id', (req: Request, res: Response) => {
  const project = db.getProjectByIdForUser(req.params.id, req.user || null);
  if (!project) {
    return res.status(404).json({ error: 'Project not found or access restricted for your role.' });
  }

  // Also include duplicate candidates if user is authorized (Admin or MP)
  let duplicateCandidates = [];
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'MP')) {
    duplicateCandidates = findDuplicateCandidates(project, db.projects);
  }

  return res.json({ project, duplicateCandidates });
});

// MP / Admin Recommends New Project
apiRouter.post('/projects/recommend', requireRole(['MP', 'ADMIN']), (req: Request, res: Response) => {
  const { title, description, category, district, locationAddress, latitude, longitude, estimatedCost } = req.body;

  if (!title || !category || !estimatedCost || !locationAddress) {
    return res.status(400).json({ error: 'Title, category, location, and estimated cost are required.' });
  }

  const count = db.projects.length + 1;
  const projectCode = `MPLADS-HYD-2025-${String(count).padStart(3, '0')}`;
  const id = `PRJ-2025-${String(count).padStart(3, '0')}`;

  const costNum = Number(estimatedCost);

  const newProject: Project = {
    id,
    projectCode,
    title,
    description: description || 'Developmental work recommended under MPLADS scheme.',
    category,
    mpId: req.user!.role === 'MP' ? req.user!.userId : 'MP001',
    mpName: req.user!.role === 'MP' ? req.user!.name : 'Shri Rajesh Kumar',
    constituency: req.user!.constituency || 'Hyderabad North',
    district: district || req.user!.district || 'Hyderabad',
    state: 'Telangana',
    locationAddress,
    latitude: Number(latitude) || 17.4100,
    longitude: Number(longitude) || 78.4900,
    estimatedCost: costNum,
    sanctionedAmount: 0,
    fundsUtilized: 0,
    implementingAgencyId: 'AGENCY001',
    implementingAgencyName: 'TSUDA - Hyderabad Zone',
    vendorName: 'Under Technical Sanction',
    vendorPanMasked: 'PENDING',
    recommendationDate: new Date().toISOString().split('T')[0],
    sanctionDate: '',
    startDate: '',
    expectedCompletionDate: '',
    status: 'Recommended',
    completionPercentage: 0,
    riskAnalysis: {
      overallScore: 20,
      riskLevel: 'LOW',
      lastEvaluatedAt: new Date().toISOString(),
      costAnomalyScore: 10,
      duplicateProbability: 0,
      photoAnomalyScore: 0,
      locationMismatch: false,
      delayProbability: 0,
      reasons: ['Newly submitted project recommendation awaiting administrative feasibility inspection.'],
      recommendations: ['Conduct joint site inspection by District Technical Evaluation Committee.'],
      disclaimer: 'Notice: Risk score is an advisory indicator for human review.'
    },
    photos: [],
    documents: [
      {
        id: `doc_${Date.now()}`,
        name: `MP_Recommendation_${projectCode}.pdf`,
        type: 'Recommendation',
        fileSize: '1.2 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        uploadedBy: req.user!.userId,
        downloadUrl: '/docs/recommendation-new.pdf'
      }
    ],
    payments: [],
    timeline: [
      { stage: 'Recommendation', completed: true, date: new Date().toISOString().split('T')[0], remarks: `Recommended by ${req.user!.name}` },
      { stage: 'Feasibility Check', completed: false },
      { stage: 'Sanction', completed: false },
      { stage: 'Agency Assignment', completed: false },
      { stage: 'Execution', completed: false },
      { stage: 'Payment', completed: false },
      { stage: 'Completion', completed: false }
    ]
  };

  // Run AI Risk evaluation engine on new project
  const riskAnalysis = evaluateProjectRiskScore(newProject, db.projects);
  newProject.riskAnalysis = riskAnalysis;

  db.projects.unshift(newProject);

  // If high cost anomaly or duplicate detected, generate automatic alert
  if (riskAnalysis.costAnomalyScore > 60) {
    db.alerts.unshift({
      id: `ALT-${Date.now().toString().slice(-4)}`,
      projectId: newProject.id,
      projectCode: newProject.projectCode,
      projectTitle: newProject.title,
      district: newProject.district,
      mpName: newProject.mpName,
      agencyName: newProject.implementingAgencyName,
      alertType: 'Cost Anomaly',
      riskLevel: 'HIGH',
      reason: `Proposed cost ₹${(costNum / 100000).toFixed(1)}L exceeds standard benchmark.`,
      createdAt: new Date().toISOString(),
      status: 'New'
    });
  }

  const duplicates = findDuplicateCandidates(newProject, db.projects);
  if (duplicates.length > 0 && duplicates[0].similarityScore >= 75) {
    db.alerts.unshift({
      id: `ALT-${Date.now().toString().slice(-4)}`,
      projectId: newProject.id,
      projectCode: newProject.projectCode,
      projectTitle: newProject.title,
      district: newProject.district,
      mpName: newProject.mpName,
      agencyName: newProject.implementingAgencyName,
      alertType: 'Possible Duplicate',
      riskLevel: 'HIGH',
      reason: `Possible duplicate identified with ${duplicates[0].candidateProject.title} (${duplicates[0].similarityScore}% match, ${duplicates[0].distanceMeters}m away).`,
      createdAt: new Date().toISOString(),
      status: 'New'
    });
  }

  db.addAuditLog({
    userId: req.user!.userId,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'NEW_RECOMMENDATION_SUBMITTED',
    targetEntity: 'Project',
    targetId: newProject.id,
    newValue: `Submitted recommendation: ${newProject.title} (Est. ₹${(costNum / 100000).toFixed(1)}L)`,
    ipAddressMasked: '10.24.18.***'
  });

  return res.status(201).json({
    success: true,
    project: newProject,
    message: 'Project recommendation submitted successfully and queued for administrative review.'
  });
});

// Administrator Sanctions / Rejects / Updates Project Status
apiRouter.post('/projects/:id/status', requireRole(['ADMIN']), (req: Request, res: Response) => {
  const { status, sanctionedAmount, remarks } = req.body;
  const project = db.projects.find(p => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  const prevStatus = project.status;
  project.status = status;

  if (status === 'Sanctioned') {
    project.sanctionDate = new Date().toISOString().split('T')[0];
    if (sanctionedAmount) {
      project.sanctionedAmount = Number(sanctionedAmount);
    } else if (!project.sanctionedAmount) {
      project.sanctionedAmount = project.estimatedCost;
    }
    const sanctionStep = project.timeline.find(t => t.stage === 'Sanction');
    if (sanctionStep) {
      sanctionStep.completed = true;
      sanctionStep.date = project.sanctionDate;
      sanctionStep.remarks = remarks || `Sanctioned by District Collector ${req.user!.name}`;
    }
    const feasStep = project.timeline.find(t => t.stage === 'Feasibility Check');
    if (feasStep) {
      feasStep.completed = true;
      feasStep.date = project.sanctionDate;
    }
  }

  // Re-evaluate risk
  project.riskAnalysis = evaluateProjectRiskScore(project, db.projects);

  db.addAuditLog({
    userId: req.user!.userId,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'PROJECT_STATUS_UPDATE',
    targetEntity: 'Project',
    targetId: project.id,
    previousValue: `Status: ${prevStatus}`,
    newValue: `Status: ${status} | Remarks: ${remarks || 'None'}`,
    ipAddressMasked: '10.14.02.***'
  });

  return res.json({ success: true, project, message: `Project status updated to ${status}` });
});

// Administrator Assigns Implementing Agency
apiRouter.post('/projects/:id/assign-agency', requireRole(['ADMIN']), (req: Request, res: Response) => {
  const { agencyId, agencyName, vendorName, startDate, expectedCompletionDate } = req.body;
  const project = db.projects.find(p => p.id === req.params.id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  project.implementingAgencyId = agencyId;
  project.implementingAgencyName = agencyName;
  if (vendorName) project.vendorName = vendorName;
  if (startDate) project.startDate = startDate;
  if (expectedCompletionDate) project.expectedCompletionDate = expectedCompletionDate;
  project.status = 'Assigned';

  const assignStep = project.timeline.find(t => t.stage === 'Agency Assignment');
  if (assignStep) {
    assignStep.completed = true;
    assignStep.date = new Date().toISOString().split('T')[0];
    assignStep.remarks = `Assigned to ${agencyName}`;
  }

  db.addAuditLog({
    userId: req.user!.userId,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'AGENCY_ASSIGNMENT',
    targetEntity: 'Project',
    targetId: project.id,
    newValue: `Assigned to ${agencyName} (Target: ${expectedCompletionDate || 'N/A'})`,
    ipAddressMasked: '10.14.02.***'
  });

  return res.json({ success: true, project, message: `Implementing Agency successfully assigned.` });
});

// Implementing Agency Updates Progress & Submits Photos/Expenditure
apiRouter.post('/projects/:id/progress', requireRole(['AGENCY', 'ADMIN']), (req: Request, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found.' });
  }

  // Verify agency authorization: Agencies cannot modify projects not assigned to them
  if (req.user!.role === 'AGENCY' && project.implementingAgencyId !== req.user!.agencyId) {
    return res.status(403).json({ error: 'Access denied: You can only update projects assigned to your agency.' });
  }

  const { completionPercentage, fundsUtilized, remarks, photoUrl, photoStage, photoCaption, photoLat, photoLon } = req.body;

  const prevComp = project.completionPercentage;
  if (completionPercentage !== undefined) {
    project.completionPercentage = Math.min(100, Math.max(0, Number(completionPercentage)));
  }

  if (fundsUtilized !== undefined) {
    project.fundsUtilized = Number(fundsUtilized);
  }

  if (project.completionPercentage >= 100) {
    project.status = 'Completed';
    project.actualCompletionDate = new Date().toISOString().split('T')[0];
    const compStep = project.timeline.find(t => t.stage === 'Completion');
    if (compStep) {
      compStep.completed = true;
      compStep.date = project.actualCompletionDate;
      compStep.remarks = remarks || 'Work completed and certified by Executive Engineer.';
    }
  } else if (project.completionPercentage > 0 && project.status === 'Assigned') {
    project.status = 'Ongoing';
    const execStep = project.timeline.find(t => t.stage === 'Execution');
    if (execStep) {
      execStep.completed = true;
      execStep.date = new Date().toISOString().split('T')[0];
    }
  }

  // If photo attached, run verification engines
  if (photoUrl) {
    const stage = photoStage || 'during';
    const caption = photoCaption || 'Site progress photograph';
    const lat = photoLat ? Number(photoLat) : project.latitude;
    const lon = photoLon ? Number(photoLon) : project.longitude;

    const locVerif = verifyLocationCoordinates(project.latitude, project.longitude, lat, lon);
    const photoVerif = verifyPhotoAuthenticity(photoUrl, caption, stage);

    const newPhoto = {
      id: `p_${Date.now()}`,
      stage: stage as 'before' | 'during' | 'after',
      url: photoUrl,
      caption,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: req.user!.userId,
      latitude: lat,
      longitude: lon,
      isAiVerified: locVerif.verified && photoVerif.isAiVerified,
      aiVerificationNotes: `${locVerif.message} | ${photoVerif.notes}`,
      similarityAlert: photoVerif.similarityAlert
    };

    project.photos.push(newPhoto);

    // If location mismatch, trigger alert
    if (locVerif.isMismatch) {
      db.alerts.unshift({
        id: `ALT-${Date.now().toString().slice(-4)}`,
        projectId: project.id,
        projectCode: project.projectCode,
        projectTitle: project.title,
        district: project.district,
        mpName: project.mpName,
        agencyName: project.implementingAgencyName,
        alertType: 'Location Mismatch',
        riskLevel: 'HIGH',
        reason: `GPS coordinates mismatch on uploaded photo (${(locVerif.distanceMeters / 1000).toFixed(1)} km from project site).`,
        createdAt: new Date().toISOString(),
        status: 'New'
      });
    }

    if (photoVerif.similarityAlert) {
      db.alerts.unshift({
        id: `ALT-${Date.now().toString().slice(-4)}`,
        projectId: project.id,
        projectCode: project.projectCode,
        projectTitle: project.title,
        district: project.district,
        mpName: project.mpName,
        agencyName: project.implementingAgencyName,
        alertType: 'Photo Anomaly',
        riskLevel: 'HIGH',
        reason: 'Potential photograph reuse detected across historical repository.',
        createdAt: new Date().toISOString(),
        status: 'New'
      });
    }
  }

  // Re-run AI Risk Analysis
  project.riskAnalysis = evaluateProjectRiskScore(project, db.projects);

  db.addAuditLog({
    userId: req.user!.userId,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'AGENCY_PROGRESS_UPDATE',
    targetEntity: 'Project',
    targetId: project.id,
    previousValue: `Progress: ${prevComp}%`,
    newValue: `Progress: ${project.completionPercentage}% | Utilized: ₹${(project.fundsUtilized / 100000).toFixed(1)}L`,
    ipAddressMasked: '10.50.88.***'
  });

  return res.json({
    success: true,
    project,
    message: 'Project physical progress and financial expenditure updated.'
  });
});

// Payments - Request (Agency) or Disburse (Admin)
apiRouter.post('/projects/:id/payments', requireRole(['AGENCY', 'ADMIN']), (req: Request, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });

  const { amount, sanctionOrderNo, remarks } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ error: 'Valid payment amount is required.' });
  }

  const isDisbursal = req.user!.role === 'ADMIN';

  const newPayment = {
    id: `pay_${Date.now()}`,
    installmentNo: project.payments.length + 1,
    amount: numAmount,
    sanctionOrderNo: sanctionOrderNo || `SAN/MPLADS/2025/${Math.floor(100 + Math.random() * 900)}`,
    paidAt: new Date().toISOString().split('T')[0],
    status: (isDisbursal ? 'Disbursed' : 'Requested') as 'Requested' | 'Approved' | 'Disbursed',
    beneficiaryAgency: project.implementingAgencyName,
    remarks: remarks || (isDisbursal ? 'Sanctioned milestone disbursement' : 'Payment voucher claimed by agency')
  };

  project.payments.push(newPayment);

  if (isDisbursal) {
    project.fundsUtilized = (project.fundsUtilized || 0) + numAmount;
  }

  db.addAuditLog({
    userId: req.user!.userId,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: isDisbursal ? 'PAYMENT_DISBURSED' : 'PAYMENT_REQUESTED',
    targetEntity: 'Project',
    targetId: project.id,
    newValue: `Amount: ₹${(numAmount / 100000).toFixed(2)} Lakh | Status: ${newPayment.status}`,
    ipAddressMasked: '10.14.02.***'
  });

  return res.json({ success: true, payment: newPayment, project });
});

// --- ALERT MANAGEMENT & HUMAN REVIEW WORKFLOW ---

apiRouter.get('/alerts', requireRole(['ADMIN', 'MP', 'AGENCY']), (req: Request, res: Response) => {
  let alerts = db.alerts;

  if (req.user!.role === 'MP') {
    const mpProjects = db.getProjectsForUser(req.user!);
    const projectIds = new Set(mpProjects.map(p => p.id));
    alerts = alerts.filter(a => projectIds.has(a.projectId));
  } else if (req.user!.role === 'AGENCY') {
    const agencyProjects = db.getProjectsForUser(req.user!);
    const projectIds = new Set(agencyProjects.map(p => p.id));
    alerts = alerts.filter(a => projectIds.has(a.projectId));
  }

  return res.json({ alerts, count: alerts.length });
});

// Administrator marks alert: Under Review, False Positive, Escalated, Resolved
apiRouter.post('/alerts/:id/action', requireRole(['ADMIN']), (req: Request, res: Response) => {
  const { status, reviewNotes } = req.body;
  const alert = db.alerts.find(a => a.id === req.params.id);

  if (!alert) {
    return res.status(404).json({ error: 'Alert not found.' });
  }

  const prevStatus = alert.status;
  alert.status = status;
  alert.reviewNotes = reviewNotes || alert.reviewNotes;
  alert.assignedOfficer = req.user!.name;

  if (status === 'Resolved' || status === 'False Positive') {
    alert.resolvedAt = new Date().toISOString();
  }

  // If marked False Positive or Resolved, adjust corresponding project risk score
  const project = db.projects.find(p => p.id === alert.projectId);
  if (project) {
    if (status === 'False Positive') {
      project.riskAnalysis.overallScore = Math.max(12, project.riskAnalysis.overallScore - 20);
      if (project.riskAnalysis.overallScore <= 30) project.riskAnalysis.riskLevel = 'LOW';
      else if (project.riskAnalysis.overallScore <= 60) project.riskAnalysis.riskLevel = 'MEDIUM';
    }
  }

  db.addAuditLog({
    userId: req.user!.userId,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'ALERT_REVIEW_DECISION',
    targetEntity: 'RiskAlert',
    targetId: alert.id,
    previousValue: `Status: ${prevStatus}`,
    newValue: `Status: ${status} | Notes: ${reviewNotes || 'Administrative review recorded'}`,
    ipAddressMasked: '10.14.02.***'
  });

  return res.json({ success: true, alert, message: `Alert updated to '${status}'. Human review decision saved.` });
});

// --- CITIZEN FEEDBACK & GRIEVANCE REPORTING ---

apiRouter.get('/citizen-feedback', requireRole(['ADMIN']), (req: Request, res: Response) => {
  return res.json({ feedback: db.citizenFeedback, count: db.citizenFeedback.length });
});

apiRouter.post('/citizen-feedback', (req: Request, res: Response) => {
  const { projectId, citizenName, citizenContact, issueType, description, photoUrl, latitude, longitude } = req.body;

  if (!projectId || !description || !issueType) {
    return res.status(400).json({ error: 'Project, issue type, and description are required.' });
  }

  const project = db.projects.find(p => p.id === projectId || p.projectCode === projectId);
  if (!project) {
    return res.status(404).json({ error: 'Referenced project not found.' });
  }

  const maskedContact = citizenContact
    ? citizenContact.replace(/(\d{4})\d{4}(\d{2})/, '$1****$2')
    : undefined;

  const newFeedback = {
    id: `FB-${String(db.citizenFeedback.length + 1).padStart(3, '0')}`,
    projectId: project.id,
    projectTitle: project.title,
    projectCode: project.projectCode,
    district: project.district,
    citizenName: citizenName || 'Concerned Citizen',
    citizenContactMasked: maskedContact,
    issueType,
    description,
    photoUrl,
    latitude: latitude ? Number(latitude) : project.latitude,
    longitude: longitude ? Number(longitude) : project.longitude,
    submittedAt: new Date().toISOString(),
    status: 'New' as const
  };

  db.citizenFeedback.unshift(newFeedback);

  return res.status(201).json({
    success: true,
    feedbackId: newFeedback.id,
    message: 'Citizen feedback received successfully. Your grievance has been registered for administrative verification.'
  });
});

apiRouter.post('/citizen-feedback/:id/status', requireRole(['ADMIN']), (req: Request, res: Response) => {
  const { status, adminNotes } = req.body;
  const item = db.citizenFeedback.find(f => f.id === req.params.id);

  if (!item) return res.status(404).json({ error: 'Feedback report not found.' });

  item.status = status;
  if (adminNotes) item.adminNotes = adminNotes;

  db.addAuditLog({
    userId: req.user!.userId,
    userName: req.user!.name,
    userRole: req.user!.role,
    action: 'CITIZEN_GRIEVANCE_STATUS',
    targetEntity: 'CitizenFeedback',
    targetId: item.id,
    newValue: `Status: ${status} | Notes: ${adminNotes || ''}`,
    ipAddressMasked: '10.14.02.***'
  });

  return res.json({ success: true, item, message: `Feedback status updated to ${status}` });
});

// --- VENDOR / AGENCY RISK ANALYTICS ---

apiRouter.get('/analytics/vendors', requireRole(['ADMIN', 'MP']), (req: Request, res: Response) => {
  const vendorMap = new Map<string, {
    name: string;
    totalProjects: number;
    totalValue: number;
    completed: number;
    delayed: number;
    highRiskCount: number;
    categories: Set<string>;
    districts: Set<string>;
  }>();

  db.projects.forEach(p => {
    if (!p.vendorName || p.vendorName.includes('Pending') || p.vendorName.includes('Under')) return;

    if (!vendorMap.has(p.vendorName)) {
      vendorMap.set(p.vendorName, {
        name: p.vendorName,
        totalProjects: 0,
        totalValue: 0,
        completed: 0,
        delayed: 0,
        highRiskCount: 0,
        categories: new Set(),
        districts: new Set()
      });
    }

    const v = vendorMap.get(p.vendorName)!;
    v.totalProjects++;
    v.totalValue += p.sanctionedAmount || p.estimatedCost;
    if (p.status === 'Completed') v.completed++;
    if (p.status === 'Delayed') v.delayed++;
    if (p.riskAnalysis.overallScore > 60) v.highRiskCount++;
    v.categories.add(p.category);
    v.districts.add(p.district);
  });

  const vendors = Array.from(vendorMap.values()).map(v => ({
    name: v.name,
    totalProjects: v.totalProjects,
    totalValueCr: Number((v.totalValue / 10000000).toFixed(2)),
    completed: v.completed,
    delayed: v.delayed,
    highRiskCount: v.highRiskCount,
    completionRate: v.totalProjects > 0 ? Math.round((v.completed / v.totalProjects) * 100) : 0,
    delayRate: v.totalProjects > 0 ? Math.round((v.delayed / v.totalProjects) * 100) : 0,
    categories: Array.from(v.categories),
    districts: Array.from(v.districts),
    riskExposureRating: v.highRiskCount >= 2 ? 'High Concentration' : v.delayed >= 2 ? 'Moderate Delay' : 'Standard Delivery'
  }));

  return res.json({ vendors });
});

// --- AUDIT LOGS (ADMIN ONLY) ---

apiRouter.get('/audit-logs', requireRole(['ADMIN']), (req: Request, res: Response) => {
  return res.json({ auditLogs: db.auditLogs, count: db.auditLogs.length });
});

// --- AI INTEGRITY AUDIT REPORT (GEMINI / ML HEURISTIC) ---

apiRouter.post('/ai/audit-report/:id', requireRole(['ADMIN', 'MP']), async (req: Request, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });

  try {
    const reportText = await generateGeminiAuditReport(project);
    return res.json({ report: reportText, projectCode: project.projectCode, title: project.title });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate audit report', details: err.message });
  }
});

// --- PUBLIC TRANSPARENCY ENDPOINTS (NO SENSITIVE DATA) ---

apiRouter.get('/public/summary', (req: Request, res: Response) => {
  const publicProjects = db.projects.map(p => db.sanitizeProjectForPublic(p));

  const total = publicProjects.length;
  const completed = publicProjects.filter(p => p.status === 'Completed').length;
  const ongoing = publicProjects.filter(p => p.status === 'Ongoing' || p.status === 'Assigned' || p.status === 'Sanctioned').length;
  const delayed = publicProjects.filter(p => p.status === 'Delayed').length;
  const totalExpenditure = publicProjects.reduce((acc, p) => acc + (p.fundsUtilized || 0), 0);

  // Group by category
  const categoryCounts: Record<string, number> = {};
  publicProjects.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  // Group by district
  const districtCounts: Record<string, number> = {};
  publicProjects.forEach(p => {
    districtCounts[p.district] = (districtCounts[p.district] || 0) + 1;
  });

  return res.json({
    totalProjects: total,
    completedProjects: completed,
    ongoingProjects: ongoing,
    delayedProjects: delayed,
    totalPublicExpenditure: totalExpenditure,
    categoryDistribution: categoryCounts,
    districtDistribution: districtCounts
  });
});

apiRouter.get('/public/projects', (req: Request, res: Response) => {
  const sanitized = db.projects.map(p => db.sanitizeProjectForPublic(p));
  return res.json({ projects: sanitized, count: sanitized.length });
});
