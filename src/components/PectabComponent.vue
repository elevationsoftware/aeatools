<script setup>
// import { onMounted, ref } from 'vue'
// import PDF417 from 'pdf417-generator'
const props = defineProps(['aea-model'])
// const theCanvas = ref(null)
// import { CommandParsers } from 'aea.js'
// const props = {
//   // aeaModel: CommandParsers.PT('PT##?B1A#@;#GTKT#GCKI#GBRD#0101#0222F02A#0322G02A#0422F16A#0522G16A#0622G26A#0722K02A#0822K16A#0922K26A#1022N16A#1130N26A#1220F53A#1312F61A#1420H53A#1520K53A#1612K61A#1720N53A#1812N61A#19BRC681322#2022N32A#2122O26A#2222O32A#2302K35A#2422N02A#FF02A01#')
//   aeaModel: CommandParsers.PT('PT##?W1A#@;#ATBR#ATBC#ATBC#01011101#0202O61P#0307J56B#0404I54B#0506J64B#0602O54P#0703O57P#0808O35P#0918G10G54B#0A02L46R#0B05L33R#0C05L11R#0D10L41I58#0E04L31R#0F09I60B#1002J54B#1123F10F54B#1203H54B#1322K54Q#1405N41R#1504N44R#1801N46R#1904L20R#1A04H57B#1B05L23R#1C10H08#2105F44B#2209N33F#2315G30B#2418C01#2518R01#2618R10#2A05F30B#30BRE041041#3A30L54Q#4225M54Q#4470Q10L#4A04O66P#4C03G44B#4D04G47B#4E17O43Q#5130R10L#5218E54B#5304R64R#FB10A01#ALCD0A#BORD12#DEST1A#\n')
// }
console.log('PectabComponent', props.aeaModel)

function getRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function getELementStyle(element, position) {
  const length = element.length || 1;
  return {
    'background-color': getRandomHexColor()+'66',
    width: `calc(${length} * var(--width-pct))`,
    left: `calc(${(parseFloat(position[1])-1)} * var(--width-pct))`,
    top: `calc(${(position[0].charCodeAt(0) - 65)} * var(--height-pct))`
  }
}

// function drawbarcode(canvas, element) {
//
//   PDF417.draw('Why you scan me? I cannot take you to far off lands. Work hard. Save your money.', canvas, 6, 9)
// }
</script>

<template>
  <h2 class="font-bold text-lg">Pectab - Format: {{props.aeaModel.format}} / Version: {{props.aeaModel.version}}</h2>
  <div class="pectab-container">
    <div class="numbers-container"><div class="number">1</div><div class="number">2</div><div class="number">3</div><div class="number">4</div><div class="number">5</div><div class="number">6</div><div class="number">7</div><div class="number">8</div><div class="number">9</div><div class="number">10</div><div class="number">11</div><div class="number">12</div><div class="number">13</div><div class="number">14</div><div class="number">15</div><div class="number">16</div><div class="number">17</div><div class="number">18</div><div class="number">19</div><div class="number">20</div><div class="number">21</div><div class="number">22</div><div class="number">23</div><div class="number">24</div><div class="number">25</div><div class="number">26</div><div class="number">27</div><div class="number">28</div><div class="number">29</div><div class="number">30</div><div class="number">31</div><div class="number">32</div><div class="number">33</div><div class="number">34</div><div class="number">35</div><div class="number">36</div><div class="number">37</div><div class="number">38</div><div class="number">39</div><div class="number">40</div><div class="number">41</div><div class="number">42</div><div class="number">43</div><div class="number">44</div><div class="number">45</div><div class="number">46</div><div class="number">47</div><div class="number">48</div><div class="number">49</div><div class="number">50</div><div class="number">51</div><div class="number">52</div><div class="number">53</div><div class="number">54</div><div class="number">55</div><div class="number">56</div><div class="number">57</div><div class="number">58</div><div class="number">59</div><div class="number">60</div><div class="number">61</div><div class="number">62</div><div class="number">63</div><div class="number">64</div><div class="number">65</div><div class="number">66</div><div class="number">67</div><div class="number">68</div><div class="number">69</div><div class="number">70</div><div class="number">71</div><div class="number">72</div></div>
    <div class="bp-container">
      <div class="letters-container"><div class="letter">A</div><div class="letter">B</div><div class="letter">C</div><div class="letter">D</div><div class="letter">E</div><div class="letter">F</div><div class="letter">G</div><div class="letter">H</div><div class="letter">I</div><div class="letter">J</div><div class="letter">K</div><div class="letter">L</div><div class="letter">M</div><div class="letter">N</div><div class="letter">O</div><div class="letter">P</div><div class="letter">Q</div><div class="letter">R</div></div>
      <div class="boarding-pass">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1404 630">
          <defs>
            <pattern id="grid" width="19.5" height="35" patternUnits="userSpaceOnUse">
              <path d="M 19.5 0 L 0 0 0 35" fill="none" stroke="black" stroke-width="1" stroke-dasharray="2,2"/>
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <template v-for="(element, key) in props.aeaModel.elements" :key="key">
          <template v-for="(position, key2) in element.positions" :key="key2">
            <div class="element" :style="getELementStyle(element, position)" :title="JSON.stringify(element)">
              <img v-if="element.barcode" :class="{rotate: element.barcode.match(/[B-Z]/)}" src="../assets/pdf417_placeholder.png" />
              <span class="rounded bg-black px-0.5">{{ key }}</span>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
  <details>
    <summary>Model</summary>
    <pre>{{ props.aeaModel.toString() }}</pre>
  </details>
</template>

<style scoped>

.pectab-container {
  --width-pct: 1.388%;
  --height-pct: 5.54%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  padding-left: 18px;

  .numbers-container {
    display: flex;
    //width: 14.68in;
    width: 100%;
    margin-bottom: 5px;
  }
  .number {
    flex: 1;
    text-align: center;
    font-size: 10px;
    padding: 2px 0;
  }
  .number:first-child {
    border-left: none;
  }
  .bp-container {
    position: relative;
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 100%;

    .boarding-pass {
      //background-image: url('../assets/bp_grid.png');
      //background-position: center;
      //background-size: contain;
      //width: 1405px;
      //height: 630px;
      width: 100%;
      border: 1px solid grey;
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
  .letters-container {
    display: flex;
    flex-direction: column;
    left: -20px;
    height: 98%;
    position: absolute;
    justify-content: space-between;
    top: 7px;
  }
  .letter {
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
  .element {
    position: absolute;
    //background-color: red;
    border: solid 1px red;
    width: 20px;
    height: 5.7%;
    font-size: 10px;
    margin-top: 1px;

    img {
      position: relative;
      max-width: unset;
      height: 200%;
      top: -200%;
      left: 0;
      background-color: white;
      color: red;

      &.rotate {
        transform: rotate(90deg);
        transform-origin: left bottom;
      }
    }
    span {
      color: white;
      position: absolute;
    }
  }
}
details {
  font-size: .75em;
}
</style>
