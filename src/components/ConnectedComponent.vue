<script setup>
import { useWebUSBStore } from '@/stores/WebUSBStore.js';
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { parseResponse } from 'aea.js'
const usb = useWebUSBStore();


const btm = ref(null);
const WS = ref({});
const ES = ref({});
const AV = ref({});
const UE = ref({});
const BS = ref({});
const templates = ref([]); // templates
const logos = ref([]);
const pectabs = ref([]);
const fonts = ref([]);
const messages = ref([]);
let WS_IN_PROGRESS = false;
let log = false;

const ENV_OPTIONS = {
  VSR: ['Y', 'N'], // 'X' if not available
  CUTPRINT: ['Y', 'N'], // 'X' if not available
  CUTHOLD: ['Y', 'N'], // 'X' if not available
  KEEPCONF: ['Y', 'N'], // 'X' if not available
  ERR3IGN: ['Y', 'E', 'N'],
  UNSOL: ['Y', 'N'], // 'X' if not available
  TKCHECK: ['Y', 'N'], // 'X' if not available
  BCVERIFY: ['Y', 'N'],
  DETLTYPE: ['H', 'S', 'E', 'A'], // not supporting Bxxx Fxxx
  TOPADJ: [-40, +40],
  LEFTADJ: [-40, +40],
  CONTRAST: [1, 9], // (VV in response)
  CUTPOS: [-30, +30],
  DOTFAIL: [1, 999],
  BMADJ: [0, 999],
  FIXEDLEN: [1, 999],

// FONT                     1 alpha for standard choice V plus 2 numerics for vendor specific
// HARDCODE                     'As defined in chapter for CTcommand'
};

console.log(usb)

const parseData = async (data) => {
  const [code, parsed, hardcode] = parseResponse(data);
  console.log(`R: %c${data} %s %O`, 'color: orange;', code, parsed);
  if (code === 'WSOK') WS.value = parsed;
  else if (/ESOK|EPOK/.test(code)) ES.value = parsed;
  else if (code === 'AVOK') AV.value = parsed;
  else if (/TAOK|TTOK/.test(code)) templates.value = parsed;
  else if (/LSOK|LTOK/.test(code)) logos.value = parsed;
  else if (/PSOK|PTOK/.test(code)) pectabs.value = parsed;
  else if (/FSOK/.test(code)) fonts.value = parsed;
  else if (/BSOK/.test(code)) BS.value = parsed;
  else if (code === 'UKOK') setTimeout(() => sendAndRead('UE'), 100);
  else if (code === 'UEOK') {
    if (!parsed.users) {
      parsed.users = [];
    }
    UE.value = parsed;
  }
  else if (code === 'UCOK') {
    setTimeout(get_user_info, 100);
    WS.value.uid = parsed;
    WS.value.mode = MULTI;
    if (!UE.value.users.includes(parsed)) {
      UE.value.users.push(parsed);
    }
  }
  else if (/UGOK|MXOK|MMOK/.test(code)) {
    setTimeout(async () => {
      await sendAndRead('WS')
    }, 100);
  }
  else if (code === 'SQNI') {
    WS.value = parsed;
  }
  setTimeout(() => btm.value.scrollIntoView({ behavior: 'smooth' }), 100);
};

async function keydown(event) {
  const command = event.target.value.trim();
  if (command.length < 2) return;

  await sendAndRead(command);
}
async function sendAndRead(command) {
  if (command === 'WS') {
    if (WS_IN_PROGRESS) {
      console.log('WS_IN_PROGRESS', WS_IN_PROGRESS)
      return;
    }
    WS_IN_PROGRESS = true;
  }
  console.log(`S: %c${command}`, 'color: blue;');
  const msg = reactive({
    send: command,
    received: null,
    r_data: null
  })
  if (log) {
    messages.value.push(msg);
  }
  const resp = await usb.connected_device.sendAndRead(`\x02${command}\x03`);
  msg.received = resp
  if (command === 'WS') {
    WS_IN_PROGRESS = false;
  }
  try {
    const [code, parsed, hardcode] = parseResponse(resp);
    msg.r_data = parsed
  }
  catch (e) {
    console.error(e);
  }
  return resp
}
onMounted(async () => {
  console.log('listening for data');
  usb.connected_device.on('data', parseData);
  await sendAndRead('AV')
  await sendAndRead('WS')
  const mode = WS.value.mode;
  const uid = WS.value.uid;
  if (mode !== MONO) {
    await sendAndRead('UG#GID')

    // get list of users
    await sendAndRead('UE')

    // if we started in multi mode, switch back to it
    if (mode === MULTI) {
      await sendAndRead('MX')
      if (uid !== '???') { // not the "unselected" user
        await select_user(uid)
      }
    }
  }
  await sendAndRead('ES')
});
onUnmounted(() => {
  console.log('STOP listening for data');
  usb.connected_device.off('data', parseData);
});

