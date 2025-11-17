/**
 * Simplified Resume Parsing Test
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
  console.log('[PARSE-RESUME-SIMPLE] POST received');

  try {
    const body = await request.json();
    console.log('[PARSE-RESUME-SIMPLE] Body:', body);

    return NextResponse.json({
      success: true,
      message: 'Simple endpoint works',
      receivedData: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
