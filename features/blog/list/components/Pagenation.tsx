'use client';

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';
import clsx from 'clsx';

export const Pagination = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // 指定されたページ番号のURLを生成する
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // ページネーションの各ページ番号を生成
  const allPages = generatePagination(currentPage, totalPages);

  return (
    <>
      <div className='inline-flex'>
        {/* 左矢印のアイコン */}
        <PaginationArrow direction='left' href={createPageURL(currentPage - 1)} isDisabled={currentPage <= 1} />

        <div className='flex -space-x-px'>
          {allPages.map((page, index) => {
            // 位置によってスタイルを変更するための変数
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            // 最初、最後、中間のページで位置を決定
            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber
                key={`page-${index}`}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        {/* 右矢印のアイコン */}
        <PaginationArrow
          direction='right'
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
};

// ここのページ番号を表す
// isActiveは現在のページと同じページ番号かどうか
function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  // ここでページ番号のスタイルを定義
  const className = clsx('flex h-10 w-10 items-center justify-center text-sm border', {
    'rounded-l-md': position === 'first' || position === 'single',
    'rounded-r-md': position === 'last' || position === 'single',
    'z-10 bg-blue-600 border-blue-600 text-white': isActive,
    'hover:bg-gray-100': !isActive && position !== 'middle',
    'text-gray-300': position === 'middle',
  });

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

// 矢印アイコンを表示する
// isDisabledは矢印が非活性化されているかどうか
function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  const className = clsx('flex h-10 w-10 items-center justify-center rounded-md border', {
    'pointer-events-none text-gray-300': isDisabled,
    'hover:bg-gray-100': !isDisabled,
    'mr-2 md:mr-4': direction === 'left',
    'ml-2 md:ml-4': direction === 'right',
  });
  const icon = direction === 'left' ? <FaArrowLeft className='w-4' /> : <FaArrowRight className='w-4' />;

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}

// ページネーションの番号を生成する
const generatePagination = (currentPage: number, totalPages: number) => {
  // 総ページ数が 7 以下の場合はすべてのページ番号を表示
  if (totalPages <= 7) {
    // totalPages の長さの配列を作成
    // totalPagesが 5 の場合 [1, 2, 3, 4, 5]
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 現在のページが先頭に近い場合
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // 現在のページが末尾に近い場合
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // 現在のページが中間にある場合
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};
