/**
 * Aliff AI - Main Document Parser
 *
 * Coordinates multiple parsers and provides unified document parsing interface.
 */

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import type {
  IDocumentParser,
  ParsedDocument,
  ParseResult,
  ParseOptions,
  DocumentType,
  DocumentMetadata,
  DocumentStructure,
} from './types';
import { pdfParser } from './pdf';
import { docxParser } from './docx';

/**
 * Document parser registry
 */
const parsers: IDocumentParser[] = [pdfParser, docxParser];

/**
 * Get document type from filename
 */
export function getDocumentType(filename: string): DocumentType {
  const lower = filename.toLowerCase();

  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx')) return 'docx';
  if (lower.endsWith('.txt')) return 'txt';
  if (lower.endsWith('.html') || lower.endsWith('.htm')) return 'html';

  return 'unknown';
}

/**
 * Get appropriate parser for file
 */
function getParser(filename: string): IDocumentParser | null {
  for (const parser of parsers) {
    if (parser.supports(filename)) {
      return parser;
    }
  }
  return null;
}

/**
 * Parse document from buffer
 */
export async function parseDocument(
  buffer: Buffer,
  filename: string,
  options?: ParseOptions
): Promise<ParseResult> {
  const parser = getParser(filename);

  if (!parser) {
    const docType = getDocumentType(filename);

    // Handle TXT files directly
    if (docType === 'txt') {
      return parseTxtDocument(buffer, filename, options);
    }

    return {
      success: false,
      error: `Unsupported document type: ${docType}`,
    };
  }

  return parser.parse(buffer, filename, options);
}

/**
 * Parse document from file path
 */
export async function parseDocumentFile(
  filePath: string,
  options?: ParseOptions
): Promise<ParseResult> {
  const filename = filePath.split('/').pop() || 'unknown';
  const parser = getParser(filename);

  if (!parser) {
    const docType = getDocumentType(filename);

    // Handle TXT files directly
    if (docType === 'txt') {
      try {
        const buffer = await fs.readFile(filePath);
        return parseTxtDocument(buffer, filename, options);
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to read file',
        };
      }
    }

    return {
      success: false,
      error: `Unsupported document type: ${docType}`,
    };
  }

  return parser.parseFile(filePath, options);
}

/**
 * Parse TXT document
 */
function parseTxtDocument(
  buffer: Buffer,
  filename: string,
  options?: ParseOptions
): ParseResult {
  const startTime = Date.now();

  try {
    let content = buffer.toString('utf-8');

    // Clean text if requested
    if (options?.cleanText !== false) {
      content = content
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\r/g, '\n')
        .replace(/  +/g, ' ') // Remove multiple spaces
        .replace(/\n\n\n+/g, '\n\n') // Remove excessive newlines
        .trim();
    }

    const metadata: DocumentMetadata = {
      wordCount: content.split(/\s+/).length,
      charCount: content.length,
      fileSize: buffer.length,
    };

    // No structure extraction for plain text
    const structure: DocumentStructure = {
      sections: [],
      headings: [],
    };

    const parsedDocument: ParsedDocument = {
      id: uuidv4(),
      filename,
      type: 'txt',
      content,
      metadata,
      structure,
      parseTimeMs: Date.now() - startTime,
      timestamp: new Date(),
    };

    return {
      success: true,
      document: parsedDocument,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Parse multiple documents
 */
export async function parseDocuments(
  files: Array<{ buffer: Buffer; filename: string }>,
  options?: ParseOptions
): Promise<ParseResult[]> {
  return Promise.all(
    files.map((file) => parseDocument(file.buffer, file.filename, options))
  );
}

/**
 * Validate document before parsing
 */
export function validateDocument(filename: string, buffer: Buffer): {
  valid: boolean;
  error?: string;
} {
  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024;
  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(buffer.length / 1024 / 1024).toFixed(1)}MB (max 50MB)`,
    };
  }

  // Check document type
  const docType = getDocumentType(filename);
  if (docType === 'unknown') {
    return {
      valid: false,
      error: `Unsupported file type: ${filename}`,
    };
  }

  // Check if buffer is empty
  if (buffer.length === 0) {
    return {
      valid: false,
      error: 'File is empty',
    };
  }

  return { valid: true };
}

/**
 * Get document statistics
 */
export function getDocumentStats(document: ParsedDocument): {
  pages: number;
  words: number;
  characters: number;
  sections: number;
  headings: number;
  avgWordsPerPage: number;
  estimatedReadTimeMinutes: number;
} {
  const pages = document.metadata.pageCount || 1;
  const words = document.metadata.wordCount || 0;
  const characters = document.metadata.charCount || 0;
  const sections = document.structure.sections.length;
  const headings = document.structure.headings.length;

  return {
    pages,
    words,
    characters,
    sections,
    headings,
    avgWordsPerPage: Math.round(words / pages),
    estimatedReadTimeMinutes: Math.ceil(words / 200), // Average reading speed
  };
}

/**
 * Export main parser API
 */
export const DocumentParser = {
  parse: parseDocument,
  parseFile: parseDocumentFile,
  parseMultiple: parseDocuments,
  validate: validateDocument,
  getStats: getDocumentStats,
  getType: getDocumentType,
} as const;

export default DocumentParser;
