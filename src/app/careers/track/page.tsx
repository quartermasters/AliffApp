/**
 * Application Tracking Page
 *
 * Allows candidates to track their application status
 * Features:
 * - Real-time status updates
 * - Timeline visualization
 * - Interview link (if applicable)
 * - Next steps guidance
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, XCircle, Loader, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface TimelineStep {
  step: string;
  status: 'completed' | 'in_progress' | 'pending' | 'skipped';
  date: string | null;
}

interface ApplicationStatus {
  applicationNumber: string;
  submittedAt: string;
  candidateName: string;
  jobTitle: string;
  status: string;
  fitScore: number;
  nextStep: string;
  shouldInterview: boolean;
  interviewCompleted: boolean;
  interviewScore?: number;
  timeline: TimelineStep[];
}

export default function ApplicationTrackingPage() {
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get('id');

  const [applicationId, setApplicationId] = useState(idFromUrl || '');
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch status on load if ID in URL
  useEffect(() => {
    if (idFromUrl) {
      fetchApplicationStatus(idFromUrl);
    }
  }, [idFromUrl]);

  const fetchApplicationStatus = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/applications/${id}/status`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch application status');
      }

      setApplicationStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch application status');
      setApplicationStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (applicationId.trim()) {
      fetchApplicationStatus(applicationId.trim());
    }
  };

  const getStatusIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in_progress':
        return <Loader className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-gray-400" />;
      case 'skipped':
        return <XCircle className="w-6 h-6 text-gray-300" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'in_progress':
        return 'bg-blue-600';
      case 'pending':
        return 'bg-gray-300';
      case 'skipped':
        return 'bg-gray-200';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Application
          </h1>
          <p className="text-lg text-gray-600">
            Enter your application number to check the status
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700 mb-2">
                Application Number
              </label>
              <input
                id="applicationId"
                type="text"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                placeholder="Enter your application ID or number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading || !applicationId.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                {isLoading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Application Status */}
        {applicationStatus && (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {applicationStatus.jobTitle}
                  </h2>
                  <p className="text-gray-600">
                    Application #{applicationStatus.applicationNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Submitted</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(applicationStatus.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Fit Score */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Fit Score</p>
                    <p className="text-4xl font-bold text-blue-600">
                      {applicationStatus.fitScore}/100
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {applicationStatus.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interview Invitation */}
              {applicationStatus.shouldInterview && !applicationStatus.interviewCompleted && (
                <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <MessageSquare className="w-6 h-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        You're Invited to an AI Interview!
                      </h3>
                      <p className="text-sm text-blue-700 mb-4">
                        Based on your excellent fit score, you're invited to complete a 15-minute AI-powered interview. This is the next step in your application process.
                      </p>
                      <Link
                        href={`/careers/interview?id=${applicationId}`}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Start Interview Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Interview Completed */}
              {applicationStatus.interviewCompleted && (
                <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2">
                        Interview Completed!
                      </h3>
                      <p className="text-sm text-green-700">
                        You scored <span className="font-bold">{applicationStatus.interviewScore}/100</span> on your AI interview. Our team is now reviewing your application.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-6">Application Timeline</h3>

                <div className="space-y-6">
                  {applicationStatus.timeline.map((step, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                      {/* Connector Line */}
                      {index < applicationStatus.timeline.length - 1 && (
                        <div
                          className={`absolute left-3 top-12 w-0.5 h-12 ${getStatusColor(
                            step.status
                          )}`}
                        ></div>
                      )}

                      {/* Icon */}
                      <div className="flex-shrink-0">{getStatusIcon(step.status)}</div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <h4 className="font-semibold text-gray-900">{step.step}</h4>
                        {step.date && (
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(step.date).toLocaleString()}
                          </p>
                        )}
                        {step.status === 'in_progress' && (
                          <p className="text-sm text-blue-600 mt-1 font-medium">
                            In progress...
                          </p>
                        )}
                        {step.status === 'skipped' && (
                          <p className="text-sm text-gray-500 mt-1">Skipped</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>

              <div className="space-y-2 text-sm text-gray-700">
                {applicationStatus.nextStep === 'INTERVIEW' && !applicationStatus.interviewCompleted && (
                  <p>
                    → <span className="font-medium">Complete your AI interview</span> using the link above
                  </p>
                )}
                {applicationStatus.nextStep === 'EVALUATION' && (
                  <p>
                    → <span className="font-medium">Our team is reviewing</span> your interview and application
                  </p>
                )}
                {applicationStatus.nextStep === 'REVIEW' && (
                  <p>
                    → <span className="font-medium">Application under review</span> - We'll contact you within 5 business days
                  </p>
                )}
                <p>
                  → <span className="font-medium">Check your email</span> for updates and next steps
                </p>
                <p>
                  → <span className="font-medium">Track your application</span> anytime with your application number
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">Need help?</p>
          <a
            href="mailto:hr@aliffcapital.com"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact us at hr@aliffcapital.com
          </a>
        </div>
      </div>
    </div>
  );
}
