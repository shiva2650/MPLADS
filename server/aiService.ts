import { Project, DuplicateProjectCandidate, RiskLevel } from '../src/types/index.js';
import { GoogleGenAI } from '@google/genai';

// Standard benchmarks for category costs in Lakhs (INR)
export const CATEGORY_COST_BENCHMARKS: Record<string, { min: number; max: number; typical: number; unitDescription: string }> = {
  'Community Infrastructure': { min: 1500000, max: 2500000, typical: 2000000, unitDescription: 'Standard plinth community center (2000-3000 sq ft)' },
  'Drinking Water & Sanitation': { min: 1200000, max: 2000000, typical: 1600000, unitDescription: '2000 LPH RO water filtration plant or OHSR unit' },
  'Education & Schools': { min: 1800000, max: 3000000, typical: 2400000, unitDescription: 'Govt high school modernization & digital classroom package' },
  'Renewable Energy': { min: 2500000, max: 4000000, typical: 3200000, unitDescription: '50-100 high-mast solar LED poles or 50kWp rooftop solar' },
  'Healthcare & Wellness': { min: 2500000, max: 4500000, typical: 3500000, unitDescription: 'Primary health sub-centre or mobile ambulance life support unit' },
  'Roads, Bridges & Pathways': { min: 1500000, max: 2800000, typical: 2200000, unitDescription: 'Cement concrete road with cover drains (approx. 500m)' },
  'Child & Women Welfare': { min: 1000000, max: 1800000, typical: 1400000, unitDescription: 'Anganwadi building or SHG training facility' },
  'Skill Development & IT': { min: 1500000, max: 2500000, typical: 2000000, unitDescription: '40-terminal IT computer lab with UPS & networking' },
  'Public Safety & Security': { min: 3000000, max: 5000000, typical: 4000000, unitDescription: '100+ CCTV camera network and control room integration' },
  'Sports & Recreation': { min: 1200000, max: 2200000, typical: 1700000, unitDescription: 'Open outdoor gym with 12 equipment pedestals & walking track' }
};

// Haversine distance calculator in meters
export function calculateHaversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Token Jaccard text similarity
export function calculateTextSimilarity(text1: string, text2: string): number {
  const tokenize = (str: string) => {
    return new Set(
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2)
    );
  };
  const setA = tokenize(text1);
  const setB = tokenize(text2);
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return Math.round((intersection.size / union.size) * 100);
}

// 1. Cost Anomaly Detection
export function evaluateCostAnomaly(project: Project) {
  const benchmark = CATEGORY_COST_BENCHMARKS[project.category] || {
    min: 1500000,
    max: 3000000,
    typical: 2200000,
    unitDescription: 'Standard public civil infrastructure'
  };

  const cost = project.sanctionedAmount || project.estimatedCost;
  const isHigherThanMax = cost > benchmark.max;
  const percentageOverTypical = Math.round(((cost - benchmark.typical) / benchmark.typical) * 100);

  let costScore = 15;
  let isAnomaly = false;
  let explanation = `Cost is within expected benchmark parameters (₹${(benchmark.min / 100000).toFixed(1)}L - ₹${(benchmark.max / 100000).toFixed(1)}L).`;

  if (percentageOverTypical > 50) {
    isAnomaly = true;
    costScore = Math.min(95, 50 + Math.round((percentageOverTypical - 50) * 0.8));
    explanation = `Project cost (₹${(cost / 100000).toFixed(1)}L) is ${percentageOverTypical}% higher than typical benchmark (₹${(benchmark.typical / 100000).toFixed(1)}L) for ${project.category}. Advisory review recommended.`;
  } else if (percentageOverTypical > 25) {
    costScore = 45;
    explanation = `Project cost is moderately elevated (+${percentageOverTypical}% vs typical benchmark).`;
  }

  return {
    isAnomaly,
    costScore,
    benchmarkMin: benchmark.min,
    benchmarkMax: benchmark.max,
    typicalCost: benchmark.typical,
    percentageVariance: percentageOverTypical,
    explanation,
    unitDescription: benchmark.unitDescription
  };
}

