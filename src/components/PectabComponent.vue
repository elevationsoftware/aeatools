<script setup>
const props = defineProps(['aea-model'])
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
              <img v-if="element.barcode" :class="{rotate: element.barcode.match(/[B-Z]/)}" src="../assets/PDF_417.png" />
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
