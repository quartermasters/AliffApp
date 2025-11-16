# AI Interview Conversation Flow - ALIFF Recruiter

## Overview
After CV and photo upload, candidates are redirected to a 5-10 minute conversational interview with ALIFF, our AI recruitment agent. The interview feels natural and human-like while systematically gathering critical information and evaluating the candidate.

---

## Interview Objectives

### Primary Goals
1. **Verify CV Information** - Confirm key details from parsed resume
2. **Assess Availability** - Determine hours/week, days/month, start date
3. **Evaluate Communication** - Test written English, clarity, professionalism
4. **Gauge Motivation** - Understand why they're interested in this role
5. **Capture Additional Context** - Skills, tools, preferences not in CV
6. **Screen Fit** - Red flags, expectations, contractor understanding

### Data to Capture
- **Availability**: Hours per day, days per month, preferred schedule
- **Start Date**: When they can begin work
- **Hourly Rate**: Expected compensation (validate against CV)
- **Skills Confidence**: Rate their proficiency in required tools/technologies
- **Work Style**: Remote work experience, communication preferences, timezone
- **Motivation**: Why this role, career goals, what attracted them
- **Portfolio**: Links to work samples, GitHub, LinkedIn
- **Red Flags**: Job hopping, unrealistic expectations, poor communication

---

## Conversation Structure

### **Stage 1: Warm Welcome (30-60 seconds)**
**Objective**: Set comfortable tone, introduce interview purpose

```
ALIFF: Hi [FirstName]! 👋 Thanks for applying to the [JobTitle] position.
I'm reviewing your application and have a few questions to better understand
your background and availability. This should only take 5-10 minutes.

I've reviewed your CV and I'm impressed by your [specific skill/experience from CV].
Let's start - can you tell me a bit about your current situation? Are you currently
working or available to start immediately?
```

**Natural Variations**:
- If CV shows current employment: "I see you're currently at [Company]. Are you looking for a transition or additional contractor work?"
- If CV shows gap: "I noticed you've been focusing on [something from CV]. What have you been working on recently?"

---

### **Stage 2: Availability Deep Dive (2-3 minutes)**
**Objective**: Get precise availability data

**Q1: Current Situation**
```
ALIFF: Great, thanks for sharing. So you mentioned [repeat their answer].
Let me ask - if we move forward, how many hours per day could you realistically
commit to this role? We're looking for someone who can work [X] hours/day consistently.
```

**Follow-ups**:
- "And how many days per month would you be available? We typically need [Y] days/month."
- "What's your preferred schedule? Morning, afternoon, flexible?"
- "Any upcoming commitments or travel that might affect your availability in the next 3 months?"

**Q2: Start Date**
```
ALIFF: Perfect. If we decide to move forward, when would you be able to start?
We have projects kicking off [mention timeline from job posting].
```

---

### **Stage 3: Skills & Experience Validation (3-4 minutes)**
**Objective**: Verify technical capabilities and confidence level

**Q3: Core Skills Assessment**
```
ALIFF: I saw on your CV that you have experience with [skill1, skill2, skill3].
On a scale of 1-10, how would you rate your current proficiency with [most critical skill]?
And can you give me a quick example of a recent project where you used it?
```

**Follow-ups**:
- "What about [skill2]? Same scale - how comfortable are you with that?"
- "Are there any tools or technologies you're particularly excited to work with in this role?"
- "Any skills you're currently learning or want to develop?"

**Q4: Work Samples / Portfolio**
```
ALIFF: Do you have any work samples, portfolio links, or GitHub projects you'd
like me to review? These really help us understand your style and capabilities.
```

---

### **Stage 4: Remote Work & Communication (1-2 minutes)**
**Objective**: Assess remote work readiness

**Q5: Remote Work Experience**
```
ALIFF: This is a fully remote contractor role. How much remote work experience
do you have? What's your home office setup like?
```

**Follow-ups**:
- "How do you typically communicate with teams? Slack, email, video calls?"
- "What timezone are you in? Any preferences for meeting times?"
- "How do you stay organized and track your work when working remotely?"

---

### **Stage 5: Compensation & Expectations (1-2 minutes)**
**Objective**: Align on pay and contractor terms

