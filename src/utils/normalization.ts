import {
  Project,
  ProjectPhoto,
  ProjectDocument,
  ProjectPayment,
  AiRiskAnalysis,
  RiskAlert,
  CitizenFeedback,
  DashboardSummary,
  ProjectStatus,
  RiskLevel
} from '../types/index.js';

export function normalizeTimeline(timeline: any): Project['timeline'] {
  if (!Array.isArray(timeline)) return [];
  return timeline.map((t, idx) => ({
    stage: typeof t?.stage === 'string' && t.stage.trim() ? t.stage : `Stage ${idx + 1}`,
    completed: Boolean(t?.completed),
    date: typeof t?.date === 'string' ? t.date : '',
    remarks: typeof t?.remarks === 'string' ? t.remarks : ''
  }));
}

export function normalizePhotos(photos: any): ProjectPhoto[] {
  if (!Array.isArray(photos)) return [];
  return photos.map((p, idx) => ({
    id: p?.id ? String(p.id) : `photo_${idx}_${Date.now()}`,
    stage: p?.stage === 'before' || p?.stage === 'during' || p?.stage === 'after' ? p.stage : 'during',
    url: typeof p?.url === 'string' ? p.url : '',
    caption: typeof p?.caption === 'string' ? p.caption : '',
    uploadedAt: typeof p?.uploadedAt === 'string' ? p.uploadedAt : new Date().toISOString().split('T')[0],
    uploadedBy: typeof p?.uploadedBy === 'string' ? p.uploadedBy : 'AGENCY001',
    latitude: typeof p?.latitude === 'number' && !isNaN(p.latitude) ? p.latitude : undefined,
    longitude: typeof p?.longitude === 'number' && !isNaN(p.longitude) ? p.longitude : undefined,
    isAiVerified: Boolean(p?.isAiVerified),
    aiVerificationNotes: typeof p?.aiVerificationNotes === 'string' ? p.aiVerificationNotes : undefined,
    similarityAlert: Boolean(p?.similarityAlert),
    perceptualHash: typeof p?.perceptualHash === 'string' ? p.perceptualHash : undefined,
    exifTimestamp: typeof p?.exifTimestamp === 'string' ? p.exifTimestamp : undefined,
    verificationStatus: p?.verificationStatus || (p?.isAiVerified ? 'VERIFIED' : 'PENDING'),
    distanceFromSiteMeters: typeof p?.distanceFromSiteMeters === 'number' ? p.distanceFromSiteMeters : undefined,
    gpsDistanceMeters: typeof p?.gpsDistanceMeters === 'number' ? p.gpsDistanceMeters : p?.distanceFromSiteMeters,
    isGpsVerified: Boolean(p?.isGpsVerified),
    cameraMakeModel: typeof p?.cameraMakeModel === 'string' ? p.cameraMakeModel : undefined,
    cameraModel: typeof p?.cameraModel === 'string' ? p.cameraModel : p?.cameraMakeModel,
    duplicateMatchDetails: p?.duplicateMatchDetails ? {
      matchedProjectId: String(p.duplicateMatchDetails.matchedProjectId || ''),
      matchedProjectCode: String(p.duplicateMatchDetails.matchedProjectCode || ''),
      matchedPhotoId: String(p.duplicateMatchDetails.matchedPhotoId || ''),
      similarityPercentage: Number(p.duplicateMatchDetails.similarityPercentage) || 0,
      hammingDistance: typeof p.duplicateMatchDetails.hammingDistance === 'number' ? p.duplicateMatchDetails.hammingDistance : undefined
    } : undefined
  }));
}

export function normalizeDocuments(docs: any): ProjectDocument[] {
  if (!Array.isArray(docs)) return [];
  return docs.map((d, idx) => ({
    id: d?.id ? String(d.id) : `doc_${idx}_${Date.now()}`,
    name: typeof d?.name === 'string' && d.name.trim() ? d.name : `Document ${idx + 1}`,
    type: d?.type || 'Other',
    fileSize: typeof d?.fileSize === 'string' ? d.fileSize : '0 KB',
    uploadedAt: typeof d?.uploadedAt === 'string' ? d.uploadedAt : new Date().toISOString().split('T')[0],
    uploadedBy: typeof d?.uploadedBy === 'string' ? d.uploadedBy : 'ADMIN001',
    downloadUrl: typeof d?.downloadUrl === 'string' ? d.downloadUrl : '#',
    isConfidential: Boolean(d?.isConfidential)
  }));
}

