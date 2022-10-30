import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import postcssPxToViewport from 'postcss-px-to-viewport';
import { createHtmlPlugin } from 'vite-plugin-html';
import compressPlugin from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const root = process.cwd();
  const { VITE_PORT, VITE_APP_TITLE, VITE_ENV } = loadEnv(mode, root);

  return defineConfig({
    root,
    server: {
      host: true,
      port: VITE_PORT
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:math";
          `
        }
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
          }),
          postcssPxToViewport({
            viewportWidth: 375
          })
        ]
      }
    },
    plugins: [
      vue(),
      Components({
        resolvers: [VantResolver()]
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: VITE_APP_TITLE
          }
        }
      }),
      VitePWA({
        workbox: {
          cacheId: 'custom-cache',
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.origin === 'https://itunes.apple.com',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                cacheableResponse: {
                  statuses: [200]
                }
              }
            },
            {
              urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  // 最多30个图
                  maxEntries: 30
                }
              }
            },
            {
              urlPattern: /(.*?)\.(html|css|js)/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'html-css-js-cache',
                expiration: {
                  maxEntries: 30, // 最多缓存30个，超过的按照LRU原则删除
                  maxAgeSeconds: 30 * 24 * 60 * 60
                },
                cacheableResponse: {
                  statuses: [200]
                }
              }
            }
          ]
        },
        // 取消注册
        selfDestroying: false
      }),
      VITE_ENV === 'production' &&
        compressPlugin({
          ext: '.gz'
        })
    ].filter(Boolean)
  });
};
