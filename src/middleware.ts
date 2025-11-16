/**
 * Next.js Middleware
 *
 * Route protection and authentication middleware
 * Implements RBAC-based access control
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

// Define protected routes and their allowed roles
const protectedRoutes: Record<string, Role[]> = {
  '/dashboard/super-admin': [Role.SUPER_ADMIN, Role.ADMIN],
  '/dashboard/client': [Role.CLIENT, Role.SUPER_ADMIN],
  '/dashboard/provider': [Role.TEAM_PROVIDER, Role.SUPER_ADMIN],
  '/dashboard/candidate': [Role.CANDIDATE, Role.SUPER_ADMIN],
  '/dashboard/recruiter': [Role.RECRUITER, Role.SUPER_ADMIN, Role.ADMIN],
  '/dashboard/interviewer': [Role.INTERVIEWER, Role.SUPER_ADMIN, Role.ADMIN],
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/careers',
  '/resources',
  '/blog',
  '/case-studies',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/pending-approval',
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Allow static files and API routes (except auth API)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const session = await auth();

  // Redirect to signin if not authenticated
  if (!session?.user && pathname.startsWith('/dashboard')) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check role-based access control
  if (session?.user && pathname.startsWith('/dashboard')) {
    const userRole = session.user.role;

    // Find matching protected route
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard for user's role
          return NextResponse.redirect(new URL(getRoleDashboard(userRole), request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

/**
 * Get the appropriate dashboard URL for a given role
 */
function getRoleDashboard(role: Role): string {
  switch (role) {
    case Role.SUPER_ADMIN:
    case Role.ADMIN:
      return '/dashboard/super-admin';
    case Role.CLIENT:
      return '/dashboard/client';
    case Role.TEAM_PROVIDER:
      return '/dashboard/provider';
    case Role.CANDIDATE:
      return '/dashboard/candidate';
    case Role.RECRUITER:
      return '/dashboard/recruiter';
    case Role.INTERVIEWER:
      return '/dashboard/interviewer';
    default:
      return '/auth/signin';
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
