import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deliberately no aliases: the library must resolve from node_modules (the packed tarball).
export default defineConfig({
  plugins: [react()],
});
