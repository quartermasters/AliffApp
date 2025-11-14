/**
 * Aliff AI - Solicitation Diagnosis Lab (SDL)
 *
 * Complete RFP/solicitation analysis system:
 * - Document parsing (PDF, DOCX, TXT)
 * - Metadata extraction (47 fields)
 * - Requirements extraction
 * - Compliance analysis
 * - Complexity scoring
 * - Win probability assessment
 * - Full triage orchestration
 */

// Export parsing module
export * from './parsing';
export { DocumentParser } from './parsing';

// Export extraction module
export * from './extraction';
export { extractMetadata } from './extraction';

// Export requirements module
export * from './requirements';
export { extractRequirements } from './requirements';

// Export compliance module
export * from './compliance';
export { analyzeCompliance } from './compliance';

// Export scoring module
export * from './scoring';
export { scoreOpportunity } from './scoring';

// Export triage module (main orchestrator)
export * from './triage';
export { runTriage, runBatchTriage } from './triage';

// Main SDL API
export const SDL = {
  // Document parsing
  parseDocument: require('./parsing').parseDocument,
  parseDocumentFile: require('./parsing').parseDocumentFile,
  validateDocument: require('./parsing').validateDocument,

  // Metadata extraction
  extractMetadata: require('./extraction').extractMetadata,
  extractMetadataQuick: require('./extraction').extractMetadataQuick,
  extractCategory: require('./extraction').extractCategory,

  // Requirements extraction
  extractRequirements: require('./requirements').extractRequirements,
  filterByPriority: require('./requirements').filterByPriority,
  filterByCategory: require('./requirements').filterByCategory,
  searchRequirements: require('./requirements').searchRequirements,

  // Compliance analysis
  analyzeCompliance: require('./compliance').analyzeCompliance,
  getHighPriorityGaps: require('./compliance').getHighPriorityGaps,
  getGapsByImpact: require('./compliance').getGapsByImpact,
  calculateRemediationCost: require('./compliance').calculateRemediationCost,

  // Scoring
  scoreOpportunity: require('./scoring').scoreOpportunity,
  getComplexityLevel: require('./scoring').getComplexityLevel,
  getScoringsSummary: require('./scoring').getScoringsSummary,

  // Full Triage (main entry point)
  runTriage: require('./triage').runTriage,
  runBatchTriage: require('./triage').runBatchTriage,
  generateExecutiveReport: require('./triage').generateExecutiveReport,
  generateBatchReport: require('./triage').generateBatchReport,
  generateConciseSummary: require('./triage').generateConciseSummary,
} as const;

export default SDL;
