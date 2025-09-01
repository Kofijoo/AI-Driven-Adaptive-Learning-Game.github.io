import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          babylon: ['@babylonjs/core', '@babylonjs/loaders', '@babylonjs/materials']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    https: false
  },
  preview: {
    port: 4173,
    host: true
  }
});