'use client';

import React, { useState } from 'react';
import { StepProvider, useStep } from '../hooks/StepContext';
import { BlogProvider, useBlog } from '../hooks/BlogContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { serverCreateBlog } from '../actions/actions';
import { StepIndicator } from './StepIndicator';

function BlogForm() {
  const { step } = useStep();

  return (
    <div className='w-[400px] flex flex-col items-center space-y-4'>
      <h2 className='text-2xl font-semibold'>ブログ投稿フォーム</h2>
      <div className='w-full'>
        <StepIndicator currentStep={step} />
      </div>

      <div className='w-full'>
        {step === 0 && <TitleInput />}
        {step === 1 && <ContentEditor />}
        {step === 2 && <PreviewBlog />}
      </div>
    </div>
  );
}

function BlogFormProviders() {
  return (
    <BlogProvider>
      <StepProvider>
        <BlogForm />
      </StepProvider>
    </BlogProvider>
  );
}

export { BlogFormProviders as BlogForm };

function TitleInput() {
  const { blog, setBlog } = useBlog();
  const { increment } = useStep();

  return (
    <div className='w-full space-y-4'>
      <div>
        <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
          タイトル
        </label>
        <input
          type='text'
          id='title'
          name='title'
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          placeholder='タイトルを入力してください'
        />
      </div>
      <div className='flex justify-end'>
        <button
          disabled={blog.title === ''}
          onClick={increment}
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none'
        >
          進む
        </button>
      </div>
    </div>
  );
}

function ContentEditor() {
  const { blog, setBlog } = useBlog();
  const { increment, decrement } = useStep();

  return (
    <div className='space-y-4'>
      <div>
        <label htmlFor='body' className='block text-sm font-medium text-gray-700'>
          本文
        </label>
        <textarea
          id='body'
          name='body'
          value={blog.content}
          onChange={(e) => setBlog({ ...blog, content: e.target.value })}
          rows={10}
          className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
          placeholder='本文を入力してください'
        />
      </div>
      <div className='flex justify-end space-x-4'>
        <button
          onClick={decrement}
          className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200'
        >
          戻る
        </button>
        <button
          disabled={blog.content === ''}
          onClick={increment}
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none'
        >
          進む
        </button>
      </div>
    </div>
  );
}

function PreviewBlog() {
  const { blog } = useBlog();
  const { decrement } = useStep();
  const session = useSession();
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleCreateBtn = async () => {
    const res = await serverCreateBlog({ blog });
    if (res.ok) {
      router.push('/');
      return;
    }
    setMessage(res.message);
  };

  return (
    <div>
      <div>
        <div className='mb-4'>
          <h3 className='text-md font-semibold'>ユーザー名:</h3>
          <p className='bg-gray-100 p-2 rounded'>{session.data?.user.name}</p>
        </div>
        <div className='mb-4'>
          <h3 className='text-md font-semibold'>タイトル:</h3>
          <p className='bg-gray-100 p-2 rounded'>{blog.title}</p>
        </div>
        <div className='mb-4'>
          <h3 className='text-md font-semibold'>本文:</h3>
          <p className='bg-gray-100 p-2 rounded whitespace-pre-wrap'>{blog.content}</p>
        </div>
      </div>
      <div className='flex justify-end space-x-4'>
        <button
          onClick={decrement}
          className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200'
        >
          戻る
        </button>
        <button
          onClick={handleCreateBtn}
          className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none'
        >
          作成する
        </button>
        {message && <p className='text-red-500 text-sm mt-1'>{message}</p>}
      </div>
    </div>
  );
}
