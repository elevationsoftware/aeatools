<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: '[Message]'
  }
})
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black opacity-80"></div>

    <!-- Modal -->
    <div class="relative bg-white rounded-lg p-8 shadow-xl">
      <h2 class="text-2xl font-bold mb-4">{{ message }}</h2>
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  </div>
</template>

<style scoped>

</style>
