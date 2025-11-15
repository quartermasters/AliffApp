/**
 * Screening Algorithm
 *
 * Three-pass screening system:
 * - Pass 1: Basic qualifications filter
 * - Pass 2: Skills match scoring (0-100)
 * - Pass 3: AI assessment of fit
 *
 * Score >= 75 = Auto-advance to CV Bank + Interview
 * Score 60-74 = Human review required
 * Score < 60 = Auto-reject with feedback
 */

import OpenAI from 'openai';
import { ParsedResumeData } from './ai-resume-parser';

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export interface ScreeningInput {
  parsedData: ParsedResumeData;
  jobRequirements: string;
  jobResponsibilities: string;
}

export interface ScreeningResult {
  score: number; // 0-100
  shouldAdvance: boolean;
  notes: string; // Detailed feedback
  breakdown: {
    qualificationsPass: boolean;
    skillsScore: number;
    experienceScore: number;
    fitScore: number;
    redFlagsPenalty: number;
  };
  feedback: string[]; // Specific feedback points
}

export class ScreeningAlgorithm {
  /**
   * Screen application against job requirements
   */
  async screenApplication(input: ScreeningInput): Promise<ScreeningResult> {
    console.log('[Screening Algorithm] Starting screening for:', input.parsedData.email);

    // Pass 1: Basic Qualifications
    const qualificationsPass = this.checkBasicQualifications(input);

    if (!qualificationsPass.pass) {
      return {
        score: 0,
        shouldAdvance: false,
        notes: qualificationsPass.reason,
        breakdown: {
          qualificationsPass: false,
          skillsScore: 0,
          experienceScore: 0,
          fitScore: 0,
          redFlagsPenalty: 0,
        },
        feedback: [qualificationsPass.reason],
      };
    }

    // Pass 2: Skills Match Scoring
    const skillsScore = this.calculateSkillsScore(input);

    // Pass 3: Experience Scoring
    const experienceScore = this.calculateExperienceScore(input);

    // Pass 4: AI Fit Assessment
    const fitScore = await this.assessFitWithAI(input);

    // Red Flags Penalty
    const redFlagsPenalty = this.calculateRedFlagsPenalty(input.parsedData.redFlags);

    // Calculate total score
    const totalScore = Math.max(
      0,
      Math.round(
        skillsScore * 0.4 + experienceScore * 0.3 + fitScore * 0.3 - redFlagsPenalty
      )
    );

    // Generate feedback
    const feedback = this.generateFeedback({
      skillsScore,
      experienceScore,
      fitScore,
      redFlagsPenalty,
      parsedData: input.parsedData,
    });

    // Determine if should advance
    const shouldAdvance = totalScore >= 75; // Auto-advance threshold

    const result: ScreeningResult = {
      score: totalScore,
      shouldAdvance,
      notes: this.generateNotes({
        skillsScore,
        experienceScore,
        fitScore,
        redFlagsPenalty,
        totalScore,
        shouldAdvance,
      }),
      breakdown: {
        qualificationsPass: true,
        skillsScore,
        experienceScore,
        fitScore,
        redFlagsPenalty,
      },
      feedback,
    };

    console.log(
      `[Screening Algorithm] Score: ${totalScore}, Advance: ${shouldAdvance}`
    );

    return result;
  }

  /**
   * Pass 1: Check basic qualifications
   */
  private checkBasicQualifications(input: ScreeningInput): { pass: boolean; reason: string } {
    const { parsedData } = input;

    // Must have email
    if (!parsedData.email) {
      return { pass: false, reason: 'No email address found in resume' };
    }

    // Must have some work experience
    if (parsedData.yearsExperience < 1) {
      return { pass: false, reason: 'Insufficient work experience (< 1 year)' };
    }

    // Must have at least one skill listed
    if (parsedData.skills.length === 0) {
      return { pass: false, reason: 'No relevant skills found in resume' };
    }

    return { pass: true, reason: 'Basic qualifications met' };
  }

