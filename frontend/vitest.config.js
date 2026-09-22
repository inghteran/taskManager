// Parche global a nivel de proceso antes de que Vitest inicialice JSDOM/Undici
const g = globalThis
if (typeof g.webidl === 'undefined') {
  g.webidl = { util: { markAsUncloneable: () => {} } }
} else if (!g.webidl.util) {
  g.webidl.util = { markAsUncloneable: () => {} }
} else if (!g.webidl.util.markAsUncloneable) {
  g.webidl.util.markAsUncloneable = () => {}
}

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['**/node_modules/**', '**/e2e/**'],
    pool: 'forks',
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },
  },
})