import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../bid/services/storage.service';
import { Device } from '@ionic-native/device/ngx';

@Injectable({
    providedIn: 'root'
})

export class OtpService {

    constructor(private http: HttpClient, private storage: StorageService, private device: Device) { }

    sendOtp(cel: number, email: string, token: string, operationId: number, userId: number){

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        });

        return this.http.post(environment.servicesURL + environment.otpGenerate, JSON.stringify(this.createJsonOtpGen(cel, email, operationId, userId)), {headers});

    }

    createJsonOtpGen(cel, email, operationId, userId) {

        const jsonOtpGen = {
            operationId: operationId,
            data: {
                sms: true,
                number: cel,
                email: true,
                to: [email]
            },
            metadata: {
                accuracy: 1,
                deviceInfo: this.device.platform + ' ' + this.device.version + ' - ' + this.device.model + ' - ' +this.device.manufacturer,
                latitude: -90,
                longitude: 19,
                timeZoneId: 1,
                userId: userId
            }
        }

        console.log(JSON.stringify(jsonOtpGen));
        return(jsonOtpGen);

    }

    validateOtp(codigo: number, token: string, operationId: number, userId: number){

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        });

        return this.http.post(environment.servicesURL + environment.otpValidate, JSON.stringify(this.createJsonOtpVal(codigo, operationId, userId)), {headers});

    }

    createJsonOtpVal(codigo, operationId, userId){

        const jsonOtpVal = {
            operationId: operationId,
            data: {
                code: codigo
            },
            metadata: {
                accuracy: 1,
                deviceInfo: this.device.platform + ' ' + this.device.version + ' - ' + this.device.model + ' - ' +this.device.manufacturer,
                latitude: -90,
                longitude: 19,
                timeZoneId: 1,
                userId: userId
            }
        }

        console.log('Json Otp Validate', JSON.stringify(jsonOtpVal));
        return jsonOtpVal;

    }

}