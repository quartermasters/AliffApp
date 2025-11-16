/**
 * Fit Scoring Algorithm
 *
 * Calculates a 0-100 match score between candidate and job posting
 * Using multi-dimensional scoring across:
 * - Skills match (technical + soft)
 * - Experience level
 * - Education requirements
 * - Salary expectations
 * - Availability match
 * - Location compatibility
 * - Industry experience
 */

import { ParsedResumeData } from './resume-parser';

export interface JobRequirements {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minYearsExperience: number;
  maxYearsExperience?: number;
  educationLevel: string[]; // e.g., ['Bachelor', 'Master']
  salaryRange: {
    min: number;
    max: number;
    type: 'HOURLY' | 'ANNUAL';
  };
  location?: string;
  remote: boolean;
  industry: string[];
  employmentType: string; // FULL_TIME, PART_TIME, CONTRACT
  requiredCertifications?: string[];
  hoursPerWeek?: number;
}

export interface FitScore {
  overall: number; // 0-100
  breakdown: {
    skills: number; // 0-100
    experience: number; // 0-100
    education: number; // 0-100
    salary: number; // 0-100
    availability: number; // 0-100
    location: number; // 0-100
    industry: number; // 0-100
  };
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  confidence: number; // 0-100 (how confident we are in this score)
}

/**
 * Calculate skills match score
 */
function calculateSkillsScore(
  candidateSkills: ParsedResumeData['skills'],
  requiredSkills: string[],
  preferredSkills: string[]
): { score: number; matched: string[]; missing: string[] } {
  // Flatten all candidate skills
  const allCandidateSkills = [
    ...(candidateSkills.technical || []),
    ...(candidateSkills.soft || []),
    ...(candidateSkills.tools || []),
    ...(candidateSkills.frameworks || []),
  ].map((s) => s.toLowerCase());

  // Calculate required skills match
  const matchedRequired = requiredSkills.filter((skill) =>
    allCandidateSkills.some((cs) => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
  );

  const missingRequired = requiredSkills.filter(
    (skill) => !matchedRequired.includes(skill)
  );

  // Calculate preferred skills match
  const matchedPreferred = preferredSkills.filter((skill) =>
    allCandidateSkills.some((cs) => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs))
  );

  // Scoring:
  // - Required skills: 70% weight
  // - Preferred skills: 30% weight
  const requiredScore = requiredSkills.length > 0
    ? (matchedRequired.length / requiredSkills.length) * 70
    : 70; // If no required skills, give full marks

  const preferredScore = preferredSkills.length > 0
    ? (matchedPreferred.length / preferredSkills.length) * 30
    : 30; // If no preferred skills, give full marks

  const totalScore = requiredScore + preferredScore;

  return {
    score: Math.round(totalScore),
    matched: [...matchedRequired, ...matchedPreferred],
    missing: missingRequired,
  };
}

/**
 * Calculate experience level match
 */
function calculateExperienceScore(
  candidateYears: number,
  minRequired: number,
  maxRequired?: number
): number {
  if (candidateYears < minRequired) {
    // Under-qualified: penalize based on gap
    const gap = minRequired - candidateYears;
    return Math.max(0, 100 - gap * 20); // -20 points per year short
  }

  if (maxRequired && candidateYears > maxRequired) {
    // Over-qualified: slight penalty
    const excess = candidateYears - maxRequired;
    return Math.max(70, 100 - excess * 5); // -5 points per year over
  }

  // Perfect match
  return 100;
}

/**
 * Calculate education match
 */
function calculateEducationScore(
  candidateEducation: ParsedResumeData['education'],
  requiredLevels: string[]
): { score: number; matched: boolean; level: string } {
  if (requiredLevels.length === 0 || !candidateEducation || candidateEducation.length === 0) {
    return { score: 100, matched: true, level: 'Not specified' };
  }

  // Education hierarchy
  const educationLevels: Record<string, number> = {
    'high school': 1,
    'associate': 2,
    'bachelor': 3,
    'master': 4,
    'phd': 5,
    'doctorate': 5,
  };

  // Get candidate's highest education level
  const candidateHighest = candidateEducation.reduce((max, edu) => {
    const degreeLevel = Object.keys(educationLevels).find((level) =>
      edu.degree.toLowerCase().includes(level)
    );
    const levelValue = degreeLevel ? educationLevels[degreeLevel] : 0;
    return Math.max(max, levelValue);
  }, 0);

  // Get required education level
  const requiredLevel = Math.max(
    ...requiredLevels.map((level) => {
      const foundLevel = Object.keys(educationLevels).find((l) =>
        level.toLowerCase().includes(l)
      );
      return foundLevel ? educationLevels[foundLevel] : 0;
    })
  );

  if (candidateHighest >= requiredLevel) {
    return { score: 100, matched: true, level: candidateEducation[0].degree };
  } else {
    // Under-qualified
    const gap = requiredLevel - candidateHighest;
    return {
      score: Math.max(0, 100 - gap * 30),
      matched: false,
      level: candidateEducation[0]?.degree || 'Unknown',
    };
  }
}