  /**
   * Pass 2: Calculate skills match score (0-100)
   */
  private calculateSkillsScore(input: ScreeningInput): number {
    const { parsedData, jobRequirements } = input;

    // Extract required skills from job requirements (simple keyword matching)
    const requiredSkillsLower = jobRequirements.toLowerCase();
    const candidateSkills = parsedData.skills.map((s) => s.toLowerCase());

    // Common GOVCON/proposal writing skills
    const govconSkills = [
      'proposal writing',
      'rfp response',
      'govcon',
      'far',
      'dfars',
      'section l',
      'section m',
      'past performance',
      'technical writing',
      'shipley',
      'apmp',
    ];

    // Count matches
    let matchCount = 0;
    let totalRequired = 0;

    govconSkills.forEach((skill) => {
      if (requiredSkillsLower.includes(skill)) {
        totalRequired++;
        if (candidateSkills.some((cs) => cs.includes(skill))) {
          matchCount++;
        }
      }
    });

    // If no specific skills identified, use general match
    if (totalRequired === 0) {
      totalRequired = candidateSkills.length;
      matchCount = candidateSkills.filter((skill) =>
        requiredSkillsLower.includes(skill)
      ).length;
    }

    // Calculate score (0-100)
    const score = totalRequired > 0 ? (matchCount / totalRequired) * 100 : 50;

    return Math.round(Math.min(100, score));
  }

  /**
   * Pass 3: Calculate experience score (0-100)
   */
  private calculateExperienceScore(input: ScreeningInput): number {
    const { parsedData, jobRequirements } = input;

    let score = 0;

    // Years of experience (up to 30 points)
    const yearsScore = Math.min(30, parsedData.yearsExperience * 5);
    score += yearsScore;

    // Relevant domains (up to 30 points)
    const govconDomains = ['GOVCON', 'SLED', 'Federal IT', 'Proposal Writing'];
    const domainMatches = parsedData.domains.filter((d) =>
      govconDomains.some((gd) => d.includes(gd))
    ).length;
    const domainScore = Math.min(30, domainMatches * 15);
    score += domainScore;

    // Certifications (up to 20 points)
    const valuableCerts = ['PMP', 'APMP', 'CISSP', 'Shipley'];
    const certMatches = parsedData.certifications.filter((c) =>
      valuableCerts.some((vc) => c.includes(vc))
    ).length;
    const certScore = Math.min(20, certMatches * 10);
    score += certScore;

    // Clearance (up to 20 points)
    if (parsedData.clearance && parsedData.clearance !== 'NONE') {
      score += 20;
    }

    return Math.round(Math.min(100, score));
  }

  /**
   * Pass 4: AI fit assessment (0-100)
   */
  private async assessFitWithAI(input: ScreeningInput): Promise<number> {
    const { parsedData, jobRequirements, jobResponsibilities } = input;

    const prompt = `You are an expert recruiter assessing candidate fit for a government contracting (GOVCON) role.

Job Requirements:
${jobRequirements}

Job Responsibilities:
${jobResponsibilities}

Candidate Profile:
- Name: ${parsedData.firstName} ${parsedData.lastName}
- Years of Experience: ${parsedData.yearsExperience}
- Skills: ${parsedData.skills.join(', ')}
- Domains: ${parsedData.domains.join(', ')}
- Certifications: ${parsedData.certifications.join(', ')}
- Clearance: ${parsedData.clearance || 'None'}
- Work History: ${parsedData.workHistory.map((w) => `${w.title} at ${w.company} (${w.duration})`).join('; ')}

Rate the candidate's fit for this role on a scale of 0-100, where:
- 90-100: Exceptional fit, exceeds requirements
- 75-89: Strong fit, meets all requirements
- 60-74: Moderate fit, meets most requirements
- 40-59: Weak fit, significant gaps
- 0-39: Poor fit, does not meet requirements

Provide your assessment as a JSON object with:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation>"
}

Return ONLY valid JSON, no markdown or explanations.`;

    try {
      const openai = getOpenAI();
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a precise candidate assessment system. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content || '{"score": 50}';
      const assessment = JSON.parse(content);

      console.log('[Screening Algorithm] AI fit assessment:', assessment.score);
      return Math.round(Math.min(100, Math.max(0, assessment.score)));
    } catch (error) {
      console.error('[Screening Algorithm] AI assessment error:', error);
      // Fallback to 50 if AI fails
      return 50;
    }
  }

