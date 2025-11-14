/**
 * Super Admin Dashboard - Main Page
 *
 * Overview of all projects, SDL processing, and system stats
 */

import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Super Admin Dashboard',
  description: 'Business Dashboard - Manage all GOVCON/SLED projects',
};

export default async function SuperAdminDashboard() {
  const session = await auth();

  // Check if user is authenticated and is Super Admin
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Business Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                GOVCON/SLED Proposal Management System
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.name}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                SUPER ADMIN
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Projects"
            value="12"
            change="+3 this month"
            trend="up"
          />
          <StatCard
            title="Win Rate"
            value="22%"
            change="vs 18% last quarter"
            trend="up"
          />
          <StatCard
            title="Avg Win Probability"
            value="68%"
            change="SDL Analysis"
            trend="neutral"
          />
          <StatCard
            title="Projects Won"
            value="8"
            change="This quarter"
            trend="up"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              href="/dashboard/super-admin/projects/new"
              title="New Project"
              description="Create a new RFP project"
              icon="+"
            />
            <ActionButton
              href="/dashboard/super-admin/projects"
              title="View All Projects"
              description="Manage existing projects"
              icon="📋"
            />
            <ActionButton
              href="/dashboard/super-admin/sdl"
              title="SDL Queue"
              description="Monitor SDL processing"
              icon="🔬"
            />
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Projects
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600">
              No projects yet. Create your first project to get started.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  trend,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p
        className={`text-sm ${
          trend === 'up'
            ? 'text-green-600'
            : trend === 'down'
            ? 'text-red-600'
            : 'text-gray-600'
        }`}
      >
        {change}
      </p>
    </div>
  );
}

// Action Button Component
function ActionButton({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      className="block p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}
