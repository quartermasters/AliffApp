/**
 * Photo Extraction API Endpoint
 *
 * Extracts photos from resume PDFs/images using GPT-4 Vision
 * Part of the dual photo system (uploaded + CV-extracted)
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractPhotoFromResume, validateHeadshot } from '@/lib/ai/photo-extractor';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filePath, fileType, validateQuality = true } = body;

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    if (!fileType) {
      return NextResponse.json(
        { error: 'File type is required' },
        { status: 400 }
      );
    }

    console.log(`[API] Starting photo extraction from: ${filePath}`);

    // Extract photo from resume
    const extractionResult = await extractPhotoFromResume(filePath, fileType);

    if (!extractionResult.found) {
      return NextResponse.json({
        success: true,
        photoFound: false,
        message: 'No photo detected in resume',
        extractionMethod: extractionResult.extractionMethod,
      });
    }

    // Optionally validate photo quality
    let validation = null;
    if (validateQuality && extractionResult.photoUrl) {
      validation = await validateHeadshot(extractionResult.photoUrl);
    }

    console.log(`[API] Photo extraction completed:`, {
      found: extractionResult.found,
      confidence: extractionResult.confidence,
      method: extractionResult.extractionMethod,
    });

    return NextResponse.json({
      success: true,
      photoFound: true,
      photo: {
        url: extractionResult.photoUrl,
        path: extractionResult.photoPath,
        confidence: extractionResult.confidence,
        extractionMethod: extractionResult.extractionMethod,
        metadata: extractionResult.metadata,
      },
      validation,
      message: 'Photo extracted successfully',
    });
  } catch (error) {
    console.error('[API] Photo extraction error:', error);

    return NextResponse.json(
      {
        error: 'Failed to extract photo from resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
