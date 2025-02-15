/**
 * @jest-environment node
 */

import { findBlogsByQuery } from '@/lib/prisma/blog';
import { BlogList, BlogListPresentational } from './BlogList';

jest.mock('@/lib/prisma/blog', () => ({
  findBlogsByQuery: jest.fn(),
}));

const blogMockData = [
  {
    id: '1',
    title: 'ブログのタイトル1',
    content: 'これは最初のブログのコンテンツです。',
    createdAt: new Date('2023-01-01'),
    author: {
      name: '山田太郎',
    },
  },
  {
    id: '2',
    title: 'ブログのタイトル2',
    content: 'これは二番目のブログのコンテンツです。',
    createdAt: new Date('2023-02-01'),
    author: {
      name: '鈴木一郎',
    },
  },
  {
    id: '3',
    title: 'ブログのタイトル3',
    content: 'これは三番目のブログのコンテンツです。',
    createdAt: new Date('2023-03-01'),
    author: {
      name: '佐藤花子',
    },
  },
];

describe('BlogList', () => {
  test('BlogListPresentationalに適切な値を渡しているか確認する', async () => {
    const mockFn = (findBlogsByQuery as jest.Mock).mockResolvedValue(blogMockData);

    const result = await BlogList({ currentPage: 3, query: 'test' });

    // findBlogsByQuery に適切な値を渡しているか検証
    expect(mockFn.mock.calls[0][0]).toEqual({ page: 3, query: 'test' });
    // BlogListPresentationalを表示させているか検証
    expect(result.type).toEqual(BlogListPresentational);
    // BlogListPresentationalに適切な blogs を渡しているか検証
    expect(result.props).toEqual({ blogs: blogMockData });
  });
});
