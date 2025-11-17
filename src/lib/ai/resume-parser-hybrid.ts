/**
 * Hybrid Resume Parser
 *
 * Strategy:
 * 1. PDFs: Extract text with pdfjs-dist, parse with GPT-4o
 * 2. Images: Use GPT-4o vision directly
 * 3. Word docs: Extract text with mammoth, parse with GPT-4o
 */

import OpenAI from 'openai';

// Lazy initialization
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
  parsingConfidence: number;
  missingFields: string[];
  extractedAt: string;
}

/**
 * Extract text from PDF using pdfjs-dist (ESM-compatible)
 * Falls back to GPT-4o Vision if pdfjs-dist fails (e.g., in serverless environments)
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('[PARSER] Attempting PDF text extraction with pdfjs-dist...');

    // Dynamic import for ESM module
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    // Load PDF from buffer
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    console.log(`[PARSER] Successfully extracted ${fullText.length} characters from PDF with pdfjs-dist`);
    return fullText;
  } catch (error) {
    console.error('[PARSER] pdfjs-dist PDF extraction failed:', error);
    console.error('[PARSER] This likely indicates missing dependencies in serverless environment');
    console.error('[PARSER] Suggested fixes:');
    console.error('[PARSER]   1. Verify OPENAI_API_KEY environment variable is set');
    console.error('[PARSER]   2. Try uploading resume as an image (JPG/PNG) instead of PDF');
    console.error('[PARSER]   3. Check Vercel function logs for detailed error');

    // Provide detailed error message
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(
      `PDF text extraction failed in serverless environment. ${errorMessage}. ` +
      `Please try uploading your resume as an image (JPG/PNG) or contact support if the issue persists.`
    );
  }
}

/**
 * Extract text from Word document using mammoth
 */
async function extractTextFromWord(buffer: Buffer): Promise<string> {
  try {
    console.log('[PARSER] Extracting text from Word document...');
    const mammothModule = await import('mammoth');
    const mammoth = (mammothModule as any).default || mammothModule;
    const result = await mammoth.extractRawText({ buffer });
    console.log(`[PARSER] Extracted ${result.value.length} characters from Word doc`);
    return result.value;
  } catch (error) {
    console.error('[PARSER] Word extraction error:', error);
    throw new Error('Failed to extract text from Word document');
  }
}

/**
 * Extract text from image using GPT-4o vision
 */
async function extractTextFromImage(buffer: Buffer, fileType: string): Promise<string> {
  try {
    console.log('[PARSER] Extracting text from image with GPT-4o vision...');
    const openai = getOpenAIClient();
    const base64Image = buffer.toString('base64');
    const mimeType = fileType;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all text from this resume image. Return only the raw text content, preserving structure as much as possible.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
    });

    const extractedText = response.choices[0]?.message?.content || '';
    console.log(`[PARSER] Extracted ${extractedText.length} characters from image`);
    return extractedText;
  } catch (error) {
    console.error('[PARSER] Image extraction error:', error);
    throw new Error('Failed to extract text from image');
  }
}

/**
 * Parse resume text with GPT-4o
 */
async function parseResumeText(resumeText: string): Promise<ParsedResumeData> {
  const openai = getOpenAIClient();

  const systemPrompt = `You are an expert resume parser. Extract structured information from resumes with high accuracy.

Your task is to analyze the resume text and extract ALL available information into a structured JSON format.

IMPORTANT RULES:
1. Extract data EXACTLY as it appears - do not infer or make assumptions
2. If a field is not present, use null or empty array
3. For dates, use ISO format (YYYY-MM-DD) when possible
4. Calculate total years of experience based on work history
5. Identify technical skills, soft skills, tools, and frameworks separately
6. Extract ALL contact information
7. Parse work experience with detailed achievements and technologies
8. Return a confidence score (0-100) based on data completeness
9. List any missing standard fields

Return ONLY valid JSON.`;

  const userPrompt = `Parse this resume and extract all information into this exact JSON structure:

${resumeText}

JSON structure:
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
  "workExperience": [{
    "jobTitle": "",
    "company": "",
    "location": "",
    "startDate": "",
    "endDate": "",
    "current": false,
    "description": "",
    "achievements": [],
    "technologies": []
  }],
  "education": [{
    "degree": "",
    "field": "",
    "institution": "",
    "location": "",
    "graduationDate": "",
    "gpa": 0,
    "honors": []
  }],
  "skills": {
    "technical": [],
    "soft": [],
    "languages": [],
    "tools": [],
    "frameworks": []
  },
  "certifications": [],
  "spokenLanguages": [],
  "projects": [],
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
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from GPT-4o');
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
    console.error('[PARSER] GPT-4o parsing error:', error);
    throw new Error('Failed to parse resume with AI');
  }
}

/**
 * Main export: Parse resume from buffer
 */
export async function parseResumeFromBuffer(
  buffer: Buffer,
  fileType: string,
  fileName: string = 'resume'
): Promise<ParsedResumeData> {
  console.log(`[PARSER-HYBRID] Starting resume parsing: ${fileName} (${fileType})`);

  let resumeText: string;

  // Step 1: Extract text based on file type
  if (fileType === 'application/pdf') {
    resumeText = await extractTextFromPDF(buffer);
  } else if (fileType.startsWith('image/')) {
    resumeText = await extractTextFromImage(buffer, fileType);
  } else if (fileType.includes('word') || fileType.includes('document')) {
    resumeText = await extractTextFromWord(buffer);
  } else {
    throw new Error(`Unsupported file type: ${fileType}`);
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Could not extract sufficient text from resume');
  }

  // Step 2: Parse the extracted text with GPT-4o
  const parsedData = await parseResumeText(resumeText);

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

  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push('First name is required');
  }
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }
  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!data.phone) warnings.push('Phone number not found');
  if (!data.workExperience || data.workExperience.length === 0) warnings.push('No work experience found');
  if (!data.education || data.education.length === 0) warnings.push('No education found');
  if (!data.skills || (!data.skills.technical?.length && !data.skills.soft?.length)) warnings.push('No skills found');
  if (data.parsingConfidence < 70) warnings.push(`Low parsing confidence: ${data.parsingConfidence}%`);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
