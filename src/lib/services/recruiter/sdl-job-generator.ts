/**
 * SDL → ALIFF-RECRUITER Job Description Generator
 *
 * Automatically generates job descriptions from SDL Win Strategy Brief
 * to hire the exact specialists needed for the proposal.
 *
 * Extracts skills from:
 * - Task 5: Stated requirements
 * - Task 18: Unstated requirements (CRITICAL - the hidden needs!)
 * - Task 30: Solution approach (technical & management needs)
 * - Task 32: Teaming strategy (capability gaps)
 */

import { prisma } from '@/lib/prisma';
import { SDLTaskPhase } from '@prisma/client';
import { createReportGenerator } from '../sdl/report-generator';

// ============================================================================
// JOB TYPES FROM SDL ANALYSIS
// ============================================================================

export interface SDLJobRequirement {
  jobTitle: string;
  category: 'TECHNICAL_WRITER' | 'SUBJECT_MATTER_EXPERT' | 'PRICING_ANALYST' | 'PAST_PERFORMANCE' | 'GRAPHICS_DESIGNER' | 'EDITOR' | 'COMPLIANCE_SPECIALIST';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  requiredSkills: string[];
  preferredSkills: string[];
  yearsExperience: number;
  clearanceRequired?: 'SECRET' | 'TOP_SECRET' | 'TS_SCI' | 'PUBLIC_TRUST' | 'NONE';
  industryExperience?: string[]; // e.g., ["Healthcare", "Federal IT"]
  certifications?: string[]; // e.g., ["PMP", "CISSP"]
  rationale: string; // Why this role is needed (from SDL analysis)
  alignsWithUnstatedRequirement?: string; // Links to Task 18 findings
  estimatedHours: number;
  urgency: 'IMMEDIATE' | 'NORMAL' | 'LOW';
}

export interface SDLJobDescriptionPackage {
  projectId: string;
  projectName: string;
  agency: string;
  contractValue: string;
  dueDate: Date;
  complexity: number;
  winProbability: number;

  // Generated job requirements
  jobs: SDLJobRequirement[];

  // Context from SDL
  unstatedRequirements: any[];
  painPoints: any[];
  winThemes: any[];
  differentiators: any[];

  // Metadata
  generatedAt: Date;
  totalRolesNeeded: number;
  criticalRolesCount: number;
  estimatedTotalHours: number;
}

// ============================================================================
// SDL JOB GENERATOR CLASS
// ============================================================================

export class SDLJobGenerator {
  constructor(private projectId: string) {}

