import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';
import { act } from 'react';

describe('Counter component', () => {
  it('コンポーネントの初期表示にカウントが 0 であることを確認する', () => {
    render(<Counter />);

    const count = screen.getByText('カウント: 0');

    expect(count).toBeInTheDocument();
  });

  it('プラスボタンをクリックするとカウントが 1 増えることを確認する', async () => {
    render(<Counter />);

    await userEvent.click(screen.getByText('プラス'));

    expect(screen.getByText('カウント: 1')).toBeInTheDocument();
  });

  it('マイナスボタンをクリックするとカウントが 1 減ることを確認する', async () => {
    render(<Counter />);

    await userEvent.click(screen.getByText('マイナス'));

    expect(screen.getByText('カウント: -1')).toBeInTheDocument();
  });

  it('10 秒経過後にカウントが 10 増えることを確認する', () => {
    jest.useFakeTimers();

    render(<Counter />);

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText('カウント: 10')).toBeInTheDocument();

    jest.clearAllTimers();
  });

  it('コンポーネントのアンマウント時にインターバルがクリアされることを確認する', () => {
    jest.useFakeTimers();

    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    render(<Counter />);

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    const intervalId = setIntervalSpy.mock.results[0].value;

    cleanup();

    expect(clearIntervalSpy).toHaveBeenCalledWith(intervalId);

    jest.clearAllTimers();
  });
});
