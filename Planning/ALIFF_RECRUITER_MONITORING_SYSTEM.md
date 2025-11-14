# ALIFF-RECRUITER Performance Monitoring System
## Rigorous Time Tracking & Anti-Fraud for Hourly Remote Workers

**Classification**: CONFIDENTIAL - Internal Use Only
**Last Updated**: January 2025
**Purpose**: Prevent time theft, ensure productivity, pay only for verified work

---

## I. Core Principle

**ZERO TRUST MODEL**: In remote hourly work, providers WILL attempt to cheat the system. Our monitoring must catch:
- Idle time billed as active work
- Mouse jigglers / fake activity software
- Outsourcing work to others (paying someone PKR 50/hr while billing us PKR 200/hr)
- Inflated hours (claiming 8 hours for 3 hours of actual work)
- Multi-tasking (working for multiple clients simultaneously on our dime)

**Result**: We pay ONLY for verified, productive hours. Fraud = immediate termination + legal action for wage theft.

---

## II. Time Tracking Software Integration

### Primary Tool: Time Doctor (or Hubstaff)

**Why These Tools**:
- Industry-standard for remote hourly workers
- Screenshot capture every 3-10 minutes
- Keyboard/mouse activity tracking
- App/website monitoring (flag non-work activities)
- Idle time detection (auto-pause timer)
- Detailed productivity reports
- Anti-fraud features (detect mouse jigglers, patterns)

**Mandatory for All Hourly Providers**:
- Installed on work computer (Windows/Mac/Linux)
- Must be running during ALL billed hours
- Refusal to install = cannot work on projects
- Tampering with software = immediate termination

### How It Works

**Provider Workflow**:
1. Logs into Time Doctor app
2. Selects project from dropdown (e.g., "GOVCON Proposal - Project 247")
3. Clicks "Start Timer"
4. Works on assigned task
5. Every 3 minutes: Screenshot captured (blurred for privacy, but shows active window)
6. Mouse/keyboard activity tracked (keystrokes per minute, mouse movements)
7. If idle >3 minutes: Popup "Are you still working?" → No response = timer auto-pauses
8. Clicks "Stop Timer" when done
9. End of day: Submits timesheet for approval

**Our Backend**:
- Time Doctor syncs to our system via API
- ALIFF-RECRUITER reviews:
  - Total hours claimed
  - Activity percentage (should be >80% for most work)
  - Screenshots (AI scans for red flags: games, social media, non-work apps)
  - Idle time (excessive = suspicious)
- Auto-approves if activity >75% and no red flags
- Flags for human review if activity <75% or suspicious patterns

---

## III. Activity Monitoring & Red Flags

### What Time Doctor Tracks

**Keyboard & Mouse Activity**:
- Keystrokes per minute (writers should have consistent typing)
- Mouse movements (developers clicking, scrolling)
- Activity percentage: (Active time / Total time) × 100

**Screenshots**:
- Captured every 3 minutes (configurable: we use 3 min for high scrutiny)
- Shows active application window (MS Word, VS Code, browser, etc.)
- Can be blurred (privacy) but title bars visible

**Applications & Websites**:
- Tracks which apps/sites used during work hours
- Categories: Productive (MS Word, GitHub), Neutral (Email), Unproductive (Facebook, YouTube)
- Reports: "Provider spent 2 hours on YouTube during billed time" = red flag

**Idle Time**:
- No keyboard/mouse activity for >3 minutes = idle
- Timer auto-pauses (provider NOT paid for idle time)
- Excessive idle = suspicious (provider left computer, doing something else)

### Red Flags for ALIFF-RECRUITER AI

**Automatic Flags** (reviewed before payment):

1. **Low Activity Percentage (<60%)**:
   - Provider billed 8 hours, but only 4 hours of actual keyboard/mouse activity
   - **Action**: Human review screenshots, may reject hours or dock pay

