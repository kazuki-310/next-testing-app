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
  const setup = () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('user@example.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByText('ログイン');

    return { emailInput, passwordInput, loginButton };
  };

  it('初期レンダリング', () => {
    const { emailInput, passwordInput, loginButton } = setup();

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('無効なメールアドレスとパスワードでフォームを送信した場合、適切なバリデーションメッセージが表示される', async () => {
    const { emailInput, passwordInput, loginButton } = setup();

    await userEvent.type(emailInput, 'invalid#email.com');
    await userEvent.type(passwordInput, 'short');

    userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.queryByText('正しいメールアドレス形式ではありません')).toBeInTheDocument();
      expect(screen.queryByText('パスワードは8文字以上必要です')).toBeInTheDocument();
    });
  });

  it('フォームの送信後、ローディング状態になり、ボタンが無効化されることを確認する', async () => {
    (signIn as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ status: 'success' }), 1000))
    );

    const { emailInput, passwordInput, loginButton } = setup();

    await userEvent.type(emailInput, 'test-user@example.com');
    await userEvent.type(passwordInput, 'testpassword');
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
      expect(loginButton).toHaveTextContent('Loading');
    });
  });

  it('有効なメールアドレスとパスワードでログインを試みた場合、ログイン処理が正常に行われることを確認する', async () => {
    const signInMockFn = signIn as jest.Mock;

    const { emailInput, passwordInput, loginButton } = setup();

    await userEvent.type(emailInput, 'test-user@example.com');
    await userEvent.type(passwordInput, 'testpassword');
    await userEvent.click(loginButton);

    expect(signInMockFn.mock.calls[0][0]).toBe('credentials');
    expect(signInMockFn.mock.calls[0][1]).toEqual({
      email: 'test-user@example.com',
      password: 'testpassword',
      callbackUrl: '/',
    });
  });

  it('ログイン処理中にエラーが発生した場合、エラーメッセージが表示される', async () => {
    (signIn as jest.Mock).mockRejectedValue('ログインエラー');

    const { emailInput, passwordInput, loginButton } = setup();

    await userEvent.type(emailInput, 'test-user@example.com');
    await userEvent.type(passwordInput, 'testpassword');
    await userEvent.click(loginButton);

    expect(screen.queryByText('ログイン中にエラーが発生しました')).toBeInTheDocument();
  });

  it('ログインに失敗した場合、ローディング状態は解除されることを確認する', async () => {
    (signIn as jest.Mock).mockImplementation(
      () => new Promise((_, reject) => setTimeout(() => reject(new Error('ログインエラー')), 1000))
    );

    jest.useFakeTimers();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const { emailInput, passwordInput, loginButton } = setup();

    await user.type(emailInput, 'test-user@example.com');
    await user.type(passwordInput, 'testpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(loginButton).toBeDisabled();
      expect(loginButton).toHaveTextContent('Loading');
    });

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
      expect(loginButton).toHaveTextContent('ログイン');
      expect(screen.getByText('ログイン中にエラーが発生しました')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
