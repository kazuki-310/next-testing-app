import { BlogForm } from '@/features/blog/create/components/BlogForm';

export default function BlogPage() {
  return (
    <main className='flex flex-col items-center justify-between p-24 text-black'>
      <BlogForm />
    </main>
  );
}
