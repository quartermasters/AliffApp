/**
 * Application Success Page
 *
 * Confirmation page after successful application submission
 * Sets expectations for next steps
 */

'use client';

import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ApplicationSuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const applicationId = searchParams.get('applicationId');
  const jobId = params.jobId as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
              <span className="text-5xl">✅</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for applying! Your application has been received and is being processed by our AI recruitment system.
          </p>

          {/* Application ID */}
          {applicationId && (
            <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-200">
              <p className="text-sm text-gray-700 mb-1">Your Application ID:</p>
              <p className="text-lg font-mono font-semibold text-blue-700">{applicationId}</p>
              <p className="text-xs text-gray-600 mt-2">
                Save this ID for your records
              </p>
            </div>
          )}

          {/* What Happens Next */}
          <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Resume Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Our AI is analyzing your resume now (~1-2 hours)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Screening Results</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive an email with screening results within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Interview Invitation</h3>
                  <p className="text-sm text-gray-600">
                    Top candidates receive AI chat interview invitation (15 minutes)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Skills Test</h3>
                  <p className="text-sm text-gray-600">
                    Passing candidates receive role-specific skills test
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-semibold">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Final Decision</h3>
                  <p className="text-sm text-gray-600">
                    You'll hear back within 5-7 business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Check Your Email!</h3>
                <p className="text-sm text-gray-700">
                  We'll send all updates to <span className="font-medium">the email address you provided</span>.
                  Make sure to check your spam folder if you don't see our messages.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/careers"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View More Jobs
            </Link>
            <Link
              href={`/careers/${jobId}`}
              className="block w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-600"
            >
              Back to Job Details
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Questions about your application?{' '}
              <a
                href="mailto:hr@aliffcapital.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                hr@aliffcapital.com
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Our AI-powered recruitment system processes applications 24/7 for faster responses.
          </p>
        </div>
      </div>
    </div>
  );
}
