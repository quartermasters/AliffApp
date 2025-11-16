/**
 * Terms of Service Page
 *
 * Terms and conditions for using Aliff Services
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Aliff Services',
  description: 'Terms and conditions for using Aliff Services platform',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-slate-300">
            Last updated: November 17, 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-700 mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and Aliff Services ("Company," "we," "our," or "us") regarding your access to and use of our website, platform, and services.
            </p>
            <p className="text-slate-700">
              By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access our services.
            </p>
          </section>

          {/* Services */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Our Services</h2>
            <p className="text-slate-700 mb-4">Aliff Services provides:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>GOVCON Services:</strong> Government contracting proposal development and strategic consulting</li>
              <li><strong>SLED Services:</strong> State, local, and education market services</li>
              <li><strong>IT Services:</strong> Enterprise architecture and software development</li>
              <li><strong>Writing Services:</strong> Strategic content creation and technical writing</li>
              <li><strong>AI-Powered Platform:</strong> Solicitation Diagnosis Lab (SDL) and automated workflows</li>
              <li><strong>Talent Matching:</strong> AI-powered recruitment and team assignment</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Account Creation</h3>
            <p className="text-slate-700 mb-4">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Account Types</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Client Accounts:</strong> Require admin approval and are subject to verification</li>
              <li><strong>Team Provider Accounts:</strong> Created through job application and AI interview process</li>
              <li><strong>Candidate Accounts:</strong> For job applicants tracking application status</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">3.3 Account Termination</h3>
            <p className="text-slate-700">
              We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion.
            </p>
          </section>

          {/* Acceptable Use */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptable Use</h2>
            <p className="text-slate-700 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or viruses</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Interfere with or disrupt our services</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use our AI services to generate harmful or illegal content</li>
              <li>Scrape, data mine, or extract data without permission</li>
              <li>Impersonate others or provide false information</li>
              <li>Circumvent security measures or access controls</li>
            </ul>
          </section>

          {/* AI Services */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. AI-Powered Services</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 AI Interview Process</h3>
            <p className="text-slate-700 mb-4">
              Our AI interview process uses multiple AI models (GPT-4, Claude, Gemini) to evaluate candidates. By participating, you:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Consent to AI analysis of your responses</li>
              <li>Understand that AI evaluations may be reviewed by humans</li>
              <li>Agree that AI scores are not final hiring decisions</li>
              <li>Accept that interviews are recorded and transcribed</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 SDL Processing</h3>
            <p className="text-slate-700 mb-4">
              The Solicitation Diagnosis Lab (SDL) uses 34 AI-powered tasks across 3 phases. We:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Use multi-AI consensus for quality assurance</li>
              <li>Employ human validation at critical gates</li>
              <li>Cannot guarantee 100% accuracy of AI analysis</li>
              <li>Reserve the right to override AI recommendations</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.3 AI Limitations</h3>
            <p className="text-slate-700">
              AI-generated content and analysis are provided "as is" and may contain errors. Always review and validate AI outputs before use.
            </p>
          </section>

          {/* Payment Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Payment and Fees</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">6.1 Pricing</h3>
            <p className="text-slate-700 mb-4">
              Fees for our services are provided upon request and may vary based on project scope, complexity, and timeline.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">6.2 Payment Terms</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Payment is due according to invoice terms (typically net 30 days)</li>
              <li>Late payments may incur interest charges</li>
              <li>Services may be suspended for non-payment</li>
              <li>All fees are non-refundable unless otherwise specified</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">6.3 Provider Compensation</h3>
            <p className="text-slate-700">
              Team providers are compensated according to their individual agreements. Payment terms, rates, and schedules are confidential.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">7.1 Our IP</h3>
            <p className="text-slate-700 mb-4">
              All content, features, and functionality on our platform are owned by Aliff Services and protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">7.2 Client Content</h3>
            <p className="text-slate-700 mb-4">
              You retain ownership of content you provide. You grant us a license to use, process, and analyze your content to provide services.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">7.3 Deliverables</h3>
            <p className="text-slate-700">
              Upon full payment, clients receive ownership of deliverables created specifically for their projects, subject to any third-party licenses.
            </p>
          </section>

          {/* Confidentiality */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Confidentiality</h2>
            <p className="text-slate-700 mb-4">
              We implement strict confidentiality measures:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Complete Anonymization:</strong> Client names are never disclosed to team providers</li>
              <li><strong>Provider Privacy:</strong> Provider identities are protected from clients</li>
              <li><strong>Project Confidentiality:</strong> All project information is treated as confidential</li>
              <li><strong>Non-Disclosure:</strong> Team members sign NDAs for sensitive projects</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Disclaimers and Warranties</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">9.1 Service "As Is"</h3>
            <p className="text-slate-700 mb-4">
              Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy, reliability, or completeness</li>
              <li>Uninterrupted or error-free operation</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">9.2 No Guarantee of Results</h3>
            <p className="text-slate-700">
              We do not guarantee that proposals will win contracts, projects will be successful, or any specific results will be achieved. Our 22% win rate is historical data and not a guarantee of future performance.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-slate-700 mb-4">
              To the maximum extent permitted by law, Aliff Services shall not be liable for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or use</li>
              <li>Business interruption</li>
              <li>Errors or omissions in AI-generated content</li>
            </ul>
            <p className="text-slate-700">
              Our total liability shall not exceed the fees paid by you in the 12 months preceding the claim.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Indemnification</h2>
            <p className="text-slate-700">
              You agree to indemnify and hold harmless Aliff Services from any claims, damages, losses, or expenses arising from your use of our services, violation of these Terms, or infringement of any rights of another party.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">12.1 Informal Resolution</h3>
            <p className="text-slate-700 mb-4">
              Before filing a claim, you agree to contact us to attempt to resolve the dispute informally.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">12.2 Arbitration</h3>
            <p className="text-slate-700 mb-4">
              Any disputes not resolved informally shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">12.3 Class Action Waiver</h3>
            <p className="text-slate-700">
              You agree to resolve disputes on an individual basis and waive any right to participate in class actions.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Termination</h2>
            <p className="text-slate-700 mb-4">
              We may terminate or suspend your access immediately, without prior notice, for:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Breach of these Terms</li>
              <li>Violation of laws or regulations</li>
              <li>Fraudulent or suspicious activity</li>
              <li>Any other reason at our sole discretion</li>
            </ul>
            <p className="text-slate-700">
              Upon termination, your right to use our services ceases immediately. Provisions that should survive termination will remain in effect.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Changes to Terms</h2>
            <p className="text-slate-700">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website. Your continued use after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Governing Law</h2>
            <p className="text-slate-700">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Contact Information</h2>
            <p className="text-slate-700 mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <p className="text-slate-700 mb-2">
                <strong>Email:</strong> <a href="mailto:legal@aliffservices.com" className="text-blue-600 hover:underline">legal@aliffservices.com</a>
              </p>
              <p className="text-slate-700 mb-2">
                <strong>Website:</strong> <a href="/contact" className="text-blue-600 hover:underline">Contact Form</a>
              </p>
              <p className="text-slate-700">
                <strong>Aliff Services</strong><br />
                Legal Department
              </p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
