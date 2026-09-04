import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Project, RiskAlert, DashboardSummary, CitizenFeedback } from './types/index.js';
import { api } from './services/api.js';

// Layout Components
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { GISMap } from './components/GISMap.js';
import { ProjectModal } from './components/ProjectModal.js';
import { RecommendModal } from './components/RecommendModal.js';
import { AlertActionModal } from './components/AlertActionModal.js';

// Pages
import { LoginPage } from './pages/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProjectsPage } from './pages/ProjectsPage.js';
import { AiAnomaliesPage } from './pages/AiAnomaliesPage.js';
import { AlertManagementPage } from './pages/AlertManagementPage.js';
import { RecommendationsPage } from './pages/RecommendationsPage.js';
import { FundsLedgerPage } from './pages/FundsLedgerPage.js';
import { AgencyWorkdeskPage } from './pages/AgencyWorkdeskPage.js';
import { VendorAnalyticsPage } from './pages/VendorAnalyticsPage.js';
import { CitizenFeedbackPage } from './pages/CitizenFeedbackPage.js';
import { ReportsPage } from './pages/ReportsPage.js';
import { AuditLogPage } from './pages/AuditLogPage.js';

import { AlertTriangle, RefreshCw } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { user, currentUser, isPublicMode, enterPublicMode, logout, loading: authLoading } = useAuth();
  const effectiveUser = user || currentUser;

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Core Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [feedbackList, setFeedbackList] = useState<CitizenFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Active Modals State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isRecommendOpen, setIsRecommendOpen] = useState<boolean>(false);
  const [activeAlertForAction, setActiveAlertForAction] = useState<RiskAlert | null>(null);

  const effectiveRole = isPublicMode ? 'PUBLIC' : effectiveUser?.role || 'PUBLIC';

  // Load All Primary Data
  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [projectsRes, alertsRes, summaryRes, feedbackRes] = await Promise.all([
        api.getProjects(),
        api.getAlerts().catch(() => ({ alerts: [] })),
        api.getDashboardSummary().catch(() => null),
        api.getCitizenFeedback().catch(() => ({ feedback: [] }))
      ]);

      setProjects(projectsRes.projects || []);
      setAlerts(alertsRes.alerts || []);
      setSummary(summaryRes || null);
      setFeedbackList(feedbackRes.feedback || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (effectiveUser || isPublicMode) {
      fetchData();
    }
  }, [effectiveUser, isPublicMode, fetchData]);

  // While restoring session from localStorage, show gentle loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9F7] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-[#DDE5D4] shadow-xs">
          <RefreshCw className="w-6 h-6 text-[#395C40] animate-spin" />
          <span className="text-xs font-semibold text-[#588157]">Verifying authorized session...</span>
        </div>
      </div>
    );
  }

  // If user is not logged in and not in public transparency mode, show Login Page
  if (!effectiveUser && !isPublicMode) {
    return <LoginPage onEnterPublic={enterPublicMode} />;
  }

  const criticalAlertsCount = alerts.filter(
    a => (a.status === 'New' || a.status === 'Under Review') && (a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL')
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F9F7] flex flex-col font-sans antialiased text-[#1B3022]">
      {/* Top Navigation Masthead */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenRecommend={() => setIsRecommendOpen(true)}
        criticalAlertsCount={criticalAlertsCount}
      />

      {/* Ticker / Priority Alert Banner (when critical issues exist) */}
      {criticalAlertsCount > 0 && effectiveRole !== 'PUBLIC' && (
        <div className="bg-[#B85338] text-white px-4 py-2 text-xs flex items-center justify-between border-b border-[#A62B17] shadow-xs">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-[#F5C2B4] shrink-0" />
            <span className="font-bold text-[#F5C2B4] uppercase tracking-wider text-[10px]">
              Vigilance Alert:
            </span>
            <span className="truncate text-xs">
              {criticalAlertsCount} High/Critical integrity risk anomalies require review under MoSPI rules.
            </span>
            <button
              onClick={() => setCurrentTab('anomalies')}
              className="ml-auto underline font-semibold text-white text-xs whitespace-nowrap hover:text-[#F5C2B4] cursor-pointer"
            >
              Review Flagged Items →
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout with Sidebar and Content View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 gap-6">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={tab => {
            setCurrentTab(tab);
            setSidebarOpen(false);
          }}
          pendingAlertsCount={alerts.filter(a => a.status === 'New').length}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Dynamic Main Stage */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-[#DDE5D4] shadow-xs">
              <RefreshCw className="w-8 h-8 text-[#395C40] animate-spin" />
              <div className="text-xs font-semibold text-[#588157]">
                Loading official MPLADS dataset & executing AI integrity heuristics...
              </div>
            </div>
          ) : (
            <>
              {/* Active Tab Routing */}
              {currentTab === 'dashboard' && (
                <DashboardPage
                  summary={summary}
                  projects={projects}
                  alerts={alerts}
                  userRole={effectiveRole}
                  onSelectProject={p => setSelectedProject(p)}
                  onNavigateToAnomalies={() => setCurrentTab('anomalies')}
                  onNavigateToRecommend={() => setIsRecommendOpen(true)}
                  onNavigateToMap={() => setCurrentTab('map')}
                />
              )}

              {currentTab === 'map' && (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-xl font-bold text-[#1B3022] tracking-tight">
                      Geographic Information System (GIS) Surveillance
                    </h1>
                    <p className="text-xs text-[#588157]">
                      Georeferenced project footprints, territorial proximity analysis, and duplicate cluster detection
                    </p>
                  </div>
                  <GISMap
                    projects={projects}
                    selectedProject={selectedProject}
                    onSelectProject={p => setSelectedProject(p)}
                  />
                </div>
              )}

              {currentTab === 'projects' && (
                <ProjectsPage
                  projects={projects}
                  userRole={effectiveRole}
                  onSelectProject={p => setSelectedProject(p)}
                  onNavigateToRecommend={() => setIsRecommendOpen(true)}
                />
              )}

              {currentTab === 'anomalies' && (
                <AiAnomaliesPage
                  projects={projects}
                  alerts={alerts}
                  onSelectProject={p => setSelectedProject(p)}
                  onOpenAlertAction={a => setActiveAlertForAction(a)}
                />
              )}

              {currentTab === 'alerts' && (
                <AlertManagementPage
                  alerts={alerts}
                  projects={projects}
                  onOpenAlertAction={a => setActiveAlertForAction(a)}
                  onSelectProject={p => setSelectedProject(p)}
                />
              )}

              {(currentTab === 'recommendations' || currentTab === 'recommend') && (
                <RecommendationsPage
                  projects={projects}
                  userRole={effectiveRole}
                  onOpenRecommend={() => setIsRecommendOpen(true)}
                  onSelectProject={p => setSelectedProject(p)}
                  onRefresh={fetchData}
                />
              )}

              {currentTab === 'funds' && (
                <FundsLedgerPage
                  projects={projects}
                  userRole={effectiveRole}
                />
              )}

              {(currentTab === 'agency' || currentTab === 'agency-workdesk') && (
                <AgencyWorkdeskPage
                  projects={projects}
                  userRole={effectiveRole}
                  onSelectProject={p => setSelectedProject(p)}
                  onRefresh={fetchData}
                />
              )}

              {currentTab === 'vendors' && (
                <VendorAnalyticsPage />
              )}

              {(currentTab === 'grievances' || currentTab === 'feedback') && (
                <CitizenFeedbackPage
                  feedbackList={feedbackList}
                  projects={projects}
                  userRole={effectiveRole}
                  onRefresh={fetchData}
                  onSelectProject={p => setSelectedProject(p)}
                />
              )}

              {currentTab === 'reports' && (
                <ReportsPage
                  projects={projects}
                  alerts={alerts}
                  userRole={effectiveRole}
                />
              )}

              {(currentTab === 'audit' || currentTab === 'audit-logs') && (
                <AuditLogPage />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      {/* 1. Project Detailed Audit & Photo Verification Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        userRole={effectiveRole}
      />

      {/* 2. MP New Project Recommendation Modal */}
      <RecommendModal
        isOpen={isRecommendOpen}
        onClose={() => setIsRecommendOpen(false)}
        onSuccess={() => {
          setIsRecommendOpen(false);
          fetchData();
        }}
      />

      {/* 3. District Authority Alert Action Modal */}
      <AlertActionModal
        alert={activeAlertForAction}
        isOpen={!!activeAlertForAction}
        onClose={() => setActiveAlertForAction(null)}
        onSuccess={() => {
          setActiveAlertForAction(null);
          fetchData();
        }}
      />

      {/* Official Government Footer in Natural Tones */}
      <footer className="bg-white border-t border-[#DDE5D4] mt-auto py-4 px-6 text-xs text-[#588157]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1B3022]">MPLADS AI Integrity Portal</span>
            <span>•</span>
            <span>National Informatics Centre (NIC)</span>
            <span>•</span>
            <span>MoSPI, New Delhi</span>
          </div>
          <div className="text-[11px] text-[#588157]/80">
            Natural Tones Theme • Compliant with MoSPI 2023 Guidelines & SIH Standards
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
