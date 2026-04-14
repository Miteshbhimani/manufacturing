import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in current working directory.
  // Set third parameter to '' to load all env regardless of `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Bundle analysis in development
      mode === 'development' && {
        name: 'bundle-analyzer',
        generateBundle() {
          console.log('🔍 Bundle analysis available in development mode');
        }
      }
    ].filter(Boolean),
    server: {
      allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0'],
      host: true,
      port: Number(env.FRONTEND_PORT) || 5173
    },
    
    // Build optimizations
    build: {
      target: 'es2015',
      minify: 'terser',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) return 'vendor';
              if (id.includes('react-router')) return 'router';
              if (id.includes('radix-ui')) return 'ui';
              if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('date-fns')) return 'utils';
              if (id.includes('three') || id.includes('@react-three')) return 'three';
              if (id.includes('canvas-confetti')) return 'heavy';
            }
            return 'default';
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    
    // Dependencies optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'clsx',
        'tailwind-merge'
      ]
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@features': resolve(__dirname, 'src/features'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@types': resolve(__dirname, 'src/types'),
        '@assets': resolve(__dirname, 'src/assets')
      }
    },
    
    // CSS configuration
    css: {
      devSourcemap: mode === 'development',
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    
    // Preview configuration
    preview: {
      port: 4173,
      host: true
    }
  }
})
