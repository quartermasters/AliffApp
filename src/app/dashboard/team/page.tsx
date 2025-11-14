/**
 * Team Portal - Dashboard
 *
 * Anonymized work interface for team members
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function TeamDashboardPage() {
  const { data: session } = useSession();
  const { data: projects, isLoading } = trpc.project.list.useQuery({
    limit: 50,
  });

  // Filter to only show projects where user is assigned
  const myAssignments = projects?.projects.filter((p) =>
    p.assignments?.some((a) => a.teamMemberId === session?.user?.id)
  );

  // Calculate stats
  const stats = {
    activeAssignments: myAssignments?.filter((p) => p.status === 'ACTIVE').length || 0,
    inProgress: myAssignments?.filter((p) =>
      p.assignments?.some(
        (a) => a.teamMemberId === session?.user?.id && a.status === 'IN_PROGRESS'
      )
    ).length || 0,
    completed: myAssignments?.filter((p) =>
      p.assignments?.some(
        (a) => a.teamMemberId === session?.user?.id && a.status === 'COMPLETED'
      )
    ).length || 0,
    totalDeliverables: myAssignments?.reduce(
      (sum, p) => sum + (p._count?.deliverables || 0),
      0
    ) || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-gray-600">Your current assignments and tasks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Active Assignments"
            value={stats.activeAssignments}
            icon="📋"
            color="purple"
          />
          <StatsCard
            label="In Progress"
            value={stats.inProgress}
            icon="⏳"
            color="blue"
          />
          <StatsCard
            label="Completed"
            value={stats.completed}
            icon="✅"
            color="green"
          />
          <StatsCard
            label="Total Deliverables"
            value={stats.totalDeliverables}
            icon="📦"
            color="indigo"
          />
        </div>

        {/* Assignments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Assignments
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your assignments...</p>
            </div>
          ) : myAssignments && myAssignments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {myAssignments.map((project) => {
                const myAssignment = project.assignments?.find(
                  (a) => a.teamMemberId === session?.user?.id
                );
                return (
                  <AssignmentCard
                    key={project.id}
                    project={project}
                    assignment={myAssignment}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No assignments yet
              </h3>
              <p className="text-gray-600">
                You will be notified when you are assigned to a project
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Components
function TeamHeader() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-purple-600">ALIFF</div>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm font-medium text-gray-900">
              Team Portal
            </span>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
            TEAM MEMBER
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
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: 'purple' | 'blue' | 'green' | 'indigo';
}) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl opacity-80">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium opacity-90">{label}</p>
    </div>
  );
}

function AssignmentCard({
  project,
  assignment,
}: {
  project: any;
  assignment: any;
}) {
  // Show codename instead of actual project title (anonymization)
  const displayName = project.projectCodename || project.projectCode;

  return (
    <Link
      href={`/dashboard/team/assignments/${project.id}`}
      className="block p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎭</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {displayName}
            </h3>
            <AssignmentStatusBadge status={assignment?.status || 'ASSIGNED'} />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>📋 {project.projectCode}</span>
            <span>
              👤 Role: {assignment?.assignmentType.replace(/_/g, ' ') || 'Team Member'}
            </span>
            {project.deadline && (
              <span>
                📅 Due {new Date(project.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Assignment Description */}
          {assignment?.description && (
            <p className="text-sm text-gray-700 mb-3">
              {assignment.description}
            </p>
          )}

          {/* Progress */}
          {assignment?.progressPercentage !== undefined && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Your Progress
                </span>
                <span className="text-xs font-semibold text-gray-900">
                  {assignment.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${assignment.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>
              📦 {assignment?.deliverables?.length || 0} deliverables
            </span>
            {assignment?.dueDate && (
              <span>
                ⏰ Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            )}
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

function AssignmentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ASSIGNED: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    ON_HOLD: 'bg-orange-100 text-orange-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        colors[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
