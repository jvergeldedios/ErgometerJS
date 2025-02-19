namespace ergometer.usb {
  export const USB_CSAVE_SIZE = 120;
  export const WRITE_BUF_SIZE = 121;
  export const REPORT_TYPE = 2;
  export const CONCEPT2_VENDOR_ID = 6052;

  export interface IDriverConfig {
    vendorIds?: number[]; // Optional array of vendor IDs to search for
  }

  // Default configuration using the original Concept2 vendor ID
  export const DEFAULT_DRIVER_CONFIG: IDriverConfig = {
    vendorIds: [CONCEPT2_VENDOR_ID],
  };
}
