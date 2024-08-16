<script setup>
import { useWebUSBStore } from '@/stores/WebUSBStore.js';
import { RouterView } from 'vue-router'
const usb = useWebUSBStore();
console.log(usb)
</script>

<template>
  <div class="flex flex-grow h-full">
    <div class="relative flex-grow flex flex-col">
      <aside class="p-2 w-64 bg-gray-100 border-r h-full flex-shrink-0 text-black flex flex-col justify-between">
        <div>
          <h2 class="font-bold text-lg">{{ usb.connected_device.device.productName }}</h2>
          <small>{{ usb.connected_device.device.manufacturerName }}</small>
          <small>{{ usb.connected_device.device.serialNumber }}</small>
        </div>

        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                @click="usb.connected_device.disconnect()">
          Disconnect
        </button>
      </aside>
      <section>
        Connected
        <input class="w-full h-1/3 border p-2"
               placeholder="LT3312340A...&#10;&#10;Press enter to submit"
               @keydown="keydown"></input>
      </section>
    </div>
  </div>
</template>

<style scoped>
</style>
