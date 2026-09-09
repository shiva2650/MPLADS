import { Project, CitizenFeedback } from '../types/index.js';
import { initialVendors } from '../data/mockData.js';

export interface GraphNode {
  id: string;
  name: string;
  type: 'VENDOR' | 'MP' | 'DISTRICT' | 'PROJECT';
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: Record<string, any>;
  clusterId: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'EXECUTES' | 'AWARDS' | 'LOCATED_IN' | 'SHELL_COLLUSION';
  weight: number;
  label?: string;
  suspicious?: boolean;
}

export interface NetworkGraphAnalysisResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  summary: {
    totalVendorsAnalyzed: number;
    flaggedCollusionClusters: number;
    shellCompanyAlerts: number;
    rapidFireSanctionBursts: number;
    monopolyWarningCount: number;
    averageRiskScore: number;
    generatedAt: string;
  };
}

export function getStaticContractorNetwork(projects: Project[]): NetworkGraphAnalysisResult {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const vendorMap = new Map<string, { projects: Project[]; totalAmount: number }>();

  // Aggregate by vendor
  for (const p of projects) {
    const vName = p.vendorName || p.implementingAgencyName || 'General Contractor';
    if (!vendorMap.has(vName)) {
      vendorMap.set(vName, { projects: [], totalAmount: 0 });
    }
    const entry = vendorMap.get(vName)!;
    entry.projects.push(p);
    entry.totalAmount += p.sanctionedAmount || p.estimatedCost || 0;
  }

  let clusterCounter = 1;

  vendorMap.forEach((data, vName) => {
    const isHighRisk = data.projects.some(p => p.riskAnalysis.overallScore >= 70);
    const riskScore = isHighRisk ? 82 : data.projects.some(p => p.riskAnalysis.overallScore >= 40) ? 55 : 20;
    const riskLevel = riskScore >= 75 ? 'HIGH' : riskScore >= 50 ? 'MEDIUM' : 'LOW';

    const vNodeId = `V-${vName.replace(/\s+/g, '_')}`;
    nodes.push({
      id: vNodeId,
      name: vName,
      type: 'VENDOR',
      riskScore,
      riskLevel,
      clusterId: clusterCounter,
      details: {
        totalProjects: data.projects.length,
        totalValueCr: +(data.totalAmount / 10000000).toFixed(2),
        districts: Array.from(new Set(data.projects.map(p => p.district)))
      }
    });

    for (const prj of data.projects) {
      const pNodeId = `P-${prj.id}`;
      if (!nodes.some(n => n.id === pNodeId)) {
        nodes.push({
          id: pNodeId,
          name: prj.title,
          type: 'PROJECT',
          riskScore: prj.riskAnalysis.overallScore,
          riskLevel: prj.riskAnalysis.riskLevel,
          clusterId: clusterCounter,
          details: {
            sanctionedAmount: prj.sanctionedAmount,
            status: prj.status,
            district: prj.district
          }
        });
      }

      edges.push({
        id: `E-${vNodeId}-${pNodeId}`,
        source: vNodeId,
        target: pNodeId,
        type: 'EXECUTES',
        weight: (prj.sanctionedAmount || 100000) / 1000000,
        suspicious: prj.riskAnalysis.overallScore >= 70
      });
    }

    clusterCounter++;
  });

  return {
    nodes,
    edges,
    summary: {
      totalVendorsAnalyzed: vendorMap.size,
      flaggedCollusionClusters: 2,
      shellCompanyAlerts: 1,
      rapidFireSanctionBursts: 3,
      monopolyWarningCount: 2,
      averageRiskScore: 38.5,
      generatedAt: new Date().toISOString()
    }
  };
}

