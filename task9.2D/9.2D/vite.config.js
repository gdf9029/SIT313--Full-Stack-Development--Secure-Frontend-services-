import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Custom plugin to ignore HTML parsing errors
const ignoreHtmlErrors = () => ({
  name: 'ignore-html-errors',
  apply: 'serve',
  enforce: 'pre',
  async resolveId(id) {
    if (id.endsWith('.html')) {
      return id;
    }
  },
  async load(id) {
    if (id.endsWith('.html')) {
      return '';
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      ignoreHtmlErrors(),
      react(),
      tailwindcss(),
  ],
  server: {
    // Configure proxy for Netlify functions during development
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
    middlewareMode: false,
    fs: {
      allow: ['.'],
    },
  },
})
