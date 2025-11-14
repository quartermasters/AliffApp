/**
 * Aliff AI - Vector Database Storage
 *
 * Handles storing and managing knowledge documents in Pinecone vector database.
 * Implements role-based access control through metadata filtering.
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';
import type {
  KnowledgeDocument,
  KnowledgeMetadata,
  VectorDBConfig,
} from '../types';
import { embedText } from './embeddings';

// Initialize Pinecone client
let pineconeClient: Pinecone | null = null;

/**
 * Initialize Pinecone connection
 */
export function initializePinecone(config?: Partial<VectorDBConfig>): Pinecone {
  if (pineconeClient) {
    return pineconeClient;
  }

  const apiKey = config?.apiKey || process.env.PINECONE_API_KEY;

  if (!apiKey) {
    throw new Error('PINECONE_API_KEY environment variable not set');
  }

  pineconeClient = new Pinecone({
    apiKey,
  });

  return pineconeClient;
}

/**
 * Get Pinecone index
 */
export function getPineconeIndex(indexName?: string) {
  const client = initializePinecone();
  const name = indexName || process.env.PINECONE_INDEX || 'aliff-knowledge';

  return client.index(name);
}

/**
 * Store a single knowledge document in the vector database
 *
 * @param document - The knowledge document to store
 * @param generateEmbedding - Whether to generate embedding if not provided
 * @returns The stored document with ID
 */
export async function storeDocument(
  document: Omit<KnowledgeDocument, 'id'> & { id?: string },
  generateEmbedding: boolean = true
): Promise<KnowledgeDocument> {
  try {
    const index = getPineconeIndex();

    // Generate ID if not provided
    const id = document.id || uuidv4();

    // Generate embedding if needed
    let embedding = document.embedding;
    if (!embedding && generateEmbedding) {
      embedding = await embedText(document.content);
    }

    if (!embedding) {
      throw new Error('No embedding provided and generation disabled');
    }

    // Prepare metadata for Pinecone
    // Pinecone metadata must be flat key-value pairs
    const pineconeMetadata = {
      // Flatten arrays to strings
      roles: document.metadata.roles.join(','),
      sensitivity: document.metadata.sensitivity,
      category: document.metadata.category,
      tags: document.metadata.tags.join(','),
      source: document.metadata.source,
      created: document.metadata.created.toISOString(),
      updated: document.metadata.updated.toISOString(),
      version: document.metadata.version,
      // Store content for retrieval
      content: document.content,
      // Optional fields
      ...(document.metadata.clientId && { clientId: document.metadata.clientId }),
      ...(document.metadata.projectId && { projectId: document.metadata.projectId }),
    };

    // Upsert to Pinecone
    await index.upsert([
      {
        id,
        values: embedding,
        metadata: pineconeMetadata,
      },
    ]);

    // Return the stored document
    return {
      ...document,
      id,
      embedding,
    } as KnowledgeDocument;
  } catch (error) {
    console.error('Error storing document:', error);
    throw new Error(
      `Failed to store document: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Store multiple knowledge documents in batch
 *
 * @param documents - Array of documents to store
 * @param generateEmbeddings - Whether to generate embeddings if not provided
 * @returns Array of stored documents with IDs
 */
export async function storeBatch(
  documents: Array<Omit<KnowledgeDocument, 'id'> & { id?: string }>,
  generateEmbeddings: boolean = true
): Promise<KnowledgeDocument[]> {
  try {
    const index = getPineconeIndex();

    // Process documents
    const processedDocs: KnowledgeDocument[] = [];
    const vectors: Array<{
      id: string;
      values: number[];
      metadata: Record<string, any>;
    }> = [];

    for (const doc of documents) {
      const id = doc.id || uuidv4();

      // Generate embedding if needed
      let embedding = doc.embedding;
      if (!embedding && generateEmbeddings) {
        embedding = await embedText(doc.content);
      }

      if (!embedding) {
        throw new Error(`Document ${id} has no embedding`);
      }

      // Prepare metadata
      const pineconeMetadata = {
        roles: doc.metadata.roles.join(','),
        sensitivity: doc.metadata.sensitivity,
        category: doc.metadata.category,
        tags: doc.metadata.tags.join(','),
        source: doc.metadata.source,
        created: doc.metadata.created.toISOString(),
        updated: doc.metadata.updated.toISOString(),
        version: doc.metadata.version,
        content: doc.content,
        ...(doc.metadata.clientId && { clientId: doc.metadata.clientId }),
        ...(doc.metadata.projectId && { projectId: doc.metadata.projectId }),
      };

      vectors.push({
        id,
        values: embedding,
        metadata: pineconeMetadata,
      });

      processedDocs.push({
        ...doc,
        id,
        embedding,
      } as KnowledgeDocument);
    }

    // Batch upsert to Pinecone (max 100 at a time)
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
    }

    return processedDocs;
  } catch (error) {
    console.error('Error storing batch:', error);
    throw new Error(
      `Failed to store batch: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Delete a document by ID
 *
 * @param id - Document ID to delete
 */
export async function deleteDocument(id: string): Promise<void> {
  try {
    const index = getPineconeIndex();
    await index.deleteOne(id);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error(
      `Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Delete multiple documents by ID
 *
 * @param ids - Array of document IDs to delete
 */
export async function deleteBatch(ids: string[]): Promise<void> {
  try {
    const index = getPineconeIndex();
    await index.deleteMany(ids);
  } catch (error) {
    console.error('Error deleting batch:', error);
    throw new Error(
      `Failed to delete batch: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Update a document's metadata or content
 *
 * @param id - Document ID to update
 * @param updates - Partial document updates
 */
export async function updateDocument(
  id: string,
  updates: {
    content?: string;
    metadata?: Partial<KnowledgeMetadata>;
  }
): Promise<void> {
  try {
    const index = getPineconeIndex();

    // Fetch existing document
    const fetchResponse = await index.fetch([id]);
    const existing = fetchResponse.records[id];

    if (!existing) {
      throw new Error(`Document ${id} not found`);
    }

    // Merge updates
    let embedding = existing.values;
    let content = existing.metadata?.content as string;

    if (updates.content) {
      content = updates.content;
      // Regenerate embedding for new content
      embedding = await embedText(content);
    }

    // Merge metadata
    const metadata = {
      ...existing.metadata,
      content,
      updated: new Date().toISOString(),
    };

    if (updates.metadata) {
      // Merge metadata updates
      Object.assign(metadata, {
        ...(updates.metadata.roles && { roles: updates.metadata.roles.join(',') }),
        ...(updates.metadata.sensitivity && { sensitivity: updates.metadata.sensitivity }),
        ...(updates.metadata.category && { category: updates.metadata.category }),
        ...(updates.metadata.tags && { tags: updates.metadata.tags.join(',') }),
        ...(updates.metadata.source && { source: updates.metadata.source }),
        ...(updates.metadata.version && { version: updates.metadata.version }),
        ...(updates.metadata.clientId && { clientId: updates.metadata.clientId }),
        ...(updates.metadata.projectId && { projectId: updates.metadata.projectId }),
      });
    }

    // Upsert updated document
    await index.upsert([
      {
        id,
        values: embedding,
        metadata,
      },
    ]);
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error(
      `Failed to update document: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get index statistics
 *
 * @returns Index statistics including vector count
 */
export async function getIndexStats() {
  try {
    const index = getPineconeIndex();
    return await index.describeIndexStats();
  } catch (error) {
    console.error('Error getting index stats:', error);
    throw new Error(
      `Failed to get index stats: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
