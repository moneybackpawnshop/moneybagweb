import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // ✅ for GitHub Pages

  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      '/gold-api': {
        target: 'https://goldtraders.or.th',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace('/gold-api', '/api/GoldPrices'),
      },
    },
  },

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
    '**/*.gif',
  ],
})