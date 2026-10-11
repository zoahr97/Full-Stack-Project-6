import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  server: {
    port: 5173,
    proxy: {
      '/auth':      { target: 'http://localhost:3001', changeOrigin: true },
      '/travelers': { target: 'http://localhost:3001', changeOrigin: true },
      '/journal':   { target: 'http://localhost:3001', changeOrigin: true },
      '/users':     { target: 'http://localhost:3001', changeOrigin: true },
      '/posts':     { target: 'http://localhost:3001', changeOrigin: true },
      '/admin':     { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
});