export function normalizePayments(payments: any): ProjectPayment[] {
  if (!Array.isArray(payments)) return [];
  return payments.map((p, idx) => ({
    id: p?.id ? String(p.id) : `pay_${idx}_${Date.now()}`,
    installmentNo: typeof p?.installmentNo === 'number' && !isNaN(p.installmentNo) ? p.installmentNo : idx + 1,
    amount: typeof p?.amount === 'number' && !isNaN(p.amount) ? p.amount : 0,
    sanctionOrderNo: typeof p?.sanctionOrderNo === 'string' ? p.sanctionOrderNo : `SANCTION-${idx + 1}`,
    paidAt: typeof p?.paidAt === 'string' ? p.paidAt : new Date().toISOString().split('T')[0],
    status: p?.status === 'Requested' || p?.status === 'Approved' || p?.status === 'Disbursed' ? p.status : 'Disbursed',
    beneficiaryAgency: typeof p?.beneficiaryAgency === 'string' ? p.beneficiaryAgency : 'Implementing Agency',
    remarks: typeof p?.remarks === 'string' ? p.remarks : undefined
  }));
}

export function normalizeRiskAnalysis(risk: any): AiRiskAnalysis {
  const overallScore = typeof risk?.overallScore === 'number' && !isNaN(risk.overallScore) ? Math.max(0, Math.min(100, risk.overallScore)) : 0;
  
  let riskLevel: RiskLevel = 'LOW';
  if (risk?.riskLevel === 'CRITICAL' || risk?.riskLevel === 'HIGH' || risk?.riskLevel === 'MEDIUM' || risk?.riskLevel === 'LOW') {
    riskLevel = risk.riskLevel;
  } else {
    if (overallScore >= 75) riskLevel = 'CRITICAL';
    else if (overallScore >= 50) riskLevel = 'HIGH';
    else if (overallScore >= 25) riskLevel = 'MEDIUM';
    else riskLevel = 'LOW';
  }

  const reasons = Array.isArray(risk?.reasons) ? risk.reasons.map((r: any) => String(r || '').trim()).filter(Boolean) : [];
  const recommendations = Array.isArray(risk?.recommendations) ? risk.recommendations.map((r: any) => String(r || '').trim()).filter(Boolean) : [];

  return {
    overallScore,
    riskLevel,
    lastEvaluatedAt: typeof risk?.lastEvaluatedAt === 'string' ? risk.lastEvaluatedAt : new Date().toISOString(),
    costAnomalyScore: typeof risk?.costAnomalyScore === 'number' && !isNaN(risk.costAnomalyScore) ? risk.costAnomalyScore : 0,
    duplicateProbability: typeof risk?.duplicateProbability === 'number' && !isNaN(risk.duplicateProbability) ? risk.duplicateProbability : 0,
    photoAnomalyScore: typeof risk?.photoAnomalyScore === 'number' && !isNaN(risk.photoAnomalyScore) ? risk.photoAnomalyScore : 0,
    locationMismatch: Boolean(risk?.locationMismatch),
    delayProbability: typeof risk?.delayProbability === 'number' && !isNaN(risk.delayProbability) ? risk.delayProbability : 0,
    delayRiskScore: typeof risk?.delayRiskScore === 'number' ? risk.delayRiskScore : (typeof risk?.delayProbability === 'number' ? risk.delayProbability : 0),
    duplicateRiskScore: typeof risk?.duplicateRiskScore === 'number' ? risk.duplicateRiskScore : (typeof risk?.duplicateProbability === 'number' ? risk.duplicateProbability : 0),
    photoReuseScore: typeof risk?.photoReuseScore === 'number' ? risk.photoReuseScore : (typeof risk?.photoAnomalyScore === 'number' ? risk.photoAnomalyScore : 0),
    reasons,
    recommendations,
    disclaimer: typeof risk?.disclaimer === 'string' && risk.disclaimer.trim() ? risk.disclaimer : 'Notice: Risk score is an advisory algorithmic indicator generated for administrative review.',
    costBaseline: risk?.costBaseline ? {
      mean: Number(risk.costBaseline.mean) || 0,
      cohortMean: typeof risk.costBaseline.cohortMean === 'number' ? risk.costBaseline.cohortMean : undefined,
      stdDev: Number(risk.costBaseline.stdDev) || 0,
      cohortStdDev: typeof risk.costBaseline.cohortStdDev === 'number' ? risk.costBaseline.cohortStdDev : undefined,
      zScore: Number(risk.costBaseline.zScore) || 0,
      cohortSize: Number(risk.costBaseline.cohortSize) || 0,
      category: String(risk.costBaseline.category || ''),
      state: String(risk.costBaseline.state || ''),
      zThreshold: Number(risk.costBaseline.zThreshold) || 2,
      isAnomaly: Boolean(risk.costBaseline.isAnomaly),
      reason: String(risk.costBaseline.reason || '')
    } : undefined,
    delayMetrics: risk?.delayMetrics ? {
      delayDays: Number(risk.delayMetrics.delayDays) || 0,
      confidenceScore: Number(risk.delayMetrics.confidenceScore) || 0,
      marginOfErrorDays: Number(risk.delayMetrics.marginOfErrorDays) || 0,
      confidenceInterval: String(risk.delayMetrics.confidenceInterval || ''),
      confidenceIntervalString: String(risk.delayMetrics.confidenceIntervalString || risk.delayMetrics.confidenceInterval || ''),
      modelTrainingStatus: String(risk.delayMetrics.modelTrainingStatus || 'Model evaluated on historical benchmarks'),
      holdoutValidation: risk.delayMetrics.holdoutValidation ? {
        precision: Number(risk.delayMetrics.holdoutValidation.precision) || 0,
        recall: Number(risk.delayMetrics.holdoutValidation.recall) || 0,
        f1Score: Number(risk.delayMetrics.holdoutValidation.f1Score) || 0,
        accuracy: Number(risk.delayMetrics.holdoutValidation.accuracy) || 0,
        sampleSize: Number(risk.delayMetrics.holdoutValidation.sampleSize) || 0
      } : undefined
    } : undefined
  };
}

