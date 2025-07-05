import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    host: true,
    open: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  optimizeDeps: {
    exclude: ['canvas']
  },
  resolve: {
    alias: {
      canvas: path.resolve(__dirname, 'src/shims/canvas.js')
    }
  }
})
