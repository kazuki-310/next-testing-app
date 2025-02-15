import { defineConfig, devices } from '@playwright/test';

const PORT = '3333';

const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',

  // すべてのテストは並列して実行される
  fullyParallel: true,

  // 環境変数CIが設定されている場合、test.onlyがテストコードに残っていると
  // テストが失敗するようになる
  forbidOnly: !!process.env.CI,

  // CI環境でテストを実行する場合、最大2回までリトライする。
  // ローカルではリトライしない
  retries: process.env.CI ? 2 : 0,

  // CI環境ではテストを並列して実行しない
  // ローカル環境ではデフォルトの設定
  workers: process.env.CI ? 1 : undefined,

  // テストの結果をHTML形式で出力するようにする
  reporter: 'html',

  webServer: {
    // テスト実行時に使用するコマンド
    // この場合はポート番号を指定して開発サーバーを起動する
    command: `PORT=${PORT} npm run dev`,

    // テスト実行時のベースURL
    // テスト前にサーバーが起動しているか確認するために使う
    url: baseURL,

    // タイムアウト時間を120秒に設定
    timeout: 120 * 1000,

    // すでに起動しているサーバーがあれば再利用する
    reuseExistingServer: true,
  },

  use: {
    // テストが失敗した際にリトライするときのトレース設定
    trace: 'on-first-retry',

    // テスト実行時のベースURL
    // ページへのアクセスする際に使うURL
    baseURL,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
