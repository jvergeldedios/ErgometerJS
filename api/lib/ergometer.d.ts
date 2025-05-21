/**
 * Created by tijmen on 25-12-15.
 */
/** @internal */
declare namespace ergometer.utils {
    function getByte(value: number, byteIndex: number): number;
    function copyArrayBuffer(src: ArrayBuffer): ArrayBuffer;
    /**
    * Interpret byte buffer as unsigned little endian 32 bit integer.
    * Returns converted number.
    * @param {ArrayBuffer} data - Input buffer.
    * @param {number} offset - Start of data.
    * @return Converted number.
    * @public
    */
    function getUint24(data: DataView, offset: number): number;
    function bufferToString(buf: ArrayBuffer): any;
    function valueToNullValue(value: number, nullValue: number): number;
    function isDefined(variable: any): boolean;
    /**
     * Takes a ArrayBuffer or TypedArray and returns its hexadecimal representation.
     * No spaces or linebreaks.
     * @param data
     * @public
     */
    /**
     * Returns the integer i in hexadecimal string form,
     * with leading zeroes, such that
     * the resulting string is at least byteCount*2 characters long.
     * @param {int} i
     * @param {int} byteCount
     * @public
     */
    function toHexString(i: number, byteCount: number): string;
    /**
     * Takes a ArrayBuffer or TypedArray and returns its hexadecimal representation.
     * No spaces or linebreaks.
     * @param data
     * @public
     **/
    function typedArrayToHexString(data: ArrayBuffer | Uint8Array, addComma?: boolean): string;
    function hexStringToTypedArray(hexData: string): Uint8Array;
    function getTime(): number;
    function promiseAllSync(promisses: Promise<void>[]): Promise<void>;
}
/**
 * Created by tijmen on 04/07/2017.
 *
 * queue function calls which returns a promise, converted to typescript
 * needed as work around for web blue tooth, this ensures that only one call is processed at at time
 *
 *
 */
declare namespace ergometer.utils {
    /**
     * @return {Object}
     */
    /**
     * It limits concurrently executed promises
     *
     * @param {Number} [maxPendingPromises=Infinity] max number of concurrently executed promises
     * @param {Number} [maxQueuedPromises=Infinity]  max number of queued promises
     * @constructor
     *
     * @example
     *
     * var queue = new Queue(1);
     *
     * queue.add(function () {
       *     // resolve of this promise will resume next request
       *     return downloadTarballFromGithub(url, file);
       * })
     * .then(function (file) {
       *     doStuffWith(file);
       * });
     *
     * queue.add(function () {
       *     return downloadTarballFromGithub(url, file);
       * })
     * // This request will be paused
     * .then(function (file) {
       *     doStuffWith(file);
       * });
     */
    interface IPromiseFunction {
        (...args: any[]): Promise<any | void>;
    }
    class FunctionQueue {
        /**
         * @param {*} value
         * @returns {LocalPromise}
         */
        private resolveWith;
        private maxPendingPromises;
        private maxQueuedPromises;
        private pendingPromises;
        private queue;
        constructor(maxPendingPromises?: number, maxQueuedPromises?: number);
        /**
         * @param {promiseGenerator}  a function which returns a promise
         * @param {context} the object which is the context where the function is called in
         * @param  {params} array of parameters for the function
         * @return {Promise} promise which is resolved when the function is acually called
         */
        add(promiseGenerator: IPromiseFunction, context: any, ...params: any[]): Promise<any | void>;
        /**
         * Number of simultaneously running promises (which are resolving)
         *
         * @return {number}
         */
        getPendingLength(): number;
        /**
         * Number of queued promises (which are waiting)
         *
         * @return {number}
         */
        getQueueLength(): number;
        /**
         * @returns {boolean} true if first item removed from queue
         * @private
         */
        private _dequeue;
    }
}
/**
 *
 * Created by tijmen on 01-06-15.
 *
 * License:
 *
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
declare namespace ergometer.pubSub {
    interface ISubscription {
        (...args: any[]): void;
    }
    interface ISubscriptionItem {
        object: any;
        func: ISubscription;
    }
    interface IDictionary {
        [name: string]: ISubscriptionItem[];
    }
    class PubSub {
        private registry;
        pub(name: string, ...args: any[]): void;
        pubASync(name: string, ...args: any[]): void;
        sub(applyObject: any, name: string, fn: ISubscription): void;
        unsub(name: string, fn: ISubscription): void;
        subscribeCount(name: string): number;
    }
    interface ISubscriptionChanged {
        (sender: any, count: number): void;
    }
    class Event<T extends ISubscription> {
        protected _subscribed: ISubscriptionItem[];
        protected _subScriptionChangedEvent: ISubscriptionChanged;
        protected doChangedEvent(): void;
        protected findSubscription(event: T): ISubscriptionItem;
        sub(applyObject: any, event: T): void;
        unsub(event: T): void;
        protected doPub(args: any[]): void;
        get pub(): T;
        get pubAsync(): T;
        get count(): number;
        registerChangedEvent(func: ISubscriptionChanged): void;
    }
}
/**
 * Concept 2 ergometer Performance Monitor api for Cordova
 *
 * This will will work with the PM5
 *
 * Created by tijmen on 01-06-15.
 * License:
 *
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
declare namespace ergometer {
    interface ErrorHandler {
        (e: any): void;
    }
    enum LogLevel {
        error = 0,
        info = 1,
        debug = 2,
        trace = 3
    }
    interface LogEvent extends pubSub.ISubscription {
        (text: string, logLevel: LogLevel): void;
    }
    enum MonitorConnectionState {
        inactive = 0,
        deviceReady = 1,
        scanning = 2,
        connecting = 3,
        connected = 4,
        servicesFound = 5,
        readyForCommunication = 6
    }
    interface ConnectionStateChangedEvent extends pubSub.ISubscription {
        (oldState: MonitorConnectionState, newState: MonitorConnectionState): void;
    }
    class MonitorBase {
        private _logEvent;
        private _logLevel;
        private _connectionStateChangedEvent;
        protected _connectionState: MonitorConnectionState;
        /**
         * By default it the logEvent will return errors if you want more debug change the log level
         * @returns {LogLevel}
         */
        get logEvent(): pubSub.Event<LogEvent>;
        constructor();
        protected initialize(): void;
        get logLevel(): LogLevel;
        /**
         * By default it the logEvent will return errors if you want more debug change the log level
         * @param value
         */
        set logLevel(value: LogLevel);
        disconnect(): void;
        /**
         * read the current connection state
         * @returns {MonitorConnectionState}
         */
        get connectionState(): MonitorConnectionState;
        protected connected(): void;
        /**
         * event which is called when the connection state is changed. For example this way you
         * can check if the device is disconnected.
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<ConnectionStateChangedEvent>}
         */
        get connectionStateChangedEvent(): pubSub.Event<ConnectionStateChangedEvent>;
        debugInfo(info: string): void;
        /**
         *
         * @param info
         */
        showInfo(info: string): void;
        /**
         * Print debug info to console and application UI.
         * @param info
         */
        traceInfo(info: string): void;
        /**
         * call the global error hander and call the optional error handler if given
         * @param error
         */
        handleError(error: string, errorFn?: ErrorHandler): void;
        /**
         * Get an error function which adds the errorDescription to the error ,cals the global and an optional local funcion
         * @param errorDescription
         * @param errorFn
         */
        getErrorHandlerFunc(errorDescription: string, errorFn?: ErrorHandler): ErrorHandler;
        protected beforeConnected(): void;
        /**
         *
         * @param value
         */
        protected changeConnectionState(value: MonitorConnectionState): void;
    }
}
/**
 * Created by tijmen on 01-02-16.
 */
declare namespace ergometer.ble {
    interface IDevice {
        address: string;
        name: string;
        rssi: number;
        _internalDevice: any;
    }
    interface IFoundFunc {
        (device: IDevice): void;
    }
    interface IDriver {
        startScan(foundFn?: IFoundFunc): Promise<void>;
        stopScan(): void;
        connect(device: IDevice, disconnectFn: () => void): Promise<void>;
        disconnect(): void;
        writeCharacteristic(serviceUIID: string, characteristicUUID: string, data: ArrayBufferView): Promise<void>;
        readCharacteristic(serviceUIID: string, characteristicUUID: string): Promise<ArrayBuffer>;
        enableNotification(serviceUIID: string, characteristicUUID: string, receive: (data: ArrayBuffer) => void): Promise<void>;
        disableNotification(serviceUIID: string, characteristicUUID: string): Promise<void>;
    }
}
/**
 * Created by tijmen on 01-02-16.
 */
declare namespace ergometer.ble {
    class DriverBleat implements IDriver {
        private _device;
        private getCharacteristic;
        connect(device: IDevice, disconnectFn: () => void): Promise<void>;
        disconnect(): void;
        startScan(foundFn?: IFoundFunc): Promise<void>;
        stopScan(): Promise<void>;
        writeCharacteristic(serviceUIID: string, characteristicUUID: string, data: ArrayBufferView): Promise<void>;
        readCharacteristic(serviceUIID: string, characteristicUUID: string): Promise<ArrayBuffer>;
        enableNotification(serviceUIID: string, characteristicUUID: string, receive: (data: ArrayBuffer) => void): Promise<void>;
        disableNotification(serviceUIID: string, characteristicUUID: string): Promise<void>;
    }
}
/**
 * Created by tijmen on 03/04/2017.
 */
/**
 * Created by tijmen on 01-02-16.
 *
 * see simpleBLE.d.ts for the definitions of the simpleBLE
 * It assumes that there simple ble is already imported as a var named simpleBLE
 *
 */
declare namespace ergometer.ble {
    class DriverSimpleBLE implements IDriver {
        connect(device: IDevice, disconnectFn: () => void): Promise<void>;
        disconnect(): void;
        startScan(foundFn?: IFoundFunc): Promise<void>;
        stopScan(): Promise<void>;
        writeCharacteristic(serviceUIID: string, characteristicUUID: string, data: ArrayBufferView): Promise<void>;
        readCharacteristic(serviceUIID: string, characteristicUUID: string): Promise<ArrayBuffer>;
        enableNotification(serviceUIID: string, characteristicUUID: string, receive: (data: ArrayBuffer) => void): Promise<void>;
        disableNotification(serviceUIID: string, characteristicUUID: string): Promise<void>;
    }
}
declare namespace bleCentral {
    function available(): boolean;
    class DriverBleCentral implements ergometer.ble.IDriver {
        private _scanServices;
        private _device;
        connect(device: ergometer.ble.IDevice, disconnectFn: () => void): Promise<void>;
        constructor(_scanServices: string[]);
        disconnect(): void;
        startScan(foundFn?: ergometer.ble.IFoundFunc, retry?: boolean): Promise<void>;
        stopScan(): Promise<void>;
        writeCharacteristic(serviceUIID: string, characteristicUUID: string, data: ArrayBufferView): Promise<void>;
        readCharacteristic(serviceUIID: string, characteristicUUID: string): Promise<ArrayBuffer>;
        enableNotification(serviceUIID: string, characteristicUUID: string, receive: (data: ArrayBuffer) => void): Promise<void>;
        disableNotification(serviceUIID: string, characteristicUUID: string): Promise<void>;
    }
}
/**
 * Created by tijmen on 17-07-16.
 */
/**
 * Created by tijmen on 01-02-16.
 */
declare namespace ergometer.ble {
    function hasWebBlueTooth(): boolean;
    class DriverWebBlueTooth implements IDriver {
        private _performanceMonitor;
        private _scanServices;
        private _scanOptionalServices;
        private _device;
        private _server;
        private _disconnectFn;
        private _listenerMap;
        private _listerCharacteristicMap;
        constructor(_performanceMonitor: MonitorBase, _scanServices: string[], _scanOptionalServices: string[]);
        private getCharacteristic;
        private onDisconnected;
        private clearConnectionVars;
        connect(device: IDevice, disconnectFn: () => void): Promise<void>;
        disconnect(): void;
        startScan(foundFn?: IFoundFunc): Promise<void>;
        stopScan(): Promise<void>;
        writeCharacteristic(serviceUIID: string, characteristicUUID: string, data: ArrayBufferView): Promise<void>;
        readCharacteristic(serviceUIID: string, characteristicUUID: string): Promise<ArrayBuffer>;
        private onCharacteristicValueChanged;
        enableNotification(serviceUIID: string, characteristicUUID: string, receive: (data: ArrayBuffer) => void): Promise<void>;
        disableNotification(serviceUIID: string, characteristicUUID: string): Promise<void>;
    }
}
/**
 * Created by tijmen on 16-02-16.
 */
declare namespace ergometer.ble {
    interface IRecordDevice {
        address: string;
        name: string;
        rssi: number;
    }
    interface IRecordCharacteristic {
        serviceUIID: string;
        characteristicUUID: string;
        data?: string;
    }
    enum RecordingEventType {
        startScan = 0,
        scanFoundFn = 1,
        stopScan = 2,
        connect = 3,
        disconnectFn = 4,
        disconnect = 5,
        writeCharacteristic = 6,
        readCharacteristic = 7,
        enableNotification = 8,
        notificationReceived = 9,
        disableNotification = 10
    }
    interface IRecordingItem {
        timeStamp: number;
        eventType: string;
        timeStampReturn?: number;
        data?: IRecordCharacteristic | IRecordDevice;
        error?: any;
    }
    class RecordingDriver implements IDriver {
        private _realDriver;
        private _startTime;
        private _events;
        _performanceMonitor: MonitorBase;
        constructor(performanceMonitor: MonitorBase, realDriver: IDriver);
        protected getRelativeTime(): number;
        addRecording(eventType: RecordingEventType, data?: IRecordCharacteristic | IRecordDevice): IRecordingItem;
        get events(): ergometer.ble.IRecordingItem[];
        set events(value: ergometer.ble.IRecordingItem[]);
        clear(): void;
        startRecording(): void;
        protected recordResolveFunc(resolve: () => void, rec: IRecordingItem): () => void;
        protected recordResolveBufferFunc(resolve: (data: ArrayBuffer) => void, rec: IRecordingItem): (data: ArrayBuffer) => void;
        protected recordErrorFunc(reject: (e: any) => void, rec: IRecordingItem): (e: any) => void;
        startScan(foundFn?: IFoundFunc): Promise<void>;
        stopScan(): void;
        connect(device: IDevice, disconnectFn: () => void): Promise<void>;
        disconnect(): void;
        writeCharacteristic(serviceUIID: string, characteristicUUID: string, data: ArrayBufferView): Promise<void>;
        readCharacteristic(serviceUIID: string, characteristicUUID: string): Promise<ArrayBuffer>;
        enableNotification(serviceUIID: string, characteristicUUID: string, receive: (data: ArrayBuffer) => void): Promise<void>;
        disableNotification(serviceUIID: string, characteristicUUID: string): Promise<void>;
    }
}
/**
 * Created by tijmen on 18-02-16.
 */
