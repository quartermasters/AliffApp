/**
 * Dashboard Redirect Page
 *
 * Redirects users to their role-specific dashboard
 * Based on RBAC permissions
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Role } from '@prisma/client';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  const { role } = session.user;

  // Route to role-specific dashboard
  switch (role) {
    case Role.SUPER_ADMIN:
    case Role.ADMIN:
      redirect('/dashboard/super-admin');

    case Role.CLIENT:
      redirect('/dashboard/client');

    case Role.TEAM_PROVIDER:
      redirect('/dashboard/provider');

    case Role.CANDIDATE:
      redirect('/dashboard/candidate');

    case Role.RECRUITER:
      redirect('/dashboard/recruiter');

    case Role.INTERVIEWER:
      redirect('/dashboard/interviewer');

    default:
      redirect('/auth/signin');
  }
}
