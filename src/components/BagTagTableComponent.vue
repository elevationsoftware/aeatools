<script setup>
import { ref } from 'vue'
import { CommandParsers } from 'aea.js'
import { useAppStore } from '@/stores/appStore.js'
const app = useAppStore();
const props = defineProps(['aea-model'])

const width = props.aeaModel.tag_width/10;
const mirror = props.aeaModel.mirror_point;
const bagtag_div = ref(null);
const BTP = ref(null);

function getStyles(el) {
  const h = el.type==='SEPARATOR' ? el.height/10 : el.height
  return {
    width: el.width? el.width+'mm' : undefined,
    height: h? h+'mm' : undefined,
    'font-size': h+'mm',
    'margin-top': (-h)+'mm',
    ...getTopLeft(el)
  }
}
function getTopLeft(el) {
  return {
    top: (el.vertical)+'mm',
    left: (width-el.horizontal)+'mm',
  }
}
function getClasses(el) {
  return {
    ['r-'+(el.orientation.rotate || 0)]: true,
    ['a-'+(el.orientation.align)]: true,
    reversed: el.orientation.reversed
  }
}
function getOrientation({rotate, align, reversed}) {
  return [rotate && (rotate+'°'), align, reversed && 'reversed'].filter(e => !!e)
}
function getRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
props.aeaModel.elements.forEach(el => el.bg = getRandomHexColor())

function highlight(id) {
  [...bagtag_div.value.querySelectorAll(`.highlight`)].forEach(el => el.classList.remove('highlight'))
  if (id) {
    bagtag_div.value.classList.add('dim')
    bagtag_div.value.querySelector(`id[data-id='${id}']`).classList.add('highlight')
  }
  else {
    bagtag_div.value.classList.remove('dim')
  }
}
const resolve = (path) => import.meta.resolve(path);

function parseBTP(e) {
  const value = e.target.value.trim();
  if (!value.startsWith('BTP')) {
    app.showError('BTP command expected');
    return;
  }
  BTP.value = CommandParsers.BTP(value);
  console.log(BTP.value)
}
function findElement(id) {
  return props.aeaModel.elements.find(e => e.id === id)
}
</script>

<template>
  <h2 class="font-bold text-lg inline-block mr-10">Bag Tag Table #{{props.aeaModel.id}} version:{{props.aeaModel.version}}</h2>
  <h3 style="display: inline-block"><b>width: </b>{{props.aeaModel.tag_width/10}}mm <b>mirror @ </b>{{props.aeaModel.mirror_point}}mm</h3>
  <section class="grid grid-cols-[min-content_auto]">
    <div class="bagtag" :style="{width:width+'mm'}" ref="bagtag_div">
      <hr :style="{left: (width/2)+'mm'}" class="dashed midline">
      <hr :style="{top: mirror+'mm'}" class="dashed">
      <div :style="{top: mirror+'mm'}" class="mirror-text">mirror</div>
      <ul class="mirrored-elements" :style="{width:width+'mm', height:mirror+'mm'}">
        <li v-for="el in props.aeaModel.elements.filter(el => el.mirror)" v-bind:key="el.id" :data-id="el.id" :style="getStyles(el)">
          <S v-if="el.type==='SEPARATOR'" :class="getClasses(el)"></S>
          <C v-if="el.type.endsWith('CHARACTER')" :class="getClasses(el)">{{el.common_data?.prefix}}{{ BTP?.elements[el.common_data?.ref] }}{{ BTP?.elements[el.id] }}</C>
          <img v-if="el.type.endsWith('BARCODE')" :class="getClasses(el)" :src="resolve(`../assets/${el.choice}.png`)">
          <img v-if="el.type==='LOGO'" class="logo" :class="getClasses(el)" src="../assets/LOGO.png">
        </li>
      </ul>
      <ul>
        <li v-for="el in props.aeaModel.elements" v-bind:key="el.id" :data-id="el.id" :style="getStyles(el)">
          <S v-if="el.type==='SEPARATOR'" :class="getClasses(el)"></S>
          <C v-if="el.type.endsWith('CHARACTER')" :class="getClasses(el)">{{el.common_data?.prefix}}{{ BTP?.elements[el.common_data?.ref] }}{{ BTP?.elements[el.id] }}</C>
          <img v-if="el.type.endsWith('BARCODE')" :class="getClasses(el)" :src="resolve(`../assets/${el.choice}.png`)">
          <img v-if="el.type==='LOGO'" class="logo" :class="getClasses(el)" src="../assets/LOGO.png">
        </li>
      </ul>
      <id v-for="el in props.aeaModel.elements" v-bind:key="el.id" :data-id="el.id"
          :style="{...getTopLeft(el), backgroundColor: el.bg}">{{el.id}}</id>
    </div>


    <div class="elements">
      <table @mouseover="highlight($event.target.closest('tr')?.getAttribute('data-id'))" @mouseleave="highlight()">
        <tr>
          <th>ID</th>
          <th>TYPE</th>
          <th>MIRROR</th>
          <th>SIZE</th>
          <th>POSITION</th>
          <th>ORIENTATION</th>
          <th>PREFIX</th>
          <th>REF</th>
          <th>COLOUR</th>
          <th>VALUE</th>
        </tr>
        <tr v-for="el in props.aeaModel.elements" v-bind:key="el.id" :data-id="el.id">
          <td class="id" :style="{ backgroundColor: el.bg }">{{ el.id }}</td>
          <td>
            {{ el.type.includes('BARCODE')? 'BARCODE:'+el.choice : el.type }}
          </td>
          <td>{{ el.mirror ? '✓' : '-' }}</td>
          <td>w:{{ el.width }} h:{{ el.height }}</td>
          <td>x:{{ el.horizontal }} v:{{ el.vertical }}</td>
          <td>{{ getOrientation(el.orientation).join(', ') }}</td>
          <td>
            <span class="prefix" v-if="el.common_data?.prefix">{{el.common_data.prefix}}</span>
          </td>
          <td>
            <span class="id" v-if="el.common_data?.ref" :style="{backgroundColor:findElement(el.common_data?.ref).bg}">{{el.common_data.ref}}</span>
          </td>
          <td>{{ el.colour_data }}</td>
          <td>
            {{ el.common_data?.prefix }}{{ BTP?.elements[el.id] }}
            <var v-if="BTP && el.common_data?.ref" :style="{backgroundColor:findElement(el.common_data?.ref).bg}">{{ BTP.elements[el.common_data.ref]}}</var>
          </td>
        </tr>
      </table>
      <h2>Enter BTP data:</h2>
      <input @keydown.enter="parseBTP"
             :placeholder="`BTP${props.aeaModel.id}${props.aeaModel.version}01#...`"
             class="p-2 border border-solid border-gray-500 w-full">
    </div>
  </section>
  <details class="template-container border border-gray-300">
    <summary>Model</summary>
    {{ props.aeaModel }}
  </details>
