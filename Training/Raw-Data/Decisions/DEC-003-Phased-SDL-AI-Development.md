# Business Decision: Phased SDL AI Development Strategy

**ID:** DEC-003
**Date:** 2025-11-11
**Category:** strategy

**Aliff Roles with Access:** [OPS, CEO]
**Sensitivity Level:** internal

---

## Situation

**What triggered this decision?**
SDL requires world-class AI capabilities. Building custom fine-tuned model on 20+ years of government contracting data is time-consuming and challenging (especially for non-US entity accessing historical data). Need to decide: wait for perfect custom model OR launch with proven technology and upgrade later.

---

## Options Considered

**Option 1:** Wait for Custom Fine-Tuned Model
- **Pros:**
  - Optimal performance from day one
  - Proprietary intelligence advantage
  - Domain-specific training
- **Cons:**
  - 12-18 month delay to launch
  - Historical data acquisition nightmare for non-US entity
  - No revenue during development
  - No real-world feedback to guide training

**Option 2:** Launch with Latest AI APIs, Upgrade Later
- **Pros:**
  - Launch immediately with GPT-5/Claude
  - Start generating revenue and collecting real data
  - Each project creates training data for custom model
  - Learn what actually matters before building custom solution
  - Proven technology, lower risk
- **Cons:**
  - Dependent on third-party APIs initially
  - API costs higher than self-hosted model
  - No proprietary model advantage initially

**Option 3:** Build Custom Model Only, No API Fallback
- **Pros:**
  - Complete control
  - No API dependencies
- **Cons:**
  - High risk if model underperforms
  - Long development timeline
  - Expensive to build without real-world validation

---

## Decision Made

**The Decision:**
**Three-Phase Approach** - Launch fast with proven APIs, build custom intelligence in parallel, swap when ready.

**Phase 1 (Launch - Immediate):**
- Use GPT-5 and Claude Sonnet APIs as AI engine
- Integrate government data APIs (SAM.gov, USASpending.gov, FPDS-NG)
- Deploy world-class human expert team
- Start SDL operations immediately

**Phase 2 (Parallel Development - Ongoing):**
- Collect training data from every real SDL project
- Build diagnosis case study corpus
- Fine-tune custom model on actual project data
- Develop proprietary pattern recognition
- Test custom model against API performance

**Phase 3 (Replace - When Ready):**
- Swap in fine-tuned custom model
- Keep same SDL interface (users see no disruption)
- Maintain API as fallback for edge cases
- Continue learning and improving custom model

**Rationale:**
- Launch speed matters - start generating revenue and real-world data immediately
- Each real project creates perfect training data for custom model (actual solicitations, our diagnosis, actual outcomes)
- Proven APIs (GPT-5/Claude) deliver excellent baseline performance
- Human expert team provides strategic thinking regardless of AI backend
- Can upgrade AI intelligence over time without disrupting service
- Real-world feedback guides custom model development better than theoretical training

**Constraints:**
- Phase 1 has API costs - must factor into pricing
- Third-party API dependency initially (mitigated by human team quality)
- Custom model development requires dedicated resources

**Assumptions:**
- GPT-5/Claude APIs sufficient for Phase 1 quality standards
- Real project data better training corpus than historical archives
- 12-18 months sufficient to develop custom model in parallel
- Custom model will outperform APIs once properly trained

---

## Implementation Rules

**Rule 1: Launch Readiness**
- **IF:** Phase 1 ready (APIs integrated + human team recruited + government data sources connected)
- **THEN:** Launch SDL operations, don't wait for custom model

**Rule 2: Training Data Capture**
- **IF:** SDL processes any solicitation (win or loss)
- **THEN:** Capture as structured training data for Phase 2

**Rule 3: Model Performance Tracking**
- **IF:** Custom model in development
- **THEN:** Benchmark against API performance on same solicitations

**Rule 4: Swap Trigger**
- **IF:** Custom model performance >= API performance + cost savings justify switch
- **THEN:** Execute Phase 3 swap

**Rule 5: Continuous Improvement**
- **IF:** Phase 3 complete (custom model deployed)
- **THEN:** Continue collecting data, continue training, never stop improving

---

## Phase 1 Technology Stack

**AI Layer:**
- GPT-5 API (primary reasoning and analysis)
- Claude Sonnet API (secondary/validation, document processing)

**Government Data Integration:**
- SAM.gov API (solicitations, contractor profiles)
- USASpending.gov API (agency spending patterns, contract awards)
- FPDS-NG (Federal Procurement Data System)
- Beta.SAM.gov API (entity validation, exclusions)

**Intelligence Tools:**
- Web scraping for agency news, leadership changes
- Document parsing for RFP analysis
- Competitive intelligence aggregation

**Human Resources:**
- Former contracting officers
- Senior capture managers (15-20+ years)
- Intelligence analysts
- Domain experts by agency type
- Red team reviewers

**Process:**
1. AI ingests RFP + government data
2. AI generates initial analysis
3. Human expert team reviews, debates, refines
4. Red team challenges assumptions
5. Final strategic recommendations delivered

---

## Phase 2 Development Plan

**Training Data Sources:**
- Every SDL solicitation analysis (input)
- Every diagnosis finding (process)
- Every win strategy (output)
- Every outcome (win/loss + feedback)
- Pattern library from human experts
- Competitive intelligence database

**Model Approach:**
- Fine-tune GPT-5 or Llama on proprietary data
- Specialize on government solicitation analysis
- Train on win/loss patterns
- Incorporate agency behavior profiles

**Success Criteria for Phase 3 Swap:**
- Custom model accuracy >= API baseline
- Response quality validated by human experts
- Cost per analysis < API costs
- Latency acceptable for real-time use

---

## Exception Handling

**Exception 1:** API outage or degraded performance
- **How to handle:** Human team can operate SDL manually if needed (trained on process, not dependent on AI)

**Exception 2:** Custom model underperforms APIs
- **How to handle:** Continue Phase 1 approach, invest more in training data quality

**Exception 3:** API costs become prohibitive before custom model ready
- **How to handle:** Adjust pricing or accelerate Phase 2 development

---

## Success Metrics

**Phase 1 Metrics:**
- SDL win rate vs. non-SDL proposals
- Client satisfaction with strategic analysis
- Time to deliver diagnosis
- Revenue generated (funds Phase 2 development)

**Phase 2 Metrics:**
- Training data corpus size (target: 100+ real solicitations)
- Custom model benchmark scores vs. APIs
- Development timeline adherence

**Phase 3 Metrics:**
- Cost savings from custom model vs. APIs
- Performance improvement over APIs
- System uptime and reliability

---

**Key Principle:**
Launch fast, learn continuously, upgrade intelligently. Real-world data beats theoretical training every time.

**Benefit:**
Start generating revenue immediately while each project makes the system smarter. By the time custom model ready, it's trained on actual Aliff diagnosis methodology and real outcomes - not generic historical data.

---

**Tags:** [decision, sdl, ai-development, phased-approach, strategy, technology]
