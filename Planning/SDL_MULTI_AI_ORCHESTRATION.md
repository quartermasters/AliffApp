# Solicitation Diagnosis Lab - Multi-AI Orchestration Logic

**Document ID:** SDL-ORCHESTRATION-001
**Date:** 2025-11-11
**Status:** Planning Phase

---

## Overview

This document defines how SDL orchestrates multiple AI models (GPT-5, Claude, Gemini, Microsoft Copilot, Grok) across solicitation analysis tasks. It specifies task decomposition, routing strategy, consensus logic, quality scoring, and cost optimization.

---

## Core Principles

1. **Task-Specific Routing:** Each AI handles what it does best
2. **Cost-Quality Balance:** Use expensive models (GPT-5) for critical analysis, cheaper models for routine tasks
3. **Multi-AI Cross-Validation:** High-stakes decisions require consensus from multiple AIs
4. **Human-in-the-Loop:** Critical insights and disagreements escalate to human experts
5. **Continuous Learning:** Track AI performance by task type, adjust routing over time

---

## Task Decomposition by Phase

SDL breaks solicitation analysis into **3 phases**, each with **34 discrete AI-assignable tasks**.

---

## PHASE 1: TRIAGE (AI-Led, Routine Tasks)

**Purpose:** Parse solicitation, extract structured data, assign complexity level

**AI Strategy:** Single AI execution, cost-optimized

### Document Processing (Tasks 1-4)

**Task 1: Document Ingestion and Parsing**
- **AI:** Claude (long-context strength)
- **Input:** Raw RFP/RFQ PDF or document
- **Output:** Parsed text with preserved structure
- **Rationale:** Claude handles long documents efficiently

**Task 2: Metadata Extraction**
- **AI:** Gemini (data extraction)
- **Input:** Parsed document
- **Output:** Agency name, solicitation number, deadline, contract value, solicitation type (RFP/RFQ/IFB/etc.)
- **Rationale:** Structured data extraction - Gemini excels at this

**Task 3: Section Identification and Structure Mapping**
- **AI:** Claude
- **Input:** Parsed document
- **Output:** Section map (technical requirements, evaluation criteria, SOW, contract terms, etc.)
- **Rationale:** Document structure analysis

**Task 4: Generate Table of Contents**
- **AI:** Claude
- **Input:** Section map
- **Output:** Navigable TOC with page/section references
- **Rationale:** Routine formatting task

### Requirements Extraction (Tasks 5-9)

**Task 5: Extract All Stated Requirements**
- **AI:** Gemini (structured data)
- **Input:** Technical sections from parsed document
- **Output:** Comprehensive list of stated requirements
- **Rationale:** Data extraction task

**Task 6: Extract Evaluation Criteria with Point Values**
- **AI:** Gemini
- **Input:** Evaluation section
- **Output:** Structured table: Criteria | Points | Weight %
- **Rationale:** Critical for understanding how agency scores proposals

**Task 7: Extract Compliance Requirements**
- **AI:** Claude (compliance focus)
- **Input:** Entire document
- **Output:** List of mandatory compliance items (certifications, registrations, formats)
- **Rationale:** Claude strong on compliance/regulatory text

**Task 8: Timeline/Deadline Mapping**
- **AI:** Gemini
- **Input:** Timeline sections, questions due, proposal due, contract start, etc.
- **Output:** Timeline chart with all critical dates
- **Rationale:** Data extraction

**Task 9: Generate Initial Compliance Checklist**
- **AI:** Gemini
- **Input:** Compliance requirements from Task 7
- **Output:** Checklist format for tracking
- **Rationale:** Routine task

### Initial Scoring (Tasks 10-11)

**Task 10: Complexity Scoring (1-10 scale)**
- **AI:** GPT-5 (reasoning required)
- **Input:** Full solicitation analysis from Tasks 1-9
- **Output:** Complexity score + rationale
  - 1-3: Simple (straightforward requirements, small scope)
  - 4-6: Moderate (some complexity, standard procurement)
  - 7-9: Complex (multiple phases, high technical requirements)
  - 10: Strategic (mission-critical, high competition, significant complexity)
