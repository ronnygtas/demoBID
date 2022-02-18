import { Injectable } from '@angular/core';
import { ServicesExService } from '../../bid/services/services-ex.service';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private serv: ServicesExService,
              private http: HttpClient) { }

  public userPassLogin(token: string, usuario: string, contrasena: string): Observable<any>{
    const headers = {headers: new HttpHeaders().set('authorization', 'Bearer ' + token).set('Content-Type','application/json')};
    const params = '{"data": {"user": "' + usuario + '","password": "' + contrasena + '"}}';
    console.log('Params Login', params);
    return this.serv.post(environment.servicesURL + environment.loginService, params, headers);
  }

  public userFingerLogin(token: string, userName: any, finger: any) {

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.servicesURL + environment.loginService, JSON.stringify(this.createJFingersLogin(userName, finger)), {headers});

  }

  createJFingersLogin(userName: any, finger: any) {
    const request = {
      data: {
        user: userName,
        fingerPrint: finger
    }
    };

    // console.log('REQUEST LOGIN FINGER   ', JSON.stringify(request));
    return request;
  }

  public fingerLogin(){
    // no implementado
  }
}
