/**
 * Super Admin Dashboard - Main Page
 *
 * Overview of all projects, SDL processing, and system stats
 */

import { Metadata } from 'next';
import StatsGrid from '@/components/dashboard/StatsGrid';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentProjects from '@/components/dashboard/RecentProjects';
import ActiveSDLTasks from '@/components/dashboard/ActiveSDLTasks';

export const metadata: Metadata = {
  title: 'Super Admin Dashboard | Aliff Services',
  description: 'Business Dashboard - Manage all GOVCON/SLED projects',
};

export default async function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Operations Engine
        </h1>
        <p className="text-slate-400 mt-2">
          GOVCON/SLED Proposal Management & AI Orchestration
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* Quick Actions */}
      <QuickActions />

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <RecentProjects />

        {/* Active SDL Tasks */}
        <ActiveSDLTasks />
      </div>
    </div>
  );
}
