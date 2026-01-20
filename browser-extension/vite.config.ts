import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './public/manifest.json'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest as any }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'index.html'),
        content: path.resolve(__dirname, 'src/content/index.tsx'),
        background: path.resolve(__dirname, 'src/background/index.ts'),
      },
    },
  },
})
