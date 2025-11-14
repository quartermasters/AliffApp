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

// Main SDL API (to be expanded)
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
} as const;

export default SDL;
