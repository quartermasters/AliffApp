/**
 * Aliff AI - SDL Triage Reporter
 *
 * Generate reports and dashboards from triage results.
 */

import type { TriageResult, BatchTriageResult } from './types';

/**
 * Generate executive summary report (markdown)
 */
export function generateExecutiveReport(result: TriageResult): string {
  const { summary, metadata, requirements, compliance, scoring, performance } = result;

  const report = `# SDL Triage Report: ${summary.title}

**Generated:** ${result.timestamp.toLocaleString()}
**Solicitation:** ${summary.solicitationNumber || 'N/A'}
**Agency:** ${summary.agency}
**Analysis Time:** ${(performance.totalTimeMs / 1000).toFixed(1)}s
**Status:** ${result.status.toUpperCase()}

---

## Executive Summary

### Overall Assessment

| Metric | Score | Status |
|--------|-------|--------|
| **Viability** | **${summary.viability}/100** | ${getViabilityStatus(summary.viability)} |
| **Win Probability** | ${summary.winProbability}% | ${getWinProbStatus(summary.winProbability)} |
| **Complexity** | ${summary.complexity}/100 | ${getComplexityStatus(summary.complexity)} |
| **Compliance Rate** | ${summary.complianceRate}% | ${getComplianceStatus(summary.complianceRate)} |

### Recommendation: **${summary.recommendation.toUpperCase()}**

**Confidence:** ${(summary.confidence * 100).toFixed(0)}%

**Rationale:** ${summary.rationale}

---

## Key Insights

### Strengths
${summary.keyStrengths.length > 0 ? summary.keyStrengths.map((s) => `- ${s}`).join('\n') : '_No significant strengths identified_'}

### Challenges
${summary.keyChallenges.length > 0 ? summary.keyChallenges.map((c) => `- ${c}`).join('\n') : '_No major challenges identified_'}

### Critical Gaps
${summary.criticalGaps.length > 0 ? summary.criticalGaps.map((g) => `- ${g}`).join('\n') : '_No critical gaps_'}

---

## Opportunity Details

### Basic Information
- **Title:** ${metadata.metadata.administrative.title || 'N/A'}
- **Solicitation Number:** ${metadata.metadata.administrative.solicitationNumber || 'N/A'}
- **Issuing Agency:** ${metadata.metadata.administrative.issuingAgency || 'N/A'}
- **Agency Office:** ${metadata.metadata.administrative.agencyOffice || 'N/A'}
- **Procurement Type:** ${metadata.metadata.administrative.procurementType || 'N/A'}
- **Set-Aside:** ${metadata.metadata.administrative.setAsideType || 'none'}

### Timeline
- **Issue Date:** ${metadata.metadata.timeline.issueDate?.toLocaleDateString() || 'N/A'}
- **Response Deadline:** ${metadata.metadata.timeline.responseDeadline?.toLocaleDateString() || 'N/A'}
- **Q&A Deadline:** ${metadata.metadata.timeline.qaDeadline?.toLocaleDateString() || 'N/A'}
- **Estimated Award:** ${metadata.metadata.timeline.estimatedAwardDate?.toLocaleDateString() || 'N/A'}
- **Period of Performance:** ${metadata.metadata.timeline.periodOfPerformance || 'N/A'}

### Financial
- **Estimated Value:** ${metadata.metadata.financial.estimatedValue ? `$${metadata.metadata.financial.estimatedValue.toLocaleString()}` : 'N/A'}
- **Contract Type:** ${metadata.metadata.financial.contractType || 'N/A'}
- **Budget Available:** ${metadata.metadata.financial.budgetAvailable !== undefined ? (metadata.metadata.financial.budgetAvailable ? 'Yes' : 'No') : 'Unknown'}

### Technical
- **NAICS Code:** ${metadata.metadata.technical.naicsCode || 'N/A'}
- **PSC Code:** ${metadata.metadata.technical.pscCode || 'N/A'}
- **Security Clearance:** ${metadata.metadata.technical.securityClearanceRequired || 'none'}
- **Place of Performance:** ${metadata.metadata.technical.placeOfPerformance || 'N/A'}
- **Key Technologies:** ${metadata.metadata.technical.keyTechnologies?.join(', ') || 'N/A'}

---

## Requirements Analysis

**Total Requirements:** ${requirements.statistics.total}
**Must-Have:** ${requirements.statistics.mustHave} | **Should-Have:** ${requirements.statistics.shouldHave} | **Nice-to-Have:** ${requirements.statistics.niceToHave}

**Average Complexity:** ${requirements.statistics.avgComplexity.toFixed(1)}/10
**High-Complexity Requirements:** ${requirements.statistics.highComplexityCount}

### Top Must-Have Requirements
${requirements.byPriority.mustHave
  .slice(0, 5)
  .map((r, i) => `${i + 1}. ${r.text} *(Complexity: ${r.complexity || 'N/A'}/10)*`)
  .join('\n') || '_No must-have requirements extracted_'}

${requirements.evaluationCriteria.length > 0 ? `
### Evaluation Criteria
${requirements.evaluationCriteria
  .map(
    (ec) =>
      `- **${ec.name}** ${ec.weight ? `(${ec.weight}%)` : ''}\n  ${ec.description}`
  )
  .join('\n')}
` : ''}

---

## Compliance Analysis

**Detected Frameworks:** ${compliance.detectedFrameworks.map((f) => f.framework).join(', ') || 'None'}
**Compliance Rate:** ${compliance.overallCompliance.complianceRate}%
**Risk Level:** ${compliance.overallCompliance.riskLevel.toUpperCase()}

### Compliance Gaps
- **Total Gaps:** ${compliance.gaps.length}
- **Critical:** ${compliance.gaps.filter((g) => g.impact === 'critical').length}
- **High:** ${compliance.gaps.filter((g) => g.impact === 'high').length}
- **Medium:** ${compliance.gaps.filter((g) => g.impact === 'medium').length}

${compliance.gaps.filter((g) => g.impact === 'critical').length > 0 ? `
### Critical Compliance Gaps
${compliance.gaps
  .filter((g) => g.impact === 'critical')
  .slice(0, 5)
  .map((g) => `- **${g.item.requirement.text}**\n  - Gap: ${g.gapDescription}\n  - Remediation: ${g.remediation.actions[0] || 'None specified'}\n  - Cost: $${g.remediation.cost?.toLocaleString() || 'Unknown'}\n  - Timeframe: ${g.remediation.timeframe || 'Unknown'}`)
  .join('\n\n')}
` : ''}

### Estimated Remediation
- **Total Hours:** ${compliance.estimatedEffort.totalHours.toLocaleString()}
- **Total Cost:** $${compliance.estimatedEffort.totalCost.toLocaleString()}
- **Time to Compliance:** ${compliance.estimatedEffort.timeToCompliance}

---

## Complexity Breakdown

**Overall Complexity:** ${scoring.complexity.overall}/100 (${scoring.complexity.riskLevel.toUpperCase()})

| Dimension | Score | Weight |
|-----------|-------|--------|
| Technical | ${scoring.complexity.breakdown.technical}/100 | 30% |
| Compliance | ${scoring.complexity.breakdown.compliance}/100 | 25% |
| Schedule | ${scoring.complexity.breakdown.schedule}/100 | 20% |
| Team | ${scoring.complexity.breakdown.team}/100 | 15% |
| Cost | ${scoring.complexity.breakdown.cost}/100 | 10% |

${scoring.complexity.factors.length > 0 ? `
### Top Complexity Factors
${scoring.complexity.factors
  .slice(0, 5)
  .map((f) => `- **${f.name}** (${f.score}/100)\n  ${f.description}`)
  .join('\n\n')}
` : ''}

---

## Win Probability Analysis

**Overall pWin:** ${scoring.winProbability.overall}%

| Factor | Score |
|--------|-------|
| Capability Match | ${scoring.winProbability.breakdown.capability}% |
| Relevant Experience | ${scoring.winProbability.breakdown.experience}% |
| Agency Relationships | ${scoring.winProbability.breakdown.relationships}% |
| Pricing Competitiveness | ${scoring.winProbability.breakdown.pricing}% |
| Differentiation | ${scoring.winProbability.breakdown.differentiation}% |

### SWOT Analysis

**Strengths**
${scoring.winProbability.strengths.map((s) => `- ${s}`).join('\n') || '_None identified_'}

**Weaknesses**
${scoring.winProbability.weaknesses.map((w) => `- ${w}`).join('\n') || '_None identified_'}

**Opportunities**
${scoring.winProbability.opportunities.map((o) => `- ${o}`).join('\n') || '_None identified_'}

**Threats**
${scoring.winProbability.threats.map((t) => `- ${t}`).join('\n') || '_None identified_'}

---

## Competitive Analysis

**Estimated Competitors:** ${scoring.competitive.estimatedCompetitors || 'Unknown'}
**Incumbent Advantage:** ${scoring.competitive.incumbentAdvantage ? `Yes (${scoring.competitive.incumbentName || 'Unknown'})` : 'No'}
**Market Position:** ${scoring.competitive.marketPosition}

${scoring.competitive.winThemes.length > 0 ? `
### Recommended Win Themes
${scoring.competitive.winThemes.map((wt, i) => `${i + 1}. ${wt}`).join('\n')}
` : ''}

---

## Bid Decision

### Financial Analysis
- **Estimated Revenue:** $${scoring.bidDecision.estimatedRevenue.toLocaleString()}
- **Estimated Bid Cost:** $${scoring.bidDecision.estimatedCost.toLocaleString()}
- **Estimated Profit:** $${scoring.bidDecision.estimatedProfit.toLocaleString()}
- **ROI:** ${scoring.bidDecision.roi.toFixed(0)}%
- **Expected Value (pWin × Profit):** $${scoring.bidDecision.expectedValue.toLocaleString()}

### Strategic Assessment
- **Strategic Value:** ${scoring.bidDecision.strategicValue}/100
- **Risk Score:** ${scoring.bidDecision.riskScore}/100
- **Resource Availability:** ${scoring.bidDecision.resourceAvailability}/100

### Decision: **${scoring.recommendation.decision.toUpperCase()}**

**Confidence:** ${(scoring.recommendation.confidence * 100).toFixed(0)}%
**Risk Level:** ${scoring.recommendation.riskLevel.toUpperCase()}
**Strategic Fit:** ${scoring.recommendation.strategicFit}/100

**Pros:**
${scoring.recommendation.keyFactors.pros.map((p) => `- ${p}`).join('\n') || '_None listed_'}

**Cons:**
${scoring.recommendation.keyFactors.cons.map((c) => `- ${c}`).join('\n') || '_None listed_'}

${scoring.recommendation.conditions && scoring.recommendation.conditions.length > 0 ? `
**Conditions for Pursuit:**
${scoring.recommendation.conditions.map((c) => `- ${c}`).join('\n')}
` : ''}

${scoring.recommendation.alternatives && scoring.recommendation.alternatives.length > 0 ? `
**Alternative Approaches:**
${scoring.recommendation.alternatives.map((a) => `- ${a}`).join('\n')}
` : ''}

---

## Performance Metrics

- **Total Time:** ${(performance.totalTimeMs / 1000).toFixed(1)}s
- **AI Calls Made:** ${performance.aiCallsMade}
- **Estimated AI Cost:** $${performance.aiCostUSD.toFixed(2)}

### Time Breakdown
- Parsing: ${(performance.breakdown.parsing / 1000).toFixed(1)}s
- Metadata: ${(performance.breakdown.metadata / 1000).toFixed(1)}s
- Requirements: ${(performance.breakdown.requirements / 1000).toFixed(1)}s
- Compliance: ${(performance.breakdown.compliance / 1000).toFixed(1)}s
- Scoring: ${(performance.breakdown.scoring / 1000).toFixed(1)}s

${result.warnings.length > 0 ? `
---

## Warnings
${result.warnings.map((w) => `- WARNING: ${w}`).join('\n')}
` : ''}

${result.errors.length > 0 ? `
---

## Errors
${result.errors.map((e) => `- ERROR: ${e}`).join('\n')}
` : ''}

---

*Report generated by Aliff AI SDL Triage System*
`;

  return report;
}

