/**
 * Multi-AI Consensus Review Interface
 *
 * Human expert review of tasks that require consensus validation
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { use, useState } from 'react';

export default function ConsensusReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'APPROVE' | 'OVERRIDE' | null>(null);
  const [overrideNotes, setOverrideNotes] = useState('');

  const { data: project } = trpc.project.getById.useQuery({ id });
  const { data: tasks, isLoading } = trpc.sdl.getTasks.useQuery({ projectId: id });

  // Filter tasks that need human review
  const tasksNeedingReview = tasks?.filter(
    (t) => t.status === 'ESCALATED_TO_HUMAN' && t.requiresHumanValidation
  );

  const selectedTask = tasks?.find((t) => t.id === selectedTaskId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader projectId={id} projectTitle={project?.title} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading consensus tasks...</p>
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
            Multi-AI Consensus Review
          </h1>
          <p className="text-gray-600">
            Review tasks where AI consensus was inconclusive or low confidence
          </p>
        </div>

        {/* Alert Banner */}
        {tasksNeedingReview && tasksNeedingReview.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-orange-800">
                  {tasksNeedingReview.length} task(s) require expert review
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  These tasks have been escalated due to low confidence or
                  conflicting AI outputs
                </p>
              </div>
            </div>
          </div>
        )}

        {tasksNeedingReview && tasksNeedingReview.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All Clear!
            </h2>
            <p className="text-gray-600">
              No tasks currently require human expert review
            </p>
            <Link
              href={`/dashboard/super-admin/projects/${id}/sdl-tasks`}
              className="inline-block mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              View All SDL Tasks
            </Link>
          </div>
        )}

        {/* Tasks Grid */}
        {tasksNeedingReview && tasksNeedingReview.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {tasksNeedingReview.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTaskId(task.id)}
              />
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedTask && (
          <ReviewModal
            task={selectedTask}
            projectId={id}
            onClose={() => {
              setSelectedTaskId(null);
              setReviewDecision(null);
              setOverrideNotes('');
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

function TaskCard({ task, onClick }: { task: any; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-orange-500"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
              {task.taskNumber}
            </span>
            <h3 className="text-lg font-semibold text-gray-900">
              {task.taskName}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {task.taskPhase.replace(/_/g, ' ')}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Primary:</span>
              <AIBadge provider={task.primaryAI} />
            </div>
            {task.secondaryAI && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Secondary:</span>
                <AIBadge provider={task.secondaryAI} />
              </div>
            )}
            {task.confidenceScore && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Confidence:</span>
                <span className="font-semibold text-orange-600">
                  {task.confidenceScore}%
                </span>
              </div>
            )}
          </div>
        </div>

        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
          Review
        </button>
      </div>
    </div>
  );
}

function ReviewModal({
  task,
  projectId,
  onClose,
}: {
  task: any;
  projectId: string;
  onClose: () => void;
}) {
  const [decision, setDecision] = useState<'APPROVE' | 'OVERRIDE' | null>(null);
  const [selectedResult, setSelectedResult] = useState<'PRIMARY' | 'SECONDARY' | 'CUSTOM'>('PRIMARY');
  const [customResult, setCustomResult] = useState('');
  const [notes, setNotes] = useState('');

  const utils = trpc.useUtils();
  const updateTask = trpc.sdl.updateTaskResult.useMutation({
    onSuccess: () => {
      alert('Task review submitted successfully!');
      utils.sdl.getTasks.invalidate({ projectId });
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!decision) {
      alert('Please select a decision');
      return;
    }

    if (decision === 'APPROVE') {
      // Approve the consensus result
      updateTask.mutate({
        taskId: task.id,
        primaryResult: task.consensusResult || task.primaryResult,
        confidenceScore: task.confidenceScore || 75,
        status: 'COMPLETED',
      });
    } else if (decision === 'OVERRIDE') {
      // Override with selected result
      let finalResult;
      if (selectedResult === 'PRIMARY') {
        finalResult = task.primaryResult;
      } else if (selectedResult === 'SECONDARY') {
        finalResult = task.secondaryResult;
      } else {
        try {
          finalResult = JSON.parse(customResult);
        } catch (e) {
          alert('Invalid JSON in custom result');
          return;
        }
      }

      updateTask.mutate({
        taskId: task.id,
        primaryResult: finalResult,
        confidenceScore: 100, // Expert override = 100% confidence
        status: 'COMPLETED',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Review Task #{task.taskNumber}: {task.taskName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Multi-AI consensus review required
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Outputs Comparison */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              AI Outputs Comparison
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Primary AI Output */}
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Primary AI</p>
                    <AIBadge provider={task.primaryAI} />
                  </div>
                  <button
                    onClick={() => setSelectedResult('PRIMARY')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedResult === 'PRIMARY'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-purple-600 border border-purple-600'
                    }`}
                  >
                    Select
                  </button>
                </div>
                <div className="bg-white rounded p-3 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                    {JSON.stringify(task.primaryResult, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Secondary AI Output */}
              {task.secondaryResult && (
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Secondary AI</p>
                      <AIBadge provider={task.secondaryAI} />
                    </div>
                    <button
                      onClick={() => setSelectedResult('SECONDARY')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedResult === 'SECONDARY'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-blue-600 border border-blue-600'
                      }`}
                    >
                      Select
                    </button>
                  </div>
                  <div className="bg-white rounded p-3 max-h-64 overflow-y-auto">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                      {JSON.stringify(task.secondaryResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Consensus Analysis */}
          {task.consensusResult && (
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">
                AI Consensus Analysis
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Confidence Score:
                    </span>
                    <span className={`text-lg font-bold ${
                      task.confidenceScore >= 70 ? 'text-green-600' :
                      task.confidenceScore >= 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {task.confidenceScore}%
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded p-3 max-h-48 overflow-y-auto">
                  <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                    {JSON.stringify(task.consensusResult, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Decision Section */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              Expert Decision
            </h4>
            <div className="space-y-4">
              {/* Decision Radio Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDecision('APPROVE')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    decision === 'APPROVE'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      decision === 'APPROVE' ? 'border-green-500' : 'border-gray-300'
                    }`}>
                      {decision === 'APPROVE' && (
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">
                        Approve Consensus
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Accept the AI consensus result as-is
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setDecision('OVERRIDE')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    decision === 'OVERRIDE'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      decision === 'OVERRIDE' ? 'border-orange-500' : 'border-gray-300'
                    }`}>
                      {decision === 'OVERRIDE' && (
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Override</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Select or provide custom result
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Custom Result Input (shown when OVERRIDE selected) */}
              {decision === 'OVERRIDE' && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedResult('CUSTOM')}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        selectedResult === 'CUSTOM'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                    >
                      Custom Result
                    </button>
                  </div>
                  {selectedResult === 'CUSTOM' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom JSON Result
                      </label>
                      <textarea
                        value={customResult}
                        onChange={(e) => setCustomResult(e.target.value)}
                        placeholder='{"analysis": "your custom analysis here"}'
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes (required)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Explain your decision rationale..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!decision || !notes || updateTask.isPending}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateTask.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
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