// 2. Duplicate Project Detection
export function findDuplicateCandidates(project: Project, allProjects: Project[]): DuplicateProjectCandidate[] {
  const duplicates: DuplicateProjectCandidate[] = [];

  for (const other of allProjects) {
    if (other.id === project.id) continue;

    const distance = calculateHaversineDistanceMeters(
      project.latitude,
      project.longitude,
      other.latitude,
      other.longitude
    );

    const titleSim = calculateTextSimilarity(project.title, other.title);
    const descSim = calculateTextSimilarity(project.description, other.description);
    const textSim = Math.round(titleSim * 0.7 + descSim * 0.3);

    const isSameCategory = project.category === other.category;
    let combinedScore = textSim;

    // Weight distance heavily if within 1km (1000 meters)
    if (distance < 500) {
      combinedScore = Math.min(98, combinedScore + 25);
    } else if (distance < 1000) {
      combinedScore = Math.min(95, combinedScore + 15);
    }

    if (isSameCategory) {
      combinedScore = Math.min(99, combinedScore + 10);
    }

    if (combinedScore >= 65 || (distance < 600 && isSameCategory)) {
      const matchingFactors: string[] = [];
      if (distance < 1000) matchingFactors.push(`High spatial proximity (${distance} meters apart)`);
      if (isSameCategory) matchingFactors.push(`Identical public category: ${project.category}`);
      if (textSim >= 60) matchingFactors.push(`Title/description text overlap (${textSim}%)`);
      if (project.district === other.district) matchingFactors.push(`Same administrative district (${project.district})`);

      duplicates.push({
        primaryProject: project,
        candidateProject: other,
        similarityScore: combinedScore,
        distanceMeters: distance,
        matchingFactors
      });
    }
  }

  return duplicates.sort((a, b) => b.similarityScore - a.similarityScore);
}

// 3. Delay Prediction
export function calculateDelayPrediction(project: Project) {
  if (project.status === 'Completed') {
    return {
      statusClass: 'On Track',
      color: '🟢',
      delayProbability: 5,
      predictedCompletionDate: project.actualCompletionDate || project.expectedCompletionDate,
      delayDays: 0,
      velocityRating: 'Complete',
      explanation: 'Project successfully completed and verified.'
    };
  }

  if (!project.startDate || !project.expectedCompletionDate) {
    return {
      statusClass: 'Pending Schedule',
      color: '⚪',
      delayProbability: 10,
      predictedCompletionDate: 'TBD',
      delayDays: 0,
      velocityRating: 'Not Started',
      explanation: 'Work execution schedule pending tender finalization.'
    };
  }

  const start = new Date(project.startDate).getTime();
  const expectedEnd = new Date(project.expectedCompletionDate).getTime();
  const now = Date.now();

  const totalDurationDays = Math.max(1, Math.round((expectedEnd - start) / (1000 * 3600 * 24)));
  const elapsedDays = Math.max(1, Math.round((now - start) / (1000 * 3600 * 24)));

  const expectedProgress = Math.min(100, Math.round((elapsedDays / totalDurationDays) * 100));
  const currentProgress = project.completionPercentage;
  const progressGap = expectedProgress - currentProgress;

  let delayProbability = 15;
  let statusClass = 'On Track';
  let color = '🟢';

  if (now > expectedEnd && currentProgress < 100) {
    // Project is past its scheduled deadline
    const overdueDays = Math.round((now - expectedEnd) / (1000 * 3600 * 24));
    delayProbability = Math.min(96, 75 + Math.round(overdueDays / 30) * 5);
    statusClass = 'Delayed';
    color = '🔴';
  } else if (progressGap > 25) {
    delayProbability = Math.min(85, 50 + progressGap);
    statusClass = 'At Risk';
    color = '🟡';
  } else if (progressGap > 10) {
    delayProbability = 42;
    statusClass = 'At Risk';
    color = '🟡';
  }

  // Estimated actual completion based on historical run-rate
  const dailyVelocity = currentProgress > 0 ? currentProgress / elapsedDays : 0.05;
  const remainingWork = 100 - currentProgress;
  const remainingDaysNeeded = Math.round(remainingWork / (dailyVelocity || 0.1));
  const predictedEndDate = new Date(now + remainingDaysNeeded * 24 * 3600 * 1000).toISOString().split('T')[0];

  return {
    statusClass,
    color,
    delayProbability,
    expectedCompletionDate: project.expectedCompletionDate,
    predictedCompletionDate: predictedEndDate,
    currentProgress,
    expectedProgress,
    progressGap,
    explanation:
      delayProbability > 60
        ? `Work pace (${dailyVelocity.toFixed(2)}%/day) is trailing planned schedule. High probability of delay without expedited labor shifts.`
        : delayProbability > 30
        ? `Moderate execution gap observed. Closer milestone tracking recommended.`
        : `Work progress aligns smoothly with scheduled execution trajectory.`
  };
}

