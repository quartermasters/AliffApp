/**
 * Job Detail Page
 *
 * Shows full job description and requirements
 * Includes AI chat widget for candidate assistance
 * Primary CTA: Apply Now button
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { JobStatus, JobType, JobLocation } from '@prisma/client';
import { Globe, Building, MapPin, DollarSign, Eye, FileText, ArrowLeft } from 'lucide-react';
import AIChatWidget from '@/components/careers/AIChatWidget';
import ScrollToChatButton from '@/components/careers/ScrollToChatButton';
import ShareButtons from '@/components/careers/ShareButtons';

// Force dynamic rendering (requires database access)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PageProps {
  params: {
    jobId: string;
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { jobId } = params;

  // Fetch job by slug with error handling
  let job;

  try {
    job = await prisma.jobPosting.findUnique({
      where: {
        slug: jobId,
        status: JobStatus.PUBLISHED,
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      notFound();
    }

    // Increment view count
    await prisma.jobPosting.update({
      where: { id: job.id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    notFound();
  }

  const getTypeColor = (type: JobType) => {
    switch (type) {
      case 'FULL_TIME':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PART_TIME':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONTRACT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'INTERNSHIP':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const LocationIcon = ({ location }: { location: JobLocation }) => {
    switch (location) {
      case 'REMOTE':
        return <Globe className="w-5 h-5" />;
      case 'HYBRID':
        return <Building className="w-5 h-5" />;
      case 'ON_SITE':
        return <Building className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-navy-900 text-white py-8 border-b border-navy-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/careers"
            className="text-gold-400 hover:text-gold-300 font-medium flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all jobs</span>
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
              {job.department && <p className="text-lg text-gray-300">{job.department}</p>}
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getTypeColor(
                job.type
              )}`}
            >
              {job.type.replace('_', ' ')}
            </span>
          </div>

          {/* Job Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <LocationIcon location={job.location} />
              <span className="font-medium">{job.location.replace('_', ' ')}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">{job.salary}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{job.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>{job._count.applications} applications</span>
            </div>
          </div>

          {/* Apply CTA */}
          <div className="mt-6">
            <Link
              href={`/careers/${job.slug}/apply`}
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Apply Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </section>

              {/* Requirements */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </div>
              </section>

              {/* Responsibilities */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.responsibilities}
                </div>
              </section>

              {/* Benefits */}
              {job.benefits && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {job.benefits}
                  </div>
                </section>
              )}

              {/* Application Preview Widget */}
              <section className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-teal-600" />
                  What You'll Need to Apply
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Required:</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-0.5">•</span>
                        <span>Resume/CV (PDF or Word, max 5MB)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-0.5">•</span>
                        <span>Email & Phone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-0.5">•</span>
                        <span>2-3 writing samples (proposal excerpts)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Optional but Recommended:</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>LinkedIn profile</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Portfolio/website</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Cover letter (150-300 words)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-teal-200">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Time to complete: 8-12 minutes
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        AI Assistant available throughout
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Hiring Pipeline Transparency */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Our Hiring Process (7 days average)
                </h2>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">
                        1-2
                      </div>
                      <div className="w-0.5 h-full bg-teal-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-bold text-gray-900 mb-2">Application & AI Resume Screening</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 mt-1">-</span>
                          <span>Upload resume, AI extracts your experience</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 mt-1">-</span>
                          <span>Instant feedback on basic qualifications</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        2-3
                      </div>
                      <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-bold text-gray-900 mb-2">AI Chat Interview (15 minutes)</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">-</span>
                          <span>Casual conversation with ALIFF-RECRUITER</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">-</span>
                          <span>Questions tailored to your background</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">-</span>
                          <span>Immediate decision: Advance or feedback</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                        3-5
                      </div>
                      <div className="w-0.5 h-full bg-purple-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-bold text-gray-900 mb-2">Skills Test (4 hours)</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">-</span>
                          <span>Real-world proposal writing challenge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">-</span>
                          <span>Use any tools/AI you normally would</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 mt-1">-</span>
                          <span>Graded by 3 AI models + human review</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                        5-7
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Final Decision & Onboarding</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">-</span>
                          <span>If score ≥75: Welcome to Provider Pool!</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">-</span>
                          <span>Contracts, payment setup, first project assigned</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-600">18%</div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">90+</div>
                      <div className="text-xs text-gray-600">Fast Track Score</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Day in the Life */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  What a Typical Week Looks Like
                </h2>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="font-semibold text-gray-900 mb-2">Monday-Tuesday</div>
                    <p className="text-sm text-gray-700">
                      Review new RFPs, collaborate with ALIFF-OPS for research and strategic direction
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <div className="font-semibold text-gray-900 mb-2">Wednesday</div>
                    <p className="text-sm text-gray-700">
                      Draft technical volumes, receive AI-generated first drafts for editing
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500">
                    <div className="font-semibold text-gray-900 mb-2">Thursday</div>
                    <p className="text-sm text-gray-700">
                      Client review cycles, incorporate feedback
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
                    <div className="font-semibold text-gray-900 mb-2">Friday</div>
                    <p className="text-sm text-gray-700">
                      Final compliance checks, submission prep, start planning next week's projects
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Average workload</div>
                      <div className="font-semibold text-gray-900">25-30 hours/week | 2-3 active projects</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Rush projects</div>
                      <div className="font-semibold text-gray-900">Occasional 3-day turnarounds (you can decline)</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Team & Tools */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Team & Tools You'll Use</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* AI Teammates */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Your AI Teammates
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-indigo-600 mt-0.5">ALIFF-OPS:</span>
                        <span className="text-gray-700">Provides RFP research, win themes, compliance matrix</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-purple-600 mt-0.5">ALIFF-CLIENT:</span>
                        <span className="text-gray-700">Your main point of contact, handles client comms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-pink-600 mt-0.5">ALIFF-TRAINER:</span>
                        <span className="text-gray-700">Offers skill development courses</span>
                      </li>
                    </ul>
                  </div>

                  {/* Tools */}
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Tools You'll Access
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>Shared workspace (Notion/SharePoint)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>Style guide library (50+ agency templates)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>Past performance database (anonymized successful proposals)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-teal-600 mt-1">•</span>
                        <span>AI writing assistants (GPT-4, Claude Sonnet for first drafts)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Transparent Compensation */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Compensation Details
                </h2>

                <div className="space-y-6">
                  {/* Base Rate */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="font-bold text-gray-900 mb-3">Base Hourly Rate: $65-$85/hour</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Starting rate based on your skills test score</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Rate increases every 6 months based on performance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>Top performers: $90-$100/hour</span>
                      </li>
                    </ul>
                  </div>

                  {/* Performance Bonuses */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Performance Bonuses</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <div className="text-2xl font-bold text-amber-600 mb-1">$500</div>
                        <div className="text-sm text-gray-700">Client 5-star rating per project</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600 mb-1">$1,000</div>
                        <div className="text-sm text-gray-700">On-time delivery streak (5 projects)</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600 mb-1">$500</div>
                        <div className="text-sm text-gray-700">Referral bonus per validated candidate</div>
                      </div>
                    </div>
                  </div>

                  {/* Profit Sharing */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                    <h3 className="font-bold text-gray-900 mb-3">Profit Sharing</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>Repeat client projects: 10% of project value</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span className="font-medium">Example: Client renews for 3 more proposals = ~$2,000 bonus</span>
                      </li>
                    </ul>
                  </div>

                  {/* Payment & Benefits */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Payment Terms</h4>
                      <p className="text-sm text-gray-700">Net-15 via direct deposit (every 2 weeks)</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Full-Time Benefits (30+ hrs/week)</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Health stipend: $400/month</li>
                        <li>• Professional development: $1,500/year</li>
                        <li>• Equipment allowance: $500/year</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Apply CTA Bottom */}
              <div className="pt-8 border-t border-gray-200">
                <Link
                  href={`/careers/${job.slug}/apply`}
                  className="block w-full bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-center shadow-lg hover:shadow-xl"
                >
                  Apply for this Position →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Quick Apply Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-navy-900 mb-4">Quick Apply</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our AI-powered application process makes it easy. Just upload your resume and
                  we'll help you complete the rest.
                </p>
                <Link
                  href={`/careers/${job.slug}/apply`}
                  className="block w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-center"
                >
                  Start Application
                </Link>
              </div>

              {/* Job Summary Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Summary</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Posted Date</div>
                    <div className="font-medium text-gray-900">
                      {new Date(job.publishedAt!).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Employment Type</div>
                    <div className="font-medium text-gray-900">
                      {job.type.replace('_', ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Location</div>
                    <div className="font-medium text-gray-900">
                      {job.location.replace('_', ' ')}
                    </div>
                  </div>
                  {job.salary && (
                    <div>
                      <div className="text-gray-500 mb-1">Compensation</div>
                      <div className="font-medium text-gray-900">{job.salary}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-navy-50 rounded-lg p-6 border border-navy-200">
                <h3 className="text-lg font-bold text-navy-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Have questions about this role or the application process?
                </p>
                <ScrollToChatButton
                  variant="compact"
                  fullWidth
                  subtitle="Get instant answers 24/7"
                />
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-navy-900 mb-4">Share this Job</h3>
                <ShareButtons
                  jobUrl={`${process.env.NEXT_PUBLIC_APP_URL || 'https://aliffservices.com'}/careers/${job.slug}`}
                  jobTitle={job.title}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* AI Chat Widget - Context-aware for this specific job */}
      <AIChatWidget jobId={job.slug} jobTitle={job.title} />
    </main>
  );
}
