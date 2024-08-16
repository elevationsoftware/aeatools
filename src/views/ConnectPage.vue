<script setup>
import ConnectComponent from '@/components/ConnectComponent.vue'
import ConnectedComponent from '@/components/ConnectedComponent.vue'
import ModalComponent from '@/components/ModalComponent.vue'
import { useWebUSBStore } from '@/stores/WebUSBStore.js';
const usb = useWebUSBStore();

</script>

<template>
  <article>
    <ConnectedComponent v-if="usb.status === 'connected'" />
    <ConnectComponent v-else />
    <ModalComponent :show="usb.status === 'connecting'" message="Connecting..." />
  </article>
</template>

<style scoped>
</style>
