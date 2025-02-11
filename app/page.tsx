import { getAuthSession } from '@/lib/auth';

export default async function Home() {
  const session = await getAuthSession();

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {session ? <div>{session.user.name} さん、こんにちは！</div> : <div>ログインしよう！</div>}
    </main>
  );
}
