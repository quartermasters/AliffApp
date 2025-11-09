"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number>(0);

  const { data: application, isLoading: loading } = trpc.applications.getById.useQuery({
    id: params.id,
  });

  const updateApplication = trpc.applications.update.useMutation({
    onSuccess: () => {
      router.refresh();
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const updateStatus = trpc.applications.updateStatus.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const deleteApplication = trpc.applications.delete.useMutation({
    onSuccess: () => {
      router.push("/dashboard/applications");
      router.refresh();
    },
  });

  async function handleSaveNotes() {
    setIsLoading(true);
    updateApplication.mutate({
      id: params.id,
      notes,
      rating: rating > 0 ? rating : undefined,
    });
  }

  async function handleStatusChange(status: ApplicationStatus) {
    updateStatus.mutate({
      id: params.id,
      status,
    });
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      deleteApplication.mutate({ id: params.id });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
        <div className="container-custom py-8 max-w-5xl">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-navy-700 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 dark:bg-navy-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Application not found</h2>
          <Link href="/dashboard/applications">
            <Button>Back to Applications</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <div className="container-custom py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/applications"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gold-400 mb-4 inline-block"
          >
            ← Back to Applications
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {application.firstName} {application.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Application for: {application.job.title}
              </p>
            </div>
            <Badge variant={statusColors[application.status as ApplicationStatus]}>
              {statusLabels[application.status as ApplicationStatus]}
            </Badge>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button onClick={handleDelete} variant="destructive" size="sm">
            Delete Application
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">Email</Label>
                    <p className="font-medium">{application.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">Phone</Label>
                    <p className="font-medium">{application.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">Location</Label>
                    <p className="font-medium">{application.location || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      Willing to Relocate
                    </Label>
                    <p className="font-medium">
                      {application.willingToRelocate ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      Years of Experience
                    </Label>
                    <p className="font-medium">{application.yearsExperience || 0} years</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      Expected Salary
                    </Label>
                    <p className="font-medium">{application.expectedSalary || "Not specified"}</p>
                  </div>
                  {application.currentCompany && (
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">
                        Current Company
                      </Label>
                      <p className="font-medium">{application.currentCompany}</p>
                    </div>
                  )}
                  {application.currentTitle && (
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">
                        Current Title
                      </Label>
                      <p className="font-medium">{application.currentTitle}</p>
                    </div>
                  )}
                  {application.availableFrom && (
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">
                        Available From
                      </Label>
                      <p className="font-medium">
                        {new Date(application.availableFrom).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            {application.coverLetter && (
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
                </CardContent>
              </Card>
            )}

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle>Documents & Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.resumeUrl && (
                  <div>
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-400 hover:text-gold-500 font-medium"
                    >
                      View Resume →
                    </a>
                  </div>
                )}
                {application.linkedinUrl && (
                  <div>
                    <a
                      href={application.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-400 hover:text-gold-500 font-medium"
                    >
                      LinkedIn Profile →
                    </a>
                  </div>
                )}
                {application.portfolioUrl && (
                  <div>
                    <a
                      href={application.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-400 hover:text-gold-500 font-medium"
                    >
                      Portfolio →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
                <CardDescription>Update application status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => handleStatusChange(value as ApplicationStatus)}
                      disabled={application.status === value}
                      className={`w-full px-4 py-2 text-left text-sm rounded-lg transition-colors ${
                        application.status === value
                          ? "bg-gold-400 text-white"
                          : "bg-gray-100 dark:bg-navy-700 hover:bg-gray-200 dark:hover:bg-navy-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card>
              <CardHeader>
                <CardTitle>Rating</CardTitle>
                <CardDescription>Rate this candidate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${
                        star <= (rating || application.rating || 0)
                          ? "text-gold-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription>Add internal notes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  rows={6}
                  placeholder="Add notes about this candidate..."
                  value={notes || application.notes || ""}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button
                  onClick={handleSaveNotes}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Saving..." : "Save Notes & Rating"}
                </Button>
              </CardContent>
            </Card>

            {/* Application Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Submitted</Label>
                  <p>{new Date(application.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 dark:text-gray-400">Last Updated</Label>
                  <p>{new Date(application.updatedAt).toLocaleString()}</p>
                </div>
                {application.screeningScore && (
                  <div>
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      AI Screening Score
                    </Label>
                    <p className="font-medium">{application.screeningScore}/100</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
