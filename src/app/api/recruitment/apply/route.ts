import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

// This would use Prisma in production
// import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const jobSlug = formData.get("jobSlug") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const portfolioUrl = formData.get("portfolioUrl") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const resume = formData.get("resume") as File;

    // Validate required fields
    if (!firstName || !lastName || !email || !resume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save resume file
    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExtension = resume.name.split(".").pop();
    const filename = `${nanoid()}-${Date.now()}.${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");

    // In production, use MinIO or S3
    // For now, save locally
    try {
      await writeFile(path.join(uploadDir, filename), buffer);
    } catch (error) {
      // If directory doesn't exist, we'll handle gracefully
      console.error("File upload error:", error);
    }

    const resumeUrl = `/uploads/resumes/${filename}`;

    // Create application record
    // In production with Prisma:
    /*
    const application = await prisma.application.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        resumeUrl,
        coverLetter: coverLetter || null,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        portfolioUrl: portfolioUrl || null,
        jobId: await getJobIdFromSlug(jobSlug),
        status: "SUBMITTED",
      },
    });
    */

    // Simulated application record for development
    const application = {
      id: nanoid(),
      firstName,
      lastName,
      email,
      phone,
      resumeUrl,
      coverLetter,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      jobSlug,
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
    };

    // In Phase 1 Task 4, we'll trigger AI resume parsing here
    // await triggerResumeParser(application.id, resumeUrl);

    // In Phase 1 Task 5, we'll trigger initial screening
    // await triggerInitialScreening(application.id);

    console.log("Application submitted:", {
      id: application.id,
      name: `${firstName} ${lastName}`,
      email,
      jobSlug,
      resumeSize: resume.size,
    });

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: "Application submitted successfully",
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// Helper function to get job ID from slug (would query database in production)
async function getJobIdFromSlug(slug: string): Promise<string> {
  // In production with Prisma:
  /*
  const job = await prisma.jobPosting.findUnique({
    where: { slug },
    select: { id: true },
  });
  return job?.id || "";
  */
  return nanoid(); // Simulated for development
}