- **Rationale:** Requires judgment - GPT-5 reasoning strength

**Task 11: Risk Flag Detection**
- **AI:** GPT-5 (pattern recognition + reasoning)
- **Input:** Full solicitation data
- **Output:** Risk flags identified:
  - Unrealistic timeline (too short for deliverables)
  - Budget-requirement mismatch (deliverables cost > budget)
  - Unclear requirements (ambiguous specifications)
  - Incumbent advantage signals
  - Set-aside restrictions
  - Security clearance requirements
- **Rationale:** Pattern recognition + strategic thinking

**Triage Phase Output:**
- Structured solicitation data
- Complexity score (determines SDL depth level)
- Risk flags
- Ready for human strategist to assign analysis depth: Standard/Complex/Strategic

---

## PHASE 2: STRATEGIC INTELLIGENCE (Human-Led, AI-Assisted)

**Purpose:** Discover unstated requirements, real pain points, competitive landscape

**AI Strategy:** Parallel execution for research, Multi-AI consensus for critical analysis

### Research Tasks - Parallel Execution (Tasks 12-16)

**Task 12: Incumbent Research**
- **AI:** Gemini (research + data aggregation)
- **Input:** Solicitation metadata, incumbent contractor name (if available)
- **Output:**
  - Incumbent contract history with this agency
  - Past performance ratings
  - Contract modifications/issues
  - Performance vulnerabilities
- **Rationale:** Research-heavy task

**Task 13: Agency Spending Patterns and Preferences**
- **AI:** Gemini (data analysis)
- **Input:** Agency name
- **Output:**
  - Recent similar contract awards
  - Typical contract values
  - Preferred contract types (FFP, T&M, CPFF)
  - Small business set-aside patterns
  - Geographic preferences
- **Rationale:** Data analysis across government databases

**Task 14: Contracting Officer Background and History**
- **AI:** Grok (real-time information)
- **Input:** Contracting officer name
- **Output:**
  - Professional background
  - Other contracts they've managed
  - Recent procurement activity
  - Public statements/preferences
- **Rationale:** Real-time, current information - Grok strength

**Task 15: Recent Similar Awards and Outcomes**
- **AI:** Gemini (historical data)
- **Input:** Agency + service category
- **Output:**
  - Similar solicitations in past 2 years
  - Who won, contract values
  - Evaluation criteria used
  - Protests filed and outcomes
- **Rationale:** Research task

**Task 16: Competitor Analysis**
- **AI:** Gemini + Grok (combined)
- **Input:** Service category + geographic area + agency
- **Output:**
  - Likely competitors
  - Their recent wins with this agency
  - Their typical approaches
  - Their strengths/weaknesses
  - Teaming partnerships
- **Rationale:** Research + real-time intelligence

### Critical Analysis - Multi-AI Cross-Validation (Tasks 17-22)

**HIGH-STAKES DECISIONS: Require consensus from multiple AIs**

**Task 17: Why is this being re-competed NOW?**
- **AIs:** GPT-5, Claude, Gemini (all three analyze)
- **Input:** Full solicitation + research from Tasks 12-16
- **Process:**
  1. Each AI independently analyzes timing and context
  2. System compares outputs for consensus/conflict
  3. If consensus (2+ agree): Document finding with confidence score
  4. If conflict: Escalate to human expert with all three perspectives
- **Output:** Strategic insight on procurement timing
- **Rationale:** CRITICAL insight - multiple perspectives catch what single AI misses

**Task 18: Unstated Requirement Detection**
- **AIs:** GPT-5, Claude (cross-validation)
- **Input:** Stated requirements vs. agency context
- **Process:**
  1. Both AIs identify requirements that "should be there but aren't"
  2. Both AIs identify constraints not explicitly stated
  3. Consensus on high-confidence unstated requirements
  4. Conflicts escalated to human
- **Output:** List of probable unstated requirements (US Embassy security clearance example)
- **Rationale:** Core competitive advantage - requires strategic thinking from multiple angles

**Task 19: Real Pain Point Identification**
- **AIs:** GPT-5, Claude (cross-validation)
- **Input:** Stated requirements + agency context + incumbent analysis
- **Process:**
  1. Both AIs analyze what agency really needs vs. what's written
  2. Both AIs identify operational constraints
  3. Consensus synthesis
