import { PrismaClient } from '@prisma/client';

// Reuse the Prisma client across warm invocations of the same serverless
// container — instantiating per-request leaks connections under any load.
const prisma = globalThis.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;

export default prisma;
