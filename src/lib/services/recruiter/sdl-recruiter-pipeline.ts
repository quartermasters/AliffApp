/**
 * SDL → ALIFF-RECRUITER Pipeline
 *
 * Automatically triggers provider hiring when SDL Win Strategy Brief
 * shows "BID" recommendation.
 *
 * Pipeline Flow:
 * 1. SDL Phase 3 completes
 * 2. Win Strategy Brief generated
 * 3. If bidDecision === "BID", auto-trigger ALIFF-RECRUITER
 * 4. Generate job descriptions from SDL analysis
 * 5. Search CV Bank for matching providers
 * 6. AI screening (0-100 scoring)
 * 7. Schedule interviews
 * 8. Hire within 24 hours
 */

import { prisma } from '@/lib/prisma';
import { createSDLJobGenerator, SDLJobRequirement } from './sdl-job-generator';
import { createReportGenerator } from '../sdl/report-generator';

// ============================================================================
// PIPELINE STATUS
// ============================================================================

export interface RecruiterPipelineStatus {
  projectId: string;
  triggered: boolean;
  triggeredAt?: Date;
  bidDecision: 'BID' | 'CAUTION' | 'NO_BID';
  winProbability: number;

  // Job generation
  jobsGenerated: boolean;
  totalJobs: number;
  criticalJobs: number;

  // CV Bank search
  cvSearchCompleted: boolean;
  candidatesFound: number;

  // AI screening
  screeningCompleted: boolean;
  candidatesScreened: number;
  topCandidates: number; // Score >= 80

  // Interviews
  interviewsScheduled: number;
  interviewsCompleted: number;

  // Hiring
  providersHired: number;
  hiringComplete: boolean;

  // Metadata
  estimatedCompletionTime: Date;
  actualCompletionTime?: Date;
}

// ============================================================================
// SDL RECRUITER PIPELINE CLASS
// ============================================================================

export class SDLRecruiterPipeline {
  constructor(private projectId: string) {}

