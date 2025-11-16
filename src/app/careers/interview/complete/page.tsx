/**
 * Interview Completion Page
 *
 * Shows interview results and next steps
 * - Overall score
 * - Breakdown by category
 * - Strengths & areas to improve
 * - What happens next
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  CheckCircle,
  Award,
  TrendingUp,
  MessageSquare,
  Calendar,
  Sparkles,
  ArrowRight,
  Loader,
} from 'lucide-react';

interface InterviewResults {
  interviewId: string;
  candidateName: string;
  jobTitle: string;
  completedAt: string;
  duration: number; // seconds
  overallScore: number; // 0-100
  recommendation: 'PROCEED_TO_HUMAN_REVIEW' | 'ADD_TO_TALENT_POOL' | 'REJECT';
  scores: {
    communication: number;
    availability: number;
    technical: number;
    motivation: number;
  };
  strengths: string[];
  concerns: string[];
  nextSteps: string[];
}

function InterviewCompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const interviewId = searchParams.get('id');

  const [results, setResults] = useState<InterviewResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!interviewId) {
      setError('No interview ID provided');
      setIsLoading(false);
      return;
    }

    fetchResults();
  }, [interviewId]);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/interview/${interviewId}/results`);

      if (!response.ok) {
        throw new Error('Failed to load interview results');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Failed to fetch results:', err);
      setError('Failed to load interview results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getRecommendationMessage = (recommendation: string) => {
    switch (recommendation) {
      case 'PROCEED_TO_HUMAN_REVIEW':
        return {
          title: 'Great Performance!',
          message: 'Your interview was excellent. Our team will review your application shortly.',
          color: 'green',
        };
      case 'ADD_TO_TALENT_POOL':
        return {
          title: 'Thank You for Interviewing',
          message:
            "While you may not be a match for this specific role, we've added you to our talent pool for future opportunities.",
          color: 'blue',
        };
      case 'REJECT':
        return {
          title: 'Interview Complete',
          message: 'Thank you for your time. We encourage you to apply for other positions that match your skills.',
          color: 'gray',
        };
      default:
        return {
          title: 'Interview Complete',
          message: 'Thank you for completing the interview.',
          color: 'blue',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your interview...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load interview results.'}</p>
          <a
            href="/careers"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Careers
          </a>
        </div>
      </div>
    );
  }

  const recommendation = getRecommendationMessage(results.recommendation);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
          <p className="text-lg text-gray-600">
            Thank you, {results.candidateName}, for interviewing for {results.jobTitle}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Duration: {Math.floor(results.duration / 60)} minutes {results.duration % 60} seconds
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Overall Score</h2>
            </div>
            <div className={`text-6xl font-bold ${getScoreColor(results.overallScore)} mb-4`}>
              {results.overallScore}
              <span className="text-3xl">/100</span>
            </div>
            <div
              className={`inline-block px-4 py-2 rounded-full ${getScoreBgColor(results.overallScore)}`}
            >
              <p className={`font-semibold ${getScoreColor(results.overallScore)}`}>
                {recommendation.title}
              </p>
            </div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{recommendation.message}</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Score Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Communication */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Communication</span>
                <span className={`text-lg font-bold ${getScoreColor(results.scores.communication)}`}>
                  {results.scores.communication}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${results.scores.communication}%` }}
                ></div>
              </div>
            </div>

            {/* Availability Fit */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Availability Fit</span>
                <span className={`text-lg font-bold ${getScoreColor(results.scores.availability)}`}>
                  {results.scores.availability}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${results.scores.availability}%` }}
                ></div>
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Technical Skills</span>
                <span className={`text-lg font-bold ${getScoreColor(results.scores.technical)}`}>
                  {results.scores.technical}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${results.scores.technical}%` }}
                ></div>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Motivation</span>
                <span className={`text-lg font-bold ${getScoreColor(results.scores.motivation)}`}>
                  {results.scores.motivation}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-600 h-3 rounded-full transition-all"
                  style={{ width: `${results.scores.motivation}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          {results.strengths.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Key Strengths
              </h3>
              <ul className="space-y-2">
                {results.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas to Improve */}
          {results.concerns.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {results.concerns.map((concern, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-yellow-800">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            What Happens Next?
          </h2>

          <div className="space-y-3">
            {results.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Need help or have questions? Chat with{' '}
              <span className="font-semibold text-gray-900">ALIFF</span> using the widget at the
              bottom-right of your screen.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/careers/track?id"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
              >
                Track Application Status
              </a>
              <a
                href="/careers"
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-center font-semibold"
              >
                Browse Other Positions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterviewCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      }
    >
      <InterviewCompleteContent />
    </Suspense>
  );
}