/**
 * Generate batch summary report
 */
export function generateBatchReport(batch: BatchTriageResult): string {
  const report = `# SDL Batch Triage Report

**Total Documents:** ${batch.summary.total}
**Successful:** ${batch.summary.successful} | **Partial:** ${batch.summary.partial} | **Failed:** ${batch.summary.failed}
**Processing Time:** ${(batch.summary.totalTimeMs / 1000).toFixed(1)}s
**Total Cost:** $${batch.summary.totalCostUSD.toFixed(2)}

**Average Viability:** ${batch.summary.averageViability}/100
**High Priority Opportunities:** ${batch.summary.highPriorityCount}

---

## Ranked Opportunities

| Rank | Title | Agency | Viability | pWin | Complexity | Recommendation |
|------|-------|--------|-----------|------|------------|----------------|
${batch.ranked
  .map(
    (r, i) =>
      `| ${i + 1} | ${r.summary.title.substring(0, 40)}${r.summary.title.length > 40 ? '...' : ''} | ${r.summary.agency.substring(0, 20)} | ${r.summary.viability}/100 | ${r.summary.winProbability}% | ${r.summary.complexity}/100 | ${r.summary.recommendation.toUpperCase()} |`
  )
  .join('\n')}

---

## High Priority Opportunities (Pursue)

${batch.ranked
  .filter((r) => r.summary.recommendation === 'pursue')
  .map(
    (r, i) => `
### ${i + 1}. ${r.summary.title}

- **Agency:** ${r.summary.agency}
- **Solicitation:** ${r.summary.solicitationNumber || 'N/A'}
- **Value:** ${r.summary.estimatedValue ? `$${r.summary.estimatedValue.toLocaleString()}` : 'N/A'}
- **Deadline:** ${r.summary.responseDeadline?.toLocaleDateString() || 'N/A'}
- **Viability:** ${r.summary.viability}/100
- **pWin:** ${r.summary.winProbability}%
- **Expected Value:** $${r.summary.stats.expectedValue.toLocaleString()}

**Rationale:** ${r.summary.rationale}
`
  )
  .join('\n')}

${batch.ranked.filter((r) => r.summary.recommendation === 'pursue').length === 0 ? '_No high priority opportunities found_' : ''}

---

*Batch report generated by Aliff AI SDL Triage System*
`;

  return report;
}

