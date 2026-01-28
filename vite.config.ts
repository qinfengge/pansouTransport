import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          injectRegister: 'auto',
          manifest: {
            name: 'CloudSync - 云资源管理与传输工具',
            short_name: 'CloudSync',
            description: '一款快速、安全、智能的云资源管理与传输工具。',
            theme_color: '#2b8cee',
            background_color: '#ffffff',
            display: 'standalone',
            scope: '/',
            start_url: '/',
            icons: [
              {
                src: 'logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: 'logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
              },
              {
                src: 'logo.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable'
              },
              {
                src: 'logo.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
              }
            ],
            categories: ['productivity', 'utilities']
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'gstatic-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  }
                }
              },
              {
                urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'tailwind-cache',
                  expiration: {
                    maxEntries: 5,
                    maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                  }
                }
              }
            ]
          },
          devOptions: {
            enabled: false,
            suppressWarnings: true,
            navigateFallback: 'index.html',
            type: 'module'
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
