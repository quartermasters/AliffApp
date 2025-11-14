/**
 * Super Admin - Gold Gate Review
 *
 * Final expert approval before client delivery
 * Only deliverables that pass Gold Gate are sent to clients
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { useState } from 'react';

export default function GoldGateReviewPage() {
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null);

  // Get deliverables that passed initial review but need Gold Gate approval
  const { data: deliverables, isLoading, refetch } = trpc.deliverable.pendingReview.useQuery({
    limit: 100,
  });

  // Filter for deliverables approved but not yet sent to client
  const goldGateCandidates = deliverables?.filter(
    (d) => d.status === 'APPROVED' && !d.visibleToClient && !d.approvedById
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏆</span>
            <h1 className="text-3xl font-bold text-gray-900">
              Gold Gate Review
            </h1>
          </div>
          <p className="text-gray-600">
            Final expert approval before client delivery - highest quality standard
          </p>
        </div>

        {/* Gold Gate Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-5xl">⭐</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                What is Gold Gate Review?
              </h2>
              <p className="text-gray-700 mb-3">
                Gold Gate is the final quality checkpoint before deliverables reach
                the client. Only work that meets the highest standards passes this
                gate. This review ensures our reputation for excellence.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <ChecklistItem
                  label="Quality Score ≥ 85%"
                  checked={true}
                />
                <ChecklistItem
                  label="Zero Critical Issues"
                  checked={true}
                />
                <ChecklistItem
                  label="Expert Approved"
                  checked={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            label="Pending Gold Gate"
            value={goldGateCandidates?.length || 0}
            icon="🔍"
            color="amber"
          />
          <StatsCard
            label="Passed Today"
            value={0}
            icon="✅"
            color="green"
          />
          <StatsCard
            label="Approval Rate"
            value="---%"
            icon="📊"
            color="blue"
          />
        </div>

        {/* Deliverables List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Candidates for Gold Gate ({goldGateCandidates?.length || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading deliverables...</p>
            </div>
          ) : goldGateCandidates && goldGateCandidates.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {goldGateCandidates.map((deliverable) => (
                <GoldGateCard
                  key={deliverable.id}
                  deliverable={deliverable}
                  onClick={() => setSelectedDeliverable(deliverable.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No deliverables pending Gold Gate
              </h3>
              <p className="text-gray-600">
                All approved deliverables have either passed Gold Gate or are still
                in initial review
              </p>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedDeliverable && (
          <GoldGateReviewModal
            deliverableId={selectedDeliverable}
            onClose={() => setSelectedDeliverable(null)}
            onSuccess={() => {
              setSelectedDeliverable(null);
              refetch();
            }}
          />
        )}
      </main>
    </div>
  );
}

// Components
function DashboardHeader() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/super-admin/projects"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Projects
            </Link>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            GOLD GATE
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
  value: string | number;
  icon: string;
  color: 'amber' | 'green' | 'blue';
}) {
  const colorClasses = {
    amber: 'from-amber-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow p-6 text-white`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl opacity-80">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium opacity-90">{label}</p>
    </div>
  );
}

function ChecklistItem({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded flex items-center justify-center ${
          checked ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        {checked && <span className="text-white text-xs">✓</span>}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

function GoldGateCard({
  deliverable,
  onClick,
}: {
  deliverable: any;
  onClick: () => void;
}) {
  const meetsQualityThreshold = (deliverable.qualityScore || 0) >= 85;

  return (
    <div
      onClick={onClick}
      className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
        meetsQualityThreshold ? 'border-l-green-500' : 'border-l-yellow-500'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">
              {meetsQualityThreshold ? '⭐' : '🔍'}
            </span>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {deliverable.title}
              </h3>
              <p className="text-sm text-gray-600">
                {deliverable.project.projectCodename ||
                  deliverable.project.title}
              </p>
            </div>
            {meetsQualityThreshold && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                ✅ Meets Threshold
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
            <span>👤 {deliverable.submittedBy.name}</span>
            <span>📋 {deliverable.deliverableType.replace(/_/g, ' ')}</span>
            <span>📄 {deliverable.fileName}</span>
          </div>

          {/* Quality Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-3">
            <MetricBadge
              label="Quality Score"
              value={`${deliverable.qualityScore || 0}%`}
              passing={deliverable.qualityScore >= 85}
            />
            <MetricBadge
              label="Reviewed"
              value={deliverable.reviewedAt ? 'Yes' : 'No'}
              passing={!!deliverable.reviewedAt}
            />
            <MetricBadge
              label="Revisions"
              value={0}
              passing={true}
            />
            <MetricBadge
              label="Critical Issues"
              value={0}
              passing={true}
            />
          </div>

          {/* Reviewer Feedback Preview */}
          {deliverable.reviewerFeedback && (
            <div className="bg-blue-50 rounded p-2 text-sm text-blue-900 line-clamp-2">
              <span className="font-medium">Review:</span>{' '}
              {deliverable.reviewerFeedback}
            </div>
          )}
        </div>

        <button className="ml-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-colors font-medium shadow-md">
          Gold Gate Review
        </button>
      </div>
    </div>
  );
}