2. **Unproductive Apps/Sites (>20% of time)**:
   - Screenshots show Facebook, Instagram, YouTube, games, shopping sites
   - **Action**: Reject those hours, warning issued

3. **Repetitive Mouse Patterns** (Mouse Jiggler Detection):
   - AI detects identical mouse movements every 30 seconds (software simulating activity)
   - **Action**: Immediate termination for fraud

4. **Idle Time Loops**:
   - Provider repeatedly goes idle for 2-3 min, returns, goes idle again (pattern of distraction)
   - **Action**: Counseling first offense, termination if repeated

5. **Inconsistent Output**:
   - Provider billed 8 hours but produced 1 page of writing (should be 4-6 pages)
   - Developer billed 10 hours but only 20 lines of code committed
   - **Action**: Output audit, may reject hours

6. **Off-Hours Activity**:
   - Provider claims 8 hours from 9am-5pm, but screenshots show different time zones or middle-of-night work (outsourcing to someone else)
   - **Action**: Investigation, potential fraud

7. **Multiple Projects Simultaneously**:
   - Time Doctor shows 2 timers running at once (working for us AND another client)
   - **Action**: Immediate termination, bill for full hours fraudulently claimed

### AI-Powered Screenshot Analysis

**ALIFF-RECRUITER Uses Computer Vision**:
- Scans screenshots for:
  - **Non-Work Content**: Social media, entertainment, shopping sites
  - **Blank Screens**: Provider walked away, screen locked
  - **Suspicious Patterns**: Same exact screen for 2 hours (screenshot loop)
  - **External Monitors**: Detects if provider working on second screen not captured (require full screen capture)

**Example AI Detection**:
```
Screenshot Analysis - Provider ID: P-2847
Hours Claimed: 8 hours (Jan 15, 2025)

Findings:
✅ Hours 1-3: MS Word active, consistent typing (proposal writing)
⚠️ Hour 4: Chrome browser - YouTube visible for 45 minutes
❌ Hour 5-6: Blank screen (screen locked) - 0% activity
✅ Hour 7-8: MS Word active, resumed writing

Recommendation:
- Approve: 5 hours (productive work)
- Reject: 3 hours (YouTube + idle time)
- Warning: Notify provider of unproductive hours
```

---

## IV. Output-Based Validation (Secondary Check)

**Time tracking alone isn't enough** - providers can fake activity. Cross-reference with deliverables:

### Proposal Writers

**Expected Output**:
- 1 hour = 0.5-1 page of quality writing (depends on complexity)
- 8 hours = 4-6 pages (Executive Summary, Technical Approach section, etc.)

**Validation**:
- Provider bills 10 hours but submits 2 pages = RED FLAG
- ALIFF-RECRUITER AI analyzes writing quality:
  - If low quality (copy-paste, ChatGPT with no editing) = fraud
  - If high quality but low volume = counseling (too slow, may need training)

### Developers

**Expected Output**:
- 1 hour = 20-50 lines of code (varies by complexity)
- Commits to GitHub/GitLab tracked
- Code review shows progress

**Validation**:
- Provider bills 12 hours but only 30 lines committed = RED FLAG
- Review code quality (if copy-pasted from Stack Overflow without understanding = fraud)

### Quality Over Quantity Rule

**Important**: Some tasks are legitimately slow (complex debugging, research-heavy writing). Human reviewer considers:
- Task complexity (debugging can be 2 hours for 1 line fix)
- Provider explanation (asked to provide notes on what they did)
- Historical performance (is this normal for them, or anomaly?)

---

## V. Weekly Approval Process

### ALIFF-RECRUITER Automated Workflow

**Every Sunday Night** (before Monday payroll):

1. **Pull Timesheets**:
   - Time Doctor API exports all provider hours for week
   - Example: Provider P-2847 claimed 42 hours across 3 projects

