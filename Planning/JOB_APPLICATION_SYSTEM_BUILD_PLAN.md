# Job Application & Processing System - Complete Build Plan
## AI-First Recruitment with ALIFF-RECRUITER Integration

**Date Created**: November 16, 2025
**Status**: Ready for Implementation
**Estimated Timeline**: 8-10 weeks
**Goal**: Build end-to-end AI-powered application system with CV Bank and embedded interviews

---

## Executive Summary

This build plan implements the complete ALIFF-RECRUITER vision for job applications:
- **Multi-step wizard** with AI assistance throughout
- **Dual photo capture** (uploaded + CV-extracted)
- **100% applicant interview rate** via embedded AI chat
- **Universal CV Bank** - every applicant gets permanent profile
- **Rich data capture** - 50+ fields, salary, availability, interview transcripts
- **Zero contact exposure** - email-only, no phone/SMS

---

## Phase 1: Foundation & Database Design (Week 1)

### Task 1: Review Current Architecture
**Goal**: Understand existing application system and identify integration points

**Actions**:
- [ ] Audit current Prisma schema for JobPosting, Application models
- [ ] Review existing `/api/applications/submit` endpoint
- [ ] Check current file upload implementation (`/api/upload`)
- [ ] Document data flow: Form → API → Database → Email
- [ ] Identify reusable components vs. new builds

**Deliverables**:
- Architecture diagram of current system
- List of components to keep vs. rebuild
- Integration points for new features

---

### Task 2: Design CV Bank Database Schema
**Goal**: Create comprehensive schema for permanent candidate profiles

**Database Tables Required**:

#### **CandidateProfile** (Main CV Bank Table)
```prisma
model CandidateProfile {
  id                String   @id @default(cuid())

  // Core Identity
  firstName         String
  lastName          String
  email             String   @unique
  phone             String?
  location          String?
  timezone          String?

  // Photos (Dual Source)
  uploadedPhotoUrl  String   // Required uploaded headshot
  cvExtractedPhotoUrl String? // Photo extracted from resume
  photoMetadata     Json?    // Source, upload date, quality score

  // Resume Data
  resumeUrl         String
  resumeText        String   @db.Text // Full extracted text
  resumeParsedData  Json     // 50+ extracted fields

  // Experience & Skills
  yearsExperience   Int?
  skills            String[] // ["GOVCON", "RFP", "Section L/M"]
  domains           String[] // ["Healthcare IT", "Cybersecurity"]
  tools             String[] // ["MS Word", "Shipley", "GPT-4"]
  certifications    String[]
  education         Json?    // Degrees, schools, years
  languages         String[] // ["English", "Spanish"]

  // Salary & Compensation
  currentSalary     Float?   // Current hourly/annual rate
  expectedSalary    Float?   // Expected hourly/annual rate
  salaryType        String?  // "HOURLY" or "ANNUAL"
  salaryNotes       String?  // Additional context

  // Availability
  hoursPerDay       Int?     // Available hours per day
  daysPerMonth      Int?     // Available days per month
  startDate         DateTime? // When can start
  employmentStatus  String?  // "AVAILABLE", "EMPLOYED", "STUDENT"

  // Professional Links
  linkedinUrl       String?
  githubUrl         String?
  portfolioUrl      String?
  otherLinks        Json?

  // AI Interview Data
  interviewTranscript Json?  // Full conversation
  interviewScore    Float?   // 0-100 overall score
  interviewScores   Json?    // {gpt4: 85, claude: 88, gemini: 82}
  interviewFeedback String?  @db.Text
  interviewDate     DateTime?

  // Screening Scores
  fitScore          Float?   // Initial resume match 0-100
  skillsMatchScore  Float?   // Required skills match %
  experienceScore   Float?   // Years experience adequacy

  // Application Metadata
  applicationId     String   @unique // Link to original application
  appliedForJobId   String   // Which job they applied for
  applicationDate   DateTime @default(now())
  applicationSource String?  // "LinkedIn", "Indeed", "Referral"

  // Status & Engagement
  status            CandidateStatus // APPLIED, INTERVIEWED, VALIDATED, ACTIVE, INACTIVE
  lastContactedAt   DateTime?
  responseTime      Int?     // Avg minutes to respond
  engagementScore   Float?   // Email open/click rates

  // Performance (if hired)
  projectsCompleted Int      @default(0)
  avgRating         Float?
  onTimeRate        Float?

  // Search & Matching
  searchEmbedding   Float[]  // Vector embedding for semantic search

  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  application       Application @relation(fields: [applicationId], references: [id])
  appliedForJob     JobPosting @relation(fields: [appliedForJobId], references: [id])
  projects          Project[]
  notes             RecruiterNote[]
}

enum CandidateStatus {
  APPLIED           // Just submitted application
  SCREENING         // AI resume screening in progress
  INTERVIEWED       // Completed AI interview
  VALIDATED         // Passed all checks, in talent pool
  ACTIVE            // Currently working on projects
  INACTIVE          // In pool but not active
  ARCHIVED          // Opted out or disqualified
}
```