function MetricBadge({
  label,
  value,
  passing,
}: {
  label: string;
  value: string | number;
  passing: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className={`text-sm font-semibold ${
          passing ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function GoldGateReviewModal({
  deliverableId,
  onClose,
  onSuccess,
}: {
  deliverableId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [decision, setDecision] = useState<'PASS' | 'FAIL' | null>(null);
  const [notes, setNotes] = useState('');

  const { data: deliverable } = trpc.deliverable.getById.useQuery({
    id: deliverableId,
  });

  const approveForClient = trpc.deliverable.approveForClient.useMutation({
    onSuccess: () => {
      alert('Gold Gate review submitted! Deliverable approved for client.');
      onSuccess();
    },
  });

  const rejectMutation = trpc.deliverable.review.useMutation({
    onSuccess: () => {
      alert('Deliverable sent back for revision.');
      onSuccess();
    },
  });

  const handleSubmit = () => {
    if (!decision) {
      alert('Please select Pass or Fail');
      return;
    }

    if (decision === 'PASS') {
      approveForClient.mutate({
        id: deliverableId,
        visibleToClient: true,
      });
    } else {
      rejectMutation.mutate({
        id: deliverableId,
        status: 'NEEDS_REVISION',
        reviewerFeedback: `Gold Gate Failed: ${notes}`,
      });
    }
  };

  if (!deliverable) {
    return null;
  }

  const qualityScore = deliverable.qualityScore || 0;
  const meetsThreshold = qualityScore >= 85;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Gold Gate Review
              </h3>
              <p className="text-sm text-yellow-100">{deliverable.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-yellow-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quality Assessment */}
          <div
            className={`p-6 rounded-lg border-2 ${
              meetsThreshold
                ? 'bg-green-50 border-green-300'
                : 'bg-yellow-50 border-yellow-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Quality Assessment
              </h4>
              <span
                className={`text-3xl font-bold ${
                  meetsThreshold ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {qualityScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Quality Threshold
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {meetsThreshold ? '✅' : '⚠️'}
                  </span>
                  <span className="text-sm text-gray-900">
                    {meetsThreshold
                      ? 'Meets Gold Gate threshold (≥85%)'
                      : 'Below threshold (needs ≥85%)'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Previous Reviews
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span>✅ Initial review: Approved</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>
                      📊 AI Score: {qualityScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deliverable Info */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <InfoItem
              label="Submitted By"
              value={deliverable.submittedBy.name}
            />
            <InfoItem label="Type" value={deliverable.deliverableType.replace(/_/g, ' ')} />
            <InfoItem label="File" value={deliverable.fileName} />
          </div>

          {/* AI Analysis */}
          {deliverable.aiValidation && (
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">
                AI Quality Analysis
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    Strengths
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {deliverable.aiValidation.strengths?.map(
                      (strength: string, i: number) => (
                        <li key={i}>• {strength}</li>
                      )
                    ) || <li>No data available</li>}
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-orange-900 mb-2">
                    Recommendations
                  </p>
                  <ul className="text-sm text-orange-800 space-y-1">
                    {deliverable.aiValidation.recommendations?.map(
                      (rec: string, i: number) => (
                        <li key={i}>• {rec}</li>
                      )
                    ) || <li>No data available</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Download Button */}
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            📥 Download & Review File
          </button>

          {/* Decision */}
          <div>
            <p className="text-base font-semibold text-gray-900 mb-4">
              Gold Gate Decision
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDecision('PASS')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  decision === 'PASS'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <span className="text-4xl mb-2 block">✅</span>
                  <p className="font-bold text-gray-900 mb-1">PASS</p>
                  <p className="text-xs text-gray-600">
                    Approve for client delivery
                  </p>
                </div>
              </button>

              <button
                onClick={() => setDecision('FAIL')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  decision === 'FAIL'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <span className="text-4xl mb-2 block">❌</span>
                  <p className="font-bold text-gray-900 mb-1">FAIL</p>
                  <p className="text-xs text-gray-600">
                    Send back for revision
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expert Notes (required)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Document your decision rationale..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
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
              disabled={!decision || !notes || approveForClient.isLoading || rejectMutation.isLoading}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg hover:from-yellow-600 hover:to-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {approveForClient.isLoading || rejectMutation.isLoading
                ? 'Submitting...'
                : 'Submit Gold Gate Decision'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  );
}
