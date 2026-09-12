/// <reference types="vite/client" />
/// <reference types="vite/client" />

// 声明 .vue 单文件组件的类型，解决 TypeScript 无法识别 .vue 文件的问题
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // 定义组件类型，排除了 props/emits 等复杂类型，适合大部分场景
  const component: DefineComponent<{}, {}, any>
  export default component
}
