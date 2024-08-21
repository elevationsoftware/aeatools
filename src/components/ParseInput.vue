<script setup>
import { ref } from 'vue'
import { CommandParsers, Models } from 'aea.js'
import LogoComponent from '@/components/LogoComponent.vue'
import PectabComponent from '@/components/PectabComponent.vue'
import BPTemplateComponent from '@/components/BPTemplateComponent.vue'
// import BagTagTableComponent from '@/components/BagTagTableComponent.vue'
// import BagTagDataComponent from '@/components/BagTagDataComponent.vue'
import PrintModelComponent from '@/components/PrintModelComponent.vue'
import { useAppStore } from '@/stores/appStore.js'
const app = useAppStore();

const aea_models = ref([]);
const btm = ref(null);

function keydown(event) {
  const value = event.target.value.trim();
  if (event.code !== 'Enter') return;
  event.preventDefault();
  if (value.length < 4) return;

  let cmd = value.substring(0, 2);
  if (cmd.startsWith('BT')) {
    cmd += value[2]; // handle BTT, BTP
  }
  const parser = CommandParsers[cmd];
  if (!parser) {
    app.showError(`Unknown command: ${cmd}`);
    return
  }

  try {
    const model = parser(value);
    if (model instanceof Models.Logo) {
      model.image; // force the image to be parsed
    }
    console.log(model.constructor.name, model);
    aea_models.value.push(model);
    setTimeout(() => btm.value.scrollIntoView({ behavior: 'smooth' }), 100);
  }
  catch (e) {
    app.showError(e.message);
    console.error(e);
  }
}
function getType(model) {
  if (model instanceof Models.Logo) return LogoComponent;
  if (model instanceof Models.ParametricTable) return PectabComponent;
  if (model instanceof Models.Template) return BPTemplateComponent;
  // if (model instanceof Models.BagTagTable) return BagTagTableComponent;
  // if (model instanceof Models.BagTagData) return BagTagDataComponent;
  return PrintModelComponent; // unfinished work
}
</script>

<template>
  <article class="p-6 mb-2 h-32 overflow-y-auto whitespace-pre-wrap flex-grow">
    Enter AEA commands below...
    <div v-for="(model, index) in aea_models" :key="index" class="mb-5 border border-gray-400 rounded-lg p-4">
      <component :is="getType(model)" :aea-model="model"></component>
    </div>
    <div ref="btm"></div>
  </article>
  <textarea class="w-full h-1/3 border p-2"
            placeholder="LT3312340A...&#10;&#10;Press enter to submit"
            @keydown="keydown"></textarea>
</template>

<style scoped>
article > div {
  background-color: cornsilk;
  color: var(--text-color-dark);
}
textarea {
  background-color: #2c2c2c;
  color: #a7a7a7;
}
</style>
