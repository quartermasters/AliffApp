/**
 * Privacy Policy Page
 *
 * Comprehensive privacy policy for Aliff Services
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Aliff Services',
  description: 'Privacy policy and data protection practices at Aliff Services',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 mb-4">
              Aliff Services ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with our AI-powered platforms.
            </p>
            <p className="text-slate-700">
              By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Personal Information</h3>
            <p className="text-slate-700 mb-4">We may collect the following personal information:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Name, email address, phone number</li>
              <li>Company name and business information</li>
              <li>Resume and professional credentials (for job applicants)</li>
              <li>Profile photos and headshots</li>
              <li>Payment and billing information</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Referring URLs and clickstream data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">2.3 AI Interaction Data</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Interview responses and chat transcripts</li>
              <li>Resume parsing results and AI analysis</li>
              <li>Project documents and deliverables</li>
              <li>Performance metrics and quality scores</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Provide and improve our services</li>
              <li>Process job applications and conduct AI interviews</li>
              <li>Match candidates with appropriate projects</li>
              <li>Communicate about projects, applications, and services</li>
              <li>Process payments and manage accounts</li>
              <li>Send marketing and promotional materials (with consent)</li>
              <li>Analyze usage patterns and improve AI algorithms</li>
              <li>Comply with legal obligations and prevent fraud</li>
              <li>Maintain security and audit trails</li>
            </ul>
          </section>

          {/* AI Processing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. AI Processing and Analysis</h2>
            <p className="text-slate-700 mb-4">
              We use artificial intelligence (including GPT-4, Claude, and Gemini) to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Parse and analyze resumes</li>
              <li>Conduct automated interviews</li>
              <li>Match candidates with projects</li>
              <li>Generate consensus-based evaluations</li>
              <li>Validate deliverables and project quality</li>
            </ul>
            <p className="text-slate-700">
              Your data processed by AI services is subject to their respective privacy policies. We ensure all AI providers comply with data protection standards.
            </p>
          </section>

          {/* Data Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Information Sharing and Disclosure</h2>
            <p className="text-slate-700 mb-4">We may share your information with:</p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 Service Providers</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>AI processing services (OpenAI, Anthropic, Google)</li>
              <li>Cloud hosting providers (Vercel, AWS)</li>
              <li>Payment processors</li>
              <li>Analytics services</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 Business Transfers</h3>
            <p className="text-slate-700 mb-6">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.3 Legal Requirements</h3>
            <p className="text-slate-700 mb-6">
              We may disclose information to comply with legal obligations, protect our rights, or respond to lawful requests from authorities.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.4 Anonymized Data</h3>
            <p className="text-slate-700">
              We implement complete anonymization between clients and team providers. Client names are never disclosed to providers, and provider identities are protected from clients.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Data Security</h2>
            <p className="text-slate-700 mb-4">We implement industry-standard security measures:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Encryption in transit (TLS/SSL) and at rest</li>
              <li>Role-based access control (RBAC)</li>
              <li>Secure authentication with NextAuth.js</li>
              <li>Regular security audits and monitoring</li>
              <li>IP address logging for audit trails</li>
              <li>Database backups and disaster recovery</li>
            </ul>
            <p className="text-slate-700">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights</h2>
            <p className="text-slate-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Object:</strong> Object to certain data processing activities</li>
            </ul>
            <p className="text-slate-700">
              To exercise these rights, contact us at <a href="mailto:privacy@aliffservices.com" className="text-blue-600 hover:underline">privacy@aliffservices.com</a>
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-slate-700 mb-4">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li>Authentication and session management</li>
              <li>Analytics and performance monitoring</li>
              <li>Personalization and user preferences</li>
              <li>Security and fraud prevention</li>
            </ul>
            <p className="text-slate-700">
              You can control cookies through your browser settings, but some features may not function properly if cookies are disabled.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Data Retention</h2>
            <p className="text-slate-700 mb-4">We retain your information for:</p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Active accounts:</strong> Duration of your engagement with us</li>
              <li><strong>Job applicants:</strong> Up to 2 years from application date</li>
              <li><strong>Client projects:</strong> 7 years for compliance purposes</li>
              <li><strong>Audit logs:</strong> 5 years for security and legal compliance</li>
            </ul>
            <p className="text-slate-700">
              After the retention period, data is securely deleted or anonymized.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Children's Privacy</h2>
            <p className="text-slate-700">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. International Data Transfers</h2>
            <p className="text-slate-700">
              Your information may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Changes to This Policy</h2>
            <p className="text-slate-700">
              We may update this Privacy Policy periodically. We will notify you of material changes by posting the updated policy on our website and updating the "Last updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact Us</h2>
            <p className="text-slate-700 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <p className="text-slate-700 mb-2">
                <strong>Email:</strong> <a href="mailto:privacy@aliffservices.com" className="text-blue-600 hover:underline">privacy@aliffservices.com</a>
              </p>
              <p className="text-slate-700 mb-2">
                <strong>Website:</strong> <a href="/contact" className="text-blue-600 hover:underline">Contact Form</a>
              </p>
              <p className="text-slate-700">
                <strong>Aliff Services</strong><br />
                Privacy Department
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
