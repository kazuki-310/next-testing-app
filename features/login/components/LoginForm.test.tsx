import { render, screen, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { act } from 'react';

jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signIn: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('LoginForm', () => {
  it('初期レンダリング', () => {
    render(<LoginForm />);

    const emailField = screen.queryByPlaceholderText('user@example.com');
    const passwordField = screen.queryByPlaceholderText('password');
    const button = screen.queryByText('ログイン');

    expect(emailField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('無効なメールアドレスとパスワードでフォームを送信した場合、適切なバリデーションメッセージが表示される', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText('user@example.com'), 'invalid#email.com');
    await userEvent.type(screen.getByPlaceholderText('password'), 'short');

    userEvent.click(screen.getByText('ログイン'));

    await waitFor(() => {
      expect(screen.queryByText('正しいメールアドレス形式ではありません')).toBeInTheDocument();
      expect(screen.queryByText('パスワードは8文字以上必要です')).toBeInTheDocument();
    });
  });

  it('フォームの送信後、ローディング状態になり、ボタンが無効化されることを確認する', async () => {
    (signIn as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ status: 'success' }), 1000))
    );

    render(<LoginForm />);

    const button = screen.getByText('ログイン');

    await userEvent.type(screen.getByPlaceholderText('user@example.com'), 'test-user@example.com');
    await userEvent.type(screen.getByPlaceholderText('password'), 'testpassword');

    await userEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading');
    });
  });

  it('有効なメールアドレスとパスワードでログインを試みた場合、ログイン処理が正常に行われることを確認する', async () => {
    const signInMockFn = signIn as jest.Mock;

    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText('user@example.com'), 'test-user@example.com');
    await userEvent.type(screen.getByPlaceholderText('password'), 'testpassword');

    await userEvent.click(screen.getByText('ログイン'));

    expect(signInMockFn.mock.calls[0][0]).toBe('credentials');
    expect(signInMockFn.mock.calls[0][1]).toEqual({
      email: 'test-user@example.com',
      password: 'testpassword',
      callbackUrl: '/',
    });
  });

  it('ログイン処理中にエラーが発生した場合、エラーメッセージが表示される', async () => {
    (signIn as jest.Mock).mockRejectedValue('ログインエラー');

    render(<LoginForm />);

    await userEvent.type(screen.getByPlaceholderText('user@example.com'), 'test-user@example.com');
    await userEvent.type(screen.getByPlaceholderText('password'), 'testpassword');

    await userEvent.click(screen.getByText('ログイン'));

    expect(screen.queryByText('ログイン中にエラーが発生しました')).toBeInTheDocument();
  });

  it('ログインに失敗した場合、ローディング状態は解除されることを確認する', async () => {
    (signIn as jest.Mock).mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('ログインエラー')), 1000))
    );

    jest.useFakeTimers();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<LoginForm />);

    const button = screen.getByText('ログイン');

    await user.type(screen.getByPlaceholderText('user@example.com'), 'test-user@example.com');
    await user.type(screen.getByPlaceholderText('password'), 'testpassword');
    await user.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading');
    });

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('ログイン');
      expect(screen.getByText('ログイン中にエラーが発生しました')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