- **Output:** Real pain points beyond stated requirements
- **Rationale:** "Fever vs. diagnosis" - critical strategic insight

**Task 20: Budget Reality Assessment**
- **AIs:** GPT-5, Gemini (cross-validation)
- **Input:** Stated budget + requirements + market rates
- **Process:**
  1. GPT-5 assesses budget reasonableness based on deliverables
  2. Gemini analyzes historical contract values for similar work
  3. Compare findings
- **Output:** Budget reality (realistic, underestimated, overestimated) + implications
- **Rationale:** Budget misalignment = red flag or opportunity

**Task 21: Timeline Constraint Analysis**
- **AIs:** GPT-5, Claude (cross-validation)
- **Input:** Timeline + deliverables + operational constraints (security clearances, etc.)
- **Process:**
  1. Both AIs analyze timeline feasibility
  2. Both AIs identify operational constraints (security clearances, facility access, etc.)
  3. Consensus on critical timeline factors
- **Output:** Timeline reality assessment + constraint identification
- **Rationale:** US Embassy example - timeline constraints reveal unstated preferences

**Task 22: Agency Culture Assessment**
- **AIs:** GPT-5 (strategic analysis)
- **Input:** Agency history + past awards + solicitation language tone
- **Output:** Culture profile:
  - Risk-averse vs. innovation-friendly
  - Relationship-driven vs. process-driven
  - Quality-focused vs. price-focused
  - Fast decision vs. slow/deliberate
- **Rationale:** Strategic insight guides proposal tone and approach

### Pattern Recognition (Tasks 23-25)

**Task 23: Match Against Known Patterns Library**
- **System:** Custom pattern matching engine
- **Input:** All findings from Tasks 17-22
- **Output:** Matching patterns from past successful diagnoses
  - Example: "Security clearance timeline pattern detected"
  - Example: "Re-compete with incumbent performance issues pattern"
- **Rationale:** Institutional knowledge application

**Task 24: Red Flag Identification**
- **AI:** GPT-5
- **Input:** Full analysis
- **Output:** Red flags that suggest no-bid or high risk:
  - Wired for incumbent
  - Unrealistic budget/timeline
  - Agency history of contentious procurements
  - High protest probability
- **Rationale:** Strategic risk assessment

**Task 25: Green Flag Identification**
- **AI:** GPT-5
- **Input:** Full analysis
- **Output:** Opportunity signals:
  - Incumbent vulnerability
  - Client strengths align perfectly
  - Agency seeking change/innovation
  - Strong relationship with contracting officer
- **Rationale:** Opportunity assessment

**Strategic Intelligence Phase Output:**
- Diagnosis brief with unstated drivers
- Real pain points identified
- Competitive landscape mapped
- Win probability estimate (preliminary)
- Ready for Win Strategy development

---

## PHASE 3: WIN STRATEGY (Collaborative - Multi-AI + Human)

**Purpose:** Develop win themes, differentiators, strategic recommendations

**AI Strategy:** Multi-AI for critical decisions, single AI for support tasks

### Strategic Recommendations - Multi-AI Cross-Validation (Tasks 26-29)

**Task 26: Win Probability Assessment**
- **AIs:** GPT-5, Claude (consensus required)
- **Input:** Full strategic intelligence from Phase 2
- **Process:**
  1. Both AIs independently calculate win probability
  2. Both provide rationale
  3. If within 10% agreement: Average with confidence score
  4. If >10% divergence: Escalate to human expert
- **Output:** Win probability % + confidence level + rationale
- **Rationale:** High-stakes decision requires validation

**Task 27: Win Theme Generation**
- **AIs:** GPT-5, Claude, Gemini (all three contribute)
- **Input:** Diagnosis findings + client strengths
- **Process:**
  1. Each AI generates 3-5 potential win themes
  2. System aggregates unique themes (10-15 total)
  3. Each AI scores themes for impact (1-10)
  4. Top 3-5 themes by consensus score selected