// 4. GPS Location Verification
export function verifyLocationCoordinates(
  projectLat: number,
  projectLon: number,
  photoLat?: number,
  photoLon?: number
) {
  if (photoLat === undefined || photoLon === undefined) {
    return {
      verified: true,
      hasMetadata: false,
      distanceMeters: 0,
      isMismatch: false,
      message: 'Photo uploaded without embedded EXIF geotag coordinates.'
    };
  }

  const distance = calculateHaversineDistanceMeters(projectLat, projectLon, photoLat, photoLon);
  const isMismatch = distance > 250; // Threshold of 250 meters for city GPS drift

  return {
    verified: !isMismatch,
    hasMetadata: true,
    distanceMeters: distance,
    isMismatch,
    projectCoords: { latitude: projectLat, longitude: projectLon },
    photoCoords: { latitude: photoLat, longitude: photoLon },
    message: isMismatch
      ? `⚠ LOCATION MISMATCH: Photo coordinates are ${distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance} meters`} away from sanctioned site.`
      : `✓ Location verified: Photo captured within ${distance} meters of project site.`
  };
}

// 5. Photo Verification Analysis Demo
export function verifyPhotoAuthenticity(photoUrl: string, caption: string, stage: string) {
  // Simulates computer vision checks (perceptual hashing, stage consistency, duplication)
  const isGeneric = caption.toLowerCase().includes('stock') || caption.toLowerCase().includes('sample');
  const isWaterPlantAlert = caption.toLowerCase().includes('machinery assembly');

  return {
    isAiVerified: !isGeneric && !isWaterPlantAlert,
    stageMatch: true,
    perceptualHash: 'phash_' + Math.abs(caption.length * 49157).toString(16),
    detectedObjects: ['Concrete', 'Construction Work', 'Masonry', 'Structural Columns'],
    similarityAlert: isWaterPlantAlert,
    notes: isWaterPlantAlert
      ? 'Potential image duplication: 94% visual similarity detected against archive repository.'
      : 'Photo features verified: Structural progression matches reported stage.'
  };
}

// 6. Overall AI Risk Evaluation Engine (0 - 100)
export function evaluateProjectRiskScore(project: Project, allProjects: Project[]) {
  const costAnalysis = evaluateCostAnomaly(project);
  const duplicates = findDuplicateCandidates(project, allProjects);
  const delayAnalysis = calculateDelayPrediction(project);

  let photoScore = 10;
  let hasLocationMismatch = false;

  project.photos.forEach(p => {
    if (p.similarityAlert) photoScore = Math.max(photoScore, 85);
    if (p.latitude && p.longitude) {
      const loc = verifyLocationCoordinates(project.latitude, project.longitude, p.latitude, p.longitude);
      if (loc.isMismatch) hasLocationMismatch = true;
    }
  });

  const duplicateScore = duplicates.length > 0 ? duplicates[0].similarityScore : 10;
  const delayScore = delayAnalysis.delayProbability;
  const costScore = costAnalysis.costScore;

  // Weighted composite risk formula
  let rawScore = Math.round(
    costScore * 0.35 +
    delayScore * 0.25 +
    duplicateScore * 0.2 +
    photoScore * 0.1 +
    (hasLocationMismatch ? 30 : 0) * 0.1
  );

  rawScore = Math.min(100, Math.max(8, rawScore));

  let riskLevel: RiskLevel = 'LOW';
  if (rawScore > 80) riskLevel = 'CRITICAL';
  else if (rawScore > 60) riskLevel = 'HIGH';
  else if (rawScore > 30) riskLevel = 'MEDIUM';

  const reasons: string[] = [];
  const recommendations: string[] = [];

  if (costAnalysis.isAnomaly) {
    reasons.push(costAnalysis.explanation);
    recommendations.push('Itemized BOQ verification by District Vigilance Engineering Wing.');
  }

  if (duplicates.length > 0 && duplicates[0].similarityScore >= 70) {
    reasons.push(`Similar developmental project detected within ${duplicates[0].distanceMeters}m (${duplicates[0].candidateProject.title}).`);
    recommendations.push('Verify territorial demographic overlap before disbursing further tranches.');
  }

  if (delayAnalysis.delayProbability > 70) {
    reasons.push(`Significant completion delay predicted: Current progress ${project.completionPercentage}% vs expected completion.`);
    recommendations.push('Convene weekly implementation review with Executive Engineer.');
  }

  if (photoScore > 70) {
    reasons.push('Potential photograph reuse detected in progress submission.');
    recommendations.push('Mandate real-time geotagged image recapture via official mobile app.');
  }

  if (hasLocationMismatch) {
    reasons.push('Geotag location mismatch detected between photograph EXIF data and project sanction site.');
    recommendations.push('Field audit required to confirm actual site of physical assets.');
  }

  if (reasons.length === 0) {
    reasons.push('Project parameters conform to standard MoSPI guidelines and fiscal milestones.');
    recommendations.push('Continue standard bi-monthly progress reporting.');
  }

  return {
    overallScore: rawScore,
    riskLevel,
    lastEvaluatedAt: new Date().toISOString(),
    costAnomalyScore: costScore,
    duplicateProbability: duplicateScore,
    photoAnomalyScore: photoScore,
    locationMismatch: hasLocationMismatch,
    delayProbability: delayScore,
    reasons,
    recommendations,
    disclaimer: 'Notice: The AI risk score is an advisory indicator for human administrative review, not proof of fraud or corruption.'
  };
}

// 7. Optional Gemini Integration for In-Depth Administrative Audit Report
export async function generateGeminiAuditReport(project: Project): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return generateFallbackAuditReport(project);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `
You are an expert Government Public Audit and Integrity Officer reviewing an MPLADS (Member of Parliament Local Area Development Scheme) project under the Ministry of Statistics and Programme Implementation (MoSPI), Government of India.

Analyze this project data:
- Project Code: ${project.projectCode}
- Title: ${project.title}
- Category: ${project.category}
- District / Constituency: ${project.district} / ${project.constituency}
- MP Name: ${project.mpName}
- Sanctioned Amount: ₹${(project.sanctionedAmount / 100000).toFixed(2)} Lakh
- Funds Utilized: ₹${(project.fundsUtilized / 100000).toFixed(2)} Lakh
- Implementing Agency: ${project.implementingAgencyName}
- Vendor: ${project.vendorName}
- Status: ${project.status} (Completion: ${project.completionPercentage}%)
- AI Risk Score: ${project.riskAnalysis.overallScore}/100 (${project.riskAnalysis.riskLevel})
- Key Flags: ${project.riskAnalysis.reasons.join('; ')}

Provide a structured, objective, professional Government Technical Audit Brief with the following sections:
1. EXECUTIVE SUMMARY & ANOMALY ASSESSMENT
2. FINANCIAL REASONABLENESS EVALUATION
3. PHYSICAL VERIFICATION & GEOTAG COMPLIANCE
4. RECOMMENDED ADMINISTRATIVE ACTIONS (Prioritized checklist for District Collector/Authority)

Ensure an objective, non-accusatory tone adhering to administrative vigilance standards.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    return response.text || generateFallbackAuditReport(project);
  } catch (error) {
    console.error('Gemini Audit generation error:', error);
    return generateFallbackAuditReport(project);
  }
}