</template>

<style scoped>
.bagtag {
  font-family: monospace;
  position: relative;
  background-color: whitesmoke;
  border: 1px solid black;
  width: min-content;
  height: 544mm;
  box-sizing: content-box;

  >* {
    position: absolute;
  }
  hr.dashed {
    border: 1px dashed orange;
    width: 100%;

    &.midline {
      width: 544mm;
      border-width: .1px;
      transform-origin: left;
      rotate: 90deg;
      border-style: dotted;
      opacity: .5;
    }
  }
  .mirror-text {
    color: orange;
    background-color: inherit;
    font-size: 10px;
    left: 38%;
    text-align: center;
    margin-top: -6px;
    padding: 0 8px;
    letter-spacing: 2px;
  }

  &:hover id {
    opacity: 1;
  }
  id {
    position: absolute;
    margin: calc(-.5em - 2px) 0 0 calc(-.65em - 2px);
    padding: 2px;
    font-size: 8px;
    line-height: 1em;
    text-align: center;
    border-radius: 4px;
    background-color: black;
    color: #e5e7eb;
    opacity: .3;
  }
  &.dim {
    id {
      &.highlight {
        opacity: 1;
        z-index: 100;
      }
    }
  }
  ul {
    position: relative;
    li {
      line-height: 100%;
      position: absolute;

      S, C, img {
        position: relative;
        display: block;
      }
      c {
        min-width: min-content;
        white-space: nowrap;
      }
      S {
        background-color: black;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
        &.logo {
          width: 50px;
          min-width: 50px;
          height: 50px;
          min-height: 50px;
          margin-top: -100%;
        }
      }
      .a-center { left: -50%; }
      .a-right { left: -100%; }
    }
  }
  .a-right {
    text-align: right;
    transform-origin: bottom right;
  }
  .a-left {
    text-align: right;
    transform-origin: bottom left;
  }
  .a-center {
    text-align: center;
    transform-origin: bottom center;
  }
  .reversed {
    background-color: black;
    color: white;
  }
  /* This may seems strange, but it's because the default orientation is upside-down */
  .r-0 { rotate: 180deg; }
  .r-90 { rotate: 90deg; }
  .r-180 { rotate: 0deg; }
  .r-270 { rotate: 270deg; }

  .mirrored-elements {
    transform-origin: bottom center;
    rotate: 180deg;
    position: absolute;
    filter: blur(.5px);
    opacity: .5;
  }
}
.elements {
  margin-left: 20px;
  table {
    border-collapse: separate;
    cursor: pointer;

    tr {
      &:hover {
        background-color: #e5e7eb;
      }
      th, td {
        text-align: center;
        padding: 0 8px;

        span.id {
          border-radius: 4px;
          padding: 2px
        }

        &.id {
          color: #e5e7eb;
          border-radius: 6px;
          padding: 0;
        }
      }
    }
  }
}
</style>
