import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Bundle-Optimierungen
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor-Chunk für React Libraries
          vendor: ['react', 'react-dom'],
          // Separate Chunks für große Libraries falls vorhanden
        }
      }
    },
    // Chunk-Größe-Warnungen konfigurieren
    chunkSizeWarningLimit: 1000,
    // Minification aktivieren
    minify: 'terser',
    // Source Maps für Production deaktivieren
    sourcemap: false,
    // CSS Code-Splitting aktivieren
    cssCodeSplit: true
  },
  server: {
    // HMR-Performance verbessern
    hmr: {
      overlay: false
    }
  },
  // Dependency Pre-bundling optimieren
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
