import { ParsedResume } from "./types";

/**
 * ALIFF-RECRUITER Initial Screening Algorithm
 *
 * Automatically scores candidates (0-100) based on match to job requirements.
 * Filters candidates into tiers:
 * - Top 30%: Auto-advance to chat interview
 * - Middle 30%: Manual review
 * - Bottom 40%: Auto-reject
 */

export interface JobRequirements {
  category: "GOVCON" | "SLED" | "IT_SERVICES" | "WRITING_SERVICES";
  requiredSkills: string[];
  preferredSkills?: string[];
  minYearsExperience: number;
  domains?: string[];
  requiresGovcon?: boolean;
  requiresSled?: boolean;
  requiresClearance?: boolean;
  clearanceLevel?: string;
  requiredCertifications?: string[];
  preferredEducation?: string; // "Bachelor", "Master", "PhD"
}

export interface ScreeningResult {
  matchScore: number; // 0-100
  tier: "TOP" | "MIDDLE" | "BOTTOM";
  recommendation: "ADVANCE" | "REVIEW" | "REJECT";
  breakdown: {
    skillsMatch: number; // 0-100
    experienceMatch: number; // 0-100
    domainMatch: number; // 0-100
    govconMatch: number; // 0-100
    educationMatch: number; // 0-100
    clearanceMatch: number; // 0-100
    availabilityMatch: number; // 0-100
  };
  strengths: string[];
  concerns: string[];
  reasoningNotes: string;
}

/**
 * Calculate skills match score (0-100)
 * Weighted: Required skills (70%), Preferred skills (30%)
 */
function calculateSkillsMatch(
  candidateSkills: ParsedResume["skills"],
  requirements: JobRequirements
): { score: number; matched: string[]; missing: string[] } {
  const allCandidateSkills = [
    ...candidateSkills.technical,
    ...candidateSkills.tools,
    ...candidateSkills.frameworks,
    ...candidateSkills.certifications,
  ].map((s) => s.toLowerCase());

  // Required skills
  const requiredSkills = requirements.requiredSkills.map((s) =>
    s.toLowerCase()
  );
  const matchedRequired = requiredSkills.filter((req) =>
    allCandidateSkills.some((cand) => cand.includes(req) || req.includes(cand))
  );
  const requiredScore =
    requiredSkills.length > 0
      ? (matchedRequired.length / requiredSkills.length) * 100
      : 100;

  // Preferred skills
  const preferredSkills = (requirements.preferredSkills || []).map((s) =>
    s.toLowerCase()
  );
  const matchedPreferred = preferredSkills.filter((pref) =>
    allCandidateSkills.some((cand) => cand.includes(pref) || pref.includes(cand))
  );
  const preferredScore =
    preferredSkills.length > 0
      ? (matchedPreferred.length / preferredSkills.length) * 100
      : 100;

  // Weighted score: 70% required, 30% preferred
  const finalScore = requiredScore * 0.7 + preferredScore * 0.3;

  return {
    score: Math.round(finalScore),
    matched: [...matchedRequired, ...matchedPreferred],
    missing: requiredSkills.filter((s) => !matchedRequired.includes(s)),
  };
}

/**
 * Calculate experience match score (0-100)
 */
function calculateExperienceMatch(
  candidateExperience: number,
  minRequired: number
): number {
  if (candidateExperience >= minRequired * 1.5) {
    return 100; // Significantly exceeds requirement
  } else if (candidateExperience >= minRequired) {
    return 90; // Meets requirement
  } else if (candidateExperience >= minRequired * 0.8) {
    return 75; // Close to requirement
  } else if (candidateExperience >= minRequired * 0.6) {
    return 60; // Somewhat below requirement
  } else if (candidateExperience >= minRequired * 0.4) {
    return 40; // Well below requirement
  } else {
    return 20; // Far below requirement
  }
}

/**
 * Calculate domain expertise match (0-100)
 */
