<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'

const tabs = [
  { name: 'Connect', route: '/connect' },
  { name: 'Parse', route: '/parse' }
]
</script>

<template>
  <div class="h-screen grid grid-rows-[auto_1fr]">
    <Header :tabs="tabs" />
    <RouterView />
  </div>
</template>
