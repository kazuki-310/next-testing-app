import { findBlogsByQuery } from '@/lib/prisma/blog';
import React from 'react';

export const BlogList = async ({ currentPage, query }: { currentPage: number; query?: string }) => {
  const blogs = await findBlogsByQuery({
    query,
    page: currentPage,
  });

  return (
    <div className='mx-auto'>
      <h2 className='text-xl font-bold my-4'>ブログ一覧</h2>
      <div className='grid grid-cols-1 gap-4'>
        {blogs.map((blog) => (
          <div key={blog.id} className='border p-4 rounded-lg'>
            <h3 className='text-lg font-semibold'>{blog.title}</h3>
            <p>{blog.content}</p>
            <div className='text-sm text-gray-600'>作成者: {blog.author.name || '不明'}</div>
            <div className='text-sm text-gray-500'>作成日: {blog.createdAt.toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
