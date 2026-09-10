export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  // Brand / Portal
  portalName: string;
  portalTagline: string;
  govIndia: string;
  mospiTitle: string;
  mpladsFullName: string;
  officialBadge: string;
  nicGov: string;
  footerCompliance: string;

  // Navigation Tabs & Headers
  home: string;
  projects: string;
  funds: string;
  alerts: string;
  verification: string;
  reports: string;
  feedback: string;
  gisMap: string;
  recommendWork: string;
  agencyBilling: string;
  contractorGraph: string;
  auditTrail: string;
  dataIngestion: string;
  help: string;
  officerLogin: string;
  publicView: string;
  citizenPortal: string;
  signOut: string;
  authenticatedOfficial: string;
  roleAuthority: string;
  districtJurisdiction: string;
  officialSessionActive: string;
  officerOperations: string;
  mappingLocation: string;
  restrictedTools: string;
  activeOfficerSession: string;
  returnToHome: string;
  switchToOfficer: string;
  publicCitizenModeActive: string;

  // Common UI Actions & Words
  search: string;
  filter: string;
  reset: string;
  clearFilters: string;
  export: string;
  exportCsv: string;
  exportExcel: string;
  printReport: string;
  loading: string;
  saving: string;
  submitting: string;
  save: string;
  cancel: string;
  close: string;
  submit: string;
  update: string;
  confirm: string;
  delete: string;
  viewDetails: string;
  backTo: string;
  backToOverview: string;
  backToDashboard: string;
  all: string;
  noData: string;
  actions: string;
  status: string;
  progress: string;
  date: string;
  category: string;
  district: string;
  state: string;
  constituency: string;
  mpName: string;
  agency: string;
  vendor: string;
  estimatedCost: string;
  sanctionedAmount: string;
  fundsUtilized: string;
  riskLevel: string;
  riskScore: string;
  requiredField: string;
  invalidValue: string;
  saveSuccess: string;
  saveFailed: string;
  official: string;
  whatDoesThisMean: string;
  plainGuidance: string;
  clickToExplain: string;
  previous: string;
  next: string;
  showingResults: string;
  pageOf: string;
  total: string;
  srNo: string;
  completed: string;
  active: string;
  cr: string;
  lakh: string;
  lakhShort: string;
  acrossWorks: string;
  reviewStatus: string;
  notices: string;
  flagged: string;
  delayed: string;

  // Dashboard Specific
  totalProjects: string;
  completedProjects: string;
  activeProjects: string;
  delayedProjects: string;
  underReviewProjects: string;
  recommendedProjects: string;
  highRiskWorks: string;
  sanctionedAllocation: string;
  expenditureVeracity: string;
  utilizationRate: string;
  worksRequiringAttention: string;
  recentAlerts: string;
  noPendingAlerts: string;
  reviewAlerts: string;
  constituencyTrend: string;
  integrityVectors: string;
  interactiveMapView: string;
  recommendNewWork: string;
  citizenViewTag: string;
  officerConsoleTag: string;
  dashboardSubheading: string;
  mpOverviewTitle: string;
  adminOverviewTitle: string;
  agencyOverviewTitle: string;
  publicOverviewTitle: string;
  continuousOversightTitle: string;
  continuousOversightTerm: string;
  continuousOversightExplanation: string;
  continuousOversightDesc: string;
  costChecks: string;
  costChecksNote: string;
  potentialDuplicates: string;
  duplicatesNote: string;
  photoVerification: string;
  photoVerificationNote: string;
  locationAccuracy: string;
  locationAccuracyNote: string;
  highRiskWorksNeedingReview: string;
  highRiskWorksDesc: string;
  aiIntegrityAnomalies: string;
  aiIntegrityAnomaliesDesc: string;
  viewAllAnomalies: string;
  viewAllWorks: string;
  noHighRiskProjects: string;
  auditDetails: string;

  // Projects Specific
  projectsPageTitle: string;
  projectsPageSubtitle: string;
  searchProjectsPlaceholder: string;
  allCategories: string;
  allDistricts: string;
  allStatuses: string;
  allRiskLevels: string;
  sortBy: string;
  sortRisk: string;
  sortCost: string;
  sortProgress: string;
  sortCode: string;
  projectDetails: string;
  tabOverview: string;
  tabAiRisk: string;
  tabPhotos: string;
  tabFinancials: string;
  tabDocuments: string;
  tabAuditReport: string;
  noProjectsFound: string;
  physicalProgress: string;
  completionPercentage: string;
  vendorAssigned: string;
  implementingAgency: string;
  sanctionDate: string;
  targetCompletion: string;
  actualCompletion: string;
  startDate: string;
  workId: string;
  locationAddress: string;
  showingProjectsCount: string;
  workTitleAndCategory: string;
  locationAndDistrict: string;
  costLakh: string;
  aiRisk: string;

  // Financials & Funds Ledger
  fundsPageTitle: string;
  fundsPageSubtitle: string;
  annualEntitlement: string;
  perConstituency: string;
  sanctionedWorks: string;
  allocatedPct: string;
  disbursedUtilized: string;
  utilizedPct: string;
  uncommittedBalance: string;
  availableForSanction: string;
  transactionLedger: string;
  categoryBreakdown: string;
  installmentNo: string;
  disbursedOn: string;
  sanctionOrder: string;
  beneficiaryAgency: string;
  sectoralAllocation: string;
  sanctionedColon: string;
  utilizedColon: string;
  spent: string;
  certifiedPaymentsLedger: string;
  disbursalsCount: string;
  sanctionOrderRef: string;
  projectTitle: string;
  amountInr: string;
  disbursedDate: string;
  physicalExecutionDrawdown: string;

  // Alerts & Vigilance Review
  alertsPageTitle: string;
  alertsPageSubtitle: string;
  pendingAdjudication: string;
  alertTypeLabel: string;
  reviewStatusLabel: string;
  takeAction: string;
  noAlertsFound: string;
  reasonFindings: string;
  technicalDetails: string;
  assignedOfficer: string;
  reviewNotes: string;
  actionModalTitle: string;
  actionResolve: string;
  actionEscalate: string;
  actionFalsePositive: string;
  actionNotesPlaceholder: string;
  aiAlertManagementTitle: string;
  aiAlertManagementSubtitle: string;
  alertRef: string;
  anomalyType: string;
  associatedProject: string;
  districtAndAgency: string;
  detectionObservation: string;
  administrativeAction: string;
  takeActionBtn: string;
  showingAlertsCount: string;
  noAlertsMatchCriteria: string;

  // Evidence & Verification
  verificationPageTitle: string;
  verificationPageSubtitle: string;
  integrityIndex: string;
  tamperAnalysis: string;
  gpsGeofenceDistance: string;
  cameraMetadata: string;
  perceptualDuplicateHash: string;
  withinSite: string;
  locationMismatch: string;
  verifiedAuthentic: string;
  aiSynthesized: string;
  verified: string;
  underReview: string;
  sanctioned: string;
  utilized: string;
  publicTransparencyVerification: string;
  officialMospiFeed: string;
  projectVerificationStatusTitle: string;
  projectVerificationStatusDesc: string;
  verificationProcessTerm: string;
  verificationProcessExplanation: string;
  verifiedWorks: string;
  underReviewWorks: string;
  flaggedWorks: string;
  allWorksFilter: string;
  searchVerificationPlaceholder: string;
  workVerificationCard: string;
  photographicTelemetry: string;
  gpsAccuracy: string;
  financialAlignment: string;
  physicalInspection: string;
  verifiedDesc: string;
  underReviewDesc: string;
  flaggedDesc: string;
  viewFullInspectionReport: string;
  noVerificationRecordsMatch: string;

  // Reports
  reportsPageTitle: string;
  reportsPageSubtitle: string;
  generatePdf: string;
  downloadExcel: string;
  auditCompliance: string;
  constituencyPerformance: string;
  officialReportsTitle: string;
  officialReportsSubtitle: string;
  printOfficialBrief: string;
  exportCsvDataset: string;
  selectReportType: string;
  masterAuditReport: string;
  riskVigilanceReport: string;
  financialLedgerReport: string;
  agencyScorecardReport: string;
  reportGeneratedNotice: string;

  // Citizen Feedback & Ground Observations
  feedbackPageTitle: string;
  feedbackPageSubtitle: string;
  reportObservation: string;
  issueType: string;
  citizenName: string;
  citizenContact: string;
  description: string;
  selectProject: string;
  submitFeedback: string;
  feedbackSubmittedSuccess: string;
  publicGrievances: string;
  noFeedbackYet: string;
  citizenFeedbackTitle: string;
  citizenFeedbackSubtitle: string;
  registerNewGrievance: string;
  noGrievancesJurisdiction: string;
  reportedOn: string;
  associatedProjectColon: string;
  citizenWhistleblowerReport: string;
  authorityActionLog: string;
  adjudicateGrievance: string;
  adjudicateGrievanceTitle: string;
  updateStatus: string;
  adjudicationNotes: string;
  adjudicationNotesPlaceholder: string;
  updating: string;

  // AI Vigilance & Anomalies
  vigilanceDecisionEngine: string;
  aiAnomaliesTitle: string;
  aiAnomaliesSubtitle: string;
  statutoryAdvisory: string;
  statutoryAdvisoryText: string;
  allModulesOverview: string;
  costBenchmarkAnomalies: string;
  spatialDuplicateDetection: string;
  photoIntegrityAnomalies: string;
  locationMismatchAnomalies: string;
  executionDelayRisks: string;
  sanctionedCost: string;
  benchmarkCost: string;
  costDeviation: string;
  investigateWork: string;
  inspectEvidence: string;
  inspectGroundPhotos: string;
  inspectGpsCoordinates: string;

  // Agency Workdesk
  agencyWorkdeskTitle: string;
  agencyWorkdeskSubtitle: string;
  agencyProtocolNotice: string;
  agencyProtocolDesc: string;
  updateProgressAndPhotos: string;
  submitPaymentClaim: string;
  paymentClaimTitle: string;
  claimAmountLakhLabel: string;
  voucherRemarksLabel: string;
  voucherRemarksPlaceholder: string;
  submittingVoucher: string;
  submitVoucherBtn: string;

  // Vendor Analytics
  vendorMatrixTitle: string;
  vendorMatrixSubtitle: string;
  antiCartelizationNotice: string;
  antiCartelizationDesc: string;
  registeredGovtContractor: string;
  totalWorks: string;
  contractValue: string;
  completedWorks: string;
  delayedOrAtRisk: string;
  timelyCompletionRate: string;
  categoriesLabel: string;
  loadingVendorAnalytics: string;

  // Audit Logs
  auditLogTitle: string;
  auditLogSubtitle: string;
  verifyIntegrityBtn: string;
  validatingHashes: string;
  hashChainVerified: string;
  hashChainBroken: string;
  genesisAnchorValidated: string;
  algorithm: string;
  verifiedAt: string;
  loadingAuditSequence: string;

  // Data Ingestion Impact
  dataIngestionTitle: string;
  dataIngestionSubtitle: string;
  ingestSampleData: string;
  simulateTamper: string;
  verifyAuditChain: string;
  restoreChain: string;

  // Contractor Network Fraud
  networkFraudTitle: string;
  networkFraudSubtitle: string;
  graphAnalyticsBadge: string;
  recomputeGraph: string;
  contractorsAudited: string;
  collusionRingsFlagged: string;
  graphEdgesModeled: string;
  allVendors: string;
  suspiciousOnly: string;
  shellOnly: string;

  // Recommendations Page
  recommendationsTitle: string;
  recommendationsSubtitle: string;
  submitNewRecommendation: string;
  noRecommendationsLogged: string;
  sanctionWorkBtn: string;
  sanctionWorkModalTitle: string;
  sanctionAmountLakhLabel: string;
  sanctionRemarksLabel: string;
  sanctionRemarksPlaceholder: string;
  sanctioning: string;

  // Citizen Chatbot
  chatbotTitle: string;
  chatbotGroundedBadge: string;
  chatbotSubheading: string;
  chatbotWelcomeMessage: string;
  chatbotInputPlaceholder: string;
  askMpladsAi: string;
  sendQuery: string;
  retrievingRecords: string;
  rateLimitNotice: string;
  chatbotDisclaimer: string;
  quickPrompt1: string;
  quickPrompt2: string;
  quickPrompt3: string;
  quickPrompt4: string;

  // Authentication & Login
  loginTitle: string;
  loginSubtitle: string;
  userIdLabel: string;
  passwordLabel: string;
  signInBtn: string;
  enterPublicPortal: string;
  backToSchemeHome: string;
  invalidCredentialsTitle: string;
  invalidCredentialsMsg: string;
  invalidCredentialsSug: string;
  serverUnreachableTitle: string;
  serverUnreachableMsg: string;
  serverUnreachableSug: string;
  authFailedTitle: string;
  authFailedSug: string;
  demoCredentialsHelp: string;
  mpLogin: string;
  adminLogin: string;
  agencyLogin: string;
  verifyingSession: string;

  // Notification Center
  notificationsTitle: string;
  unreadCountText: string;
  allCaughtUpText: string;
  markAllReadText: string;
  resetBaselineText: string;
  loadingNotificationsText: string;
  emptyNotificationsTitle: string;
  emptyNotificationsDesc: string;
  markAsReadText: string;
  viewProjectText: string;
  viewAlertText: string;

  // Landing Page Specific
  landingHeroTitle: string;
  landingHeroSubtitle: string;
  lokSabha: string;
  rajyaSabha: string;
  mpLedgerTab: string;
  worksListTab: string;
  searchLandingPlaceholder: string;
  advancedFilters: string;
  tenureLabel: string;
  sectorLabel: string;
  financialYearLabel: string;
  allocatedCrLabel: string;
  recommendedCrLabel: string;
  sanctionedCrLabel: string;
  utilizedCrLabel: string;
  worksRecommendedLabel: string;
  worksSanctionedLabel: string;
  worksCompletedLabel: string;
  viewWorksLabel: string;
  noMpsFound: string;

  // Additional System & Anomalies Keys
  gisSurveillance: string;
  gisMapTitle: string;
  gisMapSubtitle: string;
  loadingMpladsDataset: string;
  auditBoqJustification: string;
  actionRequired: string;
  siteReconciliation: string;
  inspectSubmittedPhotographs: string;
  closeInspector: string;
  openInProjectWorkspace: string;
  issueShowCauseRule14: string;
  directSdmFieldVerification: string;
  investigateAndResolve: string;
  pendingAdjudicationText: string;
  registeredAlertsCount: string;
  filterByType: string;
  filterByStatus: string;
  allTypes: string;
  alertRefHeader: string;
  anomalyTypeHeader: string;
  associatedProjectHeader: string;
  districtAgencyHeader: string;
  detectionObservationHeader: string;
  reviewStatusHeader: string;
  administrativeActionHeader: string;
  estimatedProposal: string;
  sanctionOrderAndRemarks: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    // Brand / Portal
    portalName: 'MPLADS Transparency Portal',
    portalTagline: 'Members of Parliament Local Area Development Scheme',
    govIndia: 'Government of India',
    mospiTitle: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    mpladsFullName: 'Members of Parliament Local Area Development Scheme (MPLADS) — Central plan scheme for local developmental assets',
    officialBadge: 'Official',
    nicGov: 'National Informatics Centre (NIC) • MoSPI, New Delhi',
    footerCompliance: 'Official Government Institutional Design • Compliant with MoSPI 2023 Guidelines & SIH Standards',

    // Navigation Tabs & Headers
    home: 'Home / Overview',
    projects: 'Projects',
    funds: 'Fund Tracking',
    alerts: 'Alerts & Reviews',
    verification: 'Verification Status',
    reports: 'Reports',
    feedback: 'Citizen Feedback',
    gisMap: 'Geographic GIS Map',
    recommendWork: 'Recommend Work',
    agencyBilling: 'Agency Billing Desk',
    contractorGraph: 'Contractor Link Graph',
    auditTrail: 'Ledger Audit Trail',
    dataIngestion: 'Data Ingestion & Impact',
    help: 'Help & Assistant',
    officerLogin: 'Officer Login',
    publicView: 'Citizen View',
    citizenPortal: 'Citizen Transparency Portal',
    signOut: 'Sign Out / Switch',
    authenticatedOfficial: 'Authenticated Official',
    roleAuthority: 'Role Authority',
    districtJurisdiction: 'District Jurisdiction',
    officialSessionActive: 'Official Session Active',
    officerOperations: 'Officer Operations',
    mappingLocation: 'Mapping & Location',
    restrictedTools: 'Restricted Forensic Tools',
    activeOfficerSession: 'Active Officer Session',
    returnToHome: 'Return to Scheme Portal Home',
    switchToOfficer: 'Switch to Officer Workspace',
    publicCitizenModeActive: 'Public Citizen Mode Active',

    // Common UI Actions & Words
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    clearFilters: 'Clear Filters',
    export: 'Export',
    exportCsv: 'Export to CSV',
    exportExcel: 'Export to Excel',
    printReport: 'Print Official Gazette Sheet',
    loading: 'Loading...',
    saving: 'Saving...',
    submitting: 'Submitting...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    submit: 'Submit',
    update: 'Update',
    confirm: 'Confirm',
    delete: 'Delete',
    viewDetails: 'View Details',
    backTo: 'Back to',
    backToOverview: '← Back to Overview',
    backToDashboard: '← Back to Dashboard',
    all: 'All',
    noData: 'No records found',
    actions: 'Actions',
    status: 'Status',
    progress: 'Progress',
    date: 'Date',
    category: 'Category',
    district: 'District',
    state: 'State',
    constituency: 'Constituency',
    mpName: 'Member of Parliament',
    agency: 'Implementing Agency',
    vendor: 'Contractor / Vendor',
    estimatedCost: 'Estimated Cost',
    sanctionedAmount: 'Sanctioned Amount',
    fundsUtilized: 'Funds Utilized',
    riskLevel: 'Risk Level',
    riskScore: 'Integrity / Risk Index',
    requiredField: 'This field is required',
    invalidValue: 'Invalid value entered',
    saveSuccess: 'Successfully saved',
    saveFailed: 'Failed to save changes',
    official: 'Official',
    whatDoesThisMean: 'What does this mean?',
    plainGuidance: 'Plain language guidance',
    clickToExplain: 'Click to view explanation',
    previous: 'Previous',
    next: 'Next',
    showingResults: 'Showing {start} to {end} of {total} records',
    pageOf: 'Page {current} of {total}',
    total: 'Total',
    srNo: 'Sr No',
    completed: 'Completed',
    active: 'Active',
    cr: 'Cr',
    lakh: 'Lakh',
    lakhShort: 'L',
    acrossWorks: 'Across {count} local development works',
    reviewStatus: 'Review Status',
    notices: 'notices',
    flagged: 'Flagged',
    delayed: 'Delayed',

    // Dashboard Specific
    totalProjects: 'Total Works',
    completedProjects: 'Completed Works',
    activeProjects: 'Ongoing Works',
    delayedProjects: 'Delayed Works',
    underReviewProjects: 'Under Review',
    recommendedProjects: 'Recommended',
    highRiskWorks: 'Flagged for Inspection',
    sanctionedAllocation: 'Sanctioned Allocation',
    expenditureVeracity: 'Funds Utilized',
    utilizationRate: 'Utilization Rate',
    worksRequiringAttention: 'Works Requiring Attention',
    recentAlerts: 'Recent Alerts & Anomalies',
    noPendingAlerts: 'No pending anomalies detected across active jurisdiction',
    reviewAlerts: 'Review Alerts',
    constituencyTrend: 'Constituency Progress & Expenditure Trend',
    integrityVectors: 'Integrity & Compliance Vectors',
    interactiveMapView: 'Interactive Map View',
    recommendNewWork: 'Recommend New Work',
    citizenViewTag: 'Citizen Transparency View',
    officerConsoleTag: '{role} Console',
    dashboardSubheading: 'Public transparency tracking of sanctioned community infrastructure, expenditure veracity, and on-ground completion.',
    mpOverviewTitle: 'Constituency Development & Allocation Overview',
    adminOverviewTitle: 'District Authority Oversight & Verification Dashboard',
    agencyOverviewTitle: 'Implementing Agency Workdesk & Progress Log',
    publicOverviewTitle: 'MPLADS National Transparency & Project Oversight',
    continuousOversightTitle: 'Continuous Oversight & Inspection Summary',
    continuousOversightTerm: 'Continuous Oversight',
    continuousOversightExplanation: 'Automated routine checks verify contractor invoices against standard district schedules and match site photographs with GPS coordinates.',
    continuousOversightDesc: 'Summary of items identified for district engineer review or field inspection.',
    costChecks: 'Cost Checks',
    costChecksNote: 'May exceed standard rate',
    potentialDuplicates: 'Potential Duplicates',
    duplicatesNote: 'Co-located within 50m',
    photoVerification: 'Photo Verification',
    photoVerificationNote: 'Valid EXIF & timestamp',
    locationAccuracy: 'Location Accuracy',
    locationAccuracyNote: 'Within 250m perimeter',
    highRiskWorksNeedingReview: 'High-Risk Works Requiring Technical Review',
    highRiskWorksDesc: 'Prioritized by composite anomaly score combining cost deviations, duplicate flags, and timeline delays.',
    aiIntegrityAnomalies: 'AI Vigilance & Integrity Discrepancies',
    aiIntegrityAnomaliesDesc: 'Automated algorithmic alerts flagged for District Authority human review.',
    viewAllAnomalies: 'View All Anomalies',
    viewAllWorks: 'View All Works',
    noHighRiskProjects: 'No projects currently flagged with high risk scores.',
    auditDetails: 'Audit Details',

    // Projects Specific
    projectsPageTitle: 'Constituency Development Works Directory',
    projectsPageSubtitle: 'Official register of sanctioned and ongoing community assets under MPLADS',
    searchProjectsPlaceholder: 'Search by project code, title, address, vendor...',
    allCategories: 'All Categories',
    allDistricts: 'All Districts',
    allStatuses: 'All Statuses',
    allRiskLevels: 'All Risk Levels',
    sortBy: 'Sort By',
    sortRisk: 'Integrity Risk',
    sortCost: 'Sanctioned Cost',
    sortProgress: 'Physical Progress',
    sortCode: 'Project Code',
    projectDetails: 'Project Details',
    tabOverview: 'Overview & Specs',
    tabAiRisk: 'AI Integrity Analysis',
    tabPhotos: 'Ground Photos & EXIF',
    tabFinancials: 'Financial Disbursals',
    tabDocuments: 'Sanctions & Orders',
    tabAuditReport: 'Automated Audit Report',
    noProjectsFound: 'No matching projects found. Adjust your search query or filters.',
    physicalProgress: 'Physical Progress',
    completionPercentage: 'Completion',
    vendorAssigned: 'Contractor / Vendor',
    implementingAgency: 'Implementing Agency',
    sanctionDate: 'Sanction Date',
    targetCompletion: 'Target Completion',
    actualCompletion: 'Actual Completion',
    startDate: 'Commencement Date',
    workId: 'Work ID / Project Code',
    locationAddress: 'Location Address',
    showingProjectsCount: 'Showing {filtered} of {total} developmental works',
    workTitleAndCategory: 'Work Title & Category',
    locationAndDistrict: 'Location & District',
    costLakh: 'Cost (Lakh)',
    aiRisk: 'AI Risk',

    // Financials & Funds Ledger
    fundsPageTitle: 'MPLADS Financial Ledger & Fund Disbursals',
    fundsPageSubtitle: 'Statutory annual entitlement tracking (₹5.00 Crore per fiscal year) under MoSPI Guidelines',
    annualEntitlement: 'Annual Entitlement',
    perConstituency: 'Per Parliamentary Constituency',
    sanctionedWorks: 'Sanctioned Works',
    allocatedPct: '{pct}% of annual cap allocated',
    disbursedUtilized: 'Disbursed & Utilized',
    utilizedPct: '{pct}% of sanctioned funds disbursed',
    uncommittedBalance: 'Uncommitted Balance',
    availableForSanction: 'Available for fresh recommendations',
    transactionLedger: 'Installment Disbursal Ledger',
    categoryBreakdown: 'Sectoral Fund Allocation',
    installmentNo: 'Installment #{no}',
    disbursedOn: 'Disbursed on {date}',
    sanctionOrder: 'Sanction Order: {order}',
    beneficiaryAgency: 'Beneficiary Agency',
    sectoralAllocation: 'Developmental Category Expenditure Allocation',
    sanctionedColon: 'Sanctioned:',
    utilizedColon: 'Utilized:',
    spent: 'spent',
    certifiedPaymentsLedger: 'Certified Milestone Payments Ledger',
    disbursalsCount: '{count} Disbursals',
    sanctionOrderRef: 'Sanction Order Ref',
    projectTitle: 'Project Title',
    amountInr: 'Amount (INR)',
    disbursedDate: 'Disbursed Date',
    physicalExecutionDrawdown: 'Physical execution drawdown:',

    // Alerts & Vigilance Review
    alertsPageTitle: 'AI Alert Management & Vigilance Review Desk',
    alertsPageSubtitle: 'District Authority human adjudication queue for AI-detected discrepancies',
    pendingAdjudication: '{count} Pending Adjudication',
    alertTypeLabel: 'Alert Type:',
    reviewStatusLabel: 'Review Status:',
    takeAction: 'Take Adjudication Action',
    noAlertsFound: 'No alerts matching the selected filter criteria.',
    reasonFindings: 'Reason / Findings',
    technicalDetails: 'Technical Evidence',
    assignedOfficer: 'Assigned Officer',
    reviewNotes: 'Review Notes',
    actionModalTitle: 'Adjudicate Alert: {code}',
    actionResolve: 'Mark Resolved & Validate',
    actionEscalate: 'Escalate for Ground Inspection',
    actionFalsePositive: 'Mark as False Positive',
    actionNotesPlaceholder: 'Enter official reasoning and adjudication notes...',
    aiAlertManagementTitle: 'AI Alert Management & Vigilance Review Desk',
    aiAlertManagementSubtitle: 'District Authority human adjudication queue for AI-detected discrepancies',
    alertRef: 'Alert Ref',
    anomalyType: 'Anomaly Type',
    associatedProject: 'Associated Project',
    districtAndAgency: 'District & Agency',
    detectionObservation: 'Detection Observation',
    administrativeAction: 'Administrative Action',
    takeActionBtn: 'Take Action',
    showingAlertsCount: 'Showing {filtered} of {total} registered alerts',
    noAlertsMatchCriteria: 'No alerts match selected criteria.',

    // Evidence & Verification
    verificationPageTitle: 'Cryptographic Evidence & Multi-Modal Verification',
    verificationPageSubtitle: 'Anti-tampering analysis: GPS geofencing, EXIF timestamp verification, and perceptual image hashing',
    integrityIndex: 'Evidence Integrity Index',
    tamperAnalysis: 'Error Level & Tamper Analysis',
    gpsGeofenceDistance: 'GPS Geofence Distance',
    cameraMetadata: 'Camera & Timestamp Metadata',
    perceptualDuplicateHash: 'Perceptual Duplicate Hash',
    withinSite: 'Within 100m site threshold',
    locationMismatch: 'Exceeds permissible distance threshold',
    verifiedAuthentic: 'Verified Authentic',
    aiSynthesized: 'Possible AI Generated / Filtered',
    verified: 'Verified',
    underReview: 'Under Review',
    sanctioned: 'Sanctioned Allocation',
    utilized: 'Funds Utilized',
    publicTransparencyVerification: 'Public Transparency Verification',
    officialMospiFeed: 'Official MoSPI Feed',
    projectVerificationStatusTitle: 'Project Verification Status',
    projectVerificationStatusDesc: 'Every MPLADS project undergoes field milestone checks, photographic matching, and financial auditing. Inspect verification records below in simple language.',
    verificationProcessTerm: 'Verification Process',
    verificationProcessExplanation: "Works are labeled 'Verified' when photographs match GPS locations and expenditures align with official estimates. 'Under Review' works are awaiting documentation, and 'Flagged' works require field inspection.",
    verifiedWorks: 'Verified Works',
    underReviewWorks: 'Works Under Review',
    flaggedWorks: 'Flagged for Inspection',
    allWorksFilter: 'All Works',
    searchVerificationPlaceholder: 'Search by project code, title, constituency...',
    workVerificationCard: 'Work Verification Card',
    photographicTelemetry: 'Photographic Telemetry',
    gpsAccuracy: 'GPS Accuracy',
    financialAlignment: 'Financial Alignment',
    physicalInspection: 'Physical Inspection',
    verifiedDesc: 'All photographic, GPS, and expenditure milestones verified authentic.',
    underReviewDesc: 'Awaiting supplementary documentation or engineer certification.',
    flaggedDesc: 'Discrepancy detected. Scheduled for executive engineer ground inspection.',
    viewFullInspectionReport: 'View Full Inspection Report',
    noVerificationRecordsMatch: 'No verification records match selected criteria.',

    // Reports
    reportsPageTitle: 'Official Scheme Reports & Statutory Audits',
    reportsPageSubtitle: 'Download verified compliance reports, financial summaries, and constituency progress sheets',
    generatePdf: 'Generate Official Gazette PDF',
    downloadExcel: 'Download Master Excel Sheet',
    auditCompliance: 'MoSPI 2023 Guidelines Compliance',
    constituencyPerformance: 'Constituency Execution Scorecard',
    officialReportsTitle: 'Official Audit Reports & Data Export Center',
    officialReportsSubtitle: 'Standardized MoSPI compliance documentation, CAG audit tables, and vigilance briefs',
    printOfficialBrief: 'Print Official Brief',
    exportCsvDataset: 'Export CSV Dataset',
    selectReportType: 'Select Report Template',
    masterAuditReport: 'Master Works & Expenditure Audit',
    riskVigilanceReport: 'AI Vigilance & Anomaly Register',
    financialLedgerReport: 'Statutory Financial Ledger',
    agencyScorecardReport: 'Implementing Agency Delivery Scorecard',
    reportGeneratedNotice: 'Report generated from live MoSPI cryptographically anchored records.',

    // Citizen Feedback & Ground Observations
    feedbackPageTitle: 'Citizen Feedback & Ground Observation Desk',
    feedbackPageSubtitle: 'Direct public monitoring and grievance reporting from local constituency residents',
    reportObservation: 'Report Ground Observation / Feedback',
    issueType: 'Nature of Issue',
    citizenName: 'Citizen Name',
    citizenContact: 'Contact Number (Optional)',
    description: 'Ground Observation Details',
    selectProject: 'Select Developmental Project',
    submitFeedback: 'Submit Citizen Observation',
    feedbackSubmittedSuccess: 'Observation registered successfully! Tracking ID: {id}',
    publicGrievances: 'Recent Ground Observations',
    noFeedbackYet: 'No public grievances registered yet. Be the first to share ground observation!',
    citizenFeedbackTitle: 'Citizen Grievance Redressal & Public Feedback',
    citizenFeedbackSubtitle: 'Whistleblower reports and public civil works monitoring directly submitted to District Authority',
    registerNewGrievance: 'Register New Citizen Grievance',
    noGrievancesJurisdiction: 'No public grievances registered in jurisdiction.',
    reportedOn: 'Reported on:',
    associatedProjectColon: 'Associated Project:',
    citizenWhistleblowerReport: 'Citizen Observation / Whistleblower Report:',
    authorityActionLog: 'District Authority Action & Adjudication Log:',
    adjudicateGrievance: 'Adjudicate Grievance',
    adjudicateGrievanceTitle: 'Official Grievance Adjudication',
    updateStatus: 'Update Status',
    adjudicationNotes: 'Adjudication Notes / Action Taken',
    adjudicationNotesPlaceholder: 'Enter administrative action taken or field inspection notes...',
    updating: 'Updating...',

    // AI Vigilance & Anomalies
    vigilanceDecisionEngine: 'Vigilance Decision Support Engine',
    aiAnomaliesTitle: 'AI Integrity & Anomaly Detection Center',
    aiAnomaliesSubtitle: 'Continuous algorithmic surveillance cross-verifying financial allocations, geospatial duplicates, physical photographic metadata, and execution trajectories under MoSPI guidelines.',
    statutoryAdvisory: 'Statutory Administrative Advisory:',
    statutoryAdvisoryText: 'The AI risk score is an indicator for human review, not proof of fraud or corruption. All flagged items require on-site technical inspection by an authorized Executive Engineer or Sub-Divisional Magistrate.',
    allModulesOverview: 'All Modules Overview',
    costBenchmarkAnomalies: '1. Cost Benchmark Anomalies',
    spatialDuplicateDetection: '2. Spatial Duplicate Detection',
    photoIntegrityAnomalies: '3. Photo & Telemetry Integrity',
    locationMismatchAnomalies: '4. GPS Geofence Mismatch',
    executionDelayRisks: '5. Execution Trajectory Delays',
    sanctionedCost: 'Sanctioned Cost',
    benchmarkCost: 'Benchmark Cost',
    costDeviation: 'Cost Deviation',
    investigateWork: 'Investigate Work',
    inspectEvidence: 'Inspect Evidence',
    inspectGroundPhotos: 'Inspect Ground Photos',
    inspectGpsCoordinates: 'Inspect GPS Coordinates',

    // Agency Workdesk
    agencyWorkdeskTitle: 'Implementing Agency Field Workdesk',
    agencyWorkdeskSubtitle: 'Execution tracking, milestone verification, geotagged photograph uploads, and payment vouchers',
    agencyProtocolNotice: 'Agency Protocol Notice:',
    agencyProtocolDesc: 'Photographic submissions must contain authentic EXIF GPS telemetry within 250 meters of the sanctioned site. Duplicate image re-use across projects is tracked automatically and triggers vigilance audit.',
    updateProgressAndPhotos: 'Update Progress & Upload Photos',
    submitPaymentClaim: 'Submit Payment Voucher',
    paymentClaimTitle: 'Submit Certified Payment Voucher',
    claimAmountLakhLabel: 'Claim Amount (₹ Lakh)',
    voucherRemarksLabel: 'Milestone / Voucher Remarks',
    voucherRemarksPlaceholder: 'e.g., Stage 2 Plinth & Column completion invoice certified by site engineer',
    submittingVoucher: 'Submitting...',
    submitVoucherBtn: 'Submit Voucher',

    // Vendor Analytics
    vendorMatrixTitle: 'Contractor & Vendor Concentration Matrix',
    vendorMatrixSubtitle: 'Vigilance profiling tracking contractor allocation caps, execution delays, and risk concentration',
    antiCartelizationNotice: 'Anti-Cartelization & Concentration Vigilance:',
    antiCartelizationDesc: 'Under CVC (Central Vigilance Commission) directives, high concentration of projects or repeat delays under single contractors trigger automated alerts to prevent monopolistic distribution of constituency works.',
    registeredGovtContractor: 'Registered Govt Contractor',
    totalWorks: 'Total Works',
    contractValue: 'Contract Value',
    completedWorks: 'Completed',
    delayedOrAtRisk: 'Delayed / At Risk',
    timelyCompletionRate: 'Timely Completion Rate',
    categoriesLabel: 'Categories',
    loadingVendorAnalytics: 'Loading vendor integrity analytics...',

    // Audit Logs
    auditLogTitle: 'Tamper-Evident System Audit Trail & Security Logs',
    auditLogSubtitle: 'Cryptographically chained SHA-256 ledger recording all administrative, financial, and AI verification events',
    verifyIntegrityBtn: 'Verify Cryptographic Integrity',
    validatingHashes: 'Validating Hashes...',
    hashChainVerified: 'Cryptographic Hash Chain Verified: 100% Intact ({count} Entries)',
    hashChainBroken: 'Integrity Anomaly: Broken chain detected at {id}',
    genesisAnchorValidated: 'Genesis Anchor Validated',
    algorithm: 'Algorithm:',
    verifiedAt: 'Verified At:',
    loadingAuditSequence: 'Verifying & loading immutable audit sequence...',

    // Data Ingestion Impact
    dataIngestionTitle: 'Data Ingestion, Schema Normalization & Anomaly Impact Studio',
    dataIngestionSubtitle: 'Multi-source bulk batch processing, automated AI data quality scoring, and cryptographic audit trail tamper simulation',
    ingestSampleData: 'Ingest MoSPI Batch Export',
    simulateTamper: 'Simulate Tamper Attack',
    verifyAuditChain: 'Verify Ledger Chain',
    restoreChain: 'Restore Tampered Chain',

    // Contractor Network Fraud
    networkFraudTitle: 'Contractor & Vendor Network Fraud Detection',
    networkFraudSubtitle: 'Models relationships across Contractors, Members of Parliament, Implementing Districts, and Projects to identify shell collusion cartels.',
    graphAnalyticsBadge: 'Graph Analytics & Shell Detection',
    recomputeGraph: 'Recompute Graph',
    contractorsAudited: 'Contractors Audited',
    collusionRingsFlagged: 'Collusion Rings Flagged',
    graphEdgesModeled: 'Graph Edges Modeled',
    allVendors: 'All Contractors',
    suspiciousOnly: 'Suspicious Only',
    shellOnly: 'Shell Indicators Only',

    // Recommendations Page
    recommendationsTitle: 'MP Recommendations & Administrative Sanctions',
    recommendationsSubtitle: 'Work proposal lifecycle from Member of Parliament submission to District Authority technical sanction',
    submitNewRecommendation: 'Submit New Recommendation',
    noRecommendationsLogged: 'No active recommendations currently logged.',
    sanctionWorkBtn: 'Sanction Work',
    sanctionWorkModalTitle: 'Sanction Project: {code}',
    sanctionAmountLakhLabel: 'Sanction Amount (₹ Lakh)',
    sanctionRemarksLabel: 'Sanction Order Number & Remarks',
    sanctionRemarksPlaceholder: 'e.g., Sanction Order No. DC/MPLADS/2024/781 approved following site feasibility check',
    sanctioning: 'Sanctioning...',

    // Citizen Chatbot
    chatbotTitle: 'MPLADS Citizen Inquiry AI',
    chatbotGroundedBadge: 'RAG Grounded',
    chatbotSubheading: 'Official Assistant • MoSPI Public Portal',
    chatbotWelcomeMessage: 'Namaste! I am the Official MPLADS Public Transparency AI Assistant. You can ask me in English or Hindi (हिन्दी) about any developmental project, sanction status, or expenditure in your constituency.',
    chatbotInputPlaceholder: 'Ask about projects, budgets, delays in English or Hindi...',
    askMpladsAi: 'Ask MPLADS AI',
    sendQuery: 'Send',
    retrievingRecords: 'Retrieving verified official records...',
    rateLimitNotice: 'Notice: Rate-limited for system availability',
    chatbotDisclaimer: 'Grounded exclusively in official MoSPI MPLADS project records. Quoting exact figures.',
    quickPrompt1: 'हैदराबाद में स्कूल निर्माण परियोजनाओं की क्या स्थिति है?',
    quickPrompt2: 'Which projects are flagged as delayed or high risk?',
    quickPrompt3: 'What is the sanctioned budget for Community Hall in Ward 14?',
    quickPrompt4: 'संसदीय क्षेत्र में कुल कितनी धनराशि स्वीकृत हुई है?',

    // Authentication & Login
    loginTitle: 'Official Authentication Gateway',
    loginSubtitle: 'Members of Parliament & District Authorities Portal',
    userIdLabel: 'Departmental User ID',
    passwordLabel: 'Password',
    signInBtn: 'Secure Sign In',
    enterPublicPortal: 'Enter Citizen Transparency Portal',
    backToSchemeHome: 'Back to Scheme Home',
    invalidCredentialsTitle: 'Invalid credentials',
    invalidCredentialsMsg: 'The User ID or password you entered does not match authorized records.',
    invalidCredentialsSug: 'Please verify your departmental User ID and password.',
    serverUnreachableTitle: 'Server unreachable',
    serverUnreachableMsg: 'Unable to establish a secure connection with the central authentication service.',
    serverUnreachableSug: 'Please check your network connection or verify that the server is online.',
    authFailedTitle: 'Authentication Failed',
    authFailedSug: 'Please verify your credentials and try again.',
    demoCredentialsHelp: 'Demo Credentials Reference',
    mpLogin: 'Member of Parliament',
    adminLogin: 'District Collector / Admin',
    agencyLogin: 'Implementing Agency',
    verifyingSession: 'Verifying authorized session...',

    // Notification Center
    notificationsTitle: 'Official Notifications',
    unreadCountText: '{count} new',
    allCaughtUpText: 'All caught up',
    markAllReadText: 'Mark all notifications as read',
    resetBaselineText: 'Reset notifications to baseline initial state',
    loadingNotificationsText: 'Loading notifications...',
    emptyNotificationsTitle: 'No notifications',
    emptyNotificationsDesc: "You're all caught up with recent updates",
    markAsReadText: 'Mark as read',
    viewProjectText: 'View project',
    viewAlertText: 'View alert',

    // Landing Page Specific
    landingHeroTitle: 'Citizen Transparency Portal for MPLADS Developmental Assets',
    landingHeroSubtitle: 'Public oversight platform tracking sanctioned community infrastructure, expenditure veracity, and on-ground completion across Indian parliamentary constituencies.',
    lokSabha: 'Lok Sabha',
    rajyaSabha: 'Rajya Sabha',
    mpLedgerTab: 'MP-wise Ledger Summary',
    worksListTab: 'Constituency Works Directory',
    searchLandingPlaceholder: 'Search by MP name, constituency, district, state, or project...',
    advancedFilters: 'Advanced Filters',
    tenureLabel: 'Tenure',
    sectorLabel: 'Sector',
    financialYearLabel: 'Financial Year',
    allocatedCrLabel: 'Allocated (₹ Cr)',
    recommendedCrLabel: 'Recommended (₹ Cr)',
    sanctionedCrLabel: 'Sanctioned (₹ Cr)',
    utilizedCrLabel: 'Utilized (₹ Cr)',
    worksRecommendedLabel: 'Works Recommended',
    worksSanctionedLabel: 'Works Sanctioned',
    worksCompletedLabel: 'Works Completed',
    viewWorksLabel: 'View Works',
    noMpsFound: 'No MP records match the current filter selection.',

    // Additional System & Anomalies Keys
    gisSurveillance: 'GIS Surveillance',
    gisMapTitle: 'Geographic Information System (GIS) Surveillance',
    gisMapSubtitle: 'Georeferenced project footprints, territorial proximity analysis, and duplicate cluster detection',
    loadingMpladsDataset: 'Loading official MPLADS dataset & executing AI integrity heuristics...',
    auditBoqJustification: 'Audit BOQ & Justification',
    actionRequired: 'Action Required',
    siteReconciliation: 'Site Reconciliation',
    inspectSubmittedPhotographs: 'Inspect Submitted Photographs',
    closeInspector: 'Close Inspector',
    openInProjectWorkspace: 'Open in Project Workspace',
    issueShowCauseRule14: 'Issue Show-Cause Notice under Rule 14',
    directSdmFieldVerification: 'Direct SDM Field Verification',
    investigateAndResolve: 'Investigate & Resolve',
    pendingAdjudicationText: 'Pending Adjudication',
    registeredAlertsCount: 'Showing {filtered} of {total} registered alerts',
    filterByType: 'Alert Type',
    filterByStatus: 'Review Status',
    allTypes: 'All',
    alertRefHeader: 'Alert Ref',
    anomalyTypeHeader: 'Anomaly Type',
    associatedProjectHeader: 'Associated Project',
    districtAgencyHeader: 'District & Agency',
    detectionObservationHeader: 'Detection Observation',
    reviewStatusHeader: 'Review Status',
    administrativeActionHeader: 'Administrative Action',
    estimatedProposal: 'Estimated Proposal',
    sanctionOrderAndRemarks: 'Sanction Order Number & Remarks'
  },
  hi: {
    // Brand / Portal
    portalName: 'सांसद निधि पारदर्शिता पोर्टल',
    portalTagline: 'सांसद स्थानीय क्षेत्र विकास योजना (MPLADS)',
    govIndia: 'भारत सरकार',
    mospiTitle: 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)',
    mpladsFullName: 'सांसद स्थानीय क्षेत्र विकास योजना (MPLADS) — स्थानीय विकास कार्यों हेतु केंद्रीय योजना',
    officialBadge: 'आधिकारिक',
    nicGov: 'राष्ट्रीय सूचना विज्ञान केंद्र (NIC) • MoSPI, नई दिल्ली',
    footerCompliance: 'आधिकारिक सरकारी संस्थागत पोर्टल • MoSPI 2023 दिशानिर्देश एवं SIH मानकों के अनुरूप',

    // Navigation Tabs & Headers
    home: 'होम / डैशबोर्ड',
    projects: 'परियोजनाएं',
    funds: 'निधि ट्रैकिंग',
    alerts: 'समीक्षा व अलर्ट',
    verification: 'सत्यापन स्थिति',
    reports: 'रिपोर्ट एवं विवरण',
    feedback: 'नागरिक प्रतिपुष्टि',
    gisMap: 'भौगोलिक जीआईएस मानचित्र',
    recommendWork: 'नया कार्य अनुशंसित करें',
    agencyBilling: 'एजेंसी कार्यडेस्क',
    contractorGraph: 'ठेकेदार नेटवर्क विश्लेषण',
    auditTrail: 'लेखापरीक्षा लॉग',
    dataIngestion: 'डेटा अंतर्ग्रहण व प्रभाव',
    help: 'सहायता व चैटबॉट',
    officerLogin: 'अधिकारी लॉगिन',
    publicView: 'नागरिक पोर्टल',
    citizenPortal: 'नागरिक पारदर्शिता पोर्टल',
    signOut: 'लॉगआउट / बदलें',
    authenticatedOfficial: 'प्रमाणित अधिकारी',
    roleAuthority: 'पद प्राधिकार',
    districtJurisdiction: 'ज़िला क्षेत्राधिकार',
    officialSessionActive: 'सक्रिय आधिकारिक सत्र',
    officerOperations: 'अधिकारी संचालन',
    mappingLocation: 'मानचित्रण और स्थान',
    restrictedTools: 'प्रतिबंधित फोरेंसिक उपकरण',
    activeOfficerSession: 'सक्रिय अधिकारी सत्र',
    returnToHome: 'योजना पोर्टल होम पर वापस जाएं',
    switchToOfficer: 'अधिकारी कार्यक्षेत्र पर जाएं',
    publicCitizenModeActive: 'नागरिक पारदर्शिता मोड सक्रिय',

    // Common UI Actions & Words
    search: 'खोजें',
    filter: 'फ़िल्टर',
    reset: 'रीसेट',
    clearFilters: 'फ़िल्टर हटाएं',
    export: 'निर्यात',
    exportCsv: 'CSV में निर्यात करें',
    exportExcel: 'एक्सेल में निर्यात करें',
    printReport: 'आधिकारिक राजपत्र प्रिंट करें',
    loading: 'लोड हो रहा है...',
    saving: 'सहेजा जा रहा है...',
    submitting: 'जमा किया जा रहा है...',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    submit: 'जमा करें',
    update: 'अपडेट करें',
    confirm: 'पुष्टि करें',
    delete: 'हटाएं',
    viewDetails: 'विवरण देखें',
    backTo: 'वापस जाएं',
    backToOverview: '← अवलोकन पर वापस जाएं',
    backToDashboard: '← डैशबोर्ड पर वापस जाएं',
    all: 'सभी',
    noData: 'कोई रिकॉर्ड नहीं मिला',
    actions: 'कार्रवाई',
    status: 'स्थिति',
    progress: 'प्रगति',
    date: 'तारीख',
    category: 'श्रेणी',
    district: 'ज़िला',
    state: 'राज्य',
    constituency: 'संसदीय क्षेत्र',
    mpName: 'सांसद का नाम',
    agency: 'कार्यान्वयन एजेंसी',
    vendor: 'ठेकेदार / विक्रेता',
    estimatedCost: 'अनुमानित लागत',
    sanctionedAmount: 'स्वीकृत राशि',
    fundsUtilized: 'उपयोग की गई राशि',
    riskLevel: 'जोखिम स्तर',
    riskScore: 'सत्यनिष्ठा / जोखिम सूचकांक',
    requiredField: 'यह फ़ील्ड अनिवार्य है',
    invalidValue: 'अमान्य मान दर्ज किया गया',
    saveSuccess: 'सफलतापूर्वक सहेजा गया',
    saveFailed: 'परिवर्तन सहेजने में विफल',
    official: 'आधिकारिक',
    whatDoesThisMean: 'इसका क्या अर्थ है?',
    plainGuidance: 'सरल भाषा मार्गदर्शन',
    clickToExplain: 'विवरण देखने के लिए क्लिक करें',
    previous: 'पिछला',
    next: 'अगला',
    showingResults: '{total} में से {start} से {end} रिकॉर्ड प्रदर्शित',
    pageOf: 'पृष्ठ {current} का {total}',
    total: 'कुल',
    srNo: 'क्र.सं.',
    completed: 'पूर्ण',
    active: 'सक्रिय',
    cr: 'करोड़',
    lakh: 'लाख',
    lakhShort: 'लाख',
    acrossWorks: '{count} स्थानीय विकास कार्यों में',
    reviewStatus: 'समीक्षा स्थिति',
    notices: 'नोटिस',
    flagged: 'चिह्नित',
    delayed: 'विलंबित',

    // Dashboard Specific
    totalProjects: 'कुल कार्य',
    completedProjects: 'पूर्ण कार्य',
    activeProjects: 'प्रगतिरत कार्य',
    delayedProjects: 'विलंबित कार्य',
    underReviewProjects: 'समीक्षाधीन',
    recommendedProjects: 'अनुशंसित',
    highRiskWorks: 'जांच हेतु चिह्नित',
    sanctionedAllocation: 'स्वीकृत आवंटन',
    expenditureVeracity: 'व्यय की गई राशि',
    utilizationRate: 'उपयोग दर',
    worksRequiringAttention: 'ध्यान देने योग्य कार्य',
    recentAlerts: 'हालिया अलर्ट और विसंगतियां',
    noPendingAlerts: 'सक्रिय क्षेत्राधिकार में कोई लंबित विसंगति नहीं पाई गई',
    reviewAlerts: 'अलर्ट की समीक्षा करें',
    constituencyTrend: 'संसदीय क्षेत्र प्रगति व व्यय रुझान',
    integrityVectors: 'सत्यनिष्ठा व अनुपालन मानक',
    interactiveMapView: 'इंटरैक्टिव मानचित्र',
    recommendNewWork: 'नया कार्य अनुशंसित करें',
    citizenViewTag: 'नागरिक पारदर्शिता दृश्य',
    officerConsoleTag: '{role} कंसोल',
    dashboardSubheading: 'स्वीकृत सामुदायिक अवसंरचना, व्यय प्रमाणिकता और धरातलीय कार्य की सार्वजनिक पारदर्शिता निगरानी।',
    mpOverviewTitle: 'संसदीय क्षेत्र विकास एवं आवंटन अवलोकन',
    adminOverviewTitle: 'ज़िला प्राधिकारी निगरानी एवं सत्यापन डैशबोर्ड',
    agencyOverviewTitle: 'कार्यान्वयन एजेंसी कार्यडेस्क एवं प्रगति लॉग',
    publicOverviewTitle: 'सांसद निधि राष्ट्रीय पारदर्शिता एवं परियोजना निगरानी',
    continuousOversightTitle: 'सतत निगरानी एवं निरीक्षण सारांश',
    continuousOversightTerm: 'सतत निगरानी',
    continuousOversightExplanation: 'स्वचालित नियमित जांच ठेकेदार के बिलों का मानक अनुसूची से मिलान करती है और साइट की तस्वीरों को जीपीएस निर्देशांक से सत्यापित करती है।',
    continuousOversightDesc: 'ज़िला अभियंता समीक्षा या ज़मीनी निरीक्षण के लिए चिह्नित वस्तुओं का सारांश।',
    costChecks: 'लागत सत्यापन',
    costChecksNote: 'मानक दर से अधिक संभावित',
    potentialDuplicates: 'संभावित डुप्लिकेट',
    duplicatesNote: '50 मी के भीतर सह-स्थित',
    photoVerification: 'फोटो सत्यापन',
    photoVerificationNote: 'मान्य EXIF एवं समय-मुहर',
    locationAccuracy: 'स्थान सटीकता',
    locationAccuracyNote: '250 मी परिधि के भीतर',
    highRiskWorksNeedingReview: 'तकनीकी समीक्षा हेतु उच्च जोखिम वाले कार्य',
    highRiskWorksDesc: 'लागत विचलन, डुप्लिकेट संकेत और समयसीमा विलंब के समग्र स्कोर द्वारा प्राथमिकता दी गई।',
    aiIntegrityAnomalies: 'एआई सतर्कता एवं सत्यनिष्ठा विसंगतियां',
    aiIntegrityAnomaliesDesc: 'ज़िला प्राधिकारी मानवीय समीक्षा हेतु स्वचालित एल्गोरिद्मिक अलर्ट।',
    viewAllAnomalies: 'सभी विसंगतियां देखें',
    viewAllWorks: 'सभी कार्य देखें',
    noHighRiskProjects: 'वर्तमान में कोई परियोजना उच्च जोखिम स्कोर के साथ चिह्नित नहीं है।',
    auditDetails: 'ऑडिट विवरण',

    // Projects Specific
    projectsPageTitle: 'संसदीय क्षेत्र विकास कार्य निर्देशिका',
    projectsPageSubtitle: 'सांसद निधि के तहत स्वीकृत और प्रगतिरत सामुदायिक संपत्तियों का आधिकारिक रजिस्टर',
    searchProjectsPlaceholder: 'परियोजना कोड, शीर्षक, स्थान, विक्रेता द्वारा खोजें...',
    allCategories: 'सभी श्रेणियां',
    allDistricts: 'सभी ज़िले',
    allStatuses: 'सभी स्थितियां',
    allRiskLevels: 'सभी जोखिम स्तर',
    sortBy: 'क्रमबद्ध करें',
    sortRisk: 'जोखिम सूचकांक',
    sortCost: 'स्वीकृत लागत',
    sortProgress: 'भौतिक प्रगति',
    sortCode: 'परियोजना कोड',
    projectDetails: 'परियोजना विवरण',
    tabOverview: 'अवलोकन व विवरण',
    tabAiRisk: 'एआई सत्यनिष्ठा विश्लेषण',
    tabPhotos: 'धरातलीय फोटो व डेटा',
    tabFinancials: 'वित्तीय संवितरण',
    tabDocuments: 'स्वीकृति व आदेश',
    tabAuditReport: 'स्वचालित लेखापरीक्षा रिपोर्ट',
    noProjectsFound: 'कोई संबंधित परियोजना नहीं मिली। कृपया खोज या फ़िल्टर बदलें।',
    physicalProgress: 'भौतिक प्रगति',
    completionPercentage: 'पूर्णता',
    vendorAssigned: 'आवंटित ठेकेदार',
    implementingAgency: 'कार्यान्वयन एजेंसी',
    sanctionDate: 'स्वीकृति तिथि',
    targetCompletion: 'लक्ष्य समापन तिथि',
    actualCompletion: 'वास्तविक समापन तिथि',
    startDate: 'कार्य प्रारंभ तिथि',
    workId: 'कार्य आईडी / परियोजना कोड',
    locationAddress: 'स्थान का पता',
    showingProjectsCount: '{total} विकास कार्यों में से {filtered} प्रदर्शित',
    workTitleAndCategory: 'कार्य शीर्षक एवं श्रेणी',
    locationAndDistrict: 'स्थान एवं ज़िला',
    costLakh: 'लागत (लाख)',
    aiRisk: 'एआई जोखिम',

    // Financials & Funds Ledger
    fundsPageTitle: 'सांसद निधि वित्तीय बहीखाता और संवितरण',
    fundsPageSubtitle: 'MoSPI दिशानिर्देशों के तहत वैधानिक वार्षिक पात्रता (₹5.00 करोड़ प्रति वित्तीय वर्ष) की ट्रैकिंग',
    annualEntitlement: 'वार्षिक पात्रता',
    perConstituency: 'प्रति संसदीय निर्वाचन क्षेत्र',
    sanctionedWorks: 'स्वीकृत कार्य',
    allocatedPct: 'वार्षिक सीमा का {pct}% आवंटित',
    disbursedUtilized: 'संवितरित व उपयोग की गई राशि',
    utilizedPct: 'स्वीकृत निधि का {pct}% संवितरित',
    uncommittedBalance: 'अनावंटित शेष राशि',
    availableForSanction: 'नई अनुशंसाओं हेतु उपलब्ध',
    transactionLedger: 'किस्त संवितरण बहीखाता',
    categoryBreakdown: 'क्षेत्रवार निधि आवंटन',
    installmentNo: 'किस्त #{no}',
    disbursedOn: '{date} को संवितरित',
    sanctionOrder: 'स्वीकृति आदेश: {order}',
    beneficiaryAgency: 'लाभार्थी एजेंसी',
    sectoralAllocation: 'विकास श्रेणीवार व्यय आवंटन',
    sanctionedColon: 'स्वीकृत:',
    utilizedColon: 'उपयोग:',
    spent: 'व्यय',
    certifiedPaymentsLedger: 'प्रमाणित मील का पत्थर भुगतान खाता',
    disbursalsCount: '{count} संवितरण',
    sanctionOrderRef: 'स्वीकृति आदेश सं.',
    projectTitle: 'परियोजना शीर्षक',
    amountInr: 'राशि (रुपये)',
    disbursedDate: 'संवितरण तिथि',
    physicalExecutionDrawdown: 'भौतिक निष्पादन उपभोग:',

    // Alerts & Vigilance Review
    alertsPageTitle: 'एआई अलर्ट प्रबंधन एवं सतर्कता समीक्षा डेस्क',
    alertsPageSubtitle: 'एआई द्वारा पाई गई विसंगतियों के लिए ज़िला प्राधिकारी निर्णय कतार',
    pendingAdjudication: '{count} निर्णय लंबित',
    alertTypeLabel: 'अलर्ट प्रकार:',
    reviewStatusLabel: 'समीक्षा स्थिति:',
    takeAction: 'निर्णय कार्रवाई करें',
    noAlertsFound: 'चयनित फ़िल्टर के अनुसार कोई अलर्ट नहीं मिला।',
    reasonFindings: 'कारण / निष्कर्ष',
    technicalDetails: 'तकनीकी साक्ष्य',
    assignedOfficer: 'नियुक्त अधिकारी',
    reviewNotes: 'समीक्षा टिप्पणी',
    actionModalTitle: 'अलर्ट निर्णय: {code}',
    actionResolve: 'समाधानित चिह्नित करें',
    actionEscalate: 'धरातलीय निरीक्षण हेतु अग्रसारित करें',
    actionFalsePositive: 'गलत संकेत चिह्नित करें',
    actionNotesPlaceholder: 'आधिकारिक कारण और समीक्षा टिप्पणी दर्ज करें...',
    aiAlertManagementTitle: 'एआई अलर्ट प्रबंधन एवं सतर्कता समीक्षा डेस्क',
    aiAlertManagementSubtitle: 'एआई द्वारा खोजी गई विसंगतियों हेतु ज़िला प्राधिकारी मानवीय निर्णय कतार',
    alertRef: 'अलर्ट संदर्भ',
    anomalyType: 'विसंगति प्रकार',
    associatedProject: 'संबंधित परियोजना',
    districtAndAgency: 'ज़िला एवं एजेंसी',
    detectionObservation: 'पहचान अवलोकन',
    administrativeAction: 'प्रशासनिक कार्रवाई',
    takeActionBtn: 'कार्रवाई करें',
    showingAlertsCount: '{total} पंजीकृत अलर्ट में से {filtered} प्रदर्शित',
    noAlertsMatchCriteria: 'चयनित मानदंडों से मेल खाने वाला कोई अलर्ट नहीं है।',

    // Evidence & Verification
    verificationPageTitle: 'क्रिप्टोग्राफिक साक्ष्य एवं बहु-आयामी सत्यापन',
    verificationPageSubtitle: 'छेड़छाड़ रोधी विश्लेषण: जीपीएस जियोफेंसिंग, EXIF समय-मुहर सत्यापन, और इमेज हैशिंग',
    integrityIndex: 'साक्ष्य सत्यनिष्ठा सूचकांक',
    tamperAnalysis: 'छेड़छाड़ व संपादन विश्लेषण',
    gpsGeofenceDistance: 'जीपीएस जियोफेंस दूरी',
    cameraMetadata: 'कैमरा एवं समय-मुहर मेटाडेटा',
    perceptualDuplicateHash: 'प्रतिरूप/डुप्लिकेट फोटो पहचान',
    withinSite: 'साइट सीमा (100 मी) के भीतर',
    locationMismatch: 'स्वीकार्य दूरी सीमा से अधिक',
    verifiedAuthentic: 'प्रमाणित व प्रामाणिक',
    aiSynthesized: 'संभावित एआई निर्मित / फ़िल्टर की गई फोटो',
    verified: 'सत्यापित',
    underReview: 'समीक्षाधीन',
    sanctioned: 'स्वीकृत राशि',
    utilized: 'उपयोग की गई राशि',
    publicTransparencyVerification: 'सार्वजनिक पारदर्शिता सत्यापन',
    officialMospiFeed: 'आधिकारिक MoSPI फीड',
    projectVerificationStatusTitle: 'परियोजना सत्यापन स्थिति',
    projectVerificationStatusDesc: 'प्रत्येक सांसद निधि परियोजना में फील्ड मील के पत्थर की जांच, फोटो मिलान और वित्तीय ऑडिट किया जाता है। सरल भाषा में सत्यापन रिकॉर्ड देखें।',
    verificationProcessTerm: 'सत्यापन प्रक्रिया',
    verificationProcessExplanation: 'कार्यों को तब "सत्यापित" कहा जाता है जब तस्वीरें जीपीएस स्थानों से मेल खाती हैं और व्यय आधिकारिक अनुमानों के अनुरूप होता है। "समीक्षाधीन" कार्य दस्तावेजीकरण की प्रतीक्षा कर रहे हैं, और "जांच हेतु चिह्नित" कार्यों के लिए फील्ड निरीक्षण आवश्यक है।',
    verifiedWorks: 'सत्यापित कार्य',
    underReviewWorks: 'समीक्षाधीन कार्य',
    flaggedWorks: 'जांच हेतु चिह्नित कार्य',
    allWorksFilter: 'सभी कार्य',
    searchVerificationPlaceholder: 'परियोजना कोड, शीर्षक, संसदीय क्षेत्र द्वारा खोजें...',
    workVerificationCard: 'कार्य सत्यापन कार्ड',
    photographicTelemetry: 'फोटोग्राफिक टेलीमेट्री',
    gpsAccuracy: 'जीपीएस सटीकता',
    financialAlignment: 'वित्तीय संरेखण',
    physicalInspection: 'भौतिक निरीक्षण',
    verifiedDesc: 'सभी फोटोग्राफिक, जीपीएस और व्यय मील के पत्थर प्रामाणिक सत्यापित हैं।',
    underReviewDesc: 'पूरक दस्तावेज़ या अभियंता प्रमाणन की प्रतीक्षा है।',
    flaggedDesc: 'विसंगति पाई गई। कार्यपालक अभियंता धरातलीय निरीक्षण हेतु निर्धारित।',
    viewFullInspectionReport: 'पूर्ण निरीक्षण रिपोर्ट देखें',
    noVerificationRecordsMatch: 'चयनित मानदंडों से मेल खाने वाला कोई सत्यापन रिकॉर्ड नहीं है।',

    // Reports
    reportsPageTitle: 'आधिकारिक योजना रिपोर्ट एवं वैधानिक लेखापरीक्षा',
    reportsPageSubtitle: 'सत्यापित अनुपालन रिपोर्ट, वित्तीय सारांश और प्रगति पत्रक डाउनलोड करें',
    generatePdf: 'आधिकारिक राजपत्र पीडीएफ बनाएं',
    downloadExcel: 'मास्टर एक्सेल शीट डाउनलोड करें',
    auditCompliance: 'MoSPI 2023 दिशानिर्देश अनुपालन',
    constituencyPerformance: 'संसदीय क्षेत्र निष्पादन स्कोरकार्ड',
    officialReportsTitle: 'आधिकारिक ऑडिट रिपोर्ट एवं डेटा निर्यात केंद्र',
    officialReportsSubtitle: 'मानकीकृत MoSPI अनुपालन दस्तावेज़, CAG ऑडिट सारणियां एवं सतर्कता विवरण',
    printOfficialBrief: 'आधिकारिक विवरण प्रिंट करें',
    exportCsvDataset: 'सीएसवी डेटा निर्यात करें',
    selectReportType: 'रिपोर्ट प्रारूप चुनें',
    masterAuditReport: 'मास्टर कार्य एवं व्यय ऑडिट',
    riskVigilanceReport: 'एआई सतर्कता एवं विसंगति रजिस्टर',
    financialLedgerReport: 'वैधानिक वित्तीय बहीखाता',
    agencyScorecardReport: 'कार्यान्वयन एजेंसी निष्पादन स्कोरकार्ड',
    reportGeneratedNotice: 'लाइव MoSPI क्रिप्टोग्राफिक रूप से जुड़े रिकॉर्ड से तैयार रिपोर्ट।',

    // Citizen Feedback & Ground Observations
    feedbackPageTitle: 'नागरिक प्रतिपुष्टि एवं धरातलीय अवलोकन डेस्क',
    feedbackPageSubtitle: 'स्थानीय संसदीय क्षेत्र के नागरिकों द्वारा प्रत्यक्ष निगरानी एवं शिकायत दर्ज करने की सुविधा',
    reportObservation: 'धरातलीय अवलोकन / शिकायत दर्ज करें',
    issueType: 'समस्या का प्रकार',
    citizenName: 'नागरिक का नाम',
    citizenContact: 'संपर्क नंबर (वैकल्पिक)',
    description: 'धरातलीय अवलोकन विवरण',
    selectProject: 'विकास परियोजना चुनें',
    submitFeedback: 'नागरिक अवलोकन जमा करें',
    feedbackSubmittedSuccess: 'अवलोकन सफलतापूर्वक दर्ज किया गया! ट्रैकिंग आईडी: {id}',
    publicGrievances: 'हालिया धरातलीय अवलोकन',
    noFeedbackYet: 'अभी तक कोई नागरिक शिकायत दर्ज नहीं की गई है। पहला अवलोकन आप साझा करें!',
    citizenFeedbackTitle: 'नागरिक शिकायत निवारण एवं जन प्रतिक्रिया',
    citizenFeedbackSubtitle: 'सीधे ज़िला प्रशासन को प्रेषित विसलब्लोअर रिपोर्ट एवं सार्वजनिक निगरानी',
    registerNewGrievance: 'नई नागरिक शिकायत दर्ज करें',
    noGrievancesJurisdiction: 'अधिकार क्षेत्र में कोई सार्वजनिक शिकायत दर्ज नहीं है।',
    reportedOn: 'दर्ज तिथि:',
    associatedProjectColon: 'संबंधित परियोजना:',
    citizenWhistleblowerReport: 'नागरिक अवलोकन / विसलब्लोअर रिपोर्ट:',
    authorityActionLog: 'ज़िला प्राधिकारी कार्रवाई एवं निर्णय लॉग:',
    adjudicateGrievance: 'शिकायत का निवारण करें',
    adjudicateGrievanceTitle: 'आधिकारिक शिकायत निवारण',
    updateStatus: 'स्थिति अपडेट करें',
    adjudicationNotes: 'निर्णय टिप्पणी / की गई कार्रवाई',
    adjudicationNotesPlaceholder: 'की गई प्रशासनिक कार्रवाई या फील्ड निरीक्षण नोट दर्ज करें...',
    updating: 'अपडेट हो रहा है...',

    // AI Vigilance & Anomalies
    vigilanceDecisionEngine: 'सतर्कता निर्णय सहायता इंजन',
    aiAnomaliesTitle: 'एआई सत्यनिष्ठा एवं विसंगति पहचान केंद्र',
    aiAnomaliesSubtitle: 'MoSPI दिशानिर्देशों के तहत वित्तीय आवंटन, भू-स्थानिक डुप्लिकेट, फोटोग्राफिक मेटाडेटा और निष्पादन पथ की निरंतर निगरानी।',
    statutoryAdvisory: 'वैधानिक प्रशासनिक परामर्श:',
    statutoryAdvisoryText: 'एआई जोखिम स्कोर मानवीय समीक्षा के लिए एक संकेतक है, धोखाधड़ी का प्रमाण नहीं। सभी चिह्नित मदों के लिए अधिकृत कार्यपालक अभियंता या एसडीएम द्वारा ऑन-साइट तकनीकी निरीक्षण आवश्यक है।',
    allModulesOverview: 'सभी मॉड्यूल अवलोकन',
    costBenchmarkAnomalies: '1. लागत मानक विसंगतियां',
    spatialDuplicateDetection: '2. स्थानिक डुप्लिकेट पहचान',
    photoIntegrityAnomalies: '3. फोटो एवं टेलीमेट्री सत्यनिष्ठा',
    locationMismatchAnomalies: '4. जीपीएस जियोफेंस बेमेल',
    executionDelayRisks: '5. निष्पादन प्रक्षेपवक्र विलंब',
    sanctionedCost: 'स्वीकृत लागत',
    benchmarkCost: 'मानक लागत',
    costDeviation: 'लागत विचलन',
    investigateWork: 'कार्य की जांच करें',
    inspectEvidence: 'साक्ष्य का निरीक्षण करें',
    inspectGroundPhotos: 'धरातलीय फोटो जांचें',
    inspectGpsCoordinates: 'जीपीएस निर्देशांक जांचें',

    // Agency Workdesk
    agencyWorkdeskTitle: 'कार्यान्वयन एजेंसी कार्यडेस्क',
    agencyWorkdeskSubtitle: 'निष्पादन ट्रैकिंग, मील का पत्थर सत्यापन, जियोटैग्ड फोटो अपलोड और भुगतान वाउचर',
    agencyProtocolNotice: 'एजेंसी प्रोटोकॉल सूचना:',
    agencyProtocolDesc: 'फोटोग्राफिक सबमिशन में स्वीकृत साइट के 250 मीटर के भीतर प्रामाणिक EXIF GPS टेलीमेट्री होनी चाहिए। परियोजनाओं में डुप्लिकेट छवियों का पुन: उपयोग स्वचालित रूप से ट्रैक किया जाता है।',
    updateProgressAndPhotos: 'प्रगति अपडेट करें एवं फोटो अपलोड करें',
    submitPaymentClaim: 'भुगतान वाउचर प्रस्तुत करें',
    paymentClaimTitle: 'प्रमाणित भुगतान वाउचर प्रस्तुत करें',
    claimAmountLakhLabel: 'दावा राशि (₹ लाख)',
    voucherRemarksLabel: 'मील का पत्थर / वाउचर विवरण',
    voucherRemarksPlaceholder: 'उदा. साइट इंजीनियर द्वारा प्रमाणित चरण 2 प्लिंथ एवं कॉलम पूर्णता बिल',
    submittingVoucher: 'जमा हो रहा है...',
    submitVoucherBtn: 'वाउचर जमा करें',

    // Vendor Analytics
    vendorMatrixTitle: 'ठेकेदार एवं विक्रेता एकाग्रता मैट्रिक्स',
    vendorMatrixSubtitle: 'ठेकेदार आवंटन सीमा, निष्पादन विलंब और जोखिम एकाग्रता पर नज़र रखने वाली सतर्कता प्रोफाइलिंग',
    antiCartelizationNotice: 'एंटी-कार्टेलाइजेशन एवं एकाग्रता सतर्कता:',
    antiCartelizationDesc: 'सीवीसी (केंद्रीय सतर्कता आयोग) के निर्देशों के तहत, एकल ठेकेदारों के तहत परियोजनाओं की उच्च एकाग्रता या बार-बार विलंब स्वचालित अलर्ट ट्रिगर करता है।',
    registeredGovtContractor: 'पंजीकृत सरकारी ठेकेदार',
    totalWorks: 'कुल कार्य',
    contractValue: 'अनुबंध मूल्य',
    completedWorks: 'पूर्ण',
    delayedOrAtRisk: 'विलंबित / जोखिम पर',
    timelyCompletionRate: 'समय पर पूर्णता दर',
    categoriesLabel: 'श्रेणियां',
    loadingVendorAnalytics: 'विक्रेता सत्यनिष्ठा विश्लेषण लोड हो रहा है...',

    // Audit Logs
    auditLogTitle: 'अपरिवर्तनीय सिस्टम ऑडिट ट्रेल एवं सुरक्षा लॉग',
    auditLogSubtitle: 'प्रशासनिक, वित्तीय और एआई सत्यापन घटनाओं को रिकॉर्ड करने वाला क्रिप्टोग्राफिक SHA-256 खाता',
    verifyIntegrityBtn: 'क्रिप्टोग्राफिक अखंडता सत्यापित करें',
    validatingHashes: 'हैश सत्यापन जारी...',
    hashChainVerified: 'क्रिप्टोग्राफिक हैश श्रृंखला सत्यापित: 100% सुरक्षित ({count} प्रविष्टियां)',
    hashChainBroken: 'सत्यनिष्ठा विसंगति: {id} पर टूटी हुई श्रृंखला पाई गई',
    genesisAnchorValidated: 'जेनेसिस एंकर मान्य',
    algorithm: 'एल्गोरिदम:',
    verifiedAt: 'सत्यापन समय:',
    loadingAuditSequence: 'अपरिवर्तनीय ऑडिट अनुक्रम का सत्यापन एवं लोड किया जा रहा है...',

    // Data Ingestion Impact
    dataIngestionTitle: 'डेटा अंतर्ग्रहण, स्कीमा सामान्यीकरण एवं विसंगति प्रभाव स्टूडियो',
    dataIngestionSubtitle: 'मल्टी-सोर्स बल्क बैच प्रोसेसिंग, स्वचालित एआई डेटा गुणवत्ता स्कोरिंग, और ऑडिट ट्रेल सिमुलेशन',
    ingestSampleData: 'MoSPI बैच निर्यात अंतर्ग्रहण करें',
    simulateTamper: 'छेड़छाड़ हमले का अनुकरण करें',
    verifyAuditChain: 'बहीखाता श्रृंखला सत्यापित करें',
    restoreChain: 'छेड़छाड़ की गई श्रृंखला पुनर्स्थापित करें',

    // Contractor Network Fraud
    networkFraudTitle: 'ठेकेदार एवं विक्रेता नेटवर्क धोखाधड़ी पहचान',
    networkFraudSubtitle: 'शेल सांठगांठ कार्टेल की पहचान करने के लिए ठेकेदारों, सांसदों, कार्यान्वयन जिलों और परियोजनाओं के बीच संबंधों का मॉडल तैयार करता है।',
    graphAnalyticsBadge: 'ग्राफ एनालिटिक्स एवं शेल पहचान',
    recomputeGraph: 'ग्राफ की पुनर्गणना करें',
    contractorsAudited: 'ऑडिट किए गए ठेकेदार',
    collusionRingsFlagged: 'सांठगांठ रिंग चिह्नित',
    graphEdgesModeled: 'ग्राफ किनारे मॉडल किए गए',
    allVendors: 'सभी ठेकेदार',
    suspiciousOnly: 'केवल संदिग्ध',
    shellOnly: 'केवल शेल संकेतक',

    // Recommendations Page
    recommendationsTitle: 'सांसद अनुशंसाएं एवं प्रशासनिक स्वीकृतियां',
    recommendationsSubtitle: 'संसद सदस्य द्वारा कार्य प्रस्ताव प्रस्तुत करने से लेकर ज़िला प्राधिकरण द्वारा तकनीकी स्वीकृति तक का जीवनचक्र',
    submitNewRecommendation: 'नई अनुशंसा प्रस्तुत करें',
    noRecommendationsLogged: 'वर्तमान में कोई सक्रिय अनुशंसा दर्ज नहीं है।',
    sanctionWorkBtn: 'कार्य स्वीकृत करें',
    sanctionWorkModalTitle: 'परियोजना स्वीकृत करें: {code}',
    sanctionAmountLakhLabel: 'स्वीकृत राशि (₹ लाख)',
    sanctionRemarksLabel: 'स्वीकृति आदेश संख्या एवं टिप्पणी',
    sanctionRemarksPlaceholder: 'उदा. साइट व्यवहार्यता जांच के बाद स्वीकृत आदेश सं. DC/MPLADS/2024/781',
    sanctioning: 'स्वीकृत किया जा रहा है...',

    // Citizen Chatbot
    chatbotTitle: 'सांसद निधि नागरिक सहायता एआई',
    chatbotGroundedBadge: 'RAG सत्यापित',
    chatbotSubheading: 'आधिकारिक सहायक • MoSPI सार्वजनिक पोर्टल',
    chatbotWelcomeMessage: 'नमस्ते! मैं आधिकारिक सांसद निधि सार्वजनिक पारदर्शिता एआई सहायक हूँ। आप मुझसे अपने संसदीय क्षेत्र की किसी भी विकास परियोजना, स्वीकृति स्थिति या व्यय के बारे में अंग्रेजी या हिन्दी में पूछ सकते हैं।',
    chatbotInputPlaceholder: 'परियोजनाओं, बजट, प्रगति के बारे में अंग्रेजी या हिन्दी में पूछें...',
    askMpladsAi: 'सांसद निधि एआई से पूछें',
    sendQuery: 'भेजें',
    retrievingRecords: 'सत्यापित आधिकारिक रिकॉर्ड प्राप्त किए जा रहे हैं...',
    rateLimitNotice: 'सूचना: प्रणाली उपलब्धता बनाए रखने हेतु दर सीमित',
    chatbotDisclaimer: 'विशेष रूप से आधिकारिक MoSPI सांसद निधि रिकॉर्ड पर आधारित। सटीक आंकड़े उद्धृत।',
    quickPrompt1: 'हैदराबाद में स्कूल निर्माण परियोजनाओं की क्या स्थिति है?',
    quickPrompt2: 'Which projects are flagged as delayed or high risk?',
    quickPrompt3: 'What is the sanctioned budget for Community Hall in Ward 14?',
    quickPrompt4: 'संसदीय क्षेत्र में कुल कितनी धनराशि स्वीकृत हुई है?',

    // Authentication & Login
    loginTitle: 'आधिकारिक प्रमाणीकरण प्रवेश द्वार',
    loginSubtitle: 'सांसद एवं ज़िला प्राधिकारी पोर्टल',
    userIdLabel: 'विभागीय यूज़र आईडी',
    passwordLabel: 'पासवर्ड',
    signInBtn: 'सुरक्षित लॉगिन',
    enterPublicPortal: 'नागरिक पारदर्शिता पोर्टल पर जाएं',
    backToSchemeHome: 'योजना होम पर वापस जाएं',
    invalidCredentialsTitle: 'अमान्य क्रेडेंशियल्स',
    invalidCredentialsMsg: 'आपके द्वारा दर्ज किया गया यूज़र आईडी या पासवर्ड रिकॉर्ड से मेल नहीं खाता है।',
    invalidCredentialsSug: 'कृपया अपना विभागीय यूज़र आईडी और पासवर्ड सत्यापित करें।',
    serverUnreachableTitle: 'सर्वर अनुपलब्ध',
    serverUnreachableMsg: 'केंद्रीय प्रमाणीकरण सेवा के साथ सुरक्षित कनेक्शन स्थापित करने में असमर्थ।',
    serverUnreachableSug: 'कृपया अपना नेटवर्क कनेक्शन जांचें या सर्वर ऑनलाइन होने की पुष्टि करें।',
    authFailedTitle: 'प्रमाणीकरण विफल',
    authFailedSug: 'कृपया अपने क्रेडेंशियल्स सत्यापित करें और पुनः प्रयास करें।',
    demoCredentialsHelp: 'डेमो क्रेडेंशियल्स संदर्भ',
    mpLogin: 'संसद सदस्य (MP)',
    adminLogin: 'ज़िला कलेक्टर / एडमिन',
    agencyLogin: 'कार्यान्वयन एजेंसी',
    verifyingSession: 'प्राधिकृत सत्र सत्यापित किया जा रहा है...',

    // Notification Center
    notificationsTitle: 'आधिकारिक सूचनाएं',
    unreadCountText: '{count} नई',
    allCaughtUpText: 'सभी सूचनाएं देखी जा चुकी हैं',
    markAllReadText: 'सभी को पढ़ा हुआ चिह्नित करें',
    resetBaselineText: 'सूचनाओं को प्रारंभिक स्थिति में रीसेट करें',
    loadingNotificationsText: 'सूचनाएं लोड हो रही हैं...',
    emptyNotificationsTitle: 'कोई सूचना नहीं',
    emptyNotificationsDesc: 'आप हाल के सभी अपडेट देख चुके हैं',
    markAsReadText: 'पढ़ा हुआ चिह्नित करें',
    viewProjectText: 'परियोजना देखें',
    viewAlertText: 'अलर्ट देखें',

    // Landing Page Specific
    landingHeroTitle: 'सांसद निधि विकास संपत्तियों हेतु नागरिक पारदर्शिता पोर्टल',
    landingHeroSubtitle: 'भारतीय संसदीय क्षेत्रों में स्वीकृत सामुदायिक अवसंरचना, व्यय प्रमाणिकता और धरातलीय कार्य की सार्वजनिक निगरानी मंच।',
    lokSabha: 'लोकसभा',
    rajyaSabha: 'राज्यसभा',
    mpLedgerTab: 'सांसद-वार बहीखाता सारांश',
    worksListTab: 'संसदीय क्षेत्र कार्य निर्देशिका',
    searchLandingPlaceholder: 'सांसद का नाम, संसदीय क्षेत्र, ज़िला, राज्य या कार्य द्वारा खोजें...',
    advancedFilters: 'उन्नत फ़िल्टर',
    tenureLabel: 'कार्यकाल',
    sectorLabel: 'क्षेत्र/विभाग',
    financialYearLabel: 'वित्तीय वर्ष',
    allocatedCrLabel: 'आवंटित (₹ करोड़)',
    recommendedCrLabel: 'अनुशंसित (₹ करोड़)',
    sanctionedCrLabel: 'स्वीकृत (₹ करोड़)',
    utilizedCrLabel: 'व्यय (₹ करोड़)',
    worksRecommendedLabel: 'अनुशंसित कार्य',
    worksSanctionedLabel: 'स्वीकृत कार्य',
    worksCompletedLabel: 'पूर्ण कार्य',
    viewWorksLabel: 'कार्य देखें',
    noMpsFound: 'चयनित फ़िल्टर के अनुसार कोई सांसद रिकॉर्ड नहीं मिला।',

    // Additional System & Anomalies Keys
    gisSurveillance: 'जीआईएस निगरानी',
    gisMapTitle: 'भौगोलिक सूचना प्रणाली (GIS) निगरानी',
    gisMapSubtitle: 'जियोरेफरेंस परियोजना पदचिह्न, क्षेत्रीय निकटता विश्लेषण एवं डुप्लिकेट क्लस्टर पहचान',
    loadingMpladsDataset: 'आधिकारिक एमपीलैड्स डेटासेट लोड हो रहा है और एआई अखंडता विश्लेषण जारी है...',
    auditBoqJustification: 'बीओक्यू एवं औचित्य ऑडिट करें',
    actionRequired: 'कार्रवाई आवश्यक',
    siteReconciliation: 'साइट समाधान',
    inspectSubmittedPhotographs: 'प्रस्तुत तस्वीरों का निरीक्षण करें',
    closeInspector: 'निरीक्षक बंद करें',
    openInProjectWorkspace: 'परियोजना कार्यक्षेत्र में खोलें',
    issueShowCauseRule14: 'नियम 14 के तहत कारण बताओ नोटिस जारी करें',
    directSdmFieldVerification: 'एसडीएम फील्ड सत्यापन का निर्देश दें',
    investigateAndResolve: 'जांच एवं समाधान करें',
    pendingAdjudicationText: 'निर्णय हेतु लंबित',
    registeredAlertsCount: '{total} पंजीकृत अलर्ट में से {filtered} प्रदर्शित',
    filterByType: 'अलर्ट प्रकार',
    filterByStatus: 'समीक्षा स्थिति',
    allTypes: 'सभी',
    alertRefHeader: 'अलर्ट संदर्भ',
    anomalyTypeHeader: 'विसंगति प्रकार',
    associatedProjectHeader: 'संबद्ध परियोजना',
    districtAgencyHeader: 'ज़िला एवं एजेंसी',
    detectionObservationHeader: 'पहचान अवलोकन',
    reviewStatusHeader: 'समीक्षा स्थिति',
    administrativeActionHeader: 'प्रशासनिक कार्रवाई',
    estimatedProposal: 'अनुमानित प्रस्ताव',
    sanctionOrderAndRemarks: 'स्वीकृति आदेश संख्या एवं टिप्पणियां'
  }
};
