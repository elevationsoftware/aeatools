import { ref } from 'vue'
import { defineStore } from 'pinia'
import { BulkUSBDevice } from '@/models/BulkUSBDevice.js'

const paired = ref([])
const status = ref(null)
const connected_device = ref(null);

navigator.usb.addEventListener("connect", (event) => {
  console.log('Device connected', event)
  getPairedDevices();
});

navigator.usb.addEventListener("disconnect", (event) => {
  console.log('Device disconnected', event)
  getPairedDevices();
  if (connected_device.value && connected_device.value.device === event.device) {
    status.value = null
  }
});

function getPairedDevices() {
  navigator.usb.getDevices().then(devices => {
    console.log('getPairedDevices', paired.value = [...devices]);
  })
}
getPairedDevices();

async function requestDevice() {
  try {
    const device = await navigator.usb.requestDevice({ filters: [] });
    if (paired.value.indexOf(device) === -1) {
      paired.value.push(device);
    }
    console.log('Device selected:', device);
    return connect(device);
  } catch (error) {
    if (error.message.includes('No device selected')) {
      return;
    }
    console.error('Error selecting device:', error);
    throw error;
  }
}

async function connect(device) {
  try {
    status.value = 'connecting'
    // await sleep(1000);
    connected_device.value = await BulkUSBDevice.connect(device)
    connected_device.value.on('disconnect', () => {
      status.value = null
      connected_device.value = null;
    });
    window.dev = connected_device.value;
    connected_device.value.startReading();
    status.value = 'connected'
    return connected_device.value;
  }
  catch (error) {
    status.value = 'error'
    connected_device.value = null;
    throw error;
  }
}

function forget(device) {
  if (!(device instanceof USBDevice)) {
    console.log('Device is not a USBDevice');
  }
  else {
    try {
      device.forget();
      // For some reason, if you try to connect again- the throws and error.
      // This is a workaround...
      window.location.reload();
    }
    catch (error) {
      console.error('Error forgetting device:', error);
    }
  }
  getPairedDevices();
}

export const useWebUSBStore = defineStore('WebUSB', () => {
  return {
    paired,
    requestDevice,
    connect,
    forget,
    status,
    connected_device,
  }
})
