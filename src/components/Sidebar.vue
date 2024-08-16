<!-- components/Sidebar.vue -->
<script setup>
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps(['actions'])
const route = useRoute()

const getRouteName = (action) => {
  return action.toLowerCase().replace(/ /g, '-')
}
</script>

<template>
  <aside class="w-64 bg-gray-100 border-r h-full flex-shrink-0">
    <nav class="py-4">
      <ul>
        <li v-for="action in actions" :key="action" class="mb-2">
          <RouterLink
            :to="{ name: getRouteName(action) }"
            class="block px-4 py-2 hover:bg-gray-200"
            active-class="bg-gray-200 font-semibold"
          >
            {{ action }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
li {
  color: var(--text-color-dark);
}
</style>