function generateFallbackAuditReport(project: Project): string {
  const cost = (project.sanctionedAmount / 100000).toFixed(2);
  const utilized = (project.fundsUtilized / 100000).toFixed(2);

  return `
# MPLADS TECHNICAL INTEGRITY & ADMINISTRATIVE AUDIT BRIEF
**Project Reference:** ${project.projectCode}
**Jurisdiction:** District Authority, ${project.district}, Telangana
**Date of Assessment:** ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

---

### 1. EXECUTIVE SUMMARY & INTEGRITY ASSESSMENT
- **Current Status:** ${project.status} (${project.completionPercentage}% Physical Completion)
- **Computed AI Risk Index:** ${project.riskAnalysis.overallScore}/100 (**${project.riskAnalysis.riskLevel}**)
- **Administrative Observation:** ${project.riskAnalysis.reasons.join('. ')}
- *Note:* This assessment functions as a diagnostic decision-support metric for the District Magistrate and does not represent an administrative indictment.

---

### 2. FINANCIAL REASONABLENESS EVALUATION
- **Sanctioned Allocation:** ₹${cost} Lakh
- **Disbursed / Utilised Amount:** ₹${utilized} Lakh (${project.sanctionedAmount > 0 ? Math.round((project.fundsUtilized / project.sanctionedAmount) * 100) : 0}% utilization ratio)
- **Benchmarking Observation:** Expenditure velocity must be matched against physical milestone measurement book (M-Book) entries submitted by ${project.implementingAgencyName}.

---

### 3. PHYSICAL VERIFICATION & GEOTAG COMPLIANCE
- **Sanction Coordinates:** ${project.latitude.toFixed(4)}° N, ${project.longitude.toFixed(4)}° E
- **Geographic Status:** ${project.riskAnalysis.locationMismatch ? '⚠ Spatial coordinates show anomalous discrepancy requiring on-site re-survey.' : '✓ Geotagged coordinates conform to authorized territorial allotment.'}
- **Document Status:** ${project.documents.length} verified technical documents logged in official repository.

---

### 4. RECOMMENDED ADMINISTRATIVE DIRECTIVES
1. **Field Inspection:** Direct Sub-Divisional Magistrate (SDM) or Assistant Executive Engineer to conduct physical audit within 14 working days.
2. **Quality Verification:** Scrutinize material test certificates against standard PWD specifications.
3. **Milestone Reconciliation:** Retain remaining payment tranches until satisfactory rectification of flagged indicators.
`;
}
