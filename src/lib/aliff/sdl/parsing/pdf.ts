/**
 * Aliff AI - PDF Document Parser
 *
 * Parses PDF documents and extracts text, metadata, and structure.
 */

import pdf from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import type {
  IDocumentParser,
  ParsedDocument,
  ParseResult,
  ParseOptions,
  DocumentMetadata,
  DocumentStructure,
  DocumentSection,
  DocumentHeading,
  ParseError,
} from './types';

/**
 * PDF Document Parser
 */
export class PDFParser implements IDocumentParser {
  /**
   * Parse PDF from buffer
   */
  async parse(
    buffer: Buffer,
    filename: string,
    options?: ParseOptions
  ): Promise<ParseResult> {
    const startTime = Date.now();

    try {
      // Parse PDF
      const data = await pdf(buffer, {
        max: options?.maxPages,
        password: options?.password,
      });

      // Extract metadata
      const metadata: DocumentMetadata = {
        title: data.info?.Title,
        author: data.info?.Author,
        subject: data.info?.Subject,
        keywords: data.info?.Keywords?.split(',').map((k: string) => k.trim()),
        creationDate: data.info?.CreationDate ? new Date(data.info.CreationDate) : undefined,
        modificationDate: data.info?.ModDate ? new Date(data.info.ModDate) : undefined,
        pageCount: data.numpages,
        wordCount: data.text.split(/\s+/).length,
        charCount: data.text.length,
        fileSize: buffer.length,
      };

      // Extract content
      let content = data.text;

      // Clean text if requested
      if (options?.cleanText !== false) {
        content = this.cleanText(content);
      }

      // Extract structure if requested
      const structure: DocumentStructure = {
        sections: [],
        headings: [],
      };

      if (options?.extractStructure !== false) {
        structure.headings = this.extractHeadings(content);
        structure.sections = this.extractSections(content, structure.headings);
      }

      // Build parsed document
      const parsedDocument: ParsedDocument = {
        id: uuidv4(),
        filename,
        type: 'pdf',
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
      console.error('[PDFParser] Error parsing PDF:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Parse PDF from file path
   */
  async parseFile(filePath: string, options?: ParseOptions): Promise<ParseResult> {
    try {
      const buffer = await fs.readFile(filePath);
      const filename = filePath.split('/').pop() || 'unknown.pdf';
      return this.parse(buffer, filename, options);
    } catch (error) {
      console.error('[PDFParser] Error reading file:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read file',
      };
    }
  }

  /**
   * Check if parser supports this file type
   */
  supports(filename: string): boolean {
    return filename.toLowerCase().endsWith('.pdf');
  }

  /**
   * Clean text (remove extra whitespace, normalize)
   */
  private cleanText(text: string): string {
    return (
      text
        // Remove multiple spaces
        .replace(/  +/g, ' ')
        // Remove multiple newlines (keep max 2)
        .replace(/\n\n\n+/g, '\n\n')
        // Remove spaces before punctuation
        .replace(/ ([.,!?;:])/g, '$1')
        // Normalize quotes
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        // Trim lines
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        // Trim overall
        .trim()
    );
  }

  /**
   * Extract headings from text (heuristic-based)
   */
  private extractHeadings(text: string): DocumentHeading[] {
    const headings: DocumentHeading[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) continue;

      // Check if line looks like a heading
      const isHeading = this.isHeading(line, lines[i + 1]);

      if (isHeading) {
        const level = this.getHeadingLevel(line);

        headings.push({
          level,
          text: line,
          index: i,
        });
      }
    }

    return headings;
  }

  /**
   * Check if line is a heading (heuristic)
   */
  private isHeading(line: string, nextLine?: string): boolean {
    // All caps (likely heading)
    if (line.length < 100 && line === line.toUpperCase() && /[A-Z]/.test(line)) {
      return true;
    }

    // Numbered heading (1.0, 1.1, etc.)
    if (/^\d+(\.\d+)*\.?\s+[A-Z]/.test(line)) {
      return true;
    }

    // Short line followed by content (common heading pattern)
    if (line.length < 80 && nextLine && nextLine.length > line.length) {
      // Check if starts with capital
      if (/^[A-Z]/.test(line) && !line.endsWith('.')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Determine heading level
   */
  private getHeadingLevel(line: string): number {
    // Check for numbered headings (1.0 = level 1, 1.1 = level 2, etc.)
    const numberMatch = line.match(/^(\d+(?:\.\d+)*)/);
    if (numberMatch) {
      const parts = numberMatch[1].split('.');
      return Math.min(parts.length, 6);
    }

    // All caps = level 1
    if (line === line.toUpperCase()) {
      return 1;
    }

    // Default = level 2
    return 2;
  }

  /**
   * Extract sections based on headings
   */
  private extractSections(
    text: string,
    headings: DocumentHeading[]
  ): DocumentSection[] {
    const sections: DocumentSection[] = [];
    const lines = text.split('\n');

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const nextHeading = headings[i + 1];

      // Determine section boundaries
      const startIndex = heading.index;
      const endIndex = nextHeading ? nextHeading.index : lines.length;

      // Extract section content (excluding heading line)
      const sectionLines = lines.slice(startIndex + 1, endIndex);
      const content = sectionLines.join('\n').trim();

      if (content) {
        const section: DocumentSection = {
          id: uuidv4(),
          level: heading.level,
          title: heading.text,
          content,
          startIndex,
          endIndex,
        };

        sections.push(section);
      }
    }

    return sections;
  }
}

/**
 * Export PDF parser instance
 */
export const pdfParser = new PDFParser();