2. **AI Review**:
   - Activity analysis (avg 78% activity = acceptable)
   - Screenshot scan (flagged 3 hours of YouTube = rejected)
   - Output validation (delivered 18 pages of writing = aligns with 39 hours after rejections)
   - Idle time (5 hours idle, auto-paused = not billed)

3. **Adjusted Hours**:
   - Claimed: 42 hours
   - Rejected: 3 hours (unproductive)
   - Idle: 5 hours (not counted)
   - **Approved: 34 hours** × PKR 200/hr = PKR 6,800

4. **Provider Notification**:
   ```
   Weekly Timesheet - Jan 8-14, 2025

   Hours Submitted: 42
   Hours Approved: 34
   Hours Rejected: 3 (unproductive applications detected)
   Idle Time: 5 (auto-paused)

   Approved Payment: PKR 6,800
   Payment Date: Jan 17, 2025 (Net-7)

   Notes:
   - 3 hours on Jan 12 rejected due to non-work applications (YouTube, Facebook)
   - Please ensure Time Doctor captures only work-related activity
   - Continued violations may result in rate reduction or termination

   Questions? Reply to this email.

   - Aliff Payroll (Automated)
   ```

5. **Human Escalation**:
   - If flags >10% of hours or suspicious fraud patterns = human HR reviews
   - Repeat offenders = termination

---

## VI. Anti-Fraud Measures

### Mouse Jiggler / Fake Activity Detection

**How Fraudsters Cheat**:
- Software that moves mouse every 30 seconds (simulates activity)
- Keyboard macros that press keys repeatedly
- Video playing on loop to show "active screen"

**How We Detect**:

1. **Pattern Analysis**:
   - AI detects perfectly repetitive mouse movements (human movement is random)
   - Same keystroke patterns every 30 sec = macro detected

2. **Output Correlation**:
   - High activity (90%+) but zero output = suspicious
   - "Provider had 8 hours of 95% activity but submitted blank document"

3. **Screenshot Analysis**:
   - Same screen for hours (video loop or frozen screen)
   - Mouse cursor in identical position across multiple screenshots

**Action**: Immediate termination + demand refund of fraudulent hours + blacklist

---

### Outsourcing Detection

**How Fraudsters Cheat**:
- Get hired at PKR 250/hr
- Hire someone cheaper (PKR 80/hr) to do the work
- Pocket PKR 170/hr difference as profit

**How We Detect**:

1. **Work Quality Inconsistency**:
   - Skills test showed excellent writing, but delivered work is poor quality = different person
   - Code style changes drastically between projects = different developer

2. **Time Zone Anomalies**:
   - Provider claims to be in Karachi (PKT timezone)
   - Screenshots show timestamps from different timezone
   - Activity during Pakistan's middle of night (2-6am) repeatedly = suspicious

3. **Video Verification** (Random Spot Checks):
   - Weekly video calls with random providers (5-10% of pool)
   - Ask about recent project: "Explain how you approached Section M compliance"
   - If can't answer = someone else did the work

**Action**: Immediate termination + legal action for fraud + recover all payments from last 30 days

---

### Multi-Client Detection

**How Fraudsters Cheat**:
- Work for Aliff AND 2 other clients simultaneously
- Bill all 3 clients for same 8 hours (earning 3× hourly rate)

**How We Detect**:

1. **Time Doctor Shows Multiple Timers**:
   - Provider has "Aliff Project" timer running
   - Also has "Client B Project" timer running same hours
   - **Proof**: Time Doctor blocks this by default (only 1 timer at a time)

2. **Output Delays**:
   - Provider consistently delivers late despite billing full hours
   - Quality drops (rushing because split attention)

3. **Social Media Investigation**:
   - Provider posts on LinkedIn "Working with 3 clients simultaneously!"
   - Upwork profile shows "actively working on 4 projects"

**Action**: Terminate immediately + recover overpayments

---

## VII. Performance Reviews & Rate Adjustments

