"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Award,
  Target,
  FileText,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface InterviewResults {
  sessionId: string;
  candidateName: string;
  jobTitle: string;
  overallScore: number;
  recommendation: "ADVANCE" | "REVIEW" | "REJECT";
  breakdown: {
    behavioralScore: number;
    technicalScore: number;
    situationalScore: number;
    culturalScore: number;
    communicationScore: number;
  };
  strengths: string[];
  concerns: string[];
  topAnswers: Array<{
    question: string;
    answer: string;
    score: number;
  }>;
  aiConsensusNotes: string;
  nextSteps: string;
  completedAt: string;
  durationMinutes: number;
}

export default function InterviewResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [results, setResults] = useState<InterviewResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    try {
      const response = await fetch(
        `/api/recruitment/interview/${sessionId}/results`
      );
      if (!response.ok) {
        throw new Error("Results not found or still being processed");
      }
      const data = await response.json();
      setResults(data.results);
      setLoading(false);
    } catch (err) {
      setError(
        "Results are still being processed. Please check back in a few minutes."
      );
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your interview results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <Clock className="w-16 h-16 text-gold-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Evaluation in Progress
          </h1>
          <p className="text-gray-600 mb-6">
            {error ||
              "Your interview responses are being evaluated by our multi-AI system. This typically takes 1-2 hours."}
          </p>
          <button
            onClick={loadResults}
            className="bg-navy-900 text-white px-6 py-3 rounded-lg hover:bg-navy-800 transition-colors"
          >
            Refresh Results
          </button>
        </div>
      </div>
    );
  }

  const getRecommendationColor = () => {
    if (results.recommendation === "ADVANCE") return "victory";
    if (results.recommendation === "REVIEW") return "gold";
    return "red";
  };

  const getRecommendationIcon = () => {
    if (results.recommendation === "ADVANCE")
      return <CheckCircle className="w-8 h-8" />;
    if (results.recommendation === "REVIEW")
      return <AlertCircle className="w-8 h-8" />;
    return <AlertCircle className="w-8 h-8" />;
  };

  const getRecommendationTitle = () => {
    if (results.recommendation === "ADVANCE")
      return "Congratulations! You're Moving Forward";
    if (results.recommendation === "REVIEW")
      return "Your Application is Under Review";
    return "Thank You for Your Time";
  };

  const getRecommendationMessage = () => {
    if (results.recommendation === "ADVANCE")
      return "Your interview performance exceeded our expectations! We're excited to move you to the next stage.";
    if (results.recommendation === "REVIEW")
      return "Your interview showed promise, and our recruiting team will conduct a manual review within 2 business days.";
    return "While your experience is impressive, we've decided to move forward with other candidates whose skills more closely match our current needs.";
  };

  const categoryLabels = {
    behavioralScore: "Behavioral",
    technicalScore: "Technical",
    situationalScore: "Situational",
    culturalScore: "Cultural Fit",
    communicationScore: "Communication",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div
          className={`bg-${getRecommendationColor()}-50 border-2 border-${getRecommendationColor()}-400 rounded-2xl p-8 mb-8`}
        >
          <div className="flex items-start">
            <div
              className={`text-${getRecommendationColor()}-600 mr-4 flex-shrink-0`}
            >
              {getRecommendationIcon()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getRecommendationTitle()}
              </h1>
              <p className="text-lg text-gray-700 mb-4">
                {getRecommendationMessage()}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  Interview completed{" "}
                  {new Date(results.completedAt).toLocaleDateString()} •{" "}
                  {results.durationMinutes} minutes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="text-center">
            <Award className="w-12 h-12 text-gold-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Overall Interview Score
            </h2>
            <div className="text-6xl font-bold text-navy-900 mb-2">
              {results.overallScore}
              <span className="text-3xl text-gray-500">/100</span>
            </div>
            <div className="max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`bg-${
                    results.overallScore >= 85
                      ? "victory"
                      : results.overallScore >= 70
                      ? "gold"
                      : "gray"
                  }-600 h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${results.overallScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-gold-600" />
            Performance Breakdown
          </h2>
          <div className="space-y-4">
            {Object.entries(results.breakdown).map(([key, score]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">
                    {categoryLabels[key as keyof typeof categoryLabels]}
                  </span>
                  <span className="font-bold text-navy-900">
                    {score}
                    <span className="text-gray-500 text-sm">/100</span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${
                      score >= 85
                        ? "victory"
                        : score >= 70
                        ? "gold"
                        : score >= 60
                        ? "blue"
                        : "gray"
                    }-600 h-2 rounded-full`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Concerns */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="bg-victory-50 border border-victory-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-victory-600" />
              Key Strengths
            </h2>
            <ul className="space-y-2">
              {results.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 text-victory-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Growth */}
          {results.concerns.length > 0 && (
            <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-gold-600" />
                Areas for Growth
              </h2>
              <ul className="space-y-2">
                {results.concerns.map((concern, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 text-gold-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* AI Consensus Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-gold-600" />
            Multi-AI Evaluation Summary
          </h2>
          <div className="bg-gray-50 rounded-xl p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {results.aiConsensusNotes}
            </pre>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Evaluated by GPT-4 Turbo, Claude 3.5 Sonnet, and Gemini 1.5 Pro
          </p>
        </div>

        {/* Top Answers */}
        {results.topAnswers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-gold-600" />
              Your Strongest Responses
            </h2>
            <div className="space-y-6">
              {results.topAnswers.map((answer, index) => (
                <div
                  key={index}
                  className="border-l-4 border-victory-500 pl-4 py-2"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900 flex-1">
                      {answer.question}
                    </p>
                    <span className="ml-4 px-3 py-1 bg-victory-100 text-victory-800 rounded-full text-sm font-semibold">
                      {answer.score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    "{answer.answer.substring(0, 150)}..."
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-navy-900 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <p className="text-gray-300 mb-6">{results.nextSteps}</p>
          {results.recommendation === "ADVANCE" && (
            <button
              onClick={() => router.push("/careers")}
              className="bg-gold-500 text-navy-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold-400 transition-colors inline-flex items-center"
            >
              Back to Careers
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
          {results.recommendation === "REVIEW" && (
            <div className="bg-navy-800 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                We'll send you an email within 2 business days with an update on
                your application status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
