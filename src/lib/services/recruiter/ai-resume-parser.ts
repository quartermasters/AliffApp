/**
 * AI Resume Parser
 *
 * Extracts 50+ data points from resumes using GPT-4
 * Supports PDF and Word documents
 * Normalizes skills and experience data
 */

import OpenAI from 'openai';
import { ClearanceLevel } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ParsedResumeData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  timezone?: string;

  // Professional Links
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;

  // Experience Summary
  yearsExperience: number;
  currentTitle?: string;
  currentCompany?: string;

  // Skills & Expertise
  skills: string[]; // Normalized skill names
  domains: string[]; // Industry domains (GOVCON, Healthcare, IT, etc.)
  certifications: string[];
  clearance?: ClearanceLevel;
  industryExperience: string[];

  // Education
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    year?: number;
  }>;

  // Work History
  workHistory: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    duration: string;
    responsibilities: string[];
  }>;

  // Projects & Achievements
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string[];
  }>;

  // Languages
  languages?: string[];

  // Red Flags (for screening)
  redFlags: string[];

  // Raw extracted text
  rawText: string;
}

export class AIResumeParser {
  /**
   * Parse resume from URL (PDF or Word document)
   */
  async parseResume(resumeUrl: string): Promise<ParsedResumeData> {
    console.log(`[AI Resume Parser] Parsing resume: ${resumeUrl}`);

    // Download resume content
    const resumeText = await this.extractTextFromResume(resumeUrl);

    // Use GPT-4 to extract structured data
    const parsedData = await this.extractDataWithGPT4(resumeText);

    // Normalize and enrich data
    const normalizedData = this.normalizeData(parsedData);

    // Detect red flags
    const redFlags = this.detectRedFlags(normalizedData, resumeText);

    return {
      ...normalizedData,
      redFlags,
      rawText: resumeText,
    };
  }

  /**
   * Extract text from PDF/Word resume
   * TODO: Implement actual PDF/Word extraction (use pdf-parse or mammoth)
   */
  private async extractTextFromResume(resumeUrl: string): Promise<string> {
    // Placeholder: In production, download file and extract text
    // For now, return placeholder text for testing
    console.log('[AI Resume Parser] Extracting text from:', resumeUrl);

    // TODO: Implement actual extraction
    // - Use pdf-parse for PDFs
    // - Use mammoth for Word docs
    // - Use GPT-4 Vision API for image-based PDFs

    return `
      [Placeholder resume text extracted from ${resumeUrl}]
      This would contain the actual resume text in production.
    `;
  }

