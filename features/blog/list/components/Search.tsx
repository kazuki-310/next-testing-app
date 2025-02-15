'use client';

import React from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export const Search = ({ placeholder }: { placeholder: string }) => {
  // クエリパラメータを取得
  const searchParams = useSearchParams();
  // 現在のパス名を取得
  const pathname = usePathname();
  // URLを置き換えるための関数を取得
  const { replace } = useRouter();

  // ユーザーが検索ボックスに入力した際の関数。300ミリ秒のデバウンスを設定
  const handleSearch = useDebouncedCallback((term) => {
    // 現在のクエリパラメータを取得
    const params = new URLSearchParams(searchParams);
    // page=1をセット
    params.set('page', '1');
    if (term) {
      // 検索語がある場合、query=termをセット
      params.set('query', term);
    } else {
      // 検索語がない場合、queryパラメータを削除
      params.delete('query');
    }
    // 更新したクエリパラメータでURLを更新
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className='relative flex flex-1 flex-shrink-0'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <input
        className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
};
