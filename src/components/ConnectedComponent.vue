<script setup>
import { useWebUSBStore } from '@/stores/WebUSBStore.js';
import { useAppStore } from '@/stores/appStore.js'
import { onMounted, reactive, ref } from 'vue'
import { CommandParsers, parseResponse } from 'aea.js'
const usb = useWebUSBStore();
const app = useAppStore();


const btm = ref(null);
const WS = ref({});
const ES = ref({});
const AV = ref({});
const UE = ref({ users: [] });
const BS = ref({});
const RI = ref(null);
const SQ = ref(null);
const templates = ref([]); // templates
const logos = ref([]);
const pectabs = ref([]);
const fonts = ref([]);
const messages = ref([]);
let log = false;

const string2bytes = (str) => Uint8Array.from(str, char => char.charCodeAt(0));

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

async function keydown(event) {
  const command = event.target.value.trim().toUpperCase();
  if (command.length < 2) return;

  await sendAndRead(command);
}
async function sendAndRead(command) {
  const msg = reactive({
    send: command,
    received: null,
    r_data: null
  })
  if (log) {
    messages.value.push(msg);
  }
  try {
    if (command.startsWith('LT')) {
      const lt = CommandParsers.LT(command);
      if (lt.length * 2 === lt.data.length) {
        // they are sending binary data - add \x10 before \x02, \x03, \x10
        const escaped = lt.data.match(/.{2}/g).map(hex => /02|03|10/.test(hex) ? '10' + hex : hex).join('');
        const data_bytes = new Uint8Array(escaped.match(/.{2}/g).map(byte => parseInt(byte, 16)))
        command = Uint8Array.from([2, ...string2bytes(command.slice(0, 8)), ...data_bytes, 3])
      }
      console.log(lt);
    }
    else {
      command = `\x02${command}\x03`
    }
    const resp = await usb.connected_device.sendAndRead(command);
    processResponse(resp, msg);
    return resp
  }
  catch (e) {
    app.showError(e);
    console.error(e);
  }
}
function processResponse(resp, msg) {
  msg.received = resp
  const [code, parsed] = parseResponse(resp);
  msg.r_data = parsed
  if (code === 'WSOK') WS.value = parsed;
  else if (/ESOK|EPOK/.test(code)) ES.value = parsed;
  else if (code === 'AVOK') AV.value = parsed;
  else if (/TAOK|TTOK/.test(code)) templates.value = parsed;
  else if (/LSOK|LTOK/.test(code)) logos.value = parsed;
  else if (/PSOK|PTOK/.test(code)) pectabs.value = parsed;
  else if (/FSOK/.test(code)) fonts.value = parsed;
  else if (/BSOK/.test(code)) BS.value = parsed;
  else if (/RIOK/.test(code)) RI.value = parsed;
  else if (/SQNI|SQOK/.test(code)) SQ.value = parsed;
  else if (code === 'UKOK') setTimeout(() => sendAndRead('UE'), 100);
  else if (code === 'UEOK') {
    if (!parsed.users) {
      parsed.users = [];
    }
    UE.value = parsed;
  } else if (code === 'UCOK') {
    setTimeout(get_user_info, 100);
    WS.value.uid = parsed;
    WS.value.mode = MULTI;
    if (!UE.value.users.includes(parsed)) {
      UE.value.users.push(parsed);
    }
  } else if (/UGOK|MXOK|MMOK/.test(code)) {
    setTimeout(async () => {
      await sendAndRead('WS')
    }, 100);
  } else if (code === 'SQNI') {
    WS.value = parsed;
  }
  setTimeout(() => btm.value.scrollIntoView({ behavior: 'smooth' }), 100);
}

