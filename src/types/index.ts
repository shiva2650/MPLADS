export type UserRole = 'MP' | 'ADMIN' | 'AGENCY' | 'PUBLIC';

export interface User {
  id: string;
  userId: string;
  name: string;
  role: UserRole;
  designation: string;
  constituency?: string;
  district?: string;
  agencyId?: string;
  agencyName?: string;
  email?: string;
  phone?: string;
}

export type ProjectStatus =
  | 'Recommended'
  | 'Under Review'
  | 'Sanctioned'
  | 'Assigned'
  | 'Ongoing'
  | 'Delayed'
  | 'Completed'
  | 'Rejected';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AlertType =
  | 'High Risk'
  | 'Cost Anomaly'
  | 'Delay Risk'
  | 'Possible Duplicate'
  | 'Photo Anomaly'
  | 'Location Mismatch';

export type AlertStatus =
  | 'New'
  | 'Under Review'
  | 'False Positive'
  | 'Escalated'
  | 'Resolved';

export interface ProjectPhoto {
  id: string;
  stage: 'before' | 'during' | 'after';
  url: string;
  caption: string;
  uploadedAt: string;
  uploadedBy: string;
  latitude?: number;
  longitude?: number;
  isAiVerified: boolean;
  aiVerificationNotes?: string;
  similarityAlert?: boolean;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'Recommendation' | 'Sanction Order' | 'Bill' | 'Payment Voucher' | 'Completion Certificate' | 'Other';
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  downloadUrl: string;
  isConfidential?: boolean;
}

export interface ProjectPayment {
  id: string;
  installmentNo: number;
  amount: number; // in INR
  sanctionOrderNo: string;
  paidAt: string;
  status: 'Requested' | 'Approved' | 'Disbursed';
  beneficiaryAgency: string;
  remarks?: string;
}

export interface AiRiskAnalysis {
  overallScore: number; // 0-100
  riskLevel: RiskLevel;
  lastEvaluatedAt: string;
  costAnomalyScore: number; // 0-100
  duplicateProbability: number; // 0-100
  photoAnomalyScore: number; // 0-100
  locationMismatch: boolean;
  delayProbability: number; // 0-100
  reasons: string[];
  recommendations: string[];
  disclaimer: string;
}

export interface Project {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  category: string;
  mpId: string;
  mpName: string;
  constituency: string;
  district: string;
  state: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  estimatedCost: number; // in INR (e.g., 2500000 = 25 Lakh)
  sanctionedAmount: number;
  fundsUtilized: number;
  implementingAgencyId: string;
  implementingAgencyName: string;
  vendorName: string;
  vendorPanMasked: string;
  recommendationDate: string;
  sanctionDate: string;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  status: ProjectStatus;
  completionPercentage: number;
  riskAnalysis: AiRiskAnalysis;
  photos: ProjectPhoto[];
  documents: ProjectDocument[];
  payments: ProjectPayment[];
  timeline: {
    stage: string;
    completed: boolean;
    date?: string;
    remarks?: string;
  }[];
}

export interface RiskAlert {
  id: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  district: string;
  mpName: string;
  agencyName: string;
  alertType: AlertType;
  riskLevel: RiskLevel;
  reason: string;
  technicalDetails?: string;
  createdAt: string;
  status: AlertStatus;
  assignedOfficer?: string;
  reviewNotes?: string;
  resolvedAt?: string;
}

export interface DuplicateProjectCandidate {
  primaryProject: Project;
  candidateProject: Project;
  similarityScore: number; // 0 - 100%
  distanceMeters: number;
  matchingFactors: string[];
}

export interface CitizenFeedback {
  id: string;
  projectId: string;
  projectTitle: string;
  projectCode: string;
  district: string;
  citizenName: string;
  citizenContactMasked?: string;
  issueType: 'Incomplete Work' | 'Incorrect Location' | 'Project Not Found' | 'Damaged Asset' | 'Poor Quality' | 'Other';
  description: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  submittedAt: string;
  status: 'New' | 'Under Review' | 'Verified' | 'Resolved' | 'Rejected';
  adminNotes?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetEntity: string;
  targetId: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
  ipAddressMasked: string;
}

export interface DashboardSummary {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  delayedProjects: number;
  underReviewProjects: number;
  recommendedProjects: number;
  totalFundsSanctioned: number;
  totalFundsUtilized: number;
  highRiskProjectsCount: number;
  costAnomaliesCount: number;
  possibleDuplicatesCount: number;
  photoAnomaliesCount: number;
  locationMismatchesCount: number;
  delayRisksCount: number;
  totalPendingReviews: number;
}
