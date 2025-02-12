// テスト環境をNode.jsに設定
/**
 * @jest-environment node
 */

import { getAuthSession } from '@/lib/auth';
import { serverCreateBlog } from './actions';
import { createBlog } from '@/lib/prisma/blog';

jest.mock('@/lib/auth', () => ({
  getAuthSession: jest.fn(),
}));

jest.mock('@/lib/prisma/blog', () => ({
  createBlog: jest.fn(),
}));

// 各テスト後にモックをrリセット
afterEach(() => {
  jest.restoreAllMocks();
});

describe('actions', () => {
  it('セッションが存在しない場合に、適切なレスポンスが返ってくることを確認する', async () => {
    const mockFn = getAuthSession as jest.Mock;

    const res = await serverCreateBlog({
      blog: { title: 'test title', content: 'test content' },
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(res).toEqual({ message: 'failed to get session', ok: false });
  });

  it('ブログの作成に成功した場合に、適切なレスポンスが返ってくることを確認する', async () => {
    (getAuthSession as jest.Mock).mockImplementation(() => ({
      user: { id: '1234' },
    }));
    const mockCreateBlog = createBlog as jest.Mock;

    const res = await serverCreateBlog({
      blog: { title: 'test title', content: 'test content' },
    });

    expect(res).toEqual({ message: '', ok: true });
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      userId: '1234',
      title: 'test title',
      content: 'test content',
    });
  });

  it('ブログの作成に失敗した場合に、適切なレスポンスが返ってくることを確認する', async () => {
    (getAuthSession as jest.Mock).mockImplementation(() => ({
      user: { id: '1234' },
    }));

    const mockCreateBlog = (createBlog as jest.Mock).mockRejectedValue('DBエラー');

    const mockLog = jest.spyOn(console, 'error').mockImplementation(() => {});

    const res = await serverCreateBlog({
      blog: { title: 'test title', content: 'test content' },
    });

    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      userId: '1234',
      title: 'test title',
      content: 'test content',
    });
    expect(res).toEqual({ message: 'failed to create blog', ok: false });

    expect(mockLog.mock.calls[0][0]).toEqual('DBエラー');
  });
});
