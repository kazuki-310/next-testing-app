import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as navigation from 'next/navigation';
import { Search } from './Search';

// next/navigation をモック化
jest.mock('next/navigation');

beforeEach(() => {
  // useRouter, useSearchParams, usePathname をモック化
  (navigation.useRouter as jest.Mock).mockImplementation(() => ({
    replace: jest.fn(),
  }));
  (navigation.useSearchParams as jest.Mock).mockImplementation(() => new URLSearchParams({}));
  (navigation.usePathname as jest.Mock).mockImplementation(() => '/test');
});

afterEach(() => {
  // 各テスト後にモックをリセット
  jest.resetAllMocks();
});

describe('Search Component', () => {
  test('検索入力フィールドが表示されていることを確認する', async () => {
    render(<Search placeholder='test placeholder' />);

    expect(screen.getByPlaceholderText('test placeholder')).toBeInTheDocument();
  });

  test('テキスト入力後、適切なデバウンス時間が経過した後にURLが更新されることをテスト', async () => {
    const replaceMockFn = jest.fn(); // replace のモック
    (navigation.useRouter as jest.Mock).mockImplementation(() => ({
      replace: replaceMockFn,
    }));

    jest.useFakeTimers(); // タイマーをモック化
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<Search placeholder='test placeholder' />);

    const inputField = screen.getByPlaceholderText('test placeholder');
    await user.type(inputField, 'testinput'); // テキストを入力
    act(() => {
      jest.advanceTimersByTime(300); // 300ミリ秒進める
    });
    // replace 関数が正しく呼ばれたか検証
    expect(replaceMockFn).toHaveBeenCalledWith('/test?page=1&query=testinput');
  });

  test('入力をクリアし、適切なデバウンス時間が経過した後にURLのクエリが削除されることをテスト', async () => {
    const replaceMockFn = jest.fn();
    (navigation.useRouter as jest.Mock).mockImplementation(() => ({
      replace: replaceMockFn,
    }));

    // 初期クエリを設定した URLSearchParams オブジェクト
    (navigation.useSearchParams as jest.Mock).mockImplementation(
      () => new URLSearchParams({ query: 'john', page: '3' })
    );

    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<Search placeholder='test placeholder' />);

    const inputField = screen.getByPlaceholderText('test placeholder');
    // 初期値が入力されていることを確認
    expect(inputField).toHaveValue('john');

    await user.clear(inputField);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // replace 関数が正しく呼ばれたか検証
    expect(replaceMockFn).toHaveBeenCalledWith('/test?page=1');
  });
});
