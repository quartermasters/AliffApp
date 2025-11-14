/**
 * Aliff AI - SDL Document Parsing Types
 *
 * Defines schemas for parsing solicitation documents (RFPs, RFIs, RFQs).
 */

/**
 * Supported document types
 */
export type DocumentType = 'pdf' | 'docx' | 'txt' | 'html' | 'unknown';

/**
 * Parsed document structure
 */
export interface ParsedDocument {
  id: string;
  filename: string;
  type: DocumentType;
  content: string;
  metadata: DocumentMetadata;
  structure: DocumentStructure;
  parseTimeMs: number;
  timestamp: Date;
}

/**
 * Document metadata (extracted during parsing)
 */
export interface DocumentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creationDate?: Date;
  modificationDate?: Date;
  pageCount?: number;
  wordCount?: number;
  charCount?: number;
  language?: string;
  fileSize?: number; // bytes
}

/**
 * Document structure (headings, sections, etc.)
 */
export interface DocumentStructure {
  sections: DocumentSection[];
  headings: DocumentHeading[];
  tables?: DocumentTable[];
  lists?: DocumentList[];
}

/**
 * Document section
 */
export interface DocumentSection {
  id: string;
  level: number; // 1 = top-level, 2 = subsection, etc.
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
  pageNumber?: number;
}

/**
 * Document heading
 */
export interface DocumentHeading {
  level: number; // 1-6 (H1-H6)
  text: string;
  index: number;
  sectionId?: string;
}

/**
 * Document table
 */
export interface DocumentTable {
  id: string;
  rows: string[][];
  caption?: string;
  pageNumber?: number;
}

/**
 * Document list
 */
export interface DocumentList {
  id: string;
  type: 'ordered' | 'unordered';
  items: string[];
  pageNumber?: number;
}

/**
 * Parse options
 */
export interface ParseOptions {
  extractStructure?: boolean; // Extract headings, sections (default: true)
  extractTables?: boolean; // Extract tables (default: false, slow)
  extractLists?: boolean; // Extract lists (default: false)
  cleanText?: boolean; // Clean whitespace, normalize (default: true)
  maxPages?: number; // Max pages to parse (default: unlimited)
  password?: string; // For password-protected PDFs
}

/**
 * Parse result
 */
export interface ParseResult {
  success: boolean;
  document?: ParsedDocument;
  error?: string;
  warnings?: string[];
}

/**
 * Document parser interface
 */
export interface IDocumentParser {
  /**
   * Parse document from buffer
   */
  parse(buffer: Buffer, filename: string, options?: ParseOptions): Promise<ParseResult>;

  /**
   * Parse document from file path
   */
  parseFile(filePath: string, options?: ParseOptions): Promise<ParseResult>;

  /**
   * Check if parser supports this file type
   */
  supports(filename: string): boolean;
}

/**
 * Parse error
 */
export class ParseError extends Error {
  constructor(
    message: string,
    public filename?: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'ParseError';
  }
}
