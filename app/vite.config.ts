import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/mf-smart-parking-engine/',
  server: {
    port: 3000
  }
});
