'use client';

import { useEffect, useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 10);
    }, 10000);

    // コンポーネントのクリーンアップ時にインターバルをクリア
    return () => clearInterval(interval);
  }, []);

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
        <button className='border border-gray-300 bg-gray-100 p-2 px-4 rounded' onClick={() => setCount(count + 1)}>
          プラス
        </button>
        <button className='border border-gray-300 bg-gray-100 p-2 px-4 rounded' onClick={() => setCount(count - 1)}>
          マイナス
        </button>
      </div>
    </div>
  );
}

function double(a: number) {
  return a * 2;
}