export function normalizeProject(raw: any): Project {
  if (!raw || typeof raw !== 'object') {
    const fallbackId = `PRJ-${Date.now()}`;
    return {
      id: fallbackId,
      projectCode: `MPLADS-${fallbackId}`,
      title: 'Untitled Project',
      description: '',
      category: 'General Infrastructure',
      mpId: 'MP001',
      mpName: 'Member of Parliament',
      constituency: 'Constituency',
      district: 'District',
      state: 'Telangana',
      locationAddress: '',
      latitude: 17.385,
      longitude: 78.4867,
      estimatedCost: 0,
      sanctionedAmount: 0,
      fundsUtilized: 0,
      implementingAgencyId: 'AGENCY001',
      implementingAgencyName: 'Implementing Agency',
      vendorName: 'Pending Tender',
      vendorPanMasked: 'CONFIDENTIAL',
      recommendationDate: new Date().toISOString().split('T')[0],
      sanctionDate: '',
      startDate: '',
      expectedCompletionDate: '',
      status: 'Recommended',
      completionPercentage: 0,
      riskAnalysis: normalizeRiskAnalysis(null),
      photos: [],
      documents: [],
      payments: [],
      timeline: []
    };
  }

  const id = raw.id ? String(raw.id) : (raw.projectCode ? String(raw.projectCode) : `PRJ-${Date.now()}`);
  const projectCode = raw.projectCode ? String(raw.projectCode) : (raw.workId ? String(raw.workId) : (raw.id ? String(raw.id) : 'MPLADS-GEN'));
  const workId = raw.workId ? String(raw.workId) : projectCode;

  const validStatuses: ProjectStatus[] = [
    'Recommended', 'Under Review', 'Sanctioned', 'Assigned', 'Ongoing', 'Delayed', 'Completed', 'Rejected'
  ];
  const status: ProjectStatus = validStatuses.includes(raw.status) ? raw.status : 'Recommended';

  return {
    id,
    projectCode,
    workId,
    title: typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : 'Untitled Work Item',
    description: typeof raw.description === 'string' ? raw.description : '',
    category: typeof raw.category === 'string' && raw.category.trim() ? raw.category.trim() : 'Community Infrastructure',
    mpId: typeof raw.mpId === 'string' ? raw.mpId : 'MP001',
    mpName: typeof raw.mpName === 'string' && raw.mpName.trim() ? raw.mpName.trim() : 'Shri Rajesh Kumar',
    constituency: typeof raw.constituency === 'string' && raw.constituency.trim() ? raw.constituency.trim() : 'Hyderabad North',
    district: typeof raw.district === 'string' && raw.district.trim() ? raw.district.trim() : 'Hyderabad',
    state: typeof raw.state === 'string' && raw.state.trim() ? raw.state.trim() : 'Telangana',
    locationAddress: typeof raw.locationAddress === 'string' ? raw.locationAddress : '',
    latitude: typeof raw.latitude === 'number' && !isNaN(raw.latitude) ? raw.latitude : 17.385,
    longitude: typeof raw.longitude === 'number' && !isNaN(raw.longitude) ? raw.longitude : 78.4867,
    estimatedCost: Number(raw.estimatedCost) || 0,
    sanctionedAmount: Number(raw.sanctionedAmount) || 0,
    fundsUtilized: Number(raw.fundsUtilized) || 0,
    implementingAgencyId: typeof raw.implementingAgencyId === 'string' ? raw.implementingAgencyId : 'AGENCY001',
    implementingAgencyName: typeof raw.implementingAgencyName === 'string' && raw.implementingAgencyName.trim() ? raw.implementingAgencyName.trim() : 'TSUDA - Hyderabad Zone',
    vendorName: typeof raw.vendorName === 'string' && raw.vendorName.trim() ? raw.vendorName.trim() : 'Under Tendering / Sanction',
    vendorPanMasked: typeof raw.vendorPanMasked === 'string' ? raw.vendorPanMasked : 'CONFIDENTIAL',
    recommendationDate: typeof raw.recommendationDate === 'string' ? raw.recommendationDate : new Date().toISOString().split('T')[0],
    sanctionDate: typeof raw.sanctionDate === 'string' ? raw.sanctionDate : '',
    startDate: typeof raw.startDate === 'string' ? raw.startDate : '',
    expectedCompletionDate: typeof raw.expectedCompletionDate === 'string' ? raw.expectedCompletionDate : '',
    actualCompletionDate: typeof raw.actualCompletionDate === 'string' ? raw.actualCompletionDate : undefined,
    status,
    completionPercentage: typeof raw.completionPercentage === 'number' && !isNaN(raw.completionPercentage) ? Math.max(0, Math.min(100, raw.completionPercentage)) : 0,
    riskAnalysis: normalizeRiskAnalysis(raw.riskAnalysis),
    photos: normalizePhotos(raw.photos),
    documents: normalizeDocuments(raw.documents),
    payments: normalizePayments(raw.payments),
    timeline: normalizeTimeline(raw.timeline)
  };
}

