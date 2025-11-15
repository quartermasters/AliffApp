# ALIFF-RECRUITER: AI Resume Parser

## Overview

The ALIFF-RECRUITER resume parser is a sophisticated AI-powered system that extracts **50+ structured fields** from candidate resumes (PDF/DOCX) and enables automated screening, interview scheduling, and provider matching.

## Architecture

```
Application Submitted (API Route)
        ↓
Trigger Resume Parser (Queue)
        ↓
Extract Text (PDF/DOCX) → Parse with AI (GPT-4) → Validate & Enhance
        ↓
Update Application (Database)
        ↓
Trigger Initial Screening (Phase 1 Task 5)
```

## Files

### 1. `types.ts` - Type Definitions
Comprehensive TypeScript interfaces for:
- **ParsedResume**: 50+ fields across 10 categories
  - Personal Info (name, email, phone, location, timezone)
  - Professional Summary (summary, objective, headline)
  - Work Experience (company, position, dates, responsibilities, achievements, technologies, domain)
  - Education (institution, degree, field, GPA, honors)
  - Skills (technical, soft, languages, tools, frameworks, certifications)
  - Professional Links (LinkedIn, GitHub, portfolio, website, Twitter)
  - Domain Expertise (GOVCON, Healthcare, Cybersecurity, IT, etc.)
  - Experience Metrics (total years, years in current role, number of companies/projects)
  - GOVCON Experience (federal agencies, SLED, proposal types, contract wins, win rate)
  - Clearances & Certifications (security clearance, status, professional certs, licenses)
  - Availability & Preferences (available, availability date, work type, hours/week, willing to relocate)
  - Compensation (current salary, expected salary, hourly rate)
  - Metadata (format, length, confidence score, timestamp, AI model)

- **WorkExperience**: Detailed job history with domain tagging
- **Education**: Academic background
- **ResumeParsingResult**: Success/error wrapper with confidence scoring

### 2. `parser.ts` - AI Parser Implementation
Core parsing engine with:

**Text Extraction:**
- `extractPdfText()`: Extract text from PDF files (uses `pdf-parse`)
- `extractDocxText()`: Extract text from DOCX files (uses `mammoth`)
- `extractResumeText()`: Unified interface for both formats

**AI Parsing:**
- `parseResumeWithAI()`: GPT-4 powered structured extraction
- Uses comprehensive prompt with GOVCON/SLED keyword detection
- Returns confidence score (0-100) based on completeness

**Domain Detection:**
- `detectGovconExperience()`: Identifies government contracting experience
  - Scans for FAR/DFARS, RFP/RFQ, federal agencies (DoD, VA, HHS, DHS, etc.)
  - Calculates years of GOVCON experience from work history
  - Detects SLED (state/local/education) experience
  - Extracts proposal types (RFP, RFQ, IFB)

**Metrics Calculation:**
- `calculateTotalExperience()`: Accurate years calculation from work history
- Handles current positions (no end date)
- Accounts for overlapping employment

**Main Functions:**
- `parseResume(filePath, format)`: Main entry point for single resume
- `parseResumeBatch(resumes[])`: Batch processing for multiple resumes

### 3. `queue.ts` - Async Job Processing
Background job orchestration:

**Job Triggers:**
- `triggerResumeParser(applicationId, resumeUrl)`: Enqueue parsing job
- `triggerInitialScreening(applicationId, result)`: Enqueue screening (Phase 1 Task 5)

**Processing:**
- `processResumeAsync()`: Async resume processing pipeline
  1. Download resume from cloud storage (S3/MinIO)
  2. Extract text based on format
  3. Parse with AI
  4. Update application in database
  5. Trigger next step (screening)

**Database Updates:**
- `updateApplicationWithParsedData()`: Store parsed JSON in `Application.parsedData`
- `updateApplicationStatus()`: Update status (SUBMITTED → PARSED → SCREENED → etc.)

**Queue Management:**
- `getQueueStatus()`: Monitor pending/processing/completed/failed jobs
- `retryFailedParsing()`: Retry failed parsing attempts

**Production Implementation:**
- Use **BullMQ** with Redis for job queue
- Use **Vercel Edge Functions** for serverless background jobs
- Use **AWS SQS + Lambda** for distributed processing

## Dependencies

Install required packages:

