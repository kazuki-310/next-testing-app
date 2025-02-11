/**
 * 各設定プロパティの詳細な説明については、以下を参照してください:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  // Jestがテストを実行する環境を指定
  testEnvironment: 'jest-environment-jsdom',

  // jestがテストを実行する前に読み込むセットアップファイルを指定
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default createJestConfig(config);
