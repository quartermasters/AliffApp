/**
 * Test POST Endpoint
 * Simple test to verify POST requests work on Vercel
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    message: 'Test endpoint is working (GET)',
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'Test endpoint is working (POST)',
    timestamp: new Date().toISOString(),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