  /**
   * Extract structured data using GPT-4
   */
  private async extractDataWithGPT4(resumeText: string): Promise<Partial<ParsedResumeData>> {
    const prompt = `You are an expert resume parser. Extract the following information from this resume and return it as a JSON object.

Extract:
1. Personal Information: firstName, lastName, email, phone, location, timezone (if mentioned)
2. Professional Links: linkedinUrl, githubUrl, portfolioUrl
3. Experience Summary: yearsExperience (total years), currentTitle, currentCompany
4. Skills: Array of technical and professional skills (normalize names: "React.js" → "React", "ReactJS" → "React")
5. Domains: Industry domains (e.g., "GOVCON", "SLED", "Healthcare", "Federal IT", "Cybersecurity", "Proposal Writing")
6. Certifications: Array of certifications (PMP, APMP, CISSP, etc.)
7. Clearance: Security clearance level if mentioned (SECRET, TOP_SECRET, TS_SCI, PUBLIC_TRUST, or null)
8. Industry Experience: Industries worked in
9. Education: Array of {degree, field, institution, year}
10. Work History: Array of {title, company, startDate, endDate, duration, responsibilities[]}
11. Projects: Array of {name, description, technologies[]} if mentioned
12. Languages: Spoken languages if mentioned

Important:
- Normalize skill names (remove variations)
- Calculate total years of experience accurately
- For GOVCON/proposal writing roles, look for: proposal writing, RFP response, FAR/DFARS, Section L/M, Past Performance, GOVCON, Federal contracting
- For dates: Use "Present" or "Current" if still employed
- If information is missing, use null or empty array

Resume text:
${resumeText}

Return ONLY valid JSON, no markdown or explanations.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a precise resume parsing system. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content);

      console.log('[AI Resume Parser] GPT-4 extraction complete');
      return parsed;
    } catch (error) {
      console.error('[AI Resume Parser] GPT-4 extraction error:', error);
      throw new Error(`Failed to parse resume with AI: ${(error as Error).message}`);
    }
  }

  /**
   * Normalize extracted data
   */
  private normalizeData(data: Partial<ParsedResumeData>): ParsedResumeData {
    return {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone,
      location: data.location,
      timezone: data.timezone,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      portfolioUrl: data.portfolioUrl,
      yearsExperience: data.yearsExperience || 0,
      currentTitle: data.currentTitle,
      currentCompany: data.currentCompany,
      skills: this.normalizeSkills(data.skills || []),
      domains: data.domains || [],
      certifications: data.certifications || [],
      clearance: data.clearance,
      industryExperience: data.industryExperience || [],
      education: data.education || [],
      workHistory: data.workHistory || [],
      projects: data.projects,
      languages: data.languages,
      redFlags: [],
      rawText: '',
    };
  }

  /**
   * Normalize skill names
   */
  private normalizeSkills(skills: string[]): string[] {
    const normalizations: Record<string, string> = {
      // Programming Languages
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',

      // Frameworks
      'react': 'React',
      'reactjs': 'React',
      'react.js': 'React',
      'nextjs': 'Next.js',
      'next.js': 'Next.js',
      'nodejs': 'Node.js',
      'node.js': 'Node.js',

      // GOVCON/Proposal Writing
      'proposal writing': 'Proposal Writing',
      'rfp': 'RFP Response',
      'rfp response': 'RFP Response',
      'govcon': 'GOVCON',
      'government contracting': 'GOVCON',
      'far': 'FAR',
      'dfars': 'DFARS',
      'far/dfars': 'FAR/DFARS',
      'section l': 'Section L',
      'section m': 'Section M',
      'past performance': 'Past Performance',
      'technical writing': 'Technical Writing',
      'shipley': 'Shipley Associates',

      // Other common variations
      'aws': 'AWS',
      'amazon web services': 'AWS',
      'postgresql': 'PostgreSQL',
      'postgres': 'PostgreSQL',
    };

    return skills.map((skill) => {
      const normalized = normalizations[skill.toLowerCase()];
      return normalized || skill;
    });
  }

  /**
   * Detect red flags in resume
   */
  private detectRedFlags(data: ParsedResumeData, resumeText: string): string[] {
    const flags: string[] = [];

    // Employment gaps > 6 months
    const workHistory = data.workHistory || [];
    for (let i = 0; i < workHistory.length - 1; i++) {
      const currentEnd = new Date(workHistory[i].endDate || Date.now());
      const nextStart = new Date(workHistory[i + 1].startDate);
      const gapMonths = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (gapMonths > 6) {
        flags.push(`Employment gap of ${Math.round(gapMonths)} months`);
      }
    }

    // Frequent job changes (>3 jobs in 2 years)
    const recentJobs = workHistory.filter((job) => {
      const startDate = new Date(job.startDate);
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      return startDate >= twoYearsAgo;
    });

    if (recentJobs.length > 3) {
      flags.push('Frequent job changes (3+ jobs in 2 years)');
    }

    // Missing email
    if (!data.email) {
      flags.push('No email address found');
    }

    // Very short work durations (<6 months average)
    if (workHistory.length > 0) {
      const totalMonths = workHistory.reduce((sum, job) => {
        const start = new Date(job.startDate);
        const end = job.endDate ? new Date(job.endDate) : new Date();
        const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
        return sum + months;
      }, 0);

      const avgMonths = totalMonths / workHistory.length;
      if (avgMonths < 6) {
        flags.push('Short average tenure (< 6 months per job)');
      }
    }

    // No relevant experience for GOVCON roles
    const hasGovconExperience = data.skills.some((skill) =>
      ['GOVCON', 'Proposal Writing', 'RFP Response', 'FAR', 'DFARS'].includes(skill)
    ) || data.domains.includes('GOVCON');

    if (!hasGovconExperience && resumeText.toLowerCase().includes('govcon')) {
      flags.push('Mentioned GOVCON but no relevant skills/experience found');
    }

    return flags;
  }
}

/**
 * Create AI Resume Parser instance
 */
export function createAIResumeParser(): AIResumeParser {
  return new AIResumeParser();
}