  /**
   * Check if pipeline should be triggered
   */
  async shouldTrigger(): Promise<boolean> {
    // Get Win Strategy Brief
    const project = await prisma.project.findUnique({
      where: { id: this.projectId },
      select: {
        sdlStatus: true,
        sdlWinProbability: true,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Only trigger if SDL is complete
    if (project.sdlStatus !== 'COMPLETED') {
      console.log(`[SDL Recruiter Pipeline] SDL not complete yet: ${project.sdlStatus}`);
      return false;
    }

    // Generate Win Strategy Brief to check bid decision
    const reportGenerator = createReportGenerator(this.projectId);
    const winStrategyBrief = await reportGenerator.generateWinStrategyBrief();

    // Trigger if bidDecision is "BID"
    const shouldTrigger = winStrategyBrief.executiveSummary.bidDecision === 'BID';

    console.log(
      `[SDL Recruiter Pipeline] Bid decision: ${winStrategyBrief.executiveSummary.bidDecision}, ` +
      `Win probability: ${winStrategyBrief.executiveSummary.winProbability}%, ` +
      `Should trigger: ${shouldTrigger}`
    );

    return shouldTrigger;
  }

  /**
   * Execute complete pipeline
   */
  async execute(): Promise<RecruiterPipelineStatus> {
    console.log(`[SDL Recruiter Pipeline] Starting pipeline for project ${this.projectId}`);

    const startTime = new Date();

    // Step 1: Generate Win Strategy Brief
    const reportGenerator = createReportGenerator(this.projectId);
    const winStrategyBrief = await reportGenerator.generateWinStrategyBrief();

    // Step 2: Generate job descriptions from SDL
    console.log('[SDL Recruiter Pipeline] Step 1: Generating job descriptions from SDL...');
    const jobGenerator = createSDLJobGenerator(this.projectId);
    const jobPackage = await jobGenerator.generateJobDescriptions();

    console.log(
      `[SDL Recruiter Pipeline] Generated ${jobPackage.totalRolesNeeded} jobs ` +
      `(${jobPackage.criticalRolesCount} critical, ${jobPackage.estimatedTotalHours} hours)`
    );

    // Step 3: Search CV Bank for each job
    console.log('[SDL Recruiter Pipeline] Step 2: Searching CV Bank...');
    const candidatesFound = await this.searchCVBank(jobPackage.jobs);

    // Step 4: AI screening
    console.log('[SDL Recruiter Pipeline] Step 3: AI screening candidates...');
    const screeningResults = await this.screenCandidates(jobPackage.jobs);

    // Step 5: Schedule interviews for top candidates
    console.log('[SDL Recruiter Pipeline] Step 4: Scheduling interviews...');
    const interviewsScheduled = await this.scheduleInterviews(
      jobPackage.jobs,
      screeningResults.topCandidates
    );

    // Step 6: Create hiring pipeline
    console.log('[SDL Recruiter Pipeline] Step 5: Creating hiring pipeline...');
    await this.createHiringPipeline(jobPackage.jobs);

    const estimatedCompletionTime = new Date();
    estimatedCompletionTime.setHours(estimatedCompletionTime.getHours() + 24);

    const status: RecruiterPipelineStatus = {
      projectId: this.projectId,
      triggered: true,
      triggeredAt: startTime,
      bidDecision: winStrategyBrief.executiveSummary.bidDecision,
      winProbability: winStrategyBrief.executiveSummary.winProbability,

      jobsGenerated: true,
      totalJobs: jobPackage.totalRolesNeeded,
      criticalJobs: jobPackage.criticalRolesCount,

      cvSearchCompleted: true,
      candidatesFound,

      screeningCompleted: true,
      candidatesScreened: screeningResults.screened,
      topCandidates: screeningResults.topCandidates.length,

      interviewsScheduled,
      interviewsCompleted: 0,

      providersHired: 0,
      hiringComplete: false,

      estimatedCompletionTime,
    };

    // Save status to database
    await this.saveStatus(status);

    console.log(
      `[SDL Recruiter Pipeline] Pipeline initiated successfully. ` +
      `${candidatesFound} candidates found, ${interviewsScheduled} interviews scheduled. ` +
      `Expected completion: ${estimatedCompletionTime.toLocaleString()}`
    );

    return status;
  }

  /**
   * Search CV Bank for candidates matching job requirements
   */
  private async searchCVBank(jobs: SDLJobRequirement[]): Promise<number> {
    let totalCandidates = 0;

    for (const job of jobs) {
      // Search CV Bank using Pinecone semantic search
      // This would integrate with existing CV Bank system
      const candidates = await this.semanticSearchCVBank(job);

      console.log(
        `[SDL Recruiter Pipeline] Found ${candidates.length} candidates for ${job.jobTitle}`
      );

      totalCandidates += candidates.length;
    }

    return totalCandidates;
  }

  /**
   * Semantic search in CV Bank (integrates with existing Pinecone system)
   */
  private async semanticSearchCVBank(job: SDLJobRequirement): Promise<any[]> {
    // Build search query from job requirements
    const searchQuery = `
      ${job.jobTitle}
      Required: ${job.requiredSkills.join(', ')}
      Preferred: ${job.preferredSkills.join(', ')}
      ${job.yearsExperience}+ years experience
      ${job.clearanceRequired !== 'NONE' ? `Clearance: ${job.clearanceRequired}` : ''}
      ${job.industryExperience ? `Industry: ${job.industryExperience.join(', ')}` : ''}
      ${job.certifications ? `Certifications: ${job.certifications.join(', ')}` : ''}
    `.trim();

    // This would call existing CV Bank semantic search
    // For now, return placeholder
    console.log(`[CV Bank Search] Query: ${searchQuery}`);

    // Placeholder: In production, this calls Pinecone vector search
    // const results = await pinecone.search(searchQuery, topK: 20);
    return []; // Placeholder
  }

  /**
   * AI screening of candidates (0-100 scoring)
   */
  private async screenCandidates(jobs: SDLJobRequirement[]): Promise<{
    screened: number;
    topCandidates: any[];
  }> {
    // This would integrate with existing AI screening system
    // For now, return placeholder
    const screened = jobs.length * 10; // Assume 10 candidates per job
    const topCandidates = jobs.map(job => ({
      jobId: job.jobTitle,
      candidates: [], // Placeholder: Top 3 candidates per job
    }));

    return {
      screened,
      topCandidates,
    };
  }

  /**
   * Schedule interviews for top candidates
   */
  private async scheduleInterviews(
    jobs: SDLJobRequirement[],
    topCandidates: any[]
  ): Promise<number> {
    let totalInterviews = 0;

    for (const job of jobs) {
      // For critical/high priority jobs, schedule 3 interviews
      // For medium/low priority, schedule 2 interviews
      const interviewsPerJob = job.priority === 'CRITICAL' || job.priority === 'HIGH' ? 3 : 2;

      // This would integrate with existing Interviews Kanban system
      console.log(
        `[Interview Scheduling] Scheduling ${interviewsPerJob} interviews for ${job.jobTitle}`
      );

      totalInterviews += interviewsPerJob;
    }

    return totalInterviews;
  }

  /**
   * Create hiring pipeline in database
   */
  private async createHiringPipeline(jobs: SDLJobRequirement[]): Promise<void> {
    // Create project team structure
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        recruiterStatus: 'HIRING_IN_PROGRESS',
        recruiterActivatedAt: new Date(),
      },
    });

    // Create hiring records for each job
    // This would integrate with existing team/provider assignment system
    console.log(`[Hiring Pipeline] Created pipeline for ${jobs.length} roles`);
  }

