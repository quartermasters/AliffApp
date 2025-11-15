import { readFile } from "fs/promises";
import path from "path";
import {
  ParsedResume,
  ResumeParsingResult,
  RESUME_PARSING_PROMPT,
  GOVCON_KEYWORDS,
  SLED_KEYWORDS,
  TECHNICAL_SKILLS_KEYWORDS,
  WRITING_KEYWORDS,
} from "./types";

// PDF parsing library (install: npm install pdf-parse)
// import pdf from "pdf-parse";

// DOCX parsing library (install: npm install mammoth)
// import mammoth from "mammoth";

// AI SDK for parsing (install: npm install ai @ai-sdk/openai)
// import { generateObject } from "ai";
// import { openai } from "@ai-sdk/openai";

/**
 * Extract text content from PDF file
 */
async function extractPdfText(filePath: string): Promise<string> {
  try {
    // Production implementation with pdf-parse:
    /*
    const dataBuffer = await readFile(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
    */

    // Simulated for development
    console.log(`[DEV] Simulating PDF extraction from: ${filePath}`);
    return `
      John Doe
      Email: john.doe@example.com | Phone: +1-555-0123
      Location: Washington, DC | LinkedIn: linkedin.com/in/johndoe

      PROFESSIONAL SUMMARY
      Senior GOVCON Proposal Writer with 8+ years of federal proposal development experience.
      Proven track record of 15+ contract wins totaling $50M+ in awards. Expert in FAR/DFARS compliance,
      Shipley methodology, and multi-volume proposal development for DoD, VA, and civilian agencies.

      WORK EXPERIENCE

      Senior Proposal Writer | ABC Contracting LLC | Jan 2018 - Present
      Washington, DC
      - Lead writer for 20+ federal RFPs annually with 70% win rate
      - Develop Section L/M compliant technical, management, and past performance volumes
      - Collaborate with capture managers, SMEs, and teaming partners
      - Manage proposal schedules using Shipley Best Practices
      - Technologies: SharePoint, Adobe InDesign, Microsoft Office Suite

      Proposal Coordinator | XYZ Solutions Inc | Jun 2015 - Dec 2017
      Arlington, VA
      - Supported 30+ proposal submissions for VA and HHS contracts
      - Conducted compliance reviews and section L/M matrices
      - Coordinated with subcontractors for past performance narratives

      EDUCATION
      Bachelor of Arts in English | University of Maryland | 2015
      GPA: 3.8 | Honors: Magna Cum Laude

      SKILLS
      Technical: Proposal Writing, Technical Writing, Compliance Analysis, RFP Analysis
      Soft: Project Management, Team Leadership, Stakeholder Communication
      Tools: SharePoint, Adobe Creative Suite, Microsoft Office, Smartsheet
      Certifications: APMP Foundation, Shipley Certified

      CLEARANCES
      Active Secret Clearance (renewed 2023)

      DOMAINS
      Government Contracting, Federal Proposal Development, DoD, Veterans Affairs
    `;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract PDF content");
  }
}

/**
 * Extract text content from DOCX file
 */
async function extractDocxText(filePath: string): Promise<string> {
  try {
    // Production implementation with mammoth:
    /*
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
    */

    // Simulated for development
    console.log(`[DEV] Simulating DOCX extraction from: ${filePath}`);
    return await extractPdfText(filePath); // Use same simulation
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error("Failed to extract DOCX content");
  }
}

/**
 * Extract text from resume file based on format
 */
export async function extractResumeText(
  filePath: string,
  format: string
): Promise<string> {
  const normalizedFormat = format.toLowerCase();

  if (normalizedFormat === "pdf") {
    return extractPdfText(filePath);
  } else if (
    normalizedFormat === "docx" ||
    normalizedFormat === "doc" ||
    normalizedFormat === "msword"
  ) {
    return extractDocxText(filePath);
  } else {
    throw new Error(`Unsupported resume format: ${format}`);
  }
}

/**
 * Calculate years of experience from work history
 */
function calculateTotalExperience(workExperience: any[]): number {
  if (!workExperience || workExperience.length === 0) return 0;

  let totalMonths = 0;

  for (const job of workExperience) {
    const start = new Date(job.startDate || "2020-01-01");
    const end = job.endDate ? new Date(job.endDate) : new Date();

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    totalMonths += Math.max(0, months);
  }

  return Math.round((totalMonths / 12) * 10) / 10; // Round to 1 decimal
}

/**
 * Detect GOVCON experience from resume text and work history
 */
