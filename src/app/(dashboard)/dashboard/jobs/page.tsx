"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";

export default function JobsPage() {
  const { data, isLoading } = trpc.jobs.list.useQuery();
  const statsQuery = trpc.jobs.stats.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
        <div className="container-custom py-8">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-navy-700 rounded mb-4"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-navy-700 rounded mb-8"></div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 dark:bg-navy-700 rounded-xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const jobs = data?.jobs || [];
  const stats = statsQuery.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Job Postings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your job openings and track applications
            </p>
          </div>
          <Link href="/dashboard/jobs/new">
            <Button size="lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              New Job Posting
            </Button>
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Jobs</CardDescription>
                <CardTitle className="text-3xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Published</CardDescription>
                <CardTitle className="text-3xl text-victory-600">
                  {stats.published}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Views</CardDescription>
                <CardTitle className="text-3xl">{stats.totalViews}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Applications</CardDescription>
                <CardTitle className="text-3xl text-gold-600">
                  {stats.totalApplications}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold mb-2">No job postings yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first job posting to start attracting candidates
                </p>
                <Link href="/dashboard/jobs/new">
                  <Button>Create Job Posting</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-2xl">{job.title}</CardTitle>
                        <Badge
                          variant={
                            job.status === "PUBLISHED"
                              ? "success"
                              : job.status === "DRAFT"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {job.department && `${job.department} • `}
                        {job.type.replace("_", " ")} • {job.location.replace("_", " ")}
                        {job.salary && ` • ${job.salary}`}
                      </CardDescription>
                    </div>
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {job.views} views
                      </span>
                      <span>
                        Created {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {job.publishedAt && (
                      <span>
                        Published {new Date(job.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
