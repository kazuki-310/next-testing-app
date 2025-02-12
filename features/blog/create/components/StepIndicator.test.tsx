import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { StepIndicator } from './StepIndicator';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('StepIndicator component', () => {
  it('各ステップが正しく表示されることを確認する', () => {
    render(<StepIndicator currentStep={1} />);
    expect(screen.getByText('タイトル入力')).toBeInTheDocument();
    expect(screen.getByText('本文入力')).toBeInTheDocument();
    expect(screen.getByText('確認')).toBeInTheDocument();
  });

  it('現在のステップが適切にハイライトされることを確認する', () => {
    render(<StepIndicator currentStep={1} />);

    expect(screen.getByText('タイトル入力').parentElement).toHaveClass('text-blue-600');
    expect(screen.getByText('本文入力').parentElement).toHaveClass('text-blue-600');
    expect(screen.getByText('確認').parentElement).toHaveClass('text-gray-400');

    // 接続線をtestidで取得
    const connectingLines = screen.getAllByTestId('connecting-line');
    // 最初の接続線がアクティブ
    expect(connectingLines[0]).toHaveClass('border-blue-500');
    // 二番目の接続線が非アクティブ
    expect(connectingLines[1]).toHaveClass('border-gray-400');
  });

  it('無効なステップ値が与えられた場合にエラーが投げられたことを確認する', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const invalidStep = 3;
    const renderWithInvalidStep = () => {
      render(<StepIndicator currentStep={invalidStep} />);
    };
    expect(renderWithInvalidStep).toThrow('Invalid step value');
  });
});