### Bi-Weekly Performance Dashboard (Per Provider)

**ALIFF-RECRUITER Generates Report**:

```
Provider Performance Report: Sarah Khan (ID: P-2847)
Period: Jan 1-14, 2025

⏱️ Time Metrics:
- Hours Claimed: 84
- Hours Approved: 78 (93% approval rate)
- Hours Rejected: 6 (YouTube, idle time)
- Average Activity: 81%

📊 Output Metrics:
- Proposals Delivered: 3
- Pages Written: 42 (avg 1.85 hrs/page)
- Client Satisfaction: 4.6/5 stars
- Revision Requests: 2 (low, good)

💰 Earnings:
- Current Rate: PKR 200/hour
- Bi-Weekly Pay: PKR 15,600
- Projected Monthly: PKR 31,200

🎯 Performance Grade: A- (Excellent)

Recommendations:
✅ Rate increase approved: PKR 200 → PKR 250/hour (effective Jan 15)
✅ Eligible for premium projects (higher complexity, better clients)
⚠️ Reminder: Reduce idle time (6 hours rejected last period)

Next Review: Jan 29, 2025
```

### Rate Increase Criteria

**Automatic Rate Increases** (ALIFF-RECRUITER triggers):

**Every 3 Months** (if criteria met):
- Activity >80% consistently
- Client satisfaction >4.5 stars
- Revision requests <10% of deliverables
- Zero fraud flags
- **Increase**: 10-15% rate bump

**Example**:
- Hired at PKR 150/hr
- Month 3 review: +15% → PKR 172/hr
- Month 6 review: +10% → PKR 189/hr
- Month 9 review: +15% → PKR 217/hr
- **After 9 months**: 45% total increase (retention incentive)

**Cap**: Maximum PKR 600/hr for exceptional performers (rarely reached)

---

### Rate Decreases & Termination

**Rate Reduction Triggers**:
- Activity drops below 70% for 2 consecutive weeks
- Client satisfaction <4.0 stars for 3 projects
- Excessive revisions (>30% of deliverables need rework)
- **Action**: -20% rate reduction OR probation

**Termination Triggers**:
- Fraud detected (mouse jiggler, outsourcing, multi-client)
- Activity <50% for 2 weeks
- Client satisfaction <3.5 stars for 2 consecutive projects
- Missed deadlines 3+ times
- NDA violation
- **Action**: Immediate termination, no severance, blacklist from re-application

---

## VIII. Always-Open Jobs & CV Bank

### Career Page Strategy

**Jobs Always Posted** (even when not actively hiring):

**Why**:
- Builds talent pipeline (500+ CVs in CV Bank ready to deploy)
- Provider exodus (people quit, need instant replacements)
- Project surges (client suddenly needs 5 writers, we have pool ready)
- Cost = $0 (jobs on our site, no posting fees)

**Implementation**:

**Evergreen Job Postings**:
- "GOVCON Proposal Writer (Remote, Pakistan)" - Always Open
- "Full-Stack Developer (Remote, Pakistan)" - Always Open
- "Content Writer / Copywriter (Remote, Pakistan)" - Always Open
- "Graphic Designer (Remote, Pakistan)" - Always Open

**Job Description Includes**:
```
Status: Rolling Applications Accepted

We accept applications year-round and hire as project needs arise. Even if we don't have immediate openings, we'll keep your profile in our talent pool and contact you when suitable projects are available.

Apply now to be considered for future opportunities.
```

### ALIFF-RECRUITER Proactive Outreach

**Scenario 1: Someone Visits Careers Page (No Open Jobs)**

**Chat Widget Pops Up**:
```
ALIFF: Hi! I'm Aliff, the AI recruiter. I see you're exploring our careers page. Even though we don't have active openings right now, we're always building our talent pool.

What kind of work are you looking for? (Proposal Writing, Development, Content, Design, etc.)

[User selects: Proposal Writing]

ALIFF: Great! We work with international clients on government contracting proposals.

Would you like to submit your CV? When projects come up (usually weekly), we'll match you and reach out immediately. Takes 2 minutes to apply.

[Apply Now Button]
```