#### **Application** (Enhanced Existing Model)
```prisma
model Application {
  id                String   @id @default(cuid())
  jobId             String

  // Core Info
  firstName         String
  lastName          String
  email             String
  phone             String?

  // Files
  resumeUrl         String
  uploadedPhotoUrl  String   // Required headshot
  coverLetter       String?  @db.Text

  // Professional Links
  linkedinUrl       String?
  githubUrl         String?
  portfolioUrl      String?

  // Salary & Availability (NEW)
  currentSalary     Float?
  expectedSalary    Float?
  hoursPerDay       Int?
  daysPerMonth      Int?

  // AI Processing
  parsedData        Json     // Resume extraction results
  fitScore          Float?   // Initial match score

  // Interview (NEW)
  interviewCompleted Boolean @default(false)
  interviewTranscript Json?
  interviewScore    Float?

  // Status
  status            ApplicationStatus

  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  job               JobPosting @relation(fields: [jobId], references: [id])
  candidateProfile  CandidateProfile?
}

enum ApplicationStatus {
  SUBMITTED         // Just submitted
  PARSING           // AI extracting resume data
  INTERVIEWING      // In AI interview
  INTERVIEW_COMPLETE // Interview done, awaiting review
  UNDER_REVIEW      // Human review
  ACCEPTED          // Moving to talent pool
  REJECTED          // Not a fit
  WITHDRAWN         // Candidate withdrew
}
```

#### **InterviewSession** (Interview Tracking)
```prisma
model InterviewSession {
  id                String   @id @default(cuid())
  applicationId     String

  // Session Info
  startedAt         DateTime @default(now())
  completedAt       DateTime?
  duration          Int?     // Seconds

  // Questions & Answers
  messages          Json     // Full conversation array
  questionsAsked    String[] // Question IDs from bank

  // AI Evaluation
  gpt4Score         Float?
  claudeScore       Float?
  geminiScore       Float?
  consensusScore    Float?   // Average

  // Feedback
  strengths         String[] // Key strengths identified
  concerns          String[] // Red flags or gaps
  recommendation    String?  // HIRE, MAYBE, REJECT
  detailedFeedback  String?  @db.Text

  // Metadata
  userAgent         String?  // Browser info
  ipAddress         String?  // For fraud detection

  createdAt         DateTime @default(now())

  // Relations
  application       Application @relation(fields: [applicationId], references: [id])
}
```

#### **InterviewQuestionBank** (Question Library)
```prisma
model InterviewQuestion {
  id                String   @id @default(cuid())

  // Question Content
  category          QuestionCategory
  roleType          String[] // ["GOVCON", "SLED", "IT"]
  question          String   @db.Text
  followUpQuestions String[] // Adaptive follow-ups

  // Evaluation Criteria
  evaluationCriteria String  @db.Text
  idealAnswer       String?  @db.Text
  redFlags          String[] // Warning signs in answers

  // Usage Stats
  timesAsked        Int      @default(0)
  avgScore          Float?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum QuestionCategory {
  EXPERIENCE_VALIDATION    // Verify claimed experience
  PROBLEM_SOLVING         // Scenario-based questions
  SKILLS_ASSESSMENT       // Technical knowledge
  CULTURE_FIT             // Working style, preferences
  AVAILABILITY            // Logistics, commitment
}
```

#### **RecruiterNote** (Human Oversight)
```prisma
model RecruiterNote {
  id                String   @id @default(cuid())
  candidateId       String

  note              String   @db.Text
  category          String   // "INTERVIEW", "PERFORMANCE", "FOLLOW_UP"
  createdBy         String   // User ID

  createdAt         DateTime @default(now())

  candidate         CandidateProfile @relation(fields: [candidateId], references: [id])
}
```

**Deliverables**:
- Complete Prisma schema file
- Migration scripts
- Database indexes for search optimization

---

### Task 3: Create Prisma Models
**Goal**: Implement database schema in codebase

**Actions**:
- [ ] Add new models to `prisma/schema.prisma`
- [ ] Create database migration: `npx prisma migrate dev --name add_cv_bank`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Test migrations on development database
- [ ] Seed sample data for testing

**Deliverables**:
- Updated schema.prisma
- Migration files
- Seeded test data

---

## Phase 2: Multi-Step Application Wizard UI (Week 2)

### Task 4: Build Step 1 - Resume + Photo Upload
**Goal**: Create first step with dual file uploads

**Component**: `/src/components/careers/ApplicationStep1.tsx`

**Features**:
- Drag-and-drop resume upload (PDF, Word, Photo)
- Separate headshot photo upload
- File validation (type, size)
- Preview uploaded files
- Progress indicators
- AI parsing status display

