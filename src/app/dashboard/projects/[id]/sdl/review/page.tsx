/**
 * SDL Human Review Interface
 *
 * Interface for human experts to:
 * 1. Review consensus conflicts (SPLIT_DECISION, LOW_CONFIDENCE, MAJORITY_CONSENSUS)
 * 2. Adjudicate disagreements between multiple AIs
 * 3. Validate critical decisions (win/no-bid, win themes, differentiators)
 * 4. Provide expert judgment on strategic insights
 *
 * This is a critical component of the multi-AI consensus system,
 * ensuring human expertise guides final decisions.
 */

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { ConsensusType, AIProvider } from '@prisma/client';

export default function SDLReviewPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [adjudicationNotes, setAdjudicationNotes] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<string>('');

  // Fetch logs requiring human review
  const { data: logs, isLoading, refetch } = trpc.sdl.getLogsRequiringReview.useQuery({
    projectId,
  });

  // Fetch project details
  const { data: project } = trpc.project.getById.useQuery({ id: projectId });

  // Submit adjudication mutation
  const submitAdjudication = trpc.sdl.submitAdjudication.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedLogId(null);
      setAdjudicationNotes('');
      setSelectedDecision('');
    },
  });

  const selectedLog = logs?.find((l) => l.id === selectedLogId);

  const getConsensusTypeColor = (type: ConsensusType) => {
    switch (type) {
      case ConsensusType.FULL_CONSENSUS:
        return 'bg-green-100 text-green-800 border-green-200';
      case ConsensusType.MAJORITY_CONSENSUS:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ConsensusType.SPLIT_DECISION:
        return 'bg-red-100 text-red-800 border-red-200';
      case ConsensusType.LOW_CONFIDENCE:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConsensusTypeBadge = (type: ConsensusType) => {
    const color = getConsensusTypeColor(type);
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${color}`}>{type}</span>
    );
  };

  const getProviderBadge = (provider: AIProvider) => {
    const colors = {
      OPENAI: 'bg-emerald-100 text-emerald-800',
      CLAUDE: 'bg-purple-100 text-purple-800',
      GEMINI: 'bg-blue-100 text-blue-800',
      GROK: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[provider]}`}>
        {provider}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consensus logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SDL Human Review</h1>
              <p className="mt-1 text-sm text-gray-500">
                Review and adjudicate AI consensus conflicts for {project?.title}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Pending Reviews</p>
                <p className="text-2xl font-bold text-red-600">{logs?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {logs && logs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">All Clear!</h2>
            <p className="text-gray-600">
              No consensus conflicts require human review at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - List of Logs */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Consensus Conflicts ({logs?.length})
              </h2>
              <div className="space-y-3">
                {logs?.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedLogId === log.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Task {log.sdlTask.taskNumber}
                      </span>
                      {getConsensusTypeBadge(log.consensusType)}
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-2">{log.taskName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {log.consensusConfidence}% confidence
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel - Selected Log Details */}
            <div className="lg:col-span-2">
              {selectedLog ? (
                <div className="bg-white rounded-lg shadow">
                  {/* Header */}
                  <div className="border-b border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Task {selectedLog.sdlTask.taskNumber}: {selectedLog.taskName}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Created {new Date(selectedLog.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {getConsensusTypeBadge(selectedLog.consensusType)}
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Confidence:</span>
                        <span className="ml-2 text-lg font-semibold text-gray-900">
                          {selectedLog.consensusConfidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Outputs */}
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Outputs</h3>

                      {/* GPT-4 Output */}
                      {selectedLog.gpt5Output && (
                        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-emerald-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">OpenAI GPT-4</span>
                              {getProviderBadge(AIProvider.OPENAI)}
                            </div>
                          </div>
                          <div className="p-4 bg-white">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                              {JSON.stringify(selectedLog.gpt5Output, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Claude Output */}
                      {selectedLog.claudeOutput && (
                        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">Claude</span>
                              {getProviderBadge(AIProvider.CLAUDE)}
                            </div>
                          </div>
                          <div className="p-4 bg-white">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                              {JSON.stringify(selectedLog.claudeOutput, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Gemini Output */}
                      {selectedLog.geminiOutput && (
                        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">Gemini</span>
                              {getProviderBadge(AIProvider.GEMINI)}
                            </div>
                          </div>
                          <div className="p-4 bg-white">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                              {JSON.stringify(selectedLog.geminiOutput, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Consensus Result */}
                    {selectedLog.finalResult && (
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Consensus Analysis
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                            {JSON.stringify(selectedLog.finalResult, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Adjudication Form */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Human Adjudication
                      </h3>

                      <div className="space-y-4">
                        {/* Decision Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Final Decision
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            <button
                              onClick={() =>
                                setSelectedDecision(JSON.stringify(selectedLog.gpt5Output))
                              }
                              className={`p-4 text-left border-2 rounded-lg transition-all ${
                                selectedDecision === JSON.stringify(selectedLog.gpt5Output)
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  Adopt GPT-4 Output
                                </span>
                                {getProviderBadge(AIProvider.OPENAI)}
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                setSelectedDecision(JSON.stringify(selectedLog.claudeOutput))
                              }
                              className={`p-4 text-left border-2 rounded-lg transition-all ${
                                selectedDecision === JSON.stringify(selectedLog.claudeOutput)
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  Adopt Claude Output
                                </span>
                                {getProviderBadge(AIProvider.CLAUDE)}
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                setSelectedDecision(JSON.stringify(selectedLog.geminiOutput))
                              }
                              className={`p-4 text-left border-2 rounded-lg transition-all ${
                                selectedDecision === JSON.stringify(selectedLog.geminiOutput)
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  Adopt Gemini Output
                                </span>
                                {getProviderBadge(AIProvider.GEMINI)}
                              </div>
                            </button>
                            <button
                              onClick={() => setSelectedDecision('CUSTOM')}
                              className={`p-4 text-left border-2 rounded-lg transition-all ${
                                selectedDecision === 'CUSTOM'
                                  ? 'border-gray-700 bg-gray-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="font-medium text-gray-900">
                                Provide Custom Decision
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adjudication Notes (Required)
                          </label>
                          <textarea
                            value={adjudicationNotes}
                            onChange={(e) => setAdjudicationNotes(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Explain your reasoning for this decision. Why did you choose this output over the others? What additional context or expertise informed your decision?"
                          />
                        </div>

                        {/* Custom Decision Input */}
                        {selectedDecision === 'CUSTOM' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Custom Decision (JSON)
                            </label>
                            <textarea
                              rows={8}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                              placeholder='{"your": "custom decision here"}'
                            />
                          </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                          <button
                            onClick={() => {
                              setSelectedLogId(null);
                              setAdjudicationNotes('');
                              setSelectedDecision('');
                            }}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (!selectedDecision || !adjudicationNotes.trim()) {
                                alert('Please select a decision and provide notes');
                                return;
                              }
                              submitAdjudication.mutate({
                                consensusLogId: selectedLog.id,
                                decision:
                                  selectedDecision === 'CUSTOM'
                                    ? selectedDecision
                                    : JSON.parse(selectedDecision),
                                notes: adjudicationNotes,
                              });
                            }}
                            disabled={!selectedDecision || !adjudicationNotes.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            Submit Adjudication
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Consensus Conflict
                  </h2>
                  <p className="text-gray-600">
                    Choose a log from the list on the left to review and adjudicate.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
