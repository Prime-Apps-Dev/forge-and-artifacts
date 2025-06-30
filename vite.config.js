import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      webp: {
        quality: 75,
        lossless: false,
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Forge & Artifacts: Зов Наследия',
        short_name: 'Forge & Artifacts',
        description: 'Станьте легендарным Кузнецом, создавайте артефакты и оставьте своё наследие в мире Forge & Artifacts.',
        theme_color: '#1c1c1e',
        background_color: '#1c1c1e',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/img/ui/anvil.webp',
            sizes: '192x192',
            type: 'image/webp',
          },
          {
            src: '/img/ui/anvil.webp',
            sizes: '512x512',
            type: 'image/webp',
          },
        ],
      },
      workbox: {
        // Увеличиваем лимит, чтобы сборка не ругалась на большие аудиофайлы.
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        
        // ИЗМЕНЕНИЕ: Исключаем .webp из списка предварительного кэширования.
        // Это решает проблему дублирования иконки anvil.webp.
        // Плагин PWA сам добавит иконки из манифеста, а остальные .webp файлы
        // будут кэшироваться "на лету" благодаря runtimeCaching ниже.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Эта стратегия по-прежнему будет обрабатывать все ассеты, включая аудио,
            // но уже во время работы приложения, а не при установке Service Worker.
            urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'script' || request.destination === 'style' || request.destination === 'font' || request.destination === 'audio',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
  }
});