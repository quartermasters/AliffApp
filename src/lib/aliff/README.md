# Aliff AI System

This directory contains the complete Aliff AI system - a five-role AI-powered business operating system.

## Architecture

```
src/lib/aliff/
├── rag/              # Retrieval-Augmented Generation system
│   ├── embeddings.ts # OpenAI embedding generation
│   ├── storage.ts    # Pinecone vector database
│   ├── retrieval.ts  # Semantic search with role-based access
│   └── index.ts      # Main RAG interface
├── security/         # Security and access control (coming soon)
├── training/         # Training data pipeline (coming soon)
└── types/            # TypeScript type definitions
    └── index.ts      # Core types for all roles
```

## The Five Roles

| Role | Function | Knowledge Access |
|------|----------|------------------|
| **SALES** | Lead qualification, chatbot | Limited (public, internal) |
| **OPS** | SDL, project management | Full operational (public, internal, proprietary) |
| **CLIENT** | Client communication | Most restricted (public only) |
| **TRAINER** | Onboarding, training | Training materials (public, internal) |
| **CEO** | Business intelligence | Full access (all levels including secret) |

## RAG System (Sprint 1 - Complete)

### Quick Start

```typescript
import RAG from '@/lib/aliff/rag';

// Retrieve knowledge as ALIFF-SALES
const result = await RAG.retrieve('How to qualify GOVCON leads?', {
  role: 'SALES',
  topK: 5,
});

console.log(result.documents);
```

### Store Knowledge

```typescript
import { storeDocument } from '@/lib/aliff/rag';

await storeDocument({
  content: 'Strategic diagnosis before writing is critical...',
  metadata: {
    roles: ['SALES', 'OPS', 'CEO'],
    sensitivity: 'proprietary',
    category: 'methodology',
    tags: ['diagnosis', 'SDL', 'strategy'],
    source: 'Planning/SDL_MULTI_AI_ORCHESTRATION.md',
    created: new Date(),
    updated: new Date(),
    version: '1.0',
  },
});
```

### Role-Based Access Control

The RAG system automatically filters knowledge based on role:

```typescript
// ALIFF-SALES can only access public & internal
const salesResult = await RAG.retrieve('pricing strategy', {
  role: 'SALES',
});
// Returns: Only public/internal documents

// ALIFF-CEO can access everything including secrets
const ceoResult = await RAG.retrieve('pricing strategy', {
  role: 'CEO',
});
// Returns: All documents including proprietary pricing formulas
```

### Access Matrix

| Sensitivity | SALES | OPS | CLIENT | TRAINER | CEO |
|-------------|-------|-----|--------|---------|-----|
| public      | ✅    | ✅  | ✅     | ✅      | ✅  |
| internal    | ✅    | ✅  | ❌     | ✅      | ✅  |
| proprietary | ❌    | ✅  | ❌     | ❌      | ✅  |
| secret      | ❌    | ❌  | ❌     | ❌      | ✅  |

## Setup

### 1. Install Dependencies

```bash
npm install @pinecone-database/pinecone uuid date-fns
```

### 2. Configure Environment

Add to `.env`:

```bash
# OpenAI (for embeddings)
OPENAI_API_KEY="sk-..."

# Pinecone (vector database)
PINECONE_API_KEY="your-api-key"
PINECONE_INDEX="aliff-knowledge"
```

### 3. Create Pinecone Index

