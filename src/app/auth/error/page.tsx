/**
 * Authentication Error Page
 *
 * Displays authentication errors in a user-friendly way
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Authentication Error | Aliff Services',
  description: 'Authentication error occurred',
};

interface ErrorPageProps {
  searchParams: {
    error?: string;
  };
}

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to access this resource.',
  },
  Verification: {
    title: 'Verification Failed',
    description: 'The verification token has expired or has already been used.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'Error occurred during the OAuth sign in process.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'Error occurred during the OAuth callback process.',
  },
  OAuthCreateAccount: {
    title: 'OAuth Account Creation Error',
    description: 'Could not create OAuth provider user in the database.',
  },
  EmailCreateAccount: {
    title: 'Email Account Creation Error',
    description: 'Could not create email provider user in the database.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'Error occurred during callback process.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Already Exists',
    description:
      'This email is already associated with another account. Please sign in using your original method.',
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'Failed to send verification email. Please try again.',
  },
  CredentialsSignin: {
    title: 'Sign In Failed',
    description: 'Invalid email or password. Please check your credentials and try again.',
  },
  SessionRequired: {
    title: 'Authentication Required',
    description: 'You must be signed in to access this page.',
  },
  default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication. Please try again.',
  },
};

export default function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const errorType = searchParams.error || 'default';
  const errorInfo = errorMessages[errorType] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            {errorInfo.title}
          </h1>

          {/* Description */}
          <p className="text-slate-400 mb-6">
            {errorInfo.description}
          </p>

          {/* Error Code */}
          {errorType !== 'default' && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 mb-6">
              <p className="text-xs text-slate-500">
                Error Code: <span className="text-slate-400 font-mono">{errorType}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-700/50 transition-all duration-200"
            >
              Return to Home
            </Link>
          </div>

          {/* Support */}
          <p className="mt-6 text-sm text-slate-500">
            Need help?{' '}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300">
              Contact support
            </Link>
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
