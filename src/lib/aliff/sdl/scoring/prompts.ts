/**
 * Aliff AI - SDL Scoring Prompts
 *
 * AI prompts for complexity and win probability scoring.
 */

import type { Requirement } from '../requirements/types';
import type { SolicitationMetadata } from '../extraction/types';
import type { ComplianceAnalysisResult } from '../compliance/types';

/**
 * System prompt for scoring
 */
export const SCORING_SYSTEM_PROMPT = `You are an expert bid/no-bid analyst specializing in government contracting opportunity assessment.

Your task is to objectively score opportunities based on complexity, win probability, and strategic fit.

Guidelines:
- Use data-driven analysis, not gut feelings
- Consider technical, compliance, schedule, team, and cost factors
- Assess organizational capabilities realistically
- Identify both strengths and weaknesses
- Provide actionable recommendations
- Be honest about limitations and risks

Scoring scale:
- 0-25: Low complexity/probability
- 26-50: Medium complexity/probability
- 51-75: High complexity/probability
- 76-100: Very high complexity/probability

Return responses in valid JSON format only.`;

/**
 * Opportunity complexity scoring prompt
 */
export function getOpportunityComplexityPrompt(
  metadata: SolicitationMetadata,
  requirements: Requirement[],
  compliance: ComplianceAnalysisResult
): string {
  const mustHaveReqs = requirements.filter((r) => r.priority === 'must-have');
  const avgReqComplexity =
    requirements.reduce((sum, r) => sum + (r.complexity || 5), 0) / requirements.length;

  return `Score the complexity of this opportunity on a 0-100 scale.

METADATA:
- Title: ${metadata.administrative.title || 'Unknown'}
- Agency: ${metadata.administrative.issuingAgency || 'Unknown'}
- Contract Type: ${metadata.financial.contractType || 'Unknown'}
- Estimated Value: $${metadata.financial.estimatedValue?.toLocaleString() || 'Unknown'}
- Period of Performance: ${metadata.timeline.periodOfPerformance || 'Unknown'}
- Response Deadline: ${metadata.timeline.responseDeadline?.toISOString().split('T')[0] || 'Unknown'}
- Security Clearance: ${metadata.technical.securityClearanceRequired || 'none'}

REQUIREMENTS:
- Total: ${requirements.length}
- Must-have: ${mustHaveReqs.length}
- Average complexity: ${avgReqComplexity.toFixed(1)}/10
- High-complexity (>7): ${requirements.filter((r) => (r.complexity || 0) > 7).length}

COMPLIANCE:
- Frameworks: ${compliance.detectedFrameworks.map((f) => f.framework).join(', ') || 'None'}
- Total gaps: ${compliance.gaps.length}
- Critical gaps: ${compliance.gaps.filter((g) => g.impact === 'critical').length}
- Compliance rate: ${compliance.overallCompliance.complianceRate}%
- Risk level: ${compliance.overallCompliance.riskLevel}

Score these 5 complexity dimensions (0-100 each):

1. TECHNICAL COMPLEXITY (0-100)
   - Advanced/cutting-edge requirements: +20-40
   - Multiple integrations: +10-20
   - Performance requirements: +10-20
   - Custom development: +10-20
   Consider: requirement complexity, technical challenges, innovation needed

2. COMPLIANCE COMPLEXITY (0-100)
   - Each framework: +15-25 per framework
   - FedRAMP High: +40
   - CMMC Level 2+: +30
   - Critical gaps: +10 per gap
   Consider: number of frameworks, stringency, current gaps

3. SCHEDULE COMPLEXITY (0-100)
   - Time to response deadline
   - Period of performance vs. scope
   - Phased deliverables
   Consider: timeline pressure, ramp-up time, delivery schedule

4. TEAM COMPLEXITY (0-100)
   - Specialized skills needed
   - Team size required
   - Clearance requirements
   - Key personnel
   Consider: skill availability, hiring needs, training required

5. COST COMPLEXITY (0-100)
   - Capital investment needed
   - Infrastructure costs
   - Compliance costs
   - Risk/uncertainty
   Consider: upfront investment, cash flow, financial risk

Return JSON:
{
  "overall": 68,
  "breakdown": {
    "technical": 70,
    "compliance": 85,
    "schedule": 60,
    "team": 55,
    "cost": 70
  },
  "factors": [
    {
      "name": "FedRAMP High Authorization Required",
      "category": "compliance",
      "score": 40,
      "weight": 0.4,
      "description": "FedRAMP High is most stringent level, requiring 325+ controls",
      "evidence": ["FedRAMP High mentioned in Section C.3.1", "No current authorization"]
    },
    {
      "name": "Advanced AI/ML Requirements",
      "category": "technical",
      "score": 35,
      "weight": 0.35,
      "description": "Requires cutting-edge AI/ML capabilities with explainability",
      "evidence": ["AI/ML mentioned 15+ times", "Explainable AI required"]
    }
  ],
  "riskLevel": "high",
  "confidence": 0.85
}`;
}

