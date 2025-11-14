/**
 * Super Admin - Deliverables Review Queue
 *
 * Review and approve/reject submitted deliverables
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { useState } from 'react';

export default function DeliverablesReviewPage() {
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null);

  const { data: deliverables, isLoading, refetch } = trpc.deliverable.pendingReview.useQuery({
    limit: 100,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Deliverables Review Queue
          </h1>
          <p className="text-gray-600">
            Review and approve submitted deliverables from team members
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            label="Pending Review"
            value={deliverables?.length || 0}
            icon="📋"
            color="yellow"
          />
          <StatsCard
            label="Awaiting Action"
            value={deliverables?.length || 0}
            icon="⏰"
            color="orange"
          />
          <StatsCard
            label="This Week"
            value={
              deliverables?.filter((d) => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(d.submittedAt) > weekAgo;
              }).length || 0
            }
            icon="📊"
            color="blue"
          />
        </div>

        {/* Deliverables List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Deliverables ({deliverables?.length || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading deliverables...</p>
            </div>
          ) : deliverables && deliverables.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {deliverables.map((deliverable) => (
                <DeliverableCard
                  key={deliverable.id}
                  deliverable={deliverable}
                  onClick={() => setSelectedDeliverable(deliverable.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-600">
                No deliverables pending review at the moment
              </p>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedDeliverable && (
          <ReviewModal
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
  color: 'yellow' | 'orange' | 'blue';
}) {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200',
    orange: 'bg-orange-50 border-orange-200',
    blue: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg shadow-sm p-6 border`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
}

function DeliverableCard({
  deliverable,
  onClick,
}: {
  deliverable: any;
  onClick: () => void;
}) {
  const daysWaiting = Math.floor(
    (Date.now() - new Date(deliverable.submittedAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div
      onClick={onClick}
      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📦</span>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {deliverable.title}
              </h3>
              <p className="text-sm text-gray-600">
                {deliverable.project.projectCodename ||
                  deliverable.project.title}
              </p>
            </div>
            {daysWaiting >= 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                ⚠️ {daysWaiting} days waiting
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
            <span>
              👤 {deliverable.submittedBy.name}
            </span>
            <span>
              📋 {deliverable.deliverableType.replace(/_/g, ' ')}
            </span>
            <span>
              📄 {deliverable.fileName}
            </span>
            <span>
              📅 {new Date(deliverable.submittedAt).toLocaleDateString()}
            </span>
            <span>
              📦 {((deliverable.fileSize || 0) / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>

          {deliverable.description && (
            <p className="text-sm text-gray-700 mb-3">
              {deliverable.description}
            </p>
          )}

          {/* AI Quality Score Preview */}
          {deliverable.qualityScore && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">AI Quality Score:</span>
              <span
                className={`text-sm font-semibold ${
                  deliverable.qualityScore >= 80
                    ? 'text-green-600'
                    : deliverable.qualityScore >= 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {deliverable.qualityScore}%
              </span>
            </div>
          )}
        </div>

        <button className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          Review
        </button>
      </div>
    </div>
  );
}

function ReviewModal({
  deliverableId,
  onClose,
  onSuccess,
}: {
  deliverableId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [decision, setDecision] = useState<'APPROVED' | 'NEEDS_REVISION' | 'REJECTED' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [qualityScore, setQualityScore] = useState('');

  const { data: deliverable } = trpc.deliverable.getById.useQuery({
    id: deliverableId,
  });

  const reviewMutation = trpc.deliverable.review.useMutation({
    onSuccess: () => {
      alert('Review submitted successfully!');
      onSuccess();
    },
  });

  const handleSubmit = () => {
    if (!decision) {
      alert('Please select a decision');
      return;
    }

    reviewMutation.mutate({
      id: deliverableId,
      status: decision,
      reviewerFeedback: feedback || undefined,
      qualityScore: qualityScore ? parseInt(qualityScore) : undefined,
    });
  };

  if (!deliverable) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Review Deliverable
            </h3>
            <p className="text-sm text-gray-600 mt-1">{deliverable.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Deliverable Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <InfoItem label="Submitted By" value={deliverable.submittedBy.name} />
            <InfoItem
              label="Submitted At"
              value={new Date(deliverable.submittedAt).toLocaleString()}
            />
            <InfoItem label="Type" value={deliverable.deliverableType.replace(/_/g, ' ')} />
            <InfoItem label="File" value={deliverable.fileName} />
            <InfoItem
              label="Size"
              value={`${((deliverable.fileSize || 0) / 1024 / 1024).toFixed(2)} MB`}
            />
            <InfoItem
              label="Project"
              value={deliverable.project.projectCodename || deliverable.project.title}
            />
          </div>

          {/* Description */}
          {deliverable.description && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">
                {deliverable.description}
              </p>
            </div>
          )}

          {/* AI Quality Score */}
          {deliverable.qualityScore && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                AI Quality Assessment
              </p>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-2xl">🤖</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">
                    AI Quality Score: {deliverable.qualityScore}%
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${deliverable.qualityScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Download Button */}
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            📥 Download File
          </button>

          {/* Decision */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Your Decision</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setDecision('APPROVED')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  decision === 'APPROVED'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900 mb-1">✅ Approve</p>
                <p className="text-xs text-gray-600">Ready for client</p>
              </button>

              <button
                onClick={() => setDecision('NEEDS_REVISION')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  decision === 'NEEDS_REVISION'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900 mb-1">🔄 Revise</p>
                <p className="text-xs text-gray-600">Request changes</p>
              </button>

              <button
                onClick={() => setDecision('REJECTED')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  decision === 'REJECTED'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900 mb-1">❌ Reject</p>
                <p className="text-xs text-gray-600">Does not meet standards</p>
              </button>
            </div>
          </div>

          {/* Quality Score Override */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality Score (0-100)
            </label>
            <input
              type="number"
              value={qualityScore}
              onChange={(e) => setQualityScore(e.target.value)}
              min="0"
              max="100"
              placeholder={deliverable.qualityScore?.toString() || "Enter score"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Override AI score or provide your own assessment
            </p>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback for Team Member
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Provide detailed feedback..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              disabled={!decision || reviewMutation.isLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reviewMutation.isLoading ? 'Submitting...' : 'Submit Review'}
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