**UI Design**:
```
┌─────────────────────────────────────────────────────────────┐
│  Step 1 of 3: Upload Your Documents                        │
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│  Resume / CV *                                               │
│  ┌─────────────────────────────────────────────────┐        │
│  │   📤  Drop resume here or click to browse       │        │
│  │       PDF, Word, or Photo • Max 5MB             │        │
│  └─────────────────────────────────────────────────┘        │
│                                                               │
│  Professional Headshot *                                     │
│  ┌─────────────────────────────────────────────────┐        │
│  │   📸  Upload your photo                         │        │
│  │       JPG, PNG • Max 2MB                        │        │
│  └─────────────────────────────────────────────────┘        │
│                                                               │
│  [Continue to Step 2 →]                                      │
└─────────────────────────────────────────────────────────────┘
```

**Deliverables**:
- ApplicationStep1.tsx component
- File upload handlers
- Validation logic

---

### Task 5: Build Step 2 - Verify + Salary/Availability
**Goal**: Show AI-extracted data and collect critical info

**Component**: `/src/components/careers/ApplicationStep2.tsx`

**Features**:
- Display auto-filled personal info (editable)
- Salary input fields (current + expected)
- Availability inputs (hours/day, days/month)
- Start date selector
- Professional links (LinkedIn, GitHub, Portfolio)
- Real-time validation

**UI Design**:
```
┌─────────────────────────────────────────────────────────────┐
│  Step 2 of 3: Verify & Complete Your Profile               │
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│  ✨ Auto-filled from your resume (please verify):           │
│                                                               │
│  Name: Marcus Johnson ✓                                      │
│  Email: marcus.j@email.com ✓                                │
│  Phone: +1 (555) 123-4567                                   │
│                                                               │
│  Compensation Details:                                       │
│  Current Rate: $____ /hour  (optional)                      │
│  Expected Rate: $____ /hour *                               │
│                                                               │
│  Availability:                                               │
│  Hours per day: [___] (1-12)                                │
│  Days per month: [___] (1-30)                               │
│  Can start: [Date Picker]                                   │
│                                                               │
│  Professional Links:                                         │
│  LinkedIn: ________________________________                  │
│  Portfolio: ________________________________                 │
│                                                               │
│  [← Back]  [Continue to Interview →]                        │
└─────────────────────────────────────────────────────────────┘
```

**Deliverables**:
- ApplicationStep2.tsx component
- Form state management
- Validation rules

---

### Task 6: Build Step 3 - Optional Context
**Goal**: Collect additional context (moved post-interview)

**Component**: `/src/components/careers/ApplicationStep3.tsx`

**Features**:
- Cover letter / motivation (optional)
- Referral source
- Additional notes
- Privacy consent checkboxes

**UI Design**:
```
┌─────────────────────────────────────────────────────────────┐
│  Step 3 of 3: Add Context (Optional)                       │
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│  Why are you interested in this role?                        │
│  ┌─────────────────────────────────────────────────┐       │
│  │                                                   │       │
│  │ (150-300 words, optional)                        │       │
│  │                                                   │       │
│  └─────────────────────────────────────────────────┘       │
│                                                               │
│  How did you hear about us?                                  │
│  [Dropdown: LinkedIn, Indeed, Referral, Other]              │
│                                                               │
│  Consent:                                                    │
│  [✓] Store my profile in CV Bank for future opportunities   │
│  [✓] I agree to Privacy Policy and Terms                    │
│                                                               │
│  [← Back]  [Submit Application →]                           │
└─────────────────────────────────────────────────────────────┘
```

**Deliverables**:
- ApplicationStep3.tsx component
- Consent tracking
- Final submission handler

---

## Phase 3: File Upload & AI Processing (Week 3)

### Task 7: Implement Resume Upload with Validation
**Goal**: Secure, validated file upload system

**API Endpoint**: `/api/applications/upload-resume`

**Features**:
- Accept PDF, Word (.doc, .docx), images (JPG, PNG for scanned resumes)
- Validate file size (max 5MB)
- Virus scanning (ClamAV or similar)
- Store in cloud storage (S3, Vercel Blob, or Cloudinary)
- Return secure URL

**Deliverables**:
- Upload API endpoint
- File validation logic
- Storage integration

---

### Task 8: Implement Headshot Photo Upload
**Goal**: Separate photo upload for professional headshots

**API Endpoint**: `/api/applications/upload-photo`

