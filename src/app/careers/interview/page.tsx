/**
 * AI Interview Page
 *
 * Candidates are redirected here after uploading CV + photo (Step 1)
 * Conversational interview with ALIFF to assess:
 * - Availability
 * - Skills & experience
 * - Communication quality
 * - Motivation
 * - Cultural fit
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import InterviewChat from '@/components/careers/InterviewChat';
import { Loader } from 'lucide-react';

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationId = searchParams.get('id');

  const [applicationData, setApplicationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) {
      setError('No application ID provided');
      setIsLoading(false);
      return;
    }

    fetchApplicationData();
  }, [applicationId]);

  const fetchApplicationData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/applications/${applicationId}/details`);

      if (!response.ok) {
        throw new Error('Failed to load application');
      }

      const data = await response.json();
      setApplicationData(data);
    } catch (err) {
      console.error('Failed to fetch application:', err);
      setError('Failed to load application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterviewComplete = (interviewId: string) => {
    // Redirect to success page with interview results
    router.push(`/careers/interview/complete?id=${interviewId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your interview...</p>
        </div>
      </div>
    );
  }

  if (error || !applicationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Interview</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load your interview session.'}</p>
          <a
            href="/careers"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Careers
          </a>
        </div>
      </div>
    );
  }

  return (
    <InterviewChat
      applicationId={applicationId!}
      candidateName={`${applicationData.firstName} ${applicationData.lastName}`}
      jobTitle={applicationData.jobTitle}
      onComplete={handleInterviewComplete}
    />
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
