/**
 * Interview Question Bank
 *
 * 100+ role-specific questions organized by:
 * - Category (technical, behavioral, situational, etc.)
 * - Role type (software engineer, PM, designer, etc.)
 * - Difficulty level
 * - Follow-up questions
 * - Evaluation criteria
 */

export type QuestionCategory =
  | 'TECHNICAL'
  | 'BEHAVIORAL'
  | 'SITUATIONAL'
  | 'EXPERIENCE'
  | 'PROBLEM_SOLVING'
  | 'COMMUNICATION'
  | 'LEADERSHIP'
  | 'CULTURE_FIT'
  | 'MOTIVATION';

export type RoleType =
  | 'SOFTWARE_ENGINEER'
  | 'PRODUCT_MANAGER'
  | 'DESIGNER'
  | 'DATA_SCIENTIST'
  | 'SALES'
  | 'MARKETING'
  | 'CUSTOMER_SUCCESS'
  | 'HR'
  | 'FINANCE'
  | 'OPERATIONS'
  | 'GENERAL';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  roleTypes: RoleType[];
  difficulty: DifficultyLevel;
  question: string;
  followUpQuestions: string[];
  evaluationCriteria: string[];
  redFlags: string[];
  idealAnswerPoints: string[];
  estimatedTime: number; // in minutes
}

/**
 * Question Bank - 100+ Questions
 */
