/**
 * Deliverable Quality Scoring API
 *
 * Trigger AI quality scoring for deliverables
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  scoreDeliverableQuality,
  batchScoreDeliverables,
} from '@/lib/services/quality-scoring-service';

/**
 * POST /api/deliverables/score
 * Trigger quality scoring for one or more deliverables
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication - only admins can trigger scoring
    const session = await auth();
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { deliverableId, deliverableIds } = body;

    if (deliverableId) {
      // Score single deliverable
      const score = await scoreDeliverableQuality(deliverableId);
      return NextResponse.json({
        success: true,
        score,
      });
    } else if (deliverableIds && Array.isArray(deliverableIds)) {
      // Batch score multiple deliverables
      const results = await batchScoreDeliverables(deliverableIds);
      return NextResponse.json({
        success: true,
        results,
      });
    } else {
      return NextResponse.json(
        { error: 'Missing deliverableId or deliverableIds' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Quality scoring error:', error);
    return NextResponse.json(
      {
        error: 'Scoring failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/deliverables/score?projectId={id}
 * Get quality trends for a project
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId' },
        { status: 400 }
      );
    }

    const { getQualityTrends } = await import('@/lib/services/quality-scoring-service');
    const trends = await getQualityTrends(projectId);

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Quality trends error:', error);
    return NextResponse.json(
      { error: 'Failed to get trends' },
      { status: 500 }
    );
  }
}