usb.connected_device.on('unsolicited', (resp) => {
  console.log('unsolicited', resp)
  const msg = { }
  messages.value.push(msg);
  processResponse(resp, msg)
});
onMounted(async () => {
  await sendAndRead('WS')
  const mode = WS.value.mode;
  const uid = WS.value.uid;
  if (mode !== MONO) {
    await sendAndRead('UG#GID')

    // get AEA version
    await sendAndRead('AV')
    // get list of users
    await sendAndRead('UE')

    // Get device Information
    await sendAndRead('RI')

    // if we started in multi mode, switch back to it
    if (mode === MULTI) {
      await sendAndRead('MX')
      if (uid !== '???') { // not the "unselected" user
        await select_user(uid)
      }
    }
  }
  else {
    // get AEA version
    await sendAndRead('AV')
    await sendAndRead('RI')
  }
  await sendAndRead('SQ')
  await sendAndRead('ES')
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
async function get_user_info() {
  log = false;
  await sendAndRead('ES')
  await sendAndRead('LS')
  await sendAndRead('PS')
  await sendAndRead('FS')
  await sendAndRead('BS')
  // templates only exist in BPP mode
  if (AV.value.mode === 'BPP') {
    await sendAndRead('TA')
  }
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

          <dt class="font-bold">Status:</dt>
          <dd>{{ SQ?.STATUS }}</dd>
        </dl>

        <h3 class="mt-2 font-bold">
          Environment:
          <span class="reset-env" @click="sendAndRead(`EP#RESET`)">reset</span>
        </h3>
        <dl class="ml-4 grid grid-cols-[auto_auto]">
          <template v-for="(value, key) in ES" v-bind:key>
            <dt class="pr-2">{{key}}</dt>
            <dd>
              {{value}}
              <options v-if="ENV_OPTIONS[key] && value !== 'X' && WS.uid !== '???'" class="one-line">
                <a v-if="typeof ENV_OPTIONS[key][0] === 'string'"
                   v-for="opt in ENV_OPTIONS[key]"
                   @click="set_env(key, opt)">
                  {{opt}}
                </a>
                <template v-else>
                  <input type="range" :min="ENV_OPTIONS[key][0]" :max="ENV_OPTIONS[key][1]"
                         :value="parseInt(value, 10)" @change="set_env(key, $event.target.value)">
                  {{value}}
                </template>
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

          <template v-if="AV.mode === 'BPP'">
            <dt>Templates:</dt>
            <dd v-if="templates.length">{{ templates.join(', ') }}</dd>
            <dd v-else class="text-gray-400">none</dd>
          </template>

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
    <section class="flex flex-grow flex-col">
      <div id="output" class="p-6 mb-2 h-32 overflow-y-auto whitespace-pre-wrap flex-grow">
        <p v-if="RI">
          <dl class="grid grid-cols-2 grid-cols-[min-content_min-content] gap-x-4">
            <template v-for="(value, key) in RI">
              <dt class="font-bold text-nowrap">{{ key.replace(/_/g, ' ') }}</dt>
              <dd>{{  Array.isArray(value)? value.join(', ') : value }}</dd>
            </template>
          </dl>
        </p>
        <p v-for="value in messages" class="my-4 rounded border">
          <span v-if="value.send">>> {{ value.send }}</span>
          <details v-if="value.received" :open="!value.send">
            <summary>: {{ value.received }}</summary>
            <pre>{{ value.r_data }}</pre>
          </details>
        </p>
        <a ref="btm"></a>
      </div>
      <textarea class="w-full h-1/3 border p-2"
                placeholder="Enter AEA command. Press enter to submit"
                @keydown.enter.prevent="keydown"></textarea>
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
  @apply border rounded absolute top-0 bg-stone-50 select-none;

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
#output {
  &> p {
    background-color: cornsilk;
    color: var(--text-color-dark);

    @apply rounded border p-4;

    &> span {
      text-overflow: ellipsis;
      width: 50vw;
      display: block;
      overflow-x: auto;
    }
  }
  summary {
    line-break: anywhere;
  }
}
</style>