function detectGovconExperience(
  resumeText: string,
  workExperience: any[]
): {
  hasGovconExperience: boolean;
  yearsOfGovconExperience: number;
  federalAgenciesWorkedWith: string[];
  sledExperience: boolean;
  proposalTypes: string[];
} {
  const textLower = resumeText.toLowerCase();

  // Check for GOVCON keywords
  const govconMatches = GOVCON_KEYWORDS.filter((keyword) =>
    textLower.includes(keyword.toLowerCase())
  );

  // Check for SLED keywords
  const sledMatches = SLED_KEYWORDS.filter((keyword) =>
    textLower.includes(keyword.toLowerCase())
  );

  // Extract federal agencies
  const agencies = [
    "DoD",
    "VA",
    "DHS",
    "HHS",
    "GSA",
    "DOE",
    "NASA",
    "DOJ",
    "State Department",
    "USAID",
  ];
  const federalAgenciesWorkedWith = agencies.filter((agency) =>
    textLower.includes(agency.toLowerCase())
  );

  // Extract proposal types
  const proposalTypes: string[] = [];
  if (textLower.includes("rfp")) proposalTypes.push("RFP");
  if (textLower.includes("rfq")) proposalTypes.push("RFQ");
  if (textLower.includes("ifb")) proposalTypes.push("IFB");

  // Calculate GOVCON years from work experience
  let govconYears = 0;
  for (const job of workExperience || []) {
    const jobText = `${job.company} ${job.position} ${job.description} ${job.responsibilities?.join(" ")}`.toLowerCase();

    if (
      GOVCON_KEYWORDS.some((keyword) => jobText.includes(keyword.toLowerCase()))
    ) {
      const start = new Date(job.startDate || "2020-01-01");
      const end = job.endDate ? new Date(job.endDate) : new Date();
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      govconYears += months / 12;
    }
  }

  return {
    hasGovconExperience: govconMatches.length > 0 || govconYears > 0,
    yearsOfGovconExperience: Math.round(govconYears * 10) / 10,
    federalAgenciesWorkedWith,
    sledExperience: sledMatches.length > 0,
    proposalTypes,
  };
}

/**
 * Parse resume using AI (GPT-4)
 */
export async function parseResumeWithAI(
  resumeText: string,
  resumeFormat: string,
  resumeLength: number
): Promise<ResumeParsingResult> {
  try {
    console.log(
      `[AI Parser] Starting resume parsing (${resumeFormat}, ${resumeLength} pages)`
    );

    // Production implementation with Vercel AI SDK:
    /*
    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: ParsedResumeSchema, // Zod schema matching ParsedResume
      prompt: `${RESUME_PARSING_PROMPT}\n\nRESUME TEXT:\n${resumeText}`,
    });

    const parsedData = result.object as ParsedResume;
    */

    // Simulated AI parsing for development
    const parsedData: ParsedResume = {
      personalInfo: {
        firstName: "John",
        lastName: "Doe",
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1-555-0123",
        location: "Washington, DC",
        city: "Washington",
        state: "DC",
        country: "USA",
        timezone: "America/New_York",
      },

      summary: {
        professionalSummary:
          "Senior GOVCON Proposal Writer with 8+ years of federal proposal development experience. Proven track record of 15+ contract wins totaling $50M+ in awards.",
        headline: "Senior Federal Proposal Writer | GOVCON Expert",
      },

      workExperience: [
        {
          company: "ABC Contracting LLC",
          position: "Senior Proposal Writer",
          location: "Washington, DC",
          startDate: "2018-01",
          endDate: undefined,
          isCurrent: true,
          duration: "7 years",
          description:
            "Lead writer for federal RFPs with focus on DoD and VA contracts",
          responsibilities: [
            "Lead writer for 20+ federal RFPs annually with 70% win rate",
            "Develop Section L/M compliant technical, management, and past performance volumes",
            "Collaborate with capture managers, SMEs, and teaming partners",
            "Manage proposal schedules using Shipley Best Practices",
          ],
          achievements: [
            "Achieved 70% win rate (15+ contract wins)",
            "Contributed to $50M+ in contract awards",
          ],
          technologies: [
            "SharePoint",
            "Adobe InDesign",
            "Microsoft Office Suite",
          ],
          domain: "GOVCON",
        },
        {
          company: "XYZ Solutions Inc",
          position: "Proposal Coordinator",
          location: "Arlington, VA",
          startDate: "2015-06",
          endDate: "2017-12",
          isCurrent: false,
          duration: "2 years 6 months",
          responsibilities: [
            "Supported 30+ proposal submissions for VA and HHS contracts",
            "Conducted compliance reviews and section L/M matrices",
            "Coordinated with subcontractors for past performance narratives",
          ],
          achievements: [],
          domain: "GOVCON",
        },
      ],

      education: [
        {
          institution: "University of Maryland",
          degree: "Bachelor of Arts",
          field: "English",
          graduationDate: "2015",
          gpa: "3.8",
          honors: ["Magna Cum Laude"],
        },
      ],

      skills: {
        technical: [
          "Proposal Writing",
          "Technical Writing",
          "Compliance Analysis",
          "RFP Analysis",
        ],
        soft: [
          "Project Management",
          "Team Leadership",
          "Stakeholder Communication",
        ],
        languages: ["English"],
        tools: [
          "SharePoint",
          "Adobe Creative Suite",
          "Microsoft Office",
          "Smartsheet",
        ],
        frameworks: ["Shipley Best Practices"],
        certifications: ["APMP Foundation", "Shipley Certified"],
      },

      links: {
        linkedin: "linkedin.com/in/johndoe",
      },

      domains: [
        "Government Contracting",
        "Federal Proposal Development",
        "DoD",
        "Veterans Affairs",
      ],

      metrics: {
        totalYearsExperience: 9.5,
        yearsInCurrentRole: 7,
        numberOfCompanies: 2,
        numberOfProjects: 50,
      },

      govconExperience: {
        hasGovconExperience: true,
        yearsOfGovconExperience: 9.5,
        federalAgenciesWorkedWith: ["DoD", "VA", "HHS"],
        sledExperience: false,
        proposalTypes: ["RFP", "RFQ"],
        contractWins: 15,
        winRate: 70,
      },

      clearancesAndCerts: {
        securityClearance: "Secret",
        clearanceStatus: "Active",
        professionalCertifications: ["APMP Foundation", "Shipley Certified"],
        licenses: [],
      },

      availability: {
        isAvailable: true,
        preferredWorkType: "Remote",
        hoursPerWeek: 40,
      },

      metadata: {
        resumeFormat: resumeFormat,
        resumeLength: resumeLength,
        parsingConfidence: 92,
        parsingTimestamp: new Date().toISOString(),
        aiModel: "gpt-4-turbo",
      },
    };

    // Enhance with calculated fields
    parsedData.metrics.totalYearsExperience = calculateTotalExperience(
      parsedData.workExperience
    );

    const govconData = detectGovconExperience(
      resumeText,
      parsedData.workExperience
    );
    parsedData.govconExperience = {
      ...parsedData.govconExperience,
      ...govconData,
    };

    console.log(
      `[AI Parser] Parsing complete - Confidence: ${parsedData.metadata.parsingConfidence}%`
    );

    return {
      success: true,
      data: parsedData,
      confidence: parsedData.metadata.parsingConfidence,
      warnings: [],
    };
  } catch (error) {
    console.error("AI parsing error:", error);
    return {
      success: false,
      errors: [
        error instanceof Error ? error.message : "Unknown parsing error",
      ],
      confidence: 0,
    };
  }
}

