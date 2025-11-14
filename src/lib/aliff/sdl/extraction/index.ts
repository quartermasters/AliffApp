/**
 * Aliff AI - SDL Metadata Extraction Module
 *
 * AI-powered extraction of 47 metadata fields from solicitation documents.
 */

// Export types
export * from './types';

// Export prompts
export * from './prompts';

// Export validation
export * from './validation';

// Export extractor
export * from './extractor';
export {
  extractMetadata,
  extractMetadataQuick,
  extractCategory,
} from './extractor';

/**
 * Main extraction API
 */
export { extractMetadata as default } from './extractor';
