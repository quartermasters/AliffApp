/**
 * Aliff AI - DOCX Document Parser
 *
 * Parses Microsoft Word (.docx) documents and extracts text and structure.
 */

import mammoth from 'mammoth';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import * as cheerio from 'cheerio';
import type {
  IDocumentParser,
  ParsedDocument,
  ParseResult,
  ParseOptions,
  DocumentMetadata,
  DocumentStructure,
  DocumentHeading,
  DocumentSection,
} from './types';

/**
 * DOCX Document Parser
 */
export class DOCXParser implements IDocumentParser {
  /**
   * Parse DOCX from buffer
   */
  async parse(
    buffer: Buffer,
    filename: string,
    options?: ParseOptions
  ): Promise<ParseResult> {
    const startTime = Date.now();

    try {
      // Convert DOCX to HTML (preserves structure)
      const result = await mammoth.convertToHtml({ buffer });

      // Parse HTML to extract structure
      const $ = cheerio.load(result.value);

      // Extract plain text
      const plainText = await mammoth.extractRawText({ buffer });
      let content = plainText.value;

      // Clean text if requested
      if (options?.cleanText !== false) {
        content = this.cleanText(content);
      }

      // Extract metadata
      const metadata: DocumentMetadata = {
        title: this.extractTitle($),
        wordCount: content.split(/\s+/).length,
        charCount: content.length,
        fileSize: buffer.length,
      };

      // Extract structure
      const structure: DocumentStructure = {
        sections: [],
        headings: [],
      };

      if (options?.extractStructure !== false) {
        structure.headings = this.extractHeadings($);
        structure.sections = this.extractSections($, structure.headings);
      }

      // Build parsed document
      const parsedDocument: ParsedDocument = {
        id: uuidv4(),
        filename,
        type: 'docx',
        content,
        metadata,
        structure,
        parseTimeMs: Date.now() - startTime,
        timestamp: new Date(),
      };

      // Add warnings if any
      const warnings =
        result.messages.length > 0
          ? result.messages.map((m) => m.message)
          : undefined;

      return {
        success: true,
        document: parsedDocument,
        warnings,
      };
    } catch (error) {
      console.error('[DOCXParser] Error parsing DOCX:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Parse DOCX from file path
   */
  async parseFile(
    filePath: string,
    options?: ParseOptions
  ): Promise<ParseResult> {
    try {
      const buffer = await fs.readFile(filePath);
      const filename = filePath.split('/').pop() || 'unknown.docx';
      return this.parse(buffer, filename, options);
    } catch (error) {
      console.error('[DOCXParser] Error reading file:', error);

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
    return filename.toLowerCase().endsWith('.docx');
  }

  /**
   * Clean text
   */
  private cleanText(text: string): string {
    return text
      .replace(/  +/g, ' ')
      .replace(/\n\n\n+/g, '\n\n')
      .replace(/ ([.,!?;:])/g, '$1')
      .trim();
  }

  /**
   * Extract title from HTML
   */
  private extractTitle($: cheerio.CheerioAPI): string | undefined {
    // Try to find title in first h1
    const h1 = $('h1').first().text().trim();
    if (h1) return h1;

    // Try first paragraph if bold
    const firstP = $('p strong').first().text().trim();
    if (firstP && firstP.length < 200) return firstP;

    return undefined;
  }

  /**
   * Extract headings from HTML
   */
  private extractHeadings($: cheerio.CheerioAPI): DocumentHeading[] {
    const headings: DocumentHeading[] = [];

    // Extract h1-h6 headings
    $('h1, h2, h3, h4, h5, h6').each((index, element) => {
      const $el = $(element);
      const tagName = element.tagName.toLowerCase();
      const level = parseInt(tagName.substring(1), 10);
      const text = $el.text().trim();

      if (text) {
        headings.push({
          level,
          text,
          index,
        });
      }
    });

    return headings;
  }

  /**
   * Extract sections from HTML
   */
  private extractSections(
    $: cheerio.CheerioAPI,
    headings: DocumentHeading[]
  ): DocumentSection[] {
    const sections: DocumentSection[] = [];

    // Get all body content
    const bodyHtml = $('body').html() || '';
    const $ body = cheerio.load(bodyHtml);

    // Extract sections based on headings
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const nextHeading = headings[i + 1];

      // Find heading element
      const headingSelector = `h${heading.level}:contains("${heading.text}")`;
      const $heading = $body(headingSelector).first();

      if ($heading.length === 0) continue;

      // Extract content until next heading
      const content: string[] = [];
      let $current = $heading.next();

      while ($current.length > 0) {
        const tagName = $current.prop('tagName')?.toLowerCase();

        // Stop at next heading of same or higher level
        if (
          tagName &&
          tagName.match(/^h[1-6]$/) &&
          parseInt(tagName.substring(1), 10) <= heading.level
        ) {
          break;
        }

        // Add content
        const text = $current.text().trim();
        if (text) {
          content.push(text);
        }

        $current = $current.next();
      }

      if (content.length > 0) {
        sections.push({
          id: uuidv4(),
          level: heading.level,
          title: heading.text,
          content: content.join('\n\n'),
          startIndex: i,
          endIndex: nextHeading ? nextHeading.index : headings.length,
        });
      }
    }

    return sections;
  }
}

/**
 * Export DOCX parser instance
 */
export const docxParser = new DOCXParser();
