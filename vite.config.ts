import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}, // This will mock the `process` object for browser use.
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    outDir: 'public', // or 'dist', adjust according to Firebase hosting config
  },
});
