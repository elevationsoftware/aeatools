<script setup>
import { TrashIcon } from '@heroicons/vue/24/solid';
import { useWebUSBStore } from '@/stores/WebUSBStore.js';
import { useAppStore } from '@/stores/appStore.js'
const usb = useWebUSBStore();
const app = useAppStore();

function req() {
  usb.requestDevice().catch(app.showError)
}
function connect(device) {
  usb.connect(device).catch(app.showError)
}
window.asdf = usb;
</script>

<template>
  <article>
    <h2 class="text-2xl font-bold mb-4">Select your connection</h2>
    <section class="usb">
      <h3 class="text-2xl font-medium">USB</h3>
      <section class="paired" v-if="usb.paired">
        <p>Paired Devices:</p>
        <li class="list-none">
          <ul>
            <li v-for="device in usb.paired">
              <div class="flex">
                <div class="">
                  <a @click="connect(device)">
                    {{ device.manufacturerName }} - {{ device.productName }} ({{device.serialNumber}})
                  </a>
                </div>
                <div class="forget w-1/2 ml-4">
                  <TrashIcon class="h-6 w-6 text-red-500" title="Forget this device" @click="usb.forget(device)" />
                </div>
              </div>
            </li>
          </ul>
        </li>
      </section>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" @click="req()">
        Select New Device
      </button>
    </section>
<!--    <hr class="mt-8 mb-6">-->
<!--    <section class="serial">-->
<!--      <h3 class="text-2xl font-medium">Serial</h3>-->
<!--      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">-->
<!--        Select New Device-->
<!--      </button>-->
<!--    </section>-->
  </article>
</template>

<style scoped>
article {
  margin: 20px;
}
h3 {
  margin-bottom: 20px;
}
.usb {
  ul {
    list-style-type: square;
    margin-left: 20px;

    a:hover {
      cursor: pointer;
      color: white;
    }
    .forget {
      svg {
        opacity: 0;
        cursor: pointer;
      }
    }
    &:hover {
      svg {
        opacity: .3;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
.paired {
  margin-left: 20px;
}
</style>
