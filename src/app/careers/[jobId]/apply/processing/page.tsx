/**
 * Processing & Recruiter Matching Screen
 *
 * Animated loading screen (1-3 minutes) that:
 * 1. Parses resume with AI
 * 2. Detects applicant's country
 * 3. Assigns culturally-appropriate recruiter persona
 * 4. Creates application record
 * 5. Initializes interview session
 * 6. Redirects to interview with assigned recruiter
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader, CheckCircle, Users } from 'lucide-react';
import { matchRecruiter } from '@/lib/recruiter-personas';

type ProcessingStage =
  | 'uploading'
  | 'parsing'
  | 'analyzing'
  | 'matching'
  | 'connecting'
  | 'complete';

const STAGE_MESSAGES = {
  uploading: 'Uploading your documents...',
  parsing: 'Reviewing your resume...',
  analyzing: 'Analyzing your qualifications...',
  matching: 'Matching you with the right recruiter...',
  connecting: 'Connecting you to your recruiter...',
  complete: 'All set! Starting your interview...',
};

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [stage, setStage] = useState<ProcessingStage>('uploading');
  const [recruiterName, setRecruiterName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    processApplication();
  }, []);

  const processApplication = async () => {
    try {
      // Load data from previous steps
      const contactInfo = JSON.parse(sessionStorage.getItem('applicationContactInfo') || '{}');
      const uploads = JSON.parse(sessionStorage.getItem('applicationUploads') || '{}');

      if (!contactInfo.email || !uploads.resume) {
        router.push(`/careers/${jobId}/apply`);
        return;
      }

      // Stage 1: Uploading (instant)
      setStage('uploading');
      await delay(1000);

      // Stage 2: Parsing resume with AI
      setStage('parsing');
      const parseRes = await fetch('/api/applications/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileContent: uploads.resume.content,
          fileType: uploads.resume.type,
          fileName: uploads.resume.filename,
        }),
      });

      if (!parseRes.ok) {
        throw new Error('Failed to parse resume');
      }

      const parseData = await parseRes.json();
      await delay(2000);

      // Stage 3: Analyzing qualifications
      setStage('analyzing');
      await delay(2000);

      // Stage 4: Match recruiter based on country
      setStage('matching');
      const recruiterPersona = matchRecruiter(parseData.data);
      setRecruiterName(recruiterPersona.name);
      await delay(2000);

      // Stage 5: Create application record with recruiter assignment
      setStage('connecting');
      const createAppRes = await fetch('/api/applications/create-initial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          firstName: parseData.data.firstName || contactInfo.firstName,
          lastName: parseData.data.lastName || contactInfo.lastName,
          email: parseData.data.email || contactInfo.email,
          phone: parseData.data.phone || contactInfo.phone,
          resumeUrl: uploads.resume.url,
          uploadedPhotoUrl: uploads.photo.url,
          coverLetterUrl: uploads.coverLetter?.url || null,
          resumeParsedData: parseData.data,
          resumeText: parseData.data.summary || '',
          assignedRecruiter: recruiterPersona, // NEW: Store recruiter persona
        }),
      });

      if (!createAppRes.ok) {
        throw new Error('Failed to create application');
      }

      const appData = await createAppRes.json();
      await delay(1500);

      // Stage 6: Complete
      setStage('complete');
      await delay(1000);

      // Clear session storage
      sessionStorage.removeItem('applicationContactInfo');
      sessionStorage.removeItem('applicationUploads');

      // Redirect to interview with recruiter persona
      router.push(`/careers/interview?id=${appData.applicationId}`);
    } catch (err) {
      console.error('[PROCESSING] Error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const getCompletedStages = (): ProcessingStage[] => {
    const stages: ProcessingStage[] = ['uploading', 'parsing', 'analyzing', 'matching', 'connecting', 'complete'];
    const currentIndex = stages.indexOf(stage);
    return stages.slice(0, currentIndex);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push(`/careers/${jobId}/apply`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-12">
          {/* Animated Icon */}
          <div className="flex justify-center mb-8">
            {stage === 'matching' || stage === 'connecting' ? (
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -inset-2 bg-blue-200 rounded-full animate-ping opacity-20"></div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                  <Loader className="w-12 h-12 text-white animate-spin" />
                </div>
                <div className="absolute -inset-2 bg-blue-200 rounded-full animate-ping opacity-20"></div>
              </div>
            )}
          </div>

          {/* Current Stage Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              {STAGE_MESSAGES[stage]}
            </h2>
            {recruiterName && (
              <p className="text-lg text-green-600 font-medium">
                Connecting you to {recruiterName}
              </p>
            )}
            <p className="text-slate-600 mt-2">
              This usually takes 1-3 minutes. Please don't close this page.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {/* Uploading */}
            <div className="flex items-center gap-3">
              {getCompletedStages().includes('uploading') || stage === 'uploading' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
              )}
              <span
                className={`text-sm ${
                  getCompletedStages().includes('uploading') || stage === 'uploading'
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-400'
                }`}
              >
                Documents uploaded
              </span>
            </div>

            {/* Parsing */}
            <div className="flex items-center gap-3">
              {getCompletedStages().includes('parsing') ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : stage === 'parsing' ? (
                <Loader className="w-6 h-6 text-blue-600 animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
              )}
              <span
                className={`text-sm ${
                  getCompletedStages().includes('parsing') || stage === 'parsing'
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-400'
                }`}
              >
                Resume analyzed
              </span>
            </div>

            {/* Analyzing */}
            <div className="flex items-center gap-3">
              {getCompletedStages().includes('analyzing') ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : stage === 'analyzing' ? (
                <Loader className="w-6 h-6 text-blue-600 animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
              )}
              <span
                className={`text-sm ${
                  getCompletedStages().includes('analyzing') || stage === 'analyzing'
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-400'
                }`}
              >
                Qualifications reviewed
              </span>
            </div>

            {/* Matching */}
            <div className="flex items-center gap-3">
              {getCompletedStages().includes('matching') ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : stage === 'matching' ? (
                <Loader className="w-6 h-6 text-blue-600 animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
              )}
              <span
                className={`text-sm ${
                  getCompletedStages().includes('matching') || stage === 'matching'
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-400'
                }`}
              >
                Matched with recruiter
              </span>
            </div>

            {/* Connecting */}
            <div className="flex items-center gap-3">
              {getCompletedStages().includes('connecting') ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : stage === 'connecting' || stage === 'complete' ? (
                <Loader className="w-6 h-6 text-blue-600 animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
              )}
              <span
                className={`text-sm ${
                  getCompletedStages().includes('connecting') ||
                  stage === 'connecting' ||
                  stage === 'complete'
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-400'
                }`}
              >
                Preparing your interview
              </span>
            </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Tip:</span> Be honest and clear in your responses.
            The interview typically takes 5-10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
