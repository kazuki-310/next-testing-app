import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type StepContextType = {
  step: number;
  increment: () => void;
  decrement: () => void;
};

const StepContext = createContext<StepContextType | undefined>(undefined);

type StepProviderProps = {
  children: ReactNode;
  step?: number;
};

export const StepProvider = (props: StepProviderProps) => {
  const [step, setStep] = useState(props.step ?? 0);

  const increment = useCallback(() => {
    setStep((p) => p + 1);
  }, []);

  const decrement = useCallback(() => {
    setStep((p) => p - 1);
  }, []);

  return <StepContext.Provider value={{ step, increment, decrement }}>{props.children}</StepContext.Provider>;
};

export const useStep = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStep must be used in within a StepProvider');
  }
  return context;
};