- **Output:** 3-5 win themes addressing diagnosed pain points
- **Rationale:** Multiple perspectives = stronger themes

**Task 28: Differentiator Identification**
- **AIs:** GPT-5, Claude (cross-validation)
- **Input:** Client capabilities + competitor analysis + agency needs
- **Process:**
  1. Both AIs identify client differentiators vs. competitors
  2. Both AIs map differentiators to evaluation criteria
  3. Consensus on strongest differentiators
- **Output:** Top 3-5 differentiators with supporting evidence
- **Rationale:** Strategic positioning - multiple AI validation

**Task 29: No-Bid Recommendation**
- **AIs:** GPT-5, Claude (consensus required)
- **Input:** Win probability + risk flags + strategic fit
- **Process:**
  1. Both AIs independently assess bid/no-bid
  2. If both recommend no-bid: Strong recommendation to client
  3. If one recommends no-bid: Present both perspectives to human expert
  4. Human makes final no-bid decision
- **Output:** Bid/No-Bid recommendation with rationale
- **Rationale:** CRITICAL business decision - requires multi-AI + human validation

### Solution Design Support - Single AI (Tasks 30-34)

**Task 30: Solution Approach Recommendations**
- **AI:** GPT-5 (strategic reasoning)
- **Input:** Win themes + technical requirements
- **Output:** High-level solution approach aligned with win themes
- **Rationale:** Strategic thinking task

**Task 31: Risk Mitigation Strategies**
- **AI:** GPT-5
- **Input:** Risk flags from Phase 2
- **Output:** Mitigation strategies for each identified risk
- **Rationale:** Strategic planning

**Task 32: Teaming Recommendations**
- **AI:** Gemini (research-based)
- **Input:** Requirements + client capabilities + market research
- **Output:** Recommended teaming partners and rationale
- **Rationale:** Research + analysis

**Task 33: Pricing Strategy Guidance**
- **AI:** GPT-5 (strategic)
- **Input:** Budget assessment + competitive landscape + win probability
- **Output:** Pricing strategy (aggressive, competitive, premium) + rationale
- **Rationale:** Strategic business decision support

**Task 34: Capture Plan Outline**
- **AI:** GPT-5
- **Input:** Full SDL analysis
- **Output:** Capture plan outline with key activities, timeline, resources
- **Rationale:** Strategic planning

**Win Strategy Phase Output:**
- Strategic brief with win themes
- Differentiators mapped to evaluation criteria
- Recommended approach
- Risk mitigation strategies
- Bid/No-bid recommendation
- Capture plan outline

---

## AI Routing Rules Summary

### By Cost Tier

**Tier 1: Cost-Optimized (Routine/Extraction)**
- **Tasks:** 1-9, 23
- **AIs:** Gemini (data extraction), Claude (document processing)
- **Rationale:** Structured tasks, cheaper models sufficient

**Tier 2: Strategic (High-Value Reasoning)**
- **Tasks:** 10-11, 22, 24-25, 30-34
- **AI:** GPT-5
- **Rationale:** Requires reasoning, judgment, strategic thinking

**Tier 3: Research (Parallel Execution)**
- **Tasks:** 12-16
- **AIs:** Gemini (primary), Grok (real-time)
- **Rationale:** Research-intensive, can run in parallel

**Tier 4: Critical (Multi-AI Cross-Validation)**
- **Tasks:** 17-21, 26-29
- **AIs:** GPT-5 + Claude + Gemini (varies by task)
- **Rationale:** High-stakes decisions, multiple perspectives required

### By Task Type

| Task Type | Primary AI | Secondary AI | Validation |
|-----------|-----------|--------------|------------|
| Document Parsing | Claude | - | Single |
| Data Extraction | Gemini | - | Single |
| Research | Gemini | Grok | Single |
| Strategic Reasoning | GPT-5 | - | Single |
| Critical Analysis | GPT-5 | Claude, Gemini | Multi-AI |
| Win Theme Development | GPT-5 | Claude, Gemini | Multi-AI |

---

## Consensus Logic

### When Multi-AI Cross-Validation Required