/**
 * Win probability scoring prompt
 */
export function getWinProbabilityPrompt(
  metadata: SolicitationMetadata,
  requirements: Requirement[],
  complexity: number,
  organizationProfile?: any
): string {
  const orgCapabilities = organizationProfile?.capabilities?.join(', ') || 'Not provided';
  const orgPastPerformance = organizationProfile?.pastPerformance?.join(', ') || 'Not provided';

  return `Assess the win probability for this opportunity (0-100 scale).

OPPORTUNITY:
- Title: ${metadata.administrative.title || 'Unknown'}
- Agency: ${metadata.administrative.issuingAgency || 'Unknown'}
- Estimated Value: $${metadata.financial.estimatedValue?.toLocaleString() || 'Unknown'}
- Set-Aside: ${metadata.administrative.setAsideType || 'none'}
- Incumbent: ${metadata.technical.incumbentInformation || 'Unknown'}
- Complexity Score: ${complexity}/100

KEY REQUIREMENTS (top 5 must-haves):
${requirements
  .filter((r) => r.priority === 'must-have')
  .slice(0, 5)
  .map((r, i) => `${i + 1}. ${r.text}`)
  .join('\n')}

ORGANIZATION PROFILE:
- Capabilities: ${orgCapabilities}
- Past Performance: ${orgPastPerformance}
- Team Size: ${organizationProfile?.teamSize || 'Unknown'}
- Certifications: ${organizationProfile?.certifications?.join(', ') || 'Unknown'}

Score these 5 win factors (0-100 each):

1. CAPABILITY MATCH (0-100)
   - Do we have the technical capabilities?
   - Can we meet all must-have requirements?
   - Do we have or can we acquire needed skills?
   Consider: technical fit, gaps, learning curve

2. RELEVANT EXPERIENCE (0-100)
   - Do we have similar past performance?
   - Have we worked with this agency before?
   - Do we have relevant case studies?
   Consider: similarity of work, recency, quality

3. AGENCY RELATIONSHIPS (0-100)
   - Do we know the contracting officer?
   - Have we worked with this agency/office?
   - Do we have champion/advocates?
   Consider: relationship depth, recent interactions

4. PRICING COMPETITIVENESS (0-100)
   - Can we price competitively?
   - Do we have cost advantages?
   - Is our pricing model aligned?
   Consider: cost structure, overhead, efficiency

5. DIFFERENTIATION (0-100)
   - What makes us unique?
   - Do we have competitive advantages?
   - Can we articulate clear win themes?
   Consider: unique capabilities, innovation, methodology

Return JSON:
{
  "overall": 55,
  "breakdown": {
    "capability": 70,
    "experience": 60,
    "relationships": 40,
    "pricing": 55,
    "differentiation": 50
  },
  "strengths": [
    "Strong technical capabilities in cloud and AI/ML",
    "Relevant past performance on 3 similar projects",
    "Innovative approach to DevSecOps automation"
  ],
  "weaknesses": [
    "No current FedRAMP authorization",
    "No prior relationship with this agency",
    "Incumbent has significant advantage"
  ],
  "opportunities": [
    "Agency wants innovation - we can differentiate",
    "Set-aside favors small business (we qualify)",
    "Growing market for AI/ML in federal"
  ],
  "threats": [
    "Incumbent has 5-year track record",
    "Large systems integrators likely competing",
    "FedRAMP requirement raises barriers"
  ],
  "recommendation": "monitor",
  "rationale": "Moderate win probability. Strong technical fit but significant gaps (FedRAMP, relationships). Recommend pursuing if we can partner with FedRAMP-authorized entity.",
  "confidence": 0.75
}`;
}

