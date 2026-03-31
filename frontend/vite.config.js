import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 3005,
    host: true, // Listen on all addresses (0.0.0.0)
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // Build configuration for production
  build: {
    // Output directory
    outDir: 'dist',
    
    // Clean output directory before build
    emptyOutDir: true,
    
    // Minify production builds
    minify: 'terser',
    
    // Source maps for debugging (disabled in production for smaller bundle)
    sourcemap: process.env.VITE_SOURCE_MAP === 'true',
    
    // Terser options for minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom'
          ],
          'ui': [
            'react-helmet-async',
            'react-markdown'
          ],
          'export': [
            'html2canvas',
            'jspdf',
            'canvas-confetti'
          ]
        }
      }
    }
  },

  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-helmet-async',
      'react-markdown'
    ]
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})