/**
 * Calculate salary alignment
 */
function calculateSalaryScore(
  candidateExpected: number,
  candidateType: string,
  jobRange: { min: number; max: number; type: string }
): { score: number; alignment: string } {
  // Normalize to annual if needed
  let candidateAnnual = candidateExpected;
  if (candidateType === 'HOURLY') {
    candidateAnnual = candidateExpected * 40 * 52; // Assume 40h/week
  }

  let jobMin = jobRange.min;
  let jobMax = jobRange.max;
  if (jobRange.type === 'HOURLY') {
    jobMin = jobRange.min * 40 * 52;
    jobMax = jobRange.max * 40 * 52;
  }

  // Perfect match: within range
  if (candidateAnnual >= jobMin && candidateAnnual <= jobMax) {
    return { score: 100, alignment: 'Perfect match' };
  }

  // Below range: good for employer
  if (candidateAnnual < jobMin) {
    const percentBelow = ((jobMin - candidateAnnual) / jobMin) * 100;
    if (percentBelow < 10) {
      return { score: 95, alignment: 'Slightly below range' };
    }
    return { score: 90, alignment: 'Below range (negotiable)' };
  }

  // Above range: potential issue
  if (candidateAnnual > jobMax) {
    const percentAbove = ((candidateAnnual - jobMax) / jobMax) * 100;
    if (percentAbove < 10) {
      return { score: 80, alignment: 'Slightly above range' };
    } else if (percentAbove < 20) {
      return { score: 60, alignment: 'Above range (may negotiate)' };
    } else {
      return { score: 30, alignment: 'Significantly above range' };
    }
  }

  return { score: 100, alignment: 'Within range' };
}

/**
 * Calculate availability match
 */
function calculateAvailabilityScore(
  candidateHoursPerDay: number,
  candidateDaysPerMonth: number,
  jobHoursPerWeek?: number
): number {
  if (!jobHoursPerWeek) {
    return 100; // No requirement specified
  }

  // Calculate candidate's weekly availability
  const candidateWeeklyHours = (candidateHoursPerDay * candidateDaysPerMonth * 12) / 52;

  const percentMatch = (candidateWeeklyHours / jobHoursPerWeek) * 100;

  if (percentMatch >= 100) {
    return 100; // Meets or exceeds requirement
  } else if (percentMatch >= 80) {
    return 90; // Close match
  } else if (percentMatch >= 60) {
    return 70; // Partial match
  } else {
    return 50; // Insufficient availability
  }
}

/**
 * Main fit scoring function
 */
