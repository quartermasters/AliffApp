// ALIFF-RECRUITER Resume Parser Types
// Comprehensive data structure for 50+ extracted fields

export interface ParsedResume {
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    city?: string;
    state?: string;
    country?: string;
    timezone?: string;
  };

  // Professional Summary
  summary?: {
    professionalSummary?: string;
    objective?: string;
    headline?: string;
  };

  // Work Experience
  workExperience: WorkExperience[];

  // Education
  education: Education[];

  // Skills
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    tools: string[];
    frameworks: string[];
    certifications: string[];
  };

  // Professional Links
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    website?: string;
    twitter?: string;
  };

  // Domain Expertise (for matching)
  domains: string[]; // e.g., ["GOVCON", "Healthcare", "Cybersecurity"]

  // Experience Metrics
  metrics: {
    totalYearsExperience: number;
    yearsInCurrentRole?: number;
    numberOfCompanies: number;
    numberOfProjects?: number;
  };

  // Government Contracting Specific
  govconExperience?: {
    hasGovconExperience: boolean;
    yearsOfGovconExperience?: number;
    federalAgenciesWorkedWith: string[];
    sledExperience: boolean;
    proposalTypes: string[]; // ["RFP", "RFQ", "IFB"]
    contractWins?: number;
    winRate?: number;
  };

  // Clearances & Certifications
  clearancesAndCerts?: {
    securityClearance?: string; // "Secret", "Top Secret", etc.
    clearanceStatus?: string; // "Active", "Inactive"
    professionalCertifications: string[];
    licenses: string[];
  };

  // Availability & Preferences
  availability?: {
    isAvailable: boolean;
    availabilityDate?: string;
    preferredWorkType?: string; // "Remote", "Hybrid", "On-site"
    hoursPerWeek?: number;
    willingToRelocate?: boolean;
  };

  // Salary & Compensation
  compensation?: {
    currentSalary?: string;
    expectedSalary?: string;
    hourlyRate?: string;
  };

  // Metadata
  metadata: {
    resumeFormat: string; // "PDF", "DOCX"
    resumeLength: number; // pages
    lastUpdated?: string;
    parsingConfidence: number; // 0-100
    parsingTimestamp: string;
    aiModel: string; // "gpt-4-turbo"
  };
}

export interface WorkExperience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string; // null if current
  isCurrent: boolean;
  duration?: string; // "2 years 3 months"
  description?: string;
  responsibilities: string[];
  achievements: string[];
  technologies?: string[];
  domain?: string; // "GOVCON", "IT", "Healthcare", etc.
}

export interface Education {
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  graduationDate?: string;
  gpa?: string;
  honors?: string[];
}

export interface ResumeParsingResult {
  success: boolean;
  data?: ParsedResume;
  errors?: string[];
  warnings?: string[];
  confidence: number; // Overall parsing confidence 0-100
}

// Field extraction prompts for AI
export const RESUME_PARSING_PROMPT = `You are an expert resume parser for ALIFF-RECRUITER, an AI hiring system.

Analyze the provided resume text and extract ALL available information into a structured JSON format.

CRITICAL INSTRUCTIONS:
1. Extract every piece of information available, even if uncertain
2. For missing fields, use null (not empty strings)
3. Parse dates into consistent format: "YYYY-MM" or "YYYY-MM-DD"
4. Identify GOVCON (government contracting) experience indicators:
   - Federal agency names (VA, DoD, DHS, GSA, etc.)
   - Proposal writing keywords (RFP, RFQ, Past Performance, Section L/M)
   - Compliance keywords (FAR, DFARS, CMMC, FedRAMP)
   - State/local government experience (SLED)
5. Calculate total years of experience accurately
6. Extract ALL skills mentioned (technical, soft, tools, frameworks)
7. Identify domain expertise (Healthcare, Cybersecurity, IT, etc.)
8. Assign a parsing confidence score (0-100) based on completeness

Return ONLY valid JSON matching the ParsedResume schema. No additional text.`;

// Skills categorization helpers
export const TECHNICAL_SKILLS_KEYWORDS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Git",
  "SQL",
  "NoSQL",
  "GraphQL",
  "REST API",
  "Microservices",
];

export const GOVCON_KEYWORDS = [
  "RFP",
  "RFQ",
  "IFB",
  "federal proposal",
  "government contracting",
  "FAR",
  "DFARS",
  "past performance",
  "capability statement",
  "Section L",
  "Section M",
  "compliance matrix",
  "Shipley",
  "CMMC",
  "FedRAMP",
  "NIST",
  "GSA Schedule",
  "8(a)",
  "SDVOSB",
  "WOSB",
  "HUBZone",
];

export const SLED_KEYWORDS = [
  "SLED",
  "state government",
  "local government",
  "education",
  "K-12",
  "higher education",
  "municipal",
  "county",
  "state procurement",
  "cooperative purchasing",
];

export const WRITING_KEYWORDS = [
  "content writing",
  "copywriting",
  "technical writing",
  "proposal writing",
  "grant writing",
  "white paper",
  "case study",
  "blog",
  "SEO",
  "editing",
  "proofreading",
];
