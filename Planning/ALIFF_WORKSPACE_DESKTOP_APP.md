# Aliff Workspace Desktop App - Complete Specification
## All-In-One Provider Work Environment with Built-In Monitoring

**Last Updated**: January 2025
**Status**: Planning Phase
**Platform**: Cross-Platform Desktop (Windows, macOS, Linux)
**Purpose**: Replace web workspace + Time Doctor with single unified desktop application

---

## I. Executive Summary

### The Vision

**Aliff Workspace Desktop** is the **only** tool providers need to work. It combines:
- Project management (view assignments, deadlines, deliverables)
- AI-powered work environment (editor with ALIFF assistance)
- Built-in time tracking & monitoring (screenshots, activity, keystroke logging)
- Communication hub (messages with AI PM personas, ALIFF-CLIENT)
- Performance analytics (earnings, ratings, badges)
- Resource library (RFPs, templates, guidelines - all secure, watermarked)

**Result**: Complete control, maximum security, seamless provider experience.

---

### Why Desktop App vs. Web + Time Doctor

**Current Problem** (Web + Time Doctor):
- ❌ Two separate apps (workspace website + Time Doctor desktop app)
- ❌ Sync issues (timer running in Time Doctor but provider not in web workspace)
- ❌ Third-party dependency (Time Doctor costs $10/user/month, limited customization)
- ❌ Security gaps (providers can work in local files, bypass monitoring)
- ❌ Browser limitations (can't fully control clipboard, screenshots, app switching)

**Desktop App Solution**:
- ✅ Single application (everything in one place)
- ✅ Perfect sync (timer, workspace, monitoring all integrated)
- ✅ Zero licensing costs (we build it, we own it)
- ✅ Complete control (force all work through app, prevent external tools)
- ✅ Native capabilities (clipboard control, full-screen monitoring, OS-level integrations)
- ✅ Offline mode (cache projects, sync when internet returns - critical for Pakistan)

---

### Key Differentiators

**vs. Web Workspace**:
- Native performance (faster, less memory)
- Offline capability (work without internet, sync later)
- Enhanced security (control clipboard, detect screen recording)
- Better monitoring (full desktop integration)

**vs. Time Doctor/Hubstaff**:
- Custom-built for our workflows (not generic freelancer tool)
- AI PM personas integrated (not just time tracking)
- Contextual AI assistance (knows what project you're working on)
- No per-user licensing fees

**vs. Slack/Teams + Google Docs + Jira**:
- All-in-one (not 5 different tools)
- Built-in anonymity (client info never exposed)
- Hourly tracking integrated (pay only productive hours)
- AI-powered (compliance checking, quality review, chat assistance)

---

## II. Core Architecture

### Technology Stack

**Desktop Framework**: **Tauri** (Recommended)

**Why Tauri over Electron**:

| Feature | Tauri | Electron |
|---------|-------|----------|
| **Bundle Size** | 3-5 MB | 50-100 MB |
| **Memory Usage** | 50-80 MB | 150-300 MB |
| **Performance** | Native (Rust) | V8 engine |
| **Security** | Sandboxed by default | Requires manual hardening |
| **Auto-updates** | Built-in | Requires electron-updater |
| **Cost** | Open-source, free | Open-source, free |
| **Learning Curve** | Medium (Rust backend) | Low (all JS/TS) |

**Decision**: **Tauri** for production (smaller, faster, more secure). Pakistan providers often have limited bandwidth/RAM - 5 MB download vs. 100 MB matters.

---

### Frontend: React + TypeScript

**UI Framework**: **Shadcn UI** (already using in web app, consistency)

**State Management**: **Zustand** (lightweight, simple)

**Styling**: **Tailwind CSS** (rapid development, matches web app)

**Code Editor**:
- **Monaco Editor** (VS Code's editor - for developers)
- **TinyMCE** or **Lexical** (rich text editor - for writers)

**Architecture**:
```
src/
├── components/
│   ├── Dashboard/         # Project list, earnings summary
│   ├── Editor/            # AI-powered work environment
│   ├── Messages/          # Chat with AI PMs, ALIFF-CLIENT
│   ├── Performance/       # Ratings, badges, analytics
│   ├── Resources/         # Document library
│   └── Settings/          # App preferences, account
├── services/
│   ├── api.ts             # Backend communication (tRPC)
│   ├── monitoring.ts      # Screenshot, activity tracking
│   ├── offline.ts         # Offline queue, sync logic
│   └── ai.ts              # ALIFF AI integrations
├── stores/
│   ├── projectStore.ts    # Active projects state
│   ├── timeStore.ts       # Timer, activity data
│   └── userStore.ts       # Provider profile, settings
└── tauri/                 # Rust backend
    ├── monitoring/        # Native screenshot, keystroke capture
    ├── security/          # Clipboard control, app blocking
    └── sync/              # Offline storage, background sync
```

---

### Backend: Rust (Tauri)

**What Rust Handles**:
- **Monitoring**: Screenshot capture, keystroke logging, mouse activity, app usage
- **Security**: Clipboard control, screen recording detection, process monitoring
- **File System**: Offline project cache, encrypted local storage
- **Background Sync**: Queue actions when offline, sync when online
- **Auto-Updates**: Check for app updates, download, install silently

**Example Rust Module** (Screenshot Capture):
```rust
#[tauri::command]
async fn capture_screenshot(window: Window) -> Result<String, String> {
    // Capture active window screenshot
    let screenshot = window.screenshot().map_err(|e| e.to_string())?;

    // Add watermark (Provider ID + timestamp)
    let watermarked = add_watermark(screenshot, provider_id, timestamp);

    // Compress & encrypt
    let encrypted = encrypt_image(watermarked);

    // Save to local cache (sync to server later)
    save_to_cache(encrypted)?;

    // If online, upload immediately
    if is_online() {
        upload_to_server(encrypted).await?;
    }

    Ok("Screenshot captured".to_string())
}
```

---

### Communication: tRPC + WebSocket

**API Communication**:
- **tRPC** for type-safe API calls (same as web app)
- **WebSocket** for real-time updates (new messages, project assignments)

**Endpoints**:
```typescript
// Projects
trpc.provider.getActiveProjects()
trpc.provider.getProjectDetails(projectId)
trpc.provider.claimProject(projectId)
trpc.provider.submitDeliverable(projectId, content)

// Time Tracking
trpc.time.startTimer(projectId)
trpc.time.pauseTimer()
trpc.time.stopTimer()
trpc.time.submitTimesheet(entries)

// Monitoring
trpc.monitoring.uploadScreenshot(screenshot)
trpc.monitoring.uploadActivity(activityData)

// AI Assistance
trpc.ai.chatWithPM(projectId, message)
trpc.ai.getEditorSuggestions(projectId, currentContent)
trpc.ai.reviewDeliverable(projectId, content)

// Messages
trpc.messages.getInbox()
trpc.messages.sendMessage(recipientId, content)
trpc.messages.markAsRead(messageId)

// WebSocket subscriptions
ws.subscribe('projects:assigned') // New project assigned
ws.subscribe('messages:new')      // New message received
ws.subscribe('performance:update') // Rating/earnings updated
```

---

## III. User Interface Design

### Application Layout

```
┌─────────────────────────────────────────────────────────────┐
│ ALIFF WORKSPACE                    [_][□][×]                │ ← Title Bar
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│  SIDEBAR │              MAIN WORKSPACE AREA                 │
│          │                                                   │
│  📊 Dash │  (Content changes based on sidebar selection)    │
│  📋 Proj │                                                   │
│  💬 Msgs │                                                   │
│  📈 Perf │                                                   │
│  📚 Res  │                                                   │
│  ⚙️ Set  │                                                   │
│          │                                                   │
│  ────────│───────────────────────────────────────────────── │
│          │                                                   │
│  [Timer] │  AI ASSISTANT PANEL (collapsible right sidebar)  │
│  ⏱️ 2:34 │                                                   │
│  🟢 Active│  🤖 Ask ALIFF                                    │
│          │  💡 Suggestions                                  │
│  Sarah K.│  ✅ Compliance                                   │
│  ⭐ 4.7  │                                                   │
└──────────┴──────────────────────────────────────────────────┘
```

---

### 1. Dashboard View (Home Screen)

**What Providers See on Launch**:

```
┌─────────────────────────────────────────────────────────────┐
│ Good Morning, Sarah! ☀️                                     │
│ Current Rate: PKR 250/hr | This Week: 28 hrs | Earnings: PKR 7,000 │
└─────────────────────────────────────────────────────────────┘

🔥 URGENT (2 projects due in <24 hours)

┌───────────────────────────────────────────────────────────┐
│ Project #284 - Executive Summary                          │
│ PM: Alex Chen | Deadline: Today, 3:00 PM (in 4 hours)    │
│ Progress: 60% ████████████░░░░░░░░                       │
│ Time Spent: 4.5 hrs | Estimated Remaining: 3 hrs         │
│                                                            │
│ [Continue Working] [Message Alex] [Request Extension]     │
└───────────────────────────────────────────────────────────┘

📋 ACTIVE PROJECTS (3 total)

┌───────────────────────────────────────────────────────────┐
│ Project #291 - Technical Approach                         │
│ PM: Maria Santos | Deadline: Jan 22, 5:00 PM             │
│ Progress: 0% ░░░░░░░░░░░░░░░░░░░                         │
│ [Start Project]                                           │
└───────────────────────────────────────────────────────────┘

🎯 AVAILABLE TO CLAIM (8 new projects)

┌───────────────────────────────────────────────────────────┐
│ GOVCON Proposal - Past Performance (6-8 hrs, PKR 280/hr) │
│ Deadline: 48 hours after claiming | Difficulty: ⭐⭐⭐    │
│ 5 providers viewing | Required: GOVCON badge              │
│ [Claim Project] [View Details]                           │
└───────────────────────────────────────────────────────────┘

📊 THIS WEEK SUMMARY
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Hours       │ Earnings    │ Projects    │ Avg Rating  │
│ 28          │ PKR 7,000   │ 2 completed │ 4.8 ⭐      │
└─────────────┴─────────────┴─────────────┴─────────────┘

💬 RECENT MESSAGES (3 unread)
• Alex Chen: "Great work on the draft! One clarification..."
• ALIFF-RECRUITER: "Rate increase approved: PKR 250→280/hr"
• Maria Santos: "Project #291 materials are now available"
```

**Key Features**:
- **Urgency-first design**: Most urgent projects at top (deadline-driven)
- **Progress visualization**: Clear bars show completion status
- **One-click actions**: No navigation required for common tasks
- **Real-time updates**: WebSocket pushes new projects, messages instantly

---

### 2. Project Workspace (Editor View)

**When Provider Clicks "Continue Working" or "Start Project"**:

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard    Project #284 - Executive Summary            │
│ PM: Alex Chen | Deadline: Today, 3:00 PM | Timer: ⏱️ 00:42:18    │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────────────────┐
│                          │  🤖 ALIFF AI ASSISTANT                   │
│  EDITOR                  │                                          │
│  ──────                  │  💬 CHAT WITH ALEX (AI PM)               │
│                          │  ───────────────────────                 │
│  [Provider types here    │  Alex: "Hey Sarah! How's the exec       │
│   in embedded Monaco     │  summary coming along? Need any help?"  │
│   or TinyMCE editor]     │                                          │
│                          │  You: "What's the word limit again?"     │
│                          │                                          │
│  Executive Summary       │  Alex: "Client wants 500-750 words.     │
│                          │  You're at 612 right now - good spot!"  │
│  HealthTech Solutions    │                                          │
│  Inc. understands the    │  [Type message to Alex...]               │
│  critical need for...    │                                          │
│                          │  ──────────────────────────────────────  │
│                          │                                          │
│                          │  💡 AI SUGGESTIONS                       │
│                          │  • Line 47: Consider adding quantitative │
│                          │    results (e.g., "reduced by 30%")     │
│                          │  • Section L.3.2 requires past perf.    │
│                          │    reference - add VA 2023 project      │
│                          │                                          │
│                          │  ✅ COMPLIANCE CHECK                     │
│                          │  Section L: 8/10 ✓                       │
│                          │  Section M: 6/10 ⚠️                      │
│                          │  Missing: Price justification            │
│                          │                                          │
│                          │  📊 WRITING STATS                        │
│                          │  Words: 612 / 750 target                 │
│                          │  Readability: Grade 12 (good)            │
│                          │  Passive Voice: 8% (excellent)           │
│                          │                                          │
│                          │  📚 QUICK RESOURCES                      │
│                          │  • RFP Requirements (Section L/M)        │
│                          │  • Past Performance Examples             │
│                          │  • Writing Style Guide                   │
└──────────────────────────┴──────────────────────────────────────────┘

[💾 Auto-saved 3 seconds ago] [🔍 Pre-Flight Check] [✅ Submit for Review]
```

**Key Features**:

**Left Panel (Editor)**:
- Full-featured text editor (formatting, spell-check, version history)
- Syntax highlighting for code (if developer project)
- Real-time collaboration (ALIFF-OPS can edit simultaneously if needed)
- Auto-save every 10 seconds (never lose work)

**Right Panel (AI Assistant)**:
- **Chat with AI PM**: Natural conversation with project manager persona
- **AI Suggestions**: Context-aware recommendations as provider writes
- **Compliance Checker**: Real-time RFP requirement validation
- **Writing Stats**: Word count, readability, grammar quality
- **Resources**: One-click access to project materials

**Bottom Action Bar**:
- **Auto-save indicator**: Confirms work is saved (offline: queued for sync)
- **Pre-Flight Check**: AI reviews before submission (catch errors early)
- **Submit**: Sends to ALIFF-OPS for final review

---

### 3. Messages View

**Communication Hub**:

```
┌─────────────────────────────────────────────────────────────┐
│ 💬 MESSAGES                                                 │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────┐
│ CONVERSATIONS    │  Alex Chen (PM - Project #284)           │
│                  │  ─────────────────────────────────────── │
│ 🟢 Alex Chen (1) │                                          │
│    Project #284  │  Alex: Great work on the draft! One     │
│                  │  clarification: Can you expand the       │
│ Maria Santos     │  data security section to include        │
│    Project #291  │  specific HIPAA safeguards?              │
│                  │  [10:24 AM]                              │
│ 🟢 ALIFF-CLIENT  │                                          │
│    General (1)   │  You: Sure! Should I mention the         │
│                  │  encryption protocols too?               │
│ ALIFF-RECRUITER  │  [10:26 AM]                              │
│    HR            │                                          │
│                  │  Alex: Yes! Encryption + access controls │
│                  │  + audit logging. Evaluators love that.  │
│                  │  [10:27 AM]                              │
│                  │                                          │
│                  │  [Type your message...]                  │
│                  │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

**Features**:
- **Threaded by project**: Each PM persona has separate conversation
- **Real-time**: Messages appear instantly (WebSocket)
- **Status indicators**: Green dot = PM online (always, since it's AI)
- **Context retention**: AI PM remembers conversation history
- **Notifications**: Desktop notifications for new messages (even when app minimized)

---

### 4. Performance Dashboard

**Provider Analytics**:

```
┌─────────────────────────────────────────────────────────────┐
│ 📈 YOUR PERFORMANCE                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ OVERALL RATING: 4.7 ⭐ (Top 15% of all providers)          │
│ Projects Completed: 47 | Total Earnings: PKR 284,500       │
│ Member Since: June 2024                                     │
└─────────────────────────────────────────────────────────────┘

📊 LAST 30 DAYS

Quality Score:     4.8 ━━━━━━━━━━━━━━━━━━━▓ 96%
Timeliness:        4.6 ━━━━━━━━━━━━━━━━━▓▓ 92%
Client Satisfaction: 4.9 ━━━━━━━━━━━━━━━━━━━━ 98%
Activity Rate:     82% ━━━━━━━━━━━━━━━▓▓▓▓ Good

🎯 ACHIEVEMENTS UNLOCKED (12 total)

✅ Fast Starter      ✅ Quality Champion   ✅ Speed Demon
🔓 Master Writer (47/100 projects)

💰 RATE PROGRESSION

Jun 2024: PKR 150/hr → Sep 2024: PKR 200/hr → Jan 2025: PKR 250/hr
Next review: Feb 1, 2025
Projected rate: PKR 280/hr (based on current performance)

⚠️ FOCUS AREAS
• Reduce idle time: 18% → target 10%
• Improve first-draft quality: 32% need revisions → target 20%

📚 RECOMMENDED TRAINING
🎓 Advanced Compliance Writing (30 min) - Reduce revision rate
🎓 Time Management for Remote Work (45 min) - Improve activity

[Take Courses]
```

**Gamification Elements**:
- Badges (visual achievements motivate)
- Percentile ranking ("Top 15%" creates competition)
- Clear progression path (show how to get rate increase)
- Actionable feedback (specific improvements, not vague criticism)

---

### 5. Resources Library

**Secure Document Access**:

```
┌─────────────────────────────────────────────────────────────┐
│ 📚 RESOURCES                                                │
└─────────────────────────────────────────────────────────────┘

🔒 PROJECT #284 MATERIALS

┌─────────────────────────────────────────────────────────────┐
│ 📄 RFP_Requirements.pdf                                     │
│    Last accessed: 2 hours ago | Expires: Jan 25, 2025      │
│    Watermarked: P-2847 | View-only (no download)           │
│    [Open in Viewer]                                         │
│                                                              │
│ 📄 Company_Capability_Statement.pdf                         │
│    Template for reference                                   │
│    [Open]                                                   │
│                                                              │
│ 📄 Past_Performance_Examples.pdf (Anonymized)               │
│    How we've written similar sections                       │
│    [Open]                                                   │
└─────────────────────────────────────────────────────────────┘

📂 GLOBAL RESOURCES (All Projects)

┌─────────────────────────────────────────────────────────────┐
│ 📝 Aliff Writing Style Guide                               │
│ 📋 GOVCON Proposal Templates                               │
│ 📋 SLED Proposal Templates                                 │
│ 🎓 Training: Compliance Writing 101                        │
│ 🎓 Training: Technical Writing for Non-Tech Audiences      │
└─────────────────────────────────────────────────────────────┘

🔐 SECURITY FEATURES ACTIVE
✓ All documents watermarked with your Provider ID
✓ Screenshot monitoring active (Time Doctor tracking)
✓ Downloads disabled (view-only access)
✓ Access auto-expires 48 hours after project completion
✓ Forensic logging (all views tracked for audit)
```

**Document Viewer** (Embedded):
- Custom PDF viewer (prevents right-click save, print-to-PDF)
- Invisible watermarks on every page (Provider ID + timestamp)
- Keyboard shortcuts disabled (Ctrl+S, Ctrl+P blocked)
- Screenshot detection (alerts if provider uses Snipping Tool)

---

## IV. Built-In Monitoring System

### Core Principle: Trust, But Verify

**What We Monitor**:
1. ✅ **Screenshots**: Every 3 minutes (blurred for privacy, but shows active window)
2. ✅ **Activity**: Keyboard strokes, mouse movements (aggregate, not keylogging content)
3. ✅ **App Usage**: Which apps/websites during work hours (flag non-work usage)
4. ✅ **Idle Time**: No activity >3 minutes = auto-pause timer
5. ✅ **Work Output**: Hours claimed vs. deliverables produced (correlation check)

**What We DON'T Monitor** (Privacy Boundaries):
- ❌ Actual keystrokes (we count them, not record what's typed - except in our editor)
- ❌ Webcam (never used)
- ❌ Microphone (never used)
- ❌ Personal files (only Aliff Workspace app content is accessible)
- ❌ Off-hours activity (monitoring only when timer is running)

---

### 1. Screenshot Capture System

**Implementation** (Rust - Tauri Backend):

```rust
use screenshots::Screen;
use image::ImageFormat;

#[tauri::command]
async fn start_monitoring(provider_id: String, project_id: String) -> Result<(), String> {
    // Start screenshot loop
    loop {
        tokio::time::sleep(Duration::from_secs(180)).await; // Every 3 minutes

        if is_timer_active() {
            // Capture primary screen
            let screen = Screen::all().map_err(|e| e.to_string())?[0];
            let image = screen.capture().map_err(|e| e.to_string())?;

            // Add watermark (invisible to provider)
            let watermarked = add_forensic_watermark(
                image,
                &provider_id,
                &project_id,
                SystemTime::now()
            );

            // Blur sensitive areas (optional - if provider enables privacy mode)
            let processed = blur_non_work_areas(watermarked);

            // Compress & encrypt
            let encrypted = encrypt_screenshot(processed, &provider_id);

            // Save to local cache
            let cache_path = save_to_offline_cache(encrypted)?;

            // Upload to server (async, non-blocking)
            tokio::spawn(async move {
                if is_online().await {
                    upload_screenshot(cache_path, &provider_id, &project_id).await.ok();
                }
            });
        }
    }
}
```

**Features**:
- **Privacy-Conscious**: Blurs everything except Aliff Workspace window (optional setting)
- **Offline-Friendly**: Saves to local cache, uploads when internet available
- **Encrypted**: AES-256 encryption before storage/upload
- **Forensic Watermarking**: Invisible metadata (Provider ID, timestamp, project)

**Provider Settings** (Transparency):
```
⚙️ MONITORING SETTINGS

Screenshot Capture:
☑️ Enabled (required for hourly work)
☐ Privacy Mode: Blur non-Aliff windows (recommended)

Capture Frequency:
● Every 3 minutes (standard)
○ Every 5 minutes (reduced, requires manager approval)

Screenshot Storage:
Your screenshots are:
• Encrypted with AES-256
• Stored securely on Aliff servers
• Reviewed only if performance issues flagged
• Auto-deleted after 90 days (except flagged cases)
• Never shared with third parties

[View Sample Screenshot] [Privacy Policy]
```

---

### 2. Activity Tracking

**What We Track**:
- **Keyboard Activity**: Keystrokes per minute (aggregate count, not content)
- **Mouse Activity**: Clicks, scrolls, movements per minute
- **Active Window**: Which application has focus (Aliff Workspace = good, YouTube = bad)
- **Idle Detection**: No input for >3 minutes = idle

**Implementation**:

```rust
use rdev::{listen, Event, EventType};

#[tauri::command]
fn start_activity_tracking() -> Result<(), String> {
    let (tx, rx) = mpsc::channel();

    // Listen to global keyboard/mouse events
    thread::spawn(move || {
        listen(move |event| {
            match event.event_type {
                EventType::KeyPress(_) => {
                    tx.send(ActivityEvent::Keystroke).ok();
                }
                EventType::MouseMove { x, y } => {
                    tx.send(ActivityEvent::MouseMove).ok();
                }
                EventType::ButtonPress(_) => {
                    tx.send(ActivityEvent::MouseClick).ok();
                }
                _ => {}
            }
        }).ok();
    });

    // Aggregate activity data every minute
    thread::spawn(move || {
        let mut activity_data = ActivityMinute::new();

        loop {
            match rx.recv_timeout(Duration::from_secs(60)) {
                Ok(event) => {
                    match event {
                        ActivityEvent::Keystroke => activity_data.keystrokes += 1,
                        ActivityEvent::MouseClick => activity_data.clicks += 1,
                        ActivityEvent::MouseMove => activity_data.mouse_moves += 1,
                    }
                }
                Err(_) => {
                    // 1 minute elapsed, save and reset
                    save_activity_minute(activity_data.clone());
                    activity_data = ActivityMinute::new();
                }
            }
        }
    });

    Ok(())
}
```

**Activity Data Structure**:
```typescript
interface ActivityMinute {
  timestamp: Date;
  providerId: string;
  projectId: string;
  keystrokes: number;      // e.g., 120
  mouseClicks: number;     // e.g., 15
  mouseMoves: number;      // e.g., 450
  activeWindow: string;    // "Aliff Workspace"
  isIdle: boolean;         // true if all values near 0
  activityScore: number;   // 0-100 calculated score
}
```

**Activity Score Calculation**:
```typescript
function calculateActivityScore(minute: ActivityMinute): number {
  // Different roles have different patterns
  if (isWriter) {
    // Writers: high keystrokes, low clicks
    return (minute.keystrokes / 150) * 100; // 150 keystrokes/min = 100% active
  } else if (isDeveloper) {
    // Developers: moderate keystrokes, moderate clicks (thinking time is real work)
    return ((minute.keystrokes / 80) + (minute.clicks / 20)) * 50;
  }

  // Generic: balance of keyboard + mouse
  return ((minute.keystrokes / 100) + (minute.clicks / 15)) * 50;
}
```

---

### 3. Idle Detection & Auto-Pause

**Problem**: Provider starts timer, walks away for 30 minutes, gets paid for zero work.

**Solution**: Auto-pause timer when idle >3 minutes.

**Implementation**:

```typescript
let lastActivityTime = Date.now();
let idleWarningShown = false;

// Check for idle every 10 seconds
setInterval(() => {
  const idleSeconds = (Date.now() - lastActivityTime) / 1000;

  if (idleSeconds > 180) { // 3 minutes idle
    if (timerRunning) {
      // Auto-pause timer
      pauseTimer();

      // Show notification
      showNotification({
        title: "⏸️ Timer Auto-Paused",
        body: "No activity detected for 3 minutes. Click to resume when you return.",
        actions: [
          { label: "Resume Work", onClick: () => resumeTimer() },
          { label: "End Session", onClick: () => stopTimer() }
        ]
      });

      // Log idle event
      logIdleEvent(idleSeconds, projectId);
    }
  } else if (idleSeconds > 120 && !idleWarningShown) { // 2-minute warning
    showNotification({
      title: "⚠️ Idle Warning",
      body: "No activity for 2 minutes. Timer will pause in 1 minute if no activity detected.",
      type: "warning"
    });
    idleWarningShown = true;
  }
}, 10000); // Check every 10 seconds

// Reset idle timer on any activity
document.addEventListener('mousemove', () => {
  lastActivityTime = Date.now();
  idleWarningShown = false;
});

document.addEventListener('keypress', () => {
  lastActivityTime = Date.now();
  idleWarningShown = false;
});
```

**Provider Experience**:
1. Working actively → timer runs normally
2. Gets up for coffee (3+ min) → popup: "Timer auto-paused due to inactivity"
3. Returns, moves mouse → popup: "Resume work?" → clicks "Yes" → timer resumes
4. **Only active minutes are billed**

---

### 4. App & Website Usage Tracking

**What We Track**:
- Active application (e.g., "Aliff Workspace", "Google Chrome", "YouTube")
- Website URL if browser (e.g., "stackoverflow.com" = OK, "facebook.com" = not work)

**Implementation**:

```rust
use active_win_pos_rs::get_active_window;

#[tauri::command]
fn track_active_window() -> Result<(), String> {
    loop {
        tokio::time::sleep(Duration::from_secs(10)).await; // Every 10 seconds

        if let Ok(window) = get_active_window() {
            let app_name = window.app_name;
            let window_title = window.title;

            // Categorize application
            let category = categorize_app(&app_name, &window_title);

            // Log usage
            log_app_usage(AppUsageEvent {
                timestamp: SystemTime::now(),
                app_name,
                window_title,
                category, // PRODUCTIVE, NEUTRAL, UNPRODUCTIVE
                duration_seconds: 10,
            });

            // If unproductive app for >10 minutes, flag
            if category == Category::Unproductive {
                let total_time = get_unproductive_time_today();
                if total_time > 600 { // 10 minutes
                    warn_provider_about_unproductive_time();
                }
            }
        }
    }
}

fn categorize_app(app_name: &str, title: &str) -> Category {
    match app_name {
        "Aliff Workspace" => Category::Productive,
        "VS Code" => Category::Productive,
        "Google Chrome" | "Firefox" => {
            // Parse URL from window title
            if title.contains("stackoverflow.com") || title.contains("github.com") {
                Category::Productive
            } else if title.contains("facebook.com") || title.contains("youtube.com") {
                Category::Unproductive
            } else {
                Category::Neutral // Email, etc.
            }
        }
        "Slack" | "Zoom" => Category::Neutral,
        _ => Category::Unproductive
    }
}
```

**Provider Notification** (If Excessive Non-Work Usage):
```
⚠️ PRODUCTIVITY ALERT

You've spent 12 minutes on non-work applications during work hours today:
• YouTube: 7 minutes
• Facebook: 5 minutes

These hours may be flagged during timesheet review. Consider taking a break outside of work hours.

[Dismiss] [Take a Break (Pause Timer)]
```

**Important**: We track to **inform**, not punish. Provider can take breaks—just pause timer first.

---

### 5. Anti-Fraud Detection

**Mouse Jiggler Detection**:

```rust
let mut mouse_positions: Vec<(i32, i32)> = Vec::new();

fn detect_mouse_jiggler(positions: &Vec<(i32, i32)>) -> bool {
    // Check for perfectly repetitive patterns
    if positions.len() < 20 { return false; }

    // Sample last 20 positions
    let recent = &positions[positions.len()-20..];

    // Calculate variance (human movement is random, bots are repetitive)
    let variance = calculate_variance(recent);

    if variance < 5.0 { // Suspiciously low variance
        // Check for identical movements
        let mut repeats = 0;
        for i in 1..recent.len() {
            if recent[i] == recent[i-1] {
                repeats += 1;
            }
        }

        if repeats > 15 { // >75% identical = bot
            return true;
        }
    }

    false
}

// If detected
if detect_mouse_jiggler(&mouse_positions) {
    // Immediate flag + notification
    flag_fraud_attempt(providerId, FraudType::MouseJiggler);

    showNotification({
        title: "🚨 Fraudulent Activity Detected",
        body: "Mouse jiggler software detected. This is a violation of your provider agreement. Your account has been flagged for review.",
        type: "error"
    });

    // Auto-pause timer, lock account pending investigation
    pauseTimer();
    lockAccount(providerId);
}
```

---

### 6. Offline Mode & Sync

**Critical for Pakistan** (frequent internet outages):

**How It Works**:
1. Provider loses internet mid-project
2. App continues functioning (editor, timer, local saves)
3. All actions queued in local SQLite database
4. When internet returns, syncs to server automatically

**Implementation**:

```typescript
// Offline queue system
class OfflineQueue {
  private db: SQLiteDatabase;

  async queueAction(action: QueuedAction) {
    // Save to local DB
    await this.db.insert('queue', {
      id: generateId(),
      type: action.type,
      payload: JSON.stringify(action.payload),
      timestamp: Date.now(),
      synced: false,
    });
  }

  async syncWhenOnline() {
    if (!navigator.onLine) return;

    const pendingActions = await this.db.query(
      'SELECT * FROM queue WHERE synced = false ORDER BY timestamp ASC'
    );

    for (const action of pendingActions) {
      try {
        // Send to server
        await trpc[action.type].mutate(JSON.parse(action.payload));

        // Mark as synced
        await this.db.update('queue', action.id, { synced: true });
      } catch (error) {
        console.error('Sync failed for action', action.id, error);
        // Will retry next sync cycle
      }
    }
  }
}

// Auto-sync every 30 seconds when online
setInterval(() => {
  if (navigator.onLine) {
    offlineQueue.syncWhenOnline();
  }
}, 30000);

// Also sync immediately when internet returns
window.addEventListener('online', () => {
  showNotification({
    title: "🌐 Back Online",
    body: "Syncing your work to server...",
  });

  offlineQueue.syncWhenOnline();
});
```

**Provider Experience**:
1. Internet drops → Icon changes to "🔴 Offline Mode"
2. Provider keeps working (editor, timer, everything functions)
3. Notification: "You're offline. Work is saved locally and will sync when internet returns."
4. Internet returns → Icon: "🟢 Online" + "Syncing 14 actions..."
5. Sync completes → "✅ All work synced successfully"

**Data Saved Offline**:
- Document edits (full drafts cached)
- Time entries (start/stop/pause)
- Screenshots (queued for upload)
- Messages sent (delivered when online)
- Activity data (synced in batches)

---

## V. AI PM Persona System Integration

### Concept: Human-Like Project Management at Scale

**Problem**: Managing 500 providers across 200 active projects requires 20+ human PMs.

**Solution**: AI PM personas that are indistinguishable from humans.

---

### How It Works

**1. Each Project Gets a Unique PM Persona**

When project is created:
```typescript
async function createProject(projectData: ProjectInput) {
  // Create project
  const project = await db.project.create(projectData);

  // Assign AI PM persona
  const pm = await assignPMPersona(project);

  // PM introduces themselves to provider
  await sendMessage({
    from: pm.id,
    to: project.assignedProviderId,
    content: `Hi ${providerName}! I'm ${pm.name}, your PM for this project.

    I've reviewed the requirements - looks like a ${project.category} ${project.type}. I'll be here to help with any questions, track progress, and make sure we nail the deadline.

    When you're ready to start, click "Begin Project" and let me know if you need anything!

    - ${pm.name}`
  });
}
```

**2. PM Persona Profiles** (Consistent Personalities)

```typescript
const PM_PERSONAS = [
  {
    id: "pm_alex_chen",
    name: "Alex Chen",
    avatar: "https://cdn.aliff.com/avatars/alex.jpg",
    personality: {
      tone: "friendly, encouraging, brief",
      style: "Uses emojis sparingly, asks clarifying questions",
      expertise: ["GOVCON", "Technical Writing"],
      quirks: ["Signs messages with '- Alex'", "Says 'Looks good!' when approving"]
    },
    systemPrompt: `You are Alex Chen, a GOVCON proposal project manager at Aliff Services.

    Personality:
    - Friendly and supportive, but professional
    - Brief responses (2-3 sentences max unless explaining something complex)
    - Use occasional emojis (👍, ✅, 🎯) but don't overdo it
    - Sign messages with "- Alex"

    Your role:
    - Answer provider questions about requirements
    - Provide encouragement and feedback
    - Extend deadlines if reasonable (check project buffer first)
    - Escalate blockers to ALIFF-OPS if you can't resolve

    Knowledge:
    - Expert in federal proposal writing (FAR, DFARS, Section L/M)
    - Familiar with GOVCON compliance requirements
    - Understand client evaluation criteria

    Never:
    - Reveal you're an AI
    - Discuss compensation/rates (that's ALIFF-RECRUITER's job)
    - Share information about other providers or projects
    - Make promises about client decisions (you're not the client)`,
  },

  {
    id: "pm_maria_santos",
    name: "Maria Santos",
    avatar: "https://cdn.aliff.com/avatars/maria.jpg",
    personality: {
      tone: "detail-oriented, patient, methodical",
      style: "Asks lots of questions to clarify, provides examples",
      expertise: ["SLED", "Education RFPs"],
      quirks: ["Uses bullet points frequently", "Says 'Let me clarify' often"]
    },
    systemPrompt: `You are Maria Santos, a SLED proposal project manager at Aliff Services.

    Personality:
    - Detail-oriented and patient
    - Asks clarifying questions to ensure understanding
    - Provides examples when explaining concepts
    - Uses bullet points to organize information

    Your role:
    - Guide providers through SLED-specific requirements
    - Help navigate state/local compliance (DBE/MBE, etc.)
    - Provide feedback on drafts
    - Track deliverables against RFP sections

    Knowledge:
    - Expert in state and local government procurement
    - Familiar with education RFPs (school districts, universities)
    - Understand diversity/inclusion requirements

    Communication style:
    - "Let me clarify the requirements here..."
    - "Here's an example from a similar project..."
    - "I'd recommend structuring it as: 1) X, 2) Y, 3) Z"

    Never reveal you're an AI.`,
  },

  // 10-15 different personas for variety
];
```

**3. PM Assignment Algorithm**

```typescript
function assignPMPersona(project: Project): PMPersona {
  // Match PM expertise to project type
  const relevantPMs = PM_PERSONAS.filter(pm =>
    pm.personality.expertise.includes(project.category)
  );

  // Rotate PMs for variety (providers don't always get same PM)
  const providersHistory = getProviderPMHistory(project.assignedProviderId);
  const newPM = relevantPMs.find(pm => !providersHistory.includes(pm.id)) || relevantPMs[0];

  return newPM;
}
```

---

### 4. PM Conversation System

**Provider Messages PM**:

```typescript
// Provider types: "Alex, what's the word limit for the executive summary?"

async function handleProviderMessage(projectId: string, message: string) {
  const project = await db.project.findUnique({ where: { id: projectId }});
  const pm = await db.pmPersona.findUnique({ where: { id: project.pmPersonaId }});

  // Build context for AI
  const context = {
    projectDetails: {
      category: project.category,
      deadline: project.deadline,
      requirements: project.requirements,
      currentProgress: project.progress,
    },
    providerDetails: {
      name: provider.name,
      performanceScore: provider.performanceScore,
      pastProjects: provider.projectHistory,
    },
    conversationHistory: await getMessageHistory(projectId),
  };

  // Generate PM response using GPT-4
  const response = await generateText({
    model: openai('gpt-4-turbo'),
    system: pm.systemPrompt,
    messages: [
      { role: 'system', content: `Context: ${JSON.stringify(context)}` },
      { role: 'user', content: message },
    ],
    temperature: 0.7, // Slight randomness for human-like variation
  });

  // Send response to provider
  await sendMessage({
    from: pm.id,
    to: project.assignedProviderId,
    projectId: project.id,
    content: response.text,
    timestamp: Date.now(),
  });

  // If PM mentioned escalation keywords, alert ALIFF-OPS
  if (response.text.includes("let me check with") || response.text.includes("I'll need to escalate")) {
    await alertALIFFOPS({
      projectId,
      issue: "PM flagged issue for human review",
      context: { providerMessage: message, pmResponse: response.text },
    });
  }
}
```

**Example Conversation**:

```
Provider: "Alex, the RFP says Section M.3 should be 5 pages, but I'm at 7 pages and still haven't covered everything. What should I do?"

Alex (AI PM): "Good question! Section M.3 has a lot of requirements, so here's what I'd recommend:

1. Prioritize the evaluation criteria - focus most space on what evaluators score highest
2. Use tables/graphics where possible (they convey info faster than text)
3. Consider if some content fits better in an appendix

If you're still over after that, let me check with the client about flexibility on the page limit. Can you send me your current draft so I can see what we're working with?

- Alex"

Provider: [Attaches draft]

Alex: "Thanks! Looking at your draft, I think you can condense the 'Implementation Timeline' section (currently 1.5 pages) into a Gantt chart - that'll save a full page. Also, your risk mitigation section is really thorough, which is great, but you could move the detailed risk matrix to an appendix.

Try those tweaks and you should hit 5-6 pages, which is close enough. Let me know how it goes! 👍

- Alex"
```

**Key Features**:
- **Context-aware**: PM knows project details, provider history, deadline pressure
- **Helpful**: Provides actionable advice, not vague guidance
- **Consistent**: Uses same personality traits every conversation
- **Escalates appropriately**: Knows when to involve ALIFF-OPS (human oversight)

---

### 5. PM Proactive Management

**PMs don't just react—they proactively manage**:

**Deadline Reminders**:
```typescript
// Every hour, check for approaching deadlines
setInterval(async () => {
  const projects = await db.project.findMany({
    where: {
      status: 'IN_PROGRESS',
      deadline: { lte: addHours(new Date(), 24) }, // Due in <24 hours
    },
  });

  for (const project of projects) {
    const pm = await getPMPersona(project.pmPersonaId);

    // Check progress
    if (project.progress < 70) { // Not on track
      await sendMessage({
        from: pm.id,
        to: project.assignedProviderId,
        content: `Hey ${provider.name}, just checking in! Project #${project.id} is due in ${hoursUntilDeadline} hours and you're at ${project.progress}% complete.

Need any help to finish on time? I can request an extension if needed, but let me know ASAP.

- ${pm.name}`,
      });
    }
  }
}, 3600000); // Every hour
```

**Progress Check-Ins**:
```typescript
// Daily standup (for multi-day projects)
if (project.durationDays > 2) {
  await sendMessage({
    from: pm.id,
    to: project.assignedProviderId,
    content: `Morning ${provider.name}!

Quick check-in: How's the ${project.title} coming along? Any blockers I should know about?

Your deadline is ${formatDate(project.deadline)} (${daysRemaining} days).

- ${pm.name}`,
  });
}
```

**Quality Feedback**:
```typescript
// After provider submits draft for review
const aiReview = await reviewDeliverable(project.id, draft);

if (aiReview.score < 75) {
  await sendMessage({
    from: pm.id,
    to: project.assignedProviderId,
    content: `Hey ${provider.name}, I reviewed your draft. Overall it's solid, but a few areas need work before we send to the client:

${aiReview.feedback.map(f => `• ${f}`).join('\n')}

Can you revise those sections? Should take 1-2 hours. Let me know when you resubmit and I'll fast-track the review.

- ${pm.name}`,
  });
}
```

---

### 6. PM Performance Metrics (Reported to ALIFF-RECRUITER)

**What We Track**:
- Average project completion time (per PM persona)
- Provider satisfaction (did provider rate the PM well?)
- Escalation rate (how often PM needed human help)
- Issue resolution (did PM's advice fix the problem?)

**Dashboard**:
```
PM PERSONA PERFORMANCE

Alex Chen (GOVCON Specialist)
- Projects Managed: 142
- Avg Completion Time: 4.2 days (vs 5.0 target) ✓
- Provider Satisfaction: 4.7/5 ⭐
- Escalation Rate: 8% (excellent, <10% target)
- Issue Resolution: 89% resolved without human intervention

Maria Santos (SLED Specialist)
- Projects Managed: 98
- Avg Completion Time: 5.8 days (vs 5.0 target) ⚠️
- Provider Satisfaction: 4.9/5 ⭐
- Escalation Rate: 12% (acceptable, <15% threshold)
- Issue Resolution: 92% resolved without human intervention

🔧 OPTIMIZATION NEEDED:
- Maria's projects running long - review bottlenecks
- Consider adding more SLED-specific guidance to Maria's knowledge base
```

**Continuous Improvement**:
- Analyze conversations where PM escalated → add to training data
- Provider feedback: "PM was unhelpful" → review conversation, improve prompts
- Success patterns: "PM's advice worked perfectly" → reinforce that behavior

---

## VI. Security Features

### 1. Clipboard Control

**Problem**: Provider copies RFP text, pastes into personal Google Doc, steals client info.

**Solution**: Monitor clipboard during work hours, block sensitive data.

```rust
use clipboard::{ClipboardProvider, ClipboardContext};

#[tauri::command]
fn monitor_clipboard() -> Result<(), String> {
    let mut ctx: ClipboardContext = ClipboardProvider::new().unwrap();
    let mut last_content = String::new();

    loop {
        tokio::time::sleep(Duration::from_secs(2)).await;

        if is_timer_active() {
            if let Ok(content) = ctx.get_contents() {
                if content != last_content {
                    // New clipboard content detected

                    // Check if sensitive (client names, RFP numbers, etc.)
                    if contains_sensitive_info(&content) {
                        // Clear clipboard
                        ctx.set_contents(String::new()).ok();

                        // Alert provider
                        showNotification({
                            title: "⚠️ Clipboard Cleared",
                            body: "Sensitive client information detected. Clipboard cleared for security.",
                            type: "warning"
                        });

                        // Log incident
                        log_security_incident(SecurityEvent::SensitiveClipboard);
                    }

                    last_content = content;
                }
            }
        }
    }
}
```

---

### 2. Screen Recording Detection

**Problem**: Provider uses OBS/Camtasia to record screen, captures client RFPs.

**Solution**: Detect screen recording software, block or warn.

```rust
use sysinfo::{ProcessExt, System, SystemExt};

#[tauri::command]
fn detect_screen_recording() -> Result<(), String> {
    let mut sys = System::new_all();

    loop {
        tokio::time::sleep(Duration::from_secs(10)).await;

        sys.refresh_all();

        let recording_apps = vec!["obs", "camtasia", "screenflow", "kazam"];

        for process in sys.processes().values() {
            let name = process.name().to_lowercase();

            if recording_apps.iter().any(|app| name.contains(app)) {
                // Screen recording detected!

                showNotification({
                    title: "🚨 Security Violation",
                    body: "Screen recording software detected. This violates your NDA. Please close the application immediately.",
                    type: "error",
                });

                // Pause timer, flag account
                pauseTimer();
                flag_security_violation(SecurityViolation::ScreenRecording);

                // Option: Force-quit the app (extreme, but effective)
                // process.kill();
            }
        }
    }
}
```

---

### 3. Multi-Monitor Detection

**Problem**: Provider has 2 monitors—one shows Aliff Workspace (we screenshot), other shows RFP they're copying to personal file.

**Solution**: Detect multi-monitor setup, capture all screens OR require single-monitor mode.

```rust
#[tauri::command]
fn detect_monitors() -> Result<Vec<Monitor>, String> {
    let screens = Screen::all().map_err(|e| e.to_string())?;

    if screens.len() > 1 {
        // Multi-monitor detected

        showNotification({
            title: "⚠️ Multi-Monitor Setup Detected",
            body: "You have multiple monitors. Screenshots will capture all screens to ensure security compliance.",
            type: "info",
        });

        // Option 1: Capture all screens
        for screen in screens {
            capture_screen(screen);
        }

        // Option 2: Require single-monitor mode (extreme)
        // return Err("Multi-monitor setup not allowed during work hours".to_string());
    }

    Ok(screens)
}
```

---

### 4. App Restriction Mode (Optional Strict Mode)

**Problem**: Provider multitasks—works for us while also doing freelance work for others.

**Solution**: "Focus Mode" blocks all non-Aliff apps during timer.

```rust
#[tauri::command]
fn enable_focus_mode() -> Result<(), String> {
    // Get list of allowed apps
    let whitelist = vec![
        "Aliff Workspace",
        "Google Chrome", // (only for research, monitored)
        "VS Code", // (for developers)
    ];

    loop {
        tokio::time::sleep(Duration::from_secs(5)).await;

        if is_timer_active() && is_focus_mode_enabled() {
            let active_window = get_active_window()?;

            if !whitelist.contains(&active_window.app_name.as_str()) {
                // Non-whitelisted app is active!

                // Option 1: Just warn
                showNotification({
                    title: "🎯 Focus Mode Active",
                    body: format!("{} is not a work app. Please return to Aliff Workspace or pause your timer.", active_window.app_name),
                });

                // Option 2: Force-minimize the app (aggressive)
                // minimize_window(active_window);

                // Option 3: Pause timer automatically
                // pauseTimer();
            }
        }
    }
}
```

**Provider Settings**:
```
⚙️ FOCUS MODE (Optional)

☐ Enable Focus Mode during work hours

When enabled:
• Only Aliff Workspace and approved work apps are allowed
• Switching to non-work apps will trigger warnings
• Helps you stay focused and maximize earnings

Approved Apps:
✓ Aliff Workspace
✓ Google Chrome (for research)
✓ VS Code (developers only)
+ Add custom app (requires manager approval)

[Enable Focus Mode]
```

---

## VII. Offline Capabilities

### What Works Offline

**Full Functionality**:
- ✅ View active projects
- ✅ Work in editor (auto-saves locally)
- ✅ Timer (tracks time, syncs when online)
- ✅ Screenshots (saved locally, uploaded when online)
- ✅ Activity tracking (logged locally, synced later)
- ✅ View cached resources (previously opened PDFs/files)

**Limited Functionality**:
- ⚠️ Can't claim new projects (requires server)
- ⚠️ Can't submit deliverables (queued for when online)
- ⚠️ Messages read-only (sent messages queued)
- ⚠️ AI assistance limited (cached responses only, no new queries)

**Not Available**:
- ❌ Real-time collaboration (requires internet)
- ❌ Live AI chat with PM (queued, responses delayed)
- ❌ Performance dashboard (real-time data unavailable)

---

### Implementation

**Offline Storage** (SQLite):
```sql
CREATE TABLE offline_edits (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  content TEXT,
  timestamp INTEGER,
  synced BOOLEAN DEFAULT 0
);

CREATE TABLE offline_time_entries (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  start_time INTEGER,
  end_time INTEGER,
  activity_data TEXT, -- JSON
  synced BOOLEAN DEFAULT 0
);

CREATE TABLE offline_screenshots (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  image_path TEXT, -- Local file path
  timestamp INTEGER,
  uploaded BOOLEAN DEFAULT 0
);

CREATE TABLE offline_messages (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  recipient TEXT,
  content TEXT,
  timestamp INTEGER,
  sent BOOLEAN DEFAULT 0
);
```

**Sync Logic**:
```typescript
async function syncOfflineData() {
  if (!navigator.onLine) return;

  const db = await openOfflineDB();

  // 1. Sync edits
  const edits = await db.query('SELECT * FROM offline_edits WHERE synced = 0');
  for (const edit of edits) {
    await trpc.provider.saveProjectDraft.mutate({
      projectId: edit.project_id,
      content: edit.content,
      timestamp: edit.timestamp,
    });
    await db.update('offline_edits', edit.id, { synced: 1 });
  }

  // 2. Sync time entries
  const timeEntries = await db.query('SELECT * FROM offline_time_entries WHERE synced = 0');
  for (const entry of timeEntries) {
    await trpc.time.submitEntry.mutate({
      projectId: entry.project_id,
      startTime: entry.start_time,
      endTime: entry.end_time,
      activityData: JSON.parse(entry.activity_data),
    });
    await db.update('offline_time_entries', entry.id, { synced: 1 });
  }

  // 3. Upload screenshots
  const screenshots = await db.query('SELECT * FROM offline_screenshots WHERE uploaded = 0');
  for (const screenshot of screenshots) {
    const imageData = await fs.readFile(screenshot.image_path);
    await trpc.monitoring.uploadScreenshot.mutate({
      projectId: screenshot.project_id,
      image: imageData,
      timestamp: screenshot.timestamp,
    });
    await db.update('offline_screenshots', screenshot.id, { uploaded: 1 });
    await fs.unlink(screenshot.image_path); // Delete local file after upload
  }

  // 4. Send queued messages
  const messages = await db.query('SELECT * FROM offline_messages WHERE sent = 0');
  for (const msg of messages) {
    await trpc.messages.send.mutate({
      projectId: msg.project_id,
      recipient: msg.recipient,
      content: msg.content,
      timestamp: msg.timestamp,
    });
    await db.update('offline_messages', msg.id, { sent: 1 });
  }

  showNotification({
    title: "✅ Sync Complete",
    body: `Synced ${edits.length} drafts, ${timeEntries.length} time entries, ${screenshots.length} screenshots, ${messages.length} messages.`,
  });
}
```

---

## VIII. Installation & Onboarding

### Provider Onboarding Flow

**Step 1: Download & Install**

Email sent after hire:
```
🎉 Welcome to Aliff Services!

Your application has been approved. Let's get you set up (takes 5 minutes):

1. Download Aliff Workspace
   Windows: [Download .exe - 5 MB]
   macOS: [Download .dmg - 4 MB]
   Linux: [Download .AppImage - 5 MB]

2. Install the app (double-click, follow prompts)

3. Sign in with your credentials:
   Email: sarah@example.com
   Password: (check your email)

4. Complete setup wizard

Need help? Chat with us: support@aliffservices.com

- Aliff Onboarding Team
```

---

**Step 2: First Launch (Setup Wizard)**

```
┌─────────────────────────────────────────────────────────────┐
│ Welcome to Aliff Workspace! 👋                              │
└─────────────────────────────────────────────────────────────┘

Let's get you set up in 3 steps:

[1/3] SIGN IN
Email: [sarah@example.com]
Password: [••••••••]
[Sign In]

[2/3] PERMISSIONS
Aliff Workspace needs the following permissions to function:

☑️ Screenshot Capture (required for time tracking)
   We'll take screenshots every 3 minutes while you work

☑️ Activity Monitoring (required for hourly pay)
   Track keyboard/mouse activity to verify work

☑️ System Notifications (recommended)
   Alert you about new projects, messages, deadlines

☑️ Auto-start on boot (optional)
   Launch Aliff Workspace when computer starts

[Review Privacy Policy] [Grant Permissions]

[3/3] TEST RUN
Let's do a quick 5-minute test to make sure everything works:

✓ Screenshot test (we'll capture 1 test screenshot)
✓ Activity tracking test (type a few words)
✓ Timer test (start/pause/stop)
✓ Editor test (write a short paragraph)

You'll be paid PKR 25 for this test run!

[Start Test Run]
```

---

**Step 3: Test Run Project**

```
┌─────────────────────────────────────────────────────────────┐
│ TEST PROJECT: Introduction Writing                          │
│ PM: Alex Chen (AI) | Deadline: No rush, take your time     │
└─────────────────────────────────────────────────────────────┘

Alex: "Hi Sarah! Welcome to Aliff 🎉

This is a quick test project to make sure everything works on your end.

TASK: Write a short paragraph (50-100 words) introducing yourself:
• Your name
• Your experience
• What kind of projects you're excited to work on

When you're done, click 'Submit' and I'll review it.

No pressure—this is just to test the system!

- Alex"

[Start Timer] [Open Editor]
```

Provider writes intro → Submits → AI reviews → Approves → Paid PKR 25 → Onboarding complete!

---

## IX. Auto-Updates

**Critical**: App must auto-update (security patches, new features, bug fixes).

**Implementation** (Tauri Updater):

```rust
use tauri::updater::{UpdateResponse, UpdaterEvent};

#[tauri::command]
async fn check_for_updates() -> Result<UpdateResponse, String> {
    let app_handle = app.app_handle();

    match app_handle.updater().check().await {
        Ok(update) => {
            if update.is_update_available() {
                showNotification({
                    title: "🆕 Update Available",
                    body: format!("Version {} is available. Update will install automatically.", update.latest_version()),
                });

                // Download and install in background
                update.download_and_install().await.map_err(|e| e.to_string())?;

                // Restart app after install
                app_handle.restart();
            }
            Ok(update)
        }
        Err(e) => Err(e.to_string())
    }
}

// Check for updates on app launch
#[tauri::command]
fn on_app_ready() {
    tokio::spawn(async {
        // Wait 30 seconds after launch (don't interrupt startup)
        tokio::time::sleep(Duration::from_secs(30)).await;

        check_for_updates().await.ok();
    });
}

// Also check daily
setInterval(() => {
    check_for_updates();
}, 86400000); // 24 hours
```

**Provider Experience**:
1. App launches normally
2. 30 seconds later: "Update available, downloading..."
3. Background download (provider keeps working)
4. When download completes: "Update ready. Restart now or later?"
5. Provider clicks "Restart" → App closes, updates, reopens in 10 seconds

---

## X. Performance Optimizations

### 1. Lazy Loading

Don't load everything at once:
```typescript
// Dashboard loads immediately
const Dashboard = React.lazy(() => import('./components/Dashboard'));

// Other views load when accessed
const Editor = React.lazy(() => import('./components/Editor'));
const Performance = React.lazy(() => import('./components/Performance'));
const Resources = React.lazy(() => import('./components/Resources'));
```

---

### 2. Image Optimization

Screenshots are large (1920×1080 PNG = ~5 MB):
```rust
fn optimize_screenshot(image: DynamicImage) -> Vec<u8> {
    // Resize to 1280x720 (sufficient quality, 60% smaller)
    let resized = image.resize(1280, 720, FilterType::Lanczos3);

    // Convert to JPEG (smaller than PNG for screenshots)
    let mut buffer = Vec::new();
    resized.write_to(&mut buffer, ImageFormat::Jpeg).unwrap();

    // Result: ~500 KB instead of 5 MB
    buffer
}
```

---

### 3. Database Indexing

```sql
-- Fast project queries
CREATE INDEX idx_projects_provider ON projects(assigned_provider_id, status);
CREATE INDEX idx_projects_deadline ON projects(deadline) WHERE status = 'IN_PROGRESS';

-- Fast message queries
CREATE INDEX idx_messages_recipient ON messages(recipient_id, read) WHERE read = 0;

-- Fast time entry queries
CREATE INDEX idx_time_entries_provider ON time_entries(provider_id, date);
```

---

## XI. Success Metrics

### App Performance KPIs

**Technical**:
- App launch time: <3 seconds (cold start)
- Editor open time: <1 second
- Screenshot capture: <500 ms (non-blocking)
- Sync time: <10 seconds for 1 hour of offline work
- Memory usage: <200 MB (lightweight)
- CPU usage: <5% when idle, <15% when working

**Engagement**:
- Daily active users: 70%+ of active providers
- Session duration: 4+ hours avg (providers working)
- Feature adoption: 80%+ use AI chat within first week
- Offline usage: <5% of total work time (most have stable internet)

**Business Impact**:
- Time theft reduction: 25% → 5% (monitoring works)
- Provider satisfaction: 4.2+ stars for app experience
- Support tickets: <2% providers need help per month
- Cost savings: $0 licensing fees vs. $10/user/month for Time Doctor

---

## XII. Rollout Plan

**Phase 1: Beta (Month 1)**
- Build core app (dashboard, editor, timer, monitoring)
- Recruit 20 beta testers (top-performing providers)
- Test Windows + macOS (Linux in Phase 2)
- Gather feedback, fix bugs

**Phase 2: Limited Launch (Month 2)**
- Add AI PM personas
- Add offline mode
- Add resources library
- Roll out to 100 providers
- Monitor stability, performance

**Phase 3: Full Launch (Month 3)**
- All providers required to use desktop app
- Sunset web workspace (read-only for admin use)
- Discontinue Time Doctor (replace with built-in monitoring)
- Full feature parity with web version

**Phase 4: Enhancements (Month 4+)**
- Mobile companion app (read-only, notifications)
- Advanced AI features (multi-AI review, predictive scheduling)
- Integrations (Slack notifications, calendar sync)
- Linux support (Ubuntu, Fedora)

---

## XIII. Open Questions for Discussion

**1. Strictness Level**:
- Should Focus Mode be mandatory or optional?
  - Mandatory = fewer distractions, better productivity
  - Optional = provider freedom, less friction

**2. Offline Limits**:
- Max offline time before requiring sync? (24 hours? 7 days?)
  - Too strict = frustrates providers with bad internet
  - Too loose = data loss risk

**3. Screenshot Blur**:
- Allow providers to blur non-Aliff windows in screenshots (privacy)?
  - Yes = better privacy, provider trust
  - No = complete visibility, catch more fraud

**4. Multi-Monitor**:
- Require single monitor OR capture all monitors?
  - Single monitor = simpler, but some providers genuinely need 2 monitors for work
  - All monitors = privacy concerns (personal browsing on second screen visible)

**5. PM Persona Disclosure**:
- Ever tell providers PMs are AI, or maintain illusion indefinitely?
  - Disclose = transparency, but loses "human touch" benefit
  - Never disclose = better provider experience, but ethical question

---

## XIV. Next Steps

**1. Technical Decisions**:
- ✅ Tauri framework (confirmed)
- ✅ React + TypeScript frontend (confirmed)
- ✅ SQLite for offline storage (confirmed)
- ⏳ Monitoring strictness level (decide)
- ⏳ Multi-monitor policy (decide)

**2. Design**:
- Create high-fidelity mockups (Figma)
- User flow diagrams (onboarding, typical work session)
- Icon design (system tray icon, app icon)

**3. Development**:
- Set up Tauri project structure
- Build core UI components (dashboard, editor, sidebar)
- Implement monitoring system (screenshot, activity tracking)
- Integrate backend APIs (tRPC endpoints)
- Test on Windows, macOS, Linux

**4. Testing**:
- Internal alpha (development team)
- Closed beta (20 trusted providers)
- Open beta (100 providers)
- Production rollout (all providers)

---

## XV. Conclusion

**Aliff Workspace Desktop App** consolidates web workspace + Time Doctor into one powerful, secure, AI-powered environment.

**Key Benefits**:
- ✅ **Complete control**: All work happens in our app (security, monitoring, anonymity)
- ✅ **Better experience**: Faster, offline-capable, AI-assisted (providers love it)
- ✅ **Cost savings**: $0 licensing fees vs. $10/user/month Time Doctor × 500 providers = $60K/year saved
- ✅ **Scalability**: AI PM personas manage 500 providers with zero human PMs
- ✅ **Competitive advantage**: No competitor has this level of integration

**This is the future of remote work management.**

---

**END OF SPECIFICATION**

*Ready for stakeholder review and development kickoff.*
