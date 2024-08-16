<script setup>
import Sidebar from '../components/Sidebar.vue'
import { RouterView } from 'vue-router'

const actions = ['Parse', 'Logos', 'Pectabs']
</script>

<template>
  <div class="flex flex-grow h-full">
    <div class="relative flex-grow flex flex-col">
      <RouterView />
    </div>
  </div>
</template>