/**
 * Main resume parser function - orchestrates extraction and AI parsing
 */
export async function parseResume(
  resumeFilePath: string,
  resumeFormat: string
): Promise<ResumeParsingResult> {
  console.log(`[Resume Parser] Processing: ${resumeFilePath}`);

  try {
    // Step 1: Extract text from resume
    const resumeText = await extractResumeText(resumeFilePath, resumeFormat);

    if (!resumeText || resumeText.trim().length < 100) {
      return {
        success: false,
        errors: ["Resume text is too short or empty"],
        confidence: 0,
      };
    }

    // Step 2: Estimate resume length (rough approximation)
    const estimatedPages = Math.ceil(resumeText.length / 3000);

    // Step 3: Parse with AI
    const result = await parseResumeWithAI(
      resumeText,
      resumeFormat,
      estimatedPages
    );

    if (!result.success) {
      return result;
    }

    // Step 4: Validate required fields
    const requiredFields = [
      "personalInfo.firstName",
      "personalInfo.lastName",
      "personalInfo.email",
    ];

    const missingFields: string[] = [];
    for (const field of requiredFields) {
      const parts = field.split(".");
      let value: any = result.data;
      for (const part of parts) {
        value = value?.[part];
      }
      if (!value) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        errors: [`Missing required fields: ${missingFields.join(", ")}`],
        confidence: result.confidence,
      };
    }

    return result;
  } catch (error) {
    console.error("Resume parsing error:", error);
    return {
      success: false,
      errors: [
        error instanceof Error ? error.message : "Unknown parsing error",
      ],
      confidence: 0,
    };
  }
}

/**
 * Batch parse multiple resumes (for backfill or bulk processing)
 */
export async function parseResumeBatch(
  resumes: Array<{ filePath: string; format: string; applicationId: string }>
): Promise<
  Array<{ applicationId: string; result: ResumeParsingResult }>
> {
  console.log(`[Batch Parser] Processing ${resumes.length} resumes`);

  const results = await Promise.all(
    resumes.map(async ({ filePath, format, applicationId }) => {
      const result = await parseResume(filePath, format);
      return { applicationId, result };
    })
  );

  const successful = results.filter((r) => r.result.success).length;
  console.log(
    `[Batch Parser] Completed: ${successful}/${resumes.length} successful`
  );

  return results;
}