export function normalizeProjects(projects: any): Project[] {
  if (!Array.isArray(projects)) return [];
  return projects.map(normalizeProject).filter(Boolean);
}

export function normalizeAlert(raw: any): RiskAlert {
  if (!raw || typeof raw !== 'object') {
    return {
      id: `ALT-${Date.now()}`,
      projectId: 'PRJ-GEN',
      projectCode: 'MPLADS-GEN',
      projectTitle: 'System Notification',
      district: 'Hyderabad',
      mpName: 'Member of Parliament',
      agencyName: 'Implementing Agency',
      alertType: 'High Risk',
      riskLevel: 'LOW',
      reason: 'General system notice',
      createdAt: new Date().toISOString(),
      status: 'New'
    };
  }

  return {
    id: String(raw.id || `ALT-${Date.now()}`),
    projectId: String(raw.projectId || ''),
    projectCode: String(raw.projectCode || ''),
    projectTitle: String(raw.projectTitle || 'Alert'),
    district: String(raw.district || 'Hyderabad'),
    mpName: String(raw.mpName || 'Member of Parliament'),
    agencyName: String(raw.agencyName || 'Implementing Agency'),
    alertType: raw.alertType || 'High Risk',
    riskLevel: raw.riskLevel || 'LOW',
    reason: String(raw.reason || ''),
    technicalDetails: typeof raw.technicalDetails === 'string' ? raw.technicalDetails : undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    status: raw.status || 'New',
    assignedOfficer: typeof raw.assignedOfficer === 'string' ? raw.assignedOfficer : undefined,
    reviewNotes: typeof raw.reviewNotes === 'string' ? raw.reviewNotes : undefined,
    resolvedAt: typeof raw.resolvedAt === 'string' ? raw.resolvedAt : undefined
  };
}