  /**
   * Calculate red flags penalty
   */
  private calculateRedFlagsPenalty(redFlags: string[]): number {
    // Each red flag reduces score by 5 points
    return Math.min(30, redFlags.length * 5); // Max 30 point penalty
  }

  /**
   * Generate detailed feedback
   */
  private generateFeedback(params: {
    skillsScore: number;
    experienceScore: number;
    fitScore: number;
    redFlagsPenalty: number;
    parsedData: ParsedResumeData;
  }): string[] {
    const feedback: string[] = [];

    // Skills feedback
    if (params.skillsScore >= 80) {
      feedback.push('✅ Excellent skills match for this role');
    } else if (params.skillsScore >= 60) {
      feedback.push('✓ Good skills match with some gaps');
    } else {
      feedback.push('⚠️ Limited skills match - consider additional training');
    }

    // Experience feedback
    if (params.experienceScore >= 80) {
      feedback.push('✅ Strong relevant experience');
    } else if (params.experienceScore >= 60) {
      feedback.push('✓ Moderate relevant experience');
    } else {
      feedback.push('⚠️ Limited relevant experience in GOVCON/proposal writing');
    }

    // Red flags feedback
    if (params.redFlagsPenalty > 0) {
      feedback.push(
        `⚠️ ${params.parsedData.redFlags.length} concern(s) identified: ${params.parsedData.redFlags.join('; ')}`
      );
    }

    // Certifications feedback
    if (params.parsedData.certifications.length > 0) {
      feedback.push(`✅ Certifications: ${params.parsedData.certifications.join(', ')}`);
    }

    // Clearance feedback
    if (params.parsedData.clearance && params.parsedData.clearance !== 'NONE') {
      feedback.push(`✅ Security clearance: ${params.parsedData.clearance}`);
    }

    return feedback;
  }

  /**
   * Generate detailed notes
   */
  private generateNotes(params: {
    skillsScore: number;
    experienceScore: number;
    fitScore: number;
    redFlagsPenalty: number;
    totalScore: number;
    shouldAdvance: boolean;
  }): string {
    const notes = `
ALIFF-RECRUITER Screening Results
==================================

Overall Score: ${params.totalScore}/100

Breakdown:
- Skills Match: ${params.skillsScore}/100 (40% weight)
- Experience Score: ${params.experienceScore}/100 (30% weight)
- AI Fit Assessment: ${params.fitScore}/100 (30% weight)
- Red Flags Penalty: -${params.redFlagsPenalty} points

Decision: ${params.shouldAdvance ? 'ADVANCE TO CV BANK + INTERVIEW' : 'REJECTED'}

${params.shouldAdvance ? 'Candidate meets auto-advance threshold (≥75)' : 'Candidate does not meet minimum threshold'}
${params.totalScore >= 60 && params.totalScore < 75 ? '\nNote: Borderline candidate - consider human review' : ''}

Next Steps:
${params.shouldAdvance ? '- Added to CV Bank\n- Send interview invitation\n- AI chat interview scheduled' : '- Send empathetic rejection email with specific feedback\n- Offer to keep in talent pool for future roles'}
    `.trim();

    return notes;
  }
}

/**
 * Create Screening Algorithm instance
 */
export function createScreeningAlgorithm(): ScreeningAlgorithm {
  return new ScreeningAlgorithm();
}
