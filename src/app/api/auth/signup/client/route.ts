/**
 * Client Signup API Route
 *
 * Creates a new CLIENT user with PENDING status
 * Requires admin approval before account activation
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role, UserStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, companyName, phone } = body;

    // Validate required fields
    if (!email || !password || !name || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Get IP address from request
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    // Create user with PENDING status
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: Role.CLIENT,
        status: UserStatus.PENDING, // Requires admin approval
      },
    });

    // Create audit log for signup
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_SIGNUP_CLIENT',
        resource: 'User',
        resourceId: user.id,
        ipAddress,
        metadata: {
          email: user.email,
          name,
          companyName,
          phone,
          timestamp: new Date().toISOString(),
        },
      },
    });

    // TODO: Send notification to admin about new client signup
    // TODO: Send confirmation email to user about pending approval

    return NextResponse.json(
      {
        message: 'Account created successfully. Pending admin approval.',
        userId: user.id,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Client signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
