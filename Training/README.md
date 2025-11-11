# Aliff AI Training System

**Purpose:** This directory contains all training data, schemas, and templates for building Aliff - the AI-powered de facto CEO of Aliff Services.

---

## Overview

Aliff is not just a tool - **Aliff IS the business**. It operates as the de facto CEO, orchestrating all business functions:

- **ALIFF-SALES:** Chief Revenue Officer - lead qualification, objection handling, pitch generation
- **ALIFF-OPS:** Operations Director - project management, resource allocation, quality gates
- **ALIFF-CLIENT:** Customer Success Manager - client communication, updates, support
- **ALIFF-TRAINER:** Knowledge Transfer - onboarding, training, pattern sharing
- **ALIFF-CEO:** Strategic Intelligence - business analytics, market insights, optimization

This training system ensures Aliff learns from every conversation, diagnosis, decision, and outcome while NEVER revealing proprietary strategies externally.

---

## Directory Structure

```
Training/
├── Knowledge-Base/          # Processed training data organized by role
│   ├── SALES/              # Knowledge for ALIFF-SALES role
│   ├── OPS/                # Knowledge for ALIFF-OPS role
│   ├── CLIENT/             # Knowledge for ALIFF-CLIENT role
│   ├── TRAINER/            # Knowledge for ALIFF-TRAINER role
│   └── CEO/                # Knowledge for ALIFF-CEO role (full access)
│
├── Schemas/                # JSON schemas defining data structure
│   ├── strategic-discussion.json
│   ├── diagnosis-case-study.json
│   ├── client-interaction.json
│   ├── business-decision.json
│   └── pattern-recognition.json
│
├── Raw-Data/               # Raw training material before processing
│   ├── Conversations/      # Strategic discussions and brainstorming
│   ├── Case-Studies/       # Diagnosis case studies
│   └── Decisions/          # Business decisions and rules
│
└── Templates/              # Templates for capturing new data
    ├── diagnosis-template.md
    ├── case-study-template.md
    └── decision-log-template.md
```

---

## Data Categories

### 1. Strategic Discussion
**File:** `strategic-discussion.json`
**Purpose:** Captures strategic insights, business planning, and high-level decisions
**Example:** B2B strategy discussion, homepage design brainstorming, service framework planning

### 2. Diagnosis Case Study
**File:** `diagnosis-case-study.json`
**Purpose:** Captures solicitation diagnosis process - what RFP said vs. what we discovered
**Example:** US Embassy language instructors case (security clearance timeline insight)

### 3. Client Interaction
**File:** `client-interaction.json`
**Purpose:** Captures client communications, questions, objections, and how we handled them
**Example:** Agency asking about volume discounts, contractor questioning turnaround time

### 4. Business Decision
**File:** `business-decision.json`
**Purpose:** Captures business decisions, operational rules, and implementation logic
**Example:** Volume discount tiers (15%, 20%, 25%), Net-30 payment policy

### 5. Pattern Recognition
**File:** `pattern-recognition.json`
**Purpose:** Captures reusable patterns, red flags, green flags, and predictive insights
**Example:** "Re-compete + short timeline = likely incumbent performance issues"

---

## Role-Based Knowledge Access

Each Aliff role has **different knowledge access levels** to prevent strategy leaks:

| Data Type | SALES | OPS | CLIENT | TRAINER | CEO |
|-----------|-------|-----|--------|---------|-----|
| Strategic Discussions | ✓ (filtered) | ✓ (filtered) | ✗ | ✓ (filtered) | ✓ (full) |
| Diagnosis Case Studies | ✓ (patterns only) | ✓ (process) | ✗ | ✓ (methodology) | ✓ (full) |
| Client Interactions | ✓ (own interactions) | ✓ (operational) | ✓ (own client) | ✗ | ✓ (full) |
| Business Decisions | ✓ (pricing rules) | ✓ (workflows) | ✗ | ✓ (processes) | ✓ (full) |
| Pattern Recognition | ✓ (sales patterns) | ✓ (ops patterns) | ✗ | ✓ (teaching) | ✓ (full) |

