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
    proxy: {
      '/cabins': 'https://aike-api.onrender.com'
    }
  }
})
