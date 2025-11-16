/**
 * Clean all job postings
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning all job postings...');

  const result = await prisma.jobPosting.deleteMany({});

  console.log(`Deleted ${result.count} job postings`);
}

main()
  .catch((e) => {
    console.error('Clean failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
