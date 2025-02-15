import { render, screen } from '@testing-library/react';
import { BlogListPresentational } from './BlogList';

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

describe('BlogList component', () => {
  test('初期レンダリング', () => {
    render(<BlogListPresentational blogs={blogMockData} />);

    expect(screen.queryByText('ブログのタイトル1')).toBeInTheDocument();
    expect(screen.queryByText('ブログのタイトル2')).toBeInTheDocument();
    expect(screen.queryByText('ブログのタイトル3')).toBeInTheDocument();
  });
});