**Triggers for Multi-AI:**
1. Strategic insight (Tasks 17-22)
2. Win probability assessment (Task 26)
3. Win theme generation (Task 27)
4. Differentiator identification (Task 28)
5. No-bid recommendation (Task 29)

### Consensus Scenarios

**Scenario 1: Full Consensus (All AIs Agree)**
- **Action:** Document finding with high confidence score (90-95%)
- **Human Review:** Optional, proceed with finding

**Scenario 2: Majority Consensus (2 out of 3 Agree)**
- **Action:** Document majority finding with medium confidence score (70-85%)
- **Human Review:** Recommended, especially if dissenting AI has strong rationale
- **Example:** GPT-5 and Claude agree on unstated requirement, Gemini disagrees → Human expert reviews all three perspectives

**Scenario 3: Split Decision (No Consensus)**
- **Action:** Flag as high-uncertainty case
- **Human Review:** **MANDATORY** - Expert adjudicates
- **Output:** Present all AI perspectives to human, document human decision + rationale
- **Learning:** Often reveals critical insight - investigate why AIs disagreed
- **Example:** Win probability: GPT-5 says 60%, Claude says 25% → Huge divergence, human investigates root assumptions

**Scenario 4: AI Confidence Scores Conflict**
- **Action:** If AI expresses low confidence (<70%) even with consensus, escalate
- **Human Review:** Recommended
- **Example:** Both AIs identify pain point but both flag low confidence → Human validates through client engagement

### Human Tiebreaker Protocol

**When Human Expert Adjudicates:**
1. **Receives:** All AI outputs with rationale, confidence scores, and supporting evidence
2. **Reviews:** Each AI's reasoning and assumptions
3. **Investigates:** Can request additional AI analysis or research
4. **Decides:** Makes final determination
5. **Documents:** Decision + rationale added to training data

**Human Decision Authority:**
- Can override AI consensus if expert judgment differs
- Can request re-analysis with different parameters
- Can mark finding as "requires validation" and engage with client/contracting officer
- Final authority on no-bid decisions

---

## Quality Scoring System

### AI Output Rating (By Human Experts)

**After each solicitation analysis, human team rates AI performance:**

**Rating Scale (1-5):**
- **5 - Exceptional:** AI output required minimal refinement, provided novel insight
- **4 - Strong:** AI output high quality, minor refinements needed
- **3 - Adequate:** AI output acceptable, moderate refinement required
- **2 - Weak:** AI output had significant issues, major human rework needed
- **1 - Poor:** AI output unusable, human started from scratch

**Rated Dimensions:**
1. **Accuracy:** Factual correctness, no hallucinations
2. **Relevance:** Output addressed the task requirement
3. **Insight Quality:** Depth of strategic thinking
4. **Efficiency:** Time/cost vs. value delivered

**Rating Tracked By:**
- AI model (GPT-5, Claude, Gemini, Copilot, Grok)
- Task type (parsing, research, strategic analysis, etc.)
- Solicitation complexity (simple, moderate, complex, strategic)

### Performance Tracking & Routing Adjustment

**Continuous Monitoring:**
- **Weekly:** Review AI performance scores by task type
- **Monthly:** Analyze trends, identify underperforming AI-task combinations
- **Quarterly:** Adjust routing rules based on performance data

**Routing Adjustment Logic:**

**IF:** AI consistently scores 4-5 on task type → Reinforce routing (keep assigning)

**IF:** AI consistently scores 2-3 on task type → Investigate and adjust:
- Test alternate AI for that task type
- Modify prompts/parameters
- Consider removing AI from that task type

**IF:** New AI added to ensemble → Pilot on 10-20 tasks, evaluate performance, adjust routing

**Example Scenario:**
- Gemini scores 4.8 avg on "Requirements Extraction" (Task 5) → Confirm as primary for this task
- GPT-5 scores 2.3 avg on "Document Parsing" (Task 1) → Stop routing parsing to GPT-5, keep on Claude
- Grok scores 4.5 on "Real-time Competitor Intel" → Expand Grok use for real-time research tasks

**Learning Loop:**
Every analysis creates feedback that improves future routing. System gets smarter about which AI excels at what.

---

## Cost vs Quality Optimization

