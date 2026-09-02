import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // If you hit CORS trouble while developing against Django on :8000,
    // you can proxy API calls through Vite instead of dealing with CORS headers.
    // Uncomment this and call your API as "/api/..." from the frontend.
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8000',
    //     changeOrigin: true,
    //   },
    // },
  },
})
