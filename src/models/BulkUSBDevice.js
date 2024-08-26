import EventEmitter from 'events'

const string2bytes = (str) => Uint8Array.from(str, char => char.charCodeAt(0));

export class BulkUSBDevice extends EventEmitter {
  lock = new AsyncLock();

  constructor(device, interfaceNumber, endpointIn, endpointOut) {
    super();
    this.device = device;
    this.interfaceNumber = interfaceNumber;
    this.endpointIn = endpointIn;
    this.endpointOut = endpointOut;
  }

  static async connect(device, interfaceNumber = 0, configuration = 1) {
    console.log ('connect', device)
    if (!(device instanceof USBDevice)) {
      throw new Error('Device is not a USBDevice');
    }
    try {
      await device.open();
      if (device.configuration === null) {
        await device.selectConfiguration(configuration);
      }

      const iface = device.configuration.interfaces[interfaceNumber];
      if (!iface) {
        throw new Error(`Interface ${interfaceNumber} not found`);
      }

      if (device.configuration.interfaces[interfaceNumber].claimed) {
        await device.releaseInterface(interfaceNumber);
      }
      await device.claimInterface(interfaceNumber);

      const alternate = iface.alternates[0];
      const endpointIn = alternate.endpoints.find(e => e.direction === 'in');
      const endpointOut = alternate.endpoints.find(e => e.direction === 'out');

      if (!endpointIn || !endpointOut) {
        throw new Error('Required endpoints not found');
      }

      console.log('Connected to printer:', device.productName);
      console.log('Endpoint In:', endpointIn.endpointNumber);
      console.log('Endpoint Out:', endpointOut.endpointNumber);

      return new BulkUSBDevice(device, interfaceNumber, endpointIn, endpointOut);
    }
    catch (error) {
      console.error('Error connecting to device:', error);
      try {
        // attempt to clean up
        await device.releaseInterface(interfaceNumber);
        await device.close();
      }
      catch (error) {
        // console.error('Disconnection error:', error);
      }
      throw error;
    }
  }

  async disconnect() {
    await this.device.releaseInterface(this.interfaceNumber);
    await this.device.close();
    this.emit('disconnect');
    console.log('Disconnected from USb device');
  }
  async startReading() {
    let buffer = '';
    const endpointNumber = this.endpointIn.endpointNumber;
    const packetSize = this.endpointIn.packetSize;

    try {
      while (this.device.opened) {
        const result = await this.device.transferIn(endpointNumber, packetSize);
        buffer += new TextDecoder().decode(result.data);

        const stx_index = buffer.indexOf('\x03');
        if (stx_index > -1) {
          const message = buffer.substring(1, stx_index)
          const event = message.startsWith('SQNI')? 'unsolicited' : 'data';
          this.emit(event, message);

          // Remove the processed message from the buffer
          buffer = buffer.substring(stx_index + 1);
        }
      }
    }
    catch (error) {
      const msg = error.message;
      if (msg.includes('The transfer was cancelled') || msg.includes('The device was disconnected.')) {
        console.log('Reading stopped')
        return;
      }
      console.error('Error reading:', error);
      throw error;
    }
  }
  async _sendCommand(command) {
    console.log(`S: %c${command}`, 'color: blue;');
    try {
      const bytes = string2bytes(command)
      await this.device.transferOut(this.endpointOut.endpointNumber, bytes)
      // console.log('send', escapeNonPrintableCharacters(command));
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }

  async sendAndRead(cmd, timeout= 1000) {
    await this.lock.acquire();
    const p = new Promise((resolve) => {
      const to = setTimeout(() =>
          this.emit('data', `ERR0#${cmd} command failed to respond in ${timeout}ms`)
        , timeout);
      this.once('data', (resp) => {
        clearTimeout(to);
        this.lock.release();
        console.log(`R: %c${resp}`, 'color: orange;');
        resolve(resp);
      });
    });
    await this._sendCommand(cmd);
    return await p;
  }
}

class AsyncLock {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  async acquire() {
    if (this.locked) {
      return new Promise((resolve) => {
        this.queue.push(resolve);
      });
    } else {
      this.locked = true;
    }
  }

  release() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    } else {
      this.locked = false;
    }
  }
}