### Cost Structure (Estimated - Subject to Change)

**AI API Costs (Approximate per 1M tokens):**
- **GPT-5:** $15-30 (most expensive, best reasoning)
- **Claude Opus:** $15-30 (premium, long context)
- **Claude Sonnet:** $3-15 (mid-tier)
- **Gemini Pro:** $1-7 (cost-effective, good research)
- **Grok:** $5-10 (specialized real-time)
- **Gemini Flash:** $0.10-1 (cheapest, basic tasks)

### Cost Optimization Rules

**Rule 1: Match Cost to Task Criticality**
- **Critical strategic analysis (Tasks 17-29):** Use premium AIs (GPT-5, Claude Opus) - quality matters more than cost
- **Routine extraction (Tasks 1-9):** Use cost-effective AIs (Gemini, Claude Sonnet) - accuracy sufficient at lower cost
- **Research tasks (Tasks 12-16):** Use mid-tier AIs (Gemini Pro) - balance cost and quality

**Rule 2: Multi-AI Sparingly**
- **Use multi-AI consensus ONLY for:** High-stakes decisions (17-21, 26-29)
- **Avoid multi-AI for:** Routine tasks where single AI sufficient
- **Cost Impact:** Multi-AI costs 2-3x more but justified for critical insights

**Rule 3: Token Optimization**
- **Long documents:** Claude excels at long context, use instead of chunking with GPT-5
- **Short queries:** Use smaller models where context window not needed
- **Batch processing:** Group similar tasks to optimize API calls

**Rule 4: Tier-Based Routing**
```
Task Criticality → AI Cost Tier

Routine (Tasks 1-9, 32):
  → Gemini Flash/Pro (cheapest)
  → Cost per analysis: $0.10-0.50

Research (Tasks 12-16):
  → Gemini Pro (mid-tier)
  → Cost per analysis: $0.50-2.00

Strategic (Tasks 10-11, 22-25, 30-31, 33-34):
  → GPT-5 (premium, single AI)
  → Cost per analysis: $2.00-5.00

Critical Multi-AI (Tasks 17-21, 26-29):
  → GPT-5 + Claude + Gemini (most expensive)
  → Cost per analysis: $5.00-15.00
```

**Estimated Total Cost Per Solicitation Analysis:**
- **Simple (Complexity 1-3):** $5-10 (lighter multi-AI use)
- **Moderate (Complexity 4-6):** $10-25 (standard multi-AI)
- **Complex (Complexity 7-9):** $25-50 (extensive multi-AI)
- **Strategic (Complexity 10):** $50-100 (full multi-AI validation)

### Quality Thresholds

**Non-Negotiable Quality Standards:**
- **Accuracy:** No hallucinations on factual data (agency names, dates, requirements)
- **Compliance:** 100% capture of mandatory compliance items
- **Critical Insights:** Human expert must validate all Phase 2 findings (Tasks 17-22)

**Where Cost Optimization Acceptable:**
- Document parsing - cheaper model fine if accurate
- Data extraction - structured output, quality measurable
- Research aggregation - speed matters, human reviews anyway

**Where Premium AI Justified:**
- Unstated requirement detection - core competitive advantage
- Win theme generation - directly impacts proposal quality
- No-bid decisions - prevents wasted resources

### ROI Calculation

**SDL Value Proposition:**
- **Without SDL:** Standard win rate ~4%, generic proposal approach, miss unstated requirements
- **With SDL:** Target win rate ~15-22%, strategic differentiation, address real pain points

**Cost-Benefit:**
- **SDL Cost:** $10-100 per analysis (depending on complexity)
- **Proposal Cost:** $10,000-100,000+ (internal cost to prepare full proposal)
- **Contract Value:** $100,000-$10M+

**ROI Example:**
- **Scenario:** $500K contract opportunity
- **SDL Cost:** $50 (complex analysis)
- **Proposal Cost:** $25K internal
- **Win Rate Improvement:** 4% → 20% (5x increase)
- **Expected Value:** $500K × 20% = $100K vs. $500K × 4% = $20K
- **Net Gain:** $80K - $50 SDL cost = $79,950 additional expected value