**Features**:
- Accept JPG, PNG only
- Validate file size (max 2MB)
- Image compression (max 800x800px)
- Face detection (optional - verify it's a headshot)
- Store separately from resume

**Deliverables**:
- Photo upload endpoint
- Image processing
- Validation rules

---

### Task 9: Integrate AI Resume Parsing
**Goal**: Extract 50+ fields from resume automatically

**API Endpoint**: `/api/applications/parse-resume`

**Technology**: OpenAI GPT-4 Vision + Text extraction

**Extraction Fields**:
```typescript
interface ParsedResumeData {
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;

  // Experience
  totalYearsExperience: number;
  workHistory: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];

  // Skills
  technicalSkills: string[];
  domainExpertise: string[];
  tools: string[];
  certifications: string[];

  // Education
  education: {
    degree: string;
    school: string;
    graduationYear: number;
  }[];

  // Links
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;

  // Achievements
  achievements: string[];
  publications?: string[];
  awards?: string[];

  // Metadata
  resumeFormat: string; // PDF, Word, etc.
  hasPhoto: boolean;
  pageCount: number;
}
```

**Process**:
1. Extract text from PDF/Word using `pdf-parse` or `mammoth`
2. Send text to OpenAI with structured prompt
3. Parse response into typed object
4. Validate and sanitize data
5. Return parsed data + confidence scores

**Deliverables**:
- Resume parsing service
- OpenAI integration
- Data validation

---

### Task 10: Build Photo Extraction from PDFs
**Goal**: Extract embedded photos from resume PDFs

**Technology**: `pdf-lib` + image extraction

**Process**:
1. Scan PDF for embedded images
2. Extract first photo (usually headshot)
3. Validate it's a face (optional - use face detection API)
4. Save as separate file
5. Return URL

**Deliverables**:
- Photo extraction utility
- Image validation
- Storage handling

---

### Task 11: Create Auto-Fill Logic
**Goal**: Pre-populate form fields from parsed data

**Component**: Form state management in Step 2

**Logic**:
```typescript
// After parsing completes
const parseResult = await parseResume(resumeFile);

// Auto-fill form state
setFormData({
  firstName: parseResult.firstName,
  lastName: parseResult.lastName,
  email: parseResult.email,
  phone: parseResult.phone,
  linkedinUrl: parseResult.linkedinUrl,
  githubUrl: parseResult.githubUrl,
  portfolioUrl: parseResult.portfolioUrl,
  // ... other fields
});

// Show confidence indicators
setFieldConfidence({
  email: 0.95, // High confidence
  phone: 0.60, // Low confidence - might be wrong
});
```

**Deliverables**:
- Auto-fill state management
- Confidence indicators
- Edit capability

---

## Phase 4: Candidate Fit Scoring (Week 3-4)

### Task 12: Build Fit Scoring Algorithm
**Goal**: Calculate 0-100 match score for candidates

**API Endpoint**: `/api/applications/calculate-fit-score`

**Scoring Factors**:
```typescript
interface FitScoreCalculation {
  // Skills Match (40 points)
  requiredSkillsMatch: number;      // 0-30 (# of required skills matched)
  preferredSkillsMatch: number;     // 0-10 (bonus for preferred skills)

  // Experience (30 points)
  yearsExperienceScore: number;     // 0-20 (meets minimum? exceeds?)
  domainExperienceScore: number;    // 0-10 (GOVCON, SLED, etc.)

  // Availability (15 points)
  hoursAvailabilityScore: number;   // 0-10 (can meet project needs?)
  startDateScore: number;           // 0-5 (immediate vs. delayed)

  // Professional Presence (10 points)
  linkedinScore: number;            // 0-5 (has profile? complete?)
  portfolioScore: number;           // 0-5 (has work samples?)

  // Compensation Alignment (5 points)
  salaryAlignmentScore: number;     // 0-5 (within budget?)

  // Total
  totalScore: number;               // 0-100
}
```

**Algorithm**:
1. Extract job requirements from JobPosting
2. Compare with parsed resume data
3. Calculate each component score
4. Weight and sum to total 0-100
5. Generate explanation of score

**Deliverables**:
- Scoring algorithm
- Explanation generator
- API endpoint

---

## Phase 5: ALIFF-RECRUITER Interview System (Week 4-6)

### Task 13: Design Chat Interview Interface
**Goal**: Real-time chat UI for AI interview

**Component**: `/src/components/careers/AIInterviewChat.tsx`

**UI Design**:
```
┌─────────────────────────────────────────────────────────────┐
│  🤖 ALIFF-RECRUITER Interview                               │
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │ ALIFF (Just now)                              │          │
│  │ Hi Marcus! 👋 Thanks for applying to the      │          │
│  │ GOVCON Proposal Writer role. I'm ALIFF,       │          │
│  │ the AI that handles first interviews.         │          │
│  │                                                 │          │
│  │ This will be a casual 15-minute chat to       │          │
│  │ learn about your experience. Ready to start?  │          │
│  │                                                 │          │
│  │ [Yes, let's start!] [Need a minute]           │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
│  ┌───────────────────────────────────────────────┐          │
│  │ Type your message...                           │          │
│  │ [Send]                                         │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
│  ⏱️ Time Remaining: 14:32                                   │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- Real-time message display
- Typing indicators
- Time tracker (15 minutes)
- Message history
- Auto-save conversation

**Deliverables**:
- Chat UI component
- WebSocket or polling for real-time
- Message state management

---

### Task 14: Build Real-Time Chat Component
**Goal**: Interactive messaging system

**Technology**: Server-Sent Events (SSE) or Polling

**Features**:
- Send user message
- Display AI response (streaming)
- Show "ALIFF is typing..." indicator
- Handle network errors gracefully
- Save messages to database

**Deliverables**:
- Chat message component
- Real-time communication
- Error handling

---

### Task 15: Create Interview Question Bank
**Goal**: Build library of role-specific questions

**Database**: InterviewQuestion model

**Question Categories**:

**GOVCON Proposal Writer**:
```typescript
const govconQuestions = [
  {
    category: "EXPERIENCE_VALIDATION",
    question: "Tell me about your most complex federal proposal. What made it challenging?",
    followUps: [
      "How did you handle Section L compliance?",
      "What was the contract value and agency?"
    ],
    evaluationCriteria: "Look for specific details, compliance knowledge, problem-solving"
  },
  {
    category: "PROBLEM_SOLVING",
    question: "An RFP drops Friday, due Monday. Your sub's tech volume is 40% done. What do you do?",
    evaluationCriteria: "Crisis management, prioritization, communication skills"
  },
  {
    category: "SKILLS_ASSESSMENT",
    question: "Explain the difference between past performance narratives and case studies in your own words.",
    evaluationCriteria: "Technical knowledge, clarity of explanation"
  },
  {
    category: "CULTURE_FIT",
    question: "Do you prefer working solo or with AI assistance for first drafts? Why?",
    evaluationCriteria: "Openness to AI, self-awareness, working style"
  },
  {
    category: "AVAILABILITY",
    question: "We have rush projects with 3-day turnarounds. How often can you take those?",
    evaluationCriteria: "Realistic assessment, commitment level"
  }
];
```

**Seed Script**: Create 100+ questions across all role types

**Deliverables**:
- Question bank seed data
- Question selection logic
- Category distribution

---

### Task 16: Implement Adaptive Interview Logic
**Goal**: AI follows up based on candidate answers

**API Endpoint**: `/api/interviews/next-question`

**Logic Flow**:
1. Candidate answers current question
2. AI analyzes answer quality
3. Decides: Follow-up deeper OR Move to next topic
4. Selects appropriate next question
5. Tracks question history (no repeats)

**Example**:
```typescript
// Candidate gives vague answer
Candidate: "I've worked on many proposals."

// AI detects lack of detail, probes deeper
ALIFF: "That's great! Can you walk me through one specific
        proposal - maybe your most challenging one? What
        agency was it for and what made it complex?"

// Candidate gives detailed answer
Candidate: "I led a $50M DHS cybersecurity proposal with
           3 subs in 10 days..."

// AI recognizes quality, asks follow-up
ALIFF: "Wow, tight timeline! How did you coordinate the
        technical volumes with subcontractors under that
        pressure?"
```

**Technology**: OpenAI function calling for decision-making

**Deliverables**:
- Adaptive logic engine
- Follow-up question generator
- Question flow controller

---

### Task 17: Build Interview Transcript Storage
**Goal**: Save every conversation for review and training

**Database**: InterviewSession model

**Storage Format**:
```typescript
interface InterviewTranscript {
  sessionId: string;
  messages: {
    role: "ALIFF" | "CANDIDATE";
    content: string;
    timestamp: Date;
    questionId?: string; // If it's a question from bank
  }[];
  metadata: {
    duration: number;
    questionsAsked: number;
    candidateResponseTime: number; // avg seconds
    completionRate: number; // 100% if finished
  };
}
```

**Deliverables**:
- Transcript save logic
- Retrieval API
- Search capability

---

### Task 18: Integrate Multi-AI Evaluation
**Goal**: 3 AI models score each answer independently

**API Endpoint**: `/api/interviews/evaluate`

**Technology**: Parallel API calls to GPT-4, Claude, Gemini

**Evaluation Process**:
```typescript
async function evaluateInterview(transcript: Message[]) {
  const evaluationPrompt = `
    Evaluate this job interview on a 0-100 scale.

    Interview Transcript:
    ${JSON.stringify(transcript)}

    Evaluate on:
    1. Experience Relevance (0-30 points)
    2. Technical Knowledge (0-25 points)
    3. Problem-Solving (0-20 points)
    4. Communication (0-15 points)
    5. Culture Fit (0-10 points)

    Provide:
    - Overall Score (0-100)
    - 3 Strengths (bullet points)
    - 3 Concerns (bullet points)
    - Recommendation: HIRE, MAYBE, REJECT
  `;

  const [gpt4, claude, gemini] = await Promise.all([
    openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: evaluationPrompt }]
    }),
    anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      messages: [{ role: "user", content: evaluationPrompt }]
    }),
    googleAI.generateContent({
      model: "gemini-1.5-pro",
      contents: [{ role: "user", parts: [{ text: evaluationPrompt }] }]
    })
  ]);

  return {
    gpt4Score: parseScore(gpt4.choices[0].message.content),
    claudeScore: parseScore(claude.content[0].text),
    geminiScore: parseScore(gemini.response.text()),
    consensusScore: average([gpt4, claude, gemini])
  };
}
```

**Deliverables**:
- Multi-AI evaluation service
- Score parsing logic
- Consensus calculation

---

### Task 19: Create Interview Scoring & Feedback
**Goal**: Generate actionable feedback for candidates and recruiters

**Output Format**:
```typescript
interface InterviewResult {
  overallScore: number; // 0-100 consensus

