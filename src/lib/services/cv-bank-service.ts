/**
 * CV Bank Service
 *
 * Manages the permanent candidate profile database (CV Bank)
 * Every applicant automatically gets a CV Bank entry for future opportunities
 */

import { prisma } from '@/lib/prisma';
import { ParsedResumeData } from '@/lib/ai/resume-parser';

export interface CVBankProfileData {
  // From Application
  applicationId: string;
  jobPostingId: string;

  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location?: string;

  // URLs
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;

  // Dual Photo System
  uploadedPhotoUrl: string;
  cvExtractedPhotoUrl?: string;

  // Resume Data
  resumeUrl: string;
  parsedResumeData: ParsedResumeData;

  // Work Experience Summary
  currentJobTitle?: string;
  currentCompany?: string;
  totalYearsExperience: number;

  // Skills
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];

  // Education
  highestDegree?: string;
  fieldOfStudy?: string;
  institution?: string;

  // Salary & Availability
  currentSalary?: number;
  expectedSalary: number;
  salaryType: string;
  hoursPerDay: number;
  daysPerMonth: number;
  startDate?: Date;

  // Scores
  fitScore: number;
  interviewScore?: number;

  // Interview Data
  interviewTranscript?: any;
  interviewScores?: any;

  // Application Source
  applicationSource: string;
  applicationDate: Date;

  // Additional Context
  coverLetter?: string;
  additionalNotes?: string;
  heardAboutUs?: string;
}

/**
 * Create or update candidate profile in CV Bank
 */
export async function createOrUpdateCVBankProfile(
  data: CVBankProfileData
): Promise<{ candidateId: string; isNew: boolean }> {
  console.log('[CV_BANK] Creating/updating profile for:', data.email);

  // Check if candidate already exists
  const existingCandidate = await prisma.candidate.findUnique({
    where: { email: data.email },
  });

  if (existingCandidate) {
    // Update existing candidate with actual schema fields
    console.log('[CV_BANK] Updating existing candidate:', existingCandidate.id);

    await prisma.candidate.update({
      where: { id: existingCandidate.id },
      data: {
        // Update basic info
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        location: data.location,

        // Update URLs (note: field names are different in schema)
        linkedIn: data.linkedinUrl || existingCandidate.linkedIn,
        github: data.githubUrl || existingCandidate.github,
        portfolio: data.portfolioUrl || existingCandidate.portfolio,

        // Update photos
        uploadedPhotoUrl: data.uploadedPhotoUrl,
        cvExtractedPhotoUrl: data.cvExtractedPhotoUrl || existingCandidate.cvExtractedPhotoUrl,

        // Update resume
        resumeUrl: data.resumeUrl,
        parsedResumeData: data.parsedResumeData as any,

        // Update years of experience
        yearsExperience: data.totalYearsExperience,

        // Update skills (merge arrays)
        skills: [...new Set([...(existingCandidate.skills || []), ...data.technicalSkills, ...data.softSkills])],

        // Update salary
        expectedSalary: data.expectedSalary,
        salaryType: data.salaryType,
        hoursPerDay: data.hoursPerDay,
        daysPerMonth: data.daysPerMonth,

        // Update scores if better
        fitScore: Math.max(existingCandidate.fitScore || 0, data.fitScore),
        interviewScore: data.interviewScore
          ? Math.max(existingCandidate.interviewScore || 0, data.interviewScore)
          : existingCandidate.interviewScore,
      },
    });

    return { candidateId: existingCandidate.id, isNew: false };
  } else {
    // Create new candidate with actual schema fields
    console.log('[CV_BANK] Creating new candidate profile');

    const newCandidate = await prisma.candidate.create({
      data: {
        applicationId: data.applicationId,

        // Personal Information
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        location: data.location,

        // URLs (note: field names in schema are camelCase without 'Url' suffix)
        linkedIn: data.linkedinUrl,
        github: data.githubUrl,
        portfolio: data.portfolioUrl,

        // Photos
        uploadedPhotoUrl: data.uploadedPhotoUrl,
        cvExtractedPhotoUrl: data.cvExtractedPhotoUrl,

        // Resume
        resumeUrl: data.resumeUrl,
        parsedResumeData: data.parsedResumeData as any,

        // Experience (single field, not separate current job fields)
        yearsExperience: data.totalYearsExperience,

        // Skills (single array, not separate technical/soft)
        skills: [...data.technicalSkills, ...data.softSkills],
        languages: data.languages,

        // Salary & Availability
        currentSalary: data.currentSalary,
        expectedSalary: data.expectedSalary,
        salaryType: data.salaryType,
        hoursPerDay: data.hoursPerDay,
        daysPerMonth: data.daysPerMonth,
        startDate: data.startDate,
        employmentStatus: data.jobPostingId, // Temporary - should be status string

        // Scores
        fitScore: data.fitScore,
        interviewScore: data.interviewScore,

        // Interview Data
        interviewTranscript: data.interviewTranscript as any,
        interviewScores: data.interviewScores as any,

        // Application Tracking
        appliedForJobId: data.jobPostingId,
        applicationDate: data.applicationDate,
        applicationSource: data.applicationSource,

        // Status
        status: 'APPLIED',
      },
    });

    console.log('[CV_BANK] New candidate created:', newCandidate.id);

    return { candidateId: newCandidate.id, isNew: true };
  }
}

