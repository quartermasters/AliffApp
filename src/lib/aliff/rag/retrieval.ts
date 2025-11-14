/**
 * Aliff AI - Knowledge Retrieval
 *
 * Implements semantic search with role-based access control.
 * This is the core of the RAG system that powers all 5 Aliff roles.
 */

import type {
  AliffRole,
  KnowledgeDocument,
  RetrievalOptions,
  RetrievalResult,
  SensitivityLevel,
} from '../types';
import { ROLE_ACCESS_MATRIX, AccessDeniedError, RetrievalError, canAccessSensitivity } from '../types';
import { getPineconeIndex } from './storage';
import { embedText } from './embeddings';
import { AuditLogger } from '../security/audit';

/**
 * Retrieve knowledge documents based on semantic similarity to a query
 * with role-based access control
 *
 * @param query - The search query
 * @param options - Retrieval options including role and filters
 * @returns Retrieval result with documents and metadata
 */
export async function retrieveKnowledge(
  query: string,
  options: RetrievalOptions
): Promise<RetrievalResult> {
  const startTime = Date.now();
  let embeddingTime = 0;
  let filteringTime = 0;

  try {
    // Validate input
    if (!query || query.trim().length === 0) {
      throw new RetrievalError('Query cannot be empty');
    }

    if (!options.role) {
      throw new RetrievalError('Role must be specified for retrieval');
    }

    // Set defaults
    const topK = options.topK || 5;
    const similarityThreshold = options.similarityThreshold || 0.7;

    // Log query event
    await AuditLogger.logQuery(
      query,
      options.role,
      options.userId,
      options.sessionId,
      {
        categories: options.categories,
        tags: options.tags,
        maxSensitivity: options.maxSensitivity,
      }
    );

    // Generate query embedding
    const embeddingStart = Date.now();
    const queryEmbedding = await embedText(query);
    embeddingTime = Date.now() - embeddingStart;

    // Build metadata filter based on role and options
    const filteringStart = Date.now();
    const filter = buildMetadataFilter(options);
    filteringTime = Date.now() - filteringStart;

    // Query Pinecone
    const index = getPineconeIndex();
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter,
    });

    // Convert Pinecone results to KnowledgeDocuments
    const documents: KnowledgeDocument[] = [];

    for (const match of queryResponse.matches) {
      // Check similarity threshold
      if (match.score && match.score < similarityThreshold) {
        continue;
      }

      // Check if role can access this sensitivity level
      const sensitivity = match.metadata?.sensitivity as SensitivityLevel;
      if (sensitivity && !canAccessSensitivity(options.role, sensitivity)) {
        // Log access denial for audit
        await AuditLogger.logAccessDenied(
          'retrieve_document',
          options.role,
          `Role ${options.role} cannot access ${sensitivity} sensitivity documents`,
          options.userId,
          options.sessionId,
          {
            documentId: match.id,
            requiredSensitivity: sensitivity,
          }
        );
        continue;
      }

      // Parse metadata
      const metadata = parsePineconeMetadata(match.metadata);

      documents.push({
        id: match.id,
        content: (match.metadata?.content as string) || '',
        metadata,
        score: match.score,
      });
    }

    const totalTime = Date.now() - startTime;

    // Log successful retrieval
    const sensitivityLevels = Array.from(
      new Set(documents.map((d) => d.metadata.sensitivity))
    );
    const categories = Array.from(
      new Set(documents.map((d) => d.metadata.category))
    );
    const topScore = documents.length > 0 ? (documents[0].score || 0) : 0;
    const avgScore =
      documents.length > 0
        ? documents.reduce((sum, d) => sum + (d.score || 0), 0) / documents.length
        : 0;

    await AuditLogger.logRetrieval(
      query,
      options.role,
      documents.map((d) => d.id),
      topScore,
      avgScore,
      sensitivityLevels,
      categories,
      totalTime,
      embeddingTime,
      options.userId,
      options.sessionId
    );

    return {
      documents,
      total: documents.length,
      query: {
        text: query,
        role: options.role,
        timestamp: new Date(),
      },
      metrics: {
        retrievalTimeMs: totalTime,
        embeddingTimeMs: embeddingTime,
        filteringTimeMs: filteringTime,
      },
    };
  } catch (error) {
    console.error('Error retrieving knowledge:', error);

    if (error instanceof AccessDeniedError || error instanceof RetrievalError) {
      throw error;
    }

    throw new RetrievalError(
      `Failed to retrieve knowledge: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Build metadata filter for Pinecone query based on options
 */
function buildMetadataFilter(options: RetrievalOptions): Record<string, any> {
  const filter: Record<string, any> = {};

  // Filter by allowed sensitivity levels for this role
  const allowedSensitivities = ROLE_ACCESS_MATRIX[options.role];
  if (options.maxSensitivity) {
    // Use provided max sensitivity if it's allowed for this role
    const maxIdx = allowedSensitivities.indexOf(options.maxSensitivity);
    if (maxIdx !== -1) {
      filter.sensitivity = { $in: allowedSensitivities.slice(0, maxIdx + 1) };
    }
  } else {
    // Use all allowed sensitivities for this role
    filter.sensitivity = { $in: allowedSensitivities };
  }

  // Filter by role access - document must allow this role
  // Note: Pinecone doesn't support array contains, so we use workaround
  // by checking if the roles string contains the role
  // This is a limitation we'll need to handle in application logic

  // Filter by categories if specified
  if (options.categories && options.categories.length > 0) {
    filter.category = { $in: options.categories };
  }

  // Filter by client ID if specified
  if (options.clientId) {
    filter.clientId = options.clientId;
  }

  // Filter by project ID if specified
  if (options.projectId) {
    filter.projectId = options.projectId;
  }

  // Filter by tags if specified (Pinecone limitation: simplified)
  // For full tag filtering, we'd need to post-filter results

  return filter;
}

/**
 * Parse Pinecone metadata back into KnowledgeMetadata format
 */
function parsePineconeMetadata(metadata: any): any {
  if (!metadata) {
    throw new Error('Missing metadata in Pinecone result');
  }

  return {
    roles: (metadata.roles as string).split(',') as AliffRole[],
    sensitivity: metadata.sensitivity as SensitivityLevel,
    category: metadata.category,
    tags: metadata.tags ? (metadata.tags as string).split(',') : [],
    source: metadata.source,
    created: new Date(metadata.created),
    updated: new Date(metadata.updated),
    version: metadata.version,
    ...(metadata.clientId && { clientId: metadata.clientId }),
    ...(metadata.projectId && { projectId: metadata.projectId }),
  };
}

/**
 * Post-filter documents by role access
 * Used as additional validation after Pinecone query
 */
function filterByRoleAccess(
  documents: KnowledgeDocument[],
  role: AliffRole
): KnowledgeDocument[] {
  return documents.filter((doc) => {
    // Check if document allows this role
    if (!doc.metadata.roles.includes(role) && !doc.metadata.roles.includes('CEO')) {
      return false;
    }

    // Check if role can access this sensitivity
    if (!canAccessSensitivity(role, doc.metadata.sensitivity)) {
      return false;
    }

    return true;
  });
}

/**
 * Post-filter documents by tags
 * Used when Pinecone metadata filtering isn't sufficient
 */
function filterByTags(
  documents: KnowledgeDocument[],
  tags: string[]
): KnowledgeDocument[] {
  if (!tags || tags.length === 0) {
    return documents;
  }

  return documents.filter((doc) => {
    // Document must have at least one matching tag
    return doc.metadata.tags.some((tag) => tags.includes(tag));
  });
}

/**
 * Retrieve knowledge with automatic role-based access control
 * Convenience function that applies post-filtering
 *
 * @param query - Search query
 * @param options - Retrieval options
 * @returns Filtered retrieval result
 */
export async function retrieveKnowledgeSecure(
  query: string,
  options: RetrievalOptions
): Promise<RetrievalResult> {
  // Get initial results
  const result = await retrieveKnowledge(query, options);

  // Apply role-based post-filtering
  let filteredDocs = filterByRoleAccess(result.documents, options.role);

  // Apply tag filtering if specified
  if (options.tags && options.tags.length > 0) {
    filteredDocs = filterByTags(filteredDocs, options.tags);
  }

  return {
    ...result,
    documents: filteredDocs,
    total: filteredDocs.length,
  };
}

/**
 * Retrieve similar documents to a given document ID
 *
 * @param documentId - ID of the document to find similar documents for
 * @param options - Retrieval options
 * @returns Similar documents
 */
export async function retrieveSimilar(
  documentId: string,
  options: Omit<RetrievalOptions, 'query'>
): Promise<RetrievalResult> {
  try {
    const index = getPineconeIndex();

    // Fetch the document
    const fetchResponse = await index.fetch([documentId]);
    const document = fetchResponse.records[documentId];

    if (!document || !document.values) {
      throw new RetrievalError(`Document ${documentId} not found or has no embedding`);
    }

    // Use document's embedding for similarity search
    const filter = buildMetadataFilter(options as RetrievalOptions);

    const queryResponse = await index.query({
      vector: document.values,
      topK: (options.topK || 5) + 1, // +1 to account for the document itself
      includeMetadata: true,
      filter,
    });

    // Convert results and filter out the original document
    const documents: KnowledgeDocument[] = [];

    for (const match of queryResponse.matches) {
      if (match.id === documentId) {
        continue; // Skip the original document
      }

      const metadata = parsePineconeMetadata(match.metadata);

      documents.push({
        id: match.id,
        content: (match.metadata?.content as string) || '',
        metadata,
        score: match.score,
      });
    }

    return {
      documents: documents.slice(0, options.topK || 5),
      total: documents.length,
      query: {
        text: `Similar to ${documentId}`,
        role: options.role,
        timestamp: new Date(),
      },
      metrics: {
        retrievalTimeMs: 0,
        embeddingTimeMs: 0,
        filteringTimeMs: 0,
      },
    };
  } catch (error) {
    console.error('Error retrieving similar documents:', error);
    throw new RetrievalError(
      `Failed to retrieve similar documents: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
