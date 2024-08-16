<script setup>
// import { onMounted, ref } from 'vue'
const props = defineProps(['aea-model'])

console.log('TemplateComponent', props.aeaModel)

function getStyle(element) {
  let y = element.y - (element.height || 0);
  let top = (y/82.55)*100
  if (element.constructor.name === 'LogoElement') {
    top -= 10; // the logo is 10% high in the CSS below
  }
  top += '%'
  if (element.constructor.name === 'TextElement') {
    top = `calc(${top} - 1em)`;
  }

  const style = {
    width: `${(element.width/187.33)*100}%`,
    top, //: `${(y/82.55)*100}%`,
    left: `${(element.x/187.33)*100}%`,
    // transform: `translate(${(element.x/187.33)*100}%, ${((82.55-element.y)/82.55)*100}%)`,
  };
  if (element.width) {
    style.width = `${(element.width/187.33)*100}%`;
  }
  if (element.height) {
    style.height = `${(element.height/82.55)*100}%`;
  }
  return style;
}
</script>

<template>
  <h2 class="font-bold text-lg">Boarding Pass Template #{{props.aeaModel.id}}</h2>
  <div class="template-container border border-gray-300">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1873 825">
    </svg>

    <template v-for="(element, key) in props.aeaModel.elements" :key="key">
      <pre v-if="element.constructor.name === 'TextElement'" :style="getStyle(element)"><span>{{ key }}</span>{{ element.text }}</pre>
      <div class="box" v-if="element.constructor.name === 'BoxElement'" :style="getStyle(element)">
        <span>{{ key }}</span>
      </div>
      <div class="logo" v-if="element.constructor.name === 'LogoElement'" :style="getStyle(element)">
        <span>{{ key }}</span>
        LOGO
      </div>
      <div class="line" v-if="element.constructor.name === 'LineElement'" :style="getStyle(element)"></div>
    </template>
  </div>
  <details>
    <summary>Model</summary>
    <pre>{{ props.aeaModel.toString() }}</pre>
  </details>
</template>

<style scoped>
.template-container {
  --width-ratio: 2.27;
  position: relative;

  > div, > pre {
    position: absolute;
  }
  .box, .line {
    border: solid 1px black;
  }
  pre {
    //border: solid 1px black;
    //background-color: lightcyan;
  }
  .line {
    border-width: 1px 0 0 0;
  }
  .logo {
    background-color: grey;
    width: 10%;
    height: 10%;
    transform-origin: bottom left;
  }
  span {
    @apply absolute text-white rounded px-0.5 text-xs top-0 left-0;
    display: none;
    background-color: dodgerblue;
    border: solid 1px #333;
  }
  &:hover span {
    display: block;
  }
}
details {
  font-size: .75em;
}
</style>
