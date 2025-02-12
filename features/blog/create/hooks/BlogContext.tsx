import { Blog as PrismaBlog } from '@prisma/client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Blog = Pick<PrismaBlog, 'title' | 'content'>;

type BlogContextType = {
  blog: Blog;
  setBlog: (blog: Blog) => void;
};

const BlogContext = createContext<BlogContextType | undefined>(undefined);

type BlogProviderProps = {
  children: ReactNode;
  blog?: Blog;
};

export const BlogProvider = (props: BlogProviderProps) => {
  const [blog, setBlog] = useState<Blog>(props.blog ?? { title: '', content: '' });

  return <BlogContext.Provider value={{ blog, setBlog }}>{props.children}</BlogContext.Provider>;
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used with in a BlogProvider');
  }
  return context;
};
