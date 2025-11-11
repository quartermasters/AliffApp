# Business Decision: SDL Language and Terminology

**ID:** DEC-002
**Date:** 2025-11-11
**Category:** service_delivery

**Aliff Roles with Access:** [OPS, TRAINER, CEO]
**Sensitivity Level:** internal

---

## Situation

**What triggered this decision?**
Solicitation Diagnosis Lab (SDL) framework uses medical analogy internally (symptoms, diagnosis, prescription). Need to decide what language the Lab interface should speak when GOVCON professionals use it.

---

## Options Considered

**Option 1:** Medical Terminology (Diagnosis, Symptoms, Prescription)
- **Pros:**
  - Conceptually clear (fever = symptom requiring diagnosis)
  - Good teaching tool
  - Memorable analogy
- **Cons:**
  - Feels abstract to GOVCON practitioners
  - Not their professional language
  - Reduces credibility ("why are they talking like doctors?")
  - User adoption resistance

**Option 2:** GOVCON Professional Language (Win Themes, Strategic Analysis, Intelligence)
- **Pros:**
  - Users think in this language already
  - Signals domain expertise
  - Higher credibility with practitioners
  - Faster adoption - familiar terminology
- **Cons:**
  - Loses memorable medical analogy
  - Less unique conceptually

**Option 3:** Hybrid (Medical explanation + GOVCON interface)
- **Pros:**
  - Best of both worlds
  - Medical analogy for internal training
  - GOVCON language for customer interface
- **Cons:**
  - Requires maintaining two vocabularies
  - Potential confusion

---

## Decision Made

**The Decision:**
**SDL speaks GOVCON language** to users. Medical analogy reserved for internal training and conceptual explanation.

**Rationale:**
- GOVCON professionals think in "win themes," "evaluation criteria," "incumbent analysis" - this is their native language
- Lab interface credibility requires speaking practitioner language, not abstract medical terms
- Medical analogy remains powerful internal teaching tool for explaining WHY we do diagnosis, but interface uses HOW practitioners actually think

**Constraints:**
- Must maintain consistency across all GOVCON service delivery
- Cannot mix medical and GOVCON terminology in same user interface
- Internal team training can use medical analogy to teach concept

**Assumptions:**
- GOVCON professionals prefer familiar industry terminology
- Credibility increases when we "speak their language"
- User adoption higher with native terminology

---

## Implementation Rules

**Rule 1: Customer-Facing Terminology**
- **IF:** SDL interface, client communication, or external documentation
- **THEN:** Use GOVCON professional language only

**Rule 2: Internal Training**
- **IF:** Training new team members or explaining SDL concept
- **THEN:** Can use medical analogy as teaching tool ("RFP shows symptoms, we diagnose root cause")

**Rule 3: Documentation**
- **IF:** Creating SDL user guides, help text, or tutorials
- **THEN:** GOVCON language exclusively

---

## GOVCON Language Mapping

**Instead of Medical Terms, Use:**

| Medical Term | GOVCON Language |
|-------------|-----------------|
| Diagnosis Phase | Strategic Intelligence Phase / Capture Strategy Analysis |
| Symptoms | Stated Requirements |
| Root Cause | Unstated Drivers / Real Pain Points |
| Diagnosis | Strategic Analysis / Competitive Intelligence |
| Prescription | Win Strategy / Solution Approach |
| Patient History | Incumbent Analysis / Contract History |
| Lab Tests | Research Activities / Intelligence Gathering |
| Treatment Plan | Capture Plan / Win Strategy |

**SDL Terminology (Customer-Facing):**
- Solicitation Analysis
- Competitive Intelligence
- Agency Pain Point Discovery
- Win Theme Development
- Incumbent Assessment
- Evaluation Criteria Mapping
- Strategic Positioning
- Capture Strategy
- Intelligence Gathering
- Strategic Recommendations

**Voice:** The Lab speaks like a senior capture manager, not a medical professional.

---

## Exception Handling

**Exception 1:** When explaining SDL concept to non-GOVCON stakeholders (investors, partners)
- **How to handle:** Medical analogy acceptable for conceptual explanation, but emphasize "in practice, we use industry terminology"

**Exception 2:** Internal strategy documents discussing SDL methodology
- **How to handle:** Can reference medical analogy as conceptual framework in parentheses

---

## Success Metrics

**How to measure if this decision was correct:**
- User feedback on SDL interface clarity
- Adoption rate among GOVCON professionals
- Reduced need for terminology explanation
- Credibility scores from user surveys
- Time to proficiency for new users

---

**Key Principle:**
Medical analogy = **Internal conceptual tool** (helps team understand *why*)
GOVCON language = **External interface** (Lab speaks *their* language)

Same rigorous process, different vocabulary. The Lab thinks like a doctor but speaks like a capture manager.

---

**Tags:** [decision, govcon, sdl, terminology, user-experience, service-delivery]
