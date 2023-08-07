// import { PrismaClient } from '@prisma/client';

// const client = globalThis.prisma || new PrismaClient();
// if (process.env.NODE_ENV === 'production') globalThis.prisma = client;

// export default client;
import { uri } from '@/app/api/route';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: uri,
      },
    },
  });
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