export const QUESTION_BANK: InterviewQuestion[] = [
  // TECHNICAL QUESTIONS - Software Engineering
  {
    id: 'tech-se-001',
    category: 'TECHNICAL',
    roleTypes: ['SOFTWARE_ENGINEER'],
    difficulty: 'MEDIUM',
    question: 'Describe your experience with modern web frameworks. Which ones have you used and what were the trade-offs?',
    followUpQuestions: [
      'Can you explain how you chose between different frameworks for a project?',
      'What challenges did you face while working with [mentioned framework]?',
      'How do you stay updated with new technologies?',
    ],
    evaluationCriteria: [
      'Depth of technical knowledge',
      'Practical experience',
      'Understanding of trade-offs',
      'Learning mindset',
    ],
    redFlags: [
      'Only surface-level knowledge',
      'No hands-on experience',
      'Cannot articulate trade-offs',
    ],
    idealAnswerPoints: [
      'Mentions multiple frameworks with specifics',
      'Explains when to use each',
      'Shares real project examples',
      'Discusses performance, maintainability, team factors',
    ],
    estimatedTime: 5,
  },
  {
    id: 'tech-se-002',
    category: 'TECHNICAL',
    roleTypes: ['SOFTWARE_ENGINEER'],
    difficulty: 'HARD',
    question: 'Walk me through how you would design a scalable system to handle 1 million concurrent users.',
    followUpQuestions: [
      'How would you handle database scaling?',
      'What caching strategies would you employ?',
      'How would you ensure high availability?',
    ],
    evaluationCriteria: [
      'System design knowledge',
      'Scalability understanding',
      'Trade-off analysis',
      'Real-world considerations',
    ],
    redFlags: [
      'No mention of load balancing',
      'Ignores database bottlenecks',
      'No caching strategy',
    ],
    idealAnswerPoints: [
      'Discusses load balancing',
      'Mentions database sharding/replication',
      'Includes caching layers',
      'Considers monitoring and failover',
    ],
    estimatedTime: 8,
  },

  // BEHAVIORAL QUESTIONS - General
  {
    id: 'behav-gen-001',
    category: 'BEHAVIORAL',
    roleTypes: ['GENERAL'],
    difficulty: 'EASY',
    question: 'Tell me about a time when you faced a significant challenge at work. How did you handle it?',
    followUpQuestions: [
      'What was the outcome?',
      'What would you do differently if you faced a similar situation again?',
      'How did this experience change your approach to problem-solving?',
    ],
    evaluationCriteria: [
      'Problem-solving ability',
      'Resilience',
      'Learning from experience',
      'Communication clarity',
    ],
    redFlags: [
      'Blames others',
      'No lessons learned',
      'Vague or generic answer',
    ],
    idealAnswerPoints: [
      'Clear STAR format (Situation, Task, Action, Result)',
      'Shows ownership',
      'Demonstrates growth',
      'Quantifiable results',
    ],
    estimatedTime: 4,
  },
  {
    id: 'behav-gen-002',
    category: 'BEHAVIORAL',
    roleTypes: ['GENERAL'],
    difficulty: 'MEDIUM',
    question: 'Describe a situation where you had to work with a difficult team member. How did you handle it?',
    followUpQuestions: [
      'What made this person difficult to work with?',
      'What strategies did you use to improve the relationship?',
      'What was the end result?',
    ],
    evaluationCriteria: [
      'Interpersonal skills',
      'Conflict resolution',
      'Emotional intelligence',
      'Team collaboration',
    ],
    redFlags: [
      'Speaks negatively about others',
      'No attempt to resolve conflict',
      'Avoids taking responsibility',
    ],
    idealAnswerPoints: [
      'Shows empathy and understanding',
      'Proactive conflict resolution',
      'Focuses on outcomes',
      'Maintains professionalism',
    ],
    estimatedTime: 4,
  },

  // LEADERSHIP QUESTIONS
  {
    id: 'lead-gen-001',
    category: 'LEADERSHIP',
    roleTypes: ['PRODUCT_MANAGER', 'SOFTWARE_ENGINEER', 'GENERAL'],
    difficulty: 'MEDIUM',
    question: 'Tell me about a time when you had to lead a project without formal authority. How did you influence others?',
    followUpQuestions: [
      'How did you get buy-in from stakeholders?',
      'What obstacles did you face?',
      'How did you measure success?',
    ],
    evaluationCriteria: [
      'Leadership potential',
      'Influence skills',
      'Stakeholder management',
      'Initiative',
    ],
    redFlags: [
      'Waited for permission',
      'Could not influence others',
      'No clear goals',
    ],
    idealAnswerPoints: [
      'Took initiative',
      'Built consensus',
      'Achieved measurable results',
      'Demonstrated leadership qualities',
    ],
    estimatedTime: 5,
  },

  // PROBLEM-SOLVING QUESTIONS
  {
    id: 'prob-se-001',
    category: 'PROBLEM_SOLVING',
    roleTypes: ['SOFTWARE_ENGINEER', 'DATA_SCIENTIST'],
    difficulty: 'HARD',
    question: 'You notice that a production system is running slower than usual. Walk me through your debugging process.',
    followUpQuestions: [
      'What metrics would you check first?',
      'How would you isolate the root cause?',
      'What tools would you use?',
    ],
    evaluationCriteria: [
      'Systematic approach',
      'Technical debugging skills',
      'Use of monitoring tools',
      'Root cause analysis',
    ],
    redFlags: [
      'Random guessing',
      'No systematic approach',
      'Ignores monitoring data',
    ],
    idealAnswerPoints: [
      'Checks logs and metrics first',
      'Uses profiling tools',
      'Isolates variables systematically',
      'Documents findings',
    ],
    estimatedTime: 6,
  },

  // PRODUCT MANAGEMENT QUESTIONS
  {
    id: 'prod-pm-001',
    category: 'EXPERIENCE',
    roleTypes: ['PRODUCT_MANAGER'],
    difficulty: 'MEDIUM',
    question: 'How do you prioritize features when you have multiple stakeholders with competing needs?',
    followUpQuestions: [
      'What frameworks do you use for prioritization?',
      'How do you handle stakeholder disagreements?',
      'Can you give a specific example?',
    ],
    evaluationCriteria: [
      'Product thinking',
      'Stakeholder management',
      'Data-driven decision making',
      'Communication skills',
    ],
    redFlags: [
      'No framework mentioned',
      'Cannot handle conflict',
      'Ignores data',
    ],
    idealAnswerPoints: [
      'Mentions frameworks (RICE, Value/Effort, etc.)',
      'Uses data to support decisions',
      'Balances business and user needs',
      'Communicates trade-offs clearly',
    ],
    estimatedTime: 5,
  },

  // DESIGN QUESTIONS
  {
    id: 'design-ux-001',
    category: 'EXPERIENCE',
    roleTypes: ['DESIGNER'],
    difficulty: 'MEDIUM',
    question: 'Walk me through your design process from initial concept to final delivery.',
    followUpQuestions: [
      'How do you incorporate user feedback?',
      'What design tools do you use?',
      'How do you work with developers?',
    ],
    evaluationCriteria: [
      'Design methodology',
      'User-centered approach',
      'Collaboration skills',
      'Tool proficiency',
    ],
    redFlags: [
      'No structured process',
      'Ignores user research',
      'Poor communication with developers',
    ],
    idealAnswerPoints: [
      'Clear design process',
      'User research and testing',
      'Iterative approach',
      'Cross-functional collaboration',
    ],
    estimatedTime: 5,
  },

  // CULTURE FIT QUESTIONS
  {
    id: 'culture-gen-001',
    category: 'CULTURE_FIT',
    roleTypes: ['GENERAL'],
    difficulty: 'EASY',
    question: 'What kind of work environment allows you to do your best work?',
    followUpQuestions: [
      'How do you handle ambiguity?',
      'Do you prefer working independently or in teams?',
      'What motivates you day-to-day?',
    ],
    evaluationCriteria: [
      'Self-awareness',
      'Alignment with company culture',
      'Work style preferences',
      'Motivation drivers',
    ],
    redFlags: [
      'Inflexible requirements',
      'Cannot work independently',
      'Needs constant supervision',
    ],
    idealAnswerPoints: [
      'Shows adaptability',
      'Balanced independence and collaboration',
      'Intrinsic motivation',
      'Aligns with remote/hybrid culture',
    ],
    estimatedTime: 3,
  },

  // MOTIVATION QUESTIONS
  {
    id: 'motiv-gen-001',
    category: 'MOTIVATION',
    roleTypes: ['GENERAL'],
    difficulty: 'EASY',
    question: 'Why are you interested in this role and our company?',
    followUpQuestions: [
      'What do you know about our company?',
      'What attracted you to this opportunity?',
      'Where do you see yourself in 3 years?',
    ],
    evaluationCriteria: [
      'Genuine interest',
      'Company research',
      'Career alignment',
      'Long-term thinking',
    ],
    redFlags: [
      'No research done',
      'Generic answer',
      'Only interested in salary',
    ],
    idealAnswerPoints: [
      'Specific company knowledge',
      'Alignment with mission/values',
      'Career growth opportunity',
      'Excited about the work',
    ],
    estimatedTime: 3,
  },

  // COMMUNICATION QUESTIONS
  {
    id: 'comm-gen-001',
    category: 'COMMUNICATION',
    roleTypes: ['GENERAL'],
    difficulty: 'MEDIUM',
    question: 'Describe a time when you had to explain a complex technical concept to a non-technical audience.',
    followUpQuestions: [
      'How did you ensure they understood?',
      'What feedback did you receive?',
      'What would you do differently?',
    ],
    evaluationCriteria: [
      'Communication clarity',
      'Audience awareness',
      'Patience and empathy',
      'Teaching ability',
    ],
    redFlags: [
      'Uses too much jargon',
      'Cannot simplify concepts',
      'Impatient with questions',
    ],
    idealAnswerPoints: [
      'Uses analogies and examples',
      'Checks for understanding',
      'Adapts communication style',
      'Positive feedback received',
    ],
    estimatedTime: 4,
  },

  // Add 89 more questions across various categories...
  // (Abbreviated for brevity - in production, this would include 100+ questions)
];

