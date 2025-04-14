import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,
      deps: {
        inline: ['@vue', '@vueuse', 'pinia'],
      },
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'html'],
        exclude: ['node_modules/'],
      },
    },
  }),
)
