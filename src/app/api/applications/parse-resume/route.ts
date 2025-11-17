/**
 * Resume Parsing API Endpoint
 *
 * Accepts a resume file path and uses GPT-4 to extract structured data
 * Returns parsed data for auto-filling application forms
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseResumeFromBuffer, validateParsedData } from '@/lib/ai/resume-parser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileContent, fileType, fileName } = body;

    if (!fileContent) {
      return NextResponse.json(
        { error: 'File content is required' },
        { status: 400 }
      );
    }

    if (!fileType) {
      return NextResponse.json(
        { error: 'File type is required' },
        { status: 400 }
      );
    }

    console.log(`[API] Starting resume parsing for: ${fileName || 'resume'}`);

    // Convert base64 to buffer
    const buffer = Buffer.from(fileContent, 'base64');

    // Parse the resume using AI
    const parsedData = await parseResumeFromBuffer(buffer, fileType);

    // Validate the parsed data
    const validation = validateParsedData(parsedData);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Resume parsing failed validation',
          validationErrors: validation.errors,
          warnings: validation.warnings,
        },
        { status: 422 }
      );
    }

    console.log(`[API] Resume parsed successfully:`, {
      name: `${parsedData.firstName} ${parsedData.lastName}`,
      email: parsedData.email,
      confidence: parsedData.parsingConfidence,
      warnings: validation.warnings.length,
    });

    // Return parsed data with validation results
    return NextResponse.json({
      success: true,
      data: parsedData,
      validation: {
        errors: validation.errors,
        warnings: validation.warnings,
      },
      message: 'Resume parsed successfully',
    });
  } catch (error) {
    console.error('[API] Resume parsing error:', error);

    return NextResponse.json(
      {
        error: 'Failed to parse resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
