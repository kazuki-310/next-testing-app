import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useCounter } from './useCounter';

describe('useCounter hooks', () => {
  it('初期値が正しく０になってることを確認する', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it('increment, decrement が正しく動作していることを確認する', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);

    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(0);
  });

  it('10 秒経過後にカウントが 10 増えることを確認する', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useCounter());

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.count).toBe(10);
    jest.clearAllTimers();
  });

  it('コンポーネントのアンマウント時にインターバルがクリアされることを確認する', () => {
    jest.useFakeTimers();

    jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useCounter());

    expect(clearInterval).toHaveBeenCalledTimes(0);

    unmount();

    expect(clearInterval).toHaveBeenCalledTimes(1);

    jest.clearAllTimers();
  });
});