declare namespace ergometer.ble {
    interface CallBackEvent extends IRecordingItem {
        resolve?: (e?: any) => void;
        reject?: (e: any) => void;
    }
    class ReplayDriver implements IDriver {
        private _realDriver;
        private _events;
        private _eventCallBackMethods;
        private _eventCallbacks;
        private _playing;
        private _eventIndex;
        private _startTime;
        private _checkQueueTimerId;
        private _performanceMonitor;
        protected getRelativeTime(): number;
        constructor(performanceMonitor: MonitorBase, realDriver: IDriver);
        get events(): ergometer.ble.IRecordingItem[];
        protected isCallBack(eventType: RecordingEventType): boolean;
        protected isSameEvent(event1: IRecordingItem, event2: IRecordingItem): boolean;
        protected runEvent(event: IRecordingItem, queuedEvent: CallBackEvent): void;
        protected runTimedEvent(event: IRecordingItem, queuedEvent: CallBackEvent): void;
        protected removeEvent(i: number): void;
        protected checkQueue(): void;
        protected checkAllEventsProcessd(): boolean;
        protected timeNextCheck(timeStamp?: number): void;
        protected addEvent(eventType: RecordingEventType, isMethod: boolean, resolve?: (e?: any) => void, reject?: (e: any) => void, serviceUIID?: string, characteristicUUID?: string): void;
        replay(events: IRecordingItem[]): void;
        get playing(): boolean;
        set playing(value: boolean);
        startScan(foundFn?: IFoundFunc): Promise<void>;
        stopScan(): void;
        connect(device: IDevice, disconnectFn: () => void): Promise<void>;
        disconnect(): void;
        writeCharacteristic(serviceUIID: string, characteristicUUID: string, data: ArrayBufferView): Promise<void>;
        readCharacteristic(serviceUIID: string, characteristicUUID: string): Promise<ArrayBuffer>;
        enableNotification(serviceUIID: string, characteristicUUID: string, receive: (data: ArrayBuffer) => void): Promise<void>;
        disableNotification(serviceUIID: string, characteristicUUID: string): Promise<void>;
    }
}
/**
 * Created by tijmen on 16-01-16.
 */
/** @internal */
declare namespace ergometer.ble {
    /** @internal */
    const PMDEVICE = "ce060000-43e5-11e4-916c-0800200c9a66";
    const HEART_RATE_DEVICE_SERVICE = "0000180d-0000-1000-8000-00805f9b34fb";
    const HEART_RATE_MEASUREMENT = "00002a37-0000-1000-8000-00805f9b34fb";
    const PMDEVICE_INFO_SERVICE = "ce060010-43e5-11e4-916c-0800200c9a66";
    const PMCONTROL_SERVICE = "ce060020-43e5-11e4-916c-0800200c9a66";
    const PMROWING_SERVICE = "ce060030-43e5-11e4-916c-0800200c9a66";
    const MODELNUMBER_CHARACTERISIC = "ce060011-43e5-11e4-916c-0800200c9a66";
    const SERIALNUMBER_CHARACTERISTIC = "ce060012-43e5-11e4-916c-0800200c9a66";
    const HWREVISION_CHARACTERISIC = "ce060013-43e5-11e4-916c-0800200c9a66";
    const FWREVISION_CHARACTERISIC = "ce060014-43e5-11e4-916c-0800200c9a66";
    const MANUFNAME_CHARACTERISIC = "ce060015-43e5-11e4-916c-0800200c9a66";
    const MACHINETYPE_CHARACTERISIC = "ce060016-43e5-11e4-916c-0800200c9a66";
    const TRANSMIT_TO_PM_CHARACTERISIC = "ce060021-43e5-11e4-916c-0800200c9a66";
    const RECEIVE_FROM_PM_CHARACTERISIC = "ce060022-43e5-11e4-916c-0800200c9a66";
    const ROWING_STATUS_CHARACTERISIC = "ce060031-43e5-11e4-916c-0800200c9a66";
    const EXTRA_STATUS1_CHARACTERISIC = "ce060032-43e5-11e4-916c-0800200c9a66";
    const EXTRA_STATUS2_CHARACTERISIC = "ce060033-43e5-11e4-916c-0800200c9a66";
    const ROWING_STATUS_SAMPLE_RATE_CHARACTERISIC = "ce060034-43e5-11e4-916c-0800200c9a66";
    const STROKE_DATA_CHARACTERISIC = "ce060035-43e5-11e4-916c-0800200c9a66";
    const EXTRA_STROKE_DATA_CHARACTERISIC = "ce060036-43e5-11e4-916c-0800200c9a66";
    const SPLIT_INTERVAL_DATA_CHARACTERISIC = "ce060037-43e5-11e4-916c-0800200c9a66";
    const EXTRA_SPLIT_INTERVAL_DATA_CHARACTERISIC = "ce060038-43e5-11e4-916c-0800200c9a66";
    const ROWING_SUMMARY_CHARACTERISIC = "ce060039-43e5-11e4-916c-0800200c9a66";
    const EXTRA_ROWING_SUMMARY_CHARACTERISIC = "ce06003a-43e5-11e4-916c-0800200c9a66";
    const HEART_RATE_BELT_INFO_CHARACTERISIC = "ce06003b-43e5-11e4-916c-0800200c9a66";
    const MULTIPLEXED_INFO_CHARACTERISIC = "ce060080-43e5-11e4-916c-0800200c9a66";
    const NOTIFICATION_DESCRIPTOR = "00002902-0000-1000-8000-00805f9b34fb";
    const PACKET_SIZE = 20;
    const enum PM_Rowing_Status_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        DISTANCE_LO = 3,
        DISTANCE_MID = 4,
        DISTANCE_HI = 5,
        WORKOUT_TYPE = 6,
        INTERVAL_TYPE = 7,
        WORKOUT_STATE = 8,
        ROWING_STATE = 9,
        STROKE_STATE = 10,
        TOTAL_WORK_DISTANCE_LO = 11,
        TOTAL_WORK_DISTANCE_MID = 12,
        TOTAL_WORK_DISTANCE_HI = 13,
        WORKOUT_DURATION_LO = 14,
        WORKOUT_DURATION_MID = 15,
        WORKOUT_DURATION_HI = 16,
        WORKOUT_DURATION_TYPE = 17,
        DRAG_FACTOR = 18,
        BLE_PAYLOAD_SIZE = 19
    }
    const enum PM_Extra_Status1_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        SPEED_LO = 3,
        SPEED_HI = 4,
        STROKE_RATE = 5,
        HEARTRATE = 6,
        CURRENT_PACE_LO = 7,
        CURRENT_PACE_HI = 8,
        AVG_PACE_LO = 9,
        AVG_PACE_HI = 10,
        REST_DISTANCE_LO = 11,
        REST_DISTANCE_HI = 12,
        REST_TIME_LO = 13,
        REST_TIME_MID = 14,
        REST_TIME_HI = 15,
        BLE_PAYLOAD_SIZE = 16
    }
    const enum PM_Mux_Extra_Status1_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        SPEED_LO = 3,
        SPEED_HI = 4,
        STROKE_RATE = 5,
        HEARTRATE = 6,
        CURRENT_PACE_LO = 7,
        CURRENT_PACE_HI = 8,
        AVG_PACE_LO = 9,
        AVG_PACE_HI = 10,
        REST_DISTANCE_LO = 11,
        REST_DISTANCE_HI = 12,
        REST_TIME_LO = 13,
        REST_TIME_MID = 14,
        REST_TIME_HI = 15,
        AVG_POWER_LO = 16,
        AVG_POWER_HI = 17,
        BLE_PAYLOAD_SIZE = 18
    }
    const enum PM_Extra_Status2_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        INTERVAL_COUNT = 3,
        AVG_POWER_LO = 4,
        AVG_POWER_HI = 5,
        TOTAL_CALORIES_LO = 6,
        TOTAL_CALORIES_HI = 7,
        SPLIT_INTERVAL_AVG_PACE_LO = 8,
        SPLIT_INTERVAL_AVG_PACE_HI = 9,
        SPLIT_INTERVAL_AVG_POWER_LO = 10,
        SPLIT_INTERVAL_AVG_POWER_HI = 11,
        SPLIT_INTERVAL_AVG_CALORIES_LO = 12,
        SPLIT_INTERVAL_AVG_CALORIES_HI = 13,
        LAST_SPLIT_TIME_LO = 14,
        LAST_SPLIT_TIME_MID = 15,
        LAST_SPLIT_TIME_HI = 16,
        LAST_SPLIT_DISTANCE_LO = 17,
        LAST_SPLIT_DISTANCE_MID = 18,
        LAST_SPLIT_DISTANCE_HI = 19,
        BLE_PAYLOAD_SIZE = 20
    }
    const enum PM_Mux_Extra_Status2_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        INTERVAL_COUNT = 3,
        TOTAL_CALORIES_LO = 4,
        TOTAL_CALORIES_HI = 5,
        SPLIT_INTERVAL_AVG_PACE_LO = 6,
        SPLIT_INTERVAL_AVG_PACE_HI = 7,
        SPLIT_INTERVAL_AVG_POWER_LO = 8,
        SPLIT_INTERVAL_AVG_POWER_HI = 9,
        SPLIT_INTERVAL_AVG_CALORIES_LO = 10,
        SPLIT_INTERVAL_AVG_CALORIES_HI = 11,
        LAST_SPLIT_TIME_LO = 12,
        LAST_SPLIT_TIME_MID = 13,
        LAST_SPLIT_TIME_HI = 14,
        LAST_SPLIT_DISTANCE_LO = 15,
        LAST_SPLIT_DISTANCE_MID = 16,
        LAST_SPLIT_DISTANCE_HI = 17,
        BLE_PAYLOAD_SIZE = 18
    }
    const enum PM_Stroke_Data_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        DISTANCE_LO = 3,
        DISTANCE_MID = 4,
        DISTANCE_HI = 5,
        DRIVE_LENGTH = 6,
        DRIVE_TIME = 7,
        STROKE_RECOVERY_TIME_LO = 8,
        STROKE_RECOVERY_TIME_HI = 9,
        STROKE_DISTANCE_LO = 10,
        STROKE_DISTANCE_HI = 11,
        PEAK_DRIVE_FORCE_LO = 12,
        PEAK_DRIVE_FORCE_HI = 13,
        AVG_DRIVE_FORCE_LO = 14,
        AVG_DRIVE_FORCE_HI = 15,
        WORK_PER_STROKE_LO = 16,
        WORK_PER_STROKE_HI = 17,
        STROKE_COUNT_LO = 18,
        STROKE_COUNT_HI = 19,
        BLE_PAYLOAD_SIZE = 20
    }
    const enum PM_Mux_Stroke_Data_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        DISTANCE_LO = 3,
        DISTANCE_MID = 4,
        DISTANCE_HI = 5,
        DRIVE_LENGTH = 6,
        DRIVE_TIME = 7,
        STROKE_RECOVERY_TIME_LO = 8,
        STROKE_RECOVERY_TIME_HI = 9,
        STROKE_DISTANCE_LO = 10,
        STROKE_DISTANCE_HI = 11,
        PEAK_DRIVE_FORCE_LO = 12,
        PEAK_DRIVE_FORCE_HI = 13,
        AVG_DRIVE_FORCE_LO = 14,
        AVG_DRIVE_FORCE_HI = 15,
        STROKE_COUNT_LO = 16,
        STROKE_COUNT_HI = 17,
        BLE_PAYLOAD_SIZE = 18
    }
    const enum PM_Extra_Stroke_Data_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        STROKE_POWER_LO = 3,
        STROKE_POWER_HI = 4,
        STROKE_CALORIES_LO = 5,
        STROKE_CALORIES_HI = 6,
        STROKE_COUNT_LO = 7,
        STROKE_COUNT_HI = 8,
        PROJ_WORK_TIME_LO = 9,
        PROJ_WORK_TIME_MID = 10,
        PROJ_WORK_TIME_HI = 11,
        PROJ_WORK_DIST_LO = 12,
        PROJ_WORK_DIST_MID = 13,
        PROJ_WORK_DIST_HI = 14,
        BLE_PAYLOAD_SIZE = 15
    }
    const enum PM_Mux_Extra_Stroke_Data_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        STROKE_POWER_LO = 3,
        STROKE_POWER_HI = 4,
        STROKE_CALORIES_LO = 5,
        STROKE_CALORIES_HI = 6,
        STROKE_COUNT_LO = 7,
        STROKE_COUNT_HI = 8,
        PROJ_WORK_TIME_LO = 9,
        PROJ_WORK_TIME_MID = 10,
        PROJ_WORK_TIME_HI = 11,
        PROJ_WORK_DIST_LO = 12,
        PROJ_WORK_DIST_MID = 13,
        PROJ_WORK_DIST_HI = 14,
        WORK_PER_STROKE_LO = 15,
        WORK_PER_STROKE_HI = 16,
        BLE_PAYLOAD_SIZE = 17
    }
    const enum PM_Split_Interval_Data_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        DISTANCE_LO = 3,
        DISTANCE_MID = 4,
        DISTANCE_HI = 5,
        SPLIT_TIME_LO = 6,
        SPLIT_TIME_MID = 7,
        SPLIT_TIME_HI = 8,
        SPLIT_DISTANCE_LO = 9,
        SPLIT_DISTANCE_MID = 10,
        SPLIT_DISTANCE_HI = 11,
        REST_TIME_LO = 12,
        REST_TIME_HI = 13,
        REST_DISTANCE_LO = 14,
        REST_DISTANCE_HI = 15,
        TYPE = 16,
        INT_NUMBER = 17,
        BLE_PAYLOAD_SIZE = 18
    }
    const enum PM_Extra_Split_Interval_Data_BLE_Payload {
        ELAPSED_TIME_LO = 0,
        ELAPSED_TIME_MID = 1,
        ELAPSED_TIME_HI = 2,
        STROKE_RATE = 3,
        WORK_HR = 4,
        REST_HR = 5,
        AVG_PACE_LO = 6,
        AVG_PACE_HI = 7,
        CALORIES_LO = 8,
        CALORIES_HI = 9,
        AVG_CALORIES_LO = 10,
        AVG_CALORIES_HI = 11,
        SPEED_LO = 12,
        SPEED_HI = 13,
        POWER_LO = 14,
        POWER_HI = 15,
        AVG_DRAG_FACTOR = 16,
        INT_NUMBER = 17,
        BLE_PAYLOAD_SIZE = 18
    }
    const enum PM_Workout_Summary_Data_BLE_Payload {
        LOG_DATE_LO = 0,
        LOG_DATE_HI = 1,
        LOG_TIME_LO = 2,
        LOG_TIME_HI = 3,
        ELAPSED_TIME_LO = 4,
        ELAPSED_TIME_MID = 5,
        ELAPSED_TIME_HI = 6,
        DISTANCE_LO = 7,
        DISTANCE_MID = 8,
        DISTANCE_HI = 9,
        AVG_SPM = 10,
        END_HR = 11,
        AVG_HR = 12,
        MIN_HR = 13,
        MAX_HR = 14,
        AVG_DRAG_FACTOR = 15,
        RECOVERY_HR = 16,
        WORKOUT_TYPE = 17,
        AVG_PACE_LO = 18,
        AVG_PACE_HI = 19,
        BLE_PAYLOAD_SIZE = 20
    }
    const enum PM_Mux_Workout_Summary_Data_BLE_Payload {
        LOG_DATE_LO = 0,
        LOG_DATE_HI = 1,
        LOG_TIME_LO = 2,
        LOG_TIME_HI = 3,
        ELAPSED_TIME_LO = 4,
        ELAPSED_TIME_MID = 5,
        ELAPSED_TIME_HI = 6,
        DISTANCE_LO = 7,
        DISTANCE_MID = 8,
        DISTANCE_HI = 9,
        AVG_SPM = 10,
        END_HR = 11,
        AVG_HR = 12,
        MIN_HR = 13,
        MAX_HR = 14,
        AVG_DRAG_FACTOR = 15,
        RECOVERY_HR = 16,
        WORKOUT_TYPE = 17,
        BLE_PAYLOAD_SIZE = 18
    }
    const enum PM_Extra_Workout_Summary_Data_BLE_Payload {
        LOG_DATE_LO = 0,
        LOG_DATE_HI = 1,
        LOG_TIME_LO = 2,
        LOG_TIME_HI = 3,
        SPLIT_INT_TYPE = 4,
        SPLIT_INT_SIZE_LO = 5,
        SPLIT_INT_SIZE_HI = 6,
        SPLIT_INT_COUNT = 7,
        WORK_CALORIES_LO = 8,
        WORK_CALORIES_HI = 9,
        WATTS_LO = 10,
        WATTS_HI = 11,
        TOTAL_REST_DISTANCE_LO = 12,
        TOTAL_REST_DISTANCE_MID = 13,
        TOTAL_REST_DISTANCE_HI = 14,
        INTERVAL_REST_TIME_LO = 15,
        INTERVAL_REST_TIME_HI = 16,
        AVG_CALORIES_LO = 17,
        AVG_CALORIES_HI = 18,
        DATA_BLE_PAYLOAD_SIZE = 19
    }
    const enum PM_Mux_Extra_Workout_Summary_Data_BLE_Payload {
        LOG_DATE_LO = 0,
        LOG_DATE_HI = 1,
        LOG_TIME_LO = 2,
        LOG_TIME_HI = 3,
        SPLIT_INT_SIZE_LO = 4,
        SPLIT_INT_SIZE_HI = 5,
        SPLIT_INT_COUNT = 6,
        WORK_CALORIES_LO = 7,
        WORK_CALORIES_HI = 8,
        WATTS_LO = 9,
        WATTS_HI = 10,
        TOTAL_REST_DISTANCE_LO = 11,
        TOTAL_REST_DISTANCE_MID = 12,
        TOTAL_REST_DISTANCE_HI = 13,
        INTERVAL_REST_TIME_LO = 14,
        INTERVAL_REST_TIME_HI = 15,
        AVG_CALORIES_LO = 16,
        AVG_CALORIES_HI = 17,
        BLE_PAYLOAD_SIZE = 18
    }
    const enum PM_Mux_Extra_Workout_Summary2_Data_BLE_Payload {
        LOG_DATE_LO = 0,
        LOG_DATE_HI = 1,
        LOG_TIME_LO = 2,
        LOG_TIME_HI = 3,
        AVG_PACE_LO = 4,
        AVG_PACE_HI = 5,
        GAME_ID = 6,
        GAME_SCORE_LO = 7,
        GAME_SCORE_HI = 8,
        MACHINE_TYPE = 9,
        DATA_BLE_PAYLOAD_SIZE = 10
    }
    const enum PM_Heart_Rate_Belt_Info_BLE_Payload {
        MANUFACTURER_ID = 0,
        DEVICE_TYPE = 1,
        BELT_ID_LO = 2,
        BELT_ID_MID_LO = 3,
        BELT_ID_MID_HI = 4,
        BELT_ID_HI = 5,
        BLE_PAYLOAD_SIZE = 6
    }
    const enum PM_Multiplexed_Info_Type_ID {
        ROWING_GENERAL_STATUS = 49,
        ROWING_ADDITIONAL_STATUS1 = 50,
        ROWING_ADDITIONAL_STATUS2 = 51,
        STROKE_DATA_STATUS = 53,
        EXTRA_STROKE_DATA_STATUS = 54,
        SPLIT_INTERVAL_STATUS = 55,
        EXTRA_SPLIT_INTERVAL_STATUS = 56,
        WORKOUT_SUMMARY_STATUS = 57,
        EXTRA_WORKOUT_SUMMARY_STATUS1 = 58,
        HEART_RATE_BELT_INFO_STATUS = 59,
        EXTRA_WORKOUT_SUMMARY_STATUS2 = 60
    }
}
declare namespace ergometer.usb {
    interface IDriverConfig {
        vendorId: number;
        usbCSaveSize: number;
        writeBufSize: number;
        reportType: number;
    }
    const DEFAULT_DRIVER_CONFIGS: IDriverConfig[];
}
declare namespace ergometer.usb {
    type DisconnectFunc = () => void;
    type Devices = IDevice[];
    interface IDevice {
        readonly vendorId: number;
        readonly productId: number;
        readonly productName: string;
        readonly serialNumber: string;
        readonly driverConfig: IDriverConfig;
        open(disconnect: DisconnectFunc, error: (err: any) => void, receiveData: (data: DataView) => void): Promise<void>;
        close(): Promise<void>;
        sendData(data: ArrayBuffer): Promise<void>;
    }
    interface IDriver {
        requestDevics(): Promise<Devices>;
        getConfig?(): IDriverConfig;
        setConfig?(config: IDriverConfig): void;
    }
}
declare namespace ergometer.usb {
    class DeviceNodeHid implements IDevice {
        private _disconnect;
        private _onError;
        private _deviceInfo;
        private _hid;
        vendorId: number;
        productId: number;
        productName: string;
        serialNumber: string;
        driverConfig: IDriverConfig;
        constructor(deviceInfo: any, config: IDriverConfig);
        callError(err: any): void;
        private _receiveData;
        open(disconnect: DisconnectFunc, error: (err: any) => void, receiveData: (data: DataView) => void): Promise<void>;
        close(): Promise<void>;
        sendData(data: ArrayBuffer): Promise<void>;
        readData(): void;
    }
    class DriverNodeHid implements IDriver {
        private _config;
        private _vendorIds;
        constructor(config: IDriverConfig[]);
        getDriverConfigByVendorId(vendorId: number): IDriverConfig;
        requestDevics(): Promise<Devices>;
    }
}
/**
 * Created by tijmen on 16-01-16.
 *
 * translation of concept 2 csafe.h to typescript version  9/16/08 10:51a
 */
