import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      webp: {
        // Целевое качество для .webp изображений
        quality: 75,
        lossless: false,
      },
      // Вы можете добавить настройки и для других форматов
      // jpg: { quality: 80 },
      // png: { quality: 80 },
    }),
    VitePWA({
      // registerType 'autoUpdate' будет автоматически скачивать новую версию игры
      // и применять её при следующем заходе, как и требуется в ТЗ 4.1.
      registerType: 'autoUpdate',
      // devOptions включены для тестирования Service Worker в режиме разработки.
      devOptions: {
        enabled: true
      },
      // Указываем путь к манифесту нашего веб-приложения.
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
            src: '/img/ui/anvil.webp', // Путь к вашей существующей иконке
            sizes: '192x192',
            type: 'image/webp', // Указываем правильный тип файла
          },
          {
            src: '/img/ui/anvil.webp', // Путь к вашей существующей иконке
            sizes: '512x512',
            type: 'image/webp', // Указываем правильный тип файла
          },
        ],
      },
      // Конфигурация Workbox для генерации Service Worker.
      workbox: {
        // globPatterns будет кэшировать все необходимые ассеты.
        // Это покрывает требования ТЗ 2.2.1, 2.2.2 и 2.2.3.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,mp3}'],
        // Стратегия кэширования для навигационных запросов (основной HTML файл).
        navigateFallback: '/index.html',
        // Стратегии для обработки ресурсов во время работы приложения.
        runtimeCaching: [
          {
            // Стратегия Stale-While-Revalidate для всех статичных ассетов.
            // Это соответствует требованию ТЗ 6.1.2.
            urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'script' || request.destination === 'style' || request.destination === 'font' || request.destination === 'audio',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets-cache',
              expiration: {
                maxEntries: 1000, // Максимальное количество файлов в кэше
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
    outDir: 'dist', // Папка, куда Vite соберет проект (по умолчанию 'dist')
  }
});