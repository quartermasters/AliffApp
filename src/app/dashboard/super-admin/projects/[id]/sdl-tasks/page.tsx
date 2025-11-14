/**
 * SDL Task Monitoring Dashboard
 *
 * View all 34 SDL tasks with detailed status, AI execution, and consensus logs
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { use, useState } from 'react';

export default function SDLTasksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const { data: project } = trpc.project.getById.useQuery({ id });
  const { data: tasks, isLoading } = trpc.sdl.getTasks.useQuery({ projectId: id });

  // Filter tasks by phase
  const filteredTasks = tasks?.filter((task) =>
    selectedPhase === 'ALL' ? true : task.taskPhase === selectedPhase
  );

  // Calculate phase statistics
  const phaseStats = {
    PHASE1_TRIAGE: {
      total: tasks?.filter((t) => t.taskPhase === 'PHASE1_TRIAGE').length || 0,
      completed: tasks?.filter((t) => t.taskPhase === 'PHASE1_TRIAGE' && t.status === 'COMPLETED').length || 0,
    },
    PHASE2_STRATEGIC_INTEL: {
      total: tasks?.filter((t) => t.taskPhase === 'PHASE2_STRATEGIC_INTEL').length || 0,
      completed: tasks?.filter((t) => t.taskPhase === 'PHASE2_STRATEGIC_INTEL' && t.status === 'COMPLETED').length || 0,
    },
    PHASE3_WIN_STRATEGY: {
      total: tasks?.filter((t) => t.taskPhase === 'PHASE3_WIN_STRATEGY').length || 0,
      completed: tasks?.filter((t) => t.taskPhase === 'PHASE3_WIN_STRATEGY' && t.status === 'COMPLETED').length || 0,
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader projectId={id} projectTitle={project?.title} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading SDL tasks...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader projectId={id} projectTitle={project?.title} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SDL Task Monitoring
          </h1>
          <p className="text-gray-600">
            Track all 34 SDL tasks across 3 phases
          </p>
        </div>

        {/* Phase Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <PhaseTab
                label="All Tasks"
                phase="ALL"
                count={tasks?.length || 0}
                completed={tasks?.filter((t) => t.status === 'COMPLETED').length || 0}
                isActive={selectedPhase === 'ALL'}
                onClick={() => setSelectedPhase('ALL')}
              />
              <PhaseTab
                label="Phase 1: Triage"
                phase="PHASE1_TRIAGE"
                count={phaseStats.PHASE1_TRIAGE.total}
                completed={phaseStats.PHASE1_TRIAGE.completed}
                isActive={selectedPhase === 'PHASE1_TRIAGE'}
                onClick={() => setSelectedPhase('PHASE1_TRIAGE')}
              />
              <PhaseTab
                label="Phase 2: Strategic Intel"
                phase="PHASE2_STRATEGIC_INTEL"
                count={phaseStats.PHASE2_STRATEGIC_INTEL.total}
                completed={phaseStats.PHASE2_STRATEGIC_INTEL.completed}
                isActive={selectedPhase === 'PHASE2_STRATEGIC_INTEL'}
                onClick={() => setSelectedPhase('PHASE2_STRATEGIC_INTEL')}
              />
              <PhaseTab
                label="Phase 3: Win Strategy"
                phase="PHASE3_WIN_STRATEGY"
                count={phaseStats.PHASE3_WIN_STRATEGY.total}
                completed={phaseStats.PHASE3_WIN_STRATEGY.completed}
                isActive={selectedPhase === 'PHASE3_WIN_STRATEGY'}
                onClick={() => setSelectedPhase('PHASE3_WIN_STRATEGY')}
              />
            </nav>
          </div>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => setSelectedTask(task.id)}
            />
          ))}
        </div>

        {/* Task Detail Modal */}
        {selectedTask && (
          <TaskDetailModal
            taskId={selectedTask}
            projectId={id}
            onClose={() => setSelectedTask(null)}
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
              <span className="text-sm text-gray-400">|</span>
            )}
            {projectTitle && (
              <span className="text-sm font-medium text-gray-900">
                {projectTitle}
              </span>
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

function PhaseTab({
  label,
  phase,
  count,
  completed,
  isActive,
  onClick,
}: {
  label: string;
  phase: string;
  count: number;
  completed: number;
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
      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
    >
      {label}
      <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
        {completed}/{count}
      </span>
    </button>
  );
}

function TaskCard({
  task,
  onClick,
}: {
  task: any;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-4 flex-1">
          {/* Task Number Badge */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <span className="text-lg font-bold text-purple-600">
              {task.taskNumber}
            </span>
          </div>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {task.taskName}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span className="font-medium">Primary AI:</span>
                <AIBadge provider={task.primaryAI} />
              </span>
              {task.secondaryAI && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">Secondary:</span>
                  <AIBadge provider={task.secondaryAI} />
                </span>
              )}
              {task.requiresMultiAI && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Multi-AI
                </span>
              )}
              {task.requiresHumanValidation && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  Needs Review
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <StatusBadge status={task.status} />
      </div>

      {/* Progress Info */}
      {task.status === 'PROCESSING' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className="text-sm text-gray-600">Processing...</span>
          </div>
        </div>
      )}

      {task.status === 'COMPLETED' && task.confidenceScore && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Confidence Score</span>
            <span className={`text-sm font-semibold ${
              task.confidenceScore >= 80 ? 'text-green-600' :
              task.confidenceScore >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {task.confidenceScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                task.confidenceScore >= 80 ? 'bg-green-600' :
                task.confidenceScore >= 60 ? 'bg-yellow-600' :
                'bg-red-600'
              }`}
              style={{ width: `${task.confidenceScore}%` }}
            ></div>
          </div>
        </div>
      )}

      {task.status === 'ESCALATED_TO_HUMAN' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-orange-600">
            <span className="text-lg">⚠️</span>
            <span className="text-sm font-medium">
              Awaiting human expert review
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    ESCALATED_TO_HUMAN: 'bg-orange-100 text-orange-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
        colors[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function AIBadge({ provider }: { provider: string }) {
  const colors: Record<string, string> = {
    OPENAI: 'bg-emerald-100 text-emerald-800',
    CLAUDE: 'bg-purple-100 text-purple-800',
    GEMINI: 'bg-blue-100 text-blue-800',
    GROK: 'bg-gray-100 text-gray-800',
  };

  const labels: Record<string, string> = {
    OPENAI: 'GPT-5',
    CLAUDE: 'Claude',
    GEMINI: 'Gemini',
    GROK: 'Grok',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        colors[provider] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {labels[provider] || provider}
    </span>
  );
}

function TaskDetailModal({
  taskId,
  projectId,
  onClose,
}: {
  taskId: string;
  projectId: string;
  onClose: () => void;
}) {
  const { data: tasks } = trpc.sdl.getTasks.useQuery({ projectId });
  const task = tasks?.find((t) => t.id === taskId);

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Task #{task.taskNumber}: {task.taskName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {task.taskPhase.replace(/_/g, ' ')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
              <StatusBadge status={task.status} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Confidence</p>
              <p className="text-2xl font-bold text-gray-900">
                {task.confidenceScore ? `${task.confidenceScore}%` : 'N/A'}
              </p>
            </div>
          </div>

          {/* AI Configuration */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">AI Configuration</p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Primary AI</span>
                <AIBadge provider={task.primaryAI} />
              </div>
              {task.secondaryAI && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Secondary AI</span>
                  <AIBadge provider={task.secondaryAI} />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Multi-AI Consensus</span>
                <span className="text-sm font-medium">
                  {task.requiresMultiAI ? 'Required' : 'Not Required'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Human Validation</span>
                <span className="text-sm font-medium">
                  {task.requiresHumanValidation ? 'Required' : 'Not Required'}
                </span>
              </div>
            </div>
          </div>

          {/* Results */}
          {task.primaryResult && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Primary Result</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                  {JSON.stringify(task.primaryResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {task.secondaryResult && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Secondary Result</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                  {JSON.stringify(task.secondaryResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {task.consensusResult && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Consensus Result</p>
              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                  {JSON.stringify(task.consensusResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Error Message */}
          {task.errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800 mb-1">Error</p>
              <p className="text-sm text-red-700">{task.errorMessage}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            {task.startedAt && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Started At
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(task.startedAt).toLocaleString()}
                </p>
              </div>
            )}
            {task.completedAt && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Completed At
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(task.completedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
