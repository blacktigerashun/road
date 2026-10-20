import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // 构建后由后端统一以 /chat/ 路径托管（与 Express 静态服务对应）
  base: '/chat/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 开发模式（npm run dev）下把 /api 请求代理到后端，方便本地调试
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 构建产物输出到项目总目录下的 chat 文件夹，供 Express 静态托管
    outDir: '../chat',
    emptyOutDir: true,
  },
})
