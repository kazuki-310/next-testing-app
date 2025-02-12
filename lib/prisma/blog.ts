import { prisma } from './prisma';

export const createBlog = async ({ userId, title, content }: { userId: string; title: string; content: string }) => {
  return prisma.blog.create({
    data: {
      title,
      content,
      userId,
    },
  });
};
