'use client';

import { baseUserSchema } from '@/schema/userSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

const userSchema = baseUserSchema.omit({ name: true });
type FormData = z.infer<typeof userSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      await signIn('credentials', { ...data, callbackUrl: '/' });
    } catch {
      setErrorMessage('ログイン中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 w-full text-gray-700'>
      <div>
        <label htmlFor='email' className='block text-md font-medium text-gray-700'>
          メールアドレス
        </label>
        <input
          id='email'
          placeholder='user@example.com'
          {...register('email')}
          className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm'
        />
        {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor='password' className='block text-md font-medium text-gray-700'>
          パスワード
        </label>
        <input
          id='password'
          type='password'
          placeholder='password'
          {...register('password')}
          className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm'
        />
        {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
      </div>

      <div>
        <button
          type='submit'
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          disabled={isLoading}
        >
          {isLoading ? 'Loading' : 'ログイン'}
        </button>
        {errorMessage && <p className='text-red-500 text-sm mt-1'>{errorMessage}</p>}
      </div>
    </form>
  );
}
