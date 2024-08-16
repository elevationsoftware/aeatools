<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const props = defineProps(['tabs'])
const route = useRoute()

const currentTab = computed(() => {
  return props.tabs.find(tab => route.path.startsWith(tab.route))?.name || ''
})
</script>

<template>
  <nav class="bg-gray-800 text-white w-full">
    <div class="flex items-center justify-between h-16 px-4 relative">
      <div class="flex items-center absolute left-4">
        <span class="text-xl font-semibold">AEA Tools</span>
      </div>
      <div class="flex justify-center w-full">
        <div class="flex space-x-1">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.route"
            class="px-3 py-2 text-sm font-medium rounded-md"
            :class="[
              route.path.startsWith(tab.route)
                ? 'bg-white text-gray-800'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            {{ tab.name }}
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
