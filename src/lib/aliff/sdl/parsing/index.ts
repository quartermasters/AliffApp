/**
 * Aliff AI - SDL Document Parsing Module
 *
 * Main export for document parsing (PDF, DOCX, TXT).
 */

// Export types
export * from './types';

// Export parsers
export * from './pdf';
export * from './docx';

// Export main parser
export * from './parser';
export { DocumentParser } from './parser';

export default DocumentParser;
