import fs from 'node:fs'

import { fileURLToPath } from 'node:url'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
  VueRouterAutoImports,
  getPascalCaseRouteName,
} from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
/*import VueDevTools from 'vite-plugin-vue-devtools'*/
import Layouts from 'vite-plugin-vue-layouts'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  fs.rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    base: isServe ? '' : './',
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag =>
              tag === 'swiper-container' || tag === 'swiper-slide',
          },
        },
      }),

      // Docs: https://github.com/posva/unplugin-vue-router
      // ℹ️ This plugin should be placed before vue plugin
      VueRouter({
        getRouteName: routeNode => {
          // Convert pascal case to kebab case
          return getPascalCaseRouteName(routeNode)
            .replace(/([a-z\d])([A-Z])/g, '$1-$2')
            .toLowerCase()
        },
      }),

      /*VueDevTools(),*/
      vueJsx(),

      // Docs: https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
      vuetify({
        styles: {
          configFile: 'src/assets/styles/variables/_vuetify.scss',
        },
      }),

      // Docs: https://github.com/johncampionjr/vite-plugin-vue-layouts#vite-plugin-vue-layouts
      Layouts({
        layoutsDirs: './src/layouts/',
      }),

      // Docs: https://github.com/antfu/unplugin-vue-components#unplugin-vue-components
      Components({
        dirs: ['src/@core/components', 'src/views/demos', 'src/components'],
        dts: true,
        resolvers: [
          componentName => {
            // Auto import `VueApexCharts`
            if (componentName === 'VueApexCharts') {
              return {
                name: 'default',
                from: 'vue3-apexcharts',
                as: 'VueApexCharts',
              }
            }
          },
        ],
      }),

      // Docs: https://github.com/antfu/unplugin-auto-import#unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          VueRouterAutoImports,
          '@vueuse/core',
          '@vueuse/math',
          'vue-i18n',
          'pinia',
        ],
        dirs: [
          './src/@core/utils',
          './src/@core/composable/',
          './src/composables/',
          './src/utils/',
          './src/plugins/*/composables/*',
        ],
        vueTemplate: true,

        // ℹ️ Disabled to avoid confusion & accidental usage
        ignore: ['useCookies', 'useStorage'],
      }),

      svgLoader(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: 'electron/main/index.ts',
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App',
              )
            }
            else {
              startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons,
                // we can use `external` to exclude them to ensure they work correctly.
                // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
                // Of course, this is not absolute, just this way is relatively simple. :)
                external: Object.keys(
                  'dependencies' in pkg ? pkg.dependencies : {},
                ),
              },
            },
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys(
                  'dependencies' in pkg ? pkg.dependencies : {},
                ),
              },
            },
          },
        },

        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {},
      }),
    ],
    server:
      process.env.VSCODE_DEBUG
      && (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)

        return {
          host: url.hostname,
          port: +url.port,
        }
      })(),
    clearScreen: false,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@themeConfig': fileURLToPath(
          new URL('./themeConfig.ts', import.meta.url),
        ),
        '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
        '@images': fileURLToPath(
          new URL('./src/assets/images/', import.meta.url),
        ),
        '@styles': fileURLToPath(
          new URL('./src/assets/styles/', import.meta.url),
        ),
        '@configured-variables': fileURLToPath(
          new URL(
            './src/assets/styles/variables/_template.scss',
            import.meta.url,
          ),
        ),
        '@db': fileURLToPath(
          new URL('./src/plugins/fake-api/handlers/', import.meta.url),
        ),
        '@api-utils': fileURLToPath(
          new URL('./src/plugins/fake-api/utils/', import.meta.url),
        ),
      },
    },
    build: {
      chunkSizeWarningLimit: 5000,
    },
    optimizeDeps: {
      exclude: ['vuetify'],
      entries: ['./src/**/*.vue'],
    },
  }
})
