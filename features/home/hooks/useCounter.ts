import { useState, useEffect } from 'react';

export const useCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 10);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);

  return { count, increment, decrement };
};
