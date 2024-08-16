import EventEmitter from 'events'

const string2bytes = (str) => Uint8Array.from(str, char => char.charCodeAt(0));
function escapeNonPrintableCharacters(inputString) {
  return inputString.replace(/[\x00-\x1F\x7F-\xFF]/g, char =>
    '\\x' + char.charCodeAt(0).toString(16).padStart(2, '0')
  );
}

export class BulkUSBDevice extends EventEmitter {
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

//   async sendAndRead(command) {
//     if (!connected_device) {
//       throw new Error('Device not connected');
//     }
//     await this.sendCommand(command)
//     return await this.readResponse()
//   }
//   async readResponse() {
//     try {
//       let response = '';
//       let empties = 0;
//       for (let i = 0; i < 3; i++) {
//         const result = await this.device.transferIn(this.endpointIn.endpointNumber, 64);
//         if (result.data.byteLength === 64) {
//           i--;
//         }
//         let decoded = new TextDecoder().decode(result.data)
//         if (decoded === '\x02') {
//           empties++;
//         }
//         if (empties > 4) {
//           break;
//         }
// // console.log('read', i, escapeNonPrintableCharacters(decoded))
//         response += decoded.replaceAll(/^\x02|\x03$/g, '');
//       }
//       response = response.replaceAll(/^\x02+|\x03+$/g, '')
//       console.log('transferIn', escapeNonPrintableCharacters(response));
//       return response;
//
//     } catch (error) {
//       console.error('Error reading response:', error);
//       throw error;
//     }
//   }

  // async startReading() {
  //   try {
  //     while (this.device.opened) {
  //       const result = await this.device.transferIn(1, 64);
  //       let decoded = new TextDecoder().decode(result.data)
  //       this.emit('data', decoded);
  //       console.log('transferIn', escapeNonPrintableCharacters(decoded));
  //     }
  //   } catch (error) {
  //     // TODO: catch 'The transfer was cancelled.' error that happens on disconnect()
  //     console.error('Error reading:', error);
  //     throw error;
  //   }
  // }
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
          this.emit('data', message);

          // Remove the processed message from the buffer
          buffer = buffer.substring(stx_index + 1);
          console.log(escapeNonPrintableCharacters(message));
        }
      }
    } catch (error) {
      if (error.message.includes('The transfer was cancelled')) {
        console.log('Reading stopped')
        return;
      }
      console.error('Error reading:', error);
      throw error;
    }
  }
  async sendCommand(command) {
    try {
      const bytes = string2bytes(command)
      await this.device.transferOut(this.endpointOut.endpointNumber, bytes)
// console.log('transferOut', escapeNonPrintableCharacters(command));
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }
}
