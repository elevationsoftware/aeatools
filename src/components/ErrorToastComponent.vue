<script setup>
import { useAppStore } from '@/stores/appStore.js'
const app = useAppStore()
</script>

<template>
  <div v-if="app.error" class="error">
    {{app.error}}
  </div>
</template>

<style scoped>
.error {
  @apply absolute top-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg
}
</style>