/**
 * Generate JSON report
 */
export function generateJSONReport(result: TriageResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Generate concise summary (for dashboards)
 */
export function generateConciseSummary(result: TriageResult): string {
  const { summary } = result;

  return `
📋 ${summary.title}
🏛️  ${summary.agency}
💰 ${summary.estimatedValue ? `$${(summary.estimatedValue / 1000000).toFixed(1)}M` : 'N/A'}
📅 ${summary.responseDeadline?.toLocaleDateString() || 'N/A'}

📊 VIABILITY: ${summary.viability}/100 ${getViabilityEmoji(summary.viability)}
🎯 pWIN: ${summary.winProbability}% ${getWinProbEmoji(summary.winProbability)}
⚙️  COMPLEXITY: ${summary.complexity}/100 ${getComplexityEmoji(summary.complexity)}
✅ COMPLIANCE: ${summary.complianceRate}%

🎬 DECISION: ${summary.recommendation.toUpperCase()} ${getRecommendationEmoji(summary.recommendation)}

${summary.criticalGaps.length > 0 ? `⚠️  ${summary.criticalGaps.length} critical gap(s)` : ''}
  `.trim();
}

/**
 * Helper: Get viability status
 */
function getViabilityStatus(score: number): string {
  if (score >= 80) return '🟢 Excellent';
  if (score >= 60) return '🟡 Good';
  if (score >= 40) return '🟠 Fair';
  return '🔴 Poor';
}

/**
 * Helper: Get win probability status
 */
function getWinProbStatus(score: number): string {
  if (score >= 70) return '🟢 High';
  if (score >= 40) return '🟡 Medium';
  if (score >= 20) return '🟠 Low';
  return '🔴 Very Low';
}

/**
 * Helper: Get complexity status
 */
function getComplexityStatus(score: number): string {
  if (score >= 76) return '🔴 Very High';
  if (score >= 51) return '🟠 High';
  if (score >= 26) return '🟡 Medium';
  return '🟢 Low';
}

/**
 * Helper: Get compliance status
 */
function getComplianceStatus(score: number): string {
  if (score >= 85) return '🟢 Excellent';
  if (score >= 70) return '🟡 Good';
  if (score >= 50) return '🟠 Fair';
  return '🔴 Poor';
}

/**
 * Helper: Get viability emoji
 */
function getViabilityEmoji(score: number): string {
  if (score >= 80) return '🟢';
  if (score >= 60) return '🟡';
  if (score >= 40) return '🟠';
  return '🔴';
}

/**
 * Helper: Get win probability emoji
 */
function getWinProbEmoji(score: number): string {
  if (score >= 70) return '🎯';
  if (score >= 40) return '⚠️';
  return '❌';
}

/**
 * Helper: Get complexity emoji
 */
function getComplexityEmoji(score: number): string {
  if (score >= 76) return '🔴';
  if (score >= 51) return '🟠';
  if (score >= 26) return '🟡';
  return '🟢';
}

/**
 * Helper: Get recommendation emoji
 */
function getRecommendationEmoji(recommendation: string): string {
  if (recommendation === 'pursue') return '✅';
  if (recommendation === 'monitor') return '👀';
  return '❌';
}
