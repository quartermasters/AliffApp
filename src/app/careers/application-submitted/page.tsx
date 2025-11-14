import Link from "next/link";
import { CheckCircle, ArrowRight, MessageCircle, Clock, Mail } from "lucide-react";

export const metadata = {
  title: "Application Submitted - Aliff Services Careers",
  description: "Your application has been successfully submitted.",
};

export default function ApplicationSubmittedPage({
  searchParams,
}: {
  searchParams: { job?: string };
}) {
  const jobSlug = searchParams.job;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Hero */}
      <section className="bg-navy-900 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-victory-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-victory-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Application Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for applying. We've received your application and will review it shortly.
            </p>
          </div>
        </div>
      </section>

      {/* What's Next */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-navy-900 text-center mb-12">
              What Happens Next?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gold-600" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-3">Step 1: AI Review</h3>
                <p className="text-gray-600">
                  Our AI will analyze your resume and extract key information within 1-2 hours.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-victory-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-victory-600" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-3">
                  Step 2: Chat Interview
                </h3>
                <p className="text-gray-600">
                  Top candidates receive an AI chat interview invitation within 24 hours.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-navy-600" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-3">
                  Step 3: Skills Test
                </h3>
                <p className="text-gray-600">
                  Passing candidates get a skills test, with results in 3-5 business days.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-r from-gold-50 to-victory-50 rounded-xl p-8 border border-gold-200 mb-12">
              <h3 className="text-xl font-bold text-navy-900 mb-6 text-center">
                Expected Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">Within 2 hours</p>
                    <p className="text-gray-700">Resume parsed & initial screening</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">Within 24 hours</p>
                    <p className="text-gray-700">
                      AI chat interview (if you advance to this stage)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">Within 3 days</p>
                    <p className="text-gray-700">
                      Skills test sent (if you pass the interview)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-victory-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">Within 5 business days</p>
                    <p className="text-gray-700">Final decision & offer (if selected)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h3 className="text-xl font-bold text-navy-900 mb-4">
                Check Your Email
              </h3>
              <p className="text-gray-700 mb-4">
                We've sent a confirmation email with your application details and next steps.
                If you don't see it in your inbox within 10 minutes, please check your spam
                folder.
              </p>
              <p className="text-sm text-gray-600">
                Questions? Reply to the confirmation email or text us at{" "}
                <span className="font-semibold">+1-XXX-ALIFF-HR</span>
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {jobSlug && (
                <Link
                  href={`/careers/${jobSlug}`}
                  className="btn-outline btn-lg text-center"
                >
                  Back to Job Details
                </Link>
              )}
              <Link href="/careers" className="btn-primary btn-lg text-center">
                View Other Positions
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Info */}
      <section className="py-16 bg-navy-900">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <MessageCircle className="w-16 h-16 text-gold-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Meet Aliff - Your AI Hiring Assistant
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              I'm available 24/7 to answer questions about your application status, the hiring
              process, or anything else. You can chat with me anytime!
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-victory-400" />
                <span>Instant Responses</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-victory-400" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-victory-400" />
                <span>Web & SMS</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
