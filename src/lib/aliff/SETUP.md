# Aliff AI RAG System - Setup Guide

Complete guide to setting up and using the Aliff AI knowledge retrieval system.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Pinecone Setup](#pinecone-setup)
- [Populating the Knowledge Base](#populating-the-knowledge-base)
- [Testing the System](#testing-the-system)
- [Validation](#validation)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before setting up the Aliff AI RAG system, ensure you have:

- **Node.js** v18+ installed
- **npm** or **yarn** package manager
- **OpenAI API account** with API key
- **Pinecone account** with API key (free tier available)

## Environment Setup

### 1. Install Dependencies

The required packages are already in `package.json`:

```bash
npm install
```

Key dependencies:
- `@pinecone-database/pinecone` - Vector database client
- `openai` - Embedding generation
- `uuid` - Document ID generation
- `date-fns` - Date utilities

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Add your API keys to `.env`:

```bash
# OpenAI (for embeddings)
OPENAI_API_KEY="sk-..." # Your OpenAI API key

# Pinecone (for vector storage)
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX="aliff-knowledge"
```

**⚠️ Important**: Never commit `.env` file to git. It's already in `.gitignore`.

---

## Pinecone Setup

### Step 1: Create Pinecone Account

1. Go to [Pinecone](https://www.pinecone.io/)
2. Sign up for a free account
3. Verify your email

### Step 2: Create API Key

1. Go to **API Keys** section
2. Click **Create API Key**
3. Copy the key and add to `.env`

### Step 3: Create Index

You can create the index via:

**Option A: Pinecone Console (Recommended)**

1. Go to **Indexes** in Pinecone dashboard
2. Click **Create Index**
3. Configure:
   - **Name**: `aliff-knowledge`
   - **Dimensions**: `1536` (for OpenAI text-embedding-3-small)
   - **Metric**: `cosine`
   - **Pod Type**: `s1` (starter - free tier)
   - **Pods**: `1`
4. Click **Create Index**

**Option B: API/Code**

```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

await pinecone.createIndex({
  name: 'aliff-knowledge',
  dimension: 1536,
  metric: 'cosine',
  spec: {
    serverless: {
      cloud: 'aws',
      region: 'us-east-1'
    }
  }
});
```

### Step 4: Verify Index

Check that index is ready (may take 1-2 minutes):

```bash
# In Pinecone dashboard, index status should show "Ready"
```

---

## Populating the Knowledge Base

### Understanding What Gets Loaded

The population script loads content from three sources:

1. **Planning Documents** (`Planning/` directory)
   - Strategic discussions
   - Project planning
   - Business decisions
   - ~10-15 documents

2. **Training Documents** (`Training/Raw-Data/` directory)
   - Case studies
   - Diagnosis examples
   - Client interactions
   - ~15-20 documents

3. **Service Definitions** (`src/data/services.ts`)
   - All 24 Aliff Services
   - GOVCON, SLED, IT, Writing services
   - Comprehensive service details

**Total**: ~50-60 knowledge documents

### Run the Population Script

Execute the script with tsx:

```bash
npx tsx scripts/populate-knowledge-base.ts
```

### Expected Output

```
🚀 Aliff AI Knowledge Base Population
=====================================

📋 Loading Planning documents...
   ✅ Loaded 12 planning documents

📚 Loading Training documents...
   ✅ Loaded 18 training documents

🎯 Loading Service definitions...
   ✅ Loaded 24 service documents

📊 Document Summary:
===================
Total documents: 54

By Sensitivity:
  - internal: 42
  - proprietary: 10
  - secret: 2

By Category:
  - strategic-discussion: 12
  - diagnosis-case-study: 8
  - service-definition: 24
  - business-decision: 6
  - technical-documentation: 4

By Role Access:
  - CEO: 54 documents
  - SALES: 48 documents
  - OPS: 32 documents
  - TRAINER: 28 documents
  - CLIENT: 6 documents

💾 Storing documents in vector database...
   (This will take a few minutes to generate embeddings)

   Progress: 10/54 (19%)
   Progress: 20/54 (37%)
   Progress: 30/54 (56%)
   Progress: 40/54 (74%)
   Progress: 50/54 (93%)
   Progress: 54/54 (100%)

✅ Successfully stored 54 documents!

🔍 Verifying storage...
   Vector count in index: 54

🎉 Knowledge base population complete!

📚 You can now query the knowledge base:
   import RAG from "@/lib/aliff/rag";
   const result = await RAG.retrieve("your query", { role: "SALES" });
```

### Population Time & Cost

- **Time**: 3-5 minutes (depends on OpenAI API speed)
- **Cost**: ~$0.01-0.02 (OpenAI embeddings: $0.00002 per 1K tokens)
- **Storage**: Free (Pinecone free tier supports 100K vectors)

---

## Testing the System

### Test 1: Basic Retrieval

Create a test file `test-rag.ts`:

```typescript
import RAG from '@/lib/aliff/rag';

async function testRetrieval() {
  console.log('🧪 Testing Aliff AI RAG System\n');

  // Test 1: SALES role - Service query
  console.log('Test 1: SALES role querying services');
  const result1 = await RAG.retrieve(
    'What proposal writing services do we offer?',
    {
      role: 'SALES',
      topK: 3,
      similarityThreshold: 0.7,
    }
  );

  console.log(`Found ${result1.total} documents`);
  console.log(`Retrieval time: ${result1.metrics.retrievalTimeMs}ms`);
  result1.documents.forEach((doc, i) => {
    console.log(`\n${i + 1}. Score: ${doc.score?.toFixed(3)}`);
    console.log(`   Category: ${doc.metadata.category}`);
    console.log(`   Content: ${doc.content.substring(0, 100)}...`);
  });

  // Test 2: OPS role - Diagnosis query
  console.log('\n\nTest 2: OPS role querying diagnosis methodology');
  const result2 = await RAG.retrieve(
    'How do we diagnose win probability in proposals?',
    {
      role: 'OPS',
      topK: 3,
      categories: ['diagnosis-case-study', 'methodology'],
    }
  );

  console.log(`Found ${result2.total} documents`);
  console.log(`Retrieval time: ${result2.metrics.retrievalTimeMs}ms`);

  // Test 3: CLIENT role - Should have limited access
  console.log('\n\nTest 3: CLIENT role (limited access)');
  const result3 = await RAG.retrieve(
    'What are your pricing strategies?',
    {
      role: 'CLIENT',
      topK: 5,
    }
  );

  console.log(`Found ${result3.total} documents (should be limited)`);
  console.log('CLIENT can only access public documents');
}

testRetrieval().catch(console.error);
```

Run the test:

```bash
npx tsx test-rag.ts
```

### Test 2: Role-Based Access Control

```typescript
import RAG from '@/lib/aliff/rag';

async function testRBAC() {
  const query = 'proprietary diagnosis methodology';

  console.log('🔒 Testing Role-Based Access Control\n');

  // Test each role
  const roles = ['SALES', 'OPS', 'CLIENT', 'TRAINER', 'CEO'] as const;

  for (const role of roles) {
    const result = await RAG.retrieve(query, { role, topK: 10 });

    console.log(`${role}: ${result.total} documents accessible`);

    // Show sensitivity levels accessed
    const sensitivities = new Set(
      result.documents.map((d) => d.metadata.sensitivity)
    );
    console.log(`  Sensitivity levels: ${Array.from(sensitivities).join(', ')}`);
  }
}

testRBAC().catch(console.error);
```

Expected output:
```
🔒 Testing Role-Based Access Control

SALES: 8 documents accessible
  Sensitivity levels: public, internal

OPS: 12 documents accessible
  Sensitivity levels: public, internal, proprietary

CLIENT: 2 documents accessible
  Sensitivity levels: public

TRAINER: 10 documents accessible
  Sensitivity levels: public, internal

CEO: 15 documents accessible
  Sensitivity levels: public, internal, proprietary, secret
```

### Test 3: Performance Benchmarks

```typescript
import RAG from '@/lib/aliff/rag';

async function benchmarkPerformance() {
  console.log('⚡ Performance Benchmarks\n');

  const queries = [
    'proposal writing services',
    'win probability diagnosis',
    'strategic pricing methodology',
    'client communication approach',
    'technical documentation standards',
  ];

  let totalTime = 0;
  let totalDocs = 0;

  for (const query of queries) {
    const start = Date.now();
    const result = await RAG.retrieve(query, {
      role: 'OPS',
      topK: 5,
    });
    const elapsed = Date.now() - start;

    totalTime += elapsed;
    totalDocs += result.total;

    console.log(`Query: "${query}"`);
    console.log(`  Time: ${elapsed}ms`);
    console.log(`  Docs: ${result.total}`);
    console.log(`  Embedding: ${result.metrics.embeddingTimeMs}ms`);
    console.log(`  Retrieval: ${result.metrics.retrievalTimeMs}ms`);
    console.log('');
  }

  console.log('Summary:');
  console.log(`  Average time: ${(totalTime / queries.length).toFixed(0)}ms`);
  console.log(`  Average docs: ${(totalDocs / queries.length).toFixed(1)}`);
}

benchmarkPerformance().catch(console.error);
```

Expected performance:
- **Average query time**: 300-600ms
- **Embedding generation**: 200-400ms
- **Vector search**: 50-150ms
- **Post-filtering**: 10-50ms

---

## Validation

### Validation Checklist

✅ **Environment Setup**
- [ ] `.env` file exists with valid API keys
- [ ] OpenAI API key is valid (test with `echo $OPENAI_API_KEY`)
- [ ] Pinecone API key is valid

✅ **Pinecone Index**
- [ ] Index `aliff-knowledge` exists
- [ ] Index has 1536 dimensions
- [ ] Index uses cosine metric
- [ ] Index status is "Ready"

✅ **Knowledge Population**
- [ ] Script ran without errors
- [ ] 50+ documents stored
- [ ] Vector count matches document count
- [ ] All sensitivity levels present (public, internal, proprietary, secret)
- [ ] All categories present (strategic, diagnosis, service, etc.)

✅ **Retrieval Testing**
- [ ] SALES role can retrieve service documents
- [ ] OPS role can access proprietary methodology
- [ ] CLIENT role has limited access (public only)
- [ ] CEO role can access all sensitivity levels
- [ ] Similarity scores are reasonable (0.7-0.95 for relevant docs)

✅ **Performance**
- [ ] Queries complete in < 1 second
- [ ] Embedding generation < 500ms
- [ ] Vector search < 200ms

### Verify Index Stats

Check Pinecone index stats:

```typescript
import { getIndexStats } from '@/lib/aliff/rag/storage';

const stats = await getIndexStats();
console.log('Index Stats:', stats);
```

Expected output:
```typescript
{
  dimension: 1536,
  indexFullness: 0.001,  // Very low for 54 docs
  totalRecordCount: 54,
  namespaces: {
    '': {
      recordCount: 54
    }
  }
}
```

---

## Troubleshooting

### Issue: "OPENAI_API_KEY not set"

**Solution**:
1. Verify `.env` file exists
2. Check `OPENAI_API_KEY="sk-..."` is set
3. Restart your terminal/IDE to load new env vars
4. Test: `node -e "console.log(process.env.OPENAI_API_KEY)"`

### Issue: "PINECONE_API_KEY not set"

**Solution**:
1. Create Pinecone account at https://www.pinecone.io/
2. Generate API key in dashboard
3. Add to `.env`: `PINECONE_API_KEY="your-key"`

### Issue: "Index not found"

**Solution**:
1. Check Pinecone dashboard for index name
2. Verify index name in `.env` matches: `PINECONE_INDEX="aliff-knowledge"`
3. Create index if missing (see [Pinecone Setup](#pinecone-setup))

### Issue: "Dimension mismatch"

**Solution**:
1. Pinecone index must be **1536 dimensions** (for OpenAI text-embedding-3-small)
2. Delete old index and recreate with correct dimensions
3. Re-run population script

### Issue: "Rate limit exceeded"

**Solution**:
1. OpenAI free tier has rate limits
2. Add delays between batch processing
3. Reduce batch size in `populate-knowledge-base.ts` (line 73):
   ```typescript
   const batchSize = 5; // Reduce from 10 to 5
   ```

### Issue: "No documents found" in retrieval

**Solution**:
1. Verify population completed successfully
2. Check index stats: `npx tsx -e "import('./src/lib/aliff/rag').then(m => m.getIndexStats()).then(console.log)"`
3. Verify query role has access to documents:
   - CLIENT can only see "public" sensitivity
   - SALES can see "public" and "internal"
4. Lower similarity threshold: `similarityThreshold: 0.5`

### Issue: "Slow queries (> 2 seconds)"

**Solution**:
1. Check Pinecone region (use closest region)
2. Verify network connection
3. Check OpenAI API status
4. Monitor `metrics` in retrieval result to identify bottleneck

### Issue: "Cost concerns"

**Costs breakdown**:
- **OpenAI Embeddings**: $0.00002 per 1K tokens
  - 50 docs × 500 tokens avg = 25K tokens = $0.0005
- **Pinecone Storage**: Free tier (100K vectors)
- **OpenAI Retrieval**: Free (uses existing embeddings)

**Monthly costs** (1000 queries):
- Embedding cache: $0
- Pinecone: $0 (free tier)
- Total: **~$0/month**

---

## Next Steps

After completing setup:

1. ✅ **Sprint 1 Complete** - RAG foundation is ready
2. 🔄 **Sprint 2** - Add security & filtering (Week 2)
3. 🚀 **Sprint 3+** - Build the 5 Aliff roles (Weeks 3-16)

### Using RAG in Your App

```typescript
import RAG from '@/lib/aliff/rag';

// In your API route or component
const result = await RAG.retrieve(
  userQuery,
  {
    role: session.user.role, // From auth session
    topK: 5,
    similarityThreshold: 0.75,
  }
);

// Use retrieved knowledge in AI prompt
const context = result.documents
  .map(d => d.content)
  .join('\n\n');

const systemPrompt = `You are Aliff AI. Use this knowledge:\n\n${context}`;
```

---

## Support

- 📖 **Documentation**: See `src/lib/aliff/README.md`
- 🐛 **Issues**: Check troubleshooting section above
- 📚 **API Reference**: See type definitions in `src/lib/aliff/types/index.ts`
- 🎯 **Project Plan**: See `Planning/SPRINT_1_PLAN.md`

**Sprint 1 Status**: ✅ Complete (100%)
- ✅ Day 1: Vector database setup
- ✅ Day 2: Embedding & storage
- ✅ Day 3: Semantic retrieval
- ✅ Day 4: Knowledge population
- ✅ Day 5: Testing & documentation
