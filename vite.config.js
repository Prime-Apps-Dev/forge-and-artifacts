import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: 'dist', // Папка, куда Vite соберет проект (по умолчанию 'dist')
  }
});