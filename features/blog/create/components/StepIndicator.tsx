import React from 'react';

type StepIndicatorProps = {
  currentStep: number;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = ['タイトル入力', '本文入力', '確認'];
  if (currentStep < 0 || currentStep > 2) {
    throw new Error('Invalid step value');
  }

  return (
    <div className='flex justify-between w-full'>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            key={index}
            className={`flex flex-col items-center ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                index <= currentStep ? 'border-blue-600' : 'border-gray-400'
              } `}
            >
              {index + 1}
            </div>
            <div className='text-sm'>{step}</div>
          </div>
          {index < steps.length - 1 && (
            <div
              data-testid='connecting-line'
              className={`flex-auto mt-4 mx-4 border-t-4 ${
                index < currentStep ? 'border-blue-500' : 'border-gray-400'
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
