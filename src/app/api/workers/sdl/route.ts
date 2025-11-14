/**
 * SDL Worker API Route
 *
 * Manual trigger and health check for SDL background worker
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  processSDLTasks,
  processProjectSDL,
  getWorkerStatus,
} from '@/lib/workers/sdl-worker';

/**
 * POST /api/workers/sdl
 * Trigger SDL worker manually
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication - only SUPER_ADMIN can trigger workers
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, action } = body;

    if (action === 'process_project' && projectId) {
      // Process specific project
      await processProjectSDL(projectId);
      return NextResponse.json({
        success: true,
        message: `SDL processing started for project ${projectId}`,
      });
    } else if (action === 'process_all') {
      // Process all active projects
      await processSDLTasks();
      return NextResponse.json({
        success: true,
        message: 'SDL worker processing all active projects',
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "process_project" or "process_all"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('SDL Worker API error:', error);
    return NextResponse.json(
      { error: 'Worker execution failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/workers/sdl
 * Get worker health status
 */
export async function GET(request: NextRequest) {
  try {
    const status = await getWorkerStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('SDL Worker status check error:', error);
    return NextResponse.json(
      { error: 'Status check failed' },
      { status: 500 }
    );
  }
}
