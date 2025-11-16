/**
 * Super Admin Dashboard Layout
 *
 * Modern, sleek layout with sidebar navigation
 * Implements RBAC and responsive design
 */

import { ReactNode } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default async function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard/super-admin');
  }

  // Check if user has Super Admin or Admin role
  const allowedRoles = [Role.SUPER_ADMIN, Role.ADMIN];
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <DashboardSidebar role={session.user.role} userName={session.user.name || session.user.email} />

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Header */}
        <DashboardHeader user={session.user} />

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
