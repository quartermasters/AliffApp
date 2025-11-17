/**
 * AI Resume Parser Service - GPT-4 Vision for Images Only
 *
 * Uses GPT-4 Vision to extract and parse image-based resumes:
 * - PNG, JPG, JPEG, GIF, WebP
 *
 * Note: PDFs and Word docs are NOT supported by GPT-4o Vision API.
 * Users must upload resumes as images.
 *
 * No external parsing libraries needed - 100% serverless compatible!
 */

import OpenAI from 'openai';

// Lazy initialization to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
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

export interface ParsedResumeData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;

  // Professional Summary
  summary?: string;
  objective?: string;
  headline?: string;

  // Work Experience
  workExperience: Array<{
    jobTitle: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    achievements?: string[];
    technologies?: string[];
  }>;

  // Education
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    location?: string;
    graduationDate?: string;
    gpa?: number;
    honors?: string[];
  }>;

  // Skills
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    tools: string[];
    frameworks: string[];
  };

  // Certifications
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
  }>;

  // Languages
  spokenLanguages: Array<{
    language: string;
    proficiency: string;
  }>;

  // Projects
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate?: string;
    endDate?: string;
  }>;

  // Additional Information
  volunteering?: Array<{
    role: string;
    organization: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;

  awards?: Array<{
    title: string;
    issuer: string;
    date?: string;
    description?: string;
  }>;

  publications?: Array<{
    title: string;
    publisher: string;
    date?: string;
    url?: string;
  }>;

  // Calculated Fields
  totalYearsExperience?: number;
  currentJobTitle?: string;
  currentCompany?: string;
  currentSalary?: number;
  expectedSalary?: number;

  // Metadata
  parsingConfidence: number; // 0-100
  missingFields: string[];
  extractedAt: string;
}

/**
 * Parse resume using GPT-4 Vision - images only!
 * No external libraries needed - pure serverless solution.
 */
async function parseResumeWithGPT4Vision(
  buffer: Buffer,
  fileType: string,
  fileName: string
): Promise<ParsedResumeData> {
  const openai = getOpenAIClient();

  // Use the provided MIME type (already validated to be image)
  const mimeType = fileType;
  const base64Data = buffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  console.log(`[PARSER-V2] Parsing ${fileName} (${mimeType}) with GPT-4o Vision`);

  const systemPrompt = `You are an expert resume parser. Extract structured information from resumes with high accuracy.

Your task is to analyze the resume and extract ALL available information into a structured JSON format.

IMPORTANT RULES:
1. Extract data EXACTLY as it appears - do not infer or make assumptions
2. If a field is not present, use null or empty array
3. For dates, use ISO format (YYYY-MM-DD) when possible, or the exact format from the resume
4. Calculate total years of experience based on work history
5. Identify technical skills, soft skills, tools, and frameworks separately
6. Extract ALL contact information including email, phone, LinkedIn, GitHub, portfolio
7. Parse work experience with detailed achievements and technologies used
8. Return a confidence score (0-100) based on data completeness and clarity
9. List any standard fields that are missing from the resume

Return ONLY valid JSON matching the ParsedResumeData interface structure.`;

  const userPrompt = `Extract all information from this resume and return it in this exact JSON structure:

{
  "firstName": "",
  "lastName": "",
  "email": "",
  "phone": "",
  "location": { "city": "", "state": "", "country": "", "zipCode": "" },
  "linkedinUrl": "",
  "githubUrl": "",
  "portfolioUrl": "",
  "websiteUrl": "",
  "summary": "",
  "objective": "",
  "headline": "",
  "workExperience": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "description": "",
      "achievements": [],
      "technologies": []
    }
  ],
  "education": [
    {
      "degree": "",
      "field": "",
      "institution": "",
      "location": "",
      "graduationDate": "",
      "gpa": 0,
      "honors": []
    }
  ],
  "skills": {
    "technical": [],
    "soft": [],
    "languages": [],
    "tools": [],
    "frameworks": []
  },
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "issueDate": "",
      "expiryDate": "",
      "credentialId": ""
    }
  ],
  "spokenLanguages": [
    {
      "language": "",
      "proficiency": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "url": "",
      "startDate": "",
      "endDate": ""
    }
  ],
  "volunteering": [],
  "awards": [],
  "publications": [],
  "totalYearsExperience": 0,
  "currentJobTitle": "",
  "currentCompany": "",
  "currentSalary": null,
  "expectedSalary": null,
  "parsingConfidence": 0,
  "missingFields": [],
  "extractedAt": "${new Date().toISOString()}"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Latest model with vision capabilities
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl,
                detail: 'high', // High detail for better text extraction
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from GPT-4 Vision');
    }

    const parsedData = JSON.parse(content) as ParsedResumeData;

    console.log('[PARSER-V2] Successfully parsed resume:', {
      name: `${parsedData.firstName} ${parsedData.lastName}`,
      email: parsedData.email,
      experience: parsedData.totalYearsExperience,
      confidence: parsedData.parsingConfidence,
    });

    return parsedData;
  } catch (error) {
    console.error('[PARSER-V2] GPT-4 Vision parsing error:', error);
    throw new Error('Failed to parse resume with AI');
  }
}

/**
 * Main export: Parse resume from buffer using GPT-4 Vision
 * NOTE: Only supports image formats. PDFs not supported due to GPT-4o Vision limitations.
 */
export async function parseResumeFromBuffer(
  buffer: Buffer,
  fileType: string,
  fileName: string = 'resume'
): Promise<ParsedResumeData> {
  console.log(`[PARSER-V2] Starting resume parsing from buffer (${fileType})`);

  // GPT-4o Vision only supports image formats
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  // Provide helpful error for unsupported types
  if (fileType === 'application/pdf') {
    throw new Error(
      'PDF files are not currently supported. Please convert your resume to JPG or PNG format and try again. ' +
      'You can take a screenshot of your PDF or use an online converter.'
    );
  }

  if (fileType.includes('word') || fileType.includes('document')) {
    throw new Error(
      'Word documents are not currently supported. Please convert your resume to JPG or PNG format and try again. ' +
      'You can take a screenshot or export as image.'
    );
  }

  if (!allowedTypes.includes(fileType)) {
    throw new Error(
      `Unsupported file type: ${fileType}. Please upload your resume as JPG or PNG image.`
    );
  }

  // Validate buffer
  if (!buffer || buffer.length < 100) {
    throw new Error('Invalid or empty file buffer');
  }

  console.log(`[PARSER-V2] Buffer size: ${buffer.length} bytes`);

  // Parse with GPT-4 Vision (only images!)
  const parsedData = await parseResumeWithGPT4Vision(buffer, fileType, fileName);

  return parsedData;
}

/**
 * Validate parsed resume data
 */
export function validateParsedData(data: ParsedResumeData): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push('First name is required');
  }
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }
  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }

  // Warnings for missing optional but important fields
  if (!data.phone) {
    warnings.push('Phone number not found');
  }
  if (!data.workExperience || data.workExperience.length === 0) {
    warnings.push('No work experience found');
  }
  if (!data.education || data.education.length === 0) {
    warnings.push('No education found');
  }
  if (!data.skills || (!data.skills.technical?.length && !data.skills.soft?.length)) {
    warnings.push('No skills found');
  }

  // Low confidence warning
  if (data.parsingConfidence < 70) {
    warnings.push(`Low parsing confidence: ${data.parsingConfidence}%`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
