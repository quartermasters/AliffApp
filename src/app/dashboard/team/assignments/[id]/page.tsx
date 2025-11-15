/**
 * Team Portal - Assignment Detail View
 *
 * Anonymized work interface with deliverable submission
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { use, useState } from 'react';
import { useSession } from 'next-auth/react';
import { DeliverableSubmit } from '@/components/dashboard/DeliverableSubmit';

export default function TeamAssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'deliverables' | 'resources'>('overview');

  const { data: project, isLoading, error } = trpc.project.getById.useQuery({ id });
  const { data: documents } = trpc.document.list.useQuery({ projectId: id });

  // Get my assignment
  const myAssignment = project?.assignments?.find(
    (a) => a.teamMemberId === session?.user?.id
  );

  // Security check: Only show if user is assigned
  const isAuthorized = !!myAssignment;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeamHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading assignment...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeamHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              {!isAuthorized ? 'Access denied - You are not assigned to this project' : error?.message || 'Assignment not found'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Anonymized display name
  const displayName = project.projectCodename || project.projectCode;

  // Filter documents visible to team
  const teamDocuments = documents?.filter((d) => d.visibleToTeam);

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assignment Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎭</span>
                <h1 className="text-2xl font-bold text-gray-900">
                  {displayName}
                </h1>
                <AssignmentStatusBadge status={myAssignment.status} />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📋 {project.projectCode}</span>
                <span>
                  👤 Your Role: {myAssignment.assignmentType.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Assignment Description */}
          {myAssignment.assignmentDescription && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm font-medium text-indigo-800 mb-1">
                Your Assignment
              </p>
              <p className="text-sm text-indigo-900">{myAssignment.assignmentDescription}</p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Your Progress
              </span>
              <span className="text-sm font-semibold text-gray-900">
                0%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: '0%' }}
              ></div>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <InfoCard
              label="Due Date"
              value={
                myAssignment.deadline
                  ? new Date(myAssignment.deadline).toLocaleDateString()
                  : 'Not specified'
              }
            />
            <InfoCard
              label="Estimated Hours"
              value={
                myAssignment.hoursEstimated
                  ? `${myAssignment.hoursEstimated} hrs`
                  : 'TBD'
              }
            />
            <InfoCard
              label="Status"
              value={myAssignment.status.replace(/_/g, ' ')}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <TabButton
                label="Overview"
                isActive={selectedTab === 'overview'}
                onClick={() => setSelectedTab('overview')}
              />
              <TabButton
                label="My Deliverables"
                isActive={selectedTab === 'deliverables'}
                onClick={() => setSelectedTab('deliverables')}
              />
              <TabButton
                label={`Resources (${teamDocuments?.length || 0})`}
                isActive={selectedTab === 'resources'}
                onClick={() => setSelectedTab('resources')}
              />
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <OverviewTab project={project} assignment={myAssignment} />
            )}
            {selectedTab === 'deliverables' && (
              <DeliverablesTab assignment={myAssignment} projectId={id} />
            )}
            {selectedTab === 'resources' && (
              <ResourcesTab documents={teamDocuments} />
            )}
          </div>
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
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/team"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
            TEAM MEMBER
          </span>
        </div>
      </div>
    </header>
  );
}

function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        isActive
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
    >
      {label}
    </button>
  );
}

