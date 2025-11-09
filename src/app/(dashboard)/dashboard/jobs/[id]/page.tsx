"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { JobType, JobLocation } from "@/types/prisma";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: job, isLoading: loading } = trpc.jobs.getById.useQuery({ id: params.id });

  const updateJob = trpc.jobs.update.useMutation({
    onSuccess: () => {
      router.push("/dashboard/jobs");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
      setIsLoading(false);
    },
  });

  const deleteJob = trpc.jobs.delete.useMutation({
    onSuccess: () => {
      router.push("/dashboard/jobs");
      router.refresh();
    },
  });

  const publishJob = trpc.jobs.publish.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    updateJob.mutate({
      id: params.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as JobType,
      location: formData.get("location") as JobLocation,
      department: formData.get("department") as string || undefined,
      salary: formData.get("salary") as string || undefined,
      requirements: formData.get("requirements") as string,
      responsibilities: formData.get("responsibilities") as string,
      benefits: formData.get("benefits") as string || undefined,
    });
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      deleteJob.mutate({ id: params.id });
    }
  }

  async function handlePublish() {
    const isPublished = job?.status === "PUBLISHED";
    publishJob.mutate({
      id: params.id,
      publish: !isPublished,
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
        <div className="container-custom py-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-navy-700 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 dark:bg-navy-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <Link href="/dashboard/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <div className="container-custom py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/jobs"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gold-400 mb-4 inline-block"
          >
            ← Back to Jobs
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Edit Job Posting</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Update the job details or manage its status
              </p>
            </div>
            <Badge
              variant={job.status === "PUBLISHED" ? "success" : "warning"}
            >
              {job.status}
            </Badge>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={handlePublish}
            variant={job.status === "PUBLISHED" ? "outline" : "default"}
            disabled={publishJob.isPending}
          >
            {job.status === "PUBLISHED" ? "Unpublish" : "Publish"}
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={deleteJob.isPending}
          >
            Delete Job
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Update the information about this position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={job.title}
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Job Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  defaultValue={job.description}
                  disabled={isLoading}
                />
              </div>

              {/* Type, Location, Department */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">
                    Job Type <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="type"
                    name="type"
                    required
                    disabled={isLoading}
                    defaultValue={job.type}
                    className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 px-4 py-2 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  >
                    <option value="FULL_TIME">Full-Time</option>
                    <option value="PART_TIME">Part-Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="location"
                    name="location"
                    required
                    disabled={isLoading}
                    defaultValue={job.location}
                    className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 px-4 py-2 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ON_SITE">On-Site</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    defaultValue={job.department || ""}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  name="salary"
                  defaultValue={job.salary || ""}
                  disabled={isLoading}
                />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements">
                  Requirements <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  required
                  rows={4}
                  defaultValue={job.requirements}
                  disabled={isLoading}
                />
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <Label htmlFor="responsibilities">
                  Responsibilities <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="responsibilities"
                  name="responsibilities"
                  required
                  rows={4}
                  defaultValue={job.responsibilities}
                  disabled={isLoading}
                />
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  rows={3}
                  defaultValue={job.benefits || ""}
                  disabled={isLoading}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/dashboard/jobs">
                  <Button type="button" variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
