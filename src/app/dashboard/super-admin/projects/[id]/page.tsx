/**
 * Super Admin - Project Detail View
 *
 * View project details, SDL progress, team, and deliverables
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { use, useState } from 'react';
import { DocumentUpload } from '@/components/dashboard/DocumentUpload';

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocumentForSDL, setSelectedDocumentForSDL] = useState<string | null>(null);

  const { data: project, isLoading, error } = trpc.project.getById.useQuery({ id });
  const { data: sdlSummary } = trpc.sdl.getSummary.useQuery(
    { projectId: id },
    { enabled: !!project }
  );
  const { data: documents } = trpc.document.list.useQuery({ projectId: id });

  const startSDLProcessing = trpc.document.startSDLProcessing.useMutation({
    onSuccess: () => {
      alert('SDL processing started successfully!');
      setSelectedDocumentForSDL(null);
    },
    onError: (error) => {
      alert(`Error starting SDL: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              {error?.message || 'Project not found'}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.title}
                </h1>
                <StatusBadge stage={project.currentStage} />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📋 {project.projectCode}</span>
                {project.projectCodename && (
                  <span>🎭 {project.projectCodename}</span>
                )}
                <span>👤 {project.clientName}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Edit
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upload Document
              </button>
            </div>
          </div>

          {/* Project Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
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
              label="Solicitation #"
              value={project.solicitationNumber || 'Not specified'}
            />
          </div>
        </div>

        {/* SDL Progress */}
        {sdlSummary && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                SDL Analysis Progress
              </h2>
              <Link
                href={`/dashboard/super-admin/projects/${id}/sdl-tasks`}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                View All Tasks →
              </Link>
            </div>

            {/* Overall Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {sdlSummary.progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${sdlSummary.progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                <span>
                  {sdlSummary.completedTasks} / {sdlSummary.totalTasks} tasks
                  completed
                </span>
                {sdlSummary.escalatedTasks > 0 && (
                  <Link
                    href={`/dashboard/super-admin/projects/${id}/consensus-review`}
                    className="text-orange-600 hover:text-orange-800 font-medium"
                  >
                    ⚠️ {sdlSummary.escalatedTasks} tasks need human review →
                  </Link>
                )}
              </div>
            </div>

            {/* Phase Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PhaseCard
                title="Phase 1: Triage"
                completed={sdlSummary.phases.phase1.completed}
                total={sdlSummary.phases.phase1.total}
                color="blue"
              />
              <PhaseCard
                title="Phase 2: Strategic Intel"
                completed={sdlSummary.phases.phase2.completed}
                total={sdlSummary.phases.phase2.total}
                color="purple"
              />
              <PhaseCard
                title="Phase 3: Win Strategy"
                completed={sdlSummary.phases.phase3.completed}
                total={sdlSummary.phases.phase3.total}
                color="indigo"
              />
            </div>

            {/* SDL Metrics */}
            {(sdlSummary.complexityScore || sdlSummary.winProbability) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                {sdlSummary.complexityScore && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Complexity Score
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {sdlSummary.complexityScore}/10
                    </p>
                  </div>
                )}
                {sdlSummary.winProbability && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Win Probability
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {sdlSummary.winProbability}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Documents */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Documents ({documents?.length || 0})
          </h2>
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
                        {doc.documentType} •{' '}
                        {new Date(doc.uploadedAt).toLocaleDateString()} •{' '}
                        {((doc.fileSize || 0) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.documentType === 'RFP_MAIN' && project.sdlStatus === 'NOT_STARTED' && (
                      <button
                        onClick={() => {
                          if (confirm('Start SDL processing on this document? This will analyze the RFP and create 34 SDL tasks.')) {
                            startSDLProcessing.mutate({
                              projectId: id,
                              documentId: doc.id,
                            });
                          }
                        }}
                        disabled={startSDLProcessing.isPending}
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {startSDLProcessing.isPending ? 'Starting...' : 'Start SDL'}
                      </button>
                    )}
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-gray-600 mb-4">No documents uploaded yet</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Upload Document
              </button>
            </div>
          )}
        </div>

        {/* Team Assignments */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Team Assignments ({project._count?.assignments || 0})
          </h2>
          {project.assignments && project.assignments.length > 0 ? (
            <div className="space-y-2">
              {project.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {assignment.teamMember.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {assignment.assignmentType.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      assignment.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : assignment.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-gray-600 mb-4">No team members assigned yet</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Assign Team Member
              </button>
            </div>
          )}
        </div>

        {/* Deliverables */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Deliverables ({project._count?.deliverables || 0})
          </h2>
          {project.deliverables && project.deliverables.length > 0 ? (
            <div className="space-y-2">
              {project.deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {deliverable.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {deliverable.deliverableType.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      deliverable.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : deliverable.status === 'SUBMITTED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {deliverable.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-gray-600">No deliverables yet</p>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Document
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <DocumentUpload
                projectId={id}
                onUploadComplete={() => {
                  setShowUploadModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Components
function DashboardHeader() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/super-admin/projects"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Projects
          </Link>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
            SUPER ADMIN
          </span>
        </div>
      </div>
    </header>
  );
}

function StatusBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
    SDL_PROCESSING: 'bg-purple-100 text-purple-800',
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

function PhaseCard({
  title,
  completed,
  total,
  color,
}: {
  title: string;
  completed: number;
  total: number;
  color: 'blue' | 'purple' | 'indigo';
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const colors = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-sm font-medium text-gray-700 mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mb-2">{percentage}%</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`${colors[color]} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {completed} / {total} tasks
      </p>
    </div>
  );
}
