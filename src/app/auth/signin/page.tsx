/**
 * Sign In Page
 *
 * Modern, sleek login page with role-based authentication
 * Supports SUPER_ADMIN, CLIENT, TEAM_PROVIDER, and CANDIDATE roles
 */

import { Metadata } from 'next';
import SignInForm from '@/components/auth/SignInForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In | Aliff Services',
  description: 'Sign in to your Aliff Services account',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ALIFF
            </h1>
            <p className="text-sm text-slate-400 mt-1">AI-Powered Services</p>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Sign In Form */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <SignInForm />

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800/50 text-slate-400">
                  New to Aliff?
                </span>
              </div>
            </div>
          </div>

          {/* Sign Up Links */}
          <div className="mt-6 space-y-3">
            <Link
              href="/auth/signup/client"
              className="w-full flex items-center justify-center px-4 py-3 border border-blue-500/30 rounded-lg text-sm font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-all duration-200"
            >
              Sign up as Client
            </Link>
            <Link
              href="/careers"
              className="w-full flex items-center justify-center px-4 py-3 border border-cyan-500/30 rounded-lg text-sm font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-200"
            >
              Join our team
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Protected by enterprise-grade security
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