function OverviewTab({
  project,
  assignment,
}: {
  project: any;
  assignment: any;
}) {
  return (
    <div className="space-y-6">
      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-yellow-800 mb-1">
              Confidentiality Notice
            </p>
            <p className="text-sm text-yellow-700">
              This project is anonymized for confidentiality. All work should be
              completed professionally without knowledge of the client identity.
            </p>
          </div>
        </div>
      </div>

      {/* Assignment Details */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Assignment Details
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <DetailRow label="Project Code" value={project.projectCode} />
          <DetailRow
            label="Project Type"
            value={project.industryCategory || 'Government Contract Proposal'}
          />
          {project.deadline && (
            <DetailRow
              label="Project Deadline"
              value={new Date(project.deadline).toLocaleDateString()}
            />
          )}
          <DetailRow
            label="Assigned"
            value={new Date(assignment.assignedAt).toLocaleDateString()}
          />
        </div>
      </div>

      {/* Task Checklist */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Your Tasks
        </h3>
        <div className="space-y-2">
          <TaskItem
            label="Review project requirements"
            completed={assignment.status !== 'ASSIGNED'}
          />
          <TaskItem
            label="Submit initial deliverable"
            completed={assignment.status === 'IN_PROGRESS'}
          />
          <TaskItem
            label="Address feedback"
            completed={assignment.status === 'IN_PROGRESS'}
          />
          <TaskItem
            label="Submit final deliverable"
            completed={assignment.status === 'COMPLETED'}
          />
        </div>
      </div>

      {/* Recruited via ALIFF */}
      {assignment.recruitedViaAliff && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-sm font-semibold text-purple-800 mb-1">
                AI-Matched Assignment
              </p>
              <p className="text-sm text-purple-700">
                You were matched to this project by ALIFF-RECRUITER based on your
                skills and experience.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeliverablesTab({
  assignment,
  projectId,
}: {
  assignment: any;
  projectId: string;
}) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { data: deliverables, refetch } = trpc.deliverable.list.useQuery({
    projectId,
    assignmentId: assignment.id,
  });

  const myDeliverables = deliverables || [];

  return (
    <div className="space-y-4">
      {/* Submit New Deliverable Button */}
      {assignment.status !== 'COMPLETED' && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            + Submit Deliverable
          </button>
        </div>
      )}

      {/* Deliverables List */}
      {myDeliverables.length > 0 ? (
        myDeliverables.map((deliverable: any) => (
          <div
            key={deliverable.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  {deliverable.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {deliverable.deliverableType.replace(/_/g, ' ')}
                </p>
                {deliverable.description && (
                  <p className="text-sm text-gray-700 mb-2">
                    {deliverable.description}
                  </p>
                )}
              </div>
              <DeliverableStatusBadge status={deliverable.status} />
            </div>

            {/* Quality Score */}
            {deliverable.qualityScore && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Quality Score
                  </span>
                  <span className={`text-sm font-semibold ${
                    deliverable.qualityScore >= 80 ? 'text-green-600' :
                    deliverable.qualityScore >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {deliverable.qualityScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      deliverable.qualityScore >= 80 ? 'bg-green-600' :
                      deliverable.qualityScore >= 60 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${deliverable.qualityScore}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Reviewer Feedback */}
            {deliverable.reviewerFeedback && (
              <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-xs font-medium text-orange-800 mb-1">
                  Reviewer Feedback
                </p>
                <p className="text-sm text-orange-900">
                  {deliverable.reviewerFeedback}
                </p>
              </div>
            )}

            {/* Submission Info */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
              {deliverable.submittedAt && (
                <span>
                  Submitted: {new Date(deliverable.submittedAt).toLocaleString()}
                </span>
              )}
              {deliverable.approvedAt && (
                <span>
                  Approved: {new Date(deliverable.approvedAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No deliverables yet
          </h3>
          <p className="text-gray-600 mb-4">
            Submit your first deliverable to get started
          </p>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Submit Deliverable
          </button>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Submit Deliverable
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <DeliverableSubmit
                projectId={projectId}
                assignmentId={assignment.id}
                onSubmitComplete={() => {
                  setShowSubmitModal(false);
                  refetch();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResourcesTab({ documents }: { documents: any[] | undefined }) {
  return (
    <div className="space-y-4">
      {documents && documents.length > 0 ? (
        documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">📄</span>
              <div>
                <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                <p className="text-xs text-gray-500">
                  {doc.documentType.replace(/_/g, ' ')} •{' '}
                  {new Date(doc.uploadedAt).toLocaleDateString()} •{' '}
                  {((doc.fileSize || 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
              Download
            </button>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No resources available
          </h3>
          <p className="text-gray-600">
            Reference materials will appear here when available
          </p>
        </div>
      )}
    </div>
  );
}

// Helper Components
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

function TaskItem({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div
        className={`w-5 h-5 rounded flex items-center justify-center ${
          completed ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        {completed && <span className="text-white text-xs">✓</span>}
      </div>
      <span className={`text-sm ${completed ? 'text-gray-900' : 'text-gray-600'}`}>
        {label}
      </span>
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
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
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
