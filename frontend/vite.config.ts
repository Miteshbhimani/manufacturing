import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
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
      allowedHosts: env.ALLOWED_HOSTS?.split(',') || [
        'localhost',
        '127.0.0.1',
        'teams-reflected-evans-ppc.trycloudflare.com',
        'stat-advertisers-powder-pleased.trycloudflare.com',
        'equations-analyses-nano-shareholders.trycloudflare.com',
        'quite-badge-shore-lighting.trycloudflare.com',
        'approx-morris-interventions-telling.trycloudflare.com',
        'executives-syndication-paperback-values.trycloudflare.com',
        'belongs-burning-advantages-piano.trycloudflare.com',
        'leg-camping-looked-nam.trycloudflare.com',
        'critical-michel-bind-reliable.trycloudflare.com',
        'symbols-computing-roger-spa.trycloudflare.com',
        'minister-gallery-hired-genetic.trycloudflare.com',
        'electronic-final-memory-mix.trycloudflare.com'
      ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api/auth/logout-redirect': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/odoo': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/web/image': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/web': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/web/session': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/web/dataset': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/web/action': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/mail': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/websocket': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/bus': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/im_livechat': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/longpolling': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/website': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/web_editor': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/logo': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      },
      '/favicon.ico': {
        target: env.ODOO_URL || 'http://localhost:8069',
        changeOrigin: true,
        secure: false
      }
    },
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
          manualChunks: {
            // Vendor chunks
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            utils: ['clsx', 'tailwind-merge', 'date-fns'],
            // Three.js for 3D components
            three: ['three', '@react-three/fiber', '@react-three/drei'],
            // Other heavy libraries
            heavy: ['axios', 'canvas-confetti']
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      } as any
    },
    
    // Dependencies optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'clsx',
        'tailwind-merge',
        'axios'
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
