/**
 * Script to populate Aliff AI knowledge base
 *
 * Run with: npx tsx scripts/populate-knowledge-base.ts
 */

import path from 'path';
import { storeBatch } from '../src/lib/aliff/rag/storage';
import {
  loadPlanningDocuments,
  loadTrainingDocuments,
  loadServiceDefinitions,
  summarizeDocuments,
} from '../src/lib/aliff/training/data-loader';

// Import service data
import { govconServices, sledServices, writingServices, itServices } from '../src/data/services';

async function main() {
  console.log('🚀 Aliff AI Knowledge Base Population');
  console.log('=====================================\n');

  const projectRoot = path.join(__dirname, '..');
  const documents: Array<any> = [];

  try {
    // 1. Load Planning documents
    console.log('📋 Loading Planning documents...');
    const planningDocs = loadPlanningDocuments(projectRoot);
    console.log(`   ✅ Loaded ${planningDocs.length} planning documents`);
    documents.push(...planningDocs);

    // 2. Load Training documents
    console.log('\n📚 Loading Training documents...');
    const trainingDocs = loadTrainingDocuments(projectRoot);
    console.log(`   ✅ Loaded ${trainingDocs.length} training documents`);
    documents.push(...trainingDocs);

    // 3. Load Service definitions
    console.log('\n🎯 Loading Service definitions...');
    const allServices = [
      ...govconServices,
      ...sledServices,
      ...writingServices,
      ...itServices,
    ];
    const serviceDocs = loadServiceDefinitions(allServices);
    console.log(`   ✅ Loaded ${serviceDocs.length} service documents`);
    documents.push(...serviceDocs);

    // 4. Summarize what we're about to store
    console.log('\n📊 Document Summary:');
    console.log('===================');
    const summary = summarizeDocuments(documents);
    console.log(`Total documents: ${summary.total}`);
    console.log('\nBy Sensitivity:');
    Object.entries(summary.bySensitivity).forEach(([level, count]) => {
      console.log(`  - ${level}: ${count}`);
    });
    console.log('\nBy Category:');
    Object.entries(summary.byCategory).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count}`);
    });
    console.log('\nBy Role Access:');
    Object.entries(summary.byRole).forEach(([role, count]) => {
      console.log(`  - ${role}: ${count} documents`);
    });

    // 5. Store in vector database
    console.log('\n💾 Storing documents in vector database...');
    console.log('   (This will take a few minutes to generate embeddings)\n');

    const batchSize = 10; // Process 10 at a time to show progress
    let stored = 0;

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);

      try {
        await storeBatch(batch, true); // Generate embeddings
        stored += batch.length;

        const progress = Math.round((stored / documents.length) * 100);
        console.log(`   Progress: ${stored}/${documents.length} (${progress}%)`);
      } catch (error) {
        console.error(`   ❌ Error storing batch ${i}-${i + batchSize}:`, error);
        // Continue with next batch
      }
    }

    console.log(`\n✅ Successfully stored ${stored} documents!`);

    // 6. Verify storage
    console.log('\n🔍 Verifying storage...');
    const { getIndexStats } = await import('../src/lib/aliff/rag/storage');
    const stats = await getIndexStats();
    console.log(`   Vector count in index: ${stats.totalRecordCount || stats.dimension || 'unknown'}`);

    console.log('\n🎉 Knowledge base population complete!');
    console.log('\n📚 You can now query the knowledge base:');
    console.log('   import RAG from "@/lib/aliff/rag";');
    console.log('   const result = await RAG.retrieve("your query", { role: "SALES" });');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error populating knowledge base:', error);
    console.error('\nMake sure you have:');
    console.error('  1. Set OPENAI_API_KEY in .env');
    console.error('  2. Set PINECONE_API_KEY in .env');
    console.error('  3. Created Pinecone index with 1536 dimensions');
    process.exit(1);
  }
}

main();
