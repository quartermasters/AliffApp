/**
 * Modern Application Form - CV + Photo Upload → AI Interview
 *
 * New Flow:
 * 1. Upload CV + Headshot Photo
 * 2. AI parses resume and extracts data
 * 3. Redirect to AI Interview with ALIFF
 * 4. Complete conversational interview (5-10 min)
 * 5. Get results and next steps
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState<'resume' | 'photo' | null>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent, type: 'resume' | 'photo') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'resume' | 'photo') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type);
    }
  };

  const handleFile = (file: File, type: 'resume' | 'photo') => {
    if (type === 'resume') {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, resume: 'Please upload a PDF or Word document' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, resume: 'File size must be less than 5MB' });
        return;
      }

      setResumeFile(file);
      setErrors({ ...errors, resume: '' });
    } else if (type === 'photo') {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, photo: 'Please upload a JPG or PNG image' });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'Photo size must be less than 2MB' });
        return;
      }

      setPhotoFile(file);
      setErrors({ ...errors, photo: '' });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'photo') => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], type);
    }
  };

  const handleSubmit = async () => {
    // Validate both files are uploaded
    const newErrors: Record<string, string> = {};
    if (!resumeFile) newErrors.resume = 'Resume is required';
    if (!photoFile) newErrors.photo = 'Photo is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setIsParsing(true);

    try {
      // 1. Upload resume
      const resumeFormData = new FormData();
      resumeFormData.append('file', resumeFile!);

      const resumeUploadRes = await fetch('/api/applications/upload-resume', {
        method: 'POST',
        body: resumeFormData,
      });

      if (!resumeUploadRes.ok) {
        throw new Error('Failed to upload resume');
      }

      const resumeData = await resumeUploadRes.json();
      console.log('[APPLY] Resume uploaded:', resumeData);

      // 2. Upload photo
      const photoFormData = new FormData();
      photoFormData.append('file', photoFile!);

      const photoUploadRes = await fetch('/api/applications/upload-photo', {
        method: 'POST',
        body: photoFormData,
      });

      if (!photoUploadRes.ok) {
        throw new Error('Failed to upload photo');
      }

      const photoData = await photoUploadRes.json();
      console.log('[APPLY] Photo uploaded:', photoData);

      // 3. Parse resume with AI
      const parseRes = await fetch('/api/applications/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: resumeData.path,
          fileType: resumeData.type,
        }),
      });

      if (!parseRes.ok) {
        throw new Error('Failed to parse resume');
      }

      const parseData = await parseRes.json();
      console.log('[APPLY] Resume parsed:', parseData);

      // 4. Create initial application record
      const createAppRes = await fetch('/api/applications/create-initial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          firstName: parseData.data.firstName || '',
          lastName: parseData.data.lastName || '',
          email: parseData.data.email || '',
          phone: parseData.data.phone || '',
          resumeUrl: resumeData.url,
          uploadedPhotoUrl: photoData.url,
          resumeParsedData: parseData.data,
          resumeText: parseData.data.summary || '',
        }),
      });

      if (!createAppRes.ok) {
        throw new Error('Failed to create application');
      }

      const appData = await createAppRes.json();
      console.log('[APPLY] Application created:', appData.applicationId);

      // 5. Redirect to AI Interview
      router.push(`/careers/interview?id=${appData.applicationId}`);
    } catch (error) {
      console.error('[APPLY] Error:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
      setIsSubmitting(false);
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/careers/${jobId}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to job details</span>
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Apply for this Position
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            Upload your CV and photo to start your AI-powered interview with ALIFF
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="space-y-8">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Resume / CV <span className="text-red-500">*</span>
              </label>
              <div
                onDragEnter={(e) => handleDrag(e, 'resume')}
                onDragLeave={(e) => handleDrag(e, 'resume')}
                onDragOver={(e) => handleDrag(e, 'resume')}
                onDrop={(e) => handleDrop(e, 'resume')}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive === 'resume'
                    ? 'border-blue-500 bg-blue-50'
                    : errors.resume
                    ? 'border-red-300 bg-red-50'
                    : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileInput(e, 'resume')}
                  className="hidden"
                  id="resume-upload"
                  disabled={isParsing}
                />

                {resumeFile ? (
                  <div className="py-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">{resumeFile.name}</p>
                    <p className="text-sm text-slate-600 mb-3">
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <label htmlFor="resume-upload" className="cursor-pointer py-4 block">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">
                      Drop your resume here or click to browse
                    </p>
                    <p className="text-sm text-slate-600">PDF or Word document (max 5MB)</p>
                  </label>
                )}
              </div>
              {errors.resume && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.resume}
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Professional Headshot <span className="text-red-500">*</span>
              </label>
              <div
                onDragEnter={(e) => handleDrag(e, 'photo')}
                onDragLeave={(e) => handleDrag(e, 'photo')}
                onDragOver={(e) => handleDrag(e, 'photo')}
                onDrop={(e) => handleDrop(e, 'photo')}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive === 'photo'
                    ? 'border-green-500 bg-green-50'
                    : errors.photo
                    ? 'border-red-300 bg-red-50'
                    : 'border-slate-300 bg-slate-50 hover:border-green-400 hover:bg-green-50/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleFileInput(e, 'photo')}
                  className="hidden"
                  id="photo-upload"
                  disabled={isParsing}
                />

                {photoFile ? (
                  <div className="py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">{photoFile.name}</p>
                    <p className="text-sm text-slate-600 mb-3">
                      {(photoFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={() => setPhotoFile(null)}
                      className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <label htmlFor="photo-upload" className="cursor-pointer py-4 block">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">
                      Drop your photo here or click to browse
                    </p>
                    <p className="text-sm text-slate-600">JPG or PNG image (max 2MB)</p>
                  </label>
                )}
              </div>
              {errors.photo && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.photo}
                </p>
              )}
            </div>

            {/* What Happens Next */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                What happens next?
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">1.</span>
                  <p>
                    Our AI will <span className="font-medium">analyze your resume</span> to
                    understand your background
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">2.</span>
                  <p>
                    You'll chat with{' '}
                    <span className="font-medium">ALIFF, our recruitment agent</span>, for a
                    5-10 minute interview
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">3.</span>
                  <p>
                    Get <span className="font-medium">instant feedback</span> on your fit score
                    and next steps
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-semibold">4.</span>
                  <p>
                    High-scoring candidates are{' '}
                    <span className="font-medium">fast-tracked</span> to our recruitment team
                  </p>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !resumeFile || !photoFile}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isParsing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Analyzing your resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Start AI Interview</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
          <p className="text-sm text-slate-700">
            Having trouble? Chat with{' '}
            <span className="font-semibold text-slate-900">ALIFF</span> using the widget at
            the bottom-right of your screen for instant help.
          </p>
        </div>
      </div>
    </div>
  );
}
