/**
 * Step 2: Document Upload
 *
 * Upload CV, Professional Photo, and optionally Cover Letter
 * Then proceeds to processing/matching screen
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  X,
  CheckCircle,
} from 'lucide-react';

export default function ApplyStep2Page() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [contactInfo, setContactInfo] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState<'resume' | 'photo' | 'cover' | null>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load contact info from Step 1
    const stored = sessionStorage.getItem('applicationContactInfo');
    if (!stored) {
      // Redirect back to Step 1 if no contact info
      router.push(`/careers/${jobId}/apply`);
      return;
    }
    setContactInfo(JSON.parse(stored));
  }, [jobId, router]);

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent, type: 'resume' | 'photo' | 'cover') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(type);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'resume' | 'photo' | 'cover') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], type);
    }
  };

  const handleFile = (file: File, type: 'resume' | 'photo' | 'cover') => {
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
    } else if (type === 'cover') {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, cover: 'Please upload a PDF or Word document' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, cover: 'File size must be less than 5MB' });
        return;
      }

      setCoverLetterFile(file);
      setErrors({ ...errors, cover: '' });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'photo' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], type);
    }
  };

  const handleSubmit = async () => {
    // Validate required files
    const newErrors: Record<string, string> = {};
    if (!resumeFile) newErrors.resume = 'Resume is required';
    if (!photoFile) newErrors.photo = 'Photo is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

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

      // 3. Upload cover letter (optional)
      let coverLetterData = null;
      if (coverLetterFile) {
        const coverFormData = new FormData();
        coverFormData.append('file', coverLetterFile);

        const coverUploadRes = await fetch('/api/applications/upload-resume', {
          method: 'POST',
          body: coverFormData,
        });

        if (coverUploadRes.ok) {
          coverLetterData = await coverUploadRes.json();
        }
      }

      // Store all upload data for processing screen
      sessionStorage.setItem(
        'applicationUploads',
        JSON.stringify({
          resume: resumeData,
          photo: photoData,
          coverLetter: coverLetterData,
        })
      );

      // Proceed to processing screen
      router.push(`/careers/${jobId}/apply/processing`);
    } catch (error) {
      console.error('[UPLOAD] Error:', error);
      setErrors({ submit: 'Failed to upload files. Please try again.' });
      setIsSubmitting(false);
    }
  };

  if (!contactInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/careers/${jobId}/apply`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to contact information</span>
          </Link>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Upload Your Documents
              </h1>
            </div>
            <p className="text-lg text-slate-600 ml-13">
              We'll review your resume and match you with a recruiter
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex-1 h-2 bg-green-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-slate-200 rounded-full"></div>
          </div>
        </div>

        {/* Applicant Info Summary */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <span className="font-semibold">{contactInfo.firstName} {contactInfo.lastName}</span>
            <span className="mx-2">•</span>
            <span>{contactInfo.email}</span>
            <span className="mx-2">•</span>
            <span>{contactInfo.phone}</span>
          </div>
        </div>

        {/* Main Upload Form */}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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

            {/* Cover Letter Upload (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Cover Letter <span className="text-slate-500 font-normal">(Optional but recommended)</span>
              </label>
              <div
                onDragEnter={(e) => handleDrag(e, 'cover')}
                onDragLeave={(e) => handleDrag(e, 'cover')}
                onDragOver={(e) => handleDrag(e, 'cover')}
                onDrop={(e) => handleDrop(e, 'cover')}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive === 'cover'
                    ? 'border-purple-500 bg-purple-50'
                    : errors.cover
                    ? 'border-red-300 bg-red-50'
                    : 'border-slate-300 bg-slate-50 hover:border-purple-400 hover:bg-purple-50/50'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileInput(e, 'cover')}
                  className="hidden"
                  id="cover-upload"
                  disabled={isSubmitting}
                />

                {coverLetterFile ? (
                  <div className="py-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">{coverLetterFile.name}</p>
                    <p className="text-sm text-slate-600 mb-3">
                      {(coverLetterFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={() => setCoverLetterFile(null)}
                      className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <X className="w-4 h-4" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <label htmlFor="cover-upload" className="cursor-pointer py-4 block">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="font-semibold text-slate-900 mb-1">
                      Drop your cover letter here or click to browse
                    </p>
                    <p className="text-sm text-slate-600">PDF or Word document (max 5MB)</p>
                  </label>
                )}
              </div>
              {errors.cover && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cover}
                </p>
              )}
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
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Uploading documents...</span>
                </>
              ) : (
                <span>Continue to Interview</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