declare namespace ergometer.csafe.defs {
    const EXT_FRAME_START_BYTE = 240;
    const FRAME_START_BYTE = 241;
    const FRAME_END_BYTE = 242;
    const FRAME_STUFF_BYTE = 243;
    const FRAME_MAX_STUFF_OFFSET_BYTE = 3;
    const FRAME_FLG_LEN = 2;
    const EXT_FRAME_ADDR_LEN = 2;
    const FRAME_CHKSUM_LEN = 1;
    const SHORT_CMD_TYPE_MSK = 128;
    const LONG_CMD_HDR_LENGTH = 2;
    const LONG_CMD_BYTE_CNT_OFFSET = 1;
    const RSP_HDR_LENGTH = 2;
    const FRAME_STD_TYPE = 0;
    const FRAME_EXT_TYPE = 1;
    const DESTINATION_ADDR_HOST = 0;
    const DESTINATION_ADDR_ERG_MASTER = 1;
    const DESTINATION_ADDR_BROADCAST = 255;
    const DESTINATION_ADDR_ERG_DEFAULT = 253;
    const FRAME_MAXSIZE = 96;
    const INTERFRAMEGAP_MIN = 50;
    const CMDUPLIST_MAXSIZE = 10;
    const MEMORY_BLOCKSIZE = 64;
    const FORCEPLOT_BLOCKSIZE = 32;
    const HEARTBEAT_BLOCKSIZE = 32;
    const MANUFACTURE_ID = 22;
    const CLASS_ID = 2;
    const MODEL_NUM = 5;
    const UNITS_TYPE = 0;
    const SERIALNUM_DIGITS = 9;
    const HMS_FORMAT_CNT = 3;
    const YMD_FORMAT_CNT = 3;
    const ERRORCODE_FORMAT_CNT = 3;
    const CTRL_CMD_LONG_MIN = 1;
    const CFG_CMD_LONG_MIN = 16;
    const DATA_CMD_LONG_MIN = 32;
    const AUDIO_CMD_LONG_MIN = 64;
    const TEXTCFG_CMD_LONG_MIN = 96;
    const TEXTSTATUS_CMD_LONG_MIN = 101;
    const CAP_CMD_LONG_MIN = 112;
    const PMPROPRIETARY_CMD_LONG_MIN = 118;
    const CTRL_CMD_SHORT_MIN = 128;
    const STATUS_CMD_SHORT_MIN = 145;
    const DATA_CMD_SHORT_MIN = 160;
    const AUDIO_CMD_SHORT_MIN = 192;
    const TEXTCFG_CMD_SHORT_MIN = 224;
    const TEXTSTATUS_CMD_SHORT_MIN = 229;
    const enum SHORT_CTRL_CMDS {
        GETSTATUS_CMD = 128,//CTRL_CMD_SHORT_MIN
        RESET_CMD = 129,// 0x81
        GOIDLE_CMD = 130,// 0x82
        GOHAVEID_CMD = 131,// 0x83
        GOINUSE_CMD = 133,// 0x85
        GOFINISHED_CMD = 134,// 0x86
        GOREADY_CMD = 135,// 0x87
        BADID_CMD = 136,// 0x88
        CTRL_CMD_SHORT_MAX = 137
    }
    const enum SHORT_STATUS_CMDS {
        GETVERSION_CMD = 145,// STATUS_CMD_SHORT_MIN
        GETID_CMD = 146,// 0x92
        GETUNITS_CMD = 147,// 0x93
        GETSERIAL_CMD = 148,// 0x94
        GETLIST_CMD = 152,// 0x98
        GETUTILIZATION_CMD = 153,// 0x99
        GETMOTORCURRENT_CMD = 154,// 0x9A
        GETODOMETER_CMD = 155,// 0x9B
        GETERRORCODE_CMD = 156,// 0x9C
        GETSERVICECODE_CMD = 157,// 0x9D
        GETUSERCFG1_CMD = 158,// 0x9E
        GETUSERCFG2_CMD = 159,// 0x9F
        STATUS_CMD_SHORT_MAX = 160
    }
    const enum SHORT_DATA_CMDS {
        GETTWORK_CMD = 160,// DATA_CMD_SHORT_MIN
        GETHORIZONTAL_CMD = 161,// 0xA1
        GETVERTICAL_CMD = 162,// 0xA2
        GETCALORIES_CMD = 163,// 0xA3
        GETPROGRAM_CMD = 164,// 0xA4
        GETSPEED_CMD = 165,// 0xA5
        GETPACE_CMD = 166,// 0xA6
        GETCADENCE_CMD = 167,// 0xA7
        GETGRADE_CMD = 168,// 0xA8
        GETGEAR_CMD = 169,// 0xA9
        GETUPLIST_CMD = 170,// 0xAA
        GETUSERINFO_CMD = 171,// 0xAB
        GETTORQUE_CMD = 172,// 0xAC
        GETHRCUR_CMD = 176,// 0xB0
        GETHRTZONE_CMD = 178,// 0xB2
        GETMETS_CMD = 179,// 0xB3
        GETPOWER_CMD = 180,// 0xB4
        GETHRAVG_CMD = 181,// 0xB5
        GETHRMAX_CMD = 182,// 0xB6
        GETUSERDATA1_CMD = 190,// 0xBE
        GETUSERDATA2_CMD = 191,// 0xBF
        DATA_CMD_SHORT_MAX = 192
    }
    const enum SHORT_AUDIO_CMDS {
        GETAUDIOCHANNEL_CMD = 192,//AUDIO_CMD_SHORT_MIN
        GETAUDIOVOLUME_CMD = 193,// 0xC1
        GETAUDIOMUTE_CMD = 194,// 0xC2
        AUDIO_CMD_SHORT_MAX = 195
    }
    const enum SHORT_TEXTCFG_CMDS {
        ENDTEXT_CMD = 224,//TEXTCFG_CMD_SHORT_MIN
        DISPLAYPOPUP_CMD = 225,// 0xE1
        TEXTCFG_CMD_SHORT_MAX = 226
    }
    const enum SHORT_TEXTSTATUS_CMDS {
        GETPOPUPSTATUS_CMD = 229,// TEXTSTATUS_CMD_SHORT_MIN
        TEXTSTATUS_CMD_SHORT_MAX = 230
    }
    const enum LONG_CTRL_CMDS {
        AUTOUPLOAD_CMD = 1,// CTRL_CMD_LONG_MIN
        UPLIST_CMD = 2,// 0x02
        UPSTATUSSEC_CMD = 4,// 0x04
        UPLISTSEC_CMD = 5,// 0x05
        CTRL_CMD_LONG_MAX = 6
    }
    const enum LONG_CFG_CMDS {
        IDDIGITS_CMD = 16,//  CFG_CMD_LONG_MIN
        SETTIME_CMD = 17,// 0x11
        SETDATE_CMD = 18,// 0x12
        SETTIMEOUT_CMD = 19,// 0x13
        SETUSERCFG1_CMD = 26,// 0x1A
        SETUSERCFG2_CMD = 27,// 0x1B
        CFG_CMD_LONG_MAX = 28
    }
    const enum LONG_DATA_CMDS {
        SETTWORK_CMD = 32,//DATA_CMD_LONG_MIN
        SETHORIZONTAL_CMD = 33,// 0x21
        SETVERTICAL_CMD = 34,// 0x22
        SETCALORIES_CMD = 35,// 0x23
        SETPROGRAM_CMD = 36,// 0x24
        SETSPEED_CMD = 37,// 0x25
        SETGRADE_CMD = 40,// 0x28
        SETGEAR_CMD = 41,// 0x29
        SETUSERINFO_CMD = 43,// 0x2B
        SETTORQUE_CMD = 44,// 0x2C
        SETLEVEL_CMD = 45,// 0x2D
        SETTARGETHR_CMD = 48,// 0x30
        SETGOAL_CMD = 50,// 0x32
        SETMETS_CMD = 51,// 0x33
        SETPOWER_CMD = 52,// 0x34
        SETHRZONE_CMD = 53,// 0x35
        SETHRMAX_CMD = 54,// 0x36
        DATA_CMD_LONG_MAX = 55
    }
    const enum LONG_AUDIO_CMDS {
        SETCHANNELRANGE_CMD = 64,// AUDIO_CMD_LONG_MIN
        SETVOLUMERANGE_CMD = 65,// 0x41
        SETAUDIOMUTE_CMD = 66,// 0x42
        SETAUDIOCHANNEL_CMD = 67,// 0x43
        SETAUDIOVOLUME_CMD = 68,// 0x44
        AUDIO_CMD_LONG_MAX = 69
    }
    const enum LONG_TEXTCFG_CMDS {
        STARTTEXT_CMD = 96,// TEXTCFG_CMD_LONG_MIN
        APPENDTEXT_CMD = 97,// 0x61
        TEXTCFG_CMD_LONG_MAX = 98
    }
    const enum LONG_TEXTSTATUS_CMDS {
        GETTEXTSTATUS_CMD = 101,//  TEXTSTATUS_CMD_LONG_MIN,
        TEXTSTATUS_CMD_LONG_MAX = 102
    }
    const enum LONG_CAP_CMDS {
        GETCAPS_CMD = 112,//  CAP_CMD_LONG_MIN
        GETUSERCAPS1_CMD = 126,// 0x7E
        GETUSERCAPS2_CMD = 127,// 0x7F
        CAP_CMD_LONG_MAX = 128
    }
    const enum PROPRIETARY_GET_CMDS {
        GETPMCFG_CMD = 126,//GETUSERCAPS1_CMD
        GETPMDATA_CMD = 127
    }
    const enum LONG_PMPROPRIETARY_CMDS {
        SETPMCFG_CMD = 118,//   PMPROPRIETARY_CMD_LONG_MIN
        SETPMDATA_CMD = 119,// 0x77
        GETPMCFG_CMD = 126,// 0x7E
        GETPMDATA_CMD = 127,// 0x7F
        PMPROPRIETARY_CMD_LONG_MAX = 128
    }
    const GETPMCFG_CMD_SHORT_MIN = 128;
    const GETPMCFG_CMD_LONG_MIN = 80;
    const SETPMCFG_CMD_SHORT_MIN = 224;
    const SETPMCFG_CMD_LONG_MIN = 0;
    const GETPMDATA_CMD_SHORT_MIN = 160;
    const GETPMDATA_CMD_LONG_MIN = 104;
    const SETPMDATA_CMD_SHORT_MIN = 208;
    const SETPMDATA_CMD_LONG_MIN = 48;
    const enum PM_SHORT_PULL_CFG_CMDS {
        PM_GET_FW_VERSION = 128,// GETPMCFG_CMD_SHORT_MIN
        PM_GET_HW_VERSION = 129,// 0x81
        PM_GET_HW_ADDRESS = 130,// 0x82
        PM_GET_TICK_TIMEBASE = 131,// 0x83
        PM_GET_HRM = 132,// 0x84
        PM_GET_SCREENSTATESTATUS = 134,// 0x86
        PM_GET_RACE_LANE_REQUEST = 135,// 0x87
        PM_GET_ERG_LOGICALADDR_REQUEST = 136,// 0x88
        PM_GET_WORKOUTTYPE = 137,// 0x89
        PM_GET_DISPLAYTYPE = 138,// 0x8A
        PM_GET_DISPLAYUNITS = 139,// 0x8B
        PM_GET_LANGUAGETYPE = 140,// 0x8C
        PM_GET_WORKOUTSTATE = 141,// 0x8D
        PM_GET_INTERVALTYPE = 142,// 0x8E
        PM_GET_OPERATIONALSTATE = 143,// 0x8F
        PM_GET_LOGCARDSTATE = 144,// 0x90
        PM_GET_LOGCARDSTATUS = 145,// 0x91
        PM_GET_POWERUPSTATE = 146,// 0x92
        PM_GET_ROWINGSTATE = 147,// 0x93
        PM_GET_SCREENCONTENT_VERSION = 148,// 0x94
        PM_GET_COMMUNICATIONSTATE = 149,// 0x95
        PM_GET_RACEPARTICIPANTCOUNT = 150,// 0x96
        PM_GET_BATTERYLEVELPERCENT = 151,// 0x97
        PM_GET_RACEMODESTATUS = 152,// 0x98
        PM_GET_INTERNALLOGPARAMS = 153,// 0x99
        PM_GET_PRODUCTCONFIGURATION = 154,// 0x9A
        PM_GET_ERGSLAVEDISCOVERREQUESTSTATUS = 155,// 0x9B
        PM_GET_WIFICONFIG = 156,// 0x9C
        PM_GET_CPUTICKRATE = 157,// 0x9D
        PM_GET_LOGCARDCENSUS = 158,// 0x9E
        PM_GET_WORKOUTINTERVALCOUNT = 159,// 0x9F
        GETPMCFG_CMD_SHORT_MAX = 160,
        PM_GET_RACE_BEGINEND_TICKCOUNT = 238
    }
    const enum PM_SHORT_PULL_DATA_CMDS {
        PM_GET_WORKTIME = 160,// GETPMDATA_CMD_SHORT_MIN
        PM_GET_PROJECTED_WORKTIME = 161,// 0xA1
        PM_GET_TOTAL_RESTTIME = 162,// 0xA2
        PM_GET_WORKDISTANCE = 163,// 0xA3
        PM_GET_TOTAL_WORKDISTANCE = 164,// 0xA4
        PM_GET_PROJECTED_WORKDISTANCE = 165,// 0xA5
        PM_GET_RESTDISTANCE = 166,// 0xA6
        PM_GET_TOTAL_RESTDISTANCE = 167,// 0xA7
        PM_GET_STROKE_500MPACE = 168,// 0xA8
        PM_GET_STROKE_POWER = 169,// 0xA9
        PM_GET_STROKE_CALORICBURNRATE = 170,// 0xAA
        PM_GET_SPLIT_AVG_500MPACE = 171,// 0xAB
        PM_GET_SPLIT_AVG_POWER = 172,// 0xAC
        PM_GET_SPLIT_AVG_CALORICBURNRATE = 173,// 0xAD
        PM_GET_SPLIT_AVG_CALORIES = 174,// 0xAE
        PM_GET_TOTAL_AVG_500MPACE = 175,// 0xAF
        PM_GET_TOTAL_AVG_POWER = 176,// 0xB0
        PM_GET_TOTAL_AVG_CALORICBURNRATE = 177,// 0xB1
        PM_GET_TOTAL_AVG_CALORIES = 178,// 0xB2
        PM_GET_STROKERATE = 179,// 0xB3
        PM_GET_SPLIT_AVG_STROKERATE = 180,// 0xB4
        PM_GET_TOTAL_AVG_STROKERATE = 181,// 0xB5
        PM_GET_AVG_HEARTRATE = 182,// 0xB6
        PM_GET_ENDING_AVG_HEARTRATE = 183,// 0xB7
        PM_GET_REST_AVG_HEARTRATE = 184,// 0xB8
        PM_GET_SPLITTIME = 185,// 0xB9
        PM_GET_LASTSPLITTIME = 186,// 0xBA
        PM_GET_SPLITDISTANCE = 187,// 0xBB
        PM_GET_LASTSPLITDISTANCE = 188,// 0xBC
        PM_GET_LASTRESTDISTANCE = 189,// 0xBD
        PM_GET_TARGETPACETIME = 190,// 0xBE
        PM_GET_STROKESTATE = 191,// 0xBF
        PM_GET_STROKERATESTATE = 192,// 0xC0
        PM_GET_DRAGFACTOR = 193,// 0xC1
        PM_GET_ENCODERPERIOD = 194,// 0xC2
        PM_GET_HEARTRATESTATE = 195,// 0xC3
        PM_GET_SYNCDATA = 196,// 0xC4
        PM_GET_SYNCDATAALL = 197,// 0xC5
        PM_GET_RACEDATA = 198,// 0xC6
        PM_GET_TICKTIME = 199,// 0xC7
        PM_GET_ERRORTYPE = 200,// 0xC8
        PM_GET_ERRORVALUE = 201,// 0xC9
        PM_GET_STATUSTYPE = 202,// 0xCA
        PM_GET_STATUSVALUE = 203,// 0xCB
        PM_GET_EPMSTATUS = 204,// 0xCC
        PM_GET_DISPLAYUPDATETIME = 205,// 0xCD
        PM_GET_SYNCFRACTIONALTIME = 206,// 0xCE
        PM_GET_RESTTIME = 207,// 0xCF
        GETPMDATA_CMD_SHORT_MAX = 208
    }
    const enum PM_SHORT_PUSH_DATA_CMDS {
        PM_SET_SYNC_DISTANCE = 208,// SETPMDATA_CMD_SHORT_MIN
        PM_SET_SYNC_STROKEPACE = 209,// 0xD1
        PM_SET_SYNC_AVG_HEARTRATE = 210,// 0xD2
        PM_SET_SYNC_TIME = 211,// 0xD3
        PM_SET_SYNC_SPLIT_DATA = 212,// 0xD4
        PM_SET_SYNC_ENCODER_PERIOD = 213,// 0xD5
        PM_SET_SYNC_VERSION_INFO = 214,// 0xD6
        PM_SET_SYNC_RACETICKTIME = 215,// 0xD7
        PM_SET_SYNC_DATAALL = 216,// 0xD8
        SETPMDATA_CMD_SHORT_MAX = 217
    }
    const enum PM_SHORT_PUSH_CFG_CMDS {
        PM_SET_RESET_ALL = 224,// SETPMCFG_CMD_SHORT_MIN
        PM_SET_RESET_ERGNUMBER = 225,// 0xE1
        SETPMCFG_CMD_SHORT_MAX = 226
    }
    const enum PM_LONG_PUSH_CFG_CMDS {
        PM_SET_BAUDRATE = 0,// SETPMCFG_CMD_LONG_MIN
        PM_SET_WORKOUTTYPE = 1,// 0x01
        PM_SET_STARTTYPE = 2,// 0x02
        PM_SET_WORKOUTDURATION = 3,// 0x03
        PM_SET_RESTDURATION = 4,// 0x04
        PM_SET_SPLITDURATION = 5,// 0x05
        PM_SET_TARGETPACETIME = 6,// 0x06
        PM_SET_INTERVALIDENTIFIER = 7,// 0x07
        PM_SET_OPERATIONALSTATE = 8,// 0x08
        PM_SET_RACETYPE = 9,// 0x09
        PM_SET_WARMUPDURATION = 10,// 0x0A
        PM_SET_RACELANESETUP = 11,// 0x0B
        PM_SET_RACELANEVERIFY = 12,// 0x0C
        PM_SET_RACESTARTPARAMS = 13,// 0x0D
        PM_SET_ERGSLAVEDISCOVERYREQUEST = 14,// 0x0E
        PM_SET_BOATNUMBER = 15,// 0x0F
        PM_SET_ERGNUMBER = 16,// 0x10
        PM_SET_COMMUNICATIONSTATE = 17,// 0x11
        PM_SET_CMDUPLIST = 18,// 0x12
        PM_SET_SCREENSTATE = 19,// 0x13
        PM_CONFIGURE_WORKOUT = 20,// 0x14
        PM_SET_TARGETAVGWATTS = 21,// 0x15
        PM_SET_TARGETCALSPERHR = 22,// 0x16
        PM_SET_INTERVALTYPE = 23,// 0x17
        PM_SET_WORKOUTINTERVALCOUNT = 24,// 0x18
        PM_SET_DISPLAYUPDATERATE = 25,// 0x19
        PM_SET_AUTHENPASSWORD = 26,// 0x1A
        PM_SET_TICKTIME = 27,// 0x1B
        PM_SET_TICKTIMEOFFSET = 28,// 0x1C
        PM_SET_RACEDATASAMPLETICKS = 29,// 0x1D
        PM_SET_RACEOPERATIONTYPE = 30,// 0x1E
        PM_SET_RACESTATUSDISPLAYTICKS = 31,// 0x1F
        PM_SET_RACESTATUSWARNINGTICKS = 32,// 0x20
        PM_SET_RACEIDLEMODEPARAMS = 33,// 0x21
        PM_SET_DATETIME = 34,// 0x22
        PM_SET_LANGUAGETYPE = 35,// 0x23
        PM_SET_WIFICONFIG = 36,// 0x24
        PM_SET_CPUTICKRATE = 37,// 0x25
        PM_SET_LOGCARDUSER = 38,// 0x26
        PM_SET_SCREENERRORMODE = 39,// 0x27
        PM_SET_CABLETEST = 40,// 0x28
        PM_SET_USER_ID = 41,// 0x29
        PM_SET_USER_PROFILE = 42,// 0x2A
        PM_SET_HRM = 43,// 0x2B
        PM_SET_SENSOR_CHANNEL = 47,// 0x2F sensor channel
        SETPMCFG_CMD_LONG_MAX = 48
    }
    const enum PM_LONG_PUSH_DATA_CMDS {
        PM_SET_TEAM_DISTANCE = 48,// SETPMDATA_CMD_LONG_MIN
        PM_SET_TEAM_FINISH_TIME = 49,// 0x31
        PM_SET_RACEPARTICIPANT = 50,// 0x32
        PM_SET_RACESTATUS = 51,// 0x33
        PM_SET_LOGCARDMEMORY = 52,// 0x34
        PM_SET_DISPLAYSTRING = 53,// 0x35
        PM_SET_DISPLAYBITMAP = 54,// 0x36
        PM_SET_LOCALRACEPARTICIPANT = 55,// 0x37
        PM_SET_ANTRFMODE = 78,// 0x4E mfg support only
        PM_SET_MEMORY = 79,// 0x4F debug only
        SETPMDATA_CMD_LONG_MAX = 80
    }
    const enum PM_LONG_PULL_CFG_CMDS {
        PM_GET_ERGNUMBER = 80,// GETPMCFG_CMD_LONG_MIN
        PM_GET_ERGNUMBERREQUEST = 81,// 0x51
        PM_GET_USERIDSTRING = 82,// 0x52
        PM_GET_LOCALRACEPARTICIPANT = 83,// 0x53
        PM_GET_USER_ID = 84,// 0x54
        PM_GET_USER_PROFILE = 85,// 0x55
        GETPMCFG_CMD_LONG_MAX = 86
    }
    const enum PM_LONG_PULL_DATA_CMDS {
        PM_GET_MEMORY = 104,// GETPMDATA_CMD_LONG_MIN
        PM_GET_LOGCARDMEMORY = 105,// 0x69
        PM_GET_INTERNALLOGMEMORY = 106,// 0x6A
        PM_GET_FORCEPLOTDATA = 107,// 0x6B
        PM_GET_HEARTBEATDATA = 108,// 0x6C
        PM_GET_UI_EVENTS = 109,// 0x6D
        CSAFE_PM_GET_STROKESTATS = 110,// 0x6E
        CSAFE_PM_GET_DIAGLOG_RECORD_NUM = 112,// 0x70
        CSAFE_PM_GET_DIAGLOG_RECORD = 113,// 0x71
        GETPMDATA_CMD_LONG_MAX = 114
    }
    const PREVOK_FLG = 0;
    const PREVREJECT_FLG = 16;
    const PREVBAD_FLG = 32;
    const PREVNOTRDY_FLG = 48;
    const PREVFRAMESTATUS_MSK = 48;
    const SLAVESTATE_ERR_FLG = 0;
    const SLAVESTATE_RDY_FLG = 1;
    const SLAVESTATE_IDLE_FLG = 2;
    const SLAVESTATE_HAVEID_FLG = 3;
    const SLAVESTATE_INUSE_FLG = 5;
    const SLAVESTATE_PAUSE_FLG = 6;
    const SLAVESTATE_FINISH_FLG = 7;
    const SLAVESTATE_MANUAL_FLG = 8;
    const SLAVESTATE_OFFLINE_FLG = 9;
    const FRAMECNT_FLG = 128;
    const SLAVESTATE_MSK = 15;
    const AUTOSTATUS_FLG = 1;
    const UPSTATUS_FLG = 2;
    const UPLIST_FLG = 4;
    const ACK_FLG = 16;
    const EXTERNCONTROL_FLG = 64;
    const CAPCODE_PROTOCOL = 0;
    const CAPCODE_POWER = 1;
    const CAPCODE_TEXT = 2;
    const DISTANCE_MILE_0_0 = 1;
    const DISTANCE_MILE_0_1 = 2;
    const DISTANCE_MILE_0_2 = 3;
    const DISTANCE_MILE_0_3 = 4;
    const DISTANCE_FEET_0_0 = 5;
    const DISTANCE_INCH_0_0 = 6;
    const WEIGHT_LBS_0_0 = 7;
    const WEIGHT_LBS_0_1 = 8;
    const DISTANCE_FEET_1_0 = 10;
    const SPEED_MILEPERHOUR_0_0 = 16;
    const SPEED_MILEPERHOUR_0_1 = 17;
    const SPEED_MILEPERHOUR_0_2 = 18;
    const SPEED_FEETPERMINUTE_0_0 = 19;
    const DISTANCE_KM_0_0 = 33;
    const DISTANCE_KM_0_1 = 34;
    const DISTANCE_KM_0_2 = 35;
    const DISTANCE_METER_0_0 = 36;
    const DISTANCE_METER_0_1 = 37;
    const DISTANCE_CM_0_0 = 38;
    const WEIGHT_KG_0_0 = 39;
    const WEIGHT_KG_0_1 = 40;
    const SPEED_KMPERHOUR_0_0 = 48;
    const SPEED_KMPERHOUR_0_1 = 49;
    const SPEED_KMPERHOUR_0_2 = 50;
    const SPEED_METERPERMINUTE_0_0 = 51;
    const PACE_MINUTEPERMILE_0_0 = 55;
    const PACE_MINUTEPERKM_0_0 = 56;
    const PACE_SECONDSPERKM_0_0 = 57;
    const PACE_SECONDSPERMILE_0_0 = 58;
    const DISTANCE_FLOORS_0_0 = 65;
    const DISTANCE_FLOORS_0_1 = 66;
    const DISTANCE_STEPS_0_0 = 67;
    const DISTANCE_REVS_0_0 = 68;
    const DISTANCE_STRIDES_0_0 = 69;
    const DISTANCE_STROKES_0_0 = 70;
    const MISC_BEATS_0_0 = 71;
    const ENERGY_CALORIES_0_0 = 72;
    const GRADE_PERCENT_0_0 = 74;
    const GRADE_PERCENT_0_2 = 75;
    const GRADE_PERCENT_0_1 = 76;
    const CADENCE_FLOORSPERMINUTE_0_1 = 79;
    const CADENCE_FLOORSPERMINUTE_0_0 = 80;
    const CADENCE_STEPSPERMINUTE_0_0 = 81;
    const CADENCE_REVSPERMINUTE_0_0 = 82;
    const CADENCE_STRIDESPERMINUTE_0_0 = 83;
    const CADENCE_STROKESPERMINUTE_0_0 = 84;
    const MISC_BEATSPERMINUTE_0_0 = 85;
    const BURN_CALORIESPERMINUTE_0_0 = 86;
    const BURN_CALORIESPERHOUR_0_0 = 87;
    const POWER_WATTS_0_0 = 88;
    const ENERGY_INCHLB_0_0 = 90;
    const ENERGY_FOOTLB_0_0 = 91;
    const ENERGY_NM_0_0 = 92;
    const KG_TO_LBS = 2.2046;
    const LBS_TO_KG: number;
    const IDDIGITS_MIN = 2;
    const IDDIGITS_MAX = 5;
    const DEFAULT_IDDIGITS = 5;
    const DEFAULT_ID = 0;
    const MANUAL_ID = 999999999;
    const DEFAULT_SLAVESTATE_TIMEOUT = 20;
    const PAUSED_SLAVESTATE_TIMEOUT = 220;
    const INUSE_SLAVESTATE_TIMEOUT = 6;
    const IDLE_SLAVESTATE_TIMEOUT = 30;
    const BASE_YEAR = 1900;
    const DEFAULT_STATUSUPDATE_INTERVAL = 256;
    const DEFAULT_CMDUPLIST_INTERVAL = 256;
}
/**
 * Created by tijmen on 19-01-16.
 *
 * Extensible frame work so you can add your own csafe commands to the buffer
 *
 * this is the core, you do not have to change this code.
 *
 */