function calculateDomainMatch(
  candidateDomains: string[],
  requiredDomains: string[] = []
): number {
  if (requiredDomains.length === 0) return 100; // No specific domain required

  const candidateDomainsLower = candidateDomains.map((d) => d.toLowerCase());
  const requiredDomainsLower = requiredDomains.map((d) => d.toLowerCase());

  const matchedDomains = requiredDomainsLower.filter((req) =>
    candidateDomainsLower.some((cand) => cand.includes(req) || req.includes(cand))
  );

  return Math.round((matchedDomains.length / requiredDomains.length) * 100);
}

/**
 * Calculate GOVCON experience match (0-100)
 */
function calculateGovconMatch(
  parsedResume: ParsedResume,
  requirements: JobRequirements
): number {
  if (!requirements.requiresGovcon) return 100; // Not required

  const govcon = parsedResume.govconExperience;

  if (!govcon || !govcon.hasGovconExperience) {
    return 0; // No GOVCON experience
  }

  let score = 50; // Base score for having GOVCON experience

  // Years of GOVCON experience
  if (govcon.yearsOfGovconExperience) {
    if (govcon.yearsOfGovconExperience >= 5) {
      score += 30; // Significant experience
    } else if (govcon.yearsOfGovconExperience >= 3) {
      score += 20; // Moderate experience
    } else {
      score += 10; // Some experience
    }
  }

  // Federal agencies worked with
  if (govcon.federalAgenciesWorkedWith.length >= 3) {
    score += 10; // Multiple agencies
  } else if (govcon.federalAgenciesWorkedWith.length >= 1) {
    score += 5; // At least one agency
  }

  // Contract wins and win rate
  if (govcon.contractWins && govcon.contractWins >= 5) {
    score += 5; // Proven track record
  }

  if (govcon.winRate && govcon.winRate >= 50) {
    score += 5; // Good win rate
  }

  return Math.min(100, score);
}

/**
 * Calculate SLED experience match (0-100)
 */
function calculateSledMatch(
  parsedResume: ParsedResume,
  requirements: JobRequirements
): number {
  if (!requirements.requiresSled) return 100; // Not required

  const govcon = parsedResume.govconExperience;

  if (!govcon || !govcon.sledExperience) {
    return 0; // No SLED experience
  }

  return 100; // Has SLED experience (binary for now)
}

/**
 * Calculate education match (0-100)
 */
function calculateEducationMatch(
  education: ParsedResume["education"],
  preferredLevel?: string
): number {
  if (!preferredLevel || education.length === 0) return 100; // Not required

  const degrees = education.map((e) => e.degree.toLowerCase());

  const levelMap: { [key: string]: number } = {
    phd: 5,
    doctorate: 5,
    "ph.d": 5,
    master: 4,
    mba: 4,
    "master's": 4,
    bachelor: 3,
    "bachelor's": 3,
    associate: 2,
    "associate's": 2,
  };

  const candidateLevel = Math.max(
    ...degrees.map((d) => {
      for (const [key, value] of Object.entries(levelMap)) {
        if (d.includes(key)) return value;
      }
      return 0;
    })
  );

  const requiredLevel =
    levelMap[preferredLevel.toLowerCase()] || levelMap["bachelor"] || 3;

  if (candidateLevel >= requiredLevel) {
    return 100; // Meets or exceeds
  } else if (candidateLevel >= requiredLevel - 1) {
    return 80; // One level below
  } else if (candidateLevel >= requiredLevel - 2) {
    return 60; // Two levels below
  } else {
    return 40; // Significantly below
  }
}

/**
 * Calculate security clearance match (0-100)
 */