**Q6: Rate Expectations**
```
ALIFF: Let's talk about compensation. I see you mentioned PKR [X]/hour on your
application. Just to confirm - is that still your expected rate? And are you
comfortable with the contractor setup (1099, monthly payments, no benefits)?
```

**Follow-ups**:
- "Have you worked as a contractor before? Any questions about how it works?"
- "Our typical range for this role is PKR [range] - does that align with your expectations?"

---

### **Stage 6: Motivation & Cultural Fit (1-2 minutes)**
**Objective**: Understand why they want this role

**Q7: Motivation**
```
ALIFF: I'm curious - what attracted you to this particular role at Aliff Services?
What are you hoping to get out of this opportunity?
```

**Follow-ups**:
- "Where do you see yourself in the next 1-2 years career-wise?"
- "What kind of work environment helps you do your best work?"

---

### **Stage 7: Final Questions & Next Steps (1 minute)**
**Objective**: Close professionally, set expectations

**Q8: Candidate Questions**
```
ALIFF: Thanks for sharing all of that, [FirstName]. This has been really helpful.
Do you have any questions for me about the role, the team, or how we work?
```

**Closing**
```
ALIFF: Perfect! Here's what happens next:

1. I'm going to analyze our conversation along with your CV
2. You'll receive a confirmation email within 24 hours
3. If your profile matches what we're looking for, our team will reach out within 3-5 business days to discuss next steps
4. Either way, your profile is now in our CV bank, so we'll keep you in mind for future opportunities

Thanks so much for your time today, [FirstName]. Best of luck, and we'll be in touch soon!
```

---

## Conversation Patterns & Personality

### ALIFF's Tone
- **Professional but warm** - Not overly formal, use contractions ("I'm" not "I am")
- **Encouraging** - "That's great!", "Love to hear that", "Impressive"
- **Curious** - Ask follow-up questions, show genuine interest
- **Clear** - No jargon unless candidate uses it first
- **Efficient** - Keep it moving, 5-10 minutes total

### Natural Language Patterns
- Use candidate's name 2-3 times throughout
- Reference specific details from their CV to show you've read it
- Transition smoothly: "Great, that makes sense. Let me ask..."
- Acknowledge their answers: "Got it", "Thanks for clarifying", "That's helpful"

### Handling Common Scenarios

**Candidate gives short answers:**
```
ALIFF: No worries! Let me ask it differently - [rephrase question with example]
```

**Candidate rambles:**
```
ALIFF: That's really interesting, thanks for sharing. Just to make sure I capture
this correctly - would you say [summarize key point]?
```

**Candidate asks about salary/benefits mid-interview:**
```
ALIFF: Great question - let me cover that in just a moment. First, I want to
make sure I understand your background fully. [Continue current stage]
```

**Candidate seems confused:**
```
ALIFF: No problem, let me clarify. [Explain in simpler terms]
```

---

## Data Extraction & Scoring

### Structured Data Points to Capture
```json
{
  "interviewId": "uuid",
  "applicationId": "ref",
  "candidateId": "ref",
  "startedAt": "timestamp",
  "completedAt": "timestamp",
  "duration": "seconds",
  "responses": {
    "currentSituation": "text",
    "hoursPerDay": "number",
    "daysPerMonth": "number",
    "preferredSchedule": "text",
    "startDate": "date",
    "skillProficiency": {
      "skill1": {"rating": 8, "example": "text"},
      "skill2": {"rating": 7, "example": "text"}
    },
    "portfolioLinks": ["url1", "url2"],
    "remoteExperience": "text",
    "homeOfficeSetup": "text",
    "communicationPreferences": "text",
    "timezone": "text",
    "expectedRate": "number",
    "contractorExperience": "boolean",
    "motivation": "text",
    "careerGoals": "text",
    "candidateQuestions": "text"
  },
  "aiAnalysis": {
    "communicationScore": 85,
    "availabilityFit": 90,
    "technicalConfidence": 75,
    "motivationLevel": 80,
    "redFlags": [],
    "strengths": ["clear communication", "relevant experience", "immediate availability"],
    "overallScore": 82,
    "recommendation": "PROCEED_TO_HUMAN_REVIEW | ADD_TO_TALENT_POOL | REJECT",
    "notes": "text"
  },
  "transcript": "full conversation text"
}
```

