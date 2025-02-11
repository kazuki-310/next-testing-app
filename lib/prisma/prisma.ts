import { PrismaClient } from '@prisma/client';

// すでに globalThis に prisma が定義されていれば使い回し、
// なければ新しく生成するというパターン
const globalForPrisma = global as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		// 本番環境であればログを少なくしたり、必要な設定を追加するなど
		log: ['query'],
	});

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma;
}
