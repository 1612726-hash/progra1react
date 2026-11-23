import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Redirige peticiones /api al backend configurado o Render por defecto
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'https://proyecto-final-1ong.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