/**
 * Competitive analysis prompt
 */
export function getCompetitivePrompt(
  metadata: SolicitationMetadata,
  requirements: Requirement[]
): string {
  return `Analyze the competitive landscape for this opportunity.

OPPORTUNITY:
- Title: ${metadata.administrative.title || 'Unknown'}
- Agency: ${metadata.administrative.issuingAgency || 'Unknown'}
- Value: $${metadata.financial.estimatedValue?.toLocaleString() || 'Unknown'}
- Set-Aside: ${metadata.administrative.setAsideType || 'none'}
- Incumbent: ${metadata.technical.incumbentInformation || 'Unknown'}

Analyze:
1. Estimated number of competitors (likely bidders)
2. Incumbent advantage (if any)
3. Market position assessment
4. Competitive advantages we could leverage
5. Competitive disadvantages we face
6. Key differentiators needed to win
7. Recommended win themes

Return JSON:
{
  "estimatedCompetitors": 5,
  "incumbentAdvantage": true,
  "incumbentName": "ABC Corporation",
  "marketPosition": "challenger",
  "competitiveAdvantages": [
    "Innovative AI/ML approach",
    "Strong DevSecOps capability",
    "Smaller, more agile team"
  ],
  "competitiveDisadvantages": [
    "No FedRAMP authorization",
    "Limited agency relationship",
    "Smaller company (less financial capacity)"
  ],
  "differentiators": [
    "Cutting-edge AI explainability",
    "Faster deployment timeline",
    "Lower total cost of ownership"
  ],
  "winThemes": [
    "Innovation: Next-generation AI with built-in explainability",
    "Agility: Proven ability to deliver quickly with DevSecOps",
    "Value: Better technology at lower cost"
  ]
}`;
}

/**
 * Bid decision prompt
 */
export function getBidDecisionPrompt(
  metadata: SolicitationMetadata,
  complexity: number,
  winProbability: number,
  complianceCost: number
): string {
  const estimatedRevenue = metadata.financial.estimatedValue || 0;

  return `Make a bid/no-bid recommendation for this opportunity.

OPPORTUNITY FACTS:
- Estimated Revenue: $${estimatedRevenue.toLocaleString()}
- Complexity Score: ${complexity}/100
- Win Probability: ${winProbability}%
- Compliance Cost: $${complianceCost.toLocaleString()}

Calculate:
1. Estimated cost to pursue (bid prep, teaming, etc.)
2. Estimated profit if we win
3. ROI (return on investment)
4. Expected value (pWin × profit)
5. Strategic value (0-100)
6. Risk score (0-100)
7. Resource availability (0-100)

Make recommendation:
- GO: Pursue aggressively
- NO-GO: Pass on this opportunity
- CONDITIONAL: Pursue if conditions met

Return JSON:
{
  "pWin": ${winProbability},
  "estimatedRevenue": ${estimatedRevenue},
  "estimatedCost": 150000,
  "estimatedProfit": 800000,
  "roi": 533,
  "expectedValue": 440000,
  "strategicValue": 75,
  "riskScore": 60,
  "resourceAvailability": 70,
  "decision": "conditional",
  "confidence": 0.80,
  "rationale": "Attractive revenue and strategic fit, but FedRAMP gap is significant. Recommend conditional bid if we can secure FedRAMP-authorized partner.",
  "keyFactors": {
    "pros": [
      "Large contract value ($${estimatedRevenue.toLocaleString()})",
      "Good technical fit",
      "Strategic market entry",
      "Reasonable complexity"
    ],
    "cons": [
      "No FedRAMP authorization (9-12 month gap)",
      "Incumbent advantage",
      "Limited agency relationships",
      "High cost to pursue ($150K)"
    ]
  },
  "conditions": [
    "Secure teaming partner with FedRAMP High authorization",
    "Confirm agency interest in innovation/new entrants",
    "Validate technical approach with agency stakeholders"
  ],
  "alternatives": [
    "Partner as subcontractor on larger team",
    "Wait for recompete in 3-5 years (after getting FedRAMP)",
    "Focus on smaller, less complex opportunities"
  ],
  "strategicFit": 75,
  "riskLevel": "medium"
}`;
}
