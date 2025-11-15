import { parseResume } from "./parser";
import { ResumeParsingResult } from "./types";

/**
 * ALIFF-RECRUITER Resume Processing Queue
 *
 * In production, this would use a job queue system like:
 * - BullMQ with Redis
 * - Vercel Edge Functions with background jobs
 * - AWS SQS + Lambda
 *
 * For now, we'll simulate async processing with delayed execution
 */

/**
 * Trigger resume parsing for a submitted application
 * This runs asynchronously after the application is submitted
 */
export async function triggerResumeParser(
  applicationId: string,
  resumeUrl: string,
  jobSlug?: string
): Promise<void> {
  console.log(
    `[Resume Queue] Queued parsing job for application: ${applicationId}`
  );

  // In production, this would enqueue a job:
  /*
  await resumeParsingQueue.add('parse-resume', {
    applicationId,
    resumeUrl,
    jobSlug,
    timestamp: new Date().toISOString(),
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
  */

  // Simulate async processing (don't await in production)
  processResumeAsync(applicationId, resumeUrl, jobSlug).catch((error) => {
    console.error(
      `[Resume Queue] Failed to process application ${applicationId}:`,
      error
    );
  });
}

/**
 * Process resume parsing asynchronously
 */
async function processResumeAsync(
  applicationId: string,
  resumeUrl: string,
  jobSlug?: string
): Promise<void> {
  try {
    // Extract file format from URL
    const fileExtension = resumeUrl.split(".").pop()?.toLowerCase() || "pdf";
    const format =
      fileExtension === "pdf"
        ? "pdf"
        : fileExtension === "docx" || fileExtension === "doc"
        ? "docx"
        : "pdf";

    // Convert URL to file path (in production, download from S3/MinIO)
    const filePath = resumeUrl.startsWith("http")
      ? await downloadResume(resumeUrl)
      : resumeUrl.replace("/uploads/", "public/uploads/");

    console.log(`[Resume Queue] Parsing resume for ${applicationId}...`);

    // Parse the resume
    const result = await parseResume(filePath, format);

    if (result.success && result.data) {
      console.log(
        `[Resume Queue] ✓ Parsed successfully (confidence: ${result.confidence}%)`
      );

      // Update application with parsed data
      await updateApplicationWithParsedData(applicationId, result);

      // Trigger next step: initial screening
      await triggerInitialScreening(applicationId, result, jobSlug);
    } else {
      console.error(
        `[Resume Queue] ✗ Parsing failed:`,
        result.errors?.join(", ")
      );

      // Update application status to show parsing failure
      await updateApplicationStatus(applicationId, "PARSING_FAILED", {
        errors: result.errors,
      });
    }
  } catch (error) {
    console.error(`[Resume Queue] Exception during processing:`, error);
    throw error;
  }
}

/**
 * Update application with parsed resume data
 */
async function updateApplicationWithParsedData(
  applicationId: string,
  result: ResumeParsingResult
): Promise<void> {
  // In production with Prisma:
  /*
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      parsedData: result.data as any, // Store as JSONB
      status: 'PARSED',
      updatedAt: new Date(),
    },
  });
  */

  console.log(
    `[Database] Updated application ${applicationId} with parsed data`
  );
}

/**
 * Update application status
 */
async function updateApplicationStatus(
  applicationId: string,
  status: string,
  metadata?: any
): Promise<void> {
  // In production with Prisma:
  /*
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      metadata: metadata as any,
      updatedAt: new Date(),
    },
  });
  */

  console.log(`[Database] Updated application ${applicationId} status: ${status}`);
}

/**
 * Download resume from remote URL (S3/MinIO)
 */
async function downloadResume(url: string): Promise<string> {
  // In production, download from cloud storage:
  /*
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const tempPath = `/tmp/${nanoid()}.pdf`;
  await writeFile(tempPath, Buffer.from(buffer));
  return tempPath;
  */

  console.log(`[Storage] Simulating download from: ${url}`);
  return "/tmp/simulated-resume.pdf";
}

/**
 * Trigger initial screening algorithm (Phase 1 Task 5)
 */
