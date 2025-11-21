/**
 * ALIFF-RECRUITER Chat Interview System - Type Definitions
 *
 * Supports both web-based and SMS-based interviews
 */

export type InterviewStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "FAILED";

export type InterviewChannel = "WEB" | "SMS" | "EMAIL";

export type MessageRole = "interviewer" | "candidate" | "system";

export interface InterviewMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: {
    sentiment?: "positive" | "neutral" | "negative";
    confidence?: number;
    flags?: string[]; // ["vague", "incomplete", "excellent"]
  };
}

export interface InterviewSession {
  id: string;
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobTitle: string;
  jobSlug: string;
  channel: InterviewChannel;
  status: InterviewStatus;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  durationMinutes?: number;
  messages: InterviewMessage[];
  currentQuestionIndex: number;
  questionsAsked: string[];
  metadata: {
    parsedResume?: any;
    screeningScore?: number;
    interviewScore?: number;
    evaluations?: MultiAIEvaluation[];
    strengths?: string[];
    concerns?: string[];
  };
}

export interface InterviewQuestion {
  id: string;
  category: "BEHAVIORAL" | "TECHNICAL" | "SITUATIONAL" | "CULTURAL" | "ROLE_SPECIFIC";
  question: string;
  followUps?: string[];
  expectedKeywords?: string[];
  scoringCriteria?: {
    excellent: string[];
    good: string[];
    poor: string[];
  };
  jobCategories?: ("GOVCON" | "SLED" | "IT_SERVICES" | "WRITING_SERVICES")[];
}

export interface InterviewQuestionBank {
  behavioral: InterviewQuestion[];
  technical: {
    govcon: InterviewQuestion[];
    sled: InterviewQuestion[];
    itServices: InterviewQuestion[];
    writingServices: InterviewQuestion[];
  };
  situational: InterviewQuestion[];
  cultural: InterviewQuestion[];
}

export interface MultiAIEvaluation {
  questionId: string;
  question: string;
  candidateAnswer: string;
  evaluations: {
    gpt4: {
      score: number; // 0-100
      reasoning: string;
      strengths: string[];
      concerns: string[];
    };
    claude: {
      score: number;
      reasoning: string;
      strengths: string[];
      concerns: string[];
    };
    gemini: {
      score: number;
      reasoning: string;
      strengths: string[];
      concerns: string[];
    };
  };
  consensusScore: number; // Average of all three
  finalVerdict: "EXCELLENT" | "GOOD" | "ACCEPTABLE" | "POOR";
}

export interface InterviewSummary {
  sessionId: string;
  applicationId: string;
  candidateName: string;
  overallScore: number; // 0-100
  recommendation: "ADVANCE" | "REVIEW" | "REJECT";
  breakdown: {
    behavioralScore: number;
    technicalScore: number;
    situationalScore: number;
    culturalScore: number;
    communicationScore: number;
  };
  strengths: string[];
  concerns: string[];
  topAnswers: Array<{
    question: string;
    answer: string;
    score: number;
  }>;
  poorAnswers: Array<{
    question: string;
    answer: string;
    score: number;
    issue: string;
  }>;
  aiConsensusNotes: string;
  humanReviewNotes?: string;
  nextSteps: string;
}

export interface InterviewInvitation {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobTitle: string;
  interviewUrl: string;
  expiresAt: Date;
  channel: InterviewChannel;
  scheduledAt?: Date;
}

export interface InterviewConfiguration {
  maxDurationMinutes: number; // Default: 15
  minQuestionsRequired: number; // Default: 8
  maxQuestionsAllowed: number; // Default: 12
  enableFollowUps: boolean; // Default: true
  enableSMSFallback: boolean; // Default: true
  aiModel: "gpt-4-turbo" | "gpt-4o" | "claude-3-5-sonnet";
  evaluationModels: {
    gpt4: string;
    claude: string;
    gemini: string;
  };
  scoringWeights: {
    behavioral: number;
    technical: number;
    situational: number;
    cultural: number;
    communication: number;
  };
  passThreshold: number; // Default: 70
}

export const DEFAULT_INTERVIEW_CONFIG: InterviewConfiguration = {
  maxDurationMinutes: 15,
  minQuestionsRequired: 8,
  maxQuestionsAllowed: 12,
  enableFollowUps: true,
  enableSMSFallback: true,
  aiModel: "gpt-4-turbo",
  evaluationModels: {
    gpt4: "gpt-4-turbo",
    claude: "claude-3-5-sonnet-20241022",
    gemini: "gemini-1.5-pro",
  },
  scoringWeights: {
    behavioral: 0.25,
    technical: 0.35,
    situational: 0.2,
    cultural: 0.1,
    communication: 0.1,
  },
  passThreshold: 70,
};