export function calculateFitScore(
  candidate: ParsedResumeData,
  candidateSalary: { expected: number; type: string },
  candidateAvailability: { hoursPerDay: number; daysPerMonth: number },
  job: JobRequirements
): FitScore {
  // Calculate individual scores
  const skillsResult = calculateSkillsScore(
    candidate.skills,
    job.requiredSkills,
    job.preferredSkills
  );

  const experienceScore = calculateExperienceScore(
    candidate.totalYearsExperience || 0,
    job.minYearsExperience,
    job.maxYearsExperience
  );

  const educationResult = calculateEducationScore(
    candidate.education,
    job.educationLevel
  );

  const salaryResult = calculateSalaryScore(
    candidateSalary.expected,
    candidateSalary.type,
    job.salaryRange
  );

  const availabilityScore = calculateAvailabilityScore(
    candidateAvailability.hoursPerDay,
    candidateAvailability.daysPerMonth,
    job.hoursPerWeek
  );

  // Location score (simplified - would use geocoding in production)
  const locationScore = job.remote ? 100 : 80; // Remote = perfect, otherwise assume reasonable

  // Industry score (check if candidate has relevant industry experience)
  const candidateIndustries = candidate.workExperience
    .map((exp) => exp.company.toLowerCase())
    .join(' ');

  const industryMatch = job.industry.some((ind) =>
    candidateIndustries.includes(ind.toLowerCase())
  );
  const industryScore = industryMatch ? 100 : 70;

  // Weighted overall score
  const weights = {
    skills: 0.30,        // 30%
    experience: 0.25,    // 25%
    education: 0.15,     // 15%
    salary: 0.10,        // 10%
    availability: 0.10,  // 10%
    location: 0.05,      // 5%
    industry: 0.05,      // 5%
  };

  const overall = Math.round(
    skillsResult.score * weights.skills +
    experienceScore * weights.experience +
    educationResult.score * weights.education +
    salaryResult.score * weights.salary +
    availabilityScore * weights.availability +
    locationScore * weights.location +
    industryScore * weights.industry
  );

  // Identify strengths
  const strengths: string[] = [];
  if (skillsResult.score >= 80) {
    strengths.push(`Strong skills match: ${skillsResult.matched.length}/${job.requiredSkills.length + job.preferredSkills.length} skills matched`);
  }
  if (experienceScore >= 90) {
    strengths.push(`${candidate.totalYearsExperience} years experience aligns perfectly`);
  }
  if (educationResult.score === 100) {
    strengths.push(`Education level meets requirements (${educationResult.level})`);
  }
  if (salaryResult.score >= 90) {
    strengths.push(`Salary expectations align well (${salaryResult.alignment})`);
  }

  // Identify gaps
  const gaps: string[] = [];
  if (skillsResult.missing.length > 0) {
    gaps.push(`Missing ${skillsResult.missing.length} required skills: ${skillsResult.missing.slice(0, 3).join(', ')}`);
  }
  if (experienceScore < 70) {
    gaps.push(`Experience level may not meet minimum requirement (${job.minYearsExperience} years)`);
  }
  if (educationResult.score < 100) {
    gaps.push('Education level below requirement');
  }
  if (salaryResult.score < 70) {
    gaps.push(`Salary expectations ${salaryResult.alignment.toLowerCase()}`);
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (overall >= 80) {
    recommendations.push('Strong candidate - recommend interview');
    recommendations.push('Proceed to AI interview phase');
  } else if (overall >= 60) {
    recommendations.push('Moderate fit - review application carefully');
    recommendations.push('Consider for interview if skills match is strong');
  } else {
    recommendations.push('May not be ideal fit for this role');
    recommendations.push('Consider for CV bank and future opportunities');
  }

  // Confidence calculation
  const confidence = Math.round(
    ((candidate.parsingConfidence || 80) + (overall > 0 ? 80 : 50)) / 2
  );

  return {
    overall,
    breakdown: {
      skills: skillsResult.score,
      experience: experienceScore,
      education: educationResult.score,
      salary: salaryResult.score,
      availability: availabilityScore,
      location: locationScore,
      industry: industryScore,
    },
    strengths,
    gaps,
    recommendations,
    confidence,
  };
}

/**
 * Generate a human-readable fit report
 */
export function generateFitReport(fitScore: FitScore): string {
  const rating = fitScore.overall >= 80
    ? 'Excellent'
    : fitScore.overall >= 60
    ? 'Good'
    : fitScore.overall >= 40
    ? 'Fair'
    : 'Poor';

  return `
FIT SCORE REPORT
================

Overall Match: ${fitScore.overall}/100 (${rating})
Confidence: ${fitScore.confidence}%

BREAKDOWN:
- Skills Match: ${fitScore.breakdown.skills}/100
- Experience Level: ${fitScore.breakdown.experience}/100
- Education: ${fitScore.breakdown.education}/100
- Salary Alignment: ${fitScore.breakdown.salary}/100
- Availability: ${fitScore.breakdown.availability}/100
- Location: ${fitScore.breakdown.location}/100
- Industry Experience: ${fitScore.breakdown.industry}/100

STRENGTHS:
${fitScore.strengths.map((s) => `✓ ${s}`).join('\n')}

GAPS:
${fitScore.gaps.map((g) => `⚠ ${g}`).join('\n')}

RECOMMENDATIONS:
${fitScore.recommendations.map((r) => `→ ${r}`).join('\n')}
  `.trim();
}
