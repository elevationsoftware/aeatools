<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps(['aea-model'])
const theCanvas = ref(null)

console.log('LogoComponent', props.aeaModel)

function displayOnCanvas(pcx, canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = pcx.width;
  canvas.height = pcx.height;

  const imageData = ctx.createImageData(pcx.width, pcx.height);
  let index = 0;

  for (let y = 0; y < pcx.height; y++) {
    for (let x = 0; x < pcx.width; x++) {
      const color = pcx.getPixelColor(x, y);
      imageData.data[index++] = color.r;
      imageData.data[index++] = color.g;
      imageData.data[index++] = color.b;
      imageData.data[index++] = 255; // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
onMounted(() => {
  console.log(props.aeaModel.image.header)
  displayOnCanvas(props.aeaModel.image, theCanvas.value)
});
function header() {
  return props.aeaModel.image.header
}
const getManufacturer = (code) => {
  return code === 10 ? "ZSoft Corporation" : "Unknown";
};

const getVersion = (code) => {
  const versions = {
    0: "Version 2.5 of PC Paintbrush",
    2: "Version 2.8 w/ palette information",
    3: "Version 2.8 w/o palette information",
    4: "PC Paintbrush for Windows",
    5: "Version 3.0 and > of PC Paintbrush and PC Paintbrush+, includes Publisher's Paintbrush"
  };
  return versions[code] || "Unknown version";
};

const getEncoding = (code) => {
  return code === 1 ? "RLE encoding" : "Unknown encoding";
};

const getPaletteInfo = (code) => {
  return code === 1 ? "Color/BW" : "Grayscale";
};
</script>

<template>
  <h2 class="font-bold text-lg">Logo #{{props.aeaModel.id}}</h2>
  <div class="text-neutral-500">
    Length Specified: <span class="font-light">{{props.aeaModel.length}}</span>
    <strong class="error" v-if="props.aeaModel.length !== props.aeaModel.image.raw.length"> (DOES NOT MATCH ACTUAL LENGTH)</strong>
    <br>
    Hex Length: <span class="font-light">{{props.aeaModel.image.raw.length}} ({{props.aeaModel.image.raw.length/2}} bytes)</span>
  </div>
  <canvas style="max-width: 100%;" ref="theCanvas" :width="props.aeaModel.width" :height="props.aeaModel.height"></canvas>
  <details>
    <summary>Model</summary>
    <table>
      <tbody>
      <tr>
        <td>Manufacturer</td><td>{{header().manufacturer}}</td><td>{{getManufacturer(header().manufacturer)}}</td>
      </tr>
      <tr>
        <td>Version</td><td>{{header().version}}</td><td>{{getVersion(header().version)}}</td>
      </tr>
      <tr>
        <td>Encoding</td><td>{{header().encoding}}</td><td>{{getEncoding(header().encoding)}}</td>
      </tr>
      <tr>
        <td>Bits Per Pixel</td><td>{{header().bitsPerPixel}}</td><td>bits per pixel</td>
      </tr>
      <tr>
        <td>Image Dimensions</td>
        <td>{{`${header().xMax - header().xMin + 1} x ${header().yMax - header().yMin + 1}`}}</td>
        <td>pixels</td>
      </tr>
      <tr>
        <td>Resolution</td><td>{{`${header().hDpi} x ${header().vDpi}`}}</td><td>DPI</td>
      </tr>
      <tr>
        <td>Color Palette</td><td>{{header().colormap.length}}</td><td>{{`${header().colormap.length / 3} colors`}}</td>
      </tr>
      <tr>
        <td>Bytes Per Line</td><td>{{header().bytesPerLine}}</td><td>Number of bytes to hold one scan line</td>
      </tr>
      <tr>
        <td>Palette Info</td><td>{{header().paletteInfo}}</td><td>{{getPaletteInfo(header().paletteInfo)}}</td>
      </tr>
      <tr>
        <td>Number of Planes</td><td>{{header().nPlanes}}</td><td>Number of color planes</td>
      </tr>
      </tbody>
    </table>
  </details>
</template>

<style scoped>
strong {
  color: #c71919;
}
td {
  padding-left: 20px;
}
</style>
