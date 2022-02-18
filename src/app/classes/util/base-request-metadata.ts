import { Device } from '@ionic-native/device/ngx';

export class BaseRequestMetadata {
    accuracy: number;
    deviceInfo: string;
    latutide: number;
    longitude: number;
    timeZoneId: number;
    userId: number;
    
    private device: Device = new Device();

    constructor(){
        this.deviceInfo = this.device.platform + '; ' + this.device.model + '; ' + this.device.serial;
        this.userId = 1;
        this.timeZoneId = 1;
    }
}