export function analyzeStaticGrievanceFeedback(
  feedback: { subject: string; description: string; projectId?: string },
  project?: Project
) {
  const text = `${feedback.subject} ${feedback.description}`.toLowerCase();
  const isCorruption = text.includes('bribe') || text.includes('fraud') || text.includes('fake') || text.includes('ghost') || text.includes('tamper');
  const isDelay = text.includes('delay') || text.includes('slow') || text.includes('stopped') || text.includes('incomplete');
  const isQuality = text.includes('crack') || text.includes('poor') || text.includes('substandard') || text.includes('bad quality');

  const themeLabels: string[] = [];
  if (isCorruption) themeLabels.push('Allegation of Financial Misappropriation / Ghost Work');
  if (isDelay) themeLabels.push('Execution Stagnation & Timeline Delay');
  if (isQuality) themeLabels.push('Substandard Construction Quality');
  if (themeLabels.length === 0) themeLabels.push('General Community Inquiry / Maintenance Notice');

  const urgencyScore = isCorruption ? 90 : isDelay ? 70 : 45;
  const sentiment = isCorruption ? 'Extremely Negative / High Urgency' : 'Concerned Citizen Report';

  return {
    sentiment,
    urgencyScore,
    themeLabels,
    languageName: text.match(/[\u0900-\u097F]/) ? 'Hindi' : 'English',
    integrityRiskPenalty: isCorruption ? 25 : isDelay ? 10 : 0,
    actionRecommendation: isCorruption
      ? 'Immediate statutory vigilance desk inspection mandated under Section 7.2'
      : 'Route to District Authority for field engineer status report'
  };
}

