import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/moneybagweb/', // 👈 MUST match repo name exactly

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: [
    '**/*.svg',
    '**/*.csv',
    '**/*.txt',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif'
  ],
})