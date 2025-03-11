namespace ergometer.usb {
  export interface IDriverConfig {
    vendorId: number; // Optional array of vendor IDs to search for
    usbCSaveSize: number;
    writeBufSize: number;
    reportType: number;
  }

  const CONCEPT2_DRIVER_CONFIG: IDriverConfig = {
    vendorId: 6052,
    usbCSaveSize: 120,
    writeBufSize: 121,
    reportType: 2,
  };

  const ROGUE_DRIVER_CONFIG: IDriverConfig = {
    vendorId: 7676,
    usbCSaveSize: 120,
    writeBufSize: 501,
    // writeBufSize: 65,
    reportType: 2,
  };

  // Full list of supported driver configurations
  export const DEFAULT_DRIVER_CONFIGS: IDriverConfig[] = [
    CONCEPT2_DRIVER_CONFIG,
    ROGUE_DRIVER_CONFIG,
  ];
}
