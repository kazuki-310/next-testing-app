import { LogoutButton } from '@/features/login/components/LogoutButton';
import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';

export async function Header() {
  const session = await getAuthSession();

  return (
    <header className='bg-gray-800 text-white p-4'>
      <nav className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center'>
          <Link className='text-xl font-semibold hover:text-gray-300' href='/'>
            HOME
          </Link>
        </div>
        <div className='space-x-4'>
          {session ? (
            <>
              <Link className='text-lg hover:text-gray-300' href='/blog'>
                ブログ一覧
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link className='text-lg hover:text-gray-300' href='/login'>
              ログイン
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