  scores: {
    gpt4: number;
    claude: number;
    gemini: number;
  };

  breakdown: {
    experienceRelevance: number;  // 0-30
    technicalKnowledge: number;   // 0-25
    problemSolving: number;       // 0-20
    communication: number;        // 0-15
    cultureFit: number;           // 0-10
  };

  strengths: string[];    // ["Excellent GOVCON experience", ...]
  concerns: string[];     // ["Limited SLED exposure", ...]

  recommendation: "HIRE" | "MAYBE" | "REJECT";

  detailedFeedback: string; // Human-readable summary

  nextSteps: string; // "You're moving to CV Bank!" or "We'll review..."
}
```

**Deliverables**:
- Feedback generator
- Score display UI
- Email template with results

---

## Phase 6: CV Bank Implementation (Week 7)

### Task 20: Build CV Bank Database Schema
**Goal**: Implement CandidateProfile table (from Phase 1 design)

**Actions**:
- [ ] Add CandidateProfile model to schema
- [ ] Create migration
- [ ] Add indexes for search fields
- [ ] Test with sample data

**Deliverables**:
- Database migration
- Indexed fields
- Sample profiles

---

### Task 21: Implement Automatic Profile Creation
**Goal**: Every applicant gets CV Bank entry automatically

**Trigger**: After interview completes (or application submits if no interview)

**Process**:
```typescript
async function createCVBankProfile(application: Application) {
  // Extract all data
  const profile = await prisma.candidateProfile.create({
    data: {
      // Identity
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      phone: application.phone,

      // Photos
      uploadedPhotoUrl: application.uploadedPhotoUrl,
      cvExtractedPhotoUrl: extractedPhotoFromResume,

      // Resume
      resumeUrl: application.resumeUrl,
      resumeText: parsedResumeText,
      resumeParsedData: application.parsedData,

      // Scores
      fitScore: application.fitScore,
      interviewScore: interviewSession.consensusScore,

      // Salary
      currentSalary: application.currentSalary,
      expectedSalary: application.expectedSalary,

      // Availability
      hoursPerDay: application.hoursPerDay,
      daysPerMonth: application.daysPerMonth,

      // Links
      applicationId: application.id,
      appliedForJobId: application.jobId,

      // Status
      status: determineStatus(interviewScore),

      // Search embedding (for semantic search)
      searchEmbedding: await generateEmbedding(profile)
    }
  });

  return profile;
}
```

**Deliverables**:
- Profile creation service
- Status determination logic
- Automatic trigger

---

### Task 22: Build Photo Storage System
**Goal**: Store both uploaded and extracted photos

**Storage Structure**:
```
/cv-bank-photos/
  /uploaded/
    {candidateId}_headshot.jpg
  /extracted/
    {candidateId}_cv_photo.jpg
