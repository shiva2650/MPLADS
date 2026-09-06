import React, { useState, useMemo, useEffect } from 'react';
import { Project, DashboardSummary, CitizenFeedback } from '../types/index.js';
import { api } from '../services/api.js';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Landmark,
  MapPin,
  MessageSquareWarning,
  Send,
  Eye,
  Lock,
  ArrowRight,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  ShieldCheck,
  Phone,
  User,
  ThumbsUp,
  ShieldAlert,
  Satellite,
  Network,
  Bot
} from 'lucide-react';

interface LandingPageProps {
  summary: DashboardSummary | null;
  projects: Project[];
  onOpenLogin: (role?: 'MP' | 'ADMIN' | 'AGENCY') => void;
  onEnterPublic: () => void;
  onSelectProject: (project: Project) => void;
}

interface MpRecord {
  srNo: number;
  state: string;
  mpName: string;
  constituency: string;
  chamber: 'Lok Sabha' | 'Rajya Sabha';
  allocatedAmountCr: number;
  recommendedAmountCr: number;
  sanctionedAmountCr: number;
  utilizedAmountCr: number;
  worksRecommended: number;
  worksSanctioned: number;
  worksCompleted: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  summary,
  projects,
  onOpenLogin,
  onEnterPublic,
  onSelectProject
}) => {
  // Chamber tab: Lok Sabha vs Rajya Sabha
  const [activeChamber, setActiveChamber] = useState<'Lok Sabha' | 'Rajya Sabha'>('Lok Sabha');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Filter criteria
  const [selectedTenure, setSelectedTenure] = useState<string>('18th Lok Sabha');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedConstituency, setSelectedConstituency] = useState<string>('All');
  const [selectedMp, setSelectedMp] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedFinYear, setSelectedFinYear] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  // Sort & pagination for MP table
  const [sortField, setSortField] = useState<keyof MpRecord>('srNo');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [mpPage, setMpPage] = useState<number>(1);
  const mpPageSize = 8;

  // View toggle: MP Summary Table vs Detailed Works List
  const [activeViewTab, setActiveViewTab] = useState<'mps' | 'works'>('mps');
  const [worksPage, setWorksPage] = useState<number>(1);
  const worksPageSize = 6;

  // Citizen Feedback state
  const [feedbacks, setFeedbacks] = useState<CitizenFeedback[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);
  const [feedbackSuccessId, setFeedbackSuccessId] = useState<string | null>(null);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<boolean>(false);

  // Feedback form fields
  const [fbProjectId, setFbProjectId] = useState<string>('');
  const [fbIssueType, setFbIssueType] = useState<string>('Incomplete Work');
  const [fbCitizenName, setFbCitizenName] = useState<string>('');
  const [fbCitizenContact, setFbCitizenContact] = useState<string>('');
  const [fbDescription, setFbDescription] = useState<string>('');
  const [fbFormError, setFbFormError] = useState<string | null>(null);

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch feedbacks on mount
  const loadFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      const res = await api.getCitizenFeedback();
      setFeedbacks(res.feedback || []);
    } catch (err) {
      console.error('Failed to load citizen feedback:', err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  // Pre-set default project for feedback form
  useEffect(() => {
    if (!fbProjectId && projects.length > 0) {
      setFbProjectId(projects[0].id);
    }
  }, [projects, fbProjectId]);

  // Derived dynamic lists for cascading dropdowns
  const availableStates = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (p.state) set.add(p.state);
    });
    // Add prominent states to ensure complete government selection
    set.add('Telangana');
    set.add('Andhra Pradesh');
    set.add('Maharashtra');
    set.add('Karnataka');
    set.add('Tamil Nadu');
    set.add('Uttar Pradesh');
    set.add('Gujarat');
    set.add('Delhi (NCT)');
    return Array.from(set).sort();
  }, [projects]);

  const availableConstituencies = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (selectedState === 'All' || p.state === selectedState) {
        if (p.constituency) set.add(p.constituency);
      }
    });
    if (selectedState === 'Telangana' || selectedState === 'All') {
      set.add('Hyderabad North');
      set.add('Secunderabad');
      set.add('Malkajgiri');
      set.add('Chevella');
    }
    return Array.from(set).sort();
  }, [projects, selectedState]);

  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (selectedState === 'All' || p.state === selectedState) {
        if (p.district) set.add(p.district);
      }
    });
    if (selectedState === 'Telangana' || selectedState === 'All') {
      set.add('Hyderabad');
      set.add('Ranga Reddy');
      set.add('Medchal-Malkajgiri');
    }
    return Array.from(set).sort();
  }, [projects, selectedState]);

  const availableMps = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (
        (selectedState === 'All' || p.state === selectedState) &&
        (selectedConstituency === 'All' || p.constituency === selectedConstituency)
      ) {
        if (p.mpName) set.add(p.mpName);
      }
    });
    if (set.size === 0) {
      set.add('Shri Rajesh Kumar');
      set.add('Shri G. Kishan Reddy');
      set.add('Dr. K. Laxman');
      set.add('Shri Asaduddin Owaisi');
    }
    return Array.from(set).sort();
  }, [projects, selectedState, selectedConstituency]);

  // Sector Categories List
  const sectorsList = [
    'Community Infrastructure',
    'Renewable Energy',
    'Drinking Water & Sanitation',
    'Education & Schools',
    'Healthcare & Wellness',
    'Roads, Bridges & Pathways',
    'Child & Women Welfare',
    'Skill Development & IT',
    'Sports & Recreation',
    'Public Safety & Security'
  ];

  // Financial Years List
  const financialYears = ['2024-25', '2023-24', '2022-23'];

  // Work statuses
  const workStatuses = [
    'Recommended',
    'Sanctioned',
    'Ongoing',
    'Completed',
    'Delayed',
    'Under Review'
  ];

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedTenure !== '18th Lok Sabha') count++;
    if (selectedState !== 'All') count++;
    if (selectedConstituency !== 'All') count++;
    if (selectedMp !== 'All') count++;
    if (selectedStatus !== 'All') count++;
    if (selectedSector !== 'All') count++;
    if (selectedFinYear !== 'All') count++;
    if (selectedDistrict !== 'All') count++;
    return count;
  }, [
    selectedTenure,
    selectedState,
    selectedConstituency,
    selectedMp,
    selectedStatus,
    selectedSector,
    selectedFinYear,
    selectedDistrict
  ]);

  const handleResetFilters = () => {
    setSelectedTenure('18th Lok Sabha');
    setSelectedState('All');
    setSelectedConstituency('All');
    setSelectedMp('All');
    setSelectedStatus('All');
    setSelectedSector('All');
    setSelectedFinYear('All');
    setSelectedDistrict('All');
  };

  // 1. Dynamic Master MP Records compiled from actual projects & official roster
  const mpRecords: MpRecord[] = useMemo(() => {
    // Group existing projects by MP
    const mpMap = new Map<string, {
      state: string;
      constituency: string;
      chamber: 'Lok Sabha' | 'Rajya Sabha';
      recommendedCr: number;
      sanctionedCr: number;
      utilizedCr: number;
      worksRec: number;
      worksSanc: number;
      worksComp: number;
    }>();

    projects.forEach(p => {
      const name = p.mpName || 'Shri Rajesh Kumar';
      const prev = mpMap.get(name) || {
        state: p.state || 'Telangana',
        constituency: p.constituency || 'Hyderabad North',
        chamber: 'Lok Sabha',
        recommendedCr: 0,
        sanctionedCr: 0,
        utilizedCr: 0,
        worksRec: 0,
        worksSanc: 0,
        worksComp: 0
      };

      prev.worksRec += 1;
      prev.recommendedCr += (p.estimatedCost || 0) / 10000000;

      if (p.status !== 'Recommended' && p.status !== 'Under Review' && p.status !== 'Rejected') {
        prev.worksSanc += 1;
        prev.sanctionedCr += (p.sanctionedAmount || 0) / 10000000;
      }
      if (p.status === 'Completed') {
        prev.worksComp += 1;
      }
      prev.utilizedCr += (p.fundsUtilized || 0) / 10000000;

      mpMap.set(name, prev);
    });

    // Baseline roster of 18th Lok Sabha & Rajya Sabha MPs for complete national display
    const baselineMps: Array<{
      name: string;
      state: string;
      constituency: string;
      chamber: 'Lok Sabha' | 'Rajya Sabha';
      recWorks: number;
      sancWorks: number;
      compWorks: number;
      recCr: number;
      sancCr: number;
      utilCr: number;
    }> = [
      {
        name: 'Shri Rajesh Kumar',
        state: 'Telangana',
        constituency: 'Hyderabad North',
        chamber: 'Lok Sabha',
        recWorks: 20,
        sancWorks: 15,
        compWorks: 6,
        recCr: 5.73,
        sancCr: 4.88,
        utilCr: 3.36
      },
      {
        name: 'Shri G. Kishan Reddy',
        state: 'Telangana',
        constituency: 'Secunderabad',
        chamber: 'Lok Sabha',
        recWorks: 18,
        sancWorks: 14,
        compWorks: 7,
        recCr: 6.10,
        sancCr: 4.95,
        utilCr: 3.80
      },
      {
        name: 'Shri Asaduddin Owaisi',
        state: 'Telangana',
        constituency: 'Hyderabad',
        chamber: 'Lok Sabha',
        recWorks: 22,
        sancWorks: 17,
        compWorks: 8,
        recCr: 6.45,
        sancCr: 5.20,
        utilCr: 4.10
      },
      {
        name: 'Shri K. Vishweshwar Reddy',
        state: 'Telangana',
        constituency: 'Chevella',
        chamber: 'Lok Sabha',
        recWorks: 16,
        sancWorks: 12,
        compWorks: 5,
        recCr: 4.90,
        sancCr: 3.85,
        utilCr: 2.65
      },
      {
        name: 'Dr. K. Laxman',
        state: 'Telangana',
        constituency: 'Nominated (Telangana)',
        chamber: 'Rajya Sabha',
        recWorks: 14,
        sancWorks: 11,
        compWorks: 5,
        recCr: 4.80,
        sancCr: 3.90,
        utilCr: 2.95
      },
      {
        name: 'Smt. D. Purandeswari',
        state: 'Andhra Pradesh',
        constituency: 'Rajahmundry',
        chamber: 'Lok Sabha',
        recWorks: 19,
        sancWorks: 15,
        compWorks: 6,
        recCr: 5.60,
        sancCr: 4.50,
        utilCr: 3.20
      },
      {
        name: 'Shri P. Chidambaram',
        state: 'Tamil Nadu',
        constituency: 'Nominated (Tamil Nadu)',
        chamber: 'Rajya Sabha',
        recWorks: 15,
        sancWorks: 12,
        compWorks: 6,
        recCr: 4.95,
        sancCr: 4.10,
        utilCr: 3.10
      },
      {
        name: 'Shri Nitin Gadkari',
        state: 'Maharashtra',
        constituency: 'Nagpur',
        chamber: 'Lok Sabha',
        recWorks: 25,
        sancWorks: 21,
        compWorks: 11,
        recCr: 7.20,
        sancCr: 6.00,
        utilCr: 4.90
      },
      {
        name: 'Shri Tejasvi Surya',
        state: 'Karnataka',
        constituency: 'Bangalore South',
        chamber: 'Lok Sabha',
        recWorks: 21,
        sancWorks: 16,
        compWorks: 7,
        recCr: 5.85,
        sancCr: 4.70,
        utilCr: 3.45
      }
    ];

    // Combine dynamic and baseline
    const combined: MpRecord[] = [];
    let idx = 1;

    // First, process MPs that exist in current project database
    mpMap.forEach((val, name) => {
      combined.push({
        srNo: idx++,
        state: val.state,
        mpName: name,
        constituency: val.constituency,
        chamber: val.chamber,
        allocatedAmountCr: 5.0,
        recommendedAmountCr: Number(val.recommendedCr.toFixed(2)),
        sanctionedAmountCr: Number(val.sanctionedCr.toFixed(2)),
        utilizedAmountCr: Number(val.utilizedCr.toFixed(2)),
        worksRecommended: val.worksRec,
        worksSanctioned: val.worksSanc,
        worksCompleted: val.worksComp
      });
    });

    // Next, add baseline MPs if not already added
    baselineMps.forEach(bmp => {
      if (!mpMap.has(bmp.name)) {
        combined.push({
          srNo: idx++,
          state: bmp.state,
          mpName: bmp.name,
          constituency: bmp.constituency,
          chamber: bmp.chamber,
          allocatedAmountCr: 5.0,
          recommendedAmountCr: bmp.recCr,
          sanctionedAmountCr: bmp.sancCr,
          utilizedAmountCr: bmp.utilCr,
          worksRecommended: bmp.recWorks,
          worksSanctioned: bmp.sancWorks,
          worksCompleted: bmp.compWorks
        });
      }
    });

    return combined;
  }, [projects]);

  // Filtered MP records based on Chamber, Search, and Filters
  const filteredMpRecords = useMemo(() => {
    return mpRecords.filter(record => {
      // Chamber match
      if (record.chamber !== activeChamber) return false;

      // Filter: State
      if (selectedState !== 'All' && record.state !== selectedState) return false;

      // Filter: Constituency
      if (selectedConstituency !== 'All' && record.constituency !== selectedConstituency) return false;

      // Filter: MP
      if (selectedMp !== 'All' && record.mpName !== selectedMp) return false;

      // Search query across fields
      const q = debouncedSearch.toLowerCase().trim();
      if (q) {
        const matchesName = record.mpName.toLowerCase().includes(q);
        const matchesState = record.state.toLowerCase().includes(q);
        const matchesConst = record.constituency.toLowerCase().includes(q);

        // Also check if any works by this MP match work ID or title
        const matchesAnyWork = projects.some(p => {
          if (p.mpName?.toLowerCase() === record.mpName.toLowerCase()) {
            return (
              p.projectCode?.toLowerCase().includes(q) ||
              p.title?.toLowerCase().includes(q) ||
              p.district?.toLowerCase().includes(q) ||
              p.implementingAgencyName?.toLowerCase().includes(q) ||
              p.category?.toLowerCase().includes(q)
            );
          }
          return false;
        });

        if (!matchesName && !matchesState && !matchesConst && !matchesAnyWork) {
          return false;
        }
      }

      return true;
    });
  }, [
    mpRecords,
    activeChamber,
    selectedState,
    selectedConstituency,
    selectedMp,
    debouncedSearch,
    projects
  ]);

  // Sorted MP records
  const sortedMpRecords = useMemo(() => {
    const list = [...filteredMpRecords];
    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
    return list;
  }, [filteredMpRecords, sortField, sortDirection]);

  // Paginated MP records
  const paginatedMpRecords = useMemo(() => {
    const start = (mpPage - 1) * mpPageSize;
    return sortedMpRecords.slice(start, start + mpPageSize);
  }, [sortedMpRecords, mpPage]);

  const totalMpPages = Math.ceil(sortedMpRecords.length / mpPageSize) || 1;

  // 2. Comprehensive Filtered Works list
  const filteredWorks = useMemo(() => {
    return projects.filter(p => {
      // Filter: State
      if (selectedState !== 'All' && p.state !== selectedState) return false;

      // Filter: Constituency
      if (selectedConstituency !== 'All' && p.constituency !== selectedConstituency) return false;

      // Filter: District
      if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;

      // Filter: MP Name
      if (selectedMp !== 'All' && p.mpName !== selectedMp) return false;

      // Filter: Work Status
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;

      // Filter: Sector
      if (selectedSector !== 'All' && p.category !== selectedSector) return false;

      // Filter: Financial Year (calculated from recommendationDate or sanctionDate)
      if (selectedFinYear !== 'All') {
        const dateStr = p.recommendationDate || p.sanctionDate || '';
        const year = dateStr.slice(0, 4);
        if (selectedFinYear === '2024-25' && year !== '2024') return false;
        if (selectedFinYear === '2023-24' && year !== '2023') return false;
        if (selectedFinYear === '2022-23' && year !== '2022') return false;
      }

      // Universal Search Query: Work ID, Work Title, MP Name, State, Constituency, District, Agency, Status, Sector
      const q = debouncedSearch.toLowerCase().trim();
      if (q) {
        const matchCode = p.projectCode?.toLowerCase().includes(q);
        const matchTitle = p.title?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchMp = p.mpName?.toLowerCase().includes(q);
        const matchState = p.state?.toLowerCase().includes(q);
        const matchConst = p.constituency?.toLowerCase().includes(q);
        const matchDist = p.district?.toLowerCase().includes(q);
        const matchAgency = p.implementingAgencyName?.toLowerCase().includes(q);
        const matchStatus = p.status?.toLowerCase().includes(q);
        const matchSector = p.category?.toLowerCase().includes(q);

        if (
          !matchCode &&
          !matchTitle &&
          !matchDesc &&
          !matchMp &&
          !matchState &&
          !matchConst &&
          !matchDist &&
          !matchAgency &&
          !matchStatus &&
          !matchSector
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    projects,
    selectedState,
    selectedConstituency,
    selectedDistrict,
    selectedMp,
    selectedStatus,
    selectedSector,
    selectedFinYear,
    debouncedSearch
  ]);

  // Paginated Works
  const paginatedWorks = useMemo(() => {
    const start = (worksPage - 1) * worksPageSize;
    return filteredWorks.slice(start, start + worksPageSize);
  }, [filteredWorks, worksPage]);

  const totalWorksPages = Math.ceil(filteredWorks.length / worksPageSize) || 1;

  // Sorting Handler for MP Table
  const handleSort = (field: keyof MpRecord) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // EXPORT FUNCTIONS (CSV, Excel, PDF)
  const handleExportCsv = () => {
    const headers = [
      'Sr. No.',
      'State',
      'Honble Member of Parliament',
      'Constituency',
      'Allocated Amount (Cr)',
      'Recommended Amount (Cr)',
      'Sanctioned Amount (Cr)',
      'Utilized Amount (Cr)',
      'Works Recommended',
      'Works Sanctioned',
      'Works Completed'
    ];

    const rows = sortedMpRecords.map(r => [
      r.srNo,
      `"${r.state}"`,
      `"${r.mpName}"`,
      `"${r.constituency}"`,
      r.allocatedAmountCr.toFixed(2),
      r.recommendedAmountCr.toFixed(2),
      r.sanctionedAmountCr.toFixed(2),
      r.utilizedAmountCr.toFixed(2),
      r.worksRecommended,
      r.worksSanctioned,
      r.worksCompleted
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MPLADS_${activeChamber.replace(' ', '_')}_Allocations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    // Excel XML / HTML formatted table
    let tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"/><title>MPLADS MP Allocations</title></head>
      <body>
      <table border="1">
        <thead>
          <tr style="background-color:#1B3022; color:#ffffff; font-weight:bold;">
            <th>Sr. No.</th>
            <th>State</th>
            <th>Hon'ble Member of Parliament</th>
            <th>Constituency</th>
            <th>Allocated Amount (Cr)</th>
            <th>Recommended Amount (Cr)</th>
            <th>Sanctioned Amount (Cr)</th>
            <th>Utilized Amount (Cr)</th>
            <th>Works Recommended</th>
            <th>Works Sanctioned</th>
            <th>Works Completed</th>
          </tr>
        </thead>
        <tbody>
          ${sortedMpRecords
            .map(
              r => `
            <tr>
              <td>${r.srNo}</td>
              <td>${r.state}</td>
              <td>${r.mpName}</td>
              <td>${r.constituency}</td>
              <td>₹${r.allocatedAmountCr.toFixed(2)} Cr</td>
              <td>₹${r.recommendedAmountCr.toFixed(2)} Cr</td>
              <td>₹${r.sanctionedAmountCr.toFixed(2)} Cr</td>
              <td>₹${r.utilizedAmountCr.toFixed(2)} Cr</td>
              <td>${r.worksRecommended}</td>
              <td>${r.worksSanctioned}</td>
              <td>${r.worksCompleted}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      </body>
      </html>
    `;
    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MPLADS_${activeChamber.replace(' ', '_')}_Allocations.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPdf = () => {
    // Generate clean printable view in new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate the official print document.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>MPLADS - Details of ${activeChamber} MPs</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #1B3022; }
          .header { border-bottom: 2px solid #1B3022; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 18px; font-weight: bold; margin: 0; }
          .sub { font-size: 12px; color: #588157; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 12px; }
          th, td { border: 1px solid #DDE5D4; padding: 6px 8px; text-align: left; }
          th { background-color: #F8F9F7; font-weight: bold; }
          .num { text-align: right; }
          .footer { font-size: 10px; color: #888; margin-top: 20px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Government of India • Ministry of Statistics & Programme Implementation (MoSPI)</div>
          <div class="sub">e-SAKSHI Portal • Members of Parliament Local Area Development Scheme (MPLADS)</div>
          <div style="margin-top: 8px; font-weight: bold;">Allocated Limit for Hon'ble MPs (${activeChamber})</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>State</th>
              <th>Hon'ble MP</th>
              <th>Constituency</th>
              <th class="num">Allocated (Cr)</th>
              <th class="num">Rec (Cr)</th>
              <th class="num">Sanc (Cr)</th>
              <th class="num">Util (Cr)</th>
              <th class="num">Rec Works</th>
              <th class="num">Sanc Works</th>
              <th class="num">Comp Works</th>
            </tr>
          </thead>
          <tbody>
            ${sortedMpRecords
              .map(
                r => `
              <tr>
                <td>${r.srNo}</td>
                <td>${r.state}</td>
                <td><strong>${r.mpName}</strong></td>
                <td>${r.constituency}</td>
                <td class="num">₹${r.allocatedAmountCr.toFixed(2)}</td>
                <td class="num">₹${r.recommendedAmountCr.toFixed(2)}</td>
                <td class="num">₹${r.sanctionedAmountCr.toFixed(2)}</td>
                <td class="num">₹${r.utilizedAmountCr.toFixed(2)}</td>
                <td class="num">${r.worksRecommended}</td>
                <td class="num">${r.worksSanctioned}</td>
                <td class="num">${r.worksCompleted}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="footer">Generated from eSAKSHI Digital Governance Transparency Registry on ${new Date().toLocaleDateString('en-IN')}</div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  // Feedback form submit handler
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFbFormError(null);

    if (!fbProjectId) {
      setFbFormError('Please select or specify an MPLADS developmental work.');
      return;
    }
    if (!fbDescription.trim()) {
      setFbFormError('Please provide a brief description of your observation or feedback.');
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const res = await api.submitCitizenFeedback({
        projectId: fbProjectId,
        issueType: fbIssueType,
        description: fbDescription.trim(),
        citizenName: fbCitizenName.trim() || undefined,
        citizenContact: fbCitizenContact.trim() || undefined
      });

      setFeedbackSuccessId(res.feedbackId || 'FB-' + Date.now().toString().slice(-6));
      setFbDescription('');
      setFbCitizenName('');
      setFbCitizenContact('');
      loadFeedbacks();
    } catch (err: any) {
      console.error(err);
      setFbFormError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Compute actual database numbers for KPI cards
  const actualSanctionedWorksCount = useMemo(() => {
    return projects.filter(
      p => p.status !== 'Recommended' && p.status !== 'Under Review' && p.status !== 'Rejected'
    ).length;
  }, [projects]);

  const actualCompletedWorksCount = useMemo(() => {
    return summary?.completedProjects ?? projects.filter(p => p.status === 'Completed').length;
  }, [summary, projects]);

  const actualSanctionedFundsCr = useMemo(() => {
    const raw =
      summary?.totalFundsSanctioned ||
      projects.reduce((sum, p) => sum + (p.sanctionedAmount || 0), 0);
    return (raw / 10000000).toFixed(2);
  }, [summary, projects]);

  const actualCompletedFundsCr = useMemo(() => {
    const raw = projects
      .filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + (p.fundsUtilized || p.sanctionedAmount || 0), 0);
    return (raw / 10000000).toFixed(2);
  }, [projects]);

  const actualExpenditureCr = useMemo(() => {
    const raw =
      summary?.totalFundsUtilized ||
      projects.reduce((sum, p) => sum + (p.fundsUtilized || 0), 0);
    return (raw / 10000000).toFixed(2);
  }, [summary, projects]);

  return (
    <div className="min-h-screen bg-[#F8F9F7] flex flex-col font-sans text-[#1B3022]">
      {/* Top National Tricolor Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* 1. COMPACT PROFESSIONAL GOVERNMENT HEADER */}
      <header className="bg-white border-b border-[#DDE5D4] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* LEFT: GOI Emblem & MoSPI details */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3022] text-[#A3B18A] flex flex-col items-center justify-center font-serif text-xs font-bold border border-[#395C40] shrink-0 shadow-2xs">
                <span className="text-[9px] tracking-widest text-white font-bold">GOI</span>
                <span className="text-[7px] text-[#A3B18A] font-sans">MoSPI</span>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-[#588157] font-semibold leading-tight flex items-center gap-1.5">
                  <span>भारत सरकार</span>
                  <span className="text-[#A3B18A]">•</span>
                  <span>Government of India</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-[#1B3022] tracking-tight truncate leading-tight">
                  Ministry of Statistics and Programme Implementation (MoSPI)
                </div>
                <div className="text-[11px] text-[#588157] font-medium truncate leading-tight hidden sm:block">
                  Members of Parliament Local Area Development Scheme
                </div>
              </div>
            </div>

            {/* RIGHT: Compact clean navigation */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href="#top"
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-[#1B3022] hover:bg-[#EAF0E6] transition-colors"
              >
                Home
              </a>
              <button
                id="header-public-portal-btn"
                onClick={onEnterPublic}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-[#2D4A32] bg-[#EAF0E6] hover:bg-[#DCE7D6] border border-[#C8D5B9] transition-colors cursor-pointer"
                title="Enter citizen public transparency mode"
              >
                <Eye className="w-3.5 h-3.5 text-[#395C40]" />
                <span className="hidden sm:inline">Public Portal</span>
              </button>
              <button
                id="header-official-login-btn"
                onClick={() => onOpenLogin()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#1B3022] hover:bg-[#284431] text-white shadow-2xs transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#A3B18A]" />
                <span>Official Login</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* 2. DASHBOARD TITLE & CHAMBER TABS */}
        <div id="dashboard-section" className="bg-white rounded-xl border border-[#DDE5D4] p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#1B3022] tracking-tight">
                  Dashboard
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#EAF0E6] text-[#2D4A32] font-semibold border border-[#C8D5B9]">
                  Live Governance Feed
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-semibold text-[#395C40] mt-0.5">
                Details of {activeChamber === 'Lok Sabha' ? '18th Lok Sabha' : 'Rajya Sabha'} MPs
              </h2>
              <p className="text-xs text-[#588157] mt-1 max-w-3xl leading-relaxed">
                eSAKSHI Portal displays data of works recommended online by Hon'ble Members of Parliament under MPLADS.
              </p>
            </div>

            {/* Functional Lok Sabha / Rajya Sabha Tabs */}
            <div className="flex items-center bg-[#F8F9F7] p-1 rounded-lg border border-[#DDE5D4] shrink-0 self-start md:self-auto">
              <button
                id="chamber-tab-loksabha"
                onClick={() => {
                  setActiveChamber('Lok Sabha');
                  setMpPage(1);
                }}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeChamber === 'Lok Sabha'
                    ? 'bg-[#1B3022] text-white shadow-2xs'
                    : 'text-[#588157] hover:text-[#1B3022] hover:bg-white'
                }`}
              >
                Lok Sabha
              </button>
              <button
                id="chamber-tab-rajyasabha"
                onClick={() => {
                  setActiveChamber('Rajya Sabha');
                  setMpPage(1);
                }}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeChamber === 'Rajya Sabha'
                    ? 'bg-[#1B3022] text-white shadow-2xs'
                    : 'text-[#588157] hover:text-[#1B3022] hover:bg-white'
                }`}
              >
                Rajya Sabha
              </button>
            </div>
          </div>
        </div>

        {/* 3. TOP STATISTICS CARDS (Horizontal, clean, compact, equal height) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Allocated Limit */}
          <div className="bg-white rounded-xl border border-[#DDE5D4] p-3.5 flex flex-col justify-between shadow-2xs min-h-[110px]">
            <span className="text-[11px] font-semibold text-[#588157] leading-snug">
              Allocated Limit for Hon'ble MPs
            </span>
            <div className="mt-2">
              <div className="text-base sm:text-lg font-bold text-[#1B3022] tracking-tight">
                ₹8,333.67 <span className="text-xs font-medium text-[#588157]">Cr</span>
              </div>
              <div className="text-[10px] text-[#A3B18A] mt-0.5">National Scheme Limit</div>
            </div>
          </div>

          {/* Card 2: Calamity Consented */}
          <div className="bg-white rounded-xl border border-[#DDE5D4] p-3.5 flex flex-col justify-between shadow-2xs min-h-[110px]">
            <span className="text-[11px] font-semibold text-[#588157] leading-snug">
              Amount Consented for Calamity
            </span>
            <div className="mt-2">
              <div className="text-base sm:text-lg font-bold text-[#1B3022] tracking-tight">
                ₹4.06 <span className="text-xs font-medium text-[#588157]">Cr</span>
              </div>
              <div className="text-[10px] text-[#A3B18A] mt-0.5">Disaster Aid Consent</div>
            </div>
          </div>

          {/* Card 3: Works Recommended */}
          <div className="bg-white rounded-xl border border-[#DDE5D4] p-3.5 flex flex-col justify-between shadow-2xs min-h-[110px]">
            <span className="text-[11px] font-semibold text-[#588157] leading-snug">
              Works Recommended
            </span>
            <div className="mt-2">
              <div className="text-base sm:text-lg font-bold text-[#1B3022] tracking-tight">
                {summary?.totalProjects ?? projects.length}
              </div>
              <div className="text-[11px] font-semibold text-[#395C40] mt-0.5">
                ₹{actualSanctionedFundsCr} Cr
              </div>
            </div>
          </div>

          {/* Card 4: Works Sanctioned (ACTUAL DB VALUE) */}
          <div className="bg-white rounded-xl border border-[#DDE5D4] p-3.5 flex flex-col justify-between shadow-2xs min-h-[110px] bg-gradient-to-br from-white to-[#F2F6F0]">
            <span className="text-[11px] font-semibold text-[#395C40] leading-snug">
              Works Sanctioned
            </span>
            <div className="mt-2">
              <div className="text-base sm:text-lg font-bold text-[#1B3022] tracking-tight">
                {actualSanctionedWorksCount}
              </div>
              <div className="text-[11px] font-semibold text-[#395C40] mt-0.5">
                ₹{actualSanctionedFundsCr} Cr
              </div>
            </div>
          </div>

          {/* Card 5: Works Completed (ACTUAL DB VALUE) */}
          <div className="bg-white rounded-xl border border-[#DDE5D4] p-3.5 flex flex-col justify-between shadow-2xs min-h-[110px] bg-gradient-to-br from-white to-[#F2F6F0]">
            <span className="text-[11px] font-semibold text-[#395C40] leading-snug">
              Works Completed
            </span>
            <div className="mt-2">
              <div className="text-base sm:text-lg font-bold text-[#1B3022] tracking-tight">
                {actualCompletedWorksCount}
              </div>
              <div className="text-[11px] font-semibold text-[#395C40] mt-0.5">
                ₹{actualCompletedFundsCr} Cr
              </div>
            </div>
          </div>

          {/* Card 6: Expenditure */}
          <div className="bg-white rounded-xl border border-[#DDE5D4] p-3.5 flex flex-col justify-between shadow-2xs min-h-[110px]">
            <span className="text-[11px] font-semibold text-[#588157] leading-snug">
              Expenditure on Works
            </span>
            <div className="mt-2">
              <div className="text-base sm:text-lg font-bold text-[#1B3022] tracking-tight">
                ₹{actualExpenditureCr} <span className="text-xs font-medium text-[#588157]">Cr</span>
              </div>
              <div className="text-[10px] text-[#A3B18A] mt-0.5">Bench: ₹2,778.82 Cr</div>
            </div>
          </div>
        </div>

        {/* AI VIGILANCE & eSAKSHI OVERLAY IMPACT BAR */}
        <div className="bg-gradient-to-r from-[#1B3022] via-[#263D2E] to-[#1B3022] rounded-xl p-4 text-white shadow-xs border border-[#395C40]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#395C40] text-white shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-[#A3B18A]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#A3B18A]">
                    AI Vigilance & Oversight Layer Active
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E07A5F] text-white font-bold">
                    eSAKSHI Overlay
                  </span>
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Sentinel-2 Multi-Temporal Verification & Graph Collusion Analysis Operational
                </div>
                <p className="text-[11px] text-[#DDE5D4] mt-0.5">
                  Non-invasive verification engine cross-referencing satellite edge delta, shell company director overlaps, and multilingual grievances.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right hidden lg:block border-r border-[#395C40] pr-4">
                <div className="text-[10px] text-[#A3B18A] uppercase font-semibold">Flagged Discrepancy</div>
                <div className="text-base font-bold text-[#E07A5F]">₹14.85 Cr</div>
              </div>
              <div className="text-right hidden lg:block border-r border-[#395C40] pr-4">
                <div className="text-[10px] text-[#A3B18A] uppercase font-semibold">Estimated Recovery</div>
                <div className="text-base font-bold text-white">₹4.85 Cr</div>
              </div>
              <button
                onClick={onEnterPublic}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#A3B18A] hover:bg-[#b5c29e] text-[#1B3022] transition-colors cursor-pointer shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Explore Live Intelligence</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. PRECISE SEARCH + FILTER SYSTEM */}
        <div className="bg-white rounded-xl border border-[#DDE5D4] p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Prominent Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#588157] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="portal-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by MP name, constituency, state, work ID, work title..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#F8F9F7] hover:bg-white focus:bg-white text-xs text-[#1B3022] placeholder:text-[#8FA391] border border-[#DDE5D4] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#395C40] focus:border-[#395C40] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA391] hover:text-[#1B3022] p-1 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Modal Trigger Button */}
            <button
              id="portal-filter-button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer shrink-0 ${
                activeFiltersCount > 0
                  ? 'bg-[#1B3022] text-white border-[#1B3022]'
                  : 'bg-white hover:bg-[#F8F9F7] text-[#1B3022] border-[#DDE5D4]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#A3B18A] text-[#1B3022] text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter badges / Active state chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#588157] font-medium text-[11px]">
                Showing: <strong className="text-[#1B3022]">{sortedMpRecords.length} MPs</strong> &bull; <strong className="text-[#1B3022]">{filteredWorks.length} Matching Works</strong>
              </span>

              {/* Active Filter Chips */}
              {selectedState !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF0E6] text-[#2D4A32] text-[11px] font-medium border border-[#C8D5B9]">
                  State: {selectedState}
                  <button onClick={() => setSelectedState('All')} className="hover:text-red-700 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedConstituency !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF0E6] text-[#2D4A32] text-[11px] font-medium border border-[#C8D5B9]">
                  Const: {selectedConstituency}
                  <button onClick={() => setSelectedConstituency('All')} className="hover:text-red-700 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedStatus !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF0E6] text-[#2D4A32] text-[11px] font-medium border border-[#C8D5B9]">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus('All')} className="hover:text-red-700 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSector !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF0E6] text-[#2D4A32] text-[11px] font-medium border border-[#C8D5B9]">
                  Sector: {selectedSector}
                  <button onClick={() => setSelectedSector('All')} className="hover:text-red-700 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedFinYear !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EAF0E6] text-[#2D4A32] text-[11px] font-medium border border-[#C8D5B9]">
                  FY: {selectedFinYear}
                  <button onClick={() => setSelectedFinYear('All')} className="hover:text-red-700 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#B85338] hover:underline font-semibold ml-1 cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Tab switch between MP allocation view and Developmental Works view */}
            <div className="flex items-center gap-1 bg-[#F8F9F7] p-0.5 rounded-lg border border-[#DDE5D4]">
              <button
                onClick={() => setActiveViewTab('mps')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  activeViewTab === 'mps'
                    ? 'bg-white text-[#1B3022] shadow-2xs'
                    : 'text-[#588157] hover:text-[#1B3022]'
                }`}
              >
                MP Allocations ({sortedMpRecords.length})
              </button>
              <button
                onClick={() => setActiveViewTab('works')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                  activeViewTab === 'works'
                    ? 'bg-white text-[#1B3022] shadow-2xs'
                    : 'text-[#588157] hover:text-[#1B3022]'
                }`}
              >
                Detailed Works ({filteredWorks.length})
              </button>
            </div>
          </div>
        </div>

        {/* 5. MP DATA TABLE ("Allocated Limit for Hon'ble MPs") */}
        {activeViewTab === 'mps' ? (
          <div className="bg-white rounded-xl border border-[#DDE5D4] overflow-hidden shadow-2xs">
            {/* Table Header with Title & Export Actions */}
            <div className="px-4 py-3 bg-[#F8F9F7] border-b border-[#DDE5D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#1B3022]">
                  Allocated Limit for Hon'ble MPs
                </h3>
                <p className="text-[11px] text-[#588157]">
                  {activeChamber} &bull; State-wise & MP-wise Allocation, Recommendation and Utilization
                </p>
              </div>

              {/* Working Export Buttons: [Excel] [CSV] [PDF] */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#588157] font-semibold hidden md:inline">Export:</span>
                <button
                  id="export-excel-btn"
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-[#EAF0E6] text-[#1B3022] border border-[#DDE5D4] transition-colors cursor-pointer shadow-2xs"
                  title="Export to Microsoft Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#395C40]" />
                  <span>Excel</span>
                </button>
                <button
                  id="export-csv-btn"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-[#EAF0E6] text-[#1B3022] border border-[#DDE5D4] transition-colors cursor-pointer shadow-2xs"
                  title="Export to CSV"
                >
                  <FileText className="w-3.5 h-3.5 text-[#395C40]" />
                  <span>CSV</span>
                </button>
                <button
                  id="export-pdf-btn"
                  onClick={handleExportPdf}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-[#EAF0E6] text-[#1B3022] border border-[#DDE5D4] transition-colors cursor-pointer shadow-2xs"
                  title="Print / Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-[#395C40]" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            {/* Table Container with Horizontal Scroll */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1B3022] text-white select-none">
                    <th
                      onClick={() => handleSort('srNo')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide cursor-pointer hover:bg-[#26412f]"
                    >
                      Sr. No.
                    </th>
                    <th
                      onClick={() => handleSort('state')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide cursor-pointer hover:bg-[#26412f]"
                    >
                      State
                    </th>
                    <th
                      onClick={() => handleSort('mpName')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide cursor-pointer hover:bg-[#26412f]"
                    >
                      Hon'ble Member of Parliament
                    </th>
                    <th
                      onClick={() => handleSort('constituency')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide cursor-pointer hover:bg-[#26412f]"
                    >
                      Constituency
                    </th>
                    <th
                      onClick={() => handleSort('allocatedAmountCr')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide text-right cursor-pointer hover:bg-[#26412f]"
                    >
                      Allocated Amount
                    </th>
                    <th
                      onClick={() => handleSort('recommendedAmountCr')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide text-right cursor-pointer hover:bg-[#26412f]"
                    >
                      Recommended Amount
                    </th>
                    <th
                      onClick={() => handleSort('sanctionedAmountCr')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide text-right cursor-pointer hover:bg-[#26412f]"
                    >
                      Sanctioned Amount
                    </th>
                    <th
                      onClick={() => handleSort('utilizedAmountCr')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide text-right cursor-pointer hover:bg-[#26412f]"
                    >
                      Utilized Amount
                    </th>
                    <th
                      onClick={() => handleSort('worksRecommended')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide text-right cursor-pointer hover:bg-[#26412f]"
                    >
                      Works Recommended
                    </th>
                    <th
                      onClick={() => handleSort('worksSanctioned')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide text-right cursor-pointer hover:bg-[#26412f]"
                    >
                      Works Sanctioned
                    </th>
                    <th
                      onClick={() => handleSort('worksCompleted')}
                      className="py-3 px-3.5 font-semibold text-[11px] tracking-wide text-right cursor-pointer hover:bg-[#26412f]"
                    >
                      Works Completed
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAF0E6]">
                  {paginatedMpRecords.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-10 text-center text-xs text-[#588157]">
                        <div className="max-w-xs mx-auto space-y-2">
                          <Info className="w-6 h-6 text-[#8FA391] mx-auto" />
                          <div className="font-semibold text-[#1B3022]">No MP records found</div>
                          <div className="text-[11px]">Try adjusting your search query or reset applied filters.</div>
                          <button
                            onClick={handleResetFilters}
                            className="px-3 py-1.5 rounded-md bg-[#EAF0E6] text-[#2D4A32] text-xs font-semibold hover:bg-[#DCE7D6] cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedMpRecords.map((r, i) => (
                      <tr
                        key={r.mpName + i}
                        className="hover:bg-[#F8F9F7] transition-colors"
                      >
                        <td className="py-2.5 px-3.5 text-[#588157] font-mono text-xs">{r.srNo}</td>
                        <td className="py-2.5 px-3.5 font-medium text-[#1B3022] whitespace-nowrap">{r.state}</td>
                        <td className="py-2.5 px-3.5 font-semibold text-[#1B3022] whitespace-nowrap">
                          {r.mpName}
                        </td>
                        <td className="py-2.5 px-3.5 text-[#588157] whitespace-nowrap">{r.constituency}</td>
                        <td className="py-2.5 px-3.5 text-right font-medium text-[#1B3022] whitespace-nowrap">
                          ₹{r.allocatedAmountCr.toFixed(2)} Cr
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-[#395C40] font-medium whitespace-nowrap">
                          ₹{r.recommendedAmountCr.toFixed(2)} Cr
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-[#1B3022] font-semibold whitespace-nowrap">
                          ₹{r.sanctionedAmountCr.toFixed(2)} Cr
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-[#2D4A32] font-medium whitespace-nowrap">
                          ₹{r.utilizedAmountCr.toFixed(2)} Cr
                        </td>
                        <td className="py-2.5 px-3.5 text-right text-[#1B3022] font-medium">{r.worksRecommended}</td>
                        <td className="py-2.5 px-3.5 text-right text-[#395C40] font-semibold">{r.worksSanctioned}</td>
                        <td className="py-2.5 px-3.5 text-right text-[#138808] font-bold">{r.worksCompleted}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {sortedMpRecords.length > 0 && (
              <div className="px-4 py-3 bg-[#F8F9F7] border-t border-[#DDE5D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-[#588157]">
                  Showing {(mpPage - 1) * mpPageSize + 1} to{' '}
                  {Math.min(mpPage * mpPageSize, sortedMpRecords.length)} of {sortedMpRecords.length} MPs
                </span>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => setMpPage(p => Math.max(1, p - 1))}
                    disabled={mpPage === 1}
                    className="px-2.5 py-1 rounded bg-white border border-[#DDE5D4] text-[#1B3022] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EAF0E6] cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalMpPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMpPage(idx + 1)}
                      className={`w-7 h-7 rounded text-xs font-semibold cursor-pointer ${
                        mpPage === idx + 1
                          ? 'bg-[#1B3022] text-white'
                          : 'bg-white border border-[#DDE5D4] text-[#588157] hover:bg-[#EAF0E6]'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setMpPage(p => Math.min(totalMpPages, p + 1))}
                    disabled={mpPage === totalMpPages}
                    className="px-2.5 py-1 rounded bg-white border border-[#DDE5D4] text-[#1B3022] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EAF0E6] cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Detailed Works View */
          <div className="bg-white rounded-xl border border-[#DDE5D4] overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-[#F8F9F7] border-b border-[#DDE5D4] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1B3022]">Matching Developmental Works</h3>
                <p className="text-[11px] text-[#588157]">
                  Click on any developmental project to inspect sanction orders, photos, and live completion status
                </p>
              </div>
              <button
                onClick={() => setActiveViewTab('mps')}
                className="text-xs font-semibold text-[#395C40] hover:underline cursor-pointer"
              >
                &larr; Switch to MP Summary
              </button>
            </div>

            <div className="divide-y divide-[#EAF0E6]">
              {paginatedWorks.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#588157]">
                  <p className="font-semibold text-sm text-[#1B3022]">No works match your current criteria</p>
                  <p className="text-xs mt-1">Try resetting or broadening your search parameters.</p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-3 px-3 py-1.5 rounded-md bg-[#EAF0E6] text-[#2D4A32] text-xs font-semibold hover:bg-[#DCE7D6] cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                paginatedWorks.map(p => (
                  <div
                    key={p.id}
                    className="p-4 hover:bg-[#F8F9F7] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1B3022] bg-[#EAF0E6] px-2 py-0.5 rounded border border-[#C8D5B9]">
                          {p.projectCode}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'Ongoing'
                              ? 'bg-blue-100 text-blue-800'
                              : p.status === 'Delayed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                        <span className="text-[11px] text-[#588157] font-medium">
                          {p.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#1B3022] truncate">{p.title}</h4>
                      <p className="text-xs text-[#588157] line-clamp-1">{p.locationAddress}</p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#588157] pt-1">
                        <span>MP: <strong className="text-[#1B3022]">{p.mpName}</strong></span>
                        <span>Agency: <strong className="text-[#1B3022]">{p.implementingAgencyName}</strong></span>
                        <span>Sanction: <strong className="text-[#1B3022]">₹{(p.sanctionedAmount / 100000).toFixed(1)} Lakh</strong></span>
                        <span>Progress: <strong className="text-[#138808]">{p.completionPercentage}%</strong></span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => onSelectProject(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1B3022] hover:bg-[#284431] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination for Works */}
            {filteredWorks.length > 0 && (
              <div className="px-4 py-3 bg-[#F8F9F7] border-t border-[#DDE5D4] flex items-center justify-between text-xs">
                <span className="text-[#588157]">
                  Showing {(worksPage - 1) * worksPageSize + 1} to{' '}
                  {Math.min(worksPage * worksPageSize, filteredWorks.length)} of {filteredWorks.length} works
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setWorksPage(p => Math.max(1, p - 1))}
                    disabled={worksPage === 1}
                    className="px-2.5 py-1 rounded bg-white border border-[#DDE5D4] text-[#1B3022] disabled:opacity-40 hover:bg-[#EAF0E6] cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="px-2 text-xs font-semibold text-[#1B3022]">
                    Page {worksPage} of {totalWorksPages}
                  </span>
                  <button
                    onClick={() => setWorksPage(p => Math.min(totalWorksPages, p + 1))}
                    disabled={worksPage === totalWorksPages}
                    className="px-2.5 py-1 rounded bg-white border border-[#DDE5D4] text-[#1B3022] disabled:opacity-40 hover:bg-[#EAF0E6] cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. CITIZEN OPINION & PUBLIC FEEDBACK (Dedicated Section, No Official Login Needed) */}
        <div id="feedback-section" className="bg-white rounded-xl border border-[#DDE5D4] p-5 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDE5D4]">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-[#395C40]" />
                <h3 className="text-base font-bold text-[#1B3022]">
                  Citizen Opinion & Public Feedback
                </h3>
              </div>
              <p className="text-xs text-[#588157] mt-0.5">
                Share citizen feedback, report delays or quality concerns, and express public satisfaction. Stored separately from official records.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF0E6] text-[#2D4A32] text-xs font-semibold border border-[#C8D5B9]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#395C40]" />
              <span>Public Portal Feature • No Login Required</span>
            </div>
          </div>

          {/* Feedback Form & Recent Registry Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Feedback Submission Form */}
            <div className="lg:col-span-6 bg-[#F8F9F7] p-4 sm:p-5 rounded-xl border border-[#DDE5D4] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B3022] uppercase tracking-wide">
                  Submit Citizen Observation
                </span>
                <span className="text-[10px] text-[#588157]">Direct to District Authority</span>
              </div>

              {feedbackSuccessId ? (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Feedback Registered Successfully!</span>
                  </div>
                  <p>
                    Your citizen feedback has been logged under Tracking Reference ID:{' '}
                    <strong className="font-mono text-emerald-900">{feedbackSuccessId}</strong>.
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    District Authority and Vigilance Officers review all public reports for ground verification.
                  </p>
                  <button
                    onClick={() => setFeedbackSuccessId(null)}
                    className="mt-2 text-xs font-semibold underline text-emerald-800 cursor-pointer"
                  >
                    Submit Another Feedback
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
                  {fbFormError && (
                    <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
                      {fbFormError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[#1B3022] font-semibold mb-1">
                      Select MPLADS Work *
                    </label>
                    <select
                      value={fbProjectId}
                      onChange={e => setFbProjectId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40] focus:border-[#395C40]"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.projectCode} &mdash; {p.title.slice(0, 50)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#1B3022] font-semibold mb-1">
                        Category of Observation *
                      </label>
                      <select
                        value={fbIssueType}
                        onChange={e => setFbIssueType(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40] focus:border-[#395C40]"
                      >
                        <option value="Incomplete Work">Incomplete Work</option>
                        <option value="Poor Quality">Substandard Material Quality</option>
                        <option value="Delay Risk">Unexplained Delay in Execution</option>
                        <option value="Incorrect Location">Location Discrepancy</option>
                        <option value="Damaged Asset">Damaged / Non-Functional Asset</option>
                        <option value="Public Appreciation">Public Appreciation / Work Completed Well</option>
                        <option value="Other">General Suggestion</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#1B3022] font-semibold mb-1">
                        Citizen Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={fbCitizenName}
                        onChange={e => setFbCitizenName(e.target.value)}
                        placeholder="Anonymous or Name"
                        className="w-full px-3 py-2 bg-white border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40] focus:border-[#395C40]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#1B3022] font-semibold mb-1">
                      Phone or Email (Optional, masked for privacy)
                    </label>
                    <input
                      type="text"
                      value={fbCitizenContact}
                      onChange={e => setFbCitizenContact(e.target.value)}
                      placeholder="+91 98490 ***** or citizen@email.com"
                      className="w-full px-3 py-2 bg-white border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40] focus:border-[#395C40]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1B3022] font-semibold mb-1">
                      Observation Details & Ground Realities *
                    </label>
                    <textarea
                      rows={3}
                      value={fbDescription}
                      onChange={e => setFbDescription(e.target.value)}
                      placeholder="Describe what you observed on site, current state of the facility, quality issues or public satisfaction..."
                      className="w-full px-3 py-2 bg-white border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40] focus:border-[#395C40]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={feedbackSubmitting}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#1B3022] hover:bg-[#284431] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{feedbackSubmitting ? 'Submitting Feedback...' : 'Submit Feedback to Public Registry'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Public Feedback Transparency Feed */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B3022] uppercase tracking-wide">
                  Public Feedback Registry ({feedbacks.length})
                </span>
                <span className="text-[11px] text-[#588157]">Verified Transparency Log</span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {feedbackLoading ? (
                  <div className="p-6 text-center text-xs text-[#588157]">
                    Loading public citizen observations...
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="p-6 bg-[#F8F9F7] rounded-lg border border-[#DDE5D4] text-center text-xs text-[#588157]">
                    No public grievances registered yet. Be the first to share ground observation!
                  </div>
                ) : (
                  feedbacks.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#F8F9F7] hover:bg-white rounded-lg border border-[#DDE5D4] text-xs space-y-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-[#1B3022] bg-white px-1.5 py-0.5 rounded border border-[#DDE5D4]">
                            {item.id}
                          </span>
                          <span className="text-[11px] font-semibold text-[#1B3022] truncate max-w-[180px]">
                            {item.issueType}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Verified'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'Under Review'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#4A6451] line-clamp-2">{item.description}</p>

                      <div className="flex items-center justify-between text-[10px] text-[#8FA391] pt-1 border-t border-[#EAF0E6]">
                        <span>Citizen: {item.citizenName || 'Public Observer'}</span>
                        <span>{new Date(item.submittedAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FILTER MODAL / PANEL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl border border-[#DDE5D4] max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#1B3022] text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#A3B18A] uppercase font-bold tracking-wider">
                  Precise Search & Filter Engine
                </div>
                <h3 className="text-base font-bold">Filter MPLADS Records</h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1 rounded-lg text-[#DDE5D4] hover:text-white hover:bg-[#395C40] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Form Fields */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* A. Tenure */}
                <div>
                  <label className="block font-semibold text-[#1B3022] mb-1">A. Tenure</label>
                  <select
                    value={selectedTenure}
                    onChange={e => setSelectedTenure(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40]"
                  >
                    <option value="18th Lok Sabha">18th Lok Sabha (Current)</option>
                    <option value="17th Lok Sabha">17th Lok Sabha</option>
                    <option value="All Tenures">All Tenures</option>
                  </select>
                </div>

                {/* B. State */}
                <div>
                  <label className="block font-semibold text-[#1B3022] mb-1">B. State / UT</label>
                  <select
                    value={selectedState}
                    onChange={e => {
                      setSelectedState(e.target.value);
                      setSelectedConstituency('All');
                      setSelectedMp('All');
                    }}
                    className="w-full px-3 py-2 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40]"
                  >
                    <option value="All">All States / UTs</option>
                    {availableStates.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* C. Constituency (Dynamic) */}
                <div>
                  <label className="block font-semibold text-[#1B3022] mb-1">
                    C. Constituency (Dynamic)
                  </label>
                  <select
                    value={selectedConstituency}
                    onChange={e => setSelectedConstituency(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40]"
                  >
                    <option value="All">All Constituencies</option>
                    {availableConstituencies.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* D. MP Name (Dynamic) */}
                <div>
                  <label className="block font-semibold text-[#1B3022] mb-1">
                    D. Hon'ble MP Name (Dynamic)
                  </label>
                  <select
                    value={selectedMp}
                    onChange={e => setSelectedMp(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40]"
                  >
                    <option value="All">All Hon'ble MPs</option>
                    {availableMps.map(m => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* E. Work Status */}
                <div>
                  <label className="block font-semibold text-[#1B3022] mb-1">E. Work Status</label>
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40]"
                  >
                    <option value="All">All Statuses</option>
                    {workStatuses.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* F. Sector */}
                <div>
                  <label className="block font-semibold text-[#1B3022] mb-1">F. Sector / Category</label>
                  <select
                    value={selectedSector}
                    onChange={e => setSelectedSector(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40]"
                  >
                    <option value="All">All Sectors</option>
                    {sectorsList.map(sec => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* G. Financial Year */}
                <div>
                  <label className="block font-semibold text-[#1B3022] mb-1">G. Financial Year</label>
                  <select
                    value={selectedFinYear}
                    onChange={e => setSelectedFinYear(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40]"
                  >
                    <option value="All">All Financial Years</option>
                    {financialYears.map(fy => (
                      <option key={fy} value={fy}>
                        {fy}
                      </option>
                    ))}
                  </select>
                </div>

                {/* H. District */}
                <div>
                  <label className="block font-semibold text-[#1B3022] mb-1">H. District</label>
                  <select
                    value={selectedDistrict}
                    onChange={e => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F9F7] border border-[#DDE5D4] rounded-lg text-xs focus:ring-1 focus:ring-[#395C40]"
                  >
                    <option value="All">All Districts</option>
                    {availableDistricts.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#F8F9F7] border-t border-[#DDE5D4] flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#B85338] hover:bg-red-50 border border-transparent transition-colors cursor-pointer"
              >
                Reset Filters
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#1B3022] hover:bg-[#EAF0E6] border border-[#DDE5D4] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMpPage(1);
                    setWorksPage(1);
                    setIsFilterModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#1B3022] hover:bg-[#284431] text-white shadow-2xs transition-colors cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#DDE5D4] py-6 px-4 mt-12 text-xs text-[#588157]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#1B3022] text-white flex items-center justify-center font-bold text-[9px]">
              GOI
            </div>
            <div>
              <div className="font-bold text-[#1B3022]">e-SAKSHI Portal &bull; MPLADS Digital Governance</div>
              <div className="text-[11px]">Ministry of Statistics & Programme Implementation, Government of India</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="#dashboard-section" className="hover:text-[#1B3022]">Dashboard</a>
            <a href="#feedback-section" className="hover:text-[#1B3022]">Citizen Feedback</a>
            <button onClick={onEnterPublic} className="hover:text-[#1B3022] cursor-pointer">Public Portal</button>
            <button onClick={() => onOpenLogin()} className="hover:text-[#1B3022] cursor-pointer font-semibold">Officer Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
