import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunks
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI/UX libraries
          'ui-components': ['react-hook-form', 'react-hot-toast'],
          'ui-calendar': ['react-calendar'],
          'ui-intersection': ['react-intersection-observer'],
          
          // State management & utilities
          'state-management': ['zustand'],
          'utils': ['axios', 'date-fns', 'uuid'],
          
          // Firebase & real-time
          'firebase': ['firebase', 'react-firebase-hooks'],
          
          // Internationalization
          'i18n': ['i18next', 'react-i18next'],
          
          // WebSocket
          'websocket': ['socket.io-client'],
          
          // Feature-based chunks for better caching
          'feature-auth': ['./src/presentation/pages/auth'],
          'feature-chat': ['./src/presentation/pages/chat'],
          'feature-channel': ['./src/presentation/pages/channel'],
          'feature-analysis': ['./src/presentation/pages/analysis'],
          'feature-assistant': ['./src/presentation/pages/assistant'],
          'feature-calendar': ['./src/presentation/pages/calendar'],
          'feature-payment': ['./src/presentation/pages/payment'],
          'feature-mypage': ['./src/presentation/pages/mypage'],
          'feature-invite': ['./src/presentation/pages/invite'],
          'feature-category': ['./src/presentation/pages/category'],
          'feature-examples': ['./src/presentation/pages/examples'],
          'feature-splash': ['./src/presentation/pages/splash'],
          
          // Component chunks
          'components-common': ['./src/presentation/components/common'],
          'components-specific': ['./src/presentation/components/specific'],
          'components-layout': ['./src/presentation/components/layout'],
          
          // Hook chunks
          'hooks': ['./src/presentation/hooks'],
          
          // Store chunks
          'stores': ['./src/stores'],
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
      },
    },
    // Optimize build settings
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild', // Use esbuild for better performance
    // Enable source maps for development
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'axios',
      'date-fns',
    ],
    exclude: ['firebase'], // Firebase should be loaded separately
  },
  // Development server optimization
  server: {
    hmr: {
      overlay: false,
    },
  },
  // Preview server optimization
  preview: {
    port: 4173,
    host: true,
  },
});
