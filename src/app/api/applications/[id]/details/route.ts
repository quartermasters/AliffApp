/**
 * Application Details API Endpoint
 *
 * Returns application details for interview initialization
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            type: true,
            location: true,
            requirements: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: application.id,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      phone: application.phone,
      jobTitle: application.job.title,
      jobId: application.job.id,
      status: application.status,
      resumeUrl: application.resumeUrl,
      photoUrl: application.uploadedPhotoUrl,
      parsedData: application.resumeParsedData,
      createdAt: application.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('[API] Application details error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch application details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
