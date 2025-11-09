"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { JobType, JobLocation } from "@/types/prisma";

export default function NewJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const createJob = trpc.jobs.create.useMutation({
    onSuccess: () => {
      router.push("/dashboard/jobs");
      router.refresh();
    },
    onError: (error) => {
      setError(error.message);
      setIsLoading(false);
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    createJob.mutate({
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
          <h1 className="text-4xl font-bold mb-2">Create Job Posting</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details to create a new job opening
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Basic information about the position
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
                  placeholder="e.g., Senior Proposal Writer"
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
                  placeholder="Provide a detailed description of the role..."
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
                    placeholder="e.g., Proposals"
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
                  placeholder="e.g., $80,000 - $120,000"
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
                  placeholder="List the key requirements and qualifications..."
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
                  placeholder="Describe the main responsibilities..."
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
                  placeholder="List the benefits and perks..."
                  disabled={isLoading}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Job Posting"}
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