**Justification for Multi-AI Costs:**
Even most expensive SDL analysis ($100) justified if it improves win rate on contracts worth $100K+. The strategic insight ROI far exceeds AI API costs.

---

## Orchestration System Architecture

### System Components

**1. SDL Orchestrator (Master Controller)**
- Receives solicitation input
- Decomposes into 34 tasks
- Routes tasks to appropriate AIs
- Manages parallel execution
- Aggregates results
- Triggers human review checkpoints

**2. AI Router Module**
- Maintains routing rules (cost tier, task type)
- Tracks AI availability and performance
- Implements fallback logic if AI unavailable
- Optimizes cost vs quality

**3. Consensus Engine**
- Compares multi-AI outputs
- Calculates agreement scores
- Flags conflicts for human review
- Synthesizes consensus findings

**4. Quality Tracker**
- Captures human ratings of AI outputs
- Analyzes performance trends
- Recommends routing adjustments
- Generates performance reports

**5. Human Review Interface**
- Presents AI outputs with confidence scores
- Highlights consensus vs conflicts
- Allows expert adjudication
- Captures human decisions for training data

### Workflow Diagram

```
Solicitation Input
    ↓
SDL Orchestrator
    ↓
Task Decomposition (34 tasks identified)
    ↓
┌─────────────────────────────────────┐
│  PHASE 1: TRIAGE (AI-Led)          │
│  Tasks 1-11 routed by AI Router    │
│  - Parsing → Claude                 │
│  - Extraction → Gemini              │
│  - Scoring → GPT-5                  │
└─────────────────────────────────────┘
    ↓
Human Checkpoint: Assign Depth Level
    ↓
┌─────────────────────────────────────┐
│  PHASE 2: STRATEGIC INTELLIGENCE    │
│  Tasks 12-25 (Human-Led)            │
│  - Research → Gemini + Grok         │
│  - Critical Analysis → Multi-AI     │
│    (GPT-5 + Claude + Gemini)        │
│  - Consensus Engine validates       │
└─────────────────────────────────────┘
    ↓
Human Checkpoint: Review Diagnosis
    ↓
┌─────────────────────────────────────┐
│  PHASE 3: WIN STRATEGY              │
│  Tasks 26-34 (Collaborative)        │
│  - Win Probability → Multi-AI       │
│  - Win Themes → Multi-AI            │
│  - No-Bid Decision → Multi-AI       │
│  - Support Tasks → GPT-5            │
└─────────────────────────────────────┘
    ↓
Human Checkpoint: Validate Strategy
    ↓
Final SDL Report Delivered
    ↓
Human Team Rates AI Performance
    ↓
Quality Tracker Updates Routing Rules
```

---

## Exception Handling

### AI Outage/Unavailability

**IF:** Primary AI for task unavailable
**THEN:** AI Router implements fallback:
1. Check secondary AI capability for task
2. Route to secondary AI
3. Log incident for performance tracking
4. If multiple AIs unavailable, escalate to human team

**Example:**
- Task 5 (Requirements Extraction) assigned to Gemini
- Gemini API error
- Fallback: Route to Claude (also capable of extraction)
- Document that Claude used instead

### Multi-AI Disagreement

**IF:** Multi-AI outputs show significant disagreement (Exception 3 from DEC-003)
**THEN:**
1. Flag as high-uncertainty case
2. Present all AI outputs to human expert
3. Expert investigates root cause of disagreement
4. Expert makes determination
5. Document which AI was correct (learning opportunity)
6. Often disagreement reveals critical insight both AIs partially captured

**Example:**
- Task 18 (Unstated Requirement Detection)
- GPT-5 identifies: "Agency prefers existing personnel"
- Claude identifies: "Timeline too short for new hires"
- **Insight:** Both correct - agency wants continuity AND timeline forces it
- Human synthesis: "Agency requires personnel continuity due to operational timeline constraint"

### Low Confidence Outputs

**IF:** AI expresses low confidence (<70%) even on single-AI task
**THEN:**
1. Flag for human review
2. Optionally route to second AI for validation
3. Human decides whether to accept, modify, or reject AI output

### Cost Overrun

