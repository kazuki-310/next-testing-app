'use client';

import { useCounter } from '@/features/home/hooks/useCounter';

export function Counter() {
  const { count, increment, decrement } = useCounter();

  if (count === 10000) {
    // doubleはテストでは実行されない
    double(count);
    console.log('Hello, world');
  } else {
    console.log('test');
  }

  return (
    <div className='m-12'>
      <h2>カウント: {count}</h2>

      <div className='flex gap-4'>
        <button className='border border-gray-300 bg-gray-100 p-2 px-4 rounded' onClick={increment}>
          プラス
        </button>
        <button className='border border-gray-300 bg-gray-100 p-2 px-4 rounded' onClick={decrement}>
          マイナス
        </button>
      </div>
    </div>
  );
}

function double(a: number) {
  return a * 2;
}
