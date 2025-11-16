/**
 * Application Wizard Container
 *
 * Orchestrates the 3-step application process:
 * 1. Resume + Photo Upload
 * 2. Verify Info + Salary/Availability
 * 3. Optional Context + Submit
 *
 * Features:
 * - Multi-step state management
 * - File uploads with progress tracking
 * - AI resume parsing with auto-fill
 * - Photo extraction from CV
 * - Form validation
 * - Real-time status updates
 */

'use client';

import { useState } from 'react';
import ApplicationStep1, { Step1Data } from './ApplicationStep1';
import ApplicationStep2, { Step2Data } from './ApplicationStep2';
import ApplicationStep3, { Step3Data } from './ApplicationStep3';
import { ParsedResumeData } from '@/lib/ai/resume-parser';

interface ApplicationWizardProps {
  jobId: string;
  jobTitle: string;
}

type WizardStep = 1 | 2 | 3;

interface ApplicationData {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  parsedResumeData?: ParsedResumeData;
  extractedPhotoUrl?: string;
}

export default function ApplicationWizard({ jobId, jobTitle }: ApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle Step 1 completion: Upload resume and photo
   */
  const handleStep1Complete = async (data: Step1Data) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Upload resume file
      const resumeFormData = new FormData();
      if (data.resumeFile) {
        resumeFormData.append('file', data.resumeFile);
      }

      const resumeUploadRes = await fetch('/api/applications/upload-resume', {
        method: 'POST',
        body: resumeFormData,
      });

      if (!resumeUploadRes.ok) {
        throw new Error('Failed to upload resume');
      }

      const resumeUploadData = await resumeUploadRes.json();
      console.log('[WIZARD] Resume uploaded:', resumeUploadData);

      // Upload photo file
      const photoFormData = new FormData();
      if (data.photoFile) {
        photoFormData.append('file', data.photoFile);
      }

      const photoUploadRes = await fetch('/api/applications/upload-photo', {
        method: 'POST',
        body: photoFormData,
      });

      if (!photoUploadRes.ok) {
        throw new Error('Failed to upload photo');
      }

      const photoUploadData = await photoUploadRes.json();
      console.log('[WIZARD] Photo uploaded:', photoUploadData);

      // Parse resume with AI
      const parseRes = await fetch('/api/applications/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: resumeUploadData.path,
          fileType: resumeUploadData.type,
        }),
      });

      if (!parseRes.ok) {
        throw new Error('Failed to parse resume');
      }

      const parseData = await parseRes.json();
      console.log('[WIZARD] Resume parsed:', parseData);

      // Extract photo from CV (optional)
      let extractedPhotoUrl = undefined;
      try {
        const photoExtractRes = await fetch('/api/applications/extract-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filePath: resumeUploadData.path,
            fileType: resumeUploadData.type,
            validateQuality: true,
          }),
        });

        if (photoExtractRes.ok) {
          const photoExtractData = await photoExtractRes.json();
          if (photoExtractData.photoFound) {
            extractedPhotoUrl = photoExtractData.photo.url;
            console.log('[WIZARD] Photo extracted from CV:', extractedPhotoUrl);
          }
        }
      } catch (err) {
        console.warn('[WIZARD] Could not extract photo from CV:', err);
        // Non-critical error, continue
      }

      // Save data and move to step 2
      setApplicationData({
        ...applicationData,
        step1: {
          ...data,
          resumeUrl: resumeUploadData.url,
          photoUrl: photoUploadData.url,
        },
        parsedResumeData: parseData.data,
        extractedPhotoUrl,
      });

      setCurrentStep(2);
    } catch (err) {
      console.error('[WIZARD] Step 1 error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle Step 2 completion: Verify info and add salary/availability
   */
  const handleStep2Complete = (data: Step2Data) => {
    setApplicationData({
      ...applicationData,
      step2: data,
    });
    setCurrentStep(3);
  };

  /**
   * Handle Step 2 back: Return to step 1
   */
  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  /**
   * Handle Step 3 completion: Final submission
   */
  const handleStep3Complete = async (data: Step3Data) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Prepare complete application payload
      const completeApplication = {
        jobId,
        ...applicationData.step1,
        ...applicationData.step2,
        ...data,
        parsedResumeData: applicationData.parsedResumeData,
        extractedPhotoUrl: applicationData.extractedPhotoUrl,
      };

      console.log('[WIZARD] Submitting complete application:', completeApplication);

      // Submit application
      const submitRes = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeApplication),
      });

      if (!submitRes.ok) {
        const errorData = await submitRes.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      const submitData = await submitRes.json();
      console.log('[WIZARD] Application submitted:', submitData);

      // Redirect to success page
      window.location.href = `/careers/application-success?id=${submitData.applicationId}`;
    } catch (err) {
      console.error('[WIZARD] Submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
      setIsProcessing(false);
    }
  };

  /**
   * Handle Step 3 back: Return to step 2
   */
  const handleStep3Back = () => {
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply for {jobTitle}
          </h1>
          <p className="text-gray-600">
            Complete the 3-step application process powered by AI
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Processing...</p>
                <p className="text-xs text-blue-700 mt-1">
                  {currentStep === 1
                    ? 'Uploading files and analyzing your resume with AI'
                    : 'Submitting your application'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                    step === currentStep
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : step < currentStep
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-gray-200 border-gray-300 text-gray-600'
                  }`}
                >
                  {step < currentStep ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && (
            <ApplicationStep1
              onNext={handleStep1Complete}
              initialData={applicationData.step1}
            />
          )}

          {currentStep === 2 && (
            <ApplicationStep2
              onNext={handleStep2Complete}
              onBack={handleStep2Back}
              initialData={applicationData.step2}
              parsedData={applicationData.parsedResumeData}
            />
          )}

          {currentStep === 3 && applicationData.step1 && applicationData.step2 && (
            <ApplicationStep3
              onSubmit={handleStep3Complete}
              onBack={handleStep3Back}
              initialData={applicationData.step3}
              applicationSummary={{
                firstName: applicationData.step2.firstName,
                lastName: applicationData.step2.lastName,
                email: applicationData.step2.email,
                resumeFileName: applicationData.step1.resumeFile?.name || 'Resume',
                photoFileName: applicationData.step1.photoFile?.name || 'Photo',
                expectedSalary: applicationData.step2.expectedSalary,
                salaryType: applicationData.step2.salaryType,
                availability: `${applicationData.step2.hoursPerDay}h/day, ${applicationData.step2.daysPerMonth} days/month`,
              }}
            />
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need assistance?{' '}
            <a
              href="mailto:hr@aliffcapital.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact our HR team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
