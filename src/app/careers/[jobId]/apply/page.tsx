/**
 * Modern Application Form - Multi-Step Wizard
 *
 * Features:
 * - 3-step wizard with progress indicator
 * - Drag-and-drop file upload
 * - Real-time validation
 * - Clean, modern design
 * - No emojis, Lucide icons only
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  User,
  Mail,
  Phone,
  Linkedin,
  Globe,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  portfolioUrl: string;
  coverLetter: string;
}

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    portfolioUrl: '',
    coverLetter: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { num: 1, name: 'Personal Info', icon: User },
    { num: 2, name: 'Resume & Portfolio', icon: FileText },
    { num: 3, name: 'Review & Submit', icon: CheckCircle },
  ];

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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

    // Simulate AI parsing
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
    }, 1500);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Required';
      if (!formData.email.trim()) {
        newErrors.email = 'Required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email';
      }
      if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number';
      }
    }

    if (step === 2) {
      if (!resumeFile) newErrors.resume = 'Resume is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);

    try {
      // Upload resume
      const formDataObj = new FormData();
      formDataObj.append('file', resumeFile!);
      formDataObj.append('type', 'resume');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload resume');

      const { url: resumeUrl } = await uploadRes.json();

      // Submit application
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          ...formData,
          resumeUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit application');

      const result = await response.json();
      router.push(`/careers/${jobId}/apply/success?applicationId=${result.id}`);
    } catch (error) {
      console.error('Application error:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Apply for this Position
          </h1>
          <p className="text-slate-600">
            Complete the application in 3 easy steps. We'll guide you through the process.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;

              return (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-teal-600 text-white'
                          : isActive
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive || isCompleted ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                        currentStep > step.num ? 'bg-teal-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Personal Information
                </h2>
                <p className="text-slate-600">
                  Let's start with your basic information.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.firstName
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-slate-300 focus:ring-teal-500'
                      } focus:ring-2 focus:border-transparent transition-all`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.lastName
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-slate-300 focus:ring-teal-500'
                      } focus:ring-2 focus:border-transparent transition-all`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-slate-300 focus:ring-teal-500'
                    } focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="john.doe@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="+92 300 1234567"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Resume & Portfolio */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Resume & Portfolio
                </h2>
                <p className="text-slate-600">
                  Upload your resume and share your professional profiles.
                </p>
              </div>

              {/* Resume Upload with Drag & Drop */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Resume / CV <span className="text-red-500">*</span>
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive
                      ? 'border-teal-500 bg-teal-50'
                      : errors.resume
                      ? 'border-red-300 bg-red-50'
                      : 'border-slate-300 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/50'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                    id="resume-upload"
                    disabled={isParsing}
                  />

                  {isParsing ? (
                    <div className="py-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-sm font-medium text-slate-700">
                        Analyzing your resume...
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        This will only take a moment
                      </p>
                    </div>
                  ) : resumeFile ? (
                    <div className="py-4">
                      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-teal-600" />
                      </div>
                      <p className="font-semibold text-slate-900 mb-1">
                        {resumeFile.name}
                      </p>
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
                      <p className="text-sm text-slate-600">
                        PDF or Word document (max 5MB)
                      </p>
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Portfolio / Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="https://johndoe.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Tell us why you're a great fit for this role..."
                />
                <p className="mt-1 text-xs text-slate-500">
                  A cover letter helps us understand your motivation better
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Review Your Application
                </h2>
                <p className="text-slate-600">
                  Please review your information before submitting.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Personal Information</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-slate-500">Name</dt>
                      <dd className="font-medium text-slate-900">
                        {formData.firstName} {formData.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Email</dt>
                      <dd className="font-medium text-slate-900">{formData.email}</dd>
                    </div>
                    {formData.phone && (
                      <div>
                        <dt className="text-slate-500">Phone</dt>
                        <dd className="font-medium text-slate-900">{formData.phone}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Documents & Links</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-teal-600" />
                      <div>
                        <dt className="text-slate-500">Resume</dt>
                        <dd className="font-medium text-slate-900">{resumeFile?.name}</dd>
                      </div>
                    </div>
                    {formData.linkedinUrl && (
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-5 h-5 text-blue-600" />
                        <div>
                          <dt className="text-slate-500">LinkedIn</dt>
                          <dd className="font-medium text-slate-900 truncate">
                            {formData.linkedinUrl}
                          </dd>
                        </div>
                      </div>
                    )}
                    {formData.portfolioUrl && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-purple-600" />
                        <div>
                          <dt className="text-slate-500">Portfolio</dt>
                          <dd className="font-medium text-slate-900 truncate">
                            {formData.portfolioUrl}
                          </dd>
                        </div>
                      </div>
                    )}
                  </dl>
                </div>

                {formData.coverLetter && (
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 mb-2">Cover Letter</h3>
                    <p className="text-sm text-slate-700 whitespace-pre-line">
                      {formData.coverLetter}
                    </p>
                  </div>
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
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
          <p className="text-sm text-slate-700">
            Having trouble? Chat with <span className="font-semibold text-slate-900">ALIFF</span> using the widget at the bottom-right of your screen for instant help.
          </p>
        </div>
      </div>
    </div>
  );
}
