import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/apis": {
        target: "http://localhost:4000",
        rewrite: (path) => path.replace(/^\/apis/, '')
      }
    },
    host: '0.0.0.0',
  },
  build: {
    sourcemap: false
  }
})