```bash
npm install pdf-parse mammoth ai @ai-sdk/openai nanoid
```

### Package Details:
- **pdf-parse**: Extract text from PDF files
- **mammoth**: Extract text from DOCX files
- **ai**: Vercel AI SDK for multi-model orchestration
- **@ai-sdk/openai**: OpenAI provider for AI SDK (GPT-4)
- **nanoid**: Generate unique IDs

## Usage

### 1. Single Resume Parsing

```typescript
import { parseResume } from "@/lib/aliff/recruiter/parser";

const result = await parseResume(
  "/uploads/resumes/john-doe-resume.pdf",
  "pdf"
);

if (result.success) {
  console.log("Parsed successfully!");
  console.log("Name:", result.data.personalInfo.fullName);
  console.log("Email:", result.data.personalInfo.email);
  console.log("Years of experience:", result.data.metrics.totalYearsExperience);
  console.log("GOVCON experience:", result.data.govconExperience?.hasGovconExperience);
  console.log("Confidence:", result.confidence);
} else {
  console.error("Parsing failed:", result.errors);
}
```

### 2. Trigger from API Route (Current Implementation)

```typescript
// In /api/recruitment/apply/route.ts
import { triggerResumeParser } from "@/lib/aliff/recruiter/queue";

// After saving application
await triggerResumeParser(application.id, resumeUrl);

// Parser runs asynchronously:
// 1. Extracts text from resume
// 2. Parses with GPT-4
// 3. Updates Application.parsedData
// 4. Triggers initial screening
```

### 3. Batch Processing

```typescript
import { parseResumeBatch } from "@/lib/aliff/recruiter/parser";

const resumes = [
  { filePath: "/uploads/resume1.pdf", format: "pdf", applicationId: "app1" },
  { filePath: "/uploads/resume2.docx", format: "docx", applicationId: "app2" },
];

const results = await parseResumeBatch(resumes);

results.forEach(({ applicationId, result }) => {
  console.log(`${applicationId}: ${result.success ? "✓" : "✗"}`);
});
```

## Extracted Fields (50+ Total)

### Personal Information (10 fields)
- firstName, lastName, fullName
- email, phone
- location, city, state, country, timezone

### Professional Summary (3 fields)
- professionalSummary, objective, headline

### Work Experience (array, 12 fields each)
- company, position, location
- startDate, endDate, isCurrent, duration
- description, responsibilities[], achievements[]
- technologies[], domain

### Education (array, 7 fields each)
- institution, degree, field, location
- graduationDate, gpa, honors[]

### Skills (6 categories)
- technical[], soft[], languages[]
- tools[], frameworks[], certifications[]

### Professional Links (5 fields)
- linkedin, github, portfolio, website, twitter

### Domains (array)
- Industry expertise (GOVCON, Healthcare, Cybersecurity, IT, etc.)

### Experience Metrics (4 fields)
- totalYearsExperience, yearsInCurrentRole
- numberOfCompanies, numberOfProjects

### GOVCON Experience (6 fields)
- hasGovconExperience, yearsOfGovconExperience
- federalAgenciesWorkedWith[], sledExperience
- proposalTypes[], contractWins, winRate

### Clearances & Certifications (4 fields)
- securityClearance, clearanceStatus
- professionalCertifications[], licenses[]

### Availability & Preferences (5 fields)
- isAvailable, availabilityDate, preferredWorkType
- hoursPerWeek, willingToRelocate

### Compensation (3 fields)
- currentSalary, expectedSalary, hourlyRate

### Metadata (6 fields)
- resumeFormat, resumeLength, lastUpdated
- parsingConfidence, parsingTimestamp, aiModel

## GOVCON/SLED Detection

### GOVCON Keywords (20+)
- Proposal types: RFP, RFQ, IFB
- Compliance: FAR, DFARS, CMMC, FedRAMP, NIST
- Processes: Section L, Section M, past performance, capability statement, compliance matrix
- Methodologies: Shipley
- Contracts: GSA Schedule, 8(a), SDVOSB, WOSB, HUBZone

### Federal Agencies
- DoD, VA, DHS, HHS, GSA, DOE, NASA, DOJ, State Department, USAID

### SLED Keywords (10+)
- SLED, state government, local government
- education, K-12, higher education
- municipal, county, state procurement, cooperative purchasing

## Confidence Scoring

