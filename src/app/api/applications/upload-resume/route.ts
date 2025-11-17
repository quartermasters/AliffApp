/**
 * Resume Upload API Endpoint
 *
 * Handles resume file uploads with:
 * - File validation (type, size)
 * - Storage to filesystem
 * - AI text extraction
 * - Return signed URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Route segment config for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  console.log('[UPLOAD-RESUME] POST request received');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('[UPLOAD-RESUME] File details:', {
      hasFile: !!file,
      name: file?.name,
      size: file?.size,
      type: file?.type
    });

    if (!file) {
      console.error('[UPLOAD-RESUME] No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Please upload PDF, Word, or image files.',
          allowedTypes: ALLOWED_TYPES,
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
          maxSize: MAX_FILE_SIZE,
        },
        { status: 400 }
      );
    }

    // Create uploads directory (use /tmp on Vercel)
    const uploadsDir = join('/tmp', 'uploads', 'resumes');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = file.name.split('.').pop();
    const sanitizedOriginalName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50);
    const filename = `${timestamp}-${randomString}-${sanitizedOriginalName}`;
    const filepath = join(uploadsDir, filename);

    // Save file to filesystem
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Generate public URL (relative path)
    const publicUrl = `/uploads/resumes/${filename}`;

    // Convert to base64 for serverless parsing
    const base64Content = buffer.toString('base64');

    console.log(`[UPLOAD] Resume uploaded: ${filename} (${file.size} bytes)`);

    return NextResponse.json({
      success: true,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: publicUrl,
      path: filepath,
      content: base64Content, // Add base64 content for serverless parsing
      message: 'Resume uploaded successfully',
    });
  } catch (error) {
    console.error('[UPLOAD] Resume upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