```

**Metadata**:
```typescript
interface PhotoMetadata {
  uploadedPhoto: {
    url: string;
    uploadDate: Date;
    fileSize: number;
    dimensions: { width: number; height: number };
    source: "USER_UPLOAD";
  };
  extractedPhoto?: {
    url: string;
    extractionDate: Date;
    fileSize: number;
    dimensions: { width: number; height: number };
    source: "CV_EXTRACTION";
    confidence: number; // 0-1 (is it actually a headshot?)
  };
}
```

**Deliverables**:
- Photo storage service
- Metadata tracking
- Duplicate detection

---

### Task 23: Create 50+ Field Data Model
**Goal**: Comprehensive profile structure (already in schema)

**Validation**: Ensure all fields from spec are captured

**Fields Checklist**:
- [ ] Core identity (9 fields)
- [ ] Photos (3 fields)
- [ ] Resume data (4 fields)
- [ ] Experience & skills (8 fields)
- [ ] Salary (4 fields)
- [ ] Availability (4 fields)
- [ ] Professional links (4 fields)
- [ ] Interview data (5 fields)
- [ ] Screening scores (3 fields)
- [ ] Application metadata (4 fields)
- [ ] Status & engagement (5 fields)
- [ ] Performance (3 fields)
- [ ] Search (1 field)
- [ ] Timestamps (3 fields)

**Total**: 60+ fields ✓

**Deliverables**:
- Validated data model
- Field documentation
- Sample profiles

---

### Task 24: Implement Salary Data Capture
**Goal**: Track current and expected compensation

**Form Fields** (in Step 2):
```typescript
<div className="grid grid-cols-2 gap-4">
  <div>
    <label>Current Salary (Optional)</label>
    <input
      type="number"
      placeholder="e.g., 65"
      suffix="/hour"
    />
    <select>
      <option>Per Hour</option>
      <option>Per Year</option>
    </select>
  </div>

  <div>
    <label>Expected Salary *</label>
    <input
      type="number"
      placeholder="e.g., 75"
      suffix="/hour"
    />
  </div>