**Conversion**: 30-40% of visitors apply (even without active jobs) because:
- No pressure (not competing for single role)
- Future-focused (builds pipeline)
- ALIFF makes it easy (2-min application)

---

### CV Bank Management

**Every Application Saved**:
- Even if no immediate need, application goes to CV Bank
- Parsed data (50+ fields: skills, experience, hourly rate expectations)
- Stored in Pinecone for semantic search
- Tagged by category (GOVCON, SLED, IT, Content)

**When Project Arrives**:
1. ALIFF-OPS receives project: "Need 2 SLED proposal writers, start Monday"
2. Queries ALIFF-RECRUITER: "Find SLED writers, available next week, rate <PKR 300/hr"
3. ALIFF-RECRUITER searches CV Bank
4. Returns 12 matches (ranked by skills test scores, availability)
5. ALIFF-RECRUITER texts top 5: "SLED project starting Monday, 40 hours, PKR 250/hr. Interested?"
6. First 2 to respond "Yes" = hired
7. Onboarded same day, project starts Monday

**Result**: <48 hour hiring turnaround from project arrival to provider working

---

## IX. System Architecture

### Tech Stack

**Time Tracking**:
- Time Doctor (primary) or Hubstaff (backup)
- API integration: Real-time sync of hours, screenshots, activity
- Webhooks: Notify when provider submits timesheet

**Database** (PostgreSQL + Prisma):
```prisma
model TimeEntry {
  id            String   @id @default(cuid())
  providerId    String
  projectId     String
  date          DateTime
  hoursWorked   Float
  hoursClaimed  Float    // May differ from worked (if idle time)
  hoursApproved Float?   // After AI/human review
  hoursRejected Float?
  activityPercent Float  // 0-100
  screenshots   Json     // Array of screenshot URLs
  idleMinutes   Int
  redFlags      Json     // Array of detected issues

  status        TimeEntryStatus // PENDING, APPROVED, REJECTED
  reviewedBy    String?  // "AI" or human reviewer ID
  reviewedAt    DateTime?

  provider      Provider @relation(fields: [providerId], references: [id])
  project       Project @relation(fields: [projectId], references: [id])
}

model ProviderPerformance {
  id                 String   @id @default(cuid())
  providerId         String   @unique
  currentHourlyRate  Float    // PKR

  // Rolling 30-day metrics
  avgActivity        Float    // 0-100
  totalHoursApproved Float
  totalHoursRejected Float
  approvalRate       Float    // %
  avgClientRating    Float    // 1-5 stars
  revisionRate       Float    // % of deliverables needing revisions

  // Fraud tracking
  fraudFlags         Int      @default(0)
  lastFraudDate      DateTime?

  // Rate history
  rateHistory        Json     // Array of {date, rate, reason}
  nextReviewDate     DateTime

  provider           Provider @relation(fields: [providerId], references: [id])
}
```

**AI Monitoring** (ALIFF-RECRUITER):
- Runs nightly batch job: Review all pending timesheets
- Computer vision model: Analyze screenshots for red flags
- Pattern detection: Identify mouse jiggler, outsourcing, fraud
- Auto-approval if no flags, human escalation if suspicious

---

## X. Provider Onboarding: Monitoring Setup

**Step 1: Offer Accepted**

