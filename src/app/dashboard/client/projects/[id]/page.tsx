/**
 * Client Portal - Project Detail View
 *
 * View-only access to project details, updates, and deliverables
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { use, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ClientProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'deliverables' | 'updates'>('overview');

  const { data: project, isLoading, error } = trpc.project.getById.useQuery({ id });
  const { data: documents } = trpc.document.list.useQuery({ projectId: id });

  // Security check: Only show if user is the client
  const isAuthorized = project?.clientEmail === session?.user?.email;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading project...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              {!isAuthorized ? 'Access denied' : error?.message || 'Project not found'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Filter documents visible to client
  const clientDocuments = documents?.filter((d) => d.visibleToClient);

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.title}
                </h1>
                <StageBadge stage={project.currentStage} />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📋 {project.projectCode}</span>
                <span>👤 {project.clientName}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {project.progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${project.progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Project Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <InfoCard
              label="Contract Value"
              value={
                project.contractValue
                  ? `$${project.contractValue.toLocaleString()}`
                  : 'Not specified'
              }
            />
            <InfoCard
              label="Deadline"
              value={
                project.deadline
                  ? new Date(project.deadline).toLocaleDateString()
                  : 'Not specified'
              }
            />
            <InfoCard
              label="Industry"
              value={project.industryCategory || 'Not specified'}
            />
            <InfoCard
              label="Status"
              value={project.status}
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
                label={`Deliverables (${project._count?.deliverables || 0})`}
                isActive={selectedTab === 'deliverables'}
                onClick={() => setSelectedTab('deliverables')}
              />
              <TabButton
                label={`Updates (${project._count?.updates || 0})`}
                isActive={selectedTab === 'updates'}
                onClick={() => setSelectedTab('updates')}
              />
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {selectedTab === 'overview' && (
              <OverviewTab project={project} documents={clientDocuments} />
            )}
            {selectedTab === 'deliverables' && (
              <DeliverablesTab project={project} />
            )}
            {selectedTab === 'updates' && (
              <UpdatesTab project={project} />
            )}
          </div>
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
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/client"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </Link>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            CLIENT
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
          ? 'border-purple-500 text-purple-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors`}
    >
      {label}
    </button>
  );
}

function OverviewTab({
  project,
  documents,
}: {
  project: any;
  documents: any[] | undefined;
}) {
  return (
    <div className="space-y-6">
      {/* Description */}
      {project.description && (
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Project Description
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
        </div>
      )}

      {/* Documents Available for Download */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Available Documents
        </h3>
        {documents && documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {doc.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.documentType.replace(/_/g, ' ')} •{' '}
                      {new Date(doc.uploadedAt).toLocaleDateString()} •{' '}
                      {((doc.fileSize || 0) / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                  Download
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-gray-600">No documents available yet</p>
          </div>
        )}
      </div>

      {/* Key Milestones */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Project Timeline
        </h3>
        <div className="space-y-3">
          <MilestoneItem
            label="Project Created"
            date={new Date(project.createdAt)}
            completed={true}
          />
          <MilestoneItem
            label="Analysis Complete"
            date={project.deadline ? new Date(project.deadline) : undefined}
            completed={project.currentStage !== 'SDL_PROCESSING'}
          />
          <MilestoneItem
            label="Proposal Development"
            completed={['TEAM_EXECUTION', 'AI_VALIDATION', 'GOLD_GATE', 'CLIENT_APPROVAL', 'SUBMITTED', 'WON', 'LOST'].includes(project.currentStage)}
          />
          <MilestoneItem
            label="Client Review"
            completed={['CLIENT_APPROVAL', 'SUBMITTED', 'WON', 'LOST'].includes(project.currentStage)}
          />
          <MilestoneItem
            label="Submission"
            date={project.deadline ? new Date(project.deadline) : undefined}
            completed={project.currentStage === 'SUBMITTED'}
          />
        </div>
      </div>
    </div>
  );
}

function DeliverablesTab({ project }: { project: any }) {
  const deliverables = project.deliverables || [];

  // Filter to only show deliverables visible to client
  const clientDeliverables = deliverables.filter(
    (d: any) => d.visibleToClient || d.status === 'APPROVED'
  );

  return (
    <div className="space-y-4">
      {clientDeliverables.length > 0 ? (
        clientDeliverables.map((deliverable: any) => (
          <div
            key={deliverable.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
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

            {deliverable.status === 'APPROVED' && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                  Download
                </button>
                {deliverable.qualityScore && (
                  <span className="text-sm text-gray-600">
                    Quality Score: {deliverable.qualityScore}%
                  </span>
                )}
              </div>
            )}

            {deliverable.clientFeedback && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-medium text-blue-800 mb-1">
                  Your Feedback
                </p>
                <p className="text-sm text-blue-900">{deliverable.clientFeedback}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No deliverables yet
          </h3>
          <p className="text-gray-600">
            Deliverables will appear here as they become available
          </p>
        </div>
      )}
    </div>
  );
}

function UpdatesTab({ project }: { project: any }) {
  const updates = project.updates || [];

  return (
    <div className="space-y-4">
      {updates.length > 0 ? (
        updates.map((update: any) => (
          <div
            key={update.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  {update.title}
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(update.createdAt).toLocaleDateString()} at{' '}
                  {new Date(update.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <UpdateTypeBadge type={update.updateType} />
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {update.content}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No updates yet
          </h3>
          <p className="text-gray-600">
            Project updates will appear here as work progresses
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

function StageBadge({ stage }: { stage: string }) {
  const stageConfig: Record<string, { label: string; color: string }> = {
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

function MilestoneItem({
  label,
  date,
  completed,
}: {
  label: string;
  date?: Date;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          completed ? 'bg-green-100' : 'bg-gray-100'
        }`}
      >
        {completed ? (
          <span className="text-green-600 text-sm">✓</span>
        ) : (
          <span className="text-gray-400 text-sm">○</span>
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${completed ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </p>
        {date && (
          <p className="text-xs text-gray-500">{date.toLocaleDateString()}</p>
        )}
      </div>
    </div>
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

function UpdateTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    MILESTONE: 'bg-purple-100 text-purple-800',
    STATUS_UPDATE: 'bg-blue-100 text-blue-800',
    ISSUE: 'bg-red-100 text-red-800',
    QUESTION: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full ${
        colors[type] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {type.replace(/_/g, ' ')}
    </span>
  );
}
