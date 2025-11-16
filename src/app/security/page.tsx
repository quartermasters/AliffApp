/**
 * Security Page
 *
 * Security practices and measures at Aliff Services
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security | Aliff Services',
  description: 'Security practices and data protection measures at Aliff Services',
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Security</h1>
          <p className="text-slate-300">
            Our commitment to protecting your data and maintaining secure operations
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Security Commitment</h2>
            <p className="text-slate-700 mb-4">
              At Aliff Services, security is not an afterthought—it's built into every layer of our platform. We implement industry-leading security practices to protect your sensitive data, intellectual property, and business operations.
            </p>
            <p className="text-slate-700">
              This page outlines our security measures, compliance standards, and best practices for keeping your information safe.
            </p>
          </section>

          {/* Data Encryption */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Data Encryption</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">1.1 Encryption in Transit</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>TLS 1.3:</strong> All data transmitted between your browser and our servers uses the latest TLS encryption</li>
              <li><strong>HTTPS Everywhere:</strong> All pages and API endpoints are served exclusively over HTTPS</li>
              <li><strong>Certificate Pinning:</strong> We use modern certificate validation to prevent man-in-the-middle attacks</li>
              <li><strong>Secure WebSocket:</strong> Real-time features use WSS (WebSocket Secure) protocol</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">1.2 Encryption at Rest</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Database Encryption:</strong> All database storage uses AES-256 encryption</li>
              <li><strong>File Storage:</strong> Documents and uploads are encrypted before storage</li>
              <li><strong>Backup Encryption:</strong> All backups are encrypted with separate keys</li>
              <li><strong>Key Management:</strong> Encryption keys are rotated regularly and stored in secure vaults</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">1.3 Password Security</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Bcrypt Hashing:</strong> Passwords are hashed using bcrypt with 12 rounds</li>
              <li><strong>Salt Per User:</strong> Each password gets a unique salt</li>
              <li><strong>Password Requirements:</strong> Minimum 8 characters with complexity validation</li>
              <li><strong>No Plain Text:</strong> Passwords are never stored or transmitted in plain text</li>
            </ul>
          </section>

          {/* Access Control */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Access Control</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Role-Based Access Control (RBAC)</h3>
            <p className="text-slate-700 mb-4">
              We implement strict RBAC across our entire platform:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Principle of Least Privilege:</strong> Users only access what they need</li>
              <li><strong>Role Hierarchy:</strong> SUPER_ADMIN → ADMIN → CLIENT → TEAM_PROVIDER → CANDIDATE</li>
              <li><strong>Resource-Level Permissions:</strong> Granular control over data access</li>
              <li><strong>Session Management:</strong> Secure JWT tokens with short expiration times</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">2.2 Authentication</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>NextAuth.js:</strong> Enterprise-grade authentication framework</li>
              <li><strong>Multi-Factor Authentication:</strong> Optional 2FA for enhanced security</li>
              <li><strong>Session Timeout:</strong> Automatic logout after inactivity</li>
              <li><strong>Device Tracking:</strong> Monitor active sessions across devices</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">2.3 Account Protection</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Account Approval:</strong> Client accounts require manual admin approval</li>
              <li><strong>Suspicious Activity Detection:</strong> Automated monitoring for unusual behavior</li>
              <li><strong>Account Lockout:</strong> Protection against brute force attacks</li>
              <li><strong>IP Whitelisting:</strong> Optional IP restrictions for sensitive accounts</li>
            </ul>
          </section>

          {/* Infrastructure Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Infrastructure Security</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Cloud Hosting</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Vercel:</strong> Enterprise-grade hosting with edge network</li>
              <li><strong>AWS:</strong> Database and storage on SOC 2 certified infrastructure</li>
              <li><strong>Geographic Redundancy:</strong> Data replicated across multiple regions</li>
              <li><strong>DDoS Protection:</strong> Automatic mitigation of denial-of-service attacks</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Network Security</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Firewall:</strong> Multi-layer firewall protection</li>
              <li><strong>VPC Isolation:</strong> Database runs in isolated virtual private cloud</li>
              <li><strong>WAF:</strong> Web Application Firewall blocks malicious requests</li>
              <li><strong>Rate Limiting:</strong> API throttling prevents abuse</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">3.3 Database Security</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Connection Pooling:</strong> Secure, efficient database connections</li>
              <li><strong>SQL Injection Prevention:</strong> Parameterized queries via Prisma ORM</li>
              <li><strong>Automated Backups:</strong> Daily backups with point-in-time recovery</li>
              <li><strong>Access Logs:</strong> Complete audit trail of all database queries</li>
            </ul>
          </section>

          {/* Application Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Application Security</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">4.1 Secure Development</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Code Reviews:</strong> All code changes reviewed before deployment</li>
              <li><strong>TypeScript:</strong> Type safety prevents entire classes of bugs</li>
              <li><strong>Dependency Scanning:</strong> Automated checks for vulnerable packages</li>
              <li><strong>Security Linting:</strong> Static analysis detects security issues</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">4.2 Input Validation</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Server-Side Validation:</strong> Never trust client input</li>
              <li><strong>XSS Prevention:</strong> Sanitize all user-generated content</li>
              <li><strong>CSRF Protection:</strong> Token-based request validation</li>
              <li><strong>File Upload Security:</strong> Type checking and size limits</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">4.3 API Security</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Authentication Required:</strong> All sensitive endpoints require auth</li>
              <li><strong>Request Signing:</strong> Cryptographic verification of API calls</li>
              <li><strong>CORS:</strong> Strict cross-origin resource sharing policies</li>
              <li><strong>Versioning:</strong> Secure deprecation of old API versions</li>
            </ul>
          </section>

          {/* AI Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. AI and Data Processing Security</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 AI Provider Security</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>SOC 2 Compliance:</strong> All AI providers (OpenAI, Anthropic, Google) are SOC 2 certified</li>
              <li><strong>Data Processing Agreements:</strong> Signed DPAs with all AI vendors</li>
              <li><strong>No Training on Your Data:</strong> Your data is never used to train AI models</li>
              <li><strong>Zero Retention:</strong> AI providers delete your data after processing</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 Data Anonymization</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Client Anonymization:</strong> Client names never sent to AI providers</li>
              <li><strong>Provider Anonymization:</strong> Team provider identities protected from clients</li>
              <li><strong>PII Redaction:</strong> Automatic removal of personally identifiable information</li>
              <li><strong>Project Isolation:</strong> Each project processed in isolated context</li>
            </ul>
          </section>

          {/* Monitoring and Auditing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Monitoring and Auditing</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">6.1 Comprehensive Audit Logs</h3>
            <p className="text-slate-700 mb-4">
              We maintain detailed audit trails of all system activities:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>User Actions:</strong> Login, logout, data access, modifications</li>
              <li><strong>Admin Actions:</strong> User approvals, role changes, system config</li>
              <li><strong>API Calls:</strong> All API requests logged with timestamps and IP addresses</li>
              <li><strong>SDL Processing:</strong> Complete history of AI task execution</li>
              <li><strong>Retention:</strong> Audit logs retained for 5 years</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">6.2 Real-Time Monitoring</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>24/7 Monitoring:</strong> Automated alerts for security incidents</li>
              <li><strong>Intrusion Detection:</strong> AI-powered anomaly detection</li>
              <li><strong>Performance Monitoring:</strong> Track system health and availability</li>
              <li><strong>Error Tracking:</strong> Immediate notification of application errors</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">6.3 Security Audits</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Quarterly Reviews:</strong> Regular security posture assessments</li>
              <li><strong>Penetration Testing:</strong> Annual third-party security testing</li>
              <li><strong>Vulnerability Scanning:</strong> Continuous automated scanning</li>
              <li><strong>Compliance Audits:</strong> Regular compliance verification</li>
            </ul>
          </section>

          {/* Incident Response */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Incident Response</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">7.1 Incident Response Plan</h3>
            <p className="text-slate-700 mb-4">
              We maintain a comprehensive incident response plan:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Detection:</strong> Automated alerts trigger immediate investigation</li>
              <li><strong>Containment:</strong> Isolate affected systems to prevent spread</li>
              <li><strong>Eradication:</strong> Remove threat and patch vulnerabilities</li>
              <li><strong>Recovery:</strong> Restore services with enhanced security</li>
              <li><strong>Lessons Learned:</strong> Post-mortem analysis and process improvement</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">7.2 Breach Notification</h3>
            <p className="text-slate-700 mb-4">
              In the unlikely event of a data breach:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>72-Hour Notification:</strong> Affected users notified within 72 hours</li>
              <li><strong>Transparency:</strong> Clear communication about what happened</li>
              <li><strong>Remediation Steps:</strong> Guidance on protecting your account</li>
              <li><strong>Regulatory Compliance:</strong> Notifications to authorities as required</li>
            </ul>
          </section>

          {/* Compliance */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Compliance and Certifications</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">8.1 Regulatory Compliance</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>GDPR:</strong> General Data Protection Regulation compliance for EU users</li>
              <li><strong>CCPA:</strong> California Consumer Privacy Act compliance</li>
              <li><strong>HIPAA Ready:</strong> Can support HIPAA-compliant workflows if required</li>
              <li><strong>FedRAMP:</strong> Working toward FedRAMP authorization for government work</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">8.2 Industry Standards</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>OWASP Top 10:</strong> Protection against all OWASP vulnerabilities</li>
              <li><strong>CIS Benchmarks:</strong> Follow Center for Internet Security guidelines</li>
              <li><strong>NIST Framework:</strong> Align with NIST Cybersecurity Framework</li>
              <li><strong>ISO 27001:</strong> Information security management best practices</li>
            </ul>
          </section>

          {/* Data Backup */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Data Backup and Recovery</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">9.1 Backup Strategy</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Daily Backups:</strong> Automated full database backups every 24 hours</li>
              <li><strong>Continuous Backups:</strong> Transaction logs backed up every 5 minutes</li>
              <li><strong>Geographic Distribution:</strong> Backups stored in multiple regions</li>
              <li><strong>Encryption:</strong> All backups encrypted with separate keys</li>
              <li><strong>Retention:</strong> 30-day backup retention with yearly archives</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">9.2 Disaster Recovery</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>RTO:</strong> Recovery Time Objective of 4 hours</li>
              <li><strong>RPO:</strong> Recovery Point Objective of 5 minutes</li>
              <li><strong>Failover:</strong> Automatic failover to backup infrastructure</li>
              <li><strong>Testing:</strong> Quarterly disaster recovery drills</li>
            </ul>
          </section>

          {/* Best Practices */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Your Security Best Practices</h2>

            <p className="text-slate-700 mb-4">
              Security is a shared responsibility. Here's how you can protect your account:
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">10.1 Account Security</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Strong Passwords:</strong> Use unique, complex passwords (12+ characters)</li>
              <li><strong>Password Manager:</strong> Consider using a password manager</li>
              <li><strong>Enable 2FA:</strong> Turn on two-factor authentication</li>
              <li><strong>Regular Updates:</strong> Change your password periodically</li>
              <li><strong>No Sharing:</strong> Never share your credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">10.2 Phishing Protection</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Verify URLs:</strong> Always check you're on aliffservices.com</li>
              <li><strong>Email Caution:</strong> We'll never ask for your password via email</li>
              <li><strong>Report Suspicious:</strong> Forward phishing attempts to security@aliffservices.com</li>
              <li><strong>Official Channels:</strong> Only use official links from our website</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">10.3 Device Security</h3>
            <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
              <li><strong>Updated Software:</strong> Keep your OS and browser updated</li>
              <li><strong>Antivirus:</strong> Use reputable antivirus software</li>
              <li><strong>Secure Networks:</strong> Avoid public Wi-Fi for sensitive work</li>
              <li><strong>Screen Lock:</strong> Lock your device when away</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Report Security Issues</h2>
            <p className="text-slate-700 mb-4">
              If you discover a security vulnerability or have security concerns, please contact us immediately:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <p className="text-slate-700 mb-2">
                <strong>Security Email:</strong> <a href="mailto:security@aliffservices.com" className="text-blue-600 hover:underline">security@aliffservices.com</a>
              </p>
              <p className="text-slate-700 mb-2">
                <strong>PGP Key:</strong> Available on request for encrypted communication
              </p>
              <p className="text-slate-700 mb-4">
                <strong>Response Time:</strong> We respond to security reports within 24 hours
              </p>
              <p className="text-slate-700 text-sm">
                We appreciate responsible disclosure and will credit researchers who report valid vulnerabilities (with permission).
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
