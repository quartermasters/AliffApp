/**
 * Application Step 3: Optional Context & Cover Letter
 *
 * Features:
 * - Optional cover letter
 * - Additional context/notes
 * - Application preview
 * - Final submission
 */

'use client';

import { useState } from 'react';
import { FileText, MessageSquare, Send, Check, Lightbulb, Sparkles } from 'lucide-react';

interface ApplicationStep3Props {
  onSubmit: (data: Step3Data) => void;
  onBack: () => void;
  initialData?: Partial<Step3Data>;
  applicationSummary: ApplicationSummary;
}

export interface Step3Data {
  coverLetter?: string;
  additionalNotes?: string;
  heardAboutUs?: string;
  agreedToTerms: boolean;
}

interface ApplicationSummary {
  firstName: string;
  lastName: string;
  email: string;
  resumeFileName: string;
  photoFileName: string;
  expectedSalary: number;
  salaryType: string;
  availability: string;
}

export default function ApplicationStep3({
  onSubmit,
  onBack,
  initialData,
  applicationSummary,
}: ApplicationStep3Props) {
  const [formData, setFormData] = useState<Step3Data>({
    coverLetter: initialData?.coverLetter || '',
    additionalNotes: initialData?.additionalNotes || '',
    heardAboutUs: initialData?.heardAboutUs || '',
    agreedToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData.agreedToTerms) {
      alert('Please agree to the terms and privacy policy to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
            3
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Final Step: Add Context (Optional)
          </h2>
        </div>
        <p className="text-gray-600">
          Almost done! You can add a cover letter or additional notes to strengthen your application, or skip ahead to submit.
        </p>
      </div>

      {/* Application Preview */}
      {showPreview && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Application Summary</h3>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Hide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium text-gray-900">
                {applicationSummary.firstName} {applicationSummary.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium text-gray-900">
                {applicationSummary.email}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Resume:</span>
              <span className="ml-2 font-medium text-gray-900">
                {applicationSummary.resumeFileName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Photo:</span>
              <span className="ml-2 font-medium text-gray-900">
                {applicationSummary.photoFileName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Expected Salary:</span>
              <span className="ml-2 font-medium text-gray-900">
                ${applicationSummary.expectedSalary}/{applicationSummary.salaryType === 'HOURLY' ? 'hr' : 'yr'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Availability:</span>
              <span className="ml-2 font-medium text-gray-900">
                {applicationSummary.availability}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Cover Letter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">
              Cover Letter <span className="text-sm font-normal text-gray-500">(Optional)</span>
            </h3>
          </div>

          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us why you're interested in this role and why you'd be a great fit for our team...

Example:
Dear Hiring Manager,

I am excited to apply for this position because... [Your motivation]

With my background in..., I am confident I can contribute to... [Your value proposition]

Thank you for considering my application.

Best regards,
[Your name]"
          />

          <div className="mt-3 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span><span className="font-semibold">Tip:</span> A personalized cover letter can increase your chances! Mention specific skills from the job description that match your experience.</span>
            </p>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">
              Additional Notes <span className="text-sm font-normal text-gray-500">(Optional)</span>
            </h3>
          </div>

          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional information you'd like to share? (e.g., special accommodations, unique circumstances, portfolio highlights, etc.)"
          />
        </div>

        {/* How Did You Hear About Us */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How did you hear about us?
          </h3>

          <select
            name="heardAboutUs"
            value={formData.heardAboutUs}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option...</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="INDEED">Indeed</option>
            <option value="GLASSDOOR">Glassdoor</option>
            <option value="COMPANY_WEBSITE">Company Website</option>
            <option value="REFERRAL">Employee Referral</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="TWITTER">Twitter</option>
            <option value="GOOGLE_SEARCH">Google Search</option>
            <option value="JOB_FAIR">Job Fair</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Terms Agreement */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-sm">
              <p className="text-gray-900">
                I agree to the{' '}
                <a
                  href="/terms"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
              <p className="text-gray-600 mt-2">
                By submitting this application, I confirm that the information provided is accurate and I consent to Aliff Services processing my data for recruitment purposes.
              </p>
            </div>
          </label>
        </div>

        {/* What Happens Next */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            What happens next?
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-semibold">1.</span>
              <p>Your application will be <span className="font-medium">instantly analyzed</span> by our AI to extract key information.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-semibold">2.</span>
              <p>You'll receive a <span className="font-medium">confirmation email</span> with your application ID within minutes.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-semibold">3.</span>
              <p>Our team will review your profile and reach out if there's a match. <span className="font-medium">Every applicant enters our talent pool</span> for future opportunities!</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-semibold">4.</span>
              <p>Qualified candidates will be invited to a <span className="font-medium">15-minute AI interview</span> to better understand your fit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Application Progress</span>
          <span className="text-gray-600">Step 3 of 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.agreedToTerms}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Submitting Application...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Application
            </>
          )}
        </button>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-sm text-gray-700 mb-3">
          Having trouble submitting your application? We're here to help!
        </p>
        <a
          href="mailto:hr@aliffcapital.com"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Contact us at hr@aliffcapital.com
        </a>
      </div>
    </div>
  );
}
