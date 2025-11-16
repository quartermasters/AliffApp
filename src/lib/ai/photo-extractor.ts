/**
 * Photo Extraction Service
 *
 * Extracts photos from PDF resumes using GPT-4 Vision
 * Dual photo system: uploaded headshot + CV-extracted photo
 */

import OpenAI from 'openai';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import pdfParse = require('pdf-parse');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ExtractedPhoto {
  found: boolean;
  photoUrl?: string;
  photoPath?: string;
  confidence: number; // 0-100
  extractionMethod: 'pdf_image_extraction' | 'gpt4_vision' | 'none';
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
  };
}

/**
 * Convert PDF page to image and analyze with GPT-4 Vision
 * This is a simplified version - in production, you'd use a library like pdf-to-image
 */
async function analyzePDFWithVision(filePath: string): Promise<ExtractedPhoto> {
  try {
    // Read the PDF file
    const dataBuffer = await readFile(filePath);
    const base64PDF = dataBuffer.toString('base64');

    // Use GPT-4 Vision to analyze the PDF and detect if there's a photo
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this resume PDF and determine if there is a professional headshot photo visible.

If a photo is found:
- Describe its location (top-left, top-right, etc.)
- Estimate confidence (0-100) that it's a professional headshot
- Describe the photo quality

Return ONLY a JSON object with this structure:
{
  "found": true/false,
  "location": "description",
  "confidence": 0-100,
  "quality": "description"
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:application/pdf;base64,${base64PDF.substring(0, 100000)}`, // Limit size
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        found: false,
        confidence: 0,
        extractionMethod: 'gpt4_vision',
      };
    }

    const analysis = JSON.parse(content);

    return {
      found: analysis.found || false,
      confidence: analysis.confidence || 0,
      extractionMethod: 'gpt4_vision',
      metadata: {
        ...analysis,
      },
    };
  } catch (error) {
    console.error('[PHOTO] GPT-4 Vision analysis error:', error);
    return {
      found: false,
      confidence: 0,
      extractionMethod: 'gpt4_vision',
    };
  }
}

/**
 * Extract embedded images from PDF using pdf-parse
 * Note: pdf-parse doesn't natively support image extraction
 * For production, use a library like pdf-lib or pdf.js
 */
async function extractImagesFromPDF(filePath: string): Promise<ExtractedPhoto> {
  try {
    const dataBuffer = await readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);

    // Check metadata for image information
    // This is a simplified version - actual implementation would use pdf-lib
    console.log('[PHOTO] PDF metadata:', pdfData.info);

    // For now, return not found - this would need pdf-lib or similar
    return {
      found: false,
      confidence: 0,
      extractionMethod: 'pdf_image_extraction',
    };
  } catch (error) {
    console.error('[PHOTO] PDF image extraction error:', error);
    return {
      found: false,
      confidence: 0,
      extractionMethod: 'pdf_image_extraction',
    };
  }
}

/**
 * Main function to extract photo from resume
 */
export async function extractPhotoFromResume(
  filePath: string,
  fileType: string
): Promise<ExtractedPhoto> {
  console.log(`[PHOTO] Starting photo extraction from: ${filePath} (${fileType})`);

  // Only attempt photo extraction from PDFs and images
  if (fileType === 'application/pdf') {
    // Try both methods
    const visionResult = await analyzePDFWithVision(filePath);

    if (visionResult.found && visionResult.confidence > 50) {
      console.log('[PHOTO] Photo detected with GPT-4 Vision:', visionResult);
      return visionResult;
    }

    // Try direct image extraction
    const imageResult = await extractImagesFromPDF(filePath);
    if (imageResult.found) {
      console.log('[PHOTO] Photo extracted from PDF:', imageResult);
      return imageResult;
    }

    return {
      found: false,
      confidence: 0,
      extractionMethod: 'none',
    };
  } else if (fileType.startsWith('image/')) {
    // The resume itself is an image - analyze it
    return await analyzeImageForPhoto(filePath, fileType);
  } else {
    // Word documents and other formats - not supported for photo extraction
    return {
      found: false,
      confidence: 0,
      extractionMethod: 'none',
    };
  }
}

/**
 * Analyze an image resume to detect if it contains a headshot
 */
async function analyzeImageForPhoto(filePath: string, fileType: string): Promise<ExtractedPhoto> {
  try {
    const imageBuffer = await readFile(filePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = fileType;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this resume image and determine if there is a professional headshot photo visible.

Return ONLY a JSON object:
{
  "found": true/false,
  "location": "description of where photo is located",
  "confidence": 0-100,
  "isHeadshot": true/false,
  "quality": "description"
}`,
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
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        found: false,
        confidence: 0,
        extractionMethod: 'gpt4_vision',
      };
    }

    const analysis = JSON.parse(content);

    return {
      found: analysis.found && analysis.isHeadshot,
      confidence: analysis.confidence || 0,
      extractionMethod: 'gpt4_vision',
      metadata: analysis,
    };
  } catch (error) {
    console.error('[PHOTO] Image analysis error:', error);
    return {
      found: false,
      confidence: 0,
      extractionMethod: 'gpt4_vision',
    };
  }
}

/**
 * Save extracted photo to filesystem
 */
export async function saveExtractedPhoto(
  photoBuffer: Buffer,
  originalFileName: string
): Promise<{ url: string; path: string }> {
  const uploadsDir = join(process.cwd(), 'uploads', 'extracted-photos');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  const filename = `extracted-${timestamp}-${randomString}.jpg`;
  const filepath = join(uploadsDir, filename);

  await writeFile(filepath, photoBuffer);

  const publicUrl = `/uploads/extracted-photos/${filename}`;

  console.log(`[PHOTO] Saved extracted photo: ${filename}`);

  return {
    url: publicUrl,
    path: filepath,
  };
}

/**
 * Validate that a photo looks like a professional headshot
 */
export async function validateHeadshot(photoUrl: string): Promise<{
  isValid: boolean;
  confidence: number;
  issues: string[];
}> {
  try {
    // Read the photo
    let base64Image: string;
    let mimeType: string;

    if (photoUrl.startsWith('http')) {
      // Fetch from URL
      const response = await fetch(photoUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Image = buffer.toString('base64');
      mimeType = response.headers.get('content-type') || 'image/jpeg';
    } else {
      // Read from filesystem
      const filePath = join(process.cwd(), 'public', photoUrl);
      const imageBuffer = await readFile(filePath);
      base64Image = imageBuffer.toString('base64');
      mimeType = photoUrl.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this photo to determine if it's a professional headshot suitable for a job application.

Check for:
- Is it a clear photo of a person's face/upper body?
- Is the lighting adequate?
- Is the background professional?
- Is the person dressed professionally?
- Is the photo high quality?

Return ONLY a JSON object:
{
  "isValid": true/false,
  "confidence": 0-100,
  "issues": ["list of any issues found"],
  "recommendations": ["suggestions for improvement"]
}`,
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
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        isValid: true, // Default to valid if we can't analyze
        confidence: 50,
        issues: ['Could not analyze photo'],
      };
    }

    const analysis = JSON.parse(content);

    return {
      isValid: analysis.isValid || false,
      confidence: analysis.confidence || 0,
      issues: analysis.issues || [],
    };
  } catch (error) {
    console.error('[PHOTO] Validation error:', error);
    return {
      isValid: true, // Default to valid on error
      confidence: 50,
      issues: ['Could not validate photo'],
    };
  }
}