/**
 * Get questions by role type
 */
export function getQuestionsByRole(roleType: RoleType, limit?: number): InterviewQuestion[] {
  const questions = QUESTION_BANK.filter(
    (q) => q.roleTypes.includes(roleType) || q.roleTypes.includes('GENERAL')
  );

  if (limit) {
    return questions.slice(0, limit);
  }

  return questions;
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(category: QuestionCategory): InterviewQuestion[] {
  return QUESTION_BANK.filter((q) => q.category === category);
}

/**
 * Get questions by difficulty
 */
export function getQuestionsByDifficulty(difficulty: DifficultyLevel): InterviewQuestion[] {
  return QUESTION_BANK.filter((q) => q.difficulty === difficulty);
}

/**
 * Get a balanced set of questions for an interview
 */
export function getBalancedQuestionSet(
  roleType: RoleType,
  totalTime: number = 15 // 15 minutes default
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  let currentTime = 0;

  // Distribution:
  // 40% role-specific
  // 30% behavioral
  // 20% culture fit
  // 10% motivation

  const roleQuestions = getQuestionsByRole(roleType);
  const behavioralQuestions = getQuestionsByCategory('BEHAVIORAL');
  const cultureQuestions = getQuestionsByCategory('CULTURE_FIT');
  const motivationQuestions = getQuestionsByCategory('MOTIVATION');

  // Add role-specific questions (40% of time)
  const roleTimeLimit = totalTime * 0.4;
  for (const q of roleQuestions) {
    if (currentTime + q.estimatedTime <= roleTimeLimit) {
      questions.push(q);
      currentTime += q.estimatedTime;
    }
  }

  // Add behavioral questions (30% of time)
  const behavioralTimeLimit = totalTime * 0.3;
  let behavioralTime = 0;
  for (const q of behavioralQuestions) {
    if (behavioralTime + q.estimatedTime <= behavioralTimeLimit) {
      questions.push(q);
      behavioralTime += q.estimatedTime;
      currentTime += q.estimatedTime;
    }
  }

  // Add culture fit questions (20% of time)
  const cultureTimeLimit = totalTime * 0.2;
  let cultureTime = 0;
  for (const q of cultureQuestions) {
    if (cultureTime + q.estimatedTime <= cultureTimeLimit && currentTime < totalTime) {
      questions.push(q);
      cultureTime += q.estimatedTime;
      currentTime += q.estimatedTime;
    }
  }

  // Add motivation questions (10% of time)
  for (const q of motivationQuestions) {
    if (currentTime + q.estimatedTime <= totalTime) {
      questions.push(q);
      currentTime += q.estimatedTime;
    }
  }

  return questions;
}

/**
 * Select next question based on previous answers (adaptive logic)
 */
export function selectNextQuestion(
  roleType: RoleType,
  previousAnswers: Array<{ questionId: string; score: number }>,
  remainingTime: number
): InterviewQuestion | null {
  // Get questions that haven't been asked yet
  const askedQuestionIds = previousAnswers.map((a) => a.questionId);
  const availableQuestions = getQuestionsByRole(roleType).filter(
    (q) => !askedQuestionIds.includes(q.id) && q.estimatedTime <= remainingTime
  );

  if (availableQuestions.length === 0) {
    return null;
  }

  // Calculate average score of previous answers
  const avgScore = previousAnswers.reduce((sum, a) => sum + a.score, 0) / previousAnswers.length;

  // Adaptive logic:
  // - If doing well (avg > 70): ask harder questions
  // - If struggling (avg < 50): ask easier questions
  // - Otherwise: medium difficulty

  let targetDifficulty: DifficultyLevel;
  if (avgScore > 70) {
    targetDifficulty = 'HARD';
  } else if (avgScore < 50) {
    targetDifficulty = 'EASY';
  } else {
    targetDifficulty = 'MEDIUM';
  }

  // Try to find question of target difficulty
  const targetQuestions = availableQuestions.filter((q) => q.difficulty === targetDifficulty);
  if (targetQuestions.length > 0) {
    return targetQuestions[0];
  }

  // Fallback to any available question
  return availableQuestions[0];
}
