import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tailwindcss(), viteReact()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      exclude: [
        '**/_generated/**',
        'src/routeTree.gen.ts',
        'src/routes/__root.tsx',
        'scripts/**',
        'tests/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        'eslint.config.js',
        'vite.config.ts',
        'vitest.config.ts',
        '.output/**',
        'public/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