export function normalizeAlerts(alerts: any): RiskAlert[] {
  if (!Array.isArray(alerts)) return [];
  return alerts.map(normalizeAlert).filter(Boolean);
}

export function normalizeCitizenFeedback(raw: any): CitizenFeedback {
  if (!raw || typeof raw !== 'object') {
    return {
      id: `FB-${Date.now()}`,
      projectId: 'PRJ-GEN',
      projectCode: 'MPLADS-GEN',
      projectTitle: 'Citizen Observation',
      district: 'Hyderabad',
      citizenName: 'Anonymous Citizen',
      citizenContactMasked: 'XXXXXX0000',
      issueType: 'Other',
      description: '',
      submittedAt: new Date().toISOString(),
      status: 'Under Review'
    };
  }

  const validIssueTypes: CitizenFeedback['issueType'][] = [
    'Incomplete Work', 'Incorrect Location', 'Project Not Found', 'Damaged Asset', 'Poor Quality', 'Other'
  ];
  const issueType = validIssueTypes.includes(raw.issueType) ? raw.issueType : 'Other';

  const validStatuses: CitizenFeedback['status'][] = [
    'New', 'Under Review', 'Verified', 'Resolved', 'Rejected'
  ];
  const status = validStatuses.includes(raw.status) ? raw.status : 'Under Review';

  return {
    id: String(raw.id || `FB-${Date.now()}`),
    projectId: String(raw.projectId || ''),
    projectCode: String(raw.projectCode || ''),
    projectTitle: String(raw.projectTitle || ''),
    district: String(raw.district || 'Hyderabad'),
    citizenName: String(raw.citizenName || 'Public Observer'),
    citizenContactMasked: typeof raw.citizenContactMasked === 'string' ? raw.citizenContactMasked : (typeof raw.citizenContact === 'string' ? raw.citizenContact : undefined),
    issueType,
    description: String(raw.description || ''),
    submittedAt: typeof raw.submittedAt === 'string' ? raw.submittedAt : new Date().toISOString(),
    status,
    photoUrl: typeof raw.photoUrl === 'string' ? raw.photoUrl : undefined,
    latitude: typeof raw.latitude === 'number' ? raw.latitude : undefined,
    longitude: typeof raw.longitude === 'number' ? raw.longitude : undefined,
    adminNotes: typeof raw.adminNotes === 'string' ? raw.adminNotes : undefined
  };
}

export function normalizeCitizenFeedbackList(list: any): CitizenFeedback[] {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeCitizenFeedback).filter(Boolean);
}

export function normalizeDashboardSummary(raw: any): DashboardSummary {
  if (!raw || typeof raw !== 'object') {
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

  return {
    totalProjects: Number(raw.totalProjects) || 0,
    completedProjects: Number(raw.completedProjects) || 0,
    activeProjects: Number(raw.activeProjects) || 0,
    delayedProjects: Number(raw.delayedProjects) || 0,
    underReviewProjects: Number(raw.underReviewProjects) || 0,
    recommendedProjects: Number(raw.recommendedProjects) || 0,
    totalFundsSanctioned: Number(raw.totalFundsSanctioned) || 0,
    totalFundsUtilized: Number(raw.totalFundsUtilized) || 0,
    highRiskProjectsCount: Number(raw.highRiskProjectsCount) || 0,
    costAnomaliesCount: Number(raw.costAnomaliesCount) || 0,
    possibleDuplicatesCount: Number(raw.possibleDuplicatesCount) || 0,
    photoAnomaliesCount: Number(raw.photoAnomaliesCount) || 0,
    locationMismatchesCount: Number(raw.locationMismatchesCount) || 0,
    delayRisksCount: Number(raw.delayRisksCount) || 0,
    totalPendingReviews: Number(raw.totalPendingReviews) || 0
  };
}
