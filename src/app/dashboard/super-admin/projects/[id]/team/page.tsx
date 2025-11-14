/**
 * Super Admin - Project Team Management
 *
 * Assign and manage team members for a project
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { use, useState } from 'react';

export default function ProjectTeamManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const { data: project } = trpc.project.getById.useQuery({ id });
  const { data: assignments, refetch: refetchAssignments } = trpc.project.getById.useQuery({ id });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader projectId={id} projectTitle={project?.title} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Team Management
            </h1>
            <p className="text-gray-600">
              Assign and manage team members for this project
            </p>
          </div>
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            + Assign Team Member
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Total Team Members"
            value={project?.assignments?.length || 0}
            icon="👥"
            color="purple"
          />
          <StatsCard
            label="Active Assignments"
            value={
              project?.assignments?.filter((a) => a.status === 'IN_PROGRESS')
                .length || 0
            }
            icon="⏳"
            color="blue"
          />
          <StatsCard
            label="Completed"
            value={
              project?.assignments?.filter((a) => a.status === 'COMPLETED')
                .length || 0
            }
            icon="✅"
            color="green"
          />
          <StatsCard
            label="AI-Recruited"
            value={
              project?.assignments?.filter((a) => a.recruitedViaAliff).length ||
              0
            }
            icon="🤖"
            color="indigo"
          />
        </div>

        {/* Team Members List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Team Members ({project?.assignments?.length || 0})
            </h2>
          </div>

          {project?.assignments && project.assignments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {project.assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  projectId={id}
                  onUpdate={() => refetchAssignments()}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No team members assigned yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add team members to start working on this project
              </p>
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Assign First Team Member
              </button>
            </div>
          )}
        </div>

        {/* Assign Modal */}
        {showAssignModal && (
          <AssignTeamMemberModal
            projectId={id}
            onClose={() => setShowAssignModal(false)}
            onSuccess={() => {
              setShowAssignModal(false);
              refetchAssignments();
            }}
          />
        )}
      </main>
    </div>
  );
}

// Components
function DashboardHeader({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle?: string;
}) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/super-admin/projects/${projectId}`}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Project
            </Link>
            {projectTitle && (
              <>
                <span className="text-sm text-gray-400">|</span>
                <span className="text-sm font-medium text-gray-900">
                  {projectTitle}
                </span>
              </>
            )}
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
            SUPER ADMIN
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
    purple: 'bg-purple-50 border-purple-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    indigo: 'bg-indigo-50 border-indigo-200',
  };

  return (
    <div
      className={`${colorClasses[color]} rounded-lg shadow-sm p-6 border`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
}

function AssignmentCard({
  assignment,
  projectId,
  onUpdate,
}: {
  assignment: any;
  projectId: string;
  onUpdate: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {assignment.teamMember.name}
              </h3>
              <p className="text-sm text-gray-600">
                {assignment.teamMember.email}
              </p>
            </div>
            {assignment.recruitedViaAliff && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                🤖 AI-Recruited
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
            <span>
              👔 {assignment.assignmentType.replace(/_/g, ' ')}
            </span>
            <AssignmentStatusBadge status={assignment.status} />
            {assignment.compensation && (
              <span>💰 ${assignment.compensation.toLocaleString()}</span>
            )}
            {assignment.dueDate && (
              <span>
                📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {assignment.progressPercentage !== undefined && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-xs font-semibold text-gray-900">
                  {assignment.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${assignment.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Description */}
          {assignment.description && (
            <p className="text-sm text-gray-700 mb-3">
              {assignment.description}
            </p>
          )}

          {/* Job Posting Link */}
          {assignment.jobPostingId && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📋 Linked to job posting:</span>
              <Link
                href={`/dashboard/super-admin/recruitment/jobs/${assignment.jobPostingId}`}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                View Job Posting →
              </Link>
            </div>
          )}
        </div>

        <div className="ml-4 flex items-center gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
          <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
            Edit
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Assigned At"
              value={
                assignment.assignedAt
                  ? new Date(assignment.assignedAt).toLocaleString()
                  : 'N/A'
              }
            />
            <DetailItem
              label="Started At"
              value={
                assignment.startedAt
                  ? new Date(assignment.startedAt).toLocaleString()
                  : 'Not started'
              }
            />
            <DetailItem
              label="Completed At"
              value={
                assignment.completedAt
                  ? new Date(assignment.completedAt).toLocaleString()
                  : 'Not completed'
              }
            />
            <DetailItem
              label="Deliverables"
              value={`${assignment.deliverables?.length || 0} submitted`}
            />
          </div>

          {/* Deliverables List */}
          {assignment.deliverables && assignment.deliverables.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Deliverables:
              </p>
              <div className="space-y-1">
                {assignment.deliverables.map((d: any) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                  >
                    <span className="text-gray-900">{d.title}</span>
                    <DeliverableStatusBadge status={d.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AssignTeamMemberModal({
  projectId,
  onClose,
  onSuccess,
}: {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    teamMemberId: '',
    assignmentType: 'PROPOSAL_MANAGER',
    description: '',
    compensation: '',
    dueDate: '',
  });

  // TODO: Fetch available users from tRPC
  // const { data: users } = trpc.user.list.useQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement assignment creation via tRPC
    console.log('Creating assignment:', formData);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Assign Team Member
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Team Member Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Member
            </label>
            <select
              value={formData.teamMemberId}
              onChange={(e) =>
                setFormData({ ...formData, teamMemberId: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a team member...</option>
              {/* TODO: Map actual users */}
              <option value="user1">John Doe (Technical Writer)</option>
              <option value="user2">Jane Smith (Proposal Manager)</option>
            </select>
          </div>

          {/* Assignment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Type
            </label>
            <select
              value={formData.assignmentType}
              onChange={(e) =>
                setFormData({ ...formData, assignmentType: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="PROPOSAL_MANAGER">Proposal Manager</option>
              <option value="TECHNICAL_WRITER">Technical Writer</option>
              <option value="SUBJECT_MATTER_EXPERT">Subject Matter Expert</option>
              <option value="PAST_PERFORMANCE_ANALYST">
                Past Performance Analyst
              </option>
              <option value="PRICING_ANALYST">Pricing Analyst</option>
              <option value="EDITOR">Editor</option>
              <option value="GRAPHIC_DESIGNER">Graphic Designer</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="Describe the role and responsibilities..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Compensation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compensation ($)
            </label>
            <input
              type="number"
              value={formData.compensation}
              onChange={(e) =>
                setFormData({ ...formData, compensation: e.target.value })
              }
              placeholder="5000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Assign Team Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper Components
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase mb-1">
        {label}
      </p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
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

function DeliverableStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    SUBMITTED: 'bg-purple-100 text-purple-800',
    APPROVED: 'bg-green-100 text-green-800',
    NEEDS_REVISION: 'bg-orange-100 text-orange-800',
    REJECTED: 'bg-red-100 text-red-800',
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
