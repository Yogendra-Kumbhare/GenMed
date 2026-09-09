import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'GenericMed Patient Portal',
          short_name: 'GenericMed',
          description: 'Manage medications, track doses, order refills, and maximize savings with generic drugs.',
          theme_color: '#0f766e',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
          categories: ['health', 'medical', 'lifestyle'],
          shortcuts: [
            { name: 'Dashboard', short_name: 'Dashboard', description: 'View today\'s doses', url: '/?page=dashboard', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
            { name: 'Medicine Cabinet', short_name: 'Cabinet', description: 'View your medications', url: '/?page=cabinet', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^\/api\/auth\/me$/,
              handler: 'NetworkFirst',
              options: { cacheName: 'api-user', expiration: { maxAgeSeconds: 300 } },
            },
            {
              urlPattern: /^\/api\/medications$/,
              handler: 'NetworkFirst',
              options: { cacheName: 'api-medications', expiration: { maxAgeSeconds: 60 } },
            },
            {
              urlPattern: /^\/api\/doses\/today$/,
              handler: 'NetworkFirst',
              options: { cacheName: 'api-doses-today', expiration: { maxAgeSeconds: 30 } },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