</div>

<textarea
  placeholder="Any salary notes? (e.g., negotiable, benefits expected)"
  rows={2}
/>
```

**Storage**: Both raw values + normalized to hourly rate

**Deliverables**:
- Salary input fields
- Normalization logic
- Comparison tools

---

### Task 25: Build Availability Tracking
**Goal**: Capture hours/day and days/month

**Form Fields**:
```typescript
<div className="grid grid-cols-3 gap-4">
  <div>
    <label>Hours per Day *</label>
    <input
      type="number"
      min="1"
      max="12"
      placeholder="e.g., 6"
    />
  </div>

  <div>
    <label>Days per Month *</label>
    <input
      type="number"
      min="1"
      max="30"
      placeholder="e.g., 20"
    />
  </div>

  <div>
    <label>Start Date</label>
    <DatePicker
      minDate={new Date()}
      placeholder="When can you start?"
    />
  </div>
</div>

<select>
  <option>Available Immediately</option>
  <option>Available in 2 weeks</option>
  <option>Available in 1 month</option>
  <option>Currently Employed</option>
</select>
```

**Validation**:
- Hours/day: 1-12 (reasonable work hours)
- Days/month: 1-30
- Start date: Must be future or present

**Deliverables**:
- Availability input UI
- Validation rules
- Capacity calculation

---

### Task 26: Create Application Status Workflow
**Goal**: Track candidate through entire pipeline

**Status Flow**:
```
SUBMITTED
  → PARSING (resume being analyzed)
  → INTERVIEWING (in AI chat)
  → INTERVIEW_COMPLETE (awaiting review)
  → UNDER_REVIEW (human checking)
  → ACCEPTED (moving to CV Bank as VALIDATED)
  → REJECTED (not a fit)

