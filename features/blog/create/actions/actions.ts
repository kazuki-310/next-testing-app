'use server';

import { getAuthSession } from '@/lib/auth';
import { createBlog } from '@/lib/prisma/blog';
import { Blog } from '@prisma/client';

type ServerCreateBlogResponse = {
  message: string;
  ok: boolean;
};

type ServerCreateBlogProps = {
  blog: Pick<Blog, 'title' | 'content'>;
};

export const serverCreateBlog = async ({ blog }: ServerCreateBlogProps): Promise<ServerCreateBlogResponse> => {
  const session = await getAuthSession();
  if (!session) {
    return { message: 'failed to get session', ok: false };
  }

  try {
    await createBlog({
      userId: session.user.id,
      title: blog.title,
      content: blog.content,
    });
    return { message: '', ok: true };
  } catch (error) {
    console.error(error);
    return { message: 'failed to create blog', ok: false };
  }
};
