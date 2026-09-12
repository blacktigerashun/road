import { createRouter, createWebHistory } from 'vue-router'
// 导入 Chat 组件（也可封装成单独页面组件）
import Chat from '../components/Chat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Chat',
      component: Chat,
    },
  ],
})

export default router
