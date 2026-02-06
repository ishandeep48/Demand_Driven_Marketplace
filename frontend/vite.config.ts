import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to backend
      // Note: The backend has mixed endpoints. Some started with /api, others at root like /register-user.
      // We will proxy specific paths based on the endpoints we know.
      '/register-user': {
        target: 'http://localhost:6969',
        changeOrigin: true,
        secure: false,
      },
      '/login-user': {
        target: 'http://localhost:6969',
        changeOrigin: true,
        secure: false,
      },
      '/products': {
        target: 'http://localhost:6969',
        changeOrigin: true,
        secure: false,
      },
      '/purchase-product': {
        target: 'http://localhost:6969',
        changeOrigin: true,
        secure: false,
      },
      '/total-amount': {
        target: 'http://localhost:6969', // for /total-amount/:id
        changeOrigin: true,
        secure: false,
      },
      '/mock-payment': {
        target: 'http://localhost:6969',
        changeOrigin: true,
        secure: false,
      },
      // Old existing code used /api, keeping it just in case logic matches
      '/api': {
        target: 'http://localhost:6969',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
