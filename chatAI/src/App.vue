<script setup lang="ts"></script>

<template>
  <div id="app">
    <!-- 路由出口：由 Router 渲染匹配的组件 -->
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
  font-family: sans-serif;
  position: relative;
}

body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../img/背景2.png') no-repeat center/cover;
  background-attachment: fixed;
  z-index: -1;
  filter: brightness(0.8);
}

#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #FFD700;
  height: 100%;
  margin: 0;
  padding: 15px;
  position: relative;
  z-index: 1;
}
</style>
