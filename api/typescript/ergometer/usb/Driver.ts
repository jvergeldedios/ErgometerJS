namespace ergometer.usb {
  export type DisconnectFunc = () => void;
  export type Devices = IDevice[];

  //keep it simple and not to far away from web-hid
  export interface IDevice {
    readonly vendorId: number;
    readonly productId: number;
    readonly productName: string;
    readonly serialNumber: string;

    open(
      disconnect: DisconnectFunc,
      error: (err: any) => void,
      receiveData: (data: DataView) => void
    ): Promise<void>;
    close(): Promise<void>;
    sendData(data: ArrayBuffer): Promise<void>;
  }

  export interface IDriver {
    requestDevics(): Promise<Devices>;
    getConfig?(): IDriverConfig; // Optional method to get current configuration
    setConfig?(config: IDriverConfig): void; // Optional method to update configuration
  }
}