The parser assigns a confidence score (0-100) based on:
- **Completeness**: How many fields were successfully extracted
- **Validation**: Email format, phone format, date parsing
- **Context**: Presence of multiple work experiences, education entries
- **Domain Match**: Keywords matching job requirements

**Scoring Thresholds:**
- **90-100**: Excellent parsing, all major fields extracted
- **75-89**: Good parsing, minor fields missing
- **60-74**: Acceptable parsing, some fields missing
- **<60**: Poor parsing, manual review required

## Error Handling

### Common Errors:
1. **Unsupported format**: Only PDF and DOCX supported
2. **File too large**: Max 5MB (configurable)
3. **Empty resume**: Text extraction failed or resume is blank
4. **Missing required fields**: firstName, lastName, or email not found
5. **AI timeout**: GPT-4 API timeout (retry with exponential backoff)

### Error Response:
```typescript
{
  success: false,
  errors: ["Missing required fields: personalInfo.email"],
  confidence: 0
}
```

## Performance

### Benchmarks (estimated):
- **PDF extraction**: 1-2 seconds
- **DOCX extraction**: 0.5-1 second
- **AI parsing (GPT-4)**: 5-10 seconds
- **Total processing time**: 7-13 seconds per resume

### Optimization:
- Batch processing for multiple resumes (parallel)
- Queue system prevents API route timeouts
- Async processing doesn't block application submission
- Retry logic for transient failures (3 attempts with exponential backoff)

## Database Integration

### Application Table Update:
```typescript
await prisma.application.update({
  where: { id: applicationId },
  data: {
    parsedData: result.data, // JSONB field with all 50+ fields
    status: 'PARSED',
    updatedAt: new Date(),
  },
});
```

### Querying Parsed Data:
```typescript
// Find candidates with GOVCON experience
const govconCandidates = await prisma.application.findMany({
  where: {
    parsedData: {
      path: ['govconExperience', 'hasGovconExperience'],
      equals: true,
    },
  },
});

// Find candidates with 5+ years experience
const experiencedCandidates = await prisma.application.findMany({
  where: {
    parsedData: {
      path: ['metrics', 'totalYearsExperience'],
      gte: 5,
    },
  },
});

// Find candidates with active security clearance
const clearedCandidates = await prisma.application.findMany({
  where: {
    parsedData: {
      path: ['clearancesAndCerts', 'clearanceStatus'],
      equals: 'Active',
    },
  },
});
```

## Next Steps

### Phase 1 Task 5: Initial Screening Algorithm
After parsing, candidates are automatically screened:
1. Match skills to job requirements
2. Calculate match score (0-100)
3. Filter top 30% candidates
4. Auto-reject bottom 40%
5. Middle 30% → manual review

**Implementation**: `src/lib/aliff/recruiter/screening.ts`

### Phase 2: AI Chat Interviews
Top candidates from screening receive AI chat interview invitations:
1. Send SMS/email invitation within 24 hours
2. 15-minute conversational interview
3. Multi-AI evaluation (GPT-4, Claude, Gemini)
4. Consensus score → advance to skills test

### Phase 3: Skills Testing
Passing chat interview candidates receive role-specific tests:
1. Auto-generated based on job requirements
2. Time-boxed submission portal
3. Multi-AI grading with detailed feedback
4. Score ≥75 → auto-hire (CV Bank conversion)

## Production Checklist

- [ ] Install dependencies: `pdf-parse`, `mammoth`, `ai`, `@ai-sdk/openai`
- [ ] Set OpenAI API key: `OPENAI_API_KEY` environment variable
- [ ] Configure cloud storage: MinIO or S3 for resume uploads
- [ ] Set up job queue: BullMQ with Redis
- [ ] Configure retry logic: 3 attempts, exponential backoff
- [ ] Monitor parsing queue: Dashboard for admin
- [ ] Set up alerting: Slack/email for parsing failures
- [ ] Run Prisma migration: `npx prisma migrate dev`
- [ ] Test batch processing: 100+ resumes
- [ ] Performance tuning: Optimize GPT-4 prompts for speed

## Contact

For questions or issues, contact the ALIFF-CEO system or review the complete specification:
- `Planning/ALIFF_RECRUITER_SPECIFICATION.md`
- `Planning/ALIFF_RECRUITER_CONFIDENTIAL_STRATEGY.md`
