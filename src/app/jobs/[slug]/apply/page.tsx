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

export default function JobApplicationPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // For now, we'll use a mock job ID
  // TODO: Fetch actual job by slug and get its ID
  const jobId = "job-1";

  const createApplication = trpc.applications.create.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setIsLoading(false);
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push("/jobs");
      }, 2000);
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

    // Parse years of experience as number
    const yearsExp = formData.get("yearsExperience") as string;
    const yearsExperience = yearsExp ? parseInt(yearsExp, 10) : undefined;

    // Parse willing to relocate as boolean
    const relocate = formData.get("willingToRelocate") === "yes";

    createApplication.mutate({
      jobId,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      resumeUrl: (formData.get("resumeUrl") as string) || undefined,
      coverLetter: (formData.get("coverLetter") as string) || undefined,
      linkedinUrl: (formData.get("linkedinUrl") as string) || undefined,
      portfolioUrl: (formData.get("portfolioUrl") as string) || undefined,
      yearsExperience,
      currentCompany: (formData.get("currentCompany") as string) || undefined,
      currentTitle: (formData.get("currentTitle") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      willingToRelocate: relocate,
      expectedSalary: (formData.get("expectedSalary") as string) || undefined,
    });
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-green-600">Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for your application. We'll review it and get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Redirecting you back to job listings...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <div className="container-custom py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/jobs"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gold-400 mb-4 inline-block"
          >
            ← Back to Jobs
          </Link>
          <h1 className="text-4xl font-bold mb-2">Apply for Position</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in your details below to submit your application
          </p>
        </div>

        {/* Application Form */}
        <form onSubmit={onSubmit}>
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      disabled={isLoading}
                      placeholder="John"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      disabled={isLoading}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      disabled={isLoading}
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      disabled={isLoading}
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    disabled={isLoading}
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="willingToRelocate">Willing to Relocate?</Label>
                  <select
                    id="willingToRelocate"
                    name="willingToRelocate"
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-lg border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 px-4 py-2 text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Professional Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Experience</CardTitle>
                <CardDescription>Your work history and qualifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      name="yearsExperience"
                      type="number"
                      min="0"
                      disabled={isLoading}
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedSalary">Expected Salary</Label>
                    <Input
                      id="expectedSalary"
                      name="expectedSalary"
                      disabled={isLoading}
                      placeholder="$80,000 - $120,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentCompany">Current Company</Label>
                    <Input
                      id="currentCompany"
                      name="currentCompany"
                      disabled={isLoading}
                      placeholder="Tech Corp"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentTitle">Current Title</Label>
                    <Input
                      id="currentTitle"
                      name="currentTitle"
                      disabled={isLoading}
                      placeholder="Senior Developer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents & Links */}
            <Card>
              <CardHeader>
                <CardTitle>Documents & Links</CardTitle>
                <CardDescription>Share your resume and professional profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resumeUrl">Resume URL</Label>
                  <Input
                    id="resumeUrl"
                    name="resumeUrl"
                    type="url"
                    disabled={isLoading}
                    placeholder="https://example.com/resume.pdf"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Link to your resume (PDF, Google Drive, Dropbox, etc.)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    disabled={isLoading}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">Portfolio / Website</Label>
                  <Input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    type="url"
                    disabled={isLoading}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
                <CardDescription>Tell us why you're a great fit for this role</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={8}
                  disabled={isLoading}
                  placeholder="I am writing to express my interest in this position..."
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
              <Link href="/jobs">
                <Button type="button" variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
