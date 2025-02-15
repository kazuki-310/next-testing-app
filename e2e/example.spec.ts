import { test, expect } from '@playwright/test';

test('未認証時のヘッダーナビゲーションをテストする', async ({ page }) => {
  // トップページにアクセス
  await page.goto('/');

  // HOMEリンクが表示されていることを確認
  await expect(page.getByRole('link', { name: 'HOME' })).toBeVisible();

  // ログインリンクが表示されていることを確認
  await expect(page.getByRole('link', { name: 'ログイン' })).toBeVisible();

  // ログインページへ遷移
  await page.getByRole('link', { name: 'ログイン' }).click();

  // ログインページへ遷移したことを確認
  await expect(page).toHaveURL('/login');

  // ログインボタンの存在を確認
  await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible();

  // HOMEからトップページへ戻る
  await page.getByRole('link', { name: 'HOME' }).click();

  // トップページへ遷移したことを確認
  await expect(page).toHaveURL('/');
});