**Security Principle:** Each role knows what it needs to perform its function, but NEVER reveals methodology, other clients' data, or proprietary strategies.

---

## Sensitivity Levels

Every piece of training data is tagged with sensitivity level:

- **public:** Can be shown externally (general best practices)
- **internal:** Internal use only, not client-facing
- **proprietary:** Our methods and strategies - NEVER reveal
- **secret:** Competitive moat knowledge - CEO access only

**Example:**
- "Diagnosis improves proposal quality" = **public**
- "We use 3-phase diagnosis process" = **internal**
- "Security clearance timelines drive incumbent preference" = **proprietary**
- "Volume discount margins: 15% (80% gross margin)" = **secret**

---

## How to Use This System

### Capturing New Data

1. **Identify the data type** (Strategic Discussion, Diagnosis, Client Interaction, Decision, Pattern)
2. **Use the appropriate template** from `Templates/`
3. **Fill in all required fields**
4. **Tag with Aliff roles** that should have access
5. **Set sensitivity level** appropriately
6. **Save to Raw-Data/** in the appropriate subfolder
7. **Process into Knowledge-Base/** organized by role

### Converting Conversations

Every strategic discussion, planning session, or brainstorming becomes training data:

**Example: B2B Strategy Discussion**
- Extract decisions (volume discount tiers)
- Extract patterns ("70-90% revenue from B2B agencies")
- Extract rules ("Never mention pricing publicly")
- Extract messaging ("Superior services at lower rates" NOT "cheap offshore labor")
- Tag with roles (CEO gets full access, SALES gets filtered messaging)
- Save as strategic-discussion JSON

### Building Diagnosis Knowledge

Every solicitation we work on becomes a case study:
- What RFP said (symptoms)
- What we discovered (root cause)
- Win strategy used
- Outcome and lessons learned
- Reusable patterns identified

---

## Training Workflow

```
Strategic Conversation
         ↓
Capture using Template
         ↓
Structure as JSON (following schema)
         ↓
Tag with roles + sensitivity
         ↓
Save to Raw-Data/
         ↓
Process into Knowledge-Base/ (by role)
         ↓
Fine-tune Aliff model OR add to RAG system
         ↓
Aliff learns and improves
         ↓
Output filtering ensures no strategy leaks
```

---

## Security Architecture

### Training Phase
- All data stays on our infrastructure
- No external API calls during training
- Proprietary data encrypted at rest
- Access controlled by role

### Inference Phase
- Aliff runs on our servers (not OpenAI/Anthropic APIs for proprietary queries)
- Output filtering layer checks for strategy leaks
- Role-based knowledge retrieval (ALIFF-SALES can't access CEO-level data)
- Client data isolation (Agency A never sees Agency B's data)

---

## Current Status

**Infrastructure:** ✅ Complete
- Directory structure created
- 5 JSON schemas defined
- 3 markdown templates ready
- README documentation complete

**Data Collection:** 🚧 In Progress
- Converting current strategic conversations
- Building initial diagnosis case studies
- Documenting business decisions

**Training:** ⏳ Not Started
- Model selection pending
- Fine-tuning approach TBD
- RAG system design pending

---

## Next Steps

1. **Convert existing Planning documents** into structured training format
2. **Document current conversation** as strategic discussions and business decisions
3. **Create first diagnosis case study** (US Embassy example)
4. **Build pattern library** from known insights
5. **Design Aliff personality/voice guidelines**
6. **Choose training approach** (fine-tuning vs. RAG vs. hybrid)
7. **Build output filtering system** to prevent strategy leaks

---

## Key Principles

1. **Capture everything:** Every conversation, decision, and outcome becomes training data
2. **Structure consistently:** Use schemas and templates religiously
3. **Tag appropriately:** Role access and sensitivity levels matter
4. **Protect strategies:** Aliff learns from proprietary knowledge but never reveals it
5. **Learn continuously:** Every project outcome feeds back into training
6. **Isolate clients:** Agency A never sees Agency B's strategies or data

---

**Remember:** Aliff is the de facto CEO. This isn't AI assistance - this is AI orchestration of human expertise. The training system ensures Aliff gets smarter with every interaction while protecting our competitive moat.
