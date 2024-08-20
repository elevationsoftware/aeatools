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
  <header class="bg-gray-800 p-4 grid grid-cols-[auto_auto] items-center">
    <div class="text-xl font-bold">AEA Tools</div>
    <div>
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
  </header>
</template>
