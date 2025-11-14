/**
 * Deliverable Upload API Route
 *
 * Handles file uploads for deliverables
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { scoreDeliverableQuality } from '@/lib/services/quality-scoring-service';

/**
 * Trigger quality scoring in background
 */
async function triggerQualityScoring(deliverableId: string) {
  try {
    await scoreDeliverableQuality(deliverableId);
  } catch (error) {
    console.error('Quality scoring failed:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const assignmentId = formData.get('assignmentId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const deliverableType = (formData.get('deliverableType') as string) || 'OTHER';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!projectId || !assignmentId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify assignment exists and user is assigned
    const assignment = await prisma.projectAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        project: true,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    if (assignment.teamMemberId !== session.user.id) {
      return NextResponse.json(
        { error: 'You are not assigned to this project' },
        { status: 403 }
      );
    }

    // Create deliverables directory if it doesn't exist
    const deliverablesDir = join(
      process.cwd(),
      'uploads',
      'deliverables',
      projectId,
      assignmentId
    );
    if (!existsSync(deliverablesDir)) {
      await mkdir(deliverablesDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedFilename}`;
    const filepath = join(deliverablesDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create deliverable record
    const deliverable = await prisma.deliverable.create({
      data: {
        projectId,
        assignmentId,
        title,
        description: description || undefined,
        deliverableType: deliverableType as any,
        fileName: file.name,
        filePath: filepath,
        fileSize: file.size,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        submittedById: session.user.id,
      },
    });

    // Trigger AI quality scoring asynchronously
    // Don't await - let it run in background
    triggerQualityScoring(deliverable.id).catch((error) => {
      console.error('Background quality scoring failed:', error);
    });

    return NextResponse.json({
      success: true,
      deliverable: {
        id: deliverable.id,
        title: deliverable.title,
        fileName: deliverable.fileName,
        fileSize: deliverable.fileSize,
        deliverableType: deliverable.deliverableType,
        status: deliverable.status,
      },
    });
  } catch (error) {
    console.error('Deliverable upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Note: In Next.js App Router, route handlers automatically handle formData
// No need for bodyParser configuration
