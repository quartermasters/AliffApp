/**
 * Client Portal - Dashboard
 *
 * View-only access for clients to see their projects
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ClientDashboardPage() {
  const { data: session } = useSession();
  const { data: projects, isLoading } = trpc.project.list.useQuery({
    limit: 50,
  });

  // Filter to only show projects where user is the client
  const myProjects = projects?.projects.filter(
    (p) => p.clientEmail === session?.user?.email
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-gray-600">
            View your active proposals and track progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Active Projects"
            value={myProjects?.filter((p) => p.status === 'ACTIVE').length || 0}
            icon="📊"
          />
          <StatsCard
            label="In Progress"
            value={
              myProjects?.filter((p) => p.currentStage === 'SDL_PROCESSING' || p.currentStage === 'RECRUITER_HIRING' || p.currentStage === 'TEAM_EXECUTION').length || 0
            }
            icon="⏳"
          />
          <StatsCard
            label="Ready for Review"
            value={
              myProjects?.filter((p) => p.currentStage === 'CLIENT_APPROVAL').length || 0
            }
            icon="👀"
          />
          <StatsCard
            label="Completed"
            value={myProjects?.filter((p) => p.status === 'COMPLETED').length || 0}
            icon="✅"
          />
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Projects
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your projects...</p>
            </div>
          ) : myProjects && myProjects.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {myProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600">
                Your proposals will appear here once they are created
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Components
function ClientHeader() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-purple-600">ALIFF</div>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm font-medium text-gray-900">
              Client Portal
            </span>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            CLIENT
          </span>
        </div>
      </div>
    </header>
  );
}

function StatsCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link
      href={`/dashboard/client/projects/${project.id}`}
      className="block p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {project.title}
            </h3>
            <StageBadge stage={project.currentStage} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>📋 {project.projectCode}</span>
            {project.contractValue && (
              <span>💰 ${project.contractValue.toLocaleString()}</span>
            )}
            {project.deadline && (
              <span>
                📅 Due {new Date(project.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {project.progressPercentage !== undefined && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-xs font-semibold text-gray-900">
                  {project.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>📄 {project._count?.documents || 0} documents</span>
            <span>📦 {project._count?.deliverables || 0} deliverables</span>
            <span>💬 {project._count?.updates || 0} updates</span>
          </div>
        </div>

        <div className="ml-4 flex-shrink-0">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const stageConfig: Record<
    string,
    { label: string; color: string }
  > = {
    PENDING_REVIEW: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
    INTAKE: { label: 'Intake Review', color: 'bg-indigo-100 text-indigo-800' },
    SDL_PROCESSING: { label: 'Analysis in Progress', color: 'bg-purple-100 text-purple-800' },
    HUMAN_VALIDATION: { label: 'Expert Validation', color: 'bg-orange-100 text-orange-800' },
    RECRUITER_HIRING: { label: 'Team Assignment', color: 'bg-blue-100 text-blue-800' },
    TEAM_EXECUTION: { label: 'In Development', color: 'bg-indigo-100 text-indigo-800' },
    AI_VALIDATION: { label: 'Quality Check', color: 'bg-purple-100 text-purple-800' },
    GOLD_GATE: { label: 'Final Review', color: 'bg-amber-100 text-amber-800' },
    CLIENT_APPROVAL: { label: 'Ready for Your Review', color: 'bg-green-100 text-green-800' },
    SUBMITTED: { label: 'Submitted', color: 'bg-gray-100 text-gray-800' },
    WON: { label: 'Won', color: 'bg-green-100 text-green-800' },
    LOST: { label: 'Lost', color: 'bg-red-100 text-red-800' },
  };

  const config = stageConfig[stage] || { label: stage, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}