**IF:** SDL analysis cost exceeds budget for complexity tier
**THEN:**
1. Quality Tracker alerts
2. Review routing decisions - were premium AIs over-used?
3. Adjust routing for future similar solicitations
4. If pattern continues, revise pricing or routing rules

---

## Performance Metrics

### Tracked Metrics

**AI Performance:**
- Accuracy rate by task type
- Average quality score (1-5) by AI and task
- Consensus rate on multi-AI tasks
- Cost per task by AI
- Latency per task

**SDL Effectiveness:**
- Win rate: SDL-supported proposals vs. non-SDL baseline
- Client satisfaction scores
- Time to complete analysis (target: 24-48 hours depending on complexity)
- No-bid recommendation accuracy (were they right to decline?)

**Cost Efficiency:**
- Cost per analysis by complexity tier
- Cost vs win rate ROI
- AI routing efficiency (are we using right AI for each task?)

### Success Targets (Phase 1)

- **Win Rate:** 15-22% (vs 4% industry baseline)
- **Client Satisfaction:** >4.5/5.0
- **Analysis Turnaround:** <48 hours for moderate complexity
- **Multi-AI Consensus Rate:** >80% (high agreement indicates well-calibrated routing)
- **Cost per Analysis:** Within budget targets by complexity tier
- **AI Quality Scores:** >4.0 average across all task types

---

## Training Data Capture

### Every SDL Analysis Creates Training Data

**Captured for Phase 2 Custom Model Development:**

1. **Input:** Full solicitation document + metadata
2. **Task Outputs:** All 34 task outputs from AI ensemble
3. **Human Refinements:** What human experts changed/added
4. **Consensus Data:** Which AIs agreed/disagreed on what
5. **Quality Scores:** Human ratings of each AI output
6. **Final Diagnosis:** Complete strategic intelligence brief
7. **Outcome:** Did client win? Feedback from client/agency
8. **Lessons Learned:** What worked, what didn't

**This structured data trains custom model in Phase 2 to:**
- Learn which insights actually mattered for wins
- Understand which AI approaches worked best
- Develop domain-specific pattern recognition
- Optimize routing and consensus logic

---

## Continuous Improvement Loop

```
SDL Analysis Completed
    ↓
Human Rates AI Performance (Quality Scores)
    ↓
Quality Tracker Analyzes Trends
    ↓
IF: AI consistently underperforming on task type
THEN: Adjust routing rules
    ↓
IF: AI consistently outperforming expectations
THEN: Expand use of that AI
    ↓
IF: New pattern identified
THEN: Add to pattern library
    ↓
IF: Custom model ready (Phase 2)
THEN: Test against multi-AI ensemble
    ↓
IF: Custom model >= ensemble performance
THEN: Swap to Phase 3
    ↓
System Gets Smarter With Every Project
```

---

## Implementation Checklist

**Phase 1 Launch Requirements:**

- [ ] API integrations: GPT-5, Claude, Gemini, Copilot, Grok
- [ ] SDL Orchestrator system built
- [ ] AI Router module with routing rules
- [ ] Consensus Engine for multi-AI validation
- [ ] Human Review Interface
- [ ] Quality Tracker system
- [ ] 34 task prompts engineered and tested
- [ ] Human expert team recruited and trained
- [ ] Pilot 10 solicitation analyses to calibrate
- [ ] Performance metrics dashboard
- [ ] Training data capture system

**Success Criteria for Launch:**
- All 34 tasks execute successfully on pilot solicitations
- Human experts validate AI output quality
- Cost per analysis within target range
- Multi-AI consensus achieves >75% agreement rate
- Zero critical errors (hallucinations, missed compliance requirements)

---

**Document Status:** Ready for implementation planning

**Next Steps:**
1. Build SDL Orchestrator system architecture
2. Engineer prompts for all 34 tasks
3. Implement AI Router and Consensus Engine
4. Design Human Review Interface
5. Recruit and train human expert team
6. Pilot program with 10-20 solicitations
7. Refine based on pilot results
8. Launch Phase 1

---

**Tags:** [sdl, orchestration, multi-ai, task-decomposition, routing-logic, cost-optimization, quality-scoring]
