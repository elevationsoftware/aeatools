<script setup>
import { RouterView } from 'vue-router'
import TabNavigation from './components/TabNavigation.vue'

const tabs = [
  { name: 'Connect', route: '/connect' },
  { name: 'Parse', route: '/parse' }
]
</script>

<template>
  <div class="h-screen flex flex-col">
    <TabNavigation :tabs="tabs" />
    <RouterView class="flex-grow" />
  </div>
</template>
