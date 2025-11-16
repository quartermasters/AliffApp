/**
 * Application Success Page
 *
 * Shown after successful application submission
 * Features:
 * - Confirmation message
 * - Application number
 * - Fit score display
 * - Next steps timeline
 * - Interview invitation (if applicable)
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { CheckCircle, Clock, Mail, MessageSquare, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ApplicationData {
  applicationNumber: string;
  submittedAt: string;
  fitScore: number;
  nextStep: string;
  shouldInterview: boolean;
  candidateName: string;
  jobTitle: string;
}

function ApplicationSuccessContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('id');

  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) {
      setError('Application ID not found');
      setIsLoading(false);
      return;
    }

    // Fetch application data
    fetch(`/api/applications/${applicationId}/status`)
      .then((res) => res.json())
      .then((data) => {
        setApplicationData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch application data:', err);
        setError('Failed to load application data');
        setIsLoading(false);
      });
  }, [applicationId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
          <Link
            href="/careers"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  const data = applicationData!;
  const fitScoreColor =
    data.fitScore >= 80 ? 'text-green-600' :
    data.fitScore >= 60 ? 'text-blue-600' :
    data.fitScore >= 40 ? 'text-yellow-600' :
    'text-gray-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for applying to the <span className="font-semibold">{data.jobTitle}</span> position
          </p>
        </div>

        {/* Application Info Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Application #</p>
              <p className="text-lg font-bold text-gray-900">{data.applicationNumber}</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Fit Score</p>
              <p className={`text-lg font-bold ${fitScoreColor}`}>{data.fitScore}/100</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Submitted</p>
              <p className="text-lg font-bold text-gray-900">
                {new Date(data.submittedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>

            {data.shouldInterview ? (
              // High fit score - AI interview path
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <MessageSquare className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      You're Invited to an AI Interview!
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Based on your excellent fit score, you're invited to complete a 15-minute AI-powered interview with ALIFF, our intelligent interviewer.
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

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <p><span className="font-medium">AI Interview (15 min)</span> - Complete your interview at your convenience</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <p><span className="font-medium">Multi-AI Evaluation</span> - Your interview will be evaluated by three AI models</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <p><span className="font-medium">Human Review (24-48 hours)</span> - Our team reviews top candidates</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">4.</span>
                    <p><span className="font-medium">Next Steps</span> - Qualified candidates are contacted for traditional interviews</p>
                  </div>
                </div>
              </div>
            ) : (
              // Moderate/low fit score - standard review path
              <div className="space-y-4">
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <p><span className="font-medium">Application Review (2-5 business days)</span> - Our team will review your application</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <p><span className="font-medium">Confirmation Email</span> - You'll receive an email confirmation within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <p><span className="font-medium">Interview Invitation</span> - Qualified candidates will be invited to interview</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">4.</span>
                    <p><span className="font-medium">Talent Pool</span> - All applicants are added to our talent pool for future opportunities</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                  <p className="text-sm text-green-800">
                    <span className="font-semibold">Good news!</span> Even if this specific role isn't a perfect match, you've been added to our CV Bank and will be considered for future opportunities that match your skills and experience.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email to your inbox. If you don't see it within a few minutes, please check your spam folder or chat with ALIFF using the widget for assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Track Application */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg shadow-lg p-8 text-white text-center mb-8">
          <h3 className="text-2xl font-bold mb-3">Track Your Application</h3>
          <p className="mb-6">
            You can check the status of your application anytime using your application number
          </p>
          <Link
            href={`/careers/track?id=${applicationId}`}
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Track Application Status
          </Link>
        </div>

        {/* Next Steps */}
        <div className="text-center">
          <Link
            href="/careers"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Careers
          </Link>
          <span className="mx-4 text-gray-400">|</span>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your application...</p>
          </div>
        </div>
      }
    >
      <ApplicationSuccessContent />
    </Suspense>
  );
}
