import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    open: true,
    port: 5173,
    proxy: {
      // 匹配 /midi-js-soundfonts 开头的请求代理到 https://gleitz.github.io/midi-js-soundfonts，
      // 设置 changeOrigin 为 true，更改源地址，以解决跨域问题。
      '/midi-js-soundfonts-1': {
        target: 'https://gleitz.github.io/midi-js-soundfonts',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/midi-js-soundfonts/, '') // 不可以省略rewrite
      }
    }
  },
  build: {
    outDir: 'out-dist'
  },

  // 部署到github page 
  // https://cn.vitejs.dev/guide/static-deploy.html#github-pages
  base: "/"
})
