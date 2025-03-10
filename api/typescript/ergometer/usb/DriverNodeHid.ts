namespace ergometer.usb {
  export class DeviceNodeHid implements IDevice {
    private _disconnect: DisconnectFunc;
    private _onError: (err: any) => void;
    private _deviceInfo: nodehid.Device;
    private _hid: nodehid.HID;

    public vendorId: number;
    public productId: number;
    public productName: string;
    public serialNumber: string;
    public driverConfig: IDriverConfig;

    constructor(deviceInfo, config: IDriverConfig) {
      this._deviceInfo = deviceInfo;
      this.driverConfig = config;
    }
    public callError(err: any) {
      if (this._onError) this._onError(err);
    }
    private _receiveData: (data: DataView) => void;
    public open(
      disconnect: DisconnectFunc,
      error: (err: any) => void,
      receiveData: (data: DataView) => void
    ): Promise<void> {
      this._hid = new nodehid.HID(this._deviceInfo.path);
      this._receiveData = receiveData;
      //there is no disconnect in hid api?
      //shoud fix this another way
      this._onError = error;
      this._hid.on("error", (err) => {
        //should do some error handling
        this.callError(err);
      });

      this._hid.readTimeout(500); //csafe should be returned directly, do not wait too long
      this._disconnect = disconnect;

      this._deviceInfo.productId;

      return Promise.resolve();
    }
    public close(): Promise<void> {
      this._hid.close();
      return Promise.resolve();
    }

    public sendData(data: ArrayBuffer): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        try {
          if (data.byteLength > this.driverConfig.usbCSaveSize)
            throw `Trying to send to much data, the buffer must be smaller or equal to ${this.driverConfig.usbCSaveSize} and is ${data.byteLength}`;
          var buf = new ArrayBuffer(this.driverConfig.writeBufSize);
          var view = new Int8Array(buf);
          view.set([this.driverConfig.reportType], 0);
          view.set(new Int8Array(data), 1);
          var written = this._hid.write(Array.from(view));

          if (written != this.driverConfig.writeBufSize)
            throw `Only ${written} bytes written to usb device. it should be ${this.driverConfig.writeBufSize}`;
          //resolve the send
          resolve();
          //start listening to the result
          this.readData();
        } catch (error) {
          this.callError(error);
          reject(error);
        }
      });
    }
    public readData() {
      try {
        this._hid.read((err, inputData) => {
          if (err) this.callError(err);
          else {
            if (
              inputData &&
              inputData.length >= this.driverConfig.writeBufSize &&
              inputData[0] == this.driverConfig.reportType
            ) {
              //copy all results into a buffer of 121
              var endByte = this.driverConfig.writeBufSize - 1;
              while (endByte >= 0 && inputData[endByte] == 0) endByte--;
              if (
                endByte >= 0 &&
                inputData[endByte] == csafe.defs.FRAME_END_BYTE
              ) {
                var buf = new ArrayBuffer(this.driverConfig.writeBufSize);
                var ar = new Int8Array(buf);
                ar.set(inputData, 0);
                //return the the data except for the first byte
                var view = new DataView(ar.buffer, 1, endByte);
                this._receiveData(view);
              } else this.callError("end csafe frame not found");
            } else this.callError("nothing read");
          }
        });
      } catch (error) {
        this.callError(error);
      }
    }
  }

  export class DriverNodeHid implements IDriver {
    private _config: IDriverConfig[];
    private _vendorIds: number[];

    constructor(config: IDriverConfig[]) {
      this._config = config;
      this._vendorIds = config.map((c) => c.vendorId);
    }

    public getDriverConfigByVendorId(vendorId: number): IDriverConfig {
      return this._config.find((c) => c.vendorId === vendorId);
    }

    public requestDevics(): Promise<Devices> {
      try {
        var result: Devices = [];
        var devices = nodehid.devices();
        devices.forEach((device) => {
          //add all devices with matching vendor IDs
          if (this._vendorIds.indexOf(device.vendorId) !== -1) {
            var deviceInfo = new DeviceNodeHid(
              device,
              this.getDriverConfigByVendorId(device.vendorId)
            );
            deviceInfo.serialNumber = device.serialNumber;
            deviceInfo.productId = device.productId;
            deviceInfo.vendorId = device.vendorId;
            deviceInfo.productName = device.product;
            result.push(deviceInfo);
          }
        });
      } catch (error) {
        return Promise.reject(error);
      }

      return Promise.resolve(result);
    }
  }
}
