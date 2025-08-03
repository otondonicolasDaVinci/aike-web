import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      styles: path.resolve(__dirname, 'src/pages/styles')
    }
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
    },
    proxy: {
      '/cabins': process.env.VITE_API_BASE_URL as string
    }
  }
})
