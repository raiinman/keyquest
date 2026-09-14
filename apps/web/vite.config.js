import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: { outDir: process.env.APPDEPLOY_VITE_OUT_DIR || 'dist', sourcemap: false, rollupOptions: { maxParallelFileOps: 128 } },
});

