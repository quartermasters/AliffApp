/**
 * Application Step 1: Resume + Photo Upload
 *
 * Features:
 * - Drag-and-drop resume upload (PDF, Word, Image)
 * - Separate headshot photo upload
 * - File validation (type, size)
 * - Preview uploaded files
 * - AI parsing status display
 */

'use client';

import { useState } from 'react';
import { Upload, FileText, Image, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApplicationStep1Props {
  onNext: (data: Step1Data) => void;
  initialData?: Partial<Step1Data>;
}

export interface Step1Data {
  resumeFile: File | null;
  resumeUrl?: string;
  photoFile: File | null;
  photoUrl?: string;
}

export default function ApplicationStep1({ onNext, initialData }: ApplicationStep1Props) {
  const [resumeFile, setResumeFile] = useState<File | null>(initialData?.resumeFile || null);
  const [photoFile, setPhotoFile] = useState<File | null>(initialData?.photoFile || null);
  const [isParsing, setIsParsing] = useState(false);
  const [errors, setErrors] = useState<{ resume?: string; photo?: string }>({});
  const [dragActive, setDragActive] = useState({ resume: false, photo: false });

  const handleResumeDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({ ...dragActive, resume: active });
  };

  const handlePhotoDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({ ...dragActive, photo: active });
  };

  const validateResumeFile = (file: File): string | null => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!validTypes.includes(file.type)) {
      return 'Please upload a PDF, Word document, or image (JPG, PNG)';
    }

    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const validatePhotoFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!validTypes.includes(file.type)) {
      return 'Please upload a JPG or PNG image';
    }

    if (file.size > 2 * 1024 * 1024) {
      return 'Photo size must be less than 2MB';
    }

    return null;
  };

  const handleResumeUpload = (file: File) => {
    const error = validateResumeFile(file);
    if (error) {
      setErrors({ ...errors, resume: error });
      return;
    }

    setResumeFile(file);
    setErrors({ ...errors, resume: undefined });

    // Trigger AI parsing simulation
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
    }, 2000);
  };

  const handlePhotoUpload = (file: File) => {
    const error = validatePhotoFile(file);
    if (error) {
      setErrors({ ...errors, photo: error });
      return;
    }

    setPhotoFile(file);
    setErrors({ ...errors, photo: undefined });
  };

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({ ...dragActive, resume: false });

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleResumeUpload(file);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({ ...dragActive, photo: false });

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleContinue = () => {
    const newErrors: { resume?: string; photo?: string } = {};

    if (!resumeFile) {
      newErrors.resume = 'Resume is required';
    }

    if (!photoFile) {
      newErrors.photo = 'Professional headshot is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({
      resumeFile,
      photoFile,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
            1
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Your Documents</h2>
        </div>
        <p className="text-gray-600">
          Upload your resume and professional headshot. Our AI will analyze your resume to help auto-fill the application.
        </p>
      </div>

      {/* AI Assistant Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Hi! I'm ALIFF, your AI application assistant.</h3>
            <p className="text-sm text-gray-700">
              Upload your resume and I'll automatically extract your information to save you time. I can read PDFs, Word documents, and even photo/scanned resumes!
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Resume Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Resume / CV *
          </label>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive.resume
                ? 'border-blue-500 bg-blue-50'
                : errors.resume
                ? 'border-red-300 bg-red-50'
                : resumeFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragEnter={(e) => handleResumeDrag(e, true)}
            onDragLeave={(e) => handleResumeDrag(e, false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleResumeDrop}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleResumeUpload(file);
              }}
              className="hidden"
              id="resume-upload"
              disabled={isParsing}
            />

            {isParsing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                <p className="text-sm font-medium text-gray-900">Analyzing your resume...</p>
                <p className="text-xs text-gray-500 mt-1">This will only take a moment</p>
              </div>
            ) : resumeFile ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-green-600 mb-3" />
                <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(resumeFile.size / 1024).toFixed(1)} KB
                </p>
                <label
                  htmlFor="resume-upload"
                  className="mt-3 text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                >
                  Click to change file
                </label>
              </div>
            ) : (
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">
                  Drag & drop your resume here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, Word, JPG, or PNG • Max 5MB
                </p>
              </label>
            )}
          </div>

          {errors.resume && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.resume}</span>
            </div>
          )}

          <div className="mt-3 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">What I'll extract:</span> Name, email, phone, work experience, skills, education, certifications, and more!
            </p>
          </div>
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Professional Headshot *
          </label>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive.photo
                ? 'border-blue-500 bg-blue-50'
                : errors.photo
                ? 'border-red-300 bg-red-50'
                : photoFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragEnter={(e) => handlePhotoDrag(e, true)}
            onDragLeave={(e) => handlePhotoDrag(e, false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handlePhotoDrop}
          >
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
              className="hidden"
              id="photo-upload"
            />

            {photoFile ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-green-600 mb-3" />
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-200 mb-2">
                  <img
                    src={URL.createObjectURL(photoFile)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900">{photoFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(photoFile.size / 1024).toFixed(1)} KB
                </p>
                <label
                  htmlFor="photo-upload"
                  className="mt-3 text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                >
                  Click to change photo
                </label>
              </div>
            ) : (
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">
                  Drag & drop your photo here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  JPG or PNG • Max 2MB
                </p>
              </label>
            )}
          </div>

          {errors.photo && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.photo}</span>
            </div>
          )}

          <div className="mt-3 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Tip:</span> Use a clear, professional headshot with good lighting. This helps us create your profile in our talent pool.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Application Progress</span>
          <span className="text-gray-600">Step 1 of 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '33%' }}></div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={isParsing}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          Continue to Step 2
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
