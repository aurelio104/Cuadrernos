import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    host: true, // Accesible en LAN
    open: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  optimizeDeps: {
    exclude: ['canvas'] // Previene errores de dependencias nativas
  },
  resolve: {
    alias: {
      // 🔧 Redirige cualquier import accidental de canvas
      canvas: path.resolve(__dirname, 'src/shims/canvas.js')
    }
  }
})