**ALIFF-RECRUITER Email**:
```
Congratulations! Welcome to Aliff Services.

Next Steps:
1. Install Time Doctor (required for all hourly providers)
   Download: [Link]
   Install on the computer you'll use for work
   Use this email to register: sarah@example.com

2. Complete Quick Tutorial (5 minutes)
   [Video: How to track time, start/stop timer, avoid idle time]

3. Test Run (1 hour, paid)
   We'll assign a small test task to ensure Time Doctor works correctly
   You'll be paid PKR 150 for this hour (your starting rate)

4. Sign NDA & Monitoring Consent
   By working with us, you consent to:
   - Screenshot monitoring (every 3 minutes)
   - App/website tracking during work hours
   - Keyboard/mouse activity logging
   - Output review (quality checks)

   [DocuSign Link]

Once complete (takes 20 minutes total), you'll be activated and can start taking projects!

Questions? Reply anytime.

- Aliff Onboarding Team
```

**Step 2: Time Doctor Verification**

- Provider installs, runs 1-hour test task
- ALIFF-RECRUITER checks:
  - Screenshots captured correctly
  - Activity tracking working
  - No VPN/proxy (we detect location to prevent fraud)
- If successful: Provider activated
- If failed: Troubleshooting guidance sent

**Step 3: First Real Project**

- Provider assigned small project (4-8 hours)
- ALIFF-RECRUITER monitors closely (100% of hours reviewed by human first week)
- If successful: Provider moved to auto-approval (AI only)
- If issues: Additional training or termination

---

## XI. Legal & Consent

**Provider Agreement Includes**:

**Section 7: Time Tracking & Monitoring**

"Provider acknowledges and consents to the following during all billed work hours:

7.1 Time Tracking Software: Provider will use Company-approved software (Time Doctor or Hubstaff) to track all billed hours. Failure to use tracking software renders hours unbillable.

7.2 Screenshot Capture: Software will capture screenshots at intervals (minimum every 3 minutes). Provider consents to visual monitoring of work computer during billed hours.

7.3 Activity Monitoring: Keyboard strokes, mouse movements, and application usage will be tracked to verify productive work.

7.4 Output Review: Company reserves the right to review deliverables and correlate with billed hours. Discrepancies may result in hour rejection or termination.

7.5 Fraud Prevention: Company employs AI and human review to detect fraudulent time billing. Detected fraud results in immediate termination, payment recovery, and legal action.

7.6 Payment Contingent on Approval: Hours are paid only after review and approval. Company may reject hours deemed unproductive or fraudulent.

Provider agrees that this monitoring is reasonable and necessary for remote hourly work."

**This Is Enforceable**: Standard for remote hourly contractors globally (Upwork, Toptal all do this)

---

## XII. Success Metrics

**System Effectiveness**:
- **Fraud Detection Rate**: Catch >95% of time theft attempts
- **Payment Accuracy**: Pay only for verified productive hours (>90% of paid hours are legitimate work)
- **Provider Churn from Monitoring**: <10% (most honest workers have no issue with tracking)
- **Cost Savings**: Save 20-30% vs. honor system (prevents 20-30 hrs/month of fraudulent billing per provider)

**Example ROI**:
- 100 providers × 160 hrs/month each = 16,000 hours/month
- Without monitoring: ~25% fraud (4,000 fraudulent hours)
- With monitoring: ~2% fraud (320 fraudulent hours)
- **Savings**: 3,680 hours/month × PKR 250/hr avg = PKR 920,000/month saved

---

## XIII. Conclusion

**Monitoring Is Non-Negotiable**: Without rigorous tracking, remote hourly work becomes unprofitable. Providers WILL cheat without oversight.

**Our System**:
✅ Time Doctor/Hubstaff (industry-standard, proven)
✅ AI-powered screenshot analysis (detect fraud patterns)
✅ Output correlation (hours vs. deliverables)
✅ Weekly review & approval process (pay only verified work)
✅ Performance-based rate adjustments (reward good, penalize bad)
✅ Swift termination for fraud (zero tolerance)

**Result**: We pay fair wages for honest work, terminate cheaters immediately, maintain profitability through cost control.

This is the discipline that makes the hourly model sustainable.

---

**END OF DOCUMENT**
