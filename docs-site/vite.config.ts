import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-generated-content',
      closeBundle() {
        const sourceFile = resolve(__dirname, 'content.generated.js');
        const targetFile = resolve(__dirname, 'dist', 'content.generated.js');

        if (existsSync(sourceFile)) {
          copyFileSync(sourceFile, targetFile);
        }
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5555
  }
});
