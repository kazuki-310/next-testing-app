import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { BlogForm } from './BlogForm';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { serverCreateBlog } from '../actions/actions';

jest.mock('../actions/actions', () => ({
  serverCreateBlog: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('BlogForm component', () => {
  it('ブログフォームを通して、タイトルと本文を入力し、ブログを作成できることを確認する', async () => {
    (useSession as jest.Mock).mockImplementation(() => ({
      data: { user: { name: 'テストユーザー' } },
    }));
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
    const mockFnServerCreateBlog = (serverCreateBlog as jest.Mock).mockImplementation(() => ({
      message: '',
      ok: true,
    }));

    render(<BlogForm />);

    // タイトル入力画面が表示されていることを検証
    expect(screen.queryByPlaceholderText('タイトルを入力してください')).toBeInTheDocument();
    // ボタンが無効化されていることを検証
    expect(screen.getByText('進む')).toBeDisabled();

    // タイトルを入力
    await userEvent.type(screen.getByPlaceholderText('タイトルを入力してください'), 'テストタイトル');

    // 進むボタンをクリック
    await userEvent.click(screen.getByText('進む'));

    // 本文入力画面が表示されていることを検証
    expect(screen.queryByPlaceholderText('本文を入力してください')).toBeInTheDocument();
    // ボタンが無効化されていることを検証
    expect(screen.getByText('進む')).toBeDisabled();

    // 本文を入力
    await userEvent.type(screen.getByPlaceholderText('本文を入力してください'), 'テスト本文');

    // 進むボタンをクリック
    await userEvent.click(screen.getByText('進む'));

    // 確認画面が表示されていることを検証
    expect(screen.queryByText('テストユーザー')).toBeInTheDocument();
    expect(screen.queryByText('テストタイトル')).toBeInTheDocument();
    expect(screen.queryByText('テスト本文')).toBeInTheDocument();

    // 作成ボタンをクリック
    await userEvent.click(screen.getByText('作成する'));

    // serverCreateBlogとuseRouter.pushに適切な引数が渡されたか検証
    await waitFor(() => {
      expect(mockFnServerCreateBlog).toHaveBeenCalledWith({
        blog: { title: 'テストタイトル', content: 'テスト本文' },
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
