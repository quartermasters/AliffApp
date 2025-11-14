"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

// This would come from database in production
const jobs = [
  {
    slug: "senior-govcon-proposal-writer",
    title: "Senior GOVCON Proposal Writer",
    category: "GOVCON",
  },
  {
    slug: "full-stack-developer-nextjs",
    title: "Full Stack Developer (Next.js)",
    category: "IT_SERVICES",
  },
  {
    slug: "sled-proposal-specialist",
    title: "SLED Proposal Specialist",
    category: "SLED",
  },
  {
    slug: "content-writer-technical",
    title: "Technical Content Writer",
    category: "WRITING_SERVICES",
  },
  {
    slug: "ai-ml-engineer",
    title: "AI/ML Engineer",
    category: "IT_SERVICES",
  },
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  resume: File | null;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

export default function ApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const jobSlug = params.slug as string;

  const job = jobs.find((j) => j.slug === jobSlug);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    coverLetter: "",
    resume: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        resume: "Please upload a PDF or Word document",
      }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        resume: "File size must be less than 5MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, resume: file }));
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.resume) {
      newErrors.resume = "Resume is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("jobSlug", jobSlug);
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("linkedinUrl", formData.linkedinUrl);
      submitData.append("githubUrl", formData.githubUrl);
      submitData.append("portfolioUrl", formData.portfolioUrl);
      submitData.append("coverLetter", formData.coverLetter);
      if (formData.resume) {
        submitData.append("resume", formData.resume);
      }

      const response = await fetch("/api/recruitment/apply", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setSubmitSuccess(true);

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push(`/careers/application-submitted?job=${jobSlug}`);
      }, 2000);
    } catch (error) {
      console.error("Application submission error:", error);
      setErrors({
        ...errors,
        email: "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">Job Not Found</h1>
          <Link href="/careers" className="text-gold-600 hover:text-gold-700">
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-victory-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for applying. We'll review your application and get back to you soon.
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-gold-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy-900 py-12">
        <div className="container-custom">
          <Link
            href={`/careers/${jobSlug}`}
            className="flex items-center gap-2 text-gray-300 hover:text-gold-400 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job Details
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Apply for {job.title}
          </h1>
          <p className="text-gray-300">
            Join our team and work with cutting-edge AI technology
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-gold-500"
                    } focus:ring-2 focus:outline-none transition-all`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-gold-500"
                    } focus:ring-2 focus:outline-none transition-all`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-gold-500"
                    } focus:ring-2 focus:outline-none transition-all`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all"
                    placeholder="+92 XXX XXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">
                Resume/CV <span className="text-red-500">*</span>
              </h2>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragActive
                    ? "border-gold-500 bg-gold-50"
                    : formData.resume
                    ? "border-victory-500 bg-victory-50"
                    : errors.resume
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gold-400"
                }`}
              >
                {formData.resume ? (
                  <div className="flex flex-col items-center gap-4">
                    <FileText className="w-16 h-16 text-victory-600" />
                    <div>
                      <p className="text-lg font-semibold text-navy-900">
                        {formData.resume.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, resume: null }))}
                      className="text-sm text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-navy-900 mb-2">
                      Drop your resume here, or{" "}
                      <label className="text-gold-600 hover:text-gold-700 cursor-pointer">
                        browse
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-sm text-gray-600">
                      PDF, DOC, or DOCX (max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {errors.resume && (
                <p className="mt-4 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.resume}
                </p>
              )}

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 flex items-start gap-2">
                  <MessageCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>AI Tip:</strong> After you upload your resume, our AI will
                    auto-fill some fields for you! Just review and confirm the information.
                  </span>
                </p>
              </div>
            </div>

            {/* Optional Links */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">
                Professional Links (Optional)
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">
                Cover Letter (Optional)
              </h2>

              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              />

              <p className="mt-2 text-sm text-gray-600">
                While optional, a cover letter helps us understand your motivation and fit for
                the role.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link
                href={`/careers/${jobSlug}`}
                className="px-8 py-4 rounded-lg font-semibold text-gray-700 hover:text-navy-900 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-gold text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>

          {/* AI Assistant Preview */}
          <div className="mt-12 bg-gradient-to-r from-gold-100 to-victory-100 rounded-xl p-8 border border-gold-200">
            <div className="flex items-start gap-4">
              <MessageCircle className="w-8 h-8 text-gold-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">
                  Meet Aliff - Your AI Hiring Assistant
                </h3>
                <p className="text-gray-700 mb-4">
                  After you submit, I'll guide you through a quick 15-minute chat interview
                  to learn more about your experience. No scheduling needed - answer on your
                  time!
                </p>
                <p className="text-sm text-gray-600">
                  ✨ Available 24/7 • 📱 Chat or SMS • ⚡ Instant feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
