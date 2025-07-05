import { defineConfig } from 'vite'

// Configuración para servir archivos estáticos desde `public/` automáticamente
export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    host: true,          // ⬅️ ¡Esto permite acceder desde tu IP local!
    open: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
