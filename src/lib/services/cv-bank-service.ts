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
    // Update existing candidate
    console.log('[CV_BANK] Updating existing candidate:', existingCandidate.id);

    await prisma.candidate.update({
      where: { id: existingCandidate.id },
      data: {
        // Update basic info (in case it changed)
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        location: data.location,

        // Update URLs if provided
        linkedinUrl: data.linkedinUrl || existingCandidate.linkedinUrl,
        githubUrl: data.githubUrl || existingCandidate.githubUrl,
        portfolioUrl: data.portfolioUrl || existingCandidate.portfolioUrl,
        websiteUrl: data.websiteUrl || existingCandidate.websiteUrl,

        // Update photos (prefer newer ones)
        uploadedPhotoUrl: data.uploadedPhotoUrl,
        cvExtractedPhotoUrl: data.cvExtractedPhotoUrl || existingCandidate.cvExtractedPhotoUrl,

        // Update resume if newer
        resumeUrl: data.resumeUrl,
        parsedResumeData: data.parsedResumeData as any,

        // Update work experience
        currentJobTitle: data.currentJobTitle,
        currentCompany: data.currentCompany,
        totalYearsExperience: data.totalYearsExperience,

        // Update skills (merge with existing)
        technicalSkills: [
          ...new Set([
            ...(existingCandidate.technicalSkills || []),
            ...data.technicalSkills,
          ]),
        ],
        softSkills: [
          ...new Set([...(existingCandidate.softSkills || []), ...data.softSkills]),
        ],

        // Update salary info
        expectedSalary: data.expectedSalary,
        salaryType: data.salaryType,

        // Keep track of latest application
        lastApplicationDate: data.applicationDate,
        applicationCount: existingCandidate.applicationCount + 1,

        // Update scores if better
        fitScore: Math.max(existingCandidate.fitScore || 0, data.fitScore),
        interviewScore: data.interviewScore
          ? Math.max(existingCandidate.interviewScore || 0, data.interviewScore)
          : existingCandidate.interviewScore,

        // Update metadata
        updatedAt: new Date(),
      },
    });

    return { candidateId: existingCandidate.id, isNew: false };
  } else {
    // Create new candidate
    console.log('[CV_BANK] Creating new candidate profile');

    const newCandidate = await prisma.candidate.create({
      data: {
        // Personal Information
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        location: data.location,

        // URLs
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        portfolioUrl: data.portfolioUrl,
        websiteUrl: data.websiteUrl,

        // Dual Photo System
        uploadedPhotoUrl: data.uploadedPhotoUrl,
        cvExtractedPhotoUrl: data.cvExtractedPhotoUrl,

        // Resume
        resumeUrl: data.resumeUrl,
        parsedResumeData: data.parsedResumeData as any,

        // Work Experience
        currentJobTitle: data.currentJobTitle,
        currentCompany: data.currentCompany,
        totalYearsExperience: data.totalYearsExperience,

        // Skills
        technicalSkills: data.technicalSkills,
        softSkills: data.softSkills,
        languages: data.languages,

        // Education
        highestDegree: data.highestDegree,
        fieldOfStudy: data.fieldOfStudy,
        institution: data.institution,

        // Salary & Availability
        currentSalary: data.currentSalary,
        expectedSalary: data.expectedSalary,
        salaryType: data.salaryType,
        hoursPerDay: data.hoursPerDay,
        daysPerMonth: data.daysPerMonth,
        startDate: data.startDate,

        // Scores
        fitScore: data.fitScore,
        interviewScore: data.interviewScore,

        // Interview Data
        interviewTranscript: data.interviewTranscript as any,
        interviewScores: data.interviewScores as any,

        // Application Tracking
        appliedForJobId: data.jobPostingId,
        applicationDate: data.applicationDate,
        lastApplicationDate: data.applicationDate,
        applicationCount: 1,
        applicationSource: data.applicationSource,

        // Additional Context
        coverLetter: data.coverLetter,
        additionalNotes: data.additionalNotes,
        heardAboutUs: data.heardAboutUs,

        // Status
        status: 'ACTIVE',
        isAvailable: true,
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
        technicalSkills: {
          has: skill,
        },
      })),
      status: 'ACTIVE',
      isAvailable: true,
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
      totalYearsExperience: {
        gte: minYears,
        lte: maxYears,
      },
      status: 'ACTIVE',
      isAvailable: true,
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
          jobPosting: true,
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
 */
export async function updateCandidateAvailability(
  candidateId: string,
  isAvailable: boolean
): Promise<void> {
  await prisma.candidate.update({
    where: { id: candidateId },
    data: {
      isAvailable,
      updatedAt: new Date(),
    },
  });
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
  const availableCandidates = await prisma.candidate.count({
    where: { status: 'ACTIVE', isAvailable: true },
  });

  const candidates = await prisma.candidate.findMany({
    where: { status: 'ACTIVE' },
    select: {
      fitScore: true,
      interviewScore: true,
      technicalSkills: true,
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
    (c.technicalSkills || []).forEach((skill: string) => {
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