### Scoring Criteria

**Communication Score (0-100)**
- Grammar and spelling
- Clarity of responses
- Professionalism
- Response length (too short = low engagement, too long = unfocused)

**Availability Fit (0-100)**
- Hours/day match (within ±2 hours of job requirement)
- Days/month match (within ±3 days)
- Start date (sooner = higher score)
- Schedule flexibility

**Technical Confidence (0-100)**
- Self-rated proficiency on required skills (average)
- Quality of examples provided
- Breadth of skills mentioned
- Portfolio quality (if provided)

**Motivation Level (0-100)**
- Specificity of answer (generic = low, specific = high)
- Career goals alignment
- Understanding of role
- Enthusiasm indicators (exclamation points, positive language)

**Red Flags (deduct points)**
- Unrealistic salary expectations (±50% from budget)
- Poor communication (spelling errors, unclear responses)
- Availability mismatch (needs <50% of required hours)
- No remote work experience + bad setup
- Job hopping pattern (mentioned switching jobs frequently)
- Lack of engagement (very short answers, no questions)

**Overall Score Calculation**
```
Overall = (Communication * 0.3) + (AvailabilityFit * 0.25) + (TechnicalConfidence * 0.25) + (Motivation * 0.2) - RedFlagPenalties
```

**Recommendation Thresholds**
- **85-100**: PROCEED_TO_HUMAN_REVIEW (high priority)
- **70-84**: PROCEED_TO_HUMAN_REVIEW (standard)
- **50-69**: ADD_TO_TALENT_POOL (not now, but keep on file)
- **0-49**: REJECT (polite rejection email)

---

## Technical Implementation Notes

### Frontend: Chat Interview Component
- Real-time chat interface (looks like WhatsApp/Slack)
- ALIFF avatar + name
- Typing indicators when ALIFF is "thinking"
- Message timestamps
- Progress indicator (Question 3 of 8)
- "End Interview" button (with confirmation)

### Backend: Interview API
- `POST /api/interview/start` - Initiate interview with applicationId
- `POST /api/interview/respond` - Send user message, get ALIFF response
- `POST /api/interview/complete` - Finalize interview, trigger analysis
- `GET /api/interview/:id/status` - Check interview progress

### AI Engine (Claude API)
- System prompt with interview persona + question flow
- Conversation history context
- Structured data extraction after each response
- Dynamic question routing based on answers
- Final analysis generation at end

### Database Schema
```prisma
model Interview {
  id              String   @id @default(uuid())
  applicationId   String   @unique
  application     Application @relation(fields: [applicationId], references: [id])

  startedAt       DateTime @default(now())
  completedAt     DateTime?
  duration        Int? // seconds

  transcript      Json // full conversation
  responses       Json // structured data
  aiAnalysis      Json // scoring and recommendations

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## Next Steps

1. ✅ Design conversation flow (this document)
2. ⏳ Create Prisma schema for Interview model
3. ⏳ Build chat UI component (`InterviewChat.tsx`)
4. ⏳ Implement interview API endpoints
5. ⏳ Integrate Claude API for conversation
6. ⏳ Build data extraction and scoring system
7. ⏳ Modify application wizard to redirect after Step 1
8. ⏳ Add interview data to CV bank profile
9. ⏳ Create confirmation email with interview summary
10. ⏳ Build admin dashboard to review interviews

---

## Questions to Resolve

1. **Redirect Timing**: Should interview happen immediately after CV upload (Step 1) or after all 3 steps?
   - **Recommendation**: After Step 1 (CV + photo), before Step 2. Get them engaged while excited.

2. **Interview Skipping**: Can candidates skip the interview and proceed to traditional application?
   - **Recommendation**: No. Interview is mandatory. Reduces low-quality applications.

3. **Interview Timeout**: What if candidate abandons mid-interview?
   - **Recommendation**: Save progress, allow resume within 24 hours. After 24h, mark incomplete.

4. **Multiple Attempts**: Can they retake the interview?
   - **Recommendation**: No. One interview per application. Prevents gaming the system.

5. **Language Support**: English only or multilingual?
   - **Recommendation**: English only for now. Communication skill assessment.