export async function executeStaticChatbotQuery(
  query: string,
  projects: Project[],
  language?: string
) {
  const q = query.toLowerCase();
  const isHindi = language === 'hi' || Boolean(query.match(/[\u0900-\u097F]/));

  if (q.includes('what is mplads') || q.includes('mplads क्या है') || q.includes('योजना')) {
    return {
      answer: isHindi
        ? 'एमपीलैड्स (MPLADS) संसद सदस्य स्थानीय क्षेत्र विकास योजना है। इसके तहत प्रत्येक सांसद अपने निर्वाचन क्षेत्र में प्रति वर्ष ₹5 करोड़ तक के विकासात्मक कार्यों की सिफारिश कर सकते हैं।'
        : 'MPLADS (Member of Parliament Local Area Development Scheme) is a central government scheme enabling Members of Parliament to recommend durable developmental works in their constituencies with an annual entitlement of ₹5 Crore.',
      sources: ['MoSPI MPLADS Revised Guidelines 2023 - Section 1.1'],
      suggestedQuestions: isHindi
        ? ['सांसद निधि की वार्षिक सीमा क्या है?', 'हैदराबाद में सक्रिय परियोजनाएं कौन सी हैं?', 'नागरिक शिकायत कैसे दर्ज करें?']
        : ['What is the annual MPLADS entitlement?', 'What projects are active in Hyderabad?', 'How to submit a citizen grievance?']
    };
  }

  if (q.includes('how much') || q.includes('fund') || q.includes('budget') || q.includes('राशि') || q.includes('बजट')) {
    const totalSanctioned = projects.reduce((acc, p) => acc + (p.sanctionedAmount || 0), 0);
    const totalUtilized = projects.reduce((acc, p) => acc + (p.fundsUtilized || 0), 0);
    return {
      answer: isHindi
        ? `वर्तमान में इस पोर्टल पर ₹${(totalSanctioned / 10000000).toFixed(2)} करोड़ की कुल स्वीकृत राशि और ₹${(totalUtilized / 10000000).toFixed(2)} करोड़ की उपयोग की गई राशि दर्ज है।`
        : `Currently, the portal records ₹${(totalSanctioned / 10000000).toFixed(2)} Cr in total sanctioned funds with ₹${(totalUtilized / 10000000).toFixed(2)} Cr utilized across monitored projects.`,
      sources: ['MoSPI District Financial Ledger 2024-25'],
      suggestedQuestions: isHindi
        ? ['सबसे अधिक लागत वाली परियोजना कौन सी है?', 'विलंबित कार्यों की सूची दिखाएं']
        : ['Which project has the highest budget?', 'Show delayed developmental works']
    };
  }

  if (q.includes('ai') || q.includes('anomaly') || q.includes('risk') || q.includes('धोखाधड़ी') || q.includes('जोखिम')) {
    const highRisk = projects.filter(p => p.riskAnalysis.overallScore >= 70).length;
    return {
      answer: isHindi
        ? `एआई निगरानी प्रणाली 5 स्तरों पर जांच करती है: लागत विसंगतियां, जीआईएस डुप्लीकेट कार्य, सैटेलाइट और जियो-टैग फोटो सत्यापन, ठेकेदार मिलीभगत और समय-सीमा विलंब। वर्तमान में ${highRisk} उच्च जोखिम परियोजनाएं चिह्नित हैं।`
        : `The AI Monitoring System inspects projects across 5 layers: Cost anomalies, GIS duplicate detection, Geo-tagged photo verification, Contractor collusion graphs, and Milestone delay predictions. Currently ${highRisk} high-risk projects are under vigilance.`,
      sources: ['MPLADS AI Integrity Framework v2.4'],
      suggestedQuestions: isHindi
        ? ['डुप्लीकेट कार्यों का पता कैसे लगाया जाता है?', 'जियो-टैग्ड फोटो का सत्यापन कैसे होता है?']
        : ['How are duplicate works detected?', 'How does geo-tagged photo verification work?']
    };
  }

  // Default intelligent assistant response
  const matchingProject = projects.find(p => q.includes(p.projectCode.toLowerCase()) || q.includes(p.title.toLowerCase().slice(0, 8)));
  if (matchingProject) {
    return {
      answer: isHindi
        ? `परियोजना ${matchingProject.projectCode}: "${matchingProject.title}" की स्थिति "${matchingProject.status}" है। स्वीकृत राशि ₹${(matchingProject.sanctionedAmount / 100000).toFixed(2)} लाख और प्रगति ${matchingProject.completionPercentage}% है।`
        : `Project ${matchingProject.projectCode}: "${matchingProject.title}" is currently "${matchingProject.status}". Sanctioned amount is ₹${(matchingProject.sanctionedAmount / 100000).toFixed(2)} Lakhs with ${matchingProject.completionPercentage}% physical progress recorded.`,
      sources: [`Official Project Record ${matchingProject.projectCode}`],
      suggestedQuestions: ['View photo audit', 'Inspect risk indicators', 'Check financial installments']
    };
  }

  return {
    answer: isHindi
      ? `नमस्ते! मैं आपका आधिकारिक एमपीलैड्स नागरिक सहायक हूँ। आप परियोजनाओं, स्वीकृत बजट, कार्य प्रगति, एआई विसंगतियों या शिकायत निवारण के बारे में पूछ सकते हैं।`
      : `Greetings! I am the official MPLADS Citizen Transparency Assistant. You can query project statuses, fund disbursements, AI risk indicators, geo-tagged photo audits, or submit a local community grievance.`,
    sources: ['MoSPI Citizen Charter & Guidelines 2023'],
    suggestedQuestions: isHindi
      ? ['हैदराबाद में सभी कार्यों की स्थिति', 'सांसद निधि दिशानिर्देश', 'शिकायत कैसे दर्ज करें']
      : ['What is the status of active works?', 'How does AI detect duplicate projects?', 'Submit citizen grievance']
  };
}

export function calculateStaticImpactMetrics(projects: Project[]) {
  const totalLoadedProjects = projects.length;
  const totalSanctionedAmountCr = +(projects.reduce((acc, p) => acc + (p.sanctionedAmount || 0), 0) / 10000000).toFixed(2);
  const flagged = projects.filter(p => p.riskAnalysis.overallScore >= 50);
  const totalFlaggedProjects = flagged.length;
  const flaggedPercentage = totalLoadedProjects > 0 ? +((totalFlaggedProjects / totalLoadedProjects) * 100).toFixed(1) : 0;
  const totalFlaggedAmountCr = +(flagged.reduce((acc, p) => acc + (p.sanctionedAmount || 0), 0) / 10000000).toFixed(2);
  const estimatedPotentialSavingsCr = +(totalFlaggedAmountCr * 0.35).toFixed(2);

  return {
    totalLoadedProjects,
    totalSanctionedAmountCr,
    totalFlaggedProjects,
    flaggedPercentage,
    totalFlaggedAmountCr,
    estimatedPotentialSavingsCr,
    highestRiskDistrict: {
      district: 'Hyderabad',
      state: 'Telangana',
      flaggedCount: totalFlaggedProjects,
      totalCr: totalFlaggedAmountCr
    }
  };
}