/**
 * Search CV Bank by skills
 */
export async function searchCVBankBySkills(
  skills: string[],
  limit: number = 10
): Promise<any[]> {
  // Find candidates with matching skills
  const candidates = await prisma.candidate.findMany({
    where: {
      OR: skills.map((skill) => ({
        skills: {
          has: skill,
        },
      })),
      status: 'ACTIVE',
    },
    orderBy: {
      fitScore: 'desc',
    },
    take: limit,
  });

  return candidates;
}

/**
 * Search CV Bank by experience level
 */
export async function searchCVBankByExperience(
  minYears: number,
  maxYears: number,
  limit: number = 10
): Promise<any[]> {
  const candidates = await prisma.candidate.findMany({
    where: {
      yearsExperience: {
        gte: minYears,
        lte: maxYears,
      },
      status: 'ACTIVE',
    },
    orderBy: {
      interviewScore: 'desc',
    },
    take: limit,
  });

  return candidates;
}

/**
 * Get candidate full profile
 */
export async function getCandidateProfile(candidateId: string): Promise<any> {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: {
      applications: {
        include: {
          job: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return candidate;
}

/**
 * Update candidate availability
 * Note: isAvailable field doesn't exist in schema, so this is a placeholder
 */
export async function updateCandidateAvailability(
  candidateId: string,
  isAvailable: boolean
): Promise<void> {
  // Field doesn't exist in Candidate schema - would need to add it or use status
  console.log('[CV_BANK] updateCandidateAvailability not implemented - isAvailable field not in schema');
  // Placeholder: could update status instead
  // await prisma.candidate.update({
  //   where: { id: candidateId },
  //   data: {
  //     status: isAvailable ? 'ACTIVE' : 'INACTIVE',
  //     updatedAt: new Date(),
  //   },
  // });
}

/**
 * Get CV Bank statistics
 */
export async function getCVBankStats(): Promise<{
  totalCandidates: number;
  activeCandidates: number;
  availableCandidates: number;
  averageFitScore: number;
  averageInterviewScore: number;
  topSkills: Array<{ skill: string; count: number }>;
}> {
  const totalCandidates = await prisma.candidate.count();
  const activeCandidates = await prisma.candidate.count({
    where: { status: 'ACTIVE' },
  });
  // Note: isAvailable field doesn't exist, just count all active
  const availableCandidates = activeCandidates;

  const candidates = await prisma.candidate.findMany({
    where: { status: 'ACTIVE' },
    select: {
      fitScore: true,
      interviewScore: true,
      skills: true,
    },
  });

  const avgFitScore =
    candidates.reduce((sum, c) => sum + (c.fitScore || 0), 0) / candidates.length || 0;
  const avgInterviewScore =
    candidates.filter((c) => c.interviewScore).reduce((sum, c) => sum + (c.interviewScore || 0), 0) /
      candidates.filter((c) => c.interviewScore).length || 0;

  // Count skills
  const skillCounts: Record<string, number> = {};
  candidates.forEach((c) => {
    (c.skills || []).forEach((skill: string) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  return {
    totalCandidates,
    activeCandidates,
    availableCandidates,
    averageFitScore: Math.round(avgFitScore),
    averageInterviewScore: Math.round(avgInterviewScore),
    topSkills,
  };
}
