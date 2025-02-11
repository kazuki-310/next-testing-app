import Link from 'next/link';

export function Header() {
  return (
    <header className='bg-gray-800 text-white p-4'>
      <nav className='container mx-auto flex justify-between items-center'>
        <div className='flex items-center'>
          <Link className='text-xl font-semibold hover:text-gray-300' href='/'>
            HOME
          </Link>
        </div>

        <div>
          <Link className='text-lg hover:text-gray-300' href='/login'>
            ログイン
          </Link>
        </div>
      </nav>
    </header>
  );
}
