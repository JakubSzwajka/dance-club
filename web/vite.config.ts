import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    allowedHosts: ['www.mydancedna.com', 'mydancedna.com', 'www.mydancedna.pl', 'mydancedna.pl'],
  },
})
