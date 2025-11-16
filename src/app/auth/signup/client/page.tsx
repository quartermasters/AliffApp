/**
 * Client Sign Up Page
 *
 * Registration page for B2B/B2C clients
 * Requires admin approval after signup
 */

import { Metadata } from 'next';
import ClientSignUpForm from '@/components/auth/ClientSignUpForm';
import Link from 'next/link';
import { Building2, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Client Sign Up | Aliff Services',
  description: 'Register as a client to access AI-powered professional services',
};

export default function ClientSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Benefits */}
          <div className="hidden md:flex flex-col justify-center space-y-6 text-white">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ALIFF
              </h1>
              <p className="text-slate-400 mt-2">AI-Powered Professional Services</p>
            </div>

            <h2 className="text-3xl font-bold text-white">
              Win more contracts with AI
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/30">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI-Orchestrated Delivery</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    34-task SDL process with multi-AI consensus for superior quality
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/30">
                  <Building2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">GOVCON/SLED Expertise</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    22% win rate on federal proposals with expert validation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/30">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Complete Transparency</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Real-time dashboard with full visibility into your project
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Create client account</h2>
              <p className="text-sm text-slate-400 mt-2">
                Submit your information for admin approval
              </p>
            </div>

            <ClientSignUpForm />

            {/* Mobile: Sign In Link */}
            <div className="md:hidden mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 text-center">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
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
