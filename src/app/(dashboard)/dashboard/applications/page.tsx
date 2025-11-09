"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { ApplicationStatus } from "@/types/prisma";

const statusColors: Record<ApplicationStatus, "default" | "success" | "warning" | "destructive"> = {
  [ApplicationStatus.SUBMITTED]: "default",
  [ApplicationStatus.SCREENING]: "default",
  [ApplicationStatus.SHORTLISTED]: "success",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "success",
  [ApplicationStatus.INTERVIEWING]: "success",
  [ApplicationStatus.OFFER_EXTENDED]: "success",
  [ApplicationStatus.ACCEPTED]: "success",
  [ApplicationStatus.REJECTED]: "destructive",
  [ApplicationStatus.WITHDRAWN]: "warning",
};

const statusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.SUBMITTED]: "Submitted",
  [ApplicationStatus.SCREENING]: "Screening",
  [ApplicationStatus.SHORTLISTED]: "Shortlisted",
  [ApplicationStatus.INTERVIEW_SCHEDULED]: "Interview Scheduled",
  [ApplicationStatus.INTERVIEWING]: "Interviewing",
  [ApplicationStatus.OFFER_EXTENDED]: "Offer Extended",
  [ApplicationStatus.ACCEPTED]: "Accepted",
  [ApplicationStatus.REJECTED]: "Rejected",
  [ApplicationStatus.WITHDRAWN]: "Withdrawn",
};

export default function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [jobFilter, setJobFilter] = useState<string>("ALL");

  const { data, isLoading } = trpc.applications.list.useQuery({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    jobId: jobFilter === "ALL" ? undefined : jobFilter,
  });

  const statsQuery = trpc.applications.stats.useQuery();

  const applications = data?.applications || [];
  const stats = statsQuery.data;

  if (isLoading || statsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
        <div className="container-custom py-8">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-navy-700 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-navy-700 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-navy-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and review candidate applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Under Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(stats?.submitted || 0) + (stats?.screening || 0)}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Submitted + Screening
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Shortlisted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.shortlisted || 0}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ready for interview
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.interviewing || 0}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                In progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "ALL")}
              className="w-full h-10 rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 px-4 py-2 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
            >
              <option value="ALL">All Statuses</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({applications.length})</CardTitle>
            <CardDescription>
              Review and manage candidate applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No applications found
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Applications will appear here when candidates apply for jobs
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 dark:border-navy-600 rounded-lg p-6 hover:border-gold-400 dark:hover:border-gold-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {application.firstName} {application.lastName}
                          </h3>
                          <Badge variant={statusColors[application.status as ApplicationStatus]}>
                            {statusLabels[application.status as ApplicationStatus]}
                          </Badge>
                          {application.rating && (
                            <div className="flex items-center gap-1 text-gold-400">
                              {"★".repeat(application.rating)}
                              {"☆".repeat(5 - application.rating)}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Applied for: <span className="font-medium">{application.job.title}</span>
                          {application.job.department && (
                            <> • {application.job.department}</>
                          )}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-sm font-medium">{application.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium">{application.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
                        <p className="text-sm font-medium">
                          {application.yearsExperience || 0} years
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-sm font-medium">
                          {application.location || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {application.currentCompany && application.currentTitle && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Current Role</p>
                        <p className="text-sm font-medium">
                          {application.currentTitle} at {application.currentCompany}
                        </p>
                      </div>
                    )}

                    {application.notes && (
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-navy-700 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                        <p className="text-sm">{application.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-navy-600">
                      <Link href={`/dashboard/applications/${application.id}`}>
                        <Button variant="default" size="sm">
                          View Details
                        </Button>
                      </Link>
                      {application.resumeUrl && (
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            View Resume
                          </Button>
                        </a>
                      )}
                      {application.linkedinUrl && (
                        <a
                          href={application.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            LinkedIn
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
