/**
 * Super Admin - Projects List
 *
 * View all projects with filters and search
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';

export default function ProjectsListPage() {
  // Fetch projects using tRPC
  const { data, isLoading, error } = trpc.project.list.useQuery({
    limit: 50,
  });

  const { data: stats } = trpc.project.stats.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading projects: {error.message}</p>
          </div>
        </main>
      </div>
    );
  }

  const projects = data?.projects || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Projects"
              value={stats.totalProjects.toString()}
              icon="📊"
            />
            <StatCard
              title="Active Projects"
              value={stats.activeProjects.toString()}
              icon="🔥"
            />
            <StatCard
              title="Win Rate"
              value={`${stats.winRate}%`}
              icon="🎯"
            />
            <StatCard
              title="Avg Win Probability"
              value={`${stats.avgWinProbability}%`}
              icon="📈"
            />
          </div>
        )}

        {/* Page Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage RFP/Proposal projects and track SDL progress
              </p>
            </div>
            <Link
              href="/dashboard/super-admin/projects/new"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              + New Project
            </Link>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first project to get started with SDL analysis
              </p>
              <Link
                href="/dashboard/super-admin/projects/new"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Create First Project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SDL Phase
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Win Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {project.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {project.projectCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {project.clientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge stage={project.currentStage} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <SDLPhaseBadge phase={project.sdlStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {project.sdlWinProbability
                            ? `${project.sdlWinProbability}%`
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {project.deadline
                            ? new Date(project.deadline).toLocaleDateString()
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/dashboard/super-admin/projects/${project.id}`}
                          className="text-purple-600 hover:text-purple-900 mr-4"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Dashboard Header Component
function DashboardHeader() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/super-admin"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
            SUPER ADMIN
          </span>
        </div>
      </div>
    </header>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
    INTAKE: 'bg-blue-100 text-blue-800',
    SDL_PROCESSING: 'bg-purple-100 text-purple-800',
    HUMAN_VALIDATION: 'bg-orange-100 text-orange-800',
    RECRUITER_HIRING: 'bg-indigo-100 text-indigo-800',
    TEAM_EXECUTION: 'bg-cyan-100 text-cyan-800',
    AI_VALIDATION: 'bg-purple-100 text-purple-800',
    GOLD_GATE: 'bg-yellow-100 text-yellow-800',
    CLIENT_APPROVAL: 'bg-blue-100 text-blue-800',
    SUBMITTED: 'bg-green-100 text-green-800',
    WON: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        colors[stage] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {stage.replace(/_/g, ' ')}
    </span>
  );
}

// SDL Phase Badge Component
function SDLPhaseBadge({ phase }: { phase: string }) {
  const colors: Record<string, string> = {
    NOT_STARTED: 'bg-gray-100 text-gray-800',
    PHASE1_TRIAGE: 'bg-blue-100 text-blue-800',
    PHASE2_STRATEGIC_INTEL: 'bg-purple-100 text-purple-800',
    PHASE3_WIN_STRATEGY: 'bg-indigo-100 text-indigo-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };

  const labels: Record<string, string> = {
    NOT_STARTED: 'Not Started',
    PHASE1_TRIAGE: 'Phase 1: Triage',
    PHASE2_STRATEGIC_INTEL: 'Phase 2: Intel',
    PHASE3_WIN_STRATEGY: 'Phase 3: Strategy',
    COMPLETED: 'Completed',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        colors[phase] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {labels[phase] || phase}
    </span>
  );
}
