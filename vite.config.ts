import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { host: '0.0.0.0', allowedHosts: true },
  preview: { host: '0.0.0.0', allowedHosts: true },
  build: { target: 'es2022' },
  test: {
    include: ['src/**/*.test.ts'],
  },
  lint: {
    ignorePatterns: ['dist/**'],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    semi: true,
    singleQuote: true,
  },
});
