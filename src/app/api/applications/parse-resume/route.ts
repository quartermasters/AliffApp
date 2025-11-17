/**
 * Resume Parsing API Endpoint
 *
 * Accepts a resume file content (base64) and uses GPT-4 to extract structured data
 * Returns parsed data for auto-filling application forms
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseResumeFromBuffer, validateParsedData } from '@/lib/ai/resume-parser-hybrid';

// Route segment config for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  console.log('[PARSE-RESUME] v2 - POST request received');

  try {
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('[PARSE-RESUME] JSON parse error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', details: String(jsonError) },
        { status: 400 }
      );
    }

    const { fileContent, fileType, fileName } = body;

    console.log('[PARSE-RESUME] Request params:', {
      hasFileContent: !!fileContent,
      fileType,
      fileName,
      contentLength: fileContent?.length
    });

    // Validate required fields
    if (!fileContent) {
      console.error('[PARSE-RESUME] Missing fileContent');
      return NextResponse.json(
        { error: 'File content is required' },
        { status: 400 }
      );
    }

    if (!fileType) {
      console.error('[PARSE-RESUME] Missing fileType');
      return NextResponse.json(
        { error: 'File type is required' },
        { status: 400 }
      );
    }

    console.log(`[PARSE-RESUME] Starting resume parsing for: ${fileName || 'resume'}`);

    // Convert base64 to buffer with error handling
    let buffer: Buffer;
    try {
      buffer = Buffer.from(fileContent, 'base64');
      console.log(`[PARSE-RESUME] Buffer created, size: ${buffer.length} bytes`);
    } catch (bufferError) {
      console.error('[PARSE-RESUME] Buffer conversion error:', bufferError);
      return NextResponse.json(
        { error: 'Invalid file content encoding', details: String(bufferError) },
        { status: 400 }
      );
    }

    // Validate buffer size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (buffer.length > MAX_SIZE) {
      console.error(`[PARSE-RESUME] File too large: ${buffer.length} bytes`);
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Parse the resume using hybrid approach (text extraction + GPT-4o)
    console.log('[PARSE-RESUME] Calling parseResumeFromBuffer with hybrid parser...');
    const parsedData = await parseResumeFromBuffer(buffer, fileType, fileName || 'resume');
    console.log('[PARSE-RESUME] Resume parsed successfully with hybrid parser');

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

    console.log('[PARSE-RESUME] Validation completed:', {
      isValid: validation.isValid,
      errorsCount: validation.errors.length,
      warningsCount: validation.warnings.length
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
    console.error('[PARSE-RESUME] Resume parsing error:', error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error('[PARSE-RESUME] Error name:', error.name);
      console.error('[PARSE-RESUME] Error message:', error.message);
      console.error('[PARSE-RESUME] Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: 'Failed to parse resume',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