export async function triggerInitialScreening(
  applicationId: string,
  parsingResult: ResumeParsingResult,
  jobSlug?: string
): Promise<void> {
  console.log(
    `[Screening Queue] Queued screening for application: ${applicationId}`
  );

  // In production, this would enqueue the next job:
  /*
  await screeningQueue.add('initial-screening', {
    applicationId,
    parsedData: parsingResult.data,
    jobSlug,
    timestamp: new Date().toISOString(),
  });
  */

  // Process screening asynchronously
  processScreeningAsync(applicationId, parsingResult, jobSlug).catch(
    (error) => {
      console.error(
        `[Screening Queue] Failed to screen application ${applicationId}:`,
        error
      );
    }
  );
}

/**
 * Process candidate screening asynchronously
 */
async function processScreeningAsync(
  applicationId: string,
  parsingResult: ResumeParsingResult,
  jobSlug?: string
): Promise<void> {
  try {
    if (!parsingResult.data) {
      console.error(
        `[Screening Queue] No parsed data for application ${applicationId}`
      );
      return;
    }

    // Get job requirements
    const { getJobRequirements, screenCandidate } = await import(
      "./screening"
    );

    const jobRequirements = jobSlug
      ? getJobRequirements(jobSlug)
      : {
          category: "IT_SERVICES" as const,
          requiredSkills: [],
          minYearsExperience: 2,
        };

    console.log(
      `[Screening Queue] Screening ${parsingResult.data.personalInfo.fullName}...`
    );

    // Run screening algorithm
    const screening = screenCandidate(parsingResult.data, jobRequirements);

    console.log(
      `[Screening Queue] ✓ Score: ${screening.matchScore}/100 - ${screening.recommendation}`
    );

    // Update application with screening results
    await updateApplicationWithScreening(applicationId, screening);

    // If candidate passes screening (TOP tier), trigger next step
    if (screening.recommendation === "ADVANCE") {
      console.log(
        `[Screening Queue] 🎯 ${parsingResult.data.personalInfo.fullName} advanced to chat interview queue`
      );
      // Phase 2: await triggerChatInterview(applicationId);
    } else if (screening.recommendation === "REVIEW") {
      console.log(
        `[Screening Queue] ⚠️  ${parsingResult.data.personalInfo.fullName} flagged for manual review`
      );
      // Notify recruiting team
    } else {
      console.log(
        `[Screening Queue] ✗ ${parsingResult.data.personalInfo.fullName} did not meet minimum requirements`
      );
      // Send rejection email (automated but polite)
    }
  } catch (error) {
    console.error(`[Screening Queue] Exception during screening:`, error);
    throw error;
  }
}

/**
 * Update application with screening results
 */
async function updateApplicationWithScreening(
  applicationId: string,
  screening: any
): Promise<void> {
  // In production with Prisma:
  /*
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      screeningScore: screening.matchScore,
      status: screening.recommendation === 'ADVANCE' ? 'SCREENED_PASSED' :
              screening.recommendation === 'REVIEW' ? 'SCREENED_REVIEW' :
              'SCREENED_REJECTED',
      metadata: {
        screening: screening,
      },
      updatedAt: new Date(),
    },
  });
  */

  console.log(
    `[Database] Updated application ${applicationId} with screening score: ${screening.matchScore}/100`
  );
}

/**
 * Get parsing queue status (for admin dashboard)
 */
export async function getQueueStatus(): Promise<{
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}> {
  // In production, query BullMQ:
  /*
  const counts = await resumeParsingQueue.getJobCounts();
  return {
    pending: counts.waiting,
    processing: counts.active,
    completed: counts.completed,
    failed: counts.failed,
  };
  */

  return {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  };
}

/**
 * Retry failed parsing jobs
 */
export async function retryFailedParsing(
  applicationId: string
): Promise<void> {
  console.log(`[Resume Queue] Retrying failed parsing for: ${applicationId}`);

  // In production, query application and re-enqueue:
  /*
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { resumeUrl: true },
  });

  if (application?.resumeUrl) {
    await triggerResumeParser(applicationId, application.resumeUrl);
  }
  */
}
