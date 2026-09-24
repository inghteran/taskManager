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
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Definición estándar de __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    pool: 'threads',
   
    exclude: ['**/node_modules/**', '**/e2e/**'],
    execArgv: ['--require', path.resolve(__dirname, './patch.js')],
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