import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import postcssPxToViewport from 'postcss-px-to-viewport';
import { createHtmlPlugin } from 'vite-plugin-html';
import compressPlugin from 'vite-plugin-compression';

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
      VITE_ENV === 'production' &&
        compressPlugin({
          ext: '.gz'
        })
    ].filter(Boolean)
  });
};