  /**
   * Generate job descriptions from SDL Win Strategy Brief
   */
  async generateJobDescriptions(): Promise<SDLJobDescriptionPackage> {
    console.log(`[SDL Job Generator] Generating jobs for project ${this.projectId}`);

    // Get project details
    const project = await prisma.project.findUnique({
      where: { id: this.projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Get Win Strategy Brief (must be complete)
    const reportGenerator = createReportGenerator(this.projectId);
    const winStrategyBrief = await reportGenerator.generateWinStrategyBrief();

    // Get all SDL task results for detailed skill extraction
    const phase1Tasks = await this.getTasksByPhase(SDLTaskPhase.PHASE1_TRIAGE);
    const phase2Tasks = await this.getTasksByPhase(SDLTaskPhase.PHASE2_STRATEGIC_INTEL);
    const phase3Tasks = await this.getTasksByPhase(SDLTaskPhase.PHASE3_WIN_STRATEGY);

    // Extract key data
    const statedRequirements = this.getTaskResult(phase1Tasks, 5); // Task 5
    const metadata = this.getTaskResult(phase1Tasks, 2); // Task 2
    const unstatedRequirements = this.getTaskResult(phase2Tasks, 18); // Task 18
    const painPoints = this.getTaskResult(phase2Tasks, 19); // Task 19
    const solutionApproach = this.getTaskResult(phase3Tasks, 30); // Task 30
    const teamingStrategy = this.getTaskResult(phase3Tasks, 32); // Task 32
    const winThemes = this.getTaskResult(phase3Tasks, 27); // Task 27

    // Generate jobs based on SDL analysis
    const jobs: SDLJobRequirement[] = [];

    // 1. TECHNICAL WRITERS (always needed)
    jobs.push(...this.generateTechnicalWriterJobs(
      statedRequirements,
      unstatedRequirements,
      solutionApproach,
      winStrategyBrief.executiveSummary.complexityScore
    ));

    // 2. SUBJECT MATTER EXPERTS (from capability gaps)
    jobs.push(...this.generateSMEJobs(
      teamingStrategy,
      unstatedRequirements,
      solutionApproach
    ));

    // 3. PRICING ANALYST (if budget assessment shows complexity)
    jobs.push(...this.generatePricingJobs(
      phase2Tasks,
      statedRequirements
    ));

    // 4. PAST PERFORMANCE SPECIALIST (if evaluation criteria weight past performance)
    jobs.push(...this.generatePastPerformanceJobs(
      phase1Tasks,
      statedRequirements
    ));

    // 5. COMPLIANCE SPECIALIST (if complex compliance requirements)
    jobs.push(...this.generateComplianceJobs(
      phase1Tasks
    ));

    // 6. GRAPHICS DESIGNER (if technical approach needs diagrams)
    jobs.push(...this.generateGraphicsJobs(
      solutionApproach
    ));

    // 7. EDITOR (quality control - always needed)
    jobs.push(this.generateEditorJob(
      winStrategyBrief.executiveSummary.complexityScore
    ));

    // Sort by priority
    jobs.sort((a, b) => {
      const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const package_: SDLJobDescriptionPackage = {
      projectId: this.projectId,
      projectName: project.title,
      agency: metadata?.agency || 'Unknown Agency',
      contractValue: metadata?.contractValue || 'TBD',
      dueDate: metadata?.dueDate ? new Date(metadata.dueDate) : new Date(),
      complexity: winStrategyBrief.diagnosisContext.complexityScore,
      winProbability: winStrategyBrief.executiveSummary.winProbability,

      jobs,

      unstatedRequirements: winStrategyBrief.diagnosisContext.unstatedRequirements,
      painPoints: winStrategyBrief.diagnosisContext.painPoints,
      winThemes: [winStrategyBrief.winStrategy.primaryWinTheme, ...winStrategyBrief.winStrategy.secondaryWinThemes],
      differentiators: winStrategyBrief.winStrategy.differentiators,

      generatedAt: new Date(),
      totalRolesNeeded: jobs.length,
      criticalRolesCount: jobs.filter(j => j.priority === 'CRITICAL').length,
      estimatedTotalHours: jobs.reduce((sum, j) => sum + j.estimatedHours, 0),
    };

    // Save to database
    await this.saveJobPackage(package_);

    return package_;
  }

  // ============================================================================
  // JOB GENERATION METHODS
  // ============================================================================

  private generateTechnicalWriterJobs(
    statedRequirements: any,
    unstatedRequirements: any,
    solutionApproach: any,
    complexity: number
  ): SDLJobRequirement[] {
    const jobs: SDLJobRequirement[] = [];

    // Always need at least one lead technical writer
    jobs.push({
      jobTitle: 'Senior Technical Writer (Lead)',
      category: 'TECHNICAL_WRITER',
      priority: 'CRITICAL',
      requiredSkills: [
        'Government proposal writing (GOVCON/SLED)',
        'Technical approach development',
        'Past performance narratives',
        'Compliance matrix creation',
        'Win theme integration',
      ],
      preferredSkills: [
        'Federal acquisition regulations (FAR)',
        'Defense contract writing (DFARS)',
        'Shipley Associates training',
        'APMP certification',
      ],
      yearsExperience: 5,
      clearanceRequired: 'NONE',
      rationale: 'Lead writer to develop technical approach and manage proposal sections',
      estimatedHours: complexity > 7 ? 120 : 80,
      urgency: 'IMMEDIATE',
    });

    // If complexity > 7, need additional writers
    if (complexity > 7) {
      jobs.push({
        jobTitle: 'Technical Writer (Management Approach)',
        category: 'TECHNICAL_WRITER',
        priority: 'HIGH',
        requiredSkills: [
          'Management approach writing',
          'Quality control processes',
          'Risk management documentation',
          'Organizational charts',
        ],
        preferredSkills: [
          'PMP certification',
          'CMMI experience',
          'ISO 9001 knowledge',
        ],
        yearsExperience: 3,
        clearanceRequired: 'NONE',
        rationale: 'Complex proposal requires dedicated management approach writer',
        estimatedHours: 60,
        urgency: 'IMMEDIATE',
      });
    }

    // If unstated requirements exist, need writer who can address subtle needs
    if (unstatedRequirements?.unstatedRequirements?.length > 0) {
      jobs.push({
        jobTitle: 'Strategic Writer (Unstated Requirements Specialist)',
        category: 'TECHNICAL_WRITER',
        priority: 'CRITICAL',
        requiredSkills: [
          'Strategic messaging',
          'Pain point addressing',
          'Win theme development',
          'Competitive ghosting',
          'Unstated requirement identification',
        ],
        preferredSkills: [
          'Capture management experience',
          'Business development background',
          'Agency relationship experience',
        ],
        yearsExperience: 7,
        clearanceRequired: 'NONE',
        rationale: `Critical: Address ${unstatedRequirements.unstatedRequirements.length} unstated requirements that competitors will miss`,
        alignsWithUnstatedRequirement: unstatedRequirements.unstatedRequirements[0]?.requirement,
        estimatedHours: 80,
        urgency: 'IMMEDIATE',
      });
    }

    return jobs;
  }

  private generateSMEJobs(
    teamingStrategy: any,
    unstatedRequirements: any,
    solutionApproach: any
  ): SDLJobRequirement[] {
    const jobs: SDLJobRequirement[] = [];

    // Check capability gaps from Task 32
    const capabilityGaps = teamingStrategy?.capabilityGaps || [];

    for (const gap of capabilityGaps) {
      if (gap.criticality === 'CRITICAL' || gap.criticality === 'IMPORTANT') {
        jobs.push({
          jobTitle: `Subject Matter Expert - ${gap.gap}`,
          category: 'SUBJECT_MATTER_EXPERT',
          priority: gap.criticality === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
          requiredSkills: [
            gap.gap,
            'Technical content development',
            'Solution architecture',
            'Government contracting experience',
          ],
          preferredSkills: gap.partnerCriteria ? [gap.partnerCriteria] : [],
          yearsExperience: gap.criticality === 'CRITICAL' ? 10 : 5,
          clearanceRequired: 'NONE',
          rationale: `Critical capability gap identified in SDL Task 32: ${gap.gap}`,
          estimatedHours: 40,
          urgency: gap.criticality === 'CRITICAL' ? 'IMMEDIATE' : 'NORMAL',
        });
      }
    }

    // If technical innovations mentioned, need innovation SME
    const innovations = solutionApproach?.technicalApproach?.innovativeElements || [];
    if (innovations.length > 0) {
      jobs.push({
        jobTitle: 'Innovation Architect',
        category: 'SUBJECT_MATTER_EXPERT',
        priority: 'HIGH',
        requiredSkills: [
          'Emerging technologies',
          'Innovation strategy',
          'Technical differentiation',
          'Proof of concept development',
        ],
        preferredSkills: [
          'AI/ML expertise',
          'Cloud architecture',
          'DevSecOps',
        ],
        yearsExperience: 8,
        clearanceRequired: 'NONE',
        rationale: `Develop innovative solution elements: ${innovations.join(', ')}`,
        estimatedHours: 40,
        urgency: 'NORMAL',
      });
    }

    return jobs;
  }

  private generatePricingJobs(phase2Tasks: any[], statedRequirements: any): SDLJobRequirement[] {
    const budgetReality = this.getTaskResult(phase2Tasks, 20); // Task 20

    // If budget is complex or LPTA, need pricing analyst
    const isPricingCritical =
      statedRequirements?.evaluationApproach === 'LPTA' ||
      budgetReality?.constraints?.includes('tight') ||
      budgetReality?.constraints?.includes('competitive');

    if (isPricingCritical) {
      return [{
        jobTitle: 'Pricing Analyst',
        category: 'PRICING_ANALYST',
        priority: 'CRITICAL',
        requiredSkills: [
          'Government pricing',
          'Cost volume development',
          'LPTA strategy',
          'Competitive pricing analysis',
          'FAR cost principles',
        ],
        preferredSkills: [
          'CPA certification',
          'Defense contract pricing',
          'DCAA compliance',
        ],
        yearsExperience: 5,
        clearanceRequired: 'NONE',
        rationale: 'LPTA or tight budget requires expert pricing strategy',
        estimatedHours: 60,
        urgency: 'IMMEDIATE',
      }];
    }

    return [];
  }

  private generatePastPerformanceJobs(phase1Tasks: any[], statedRequirements: any): SDLJobRequirement[] {
    const evaluationCriteria = this.getTaskResult(phase1Tasks, 6); // Task 6

    // Check if past performance is heavily weighted
    const pastPerfWeight = evaluationCriteria?.criteria?.find((c: any) =>
      c.factor?.toLowerCase().includes('past performance')
    )?.weight || 0;

    if (pastPerfWeight >= 30) {
      return [{
        jobTitle: 'Past Performance Specialist',
        category: 'PAST_PERFORMANCE',
        priority: 'HIGH',
        requiredSkills: [
          'Past performance narrative writing',
          'CPARS review',
          'Reference coordination',
          'Relevance matching',
          'Performance metrics presentation',
        ],
        preferredSkills: [
          'Government contracting experience',
          'Customer relationship management',
        ],
        yearsExperience: 3,
        clearanceRequired: 'NONE',
        rationale: `Past performance weighted at ${pastPerfWeight}% - critical evaluation factor`,
        estimatedHours: 40,
        urgency: 'NORMAL',
      }];
    }

    return [];
  }

  private generateComplianceJobs(phase1Tasks: any[]): SDLJobRequirement[] {
    const complianceRequirements = this.getTaskResult(phase1Tasks, 7); // Task 7
    const complexityScore = this.getTaskResult(phase1Tasks, 10); // Task 10

    // If many compliance requirements or high complexity, need compliance specialist
    const complianceCount = complianceRequirements?.requirements?.length || 0;

    if (complianceCount > 10 || complexityScore?.complexityScore >= 8) {
      return [{
        jobTitle: 'Compliance Specialist',
        category: 'COMPLIANCE_SPECIALIST',
        priority: 'HIGH',
        requiredSkills: [
          'FAR/DFARS compliance',
          'Compliance matrix development',
          'Requirements traceability',
          'Solicitation analysis',
          'Section L/M cross-referencing',
        ],
        preferredSkills: [
          'Contracts administration',
          'Legal background',
          'Government audit experience',
        ],
        yearsExperience: 5,
        clearanceRequired: 'NONE',
        rationale: `${complianceCount} compliance requirements require dedicated specialist`,
        estimatedHours: 30,
        urgency: 'NORMAL',
      }];
    }

    return [];
  }

  private generateGraphicsJobs(solutionApproach: any): SDLJobRequirement[] {
    const technicalComponents = solutionApproach?.technicalApproach?.keyComponents?.length || 0;

    // If complex technical solution, need graphics designer
    if (technicalComponents >= 5) {
      return [{
        jobTitle: 'Graphics Designer (Technical Diagrams)',
        category: 'GRAPHICS_DESIGNER',
        priority: 'MEDIUM',
        requiredSkills: [
          'Technical diagram creation',
          'Architecture diagrams',
          'Process flow charts',
          'Proposal graphics standards',
          'Adobe Creative Suite',
          'Visio',
        ],
        preferredSkills: [
          'Government proposal experience',
          'Section 508 compliance',
          'Infographic design',
        ],
        yearsExperience: 3,
        clearanceRequired: 'NONE',
        rationale: `${technicalComponents} technical components require professional diagrams`,
        estimatedHours: 20,
        urgency: 'NORMAL',
      }];
    }

    return [];
  }

  private generateEditorJob(complexity: number): SDLJobRequirement {
    return {
      jobTitle: 'Senior Editor / Quality Reviewer',
      category: 'EDITOR',
      priority: 'CRITICAL',
      requiredSkills: [
        'Proposal editing',
        'Quality control',
        'Grammar and style',
        'Consistency review',
        'Final formatting',
        'Gold Gate review',
      ],
      preferredSkills: [
        'Shipley quality review',
        'Federal proposal experience',
        'Section 508 compliance',
      ],
      yearsExperience: 5,
      clearanceRequired: 'NONE',
      rationale: 'Final quality gate before client delivery - ensures 96+ quality score',
      estimatedHours: complexity > 7 ? 40 : 24,
      urgency: 'NORMAL',
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async getTasksByPhase(phase: SDLTaskPhase) {
    return await prisma.sDLTask.findMany({
      where: {
        projectId: this.projectId,
        taskPhase: phase,
      },
      orderBy: { taskNumber: 'asc' },
    });
  }

  private getTaskResult(tasks: any[], taskNumber: number): any {
    const task = tasks.find((t) => t.taskNumber === taskNumber);
    return task?.consensusResult || task?.primaryResult || null;
  }

  private async saveJobPackage(package_: SDLJobDescriptionPackage): Promise<void> {
    // Save to project for later retrieval
    await prisma.project.update({
      where: { id: this.projectId },
      data: {
        recruiterJobPackage: package_ as any,
      },
    });

    console.log(`[SDL Job Generator] Generated ${package_.totalRolesNeeded} job descriptions (${package_.criticalRolesCount} critical)`);
  }
}

/**
 * Create SDL Job Generator instance
 */
export function createSDLJobGenerator(projectId: string): SDLJobGenerator {
  return new SDLJobGenerator(projectId);
}