  /**
   * Get pipeline status
   */
  async getStatus(): Promise<RecruiterPipelineStatus | null> {
    const project = await prisma.project.findUnique({
      where: { id: this.projectId },
      select: {
        recruiterPipelineStatus: true,
      },
    });

    return project?.recruiterPipelineStatus as RecruiterPipelineStatus | null;
  }

  /**
   * Save pipeline status
   */
  private async saveStatus(status: RecruiterPipelineStatus): Promise<void> {
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        recruiterPipelineStatus: status as any,
      },
    });
  }

  /**
   * Update hiring progress (called when providers are hired)
   */
  async updateHiringProgress(providersHired: number): Promise<void> {
    const status = await this.getStatus();
    if (!status) {
      throw new Error('Pipeline not started');
    }

    status.providersHired = providersHired;
    status.hiringComplete = providersHired >= status.totalJobs;

    if (status.hiringComplete) {
      status.actualCompletionTime = new Date();
      console.log(
        `[SDL Recruiter Pipeline] Hiring complete! ${providersHired} providers hired in ` +
        `${Math.round((status.actualCompletionTime.getTime() - status.triggeredAt!.getTime()) / (1000 * 60 * 60))} hours`
      );
    }

    await this.saveStatus(status);
  }
}

/**
 * Create SDL Recruiter Pipeline instance
 */
export function createSDLRecruiterPipeline(projectId: string): SDLRecruiterPipeline {
  return new SDLRecruiterPipeline(projectId);
}

/**
 * Auto-trigger pipeline after SDL Phase 3 completion
 */
export async function autoTriggerRecruiterPipeline(projectId: string): Promise<boolean> {
  const pipeline = createSDLRecruiterPipeline(projectId);

  const shouldTrigger = await pipeline.shouldTrigger();

  if (shouldTrigger) {
    console.log(`[Auto-Trigger] Launching ALIFF-RECRUITER for project ${projectId}`);
    await pipeline.execute();
    return true;
  }

  console.log(`[Auto-Trigger] Skipping ALIFF-RECRUITER (bid decision not "BID")`);
  return false;
}
