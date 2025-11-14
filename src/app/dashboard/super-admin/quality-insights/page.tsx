/**
 * Super Admin - Quality Insights Dashboard
 *
 * View AI quality scoring trends and analytics
 */

'use client';

import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function QualityInsightsPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [qualityTrends, setQualityTrends] = useState<any>(null);

  const { data: projects } = trpc.project.list.useQuery({ limit: 100 });

  // Fetch quality trends when project selected
  useEffect(() => {
    if (selectedProject) {
      fetch(`/api/deliverables/score?projectId=${selectedProject}`)
        .then((res) => res.json())
        .then((data) => setQualityTrends(data))
        .catch((error) => console.error('Failed to fetch trends:', error));
    }
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quality Insights Dashboard
          </h1>
          <p className="text-gray-600">
            AI-powered quality scoring analytics and trends
          </p>
        </div>

        {/* Project Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Project
          </label>
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Choose a project...</option>
            {projects?.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectCode} - {project.title}
              </option>
            ))}
          </select>
        </div>

        {/* Quality Trends */}
        {qualityTrends && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <MetricCard
                label="Average Quality Score"
                value={`${Math.round(qualityTrends.average)}%`}
                icon="📊"
                color={
                  qualityTrends.average >= 80
                    ? 'green'
                    : qualityTrends.average >= 60
                    ? 'yellow'
                    : 'red'
                }
              />
              <MetricCard
                label="Total Scored"
                value={qualityTrends.totalScored}
                icon="📦"
                color="blue"
              />
              <MetricCard
                label="Above 80%"
                value={qualityTrends.aboveThreshold}
                icon="✅"
                color="green"
              />
              <MetricCard
                label="Quality Trend"
                value={
                  qualityTrends.trend > 0
                    ? `+${Math.round(qualityTrends.trend)}%`
                    : `${Math.round(qualityTrends.trend)}%`
                }
                icon={qualityTrends.trend >= 0 ? '📈' : '📉'}
                color={qualityTrends.trend >= 0 ? 'green' : 'red'}
              />
            </div>

            {/* Quality Range */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quality Score Range
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Minimum Score
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {Math.round(qualityTrends.min)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${qualityTrends.min}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Average Score
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {Math.round(qualityTrends.average)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${qualityTrends.average}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Maximum Score
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {Math.round(qualityTrends.max)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${qualityTrends.max}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                AI Insights
              </h2>
              <div className="space-y-3">
                {qualityTrends.average >= 80 && (
                  <InsightItem
                    type="success"
                    message="Excellent quality! Team is consistently delivering high-quality work."
                  />
                )}
                {qualityTrends.average < 80 && qualityTrends.average >= 60 && (
                  <InsightItem
                    type="warning"
                    message="Quality is acceptable but could be improved. Consider additional training."
                  />
                )}
                {qualityTrends.average < 60 && (
                  <InsightItem
                    type="error"
                    message="Quality concerns detected. Immediate intervention recommended."
                  />
                )}
                {qualityTrends.trend > 10 && (
                  <InsightItem
                    type="success"
                    message="Quality is improving over time. Keep up the good work!"
                  />
                )}
                {qualityTrends.trend < -10 && (
                  <InsightItem
                    type="error"
                    message="Quality is declining. Review recent deliverables and provide feedback."
                  />
                )}
                {qualityTrends.aboveThreshold === qualityTrends.totalScored && (
                  <InsightItem
                    type="success"
                    message="All deliverables meet quality standards (80%+)."
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* No Project Selected */}
        {!selectedProject && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Select a Project
            </h3>
            <p className="text-gray-600">
              Choose a project from the dropdown to view quality insights
            </p>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">
                About AI Quality Scoring
              </p>
              <p className="text-sm text-blue-700">
                Quality scores are automatically generated by AI when deliverables
                are submitted. Scores evaluate completeness (25%), clarity (25%),
                technical accuracy (25%), and compliance (25%). Scores above 80%
                are considered high quality.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Components
function DashboardHeader() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/super-admin/projects"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Projects
            </Link>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
            SUPER ADMIN
          </span>
        </div>
      </div>
    </header>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
}) {
  const colorClasses = {
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow p-6 text-white`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl opacity-80">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium opacity-90">{label}</p>
    </div>
  );
}

function InsightItem({
  type,
  message,
}: {
  type: 'success' | 'warning' | 'error';
  message: string;
}) {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: '✅',
      text: 'text-green-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: '⚠️',
      text: 'text-yellow-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: '❌',
      text: 'text-red-800',
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-3`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{style.icon}</span>
        <p className={`text-sm ${style.text}`}>{message}</p>
      </div>
    </div>
  );
}
