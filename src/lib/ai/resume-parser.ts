/**
 * AI Resume Parser Service
 *
 * Uses GPT-4 to extract 50+ structured fields from resumes including:
 * - Personal information
 * - Work experience
 * - Education
 * - Skills
 * - Certifications
 * - Languages
 * - Projects
 * - And more...
 */

import OpenAI from 'openai';
import { readFile } from 'fs/promises';

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
 * Extract text from PDF resume (from file path)
 */
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = await readFile(filePath);
    // Dynamic import for CommonJS module compatibility
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  } catch (error) {
    console.error('[PARSER] PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from PDF resume (from buffer)
 */
async function extractTextFromPDFBuffer(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for CommonJS module compatibility
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  } catch (error) {
    console.error('[PARSER] PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from image resume using GPT-4 Vision (from file path)
 */
async function extractTextFromImage(filePath: string): Promise<string> {
  try {
    const imageBuffer = await readFile(filePath);
    return extractTextFromImageBuffer(imageBuffer, filePath);
  } catch (error) {
    console.error('[PARSER] Image extraction error:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Extract text from image resume using GPT-4 Vision (from buffer)
 */
async function extractTextFromImageBuffer(buffer: Buffer, fileName: string = ''): Promise<string> {
  try {
    const base64Image = buffer.toString('base64');
    const mimeType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all text from this resume image. Return only the raw text content, preserving the structure and formatting as much as possible.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('[PARSER] Image extraction error:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Extract text from Word document resume (from file path)
 */
async function extractTextFromWord(filePath: string): Promise<string> {
  try {
    // Dynamic import for CommonJS module compatibility
    const mammoth = (await import('mammoth')).default;
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('[PARSER] Word document extraction error:', error);
    throw new Error('Failed to extract text from Word document');
  }
}

/**
 * Extract text from Word document resume (from buffer)
 */
async function extractTextFromWordBuffer(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import for CommonJS module compatibility
    const mammoth = (await import('mammoth')).default;
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('[PARSER] Word document extraction error:', error);
    throw new Error('Failed to extract text from Word document');
  }
}

/**
 * Parse resume text using GPT-4 to extract structured data
 */
async function parseResumeWithGPT4(resumeText: string): Promise<ParsedResumeData> {
  const systemPrompt = `You are an expert resume parser. Extract structured information from resumes with high accuracy.

Your task is to analyze the resume text and extract ALL available information into a structured JSON format.

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

  const userPrompt = `Parse this resume and extract all information into structured JSON:

${resumeText}

Return the data in this exact JSON structure:
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
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1, // Low temperature for consistent extraction
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from GPT-4');
    }

    const parsedData = JSON.parse(content) as ParsedResumeData;

    console.log('[PARSER] Successfully parsed resume:', {
      name: `${parsedData.firstName} ${parsedData.lastName}`,
      email: parsedData.email,
      experience: parsedData.totalYearsExperience,
      confidence: parsedData.parsingConfidence,
    });

    return parsedData;
  } catch (error) {
    console.error('[PARSER] GPT-4 parsing error:', error);
    throw new Error('Failed to parse resume with AI');
  }
}

/**
 * Main function to parse a resume file (from file path)
 */
export async function parseResume(filePath: string, fileType: string): Promise<ParsedResumeData> {
  console.log(`[PARSER] Starting resume parsing: ${filePath} (${fileType})`);

  let resumeText: string;

  // Extract text based on file type
  if (fileType === 'application/pdf') {
    resumeText = await extractTextFromPDF(filePath);
  } else if (fileType.startsWith('image/')) {
    resumeText = await extractTextFromImage(filePath);
  } else if (fileType.includes('word') || fileType.includes('document')) {
    resumeText = await extractTextFromWord(filePath);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Could not extract sufficient text from resume');
  }

  console.log(`[PARSER] Extracted ${resumeText.length} characters from resume`);

  // Parse the extracted text with GPT-4
  const parsedData = await parseResumeWithGPT4(resumeText);

  return parsedData;
}

/**
 * Parse a resume from a buffer (for serverless environments)
 */
export async function parseResumeFromBuffer(buffer: Buffer, fileType: string): Promise<ParsedResumeData> {
  console.log(`[PARSER] Starting resume parsing from buffer (${fileType})`);

  let resumeText: string;

  // Extract text based on file type
  if (fileType === 'application/pdf') {
    resumeText = await extractTextFromPDFBuffer(buffer);
  } else if (fileType.startsWith('image/')) {
    resumeText = await extractTextFromImageBuffer(buffer);
  } else if (fileType.includes('word') || fileType.includes('document')) {
    resumeText = await extractTextFromWordBuffer(buffer);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Could not extract sufficient text from resume');
  }

  console.log(`[PARSER] Extracted ${resumeText.length} characters from resume`);

  // Parse the extracted text with GPT-4
  const parsedData = await parseResumeWithGPT4(resumeText);

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
