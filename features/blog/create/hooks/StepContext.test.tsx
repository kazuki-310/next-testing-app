import React, { ReactNode } from 'react';
import { StepProvider, useStep } from './StepContext';
import { act, renderHook } from '@testing-library/react';

describe('StepProvider and useStep', () => {
  it('useStepフックが step, increment, decrement を返すことを確認する', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <StepProvider>{children}</StepProvider>;
    const { result } = renderHook(() => useStep(), { wrapper });

    expect(result.current.step).toBe(0);
    expect(typeof result.current.increment).toBe('function');
    expect(typeof result.current.decrement).toBe('function');
  });

  it('StepProviderに設定した初期値がuseStepで取得できることを確認する', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <StepProvider step={10}>{children}</StepProvider>;
    const { result } = renderHook(() => useStep(), { wrapper });

    expect(result.current.step).toBe(10);
  });

  it('increment, decrement関数が step の値を適切に更新することを確認する', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <StepProvider>{children}</StepProvider>;
    const { result } = renderHook(() => useStep(), { wrapper });

    expect(result.current.step).toBe(0);

    act(() => {
      result.current.increment();
    });
    expect(result.current.step).toBe(1);

    act(() => {
      result.current.decrement();
    });
    expect(result.current.step).toBe(0);
  });
});
