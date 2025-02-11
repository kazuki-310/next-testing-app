import { z } from 'zod';

export const baseUserSchema = z.object({
  name: z.string().min(1, 'このフィールドは必須です。'),
  email: z.string().email('正しいメールアドレス形式ではありません'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
});
