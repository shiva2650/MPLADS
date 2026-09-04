import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  LayoutDashboard,
  FolderGit2,
  AlertTriangle,
  MapPin,
  FilePlus2,
  Coins,
  HardHat,
  Building,
  MessageSquareWarning,
  FileSpreadsheet,
  ScrollText,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'projects'
  | 'recommend'
  | 'anomalies'
  | 'alerts'
  | 'map'
  | 'funds'
  | 'agency-workdesk'
  | 'vendors'
  | 'feedback'
  | 'reports'
  | 'audit-logs'
  | 'public-portal';

interface SidebarProps {
  currentTab: NavTab | string;
  onSelectTab: (tab: any) => void;
  pendingAlertsCount?: number;
  unreadFeedbackCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingAlertsCount = 0,
  unreadFeedbackCount = 0,
  isOpen = false,
  onClose
}) => {
  const { role } = useAuth();

  interface NavItem {
    id: NavTab;
    label: string;
    icon: any;
    badge?: number;
    badgeColor?: string;
    roles: ('MP' | 'ADMIN' | 'AGENCY' | 'PUBLIC')[];
    section?: string;
  }

  const navItems: NavItem[] = [
    // Main Navigation
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, roles: ['MP', 'ADMIN', 'AGENCY', 'PUBLIC'] },
    { id: 'projects', label: 'Projects Directory', icon: FolderGit2, roles: ['MP', 'ADMIN', 'AGENCY', 'PUBLIC'] },
    { id: 'map', label: 'GIS Interactive Map', icon: MapPin, roles: ['MP', 'ADMIN', 'AGENCY', 'PUBLIC'] },

    // MP Specific
    { id: 'recommend', label: 'Recommend Work', icon: FilePlus2, roles: ['MP', 'ADMIN'], section: 'Proposals & Sanctions' },

    // AI & Integrity
    {
      id: 'anomalies',
      label: 'AI Anomaly Center',
      icon: AlertTriangle,
      badge: pendingAlertsCount,
      badgeColor: 'bg-[#E07A5F]',
      roles: ['MP', 'ADMIN'],
      section: 'AI Vigilance & Risk'
    },
    {
      id: 'alerts',
      label: 'Alert Management',
      icon: ShieldCheck,
      badge: pendingAlertsCount,
      badgeColor: 'bg-[#E07A5F]',
      roles: ['ADMIN'],
      section: 'AI Vigilance & Risk'
    },

    // Execution & Financials
    { id: 'funds', label: 'Funds & Expenditure', icon: Coins, roles: ['MP', 'ADMIN', 'PUBLIC'], section: 'Financial Tracking' },
    { id: 'agency-workdesk', label: 'Agency Workdesk', icon: HardHat, roles: ['AGENCY', 'ADMIN'], section: 'Execution & Billing' },
    { id: 'vendors', label: 'Vendor Performance', icon: Building, roles: ['ADMIN', 'MP'], section: 'Execution & Billing' },

    // Public & Redressal
    {
      id: 'feedback',
      label: 'Citizen Grievances',
      icon: MessageSquareWarning,
      badge: unreadFeedbackCount,
      badgeColor: 'bg-[#588157]',
      roles: ['ADMIN', 'PUBLIC'],
      section: 'Public Transparency'
    },
    { id: 'reports', label: 'Reports & Audit Briefs', icon: FileSpreadsheet, roles: ['MP', 'ADMIN', 'AGENCY', 'PUBLIC'], section: 'Governance' },
    { id: 'audit-logs', label: 'System Audit Trail', icon: ScrollText, roles: ['ADMIN'], section: 'Governance' }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  // Group by sections
  let lastSection = '';

  const sidebarContent = (
    <aside className="w-64 bg-[#263D2E] text-[#DDE5D4] flex flex-col shrink-0 border-r border-[#1B3022] min-h-[calc(100vh-4rem)]">
      {/* Role Context Bar */}
      <div className="px-4 py-3 bg-[#1B3022] border-b border-[#395C40] text-xs text-[#A3B18A]">
        <div className="font-bold uppercase tracking-wider text-[10px] text-[#A3B18A]">System Menu</div>
        <div className="font-mono text-white text-xs font-semibold truncate mt-0.5">
          {role === 'PUBLIC' ? 'Public Portal Mode' : `${role} Authorized Access`}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredItems.map(item => {
          const Icon = item.icon;
          // Support alias matches
          const isActive =
            currentTab === item.id ||
            (item.id === 'recommend' && currentTab === 'recommendations') ||
            (item.id === 'agency-workdesk' && currentTab === 'agency') ||
            (item.id === 'feedback' && currentTab === 'grievances') ||
            (item.id === 'audit-logs' && currentTab === 'audit');

          const showSectionHeader = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          return (
            <React.Fragment key={item.id}>
              {showSectionHeader && (
                <div className="pt-4 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-[#A3B18A]">
                  {item.section}
                </div>
              )}

              <button
                id={`nav-link-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#395C40] text-white shadow-xs font-semibold'
                    : 'text-[#DDE5D4] opacity-85 hover:opacity-100 hover:bg-[#395C40]/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? 'bg-[#A3B18A]' : 'bg-transparent border border-[#A3B18A]'
                    }`}
                  />
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#A3B18A]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0 ${
                      item.badgeColor || 'bg-[#E07A5F]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* System Status & Ministry Compliance Badge */}
      <div className="p-3 m-3 bg-[#1B3022] rounded-xl border border-[#395C40] text-[11px] text-[#DDE5D4]">
        <div className="text-[10px] text-[#A3B18A] uppercase tracking-wider font-bold mb-1.5">
          System Vigilance
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-white">MoSPI Online & Secured</span>
        </div>
        <div className="text-[10px] text-[#A3B18A] leading-relaxed">
          Compliant with MoSPI 2023 Guidelines. All AI risk indicators require human adjudication.
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0">{sidebarContent}</div>

      {/* Mobile Off-canvas Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
          <div className="relative z-10 flex">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