const MONO = 'M', MULTI = 'X', GLOBAL = 'G';
const MODE_MAP = { [MONO]: 'Mono', [MULTI]: 'Multi', [GLOBAL]: 'Global' };

async function add_user($event) {
  if (!$event.target.checkValidity()) return;

  const user = $event.target.value.toUpperCase();
  if (user.length !== 3) return;
  await sendAndRead(`UC#${user}`)
  $event.target.value = '';
}
async function select_user(user) {
  await sendAndRead(`UC#${user}`)
}
async function get_user_info(user) {
  log = false;
  await sendAndRead('ES')
  await sendAndRead('LS')
  await sendAndRead('TA')
  await sendAndRead('PS')
  await sendAndRead('FS')
  await sendAndRead('BS')
  log = true;
}
async function delete_user(user) {
  await sendAndRead(`UK#${user}`)
}
async function set_env(key, value) {
  await sendAndRead(`EP#AIRLINEID=${WS.value.uid}#${key}=${value}`)
}
</script>

<template>
  <article class="grid grid-cols-[300px_auto]">
    <aside class="p-2 bg-gray-100 text-black grid grid-rows-[2em_1em_1em_auto_4em]">
      <h2 class="font-bold text-lg">{{ usb.connected_device.device.productName }}</h2>
      <small>{{ usb.connected_device.device.manufacturerName }}</small>
      <small>{{ usb.connected_device.device.serialNumber }}</small>
      <div class="mt-5">
        <dl class="grid grid-cols-2">
          <dt class="font-bold">Print Mode:</dt>
          <dd>{{ AV.mode }}</dd>

          <dt class="font-bold">AEA Version:</dt>
          <dd>20{{ AV.version }}</dd>

          <dt class="font-bold">Mode:</dt>
          <dd>
            {{ MODE_MAP[WS.mode] || '???' }} User
            <options class="one-line">
              <b>Switch to:</b>
              <a @click="sendAndRead('MX')" v-if="WS.mode === GLOBAL || WS.mode === MONO">Multi</a>
              <a @click="sendAndRead('UG#GID')" v-if="WS.mode === MULTI">Global</a>
              <a @click="sendAndRead('MM')" v-if="WS.mode === GLOBAL">Mono</a>
            </options>
          </dd>
          <dt class="font-bold">Current User</dt>
          <dd>
            {{ WS.uid }}
            <options v-if="WS.mode !== MONO" class="user-list">
              <a v-for="user in UE.users" :key="user" @click="select_user(user)">
                <i v-if="WS.mode === GLOBAL" @click.stop="delete_user(user)">X</i>
                {{ user }}
              </a>
              <template v-if="!UE.users?.length">Add User: </template>
              <input type="text" maxlength="3" pattern="^[a-zA-Z0-9]{3}$"
                     @keydown.enter="add_user">
            </options>

          </dd>
        </dl>

        <h3 class="mt-2 font-bold">
          Environment:
          <span class="reset-env" @click="sendAndRead(`EP#RESET`)">reset</span>
        </h3>
        <dl class="ml-4 grid grid-cols-[80%_20%]">
          <template v-for="(value, key) in ES">
            <dt class="pr-2">{{key}}</dt>
            <dd>
              {{value}}
              <options v-if="ENV_OPTIONS[key] && value !== 'X' && WS.uid !== '???'" class="one-line">
                <a v-if="typeof ENV_OPTIONS[key][0] === 'string'"
                   v-for="opt in ENV_OPTIONS[key]"
                   @click="set_env(key, opt)">
                  {{opt}}
                </a>
                <input v-else type="range" :min="ENV_OPTIONS[key][0]" :max="ENV_OPTIONS[key][1]"
                       :value="parseInt(value, 10)" @change="set_env(key, $event.target.value)">{{value}}
              </options>
            </dd>
          </template>
        </dl>

        <dl class="assets mt-5 grid grid-cols-2">
          <dt>Logos:</dt>
          <dd v-if="logos.length">{{ logos.join(', ') }}</dd>
          <dd v-else class="text-gray-400">none</dd>

          <dt>Pectabs:</dt>
          <dd v-if="pectabs.length">{{ pectabs.join(', ') }}</dd>
          <dd v-else class="text-gray-400">none</dd>

          <dt>Templates:</dt>
          <dd v-if="templates.length">{{ templates.join(', ') }}</dd>
          <dd v-else class="text-gray-400">none</dd>

          <dt>Fonts:</dt>
          <dd v-if="fonts.length">{{ fonts.join(', ') }}</dd>
          <dd v-else class="text-gray-400">none</dd>

          <template v-for="(value, key) in BS">
            <dt>Bin {{key[3]}}:</dt>
            <dd v-if="value">{{ value }}</dd>
            <dd v-else class="text-gray-400">unknown</dd>
          </template>
        </dl>
      </div>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              @click="usb.connected_device.disconnect()">
        Disconnect
      </button>
    </aside>
    <section class="grid grid-rows-[auto_30%]">
      <div>
        <p v-for="value in messages" class="my-2 mx-4 rounded border">
          <span>>> {{ value.send }}</span>
          <details v-if="value.received">
            <summary>: {{ value.received }}</summary>
            <pre>{{ value.r_data }}</pre>
          </details>
        </p>
        <a ref="btm"></a>
      </div>
      <footer class="grid grid-rows-1">
        <textarea class="w-full border p-2"
               placeholder="Enter AEA command. Press enter to submit"
               @keydown.enter.prevent="keydown"></textarea>
      </footer>
    </section>
  </article>
