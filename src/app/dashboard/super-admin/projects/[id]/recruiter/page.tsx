/**
 * ALIFF-RECRUITER Dashboard
 *
 * Shows SDL-driven provider hiring pipeline:
 * 1. Job descriptions generated from SDL
 * 2. CV Bank search results
 * 3. AI screening progress
 * 4. Interview scheduling
 * 5. Provider hiring status
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';

export default function RecruiterDashboard() {
  const params = useParams();
  const projectId = params.id as string;

  const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);

  // Fetch data
  const { data: project } = trpc.project.getById.useQuery({ id: projectId });
  const { data: jobPackage, isLoading: jobsLoading } = trpc.recruiter.getJobPackage.useQuery({ projectId });
  const { data: pipelineStatus, isLoading: statusLoading } = trpc.recruiter.getPipelineStatus.useQuery({ projectId });
  const { data: winStrategyBrief } = trpc.sdl.getWinStrategyBrief.useQuery({ projectId });

  // Mutations
  const triggerPipeline = trpc.recruiter.executePipeline.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const selectedJob = selectedJobIndex !== null ? jobPackage?.jobs[selectedJobIndex] : null;

  if (jobsLoading || statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ALIFF-RECRUITER dashboard...</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'TECHNICAL_WRITER': return '✍️';
      case 'SUBJECT_MATTER_EXPERT': return '🎓';
      case 'PRICING_ANALYST': return '💰';
      case 'PAST_PERFORMANCE': return '📊';
      case 'COMPLIANCE_SPECIALIST': return '✅';
      case 'GRAPHICS_DESIGNER': return '🎨';
      case 'EDITOR': return '📝';
      default: return '👤';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">ALIFF-RECRUITER Dashboard</h1>
              <p className="mt-1 text-sm text-blue-100">
                SDL-driven provider hiring for {project?.title}
              </p>
            </div>
            {jobPackage && !pipelineStatus?.triggered && (
              <button
                onClick={() => triggerPipeline.mutate({ projectId })}
                disabled={triggerPipeline.isPending}
                className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 transition-colors font-medium"
              >
                {triggerPipeline.isPending ? 'Launching...' : '🚀 Launch Hiring Pipeline'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pipeline Status Banner */}
        {pipelineStatus?.triggered && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Hiring Pipeline Active</h2>
                <p className="text-sm text-gray-600">
                  Triggered {new Date(pipelineStatus.triggeredAt!).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {pipelineStatus.providersHired}/{pipelineStatus.totalJobs}
                </div>
                <div className="text-sm text-gray-600">Providers Hired</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round((pipelineStatus.providersHired / pipelineStatus.totalJobs) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(pipelineStatus.providersHired / pipelineStatus.totalJobs) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Pipeline Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">
                  {pipelineStatus.candidatesFound}
                </div>
                <div className="text-xs text-gray-600">Candidates Found</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">
                  {pipelineStatus.topCandidates}
                </div>
                <div className="text-xs text-gray-600">Top Candidates</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">
                  {pipelineStatus.interviewsScheduled}
                </div>
                <div className="text-xs text-gray-600">Interviews Scheduled</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">
                  {pipelineStatus.hiringComplete ? 'Complete!' : 'In Progress'}
                </div>
                <div className="text-xs text-gray-600">Status</div>
              </div>
            </div>

            {!pipelineStatus.hiringComplete && (
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Estimated completion:</span>{' '}
                {new Date(pipelineStatus.estimatedCompletionTime).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* SDL Intelligence Summary */}
        {winStrategyBrief && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">SDL Intelligence Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-l-4 border-blue-600 pl-4">
                <div className="text-sm text-gray-600">Bid Decision</div>
                <div className="text-xl font-bold text-gray-900">
                  {winStrategyBrief.executiveSummary.bidDecision}
                </div>
              </div>
              <div className="border-l-4 border-green-600 pl-4">
                <div className="text-sm text-gray-600">Win Probability</div>
                <div className="text-xl font-bold text-gray-900">
                  {winStrategyBrief.executiveSummary.winProbability}%
                </div>
              </div>
              <div className="border-l-4 border-purple-600 pl-4">
                <div className="text-sm text-gray-600">Complexity</div>
                <div className="text-xl font-bold text-gray-900">
                  {winStrategyBrief.diagnosisContext.complexityScore}/10
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Descriptions */}
        {jobPackage ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Job List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">
                    Generated Jobs ({jobPackage.totalRolesNeeded})
                  </h2>
                  <p className="text-sm text-gray-600">
                    {jobPackage.criticalRolesCount} critical, {jobPackage.estimatedTotalHours}{' '}
                    total hours
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {jobPackage.jobs.map((job: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedJobIndex(index)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                        selectedJobIndex === index ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {job.jobTitle}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(job.priority)}`}
                        >
                          {job.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{job.estimatedHours}h</span>
                        <span>{job.urgency}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Job Details */}
            <div className="lg:col-span-2">
              {selectedJob ? (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{getCategoryIcon(selectedJob.category)}</span>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {selectedJob.jobTitle}
                          </h2>
                          <p className="text-sm text-gray-600">{selectedJob.category}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedJob.priority)}`}
                      >
                        {selectedJob.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {selectedJob.yearsExperience}+ years
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hours:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {selectedJob.estimatedHours}h
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Urgency:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {selectedJob.urgency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Rationale */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2">Why This Role?</h3>
                      <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                        {selectedJob.rationale}
                      </p>
                    </div>

                    {/* Unstated Requirement Link */}
                    {selectedJob.alignsWithUnstatedRequirement && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2">
                          🎯 Addresses Unstated Requirement (Task 18)
                        </h3>
                        <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg border-l-4 border-green-600">
                          {selectedJob.alignsWithUnstatedRequirement}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          This is the competitive advantage - addressing needs competitors miss!
                        </p>
                      </div>
                    )}

                    {/* Required Skills */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2">
                        Required Skills (from SDL)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.requiredSkills.map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Skills */}
                    {selectedJob.preferredSkills.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Preferred Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.preferredSkills.map((skill: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clearance */}
                    {selectedJob.clearanceRequired && selectedJob.clearanceRequired !== 'NONE' && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2">
                          Clearance Required
                        </h3>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                          {selectedJob.clearanceRequired}
                        </span>
                      </div>
                    )}

                    {/* Industry Experience */}
                    {selectedJob.industryExperience && selectedJob.industryExperience.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2">
                          Industry Experience
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.industryExperience.map((industry: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                            >
                              {industry}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {selectedJob.certifications && selectedJob.certifications.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Certifications</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.certifications.map((cert: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Job Description
                  </h2>
                  <p className="text-gray-600">
                    Choose a job from the list to view detailed requirements
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Generated Yet</h2>
            <p className="text-gray-600 mb-6">
              Complete SDL Phase 3 Win Strategy to automatically generate job descriptions
            </p>
            <div className="text-sm text-gray-500">
              Jobs will be automatically generated when SDL analysis completes with &quot;BID&quot; decision
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
