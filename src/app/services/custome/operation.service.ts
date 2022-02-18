import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  latitud: any;
  longitud: any;

  constructor(private http: HttpClient,
              public geolocation: Geolocation,) { }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      this.setLatitud(geoposition.coords.latitude);
      this.setLongitud(geoposition.coords.longitude);
    });
  }

  public getLatitud(): any{
        return this.latitud;
  }

  public setLatitud(latitud: any): void {
      this.latitud = latitud;
  }

  public getLongitud(): any {
      return this.longitud;
  }

  public setLongitud(longitud: any): void {
      this.longitud = longitud;
  }
  

  generateOpId(token: any, user: any) {
    
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.operation_create, JSON.stringify(this.createJ(user)), { headers });
    
  }

  createJ(user: any) {
    const request = {
      data: {
        personId: user,
        productId: 1,
        activityStatus: 'PENDIENTE',
        activityValue: 1,
        data: '',
        secuence: 1,
        workflowId: 1
      },
      metadata: {
        latutide: 0,
        longitude: 0,
        timeZoneId: 1,
        userId: 1
      }
    };
    // console.log('REQUES OP_ID', JSON.stringify(request));
    return request;
  }

  public generateOpIdNoPerson(token: any, user: any) {
    
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.servicesURL + environment.operation_create, JSON.stringify(this.createJNoPerson(user)), { headers });
    
  }

  createJNoPerson(user: any) {
    const request = {
      data: {
        productId: 1,
        activityStatus: 'PENDIENTE',
        activityValue: 1,
        data: '',
        secuence: 1,
        workflowId: 1
      },
      metadata: {
        latutide: 0,
        longitude: 0,
        timeZoneId: 1,
        userId: user
      }
    };
    // console.log('REQUES OP_ID', JSON.stringify(request));
    return request;
  }

  opIdWhitPerson(token: any, personId: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.operation_create, JSON.stringify(this.createJ(personId)), { headers });

  }

  createJWhitPerson(personId: any) {
    const request = {
      data: {
        personId: personId,
        activityStatus: 'PENDIENTE',
        activityValue: '',
        code: 'WEFRWEFEW',
        data: '',
        productId: 1,
        secuence: 1,
        workflowId: 1
      },
      metadata: {
        accuracy: 0,
        deviceInfo: 'computer',
        latutide: 0,
        longitude: 0,
        timeZoneId: 1,
        userId: 1
      }
    };

    return request;

  }

}