declare namespace ergometer.csafe {
    const enum SlaveState {
        ERROR = 0,
        READY = 1,
        IDLE = 2,
        HAVEID = 3,
        INUSE = 5,
        PAUZED = 6,
        FINISHED = 7,
        MANUAL = 8,
        OFFLINE = 9
    }
    const enum PrevFrameState {
        OK = 0,
        REJECT = 1,
        BAD = 2,
        NOT_READY = 3
    }
    interface ICommandParamsBase {
        onError?: ErrorHandler;
        onDataReceived?: (data: any) => void;
    }
    interface IRawCommand {
        waitForResponse: boolean;
        command: number;
        detailCommand?: number;
        data?: number[];
        onDataReceived?: (data: DataView) => void;
        onError?: ErrorHandler;
        responseBuffer?: IResponseBuffer;
    }
    interface IBuffer {
        extended?: {
            sourceAddress: number;
            destinationAddress: number;
        };
        rawCommands: IRawCommand[];
        addRawCommand(info: IRawCommand): any;
        send(success?: () => void, error?: ErrorHandler): Promise<void>;
    }
    interface IResponseBuffer {
        monitorStatus: ergometer.csafe.SlaveState;
        prevFrameState: ergometer.csafe.PrevFrameState;
        commands: csafe.IRawCommand[];
    }
    interface ICommand {
        (buffer: IBuffer, monitor: PerformanceMonitorBase): void;
    }
    class CommandManagager {
        private _commands;
        register(createCommand: ICommand): void;
        apply(buffer: IBuffer, monitor: PerformanceMonitorBase): void;
    }
    var commandManager: CommandManagager;
    interface ICommandSetStandardValue extends ICommandParamsBase {
        value: number;
    }
    function registerStandardSet<T extends ICommandParamsBase>(functionName: string, command: number, setParams: (params: T) => number[]): void;
    function registerStandardSetConfig<T extends ICommandParamsBase>(functionName: string, command: number, setParams: (params: T) => number[]): void;
    function registerStandardGetConfig<T extends ICommandParamsBase, U>(functionName: string, detailCommand: number, converter: (data: DataView) => U): void;
    function registerStandardShortGet<T extends ICommandParamsBase, U>(functionName: string, command: number, converter: (data: DataView) => U): void;
    function registerStandardProprietarySetConfig<T extends ICommandParamsBase>(functionName: string, command: number, setParams: (params: T) => number[]): void;
    function registerStandardProprietarySetData<T extends ICommandParamsBase>(functionName: string, command: number, setParams: (params: T) => number[]): void;
    function registerStandardProprietaryGetConfig<T extends ICommandParamsBase, U>(functionName: string, detailCommand: number, converter: (data: DataView) => U): void;
    function registerStandardProprietaryGetData<T extends ICommandParamsBase, U>(functionName: string, detailCommand: number, converter: (data: DataView) => U): void;
}
/**
 * Created by tijmen on 19-01-16.
 *
 * Extensible frame work so you can add your own csafe commands to the buffer
 *
 */
