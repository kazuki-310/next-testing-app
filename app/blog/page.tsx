import { BlogList } from '@/features/blog/list/components/BlogList';
import { Pagination } from '@/features/blog/list/components/Pagenation';
import { Search } from '@/features/blog/list/components/Search';
import { totalBlogPages } from '@/lib/prisma/blog';
import React from 'react';

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string | string[];
    page?: string | string[];
  };
}) {
  const query = typeof searchParams?.query === 'string' ? searchParams.query : undefined;
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await totalBlogPages(query);

  return (
    <main className='w-full p-12'>
      <div className='w-full'>
        <Search placeholder='Search blogs...' />
      </div>
      <div>
        <BlogList currentPage={currentPage} query={query} />
      </div>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
