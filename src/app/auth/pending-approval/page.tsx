/**
 * Pending Approval Page
 *
 * Shown to users after signing up as CLIENT
 * Explains that their account is pending admin approval
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Account Pending Approval | Aliff Services',
  description: 'Your account is pending approval',
};

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30 mb-6">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            Account Pending Approval
          </h1>

          {/* Description */}
          <p className="text-slate-400 mb-6">
            Thank you for signing up! Your account has been created and is currently pending approval from our team.
          </p>

          {/* Info Box */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-white mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">1.</span>
                <span>Our team will review your account details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">2.</span>
                <span>You'll receive an email notification once approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">3.</span>
                <span>You can then sign in and access your dashboard</span>
              </li>
            </ul>
          </div>

          {/* Timeline */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-400">
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">
                Typical approval time: 24 hours
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
            >
              Return to Home
            </Link>

            <Link
              href="/contact"
              className="w-full flex items-center justify-center px-4 py-3 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-700/50 transition-all duration-200"
            >
              Contact Support
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-6 text-xs text-slate-500">
            If you don't receive an email within 48 hours, please contact our support team.
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