declare namespace ergometer.csafe {
    interface ICommandStrokeState extends ICommandParamsBase {
        onDataReceived: (state: StrokeState) => void;
    }
    interface IBuffer {
        getStrokeState(params: ICommandStrokeState): IBuffer;
    }
    interface ICommandDragFactor extends ICommandParamsBase {
        onDataReceived: (state: number) => void;
    }
    interface IBuffer {
        getDragFactor(params: ICommandDragFactor): IBuffer;
    }
    interface ICommandWorkDistance extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getWorkDistance(params: ICommandWorkDistance): IBuffer;
    }
    interface ICommandWorkTime extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getWorkTime(params: ICommandWorkTime): IBuffer;
    }
    interface ICommandPowerCurve {
        onDataReceived: (curve: number[]) => void;
        onError?: ErrorHandler;
    }
    interface IBuffer {
        getPowerCurve(params: ICommandPowerCurve): IBuffer;
    }
    interface ICommandStrokeStats {
        onDataReceived: (strokeDistance: number, driveTime: number, strokeRecoveryTime: number, strokeCount: number) => void;
        onError?: ErrorHandler;
    }
    interface IBuffer {
        getStrokeStats(params: ICommandStrokeStats): IBuffer;
    }
    interface ICommandGetWorkoutType extends ICommandParamsBase {
        onDataReceived: (value: WorkoutType) => void;
    }
    interface IBuffer {
        getWorkoutType(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetWorkoutState extends ICommandParamsBase {
        onDataReceived: (value: WorkoutState) => void;
    }
    interface IBuffer {
        getWorkoutState(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetWorkoutIntervalCount extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getWorkoutIntervalCount(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetWorkoutIntervalType extends ICommandParamsBase {
        onDataReceived: (value: IntervalType) => void;
    }
    interface IBuffer {
        getWorkoutIntervalType(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetWorkoutIntervalRestTime extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getWorkoutIntervalRestTime(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetWork extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getWork(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandProgramParams extends ICommandParamsBase {
        value: Program;
    }
    interface IBuffer {
        setProgram(params: ICommandProgramParams): IBuffer;
    }
    interface ICommandTimeParams extends ICommandParamsBase {
        hour: number;
        minute: number;
        second: number;
    }
    interface IBuffer {
        setTime(params: ICommandTimeParams): IBuffer;
    }
    interface ICommandDateParams extends ICommandParamsBase {
        year: number;
        month: number;
        day: number;
    }
    interface IBuffer {
        setDate(params: ICommandDateParams): IBuffer;
    }
    interface IBuffer {
        setTimeout(params: ICommandSetStandardValue): IBuffer;
    }
    interface IBuffer {
        setWork(params: ICommandTimeParams): IBuffer;
    }
    interface ICommandDistanceParams extends ICommandSetStandardValue {
        unit: Unit;
    }
    interface IBuffer {
        setDistance(params: ICommandDistanceParams): IBuffer;
    }
    interface IBuffer {
        setTotalCalories(params: ICommandSetStandardValue): IBuffer;
    }
    interface ICommandPowerParams extends ICommandSetStandardValue {
        unit: Unit;
    }
    interface IBuffer {
        setPower(params: ICommandPowerParams): IBuffer;
    }
}
/**
 * Created by tijmen on 19-01-16.
 *
 * Extensible frame work so you can add your own csafe commands to the buffer
 *
 */
declare namespace ergometer.csafe {
    interface IVersion {
        ManufacturerId: number;
        CID: number;
        Model: number;
        HardwareVersion: number;
        FirmwareVersion: number;
    }
    interface ICommandGetVersion extends ICommandParamsBase {
        onDataReceived: (version: IVersion) => void;
    }
    interface IBuffer {
        getVersion(params: ICommandGetVersion): IBuffer;
    }
    interface IDistance {
        value: number;
        unit: Unit;
    }
    interface ICommandGetDistance extends ICommandParamsBase {
        onDataReceived: (version: IDistance) => void;
    }
    interface IBuffer {
        getDistance(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetPace extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getPace(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetPower extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getPower(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetCadence extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getCadence(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetHorizontal extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getHorizontal(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandGetCalories extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getCalories(params: ICommandParamsBase): IBuffer;
    }
    interface ICommandHeartRate extends ICommandParamsBase {
        onDataReceived: (value: number) => void;
    }
    interface IBuffer {
        getHeartRate(params: ICommandParamsBase): IBuffer;
    }
}
declare namespace ergometer.csafe {
    interface ICommandSetWorkoutTypeParams extends ICommandParamsBase {
        value: WorkoutType;
    }
    interface IBuffer {
        setWorkoutType(params: ICommandSetWorkoutTypeParams): IBuffer;
    }
    interface ICommandSetWorkoutDurationParams extends ICommandParamsBase {
        durationType: WorkoutDurationType;
        value: number;
    }
    interface IBuffer {
        setWorkoutDuration(params: ICommandSetWorkoutDurationParams): IBuffer;
    }
    interface ICommandsetRestDurationParams extends ICommandParamsBase {
        value: number;
    }
    interface IBuffer {
        setRestDuration(params: ICommandsetRestDurationParams): IBuffer;
    }
    interface ICommandSetSplitDurationParams extends ICommandParamsBase {
        durationType: WorkoutDurationType;
        value: number;
    }
    interface IBuffer {
        setSplitDuration(params: ICommandSetSplitDurationParams): IBuffer;
    }
    interface ICommandSetTargetPaceTimeParams extends ICommandParamsBase {
        value: number;
    }
    interface IBuffer {
        setTargetPaceTime(params: ICommandSetTargetPaceTimeParams): IBuffer;
    }
    interface ICommandSetScreenStateParams extends ICommandParamsBase {
        screenType: ScreenType;
        value: ScreenValue;
    }
    interface IBuffer {
        setScreenState(params: ICommandSetScreenStateParams): IBuffer;
    }
    interface ICommandsetConfigureWorkoutParams extends ICommandParamsBase {
        programmingMode: boolean;
    }
    interface IBuffer {
        setConfigureWorkout(params: ICommandsetConfigureWorkoutParams): IBuffer;
    }
    interface ICommandsetTargetAverageWattParams extends ICommandParamsBase {
        value: number;
    }
    interface IBuffer {
        setTargetAverageWatt(params: ICommandsetTargetAverageWattParams): IBuffer;
    }
    interface ICommandssTargetCaloriesPerHourParams extends ICommandParamsBase {
        value: number;
    }
    interface IBuffer {
        setTargetCaloriesPerHour(params: ICommandssTargetCaloriesPerHourParams): IBuffer;
    }
    interface ICommandsIntervalTypeParams extends ICommandParamsBase {
        value: IntervalType;
    }
    interface IBuffer {
        setIntervalType(params: ICommandsIntervalTypeParams): IBuffer;
    }
    interface ICommandsWorkoutIntervalCountParams extends ICommandParamsBase {
        value: number;
    }
    interface IBuffer {
        setWorkoutIntervalCount(params: ICommandsWorkoutIntervalCountParams): IBuffer;
    }
}
/**
 * Created by tijmen on 28-12-15.
 */
declare namespace ergometer {
    const enum RowingSampleRate {
        rate1sec = 0,
        rate500ms = 1,
        rate250ms = 2,
        rate100ms = 3
    }
    const enum ErgmachineType {
        staticD = 0,
        staticC = 1,
        staticA = 2,
        staticB = 3,
        staticE = 5,
        staticDynamic = 8,
        slidesA = 16,
        slidesB = 17,
        slidesC = 18,
        slidesD = 19,
        slidesE = 20,
        slidesDynamic = 32,
        staticDyno = 64,
        staticSki = 128,
        num = 129
    }
    const enum WorkoutType {
        justRowNoSplits = 0,
        justRowSplits = 1,
        fixedDistanceNoAplits = 2,
        fixedDistanceSplits = 3,
        fixedTimeNoAplits = 4,
        fixedTimeSplits = 5,
        fixedTimeInterval = 6,
        fixedDistanceInterval = 7,
        variableInterval = 8,
        variableUndefinedRestInterval = 9,
        fixedCalorie = 10,
        fixedWattMinutes = 11
    }
    const enum ScreenType {
        None = 0,
        Workout = 1,
        Race = 2,
        Csave = 3,
        Diagnostic = 4,
        Manufacturing = 5
    }
    const enum ScreenValue {
        None = /**< None value (0). */ 0,/**< None value (0). */
        PrepareToRowWorkout = /**< Prepare to workout type (1). */ 1,/**< Prepare to workout type (1). */
        TerminateWorkout = /**< Terminate workout type (2). */ 2,/**< Terminate workout type (2). */
        RearmWorkout = /**< Rearm workout type (3). */ 3,/**< Rearm workout type (3). */
        RefreshLogCard = /**< Refresh local copies of logcard structures(4). */ 4,/**< Refresh local copies of logcard structures(4). */
        PrepareToRaceStart = /**< Prepare to race start (5). */ 5,/**< Prepare to race start (5). */
        GoToMainScreen = /**< Goto to main screen (6). */ 6,/**< Goto to main screen (6). */
        LogCardBusyWarning = /**< Log device busy warning (7). */ 7,/**< Log device busy warning (7). */
        LogCardSelectUser = /**< Log device select user (8). */ 8,/**< Log device select user (8). */
        ResetRaceParams = /**< Reset race parameters (9). */ 9,/**< Reset race parameters (9). */
        CableTestSlave = /**< Cable test slave indication(10). */ 10,/**< Cable test slave indication(10). */
        FishGame = /**< Fish game (11). */ 11,/**< Fish game (11). */
        DisplayParticipantInfo = /**< Display participant info (12). */ 12,/**< Display participant info (12). */
        DisplayParticipantInfoConfirm = /**< Display participant info w/ confirmation (13). */ 13,/**< Display participant info w/ confirmation (13). */
        ChangeDisplayTypeTarget = 20,/**< Display type set to target (20). */
        ChangeDisplayTypeStandard = /**< Display type set to standard (21). */ 21,/**< Display type set to standard (21). */
        ChangeDisplayTypeForceVelocity = /**< Display type set to forcevelocity (22). */ 22,/**< Display type set to forcevelocity (22). */
        ChangeDisplayTypePaceBoat = /**< Display type set to Paceboat (23). */ 23,/**< Display type set to Paceboat (23). */
        ChangeDisplayTypePerStroke = /**< Display type set to perstroke (24). */ 24,/**< Display type set to perstroke (24). */
        ChangeDisplayTypeSimple = /**< Display type set to simple (25). */ 25,/**< Display type set to simple (25). */
        ChangeUnitsTypeTimeMeters = 30,/**< Units type set to timemeters (30). */
        ChangeUnitsTypePace = /**< Units type set to pace (31). */ 31,/**< Units type set to pace (31). */
        ChangeUnitsTypeWatts = /**< Units type set to watts (32). */ 32,/**< Units type set to watts (32). */
        ChangeUnitsTypeCaloricBurnRate = /**< Units type set to caloric burn rate(33). */ 33,/**< Units type set to caloric burn rate(33). */
        TargetGameBasic = /**< Basic target game (34). */ 34,/**< Basic target game (34). */
        TargetGameAdvanced = /**< Advanced target game (35). */ 35,/**< Advanced target game (35). */
        DartGame = /**< Dart game (36). */ 36,/**< Dart game (36). */
        GoToUsbWaitReady = /**< USB wait ready (37). */ 37,/**< USB wait ready (37). */
        TachCableTestDisable = /**< Tach cable test disable (38). */ 38,/**< Tach cable test disable (38). */
        TachSimDisable = /**< Tach simulator disable (39). */ 39,/**< Tach simulator disable (39). */
        TachSimEnableRate1 = /**< Tach simulator enable, rate = 1:12 (40). */ 40,/**< Tach simulator enable, rate = 1:12 (40). */
        TachSimEnableRate2 = /**< Tach simulator enable, rate = 1:35 (41). */ 41,/**< Tach simulator enable, rate = 1:35 (41). */
        TachSimEnableRate3 = /**< Tach simulator enable, rate = 1:42 (42). */ 42,/**< Tach simulator enable, rate = 1:42 (42). */
        TachSimEnableRate4 = /**< Tach simulator enable, rate = 3:04 (43). */ 43,/**< Tach simulator enable, rate = 3:04 (43). */
        TachSimEnableRate5 = /**< Tach simulator enable, rate = 3:14 (44). */ 44,/**< Tach simulator enable, rate = 3:14 (44). */
        TachCableTestEnable = /**< Tach cable test enable (45). */ 45,/**< Tach cable test enable (45). */
        ChangeUnitsTypeCalories = /**< Units type set to calories(46). */ 46,/**< Units type set to calories(46). */
        ScreenRedraw = 255 /**< Screen redraw (255). */
    }
    const enum IntervalType {
        time = 0,
        distance = 1,
        rest = 2,
        timertUndefined = 3,
        distanceRestUndefined = 4,
        restUndefined = 5,
        calories = 6,
        calRestUndefined = 7,
        wattMinute = 8,
        wattMinuteRestUndefined = 9,
        none = 255
    }
    const enum WorkoutState {
        waitToBegin = 0,
        workoutRow = 1,
        countDownPause = 2,
        intervalRest = 3,
        intervalWorktime = 4,
        intervalWorkDistance = 5,
        intervalRestEndToWorkTime = 6,
        intervalRestEndToWorkDistance = 7,
        intervalWorktimeTorest = 8,
        intervalWorkDistanceToEest = 9,
        workoutEnd = 10,
        terminate = 11,
        workoutLogged = 12,
        rearm = 13
    }
    const enum RowingState {
        inactive = 0,
        active = 1
    }
    const enum StrokeState {
        waitingForWheelToReachMinSpeedState = 0,
        waitingForWheelToAccelerateState = 1,
        drivingState = 2,
        dwellingAfterDriveState = 3,
        recoveryState = 4
    }
    const enum WorkoutDurationType {
        time = 0,
        calories = 64,
        wattMin = 96,
        distance = 128,
        watts = 192
    }
    const enum SampleRate {
        rate1sec = 0,
        rate500ms = 1,//default
        rate250ms = 2,
        rate100ms = 3
    }
    const enum Program {
        Programmed = 0,
        StandardList1 = 1,
        StandardList2 = 2,
        StandardList3 = 3,
        StandardList4 = 4,
        StandardList5 = 5,
        CustomList1 = 6,
        CustomList2 = 7,
        CustomList3 = 8,
        CustomList4 = 9,
        CustomList5 = 10,
        FavoritesList1 = 11,
        FavoritesList2 = 12,
        FavoritesList3 = 13,
        FavoritesList4 = 14,
        FavoritesList5 = 15
    }
    const enum Unit {
        distanceMile = 1,
        distanceMile1 = 2,
        distanceMile2 = 3,
        distanceMile3 = 4,
        distanceFeet = 5,
        distanceInch = 6,
        weightLbs = 7,
        weightLbs1 = 8,
        distanceFeet10 = 10,
        speedMilePerHour = 16,
        speedMilePerHour1 = 17,
        speedMilePerHour2 = 18,
        speedFeetPerMinute = 19,
        distanceKm = 33,
        distanceKm1 = 34,
        distanceKm2 = 35,
        distanceMeter = 36,
        distanceMeter1 = 37,
        distance_cm = 38,
        weightKg = 39,
        weightKg1 = 40,
        speedKmPerHour = 48,
        speedKmPerHour1 = 49,
        speedKmPerHour2 = 50,
        speedMeterPerMinute = 51,
        paceMinutePermile = 55,
        paceMinutePerkm = 56,
        paceSecondsPerkm = 57,
        paceSecondsPermile = 58,
        distanceFloors = 65,
        distanceFloors1 = 66,
        distanceSteps = 67,
        distanceRevs = 68,
        distanceStrides = 69,
        distanceStrokes = 70,
        miscBeats = 71,
        energyCalories = 72,
        gradePercent = 74,
        gradePercent2 = 75,
        gradePercent1 = 76,
        cadenceFloorsPerMinute1 = 79,
        cadenceFloorsPerMinute = 80,
        cadenceStepsPerMinute = 81,
        cadenceRevsPerMinute = 82,
        cadenceStridesPerMinute = 83,
        cadenceStrokesPerMinute = 84,
        miscBeatsPerMinute = 85,
        burnCaloriesPerMinute = 86,
        burnCaloriesPerHour = 87,
        powerWatts = 88,
        energyInchlb = 90,
        energyFootlb = 91,
        energyNm = 92
    }
    interface RowingGeneralStatus {
        elapsedTime: number;
        distance: number;
        workoutType: WorkoutType;
        intervalType: IntervalType;
        workoutState: WorkoutState;
        rowingState: RowingState;
        strokeState: StrokeState;
        totalWorkDistance: number;
        workoutDuration: number;
        workoutDurationType: WorkoutDurationType;
        dragFactor: number;
    }
    interface RowingAdditionalStatus1 {
        elapsedTime: number;
        speed: number;
        strokeRate: number;
        heartRate: number;
        currentPace: number;
        averagePace: number;
        restDistance: number;
        restTime: number;
        averagePower: number;
    }
    interface RowingAdditionalStatus2 {
        elapsedTime: number;
        intervalCount: number;
        averagePower: number;
        totalCalories: number;
        splitAveragePace: number;
        splitAveragePower: number;
        splitAverageCalories: number;
        lastSplitTime: number;
        lastSplitDistance: number;
    }
    interface RowingStrokeData {
        elapsedTime: number;
        distance: number;
        driveLength: number;
        driveTime: number;
        strokeRecoveryTime: number;
        strokeDistance: number;
        peakDriveForce: number;
        averageDriveForce: number;
        workPerStroke: number;
        strokeCount: number;
    }
    interface RowingAdditionalStrokeData {
        elapsedTime: number;
        strokePower: number;
        strokeCalories: number;
        strokeCount: number;
        projectedWorkTime: number;
        projectedWorkDistance: number;
        workPerStroke: number;
    }
    interface RowingSplitIntervalData {
        elapsedTime: number;
        distance: number;
        intervalTime: number;
        intervalDistance: number;
        intervalRestTime: number;
        intervalRestDistance: number;
        intervalType: IntervalType;
        intervalNumber: number;
    }
    interface RowingAdditionalSplitIntervalData {
        elapsedTime: number;
        intervalAverageStrokeRate: number;
        intervalWorkHeartrate: number;
        intervalRestHeartrate: number;
        intervalAveragePace: number;
        intervalTotalCalories: number;
        intervalAverageCalories: number;
        intervalSpeed: number;
        intervalPower: number;
        splitAverageDragFactor: number;
        intervalNumber: number;
    }
    interface WorkoutSummaryData {
        logEntryDate: number;
        logEntryTime: number;
        elapsedTime: number;
        distance: number;
        averageStrokeRate: number;
        endingHeartrate: number;
        averageHeartrate: number;
        minHeartrate: number;
        maxHeartrate: number;
        dragFactorAverage: number;
        recoveryHeartRate: number;
        workoutType: WorkoutType;
        averagePace: number;
    }
    interface AdditionalWorkoutSummaryData {
        logEntryDate: number;
        logEntryTime: number;
        intervalType: IntervalType;
        intervalSize: number;
        intervalCount: number;
        totalCalories: number;
        watts: number;
        totalRestDistance: number;
        intervalRestTime: number;
        averageCalories: number;
    }
    interface AdditionalWorkoutSummaryData2 {
        logEntryDate: number;
        logEntryTime: number;
        averagePace: number;
        gameIdentifier: number;
        gameScore: number;
        ergMachineType: ErgmachineType;
    }
    interface HeartRateBeltInformation {
        manufacturerId: number;
        deviceType: number;
        beltId: number;
    }
}
/**
 * Concept 2 ergometer Performance Monitor api for Cordova
 *
 * This will will work with the PM5
 *
 * Created by tijmen on 01-06-15.
 * License:
 *
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
declare namespace ergometer {
    import IRawCommand = ergometer.csafe.IRawCommand;
    interface SendBufferQueued {
        commandArray: number[];
        resolve: () => void;
        reject: (e: any) => void;
        rawCommandBuffer: IRawCommand[];
        extended?: {
            sourceAddress: number;
            destinationAddress: number;
        };
    }
    interface ParsedCSafeCommand {
        command: number;
        detailCommand: number;
        data: Uint8Array;
    }
    const enum FrameState {
        initial = 0,
        extendedFrameSource = 1,
        extendedFrameDestination = 2,
        statusByte = 3,
        parseCommand = 4,
        parseCommandLength = 5,
        parseDetailCommand = 6,
        parseDetailCommandLength = 7,
        parseCommandData = 8
    }
    interface PowerCurveEvent extends pubSub.ISubscription {
        (data: number[]): void;
    }
    class WaitResponseBuffer implements ergometer.csafe.IResponseBuffer {
        command: number;
        commandDataIndex: number;
        commandData: Uint8Array;
        frameState: FrameState;
        extendedFrameSource: number;
        extendedFrameDestination: number;
        nextDataLength: number;
        detailCommand: number;
        statusByte: number;
        monitorStatus: ergometer.csafe.SlaveState;
        prevFrameState: ergometer.csafe.PrevFrameState;
        calcCheck: number;
        private _monitor;
        private _commands;
        _resolve: () => void;
        /** @internal */
        _reject: (e: any) => void;
        _responseState: number;
        private _timeOutHandle;
        stuffByteActive: boolean;
        endCommand: number;
        get commands(): csafe.IRawCommand[];
        removeRemainingCommands(): void;
        private timeOut;
        constructor(monitor: PerformanceMonitorBase, resolve: () => void, reject: (e: any) => void, commands: csafe.IRawCommand[], timeOut: number);
        remove(): void;
        processedBuffer(): void;
        removedWithError(e: any): void;
        receivedCSaveCommand(parsed: ParsedCSafeCommand): void;
    }
    /**
     *
     * Usage:
     *
     * Create this class to acess the performance data
     *   var performanceMonitor= new ergometer.PerformanceMonitor();
     *
     * after this connect to the events to get data
     *   performanceMonitor.rowingGeneralStatusEvent.sub(this,this.onRowingGeneralStatus);
     * On some android phones you can connect to a limited number of events. Use the multiplex property to overcome
     * this problem. When the multi plex mode is switched on the data send to the device can be a a bit different, see
     * the documentation in the properties You must set the multi plex property before connecting
     *   performanceMonitor.multiplex=true;
     *
     * to start the connection first start scanning for a device,
     * you should call when the cordova deviceready event is called (or later)
     *   performanceMonitor.startScan((device : ergometer.DeviceInfo) : boolean => {
     *      //return true when you want to connect to the device
     *       return device.name=='My device name';
     *   });
     *  to connect at at a later time
     *    performanceMonitor.connectToDevice('my device name');
     *  the devices which where found during the scan are collected in
     *    performanceMonitor.devices
     *  when you connect to a device the scan is stopped, when you want to stop the scan earlier you need to call
     *    performanceMonitor.stopScan
     *
     */
    class PerformanceMonitorBase extends MonitorBase {
        private _waitResonseBuffers;
        protected _powerCurve: number[];
        protected _splitCommandsWhenToBig: boolean;
        protected _receivePartialBuffers: boolean;
        private _powerCurveEvent;
        private _checksumCheckEnabled;
        protected _commandTimeout: number;
        sortCommands: boolean;
        private _sendBufferQueue;
        protected initialize(): void;
        removeResponseBuffer(buffer: WaitResponseBuffer): void;
        protected enableDisableNotification(): Promise<void>;
        /**
         * returns error and other log information. Some errors can only be received using the logEvent
         * @returns {pubSub.Event<LogEvent>}
         */
        get powerCurveEvent(): pubSub.Event<ergometer.PowerCurveEvent>;
        get powerCurve(): number[];
        protected clearAllBuffers(): void;
        protected beforeConnected(): void;
        protected clearWaitResponseBuffers(): void;
        protected driver_write(data: ArrayBufferView): Promise<void>;
        /**
         *  send everyt thing which is put into the csave buffer
         *
         * @param success
         * @param error
         * @returns {Promise<void>|Promise} use promis instead of success and error function
         */
        sendCSafeBuffer(csafeBuffer: ergometer.csafe.IBuffer): Promise<void>;
        protected checkSendBufferAtEnd(): void;
        protected checkSendBuffer(): void;
        protected sendBufferFromQueue(sendData: SendBufferQueued): void;
        protected sendCsafeCommands(byteArray: number[], extended?: {
            sourceAddress: number;
            destinationAddress: number;
        }): Promise<void>;
        protected moveToNextBuffer(): WaitResponseBuffer;
        handeReceivedDriverData(dataView: DataView): void;
        protected getPacketSize(): number;
        newCsafeBuffer(): ergometer.csafe.IBuffer;
    }
}
/**
 * Concept 2 ergometer Performance Monitor api for Cordova
 *
 * This will will work with the PM5
 *
 * Created by tijmen on 01-06-15.
 * License:
 *
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
declare namespace ergometer {
    class UsbDevice {
        /** @internal */
        _internalDevice?: usb.IDevice;
        vendorId: number;
        productId: number;
        productName: string;
        serialNumber: string;
    }
    type UsbDevices = UsbDevice[];
    interface StrokeStateChangedEvent extends pubSub.ISubscription {
        (oldState: StrokeState, newState: StrokeState, duration: number): void;
    }
    interface TrainingDataEvent extends pubSub.ISubscription {
        (data: TrainingData): void;
    }
    interface StrokeDataEvent extends pubSub.ISubscription {
        (data: StrokeData): void;
    }
    class StrokeData {
        dragFactor: number;
        workDistance: number;
        workTime: number;
        splitTime: number;
        power: number;
        strokesPerMinuteAverage: number;
        strokesPerMinute: number;
        distance: number;
        totCalories: number;
        caloriesPerHour: number;
        heartRate: number;
        strokeDistance: number;
        driveTime: number;
        strokeRecoveryTime: number;
        strokeCount: number;
    }
    class TrainingData {
        workoutType: WorkoutType;
        duration: number;
        distance: number;
        workoutState: WorkoutState;
        workoutIntervalCount: number;
        intervalType: IntervalType;
        restTime: number;
        endDistance: number;
        endDuration: number;
    }
    class PerformanceMonitorUsb extends PerformanceMonitorBase {
        private _driver;
        private _device;
        private _config;
        private _nSPMReads;
        private _nSPM;
        private _strokeStateEvent;
        private _trainingDataEvent;
        private _strokeDataEvent;
        private _strokeData;
        private _trainingData;
        private _strokeState;
        private _lastTrainingTime;
        private _lastLowResUpdate;
        get strokeData(): StrokeData;
        get trainingData(): TrainingData;
        get strokeState(): StrokeState;
        get device(): ergometer.usb.IDevice;
        get strokeStateEvent(): pubSub.Event<StrokeStateChangedEvent>;
        get trainingDataEvent(): pubSub.Event<TrainingDataEvent>;
        get strokeDataEvent(): pubSub.Event<StrokeDataEvent>;
        static canUseNodeHid(): boolean;
        static canUseWebHid(): boolean;
        static canUseCordovaHid(): boolean;
        static canUseUsb(): boolean;
        constructor(config?: usb.IDriverConfig[]);
        getDriverConfigs(): usb.IDriverConfig[];
        protected initialize(): void;
        private initDriver;
        private checkInitDriver;
        get driver(): ergometer.usb.IDriver;
        set driver(value: ergometer.usb.IDriver);
        protected driver_write(data: ArrayBufferView): Promise<void>;
        private receiveData;
        sendCSafeBuffer(csafeBuffer: ergometer.csafe.IBuffer): Promise<void>;
        requestDevics(): Promise<UsbDevices>;
        disconnect(): void;
        private disconnected;
        connectToDevice(device: UsbDevice): Promise<void>;
        protected getPacketSize(): number;
        protected highResolutionUpdate(): Promise<void>;
        private handlePowerCurve;
        protected connected(): void;
        private _autoUpdating;
        private listeningToEvents;
        protected autoUpdate(first?: boolean): void;
        protected isWaiting(): boolean;
        protected nextAutoUpdate(): void;
        protected update(): Promise<void>;
        private _startPhaseTime;
        protected calcStrokeStateDuration(): number;
        protected lowResolutionUpdate(): Promise<void>;
        protected newStrokeState(state: StrokeState): void;
        protected trainingDataUpdate(): Promise<void>;
        private resetStartRowing;
    }
}
/**
 * Concept 2 ergometer Performance Monitor api for Cordova
 *
 * This will will work with the PM5
 *
 * Created by tijmen on 01-06-15.
 * License:
 *
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 * Copyright 2016 Tijmen van Gulik (tijmen@vangulik.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
declare namespace ergometer {
    interface RowingGeneralStatusEvent extends pubSub.ISubscription {
        (data: RowingGeneralStatus): void;
    }
    interface RowingAdditionalStatus1Event extends pubSub.ISubscription {
        (data: RowingAdditionalStatus1): void;
    }
    interface RowingAdditionalStatus2Event extends pubSub.ISubscription {
        (data: RowingAdditionalStatus2): void;
    }
    interface RowingStrokeDataEvent extends pubSub.ISubscription {
        (data: RowingStrokeData): void;
    }
    interface RowingAdditionalStrokeDataEvent extends pubSub.ISubscription {
        (data: RowingAdditionalStrokeData): void;
    }
    interface RowingSplitIntervalDataEvent extends pubSub.ISubscription {
        (data: RowingSplitIntervalData): void;
    }
    interface RowingAdditionalSplitIntervalDataEvent extends pubSub.ISubscription {
        (data: RowingAdditionalSplitIntervalData): void;
    }
    interface WorkoutSummaryDataEvent extends pubSub.ISubscription {
        (data: WorkoutSummaryData): void;
    }
    interface AdditionalWorkoutSummaryDataEvent extends pubSub.ISubscription {
        (data: AdditionalWorkoutSummaryData): void;
    }
    interface AdditionalWorkoutSummaryData2Event extends pubSub.ISubscription {
        (data: AdditionalWorkoutSummaryData2): void;
    }
    interface HeartRateBeltInformationEvent extends pubSub.ISubscription {
        (data: HeartRateBeltInformation): void;
    }
    interface DeviceInfo {
        connected: boolean;
        name: string;
        address: string;
        quality: number;
        serial?: string;
        hardwareRevision?: string;
        firmwareRevision?: string;
        manufacturer?: string;
        _internalDevice: ble.IDevice;
    }
    /**
     *
     * Usage:
     *
     * Create this class to acess the performance data
     *   var performanceMonitor= new ergometer.PerformanceMonitor();
     *
     * after this connect to the events to get data
     *   performanceMonitor.rowingGeneralStatusEvent.sub(this,this.onRowingGeneralStatus);
     * On some android phones you can connect to a limited number of events. Use the multiplex property to overcome
     * this problem. When the multi plex mode is switched on the data send to the device can be a a bit different, see
     * the documentation in the properties You must set the multi plex property before connecting
     *   performanceMonitor.multiplex=true;
     *
     * to start the connection first start scanning for a device,
     * you should call when the cordova deviceready event is called (or later)
     *   performanceMonitor.startScan((device : ergometer.DeviceInfo) : boolean => {
     *      //return true when you want to connect to the device
     *       return device.name=='My device name';
     *   });
     *  to connect at at a later time
     *    performanceMonitor.connectToDevice('my device name');
     *  the devices which where found during the scan are collected in
     *    performanceMonitor.devices
     *  when you connect to a device the scan is stopped, when you want to stop the scan earlier you need to call
     *    performanceMonitor.stopScan
     *
     */
    class PerformanceMonitorBle extends PerformanceMonitorBase {
        private _driver;
        private _recordingDriver;
        private _replayDriver;
        private _rowingGeneralStatusEvent;
        private _rowingAdditionalStatus1Event;
        private _rowingAdditionalStatus2Event;
        private _rowingStrokeDataEvent;
        private _rowingAdditionalStrokeDataEvent;
        private _rowingSplitIntervalDataEvent;
        private _rowingAdditionalSplitIntervalDataEvent;
        private _workoutSummaryDataEvent;
        private _additionalWorkoutSummaryDataEvent;
        private _additionalWorkoutSummaryData2Event;
        private _heartRateBeltInformationEvent;
        private _deviceInfo;
        private _rowingGeneralStatus;
        private _rowingAdditionalStatus1;
        private _rowingAdditionalStatus2;
        private _rowingStrokeData;
        private _rowingAdditionalStrokeData;
        private _rowingSplitIntervalData;
        private _rowingAdditionalSplitIntervalData;
        private _workoutSummaryData;
        private _additionalWorkoutSummaryData;
        private _additionalWorkoutSummaryData2;
        private _heartRateBeltInformation;
        private _devices;
        private _multiplex;
        private _multiplexSubscribeCount;
        private _sampleRate;
        private _autoReConnect;
        private _generalStatusEventAttachedByPowerCurve;
        private _recording;
        protected get recordingDriver(): ergometer.ble.RecordingDriver;
        set driver(value: ble.IDriver);
        get recording(): boolean;
        set recording(value: boolean);
        get replayDriver(): ble.ReplayDriver;
        get replaying(): boolean;
        replay(events: ble.IRecordingItem[]): void;
        set replaying(value: boolean);
        get recordingEvents(): ble.IRecordingItem[];
        set recordingEvents(value: ble.IRecordingItem[]);
        get driver(): ergometer.ble.IDriver;
        /**
         * when the connection is lost re-connect
         * @returns {boolean}
         */
        get autoReConnect(): boolean;
        /**
         *
         * when the connection is lost re-connect
         * @param value
         */
        set autoReConnect(value: boolean);
        /**
         * On some android phones you can connect to a limited number of events. Use the multiplex property to overcome
         * this problem. When the multi plex mode is switched on the data send to the device can be a a bit different, see
         * the documentation in the properties You must set the multi plex property before connecting
         *
         * @returns {boolean}
         */
        get multiplex(): boolean;
        /**
         * On some android phones you can connect to a limited number of events. Use the multiplex property to overcome
         * this problem. When the multi plex mode is switched on the data send to the device can be a a bit different, see
         * the documentation in the properties You must set the multi plex property before connecting
         * @param value
         */
        set multiplex(value: boolean);
        /**
         * an array of of performance monitor devices which where found during the scan.
         * the array is sorted by connection quality (best on top)
         *
         * @returns {DeviceInfo[]}
         */
        get devices(): ergometer.DeviceInfo[];
        /**
         * The values of the last rowingGeneralStatus event
         *
         * @returns {RowingGeneralStatus}
         */
        get rowingGeneralStatus(): RowingGeneralStatus;
        /**
         * The values of the last rowingAdditionalStatus1 event
         * @returns {RowingAdditionalStatus1}
         */
        get rowingAdditionalStatus1(): RowingAdditionalStatus1;
        /**
         * The values of the last RowingAdditionalStatus2 event
         * @returns {RowingAdditionalStatus2}
         */
        get rowingAdditionalStatus2(): RowingAdditionalStatus2;
        /**
         *  The values of the last rowingStrokeData event
         * @returns {RowingStrokeData}
         */
        get rowingStrokeData(): RowingStrokeData;
        /**
         * The values of the last rowingAdditionalStrokeData event
         * @returns {RowingAdditionalStrokeData}
         */
        get rowingAdditionalStrokeData(): RowingAdditionalStrokeData;
        /**
         * The values of the last rowingSplitIntervalData event
         * @returns {RowingSplitIntervalData}
         */
        get rowingSplitIntervalData(): RowingSplitIntervalData;
        /**
         * The values of the last rowingAdditionalSplitIntervalData event
         * @returns {RowingAdditionalSplitIntervalData}
         */
        get rowingAdditionalSplitIntervalData(): RowingAdditionalSplitIntervalData;
        /**
         * The values of the last workoutSummaryData event
         * @returns {WorkoutSummaryData}
         */
        get workoutSummaryData(): WorkoutSummaryData;
        /**
         * The values of the last additionalWorkoutSummaryData event
         * @returns {AdditionalWorkoutSummaryData}
         */
        get additionalWorkoutSummaryData(): AdditionalWorkoutSummaryData;
        /**
         * The values of the last AdditionalWorkoutSummaryData2 event
         * @returns {AdditionalWorkoutSummaryData2}
         */
        get additionalWorkoutSummaryData2(): AdditionalWorkoutSummaryData2;
        /**
         * The values of the last heartRateBeltInformation event
         * @returns {HeartRateBeltInformation}
         */
        get heartRateBeltInformation(): HeartRateBeltInformation;
        /**
         * read rowingGeneralStatus data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<RowingGeneralStatusEvent>}
         */
        get rowingGeneralStatusEvent(): pubSub.Event<RowingGeneralStatusEvent>;
        /**
         * read rowingGeneralStatus1 data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<RowingAdditionalStatus1Event>}
         */
        get rowingAdditionalStatus1Event(): pubSub.Event<RowingAdditionalStatus1Event>;
        /**
         * read rowingAdditionalStatus2 data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<RowingAdditionalStatus2Event>}
         */
        get rowingAdditionalStatus2Event(): pubSub.Event<RowingAdditionalStatus2Event>;
        /**
         * read rowingStrokeData data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<RowingStrokeDataEvent>}
         */
        get rowingStrokeDataEvent(): pubSub.Event<RowingStrokeDataEvent>;
        /**
         * read rowingAdditionalStrokeData data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<RowingAdditionalStrokeDataEvent>}
         */
        get rowingAdditionalStrokeDataEvent(): pubSub.Event<RowingAdditionalStrokeDataEvent>;
        /**
         * read rowingSplitIntervalDat data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<RowingSplitIntervalDataEvent>}
         */
        get rowingSplitIntervalDataEvent(): pubSub.Event<RowingSplitIntervalDataEvent>;
        /**
         * read rowingAdditionalSplitIntervalData data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<RowingAdditionalSplitIntervalDataEvent>}
         */
        get rowingAdditionalSplitIntervalDataEvent(): pubSub.Event<RowingAdditionalSplitIntervalDataEvent>;
        /**
         * read workoutSummaryData data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<WorkoutSummaryDataEvent>}
         */
        get workoutSummaryDataEvent(): pubSub.Event<WorkoutSummaryDataEvent>;
        /**
         * read additionalWorkoutSummaryData data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<AdditionalWorkoutSummaryDataEvent>}
         */
        get additionalWorkoutSummaryDataEvent(): pubSub.Event<AdditionalWorkoutSummaryDataEvent>;
        /**
         * read additionalWorkoutSummaryData2 data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<AdditionalWorkoutSummaryData2Event>}
         */
        get additionalWorkoutSummaryData2Event(): pubSub.Event<AdditionalWorkoutSummaryData2Event>;
        /**
         * read heartRateBeltInformation data
         * connect to the using .sub(this,myFunction)
         * @returns {pubSub.Event<HeartRateBeltInformationEvent>}
         */
        get heartRateBeltInformationEvent(): pubSub.Event<HeartRateBeltInformationEvent>;
        /**
         * Get device information of the connected device.
         * @returns {DeviceInfo}
         */
        get deviceInfo(): ergometer.DeviceInfo;
        /**
         * read the performance montitor sample rate. By default this is 500 ms
         * @returns {number}
         */
        get sampleRate(): SampleRate;
        /**
         * Change the performance monitor sample rate.
         * @param value
         */
        set sampleRate(value: SampleRate);
        /**
         * disconnect the current connected device
         */
        disconnect(): void;
        protected clearAllBuffers(): void;
        /**
         *
         */
        protected enableMultiplexNotification(): Promise<void>;
        /**
         *
         */
        protected disableMultiPlexNotification(): Promise<void>;
        private _registeredGuids;
        protected clearRegisterdGuids(): void;
        protected enableNotification(serviceUIID: string, characteristicUUID: string, receive: (data: ArrayBuffer) => void): Promise<void>;
        protected disableNotification(serviceUIID: string, characteristicUUID: string): Promise<void>;
        /**
         *
         */
        protected enableDisableNotification(): Promise<void>;
        protected onPowerCurveRowingGeneralStatus(data: ergometer.RowingGeneralStatus): void;
        currentDriverIsWebBlueTooth(): boolean;
        protected initDriver(): void;
        protected checkInitDriver(): void;
        /**
         *
         */
        protected initialize(): void;
        /**
         * When low level initialization complete, this function is called.
         */
        /**
         *
         * @param device
         */
        protected removeDevice(device: DeviceInfo): void;
        /**
         *
         * @param device
         */
        addDevice(device: DeviceInfo): void;
        /**
         *
         * @param name
         * @returns {DeviceInfo}
         */
        protected findDevice(name: string): DeviceInfo;
        /**
         *
         */
        stopScan(): void;
        /**
         * Scan for device use the deviceFound to connect .
         * @param deviceFound
         */
        startScan(deviceFound: (device: DeviceInfo) => boolean, errorFn?: ErrorHandler): Promise<void>;
        /**
         * connect to a specific device. This should be a PM5 device which is found by the startScan. You can
         * only call this function after startScan is called. Connection to a device will stop the scan.
         * @param deviceName
         */
        connectToDevice(deviceName: string): Promise<void>;
        /**
         * the promise is never fail
         * @param serviceUUID
         * @param UUID
         * @param readValue
         */
        protected readStringCharacteristic(serviceUUID: string, UUID: string): Promise<string>;
        /**
         * the promise will never fail
         * @param done
         */
        protected readSampleRate(): Promise<void>;
        /**
         *
         * @param done
         */
        protected readPheripheralInfo(): Promise<void>;
        /**
         *
         * @param data
         */
        protected handleRowingGeneralStatus(data: DataView): void;
        protected calcPace(lowByte: any, highByte: number): number;
        /**
         *
         * @param data
         */
        protected handleRowingAdditionalStatus1(data: DataView): void;
        /**
         *
         * @param data
         */
        protected handleRowingAdditionalStatus2(data: DataView): void;
        /**
         *
         * @param data
         */
        protected handleRowingStrokeData(data: DataView): void;
        /**
         *
         * @param data
         */
        protected handleRowingAdditionalStrokeData(data: DataView): void;
        /**
         *
         * @param data
         */
        protected handleRowingSplitIntervalData(data: DataView): void;
        /**
         *
         * @param data
         */
        protected handleRowingAdditionalSplitIntervalData(data: DataView): void;
        /**
         *
         * @param data
         */
        protected handleWorkoutSummaryData(data: DataView): void;
        /**
         *
         * @param data
         */
        protected handleAdditionalWorkoutSummaryData(data: DataView): void;
        /**
         *
         * @param data
         */
        protected handleAdditionalWorkoutSummaryData2(data: DataView): void;
        /**
         *
         * @param data
         */
        protected handleHeartRateBeltInformation(data: DataView): void;
        /**
         *
         * @internal
         */
        protected deviceConnected(): void;
        handleCSafeNotifications(): Promise<void>;
        /**
         *
         * @param data
         */
        protected handleDataCallbackMulti(data: ArrayBuffer): void;
        /**
         *
         * @param data
         * @param func
         */
        protected handleDataCallback(data: ArrayBuffer, func: (data: DataView) => void): void;
        protected driver_write(data: ArrayBufferView): Promise<void>;
        protected getPacketSize(): number;
    }
}
declare namespace ergometer {
    interface HeartRateDeviceInfo {
        connected: boolean;
        name: string;
        address: string;
        quality: number;
        /** @internal */
        _internalDevice: ble.IDevice;
    }
    interface HeartRateData {
        heartRate?: number;
        rrIntervals?: number[];
        energyExpended?: number;
        contactDetected?: boolean;
    }
    interface HeartRateDataEvent extends pubSub.ISubscription {
        (data: HeartRateData): void;
    }
    class HeartRateMonitorBle extends MonitorBase {
        private _driver;
        private _deviceInfo;
        private _devices;
        private _heartRateDataEvent;
        get driver(): ergometer.ble.IDriver;
        get heartRateDataEvent(): pubSub.Event<HeartRateDataEvent>;
        protected initialize(): void;
        private checkInitDriver;
        private initDriver;
        disconnect(): void;
        get deviceInfo(): ergometer.HeartRateDeviceInfo;
        private _registeredGuids;
        currentDriverIsWebBlueTooth(): boolean;
        /**
                *
                * @param device
                */
        protected removeDevice(device: DeviceInfo): void;
        /**
         *
         * @param device
         */
        protected addDevice(device: DeviceInfo): void;
        /**
         *
         * @param name
         * @returns {DeviceInfo}
         */
        protected findDevice(name: string): DeviceInfo;
        /**
         *
         */
        stopScan(): void;
        /**
         * Scan for device use the deviceFound to connect .
         * @param deviceFound
         */
        startScan(deviceFound: (device: HeartRateDeviceInfo) => boolean, errorFn?: ErrorHandler): Promise<void>;
        /**
         * connect to a specific device. This should be a PM5 device which is found by the startScan. You can
         * only call this function after startScan is called. Connection to a device will stop the scan.
         * @param deviceName
         */
        connectToDevice(deviceName: string): Promise<void>;
        protected deviceConnected(): void;
        protected handleDataHeartRate(data: ArrayBuffer): void;
    }
}

export { ergometer };
