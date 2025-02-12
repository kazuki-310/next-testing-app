'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

export const LogoutButton = () => {
  const handleClick = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button className='text-lg hover:text-gray-300' onClick={handleClick}>
      ログアウト
    </button>
  );
};
