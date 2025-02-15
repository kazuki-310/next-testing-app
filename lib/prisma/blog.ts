import { BLOG_PER_PAGE } from '@/features/blog/list/constants/blog-per-page-constants';
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

export const totalBlogPages = async (query?: string) => {
  const count = await prisma.blog.count({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive', // 大文字小文字を区別しない検索
          },
        },
        {
          content: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          author: {
            is: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    },
  });

  return Math.ceil(Number(count) / BLOG_PER_PAGE);
};

type FindBlogsType = {
  query?: string;
  page?: number;
  pageSize?: number;
};

export const findBlogsByQuery = async ({ query, page = 1, pageSize = BLOG_PER_PAGE }: FindBlogsType) => {
  const skip = (page - 1) * pageSize;

  return prisma.blog.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive', // 大文字小文字を区別しない検索
          },
        },
        {
          content: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          author: {
            is: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    },
    include: {
      author: true, // authorの詳細も一緒に取得
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize,
  });
};