Or: WITHDRAWN (candidate dropped out)
```

**Automated Transitions**:
- `SUBMITTED` → `PARSING`: When resume upload succeeds
- `PARSING` → `INTERVIEWING`: When fit score ≥ 50%
- `INTERVIEWING` → `INTERVIEW_COMPLETE`: When 15 min timer ends
- `INTERVIEW_COMPLETE` → `ACCEPTED`/`REJECTED`: Based on score threshold

**Deliverables**:
- Status enum
- Transition logic
- Audit trail

---

## Phase 7: Application Submission & Follow-up (Week 8)

### Task 27: Build Submission API Endpoint
**Goal**: Handle complete application submission

**Endpoint**: `POST /api/applications/submit`

**Process**:
1. Validate all required data
2. Create Application record
3. Trigger CV Bank profile creation
4. Send confirmation email
5. Update job posting stats (application count)
6. Return success + application ID

**Deliverables**:
- Submission API
- Validation logic
- Transaction handling

---

### Task 28: Create Confirmation Email System
**Goal**: Instant email after submission

**Template**: (See earlier in doc - "Confirmation Email")

**Technology**: Resend API or SendGrid

**Triggers**:
- Immediate: Application submitted
- +2 hours: Resume parsing complete
- +1 day: Interview results (if applicable)
- +3 days: Final decision

**Deliverables**:
- Email templates
- Send service
- Template variables

---

### Task 29: Build Success Page
**Goal**: Clear next steps after submission

**Route**: `/careers/[jobId]/apply/success?applicationId=XXX`

**Content**: (See earlier in doc - "Success Page")

**Features**:
- Application summary
- Timeline display
- CTA to track status
- Chat with ALIFF button

**Deliverables**:
- Success page component
- Application data fetch
- Timeline component

---

### Task 30: Create Status Tracking Page
**Goal**: Real-time application status

**Route**: `/applications/[applicationId]`

**Features**: (See earlier in doc - "Application Dashboard")

**Data Displayed**:
- Current status
- Pipeline progress bar
- Preliminary scores
- ALIFF's latest update
- Next steps

**Deliverables**:
- Status page component
- Real-time updates
- Progress visualization

---

### Task 31: Implement Real-Time Status Updates
**Goal**: Live updates without page refresh

**Technology**: Server-Sent Events (SSE) or Polling

**Events**:
- Resume parsing progress
- Interview started
- Interview completed
- Score calculated
- Status changed

**Deliverables**:
- SSE endpoint
- Client-side listener
- UI update logic

---

### Task 32: Build Candidate Dashboard
**Goal**: Candidate self-service portal

**Route**: `/candidate/dashboard` (authenticated)

**Features**:
- View all applications
- Update profile
- Check interview results
- See CV Bank status
- Opt-out options

**Deliverables**:
- Dashboard component
- Authentication
- Profile editor

---

## Phase 8: Admin & Search (Week 9)

### Task 33: Create CV Bank Admin Interface
**Goal**: Internal tool for recruiters to search profiles

**Route**: `/admin/cv-bank`

**Features**:
- Search by name, email, skills
- Filter by status, score, date
- View full profiles
- Add recruiter notes
- Export to CSV
- Batch actions (tag, archive, contact)

**Deliverables**:
- Admin UI
- Search API
- Export function

---

### Task 34: Implement Semantic Search
**Goal**: Natural language search of CV Bank

**Technology**: Pinecone or pgvector

**Process**:
1. Generate embeddings for each profile (resume text + skills)
2. Store in vector database
3. Query with natural language
4. Return ranked results

**Example Queries**:
- "Find GOVCON proposal writers with VA experience"
- "Show me developers proficient in Next.js and PostgreSQL"
- "Who can start immediately and work 30+ hours/week?"

**Deliverables**:
- Embedding generation
- Vector storage
- Search API

---

## Phase 9: Job Details Enhancements (Week 10)

### Task 35: Add Fit Scoring to Job Page
**Goal**: Show match score if resume uploaded

**Component**: Fit Score Card on job detail page

**Logic**:
- Check session for parsed resume data
- Calculate fit score
- Display prominently
- Show skill breakdown

**Deliverables**:
- Fit score card
- Session management
- Score calculation

---

### Task 36: Build Skills Breakdown Visualization
**Goal**: Visual comparison of candidate vs. job

**Component**: Skills match chart

**Design**: Checkmark list showing matched/missing skills

**Deliverables**:
- Skills comparison component
- Visual design
- Data mapping

---

### Task 37: Create Hiring Pipeline Section
**Goal**: Transparency about process

**Component**: Pipeline timeline on job page

**Content**:
- Day 1-2: Application & Screening
- Day 2-3: AI Interview
- Day 3-5: Skills Test (if applicable)
- Day 5-7: Decision

**Deliverables**:
- Timeline component
- Content writing
- Responsive design

---

## Phase 10: Testing & QA (Week 11)

### Task 38-44: Comprehensive Testing
- Resume parsing accuracy tests
- Photo extraction validation
- Interview flow end-to-end tests
- Multi-AI evaluation consistency
- CV Bank data integrity
- User acceptance testing
- Mobile responsiveness

**Deliverables**:
- Test suite
- Bug fixes
- Performance optimization

---

## Phase 11: Polish & Deploy (Week 12)

### Task 45-50: Final Steps
- Error handling throughout
- Privacy controls and GDPR compliance
- Comprehensive documentation
- Staging deployment
- Production deployment
- Final review and launch

**Deliverables**:
- Production-ready system
- Documentation
- Launch checklist

---

## Success Metrics

### Week 4 (After Phase 5)
- [ ] 100% of applicants complete AI interview
- [ ] Average interview completion time: 12-18 minutes
- [ ] Interview satisfaction score: 4+/5

### Week 8 (After Phase 7)
- [ ] Application completion rate: 70%+ (started → submitted)
- [ ] Resume parsing accuracy: 90%+
- [ ] Email delivery rate: 98%+

### Week 12 (Launch)
- [ ] CV Bank has 100+ profiles
- [ ] Search response time: <500ms
- [ ] Zero data loss incidents
- [ ] Mobile completion rate: 50%+

---

## Risk Mitigation

**Technical Risks**:
- Resume parsing accuracy → Test with diverse formats, have human review option
- AI interview quality → Extensive question bank, multi-AI validation
- Photo extraction reliability → Fallback to uploaded photo only

**User Experience Risks**:
- Form abandonment → Progress saving, multi-step flow, clear time estimates
- Interview intimidation → Warm tone, practice mode, clear expectations

**Data Risks**:
- Privacy concerns → Clear consent, GDPR compliance, opt-out options
- Storage costs → Compression, lifecycle policies, archive old profiles

---

## Technology Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)

**Backend**:
- Next.js API Routes
- tRPC (type-safe APIs)
- Prisma ORM
- PostgreSQL (Neon)

**AI Services**:
- OpenAI GPT-4 (parsing, evaluation)
- Anthropic Claude 3.5 (evaluation)
- Google Gemini 1.5 (evaluation)
- Pinecone (vector search)

**Storage**:
- Vercel Blob (files)
- Cloudinary (images, optional)

**Communication**:
- Resend (email)

---

## Budget Estimate

**Development**: 8-12 weeks @ 40 hrs/week = 320-480 hours

**Ongoing Costs** (monthly):
- AI API calls: $200-500 (parsing + interviews)
- Database: $25 (Neon)
- Storage: $20 (Vercel Blob)
- Email: $10 (Resend)
- Vector DB: $70 (Pinecone starter)

**Total Monthly**: ~$325-625

---

## Next Steps

1. **Stakeholder Review**: Approve this plan
2. **Resource Allocation**: Assign developers
3. **Sprint Planning**: Break into 2-week sprints
4. **Kickoff**: Start Phase 1 database design

**Ready to build the future of recruitment!** 🚀