function calculateClearanceMatch(
  clearances: ParsedResume["clearancesAndCerts"],
  requirements: JobRequirements
): number {
  if (!requirements.requiresClearance) return 100; // Not required

  if (!clearances || !clearances.securityClearance) {
    return 0; // No clearance
  }

  const clearanceLower = clearances.securityClearance.toLowerCase();
  const statusLower = (clearances.clearanceStatus || "").toLowerCase();

  // Check if active
  const isActive = statusLower.includes("active");

  if (!isActive) {
    return 40; // Has clearance but not active
  }

  // Match clearance level
  const requiredLevel = (requirements.clearanceLevel || "").toLowerCase();

  if (
    requiredLevel.includes("top secret") &&
    clearanceLower.includes("top secret")
  ) {
    return 100;
  } else if (
    requiredLevel.includes("secret") &&
    clearanceLower.includes("secret")
  ) {
    return 100;
  } else if (
    requiredLevel.includes("confidential") &&
    clearanceLower.includes("confidential")
  ) {
    return 100;
  } else if (clearanceLower.includes("secret")) {
    return 90; // Has Secret or higher even if not required level
  } else {
    return 70; // Has some clearance
  }
}

/**
 * Calculate availability match (0-100)
 */
function calculateAvailabilityMatch(
  availability: ParsedResume["availability"]
): number {
  if (!availability) return 80; // Assume available if not specified

  if (!availability.isAvailable) {
    return 30; // Not currently available
  }

  // Check availability date
  if (availability.availabilityDate) {
    const availDate = new Date(availability.availabilityDate);
    const daysUntilAvailable = Math.ceil(
      (availDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilAvailable <= 7) {
      return 100; // Available within a week
    } else if (daysUntilAvailable <= 30) {
      return 90; // Available within a month
    } else if (daysUntilAvailable <= 60) {
      return 70; // Available within 2 months
    } else {
      return 50; // Available later
    }
  }

  return 100; // Available now
}

/**
 * Main screening function
 */
export function screenCandidate(
  parsedResume: ParsedResume,
  jobRequirements: JobRequirements
): ScreeningResult {
  console.log(
    `[Screening] Evaluating ${parsedResume.personalInfo.fullName} for ${jobRequirements.category} position`
  );

  // Calculate individual scores
  const skillsResult = calculateSkillsMatch(
    parsedResume.skills,
    jobRequirements
  );
  const experienceScore = calculateExperienceMatch(
    parsedResume.metrics.totalYearsExperience,
    jobRequirements.minYearsExperience
  );
  const domainScore = calculateDomainMatch(
    parsedResume.domains,
    jobRequirements.domains
  );
  const govconScore = calculateGovconMatch(parsedResume, jobRequirements);
  const sledScore = calculateSledMatch(parsedResume, jobRequirements);
  const educationScore = calculateEducationMatch(
    parsedResume.education,
    jobRequirements.preferredEducation
  );
  const clearanceScore = calculateClearanceMatch(
    parsedResume.clearancesAndCerts,
    jobRequirements
  );
  const availabilityScore = calculateAvailabilityMatch(
    parsedResume.availability
  );

  // Weighted overall score based on job category
  let weights = {
    skills: 0.3,
    experience: 0.25,
    domain: 0.15,
    govcon: 0.0,
    education: 0.1,
    clearance: 0.0,
    availability: 0.2,
  };

  // Adjust weights based on category
  if (jobRequirements.category === "GOVCON") {
    weights = {
      skills: 0.25,
      experience: 0.2,
      domain: 0.15,
      govcon: 0.3, // High weight for GOVCON jobs
      education: 0.05,
      clearance: 0.05,
      availability: 0.0,
    };
  } else if (jobRequirements.category === "SLED") {
    weights = {
      skills: 0.25,
      experience: 0.2,
      domain: 0.15,
      govcon: 0.25, // SLED uses same field
      education: 0.1,
      clearance: 0.0,
      availability: 0.05,
    };
  } else if (jobRequirements.category === "IT_SERVICES") {
    weights = {
      skills: 0.4, // High weight on skills for IT
      experience: 0.25,
      domain: 0.15,
      govcon: 0.0,
      education: 0.1,
      clearance: 0.0,
      availability: 0.1,
    };
  } else if (jobRequirements.category === "WRITING_SERVICES") {
    weights = {
      skills: 0.3,
      experience: 0.3,
      domain: 0.2,
      govcon: 0.0,
      education: 0.15,
      clearance: 0.0,
      availability: 0.05,
    };
  }

  // Calculate weighted overall match score
  const overallScore = Math.round(
    skillsResult.score * weights.skills +
      experienceScore * weights.experience +
      domainScore * weights.domain +
      (jobRequirements.requiresGovcon || jobRequirements.requiresSled
        ? govconScore * weights.govcon + sledScore * weights.govcon
        : 0) +
      educationScore * weights.education +
      (jobRequirements.requiresClearance ? clearanceScore * weights.clearance : 0) +
      availabilityScore * weights.availability
  );

  // Determine tier and recommendation
  let tier: "TOP" | "MIDDLE" | "BOTTOM";
  let recommendation: "ADVANCE" | "REVIEW" | "REJECT";

  if (overallScore >= 70) {
    tier = "TOP";
    recommendation = "ADVANCE";
  } else if (overallScore >= 50) {
    tier = "MIDDLE";
    recommendation = "REVIEW";
  } else {
    tier = "BOTTOM";
    recommendation = "REJECT";
  }

  // Identify strengths
  const strengths: string[] = [];
  if (skillsResult.score >= 80)
    strengths.push(
      `Strong skills match (${skillsResult.matched.length} matched)`
    );
  if (experienceScore >= 90)
    strengths.push(
      `${parsedResume.metrics.totalYearsExperience} years experience (exceeds requirement)`
    );
  if (domainScore >= 80) strengths.push("Relevant domain expertise");
  if (govconScore >= 80 && jobRequirements.requiresGovcon)
    strengths.push(
      `${parsedResume.govconExperience?.yearsOfGovconExperience} years GOVCON experience`
    );
  if (clearanceScore >= 90 && jobRequirements.requiresClearance)
    strengths.push(`Active ${parsedResume.clearancesAndCerts?.securityClearance} clearance`);
  if (availabilityScore >= 100) strengths.push("Immediately available");

  // Identify concerns
  const concerns: string[] = [];
  if (skillsResult.score < 60)
    concerns.push(
      `Missing key skills: ${skillsResult.missing.slice(0, 3).join(", ")}`
    );
  if (
    experienceScore < 60 &&
    parsedResume.metrics.totalYearsExperience < jobRequirements.minYearsExperience
  ) {
    concerns.push(
      `Only ${parsedResume.metrics.totalYearsExperience} years (requires ${jobRequirements.minYearsExperience}+)`
    );
  }
  if (domainScore < 50) concerns.push("Limited relevant domain experience");
  if (govconScore < 50 && jobRequirements.requiresGovcon)
    concerns.push("No federal contracting experience");
  if (clearanceScore < 50 && jobRequirements.requiresClearance)
    concerns.push("No active security clearance");
  if (availabilityScore < 60) concerns.push("Not immediately available");

  // Generate reasoning notes
  const reasoningNotes = `
Candidate ${parsedResume.personalInfo.fullName} scored ${overallScore}/100 overall.

Skills: ${skillsResult.score}/100 (${skillsResult.matched.length}/${jobRequirements.requiredSkills.length} matched)
Experience: ${experienceScore}/100 (${parsedResume.metrics.totalYearsExperience} years vs ${jobRequirements.minYearsExperience} required)
Domain: ${domainScore}/100
${jobRequirements.requiresGovcon ? `GOVCON: ${govconScore}/100` : ""}
${jobRequirements.requiresSled ? `SLED: ${sledScore}/100` : ""}
${jobRequirements.requiresClearance ? `Clearance: ${clearanceScore}/100` : ""}

Recommendation: ${recommendation} (${tier} tier)
  `.trim();

  console.log(`[Screening] ${parsedResume.personalInfo.fullName}: ${overallScore}/100 - ${recommendation}`);

  return {
    matchScore: overallScore,
    tier,
    recommendation,
    breakdown: {
      skillsMatch: skillsResult.score,
      experienceMatch: experienceScore,
      domainMatch: domainScore,
      govconMatch: govconScore,
      educationMatch: educationScore,
      clearanceMatch: clearanceScore,
      availabilityMatch: availabilityScore,
    },
    strengths,
    concerns,
    reasoningNotes,
  };
}

/**
 * Batch screen multiple candidates for a job
 */
export function screenCandidateBatch(
  candidates: Array<{ id: string; parsedResume: ParsedResume }>,
  jobRequirements: JobRequirements
): Array<{ id: string; screening: ScreeningResult }> {
  console.log(`[Batch Screening] Screening ${candidates.length} candidates`);

  const results = candidates.map(({ id, parsedResume }) => ({
    id,
    screening: screenCandidate(parsedResume, jobRequirements),
  }));

  // Sort by match score (descending)
  results.sort((a, b) => b.screening.matchScore - a.screening.matchScore);

  const topCount = results.filter((r) => r.screening.tier === "TOP").length;
  const middleCount = results.filter(
    (r) => r.screening.tier === "MIDDLE"
  ).length;
  const bottomCount = results.filter(
    (r) => r.screening.tier === "BOTTOM"
  ).length;

  console.log(
    `[Batch Screening] Results: ${topCount} TOP, ${middleCount} MIDDLE, ${bottomCount} BOTTOM`
  );

  return results;
}

/**
 * Get job requirements from job posting
 * In production, this would query the database
 */
export function getJobRequirements(jobSlug: string): JobRequirements {
  // Simulated job requirements mapping
  const requirementsMap: { [key: string]: JobRequirements } = {
    "senior-govcon-proposal-writer": {
      category: "GOVCON",
      requiredSkills: [
        "Proposal Writing",
        "RFP",
        "FAR",
        "DFARS",
        "Section L",
        "Section M",
      ],
      preferredSkills: ["Shipley", "Past Performance", "Compliance Matrix"],
      minYearsExperience: 5,
      domains: ["Government Contracting", "Federal Proposal"],
      requiresGovcon: true,
      requiresClearance: false,
      clearanceLevel: "Secret",
      preferredEducation: "Bachelor",
    },

    "full-stack-developer-nextjs": {
      category: "IT_SERVICES",
      requiredSkills: [
        "Next.js",
        "React",
        "TypeScript",
        "PostgreSQL",
        "Prisma",
      ],
      preferredSkills: ["tRPC", "AI API", "Tailwind CSS", "Vercel"],
      minYearsExperience: 3,
      domains: ["Web Development", "Full Stack"],
      requiresGovcon: false,
      preferredEducation: "Bachelor",
    },

    "sled-proposal-specialist": {
      category: "SLED",
      requiredSkills: ["Proposal Writing", "RFP", "State Procurement"],
      preferredSkills: ["Education RFP", "K-12", "Higher Education"],
      minYearsExperience: 4,
      domains: ["SLED", "State Government", "Education"],
      requiresSled: true,
      preferredEducation: "Bachelor",
    },

    "content-writer-technical": {
      category: "WRITING_SERVICES",
      requiredSkills: [
        "Technical Writing",
        "Content Writing",
        "White Paper",
        "Case Study",
      ],
      preferredSkills: ["GOVCON", "SEO", "Copywriting"],
      minYearsExperience: 3,
      domains: ["Technical Writing", "Content Creation"],
      requiresGovcon: false,
      preferredEducation: "Bachelor",
    },

    "ai-ml-engineer": {
      category: "IT_SERVICES",
      requiredSkills: [
        "Python",
        "Machine Learning",
        "OpenAI API",
        "Anthropic",
        "RAG",
      ],
      preferredSkills: [
        "Vector Database",
        "Pinecone",
        "Fine-tuning",
        "LangChain",
      ],
      minYearsExperience: 4,
      domains: ["AI/ML", "NLP", "LLMs"],
      requiresGovcon: false,
      preferredEducation: "Master",
    },
  };

  return (
    requirementsMap[jobSlug] || {
      category: "IT_SERVICES",
      requiredSkills: [],
      minYearsExperience: 2,
    }
  );
}