1. Go to [Pinecone Console](https://app.pinecone.io/)
2. Create new index:
   - Name: `aliff-knowledge`
   - Dimensions: `1536`
   - Metric: `cosine`
   - Serverless (recommended)

### 4. Populate Knowledge Base

```typescript
import { storeBatch } from '@/lib/aliff/rag';

const documents = [
  {
    content: 'Service definition content...',
    metadata: {
      roles: ['SALES', 'CEO'],
      sensitivity: 'internal',
      category: 'service-definition',
      tags: ['govcon', 'proposal'],
      source: 'services.ts',
      created: new Date(),
      updated: new Date(),
      version: '1.0',
    },
  },
  // ... more documents
];

await storeBatch(documents);
```

## API Reference

### `RAG.retrieve(query, options)`

Retrieve knowledge with role-based access control.

**Parameters:**
- `query` (string): Search query
- `options` (RetrievalOptions):
  - `role` (AliffRole): Required - which role is querying
  - `topK` (number): Number of results (default: 5)
  - `similarityThreshold` (number): Min score 0-1 (default: 0.7)
  - `categories` (KnowledgeCategory[]): Filter by categories
  - `tags` (string[]): Filter by tags
  - `clientId` (string): Filter by client
  - `projectId` (string): Filter by project

**Returns:** `RetrievalResult`
- `documents` (KnowledgeDocument[]): Retrieved documents
- `total` (number): Total count
- `query` (object): Query metadata
- `metrics` (object): Performance metrics

**Example:**

```typescript
const result = await RAG.retrieve('SDL methodology', {
  role: 'OPS',
  topK: 10,
  categories: ['methodology'],
  tags: ['diagnosis'],
});
```

### `RAG.store(document)`

Store a single knowledge document.

**Parameters:**
- `document` (Partial<KnowledgeDocument>): Document to store

**Returns:** `KnowledgeDocument` with generated ID

**Example:**

```typescript
const stored = await RAG.store({
  content: 'Strategic diagnosis improves win rates...',
  metadata: {
    roles: ['SALES', 'OPS', 'CEO'],
    sensitivity: 'proprietary',
    category: 'strategic-discussion',
    tags: ['diagnosis', 'win-rate'],
    source: 'training-data.md',
    created: new Date(),
    updated: new Date(),
    version: '1.0',
  },
});

console.log('Stored with ID:', stored.id);
```

### `RAG.storeBatch(documents)`

Store multiple documents efficiently.

**Parameters:**
- `documents` (Array<Partial<KnowledgeDocument>>): Documents to store

**Returns:** `KnowledgeDocument[]` with generated IDs

### `RAG.embed(text)`

Generate embedding for text.

**Parameters:**
- `text` (string): Text to embed

**Returns:** `number[]` - Embedding vector (1536 dimensions)

## Knowledge Categories

- `strategic-discussion`: Strategic planning, decisions
- `diagnosis-case-study`: SDL case studies
- `client-interaction`: Client communications
- `business-decision`: Business rules, policies
- `pattern-recognition`: Reusable patterns
- `service-definition`: Service descriptions
- `methodology`: Process documentation
- `technical-documentation`: Technical guides

## Sensitivity Levels

- `public`: Can be shown externally (general best practices)
- `internal`: Internal use only, not client-facing
- `proprietary`: Our methods and strategies - NEVER reveal externally
- `secret`: Competitive moat knowledge - CEO access only

## Performance

- **Embedding**: ~200-500ms per document
- **Retrieval**: ~100-200ms per query
- **Storage**: ~50-100ms per document
- **Batch operations**: Much faster for multiple documents

## Cost Estimation

**OpenAI Embeddings:**
- Model: `text-embedding-3-small`
- Cost: $0.00002 per 1k tokens (~$0.02 per 1M tokens)
- Average document: ~500 tokens = $0.00001

**Pinecone:**
- Serverless: Pay per query
- ~$0.40 per 1M query units
- Very cost-effective for this use case

**Estimated Monthly Cost:**
- 1,000 documents stored: ~$0.01
- 10,000 queries/month: ~$4.00
- **Total**: ~$5-10/month

## Security

### Role-Based Access

All queries are filtered by role automatically:

```typescript
// This will only return documents that:
// 1. Include 'SALES' in metadata.roles
// 2. Have sensitivity <= 'internal'
const result = await RAG.retrieve(query, { role: 'SALES' });
```

### Client Data Isolation

Client-specific data is isolated:

```typescript
// Agency A can only see their own data
const result = await RAG.retrieve(query, {
  role: 'CLIENT',
  clientId: 'agency-a-uuid',
});
```

### Audit Logging

All access attempts are logged (to be implemented in Sprint 2).

## Next Steps

### Sprint 2: Security & Filtering
- Output filtering engine
- Audit logging system
- Strategy leak detection

### Sprint 3: Training Pipeline
- Automated data collection
- Document processing
- Continuous learning loop

## Examples

### Example 1: ALIFF-SALES Retrieving Service Info

```typescript
import RAG from '@/lib/aliff/rag';

// Sales rep needs info about proposal development service
const result = await RAG.retrieve('proposal development service details', {
  role: 'SALES',
  categories: ['service-definition'],
  topK: 3,
});

// Returns: Service definitions for proposal development
// Does NOT return: Proprietary pricing formulas or CEO-only insights
```

### Example 2: ALIFF-OPS Accessing SDL Methodology

```typescript
// Operations team needs SDL diagnosis methodology
const result = await RAG.retrieve('how to diagnose hidden evaluation priorities', {
  role: 'OPS',
  categories: ['methodology', 'diagnosis-case-study'],
  tags: ['SDL', 'diagnosis'],
  topK: 10,
});

// Returns: Full SDL methodology including proprietary techniques
// Does NOT return: CEO-only business intelligence
```

### Example 3: ALIFF-CEO Full Access

```typescript
// CEO needs complete view including pricing strategies
const result = await RAG.retrieve('volume discount pricing strategy', {
  role: 'CEO',
  topK: 5,
});

// Returns: Everything including:
// - Public pricing messaging
// - Internal pricing rules
// - Proprietary margin calculations
// - Secret competitive pricing formulas
```

### Example 4: Client Data Isolation

```typescript
// Agency A's client portal showing project updates
const result = await RAG.retrieve('project status updates', {
  role: 'CLIENT',
  clientId: 'agency-a-uuid',
  categories: ['client-interaction'],
});

// Returns: Only Agency A's project data
// Does NOT return: Any other agency's data or internal methodology
```

## Troubleshooting

### "PINECONE_API_KEY environment variable not set"

Solution: Add Pinecone API key to `.env` file

### "Embedding dimension mismatch"

Solution: Ensure Pinecone index is created with 1536 dimensions

### "Access denied" errors

Solution: Check that document metadata includes the querying role in `roles` array

### Slow retrieval performance

Solution:
1. Reduce `topK` value
2. Add more specific filters (categories, tags)
3. Increase `similarityThreshold` to return fewer results

## Best Practices

1. **Always specify role**: Never skip the `role` parameter
2. **Use appropriate sensitivity**: Tag documents correctly
3. **Add comprehensive tags**: Makes retrieval more accurate
4. **Keep content focused**: Each document should cover one concept
5. **Update regularly**: Keep knowledge base current
6. **Monitor costs**: Track OpenAI API usage
7. **Test role access**: Verify each role sees appropriate content

---

**Status**: Sprint 1 Complete ✅
**Next**: Sprint 2 - Security & Filtering
