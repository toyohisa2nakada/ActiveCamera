import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/libQuarks.js',
      fileName: 'explosion-bundle',
      formats: ['es']
    },
    rollupOptions: {
      external: ['three'],
      output: {
        format: 'es',
        globals: {
          three: 'THREE',
        },
      }
    },
    minify: false  // デバッグしやすくするため（本番では true）
  }
});