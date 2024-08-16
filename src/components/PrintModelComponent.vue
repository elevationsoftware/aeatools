<script setup>
const props = defineProps(['aea-model'])
</script>

<template>
  <h2 class="font-bold text-lg">{{ props.aeaModel.constructor.name }} #{{props.aeaModel.id}}</h2>
  <details open class="template-container border border-gray-300">
    <summary>Model</summary>
    {{ props.aeaModel }}
  </details>
</template>