</template>

<style scoped>
textarea {
  background-color: #2c2c2c;
  color: #a7a7a7;
}
dd {
  position: relative;
}
.assets {
  dt {
    @apply font-bold;
  }
}
options {
  left: 100%;
  width: 22px;
  overflow: clip;
  margin-left: -14px;
  transition: width .5s ease;
  max-width: fit-content;
  padding-left: 20px;
  height: 1.6em;
  @apply border rounded absolute top-0 bg-amber-50 select-none;

  &:hover {
    width: 300px;
    overflow: visible;
    height: fit-content;
  }
  &:before {
    content: "〉";
    color: #2c2c2c;
    margin-left: -12px;
    font-size: smaller;
  }

  a {
    @apply rounded bg-blue-500 text-white px-1 mx-1 py-0.5 text-xs cursor-pointer inline-block;

    &:hover {
      background-color: #2c2c2c;
    }
  }
  b {
    vertical-align: middle;
  }
  &.user-list {
    max-width: 200px;
    input {
      width: 40px;
      text-align: center;
      @apply border rounded bg-white text-black text-xs;
    }
    a {
      position: relative;
      @apply text-base;

      i {
        padding: 1px 4px 2px 3px;
        top: -6px;
        right: -7px;
        opacity: 0;
        transition: opacity .25s ease-in;
        visibility: hidden;

        @apply rounded-full bg-gray-800 text-white absolute text-xs;
        line-height: 12px;
      }
      &:hover {
        i {
          visibility: visible;
          opacity: 1;
          color: red;
          background-color: #666666;
        }
      }
    }
  }
  input {
    outline: none;
    &:invalid {
      border: 2px solid red;
    }
  }
  &.one-line {
    white-space: nowrap;
    overflow: hidden;
  }
}
.reset-env {
  cursor: pointer;
  @apply text-red-800 px-1 right-0 relative font-normal border-gray-300 border rounded text-xs;

  &:hover {
    @apply text-gray-200 bg-red-500 rounded px-1;
  }
}
</style>
