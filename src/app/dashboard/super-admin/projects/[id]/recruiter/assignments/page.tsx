'use client';

/**
 * ALIFF-RECRUITER Provider Assignment Interface
 *
 * Links hired providers to SDL projects with specific roles.
 *
 * Flow:
 * 1. Show all hired candidates from pipeline
 * 2. Match each candidate to SDL job requirement
 * 3. Create ProjectAssignment record
 * 4. Track assignment status
 *
 * Integration:
 * - Reads from recruiter pipeline status (hired providers)
 * - Reads from job package (job descriptions)
 * - Creates ProjectAssignment records
 * - Links to User accounts (if provider is in system)
 */

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';

// Mock hired candidate data (in production, this comes from CV Bank + Interview system)
interface HiredCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobMatchId: string; // Which job they were hired for
  interviewScore: number; // 0-100
  aiScreeningScore: number; // 0-100
  hiredAt: Date;
  resumeUrl: string;
  linkedinUrl?: string;
  clearance?: string;
  yearsExperience: number;
}

export default function ProviderAssignmentsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [assignmentMap, setAssignmentMap] = useState<Record<string, string>>({}); // candidateId -> jobId

  // Fetch data
  const { data: project } = trpc.project.getById.useQuery({ id: projectId });
  const { data: jobPackage } = trpc.recruiter.getJobPackage.useQuery({ projectId });
  const { data: pipelineStatus } = trpc.recruiter.getPipelineStatus.useQuery({ projectId });

  // Mock hired candidates (in production, this would come from Interview system)
  const hiredCandidates: HiredCandidate[] = [
    // Example data structure - in production this comes from:
    // - CV Bank search results
    // - AI screening scores
    // - Interview completion records
    // - Hiring decisions from Interview Kanban
  ];

  // Get job details by job title
  const getJobByTitle = (jobTitle: string) => {
    return jobPackage?.jobs.find((j: any) => j.jobTitle === jobTitle);
  };

  // Toggle candidate selection
  const toggleCandidate = (candidateId: string) => {
    const newSelection = new Set(selectedCandidates);
    if (newSelection.has(candidateId)) {
      newSelection.delete(candidateId);
    } else {
      newSelection.add(candidateId);
    }
    setSelectedCandidates(newSelection);
  };

  // Assign candidate to job
  const assignToJob = (candidateId: string, jobTitle: string) => {
    setAssignmentMap({
      ...assignmentMap,
      [candidateId]: jobTitle,
    });
  };

  // Get assignment status
  const getAssignmentStatus = () => {
    const total = hiredCandidates.length;
    const assigned = Object.keys(assignmentMap).length;
    return { total, assigned, remaining: total - assigned };
  };

  const status = getAssignmentStatus();

  if (!jobPackage) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">No Job Descriptions Available</h3>
                <p className="text-sm text-yellow-800 mt-1">
                  Complete SDL Phase 3 and execute the recruiter pipeline first.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/dashboard/super-admin/projects/${projectId}/recruiter`)}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              ← Back to Recruiter Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pipelineStatus?.triggered) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Pipeline Not Started</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Launch the hiring pipeline to start recruiting providers.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/dashboard/super-admin/projects/${projectId}/recruiter`)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Recruiter Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push(`/dashboard/super-admin/projects/${projectId}/recruiter`)}
                className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Recruiter Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Provider Assignments</h1>
              <p className="text-sm text-gray-600 mt-1">
                {project?.title || 'Loading...'}
              </p>
            </div>

            {/* Assignment Progress */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Assignment Progress</div>
              <div className="text-3xl font-bold text-blue-600">
                {status.assigned}/{status.total}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {status.remaining} remaining
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Pipeline Status Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-green-600">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hiring Pipeline Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Jobs</div>
              <div className="text-2xl font-bold text-gray-900">{pipelineStatus.totalJobs}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Candidates Found</div>
              <div className="text-2xl font-bold text-gray-900">{pipelineStatus.candidatesFound}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Top Candidates</div>
              <div className="text-2xl font-bold text-gray-900">{pipelineStatus.topCandidates}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Interviews</div>
              <div className="text-2xl font-bold text-gray-900">
                {pipelineStatus.interviewsCompleted}/{pipelineStatus.interviewsScheduled}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Providers Hired</div>
              <div className="text-2xl font-bold text-green-600">{pipelineStatus.providersHired}</div>
            </div>
          </div>
        </div>

        {/* Integration Notice (No Hired Candidates Yet) */}
        {hiredCandidates.length === 0 && (
          <div className="bg-purple-50 border-l-4 border-purple-600 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-purple-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-900">CV Bank + Interview System Integration</h3>
                <p className="text-sm text-purple-800 mt-2">
                  This interface shows hired candidates from the complete ALIFF-RECRUITER pipeline:
                </p>
                <ul className="text-sm text-purple-800 mt-2 space-y-1 list-disc list-inside">
                  <li><strong>CV Bank Semantic Search:</strong> Find matching candidates via Pinecone vector search</li>
                  <li><strong>AI Screening:</strong> Score candidates 0-100 based on job requirements</li>
                  <li><strong>Interview Kanban:</strong> Schedule and conduct interviews (NextGen system)</li>
                  <li><strong>Hiring Decisions:</strong> Track candidates who received job offers and accepted</li>
                </ul>
                <p className="text-sm text-purple-800 mt-3">
                  <strong>Current Status:</strong> No candidates have been hired yet. Complete interviews and make hiring decisions in the Interview Kanban system.
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    → Go to CV Bank Search
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    → Go to Interview Kanban
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hired Candidates List (when available) */}
        {hiredCandidates.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Hired Candidates */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">Hired Candidates</h2>
                  <p className="text-sm text-green-100 mt-1">
                    {hiredCandidates.length} providers ready for assignment
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {hiredCandidates.map((candidate: HiredCandidate) => {
                    const job = getJobByTitle(candidate.jobMatchId);
                    const isAssigned = assignmentMap[candidate.id] !== undefined;
                    const assignedJob = isAssigned ? getJobByTitle(assignmentMap[candidate.id]) : null;

                    return (
                      <div
                        key={candidate.id}
                        className={`p-6 hover:bg-gray-50 transition-colors ${
                          isAssigned ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          {/* Candidate Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                                {candidate.name
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')}
                              </div>

                              <div>
                                <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                  <span>{candidate.email}</span>
                                  <span>•</span>
                                  <span>{candidate.yearsExperience} years exp</span>
                                  {candidate.clearance && (
                                    <>
                                      <span>•</span>
                                      <span className="text-blue-600 font-medium">
                                        {candidate.clearance}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Scores */}
                            <div className="mt-3 flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">AI Score:</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                                  {candidate.aiScreeningScore}/100
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Interview:</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                                  {candidate.interviewScore}/100
                                </span>
                              </div>
                            </div>

                            {/* Job Match */}
                            {job && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="text-xs text-gray-600 mb-1">Hired For:</div>
                                <div className="font-medium text-blue-900">{job.jobTitle}</div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {job.requiredSkills.slice(0, 3).join(', ')}
                                  {job.requiredSkills.length > 3 && ` +${job.requiredSkills.length - 3} more`}
                                </div>
                              </div>
                            )}

                            {/* Assignment Status */}
                            {isAssigned && assignedJob && (
                              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-medium text-green-900">
                                    Assigned to: {assignedJob.jobTitle}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="ml-4">
                            {!isAssigned ? (
                              <button
                                onClick={() => assignToJob(candidate.id, candidate.jobMatchId)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                Assign to Project
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const newMap = { ...assignmentMap };
                                  delete newMap[candidate.id];
                                  setAssignmentMap(newMap);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                              >
                                Unassign
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Job Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Requirements</h2>
                <div className="space-y-3">
                  {jobPackage.jobs.map((job: any, index: number) => {
                    const assigned = Object.values(assignmentMap).filter(
                      (jobTitle) => jobTitle === job.jobTitle
                    ).length;

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          assigned > 0
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {job.jobTitle}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {job.category} • {job.priority}
                            </div>
                          </div>
                          {assigned > 0 && (
                            <div className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs font-medium">
                              ✓ {assigned}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Save Button */}
                <button
                  className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={Object.keys(assignmentMap).length === 0}
                >
                  Save Assignments ({Object.keys(assignmentMap).length})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
