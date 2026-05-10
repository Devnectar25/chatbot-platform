import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget-main.tsx'),
      name: 'HomevedaChatbot',
      fileName: (format) => `chatbot-widget.${format === 'iife' ? 'js' : 'js'}`,
      formats: ['iife'],
    },
    rollupOptions: {
      // Ensure that we don't externalize dependencies that we want bundled
      output: {
        extend: true,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': { NODE_ENV: 'production' },
  },
});
